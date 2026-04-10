import { prisma } from "@/lib/db/prisma";
import type {
  CreateWatchlistItemInput,
  WatchlistDto,
} from "@/lib/watchlist/watchlist.types";

function normalizeTicker(ticker: string): string {
  return ticker.trim().toUpperCase();
}

function assertValidTicker(ticker: string): void {
  if (!ticker) {
    throw new Error("Ticker is required.");
  }

  if (!/^[A-Z.\-]{1,10}$/.test(ticker)) {
    throw new Error("Ticker format is invalid.");
  }
}

function normalizeNotes(notes?: string): string | null {
  const trimmed = notes?.trim();

  return trimmed ? trimmed : null;
}

function toWatchlistDto(watchlist: {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    ticker: string;
    notes: string | null;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}): WatchlistDto {
  return {
    id: watchlist.id,
    name: watchlist.name,
    isDefault: watchlist.isDefault,
    createdAt: watchlist.createdAt.toISOString(),
    updatedAt: watchlist.updatedAt.toISOString(),
    items: watchlist.items.map((item) => ({
      id: item.id,
      ticker: item.ticker,
      notes: item.notes,
      enabled: item.enabled,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  };
}

export async function getOrCreateDefaultWatchlist(): Promise<WatchlistDto> {
  let watchlist = await prisma.watchlist.findFirst({
    where: { isDefault: true },
    include: {
      items: {
        orderBy: { ticker: "asc" },
      },
    },
  });

  if (!watchlist) {
    watchlist = await prisma.watchlist.create({
      data: {
        name: "My Watchlist",
        isDefault: true,
      },
      include: {
        items: {
          orderBy: { ticker: "asc" },
        },
      },
    });
  }

  return toWatchlistDto(watchlist);
}

export async function addTickerToDefaultWatchlist(
  input: CreateWatchlistItemInput
): Promise<WatchlistDto> {
  const ticker = normalizeTicker(input.ticker);
  assertValidTicker(ticker);

  const notes = normalizeNotes(input.notes);
  const watchlist = await getOrCreateDefaultWatchlist();

  await prisma.watchlistItem.upsert({
    where: {
      watchlistId_ticker: {
        watchlistId: watchlist.id,
        ticker,
      },
    },
    update: {
      notes,
      enabled: true,
    },
    create: {
      watchlistId: watchlist.id,
      ticker,
      notes,
      enabled: true,
    },
  });

  const updated = await prisma.watchlist.findUniqueOrThrow({
    where: { id: watchlist.id },
    include: {
      items: {
        orderBy: { ticker: "asc" },
      },
    },
  });

  return toWatchlistDto(updated);
}

export async function removeTickerFromDefaultWatchlist(
  tickerInput: string
): Promise<WatchlistDto> {
  const ticker = normalizeTicker(tickerInput);
  assertValidTicker(ticker);

  const watchlist = await getOrCreateDefaultWatchlist();

  await prisma.watchlistItem.deleteMany({
    where: {
      watchlistId: watchlist.id,
      ticker,
    },
  });

  const updated = await prisma.watchlist.findUniqueOrThrow({
    where: { id: watchlist.id },
    include: {
      items: {
        orderBy: { ticker: "asc" },
      },
    },
  });

  return toWatchlistDto(updated);
}

export async function getEnabledDefaultWatchlistTickers(): Promise<string[]> {
  const watchlist = await getOrCreateDefaultWatchlist();

  const items = await prisma.watchlistItem.findMany({
    where: {
      watchlistId: watchlist.id,
      enabled: true,
    },
    orderBy: {
      ticker: "asc",
    },
    select: {
      ticker: true,
    },
  });

  return items.map((item) => item.ticker);
}
