"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import API from "@api";
import {
  ArrowUp,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  Clock3,
  FileText,
  History,
  Loader2,
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  AdvisorActionsPanel,
  AdvisorExecutedStrip,
  AdvisorThinkingLoader,
  CAPABILITY_PILLS,
  getActionMeta,
  stripExecutedSummaryFromAnswer,
  WhatsAppPreparedCard,
  type AdvisorAction,
  type ExecutedAction,
  type WhatsAppPrepared,
} from "./AdvisorUxParts";

type ChatRole = "assistant" | "user";

type AdvisorMode =
  | "general"
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
  executedActions?: ExecutedAction[];
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
  executedActions?: ExecutedAction[];
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

const quickCommands: QuickCommand[] = [
  {
    id: "find_business_partner",
    label: "מציאת שותף עסקי",
    shortLabel: "שותף",
    icon: Search,
    highlighted: true,
    prompt:
      "מצא לי שותף עסקי מתאים מתוך העסקים במערכת. עבור על העסקים הקיימים, בדוק התאמה לפי תחום, שירותים, אזור, קהל יעד, פוטנציאל עסקי והאם מדובר בעסק משלים או מתחרה. החזר לי רשימת עסקים מומלצים עם אחוז התאמה, למה כל עסק מתאים, איזה ערך הוא יכול לתת לי, איזה ערך אני יכול לתת לו, וסיים עם הודעת פנייה מוכנה לשליחה.",
  },

  {
    id: "weekly_plan",
    label: "תכנית שבועית",
    shortLabel: "שבוע",
    icon: CalendarDays,
    prompt:
      "בנה לי תכנית ייעוץ עסקי לשבוע הקרוב לפי נתוני העסק שלי. תכלול יעדים, פעולות לפי ימים, משימות, נוסחים מוכנים ומדדי הצלחה.",
  },
  {
    id: "monthly_plan",
    label: "תכנית חודשית",
    shortLabel: "חודש",
    icon: BarChart3,
    prompt:
      "בנה לי תכנית ייעוץ עסקי חודשית לצמיחה. תכלול חלוקה לשבועות, שיווק, מכירות, שימור לקוחות, תפעול, יעדים ומדדים.",
  },
  {
    id: "yearly_plan",
    label: "תכנית שנתית",
    shortLabel: "שנה",
    icon: FileText,
    prompt:
      "בנה לי תכנית עסקית שנתית מסודרת לעסק. תכלול מטרות, חלוקה לרבעונים, פעולות לכל רבעון, מדדי הצלחה ומה להתחיל לבצע עכשיו.",
  },
  {
    id: "marketing",
    label: "שיווק",
    shortLabel: "שיווק",
    icon: Megaphone,
    prompt:
      "בנה לי תכנית שיווקית ממוקדת לעסק לפי הנתונים שלי. תמליץ מה לקדם, למי לפנות, איזה מבצע לעשות, ותן הודעות וואטסאפ ופוסטים מוכנים.",
  },
  {
    id: "actions",
    label: "פעולות דחופות",
    shortLabel: "דחוף",
    icon: Clock3,
    prompt:
      "נתח את העסק שלי ותן לי רשימת פעולות דחופות לביצוע עכשיו לפי סדר עדיפויות. תכתוב מה לעשות, למה זה חשוב ואיך לבצע.",
  },
  {
    id: "profitability",
    label: "רווחיות",
    shortLabel: "רווח",
    icon: TrendingUp,
    prompt:
      "נתח את הרווחיות והתמחור של העסק שלי. תמליץ אילו שירותים לקדם, איפה אפשר להעלות ערך, אילו חבילות ליצור ומה לבדוק לפני שינוי מחירים.",
  },
  {
    id: "customer_retention",
    label: "שימור לקוחות",
    shortLabel: "שימור",
    icon: Users,
    prompt:
      "בנה לי תכנית שימור והחזרת לקוחות. תכתוב למי כדאי לפנות, מתי, איזה הודעות לשלוח, ואיך להפוך לקוחות חד פעמיים ללקוחות חוזרים.",
  },
];

type StarterQuestion = {
  label: string;
  mode: AdvisorMode;
};

