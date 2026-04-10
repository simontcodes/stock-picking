import { NextResponse } from "next/server";
import { scanWatchlistForAlerts } from "@/lib/alerts/watchlist-alerts.service";

export async function POST() {
  try {
    const result = await scanWatchlistForAlerts({
      sendReport: true,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/watchlist-alerts/report failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to trigger watchlist report.",
      },
      { status: 500 },
    );
  }
}
