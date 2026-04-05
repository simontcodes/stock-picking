export type WatchlistItemDto = {
  id: string;
  ticker: string;
  notes: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WatchlistDto = {
  id: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  items: WatchlistItemDto[];
};

type WatchlistResponse = {
  success: boolean;
  data: WatchlistDto;
  error?: string;
};

export async function fetchWatchlist(): Promise<WatchlistDto> {
  const response = await fetch("/api/watchlist");

  if (!response.ok) {
    throw new Error("Failed to fetch watchlist.");
  }

  const json = (await response.json()) as WatchlistResponse;

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch watchlist.");
  }

  return json.data;
}

export async function addToWatchlist(input: {
  ticker: string;
  notes?: string;
}): Promise<WatchlistDto> {
  const response = await fetch("/api/watchlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = (await response.json()) as WatchlistResponse;

  if (!response.ok || !json.success) {
    throw new Error(json.error || "Failed to add ticker.");
  }

  return json.data;
}

export async function removeFromWatchlist(
  ticker: string
): Promise<WatchlistDto> {
  const response = await fetch(
    `/api/watchlist?ticker=${encodeURIComponent(ticker)}`,
    {
      method: "DELETE",
    }
  );

  const json = (await response.json()) as WatchlistResponse;

  if (!response.ok || !json.success) {
    throw new Error(json.error || "Failed to remove ticker.");
  }

  return json.data;
}