import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearChunkReloadFlag,
  importWithRetry,
  isChunkLoadError,
} from "./lazyWithRetry";

describe("isChunkLoadError", () => {
  it("detects Chrome dynamic import 404s", () => {
    expect(
      isChunkLoadError(
        new TypeError(
          "Failed to fetch dynamically imported module: https://bizuply.com/assets/App-D--HG6fx.js"
        )
      )
    ).toBe(true);
  });

  it("detects aborted hashed assets", () => {
    expect(isChunkLoadError(new Error("net::ERR_ABORTED 404"))).toBe(true);
  });
});

describe("importWithRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearChunkReloadFlag();
    vi.stubGlobal("location", { reload: vi.fn() });
  });

  afterEach(() => {
    clearChunkReloadFlag();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("returns the module on the first success", async () => {
    const mod = { default: "ok" };
    await expect(importWithRetry(async () => mod)).resolves.toBe(mod);
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it("retries a missing chunk until the CDN has it, without reloading", async () => {
    const chunkError = new TypeError(
      "Failed to fetch dynamically imported module: https://bizuply.com/assets/App-D--HG6fx.js"
    );
    const mod = { default: "recovered" };
    const factory = vi
      .fn()
      .mockRejectedValueOnce(chunkError)
      .mockRejectedValueOnce(chunkError)
      .mockResolvedValueOnce(mod);

    const pending = importWithRetry(factory);
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toBe(mod);
    expect(factory).toHaveBeenCalledTimes(3);
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it("throws after retries instead of hanging the splash screen", async () => {
    const chunkError = new TypeError(
      "Failed to fetch dynamically imported module: https://bizuply.com/assets/App-D--HG6fx.js"
    );
    const factory = vi.fn().mockRejectedValue(chunkError);

    const pending = importWithRetry(factory).catch((error) => error);
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toBe(chunkError);
    expect(factory).toHaveBeenCalledTimes(4);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
