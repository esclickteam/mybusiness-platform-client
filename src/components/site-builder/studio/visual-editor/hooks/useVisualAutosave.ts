import { useCallback, useEffect, useRef, useState } from "react";

import {
  VISUAL_AUTOSAVE_DIRTY_EVENT,
  createVisualAutosaveController,
  type VisualAutosaveStatus,
} from "../utils/visualAutosaveController";

type UseVisualAutosaveOptions = {
  enabled?: boolean;
  saveDraft: (context: { revision: number }) => Promise<void>;
};

function writeAutosaveWindow(
  controller: ReturnType<typeof createVisualAutosaveController> | null,
  extra: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  const previous = (window as any).__WB_AUTOSAVE || {};
  (window as any).__WB_AUTOSAVE = {
    ...previous,
    status: controller?.getStatus() || previous.status || "clean",
    revision: controller?.getRevision() || 0,
    savedRevision: controller?.getSavedRevision() || 0,
    inFlightRevision: controller?.getInFlightRevision() || 0,
    persistedRevision: Number(previous.persistedRevision || 0),
    publishRevision: Number(previous.publishRevision || 0),
    ...extra,
  };
}

export function useVisualAutosave({
  enabled = true,
  saveDraft,
}: UseVisualAutosaveOptions) {
  const [status, setStatus] = useState<VisualAutosaveStatus>("clean");
  const saveDraftRef = useRef(saveDraft);
  saveDraftRef.current = saveDraft;
  const controllerRef = useRef<ReturnType<
    typeof createVisualAutosaveController
  > | null>(null);

  useEffect(() => {
    const controller = createVisualAutosaveController({
      save: (context) => saveDraftRef.current(context),
      onStatus: (next) => {
        setStatus(next);
        writeAutosaveWindow(controller, { status: next });
      },
    });
    controllerRef.current = controller;
    writeAutosaveWindow(controller);

    const onDirty = () => {
      if (!enabled) return;
      controller.markDirty();
      writeAutosaveWindow(controller);
    };
    const onOnline = () => controller.handleOnline();
    const onOffline = () => controller.handleOffline();

    window.addEventListener(VISUAL_AUTOSAVE_DIRTY_EVENT, onDirty);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener(VISUAL_AUTOSAVE_DIRTY_EVENT, onDirty);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      controller.dispose();
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    };
  }, [enabled]);

  const markDirty = useCallback(() => {
    if (!enabled) return;
    controllerRef.current?.markDirty();
    writeAutosaveWindow(controllerRef.current);
  }, [enabled]);

  const flushAutosave = useCallback(async () => {
    if (!enabled) return;
    await controllerRef.current?.flush();
    writeAutosaveWindow(controllerRef.current);
  }, [enabled]);

  const retryAutosave = useCallback(async () => {
    await controllerRef.current?.retry();
    writeAutosaveWindow(controllerRef.current);
  }, []);

  const acknowledgeSaved = useCallback(() => {
    controllerRef.current?.acknowledgeSaved();
    writeAutosaveWindow(controllerRef.current);
  }, []);

  const cancelPending = useCallback(() => {
    controllerRef.current?.cancelPending();
  }, []);

  useEffect(() => {
    writeAutosaveWindow(controllerRef.current, {
      status,
      flush: flushAutosave,
      markDirty,
    });
  }, [flushAutosave, markDirty, status]);

  return {
    autosaveStatus: enabled ? status : "clean",
    markDirty,
    flushAutosave,
    retryAutosave,
    acknowledgeSaved,
    cancelPending,
    getAutosaveStatus: () => controllerRef.current?.getStatus() || status,
    getRevision: () => controllerRef.current?.getRevision() || 0,
    getSavedRevision: () => controllerRef.current?.getSavedRevision() || 0,
  };
}
