CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

INSERT INTO "User" ("id", "name", "email", "passwordHash", "createdAt", "updatedAt")
VALUES ('legacy-user', 'Legacy Watchlist', 'legacy@local.invalid', 'disabled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE "Watchlist" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'legacy-user';
ALTER TABLE "WatchlistAlert" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'legacy-user';
ALTER TABLE "WatchlistSignalState" ADD COLUMN "userId" TEXT NOT NULL DEFAULT 'legacy-user';

DROP INDEX "WatchlistAlert_ticker_signal_candleDate_key";
DROP INDEX "WatchlistAlert_ticker_candleDate_idx";
DROP INDEX "WatchlistSignalState_ticker_key";

ALTER TABLE "Watchlist" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE "WatchlistAlert" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE "WatchlistSignalState" ALTER COLUMN "userId" DROP DEFAULT;

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "AuthSession_tokenHash_key" ON "AuthSession"("tokenHash");
CREATE INDEX "AuthSession_userId_idx" ON "AuthSession"("userId");
CREATE INDEX "AuthSession_expiresAt_idx" ON "AuthSession"("expiresAt");
CREATE INDEX "Watchlist_userId_idx" ON "Watchlist"("userId");
CREATE INDEX "Watchlist_userId_isDefault_idx" ON "Watchlist"("userId", "isDefault");
CREATE UNIQUE INDEX "WatchlistAlert_userId_ticker_signal_candleDate_key" ON "WatchlistAlert"("userId", "ticker", "signal", "candleDate");
CREATE INDEX "WatchlistAlert_userId_idx" ON "WatchlistAlert"("userId");
CREATE INDEX "WatchlistAlert_userId_ticker_candleDate_idx" ON "WatchlistAlert"("userId", "ticker", "candleDate");
CREATE UNIQUE INDEX "WatchlistSignalState_userId_ticker_key" ON "WatchlistSignalState"("userId", "ticker");
CREATE INDEX "WatchlistSignalState_userId_idx" ON "WatchlistSignalState"("userId");

ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistAlert" ADD CONSTRAINT "WatchlistAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistSignalState" ADD CONSTRAINT "WatchlistSignalState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
