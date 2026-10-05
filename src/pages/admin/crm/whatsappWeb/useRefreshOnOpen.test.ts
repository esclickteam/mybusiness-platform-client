import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRefreshOnOpen } from "./useRefreshOnOpen";

describe("useRefreshOnOpen", () => {
  it("refreshes once per open even when focus and mousedown both fire", async () => {
    const refresh = vi.fn(async () => undefined);
    const { result } = renderHook(() => useRefreshOnOpen(refresh, 2000));
    await act(async () => {
      result.current();
      result.current();
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("refreshes again when the picker is reopened later", async () => {
    const now = vi.spyOn(Date, "now");
    now.mockReturnValue(10_000);
    const refresh = vi.fn(async () => undefined);
    const { result } = renderHook(() => useRefreshOnOpen(refresh, 2000));
    await act(async () => {
      result.current();
    });
    now.mockReturnValue(13_000);
    await act(async () => {
      result.current();
    });
    expect(refresh).toHaveBeenCalledTimes(2);
    now.mockRestore();
  });

  it("swallows refresh failures so the picker keeps working", async () => {
    const refresh = vi.fn(async () => {
      throw new Error("network");
    });
    const { result } = renderHook(() => useRefreshOnOpen(refresh));
    await act(async () => {
      result.current();
    });
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
