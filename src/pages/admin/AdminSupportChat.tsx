import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Headphones,
  History,
  RefreshCw,
  Send,
  X,
} from "lucide-react";

import API from "../../api";
import { useAuth } from "../../context/AuthContext";
import { notifyAdminSupportEvent } from "../../utils/adminSupportAlerts";
import AdminHeader from "./AdminsHeader";

type SupportConversation = {
  _id: string;
  name?: string;
  email?: string;
  visitorId?: string;
  userId?: string | null;
  status: "bot" | "waiting" | "active" | "closed";
  mode: "bot" | "human";
  lastMessageAt?: string;
  createdAt?: string;
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
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-200/70";
    case "active":
      return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/70";
    case "closed":
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80";
    default:
      return "bg-violet-100 text-violet-800 ring-1 ring-violet-200/70";
  }
}

function initialsFromName(name?: string) {
  const value = String(name || "אורח").trim();
  return (
    value
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "א"
  );
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
  const [customerHistoryOpen, setCustomerHistoryOpen] = useState(false);
  const [customerHistoryLoading, setCustomerHistoryLoading] = useState(false);
  const [customerHistoryItems, setCustomerHistoryItems] = useState<
    SupportConversation[]
  >([]);
  const [customerHistoryMeta, setCustomerHistoryMeta] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const [historyPreviewId, setHistoryPreviewId] = useState<string | null>(null);
  const [historyPreviewMessages, setHistoryPreviewMessages] = useState<
    SupportMessage[]
  >([]);
  const [historyPreviewLoading, setHistoryPreviewLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const selectedIdRef = useRef<string | null>(null);
  const stickToBottomRef = useRef(true);
  const lastScrolledMsgIdRef = useRef<string | null>(null);
  const prevSelectedForScrollRef = useRef<string | null>(null);

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

  // Auto-scroll only when near bottom / new conversation — never yank while reading up.
  useEffect(() => {
    const lastId = messages[messages.length - 1]?._id || null;
    const conversationChanged =
      selectedId !== prevSelectedForScrollRef.current;

    if (conversationChanged) {
      prevSelectedForScrollRef.current = selectedId;
      stickToBottomRef.current = true;
      lastScrolledMsgIdRef.current = null;
    }

    const lastChanged = lastId !== lastScrolledMsgIdRef.current;
    if (!stickToBottomRef.current || (!lastChanged && !conversationChanged)) {
      return;
    }

    lastScrolledMsgIdRef.current = lastId;
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messages, selectedId]);

  // Deep-link from PWA / push: /admin/support-chat?c=<id>
  useEffect(() => {
    const c = searchParams.get("c");
    if (c) {
      setSelectedId(c);
      setFilter("all");
    }
  }, [searchParams]);

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
      setToast(`${title}: ${body}`);
      window.setTimeout(() => setToast(""), 5000);

      const sameConversationOpen =
        !!conversationId &&
        String(selectedIdRef.current) === String(conversationId);
      const skipOsNotification =
        sameConversationOpen && !document.hidden && document.hasFocus();

      void notifyAdminSupportEvent({
        title,
        body,
        conversationId,
        skipOsNotification,
      }).then((alert) => {
        if (!alert) return;
        window.dispatchEvent(
          new CustomEvent("bizuply:adminSupportAlert", { detail: alert })
        );
      });
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
    setCustomerHistoryOpen(false);
    setHistoryPreviewId(null);
    setHistoryPreviewMessages([]);
    const next = new URLSearchParams(searchParams);
    next.delete("c");
    setSearchParams(next);
  }

  async function openCustomerHistory() {
    if (!selectedId) return;
    setCustomerHistoryOpen(true);
    setHistoryPreviewId(null);
    setHistoryPreviewMessages([]);
    setCustomerHistoryLoading(true);
    try {
      const { data } = await API.get(
        `/support-chat/admin/conversations/${selectedId}/customer-history`
      );
      setCustomerHistoryItems(data.conversations || []);
      setCustomerHistoryMeta(data.customer || null);
    } catch (err: any) {
      setError(err?.response?.data?.error || "שגיאה בטעינת היסטוריית הלקוח");
      setCustomerHistoryItems([]);
    } finally {
      setCustomerHistoryLoading(false);
    }
  }

  async function openHistoryPreview(conversationId: string) {
    if (!conversationId) return;
    setHistoryPreviewId(conversationId);
    setHistoryPreviewLoading(true);
    try {
      const { data } = await API.get(`/support-chat/${conversationId}/messages`);
      setHistoryPreviewMessages(data.messages || []);
      if (data.conversation) {
        setConversations((prev) => {
          if (prev.some((c) => c._id === data.conversation._id)) return prev;
          return [data.conversation, ...prev];
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "שגיאה בטעינת השיחה");
      setHistoryPreviewMessages([]);
    } finally {
      setHistoryPreviewLoading(false);
    }
  }

  function openHistoryConversationLive(conversationId: string) {
    setCustomerHistoryOpen(false);
    setHistoryPreviewId(null);
    setHistoryPreviewMessages([]);
    setSelectedId(conversationId);
    setSearchParams({ c: conversationId });
    setFilter("all");
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

    stickToBottomRef.current = true;

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
    <div
      dir="rtl"
      className="min-h-screen bg-[#F8F9FA] text-slate-900"
      style={{ fontFamily: '"Assistant", "Inter", "Rubik", sans-serif' }}
    >
      <AdminHeader />

      <main className="mx-auto max-w-[1480px] px-3 py-5 sm:px-4 sm:py-6 md:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-black text-slate-900 sm:text-3xl">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/25">
                <Headphones size={20} />
              </span>
              צ׳אט שירות לקוחות
            </h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              שיחות בזמן אמת מהאתר — מועברות לנציג המחובר
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
              נציגים מחוברים: {onlineAgents.length || (socket?.connected ? 1 : 0)}
            </span>
            {waitingCount > 0 && (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-800 ring-1 ring-amber-100">
                ממתינות: {waitingCount}
              </span>
            )}
            <button
              type="button"
              onClick={() => void loadConversations()}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-[#7C4DFF]"
            >
              <RefreshCw size={14} />
              רענון
            </button>
          </div>
        </div>

        {toast && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {toast}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <div className="grid min-h-[72vh] grid-cols-1 overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] lg:grid-cols-[360px_1fr]">
          <aside
            className={`border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/80 lg:border-b-0 lg:border-l lg:border-slate-100 ${
              selectedId ? "hidden lg:block" : "block"
            }`}
          >
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 p-3">
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
                  className={`rounded-full px-3 py-1.5 text-xs font-black transition ${
                    filter === key
                      ? "bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/25"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50 hover:text-[#7C4DFF]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto overscroll-contain lg:max-h-[calc(72vh-64px)]">
              {loadingList ? (
                <p className="p-5 text-sm font-semibold text-slate-500">
                  טוען שיחות...
                </p>
              ) : conversations.length === 0 ? (
                <p className="p-5 text-sm font-semibold text-slate-500">
                  אין שיחות להצגה
                </p>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => {
                      setSelectedId(c._id);
                      setSearchParams({ c: c._id });
                    }}
                    className={`w-full border-b border-slate-100 px-4 py-3.5 text-right transition ${
                      selectedId === c._id
                        ? "bg-violet-50/90"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#A78BFA] text-xs font-black text-white shadow-sm">
                        {initialsFromName(c.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">
                              {c.name || "אורח"}
                            </p>
                            <p className="truncate text-[11px] font-semibold text-slate-500">
                              {c.email || "ללא אימייל"}
                            </p>
                          </div>
                          <div className="shrink-0 text-left">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${statusTone(
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
                        <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-600">
                          {c.lastMessagePreview || "—"}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold text-slate-400">
                          {formatTime(c.lastMessageAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section
            className={`flex min-h-[60vh] flex-col ${
              selectedId ? "flex" : "hidden lg:flex"
            }`}
          >
            {!selected ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(124,77,255,0.08),_transparent_45%)] p-8 text-center text-slate-500">
                <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-violet-50 text-[#7C4DFF] ring-1 ring-violet-100">
                  <Headphones size={30} />
                </span>
                <p className="text-base font-black text-slate-800">
                  בחרו שיחה מהרשימה
                </p>
                <p className="max-w-sm text-sm font-semibold leading-6 text-slate-500">
                  שלום {user?.name || "מנהל"} — שיחות חדשות יופיעו כאן בזמן אמת
                </p>
              </div>
            ) : (
              <>
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={goBackToList}
                      className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-violet-200 hover:text-[#7C4DFF] lg:hidden"
                    >
                      <ArrowRight size={14} />
                      חזרה לרשימה
                    </button>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#7C4DFF] to-[#A78BFA] text-xs font-black text-white">
                      {initialsFromName(selected.name)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-slate-900">
                        {selected.name || "אורח"}
                      </h2>
                      <p className="truncate text-xs font-semibold text-slate-500">
                        {selected.email || "—"} ·{" "}
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black ${statusTone(
                            selected.status
                          )}`}
                        >
                          {statusLabel(selected.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void openCustomerHistory()}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-[#7C4DFF] px-3.5 py-2 text-xs font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0]"
                    >
                      <History size={15} />
                      היסטוריית שיחות של הלקוח
                    </button>
                    {selected.status === "waiting" && (
                      <button
                        type="button"
                        onClick={() => claimConversation(selected._id)}
                        className="rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-sm"
                      >
                        קבל שיחה
                      </button>
                    )}
                    {selected.status !== "closed" && (
                      <button
                        type="button"
                        onClick={() => closeConversation(selected._id)}
                        className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-black text-slate-700"
                      >
                        סגור שיחה
                      </button>
                    )}
                  </div>
                </header>

                {customerHistoryOpen && (
                  <div className="border-b border-violet-100 bg-white px-4 py-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          היסטוריית שיחות ללקוח
                        </p>
                        <p className="text-[11px] font-medium text-slate-500">
                          {customerHistoryMeta?.name || selected.name || "אורח"}
                          {customerHistoryMeta?.email || selected.email
                            ? ` · ${customerHistoryMeta?.email || selected.email}`
                            : ""}
                          {" · "}
                          {customerHistoryItems.length} שיחות
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerHistoryOpen(false);
                          setHistoryPreviewId(null);
                          setHistoryPreviewMessages([]);
                        }}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-500"
                        aria-label="סגור היסטוריה"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {customerHistoryLoading ? (
                      <p className="text-xs text-slate-500">טוען היסטוריה...</p>
                    ) : customerHistoryItems.length === 0 ? (
                      <p className="text-xs text-slate-500">אין שיחות קודמות</p>
                    ) : (
                      <div className="grid max-h-48 gap-2 overflow-y-auto sm:grid-cols-2">
                        {customerHistoryItems.map((item) => (
                          <button
                            key={item._id}
                            type="button"
                            onClick={() => void openHistoryPreview(item._id)}
                            className={`rounded-xl border px-3 py-2.5 text-right transition ${
                              historyPreviewId === item._id ||
                              selectedId === item._id
                                ? "border-violet-300 bg-violet-50"
                                : "border-slate-200 bg-slate-50 hover:border-violet-200 hover:bg-violet-50/50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTone(
                                  item.status
                                )}`}
                              >
                                {statusLabel(item.status)}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">
                                {formatTime(item.lastMessageAt || item.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] text-slate-600">
                              {item.lastMessagePreview || "—"}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  ref={messagesContainerRef}
                  onScroll={() => {
                    const el = messagesContainerRef.current;
                    if (!el) return;
                    const distance =
                      el.scrollHeight - el.scrollTop - el.clientHeight;
                    stickToBottomRef.current = distance < 140;
                  }}
                  className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#faf8ff_0%,#f8fafc_100%)] px-4 py-5 md:px-6"
                >
                  {historyPreviewId ? (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2">
                        <p className="text-xs font-bold text-violet-800">
                          צפייה בשיחה מההיסטוריה
                          {historyPreviewId === selectedId
                            ? " (השיחה הנוכחית)"
                            : ""}
                        </p>
                        <div className="flex gap-2">
                          {historyPreviewId !== selectedId && (
                            <button
                              type="button"
                              onClick={() =>
                                openHistoryConversationLive(historyPreviewId)
                              }
                              className="rounded-lg bg-violet-700 px-2.5 py-1 text-[11px] font-bold text-white"
                            >
                              פתח כשיחה פעילה
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setHistoryPreviewId(null);
                              setHistoryPreviewMessages([]);
                            }}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600"
                          >
                            חזרה לשיחה הנוכחית
                          </button>
                        </div>
                      </div>
                      {historyPreviewLoading ? (
                        <p className="text-sm text-slate-500">טוען הודעות...</p>
                      ) : historyPreviewMessages.length === 0 ? (
                        <p className="text-sm text-slate-500">אין הודעות בשיחה</p>
                      ) : (
                        historyPreviewMessages.map((msg) => {
                          if (msg.senderType === "system") {
                            return (
                              <div
                                key={msg._id}
                                className="mx-auto max-w-[85%] rounded-full bg-white/80 px-4 py-1.5 text-center text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200/70"
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
                                className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                  mine
                                    ? "rounded-bl-md bg-[#7C4DFF] text-white shadow-[#7C4DFF]/20"
                                    : msg.senderType === "bot"
                                      ? "rounded-br-md border border-slate-200 bg-white text-slate-800"
                                      : "rounded-br-md border border-emerald-100 bg-emerald-50 text-slate-800"
                                }`}
                              >
                                <p className="mb-1 text-[10px] font-black opacity-80">
                                  {msg.senderType === "visitor"
                                    ? selected.name || "לקוח"
                                    : msg.senderType === "bot"
                                      ? "בוט"
                                      : msg.senderName || "נציג"}
                                </p>
                                <p className="whitespace-pre-wrap break-words font-semibold">
                                  {msg.text}
                                </p>
                                <p className="mt-1.5 text-[10px] font-semibold opacity-70">
                                  {formatTime(msg.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </>
                  ) : null}

                  {!historyPreviewId && (
                    <>
                      {loadingMessages ? (
                        <p className="text-sm font-semibold text-slate-500">
                          טוען הודעות...
                        </p>
                      ) : (
                        messages.map((msg) => {
                          if (msg.senderType === "system") {
                            return (
                              <div
                                key={msg._id}
                                className="mx-auto max-w-[85%] rounded-full bg-white/80 px-4 py-1.5 text-center text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200/70"
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
                                className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-sm ${
                                  mine
                                    ? "rounded-bl-md bg-[#7C4DFF] text-white shadow-[#7C4DFF]/20"
                                    : msg.senderType === "bot"
                                      ? "rounded-br-md border border-slate-200 bg-white text-slate-800"
                                      : "rounded-br-md border border-emerald-100 bg-emerald-50 text-slate-800"
                                }`}
                              >
                                <p className="mb-1 text-[10px] font-black opacity-80">
                                  {msg.senderType === "visitor"
                                    ? selected.name || "לקוח"
                                    : msg.senderType === "bot"
                                      ? "בוט"
                                      : msg.senderName || "נציג"}
                                </p>
                                <p className="whitespace-pre-wrap break-words font-semibold">
                                  {msg.text}
                                </p>
                                <p className="mt-1.5 text-[10px] font-semibold opacity-70">
                                  {formatTime(msg.createdAt)}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {!historyPreviewId && (
                  <footer className="border-t border-slate-100 bg-white px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div className="flex items-center gap-2 rounded-[22px] border border-slate-200 bg-slate-50 p-2 shadow-inner">
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
                        className="h-11 min-h-11 flex-1 rounded-2xl bg-transparent px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={sendMessage}
                        disabled={
                          !input.trim() ||
                          selected.status === "closed" ||
                          sending
                        }
                        className="flex h-11 min-h-11 w-11 items-center justify-center rounded-2xl bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/25 transition hover:bg-[#6B3FE0] disabled:opacity-40"
                        aria-label="שליחה"
                      >
                        <Send size={16} className="-scale-x-100" />
                      </button>
                    </div>
                  </footer>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
