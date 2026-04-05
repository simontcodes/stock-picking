import { NextRequest, NextResponse } from "next/server";
import {
  addTickerToDefaultWatchlist,
  getOrCreateDefaultWatchlist,
  removeTickerFromDefaultWatchlist,
} from "@/lib/watchlist/watchlist.service";

export async function GET() {
  try {
    const watchlist = await getOrCreateDefaultWatchlist();

    return NextResponse.json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error("GET /api/watchlist failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load watchlist.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      ticker?: string;
      notes?: string;
    };

    if (!body.ticker || typeof body.ticker !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Ticker is required.",
        },
        { status: 400 }
      );
    }

    const watchlist = await addTickerToDefaultWatchlist({
      ticker: body.ticker,
      notes: body.notes,
    });

    return NextResponse.json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error("POST /api/watchlist failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to add ticker.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        {
          success: false,
          error: "Ticker query param is required.",
        },
        { status: 400 }
      );
    }

    const watchlist = await removeTickerFromDefaultWatchlist(ticker);

    return NextResponse.json({
      success: true,
      data: watchlist,
    });
  } catch (error) {
    console.error("DELETE /api/watchlist failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove ticker.",
      },
      { status: 500 }
    );
  }
}