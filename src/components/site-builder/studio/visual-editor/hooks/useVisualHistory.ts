import { useCallback, useMemo, useRef, useState } from "react";

import { VISUAL_HISTORY_LIMIT, cloneVisualData } from "../utils/visualData";

type VisualHistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

type UseVisualHistoryOptions = {
  limit?: number;
};

export function useVisualHistory<T>(
  initialValue: T,
  options: UseVisualHistoryOptions = {},
) {
  const limit = options.limit || VISUAL_HISTORY_LIMIT;
  const initialRef = useRef<T>(cloneVisualData(initialValue));

  const [history, setHistory] = useState<VisualHistoryState<T>>({
    past: [],
    present: cloneVisualData(initialRef.current),
    future: [],
  });

  const present = history.present;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setPresent = useCallback(
    (nextValue: T | ((current: T) => T), shouldPushHistory = true) => {
      setHistory((currentHistory) => {
        const currentPresent = currentHistory.present;
        const resolvedNext =
          typeof nextValue === "function"
            ? (nextValue as (current: T) => T)(cloneVisualData(currentPresent))
            : nextValue;

        const nextPresent = cloneVisualData(resolvedNext);

        if (!shouldPushHistory) {
          return {
            ...currentHistory,
            present: nextPresent,
          };
        }

        const nextPast = [...currentHistory.past, cloneVisualData(currentPresent)].slice(
          Math.max(0, currentHistory.past.length + 1 - limit),
        );

        return {
          past: nextPast,
          present: nextPresent,
          future: [],
        };
      });
    },
    [limit],
  );

  const replacePresent = useCallback((nextValue: T | ((current: T) => T)) => {
    setPresent(nextValue, false);
  }, [setPresent]);

  const undo = useCallback(() => {
    setHistory((currentHistory) => {
      if (!currentHistory.past.length) return currentHistory;

      const previous = currentHistory.past[currentHistory.past.length - 1];
      const nextPast = currentHistory.past.slice(0, -1);

      return {
        past: nextPast,
        present: cloneVisualData(previous),
        future: [cloneVisualData(currentHistory.present), ...currentHistory.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => {
      if (!currentHistory.future.length) return currentHistory;

      const next = currentHistory.future[0];
      const nextFuture = currentHistory.future.slice(1);

      return {
        past: [...currentHistory.past, cloneVisualData(currentHistory.present)].slice(
          Math.max(0, currentHistory.past.length + 1 - limit),
        ),
        present: cloneVisualData(next),
        future: nextFuture,
      };
    });
  }, [limit]);

  const resetHistory = useCallback((nextValue: T) => {
    initialRef.current = cloneVisualData(nextValue);

    setHistory({
      past: [],
      present: cloneVisualData(nextValue),
      future: [],
    });
  }, []);

  return useMemo(
    () => ({
      value: present,
      setValue: setPresent,
      replaceValue: replacePresent,
      undo,
      redo,
      resetHistory,
      canUndo,
      canRedo,
      historyLength: history.past.length,
      futureLength: history.future.length,
    }),
    [
      present,
      setPresent,
      replacePresent,
      undo,
      redo,
      resetHistory,
      canUndo,
      canRedo,
      history.past.length,
      history.future.length,
    ],
  );
}
