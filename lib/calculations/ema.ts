export function calculateEma(
  values: Array<number | null>,
  period: number,
): Array<number | null> {
  const ema: Array<number | null> = new Array(values.length).fill(null);
  const multiplier = 2 / (period + 1);

  let seedStart = -1;

  for (let i = 0; i <= values.length - period; i++) {
    const window = values.slice(i, i + period);

    if (window.every((value) => value !== null)) {
      seedStart = i;
      break;
    }
  }

  if (seedStart === -1) {
    return ema;
  }

  const seedWindow = values.slice(seedStart, seedStart + period) as number[];
  const seedAverage =
    seedWindow.reduce((sum, value) => sum + value, 0) / period;

  const seedIndex = seedStart + period - 1;
  ema[seedIndex] = seedAverage;

  for (let i = seedIndex + 1; i < values.length; i++) {
    const currentValue = values[i];
    const previousEma = ema[i - 1];

    if (currentValue === null || previousEma === null) {
      ema[i] = null;
      continue;
    }

    ema[i] = currentValue * multiplier + previousEma * (1 - multiplier);
  }

  return ema;
}