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
  if (!controllerRef.current) {
    controllerRef.current = createVisualAutosaveController({
      save: (context) => saveDraftRef.current(context),
      onStatus: setStatus,
    });
  }

  useEffect(() => {
    controllerRef.current?.setSave((context) => saveDraftRef.current(context));
  }, [saveDraft]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return undefined;

    const onDirty = () => {
      if (!enabled) return;
      controller.markDirty();
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
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      controllerRef.current?.dispose();
    };
  }, []);

  const markDirty = useCallback(() => {
    if (!enabled) return;
    controllerRef.current?.markDirty();
  }, [enabled]);

  const flushAutosave = useCallback(async () => {
    if (!enabled) return;
    await controllerRef.current?.flush();
  }, [enabled]);

  const retryAutosave = useCallback(async () => {
    await controllerRef.current?.retry();
  }, []);

  const acknowledgeSaved = useCallback(() => {
    controllerRef.current?.acknowledgeSaved();
  }, []);

  const cancelPending = useCallback(() => {
    controllerRef.current?.cancelPending();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as any).__WB_AUTOSAVE = {
      status,
      revision: controllerRef.current?.getRevision() || 0,
      savedRevision: controllerRef.current?.getSavedRevision() || 0,
      flush: flushAutosave,
      markDirty,
    };
  }, [flushAutosave, markDirty, status]);

  return {
    autosaveStatus: enabled ? status : "clean",
    markDirty,
    flushAutosave,
    retryAutosave,
    acknowledgeSaved,
    cancelPending,
    getAutosaveStatus: () => controllerRef.current?.getStatus() || status,
  };
}
