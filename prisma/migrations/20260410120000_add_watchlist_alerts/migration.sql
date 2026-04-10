CREATE TYPE "AlertSignal" AS ENUM ('BUY', 'SELL');

CREATE TYPE "AlertDeliveryStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "WatchlistAlert" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "signal" "AlertSignal" NOT NULL,
    "candleDate" TIMESTAMP(3) NOT NULL,
    "overallCrossoverType" TEXT NOT NULL,
    "macdCrossoverType" TEXT NOT NULL,
    "overallCrossoverAt" TIMESTAMP(3) NOT NULL,
    "macdCrossoverAt" TIMESTAMP(3) NOT NULL,
    "notificationStatus" "AlertDeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "notificationAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastNotifiedAt" TIMESTAMP(3),
    "lastNotificationError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistAlert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AlertNotification" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" "AlertDeliveryStatus" NOT NULL,
    "message" TEXT,
    "error" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertNotification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WatchlistAlert_ticker_signal_candleDate_key" ON "WatchlistAlert"("ticker", "signal", "candleDate");
CREATE INDEX "WatchlistAlert_ticker_candleDate_idx" ON "WatchlistAlert"("ticker", "candleDate");
CREATE INDEX "WatchlistAlert_notificationStatus_idx" ON "WatchlistAlert"("notificationStatus");
CREATE INDEX "AlertNotification_alertId_idx" ON "AlertNotification"("alertId");
CREATE INDEX "AlertNotification_channel_attemptedAt_idx" ON "AlertNotification"("channel", "attemptedAt");

ALTER TABLE "AlertNotification" ADD CONSTRAINT "AlertNotification_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "WatchlistAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
