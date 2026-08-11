import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "@/api";
import { useSocket } from "../context/socketContext";

const INSIGHT_SOCKET_EVENTS = [
  "crmLeadCreated",
  "crmLeadUpdated",
  "crm-lead-created",
  "newMessage",
  "businessChatUpdated",
  "appointmentCreated",
  "appointmentUpdated",
  "appointmentDeleted",
  "crmClientCreated",
  "crmClientUpdated",
  "crmClientDeleted",
  "workHoursUpdated",
  "dashboardAnalyticsUpdated",
  "businessSiteUpdated",
];

const WINDOW_EVENTS = ["bizuply:leads-updated", "bizuply:insights-refresh"];

/**
 * Fetches AI insights for a given business id (Business._id).
 * Refetches on mount, window focus, and relevant realtime socket/window events.
 */
export default function useAiInsights(businessId) {
  const { t, i18n } = useTranslation();
  const socket = useSocket();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const language = String(i18n.language || "en").split("-")[0];
  const debounceTimerRef = useRef(null);
  const businessIdRef = useRef(businessId);
  businessIdRef.current = businessId;

  const fetchInsights = useCallback(async () => {
    const id = businessIdRef.current;
    if (!id || typeof id !== "string" || id.length !== 24) {
      setInsights([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await API.post("/ai/insights", { businessId: id, language });

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
  }, [language, t]);

  const scheduleRefetch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      void fetchInsights();
    }, 350);
  }, [fetchInsights]);

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
      scheduleRefetch();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refreshOnFocus();
      }
    };

    window.addEventListener("focus", refreshOnFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", refreshOnFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [businessId, scheduleRefetch]);

  useEffect(() => {
    if (!businessId) return undefined;

    const onWindowEvent = () => {
      scheduleRefetch();
    };

    WINDOW_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, onWindowEvent);
    });

    return () => {
      WINDOW_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, onWindowEvent);
      });
    };
  }, [businessId, scheduleRefetch]);

  useEffect(() => {
    if (!businessId || !socket) return undefined;

    const joinRoom = () => {
      try {
        socket.emit?.("joinBusinessRoom", businessId);
      } catch {
        /* ignore */
      }
    };

    if (socket.connected) {
      joinRoom();
    }

    const onRealtime = () => {
      scheduleRefetch();
    };

    socket.on?.("connect", joinRoom);
    INSIGHT_SOCKET_EVENTS.forEach((eventName) => {
      socket.on?.(eventName, onRealtime);
    });

    return () => {
      socket.off?.("connect", joinRoom);
      INSIGHT_SOCKET_EVENTS.forEach((eventName) => {
        socket.off?.(eventName, onRealtime);
      });
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [businessId, socket, scheduleRefetch]);

  return {
    insights,
    loading,
    error,
    refetch: fetchInsights,
  };
}
