import React from "react";

const RELOAD_KEY = "bizuply:chunk-reload";

export function isChunkLoadError(error: unknown): boolean {
  const message = String(
    (error as { message?: string })?.message || error || ""
  );
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Unable to preload CSS/i.test(message)
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

/**
 * React.lazy wrapper that recovers from stale deploy chunks by reloading once.
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      const mod = await factory();
      clearChunkReloadFlag();
      return mod;
    } catch (error) {
      if (isChunkLoadError(error) && markChunkReload()) {
        window.location.reload();
        // Keep Suspense pending until the page reloads.
        return new Promise(() => {});
      }
      clearChunkReloadFlag();
      throw error;
    }
  });
}
