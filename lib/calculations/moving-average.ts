import type { ChartPoint, LinePoint } from "@/lib/types/stock";

export function calculateSimpleMovingAverage(
  series: ChartPoint[],
  period: number,
): LinePoint[] {
  return series.map((point, index) => {
    if (index < period - 1) {
      return {
        date: point.date,
        value: null,
      };
    }

    const window = series.slice(index - period + 1, index + 1);
    const sum = window.reduce((acc, item) => acc + item.close, 0);

    return {
      date: point.date,
      value: sum / period,
    };
  });
}
