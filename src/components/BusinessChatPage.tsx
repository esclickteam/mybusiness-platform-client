"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/socketContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import API from "../api";
import BizuplyLoader from "./ui/BizuplyLoader";

/* =====================================================
   TYPES
===================================================== */

type ConversationType = "user-business" | "business-business" | string;

type RawConversation = {
  _id?: string;
  id?: string;
  conversationId?: string;
  clientId?: string;
  clientName?: string;
  customer?: {
    _id?: string;
    name?: string;
  };
  conversationType?: ConversationType;
  unreadCount?: number;
  [key: string]: unknown;
};

type Conversation = RawConversation & {
  conversationId: string;
  clientId: string;
  clientName: string;
  conversationType: ConversationType;
};

type SelectedConversation = {
  conversationId: string;
  partnerId: string;
  partnerName: string;
  conversationType: ConversationType;
};

type UnreadCounts = Record<string, number>;

type NewMessagePayload = {
  conversationId?: string;
  toId?: string;
  [key: string]: unknown;
};

/* =====================================================
   COMPONENT
===================================================== */

export default function BusinessChatPage() {
  const { user, initialized } = useAuth() as any;
  const socket = useSocket() as any;
  const location = useLocation();

  const rawBusinessId = user?.businessId || user?.business?._id;
  const businessId = (rawBusinessId?._id ?? rawBusinessId)?.toString();

  const [convos, setConvos] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<SelectedConversation | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});
  const [isLoadingConvos, setIsLoadingConvos] = useState(false);
  const [error, setError] = useState("");

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768;
  });

  const threadIdFromNavigation = useMemo(() => {
    const fromState = (location.state as any)?.threadId;
    const fromQuery = new URLSearchParams(location.search).get("threadId");

    return fromState || fromQuery || "";
  }, [location.state, location.search]);

  /* =====================================================
     MOBILE DETECTION
  ===================================================== */

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    onResize();

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* =====================================================
     NORMALIZE CONVERSATION
  ===================================================== */

  const normaliseConversation = (c: RawConversation): Conversation => {
    const conversationId = (c.conversationId ?? c._id ?? c.id)?.toString() ?? "";

    const clientId =
      c.clientId?.toString() || c.customer?._id?.toString() || "";

    return {
      ...c,
      conversationId,
      clientId,
      clientName: c.clientName || c.customer?.name || "Client",
      conversationType: c.conversationType || "user-business",
    };
  };

  /* =====================================================
     OPEN CONVERSATION FROM NAVIGATION
  ===================================================== */

  useEffect(() => {
    if (!initialized || !businessId || convos.length === 0) return;
    if (!threadIdFromNavigation) return;

    const convo = convos.find(
      (c) => c.conversationId === threadIdFromNavigation
    );

    if (!convo) return;

    setSelected({
      conversationId: convo.conversationId,
      partnerId: convo.clientId,
      partnerName: convo.clientName,
      conversationType: convo.conversationType,
    });

    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[threadIdFromNavigation];
      return next;
    });
  }, [initialized, businessId, convos, threadIdFromNavigation]);

  /* =====================================================
     FETCH CONVERSATIONS
  ===================================================== */

  useEffect(() => {
    if (!initialized || !businessId) return;

    let isMounted = true;

    async function fetchConversations() {
      try {
        setIsLoadingConvos(true);
        setError("");

        const { data } = await API.get("/messages/client-conversations");

        const rawList: RawConversation[] = Array.isArray(data?.conversations)
          ? data.conversations
          : Array.isArray(data)
          ? data
          : [];

        const userBusinessOnly = rawList.filter(
          (c) => (c.conversationType || "user-business") === "user-business"
        );

        const normalized = userBusinessOnly
          .map(normaliseConversation)
          .filter((c) => c.conversationId && c.clientId);

        const deduped = normalized.reduce<Conversation[]>((acc, conv) => {
          const exists = acc.some((item) => item.clientId === conv.clientId);
          if (!exists) acc.push(conv);
          return acc;
        }, []);

        if (!isMounted) return;

        setConvos(deduped);

        const counts: UnreadCounts = {};

        deduped.forEach((c) => {
          if (c.unreadCount) {
            counts[c.conversationId] = c.unreadCount;
          }
        });

        setUnreadCounts(counts);

        if (
          !isMobile &&
          !selected &&
          !threadIdFromNavigation &&
          deduped.length > 0
        ) {
          const first = deduped[0];

          setSelected({
            conversationId: first.conversationId,
            partnerId: first.clientId,
            partnerName: first.clientName,
            conversationType: first.conversationType,
          });
        }
      } catch (err) {
        console.error("Error fetching client conversations:", err);

        if (isMounted) {
          setError("Could not load conversations");
        }
      } finally {
        if (isMounted) {
          setIsLoadingConvos(false);
        }
      }
    }

    fetchConversations();

    return () => {
      isMounted = false;
    };
  }, [initialized, businessId, isMobile, selected, threadIdFromNavigation]);

  /* =====================================================
     REALTIME UPDATES
  ===================================================== */

  useEffect(() => {
    if (!socket || !businessId) return;

    socket.emit("joinBusinessRoom", businessId);

    const handleNewMessage = (msg: NewMessagePayload) => {
      if (!msg?.conversationId) return;
      if (msg?.toId !== businessId) return;
      if (msg.conversationId === selected?.conversationId) return;

      setUnreadCounts((prev) => ({
        ...prev,
        [msg.conversationId!]: (prev[msg.conversationId!] || 0) + 1,
      }));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.emit("leaveRoom", `business-${businessId}`);
    };
  }, [socket, businessId, selected?.conversationId]);

  /* =====================================================
     MARK AS READ
  ===================================================== */

  useEffect(() => {
    if (!socket || !selected?.conversationId || !businessId) return;

    socket.emit("markConversationRead", {
      conversationId: selected.conversationId,
      role: "business",
      readerId: businessId,
    });
  }, [socket, selected?.conversationId, businessId]);

  /* =====================================================
     SELECT CONVERSATION
  ===================================================== */

  const handleSelect = (
    conversationId: string,
    partnerId: string,
    partnerName: string
  ) => {
    const convo = convos.find((c) => c.conversationId === conversationId);
    const type = convo?.conversationType || "user-business";

    setSelected({
      conversationId,
      partnerId,
      partnerName,
      conversationType: type,
    });

    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
  };

  const totalUnread = Object.values(unreadCounts).reduce(
    (sum, count) => sum + Number(count || 0),
    0
  );

  /* =====================================================
     LOADING
  ===================================================== */

  if (!initialized) {
    return <BizuplyLoader fullScreen label="Loading data…" />;
  }

  /* =====================================================
     NO BUSINESS
  ===================================================== */

  if (!businessId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-800">
            Business account not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            We could not find an active business ID for this user.
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-800 sm:px-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="relative overflow-hidden bg-gradient-to-l from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80 px-5 py-6 text-white sm:px-7">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black text-white/80 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Business Inbox
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Client Messages
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                  Manage all customer conversations, reply faster, and keep your
                  communication organized in one professional workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    Conversations
                  </p>
                  <p className="mt-1 text-2xl font-black">{convos.length}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-wide text-white/45">
                    Unread
                  </p>
                  <p className="mt-1 text-2xl font-black">{totalUnread}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {/* CHAT LAYOUT */}
        <section className="grid min-h-[72vh] overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[360px_1fr]">
          {/* SIDEBAR */}
          {(!isMobile || !selected) && (
            <aside className="border-b border-slate-100 bg-white lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    Conversations
                  </h2>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {isLoadingConvos
                      ? "Loading conversations..."
                      : `${convos.length} client chats`}
                  </p>
                </div>

                {totalUnread > 0 && (
                  <div className="flex h-9 min-w-9 items-center justify-center rounded-full bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-3 text-sm font-black text-white shadow-lg shadow-violet-500/25">
                    {totalUnread}
                  </div>
                )}
              </div>

              <div className="h-[calc(72vh-73px)] overflow-y-auto p-3">
                {isLoadingConvos ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <BizuplyLoader size="lg" label="Loading conversations…" />
                  </div>
                ) : convos.length > 0 ? (
                  <ConversationsList
                    conversations={convos}
                    businessId={businessId}
                    selectedConversationId={selected?.conversationId}
                    onSelect={handleSelect}
                    unreadCountsByConversation={unreadCounts}
                    isBusiness
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      💬
                    </div>

                    <h3 className="mt-4 text-lg font-black text-slate-800">
                      No conversations yet
                    </h3>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      When customers message your business, their conversations
                      will appear here.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* CHAT AREA */}
          <section className="min-h-[72vh] bg-slate-50/70">
            {selected ? (
              <div className="flex h-full min-h-[72vh] flex-col">
                {isMobile && (
                  <div className="border-b border-slate-200 bg-white px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-sm transition hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"
                    >
                      ← Back to conversations
                    </button>
                  </div>
                )}

                <div className="min-h-0 flex-1">
                  <BusinessChatTab
                    conversationId={selected.conversationId}
                    businessId={businessId}
                    customerId={selected.partnerId}
                    customerName={selected.partnerName}
                    conversationType={selected.conversationType}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[72vh] flex-col items-center justify-center px-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-[2rem] bg-violet-300/30 blur-2xl" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-4xl shadow-xl">
                    💭
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-black tracking-tight text-slate-800">
                  Select a conversation
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Choose a client from the conversations list to view messages
                  and reply.
                </p>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}