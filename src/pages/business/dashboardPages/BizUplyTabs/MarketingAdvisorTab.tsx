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
  "How can I get more leads this month?",
  "How should I increase conversions?",
  "Where should I focus my marketing budget?",
  "Which channel will bring results fastest?",
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
      return "No AI questions remaining this month";
    }

    if (remainingQuestions === 1) {
      return "1 AI question remaining this month";
    }

    return `${remainingQuestions} AI questions remaining this month`;
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
            "Hi 👋 I’m your **AI Marketing Advisor**.\n\nAsk me about lead generation, campaigns, funnels, content, ads, conversions, or marketing strategy.",
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
            content: "❗ You’ve reached your monthly AI question limit.",
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
              response.data.answer || "❌ No response received from server.",
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
              "⚠️ Something went wrong while analyzing your marketing question. Please try again.",
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
      dir="ltr"
      className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] border border-white/70 bg-slate-950 p-4 text-left shadow-[0_30px_100px_rgba(15,23,42,0.28)] sm:p-6 lg:p-8"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute right-0 top-16 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-rose-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.13),transparent_42%)]" />
      </div>

      <div className="relative grid min-h-[calc(100vh-180px)] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.08] shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <header className="border-b border-white/10 bg-white/[0.06] px-5 py-5 sm:px-7 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                AI Marketing Advisor
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Your marketing command center
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Get focused marketing advice for leads, campaigns, ads,
                funnels, content strategy and conversion growth — built around
                your business context.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                Monthly balance
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-black text-white">
                  {remainingQuestions ?? "—"}
                </span>
                <span className="pb-1 text-sm font-medium text-slate-300">
                  questions
                </span>
              </div>

              {balanceLabel && (
                <p
                  className={`mt-2 text-xs font-semibold ${
                    isLimitReached ? "text-rose-300" : "text-emerald-300"
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
                <p className="text-sm font-bold text-white">
                  Start with a ready marketing question
                </p>

                <p className="hidden text-xs text-slate-400 sm:block">
                  Choose one or type your own below
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {presetQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => handlePresetQuestion(question)}
                    disabled={loading || isLimitReached}
                    className="group rounded-2xl border border-white/10 bg-white/[0.08] p-4 text-left text-sm font-semibold leading-6 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.14] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg transition group-hover:bg-white/20">
                      ✦
                    </span>
                    {question}
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
                        ? "border border-white/10 bg-white/[0.92] text-slate-800"
                        : "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-500 text-white"
                    }`}
                  >
                    {isAssistant ? (
                      <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-slate-950">
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
                <div className="max-w-[88%] rounded-[24px] border border-white/10 bg-white/[0.92] px-5 py-4 text-sm font-semibold text-slate-700 shadow-xl sm:max-w-[76%]">
                  <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />
                    </span>
                    AI is analyzing your marketing question…
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Input */}
        <footer className="border-t border-white/10 bg-slate-950/45 px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-8">
          {isLimitReached && (
            <div className="mb-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100">
              You’ve reached your monthly AI question limit.
            </div>
          )}

          <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 p-2 shadow-2xl sm:flex-row sm:items-center">
            <input
              type="text"
              value={userInput}
              disabled={loading || isLimitReached}
              placeholder="e.g. How can I get more leads with a small budget?"
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="min-h-12 flex-1 rounded-2xl border border-transparent bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-500/20 disabled:cursor-not-allowed disabled:bg-slate-200"
            />

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !userInput.trim() || isLimitReached}
              className="min-h-12 rounded-2xl bg-white px-6 text-sm font-black text-slate-950 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:min-w-32"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}