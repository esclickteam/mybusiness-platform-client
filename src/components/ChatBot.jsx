import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Headphones,
  History,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useLocaleDir } from "../hooks/useLocaleDir";
import { isHebrewLanguage } from "../i18n/localeUtils";
import { useAuth } from "../context/AuthContext";
import {
  disconnectSupportGuestSocket,
  ensureNotifyPermission,
  fetchSupportHistory,
  fetchSupportMessages,
  getSupportGuestSocket,
  joinSupportConversation,
  loadSupportSession,
  openSupportSession,
  requestHumanAgent,
  saveBotExchange,
  sendSupportMessageRest,
  showBrowserNotify,
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

function mergeMessagesById(prev, incoming) {
  const mapped = (incoming || []).map(mapServerMessage).filter(Boolean);
  const temps = (prev || []).filter(
    (m) =>
      m.temp &&
      !mapped.some((x) => x.sender === m.sender && x.text === m.text)
  );
  const byId = new Map();
  for (const m of prev || []) {
    if (m.id && !m.temp) byId.set(String(m.id), m);
  }
  for (const m of mapped) {
    byId.set(String(m.id), m);
  }
  const ordered = [];
  const seen = new Set();
  for (const m of mapped) {
    const id = String(m.id);
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(byId.get(id) || m);
  }
  for (const m of byId.values()) {
    const id = String(m.id);
    if (!seen.has(id)) {
      seen.add(id);
      ordered.push(m);
    }
  }
  return [...ordered, ...temps];
}

function formatHistoryDate(value, language) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString(
      isHebrewLanguage(language) ? "he-IL" : "en-US",
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "";
  }
}

