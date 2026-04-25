function normalizeBaseUrl(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export function getConfiguredAppUrl(): string | null {
  const raw = process.env.APP_URL?.trim();

  if (!raw) {
    return null;
  }

  return normalizeBaseUrl(raw);
}

export function buildAppUrl(path: string, requestOrigin?: string): string {
  const baseUrl = getConfiguredAppUrl() ?? requestOrigin;

  if (!baseUrl) {
    throw new Error("APP_URL is not configured and no request origin was provided.");
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}
