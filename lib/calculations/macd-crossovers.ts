import type { MacdCrossoverPoint, MacdPoint } from "@/lib/types/stock";

export function detectMacdCrossovers(
  series: MacdPoint[],
): MacdCrossoverPoint[] {
  const crossovers: MacdCrossoverPoint[] = [];

  for (let i = 1; i < series.length; i++) {
    const prevMacd = series[i - 1]?.macd;
    const currMacd = series[i]?.macd;

    const prevSignal = series[i - 1]?.signal;
    const currSignal = series[i]?.signal;

    if (
      prevMacd === null ||
      currMacd === null ||
      prevSignal === null ||
      currSignal === null ||
      prevMacd === undefined ||
      currMacd === undefined ||
      prevSignal === undefined ||
      currSignal === undefined
    ) {
      continue;
    }

    const wasBelowOrEqual = prevMacd <= prevSignal;
    const isAbove = currMacd > currSignal;

    const wasAboveOrEqual = prevMacd >= prevSignal;
    const isBelow = currMacd < currSignal;

    if (wasBelowOrEqual && isAbove) {
      crossovers.push({
        date: series[i].date,
        macd: currMacd,
        signal: currSignal,
        type: "bullish",
      });
    } else if (wasAboveOrEqual && isBelow) {
      crossovers.push({
        date: series[i].date,
        macd: currMacd,
        signal: currSignal,
        type: "bearish",
      });
    }
  }

  return crossovers;
}