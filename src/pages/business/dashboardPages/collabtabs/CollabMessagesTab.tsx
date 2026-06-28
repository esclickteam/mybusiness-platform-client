import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  FileSignature,
  Inbox,
  Loader2,
  Phone,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import API from "../../../../api";
import PartnershipAgreementView from "../../../../components/PartnershipAgreementView";
import CollabChat from "./CollabChat";

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
  socket?: any;
  refreshFlag?: number | string | boolean;
  onStatusChange?: () => void;
  userBusinessId: string;
};

type PartnershipAgreementViewProps = {
  agreementId: IdLike;
  currentBusinessId: IdLike;
  onClose?: () => void;
};

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

export default function CollabMessagesTab({
  socket,
  refreshFlag,
  onStatusChange,
  userBusinessId,
}: CollabMessagesTabProps) {
  const [messages, setMessages] = useState<MessagesState>({
    sent: [],
    received: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MessageFilter>("sent");
  const [selectedAgreementId, setSelectedAgreementId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);

  const location = useLocation();

  const conversationIdFromNav =
    (location.state as { conversationId?: string } | null)?.conversationId ||
    null;

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
      setError("Error loading proposals");
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

    if (tab === "chat" && conversationIdFromNav) {
      setFilter("chat");
      setActiveConversationId(conversationIdFromNav);
      return;
    }

    if (tab && ["sent", "received", "accepted"].includes(tab)) {
      setFilter(tab as MessageFilter);
    }
  }, [location.search, conversationIdFromNav]);

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

  const replaceProposalInState = (proposalId: string, updated: ProposalMessage) => {
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
    if (!window.confirm("Are you sure you want to cancel this proposal?")) {
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
      alert(getApiErrorMessage(cancelError, "Error cancelling proposal"));
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
      alert(getApiErrorMessage(acceptError, "Error accepting proposal"));
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
      alert(getApiErrorMessage(rejectError, "Error rejecting proposal"));
    }
  };

  const openAgreement = (message: ProposalMessage) => {
    const agreementId = getAgreementIdFromMessage(message);

    console.log("📄 Opening agreement from message:", {
      message,
      agreementId,
    });

    if (!agreementId) {
      alert("Missing agreement ID");
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

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState text={error} />;
  }

  if (filter === "chat" && activeConversationId) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <CollabChat myBusinessId={userBusinessId} myBusinessName="" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Inbox className="h-4 w-4" />
              Collaboration Proposals
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Proposal messages and agreements
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              Review sent proposals, received offers and accepted collaboration
              agreements from one clean workspace.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Proposals shown
            </p>
            <p className="mt-2 text-3xl font-black text-violet-700">
              {messagesToShow.length}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Sent"
          value={messages.sent.length}
          helper="outgoing proposals"
          icon={Send}
          tone="sky"
        />
        <StatCard
          label="Received"
          value={messages.received.length}
          helper="incoming proposals"
          icon={Inbox}
          tone="violet"
        />
        <StatCard
          label="Pending"
          value={pendingReceived}
          helper="needs response"
          icon={Phone}
          tone="amber"
        />
        <StatCard
          label="Accepted"
          value={acceptedCount}
          helper="approved deals"
          icon={CheckCircle2}
          tone="emerald"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-white to-sky-50/60 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                Proposal Inbox
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {messagesToShow.length} proposals shown
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={filter === "sent"}
                onClick={() => setFilter("sent")}
                label="Sent"
                count={messages.sent.length}
              />
              <FilterButton
                active={filter === "received"}
                onClick={() => setFilter("received")}
                label="Received"
                count={messages.received.length}
              />
              <FilterButton
                active={filter === "accepted"}
                onClick={() => setFilter("accepted")}
                label="Accepted"
                count={acceptedCount}
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
              />
            ))}
          </div>
        )}
      </section>

      {modalOpen && selectedAgreementId && (
        <AppModal onClose={closeModal}>
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] bg-white p-5 shadow-2xl">
            <TypedPartnershipAgreementView
              agreementId={selectedAgreementId}
              currentBusinessId={userBusinessId}
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
}: {
  message: ProposalMessage;
  filter: MessageFilter;
  onCancel: () => void;
  onAccept: () => void;
  onReject: () => void;
  onOpenAgreement: () => void;
}) {
  const agreementId = getAgreementIdFromMessage(message);
  const hasAgreement = Boolean(agreementId);

  return (
    <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-100 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <FileSignature className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {message.fromBusinessName || "Proposal"}
            </h4>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              To: {message.toBusinessName || "—"}
            </p>
          </div>
        </div>

        <StatusBadge status={message.status || "pending"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile label="Contact" value={message.contactName || "—"} />
        <InfoTile label="Phone" value={message.phone || "—"} />
        <InfoTile label="Giving" value={message.giving?.join(", ") || "—"} />
        <InfoTile
          label="Receiving"
          value={message.receiving?.join(", ") || "—"}
        />
        <InfoTile
          label="Payment"
          value={
            message.payment?.trim()
              ? message.payment
              : message.amount
                ? `${message.amount}$`
                : "—"
          }
        />
      </div>

      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">
        {message.description || "No description provided."}
      </p>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {message.status === "accepted" && hasAgreement && (
          <button
            type="button"
            onClick={onOpenAgreement}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
          >
            <FileSignature className="h-4 w-4" />
            View Agreement
          </button>
        )}

        {message.status === "accepted" && !hasAgreement && (
          <span className="inline-flex h-11 items-center justify-center rounded-2xl bg-amber-50 px-4 text-sm font-black text-amber-700">
            Agreement is missing
          </span>
        )}

        {filter === "sent" && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Cancel
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
              Reject
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept
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
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition",
        active
          ? "bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)]"
          : "border border-slate-100 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
      <span
        className={[
          "rounded-full px-2 py-0.5 text-xs",
          active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500",
        ].join(" ")}
      >
        {count}
      </span>
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
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>
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
      <p className="mt-1 truncate text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const statusClass =
    normalized === "accepted"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : normalized === "rejected"
        ? "bg-rose-50 text-rose-700 ring-rose-100"
        : "bg-amber-50 text-amber-700 ring-amber-100";

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ring-1 ${statusClass}`}
    >
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-700" />
      <p className="mt-4 text-sm font-black text-slate-500">
        Loading proposals...
      </p>
    </div>
  );
}

function ErrorState({ text }: { text: string }) {
  return (
    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center">
      <p className="text-lg font-black text-rose-700">{text}</p>
      <p className="mt-2 text-sm font-semibold text-rose-500">
        Please refresh and try again.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
        <Inbox className="h-7 w-7" />
      </div>

      <h4 className="mt-4 text-xl font-black text-slate-950">
        No proposals to display
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        New sent, received or accepted proposals will appear here.
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        className="w-full"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}