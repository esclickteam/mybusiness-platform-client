import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import {
  getAutomationExecution,
  getAutomationWorkflow,
  type AutomationExecution,
  type AutomationWorkflow,
} from "../../../../api/automationWorkflowApi";
import { readAutomationErrorMessage } from "./automationUiHelpers";
import {
  buildExecutionSteps,
  formatDurationMs,
  formatExecutionDateTime,
  getExecutionDurationMs,
  getExecutionEndAt,
  getExecutionStatusLabel,
  getExecutionStatusTone,
  getFailedStep,
  getNodeStatusLabel,
  getNodeStatusSymbol,
  getTriggerSummary,
  summarizeJson,
  type ExecutionStepView,
} from "./runsUiHelpers";

type Props = {
  businessId: string;
  executionId: string;
  workflowName?: string;
  onClose: () => void;
};

export default function AutomationExecutionDetailDrawer({
  businessId,
  executionId,
  workflowName,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [execution, setExecution] = useState<AutomationExecution | null>(null);
  const [workflow, setWorkflow] = useState<AutomationWorkflow | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setSelectedStepId(null);

    void (async () => {
      try {
        const detail = await getAutomationExecution(businessId, executionId);
        if (cancelled) return;
        setExecution(detail);
        if (detail?.workflowId) {
          try {
            const wf = await getAutomationWorkflow(
              businessId,
              String(detail.workflowId)
            );
            if (!cancelled) setWorkflow(wf);
          } catch {
            if (!cancelled) setWorkflow(null);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setExecution(null);
          setError(
            readAutomationErrorMessage(
              err,
              "לא ניתן לטעון את פרטי ההרצה"
            )
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [businessId, executionId]);

  const workflowOrder = useMemo(
    () =>
      (workflow?.nodes || []).map((node) => ({
        id: node.id,
        label: String(node.data?.label || node.id),
        type: node.type,
      })),
    [workflow]
  );

  const steps = useMemo(
    () => (execution ? buildExecutionSteps(execution, workflowOrder) : []),
    [execution, workflowOrder]
  );

  const selectedStep: ExecutionStepView | null = useMemo(() => {
    if (!selectedStepId) return null;
    return steps.find((step) => step.nodeId === selectedStepId) || null;
  }, [selectedStepId, steps]);

  const failedStep = execution ? getFailedStep(execution) : null;
  const tone = getExecutionStatusTone(execution?.status);
  const duration = execution ? getExecutionDurationMs(execution) : null;
  const title =
    workflowName ||
    workflow?.name ||
    execution?.workflowId ||
    "אוטומציה";

  return (
    <div className="ax-exec-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="ax-exec-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={"פרטי הרצה"}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ax-exec-drawer__header">
          <div>
            <p className="ax-exec-drawer__eyebrow">פרטי הרצה</p>
            <h2>{title}</h2>
            <p className="ax-exec-drawer__meta">{executionId}</p>
          </div>
          <button
            type="button"
            className="ax-exec-drawer__close"
            onClick={onClose}
            aria-label={"סגירה"}
          >
            <X size={16} />
          </button>
        </header>

        <div className="ax-exec-drawer__body">
          {loading ? (
            <div className="ax-empty">
              <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
              טוען פרטי הרצה...
            </div>
          ) : error || !execution ? (
            <div className="ax-empty ax-empty--card">
              <strong>לא ניתן לטעון את ההרצה</strong>
              <p>{error || "ההרצה לא נמצאה."}</p>
            </div>
          ) : (
            <>
              <section className="ax-exec-summary">
                <div className="ax-exec-summary__grid">
                  <div>
                    <span>סטטוס</span>
                    <strong className={`ax-result ax-result--${tone}`}>
                      {getExecutionStatusLabel(execution.status)}
                    </strong>
                  </div>
                  <div>
                    <span>התחלה</span>
                    <strong>
                      {formatExecutionDateTime(
                        execution.startedAt || execution.createdAt
                      )}
                    </strong>
                  </div>
                  <div>
                    <span>סיום</span>
                    <strong>
                      {formatExecutionDateTime(getExecutionEndAt(execution))}
                    </strong>
                  </div>
                  <div>
                    <span>משך</span>
                    <strong>{formatDurationMs(duration)}</strong>
                  </div>
                  <div>
                    <span>Trigger</span>
                    <strong>{getTriggerSummary(execution)}</strong>
                  </div>
                  <div>
                    <span>מצב</span>
                    <strong>
                      {execution.mode === "test"
                        ? "בדיקה"
                        : "חי"}
                    </strong>
                  </div>
                </div>

                {execution.status === "failed" ? (
                  <div className="ax-exec-error" role="alert">
                    <strong>כשלון</strong>
                    <p>
                      {failedStep?.label
                        ? `שלב: ${failedStep.label}`
                        : "ההרצה נכשלה"}
                    </p>
                    <p>
                      {execution.error ||
                        failedStep?.error ||
                        "אין פרטי שגיאה"}
                    </p>
                    {execution.errorCode ? (
                      <code>{execution.errorCode}</code>
                    ) : null}
                    {execution.failedAt || failedStep?.failedAt ? (
                      <small>
                        {formatExecutionDateTime(
                          execution.failedAt || failedStep?.failedAt
                        )}
                      </small>
                    ) : null}
                    <Link
                      to={`../${execution.workflowId}`}
                      className="ax-btn ax-btn--secondary"
                    >
                      פתח אוטומציה
                    </Link>
                  </div>
                ) : null}
              </section>

              <section className="ax-exec-flow">
                <div className="ax-exec-flow__head">
                  <h3>מהלך ההרצה</h3>
                  <span>תצוגה לקריאה בלבד — לא ניתן לערוך את האוטומציה מכאן</span>
                </div>
                {steps.length === 0 ? (
                  <div className="ax-empty">אין שלבים זמינים עבור הרצה זו.</div>
                ) : (
                  <ol className="ax-exec-steps">
                    {steps.map((step) => {
                      const stepTone = getExecutionStatusTone(step.status);
                      return (
                        <li key={step.nodeId}>
                          <button
                            type="button"
                            className={`ax-exec-step ax-exec-step--${stepTone}${
                              selectedStepId === step.nodeId
                                ? " ax-exec-step--active"
                                : ""
                            }`}
                            onClick={() => setSelectedStepId(step.nodeId)}
                          >
                            <span className="ax-exec-step__symbol" aria-hidden>
                              {getNodeStatusSymbol(step.status)}
                            </span>
                            <span className="ax-exec-step__main">
                              <strong>{step.label}</strong>
                              <em>
                                {getNodeStatusLabel(step.status)}
                                {step.type
                                  ? ` · ${step.type}`
                                  : ""}
                              </em>
                            </span>
                            <span className="ax-exec-step__time">
                              {formatExecutionDateTime(step.startedAt)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>

              {selectedStep ? (
                <section className="ax-exec-node">
                  <div className="ax-exec-flow__head">
                    <h3>פרטי שלב</h3>
                    <button
                      type="button"
                      className="ax-btn ax-btn--secondary"
                      onClick={() => setSelectedStepId(null)}
                    >
                      נקה בחירה
                    </button>
                  </div>
                  <div className="ax-exec-summary__grid">
                    <div>
                      <span>שם</span>
                      <strong>{selectedStep.label}</strong>
                    </div>
                    <div>
                      <span>סטטוס</span>
                      <strong
                        className={`ax-result ax-result--${getExecutionStatusTone(
                          selectedStep.status
                        )}`}
                      >
                        {getNodeStatusLabel(selectedStep.status)}
                      </strong>
                    </div>
                    <div>
                      <span>התחלה</span>
                      <strong>
                        {formatExecutionDateTime(selectedStep.startedAt)}
                      </strong>
                    </div>
                    <div>
                      <span>משך</span>
                      <strong>
                        {formatDurationMs(
                          selectedStep.startedAt
                            ? new Date(
                                selectedStep.completedAt ||
                                  selectedStep.failedAt ||
                                  selectedStep.startedAt
                              ).getTime() -
                                new Date(selectedStep.startedAt).getTime()
                            : null
                        )}
                      </strong>
                    </div>
                  </div>
                  {selectedStep.error ? (
                    <div className="ax-exec-error ax-exec-error--compact">
                      <strong>שגיאת שלב</strong>
                      <p>{selectedStep.error}</p>
                    </div>
                  ) : null}
                  <div className="ax-exec-io">
                    <div>
                      <span>Input</span>
                      <pre>{summarizeJson(selectedStep.input, 1200)}</pre>
                    </div>
                    <div>
                      <span>Output</span>
                      <pre>{summarizeJson(selectedStep.output, 1200)}</pre>
                    </div>
                  </div>
                </section>
              ) : null}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
