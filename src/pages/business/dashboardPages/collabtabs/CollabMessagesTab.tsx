import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileSignature,
  Inbox,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import API from "../../../../api";
import { BizuplyLoadingState } from "../../../../components/ui/BizuplyLoader";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";
import CollabChat from "./CollabChat";
import { useCollabOutletContext } from "./useCollabOutletContext";
import { useTranslation } from "react-i18next";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

type MessageFilter = "sent" | "received" | "accepted" | "chat";

type IdLike = string | { _id?: string } | null | undefined;

type ProposalMessage = {
  _id: string;
  fromBusinessName?: string;
  toBusinessName?: string;
  contactName?: string;
  phone?: string;
  description?: string;
  giving?: string[];
  receiving?: string[];
  payment?: string;
  amount?: number | string;
  status?: string;
  agreementId?: IdLike;
  partnershipAgreementId?: IdLike;
  agreement?: IdLike;
};

type MessagesState = {
  sent: ProposalMessage[];
  received: ProposalMessage[];
};

type CollabMessagesTabProps = {
  refreshFlag?: number | string | boolean;
  onStatusChange?: () => void;
};

type PartnershipAgreementViewProps = {
  agreementId: IdLike;
  currentBusinessId: IdLike;
  onClose?: () => void;
};

type NavigationState = {
  conversationId?: string;
  agreementId?: string;
  proposalId?: string;
  collaborationId?: string;
  openAgreement?: boolean;
} | null;

const TypedPartnershipAgreementView =
  PartnershipAgreementView as React.ComponentType<PartnershipAgreementViewProps>;

function normalizeId(value: IdLike): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value._id) return String(value._id);
  return "";
}

function getAgreementIdFromMessage(message: ProposalMessage): string {
  return (
    normalizeId(message.agreementId) ||
    normalizeId(message.partnershipAgreementId) ||
    normalizeId(message.agreement)
  );
}

function getApiErrorMessage(error: any, fallback: string) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function normalizeProposalResponse(data: any): ProposalMessage | null {
  return (
    data?.proposal ||
    data?.updatedProposal ||
    data?.data?.proposal ||
    data?.data?.updatedProposal ||
    null
  );
}

function translateStatus(status: string | undefined, t: (key: string) => string) {
  const normalized = (status || "pending").toLowerCase();

  if (normalized === "accepted") return t("collab.messages.status.accepted");
  if (normalized === "rejected") return t("collab.messages.status.rejected");
  if (normalized === "pending") return t("collab.messages.status.pending");
  if (normalized === "cancelled" || normalized === "canceled") {
    return t("collab.messages.status.cancelled");
  }

  return status || t("collab.messages.status.pending");
}

function formatMoney(
  value: string | number | undefined,
  locale: string,
  emDash: string
) {
  if (value === undefined || value === null || value === "") return emDash;

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return `₪${value}`;
  }

  return `₪${numericValue.toLocaleString(locale)}`;
}

function readConversationIdFromLocation(location: ReturnType<typeof useLocation>) {
  const params = new URLSearchParams(location.search);
  const navigationState = location.state as NavigationState;

  return (
    navigationState?.conversationId ||
    params.get("conversationId") ||
    ""
  );
}

function readFilterFromLocation(location: ReturnType<typeof useLocation>): MessageFilter {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");

  if (tab === "chat") return "chat";
  if (tab && ["sent", "received", "accepted"].includes(tab)) {
    return tab as MessageFilter;
  }

  return "sent";
}

