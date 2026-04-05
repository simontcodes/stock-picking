export type CreateWatchlistItemInput = {
  ticker: string;
  notes?: string;
};

export type RemoveWatchlistItemInput = {
  ticker: string;
};

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