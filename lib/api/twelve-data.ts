const BASE_URL = "https://api.twelvedata.com";

const PRICE_REVALIDATE_SECONDS = 60;
const HISTORICAL_REVALIDATE_SECONDS = 60 * 60 * 12; // 12 hours

function getApiKey(): string {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TWELVE_DATA_API_KEY");
  }

  return apiKey;
}

type TdFetchOptions = {
  revalidate?: number;
  tags?: string[];
};

async function tdFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
  options?: TdFetchOptions,
): Promise<T> {
  const url = new URL(`${BASE_URL}/${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `apikey ${getApiKey()}`,
    },
    next: {
      revalidate: options?.revalidate,
      tags: options?.tags,
    },
  });

  const data = await res.json();

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[TD] ${path} ${params.symbol ? `(${String(params.symbol)})` : ""} | revalidate=${
        options?.revalidate ?? "default"
      }`,
    );
  }

  if (!res.ok || data?.status === "error") {
    throw new Error(data?.message || `Twelve Data request failed: ${path}`);
  }

  return data as T;
}

export type TwelveDataPriceResponse = {
  price: string;
};

export type TwelveDataTimeSeriesResponse = {
  meta: {
    symbol: string;
    interval: string;
    currency?: string;
    exchange?: string;
    type?: string;
  };
  values: Array<{
    datetime: string;
    open?: string;
    high?: string;
    low?: string;
    close: string;
    volume?: string;
  }>;
  status: string;
};

export async function getLatestPrice(symbol: string) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return tdFetch<TwelveDataPriceResponse>(
    "price",
    { symbol: normalizedSymbol },
    {
      revalidate: PRICE_REVALIDATE_SECONDS,
      tags: [`td:price:${normalizedSymbol}`],
    },
  );
}

export async function getTimeSeries(
  symbol: string,
  interval = "1day",
  outputsize = 252,
) {
  const normalizedSymbol = symbol.trim().toUpperCase();

  return tdFetch<TwelveDataTimeSeriesResponse>(
    "time_series",
    {
      symbol: normalizedSymbol,
      interval,
      outputsize,
    },
    {
      revalidate: HISTORICAL_REVALIDATE_SECONDS,
      tags: [`td:series:${normalizedSymbol}:${interval}:${outputsize}`],
    },
  );
}
