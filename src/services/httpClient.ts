/**
 * HTTP Client Utility mit Timeout-Handling
 * Alle Backend-Requests sollten diesen Utility nutzen
 */

export interface HttpRequestOptions extends RequestInit {
  timeout?: number;
}

const DEFAULT_TIMEOUT_MS = 600000;

export async function httpClient<T>(
  url: string,
  options: HttpRequestOptions = {},
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request Timeout nach ${timeout}ms: ${url}`);
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
