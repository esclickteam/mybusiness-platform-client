import { useEffect, useState } from "react";

import {
  getWhatsAppAccountHealth,
  getWhatsAppOverview,
  listWhatsAppCampaigns,
  listWhatsAppConversations,
  type WhatsAppAccountHealth,
  type WhatsAppCampaign,
  type WhatsAppConversation,
  type WhatsAppOverview,
} from "@/api/whatsappApi";

type WhatsAppReadState = {
  status: "idle" | "loading" | "ready" | "error";
  overview: ({ success: boolean } & WhatsAppOverview) | null;
  campaigns: WhatsAppCampaign[] | null;
  health: WhatsAppAccountHealth | null;
  conversations: WhatsAppConversation[] | null;
  message: string | null;
};

const IDLE: WhatsAppReadState = {
  status: "idle",
  overview: null,
  campaigns: null,
  health: null,
  conversations: null,
  message: null,
};

export function useWhatsAppDashboardReads(businessId?: string, enabled = false) {
  const [state, setState] = useState<WhatsAppReadState>(IDLE);

  useEffect(() => {
    if (!businessId || !enabled) {
      setState(IDLE);
      return;
    }

    let cancelled = false;
    setState({
      status: "loading",
      overview: null,
      campaigns: null,
      health: null,
      conversations: null,
      message: null,
    });

    Promise.allSettled([
      getWhatsAppOverview(businessId),
      listWhatsAppCampaigns(businessId),
      getWhatsAppAccountHealth(businessId),
      listWhatsAppConversations(businessId),
    ]).then((results) => {
      if (cancelled) return;
      const [overview, campaigns, health, conversations] = results;
      const overviewOk = overview.status === "fulfilled";
      const campaignsOk = campaigns.status === "fulfilled";
      if (!overviewOk && !campaignsOk) {
        const reason = overview.status === "rejected" ? overview.reason : campaigns.status === "rejected" ? campaigns.reason : null;
        const error = reason as { response?: { data?: { error?: string } }; message?: string } | null;
        setState({
          status: "error",
          overview: null,
          campaigns: null,
          health: null,
          conversations: null,
          message: error?.response?.data?.error || error?.message || "Failed to load WhatsApp",
        });
        return;
      }
      setState({
        status: "ready",
        overview: overviewOk ? overview.value : null,
        campaigns: campaignsOk ? campaigns.value : null,
        health: health.status === "fulfilled" ? health.value : null,
        conversations: conversations.status === "fulfilled" ? conversations.value : null,
        message: null,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [businessId, enabled]);

  return state;
}
