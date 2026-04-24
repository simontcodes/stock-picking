import { NextRequest, NextResponse } from "next/server";
import {
  addTickerToDefaultWatchlistForUser,
  getOrCreateDefaultWatchlistForUser,
  removeTickerFromDefaultWatchlistForUser,
} from "@/lib/watchlist/watchlist.service";
import { getCurrentUser } from "@/lib/auth/session";

async function getAuthenticatedApiUser() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await getAuthenticatedApiUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const watchlist = await getOrCreateDefaultWatchlistForUser(user.id);

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
    const user = await getAuthenticatedApiUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

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

    const watchlist = await addTickerToDefaultWatchlistForUser(user.id, {
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
    const user = await getAuthenticatedApiUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

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

    const watchlist = await removeTickerFromDefaultWatchlistForUser(
      user.id,
      ticker,
    );

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
