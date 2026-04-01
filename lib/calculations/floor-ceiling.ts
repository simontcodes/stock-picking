import type { ChartPoint } from "@/lib/types/stock";

export function calculateFloorAndCeiling(series: ChartPoint[]) {
  if (!series.length) {
    return {
      floor: 0,
      ceiling: 0,
    };
  }

  const closes = series.map((item) => item.close);

  return {
    floor: Math.min(...closes),
    ceiling: Math.max(...closes),
  };
}
