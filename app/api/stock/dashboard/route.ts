import { NextRequest, NextResponse } from "next/server";
import { getLatestPrice, getTimeSeries } from "@/lib/api/twelve-data";
import { calculateSimpleMovingAverage } from "@/lib/calculations/moving-average";
import { detectPriceMovingAverageCrossovers } from "@/lib/calculations/crossovers";
import { calculateFloorAndCeiling } from "@/lib/calculations/floor-ceiling";
import { getOutputSizeForRange } from "@/lib/calculations/date-range";
import type {
  ChartPoint,
  DashboardResponse,
  SignalType,
} from "@/lib/types/stock";

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, n) => sum + n, 0) / values.length;
}

function percentChange(current: number, previous: number) {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

function getSignal(currentPrice: number, movingAverage: number): SignalType {
  if (currentPrice > movingAverage) return "BUY";
  if (currentPrice < movingAverage) return "SELL";
  return "HOLD";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.toUpperCase();
    const range = searchParams.get("range") ?? "1y";

    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker is required" },
        { status: 400 },
      );
    }

    const outputsize = getOutputSizeForRange(range);

    const [priceData, seriesData] = await Promise.all([
      getLatestPrice(ticker),
      getTimeSeries(ticker, "1day", outputsize),
    ]);

    const priceSeries: ChartPoint[] = [...seriesData.values]
      .reverse()
      .map((item) => ({
        date: item.datetime,
        close: Number(item.close),
        volume: item.volume ? Number(item.volume) : undefined,
      }));

    if (!priceSeries.length) {
      return NextResponse.json(
        { error: "No historical data found" },
        { status: 404 },
      );
    }

    const currentPrice = Number(priceData.price);
    const movingAverage30 = calculateSimpleMovingAverage(priceSeries, 30);
    const latestMa = movingAverage30.at(-1)?.value ?? 0;
    const crossovers = detectPriceMovingAverageCrossovers(
      priceSeries,
      movingAverage30,
    );
    const { floor, ceiling } = calculateFloorAndCeiling(priceSeries);

    const closes = priceSeries.map((p) => p.close);
    const yearHigh = Math.max(...closes);

    const currentIndex = closes.length - 1;

    const performance = {
      today:
        closes.length > 1
          ? percentChange(closes[currentIndex], closes[currentIndex - 1])
          : 0,
      previousDay:
        closes.length > 2
          ? percentChange(closes[currentIndex - 1], closes[currentIndex - 2])
          : 0,
      fiveDays:
        closes.length > 5
          ? percentChange(closes[currentIndex], closes[currentIndex - 5])
          : 0,
      thirtyDays:
        closes.length > 30
          ? percentChange(closes[currentIndex], closes[currentIndex - 30])
          : 0,
      sixtyDays:
        closes.length > 60
          ? percentChange(closes[currentIndex], closes[currentIndex - 60])
          : 0,
      oneYear:
        closes.length > 251
          ? percentChange(closes[currentIndex], closes[currentIndex - 251])
          : 0,
    };

    const signal = getSignal(currentPrice, latestMa);
    const stopLoss = currentPrice * 0.95;
    const positionSize = 1000;
    const maxLoss = currentPrice - stopLoss;

    const response: DashboardResponse = {
      ticker,
      companyName: ticker,
      range,
      currentPrice,
      signal,

      overallChart: {
        priceSeries,
        movingAverage30,
        crossovers,
        floor,
        ceiling,
      },

      summary: {
        yearHigh: {
          value: yearHigh,
          percentFromHigh: percentChange(currentPrice, yearHigh),
        },
        movingAverage: latestMa,
        stopLoss,
        positionSize,
        maxLoss,
        bestDayToBuy: "Tuesday",
      },

      performance,

      metrics: {
        volume: priceSeries.at(-1)?.volume ?? 0,
        avgVolume: Math.round(
          average(
            priceSeries
              .map((point) => point.volume ?? 0)
              .filter((value) => value > 0),
          ),
        ),
      },

      score: {
        total: 78,
        growth: 80,
        quality: 76,
        valuation: 65,
        momentum: 88,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load stock data";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
