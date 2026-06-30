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
  BrainCircuit,
  ClipboardCheck,
  Gauge,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

type ChatRole = "assistant" | "user";

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

type AdvisorResponse = {
  answer?: string;
};

type PresetQuestion = {
  title: string;
  question: string;
  icon: React.ElementType;
};

type AdvisorFocusCard = {
  title: string;
  text: string;
  icon: React.ElementType;
};

const presetQuestions: PresetQuestion[] = [
  {
    title: "סדר עדיפויות",
    question: "מה הדבר הכי חשוב לשפר בעסק השבוע?",
    icon: Target,
  },
  {
    title: "רווחיות",
    question: "איך להעלות רווחיות בלי להעמיס על העסק?",
    icon: TrendingUp,
  },
  {
    title: "תמחור",
    question: "האם המחירים שלי נכונים ביחס לשירותים שאני נותן?",
    icon: Gauge,
  },
  {
    title: "בזבוז זמן וכסף",
    question: "איפה העסק מאבד כסף או זמן בלי לשים לב?",
    icon: Lightbulb,
  },
];

const advisorFocusCards: AdvisorFocusCard[] = [
  {
    title: "אבחון עסקי",
    text: "זיהוי נקודות חוזקה, חולשות ומה כדאי לשפר קודם.",
    icon: BrainCircuit,
  },
  {
    title: "המלצות פעולה",
    text: "קבלת צעדים ברורים שאפשר לבצע כבר השבוע.",
    icon: ClipboardCheck,
  },
  {
    title: "פוטנציאל צמיחה",
    text: "בדיקת הזדמנויות לשיפור רווחיות, תמחור ותפעול.",
    icon: TrendingUp,
  },
];

