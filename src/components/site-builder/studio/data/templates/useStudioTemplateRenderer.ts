import { useEffect, useState } from "react";

import type { StudioTemplateRenderer } from "./templateEditorTypes";
import {
  getStudioTemplateRenderer,
  loadStudioTemplateRenderer,
} from "./loadStudioTemplate";

export function useStudioTemplateRenderer(
  templateKey: string | null | undefined,
) {
  const key = String(templateKey || "").trim().toLowerCase();
  const [renderer, setRenderer] = useState<StudioTemplateRenderer | null>(() =>
    key ? getStudioTemplateRenderer(key) : null,
  );
  const [loading, setLoading] = useState(() => Boolean(key) && !renderer);

  useEffect(() => {
    let cancelled = false;
    if (!key) {
      setRenderer(null);
      setLoading(false);
      return;
    }

    const cached = getStudioTemplateRenderer(key);
    if (cached) {
      setRenderer(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadStudioTemplateRenderer(key)
      .then((loaded) => {
        if (cancelled) return;
        setRenderer(loaded);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRenderer(null);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { renderer, loading };
}
