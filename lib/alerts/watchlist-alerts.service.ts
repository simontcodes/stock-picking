import {
  AlertDeliveryStatus,
  AlertSignal,
  Prisma,
  type WatchlistAlert,
  type WatchlistSignalState,
} from "@prisma/client";
import { buildTickerAnalysis } from "@/lib/analysis/ticker-analysis";
import { prisma } from "@/lib/db/prisma";
import {
  getAlertNotifiers,
  getWatchlistReportNotifiers,
  type AlertNotificationPayload,
  type WatchlistReportPayload,
} from "@/lib/alerts/notifiers";
import { getEnabledDefaultWatchlistTickers } from "@/lib/watchlist/watchlist.service";
import type {
  CrossoverPoint,
  CrossoverType,
  DashboardResponse,
  MacdCrossoverPoint,
} from "@/lib/types/stock";

const WATCHLIST_SCAN_RANGE = "1y";

type AlertCandidate = {
  ticker: string;
  signal: AlertSignal;
  candleDate: Date;
  overallCrossoverType: "bullish" | "bearish";
  macdCrossoverType: "bullish" | "bearish";
  overallCrossoverAt: Date;
  macdCrossoverAt: Date;
};

export type ConfirmedSignalSnapshot = {
  signal: AlertSignal;
  signalDate: string;
  overallSignalDate: string;
  macdSignalDate: string;
  overallCrossoverType: CrossoverType;
  macdCrossoverType: CrossoverType;
};

export type TickerScanResult = {
  ticker: string;
  checkedCandleDate: string | null;
  currentSignal: ConfirmedSignalSnapshot | null;
  runStatus:
    | "baseline_recorded"
    | "alert_created"
    | "duplicate_alert"
    | "no_change"
    | "no_signal_on_checked_candle"
    | "error";
  runSignal: ConfirmedSignalSnapshot | null;
  runReason: string;
};

export type WatchlistAlertScanResult = {
  scannedAt: string;
  cadence: "daily";
  tickersScanned: number;
  alertsCreated: number;
  alertsSuppressed: number;
  tickersWithoutSignal: string[];
  errors: Array<{
    ticker: string;
    error: string;
  }>;
  createdAlerts: Array<{
    ticker: string;
    signal: AlertSignal;
    candleDate: string;
  }>;
  tickerResults: TickerScanResult[];
  reportTriggered: boolean;
};

export type ScanWatchlistOptions = {
  sendReport?: boolean;
};

function toCandleDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  return new Date(value);
}

function findCrossoverByDate(
  crossovers: CrossoverPoint[] | MacdCrossoverPoint[],
  date: string,
) {
  return crossovers.find((point) => point.date === date) ?? null;
}

function toSignalSnapshot(
  overall: CrossoverPoint,
  macd: MacdCrossoverPoint,
): ConfirmedSignalSnapshot {
  const signalDate =
    new Date(overall.date) > new Date(macd.date) ? overall.date : macd.date;

  return {
    signal: overall.type === "bullish" ? AlertSignal.BUY : AlertSignal.SELL,
    signalDate,
    overallSignalDate: overall.date,
    macdSignalDate: macd.date,
    overallCrossoverType: overall.type,
    macdCrossoverType: macd.type,
  };
}

function getCurrentConfirmedSignal(
  analysis: DashboardResponse,
): ConfirmedSignalSnapshot | null {
  const overall = analysis.overallChart.crossovers.at(-1);
  const macd = analysis.macdChart.crossovers.at(-1);

  if (!overall || !macd) {
    return null;
  }

  if (overall.type !== macd.type) {
    return null;
  }

  return toSignalSnapshot(overall, macd);
}

function getRunSignalForLatestCandle(
  analysis: DashboardResponse,
): {
  checkedCandleDate: string | null;
  runSignal: ConfirmedSignalSnapshot | null;
  runReason: string;
} {
  const checkedCandleDate = analysis.overallChart.priceSeries.at(-1)?.date ?? null;

  if (!checkedCandleDate) {
    return {
      checkedCandleDate: null,
      runSignal: null,
      runReason: "No daily candles were available.",
    };
  }

  const overall = findCrossoverByDate(
    analysis.overallChart.crossovers,
    checkedCandleDate,
  );
  const macd = findCrossoverByDate(
    analysis.macdChart.crossovers,
    checkedCandleDate,
  );

  if (!overall && !macd) {
    return {
      checkedCandleDate,
      runSignal: null,
      runReason:
        "No new crossover occurred on the checked daily candle. Any current signal comes from earlier crossover dates.",
    };
  }

  if (!overall) {
    return {
      checkedCandleDate,
      runSignal: null,
      runReason:
        "MACD crossed on the checked candle, but the overall indicator did not, so no new confirmed signal was formed today.",
    };
  }

  if (!macd) {
    return {
      checkedCandleDate,
      runSignal: null,
      runReason:
        "The overall indicator crossed on the checked candle, but MACD did not, so no new confirmed signal was formed today.",
    };
  }

  if (overall.type !== macd.type) {
    return {
      checkedCandleDate,
      runSignal: null,
      runReason:
        "Both indicators crossed on the checked candle, but they disagreed on direction, so no new confirmed signal was formed today.",
    };
  }

  return {
    checkedCandleDate,
    runSignal: toSignalSnapshot(overall, macd),
    runReason: "A confirmed signal was detected on the checked daily candle.",
  };
}

