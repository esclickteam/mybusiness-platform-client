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

type ChatRole = "assistant" | "user";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type MarketingAdvisorTabProps = {
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

type MarketingAdvisorResponse = {
  answer?: string;
};

const presetQuestions = [
  "איך אפשר להביא יותר לידים החודש?",
  "איך אפשר להגדיל המרות?",
  "איפה כדאי לרכז את תקציב השיווק שלי?",
  "איזה ערוץ יביא תוצאות הכי מהר?",
];

export default function MarketingAdvisorTab({
  businessId,
  conversationId,
  userId,
  businessDetails,
}: MarketingAdvisorTabProps) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [startedChat, setStartedChat] = useState(false);
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(
    null
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isLimitReached =
    remainingQuestions !== null && remainingQuestions <= 0;

  const balanceLabel = useMemo(() => {
    if (remainingQuestions === null) return null;

    if (remainingQuestions === 0) {
      return "לא נשארו שאלות AI החודש";
    }

    if (remainingQuestions === 1) {
      return "נשארה שאלת AI אחת החודש";
    }

    return `נשארו ${remainingQuestions} שאלות AI החודש`;
  }, [remainingQuestions]);

  /* =========================
     LOAD REMAINING QUESTIONS
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
            "היי 👋 אני **יועץ השיווק AI** שלך.\n\nאפשר לשאול אותי על יצירת לידים, קמפיינים, משפכים שיווקיים, תוכן, פרסום, המרות או אסטרטגיית שיווק.",
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
        const response = await API.post<MarketingAdvisorResponse>(
          "/chat/marketing-advisor",
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
            content:
              response.data.answer || "❌ לא התקבלה תשובה מהשרת.",
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
            content:
              "⚠️ משהו השתבש בזמן ניתוח שאלת השיווק שלך. נסה שוב.",
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

  return (
    <section
      dir="rtl"
      className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-fuchsia-50 p-4 text-right !text-slate-950 shadow-[0_30px_100px_rgba(15,23,42,0.12)] sm:p-6 lg:p-8"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-fuchsia-200/50 blur-3xl" />
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-orange-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative grid min-h-[calc(100vh-180px)] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[26px] border border-slate-200 bg-white/85 shadow-[0_24px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
        {/* Header */}
        <header className="relative overflow-hidden border-b border-slate-200 bg-white px-5 py-5 sm:px-7 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.10),transparent_30%)]" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 text-xs font-black !text-fuchsia-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                יועץ שיווק AI
              </div>


              <h2 className="text-3xl font-black tracking-tight !text-slate-950 sm:text-4xl lg:text-5xl">
                מרכז הפיקוד השיווקי שלך
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 !text-slate-600 sm:text-base">
                קבל ייעוץ שיווקי ממוקד ללידים, קמפיינים, מודעות,
                משפכי שיווק, אסטרטגיית תוכן ושיפור המרות — בהתאמה
                לעסק שלך.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] !text-slate-400">
                מאזן חודשי
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-black !text-slate-950">
                  {remainingQuestions ?? "—"}
                </span>
                <span className="pb-1 text-sm font-bold !text-slate-500">
                  שאלות
                </span>
              </div>

              {balanceLabel && (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    isLimitReached ? "!text-rose-600" : "!text-emerald-600"
                  }`}
                >
                  {balanceLabel}
                </p>
              )}
            </div>
          </div>

          {!startedChat && (
            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-black !text-slate-950">
                  התחל עם שאלת שיווק מוכנה
                </p>

                <p className="hidden text-xs font-bold !text-slate-500 sm:block">
                  בחר שאלה או כתוב שאלה משלך למטה
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {presetQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handlePresetQuestion(question)}
                    disabled={loading || isLimitReached}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 text-right text-sm font-bold leading-6 !text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-100 text-lg !text-fuchsia-700 transition group-hover:bg-fuchsia-200">
                      ✦
                    </span>
                    <span className="block !text-slate-700">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Chat */}
        <main
          ref={chatContainerRef}
          className={`min-h-0 overflow-y-auto px-4 py-6 sm:px-7 lg:px-8 ${
            !startedChat ? "max-h-[520px]" : ""
          }`}
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
                    className={`max-w-[88%] rounded-[24px] px-5 py-4 text-sm leading-7 shadow-xl sm:max-w-[76%] sm:text-[15px] ${
                      isAssistant
                        ? "border border-slate-200 bg-white !text-slate-800"
                        : "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-500 !text-white"
                    }`}
                  >
                    {isAssistant ? (
                      <div className="max-w-none text-sm leading-7 [&_p]:my-2 [&_strong]:!text-slate-950 [&_ul]:my-2 [&_li]:my-1">
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
                <div className="max-w-[88%] rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm font-bold !text-slate-700 shadow-xl sm:max-w-[76%]">
                  <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                    </span>
                    ה-AI מנתח את שאלת השיווק שלך…
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Input */}
        <footer className="border-t border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-8">
          {isLimitReached && (
            <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold !text-rose-700">
              הגעת למגבלת שאלות ה-AI החודשית שלך.
            </div>
          )}

          <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center">
            <input
              type="text"
              value={userInput}
              disabled={loading || isLimitReached}
              placeholder="לדוגמה: איך אפשר להביא יותר לידים בתקציב קטן?"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold !text-slate-900 outline-none transition placeholder:!text-slate-400 focus:border-fuchsia-400 focus:bg-white focus:ring-4 focus:ring-fuchsia-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !userInput.trim() || isLimitReached}
              className="min-h-12 rounded-2xl bg-fuchsia-600 px-6 text-sm font-black !text-white shadow-lg shadow-fuchsia-200 transition duration-300 hover:-translate-y-0.5 hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:!text-slate-500 disabled:shadow-none disabled:hover:translate-y-0 sm:min-w-32"
            >
              {loading ? "חושב..." : "שלח"}
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}