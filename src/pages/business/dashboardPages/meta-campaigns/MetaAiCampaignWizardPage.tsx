import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plug,
  Send,
  Sparkles,
} from "lucide-react";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import {
  answerAiCampaignSession,
  getAiCampaignSession,
  sendAiCampaignMessage,
  sessionStorageKey,
  startAiCampaignSession,
  type AiCampaignQuestion,
  type AiCampaignSessionResponse,
} from "../../../../api/metaAiCampaignApi";

type OutletCtx = { businessId: string | null };

type AiError = {
  retry?: boolean;
  manual?: boolean;
  message: string;
};

function readError(error: unknown, fallback: string): AiError {
  const response = (error as { response?: { status?: number; data?: { message?: string; details?: { retry?: boolean; manualPath?: string } } } })
    ?.response;
  const message = response?.data?.message || fallback;
  return {
    message,
    retry: Boolean(response?.data?.details?.retry) || response?.status === 503,
    manual: true,
  };
}

function persistSession(businessId: string, sessionId: string) {
  try {
    sessionStorage.setItem(sessionStorageKey(businessId), sessionId);
  } catch {
    /* ignore quota */
  }
}

function readPersisted(businessId: string) {
  try {
    return sessionStorage.getItem(sessionStorageKey(businessId));
  } catch {
    return null;
  }
}

