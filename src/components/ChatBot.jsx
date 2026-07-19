import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, X } from "lucide-react";

const QUICK_PROMPTS = [
  "איך ליצור אתר חדש?",
  "מה יש בדשבורד?",
  "איך לקבל לידים ל-CRM?",
  "איך לפרסם את האתר?",
];

const FALLBACK_SUGGESTIONS = [
  "איך עורכים את האתר בעורך?",
  "איך מגדירים SEO לאתר?",
  "מה לעשות אם הדשבורד לא מתעדכן?",
];

function isHebrewText(text) {
  return /[\u0590-\u05FF]/.test(String(text || ""));
}

function hebrewSuggestions(items) {
  const filtered = (items || []).filter((item) => isHebrewText(item));
  return filtered.length ? filtered : FALLBACK_SUGGESTIONS;
}

export default function ChatBot({
  chatOpen,
  setChatOpen,
  initialMessage = null,
  onInitialMessageSent,
}) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialSentRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isLoading]);

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);

  useEffect(() => {
    if (!chatOpen) initialSentRef.current = false;
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen && initialMessage && !initialSentRef.current) {
      initialSentRef.current = true;
      sendMessage(initialMessage);
      onInitialMessageSent?.();
    }
  }, [chatOpen, initialMessage, onInitialMessageSent]);

  function cleanText(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .trim();
  }

  const sendMessage = useCallback(
    async (messageText, { fromSuggestion = false } = {}) => {
      const text = (messageText ?? chatInput).trim();
      if (!text || isLoading) return;

      if (!fromSuggestion) {
        setChatInput("");
      }

      setChatMessages((msgs) => [...msgs, { sender: "user", text }]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "request failed");
        }

        const suggestions = hebrewSuggestions(
          Array.isArray(data.suggestions) ? data.suggestions : []
        );

        setChatMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: cleanText(
              data.answer || "מצטער, לא מצאתי תשובה מתאימה. נסה לנסח אחרת."
            ),
            suggestions,
            source: data.source || "Bizuply AI",
          },
        ]);
      } catch {
        setChatMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "אירעה שגיאה, אנא נסה שוב מאוחר יותר.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [chatInput, isLoading]
  );

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-500/40 transition hover:scale-105 hover:bg-violet-700"
        aria-label="פתיחת העוזר החכם של Bizuply"
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <section
      dir="rtl"
      className="fixed bottom-6 right-6 z-[10000] flex w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      style={{ maxHeight: "min(580px,calc(100vh-3rem))" }}
    >
      <header className="flex items-center justify-between bg-gradient-to-l from-violet-600 to-indigo-700 px-5 py-3.5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-black">עוזר Bizuply</p>
            <p className="text-[10px] font-medium text-violet-200">זמין 24/7</p>
          </div>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/20"
          aria-label="סגירת הצ'אט"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4">
        {chatMessages.length === 0 && !isLoading && (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Bot size={28} />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">
              שלום! איך אפשר לעזור?
            </p>
            <p className="mt-1 text-xs text-slate-500">
              שאל כל שאלה על Bizuply
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt, { fromSuggestion: true })}
                  className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div key={i} className="mb-3">
            <div
              className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                dir="auto"
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "rounded-br-sm bg-violet-600 text-white"
                    : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                }`}
                title={msg.source ? `מקור: ${msg.source}` : ""}
              >
                {msg.text}
              </div>
            </div>

            {msg.sender === "bot" && msg.suggestions?.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-end gap-1.5" dir="rtl">
                {msg.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion, { fromSuggestion: true })}
                    disabled={isLoading}
                    dir="rtl"
                    className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="mb-3 flex justify-end">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="שאל שאלה..."
            dir="rtl"
            disabled={isLoading}
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
            aria-label="שאלה לעוזר החכם"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!chatInput.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="שליחת שאלה"
          >
            <Send size={16} className="-scale-x-100" />
          </button>
        </div>
      </div>
    </section>
  );
}