function deriveAlertCandidate(
  ticker: string,
  currentSignal: ConfirmedSignalSnapshot,
): AlertCandidate {
  return {
    ticker,
    signal: currentSignal.signal,
    candleDate: toCandleDate(currentSignal.signalDate),
    overallCrossoverType: currentSignal.overallCrossoverType,
    macdCrossoverType: currentSignal.macdCrossoverType,
    overallCrossoverAt: toCandleDate(currentSignal.overallSignalDate),
    macdCrossoverAt: toCandleDate(currentSignal.macdSignalDate),
  };
}

function signalChanged(
  previousState: WatchlistSignalState | undefined,
  currentSignal: ConfirmedSignalSnapshot | null,
) {
  if (!previousState || !currentSignal) {
    return false;
  }

  return previousState.signal !== currentSignal.signal;
}

async function upsertSignalState(
  ticker: string,
  currentSignal: ConfirmedSignalSnapshot,
) {
  return prisma.watchlistSignalState.upsert({
    where: { ticker },
    update: {
      signal: currentSignal.signal,
      signalDate: toCandleDate(currentSignal.signalDate),
      overallSignalDate: toCandleDate(currentSignal.overallSignalDate),
      macdSignalDate: toCandleDate(currentSignal.macdSignalDate),
      overallCrossoverType: currentSignal.overallCrossoverType,
      macdCrossoverType: currentSignal.macdCrossoverType,
    },
    create: {
      ticker,
      signal: currentSignal.signal,
      signalDate: toCandleDate(currentSignal.signalDate),
      overallSignalDate: toCandleDate(currentSignal.overallSignalDate),
      macdSignalDate: toCandleDate(currentSignal.macdSignalDate),
      overallCrossoverType: currentSignal.overallCrossoverType,
      macdCrossoverType: currentSignal.macdCrossoverType,
    },
  });
}

