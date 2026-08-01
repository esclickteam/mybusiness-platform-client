import { useEffect, useState } from "react";

import type { StudioTemplateRenderer } from "./templateEditorTypes";
import {
  getStudioTemplateRenderer,
  loadStudioTemplateRenderer,
} from "./loadStudioTemplateRenderer";

/**
 * Load one template renderer chunk on demand. Returns cached sync value
 * immediately when available, otherwise loads asynchronously.
 */
export function useStudioTemplateRenderer(
  templateKey: string | null | undefined,
) {
  const key = String(templateKey || "")
    .trim()
    .toLowerCase();
  const [renderer, setRenderer] = useState<StudioTemplateRenderer | null>(() =>
    key ? getStudioTemplateRenderer(key) : null,
  );
  const [loading, setLoading] = useState<boolean>(() =>
    Boolean(key && !getStudioTemplateRenderer(key)),
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    if (!key) {
      setRenderer(null);
      setLoading(false);
      setError("");
      return undefined;
    }

    const cached = getStudioTemplateRenderer(key);
    if (cached) {
      setRenderer(cached);
      setLoading(false);
      setError("");
      return undefined;
    }

    setLoading(true);
    setError("");
    loadStudioTemplateRenderer(key).then((next) => {
      if (cancelled) return;
      setRenderer(next);
      setLoading(false);
      if (!next) setError("template-not-found");
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { renderer, loading, error, key };
}
