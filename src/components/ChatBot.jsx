import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bot, Headphones, Send, UserRound, X } from "lucide-react";
import { useLocaleDir } from "../hooks/useLocaleDir";
import { isHebrewLanguage } from "../i18n/localeUtils";
import { useAuth } from "../context/AuthContext";
import {
  disconnectSupportGuestSocket,
  fetchSupportMessages,
  getSupportGuestSocket,
  loadSupportSession,
  openSupportSession,
  requestHumanAgent,
  saveBotExchange,
  sendSupportMessageRest,
} from "../utils/supportChat";

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

function cleanText(text) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .trim();
}

function mapServerMessage(msg) {
  if (!msg) return null;
  const sender =
    msg.senderType === "visitor"
      ? "user"
      : msg.senderType === "agent"
        ? "agent"
        : msg.senderType === "system"
          ? "system"
          : "bot";
  return {
    id: msg._id,
    sender,
    text: msg.text,
    createdAt: msg.createdAt,
  };
}

export default function ChatBot({
  chatOpen,
  setChatOpen,
  initialMessage = null,
  onInitialMessageSent,
}) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("bot"); // bot | human
  const [conversation, setConversation] = useState(null);
  const [guestToken, setGuestToken] = useState(null);
  const [showHumanForm, setShowHumanForm] = useState(false);
  const [humanName, setHumanName] = useState("");
  const [humanEmail, setHumanEmail] = useState("");
  const [humanNote, setHumanNote] = useState("");
  const [humanStatus, setHumanStatus] = useState(""); // waiting | active | ""
  const [agentTyping, setAgentTyping] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialSentRef = useRef(false);
  const sessionReadyRef = useRef(false);

  const quickPrompts = useMemo(() => {
    if (user?.businessId) {
      return [
        t("chatbot.quickPrompts.myLeads"),
        t("chatbot.quickPrompts.myAppointments"),
        t("chatbot.quickPrompts.myTasks"),
        t("chatbot.quickPrompts.createSite"),
      ];
    }
    return [
      t("chatbot.quickPrompts.createSite"),
      t("chatbot.quickPrompts.dashboard"),
      t("chatbot.quickPrompts.crmLeads"),
      t("chatbot.quickPrompts.publishSite"),
    ];
  }, [t, i18n.language, user?.businessId]);

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
  }, [chatMessages, isLoading, agentTyping]);

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);

  useEffect(() => {
    if (!chatOpen) initialSentRef.current = false;
  }, [chatOpen]);

  useEffect(() => {
    if (user?.name) setHumanName((prev) => prev || user.name);
    if (user?.email) setHumanEmail((prev) => prev || user.email);
  }, [user?.name, user?.email]);

  const ensureSession = useCallback(async () => {
    if (sessionReadyRef.current && conversation && guestToken) {
      return { conversation, guestToken };
    }

    const cached = loadSupportSession();
    const session = await openSupportSession({
      name: humanName || user?.name,
      email: humanEmail || user?.email,
    });

    // Prefer freshest conversation; keep cached messages if same id
    setConversation(session.conversation);
    setGuestToken(session.guestToken);
    sessionReadyRef.current = true;

    if (
      session.conversation?.mode === "human" &&
      ["waiting", "active"].includes(session.conversation?.status)
    ) {
      setMode("human");
      setHumanStatus(session.conversation.status);
      try {
        const data = await fetchSupportMessages(
          session.conversation._id,
          session.guestToken
        );
        const mapped = (data.messages || []).map(mapServerMessage).filter(Boolean);
        if (mapped.length) setChatMessages(mapped);
      } catch {
        /* keep local */
      }
    } else if (
      cached?.conversation?._id === session.conversation?._id &&
      Array.isArray(cached.localMessages)
    ) {
      setChatMessages(cached.localMessages);
    }

    return session;
  }, [conversation, guestToken, humanName, humanEmail, user?.name, user?.email]);

  useEffect(() => {
    if (!chatOpen) return;
    ensureSession().catch(() => {
      /* session will retry on action */
    });
  }, [chatOpen, ensureSession]);

  // Realtime human channel
  useEffect(() => {
    if (!chatOpen || mode !== "human" || !guestToken || !conversation?._id) {
      return undefined;
    }

    const socket = getSupportGuestSocket(guestToken);
    if (!socket) return undefined;

    const onNewMessage = (payload) => {
      if (String(payload?.conversation?._id) !== String(conversation._id)) return;
      if (payload?.conversation) {
        setConversation(payload.conversation);
        setHumanStatus(payload.conversation.status);
      }
      const mapped = mapServerMessage(payload?.message);
      if (!mapped) return;
      setChatMessages((prev) => {
        if (prev.some((m) => m.id && m.id === mapped.id)) return prev;
        // Drop optimistic temp duplicates by text+sender within last few
        const withoutTemp = prev.filter(
          (m) =>
            !(
              m.temp &&
              m.sender === mapped.sender &&
              m.text === mapped.text
            )
        );
        return [...withoutTemp, mapped];
      });
      setAgentTyping(false);
    };

    const onUpdated = (payload) => {
      if (String(payload?.conversation?._id) !== String(conversation._id)) return;
      if (payload?.conversation) {
        setConversation(payload.conversation);
        setMode(payload.conversation.mode === "human" ? "human" : "bot");
        setHumanStatus(payload.conversation.status);
      }
      const sys = mapServerMessage(payload?.systemMessage);
      if (sys) {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id && m.id === sys.id)) return prev;
          return [...prev, sys];
        });
      }
    };

    const onTyping = (payload) => {
      if (String(payload?.conversationId) !== String(conversation._id)) return;
      if (payload?.senderType === "agent") {
        setAgentTyping(true);
        window.clearTimeout(onTyping._t);
        onTyping._t = window.setTimeout(() => setAgentTyping(false), 2500);
      }
    };

    const join = () => {
      socket.emit("support:join", conversation._id);
    };

    socket.on("connect", join);
    if (socket.connected) join();
    socket.on("support:newMessage", onNewMessage);
    socket.on("support:conversationUpdated", onUpdated);
    socket.on("support:conversationAssigned", onUpdated);
    socket.on("support:typing", onTyping);

    return () => {
      socket.off("connect", join);
      socket.off("support:newMessage", onNewMessage);
      socket.off("support:conversationUpdated", onUpdated);
      socket.off("support:conversationAssigned", onUpdated);
      socket.off("support:typing", onTyping);
      socket.emit("support:leave", conversation._id);
    };
  }, [chatOpen, mode, guestToken, conversation?._id]);

  useEffect(() => {
    return () => {
      disconnectSupportGuestSocket();
    };
  }, []);

  const sendBotMessage = useCallback(
    async (messageText, { fromSuggestion = false } = {}) => {
      const text = (messageText ?? chatInput).trim();
      if (!text || isLoading) return;

      if (!fromSuggestion) setChatInput("");

      setChatMessages((msgs) => [...msgs, { sender: "user", text }]);
      setIsLoading(true);

      try {
        const session = await ensureSession();
        const headers = { "Content-Type": "application/json" };
        const token = localStorage.getItem("token");
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            question: text,
            businessId: user?.businessId || undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "request failed");
        }

        const answer = cleanText(data.answer || t("chatbot.noAnswer"));
        const suggestions = filterSuggestionsForLocale(
          Array.isArray(data.suggestions) ? data.suggestions : [],
          i18n.language,
          fallbackSuggestions
        );

        setChatMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: answer,
            suggestions,
            links: Array.isArray(data.links) ? data.links : [],
            actions: Array.isArray(data.actions) ? data.actions : [],
            offerHuman: Boolean(data.offerHuman),
            usedSystemData: Boolean(data.usedSystemData),
            source: data.source || "Bizuply AI",
          },
        ]);

        if (data.offerHuman) {
          setShowHumanForm(true);
        }

        if (session?.conversation?._id && session?.guestToken) {
          saveBotExchange(
            session.conversation._id,
            text,
            answer,
            session.guestToken
          ).catch(() => {});
        }
      } catch {
        setChatMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: t("chatbot.error"),
            offerHuman: true,
          },
        ]);
        setShowHumanForm(true);
      } finally {
        setIsLoading(false);
      }
    },
    [
      chatInput,
      isLoading,
      i18n.language,
      fallbackSuggestions,
      t,
      ensureSession,
      user?.businessId,
    ]
  );

  useEffect(() => {
    if (chatOpen && initialMessage && !initialSentRef.current) {
      initialSentRef.current = true;
      sendBotMessage(initialMessage);
      onInitialMessageSent?.();
    }
  }, [chatOpen, initialMessage, onInitialMessageSent, sendBotMessage]);

  const startHumanHandoff = useCallback(async () => {
    const name = humanName.trim();
    const email = humanEmail.trim();

    if (!name || !email) {
      setShowHumanForm(true);
      return;
    }

    setHandoffLoading(true);
    try {
      const session = await ensureSession();
      const data = await requestHumanAgent(
        session.conversation._id,
        { name, email, note: humanNote.trim() || undefined },
        session.guestToken
      );

      setConversation(data.conversation);
      setGuestToken(session.guestToken);
      setMode("human");
      setHumanStatus(data.conversation?.status || "waiting");
      setShowHumanForm(false);
      setHumanNote("");

      if (data.systemMessage) {
        const sys = mapServerMessage(data.systemMessage);
        if (sys) {
          setChatMessages((prev) => [...prev, sys]);
        }
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: t("chatbot.humanConnecting"),
          },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: t("chatbot.humanError") },
      ]);
    } finally {
      setHandoffLoading(false);
    }
  }, [
    humanName,
    humanEmail,
    humanNote,
    ensureSession,
    t,
  ]);

  const sendHumanMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || !conversation?._id || !guestToken) return;

    setChatInput("");
    const tempId = `temp-${Date.now()}`;
    setChatMessages((prev) => [
      ...prev,
      { id: tempId, temp: true, sender: "user", text },
    ]);

    const socket = getSupportGuestSocket(guestToken);
    if (socket?.connected) {
      socket.emit(
        "support:sendMessage",
        { conversationId: conversation._id, text },
        (ack) => {
          if (!ack?.ok) {
            sendSupportMessageRest(conversation._id, text, guestToken)
              .then((data) => {
                const mapped = mapServerMessage(data.message);
                if (!mapped) return;
                setChatMessages((prev) =>
                  prev.map((m) => (m.id === tempId ? mapped : m))
                );
              })
              .catch(() => {
                setChatMessages((prev) =>
                  prev.map((m) =>
                    m.id === tempId
                      ? { ...m, temp: false, failed: true }
                      : m
                  )
                );
              });
          }
        }
      );
      return;
    }

    try {
      const data = await sendSupportMessageRest(
        conversation._id,
        text,
        guestToken
      );
      const mapped = mapServerMessage(data.message);
      if (mapped) {
        setChatMessages((prev) =>
          prev.map((m) => (m.id === tempId ? mapped : m))
        );
      }
    } catch {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, temp: false, failed: true } : m
        )
      );
    }
  }, [chatInput, conversation?._id, guestToken]);

  const handleSend = () => {
    if (mode === "human") {
      sendHumanMessage();
    } else {
      sendBotMessage();
    }
  };

  const statusLabel =
    mode === "human"
      ? humanStatus === "active"
        ? t("chatbot.humanActive")
        : t("chatbot.humanWaiting")
      : user?.businessId
        ? t("chatbot.statusSystem")
        : t("chatbot.statusBot");

  if (!chatOpen) {
    return (
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-xl shadow-violet-500/40 transition hover:scale-105 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
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
      <header className="flex shrink-0 items-center justify-between bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 py-3.5 text-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            {mode === "human" ? <Headphones size={18} /> : <Bot size={18} />}
          </div>
          <div>
            <p className="text-sm font-black">
              {mode === "human" ? t("chatbot.humanTitle") : t("chatbot.title")}
            </p>
            <p className="text-[10px] font-medium text-slate-500">{statusLabel}</p>
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

      {mode === "bot" && (
        <div className="shrink-0 border-b border-slate-100 bg-white px-3 py-2">
          <button
            type="button"
            onClick={() => setShowHumanForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
          >
            <UserRound size={14} />
            {t("chatbot.talkToHuman")}
          </button>
        </div>
      )}

      {showHumanForm && mode === "bot" && (
        <div className="shrink-0 space-y-2 border-b border-slate-100 bg-slate-50 px-3 py-3">
          <p className="text-xs font-semibold text-slate-600">
            {t("chatbot.humanFormHint")}
          </p>
          <input
            type="text"
            value={humanName}
            onChange={(e) => setHumanName(e.target.value)}
            placeholder={t("chatbot.humanName")}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
          />
          <input
            type="email"
            value={humanEmail}
            onChange={(e) => setHumanEmail(e.target.value)}
            placeholder={t("chatbot.humanEmail")}
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300"
          />
          <textarea
            value={humanNote}
            onChange={(e) => setHumanNote(e.target.value)}
            placeholder={t("chatbot.humanNote")}
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={handoffLoading}
              onClick={startHumanHandoff}
              className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {handoffLoading
                ? t("chatbot.humanConnecting")
                : t("chatbot.humanSubmit")}
            </button>
            <button
              type="button"
              onClick={() => setShowHumanForm(false)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600"
            >
              {t("chatbot.humanCancel")}
            </button>
          </div>
        </div>
      )}

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
                  onClick={() => sendBotMessage(prompt, { fromSuggestion: true })}
                  className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div key={msg.id || i} className="mb-3">
            {msg.sender === "system" ? (
              <div className="px-2 text-center text-[11px] font-medium text-slate-500">
                {msg.text}
              </div>
            ) : (
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
                      ? "rounded-br-sm bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
                      : msg.sender === "agent"
                        ? "rounded-bl-sm border border-emerald-200 bg-emerald-50 text-slate-800 shadow-sm"
                        : "rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
                  } ${msg.failed ? "opacity-60" : ""}`}
                >
                  {msg.sender === "agent" && (
                    <p className="mb-1 text-[10px] font-bold text-emerald-700">
                      {t("chatbot.agentLabel")}
                    </p>
                  )}
                  {msg.sender === "bot" && msg.usedSystemData && (
                    <p className="mb-1 text-[10px] font-bold text-sky-700">
                      {t("chatbot.fromSystem")}
                    </p>
                  )}
                  {msg.text}
                </div>
              </div>
            )}

            {msg.sender === "bot" && mode === "bot" && msg.links?.length > 0 && (
              <div
                className={`mt-2 flex flex-wrap gap-1.5 ${
                  dir === "rtl" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.links.map((link) => (
                  <button
                    key={link.to}
                    type="button"
                    onClick={() => {
                      setChatOpen(false);
                      navigate(link.to);
                    }}
                    className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-800 transition hover:bg-sky-100"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {msg.sender === "bot" &&
              mode === "bot" &&
              msg.actions?.length > 0 && (
                <div
                  className={`mt-2 space-y-1 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.actions.map((action, idx) => (
                    <p
                      key={`${action.actionType || action.tool}-${idx}`}
                      className="text-[11px] font-semibold text-emerald-700"
                    >
                      ✓ {action.message || action.actionType || action.tool}
                    </p>
                  ))}
                </div>
              )}

            {msg.sender === "bot" && msg.offerHuman && mode === "bot" && (
              <div
                className={`mt-2 ${
                  dir === "rtl" ? "text-right" : "text-left"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setShowHumanForm(true)}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100"
                >
                  {t("chatbot.talkToHuman")}
                </button>
              </div>
            )}

            {msg.sender === "bot" && msg.suggestions?.length > 0 && mode === "bot" && (
              <div
                className={`mt-2 flex flex-wrap gap-1.5 ${
                  dir === "rtl" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      sendBotMessage(suggestion, { fromSuggestion: true })
                    }
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

        {(isLoading || agentTyping) && (
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
            onChange={(e) => {
              setChatInput(e.target.value);
              if (mode === "human" && guestToken && conversation?._id) {
                const socket = getSupportGuestSocket(guestToken);
                socket?.emit("support:typing", {
                  conversationId: conversation._id,
                });
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              mode === "human"
                ? t("chatbot.humanPlaceholder")
                : t("chatbot.placeholder")
            }
            dir={dir}
            disabled={isLoading || handoffLoading}
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
            aria-label={t("chatbot.inputAria")}
          />
          <button
            onClick={handleSend}
            disabled={!chatInput.trim() || isLoading || handoffLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t("chatbot.sendAria")}
          >
            <Send size={16} className={dir === "rtl" ? "-scale-x-100" : undefined} />
          </button>
        </div>
      </div>
    </section>
  );
}