export default function ChatBot({
  chatOpen,
  setChatOpen,
  initialMessage = null,
  onInitialMessageSent,
  hideLauncher = false,
}) {
  const { t, i18n } = useTranslation();
  const dir = useLocaleDir();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Views: bot | human | history
  const [mode, setMode] = useState("bot");
  const [conversation, setConversation] = useState(null);
  const [guestToken, setGuestToken] = useState(null);
  const [showHumanForm, setShowHumanForm] = useState(false);
  const [humanName, setHumanName] = useState("");
  const [humanEmail, setHumanEmail] = useState("");
  const [humanNote, setHumanNote] = useState("");
  const [humanStatus, setHumanStatus] = useState(""); // waiting | active | ""
  const [agentTyping, setAgentTyping] = useState(false);
  const [handoffLoading, setHandoffLoading] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyViewItem, setHistoryViewItem] = useState(null);
  const [historyViewMessages, setHistoryViewMessages] = useState([]);
  const [historyViewLoading, setHistoryViewLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialSentRef = useRef(false);
  const sessionReadyRef = useRef(false);
  const chatOpenRef = useRef(chatOpen);
  const conversationIdRef = useRef(null);
  const modeRef = useRef(mode);
  const lastNotifiedIdRef = useRef(null);
  const typingTimerRef = useRef(null);

  const historyTitle = t("chatbot.supportHistoryTitle", {
    defaultValue: "היסטוריית שיחות",
  });
  const backAria = t("chatbot.supportBackAria", { defaultValue: "חזרה" });
  const historyAria = t("chatbot.supportHistoryAria", {
    defaultValue: "היסטוריה",
  });
  const emptyHistory = t("chatbot.supportEmptyHistory", {
    defaultValue: "אין שיחות קודמות",
  });
  const openHistoryLabel = t("chatbot.supportOpenHistory", {
    defaultValue: "צפייה בהיסטוריה",
  });

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
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    conversationIdRef.current = conversation?._id
      ? String(conversation._id)
      : null;
  }, [conversation?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, isLoading, agentTyping, mode]);

  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen, mode]);

  useEffect(() => {
    if (!chatOpen) initialSentRef.current = false;
  }, [chatOpen]);

  useEffect(() => {
    if (chatOpen) {
      setUnreadCount(0);
    }
  }, [chatOpen, conversation?._id]);

  useEffect(() => {
    if (user?.name) setHumanName((prev) => prev || user.name);
    if (user?.email) setHumanEmail((prev) => prev || user.email);
  }, [user?.name, user?.email]);

  useEffect(() => {
    if (mode === "human") {
      ensureNotifyPermission().catch(() => {});
    }
  }, [mode]);

  const notifyIfHidden = useCallback(
    (mapped, title, body) => {
      if (!mapped || mapped.sender !== "agent") return;
      if (chatOpenRef.current && !document.hidden) return;
      if (mapped.id && lastNotifiedIdRef.current === String(mapped.id)) return;
      if (mapped.id) lastNotifiedIdRef.current = String(mapped.id);
      setUnreadCount((n) => n + 1);
      showBrowserNotify(title || t("chatbot.humanTitle"), body || mapped.text, {
        tag: `bizuply-support-${mapped.id || "msg"}`,
        onClick: () => setChatOpen(true),
      });
    },
    [setChatOpen, t]
  );

  const ensureSession = useCallback(async () => {
    if (sessionReadyRef.current && conversation && guestToken) {
      return { conversation, guestToken };
    }

    const cached = loadSupportSession();
    const session = await openSupportSession({
      name: humanName || user?.name,
      email: humanEmail || user?.email,
    });

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
        const mapped = (data.messages || [])
          .map(mapServerMessage)
          .filter(Boolean);
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
      /* session will retry on action — soft-fail for bot */
    });
  }, [chatOpen, ensureSession]);

  // Realtime human channel (stays joined so closed-chat notifications work)
  useEffect(() => {
    if (!guestToken || !conversation?._id) {
      return undefined;
    }

    const conversationId = conversation._id;
    const socket = joinSupportConversation(guestToken, conversationId);
    if (!socket) return undefined;

    const onNewMessage = (payload) => {
      const payloadId = payload?.conversation?._id || payload?.conversationId;
      if (
        payloadId &&
        String(payloadId) !== String(conversationIdRef.current)
      ) {
        return;
      }
      if (payload?.conversation) {
        setConversation(payload.conversation);
        if (payload.conversation.status) {
          setHumanStatus(payload.conversation.status);
        }
        if (
          payload.conversation.mode === "human" &&
          modeRef.current !== "history"
        ) {
          setMode("human");
        }
      }
      const mapped = mapServerMessage(payload?.message);
      if (!mapped) return;
      setChatMessages((prev) => {
        if (prev.some((m) => m.id && m.id === mapped.id)) return prev;
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
      notifyIfHidden(
        mapped,
        t("chatbot.humanTitle"),
        mapped.text
      );
    };

    const onUpdated = (payload) => {
      const payloadId = payload?.conversation?._id;
      if (
        payloadId &&
        String(payloadId) !== String(conversationIdRef.current)
      ) {
        return;
      }
      if (payload?.conversation) {
        setConversation(payload.conversation);
        if (modeRef.current !== "history") {
          setMode(payload.conversation.mode === "human" ? "human" : "bot");
        }
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

    const onNotifyParty = (payload) => {
      if (payload?.forRole && payload.forRole !== "visitor") return;
      const payloadId = payload?.conversation?._id || payload?.conversationId;
      if (
        payloadId &&
        String(payloadId) !== String(conversationIdRef.current)
      ) {
        return;
      }
      const mapped = mapServerMessage(payload?.message);
      if (!mapped) return;
      setChatMessages((prev) => {
        if (prev.some((m) => m.id && m.id === mapped.id)) return prev;
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
      notifyIfHidden(mapped, payload?.title, payload?.body || mapped.text);
    };

    const onTyping = (payload) => {
      if (String(payload?.conversationId) !== String(conversationIdRef.current)) {
        return;
      }
      if (payload?.senderType === "agent") {
        setAgentTyping(true);
        if (typingTimerRef.current) {
          window.clearTimeout(typingTimerRef.current);
        }
        typingTimerRef.current = window.setTimeout(
          () => setAgentTyping(false),
          2500
        );
      }
    };

    socket.on("support:newMessage", onNewMessage);
    socket.on("support:conversationUpdated", onUpdated);
    socket.on("support:conversationAssigned", onUpdated);
    socket.on("support:notifyParty", onNotifyParty);
    socket.on("support:typing", onTyping);

    return () => {
      socket.off("support:newMessage", onNewMessage);
      socket.off("support:conversationUpdated", onUpdated);
      socket.off("support:conversationAssigned", onUpdated);
      socket.off("support:notifyParty", onNotifyParty);
      socket.off("support:typing", onTyping);
      socket.emit("support:leave", conversationId);
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, [guestToken, conversation?._id, notifyIfHidden, t]);

  // Poll every 2s while in human mode with an active conversation
  useEffect(() => {
    if (mode !== "human" || !conversation?._id || !guestToken) {
      return undefined;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const data = await fetchSupportMessages(conversation._id, guestToken);
        if (cancelled) return;
        if (data.conversation) {
          setConversation(data.conversation);
          setHumanStatus(data.conversation.status || "");
        }
        setChatMessages((prev) => mergeMessagesById(prev, data.messages || []));
      } catch {
        /* ignore poll errors */
      }
    };

    poll();
    const interval = window.setInterval(poll, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [mode, conversation?._id, guestToken]);

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
        // Session is best-effort — chatbot answers must work even if support
        // session/CORS fails.
        let session = null;
        try {
          session = await ensureSession();
        } catch {
          session = null;
        }

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
    if (chatOpen && initialMessage && !initialSentRef.current && mode === "bot") {
      initialSentRef.current = true;
      sendBotMessage(initialMessage);
      onInitialMessageSent?.();
    }
  }, [chatOpen, initialMessage, onInitialMessageSent, sendBotMessage, mode]);

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
      ensureNotifyPermission().catch(() => {});

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
  }, [humanName, humanEmail, humanNote, ensureSession, t]);

  const sendHumanMessage = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || !conversation?._id || !guestToken) return;

    setChatInput("");
    const tempId = `temp-${Date.now()}`;
    setChatMessages((prev) => [
      ...prev,
      { id: tempId, temp: true, sender: "user", text },
    ]);

    let settled = false;

    const applyMapped = (mapped) => {
      if (!mapped || settled) return;
      settled = true;
      setChatMessages((prev) =>
        prev.map((m) => (m.id === tempId ? mapped : m))
      );
    };

    const markFailed = () => {
      if (settled) return;
      settled = true;
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, temp: false, failed: true } : m
        )
      );
    };

    const fallbackRest = async () => {
      if (settled) return;
      try {
        const data = await sendSupportMessageRest(
          conversation._id,
          text,
          guestToken
        );
        const mapped = mapServerMessage(data.message);
        if (mapped) applyMapped(mapped);
        else markFailed();
      } catch {
        markFailed();
      }
    };

    const socket = getSupportGuestSocket(guestToken);
    if (socket?.connected) {
      const timeoutId = window.setTimeout(() => {
        if (!settled) {
          fallbackRest();
        }
      }, 2500);

      socket.emit(
        "support:sendMessage",
        { conversationId: conversation._id, text },
        (ack) => {
          window.clearTimeout(timeoutId);
          if (ack?.ok) {
            applyMapped(mapServerMessage(ack.message));
          } else if (!settled) {
            fallbackRest();
          }
        }
      );
      return;
    }

    await fallbackRest();
  }, [chatInput, conversation?._id, guestToken]);

  const openHistoryView = useCallback(async () => {
    setMode("history");
    setHistoryViewItem(null);
    setHistoryViewMessages([]);
    setHistoryLoading(true);
    try {
      let token = guestToken;
      if (!token) {
        try {
          const session = await ensureSession();
          token = session.guestToken;
        } catch {
          token = null;
        }
      }
      if (!token) {
        setHistoryItems([]);
        return;
      }
      const data = await fetchSupportHistory(token);
      setHistoryItems(
        Array.isArray(data.conversations) ? data.conversations : []
      );
    } catch {
      setHistoryItems([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [guestToken, ensureSession]);

  const selectHistoryItem = useCallback(
    async (item) => {
      if (!item?._id) return;
      let token = guestToken;
      if (!token) {
        try {
          const session = await ensureSession();
          token = session.guestToken;
        } catch {
          return;
        }
      }

      // Read-only full transcript — do not replace the active live session.
      setHistoryViewItem(item);
      setHistoryViewLoading(true);
      setHistoryViewMessages([]);
      try {
        const data = await fetchSupportMessages(item._id, token);
        if (data.conversation) setHistoryViewItem(data.conversation);
        setHistoryViewMessages(
          (data.messages || []).map(mapServerMessage).filter(Boolean)
        );
      } catch {
        setHistoryViewMessages([]);
      } finally {
        setHistoryViewLoading(false);
      }
    },
    [guestToken, ensureSession]
  );

  const resumeHistoryConversation = useCallback(
    async (item) => {
      if (!item?._id) return;
      // Only resume open human/bot chats; closed stay read-only.
      if (item.status === "closed") return;

      let token = guestToken;
      if (!token) {
        try {
          const session = await ensureSession();
          token = session.guestToken;
        } catch {
          return;
        }
      }

      setConversation(item);
      const nextMode = item.mode === "human" ? "human" : "bot";
      setMode(nextMode);
      setHumanStatus(item.status || "");
      setShowHumanForm(false);
      setHistoryViewItem(null);
      setHistoryViewMessages([]);
      if (nextMode === "human") {
        ensureNotifyPermission().catch(() => {});
      }

      try {
        const data = await fetchSupportMessages(item._id, token);
        if (data.conversation) {
          setConversation(data.conversation);
          const resolved =
            data.conversation.mode === "human" ? "human" : "bot";
          setMode(resolved);
          setHumanStatus(data.conversation.status || "");
          if (resolved === "human") {
            ensureNotifyPermission().catch(() => {});
          }
        }
        setChatMessages(
          (data.messages || []).map(mapServerMessage).filter(Boolean)
        );
        setUnreadCount(0);
      } catch {
        setChatMessages([]);
      }
    },
    [guestToken, ensureSession]
  );

  const goBackHome = useCallback(() => {
    if (mode === "history" && historyViewItem) {
      setHistoryViewItem(null);
      setHistoryViewMessages([]);
      return;
    }
    setMode("bot");
    setShowHumanForm(false);
    setAgentTyping(false);
    setHistoryViewItem(null);
    setHistoryViewMessages([]);
  }, [mode, historyViewItem]);

  const handleSend = () => {
    if (mode === "human") {
      sendHumanMessage();
    } else if (mode === "bot") {
      sendBotMessage();
    }
  };

  const statusLabel =
    mode === "human"
      ? humanStatus === "active"
        ? t("chatbot.humanActive")
        : t("chatbot.humanWaiting")
      : mode === "history"
        ? historyViewItem
          ? formatHistoryDate(
              historyViewItem.lastMessageAt || historyViewItem.createdAt,
              i18n.language
            )
          : openHistoryLabel
        : user?.businessId
          ? t("chatbot.statusSystem")
          : t("chatbot.statusBot");

  const headerTitle =
    mode === "human"
      ? t("chatbot.humanTitle")
      : mode === "history"
        ? historyViewItem
          ? t("chatbot.supportViewConversation", {
              defaultValue: "צפייה בשיחה",
            })
          : historyTitle
        : t("chatbot.title");

  if (!chatOpen) {
    // Launcher can live in SupportChatWidget (hideLauncher) so the button
    // never disappears if this component errors while open.
    if (hideLauncher) return null;

    return (
      <button
        type="button"
        onClick={() => {
          setUnreadCount(0);
          setChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-[10000] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-xl shadow-violet-500/40 transition hover:scale-105 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 relative"
        aria-label={t("chatbot.openAria")}
      >
        <Bot size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <section
      dir={dir}
      className="fixed bottom-6 right-6 z-[10000] flex h-[min(580px,calc(100vh-3rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
    >
      <header className="flex shrink-0 items-center justify-between gap-2 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-3 py-3.5 text-slate-800">
        <div className="flex min-w-0 items-center gap-2">
          {(mode === "human" || mode === "history") && (
            <button
              type="button"
              onClick={goBackHome}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-white/20"
              aria-label={backAria}
            >
              <ArrowRight size={18} />
            </button>
          )}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
            {mode === "human" ? (
              <Headphones size={18} />
            ) : mode === "history" ? (
              <History size={18} />
            ) : (
              <Bot size={18} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black">{headerTitle}</p>
            <p className="truncate text-[10px] font-medium text-slate-500">
              {statusLabel}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {(mode === "bot" || mode === "human") && (
            <button
              type="button"
              onClick={openHistoryView}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/20"
              aria-label={historyAria}
              title={openHistoryLabel}
            >
              <History size={18} />
            </button>
          )}
          <button
            onClick={() => setChatOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-white/20"
            aria-label={t("chatbot.closeAria")}
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {mode === "history" ? (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-3 py-3">
          {historyViewItem ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-slate-800">
                    {historyViewItem.mode === "human"
                      ? t("chatbot.humanTitle")
                      : t("chatbot.title")}
                  </p>
                  <span className="text-[10px] font-medium text-slate-400">
                    {formatHistoryDate(
                      historyViewItem.lastMessageAt ||
                        historyViewItem.createdAt,
                      i18n.language
                    )}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-medium text-slate-500">
                  {historyViewItem.status === "closed"
                    ? t("chatbot.supportStatusClosed", {
                        defaultValue: "שיחה סגורה · צפייה בלבד",
                      })
                    : historyViewItem.status === "active"
                      ? t("chatbot.humanActive")
                      : historyViewItem.status === "waiting"
                        ? t("chatbot.humanWaiting")
                        : t("chatbot.statusBot")}
                </p>
                {historyViewItem.status !== "closed" && (
                  <button
                    type="button"
                    onClick={() => resumeHistoryConversation(historyViewItem)}
                    className="mt-2 w-full rounded-lg bg-violet-700 px-3 py-1.5 text-[11px] font-bold text-white"
                  >
                    {t("chatbot.supportResumeChat", {
                      defaultValue: "המשך שיחה זו",
                    })}
                  </button>
                )}
              </div>

              {historyViewLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                  </div>
                </div>
              ) : historyViewMessages.length === 0 ? (
                <p className="py-8 text-center text-sm font-medium text-slate-500">
                  {t("chatbot.supportEmptyTranscript", {
                    defaultValue: "אין הודעות בשיחה זו",
                  })}
                </p>
              ) : (
                historyViewMessages.map((msg, i) => (
                  <div key={msg.id || i} className="mb-1">
                    {msg.sender === "system" ? (
                      <div className="px-2 text-center text-[11px] font-medium text-slate-500">
                        {msg.text}
                      </div>
                    ) : (
                      <div
                        dir="ltr"
                        className={`flex ${
                          msg.sender === "user"
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
                          }`}
                        >
                          {msg.sender === "agent" && (
                            <p className="mb-1 text-[10px] font-bold text-emerald-700">
                              {t("chatbot.agentLabel")}
                            </p>
                          )}
                          {msg.text}
                          {msg.createdAt && (
                            <p className="mt-1 text-[10px] opacity-60">
                              {formatHistoryDate(msg.createdAt, i18n.language)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : historyLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
              </div>
            </div>
          ) : historyItems.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-slate-500">
              {emptyHistory}
            </p>
          ) : (
            <ul className="space-y-2">
              {historyItems.map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => selectHistoryItem(item)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-start transition hover:border-violet-200 hover:bg-violet-50/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {item.mode === "human"
                          ? t("chatbot.humanTitle")
                          : t("chatbot.title")}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {formatHistoryDate(
                          item.lastMessageAt || item.createdAt,
                          i18n.language
                        )}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="line-clamp-2 text-[11px] text-slate-500">
                        {item.lastMessagePreview || item.status || "—"}
                      </p>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {item.status === "closed"
                          ? t("chatbot.supportStatusClosedShort", {
                              defaultValue: "נסגרה",
                            })
                          : item.status === "active"
                            ? t("chatbot.humanActive")
                            : item.status === "waiting"
                              ? t("chatbot.humanWaiting")
                              : t("chatbot.statusBot")}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <>
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
            {chatMessages.length === 0 && !isLoading && mode === "bot" && (
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
                      onClick={() =>
                        sendBotMessage(prompt, { fromSuggestion: true })
                      }
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
                    dir="ltr"
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
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

                {msg.sender === "bot" &&
                  mode === "bot" &&
                  msg.links?.length > 0 && (
                    <div dir="ltr" className="mt-2 flex flex-wrap justify-start gap-1.5">
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
                    <div className="mt-2 space-y-1 text-start">
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
                  <div className="mt-2 text-start">
                    <button
                      type="button"
                      onClick={() => setShowHumanForm(true)}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-100"
                    >
                      {t("chatbot.talkToHuman")}
                    </button>
                  </div>
                )}

                {msg.sender === "bot" &&
                  msg.suggestions?.length > 0 &&
                  mode === "bot" && (
                    <div dir="ltr" className="mt-2 flex flex-wrap justify-start gap-1.5">
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
              <div dir="ltr" className="mb-3 flex justify-start">
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
                <Send
                  size={16}
                  className={dir === "rtl" ? "-scale-x-100" : undefined}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
