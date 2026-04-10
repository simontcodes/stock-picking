export type WatchlistAlertScanResponse = {
  success: boolean;
  data?: {
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
      signal: "BUY" | "SELL";
      candleDate: string;
    }>;
    tickerResults: Array<{
      ticker: string;
      checkedCandleDate: string | null;
      currentSignal: {
        signal: "BUY" | "SELL";
        signalDate: string;
        overallSignalDate: string;
        macdSignalDate: string;
        overallCrossoverType: "bullish" | "bearish";
        macdCrossoverType: "bullish" | "bearish";
      } | null;
      runStatus:
        | "baseline_recorded"
        | "alert_created"
        | "duplicate_alert"
        | "no_change"
        | "no_signal_on_checked_candle"
        | "error";
      runSignal: {
        signal: "BUY" | "SELL";
        signalDate: string;
        overallSignalDate: string;
        macdSignalDate: string;
        overallCrossoverType: "bullish" | "bearish";
        macdCrossoverType: "bullish" | "bearish";
      } | null;
      runReason: string;
    }>;
    reportTriggered: boolean;
  };
  error?: string;
};

export async function triggerWatchlistReport() {
  const response = await fetch("/api/watchlist-alerts/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = (await response.json()) as WatchlistAlertScanResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.error || "Failed to trigger watchlist report.");
  }

  return json.data;
}
