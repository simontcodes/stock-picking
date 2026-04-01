export function getOutputSizeForRange(range: string): number {
  switch (range) {
    case "3m":
      return 65;
    case "6m":
      return 130;
    case "1y":
      return 252;
    case "3y":
      return 756;
    case "5y":
      return 1260;
    default:
      return 252;
  }
}
