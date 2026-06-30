"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Markdown from "markdown-to-jsx";
import API from "@api";
import {
  ArrowUp,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Loader2,
  Megaphone,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

type ChatRole = "assistant" | "user";

type AdvisorMode =
  | "general"
  | "weekly_plan"
  | "monthly_plan"
  | "yearly_plan"
  | "marketing"
  | "actions"
  | "profitability"
  | "customer_retention";

type ChatMessage = {
  role: ChatRole;
  content: string;
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

type AdvisorActionPayload = Record<string, unknown>;

type AdvisorAction = {
  id?: string;
  type:
    | "CREATE_TASK"
    | "CREATE_MARKETING_MESSAGE"
    | "CREATE_POST"
    | "OPEN_LEADS"
    | "OPEN_CLIENTS"
    | "CREATE_WEEKLY_PLAN"
    | "CREATE_MONTHLY_PLAN"
    | "CUSTOM";
  label: string;
  description?: string;
  payload?: AdvisorActionPayload;
  requiresConfirmation?: boolean;
};

type AdvisorResponse = {
  success?: boolean;
  charged?: boolean;
  answer?: string;
  actions?: AdvisorAction[];
  answerStyle?: "short" | "medium" | "full";
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
};

const quickCommands: QuickCommand[] = [
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

const starterQuestions = [
  "מה הכי חשוב לשפר השבוע?",
  "איזה שירות כדאי לקדם עכשיו?",
  "איך לסגור יותר לידים?",
  "איך להגדיל רווחיות בלי להוריד מחיר?",
];

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
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<AdvisorMode>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<AdvisorHistoryItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [lastActions, setLastActions] = useState<AdvisorAction[]>([]);
  const [executingActionId, setExecutingActionId] = useState<string | null>(
    null
  );
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(
    null
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

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

  const scrollChatToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      if (!chatContainerRef.current) return;

      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    });
  }, []);

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
        setLastActions([]);
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
          "היי 👋 אני **יועץ BizUply** שלך.\n\nשאל אותי שאלה קצרה ואענה ענייני, או בקש תכנית שבועית / חודשית / שנתית ואבנה לך תכנית מסודרת.",
      },
    ]);
    setActiveConversationId(null);
    setActiveMode("general");
    setLastActions([]);
    setUserInput("");
    scrollChatToBottom("auto");
  }, [scrollChatToBottom]);

  useEffect(() => {
    void refreshRemainingQuestions();
    void loadHistory();
  }, [refreshRemainingQuestions, loadHistory]);

  useEffect(() => {
    startNewConversation();
  }, [startNewConversation]);

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

      setLoading(true);
      setLastActions([]);
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
              conversationId: conversationId || activeConversationId || null,
              userId: userId || null,
            },
            messages: conversationMessages.slice(-8),
          },
          { signal: controller.signal }
        );

        const answer = response.data.answer || "❌ לא התקבלה תשובה מהשרת.";
        const actions = Array.isArray(response.data.actions)
          ? response.data.actions
          : [];

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
          },
        ]);

        if (response.data.conversation?.id) {
          setActiveConversationId(response.data.conversation.id);
        }

        setLastActions(actions);

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
        const err = error as Error;

        if (err.name === "AbortError" || err.name === "CanceledError") {
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
        setLoading(false);
      }
    },
    [
      businessId,
      businessDetails,
      conversationId,
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
    (promptText: string, mode: AdvisorMode = "general") => {
      const cleanInput = promptText.trim();

      if (!cleanInput || loading || isLimitReached) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: cleanInput,
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
    [
      loading,
      isLimitReached,
      messages,
      sendMessage,
      scrollChatToBottom,
    ]
  );

  const handleSubmit = useCallback(() => {
    submitPrompt(userInput, "general");
  }, [submitPrompt, userInput]);

  const executeAdvisorAction = useCallback(
  async (action: AdvisorAction, index: number) => {
    if (!businessId || executingActionId) return;

    const actionKey = action.id || `${action.type}-${index}`;

    setExecutingActionId(actionKey);

    try {
      await API.post("/chat/business-advisor/action", {
        businessId,
        action,
        advisorMode: activeMode,
        profile: {
          conversationId: conversationId || activeConversationId || null,
          userId: userId || null,
        },
      });

      // מסיר את הפעולה מהרשימה אחרי אישור,
      // בלי להוסיף הודעת "הפעולה בוצעה" לצ׳אט
      setLastActions((prev) =>
        prev.filter((item, itemIndex) => {
          const currentKey = item.id || `${item.type}-${itemIndex}`;
          return currentKey !== actionKey;
        })
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ לא הצלחתי לבצע את הפעולה כרגע. אפשר לנסות שוב או לבצע ידנית.",
        },
      ]);

      scrollChatToBottom();
    } finally {
      setExecutingActionId(null);
    }
  },
  [
    businessId,
    executingActionId,
    activeMode,
    conversationId,
    activeConversationId,
    userId,
    scrollChatToBottom,
  ]
);

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
      className="min-h-[calc(100vh-120px)] bg-slate-50 p-3 text-right text-slate-950 sm:p-5"
    >
      <div className="mx-auto flex max-w-[1500px] flex-col gap-4">
        <header className="rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
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

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    זוכר שיחות לפי יום
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                  צ׳אט עסקי חכם: שאלה קצרה מקבלת תשובה קצרה, ותכנית מלאה
                  נבנית רק כשמבקשים.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
                <p className="text-[11px] font-black text-slate-400">
                  מצב נוכחי
                </p>
                <p className="text-sm font-black text-slate-900">
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
                <Plus className="h-4 w-4" />
                שיחה חדשה
              </button>
            </div>
          </div>
        </header>

        <main className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_260px]">
          <aside className="order-2 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm xl:order-1">
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
                  <RefreshCw className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
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

          <section className="order-1 flex min-h-[680px] flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-2">
            <div className="border-b border-slate-100 bg-gradient-to-l from-white via-violet-50/70 to-sky-50/70 px-5 py-4">
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
              className="h-[500px] overflow-y-auto bg-slate-50/70 px-4 py-4"
            >
              <div className="flex flex-col gap-3">
                {messages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";

                  return (
                    <div
                      key={`${msg.role}-${index}`}
                      className={`flex ${
                        isAssistant ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[86%] rounded-[22px] px-4 py-3 text-sm leading-7 shadow-sm ${
                          isAssistant
                            ? "border border-slate-200 bg-white text-slate-800"
                            : "bg-violet-600 text-white"
                        }`}
                      >
                        {isAssistant ? (
                          <div className="max-w-none [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-black [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-black [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:font-black [&_li]:my-1 [&_ol]:my-2 [&_p]:my-2 [&_strong]:font-black [&_strong]:text-slate-950 [&_ul]:my-2">
                            <Markdown>{msg.content}</Markdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {lastActions.length > 0 && (
                  <div className="rounded-[22px] border border-violet-100 bg-violet-50 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-700" />
                      <p className="text-sm font-black text-slate-950">
                        פעולות לאישור
                      </p>
                    </div>

                    <div className="space-y-2">
                      {lastActions.map((action, index) => {
                        const actionKey =
                          action.id || `${action.type}-${index}`;
                        const isExecuting = executingActionId === actionKey;

                        return (
                          <div
                            key={actionKey}
                            className="rounded-2xl border border-white bg-white p-3 shadow-sm"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-black text-slate-950">
                                  {action.label}
                                </p>

                                {action.description && (
                                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                                    {action.description}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  executeAdvisorAction(action, index)
                                }
                                disabled={isExecuting || !!executingActionId}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-xs font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                              >
                                {isExecuting ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    מבצע...
                                  </>
                                ) : (
                                  <>
                                    אשר ובצע
                                    <CheckCircle2 className="h-4 w-4" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[86%] rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                        היועץ חושב...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-white p-3">
              {isLimitReached && (
                <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  הגעת למגבלת שאלות ה-AI החודשית שלך.
                </div>
              )}

              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {starterQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => submitPrompt(question, "general")}
                    disabled={loading || isLimitReached}
                    className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 rounded-[24px] border border-slate-200 bg-white p-2 shadow-sm sm:flex-row sm:items-end">
                <textarea
                  ref={inputRef}
                  value={userInput}
                  disabled={loading || isLimitReached}
                  rows={1}
                  placeholder="כתוב שאלה קצרה או בקש תכנית מלאה..."
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
                  <ArrowUp className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          <aside className="order-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-950">
                פעולות מהירות
              </h2>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                קיצורי דרך ליועץ — רק כאן נוצרת קריאת AI.
              </p>
            </div>

            <div className="space-y-2">
              {quickCommands.map((command) => {
                const Icon = command.icon;

                return (
                  <button
                    key={command.id}
                    type="button"
                    onClick={() => submitPrompt(command.prompt, command.id)}
                    disabled={loading || isLimitReached}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-right transition hover:border-violet-200 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                        <Icon className="h-4 w-4" />
                      </span>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {command.label}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400">
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
                היסטוריה, פתיחת שיחה, רענון ופעולות אישור לא מורידים שאלות.
                שאלה יורדת רק כשהשרת מחזיר `charged: true`.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </section>
  );
}