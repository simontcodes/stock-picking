import { NextResponse } from "next/server";
import { scanWatchlistForAlerts } from "@/lib/alerts/watchlist-alerts.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const result = await scanWatchlistForAlerts({
      userId: user.id,
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
