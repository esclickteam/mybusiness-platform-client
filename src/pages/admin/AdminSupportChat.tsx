import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, Bell, Headphones, RefreshCw, Send } from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import {
  ensurePushSubscription,
  getPermission,
  subscribeToPush,
} from "../../utils/push";
import AdminHeader from "./AdminsHeader";

type SupportConversation = {
  _id: string;
  name?: string;
  email?: string;
  status: "bot" | "waiting" | "active" | "closed";
  mode: "bot" | "human";
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadByAgent?: number;
  assignedTo?: { _id?: string; name?: string } | string | null;
};

type SupportMessage = {
  _id: string;
  senderType: "visitor" | "bot" | "agent" | "system";
  senderName?: string;
  text: string;
  createdAt?: string;
};

function statusLabel(status: string) {
  switch (status) {
    case "waiting":
      return "ממתינה לנציג";
    case "active":
      return "פעילה";
    case "bot":
      return "בוט";
    case "closed":
      return "נסגרה";
    default:
      return status;
  }
}

function statusTone(status: string) {
  switch (status) {
    case "waiting":
      return "bg-amber-100 text-amber-900";
    case "active":
      return "bg-emerald-100 text-emerald-900";
    case "closed":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-violet-100 text-violet-900";
  }
}

function formatTime(value?: string) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function mergeMessagesById(
  prev: SupportMessage[],
  incoming: SupportMessage[]
): SupportMessage[] {
  const byId = new Map(prev.map((m) => [m._id, m]));
  for (const m of incoming) {
    byId.set(m._id, m);
  }
  const seen = new Set<string>();
  const merged: SupportMessage[] = [];
  for (const m of prev) {
    const next = byId.get(m._id);
    if (next && !seen.has(next._id)) {
      merged.push(next);
      seen.add(next._id);
    }
  }
  for (const m of incoming) {
    if (!seen.has(m._id)) {
      merged.push(m);
      seen.add(m._id);
    }
  }
  return merged;
}