export default function MetaAiCampaignWizardPage() {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const tenantId = urlBusinessId || businessId || "";
  const overviewPath = `/business/${tenantId}/dashboard/meta-campaigns/overview`;
  const settingsPath = `/business/${tenantId}/dashboard/meta-campaigns/settings`;
  const manualPath = `/business/${tenantId}/dashboard/meta-campaigns/create`;
  const language = String(i18n.language || "he").toLowerCase().startsWith("en")
    ? "en"
    : "he";

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<AiCampaignSessionResponse | null>(null);
  const [resumeCandidate, setResumeCandidate] =
    useState<AiCampaignSessionResponse | null>(null);
  const [error, setError] = useState<AiError | null>(null);
  const [draft, setDraft] = useState("");
  const [budgetDraft, setBudgetDraft] = useState("");
  const [locationDraft, setLocationDraft] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const applySession = useCallback(
    (next: AiCampaignSessionResponse) => {
      setSession(next);
      setResumeCandidate(null);
      if (tenantId && next.sessionId) persistSession(tenantId, next.sessionId);
    },
    [tenantId]
  );

  const boot = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    setError(null);
    try {
      const stored = readPersisted(tenantId);
      if (stored) {
        try {
          const restored = await getAiCampaignSession(tenantId, stored);
          applySession(restored);
          setLoading(false);
          return;
        } catch {
          /* stale id — start/resume from server */
        }
      }
      const started = await startAiCampaignSession(tenantId, { language });
      if (started.resumable) {
        setResumeCandidate(started);
        setSession(null);
      } else {
        applySession(started);
      }
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.errorGeneric")));
    } finally {
      setLoading(false);
    }
  }, [applySession, language, t, tenantId]);

  useEffect(() => {
    void boot();
    // Start once per tenant. Language is read from i18n at boot time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenantId]);

  const handleAnswer = async (field: string, answer: unknown) => {
    if (!session?.sessionId || busy) return;
    setBusy(true);
    setError(null);
    try {
      const next = await answerAiCampaignSession(tenantId, session.sessionId, {
        field,
        answer,
      });
      applySession(next);
      setBudgetDraft("");
      setLocationDraft("");
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.errorGeneric")));
    } finally {
      setBusy(false);
    }
  };

  const handleMessage = async (text: string) => {
    if (!session?.sessionId || busy) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    setLastMessage(trimmed);
    try {
      const next = await sendAiCampaignMessage(
        tenantId,
        session.sessionId,
        trimmed
      );
      applySession(next);
      setDraft("");
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.aiUnavailable")));
    } finally {
      setBusy(false);
    }
  };

  const continueResume = () => {
    if (!resumeCandidate) return;
    applySession(resumeCandidate);
  };

  const restart = async () => {
    setBusy(true);
    setError(null);
    try {
      const next = await startAiCampaignSession(tenantId, {
        action: "restart",
        language,
      });
      applySession(next);
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.errorGeneric")));
    } finally {
      setBusy(false);
    }
  };

  const progressLabel = useMemo(() => {
    const confirmed = session?.progress?.confirmed ?? 0;
    const required = session?.progress?.required ?? 5;
    return t("metaCampaigns.ai.progress", { confirmed, required });
  }, [session, t]);

  const question = session?.question || null;
  const isReady = session?.status === "READY_FOR_GENERATION";

  return (
    <div dir={dir} className="space-y-4" data-testid="meta-ai-campaign-wizard">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-violet-700">
            <Sparkles className="h-3.5 w-3.5" />
            {t("metaCampaigns.ai.badge")}
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {t("metaCampaigns.ai.title")}
          </h2>
          <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-500">
            {t("metaCampaigns.ai.subtitle")}
          </p>
          {session && !isReady ? (
            <p
              className="mt-2 text-xs font-bold text-violet-700"
              data-testid="meta-ai-progress"
            >
              {progressLabel}
            </p>
          ) : null}
        </div>
        <Link to={overviewPath} className={btnSecondary}>
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("metaCampaigns.ai.back")}
        </Link>
      </div>

      {session && session.metaConnected === false ? (
        <div
          className={`${cardBase} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}
          data-testid="meta-ai-meta-disconnected"
        >
          <p className="text-sm font-semibold text-slate-700">
            {t("metaCampaigns.ai.metaDisconnected")}
          </p>
          <Link to={settingsPath} className={btnPrimary}>
            <Plug className="h-4 w-4" />
            {t("metaCampaigns.ai.connectMeta")}
          </Link>
        </div>
      ) : null}

      <div className={`${cardBase} p-4 sm:p-6`}>
        {loading ? (
          <div
            className="flex flex-col items-center gap-3 py-10 text-center"
            data-testid="meta-ai-loading"
          >
            <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
            <p className="text-sm font-bold text-slate-600">
              {t("metaCampaigns.ai.checking")}
            </p>
          </div>
        ) : resumeCandidate ? (
          <div className="space-y-4" data-testid="meta-ai-resume">
            <h3 className="text-base font-black text-slate-900">
              {t("metaCampaigns.ai.resumeTitle")}
            </h3>
            <p className="text-sm font-semibold text-slate-600">
              {t("metaCampaigns.ai.resumeBody")}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className={btnPrimary} onClick={continueResume}>
                {t("metaCampaigns.ai.resumeContinue")}
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() => void restart()}
                disabled={busy}
              >
                {t("metaCampaigns.ai.resumeRestart")}
              </button>
            </div>
          </div>
        ) : isReady && session?.ready ? (
          <div className="space-y-4" data-testid="meta-ai-ready">
            <p className="text-base font-black text-slate-900">
              {session.ready.message}
            </p>
            <button type="button" className={btnPrimary} disabled>
              {t("metaCampaigns.ai.readyGenerate")}
            </button>
            <p className="text-sm font-semibold text-slate-500">
              {session.ready.placeholder || t("metaCampaigns.ai.readyPlaceholder")}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <ConversationTrail
              messages={session?.messages || []}
              fallback={question ? "" : session?.assistantMessage || ""}
              hideText={question?.message}
            />
            {question ? (
              <QuestionCard
                question={question}
                busy={busy}
                budgetDraft={budgetDraft}
                locationDraft={locationDraft}
                onBudgetDraft={setBudgetDraft}
                onLocationDraft={setLocationDraft}
                onAnswer={handleAnswer}
              />
            ) : null}

            {session?.status === "COLLECTING" ? (
              <form
                className="flex flex-col gap-2 sm:flex-row"
                data-testid="meta-ai-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleMessage(draft);
                }}
              >
                <input
                  className={inputBase}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={t("metaCampaigns.ai.composerPlaceholder")}
                  maxLength={2000}
                  disabled={busy}
                />
                <button type="submit" className={btnPrimary} disabled={busy || !draft.trim()}>
                  <Send className="h-4 w-4" />
                  {t("metaCampaigns.ai.send")}
                </button>
              </form>
            ) : null}
          </div>
        )}

        {error ? (
          <div className="mt-4 space-y-3 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-900">{error.message}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {error.retry ? (
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() =>
                    lastMessage ? void handleMessage(lastMessage) : void boot()
                  }
                >
                  {t("metaCampaigns.ai.retry")}
                </button>
              ) : (
                <button type="button" className={btnSecondary} onClick={() => void boot()}>
                  {t("metaCampaigns.ai.retry")}
                </button>
              )}
              <Link
                to={manualPath}
                className={btnSecondary}
                data-testid="meta-ai-manual-fallback"
              >
                {t("metaCampaigns.ai.manualFallback")}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ConversationTrail({
  messages,
  fallback,
  hideText,
}: {
  messages: { role: string; text: string }[];
  fallback: string;
  hideText?: string;
}) {
  const visible = messages.filter((item) => item.text && item.text !== hideText);
  const rows = visible.length
    ? visible.slice(-8)
    : fallback
      ? [{ role: "assistant", text: fallback }]
      : [];
  if (!rows.length) return null;
  return (
    <div className="space-y-2" data-testid="meta-ai-messages">
      {rows.map((item, index) => (
        <div
          key={`${item.role}-${index}`}
          className={
            item.role === "user"
              ? "ms-8 rounded-md bg-violet-50 px-3 py-2 text-sm font-semibold text-slate-800"
              : "me-8 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
          }
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}

function QuestionCard({
  question,
  busy,
  budgetDraft,
  locationDraft,
  onBudgetDraft,
  onLocationDraft,
  onAnswer,
}: {
  question: AiCampaignQuestion;
  busy: boolean;
  budgetDraft: string;
  locationDraft: string;
  onBudgetDraft: (value: string) => void;
  onLocationDraft: (value: string) => void;
  onAnswer: (field: string, answer: unknown) => void | Promise<void>;
}) {
  const { t } = useTranslation();
  const options = question.options || [];

  return (
    <div className="space-y-3" data-testid="meta-ai-question" data-field={question.field} data-type={question.type}>
      <p className="text-sm font-black text-slate-900">{question.message}</p>

      {question.type === "currency" ? (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const amount = Number(String(budgetDraft).replace(/[^\d.]/g, ""));
            if (amount > 0) void onAnswer(question.field, amount);
          }}
        >
          <input
            className={inputBase}
            inputMode="decimal"
            value={budgetDraft}
            onChange={(event) => onBudgetDraft(event.target.value)}
            placeholder={t("metaCampaigns.ai.budgetPlaceholder")}
            data-testid="meta-ai-currency"
            disabled={busy}
          />
          <button type="submit" className={btnPrimary} disabled={busy || !budgetDraft}>
            {t("metaCampaigns.ai.budgetSubmit")}
          </button>
        </form>
      ) : null}

      {question.type === "location" && !options.length ? (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (locationDraft.trim()) void onAnswer(question.field, locationDraft.trim());
          }}
        >
          <input
            className={inputBase}
            value={locationDraft}
            onChange={(event) => onLocationDraft(event.target.value)}
            placeholder={t("metaCampaigns.ai.locationPlaceholder")}
            data-testid="meta-ai-location"
            disabled={busy}
          />
        </form>
      ) : null}

      {question.type === "upload" ? (
        <label className={`${btnSecondary} cursor-pointer`}>
          <ImagePlus className="h-4 w-4" />
          {t("metaCampaigns.ai.uploadNow")}
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void onAnswer(question.field, {
                value: "PROVIDED",
                fileName: file.name,
              });
            }}
          />
        </label>
      ) : null}

      {options.length ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap" data-testid="meta-ai-options">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={option.value === "RECOMMEND" || option.value === "LATER" ? btnSecondary : btnPrimary}
              disabled={busy}
              data-testid="meta-ai-option"
              data-value={option.value}
              onClick={() => void onAnswer(question.field, option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
