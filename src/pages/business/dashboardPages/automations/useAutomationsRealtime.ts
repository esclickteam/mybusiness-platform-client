import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../../../context/socketContext";
import {
  getAutomationBillingUsage,
  type AutomationBillingUsageOverview,
} from "../../../../api/automationBillingApi";
import { getWhatsAppBillingUsage } from "../../../../api/whatsappBillingApi";
import {
  getAutomationStats,
  listAutomationWorkflows,
  type AutomationExecution,
  type AutomationStats,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { automationQueryKeys } from "./automationsQueryKeys";

type SocketLike = {
  connected?: boolean;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
};

type ExecutionPayload = Partial<AutomationExecution> & {
  _id?: string;
  workflowId?: string;
};

type WorkflowPayload = Partial<AutomationWorkflow> & {
  _id?: string;
};

type UsageSlice = {
  used?: number;
  limit?: number;
  remaining?: number;
  percentage?: number;
  periodStart?: string;
  periodEnd?: string;
};

function sameBusiness(
  eventBusinessId: unknown,
  expectedBusinessId: string
): boolean {
  if (!eventBusinessId) return true;
  return String(eventBusinessId) === String(expectedBusinessId);
}

function patchAutomationUsage(
  prev: AutomationBillingUsageOverview | null | undefined,
  usage: UsageSlice | null | undefined,
  overview?: AutomationBillingUsageOverview | null
): AutomationBillingUsageOverview | null {
  if (overview && typeof overview === "object") {
    return overview;
  }
  if (!prev) return prev ?? null;
  if (!usage || typeof usage !== "object") return prev;

  const used = Number(usage.used ?? prev.usage?.used ?? 0) || 0;
  const limit = Number(usage.limit ?? prev.usage?.limit ?? 0) || 0;
  const remaining =
    usage.remaining != null
      ? Number(usage.remaining) || 0
      : Math.max(0, limit - used);
  const percentage =
    usage.percentage != null
      ? Number(usage.percentage) || 0
      : limit > 0
        ? Math.min(100, Math.round((used / limit) * 100))
        : 0;

  return {
    ...prev,
    usage: {
      used,
      limit,
      remaining,
      percentage,
      periodStart: usage.periodStart || prev.usage?.periodStart || "",
      periodEnd: usage.periodEnd || prev.usage?.periodEnd || "",
    },
  };
}

function upsertWorkflow(
  list: AutomationWorkflow[] | undefined,
  workflow: WorkflowPayload
): AutomationWorkflow[] | undefined {
  if (!list || !workflow?._id) return list;
  const id = String(workflow._id);
  let found = false;
  const next = list.map((row) => {
    if (String(row._id) !== id) return row;
    found = true;
    return { ...row, ...workflow, _id: row._id } as AutomationWorkflow;
  });
  return found ? next : list;
}

function bumpStatsForExecution(
  stats: AutomationStats | null | undefined,
  execution: ExecutionPayload,
  mode: "created" | "updated"
): AutomationStats | null | undefined {
  if (!stats) return stats;
  const status = String(execution.status || "").toLowerCase();
  const next = { ...stats };

  if (mode === "created") {
    next.runsLast30Days = (next.runsLast30Days || 0) + 1;
    if (status === "failed") {
      next.failedLast30Days = (next.failedLast30Days || 0) + 1;
    } else if (status === "success" || status === "completed") {
      next.successLast30Days = (next.successLast30Days || 0) + 1;
    }
    return next;
  }

  // Updated: prefer quiet API refresh for accuracy; keep optimistic only for terminal.
  return stats;
}

/**
 * Live Automations dashboard updates over the existing Auth socket.
 * Does not open a second WebSocket and does not poll.
 */
export function useAutomationsRealtime(businessId: string | null) {
  const socket = useSocket() as SocketLike | null;
  const queryClient = useQueryClient();
  const businessIdRef = useRef(businessId);
  const didConnectRef = useRef(false);
  businessIdRef.current = businessId;

  useEffect(() => {
    if (!businessId || !socket) return;
    didConnectRef.current = false;

    const joinRoom = () => {
      socket.emit("joinBusinessRoom", businessId);
    };

    const quietInvalidateAutomations = () => {
      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.workflows(businessId),
        refetchType: "active",
      });
      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.stats(businessId),
        refetchType: "active",
      });
      void queryClient.invalidateQueries({
        queryKey: ["automations", "executions", businessId],
        refetchType: "active",
      });
    };

    const refetchSafetyNet = () => {
      const biz = businessIdRef.current;
      if (!biz) return;
      void queryClient.fetchQuery({
        queryKey: automationQueryKeys.workflows(biz),
        queryFn: () => listAutomationWorkflows(biz),
      });
      void queryClient.fetchQuery({
        queryKey: automationQueryKeys.stats(biz),
        queryFn: () => getAutomationStats(biz),
      });
      void queryClient.fetchQuery({
        queryKey: automationQueryKeys.billingUsage(biz),
        queryFn: () => getAutomationBillingUsage(biz),
      });
      void queryClient.fetchQuery({
        queryKey: automationQueryKeys.whatsappBillingUsage(biz),
        queryFn: () => getWhatsAppBillingUsage(biz),
      });
      void queryClient.invalidateQueries({
        queryKey: ["automations", "executions", biz],
        refetchType: "active",
      });
    };

    const onExecutionCreated = (payload: any) => {
      const data = payload?.execution ? payload : { execution: payload };
      if (!sameBusiness(data?.businessId || data?.execution?.businessId, businessId)) {
        return;
      }
      const execution = (data.execution || {}) as ExecutionPayload;

      queryClient.setQueryData<AutomationStats | null>(
        automationQueryKeys.stats(businessId),
        (prev) => bumpStatsForExecution(prev, execution, "created") ?? prev
      );

      if (execution.workflowId) {
        const key = automationQueryKeys.executions(
          businessId,
          String(execution.workflowId)
        );
        queryClient.setQueryData<AutomationExecution[]>(key, (prev) => {
          if (!Array.isArray(prev)) return prev;
          const execId = String(
            execution.executionId || execution._id || ""
          );
          if (!execId) return prev;
          if (
            prev.some(
              (row) =>
                String(row.executionId || row._id) === execId
            )
          ) {
            return prev;
          }
          return [
            {
              ...(execution as AutomationExecution),
              executionId: execId,
            },
            ...prev,
          ];
        });
      }

      quietInvalidateAutomations();
    };

    const onExecutionUpdated = (payload: any) => {
      const data = payload?.execution ? payload : { execution: payload };
      if (!sameBusiness(data?.businessId || data?.execution?.businessId, businessId)) {
        return;
      }
      const execution = (data.execution || {}) as ExecutionPayload;
      const execId = String(execution.executionId || execution._id || "");

      if (execution.workflowId && execId) {
        const key = automationQueryKeys.executions(
          businessId,
          String(execution.workflowId)
        );
        queryClient.setQueryData<AutomationExecution[]>(key, (prev) => {
          if (!Array.isArray(prev)) return prev;
          return prev.map((row) =>
            String(row.executionId || row._id) === execId
              ? ({ ...row, ...execution, executionId: row.executionId } as AutomationExecution)
              : row
          );
        });
      }

      quietInvalidateAutomations();
    };

    
    const onAiResultCreated = (payload: any) => {
      const data = payload?.result ? payload : { result: payload };
      if (!sameBusiness(data?.businessId || data?.result?.businessId, businessId)) {
        return;
      }
      void queryClient.invalidateQueries({
        queryKey: ["automations", "ai-results", businessId],
        refetchType: "active",
      });
    };

    const onWorkflowUpdated = (payload: any) => {
      const data = payload?.workflow ? payload : { workflow: payload };
      if (!sameBusiness(data?.businessId || data?.workflow?.businessId, businessId)) {
        return;
      }
      const workflow = (data.workflow || {}) as WorkflowPayload;
      queryClient.setQueryData<AutomationWorkflow[]>(
        automationQueryKeys.workflows(businessId),
        (prev) => upsertWorkflow(prev, workflow) ?? prev
      );
      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.stats(businessId),
        refetchType: "active",
      });
    };

    const onAutomationUsageUpdated = (payload: any) => {
      if (!sameBusiness(payload?.businessId, businessId)) return;
      const overview = payload?.overview as
        | AutomationBillingUsageOverview
        | undefined;
      const usage = payload?.usage as UsageSlice | undefined;

      if (overview || usage) {
        queryClient.setQueryData<AutomationBillingUsageOverview | null>(
          automationQueryKeys.billingUsage(businessId),
          (prev) => patchAutomationUsage(prev, usage, overview)
        );
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.billingUsage(businessId),
        refetchType: "active",
      });
    };

    const onWhatsAppUsageUpdated = (payload: any) => {
      if (!sameBusiness(payload?.businessId, businessId)) return;
      const overview = payload?.overview;
      if (overview && typeof overview === "object") {
        queryClient.setQueryData(
          automationQueryKeys.whatsappBillingUsage(businessId),
          overview
        );
        return;
      }
      void queryClient.invalidateQueries({
        queryKey: automationQueryKeys.whatsappBillingUsage(businessId),
        refetchType: "active",
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refetchSafetyNet();
      }
    };

    const onConnect = () => {
      joinRoom();
      // Initial mount connect already has API data; refetch only on reconnect.
      if (didConnectRef.current) {
        refetchSafetyNet();
      }
      didConnectRef.current = true;
    };

    if (socket.connected) {
      joinRoom();
      didConnectRef.current = true;
    }

    socket.on("connect", onConnect);
    socket.on("automation:execution_created", onExecutionCreated);
    socket.on("automation:execution_updated", onExecutionUpdated);
    socket.on("automation:workflow_updated", onWorkflowUpdated);
    socket.on("automation:ai_result_created", onAiResultCreated);
    socket.on("automation:usage_updated", onAutomationUsageUpdated);
    socket.on("whatsapp:usage_updated", onWhatsAppUsageUpdated);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      socket.off("connect", onConnect);
      socket.off("automation:execution_created", onExecutionCreated);
      socket.off("automation:execution_updated", onExecutionUpdated);
      socket.off("automation:workflow_updated", onWorkflowUpdated);
      socket.off("automation:ai_result_created", onAiResultCreated);
      socket.off("automation:usage_updated", onAutomationUsageUpdated);
      socket.off("whatsapp:usage_updated", onWhatsAppUsageUpdated);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [businessId, socket, queryClient]);
}
