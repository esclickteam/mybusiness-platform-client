import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAutomationBillingUsage,
  type AutomationBillingUsageOverview,
} from "../../../../../api/automationBillingApi";
import { automationQueryKeys } from "../automationsQueryKeys";

export function useAutomationBilling(businessId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = businessId
    ? automationQueryKeys.billingUsage(businessId)
    : ["automations", "billingUsage", "none"];

  const query = useQuery({
    queryKey,
    enabled: Boolean(businessId),
    queryFn: async () => {
      if (!businessId) return null;
      return getAutomationBillingUsage(businessId);
    },
    staleTime: 15_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const refresh = useCallback(async () => {
    if (!businessId) return null;
    const result = await queryClient.fetchQuery({
      queryKey: automationQueryKeys.billingUsage(businessId),
      queryFn: () => getAutomationBillingUsage(businessId),
    });
    return result;
  }, [businessId, queryClient]);

  const setUsage = useCallback(
    (usage: AutomationBillingUsageOverview | null) => {
      if (!businessId) return;
      queryClient.setQueryData(
        automationQueryKeys.billingUsage(businessId),
        usage
      );
    },
    [businessId, queryClient]
  );

  useEffect(() => {
    if (!businessId) {
      queryClient.setQueryData(["automations", "billingUsage", "none"], null);
    }
  }, [businessId, queryClient]);

  return {
    loading: Boolean(businessId) && query.isLoading && !query.data,
    error: query.isError
      ? "לא הצלחנו לטעון את נתוני החבילה כרגע."
      : null,
    usage: (query.data as AutomationBillingUsageOverview | null) || null,
    refresh,
    setUsage,
  };
}
