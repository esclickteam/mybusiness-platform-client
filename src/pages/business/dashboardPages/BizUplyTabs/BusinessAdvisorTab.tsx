"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import Markdown from "markdown-to-jsx";
import API from "@api";
import { useLocaleDir } from "@/hooks/useLocaleDir";
import {
  ArrowUp,
  BrainCircuit,
  History,
  LineChart,
  Megaphone,
  MessageSquareText,
  Plus,
  RefreshCw,
  Target,
  TrendingDown,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import {
  AdvisorActionsPanel,
  AdvisorThinkingLoader,
  getCapabilityPills,
  extractWhatsAppFromAnswer,
  stripExecutedSummaryFromAnswer,
  WhatsAppPreparedCard,
  type AdvisorAction,
  type WhatsAppPrepared,
} from "./AdvisorUxParts";

type ChatRole = "assistant" | "user";

type AdvisorMode =
  | "general"
  | "today_focus"
  | "leads_attention"
  | "sales_drop"
  | "followup_message"
  | "campaign_improve"
  | "reps_performance"
  | "build_automation"
  | "weekly_plan"
  | "monthly_plan"
  | "yearly_plan"
  | "marketing"
  | "actions"
  | "profitability"
  | "customer_retention"
  | "find_business_partner";

type ChatMessage = {
  role: ChatRole;
  content: string;
  actions?: AdvisorAction[];
  whatsappPrepared?: WhatsAppPrepared;
};

type ActionResponse = {
  success?: boolean;
  message?: string;
  navigateTo?: string | null;
  whatsappUrl?: string | null;
  result?: {
    content?: string;
    phone?: string;
    whatsappUrl?: string;
    ownerSendsManually?: boolean;
  };
  error?: string;
};

type BusinessAdvisorTabProps = {
  businessId?: string | null;
  conversationId?: string | null;
  userId?: string | null;
  businessDetails?: unknown;
  onOpenAiAutomations?: () => void;
};

type BusinessResponse = {
  business?: {
    extraQuestionsAllowed?: number;
    monthlyQuestionCount?: number;
    extraQuestionsUsed?: number;
  };
};

type AdvisorResponse = {
  success?: boolean;
  charged?: boolean;
  answer?: string;
  answerStyle?: "short" | "medium" | "full";
  actions?: AdvisorAction[];
  adviceOnly?: boolean;
  agentMode?: boolean;
  conversation?: {
    id: string;
    dateKey: string;
    title: string;
  };
  usage?: {
    totalAllowed: number;
    totalUsed: number;
    remaining: number;
  };
};

type AdvisorHistoryItem = {
  id: string;
  dateKey: string;
  title: string;
  preview?: string;
  messagesCount?: number;
  updatedAt?: string;
};

type AdvisorHistoryResponse = {
  success?: boolean;
  charged?: boolean;
  conversations?: AdvisorHistoryItem[];
};

type AdvisorConversationResponse = {
  success?: boolean;
  charged?: boolean;
  conversation?: {
    id: string;
    dateKey: string;
    title: string;
    messages: Array<{
      role: ChatRole;
      content: string;
      advisorMode?: AdvisorMode;
      createdAt?: string;
    }>;
  };
};

type QuickCommand = {
  id: AdvisorMode;
  label: string;
  shortLabel: string;
  prompt: string;
  icon: React.ElementType;
  highlighted?: boolean;
};

const QUICK_COMMAND_MODES: Array<{
  id: AdvisorMode;
  icon: React.ElementType;
  highlighted?: boolean;
}> = [
  { id: "today_focus", icon: Target, highlighted: true },
  { id: "leads_attention", icon: Users },
  { id: "sales_drop", icon: TrendingDown },
  { id: "followup_message", icon: MessageSquareText },
  { id: "campaign_improve", icon: Megaphone },
  { id: "reps_performance", icon: LineChart },
  { id: "build_automation", icon: Workflow },
];

type StarterQuestion = {
  label: string;
  prompt: string;
  mode: AdvisorMode;
};

const STARTER_KEYS: Array<{
  key:
    | "today"
    | "leads"
    | "salesDrop"
    | "followup";
  mode: AdvisorMode;
}> = [
  { key: "today", mode: "today_focus" },
  { key: "leads", mode: "leads_attention" },
  { key: "salesDrop", mode: "sales_drop" },
  { key: "followup", mode: "followup_message" },
];

const isNavigationAction = (type: string) => type.startsWith("OPEN_");

const isMongoObjectId = (value?: string | null) => {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
};

const buildAdvisorPrompt = (
  userPrompt: string,
  mode: AdvisorMode,
  t: TFunction
) => {
  const modeKey = mode === "general" ? "general" : mode;

  return `${t("advisor.promptRules")}

${t(`advisor.modeInstructions.${modeKey}`)}

${t("advisor.promptRequest")}
${userPrompt}`;
};

export default function BusinessAdvisorTab({
  businessId,
  conversationId,
  userId,
  businessDetails,
  onOpenAiAutomations,
}: BusinessAdvisorTabProps) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const navigate = useNavigate();
  const advisorLanguage = i18n.language?.startsWith("en") ? "en" : "he";
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<AdvisorMode>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<AdvisorHistoryItem[]>([]);
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(
    null
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const validInitialConversationId = useMemo(() => {
    return isMongoObjectId(conversationId) ? conversationId : null;
  }, [conversationId]);

  const isLimitReached =
    remainingQuestions !== null && remainingQuestions <= 0;

  const capabilityPills = useMemo(() => getCapabilityPills(t), [t]);

  const quickCommands = useMemo<QuickCommand[]>(
    () =>
      QUICK_COMMAND_MODES.map((command) => ({
        id: command.id,
        label: t(`advisor.modes.${command.id}`),
        shortLabel: t(`advisor.modeShortLabels.${command.id}`),
        prompt: t(`advisor.modePrompts.${command.id}`),
        icon: command.icon,
        highlighted: command.highlighted,
      })),
    [t]
  );

  const starterQuestions = useMemo<StarterQuestion[]>(
    () =>
      STARTER_KEYS.map(({ key, mode }) => ({
        label: t(`advisor.starters.${key}`),
        prompt: t(`advisor.starters.${key}`),
        mode,
      })),
    [t]
  );

  const balanceLabel = useMemo(() => {
    if (remainingQuestions === null) return t("advisor.balanceLoading");
    if (remainingQuestions === 0) return t("advisor.balanceNone");
    if (remainingQuestions === 1) return t("advisor.balanceOne");
    return t("advisor.balanceMany", { count: remainingQuestions });
  }, [remainingQuestions, t]);

  const activeModeLabel = useMemo(() => {
    if (activeMode === "general") return t("advisor.freeQuestion");
    return t(`advisor.modes.${activeMode}`, {
      defaultValue: t("advisor.freeQuestion"),
    });
  }, [activeMode, t]);

  const scrollChatToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      requestAnimationFrame(() => {
        if (!chatContainerRef.current) return;

        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior,
        });
      });
    },
    []
  );

  const refreshRemainingQuestions = useCallback(async () => {
    if (!businessId) return;

    try {
      const res = await API.get<BusinessResponse>(
        `/business/${businessId}?t=${Date.now()}`
      );

      const business = res.data.business;

      if (!business) {
        setRemainingQuestions(null);
        return;
      }

      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions =
        (business.monthlyQuestionCount || 0) +
        (business.extraQuestionsUsed || 0);

      setRemainingQuestions(Math.max(maxQuestions - usedQuestions, 0));
    } catch {
      setRemainingQuestions(null);
    }
  }, [businessId]);

  const loadHistory = useCallback(async () => {
    if (!businessId) return;

    try {
      setHistoryLoading(true);

      const res = await API.get<AdvisorHistoryResponse>(
        `/chat/business-advisor/history?businessId=${businessId}&userId=${
          userId || ""
        }`
      );

      setHistory(res.data.conversations || []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [businessId, userId]);

  const loadConversation = useCallback(
    async (conversationIdToLoad: string) => {
      if (!isMongoObjectId(conversationIdToLoad)) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ ${t("advisor.errors.invalidConversationId")}`,
          },
        ]);
        scrollChatToBottom();
        return;
      }

      try {
        const res = await API.get<AdvisorConversationResponse>(
          `/chat/business-advisor/history/${conversationIdToLoad}`
        );

        const loadedMessages = res.data.conversation?.messages || [];

        setMessages(
          loadedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
        );

        setActiveConversationId(conversationIdToLoad);
        scrollChatToBottom("auto");
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ ${t("advisor.errors.openConversation")}`,
          },
        ]);
        scrollChatToBottom();
      }
    },
    [scrollChatToBottom, t]
  );

  const startNewConversation = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content: t("advisor.welcome"),
      },
    ]);
    setActiveConversationId(null);
    setActiveMode("general");
    setUserInput("");
    scrollChatToBottom("auto");
  }, [scrollChatToBottom, t]);

  useEffect(() => {
    void refreshRemainingQuestions();
    void loadHistory();
  }, [refreshRemainingQuestions, loadHistory]);

  useEffect(() => {
    if (validInitialConversationId) {
      void loadConversation(validInitialConversationId);
      return;
    }

    startNewConversation();
  }, [validInitialConversationId, loadConversation, startNewConversation]);

  const handleActionResult = useCallback(
    (response: ActionResponse) => {
      if (response.navigateTo) {
        if (
          response.navigateTo.includes("/dashboard/automations") &&
          onOpenAiAutomations
        ) {
          onOpenAiAutomations();
          return;
        }
        navigate(response.navigateTo);
      }
    },
    [navigate, onOpenAiAutomations]
  );

  const executeAction = useCallback(
    async (action: AdvisorAction) => {
      if (!businessId || actionLoading) return;

      // Advice-only: navigation / deep-links. Write actions belong in Automations.
      if (!isNavigationAction(action.type)) {
        onOpenAiAutomations?.();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: t("advisor.errors.actionsAreAutomations"),
          },
        ]);
        scrollChatToBottom();
        return;
      }

      if (action.type === "OPEN_AUTOMATIONS" && onOpenAiAutomations) {
        onOpenAiAutomations();
        return;
      }

      setActionLoading(action.type);

      try {
        const response = await API.post<ActionResponse>(
          "/chat/business-advisor/action",
          {
            businessId,
            action,
            advisorMode: activeMode,
            lastAnswer,
          }
        );

        if (response.data.success || response.data.navigateTo) {
          handleActionResult(response.data);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ ${response.data.error || t("advisor.errors.actionFailed")}`,
            },
          ]);
          scrollChatToBottom();
        }
      } catch (error) {
        const err = error as {
          response?: { data?: ActionResponse & { error?: string } };
        };
        const data = err.response?.data;

        if (data?.navigateTo) {
          handleActionResult(data);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ ${data?.error || t("advisor.errors.actionRetry")}`,
            },
          ]);
          scrollChatToBottom();
        }
      } finally {
        setActionLoading(null);
      }
    },
    [
      businessId,
      actionLoading,
      activeMode,
      lastAnswer,
      handleActionResult,
      onOpenAiAutomations,
      scrollChatToBottom,
      t,
    ]
  );

  const sendMessage = useCallback(
    async (
      promptText: string,
      conversationMessages: ChatMessage[],
      mode: AdvisorMode = "general"
    ) => {
      const cleanPrompt = promptText.trim();

      if (!businessId || !cleanPrompt || loading) return;

      if (isLimitReached) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `❗ ${t("advisor.errors.monthlyLimit")}`,
          },
        ]);
        scrollChatToBottom();
        return;
      }

      const requestId = requestSeqRef.current + 1;
      requestSeqRef.current = requestId;

      setLoading(true);
      setActiveMode(mode);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const finalPrompt = buildAdvisorPrompt(cleanPrompt, mode, t);

      try {
        const response = await API.post<AdvisorResponse>(
          "/chat/business-advisor",
          {
            businessId,
            prompt: finalPrompt,
            rawPrompt: cleanPrompt,
            advisorMode: mode,
            language: advisorLanguage,
            businessDetails,
            profile: {
              conversationId: isMongoObjectId(activeConversationId)
                ? activeConversationId
                : null,
              userId: userId || null,
            },
            messages: conversationMessages.slice(-8),
          },
          { signal: controller.signal }
        );

        if (requestSeqRef.current !== requestId) {
          return;
        }

        const answer = response.data.answer || `❌ ${t("advisor.errors.noAnswer")}`;

        setLastAnswer(answer);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
            actions: (response.data.actions || []).filter((action) =>
              isNavigationAction(action.type)
            ),
          },
        ]);

        if (response.data.conversation?.id) {
          setActiveConversationId(response.data.conversation.id);
        }

        if (
          response.data.charged &&
          typeof response.data.usage?.remaining === "number"
        ) {
          setRemainingQuestions(response.data.usage.remaining);
        } else {
          await refreshRemainingQuestions();
        }

        await loadHistory();
        scrollChatToBottom();
      } catch (error) {
        const err = error as Error & { code?: string };

        if (
          requestSeqRef.current !== requestId ||
          err.name === "AbortError" ||
          err.name === "CanceledError" ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `⚠️ ${t("advisor.errors.analysisFailed")}`,
          },
        ]);
        scrollChatToBottom();
      } finally {
        if (requestSeqRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [
      businessId,
      businessDetails,
      activeConversationId,
      userId,
      loading,
      isLimitReached,
      refreshRemainingQuestions,
      loadHistory,
      scrollChatToBottom,
      t,
      advisorLanguage,
    ]
  );

  const submitPrompt = useCallback(
    (
      promptText: string,
      mode: AdvisorMode = "general",
      visibleText?: string
    ) => {
      const cleanInput = promptText.trim();
      const cleanVisibleText = (visibleText || promptText).trim();

      if (!cleanInput || loading || isLimitReached) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: cleanVisibleText,
      };

      const newMessages = [...messages, userMessage];

      setMessages(newMessages);
      setUserInput("");

      if (inputRef.current) {
        inputRef.current.style.height = "44px";
      }

      scrollChatToBottom();

      void sendMessage(cleanInput, newMessages, mode);
    },
    [loading, isLimitReached, messages, sendMessage, scrollChatToBottom]
  );

  const handleSubmit = useCallback(() => {
    submitPrompt(userInput, "general");
  }, [submitPrompt, userInput]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <section
      dir={dir}
      className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-hidden bg-slate-50 p-3 text-start text-slate-800 sm:p-5"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1700px] flex-col gap-4">
        <header className="shrink-0 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-lg shadow-violet-200">
                <BrainCircuit className="h-6 w-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
                    {t("advisor.title")}
                  </h1>

                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                    {t("advisor.adviceOnlyBadge")}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {capabilityPills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {t("advisor.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <p className="text-[11px] font-black text-slate-400">
                  {t("advisor.currentMode")}
                </p>
                <p className="text-base font-black leading-6 text-slate-900">
                  {activeModeLabel}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-2">
                <p className="text-[11px] font-black text-violet-400">
                  {t("advisor.aiBalance")}
                </p>
                <p className="text-sm font-black text-violet-800">
                  {balanceLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={startNewConversation}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
              >
                <Plus className="h-5 w-5" />
                {t("advisor.newChat")}
              </button>
            </div>
          </div>
        </header>

        <main className="grid min-h-0 min-w-0 flex-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_340px] 2xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          <aside className="order-2 min-h-0 min-w-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm xl:order-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-800">
                  {t("advisor.historyTitle")}
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  {t("advisor.historySubtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadHistory()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                title={t("advisor.refresh")}
              >
                {historyLoading ? (
                  <BizuplyLoader size="xs" compact />
                ) : (
                  <RefreshCw className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="max-h-[calc(100vh-330px)] space-y-2 overflow-y-auto pr-1">
              {history.length === 0 && !historyLoading && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                  <History className="mx-auto h-5 w-5 text-slate-400" />
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {t("advisor.historyEmpty")}
                  </p>
                </div>
              )}

              {history.map((item) => {
                const isActive = activeConversationId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => loadConversation(item.id)}
                    className={`w-full rounded-2xl border p-3 text-start transition ${
                      isActive
                        ? "border-violet-300 bg-violet-50"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-black text-violet-700">
                        {item.dateKey}
                      </p>

                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-500">
                        {item.messagesCount || 0}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-sm font-black text-slate-900">
                      {item.title || t("advisor.defaultConversationTitle")}
                    </p>

                    {item.preview && (
                      <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                        {item.preview}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="order-1 flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-2">
            <div className="shrink-0 border-b border-slate-100 bg-gradient-to-l from-white via-violet-50/70 to-sky-50/70 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-black text-slate-800">
                    {t("advisor.chatTitle")}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {t("advisor.chatSubtitle")}
                  </p>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm ring-1 ring-violet-100">
                    {t("advisor.messagesCount", { count: messages.length })}
                  </span>
                </div>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/70 px-3 py-4 sm:px-5"
            >
              <div className="flex min-w-0 flex-col gap-4">
                {messages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  const stripped = isAssistant
                    ? stripExecutedSummaryFromAnswer(msg.content)
                    : msg.content;
                  const parsed = isAssistant
                    ? extractWhatsAppFromAnswer(stripped)
                    : { displayContent: stripped, extracted: [] as WhatsAppPrepared[] };
                  const displayContent = parsed.displayContent;

                  return (
                    <div
                      key={`${msg.role}-${index}`}
                      className={`flex min-w-0 gap-3 ${
                        isAssistant ? "justify-start" : "justify-end"
                      }`}
                    >
                      {isAssistant && (
                        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-md shadow-violet-200">
                          <BrainCircuit className="h-4 w-4" />
                        </span>
                      )}

                      <div
                        className={`${
                          isAssistant
                            ? "max-w-[min(100%,720px)]"
                            : "max-w-[min(92%,520px)]"
                        } break-words rounded-[24px] px-5 py-4 text-[15px] leading-8 shadow-sm ${
                          isAssistant
                            ? "border border-slate-200 bg-white text-slate-800"
                            : "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
                        }`}
                      >
                        {isAssistant ? (
                          <div>
                            {displayContent && (
                              <div className="max-w-none overflow-hidden break-words [&_*]:max-w-full [&_*]:break-words [&_code]:whitespace-pre-wrap [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-black [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-black [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-black [&_li]:my-2 [&_ol]:my-3 [&_p]:my-3 [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_strong]:font-black [&_strong]:text-slate-800 [&_ul]:my-3">
                                <Markdown>{displayContent}</Markdown>
                              </div>
                            )}

                            {parsed.extracted.map((prepared, waIndex) => (
                              <div
                                key={`wa-extracted-${index}-${waIndex}`}
                                className="mt-4"
                              >
                                <WhatsAppPreparedCard prepared={prepared} />
                              </div>
                            ))}

                            {msg.whatsappPrepared && (
                              <div className="mt-4">
                                <WhatsAppPreparedCard
                                  prepared={msg.whatsappPrepared}
                                />
                              </div>
                            )}

                            {msg.actions && msg.actions.length > 0 && (
                              <AdvisorActionsPanel
                                actions={msg.actions}
                                actionLoading={actionLoading}
                                disabled={loading || isLimitReached}
                                onAction={(action) => void executeAction(action)}
                              />
                            )}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && <AdvisorThinkingLoader />}
              </div>
            </div>

            <div className="sticky bottom-0 z-30 shrink-0 border-t border-slate-100 bg-white/95 p-3 shadow-[0_-18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
              {isLimitReached && (
                <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {t("advisor.limitReached")}
                </div>
              )}

              <div className="mb-3 flex flex-wrap gap-2 pb-1">
                {starterQuestions.map((question) => (
                  <button
                    key={question.label}
                    type="button"
                    onClick={() =>
                      submitPrompt(question.prompt, question.mode, question.label)
                    }
                    disabled={loading || isLimitReached}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-end">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  disabled={loading || isLimitReached}
                  rows={1}
                  placeholder={t("advisor.inputPlaceholder")}
                  onChange={(e) => {
                    setUserInput(e.target.value);
                    e.currentTarget.style.height = "44px";
                    e.currentTarget.style.height = `${Math.min(
                      e.currentTarget.scrollHeight,
                      130
                    )}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="min-h-11 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !userInput.trim() || isLimitReached}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-5 text-sm font-black text-black shadow-lg shadow-violet-100 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                  {loading ? t("advisor.thinking") : t("advisor.send")}
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          <aside className="order-3 min-h-0 min-w-0 overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-800">
                {t("advisor.quickActionsTitle")}
              </h2>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                {t("advisor.quickActionsSubtitle")}
              </p>
            </div>

            <div className="space-y-2">
              {quickCommands.map((command) => {
                const Icon = command.icon;

                return (
                  <button
                    key={command.id}
                    type="button"
                    onClick={() =>
                      submitPrompt(command.prompt, command.id, command.label)
                    }
                    disabled={loading || isLimitReached}
                    className={`group flex min-h-[92px] w-full items-center justify-between gap-3 rounded-[24px] border p-4 text-start transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      command.highlighted
                        ? "border-violet-200 bg-violet-50 hover:bg-violet-100"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                          command.highlighted
                            ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
                            : "bg-violet-100 text-violet-700 group-hover:border-violet-200/80 group-hover:from-violet-200/80 group-hover:via-sky-100 group-hover:to-cyan-100 group-hover:text-slate-800"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <div>
                        <p className="text-base font-black leading-6 text-slate-900">
                          {command.label}
                        </p>
                        <p className="text-xs font-bold text-slate-400">
                          {command.shortLabel}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-sky-700" />
                <p className="text-xs font-black text-sky-800">
                  {t("advisor.tipTitle")}
                </p>
              </div>

              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
                {t("advisor.tipBody")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenAiAutomations?.()}
              className="mt-3 flex w-full items-center justify-between gap-3 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-start transition hover:bg-amber-100"
            >
              <div>
                <p className="text-sm font-black text-amber-900">
                  {t("advisor.aiAutomations.ctaTitle")}
                </p>
                <p className="mt-1 text-xs font-bold text-amber-800/80">
                  {t("advisor.aiAutomations.ctaBody")}
                </p>
              </div>
              <Zap className="h-5 w-5 shrink-0 text-amber-700" />
            </button>
          </aside>
        </main>
      </div>
    </section>
  );
}