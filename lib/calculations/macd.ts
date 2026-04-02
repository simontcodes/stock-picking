import { calculateEma } from "@/lib/calculations/ema";
import type { ChartPoint, MacdPoint } from "@/lib/types/stock";

export function calculateMacd(priceSeries: ChartPoint[]): MacdPoint[] {
  const closes = priceSeries.map((point) => point.close);

  const ema12 = calculateEma(closes, 12);
  const ema26 = calculateEma(closes, 26);

  const macdValues: Array<number | null> = closes.map((_, index) => {
    const fast = ema12[index];
    const slow = ema26[index];

    if (fast === null || slow === null) {
      return null;
    }

    return fast - slow;
  });

  const signalValues = calculateEma(macdValues, 9);

  return priceSeries.map((point, index) => ({
    date: point.date,
    macd: macdValues[index],
    signal: signalValues[index],
  }));
}