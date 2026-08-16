import { describe, expect, it } from "vitest";

import { createVisualAutosaveController } from "./visualAutosaveController";

function createHarness() {
  const timers = new Map<number, { fn: () => void; ms: number }>();
  let nextId = 1;
  const saves: number[] = [];
  let saveImpl: (ctx: { revision: number }) => Promise<void> = async () => {};
  let online = true;

  const controller = createVisualAutosaveController({
    debounceMs: 1800,
    maxRetries: 3,
    save: async (ctx) => {
      saves.push(ctx.revision);
      await saveImpl(ctx);
    },
    isOnline: () => online,
    setTimeoutFn: (fn, ms) => {
      const id = nextId++;
      timers.set(id, { fn, ms });
      return id;
    },
    clearTimeoutFn: (id) => {
      timers.delete(Number(id));
    },
  });

  return {
    controller,
    saves,
    setSave(fn: (ctx: { revision: number }) => Promise<void>) {
      saveImpl = fn;
    },
    setOnline(value: boolean) {
      online = value;
    },
    async flushTimers() {
      const pending = [...timers.values()];
      timers.clear();
      for (const item of pending) item.fn();
      await Promise.resolve();
      await Promise.resolve();
    },
    timerCount() {
      return timers.size;
    },
  };
}

describe("visualAutosaveController", () => {
  it("coalesces many rapid edits into one save", async () => {
    const h = createHarness();
    for (let i = 0; i < 20; i += 1) h.controller.markDirty();
    expect(h.timerCount()).toBe(1);
    expect(h.saves).toEqual([]);
    await h.flushTimers();
    expect(h.saves).toEqual([20]);
    expect(h.controller.getStatus()).toBe("saved");
  });

  it("saves again when an edit happens during an in-flight save", async () => {
    const h = createHarness();
    let release: (() => void) | undefined;
    h.setSave(() => new Promise((resolve) => {
      release = resolve;
    }));
    h.controller.markDirty();
    await h.flushTimers();
    expect(h.controller.getStatus()).toBe("saving");
    h.controller.markDirty();
    h.setSave(async () => {});
    release?.();
    await Promise.resolve();
    await Promise.resolve();
    await h.flushTimers();
    await Promise.resolve();
    await Promise.resolve();
    expect(h.saves).toEqual([1, 2]);
    expect(h.controller.getStatus()).toBe("saved");
    expect(h.controller.getSavedRevision()).toBe(2);
  });

  it("keeps dirty state and does not mark saved after a failed save", async () => {
    const h = createHarness();
    h.setSave(async () => {
      throw new Error("network");
    });
    h.controller.markDirty();
    await h.flushTimers();
    expect(h.controller.getStatus()).toBe("dirty");
    await h.flushTimers();
    await h.flushTimers();
    expect(h.saves.length).toBe(3);
    expect(h.controller.getStatus()).toBe("error");
    expect(h.controller.getSavedRevision()).toBe(0);
  });

  it("does not start a request while offline, then flushes on reconnect", async () => {
    const h = createHarness();
    h.setOnline(false);
    h.controller.markDirty();
    expect(h.controller.getStatus()).toBe("offline");
    expect(h.timerCount()).toBe(0);
    h.setOnline(true);
    h.controller.handleOnline();
    expect(h.timerCount()).toBe(1);
    await h.flushTimers();
    expect(h.saves).toEqual([1]);
    expect(h.controller.getStatus()).toBe("saved");
  });

  it("leaves saving after a failed request even if a newer revision exists", async () => {
    const h = createHarness();
    let release: ((error?: Error) => void) | undefined;
    h.setSave(() => new Promise((_, reject) => {
      release = (error) => reject(error || new Error("forced 500"));
    }));
    h.controller.markDirty();
    await h.flushTimers();
    expect(h.controller.getStatus()).toBe("saving");
    h.controller.markDirty();
    release?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(h.controller.getStatus()).not.toBe("saving");
    expect(h.controller.getStatus()).toBe("dirty");
    expect(h.controller.getSavedRevision()).toBe(0);
  });

  it("manual retry after final error leaves saving and can recover", async () => {
    const h = createHarness();
    h.setSave(async () => {
      throw new Error("forced 500");
    });
    h.controller.markDirty();
    await h.flushTimers();
    await h.flushTimers();
    await h.flushTimers();
    expect(h.controller.getStatus()).toBe("error");
    expect(h.saves.length).toBe(3);

    h.setSave(async () => {});
    await h.controller.retry();
    expect(h.controller.getStatus()).toBe("saved");
    expect(h.controller.getSavedRevision()).toBe(1);
  });

  it("ignores a stale save completion after a newer revision exists", async () => {
    const h = createHarness();
    const releases: Array<() => void> = [];
    h.setSave(() => new Promise((resolve) => {
      releases.push(resolve);
    }));
    h.controller.markDirty();
    await h.flushTimers();
    h.controller.markDirty();
    expect(h.controller.getInFlightRevision()).toBe(1);
    releases[0]?.();
    await Promise.resolve();
    await Promise.resolve();
    await h.flushTimers();
    releases[1]?.();
    await Promise.resolve();
    await Promise.resolve();
    expect(h.controller.getSavedRevision()).toBe(2);
    expect(h.controller.getStatus()).toBe("saved");
  });
});
