import { useCallback, useEffect, useState } from "react";
import API from "@/api";

/**
 * Fetches AI insights for a given business id (Business._id).
 */
export default function useAiInsights(businessId) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = useCallback(async () => {
    if (!businessId || typeof businessId !== "string" || businessId.length !== 24) {
      setInsights([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/ai/insights", { businessId });

      if (Array.isArray(res.data)) {
        setInsights(res.data);
      } else if (Array.isArray(res.data?.insights)) {
        setInsights(res.data.insights);
      } else {
        setInsights([]);
      }
    } catch {
      setError("לא ניתן לטעון המלצות כרגע");
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

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
