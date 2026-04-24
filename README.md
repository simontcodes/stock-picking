# Tiqr

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL` and `TWELVE_DATA_API_KEY`.
3. Set `INTERNAL_API_KEY` to a long random secret if you want the internal scan route protected.
4. Install dependencies: `npm install`
5. Apply Prisma migrations: `npx prisma migrate dev`
6. Start the app: `npm run dev`

Example secret generation:

```bash
openssl rand -hex 32
```

## Environment Variables

The example env file is at [.env.example](/home/simontang/projects/stock-picking/.env.example).

- `DATABASE_URL`: Postgres connection string for Prisma.
- `TWELVE_DATA_API_KEY`: API key used for daily stock data lookups.
- `INTERNAL_API_KEY`: Optional shared secret for internal-only routes such as the watchlist alert scan endpoint.

If `INTERNAL_API_KEY` is unset, the internal scan route is open. For any deployed environment, you should set it.

Authentication uses database-backed sessions stored in the `AuthSession` table and an HttpOnly `tiqer_session` cookie. No additional auth environment variable is required.

## Watchlist Alert Scan

The project includes an internal route that scans all enabled watchlist tickers using daily data and creates alerts only when both signals agree on the latest candle:

- `bullish` overall crossover + `bullish` MACD crossover => `BUY`
- `bearish` overall crossover + `bearish` MACD crossover => `SELL`

Route:

```text
POST /api/internal/watchlist-alerts/scan
```

Authentication:

- `Authorization: Bearer <INTERNAL_API_KEY>`
- `x-internal-api-key: <INTERNAL_API_KEY>`

Example:

```bash
curl -X POST http://localhost:3000/api/internal/watchlist-alerts/scan \
  -H "x-internal-api-key: $INTERNAL_API_KEY"
```

The response includes:

- `tickersScanned`
- `alertsCreated`
- `alertsSuppressed`
- `tickersWithoutSignal`
- `errors`

The scanner stores a baseline signal state per user and ticker, and only creates alerts when that user's current confirmed signal changes from the last known stored state.

To manually trigger the watchlist report notification path:

```bash
curl -X POST http://localhost:3000/api/internal/watchlist-alerts/scan \
  -H "Content-Type: application/json" \
  -H "x-internal-api-key: $INTERNAL_API_KEY" \
  -d '{"sendReport":true}'
```

Duplicate alerts are prevented for the same `user + ticker + signal + candleDate`.

## Notes

- Prisma client generation was updated for the auth, ownership, and alert models.
