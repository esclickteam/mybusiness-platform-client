import { useCallback, useEffect, useState } from "react";
import {
  getAutomationBillingUsage,
  type AutomationBillingUsageOverview,
} from "../../../../../api/automationBillingApi";

type State = {
  loading: boolean;
  error: string | null;
  usage: AutomationBillingUsageOverview | null;
};

export function useAutomationBilling(businessId: string | null) {
  const [state, setState] = useState<State>({
    loading: Boolean(businessId),
    error: null,
    usage: null,
  });

  const refresh = useCallback(async () => {
    if (!businessId) {
      setState({ loading: false, error: null, usage: null });
      return null;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const usage = await getAutomationBillingUsage(businessId);
      setState({ loading: false, error: null, usage });
      return usage;
    } catch {
      setState((prev) => ({
        loading: false,
        error: "לא הצלחנו לטעון את נתוני החבילה כרגע.",
        usage: prev.usage,
      }));
      return null;
    }
  }, [businessId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ...state,
    refresh,
    setUsage: (usage: AutomationBillingUsageOverview | null) =>
      setState((prev) => ({ ...prev, usage })),
  };
}