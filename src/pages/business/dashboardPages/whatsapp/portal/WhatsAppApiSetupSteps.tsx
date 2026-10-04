import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2, ChevronDown, Circle, PartyPopper } from "lucide-react";
import type { PortalSubscriptionState } from "../../../../../api/whatsappApiPortal";
import { cardBase } from "../../../../../styles/bizuplyUi";

export type SetupStepStatus = "done" | "attention" | "todo";

export type SetupStep = {
  key: "subscription" | "connect" | "apiKey" | "webhook" | "firstMessage";
  status: SetupStepStatus;
  to: string;
  detail?: string;
};

export function subscriptionStepStatus(state: PortalSubscriptionState): SetupStepStatus {
  if (state === "active") return "done";
  if (state === "cancelsAtPeriodEnd" || state === "pastDueGrace") return "attention";
  return "todo";
}

type Props = {
  steps: SetupStep[];
  welcome?: boolean;
};

function StepIcon({ status }: { status: SetupStepStatus }) {
  const { t } = useTranslation();
  if (status === "done") {
    return (
      <CheckCircle2
        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
        aria-label={t("whatsappApiPortal.setup.done")}
      />
    );
  }
  if (status === "attention") {
    return (
      <AlertTriangle
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
        aria-label={t("whatsappApiPortal.setup.attention")}
      />
    );
  }
  return (
    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-label={t("whatsappApiPortal.setup.todo")} />
  );
}

export default function WhatsAppApiSetupSteps({ steps, welcome = false }: Props) {
  const { t } = useTranslation();
  const doneCount = steps.filter((s) => s.status === "done").length;
  const complete = doneCount === steps.length;
  const [expanded, setExpanded] = useState(false);
  const showSteps = !complete || expanded || welcome;

  if (complete && !showSteps) {
    return (
      <section
        className={`${cardBase} flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-4`}
        data-testid="wa-api-setup-guide"
        data-complete="true"
      >
        <p className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          {t("whatsappApiPortal.setup.completeTitle")}
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-black text-emerald-700"
          aria-expanded="false"
          onClick={() => setExpanded(true)}
        >
          {t("whatsappApiPortal.setup.showSteps")}
          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </section>
    );
  }

  return (
    <section
      className={`${cardBase} p-4 sm:p-5`}
      data-testid="wa-api-setup-guide"
      data-complete={complete ? "true" : "false"}
      aria-labelledby="wa-api-setup-title"
    >
      {welcome ? (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3">
          <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-black text-emerald-900">{t("whatsappApiPortal.setup.welcomeTitle")}</p>
            <p className="mt-0.5 text-xs font-semibold text-emerald-800">{t("whatsappApiPortal.setup.welcomeText")}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="wa-api-setup-title" className="text-sm font-black text-slate-900">
            {t("whatsappApiPortal.setup.title")}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {t("whatsappApiPortal.setup.progress", { done: doneCount, total: steps.length })}
          </p>
        </div>
        <div
          className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={doneCount}
          aria-label={t("whatsappApiPortal.setup.title")}
        >
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="mt-4 space-y-2">
        {steps.map((step) => (
          <li
            key={step.key}
            className={`flex flex-col gap-2 rounded-xl border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between ${
              step.status === "attention" ? "border-amber-200 bg-amber-50/50" : "border-slate-100"
            }`}
            data-step={step.key}
            data-status={step.status}
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <StepIcon status={step.status} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  {t(`whatsappApiPortal.setup.steps.${step.key}.title`)}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {step.detail || t(`whatsappApiPortal.setup.steps.${step.key}.text`)}
                </p>
              </div>
            </div>
            {step.status !== "done" ? (
              <Link to={step.to} className="shrink-0 text-xs font-black text-emerald-700 hover:text-emerald-800">
                {t(`whatsappApiPortal.setup.steps.${step.key}.cta`)}
                <span className="ms-1 inline-block rtl:-scale-x-100" aria-hidden="true">
                  →
                </span>
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
