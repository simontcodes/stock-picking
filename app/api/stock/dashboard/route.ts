import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  return NextResponse.json({
    ticker: ticker.toUpperCase(),
    companyName: "Apple Inc.",
    currentPrice: 211.45,
    signal: "HOLD",
    yearHigh: {
      value: 225.0,
      percentFromHigh: -6.02,
    },
    bestDayToBuy: "Tuesday",
    movingAverage: 205.8,
    stopLoss: 200.88,
    positionSize: 1000,
    maxLoss: 50,
    performance: {
      today: 0.84,
      previousDay: -0.22,
      fiveDays: 1.91,
      thirtyDays: 4.7,
      sixtyDays: 7.2,
      oneYear: 18.3,
    },
    chart: [
      { date: "2026-03-10", close: 201 },
      { date: "2026-03-11", close: 203 },
      { date: "2026-03-12", close: 202 },
      { date: "2026-03-13", close: 206 },
      { date: "2026-03-14", close: 208 },
      { date: "2026-03-15", close: 211.45 },
    ],
    metrics: {
      volume: 54000000,
      avgVolume: 49000000,
      rsi: 56.4,
      macd: 1.18,
    },
    score: {
      total: 78,
      growth: 80,
      quality: 76,
      valuation: 65,
      momentum: 88,
    },
  });
}
