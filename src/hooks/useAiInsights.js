import { useEffect, useState } from "react";
import API from "@api";

export default function useAiInsights(businessId) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!businessId) return;

    const loadInsights = async () => {
      try {
        const res = await API.post("/ai/insights", { businessId });
        setInsights(res.data || []);
      } catch (err) {
        console.error("Failed to load AI insights", err);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [businessId]);

  return { insights, loading };
}
