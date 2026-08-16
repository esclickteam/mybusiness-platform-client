export const VISUAL_AUTOSAVE_DEBOUNCE_MS = 1800;
export const VISUAL_AUTOSAVE_MAX_RETRIES = 3;
export const VISUAL_AUTOSAVE_DIRTY_EVENT = "bizuply:visual-autosave-dirty";

export type VisualAutosaveStatus =
  | "clean"
  | "dirty"
  | "saving"
  | "saved"
  | "error"
  | "offline";

export type VisualAutosaveSaveContext = {
  revision: number;
};

export type VisualAutosaveControllerOptions = {
  debounceMs?: number;
  maxRetries?: number;
  save: (context: VisualAutosaveSaveContext) => Promise<void>;
  isOnline?: () => boolean;
  setTimeoutFn?: (fn: () => void, ms: number) => unknown;
  clearTimeoutFn?: (id: unknown) => void;
  onStatus?: (status: VisualAutosaveStatus) => void;
};

export function markVisualAutosaveDirty() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VISUAL_AUTOSAVE_DIRTY_EVENT));
}

export function readVisualAutosaveWindowState() {
  if (typeof window === "undefined") {
    return {
      currentRevision: 0,
      autosaveRevision: 0,
      persistedRevision: 0,
      publishRevision: 0,
    };
  }

  const api = (window as any).__WB_AUTOSAVE || {};
  return {
    currentRevision: Number(api.revision || 0),
    autosaveRevision: Number(api.savedRevision || 0),
    persistedRevision: Number(api.persistedRevision || 0),
    publishRevision: Number(api.publishRevision || 0),
  };
}

export function pushVisualAutosaveTrace(
  event: string,
  extra: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  const state = readVisualAutosaveWindowState();
  const row = {
    event,
    at: Date.now(),
    currentRevision: state.currentRevision,
    autosaveRevision: state.autosaveRevision,
    persistedRevision: state.persistedRevision,
    publishRevision:
      extra.publishRevision == null
        ? state.publishRevision
        : Number(extra.publishRevision),
    ...extra,
  };

  const previous = Array.isArray((window as any).__WB_AUTOSAVE_TRACE)
    ? (window as any).__WB_AUTOSAVE_TRACE
    : [];
  (window as any).__WB_AUTOSAVE_TRACE = [...previous, row].slice(-40);
  console.log("[WB autosave trace]", row);
}

export function createVisualAutosaveController(
  options: VisualAutosaveControllerOptions,
) {
  const debounceMs = options.debounceMs ?? VISUAL_AUTOSAVE_DEBOUNCE_MS;
  const maxRetries = options.maxRetries ?? VISUAL_AUTOSAVE_MAX_RETRIES;
  const setTimeoutFn = options.setTimeoutFn ?? ((fn, ms) => setTimeout(fn, ms));
  const clearTimeoutFn =
    options.clearTimeoutFn ?? ((id) => clearTimeout(id as ReturnType<typeof setTimeout>));
  const isOnline = options.isOnline ?? (() =>
    typeof navigator === "undefined" ? true : navigator.onLine !== false);

  let revision = 0;
  let savedRevision = 0;
  let inFlightRevision = 0;
  let status: VisualAutosaveStatus = "clean";
  let retries = 0;
  let timer: unknown = null;
  let inFlight: Promise<void> | null = null;
  let disposed = false;
  let saveFn = options.save;

  const emit = (next: VisualAutosaveStatus) => {
    status = next;
    options.onStatus?.(status);
  };

  const clearTimer = () => {
    if (timer == null) return;
    clearTimeoutFn(timer);
    timer = null;
  };

  const hasUnsavedWork = () => revision > savedRevision;

  const schedule = (delay = debounceMs) => {
    clearTimer();
    if (disposed || !hasUnsavedWork()) return;
    if (!isOnline()) {
      emit("offline");
      return;
    }
    emit("dirty");
    timer = setTimeoutFn(() => {
      timer = null;
      void runSave();
    }, delay);
  };

  const runSave = async ({ propagateError = false } = {}) => {
    if (disposed) return;
    if (inFlight) return inFlight;
    if (!hasUnsavedWork()) {
      emit(isOnline() ? "saved" : "offline");
      return;
    }
    if (!isOnline()) {
      emit("offline");
      if (propagateError) throw new Error("offline");
      return;
    }

    const startedRevision = revision;
    inFlightRevision = startedRevision;
    emit("saving");

    inFlight = (async () => {
      try {
        await saveFn({ revision: startedRevision });

        if (startedRevision < savedRevision) {
          return;
        }

        if (revision > startedRevision) {
          retries = 0;
          schedule(0);
          return;
        }

        savedRevision = startedRevision;
        retries = 0;
        emit("saved");
      } catch (error) {
        const offline = !isOnline();

        /*
          A failed request must always leave "saving". A newer local
          revision stays dirty and gets one follow-up; it must not look
          like the in-flight request is still running.
        */
        if (revision > startedRevision) {
          retries = 0;
          emit(offline ? "offline" : "dirty");
          if (!offline) schedule(debounceMs);
          return;
        }

        retries += 1;
        if (retries < maxRetries && !offline) {
          emit("dirty");
          schedule(Math.min(8000, 1000 * 2 ** retries));
          return;
        }

        emit(offline ? "offline" : "error");
        if (propagateError) throw error;
      } finally {
        inFlight = null;
        inFlightRevision = 0;
      }
    })();

    return inFlight;
  };

  return {
    markDirty() {
      if (disposed) return;
      revision += 1;
      retries = 0;
      if (inFlight) {
        emit("saving");
        return;
      }
      schedule();
    },

    async flush() {
      if (disposed) return;
      clearTimer();
      for (let i = 0; i < 8; i += 1) {
        if (inFlight) {
          try {
            await inFlight;
          } catch {
            // Keep going so a newer revision can still persist.
          }
        }
        if (!hasUnsavedWork()) return;
        if (!isOnline()) {
          emit("offline");
          throw new Error("offline");
        }
        retries = 0;
        await runSave({ propagateError: true });
        if (status === "error") {
          throw new Error("autosave failed");
        }
        if (!hasUnsavedWork() && !inFlight) return;
      }
    },

    async retry() {
      if (disposed) return;
      retries = 0;
      clearTimer();
      if (!hasUnsavedWork()) return;
      await runSave({ propagateError: true });
    },

    acknowledgeSaved(atRevision = revision) {
      if (atRevision < savedRevision) return;
      savedRevision = atRevision;
      retries = 0;
      clearTimer();
      emit(hasUnsavedWork() ? "dirty" : "saved");
    },

    cancelPending() {
      clearTimer();
    },

    handleOnline() {
      if (disposed) return;
      if (!hasUnsavedWork()) {
        emit("saved");
        return;
      }
      retries = 0;
      schedule(300);
    },

    handleOffline() {
      if (disposed) return;
      if (hasUnsavedWork() || status === "saving") {
        emit("offline");
      }
    },

    setSave(nextSave: (context: VisualAutosaveSaveContext) => Promise<void>) {
      saveFn = nextSave;
    },

    getStatus() {
      return status;
    },

    getRevision() {
      return revision;
    },

    getSavedRevision() {
      return savedRevision;
    },

    getInFlightRevision() {
      return inFlightRevision;
    },

    isDisposed() {
      return disposed;
    },

    dispose() {
      disposed = true;
      clearTimer();
    },
  };
}

export type VisualAutosaveController = ReturnType<
  typeof createVisualAutosaveController
>;
