import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ChevronLeft, Loader2, RefreshCw, Search } from "lucide-react";
import {
  AUTOMATION_PREVIEW_ACTION_TOOLTIP,
  AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE,
  isAutomationsReadOnly,
  listAutomationExecutions,
  listAutomationWorkflows,
  retryAutomationExecution,
  type AutomationExecution,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import {
  getTriggerLabel,
  readAutomationErrorMessage,
} from "./automationUiHelpers";
import AutomationExecutionDetailDrawer from "./AutomationExecutionDetailDrawer";
import { automationQueryKeys } from "./automationsQueryKeys";
import {
  formatDurationMs,
  formatExecutionDateTime,
  getExecutionDurationMs,
  getExecutionStatusLabel,
  getExecutionStatusTone,
  getStepsSummary,
  getTriggerSummary,
  matchesDateRangeFilter,
  matchesExecutionStatusFilter,
  type DateRangeFilter,
  type ExecutionStatusFilter,
} from "./runsUiHelpers";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

type RunRow = AutomationExecution & {
  workflowName: string;
  workflowTriggerLabel: string;
};

const PER_WORKFLOW_LIMIT = 30;
const MAX_WORKFLOWS_FOR_ALL = 40;

/**
 * Phase 5: professional Execution History (Make / n8n style).
 * Reuses existing list/get execution APIs — no engine/schema changes.
 */
function runStatusKey(status?: string | null) {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "success":
      return "success";
    case "failed":
    case "error":
      return "failed";
    case "running":
      return "running";
    case "waiting":
    case "pending":
      return "pending";
    case "cancelled":
    case "canceled":
      return "cancelled";
    default:
      return "";
  }
}

