"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/socketContext";
import ConversationsList from "./ConversationsList";
import BusinessChatTab from "./BusinessChatTab";
import API from "../api";
import BizuplyLoader from "./ui/BizuplyLoader";
import { useTranslation } from "react-i18next";
import GuidedDemoSandboxButton from "../guidedDemo/GuidedDemoSandboxButton";
import { useLocaleDir } from "../hooks/useLocaleDir";
import "./BusinessChatPage.css";

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
  const { t } = useTranslation();
  const dir = useLocaleDir();
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
      clientName: c.clientName || c.customer?.name || t("leftover.bizChatChrome.client"),
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
    return <BizuplyLoader fullScreen label={t("leftover.bizChatChrome.loadingData")} />;
  }

  /* =====================================================
     NO BUSINESS
  ===================================================== */

  if (!businessId) {
    return (
      <main className="biz-inbox" dir={dir}>
        <section className="biz-inbox-empty">
          <h2>{t("leftover.bizChatChrome.noBusinessTitle")}</h2>
          <p>{t("leftover.bizChatChrome.noBusinessBody")}</p>
        </section>
      </main>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="biz-inbox" dir={dir}>
      <header className="biz-inbox-head">
        <div>
          <p className="biz-inbox-kicker">{t("leftover.bizChatChrome.inbox")}</p>
          <h1>{t("leftover.bizChatChrome.title")}</h1>
          <p>{t("leftover.bizChatChrome.subtitle")}</p>
          <GuidedDemoSandboxButton target="messages-demo-send" className="biz-inbox-demo">
            {t("leftover.waInbox.demoSend")}
          </GuidedDemoSandboxButton>
        </div>
        <dl className="biz-inbox-facts">
          <div>
            <dt>{t("leftover.bizChatChrome.conversations")}</dt>
            <dd>{convos.length}</dd>
          </div>
          <div>
            <dt>{t("leftover.bizChatChrome.unread")}</dt>
            <dd>{totalUnread}</dd>
          </div>
        </dl>
      </header>

      {error && <p className="biz-inbox-error">{error}</p>}

      <section className="biz-inbox-grid">
        {(!isMobile || !selected) && (
          <aside className="biz-inbox-list">
            <div className="biz-inbox-list-head">
              <h2>{t("leftover.bizChatChrome.conversations")}</h2>
              <p>
                {isLoadingConvos
                  ? t("leftover.bizChatChrome.loadingList")
                  : t("leftover.bizChatChrome.chatsCount", { count: convos.length })}
              </p>
            </div>
            <div className="biz-inbox-scroll">
              {isLoadingConvos ? (
                <BizuplyLoader size="lg" label={t("leftover.bizChatChrome.loadingConversations")} />
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
                <div className="biz-inbox-empty">
                  <h3>{t("leftover.bizChatChrome.emptyTitle")}</h3>
                  <p>{t("leftover.bizChatChrome.emptyBody")}</p>
                </div>
              )}
            </div>
          </aside>
        )}

        <section className="biz-inbox-thread">
          {selected ? (
            <div className="biz-inbox-thread-body">
              {isMobile && (
                <button type="button" className="biz-inbox-back" onClick={() => setSelected(null)}>
                  {t("leftover.bizChatChrome.back")}
                </button>
              )}
              <BusinessChatTab
                conversationId={selected.conversationId}
                businessId={businessId}
                customerId={selected.partnerId}
                customerName={selected.partnerName}
                conversationType={selected.conversationType}
              />
            </div>
          ) : (
            !isMobile && (
              <div className="biz-inbox-empty">
                <h3>{t("leftover.bizChatChrome.selectTitle")}</h3>
                <p>{t("leftover.bizChatChrome.selectBody")}</p>
              </div>
            )
          )}
        </section>
      </section>
    </main>
  );
}