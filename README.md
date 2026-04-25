# Tiqr

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in `DATABASE_URL`, `APP_URL`, and `TWELVE_DATA_API_KEY`.
3. Set `INTERNAL_API_KEY` to a long random secret if you want the internal scan route protected.
4. Install dependencies: `npm install`
5. Apply Prisma migrations: `npm run db:migrate:dev`
6. Start the app: `npm run dev`

Example secret generation:

```bash
openssl rand -hex 32
```

## Environment Variables

The example env file is at [.env.example](/home/simontang/projects/stock-picking/.env.example).

- `DATABASE_URL`: Postgres connection string for Prisma.
- `APP_URL`: Public app origin used for absolute invite links. Example: `http://localhost:3000` locally, your Vercel domain in deployed environments.
- `TWELVE_DATA_API_KEY`: API key used for daily stock data lookups.
- `INTERNAL_API_KEY`: Optional shared secret for internal-only routes such as the watchlist alert scan endpoint.

If `INTERNAL_API_KEY` is unset, the internal scan route is open. For any deployed environment, you should set it.

Authentication uses database-backed sessions stored in the `AuthSession` table and an HttpOnly `tiqer_session` cookie. No additional auth environment variable is required.

Sign-up is invite-only. Public registration is disabled unless the user opens a valid `/sign-up?invite=...` link.

## Multiple Environments

Use separate databases and secrets for each environment:

- `development`: local `.env` and local Postgres
- `preview`: Vercel Preview env vars and a separate preview Postgres database
- `production`: Vercel Production env vars and a separate production Postgres database

Recommended rules:

- never share the same `DATABASE_URL` between preview and production
- never reuse the same `INTERNAL_API_KEY` across environments
- set `APP_URL` per environment so invite links point to the right domain

Example values:

- local: `APP_URL=http://localhost:3000`
- preview: `APP_URL=https://your-project-git-branch-your-team.vercel.app`
- production: `APP_URL=https://yourdomain.com`

Prisma workflow:

- local development: `npm run db:migrate:dev`
- preview/production deploys: `npm run db:migrate:deploy`

For deployed environments, prefer `prisma migrate deploy` over `prisma migrate dev`.

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

## Invitations

You can create invite-only signup links through the internal route:

```text
POST /api/internal/invitations
```

Authentication:

- `Authorization: Bearer <INTERNAL_API_KEY>`
- `x-internal-api-key: <INTERNAL_API_KEY>`

Example:

```bash
curl -X POST http://localhost:3000/api/internal/invitations \
  -H "Content-Type: application/json" \
  -H "x-internal-api-key: $INTERNAL_API_KEY" \
  -d '{"email":"person@example.com","expiresInDays":7}'
```

The response includes:

- `invitePath`: relative path such as `/sign-up?invite=...`
- `inviteUrl`: absolute URL built from `APP_URL` or the current request origin

For production deploys, send `inviteUrl` to the invited user.

## Scripts

- `npm run build`: generates Prisma client and builds Next.js
- `npm run db:generate`: regenerates Prisma client
- `npm run db:migrate:dev`: local development migrations
- `npm run db:migrate:deploy`: deployed-environment migrations

## Notes

- Prisma client generation was updated for the auth, ownership, and alert models.