export default function AutomationsRunsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();

  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(
    null
  );

  const workflowFilter = searchParams.get("workflow") || "";
  const statusFilter = (searchParams.get("status") ||
    "all") as ExecutionStatusFilter;
  const dateFilter = (searchParams.get("range") || "all") as DateRangeFilter;
  const query = searchParams.get("q") || "";

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (!value || value === "all" || value === "") next.delete(key);
        else next.set(key, value);
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const runsQueryKey = businessId
    ? ([
        ...automationQueryKeys.executions(businessId, workflowFilter || "all"),
        "runsPage",
      ] as const)
    : (["automations", "executions", "none", "runsPage"] as const);

  const runsQuery = useQuery({
    queryKey: runsQueryKey,
    enabled: Boolean(businessId),
    queryFn: async () => {
      if (!businessId) {
        return { workflows: [] as AutomationWorkflow[], rows: [] as RunRow[] };
      }
      const list = await listAutomationWorkflows(businessId);
      queryClient.setQueryData(
        automationQueryKeys.workflows(businessId),
        list
      );

      const sorted = [...list].sort((a, b) => {
        const aTs = new Date(
          a.lastExecution?.startedAt || a.lastRunAt || a.updatedAt || 0
        ).getTime();
        const bTs = new Date(
          b.lastExecution?.startedAt || b.lastRunAt || b.updatedAt || 0
        ).getTime();
        return bTs - aTs;
      });

      const targets = workflowFilter
        ? sorted.filter((workflow) => workflow._id === workflowFilter)
        : sorted.slice(0, MAX_WORKFLOWS_FOR_ALL);

      const batches = await Promise.all(
        targets.map(async (workflow) => {
          try {
            const executions = await listAutomationExecutions(
              businessId,
              workflow._id,
              PER_WORKFLOW_LIMIT
            );
            queryClient.setQueryData(
              automationQueryKeys.executions(businessId, workflow._id),
              executions
            );
            return executions.map((execution) => {
              const row: RunRow = {
                ...execution,
                workflowName: workflow.name || t("automations.runs.automation"),
                workflowTriggerLabel: getTriggerLabel(workflow),
              };
              return row;
            });
          } catch {
            return [] as RunRow[];
          }
        })
      );

      const merged = batches
        .flat()
        .sort((a, b) => {
          const aTs = new Date(a.startedAt || a.createdAt || 0).getTime();
          const bTs = new Date(b.startedAt || b.createdAt || 0).getTime();
          return bTs - aTs;
        });

      return { workflows: list, rows: merged };
    },
    staleTime: 8_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  const workflows = runsQuery.data?.workflows || [];
  const rows = runsQuery.data?.rows || [];
  const loading = Boolean(businessId) && runsQuery.isLoading && !runsQuery.data;
  const refreshing = runsQuery.isFetching && Boolean(runsQuery.data);
  const error = runsQuery.isError
    ? readAutomationErrorMessage(runsQuery.error, t("automations.runs.loadError"))
    : "";

  const load = useCallback(async () => {
    if (!businessId) return;
    await runsQuery.refetch();
  }, [businessId, runsQuery]);

  useEffect(() => {
    if (!runsQuery.isError) return;
    toast.error(
      readAutomationErrorMessage(runsQuery.error, t("automations.runs.loadError"))
    );
  }, [runsQuery.isError, runsQuery.error]);

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (!matchesExecutionStatusFilter(row.status, statusFilter)) return false;
      if (
        !matchesDateRangeFilter(row.startedAt || row.createdAt, dateFilter)
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        row.workflowName,
        row.workflowTriggerLabel,
        row.eventType,
        row.executionId,
        row.error,
        row.errorCode,
        getTriggerSummary(row),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, statusFilter, dateFilter, query]);

  const selectedRow = selectedExecutionId
    ? rows.find((row) => row.executionId === selectedExecutionId) || null
    : null;

  const handleRetry = async (executionId: string) => {
    if (!businessId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    try {
      await retryAutomationExecution(businessId, executionId);
      toast.success(t("automations.runs.retrySuccess"));
      await load();
    } catch (err: unknown) {
      toast.error(readAutomationErrorMessage(err, t("automations.runs.retryError")));
    }
  };

  return (
    <div className="ax-page">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">{t("automations.runs.title")}</h1>
          <p className="ax-home__subtitle">
            {t("automations.runs.subtitle")}
          </p>
        </div>
        <button
          type="button"
          className="ax-btn ax-btn--secondary"
          onClick={() => void load()}
          disabled={loading || refreshing}
        >
          <RefreshCw size={14} className={refreshing ? "ax-spin" : undefined} />
          {t("automations.runs.refresh")}
        </button>
      </header>

      <div className="ax-runs-filters">
        <label className="ax-sort">
          <span>{t("automations.runs.automation")}</span>
          <select
            value={workflowFilter}
            onChange={(event) =>
              patchParams({ workflow: event.target.value || null })
            }
          >
            <option value="">{t("automations.runs.allAutomations")}</option>
            {workflows.map((workflow) => (
              <option key={workflow._id} value={workflow._id}>
                {workflow.name || t("automations.runs.automation")}
              </option>
            ))}
          </select>
        </label>

        <label className="ax-sort">
          <span>{t("automations.runs.status")}</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              patchParams({
                status: event.target.value as ExecutionStatusFilter,
              })
            }
          >
            <option value="all">{t("automations.runs.all")}</option>
            <option value="completed">{t("automations.runs.success")}</option>
            <option value="failed">{t("automations.runs.failed")}</option>
            <option value="running">{t("automations.runs.running")}</option>
            <option value="cancelled">{t("automations.runs.cancelled")}</option>
          </select>
        </label>

        <label className="ax-sort">
          <span>{t("automations.runs.date")}</span>
          <select
            value={dateFilter}
            onChange={(event) =>
              patchParams({ range: event.target.value as DateRangeFilter })
            }
          >
            <option value="all">{t("automations.runs.all")}</option>
            <option value="24h">{t("automations.runs.last24h")}</option>
            <option value="7d">{t("automations.runs.last7d")}</option>
            <option value="30d">{t("automations.runs.last30d")}</option>
          </select>
        </label>

        <label className="ax-search ax-search--runs">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) =>
              patchParams({ q: event.target.value || null })
            }
            placeholder={t("automations.runs.searchPlaceholder")}
          />
        </label>
      </div>

      {!workflowFilter ? (
        <p className="ax-runs-note">
          {t("automations.runs.note", {
            per: PER_WORKFLOW_LIMIT,
            max: MAX_WORKFLOWS_FOR_ALL,
          })}
        </p>
      ) : null}

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          {t("automations.runs.loading")}
        </div>
      ) : error ? (
        <div className="ax-empty ax-empty--card">
          <strong>{t("automations.runs.loadErrorTitle")}</strong>
          <p>{error}</p>
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={() => void load()}
          >
            {t("automations.runs.retry")}
          </button>
        </div>
      ) : workflows.length === 0 || visibleRows.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>{t("automations.runs.emptyTitle")}</strong>
          <p>{t("automations.runs.emptyText")}</p>
          <Link to=".." className="ax-btn ax-btn--primary">
            {t("automations.runs.backToAutomations")}
          </Link>
        </div>
      ) : (
        <>
          <div className="ax-table-wrap ax-runs-table-wrap">
            <table className="ax-table ax-runs-table">
              <thead>
                <tr>
                  <th>{t("automations.runs.automation")}</th>
                  <th>{t("automations.runs.started")}</th>
                  <th>{t("automations.runs.duration")}</th>
                  <th>{t("automations.runs.status")}</th>
                  <th>{t("automations.runs.trigger")}</th>
                  <th>{t("automations.runs.steps")}</th>
                  <th>{t("automations.runs.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const tone = getExecutionStatusTone(row.status);
                  return (
                    <tr
                      key={row.executionId}
                      className="ax-table__row"
                      onClick={() => setSelectedExecutionId(row.executionId)}
                    >
                      <td>
                        <strong className="ax-table__name">
                          {row.workflowName}
                        </strong>
                        <div className="ax-table__muted">
                          {row.workflowTriggerLabel}
                        </div>
                      </td>
                      <td className="ax-table__muted">
                        {formatExecutionDateTime(
                          row.startedAt || row.createdAt
                        )}
                      </td>
                      <td className="ax-table__muted">
                        {formatDurationMs(getExecutionDurationMs(row))}
                      </td>
                      <td>
                        <span className={`ax-result ax-result--${tone}`}>
                          {tone === "success" ? "✓ " : ""}
                          {tone === "failed" ? "✕ " : ""}
                          {runStatusKey(row.status)
                            ? t(`automations.runs.${runStatusKey(row.status)}`)
                            : getExecutionStatusLabel(row.status)}
                        </span>
                      </td>
                      <td className="ax-table__muted">
                        {getTriggerSummary(row)}
                      </td>
                      <td className="ax-table__muted">
                        {getStepsSummary(row)}
                      </td>
                      <td
                        className="ax-table__actions-col"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="ax-runs-actions">
                          {row.status === "failed" ? (
                            <button
                              type="button"
                              className="ax-btn ax-btn--secondary"
                              disabled={readOnly}
                              title={writeBlockedTitle}
                              onClick={() => void handleRetry(row.executionId)}
                            >
                              {t("automations.runs.retry")}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="ax-runs-open"
                            onClick={() =>
                              setSelectedExecutionId(row.executionId)
                            }
                            aria-label={t("automations.runs.openDetails")}
                          >
                            <ChevronLeft size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="ax-mobile-list ax-runs-mobile">
            {visibleRows.map((row) => {
              const tone = getExecutionStatusTone(row.status);
              return (
                <article
                  key={row.executionId}
                  className="ax-mobile-card"
                  onClick={() => setSelectedExecutionId(row.executionId)}
                >
                  <div className="ax-mobile-card__top">
                    <div className="min-w-0">
                      <h3 className="ax-mobile-card__name">
                        {row.workflowName}
                      </h3>
                      <p className="ax-mobile-card__meta">
                        {formatExecutionDateTime(
                          row.startedAt || row.createdAt
                        )}{" "}
                        · {formatDurationMs(getExecutionDurationMs(row))}
                      </p>
                    </div>
                    <span className={`ax-result ax-result--${tone}`}>
                      {runStatusKey(row.status)
                        ? t(`automations.runs.${runStatusKey(row.status)}`)
                        : getExecutionStatusLabel(row.status)}
                    </span>
                  </div>
                  <div className="ax-mobile-card__bottom">
                    <span className="ax-table__muted">
                      {getTriggerSummary(row)} · {getStepsSummary(row)}
                    </span>
                    <button
                      type="button"
                      className="ax-btn ax-btn--secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`../${row.workflowId}`);
                      }}
                    >
                      {t("automations.runs.open")}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {businessId && selectedExecutionId ? (
        <AutomationExecutionDetailDrawer
          businessId={businessId}
          executionId={selectedExecutionId}
          workflowName={selectedRow?.workflowName}
          onClose={() => setSelectedExecutionId(null)}
        />
      ) : null}
    </div>
  );
}
