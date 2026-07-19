import { useEffect, useState } from "react";
import API from "@/api";

/**
 * Fetches AI insights for a given business id (Business._id).
 */
export default function useAiInsights(businessId) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId) {
      setInsights([]);
      return;
    }

    if (typeof businessId !== "string" || businessId.length !== 24) {
      setInsights([]);
      return;
    }

    let isMounted = true;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.post("/ai/insights", { businessId });

        if (!isMounted) return;

        if (Array.isArray(res.data)) {
          setInsights(res.data);
        } else if (Array.isArray(res.data?.insights)) {
          setInsights(res.data.insights);
        } else {
          setInsights([]);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load AI insights");
          setInsights([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInsights();

    return () => {
      isMounted = false;
    };
  }, [businessId]);

  return {
    insights,
    loading,
    error,
  };
}
