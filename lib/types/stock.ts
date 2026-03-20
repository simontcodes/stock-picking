export type DashboardResponse = {
  ticker: string;
  companyName: string;
  currentPrice: number;
  signal: "BUY" | "SELL" | "HOLD";
  yearHigh: {
    value: number;
    percentFromHigh: number;
  };
  bestDayToBuy: string;
  movingAverage: number;
  stopLoss: number;
  positionSize: number;
  maxLoss: number;
  performance: {
    today: number;
    previousDay: number;
    fiveDays: number;
    thirtyDays: number;
    sixtyDays: number;
    oneYear: number;
  };
  chart: Array<{
    date: string;
    close: number;
  }>;
  metrics: {
    volume: number;
    avgVolume?: number;
    rsi?: number;
    macd?: number;
  };
  score: {
    total: number;
    growth: number;
    quality: number;
    valuation: number;
    momentum: number;
  };
};