export default function BusinessAdvisorTab({
  businessId,
  conversationId,
  userId,
  businessDetails,
}: BusinessAdvisorTabProps) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [startedChat, setStartedChat] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(
    null
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const isLimitReached =
    remainingQuestions !== null && remainingQuestions <= 0;

  const balanceLabel = useMemo(() => {
    if (remainingQuestions === null) return "טוען מאזן שאלות...";

    if (remainingQuestions === 0) {
      return "לא נשארו שאלות AI החודש";
    }

    if (remainingQuestions === 1) {
      return "נשארה שאלת AI אחת החודש";
    }

    return `נשארו ${remainingQuestions} שאלות AI החודש`;
  }, [remainingQuestions]);

  /* =========================
     REFRESH QUESTION BALANCE
  ========================= */
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

  useEffect(() => {
    void refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  /* =========================
     INITIAL AI GREETING
  ========================= */
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev;

      return [
        {
          role: "assistant",
          content:
            "היי 👋 אני **היועץ העסקי AI** שלך.\n\nאפשר לשאול אותי על תמחור, רווחיות, תפעול, סדר עדיפויות, חוויית לקוח, שימור לקוחות וקבלת החלטות עסקיות.",
        },
      ];
    });
  }, []);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = useCallback(
    async (promptText: string, conversationMessages: ChatMessage[]) => {
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
        return;
      }

      setLoading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await API.post<AdvisorResponse>(
          "/chat/business-advisor",
          {
            businessId,
            prompt: cleanPrompt,
            businessDetails,
            profile: {
              conversationId: conversationId || null,
              userId: userId || null,
            },
            messages: conversationMessages,
          },
          { signal: controller.signal }
        );

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.data.answer || "❌ לא התקבלה תשובה מהשרת.",
          },
        ]);

        setRemainingQuestions((prev) =>
          prev !== null ? Math.max(prev - 1, 0) : null
        );

        await refreshRemainingQuestions();
      } catch (error) {
        const err = error as Error;

        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ משהו השתבש בזמן ניתוח השאלה שלך. נסה שוב.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [
      businessId,
      businessDetails,
      conversationId,
      userId,
      loading,
      isLimitReached,
      refreshRemainingQuestions,
    ]
  );

  /* =========================
     HANDLERS
  ========================= */
  const handleSubmit = useCallback(() => {
    const cleanInput = userInput.trim();

    if (!cleanInput || loading || isLimitReached) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: cleanInput,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setStartedChat(true);
    setUserInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "48px";
    }

    void sendMessage(cleanInput, newMessages);
  }, [userInput, loading, isLimitReached, messages, sendMessage]);

  const handlePresetQuestion = useCallback(
    (question: string) => {
      if (loading || isLimitReached) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: question,
      };

      const newMessages = [...messages, userMessage];

      setMessages(newMessages);
      setStartedChat(true);
      setUserInput("");

      void sendMessage(question, newMessages);
    },
    [loading, isLimitReached, messages, sendMessage]
  );

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* =========================
     CLEANUP
  ========================= */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /* =========================
     RENDER
  ========================= */
  return (
    <section
      dir="rtl"
      className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50/70 p-4 text-right text-slate-950 shadow-[0_30px_100px_rgba(109,40,217,0.12)] sm:p-6 lg:p-8"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl" />
      </div>

      <div className="relative grid min-h-[calc(100vh-180px)] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
        {/* Header */}
        <header className="relative overflow-hidden border-b border-slate-100 bg-white px-5 py-5 sm:px-7 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_30%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                יועץ עסקי AI
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                מרכז הייעוץ העסקי שלך
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                קבל המלצות עסקיות מעשיות לפי נתוני העסק שלך — תמחור, רווחיות,
                תפעול, חוויית לקוח, סדר עדיפויות וקבלת החלטות חכמות יותר.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[520px]">
              {advisorFocusCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-violet-100 bg-white/85 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mt-3 text-sm font-black text-slate-950">
                      {card.title}
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                      {card.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-6 flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-gradient-to-l from-white via-violet-50/60 to-sky-50/70 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                <Sparkles className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  שאלות מומלצות ליועץ עסקי
                </p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                  בחר שאלה מוכנה או כתוב שאלה משלך למטה. השאלות כאן מתמקדות
                  בהחלטות עסקיות, רווחיות, תמחור ותפעול.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                מאזן חודשי
              </p>

              <div className="mt-1 flex items-end justify-center gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {remainingQuestions ?? "—"}
                </span>
                <span className="pb-1 text-sm font-bold text-slate-500">
                  שאלות
                </span>
              </div>

              <p
                className={`mt-1 text-xs font-bold ${
                  isLimitReached ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {balanceLabel}
              </p>
            </div>
          </div>

          {!startedChat && (
            <div className="relative mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {presetQuestions.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.question}
                    type="button"
                    onClick={() => handlePresetQuestion(item.question)}
                    disabled={loading || isLimitReached}
                    className="group flex min-h-[120px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50 hover:shadow-[0_18px_50px_rgba(109,40,217,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-violet-700">
                        {item.title}
                      </span>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                    </span>

                    <span className="mt-4 block text-sm font-black leading-6 text-slate-800">
                      {item.question}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {/* Chat */}
        <main
          ref={chatContainerRef}
          className="min-h-0 overflow-y-auto px-4 py-6 sm:px-7 lg:px-8"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
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
                    className={`max-w-[92%] rounded-[26px] px-5 py-4 text-sm leading-7 shadow-xl sm:max-w-[76%] sm:text-[15px] ${
                      isAssistant
                        ? "border border-slate-200 bg-white text-slate-800"
                        : "bg-gradient-to-br from-violet-600 to-blue-600 text-white"
                    }`}
                  >
                    {isAssistant ? (
                      <div className="max-w-none text-sm leading-7 [&_p]:my-2 [&_strong]:text-slate-950 [&_ul]:my-2 [&_li]:my-1">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[92%] rounded-[26px] border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-xl sm:max-w-[76%]">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                    היועץ העסקי מנתח את השאלה שלך...
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Input */}
        <footer className="border-t border-slate-100 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-8">
          {isLimitReached && (
            <div className="mx-auto mb-3 max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              הגעת למגבלת שאלות ה-AI החודשית שלך.
            </div>
          )}

          <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-end">
            <textarea
              ref={inputRef}
              value={userInput}
              disabled={loading || isLimitReached}
              rows={1}
              placeholder="לדוגמה: מה הדבר הכי חשוב לשפר בעסק השבוע?"
              onChange={(e) => {
                setUserInput(e.target.value);
                e.currentTarget.style.height = "48px";
                e.currentTarget.style.height = `${Math.min(
                  e.currentTarget.scrollHeight,
                  120
                )}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !userInput.trim() || isLimitReached}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:hover:translate-y-0 sm:min-w-32"
            >
              {loading ? "חושב..." : "שלח"}
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
