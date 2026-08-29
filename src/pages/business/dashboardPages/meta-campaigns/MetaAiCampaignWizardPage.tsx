import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
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
  activateAiCampaign,
  answerAiCampaignSession,
  confirmAiDraftLocations,
  createAiCampaignMetaDraft,
  generateAiCampaign,
  getAiCampaignSession,
  patchAiCampaignProposal,
  retryAiCampaignMetaDraft,
  reviseAiCampaign,
  sendAiCampaignMessage,
  sessionStorageKey,
  startAiCampaignSession,
  type AiCampaignQuestion,
  type AiCampaignSessionResponse,
  type AiUnresolvedLocation,
} from "../../../../api/metaAiCampaignApi";
import MetaAiCampaignPreview from "./MetaAiCampaignPreview";
import type { AiProposalHandoff } from "./ads-manager/adsManagerFromAiProposal";

type OutletCtx = { businessId: string | null };

type AiError = {
  retry?: boolean;
  manual?: boolean;
  message: string;
  code?: string;
  unresolvedLocations?: AiUnresolvedLocation[];
  tree?: { campaign?: string | null; adSet?: string | null; ad?: string | null };
};

function readError(error: unknown, fallback: string): AiError {
  const response = (error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        details?: {
          retry?: boolean;
          manualPath?: string;
          code?: string;
          unresolvedLocations?: AiUnresolvedLocation[];
          tree?: { campaign?: string | null; adSet?: string | null; ad?: string | null };
        };
      };
    };
  })?.response;
  const message = response?.data?.message || fallback;
  return {
    message,
    code: response?.data?.details?.code,
    unresolvedLocations: response?.data?.details?.unresolvedLocations,
    tree: response?.data?.details?.tree,
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
  const navigate = useNavigate();
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
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const draftLockRef = useRef(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [activationTree, setActivationTree] = useState<
    { campaign?: string | null; adSet?: string | null; ad?: string | null } | undefined
  >(undefined);

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

  const handleGenerate = async (regenerate = false) => {
    if (!session?.sessionId || busy) return;
    if (session.status !== "READY_FOR_GENERATION") return;
    if (!regenerate && !session.ready?.generateEnabled) return;
    setBusy(true);
    setPendingAction(regenerate ? "regenerate" : "generate");
    setError(null);
    try {
      const next = await generateAiCampaign(
        tenantId,
        session.sessionId,
        regenerate
      );
      applySession(next);
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.errorGeneric")));
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  const handleRevise = async (instruction: string) => {
    if (!session?.sessionId || busy) return;
    setBusy(true);
    setPendingAction("revise");
    setError(null);
    try {
      const next = await reviseAiCampaign(
        tenantId,
        session.sessionId,
        instruction
      );
      applySession(next);
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.aiUnavailable")));
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  const handlePatch = async (patch: Record<string, unknown>) => {
    if (!session?.sessionId || busy) return;
    setBusy(true);
    setPendingAction("patch");
    setError(null);
    try {
      const next = await patchAiCampaignProposal(
        tenantId,
        session.sessionId,
        patch
      );
      applySession(next);
    } catch (err) {
      setError(readError(err, t("metaCampaigns.ai.errorGeneric")));
    } finally {
      setBusy(false);
      setPendingAction(null);
    }
  };

  const handleUploadCreative = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      void handlePatch({
        creative: {
          media: {
            status: "PROVIDED",
            url: typeof reader.result === "string" ? reader.result : null,
            fileName: file.name,
            kind: file.type.startsWith("video/") ? "video" : "image",
          },
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleManualEdit = () => {
    if (!session?.proposal) return;
    const dest = (session.intent as { destination?: { value?: { key?: string } } })
      ?.destination?.value?.key;
    const handoff: AiProposalHandoff = {
      proposal: session.proposal,
      destinationKey: dest || (session.proposal.leadForm ? "LEAD_FORM" : null),
    };
    navigate(manualPath, { state: { aiProposal: handoff } });
  };

  const campaignId =
    session?.meta?.campaignId || session?.metaDraft?.campaignId || "";
  const editPath = campaignId
    ? `/business/${tenantId}/dashboard/meta-campaigns/edit/${campaignId}`
    : manualPath;

  const mergeDraftError = (err: unknown, fallback: string) => {
    const parsed = readError(err, fallback);
    setError(parsed);
    if (parsed.unresolvedLocations?.length && session) {
      setSession({
        ...session,
        metaDraft: {
          status: session.metaDraft?.status || "IDLE",
          ...session.metaDraft,
          pendingLocations: parsed.unresolvedLocations,
        },
      });
    }
    if (parsed.tree) setActivationTree(parsed.tree);
    if (
      (parsed.code === "PARTIAL_ACTIVATION" || parsed.code === "META_DRAFT_FAILED") &&
      session
    ) {
      setSession({
        ...session,
        lifecycle: "META_FAILED",
        metaDraft: {
          status: "META_FAILED",
          ...session.metaDraft,
          error: parsed.message,
        },
      });
    }
    return parsed;
  };

  const runDraftAction = async (
    action: string,
    runner: () => Promise<AiCampaignSessionResponse>
  ) => {
    if (!session?.sessionId || busy || draftLockRef.current) return;
    draftLockRef.current = true;
    setBusy(true);
    setPendingAction(action);
    setError(null);
    const poll = window.setInterval(() => {
      if (!session.sessionId) return;
      void getAiCampaignSession(tenantId, session.sessionId)
        .then((next) => setSession(next))
        .catch(() => undefined);
    }, 1500);
    try {
      const next = await runner();
      applySession(next);
    } catch (err) {
      mergeDraftError(err, t("metaCampaigns.ai.errorGeneric"));
    } finally {
      window.clearInterval(poll);
      draftLockRef.current = false;
      setBusy(false);
      setPendingAction(null);
    }
  };

  const handleCreateDraft = () =>
    void runDraftAction("draft", () =>
      createAiCampaignMetaDraft(tenantId, session!.sessionId)
    );

  const handleRetryDraft = () =>
    void runDraftAction("draft", () =>
      retryAiCampaignMetaDraft(tenantId, session!.sessionId)
    );

  const handleConfirmLocations = (choices: Array<Record<string, unknown>>) =>
    void runDraftAction("draft", () =>
      confirmAiDraftLocations(tenantId, session!.sessionId, choices)
    );

  const handleConfirmPublish = () => {
    setConfirmPublish(false);
    void runDraftAction("activate", () =>
      activateAiCampaign(tenantId, session!.sessionId, true)
    );
  };

  const handleEditBeforePublish = () => {
    if (campaignId) {
      navigate(editPath);
      return;
    }
    handleManualEdit();
  };

  const progressLabel = useMemo(() => {
    const confirmed = session?.progress?.confirmed ?? 0;
    const required = session?.progress?.required ?? 5;
    return t("metaCampaigns.ai.progress", { confirmed, required });
  }, [session, t]);

  const question = session?.question || null;
  const isReady = session?.status === "READY_FOR_GENERATION";
  const hasProposal =
    Boolean(session?.proposal) && session?.generation?.status === "READY";

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
        ) : isReady && hasProposal && session.proposal ? (
          <MetaAiCampaignPreview
            session={session}
            busy={busy}
            pendingAction={pendingAction}
            onRevise={(instruction) => void handleRevise(instruction)}
            onRegenerate={() => void handleGenerate(true)}
            onManualEdit={handleManualEdit}
            onPatch={(patch) => void handlePatch(patch)}
            onUploadCreative={handleUploadCreative}
            onCreateDraft={handleCreateDraft}
            onRetryDraft={handleRetryDraft}
            onConfirmLocations={handleConfirmLocations}
            onRequestPublish={() => setConfirmPublish(true)}
            onConfirmPublish={handleConfirmPublish}
            onCancelPublish={() => setConfirmPublish(false)}
            confirmOpen={confirmPublish}
            activationTree={activationTree}
            onEditBeforePublish={handleEditBeforePublish}
            onViewCampaign={() => navigate(editPath)}
            onBackToCampaigns={() => navigate(overviewPath)}
          />
        ) : isReady && session?.ready ? (
          <div className="space-y-4" data-testid="meta-ai-ready">
            <p className="text-base font-black text-slate-900">
              {session.ready.message}
            </p>
            <button
              type="button"
              className={btnPrimary}
              data-testid="meta-ai-generate"
              disabled={busy || !session.ready.generateEnabled}
              onClick={() => void handleGenerate(false)}
            >
              {pendingAction === "generate" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {pendingAction === "generate"
                ? t("metaCampaigns.ai.generating")
                : t("metaCampaigns.ai.readyGenerate")}
            </button>
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

function humanizeAnswer(text: string, t: (key: string) => string) {
  const raw = String(text || "").trim();
  if (!raw) return raw;
  const labels: Record<string, string> = {
    OTHER: t("metaCampaigns.ai.answerLabels.OTHER"),
    LEADS: t("metaCampaigns.ai.objectives.LEADS"),
    WHATSAPP: t("metaCampaigns.ai.objectives.WHATSAPP"),
    BOOKINGS: t("metaCampaigns.ai.objectives.BOOKINGS"),
    SALES: t("metaCampaigns.ai.objectives.SALES"),
    TRAFFIC: t("metaCampaigns.ai.objectives.TRAFFIC"),
    PHONE: t("metaCampaigns.ai.objectives.PHONE"),
    AWARENESS: t("metaCampaigns.ai.objectives.AWARENESS"),
    LEAD_FORM: t("metaCampaigns.ai.destinations.LEAD_FORM"),
    WEBSITE: t("metaCampaigns.ai.destinations.WEBSITE"),
    BOOKING: t("metaCampaigns.ai.destinations.BOOKING"),
    CONFIRM_SUGGESTED: t("metaCampaigns.ai.answerLabels.CONFIRM_SUGGESTED"),
    ALL_IL: t("metaCampaigns.ai.answerLabels.ALL_IL"),
    CUSTOM: t("metaCampaigns.ai.answerLabels.CUSTOM"),
    RECOMMEND: t("metaCampaigns.ai.answerLabels.RECOMMEND"),
    NONE: t("metaCampaigns.ai.answerLabels.NONE"),
    LATER: t("metaCampaigns.ai.answerLabels.LATER"),
  };
  if (labels[raw]) return labels[raw];
  if (/^(service|product|offer):/i.test(raw)) {
    return raw.split(":").slice(1).join(":");
  }
  if (/^OUTCOME_/.test(raw)) return raw.replace(/^OUTCOME_/, "").replace(/_/g, " ");
  return raw;
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
  const { t } = useTranslation();
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
          {item.role === "user" ? humanizeAnswer(item.text, t) : item.text}
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
  const [textDraft, setTextDraft] = useState("");

  return (
    <div className="space-y-3" data-testid="meta-ai-question" data-field={question.field} data-type={question.type}>
      <p className="text-sm font-black text-slate-900">{question.message}</p>

      {question.type === "text" ? (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const value = textDraft.trim();
            if (value) void onAnswer(question.field, value);
          }}
        >
          <input
            className={inputBase}
            value={textDraft}
            onChange={(event) => setTextDraft(event.target.value)}
            placeholder={
              question.placeholder || t("metaCampaigns.ai.otherItemPlaceholder")
            }
            data-testid="meta-ai-text"
            disabled={busy}
          />
          <button type="submit" className={btnPrimary} disabled={busy || !textDraft.trim()}>
            {t("metaCampaigns.ai.send")}
          </button>
        </form>
      ) : null}

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
              onClick={() =>
                void onAnswer(question.field, {
                  value: option.value,
                  label: option.label,
                  itemType: option.itemType,
                  itemId: option.itemId,
                  itemName: option.itemName,
                })
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
