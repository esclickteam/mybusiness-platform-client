import { useEffect, useState } from "react";
import API from "@api";

/**
 * useAiInsights
 * Fetches AI insights for a given business
 *
 * @param {string} businessId
 */
export default function useAiInsights(businessId) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!businessId) return;

    let isMounted = true;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.post("/ai/insights", {
          businessId,
        });

        // 🔍 Debug – חובה לשלב זה
        console.log("AI INSIGHTS RESPONSE:", res.data);

        if (!isMounted) return;

        // ודא שמוחזר מערך
        if (Array.isArray(res.data)) {
          setInsights(res.data);
        } else if (Array.isArray(res.data.insights)) {
          setInsights(res.data.insights);
        } else {
          setInsights([]);
        }
      } catch (err) {
        console.error("Failed to fetch AI insights:", err);
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
