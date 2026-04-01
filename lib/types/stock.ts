export type SignalType = "BUY" | "SELL" | "HOLD";
export type CrossoverType = "bullish" | "bearish";

export type ChartPoint = {
  date: string;
  close: number;
  volume?: number;
};

export type LinePoint = {
  date: string;
  value: number | null;
};

export type CrossoverPoint = {
  date: string;
  price: number;
  movingAverage: number;
  type: CrossoverType;
};

export type DashboardResponse = {
  ticker: string;
  companyName: string;
  range: string;
  currentPrice: number;
  signal: SignalType;

  overallChart: {
    priceSeries: ChartPoint[];
    movingAverage30: LinePoint[];
    crossovers: CrossoverPoint[];
    floor: number;
    ceiling: number;
  };

  summary: {
    yearHigh: {
      value: number;
      percentFromHigh: number;
    };
    movingAverage: number;
    stopLoss: number;
    positionSize: number;
    maxLoss: number;
    bestDayToBuy: string;
  };

  performance: {
    today: number;
    previousDay: number;
    fiveDays: number;
    thirtyDays: number;
    sixtyDays: number;
    oneYear: number;
  };

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