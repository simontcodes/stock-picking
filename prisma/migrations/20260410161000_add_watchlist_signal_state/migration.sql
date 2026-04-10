CREATE TABLE "WatchlistSignalState" (
    "id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "signal" "AlertSignal" NOT NULL,
    "signalDate" TIMESTAMP(3) NOT NULL,
    "overallSignalDate" TIMESTAMP(3) NOT NULL,
    "macdSignalDate" TIMESTAMP(3) NOT NULL,
    "overallCrossoverType" TEXT NOT NULL,
    "macdCrossoverType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchlistSignalState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WatchlistSignalState_ticker_key" ON "WatchlistSignalState"("ticker");
CREATE INDEX "WatchlistSignalState_signal_idx" ON "WatchlistSignalState"("signal");
CREATE INDEX "WatchlistSignalState_signalDate_idx" ON "WatchlistSignalState"("signalDate");
