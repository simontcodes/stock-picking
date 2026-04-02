import { NextRequest, NextResponse } from "next/server";
import { getDashboardData } from "@/lib/api/dashboard-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker")?.trim().toUpperCase();
    const range = searchParams.get("range") ?? "1y";

    if (!ticker) {
      return NextResponse.json(
        { error: "Ticker is required" },
        { status: 400 },
      );
    }

    const response = await getDashboardData(ticker, range);

    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load stock data";

    const status = message === "No historical data found" ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}