import React from "react";

const RELOAD_KEY = "bizuply:chunk-reload";
const RETRY_DELAYS_MS = [400, 1000, 2000];

export function isChunkLoadError(error: unknown): boolean {
  const message = String(
    (error as { message?: string })?.message || error || ""
  );
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Unable to preload CSS/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /net::ERR_ABORTED/i.test(message) ||
    /net::ERR_FAILED/i.test(message) ||
    (/404/.test(message) && /\/assets\//i.test(message))
  );
}

export function clearChunkReloadFlag(): void {
  try {
    sessionStorage.removeItem(RELOAD_KEY);
  } catch {
    // ignore
  }
}

function markChunkReload(): boolean {
  try {
    if (sessionStorage.getItem(RELOAD_KEY) === "1") return false;
    sessionStorage.setItem(RELOAD_KEY, "1");
    return true;
  } catch {
    return true;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Retry a dynamic import across a short deploy/CDN race, then reload once.
 * Never returns a hanging Promise — that left the splash screen spinning forever.
 */
export async function importWithRetry<T>(factory: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const mod = await factory();
      clearChunkReloadFlag();
      return mod;
    } catch (error) {
      lastError = error;
      if (!isChunkLoadError(error) || attempt >= RETRY_DELAYS_MS.length) {
        break;
      }
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }

  if (isChunkLoadError(lastError) && markChunkReload()) {
    window.location.reload();
  } else {
    clearChunkReloadFlag();
  }

  throw lastError;
}

/**
 * React.lazy wrapper that recovers from stale / missing deploy chunks.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(() => importWithRetry(factory));
}
