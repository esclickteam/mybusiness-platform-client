import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
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
export default function AutomationsRunsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [rows, setRows] = useState<RunRow[]>([]);
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

  const load = useCallback(
    async (opts?: { quiet?: boolean }) => {
      if (!businessId) return;
      if (opts?.quiet) setRefreshing(true);
      else setLoading(true);
      setError("");

      try {
        const list = await listAutomationWorkflows(businessId);
        setWorkflows(list);

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
              return executions.map((execution) => {
                const row: RunRow = {
                  ...execution,
                  workflowName: workflow.name || "אוטומציה",
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
            const aTs = new Date(
              a.startedAt || a.createdAt || 0
            ).getTime();
            const bTs = new Date(
              b.startedAt || b.createdAt || 0
            ).getTime();
            return bTs - aTs;
          });
        setRows(merged);
      } catch (err: unknown) {
        setRows([]);
        setError(readAutomationErrorMessage(err, "שגיאה בטעינת הרצות"));
        toast.error(readAutomationErrorMessage(err, "שגיאה בטעינת הרצות"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [businessId, workflowFilter]
  );

  useEffect(() => {
    void load();
  }, [load]);

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
      toast.success("ההרצה נשלחה לניסיון חוזר");
      await load({ quiet: true });
    } catch (err: unknown) {
      toast.error(readAutomationErrorMessage(err, "שגיאה בניסיון חוזר"));
    }
  };

  return (
    <div className="ax-page">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">הרצות</h1>
          <p className="ax-home__subtitle">
            צפה בהיסטוריית ההרצות, סטטוסים ושגיאות של האוטומציות שלך
          </p>
        </div>
        <button
          type="button"
          className="ax-btn ax-btn--secondary"
          onClick={() => void load({ quiet: true })}
          disabled={loading || refreshing}
        >
          <RefreshCw size={14} className={refreshing ? "ax-spin" : undefined} />
          רענון
        </button>
      </header>

      <div className="ax-runs-filters">
        <label className="ax-sort">
          <span>אוטומציה</span>
          <select
            value={workflowFilter}
            onChange={(event) =>
              patchParams({ workflow: event.target.value || null })
            }
          >
            <option value="">כל האוטומציות</option>
            {workflows.map((workflow) => (
              <option key={workflow._id} value={workflow._id}>
                {workflow.name || "אוטומציה"}
              </option>
            ))}
          </select>
        </label>

        <label className="ax-sort">
          <span>סטטוס</span>
          <select
            value={statusFilter}
            onChange={(event) =>
              patchParams({
                status: event.target.value as ExecutionStatusFilter,
              })
            }
          >
            <option value="all">הכל</option>
            <option value="completed">הצלחה</option>
            <option value="failed">נכשלה</option>
            <option value="running">בתהליך</option>
            <option value="cancelled">בוטלה</option>
          </select>
        </label>

        <label className="ax-sort">
          <span>תאריך</span>
          <select
            value={dateFilter}
            onChange={(event) =>
              patchParams({ range: event.target.value as DateRangeFilter })
            }
          >
            <option value="all">הכל</option>
            <option value="24h">24 שעות</option>
            <option value="7d">7 ימים</option>
            <option value="30d">30 ימים</option>
          </select>
        </label>

        <label className="ax-search ax-search--runs">
          <Search size={14} />
          <input
            value={query}
            onChange={(event) =>
              patchParams({ q: event.target.value || null })
            }
            placeholder="חיפוש לפי שם, טריגר או מזהה הרצה"
          />
        </label>
      </div>

      {!workflowFilter ? (
        <p className="ax-runs-note">
          מציג עד {PER_WORKFLOW_LIMIT} הרצות אחרונות לכל אוטומציה (עד{" "}
          {MAX_WORKFLOWS_FOR_ALL} אוטומציות). ה-API תומך ב-limit בלבד — אין
          cursor/pagination עדיין.
        </p>
      ) : null}

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען הרצות...
        </div>
      ) : error ? (
        <div className="ax-empty ax-empty--card">
          <strong>שגיאה בטעינה</strong>
          <p>{error}</p>
          <button
            type="button"
            className="ax-btn ax-btn--primary"
            onClick={() => void load()}
          >
            נסה שוב
          </button>
        </div>
      ) : workflows.length === 0 || visibleRows.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>אין עדיין הרצות</strong>
          <p>הרצות יופיעו כאן לאחר שהאוטומציות יתחילו לפעול.</p>
          <Link to=".." className="ax-btn ax-btn--primary">
            חזרה לאוטומציות
          </Link>
        </div>
      ) : (
        <>
          <div className="ax-table-wrap ax-runs-table-wrap">
            <table className="ax-table ax-runs-table">
              <thead>
                <tr>
                  <th>אוטומציה</th>
                  <th>התחלה</th>
                  <th>משך</th>
                  <th>סטטוס</th>
                  <th>Trigger</th>
                  <th>Steps</th>
                  <th>פעולות</th>
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
                          {getExecutionStatusLabel(row.status)}
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
                              נסה שוב
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className="ax-runs-open"
                            onClick={() =>
                              setSelectedExecutionId(row.executionId)
                            }
                            aria-label="פתח פרטי הרצה"
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
                      {getExecutionStatusLabel(row.status)}
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
                      פתח
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