export default function CollabMessagesTab({
  refreshFlag,
  onStatusChange,
}: CollabMessagesTabProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const { socket, userBusinessId } = useCollabOutletContext();
  const [messages, setMessages] = useState<MessagesState>({
    sent: [],
    received: [],
  });

  const location = useLocation();

  const navigationState = location.state as NavigationState;
  const conversationIdFromNav = navigationState?.conversationId || null;

  const [filter, setFilter] = useState<MessageFilter>(() =>
    readFilterFromLocation(location)
  );
  const [selectedAgreementId, setSelectedAgreementId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    () => {
      const conversationId = readConversationIdFromLocation(location);
      return conversationId || null;
    }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);

    try {
      const [sentRes, receivedRes] = await Promise.all([
        API.get("/business/my/proposals/sent"),
        API.get("/business/my/proposals/received"),
      ]);

      setMessages({
        sent: sentRes.data.proposalsSent || [],
        received: receivedRes.data.proposalsReceived || [],
      });

      setError(null);
    } catch (fetchError) {
      console.error("❌ Error loading proposals:", fetchError);
      setError(t("collab.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const tab = params.get("tab");
    const conversationIdFromUrl = params.get("conversationId") || "";

    const agreementIdFromUrl =
      params.get("agreementId") ||
      params.get("proposalId") ||
      params.get("collaborationId") ||
      "";

    const agreementIdFromState =
      navigationState?.agreementId ||
      navigationState?.proposalId ||
      navigationState?.collaborationId ||
      "";

    const agreementIdToOpen = agreementIdFromUrl || agreementIdFromState;

    if (tab === "chat" && (conversationIdFromNav || conversationIdFromUrl)) {
      setFilter("chat");
      setActiveConversationId(conversationIdFromNav || conversationIdFromUrl);
      return;
    }

    if (tab && ["sent", "received", "accepted"].includes(tab)) {
      setFilter(tab as MessageFilter);
    }

    if (agreementIdToOpen) {
      setSelectedAgreementId(agreementIdToOpen);
      setModalOpen(true);

      if (!tab || tab === "agreements") {
        setFilter("received");
      }
    }
  }, [location.search, location.state, conversationIdFromNav, navigationState]);

  useEffect(() => {
    const openChatFromDetail = (conversationId?: string) => {
      if (!conversationId) return;

      setFilter("chat");
      setActiveConversationId(conversationId);
    };

    try {
      const raw = sessionStorage.getItem("bizuply_open_b2b_chat");

      if (raw) {
        const parsed = JSON.parse(raw) as { conversationId?: string };
        openChatFromDetail(parsed.conversationId);
        sessionStorage.removeItem("bizuply_open_b2b_chat");
      }
    } catch {
      sessionStorage.removeItem("bizuply_open_b2b_chat");
    }

    const handleOpenB2bChat = (event: Event) => {
      const detail = (event as CustomEvent<{ conversationId?: string }>).detail;
      openChatFromDetail(detail?.conversationId);
    };

    window.addEventListener("bizuply:open-b2b-chat", handleOpenB2bChat);

    return () => {
      window.removeEventListener("bizuply:open-b2b-chat", handleOpenB2bChat);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    let timeoutId: number | null = null;

    const fetchWithDebounce = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(fetchMessages, 400);
    };

    socket.on("newNotification", fetchWithDebounce);
    socket.on("newProposalCreated", fetchWithDebounce);

    return () => {
      socket.off("newNotification", fetchWithDebounce);
      socket.off("newProposalCreated", fetchWithDebounce);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const replaceProposalInState = (
    proposalId: string,
    updated: ProposalMessage
  ) => {
    setMessages((prev) => ({
      sent: prev.sent.map((proposal) =>
        proposal._id === proposalId ? { ...proposal, ...updated } : proposal
      ),
      received: prev.received.map((proposal) =>
        proposal._id === proposalId ? { ...proposal, ...updated } : proposal
      ),
    }));
  };

  const updateMessageStatus = (proposalId: string, status: string) => {
    setMessages((prev) => ({
      sent: prev.sent.map((proposal) =>
        proposal._id === proposalId ? { ...proposal, status } : proposal
      ),
      received: prev.received.map((proposal) =>
        proposal._id === proposalId ? { ...proposal, status } : proposal
      ),
    }));
  };

  const handleCancelProposal = async (proposalId: string) => {
    if (!window.confirm(t("collab.messages.alerts.cancelConfirm"))) {
      return;
    }

    try {
      await API.delete(`/business/my/proposals/${proposalId}`);

      setMessages((prev) => ({
        sent: prev.sent.filter((proposal) => proposal._id !== proposalId),
        received: prev.received.filter(
          (proposal) => proposal._id !== proposalId
        ),
      }));

      onStatusChange?.();
    } catch (cancelError: any) {
      console.error("❌ Error cancelling proposal:", cancelError);
      alert(getApiErrorMessage(cancelError, t("collab.messages.alerts.cancelError")));
    }
  };

  const handleAccept = async (proposalId: string) => {
    try {
      const res = await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "accepted",
      });

      const updatedProposal = normalizeProposalResponse(res.data);

      if (updatedProposal) {
        replaceProposalInState(proposalId, {
          ...updatedProposal,
          status: updatedProposal.status || "accepted",
        });
      } else {
        updateMessageStatus(proposalId, "accepted");
        await fetchMessages();
      }

      onStatusChange?.();
    } catch (acceptError: any) {
      console.error("❌ Error accepting proposal:", acceptError);
      alert(getApiErrorMessage(acceptError, t("collab.messages.alerts.acceptError")));
    }
  };

  const handleReject = async (proposalId: string) => {
    try {
      const res = await API.put(`/business/my/proposals/${proposalId}/status`, {
        status: "rejected",
      });

      const updatedProposal = normalizeProposalResponse(res.data);

      if (updatedProposal) {
        replaceProposalInState(proposalId, {
          ...updatedProposal,
          status: updatedProposal.status || "rejected",
        });
      } else {
        updateMessageStatus(proposalId, "rejected");
      }

      onStatusChange?.();
    } catch (rejectError: any) {
      console.error("❌ Error rejecting proposal:", rejectError);
      alert(getApiErrorMessage(rejectError, t("collab.messages.alerts.rejectError")));
    }
  };

  const handleEnsureAgreement = async (message: ProposalMessage) => {
    try {
      const res = await API.post(
        `/business/my/proposals/${message._id}/ensure-agreement`
      );

      const agreementId = res.data?.agreementId;

      if (agreementId) {
        replaceProposalInState(message._id, {
          ...message,
          agreementId,
          status: "accepted",
        });
        setSelectedAgreementId(String(agreementId));
        setModalOpen(true);
      } else {
        await fetchMessages();
      }

      onStatusChange?.();
    } catch (ensureError: any) {
      console.error("❌ Error creating agreement:", ensureError);
      alert(getApiErrorMessage(ensureError, t("collab.messages.alerts.ensureError")));
    }
  };

  const openAgreement = (message: ProposalMessage) => {
    const agreementId = getAgreementIdFromMessage(message);

    console.log("📄 Opening agreement from message:", {
      message,
      agreementId,
    });

    if (!agreementId) {
      alert(t("collab.messages.alerts.missingAgreementId"));
      return;
    }

    setSelectedAgreementId(agreementId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAgreementId("");
  };

  const messagesToShow = useMemo(() => {
    if (filter === "sent") return messages.sent;
    if (filter === "received") return messages.received;

    if (filter === "accepted") {
      return [...messages.sent, ...messages.received].filter(
        (message) => message.status === "accepted"
      );
    }

    return [];
  }, [filter, messages]);

  const pendingReceived = useMemo(() => {
    return messages.received.filter((message) => message.status === "pending")
      .length;
  }, [messages.received]);

  const acceptedCount = useMemo(() => {
    return [...messages.sent, ...messages.received].filter(
      (message) => message.status === "accepted"
    ).length;
  }, [messages]);

  if (filter === "chat") {
    return (
      <div
        dir={dir}
        className="space-y-4 rounded-[2rem] border border-slate-100 bg-white p-4 text-start shadow-[0_18px_60px_rgba(15,23,42,0.06)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800">{t("collab.messages.businessChat")}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("collab.messages.businessChatHint")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFilter("received")}
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            {t("collab.messages.backToProposals")}
          </button>
        </div>

        <CollabChat
          myBusinessId={userBusinessId || ""}
          myBusinessName=""
          initialConversationId={activeConversationId || undefined}
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState text={error} />;
  }

  return (
    <div dir={dir} className="space-y-6 text-start">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Inbox className="h-4 w-4" />
              {t("collab.messages.badge")}
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t("collab.messages.title")}
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              {t("collab.messages.subtitle")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              {t("collab.messages.shownLabel")}
            </p>

            <p className="mt-2 text-3xl font-black text-violet-700">
              {messagesToShow.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("collab.messages.stats.sent")}
          value={messages.sent.length}
          helper={t("collab.messages.stats.sentHelper")}
          icon={Send}
          tone="sky"
        />

        <StatCard
          label={t("collab.messages.stats.received")}
          value={messages.received.length}
          helper={t("collab.messages.stats.receivedHelper")}
          icon={Inbox}
          tone="violet"
        />

        <StatCard
          label={t("collab.messages.stats.pending")}
          value={pendingReceived}
          helper={t("collab.messages.stats.pendingHelper")}
          icon={Phone}
          tone="amber"
        />

        <StatCard
          label={t("collab.messages.stats.accepted")}
          value={acceptedCount}
          helper={t("collab.messages.stats.acceptedHelper")}
          icon={CheckCircle2}
          tone="emerald"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 bg-gradient-to-l from-white to-sky-50/60 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-800">
                {t("collab.messages.inboxTitle")}
              </h3>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {t("collab.messages.shownCount", { count: messagesToShow.length })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "sent"}
                onClick={() => setFilter("sent")}
                label={t("collab.messages.filters.sent")}
                count={messages.sent.length}
              />

              <FilterButton
                active={filter === "received"}
                onClick={() => setFilter("received")}
                label={t("collab.messages.filters.received")}
                count={messages.received.length}
              />

              <FilterButton
                active={filter === "accepted"}
                onClick={() => setFilter("accepted")}
                label={t("collab.messages.filters.accepted")}
                count={acceptedCount}
              />

              <FilterButton
                active={filter === "chat"}
                onClick={() => {
                  setFilter("chat");
                  setActiveConversationId(null);
                }}
                label={t("collab.messages.filters.chat")}
              />
            </div>
          </div>
        </div>

        {messagesToShow.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 p-5 xl:grid-cols-2">
            {messagesToShow.map((message) => (
              <ProposalMessageCard
                key={message._id}
                message={message}
                filter={filter}
                onCancel={() => handleCancelProposal(message._id)}
                onAccept={() => handleAccept(message._id)}
                onReject={() => handleReject(message._id)}
                onOpenAgreement={() => openAgreement(message)}
                onEnsureAgreement={() => handleEnsureAgreement(message)}
              />
            ))}
          </div>
        )}
      </section>

      {modalOpen && selectedAgreementId && (
        <AppModal onClose={closeModal}>
          <div className="mx-auto max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
            <TypedPartnershipAgreementView
              agreementId={selectedAgreementId}
              currentBusinessId={userBusinessId || ""}
              onClose={closeModal}
            />
          </div>
        </AppModal>
      )}
    </div>
  );
}

function ProposalMessageCard({
  message,
  filter,
  onCancel,
  onAccept,
  onReject,
  onOpenAgreement,
  onEnsureAgreement,
}: {
  message: ProposalMessage;
  filter: MessageFilter;
  onCancel: () => void;
  onAccept: () => void;
  onReject: () => void;
  onOpenAgreement: () => void;
  onEnsureAgreement: () => void;
}) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language?.startsWith("he") ? "he-IL" : "en-US";
  const emDash = t("collab.emDash");
  const agreementId = getAgreementIdFromMessage(message);
  const hasAgreement = Boolean(agreementId);

  const paymentValue = message.payment?.trim()
    ? message.payment
    : message.amount
      ? formatMoney(message.amount, dateLocale, emDash)
      : emDash;

  return (
    <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-100 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <FileSignature className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-800">
              {message.fromBusinessName || t("collab.messages.proposalFallback")}
            </h4>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {t("collab.messages.to", { name: message.toBusinessName || emDash })}
            </p>
          </div>
        </div>

        <StatusBadge status={message.status || "pending"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile label={t("collab.messages.contact")} value={message.contactName || emDash} />
        <InfoTile label={t("collab.messages.phone")} value={message.phone || emDash} />
        <InfoTile label={t("collab.messages.giving")} value={message.giving?.join(", ") || emDash} />
        <InfoTile
          label={t("collab.messages.receiving")}
          value={message.receiving?.join(", ") || emDash}
        />
        <InfoTile label={t("collab.messages.payment")} value={paymentValue} />
      </div>

      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">
        {message.description || t("collab.messages.noDescription")}
      </p>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {message.status === "accepted" && hasAgreement && (
          <button
            type="button"
            onClick={onOpenAgreement}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black text-slate-800 shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
          >
            <FileSignature className="h-4 w-4" />
            {t("collab.messages.viewAgreement")}
          </button>
        )}

        {message.status === "accepted" && !hasAgreement && (
          <button
            type="button"
            onClick={onEnsureAgreement}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-amber-50 px-4 text-sm font-black text-amber-800 transition hover:bg-amber-100"
          >
            <FileSignature className="h-4 w-4" />
            {t("collab.messages.createAgreement")}
          </button>
        )}

        {filter === "sent" && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            {t("collab.messages.cancel")}
          </button>
        )}

        {filter === "received" && message.status === "pending" && (
          <>
            <button
              type="button"
              onClick={onReject}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
            >
              <XCircle className="h-4 w-4" />
              {t("collab.messages.reject")}
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black text-slate-800 shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t("collab.messages.accept")}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function FilterButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition",
        active
          ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800 shadow-[0_14px_30px_rgba(124,58,237,0.18)]"
          : "border border-slate-100 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}

      {typeof count === "number" ? (
        <span
          className={[
            "rounded-full px-2 py-0.5 text-xs",
            active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  helper,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
  tone: "sky" | "violet" | "amber" | "emerald";
}) {
  const { t } = useTranslation();
  const toneClass = {
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  }[tone];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>

          <p className="mt-2 text-2xl font-black tracking-tight text-slate-800">
            {value}
          </p>

          <p className="mt-2 text-xs font-black text-emerald-600">{t("collab.active")}</p>

          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const normalized = status.toLowerCase();

  const statusClass =
    normalized === "accepted"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : normalized === "rejected"
        ? "bg-rose-50 text-rose-700 ring-rose-100"
        : "bg-amber-50 text-amber-700 ring-amber-100";

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 ${statusClass}`}
    >
      {translateStatus(status, t)}
    </span>
  );
}

function LoadingState() {
  const { t } = useTranslation();
  return <BizuplyLoadingState label={t("collab.messages.loading")} />;
}

function ErrorState({ text }: { text: string }) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  return (
    <div
      dir={dir}
      className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center"
    >
      <p className="text-lg font-black text-rose-700">{text}</p>

      <p className="mt-2 text-sm font-semibold text-rose-500">
        {t("collab.messages.refreshHint")}
      </p>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
        <Inbox className="h-7 w-7" />
      </div>

      <h4 className="mt-4 text-xl font-black text-slate-800">
        {t("collab.messages.emptyTitle")}
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        {t("collab.messages.emptyHint")}
      </p>
    </div>
  );
}

function AppModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-violet-900/10 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="flex min-h-full w-full items-center justify-center py-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}