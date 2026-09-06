import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  getExecutionStatusTone,
  getFailedStep,
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

function executionStatusLabel(
  status: string | null | undefined,
  t: (key: string, defaultValue?: string) => string
) {
  switch (String(status || "").toLowerCase()) {
    case "completed":
    case "success":
      return t("automations.runs.success");
    case "failed":
    case "error":
      return t("automations.runs.failed");
    case "running":
      return t("automations.runs.running");
    case "waiting":
    case "pending":
      return t("automations.runs.pending");
    case "cancelled":
    case "canceled":
      return t("automations.runs.cancelled");
    default:
      return status ? String(status) : t("automations.common.none");
  }
}

export default function AutomationExecutionDetailDrawer({
  businessId,
  executionId,
  workflowName,
  onClose,
}: Props) {
  const { t } = useTranslation();
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
              t("automations.runsDetail.loadError", "Could not load run details")
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
  }, [businessId, executionId, t]);

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
    t("automations.runs.automation");

  return (
    <div className="ax-exec-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="ax-exec-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t("automations.runsDetail.title", "Run details")}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="ax-exec-drawer__header">
          <div>
            <p className="ax-exec-drawer__eyebrow">
              {t("automations.runsDetail.title", "Run details")}
            </p>
            <h2>{title}</h2>
            <p className="ax-exec-drawer__meta">{executionId}</p>
          </div>
          <button
            type="button"
            className="ax-exec-drawer__close"
            onClick={onClose}
            aria-label={t("automations.common.close")}
          >
            <X size={16} />
          </button>
        </header>

        <div className="ax-exec-drawer__body">
          {loading ? (
            <div className="ax-empty">
              <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
              {t("automations.runsDetail.loading", "Loading run details...")}
            </div>
          ) : error || !execution ? (
            <div className="ax-empty ax-empty--card">
              <strong>
                {t("automations.runsDetail.loadFailed", "Could not load the run")}
              </strong>
              <p>
                {error ||
                  t("automations.runsDetail.notFound", "The run was not found.")}
              </p>
            </div>
          ) : (
            <>
              <section className="ax-exec-summary">
                <div className="ax-exec-summary__grid">
                  <div>
                    <span>{t("automations.runs.status")}</span>
                    <strong className={`ax-result ax-result--${tone}`}>
                      {executionStatusLabel(execution.status, t)}
                    </strong>
                  </div>
                  <div>
                    <span>{t("automations.runs.started")}</span>
                    <strong>
                      {formatExecutionDateTime(
                        execution.startedAt || execution.createdAt
                      )}
                    </strong>
                  </div>
                  <div>
                    <span>{t("automations.runsDetail.ended", "Ended")}</span>
                    <strong>
                      {formatExecutionDateTime(getExecutionEndAt(execution))}
                    </strong>
                  </div>
                  <div>
                    <span>{t("automations.runs.duration")}</span>
                    <strong>{formatDurationMs(duration)}</strong>
                  </div>
                  <div>
                    <span>{t("automations.runs.trigger")}</span>
                    <strong>{getTriggerSummary(execution)}</strong>
                  </div>
                  <div>
                    <span>{t("automations.runsDetail.mode", "Mode")}</span>
                    <strong>
                      {execution.mode === "test"
                        ? t("automations.runsDetail.modeTest", "Test")
                        : t("automations.runsDetail.modeLive", "Live")}
                    </strong>
                  </div>
                </div>

                {execution.status === "failed" ? (
                  <div className="ax-exec-error" role="alert">
                    <strong>
                      {t("automations.runsDetail.failure", "Failure")}
                    </strong>
                    <p>
                      {failedStep?.label
                        ? t("automations.runsDetail.failedStep", {
                            label: failedStep.label,
                            defaultValue: "Step: {{label}}",
                          })
                        : t("automations.runsDetail.runFailed", "The run failed")}
                    </p>
                    <p>
                      {execution.error ||
                        failedStep?.error ||
                        t(
                          "automations.runsDetail.noErrorDetails",
                          "No error details"
                        )}
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
                      {t(
                        "automations.runsDetail.openAutomation",
                        "Open automation"
                      )}
                    </Link>
                  </div>
                ) : null}
              </section>

              <section className="ax-exec-flow">
                <div className="ax-exec-flow__head">
                  <h3>
                    {t("automations.runsDetail.flowTitle", "Run timeline")}
                  </h3>
                  <span>
                    {t(
                      "automations.runsDetail.flowHint",
                      "Read-only view — you cannot edit the automation from here"
                    )}
                  </span>
                </div>
                {steps.length === 0 ? (
                  <div className="ax-empty">
                    {t(
                      "automations.runsDetail.noSteps",
                      "No steps are available for this run."
                    )}
                  </div>
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
                                {executionStatusLabel(step.status, t)}
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
                    <h3>
                      {t("automations.runsDetail.stepDetails", "Step details")}
                    </h3>
                    <button
                      type="button"
                      className="ax-btn ax-btn--secondary"
                      onClick={() => setSelectedStepId(null)}
                    >
                      {t(
                        "automations.runsDetail.clearSelection",
                        "Clear selection"
                      )}
                    </button>
                  </div>
                  <div className="ax-exec-summary__grid">
                    <div>
                      <span>{t("automations.runsDetail.name", "Name")}</span>
                      <strong>{selectedStep.label}</strong>
                    </div>
                    <div>
                      <span>{t("automations.runs.status")}</span>
                      <strong
                        className={`ax-result ax-result--${getExecutionStatusTone(
                          selectedStep.status
                        )}`}
                      >
                        {executionStatusLabel(selectedStep.status, t)}
                      </strong>
                    </div>
                    <div>
                      <span>{t("automations.runs.started")}</span>
                      <strong>
                        {formatExecutionDateTime(selectedStep.startedAt)}
                      </strong>
                    </div>
                    <div>
                      <span>{t("automations.runs.duration")}</span>
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
                      <strong>
                        {t("automations.runsDetail.stepError", "Step error")}
                      </strong>
                      <p>{selectedStep.error}</p>
                    </div>
                  ) : null}
                  <div className="ax-exec-io">
                    <div>
                      <span>{t("automations.runsDetail.input", "Input")}</span>
                      <pre>{summarizeJson(selectedStep.input, 1200)}</pre>
                    </div>
                    <div>
                      <span>{t("automations.runsDetail.output", "Output")}</span>
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
