import { unstable_cache } from "next/cache";
import { buildTickerAnalysis } from "@/lib/analysis/ticker-analysis";

export function getDashboardData(ticker: string, range: string) {
  return unstable_cache(
    async () => {
      console.log(`[DASHBOARD] recomputing ${ticker} ${range}`);
      return buildTickerAnalysis(ticker, range);
    },
    [`dashboard:${ticker}:${range}`],
    {
      revalidate: 60,
      tags: [`dashboard:${ticker}`, `dashboard:${ticker}:${range}`],
    },
  )();
}
