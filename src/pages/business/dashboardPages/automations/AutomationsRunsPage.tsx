import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
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
  formatRelativeTime,
  getTriggerLabel,
  readAutomationErrorMessage,
} from "./automationUiHelpers";

type OutletCtx = {
  businessId: string | null;
  readOnly: boolean;
};

type RunRow = {
  workflow: AutomationWorkflow;
  execution: AutomationExecution | null;
};

/**
 * Phase 2: dedicated Runs route (basic).
 * Phase 5 will add full execution detail / canvas markers.
 */
export default function AutomationsRunsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { businessId, readOnly } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [selectedId, setSelectedId] = useState<string>(
    searchParams.get("workflow") || ""
  );
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const writeBlockedTitle = readOnly
    ? AUTOMATION_PREVIEW_ACTION_TOOLTIP
    : undefined;

  const loadWorkflows = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      setWorkflows(await listAutomationWorkflows(businessId));
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה בטעינת הרצות"));
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    void loadWorkflows();
  }, [loadWorkflows]);

  useEffect(() => {
    const fromQuery = searchParams.get("workflow") || "";
    if (fromQuery && fromQuery !== selectedId) setSelectedId(fromQuery);
  }, [searchParams, selectedId]);

  useEffect(() => {
    if (!businessId || !selectedId) {
      setExecutions([]);
      return;
    }
    setDetailLoading(true);
    void listAutomationExecutions(businessId, selectedId)
      .then(setExecutions)
      .catch(() => {
        setExecutions([]);
        toast.error("לא ניתן לטעון היסטוריית הרצות");
      })
      .finally(() => setDetailLoading(false));
  }, [businessId, selectedId]);

  const overviewRows: RunRow[] = useMemo(
    () =>
      workflows
        .filter((workflow) => workflow.lastExecution || workflow.lastRunAt)
        .map((workflow) => ({
          workflow,
          execution: null,
        })),
    [workflows]
  );

  const selectedWorkflow = workflows.find((item) => item._id === selectedId);

  const selectWorkflow = (workflowId: string) => {
    setSelectedId(workflowId);
    const next = new URLSearchParams(searchParams);
    if (workflowId) next.set("workflow", workflowId);
    else next.delete("workflow");
    setSearchParams(next, { replace: true });
  };

  const handleRetry = async (executionId?: string) => {
    if (!businessId || !executionId) return;
    if (isAutomationsReadOnly()) {
      toast.error(AUTOMATION_PREVIEW_WRITE_BLOCKED_MESSAGE);
      return;
    }
    try {
      await retryAutomationExecution(businessId, executionId);
      toast.success("ההרצה נשלחה לניסיון חוזר");
      setExecutions(await listAutomationExecutions(businessId, selectedId));
    } catch (error: unknown) {
      toast.error(readAutomationErrorMessage(error, "שגיאה בניסיון חוזר"));
    }
  };

  return (
    <div className="ax-page">
      <header className="ax-page__header">
        <div>
          <h1 className="ax-home__title">הרצות</h1>
          <p className="ax-home__subtitle">
            היסטוריית הרצות לפי אוטומציה. פירוט מלא של כל הרצה יגיע בשלב הבא.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="ax-empty">
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
          טוען הרצות...
        </div>
      ) : workflows.length === 0 ? (
        <div className="ax-empty ax-empty--card">
          <strong>אין עדיין הרצות</strong>
          <p>צרו אוטומציה והפעילו אותה כדי לראות היסטוריה כאן.</p>
          <Link to=".." className="ax-btn ax-btn--primary">
            חזרה לאוטומציות
          </Link>
        </div>
      ) : (
        <div className="ax-runs">
          <aside className="ax-runs__sidebar">
            <label className="ax-sort ax-sort--block">
              <span>אוטומציה</span>
              <select
                value={selectedId}
                onChange={(event) => selectWorkflow(event.target.value)}
              >
                <option value="">כל האוטומציות (סקירה)</option>
                {workflows.map((workflow) => (
                  <option key={workflow._id} value={workflow._id}>
                    {workflow.name}
                  </option>
                ))}
              </select>
            </label>

            {!selectedId ? (
              <div className="ax-runs__overview">
                {overviewRows.length === 0 ? (
                  <div className="ax-empty">עדיין אין הרצות ידועות.</div>
                ) : (
                  overviewRows.map(({ workflow }) => (
                    <button
                      key={workflow._id}
                      type="button"
                      className="ax-runs__overview-item"
                      onClick={() => selectWorkflow(workflow._id)}
                    >
                      <strong>{workflow.name}</strong>
                      <span>
                        {getTriggerLabel(workflow)} ·{" "}
                        {formatRelativeTime(
                          workflow.lastExecution?.startedAt ||
                            workflow.lastRunAt
                        )}
                      </span>
                      <em>{workflow.lastExecution?.status || "—"}</em>
                    </button>
                  ))
                )}
              </div>
            ) : null}
          </aside>

          <div className="ax-runs__main">
            {selectedId ? (
              <>
                <div className="ax-runs__main-head">
                  <div>
                    <strong>{selectedWorkflow?.name || "אוטומציה"}</strong>
                    <p className="ax-home__subtitle">
                      {selectedWorkflow
                        ? getTriggerLabel(selectedWorkflow)
                        : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ax-btn ax-btn--secondary"
                    onClick={() => navigate(`../${selectedId}`)}
                  >
                    פתח Builder
                  </button>
                </div>
                {detailLoading ? (
                  <div className="ax-empty">
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    טוען...
                  </div>
                ) : executions.length === 0 ? (
                  <div className="ax-empty ax-empty--card">
                    עדיין אין היסטוריית הרצות לאוטומציה זו.
                  </div>
                ) : (
                  <div className="ax-table-wrap">
                    <table className="ax-table">
                      <thead>
                        <tr>
                          <th>סטטוס</th>
                          <th>התחלה</th>
                          <th>טריגר</th>
                          <th>שגיאה</th>
                          <th>פעולות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {executions.map((execution) => (
                          <tr key={execution.executionId}>
                            <td>
                              <span
                                className={`ax-result ax-result--${
                                  execution.status === "completed"
                                    ? "success"
                                    : execution.status === "failed"
                                      ? "failed"
                                      : "neutral"
                                }`}
                              >
                                {execution.status}
                              </span>
                            </td>
                            <td className="ax-table__muted">
                              {execution.startedAt || execution.createdAt
                                ? new Date(
                                    execution.startedAt ||
                                      execution.createdAt ||
                                      ""
                                  ).toLocaleString("he-IL")
                                : "—"}
                            </td>
                            <td className="ax-table__muted">
                              {execution.eventType || "—"}
                            </td>
                            <td className="ax-table__muted">
                              {execution.error || "—"}
                            </td>
                            <td>
                              {execution.status === "failed" ? (
                                <button
                                  type="button"
                                  className="ax-btn ax-btn--secondary"
                                  disabled={readOnly}
                                  title={writeBlockedTitle}
                                  onClick={() =>
                                    void handleRetry(execution.executionId)
                                  }
                                >
                                  נסה שוב
                                </button>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="ax-empty ax-empty--card">
                בחרו אוטומציה מהרשימה כדי לראות את היסטוריית ההרצות שלה.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
