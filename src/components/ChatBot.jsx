import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bot, Send, X } from "lucide-react";
import { useLocaleDir } from "../hooks/useLocaleDir";
import { isHebrewLanguage } from "../i18n/localeUtils";

function isHebrewText(text) {
  return /[\u0590-\u05FF]/.test(String(text || ""));
}

function filterSuggestionsForLocale(items, language, fallbacks) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const preferHebrew = isHebrewLanguage(language);
  const filtered = list.filter((item) =>
    preferHebrew ? isHebrewText(item) : !isHebrewText(item)
  );
  return filtered.length ? filtered : fallbacks;
}

export default function ChatBot({
  chatOpen,
  setChatOpen,
  initialMessage = null,
  onInitialMessageSent,
}) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialSentRef = useRef(false);

  const quickPrompts = useMemo(
    () => [
      t("chatbot.quickPrompts.createSite"),
      t("chatbot.quickPrompts.dashboard"),
      t("chatbot.quickPrompts.crmLeads"),
      t("chatbot.quickPrompts.publishSite"),
    ],
    [t, i18n.language]
  );

  const fallbackSuggestions = useMemo(
    () => [
      t("chatbot.fallbackSuggestions.editSite"),
      t("chatbot.fallbackSuggestions.seo"),
      t("chatbot.fallbackSuggestions.dashboardStuck"),
    ],
    [t, i18n.language]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

        const suggestions = filterSuggestionsForLocale(
          Array.isArray(data.suggestions) ? data.suggestions : [],
          i18n.language,
          fallbackSuggestions
        );

        setChatMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: cleanText(data.answer || t("chatbot.noAnswer")),
            suggestions,
            source: data.source || "Bizuply AI",
          },
        ]);
      } catch {
        setChatMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: t("chatbot.error"),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [chatInput, isLoading, i18n.language, fallbackSuggestions, t]
  );

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-500/40 transition hover:scale-105 hover:bg-violet-700"
        aria-label={t("chatbot.openAria")}
      >
        <Bot size={24} />
      </button>
    );
  }

  return (
    <section
      dir={dir}
      className="fixed bottom-6 right-6 z-[10000] flex h-[min(580px,calc(100vh-3rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
    >
      <header className="flex shrink-0 items-center justify-between bg-gradient-to-l from-violet-600 to-indigo-700 px-5 py-3.5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Bot size={18} />
          </div>
          <div>
            <p className="text-sm font-black">{t("chatbot.title")}</p>
            <p className="text-[10px] font-medium text-violet-200">
              {t("chatbot.available247")}
            </p>
          </div>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/20"
          aria-label={t("chatbot.closeAria")}
        >
          <X size={18} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-50 px-4 py-4 pb-6">
        {chatMessages.length === 0 && !isLoading && (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Bot size={28} />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">
              {t("chatbot.greeting")}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t("chatbot.greetingHint")}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {quickPrompts.map((prompt) => (
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
              className={`flex ${
                msg.sender === "user"
                  ? dir === "rtl"
                    ? "justify-start"
                    : "justify-end"
                  : dir === "rtl"
                    ? "justify-end"
                    : "justify-start"
              }`}
            >
              <div
                dir="auto"
                className={`max-w-[88%] break-words whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "rounded-br-sm bg-violet-600 text-white"
                    : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>

            {msg.sender === "bot" && msg.suggestions?.length > 0 && (
              <div
                className={`mt-2 flex flex-wrap gap-1.5 ${
                  dir === "rtl" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion, { fromSuggestion: true })}
                    disabled={isLoading}
                    className="max-w-full break-words rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div
            className={`mb-3 flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t("chatbot.placeholder")}
            dir={dir}
            disabled={isLoading}
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
            aria-label={t("chatbot.inputAria")}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!chatInput.trim() || isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t("chatbot.sendAria")}
          >
            <Send size={16} className={dir === "rtl" ? "-scale-x-100" : undefined} />
          </button>
        </div>
      </div>
    </section>
  );
}
