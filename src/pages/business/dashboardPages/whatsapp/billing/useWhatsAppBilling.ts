import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getWhatsAppBillingUsage,
  type WhatsAppBillingUsageOverview,
} from "../../../../../api/whatsappBillingApi";
import { automationQueryKeys } from "../../automations/automationsQueryKeys";

export function useWhatsAppBilling(businessId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = businessId
    ? automationQueryKeys.whatsappBillingUsage(businessId)
    : ["whatsapp", "billingUsage", "none"];

  const query = useQuery({
    queryKey,
    enabled: Boolean(businessId),
    queryFn: async () => {
      if (!businessId) return null;
      return getWhatsAppBillingUsage(businessId);
    },
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const refresh = useCallback(async () => {
    if (!businessId) return null;
    return queryClient.fetchQuery({
      queryKey: automationQueryKeys.whatsappBillingUsage(businessId),
      queryFn: () => getWhatsAppBillingUsage(businessId),
    });
  }, [businessId, queryClient]);

  const setUsage = useCallback(
    (usage: WhatsAppBillingUsageOverview | null) => {
      if (!businessId) return;
      queryClient.setQueryData(
        automationQueryKeys.whatsappBillingUsage(businessId),
        usage
      );
    },
    [businessId, queryClient]
  );

  useEffect(() => {
    if (!businessId) {
      queryClient.setQueryData(["whatsapp", "billingUsage", "none"], null);
    }
  }, [businessId, queryClient]);

  return {
    loading: Boolean(businessId) && query.isLoading && !query.data,
    error: query.isError
      ? "לא הצלחנו לטעון את נתוני חיוב וואטסאפ כרגע."
      : null,
    usage: (query.data as WhatsAppBillingUsageOverview | null) || null,
    refresh,
    setUsage,
  };
}
