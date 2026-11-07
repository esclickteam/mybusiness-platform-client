import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import API from "@/api";

import { buildDefaultFilters, getComparisonRange, getPresetRange } from "@/components/dashboard/overview/dashboardOverviewUtils";
import type {
  DashboardFilters,
  DashboardOverviewData,
} from "@/components/dashboard/overview/dashboardOverviewTypes";

type UseDashboardOverviewOptions = {
  businessId?: string;
  enabled?: boolean;
  refreshToken?: number;
};

export function useDashboardOverview({
  businessId,
  enabled = true,
  refreshToken = 0,
}: UseDashboardOverviewOptions) {
  const [filters, setFilters] = useState<DashboardFilters>(buildDefaultFilters);
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasDataRef = useRef(false);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        businessId,
        filters,
        refreshToken,
      }),
    [businessId, filters, refreshToken]
  );

  const fetchDashboard = useCallback(async () => {
    if (!businessId || !enabled) return;

    if (!hasDataRef.current) setLoading(true);

    try {
      const range =
        filters.preset === "custom"
          ? {
              startDate: filters.startDate,
              endDate: filters.endDate,
            }
          : getPresetRange(filters.preset);

      const comparisonRange = filters.compareToPrevious
        ? getComparisonRange(
            filters.startDate || range.startDate,
            filters.endDate || range.endDate
          )
        : {
            comparisonStartDate: filters.startDate || range.startDate,
            comparisonEndDate: filters.endDate || range.endDate,
          };

      const response = await API.get("/analytics/dashboard", {
        params: {
          businessId,
          startDate: filters.startDate || range.startDate,
          endDate: filters.endDate || range.endDate,
          comparisonStartDate: comparisonRange.comparisonStartDate,
          comparisonEndDate: comparisonRange.comparisonEndDate,
          resolution: filters.resolution,
          performanceMetric: filters.performanceMetric,
        },
      });

      const next = response.data as DashboardOverviewData;
      setData((current) => {
        if (current && JSON.stringify(current) === JSON.stringify(next)) return current;
        return next;
      });
      hasDataRef.current = true;
      setError(null);
    } catch (err: any) {
      console.error("Dashboard analytics fetch failed:", err);
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to load dashboard analytics"
      );
    } finally {
      setLoading(false);
    }
  }, [businessId, enabled, filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard, queryKey]);

  const updateFilters = useCallback((patch: Partial<DashboardFilters>) => {
    setFilters((current) => {
      const next = { ...current, ...patch };

      if (patch.preset && patch.preset !== "custom") {
        const range = getPresetRange(patch.preset);
        next.startDate = range.startDate;
        next.endDate = range.endDate;
      }

      return next;
    });
  }, []);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refetch: fetchDashboard,
  };
}
