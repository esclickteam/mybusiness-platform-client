import React, { useMemo, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  askMarketingCopilot,
  type MarketingCopilotAnswer,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";
import { useMetaAdsDateRange } from "./useMetaAdsDateRange";
import { humanizeMetaCustomerLabel } from "./metaCampaignUtils";

const PROMPTS = [
  "What needs my attention today?",
  "Where am I overspending?",
  "Which campaign is closest to its goal?",
  "What changed in the last 7 days?",
  "Are any ads showing fatigue?",
  "Where can I safely scale?",
];

export default function MetaMarketingCopilotPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const { serverWindow, labelKey } = useMetaAdsDateRange();
  const [question, setQuestion] = useState(() => searchParams.get("q") || "");
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `copilot-${Date.now()}`
  );
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<MarketingCopilotAnswer | null>(null);

  const prompts = useMemo(
    () => [
      t("metaCampaigns.copilot.qAttention"),
      t("metaCampaigns.copilot.qOverspend"),
      t("metaCampaigns.copilot.qGoal"),
      t("metaCampaigns.copilot.qChanged"),
      t("metaCampaigns.copilot.qFatigue"),
      t("metaCampaigns.copilot.qScale"),
    ],
    [t]
  );

  async function ask(nextQuestion = question) {
    if (!businessId || !nextQuestion.trim()) return;
    setBusy(true);
    try {
      const data = await askMarketingCopilot(businessId, nextQuestion.trim(), sessionId, serverWindow);
      setReply(data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4" data-testid="marketing-copilot-page">
      <section className={`${cardBase} p-4`}>
        <h2 className="text-lg font-black">{t("metaCampaigns.copilot.title")}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">{t("metaCampaigns.copilot.subtitle")}</p>
        <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">
          {t("metaCampaigns.ux.showingRange", { range: t(labelKey) })}
        </p>
      </section>

      <section className={`${cardBase} space-y-3 p-4`}>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt, index) => (
            <button
              key={PROMPTS[index]}
              type="button"
              className={btnSecondary}
              data-testid={`copilot-prompt-${index}`}
              onClick={() => {
                setQuestion(PROMPTS[index]);
                void ask(PROMPTS[index]);
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
        <textarea
          className={inputBase}
          rows={3}
          value={question}
          data-testid="copilot-question"
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={t("metaCampaigns.copilot.placeholder")}
        />
        <button
          type="button"
          className={btnPrimary}
          data-testid="copilot-ask"
          disabled={busy}
          onClick={() => void ask()}
        >
          {busy ? t("metaCampaigns.copilot.thinking") : t("metaCampaigns.copilot.ask")}
        </button>
      </section>

      {reply ? (
        <section className={`${cardBase} space-y-3 p-4`} data-testid="copilot-answer">
          <p className="text-sm font-black text-slate-900">{reply.answer}</p>
          {reply.period ? (
            <p className="text-xs font-semibold text-slate-500" data-testid="copilot-period">
              {t("metaCampaigns.ux.showingRange", {
                range: humanizeMetaCustomerLabel(reply.period, t),
              })}
            </p>
          ) : null}
          {reply.insufficientData ? (
            <p className="text-sm font-semibold text-amber-700" data-testid="copilot-insufficient">
              {t("metaCampaigns.copilot.insufficient")}
            </p>
          ) : null}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
              {t("metaCampaigns.copilot.facts")}
            </p>
            <ul className="mt-2 space-y-1 text-sm font-semibold text-slate-700">
              {(reply.supportingFacts || []).map((row) => (
                <li key={row.text}>{row.text}</li>
              ))}
            </ul>
          </div>
          <div data-testid="copilot-based-on">
            {reply.syncedMinutesAgo != null ? (
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {t("metaCampaigns.copilot.synced", { minutes: reply.syncedMinutesAgo })}
              </p>
            ) : reply.period ? (
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {humanizeMetaCustomerLabel(reply.period, t)}
              </p>
            ) : null}
          </div>
          {(reply.suggestedActions || []).map((action) => (
            <button
              key={`${action.label}-${action.recommendationId || action.campaignId || "none"}`}
              type="button"
              className={btnPrimary}
              data-testid="copilot-review-action"
              onClick={() => {
                if (action.handoff?.allowed && action.recommendationId) {
                  navigate(`overview`);
                }
              }}
            >
              {t("metaCampaigns.copilot.reviewAction")}
            </button>
          ))}
        </section>
      ) : null}

    </div>
  );
}
