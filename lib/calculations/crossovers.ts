import type { ChartPoint, CrossoverPoint, LinePoint } from "@/lib/types/stock";

export function detectPriceMovingAverageCrossovers(
  priceSeries: ChartPoint[],
  movingAverageSeries: LinePoint[],
): CrossoverPoint[] {
  const crossovers: CrossoverPoint[] = [];

  for (let i = 1; i < priceSeries.length; i++) {
    const prevPrice = priceSeries[i - 1]?.close;
    const currPrice = priceSeries[i]?.close;

    const prevMa = movingAverageSeries[i - 1]?.value;
    const currMa = movingAverageSeries[i]?.value;

    if (
      prevPrice === undefined ||
      currPrice === undefined ||
      prevMa === null ||
      currMa === null ||
      prevMa === undefined ||
      currMa === undefined
    ) {
      continue;
    }

    const wasBelowOrEqual = prevPrice <= prevMa;
    const isAbove = currPrice > currMa;

    const wasAboveOrEqual = prevPrice >= prevMa;
    const isBelow = currPrice < currMa;

    if (wasBelowOrEqual && isAbove) {
      crossovers.push({
        date: priceSeries[i].date,
        price: currPrice,
        movingAverage: currMa,
        type: "bullish",
      });
    } else if (wasAboveOrEqual && isBelow) {
      crossovers.push({
        date: priceSeries[i].date,
        price: currPrice,
        movingAverage: currMa,
        type: "bearish",
      });
    }
  }

  return crossovers;
}
