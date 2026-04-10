import { NextRequest, NextResponse } from "next/server";
import { scanWatchlistForAlerts } from "@/lib/alerts/watchlist-alerts.service";
import { isAuthorizedInternalRequest } from "@/lib/api/internal-auth";

export async function POST(request: NextRequest) {
  if (!isAuthorizedInternalRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const rawBody = await request.text();
    const body = rawBody
      ? ((JSON.parse(rawBody) as { sendReport?: boolean }) ?? {})
      : {};

    const result = await scanWatchlistForAlerts({
      sendReport: body.sendReport,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/internal/watchlist-alerts/scan failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to scan watchlist.",
      },
      { status: 500 },
    );
  }
}
