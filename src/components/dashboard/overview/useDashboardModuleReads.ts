import { useEffect, useState } from "react";

import { getAutomationStats, type AutomationStats } from "@/api/automationWorkflowApi";
import {
  getMetaCampaignsOverview,
  type MetaCampaignsOverview,
} from "@/api/metaCampaignsApi";
import { listMySites, type MySiteSummary } from "@/api/mySitesApi";
import {
  fetchFunnel,
  fetchWorkspaceLeads,
} from "@/pages/business/dashboardPages/crmpages/workspace/crmWorkspaceApi";

type Slice<T> = {
  status: "idle" | "loading" | "ready" | "error";
  data: T | null;
  message: string | null;
};

function idle<T>(): Slice<T> {
  return { status: "idle", data: null, message: null };
}

function loading<T>(): Slice<T> {
  return { status: "loading", data: null, message: null };
}

function readError(error: unknown) {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
    message?: string;
  };
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Failed to load"
  );
}

export type LeadModuleData = {
  total: number | null;
  funnel: Array<{ key: string; label: string; count: number; amount: number }>;
};

type ModuleReads = {
  leads: Slice<LeadModuleData>;
  sites: Slice<MySiteSummary[]>;
  meta: Slice<MetaCampaignsOverview>;
  automations: Slice<AutomationStats | null>;
};

const INITIAL: ModuleReads = {
  leads: idle(),
  sites: idle(),
  meta: idle(),
  automations: idle(),
};

export function useDashboardModuleReads(input: {
  businessId?: string;
  leads: boolean;
  website: boolean;
  meta: boolean;
  automations: boolean;
  since?: string;
  until?: string;
}) {
  const [state, setState] = useState<ModuleReads>(INITIAL);
  const { businessId, leads, website, meta, automations, since, until } = input;

  useEffect(() => {
    if (!businessId || !leads) {
      setState((current) => ({ ...current, leads: idle() }));
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, leads: loading() }));
    Promise.all([
      fetchFunnel(),
      fetchWorkspaceLeads({ page: 1, limit: 1 }),
    ])
      .then(([funnel, leadsPage]) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          leads: {
            status: "ready",
            message: null,
            data: {
              total: Number.isFinite(leadsPage.total) ? leadsPage.total : null,
              funnel: funnel.funnel || [],
            },
          },
        }));
      })
      .catch((error) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          leads: { status: "error", data: null, message: readError(error) },
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, leads]);

  useEffect(() => {
    if (!businessId || !website) {
      setState((current) => ({ ...current, sites: idle() }));
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, sites: loading() }));
    listMySites(businessId)
      .then((sites) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          sites: { status: "ready", data: sites, message: null },
        }));
      })
      .catch((error) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          sites: { status: "error", data: null, message: readError(error) },
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, website]);

  useEffect(() => {
    if (!businessId || !meta) {
      setState((current) => ({ ...current, meta: idle() }));
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, meta: loading() }));
    getMetaCampaignsOverview(businessId, { since, until })
      .then((overview) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          meta: { status: "ready", data: overview, message: null },
        }));
      })
      .catch((error) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          meta: { status: "error", data: null, message: readError(error) },
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, meta, since, until]);

  useEffect(() => {
    if (!businessId || !automations) {
      setState((current) => ({ ...current, automations: idle() }));
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, automations: loading() }));
    getAutomationStats(businessId)
      .then((stats) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          automations: { status: "ready", data: stats || null, message: null },
        }));
      })
      .catch((error) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          automations: { status: "error", data: null, message: readError(error) },
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [automations, businessId]);

  return state;
}