export default function AdminSupportChat() {
  const { user, socket } = useAuth() as {
    user: { name?: string; _id?: string; userId?: string } | null;
    socket: any;
  };
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [onlineAgents, setOnlineAgents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [filter, setFilter] = useState<
    "open" | "all" | "waiting" | "active" | "closed"
  >("open");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [pushStatus, setPushStatus] = useState(getPermission());
  const [pushBusy, setPushBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const selectedIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const selected = useMemo(
    () => conversations.find((c) => c._id === selectedId) || null,
    [conversations, selectedId]
  );

  const loadConversations = useCallback(
    async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      if (!silent) {
        setLoadingList(true);
        setError("");
      }
      try {
        const statusParam =
          filter === "open" ? "all" : filter === "all" ? "all" : filter;
        const { data } = await API.get("/support-chat/admin/conversations", {
          params: { status: statusParam },
        });
        let list: SupportConversation[] = data.conversations || [];
        if (filter === "open") {
          list = list.filter((c) =>
            ["waiting", "active", "bot"].includes(c.status)
          );
        } else if (filter === "closed") {
          list = list.filter((c) => c.status === "closed");
        }
        setConversations(list);
        setOnlineAgents(data.onlineAgents || []);
      } catch (err: any) {
        if (!silent) {
          setError(err?.response?.data?.error || "שגיאה בטעינת השיחות");
        }
      } finally {
        if (!silent) setLoadingList(false);
      }
    },
    [filter]
  );

  const loadMessages = useCallback(
    async (id: string, opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      if (!silent) setLoadingMessages(true);
      try {
        const { data } = await API.get(`/support-chat/${id}/messages`);
        const incoming: SupportMessage[] = data.messages || [];
        if (silent) {
          setMessages((prev) => mergeMessagesById(prev, incoming));
        } else {
          setMessages(incoming);
        }
        await API.post(`/support-chat/admin/${id}/read`).catch(() => {});
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? { ...c, unreadByAgent: 0 } : c))
        );
      } catch (err: any) {
        if (!silent) {
          setError(err?.response?.data?.error || "שגיאה בטעינת הודעות");
        }
      } finally {
        if (!silent) setLoadingMessages(false);
      }
    },
    []
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
    else setMessages([]);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Deep-link from PWA / push: /admin/support-chat?c=<id>
  useEffect(() => {
    const c = searchParams.get("c");
    if (c) {
      setSelectedId(c);
      setFilter("all");
    }
  }, [searchParams]);

  // Enable PWA push for admins (platform support alerts)
  useEffect(() => {
    void ensurePushSubscription().then(() => setPushStatus(getPermission()));
  }, []);

  // Join / leave conversation room when selection changes
  useEffect(() => {
    if (!socket || !selectedId) return;
    const id = selectedId;
    socket.emit("support:join", id);
    return () => {
      socket.emit("support:leave", id);
    };
  }, [socket, selectedId]);

  // Poll messages every 2s while a conversation is open
  useEffect(() => {
    if (!selectedId) return;
    const id = selectedId;
    const interval = window.setInterval(() => {
      void loadMessages(id, { silent: true });
    }, 2000);
    return () => window.clearInterval(interval);
  }, [selectedId, loadMessages]);

  // Light refresh of conversation list every 5s
  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadConversations({ silent: true });
    }, 5000);
    return () => window.clearInterval(interval);
  }, [loadConversations]);

  useEffect(() => {
    if (!socket) return;

    const upsertConversation = (conversation: SupportConversation) => {
      if (!conversation?._id) return;
      setConversations((prev) => {
        const rest = prev.filter((c) => c._id !== conversation._id);
        return [conversation, ...rest];
      });
    };

    const showLocalAlert = (
      title: string,
      body: string,
      conversationId?: string
    ) => {
      // Always show in-page toast
      setToast(`${title}: ${body}`);
      window.setTimeout(() => setToast(""), 5000);

      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
        );
        void audio.play().catch(() => {});
      } catch {
        /* ignore */
      }

      const sameConversationOpen =
        !!conversationId &&
        String(selectedIdRef.current) === String(conversationId);
      const skipBrowserNotification =
        sameConversationOpen && document.hasFocus();

      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted" &&
        !skipBrowserNotification
      ) {
        try {
          const n = new Notification(title, {
            body,
            tag: conversationId ? `support-${conversationId}` : "support",
          });
          n.onclick = () => {
            window.focus();
            if (conversationId) {
              setSelectedId(conversationId);
              setSearchParams({ c: conversationId });
            }
            n.close();
          };
        } catch {
          /* ignore */
        }
      }
    };

    const onNewMessage = (payload: any) => {
      const conversation = payload?.conversation;
      const message = payload?.message;
      if (conversation) upsertConversation(conversation);
      if (
        message &&
        String(conversation?._id) === String(selectedIdRef.current)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      if (message?.senderType === "visitor") {
        showLocalAlert(
          "הודעה חדשה בתמיכה",
          `${conversation?.name || "אורח"}: ${message.text || ""}`,
          conversation?._id
        );
      }
    };

    const onUpdated = (payload: any) => {
      if (payload?.conversation) upsertConversation(payload.conversation);
      if (
        payload?.systemMessage &&
        String(payload.conversation?._id) === String(selectedIdRef.current)
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === payload.systemMessage._id)) return prev;
          return [...prev, payload.systemMessage];
        });
      }
    };

    const onNotify = (payload: any) => {
      if (payload?.conversation) upsertConversation(payload.conversation);
      showLocalAlert(
        payload?.title || "פניית תמיכה",
        payload?.body || "יש פנייה חדשה",
        payload?.conversationId || payload?.conversation?._id
      );
    };

    const onAgents = (payload: any) => {
      setOnlineAgents(payload?.agents || []);
    };

    socket.emit("joinRoom", "admin-support");
    socket.on("support:newMessage", onNewMessage);
    socket.on("support:conversationUpdated", onUpdated);
    socket.on("support:conversationAssigned", onUpdated);
    socket.on("support:waiting", onUpdated);
    socket.on("support:notify", onNotify);
    socket.on("support:notifyParty", onNotify);
    socket.on("support:agentsOnline", onAgents);

    return () => {
      socket.off("support:newMessage", onNewMessage);
      socket.off("support:conversationUpdated", onUpdated);
      socket.off("support:conversationAssigned", onUpdated);
      socket.off("support:waiting", onUpdated);
      socket.off("support:notify", onNotify);
      socket.off("support:notifyParty", onNotify);
      socket.off("support:agentsOnline", onAgents);
    };
  }, [socket, setSearchParams]);

  function goBackToList() {
    const previousId = selectedIdRef.current;
    if (socket && previousId) {
      socket.emit("support:leave", previousId);
    }
    setSelectedId(null);
    setMessages([]);
    const next = new URLSearchParams(searchParams);
    next.delete("c");
    setSearchParams(next);
  }

  async function enablePushAlerts() {
    setPushBusy(true);
    try {
      const result = await subscribeToPush();
      setPushStatus(getPermission());
      if (!result.ok) {
        setError(
          result.reason === "ios-install"
            ? "באייפון צריך להתקין את האפליקציה למסך הבית (PWA) כדי לקבל התראות"
            : "לא הצלחנו להפעיל התראות בדפדפן"
        );
      } else {
        setToast("התראות PWA הופעלו בהצלחה");
        window.setTimeout(() => setToast(""), 4000);
      }
    } finally {
      setPushBusy(false);
    }
  }

  async function claimConversation(id: string) {
    try {
      const { data } = await API.post(`/support-chat/admin/${id}/claim`);
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? data.conversation : c))
        );
      }
      if (data.systemMessage) {
        setMessages((prev) => [...prev, data.systemMessage]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לקבל את השיחה");
    }
  }

  async function closeConversation(id: string) {
    try {
      const { data } = await API.post(`/support-chat/admin/${id}/close`);
      if (data.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c._id === id ? data.conversation : c))
        );
      }
      if (data.systemMessage) {
        setMessages((prev) => [...prev, data.systemMessage]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לסגור את השיחה");
    }
  }

  function applySendResult(data: {
    message?: SupportMessage;
    conversation?: SupportConversation;
  }) {
    if (data.message) {
      setMessages((prev) => {
        if (prev.some((m) => m._id === data.message!._id)) return prev;
        return [...prev, data.message!];
      });
    }
    if (data.conversation) {
      const conversation = data.conversation;
      setConversations((prev) =>
        prev.map((c) => (c._id === conversation._id ? conversation : c))
      );
    }
  }

  async function sendViaRest(conversationId: string, text: string) {
    const { data } = await API.post(`/support-chat/${conversationId}/messages`, {
      text,
    });
    applySendResult(data);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || !selectedId || sending) return;
    setSending(true);
    setInput("");
    const conversationId = selectedId;

    try {
      if (socket?.connected) {
        try {
          await new Promise<void>((resolve, reject) => {
            let settled = false;
            const timer = window.setTimeout(() => {
              if (settled) return;
              settled = true;
              reject(new Error("timeout"));
            }, 2500);

            socket.emit(
              "support:sendMessage",
              { conversationId, text },
              (ack: any) => {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                if (!ack?.ok) {
                  reject(new Error(ack?.error || "send failed"));
                  return;
                }
                applySendResult(ack);
                resolve();
              }
            );
          });
        } catch {
          // Socket ack failed / timed out — REST fallback
          await sendViaRest(conversationId, text);
        }
      } else {
        await sendViaRest(conversationId, text);
      }
    } catch (err: any) {
      setError(err?.message || "שליחת ההודעה נכשלה");
      setInput(text);
    } finally {
      setSending(false);
    }
  }

  const waitingCount = conversations.filter((c) => c.status === "waiting").length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f6f3fb] text-slate-900">
      <AdminHeader />

      <main className="mx-auto max-w-[1480px] px-4 py-6 md:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black">
              <Headphones className="text-violet-700" size={26} />
              צ׳אט שירות לקוחות
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              שיחות בזמן אמת מהאתר — כרגע מועברות לאדמין המחובר
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              נציגים מחוברים: {onlineAgents.length || (socket?.connected ? 1 : 0)}
            </span>
            {waitingCount > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
                ממתינות: {waitingCount}
              </span>
            )}
            {pushStatus !== "granted" && (
              <button
                type="button"
                disabled={pushBusy}
                onClick={() => void enablePushAlerts()}
                className="inline-flex items-center gap-1 rounded-xl bg-violet-700 px-3 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50"
              >
                <Bell size={14} />
                הפעלת התראות PWA
              </button>
            )}
            {pushStatus === "granted" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
                <Bell size={12} />
                התראות PWA פעילות
              </span>
            )}
            <button
              type="button"
              onClick={() => void loadConversations()}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
            >
              <RefreshCw size={14} />
              רענון
            </button>
          </div>
        </div>

        {toast && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {toast}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-[28px] border border-violet-100 bg-white shadow-xl lg:grid-cols-[340px_1fr]">
          <aside
            className={`border-b border-violet-50 lg:border-b-0 lg:border-l ${
              selectedId ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex gap-1 border-b border-violet-50 p-3">
              {(
                [
                  ["open", "פתוחות"],
                  ["waiting", "ממתינות"],
                  ["active", "פעילות"],
                  ["closed", "היסטוריה"],
                  ["all", "הכל"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    filter === key
                      ? "bg-violet-700 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto lg:max-h-[calc(70vh-52px)]">
              {loadingList ? (
                <p className="p-4 text-sm text-slate-500">טוען שיחות...</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">אין שיחות להצגה</p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      setSelectedId(c._id);
                      setSearchParams({ c: c._id });
                    }}
                    className={`w-full border-b border-slate-50 px-4 py-3 text-right transition ${
                      selectedId === c._id
                        ? "bg-violet-50"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {c.name || "אורח"}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          {c.email || "ללא אימייל"}
                        </p>
                      </div>
                      <div className="text-left">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone(
                            c.status
                          )}`}
                        >
                          {statusLabel(c.status)}
                        </span>
                        {!!c.unreadByAgent && (
                          <span className="mt-1 block text-[10px] font-black text-rose-600">
                            {c.unreadByAgent} חדשות
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-600">
                      {c.lastMessagePreview || "—"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatTime(c.lastMessageAt)}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section
            className={`flex min-h-[60vh] flex-col ${
              selectedId ? "block" : "hidden lg:flex"
            }`}
          >
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center text-slate-500">
                <Headphones size={36} className="text-violet-300" />
                <p className="text-sm font-bold">בחרו שיחה מהרשימה</p>
                <p className="text-xs">
                  שלום {user?.name || "מנהל"} — שיחות חדשות יופיעו כאן בזמן אמת
                </p>
              </div>
            ) : (
              <>
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-50 px-5 py-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <button
                      type="button"
                      onClick={goBackToList}
                      className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm"
                    >
                      <ArrowRight size={14} />
                      חזרה לרשימה
                    </button>
                    <div className="min-w-0">
                      <h2 className="text-lg font-black">
                        {selected.name || "אורח"}
                      </h2>
                      <p className="text-xs font-medium text-slate-500">
                        {selected.email || "—"} · {statusLabel(selected.status)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selected.status === "waiting" && (
                      <button
                        type="button"
                        onClick={() => claimConversation(selected._id)}
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                      >
                        קבל שיחה
                      </button>
                    )}
                    {selected.status !== "closed" && (
                      <button
                        type="button"
                        onClick={() => closeConversation(selected._id)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
                      >
                        סגור שיחה
                      </button>
                    )}
                  </div>
                </header>

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#faf8ff] px-5 py-4">
                  {loadingMessages ? (
                    <p className="text-sm text-slate-500">טוען הודעות...</p>
                  ) : (
                    messages.map((msg) => {
                      if (msg.senderType === "system") {
                        return (
                          <div
                            key={msg._id}
                            className="text-center text-[11px] font-medium text-slate-500"
                          >
                            {msg.text}
                          </div>
                        );
                      }

                      const mine = msg.senderType === "agent";
                      return (
                        <div
                          key={msg._id}
                          dir="ltr"
                          className={
                            mine ? "flex justify-end" : "flex justify-start"
                          }
                        >
                          <div
                            dir="rtl"
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                              mine
                                ? "rounded-br-sm bg-violet-700 text-white"
                                : msg.senderType === "bot"
                                  ? "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                                  : "rounded-bl-sm border border-emerald-100 bg-emerald-50 text-slate-800"
                            }`}
                          >
                            <p className="mb-1 text-[10px] font-bold opacity-80">
                              {msg.senderType === "visitor"
                                ? selected.name || "לקוח"
                                : msg.senderType === "bot"
                                  ? "בוט"
                                  : msg.senderName || "נציג"}
                            </p>
                            <p className="whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                            <p className="mt-1 text-[10px] opacity-70">
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <footer className="border-t border-violet-50 bg-white px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      disabled={selected.status === "closed" || sending}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={
                        selected.status === "closed"
                          ? "השיחה סגורה"
                          : "כתבו תשובה ללקוח..."
                      }
                      className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={
                        !input.trim() ||
                        selected.status === "closed" ||
                        sending
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-700 text-white transition hover:bg-violet-800 disabled:opacity-40"
                      aria-label="שליחה"
                    >
                      <Send size={16} className="-scale-x-100" />
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
