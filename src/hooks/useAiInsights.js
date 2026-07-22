import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "@/api";

/**
 * Fetches AI insights for a given business id (Business._id).
 */
export default function useAiInsights(businessId) {
  const { t, i18n } = useTranslation();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const language = String(i18n.language || "en").split("-")[0];

  const fetchInsights = useCallback(async () => {
    if (!businessId || typeof businessId !== "string" || businessId.length !== 24) {
      setInsights([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/ai/insights", { businessId, language });

      if (Array.isArray(res.data)) {
        setInsights(res.data);
      } else if (Array.isArray(res.data?.insights)) {
        setInsights(res.data.insights);
      } else {
        setInsights([]);
      }
    } catch {
      setError(t("aiInsights.loadError"));
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, [businessId, language, t]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      await fetchInsights();
      if (!isMounted) return;
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchInsights]);

  useEffect(() => {
    if (!businessId) return undefined;

    const refreshOnFocus = () => {
      fetchInsights();
    };

    window.addEventListener("focus", refreshOnFocus);
    return () => window.removeEventListener("focus", refreshOnFocus);
  }, [businessId, fetchInsights]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights,
  };
}
