import type { AlertSignal } from "@prisma/client";

export type AlertNotificationPayload = {
  alertId: string;
  ticker: string;
  signal: AlertSignal;
  candleDate: Date;
  createdAt: Date;
};

export type WatchlistReportPayload = {
  scannedAt: string;
  cadence: "daily";
  tickersScanned: number;
  alertsCreated: number;
  alertsSuppressed: number;
  tickerResults: Array<{
    ticker: string;
    checkedCandleDate: string | null;
    currentSignal: {
      signal: AlertSignal;
      signalDate: string;
      overallSignalDate: string;
      macdSignalDate: string;
    } | null;
    runStatus: string;
    runReason: string;
  }>;
};

export type AlertNotifier = {
  channel: string;
  send(payload: AlertNotificationPayload): Promise<{ message?: string }>;
};

export type WatchlistReportNotifier = {
  channel: string;
  send(payload: WatchlistReportPayload): Promise<{ message?: string }>;
};

class ConsoleAlertNotifier implements AlertNotifier {
  channel = "console";

  async send(payload: AlertNotificationPayload) {
    const candleDate = payload.candleDate.toISOString().slice(0, 10);
    const message = `[WATCHLIST ALERT] ${payload.signal} ${payload.ticker} on ${candleDate}`;

    console.log(message);

    return { message };
  }
}

class ConsoleWatchlistReportNotifier implements WatchlistReportNotifier {
  channel = "console";

  async send(payload: WatchlistReportPayload) {
    const lines = payload.tickerResults.map((tickerResult) => {
      const signal = tickerResult.currentSignal
        ? `${tickerResult.currentSignal.signal} (${tickerResult.currentSignal.signalDate})`
        : "none";

      return `${tickerResult.ticker}: current=${signal}; checked=${tickerResult.checkedCandleDate ?? "n/a"}; status=${tickerResult.runStatus}`;
    });

    const message = [
      `[WATCHLIST REPORT] scannedAt=${payload.scannedAt} tickers=${payload.tickersScanned} alertsCreated=${payload.alertsCreated}`,
      ...lines,
    ].join("\n");

    console.log(message);

    return { message };
  }
}

export function getAlertNotifiers(): AlertNotifier[] {
  return [new ConsoleAlertNotifier()];
}

export function getWatchlistReportNotifiers(): WatchlistReportNotifier[] {
  return [new ConsoleWatchlistReportNotifier()];
}
