import type { NextRequest } from "next/server";

function getProvidedInternalApiKey(request: NextRequest): string | null {
  const bearer = request.headers.get("authorization");

  if (bearer?.startsWith("Bearer ")) {
    return bearer.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-internal-api-key");
}

export function isAuthorizedInternalRequest(request: NextRequest): boolean {
  const configuredKey = process.env.INTERNAL_API_KEY;

  if (!configuredKey) {
    return true;
  }

  return getProvidedInternalApiKey(request) === configuredKey;
}