async function notifyAlert(alert: WatchlistAlert) {
  const notifiers = getAlertNotifiers();
  const payload: AlertNotificationPayload = {
    alertId: alert.id,
    ticker: alert.ticker,
    signal: alert.signal,
    candleDate: alert.candleDate,
    createdAt: alert.createdAt,
  };

  const results = await Promise.allSettled(
    notifiers.map(async (notifier) => {
      try {
        const response = await notifier.send(payload);

        await prisma.alertNotification.create({
          data: {
            alertId: alert.id,
            channel: notifier.channel,
            status: AlertDeliveryStatus.SENT,
            message: response.message,
          },
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        await prisma.alertNotification.create({
          data: {
            alertId: alert.id,
            channel: notifier.channel,
            status: AlertDeliveryStatus.FAILED,
            error: errorMessage,
          },
        });

        throw error;
      }
    }),
  );

  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failures.length > 0) {
    const errorMessage = failures
      .map((failure) =>
        failure.reason instanceof Error
          ? failure.reason.message
          : String(failure.reason),
      )
      .join("; ");

    await prisma.watchlistAlert.update({
      where: { id: alert.id },
      data: {
        notificationStatus: AlertDeliveryStatus.FAILED,
        notificationAttempts: {
          increment: notifiers.length,
        },
        lastNotificationError: errorMessage,
      },
    });

    throw new Error(errorMessage);
  }

  await prisma.watchlistAlert.update({
    where: { id: alert.id },
    data: {
      notificationStatus: AlertDeliveryStatus.SENT,
      notificationAttempts: {
        increment: notifiers.length,
      },
      lastNotifiedAt: new Date(),
      lastNotificationError: null,
    },
  });
}

async function createAlert(candidate: AlertCandidate): Promise<WatchlistAlert | null> {
  const existing = await prisma.watchlistAlert.findUnique({
    where: {
      ticker_signal_candleDate: {
        ticker: candidate.ticker,
        signal: candidate.signal,
        candleDate: candidate.candleDate,
      },
    },
  });

  if (existing) {
    return null;
  }

  try {
    return await prisma.watchlistAlert.create({
      data: candidate,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null;
    }

    throw error;
  }
}

function toReportPayload(result: WatchlistAlertScanResult): WatchlistReportPayload {
  return {
    scannedAt: result.scannedAt,
    cadence: result.cadence,
    tickersScanned: result.tickersScanned,
    alertsCreated: result.alertsCreated,
    alertsSuppressed: result.alertsSuppressed,
    tickerResults: result.tickerResults.map((tickerResult) => ({
      ticker: tickerResult.ticker,
      checkedCandleDate: tickerResult.checkedCandleDate,
      currentSignal: tickerResult.currentSignal
        ? {
            signal: tickerResult.currentSignal.signal,
            signalDate: tickerResult.currentSignal.signalDate,
            overallSignalDate: tickerResult.currentSignal.overallSignalDate,
            macdSignalDate: tickerResult.currentSignal.macdSignalDate,
          }
        : null,
      runStatus: tickerResult.runStatus,
      runReason: tickerResult.runReason,
    })),
  };
}

async function notifyWatchlistReport(result: WatchlistAlertScanResult) {
  const notifiers = getWatchlistReportNotifiers();
  const payload = toReportPayload(result);

  await Promise.all(notifiers.map((notifier) => notifier.send(payload)));
}

export async function scanWatchlistForAlerts(
  options: ScanWatchlistOptions = {},
): Promise<WatchlistAlertScanResult> {
  const tickers = await getEnabledDefaultWatchlistTickers();
  const existingStates = await prisma.watchlistSignalState.findMany({
    where: {
      ticker: {
        in: tickers,
      },
    },
  });
  const stateByTicker = new Map(existingStates.map((state) => [state.ticker, state]));

  const result: WatchlistAlertScanResult = {
    scannedAt: new Date().toISOString(),
    cadence: "daily",
    tickersScanned: tickers.length,
    alertsCreated: 0,
    alertsSuppressed: 0,
    tickersWithoutSignal: [],
    errors: [],
    createdAlerts: [],
    tickerResults: [],
    reportTriggered: Boolean(options.sendReport),
  };

  for (const ticker of tickers) {
    try {
      const analysis = await buildTickerAnalysis(ticker, WATCHLIST_SCAN_RANGE);
      const currentSignal = getCurrentConfirmedSignal(analysis);
      const runEvaluation = getRunSignalForLatestCandle(analysis);
      const previousState = stateByTicker.get(ticker);

      if (!currentSignal) {
        result.tickersWithoutSignal.push(ticker);
        result.tickerResults.push({
          ticker,
          checkedCandleDate: runEvaluation.checkedCandleDate,
          currentSignal: null,
          runStatus: "no_signal_on_checked_candle",
          runSignal: runEvaluation.runSignal,
          runReason:
            "No current confirmed BUY or SELL state was found from the latest overall and MACD crossover directions.",
        });
        continue;
      }

      await upsertSignalState(ticker, currentSignal);

      if (!previousState) {
        result.tickerResults.push({
          ticker,
          checkedCandleDate: runEvaluation.checkedCandleDate,
          currentSignal,
          runStatus: "baseline_recorded",
          runSignal: runEvaluation.runSignal,
          runReason:
            "The current confirmed signal was saved as the baseline state. No alert was sent because there was no previous known state to compare against.",
        });
        continue;
      }

      if (!signalChanged(previousState, currentSignal)) {
        result.tickerResults.push({
          ticker,
          checkedCandleDate: runEvaluation.checkedCandleDate,
          currentSignal,
          runStatus: "no_change",
          runSignal: runEvaluation.runSignal,
          runReason:
            "The current confirmed signal matches the last known stored state, so no alert was created.",
        });
        continue;
      }

      const candidate = deriveAlertCandidate(ticker, currentSignal);
      const alert = await createAlert(candidate);

      if (!alert) {
        result.alertsSuppressed += 1;
        result.tickerResults.push({
          ticker,
          checkedCandleDate: runEvaluation.checkedCandleDate,
          currentSignal,
          runStatus: "duplicate_alert",
          runSignal: runEvaluation.runSignal,
          runReason:
            "The signal changed, but an alert for this ticker, signal, and confirmation date already exists.",
        });
        continue;
      }

      await notifyAlert(alert);

      result.alertsCreated += 1;
      result.createdAlerts.push({
        ticker: alert.ticker,
        signal: alert.signal,
        candleDate: alert.candleDate.toISOString().slice(0, 10),
      });
      result.tickerResults.push({
        ticker,
        checkedCandleDate: runEvaluation.checkedCandleDate,
        currentSignal,
        runStatus: "alert_created",
        runSignal: runEvaluation.runSignal,
        runReason:
          "The current confirmed signal changed from the last known stored state, so a new alert was created.",
      });
    } catch (error) {
      result.errors.push({
        ticker,
        error: error instanceof Error ? error.message : "Unknown scan failure",
      });
      result.tickerResults.push({
        ticker,
        checkedCandleDate: null,
        currentSignal: null,
        runStatus: "error",
        runSignal: null,
        runReason:
          error instanceof Error ? error.message : "Unknown scan failure",
      });
    }
  }

  if (options.sendReport) {
    await notifyWatchlistReport(result);
  }

  return result;
}