const starterQuestions: StarterQuestion[] = [
  { label: "מצא לי שותף עסקי", mode: "find_business_partner" },
  { label: "מה הכי חשוב לשפר השבוע?", mode: "actions" },
  { label: "איזה שירות כדאי לקדם עכשיו?", mode: "marketing" },
  { label: "איך לסגור יותר לידים?", mode: "customer_retention" },
];

const isMongoObjectId = (value?: string | null) => {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
};

const buildAdvisorPrompt = (userPrompt: string, mode: AdvisorMode) => {
  const base = `
אתה יועץ BizUply — יועץ עסקי, שיווקי ותפעולי חכם לעסקים קטנים ובינוניים.

חוקים:
- ענה בעברית בלבד.
- אם השאלה קצרה, ענה קצר וענייני.
- אם ביקשו תכנית, בנה תכנית מסודרת ומקצועית.
- אל תמציא נתונים שאין במערכת.
- כל המלצה חייבת להפוך לפעולה ברורה.
- כתוב מה לבצע, מתי, למה ואיך למדוד הצלחה.
`.trim();

  const modeText: Record<AdvisorMode, string> = {
    general:
      "מצב: ייעוץ כללי. ענה לפי השאלה בלבד. אם זו שאלה קצרה, לא לבנות תכנית מלאה.",
    weekly_plan:
      "מצב: תכנית שבועית. כלול יעד שבועי, פעולות לפי ימים, משימות, נוסחים ומדדי הצלחה.",
    monthly_plan:
      "מצב: תכנית חודשית. כלול 4 שבועות, שיווק, מכירות, שימור, תפעול ומדדים.",
    yearly_plan:
      "מצב: תכנית שנתית. כלול חזון, מטרות, רבעונים, פעולות ומדדים.",
    marketing:
      "מצב: שיווק. כלול שירות לקידום, קהל יעד, הצעה, הודעת וואטסאפ ופוסט.",
    actions:
      "מצב: פעולות דחופות. תן סדר עדיפויות קצר וברור לביצוע עכשיו.",
    profitability:
      "מצב: רווחיות ותמחור. נתח שירותים, ערך, חבילות ושיפור רווחיות.",
    customer_retention:
      "מצב: שימור לקוחות. תן תהליך החזרת לקוחות והודעות מוכנות.",
    find_business_partner:
      "מצב: מציאת שותף עסקי. עבור על העסקים במערכת, מצא התאמות עסקיות, דרג לפי אחוז התאמה, הסבר למה כל עסק מתאים ותן הודעת פנייה מוכנה.",
  };

  return `${base}

${modeText[mode]}

בקשת בעל העסק:
${userPrompt}`;
};

