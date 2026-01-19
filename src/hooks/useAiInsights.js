import { useEffect, useState } from "react";
import API from "@api";

/**
 * useAiInsights
 * Fetches AI insights for a given BUSINESS id (Business._id)
 *
 * @param {string} businessId  // חייב להיות Business._id
 */
export default function useAiInsights(businessId) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ❌ אין businessId → לא טוענים
    if (!businessId) {
      console.warn("⚠️ useAiInsights: missing businessId");
      setInsights([]);
      return;
    }

    // 🛑 הגנה מבאג נפוץ: userId במקום businessId
    if (typeof businessId !== "string" || businessId.length !== 24) {
      console.error(
        "❌ useAiInsights: invalid businessId (not Business._id)",
        businessId
      );
      setInsights([]);
      return;
    }

    let isMounted = true;

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🚀 Fetching AI insights for businessId:", businessId);

        const res = await API.post("/ai/insights", {
          businessId, // ✅ Business._id בלבד
        });

        if (!isMounted) return;

        console.log("🧠 AI INSIGHTS RESPONSE:", res.data);

        if (Array.isArray(res.data)) {
          setInsights(res.data);
        } else if (Array.isArray(res.data?.insights)) {
          setInsights(res.data.insights);
        } else {
          setInsights([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch AI insights:", err);
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
