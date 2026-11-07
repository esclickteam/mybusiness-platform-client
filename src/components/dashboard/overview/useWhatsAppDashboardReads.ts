import { useEffect, useState } from "react";

import {
  getWhatsAppOverview,
  listWhatsAppCampaigns,
  type WhatsAppCampaign,
  type WhatsAppOverview,
} from "@/api/whatsappApi";

type WhatsAppReadState = {
  status: "idle" | "loading" | "ready" | "error";
  overview: ({ success: boolean } & WhatsAppOverview) | null;
  campaigns: WhatsAppCampaign[] | null;
  message: string | null;
};

const IDLE: WhatsAppReadState = {
  status: "idle",
  overview: null,
  campaigns: null,
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
    setState({ status: "loading", overview: null, campaigns: null, message: null });

    Promise.all([
      getWhatsAppOverview(businessId),
      listWhatsAppCampaigns(businessId),
    ])
      .then(([overview, campaigns]) => {
        if (cancelled) return;
        setState({
          status: "ready",
          overview,
          campaigns,
          message: null,
        });
      })
      .catch((error: { response?: { data?: { error?: string } }; message?: string }) => {
        if (cancelled) return;
        setState({
          status: "error",
          overview: null,
          campaigns: null,
          message:
            error?.response?.data?.error ||
            error?.message ||
            "Failed to load WhatsApp",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, enabled]);

  return state;
}