export default function BusinessAdvisorTab({
  businessId,
  conversationId,
  userId,
  businessDetails,
}: BusinessAdvisorTabProps) {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<AdvisorAction | null>(
    null
  );
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

  const balanceLabel = useMemo(() => {
    if (remainingQuestions === null) return "טוען...";
    if (remainingQuestions === 0) return "נגמרו שאלות החודש";
    if (remainingQuestions === 1) return "נשארה שאלה אחת";
    return `${remainingQuestions} שאלות נשארו`;
  }, [remainingQuestions]);

  const activeModeLabel = useMemo(() => {
    return (
      quickCommands.find((command) => command.id === activeMode)?.label ||
      "שאלה חופשית"
    );
  }, [activeMode]);

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
            content: "⚠️ מזהה השיחה לא תקין ולכן לא ניתן לפתוח אותה.",
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
            content: "⚠️ לא הצלחתי לפתוח את השיחה הישנה.",
          },
        ]);
        scrollChatToBottom();
      }
    },
    [scrollChatToBottom]
  );

  const startNewConversation = useCallback(() => {
    setMessages([
      {
        role: "assistant",
        content:
          "היי 👋 אני **יועץ BizUply** שלך — עוזר עסקי שמבצע פעולות אמיתיות.\n\nאני יכול לקבוע פגישות, ליצור משימות, לעדכן לידים, למצוא שותפים עסקיים ולהכין הודעות WhatsApp מוכנות לשליחה שלך.\n\nשאל שאלה קצרה, או לחץ על **מציאת שותף עסקי** לסריקה חכמה.",
      },
    ]);
    setActiveConversationId(null);
    setActiveMode("general");
    setUserInput("");
    scrollChatToBottom("auto");
  }, [scrollChatToBottom]);

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

  const renderWhatsAppPrepared = useCallback(
    (prepared: WhatsAppPrepared) => <WhatsAppPreparedCard prepared={prepared} />,
    []
  );

  const handleActionResult = useCallback(
    (action: AdvisorAction, response: ActionResponse) => {
      if (response.navigateTo) {
        navigate(response.navigateTo);
        return;
      }

      const whatsappUrl =
        response.whatsappUrl || response.result?.whatsappUrl || null;
      const content = response.result?.content || "";
      const phone = response.result?.phone;

      if (whatsappUrl && content) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ ${response.message || "הודעת WhatsApp מוכנה"}`,
            whatsappPrepared: {
              content,
              phone,
              whatsappUrl,
            },
          },
        ]);
        scrollChatToBottom();
        return;
      }

      const successMessage = response.message || `בוצע: ${action.label}`;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `✅ ${successMessage}`,
        },
      ]);
      scrollChatToBottom();
    },
    [navigate, scrollChatToBottom]
  );

  const executeAction = useCallback(
    async (action: AdvisorAction) => {
      if (!businessId || actionLoading) return;

      const isNavigation = action.type.startsWith("OPEN_");

      if (action.requiresConfirmation !== false && !isNavigation) {
        setPendingAction(action);
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

        if (response.data.success) {
          handleActionResult(action, response.data);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `⚠️ ${response.data.error || "הפעולה נכשלה"}`,
            },
          ]);
          scrollChatToBottom();
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ לא הצלחתי לבצע את הפעולה. נסה שוב.",
          },
        ]);
        scrollChatToBottom();
      } finally {
        setActionLoading(null);
        setPendingAction(null);
      }
    },
    [
      businessId,
      actionLoading,
      activeMode,
      lastAnswer,
      handleActionResult,
      scrollChatToBottom,
    ]
  );

  const confirmPendingAction = useCallback(() => {
    if (pendingAction) {
      const action = { ...pendingAction, requiresConfirmation: false };
      setPendingAction(null);
      void executeAction(action);
    }
  }, [pendingAction, executeAction]);

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
            content: "❗ הגעת למגבלת שאלות ה-AI החודשית שלך.",
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

      const finalPrompt = buildAdvisorPrompt(cleanPrompt, mode);

      try {
        const response = await API.post<AdvisorResponse>(
          "/chat/business-advisor",
          {
            businessId,
            prompt: finalPrompt,
            rawPrompt: cleanPrompt,
            advisorMode: mode,
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

        const answer = response.data.answer || "❌ לא התקבלה תשובה מהשרת.";

        setLastAnswer(answer);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
            actions: response.data.actions || [],
            executedActions: response.data.executedActions || [],
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
            content: "⚠️ משהו השתבש בזמן ניתוח העסק. נסה שוב.",
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
      dir="rtl"
      className="h-[calc(100vh-120px)] max-h-[calc(100vh-120px)] overflow-hidden bg-slate-50 p-3 text-right text-slate-950 sm:p-5"
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-[1700px] flex-col gap-4">
        <header className="shrink-0 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                <BrainCircuit className="h-6 w-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    יועץ BizUply
                  </h1>

                  <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                    Agent פעיל
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CAPABILITY_PILLS.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  יועץ שמבצע פעולות אמיתיות — פגישות, משימות, לידים והודעות
                  WhatsApp מוכנות לשליחה שלך.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <p className="text-[11px] font-black text-slate-400">
                  מצב נוכחי
                </p>
                <p className="text-base font-black leading-6 text-slate-900">
                  {activeModeLabel}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-2">
                <p className="text-[11px] font-black text-violet-400">
                  מאזן AI
                </p>
                <p className="text-sm font-black text-violet-800">
                  {balanceLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={startNewConversation}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-violet-700"
              >
                <Plus className="h-5 w-5" />
                שיחה חדשה
              </button>
            </div>
          </div>
        </header>

        <main className="grid min-h-0 min-w-0 flex-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_340px] 2xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          <aside className="order-2 min-h-0 min-w-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm xl:order-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-black text-slate-950">
                  היסטוריה יומית
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-500">
                  השיחות נשמרות לפי יום.
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadHistory()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                title="רענון"
              >
                {historyLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                    עדיין אין שיחות שמורות.
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
                    className={`w-full rounded-2xl border p-3 text-right transition ${
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
                      {item.title || "שיחת ייעוץ"}
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
                  <p className="text-base font-black text-slate-950">
                    צ׳אט עם יועץ BizUply
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    הודעות חדשות מופיעות למטה. יש סקרול פנימי רק לשיחה.
                  </p>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm ring-1 ring-violet-100">
                    {messages.length} הודעות
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
                  const displayContent = isAssistant
                    ? stripExecutedSummaryFromAnswer(msg.content)
                    : msg.content;

                  return (
                    <div
                      key={`${msg.role}-${index}`}
                      className={`flex min-w-0 gap-3 ${
                        isAssistant ? "justify-start" : "justify-end"
                      }`}
                    >
                      {isAssistant && (
                        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
                          <BrainCircuit className="h-4 w-4" />
                        </span>
                      )}

                      <div
                        className={`${isAssistant ? "min-w-0 flex-1" : "max-w-[92%]"} break-words rounded-[24px] px-5 py-4 text-[15px] leading-8 shadow-sm ${
                          isAssistant
                            ? "border border-slate-200 bg-white text-slate-800"
                            : "bg-violet-600 text-white"
                        }`}
                      >
                        {isAssistant ? (
                          <div>
                            <div className="max-w-none overflow-hidden break-words [&_*]:max-w-full [&_*]:break-words [&_code]:whitespace-pre-wrap [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-black [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-black [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-black [&_li]:my-2 [&_ol]:my-3 [&_p]:my-3 [&_pre]:overflow-x-hidden [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_strong]:font-black [&_strong]:text-slate-950 [&_ul]:my-3">
                              <Markdown>{displayContent}</Markdown>
                            </div>

                            {msg.executedActions &&
                              msg.executedActions.length > 0 && (
                                <AdvisorExecutedStrip
                                  items={msg.executedActions}
                                  renderWhatsApp={renderWhatsAppPrepared}
                                />
                              )}

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
                  הגעת למגבלת שאלות ה-AI החודשית שלך.
                </div>
              )}

              <div className="mb-3 flex flex-wrap gap-2 pb-1">
                {starterQuestions.map((question) => (
                  <button
                    key={question.label}
                    type="button"
                    onClick={() =>
                      submitPrompt(question.label, question.mode, question.label)
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
                  placeholder="לדוגמה: קבע פגישה ליום שלישי, הכן הודעת WhatsApp ללידים..."
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                >
                  {loading ? "חושב..." : "שלח"}
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          <aside className="order-3 min-h-0 min-w-0 overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-950">
                פעולות מהירות
              </h2>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                סריקה חכמה של העסק והמערכת.
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
                    className={`group flex min-h-[92px] w-full items-center justify-between gap-3 rounded-[24px] border p-4 text-right transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      command.highlighted
                        ? "border-violet-200 bg-violet-50 hover:bg-violet-100"
                        : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                          command.highlighted
                            ? "bg-violet-600 text-white"
                            : "bg-violet-100 text-violet-700 group-hover:bg-violet-600 group-hover:text-white"
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

            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50 p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-700" />
                <p className="text-xs font-black text-violet-800">
                  טיפ שימוש
                </p>
              </div>

              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
                היועץ מבצע פעולות אמיתיות: תיאום פגישות, יצירת משימות, עדכון לידים,
                מציאת שותפים והכנת הודעות WhatsApp מוכנות לשליחה שלך.
              </p>
            </div>
          </aside>
        </main>
      </div>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div
            dir="rtl"
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 bg-violet-50 px-6 py-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const MetaIcon = getActionMeta(pendingAction.type).icon;
                  return (
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
                      <MetaIcon className="h-5 w-5" />
                    </span>
                  );
                })()}
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    לאשר פעולה?
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    הפעולה תבוצע במערכת BizUply
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-base font-black text-violet-700">
                {pendingAction.label}
              </p>
              <p className="mt-2 text-sm font-semibold leading-7 text-slate-600">
                {pendingAction.description ||
                  getActionMeta(pendingAction.type).hint}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-100"
                >
                  ביטול
                </button>
                <button
                  type="button"
                  onClick={confirmPendingAction}
                  disabled={!!actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  אשר ובצע
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}