const BASE_URL = "https://api.twelvedata.com";

function getApiKey(): string {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("Missing TWELVE_DATA_API_KEY");
  }

  return apiKey;
}

async function tdFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
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
    next: { revalidate: 0 },
  });

  const data = await res.json();
  console.log(data);

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
  return tdFetch<TwelveDataPriceResponse>("price", { symbol });
}

export async function getTimeSeries(
  symbol: string,
  interval = "1day",
  outputsize = 252,
) {
  return tdFetch<TwelveDataTimeSeriesResponse>("time_series", {
    symbol,
    interval,
    outputsize,
  });
}
