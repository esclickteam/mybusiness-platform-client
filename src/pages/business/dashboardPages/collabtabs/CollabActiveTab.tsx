import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Handshake,
  Inbox,
  Loader2,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";

import API from "@api";

type ProposalView = "active" | "sent" | "received";

type BusinessRef = {
  businessName?: string;
};

type ProposalItem = {
  _id?: string;
  proposalId?: string;
  fromBusinessName?: string;
  toBusinessName?: string;
  fromBusinessId?: BusinessRef | string;
  toBusinessId?: BusinessRef | string;
  title?: string;
  description?: string;
  amount?: number | string | null;
  validUntil?: string | null;
  status?: string;
  createdAt?: string;
};

type CollabActiveTabProps = {
  userBusinessId?: string | null;
};

export default function CollabActiveTab({
  userBusinessId,
}: CollabActiveTabProps) {
  const [view, setView] = useState<ProposalView>("active");
  const [activeProposals, setActiveProposals] = useState<ProposalItem[]>([]);
  const [sentProposals, setSentProposals] = useState<ProposalItem[]>([]);
  const [receivedProposals, setReceivedProposals] = useState<ProposalItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userBusinessId) return;

    async function fetchProposals() {
      setLoading(true);
      setError(null);

      try {
        const [activeRes, sentRes, receivedRes] = await Promise.all([
          API.get("/business/my/proposals/active"),
          API.get("/business/my/proposals/sent"),
          API.get("/business/my/proposals/received"),
        ]);

        setActiveProposals(activeRes.data.activeProposals || []);
        setSentProposals(sentRes.data.proposalsSent || []);
        setReceivedProposals(receivedRes.data.proposalsReceived || []);
      } catch (fetchError) {
        console.error("Error loading proposals:", fetchError);
        setError("Error loading proposals");
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [userBusinessId]);

  const proposalsToShow = useMemo(() => {
    if (view === "active") return activeProposals;
    if (view === "sent") return sentProposals;
    return receivedProposals;
  }, [view, activeProposals, sentProposals, receivedProposals]);

  const pendingReceived = useMemo(() => {
    return receivedProposals.filter((proposal) => proposal.status === "pending")
      .length;
  }, [receivedProposals]);

  const acceptedCount = useMemo(() => {
    return [...activeProposals, ...sentProposals, ...receivedProposals].filter(
      (proposal) => proposal.status === "accepted"
    ).length;
  }, [activeProposals, sentProposals, receivedProposals]);

  const totalAmount = useMemo(() => {
    return proposalsToShow.reduce((sum, proposal) => {
      return sum + (Number(proposal.amount) || 0);
    }, 0);
  }, [proposalsToShow]);

  const getId = (proposal: ProposalItem) => {
    return proposal.proposalId || proposal._id || "";
  };

  const updateStatus = (id: string, status: string) => {
    const updater = (list: ProposalItem[]) =>
      list.map((proposal) =>
        getId(proposal) === id ? { ...proposal, status } : proposal
      );

    setActiveProposals(updater);
    setSentProposals(updater);
    setReceivedProposals(updater);
  };

  const removeProposal = (id: string) => {
    const filter = (list: ProposalItem[]) =>
      list.filter((proposal) => getId(proposal) !== id);

    setActiveProposals(filter);
    setSentProposals(filter);
    setReceivedProposals(filter);
  };

  const handleAccept = async (id: string) => {
    try {
      await API.put(`/business/my/proposals/${id}/status`, {
        status: "accepted",
      });

      updateStatus(id, "accepted");
    } catch (acceptError) {
      console.error("Error approving proposal:", acceptError);
      alert("Error approving proposal");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await API.put(`/business/my/proposals/${id}/status`, {
        status: "rejected",
      });

      updateStatus(id, "rejected");
    } catch (rejectError) {
      console.error("Error rejecting proposal:", rejectError);
      alert("Error rejecting proposal");
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this proposal?")) {
      return;
    }

    try {
      await API.delete(`/business/my/proposals/${id}`);
      removeProposal(id);
    } catch (cancelError) {
      console.error("Error cancelling proposal:", cancelError);
      alert("Error cancelling proposal");
    }
  };

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-800/10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-28 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-100">
              <Handshake className="h-4 w-4" />
              Active Collaborations
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Manage collaboration proposals
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100/90">
              Track active collaborations, sent proposals and received offers in
              one professional workspace.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-100">
              Current view
            </p>
            <p className="mt-2 text-3xl font-black capitalize text-white">
              {view}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active"
          value={activeProposals.length}
          helper="live collaborations"
          icon={Handshake}
        />
        <StatCard
          label="Sent"
          value={sentProposals.length}
          helper="waiting for response"
          icon={Send}
        />
        <StatCard
          label="Pending received"
          value={pendingReceived}
          helper="needs action"
          icon={Inbox}
        />
        <StatCard
          label="Accepted"
          value={acceptedCount}
          helper="approved proposals"
          icon={CheckCircle2}
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                Collaboration Center
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {proposalsToShow.length} proposals shown · $
                {totalAmount.toLocaleString()} total amount
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <TabButton
                active={view === "active"}
                onClick={() => setView("active")}
                icon={Handshake}
                label="Active Collaborations"
                count={activeProposals.length}
              />
              <TabButton
                active={view === "sent"}
                onClick={() => setView("sent")}
                icon={Send}
                label="Sent Proposals"
                count={sentProposals.length}
              />
              <TabButton
                active={view === "received"}
                onClick={() => setView("received")}
                icon={Inbox}
                label="Received Proposals"
                count={receivedProposals.length}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState text={error} />
        ) : proposalsToShow.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 p-5 xl:grid-cols-2">
            {proposalsToShow.map((proposal) => (
              <ProposalCard
                key={getId(proposal)}
                proposal={proposal}
                view={view}
                onAccept={() => handleAccept(getId(proposal))}
                onReject={() => handleReject(getId(proposal))}
                onCancel={() => handleCancel(getId(proposal))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProposalCard({
  proposal,
  view,
  onAccept,
  onReject,
  onCancel,
}: {
  proposal: ProposalItem;
  view: ProposalView;
  onAccept: () => void;
  onReject: () => void;
  onCancel: () => void;
}) {
  return (
    <article className="group rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {proposal.title || "Untitled proposal"}
            </h4>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Created {formatDate(proposal.createdAt)}
            </p>
          </div>
        </div>

        <StatusBadge status={proposal.status || "pending"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile
          label="From"
          value={getBusinessName(proposal.fromBusinessName, proposal.fromBusinessId)}
        />
        <InfoTile
          label="To"
          value={
            getBusinessName(proposal.toBusinessName, proposal.toBusinessId) ||
            "Public Market"
          }
        />
        <InfoTile label="Amount" value={formatMoney(proposal.amount)} />
        <InfoTile label="Valid Until" value={formatDate(proposal.validUntil)} />
      </div>

      <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">
        {proposal.description || "No description provided."}
      </p>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {view === "sent" && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Cancel
          </button>
        )}

        {view === "received" && proposal.status === "pending" && (
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
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

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
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
          ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      {label}
      <span
        className={[
          "rounded-full px-2 py-0.5 text-xs",
          active ? "bg-white/15 text-white" : "bg-white text-slate-500",
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
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ElementType;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
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
  const statusClass =
    status === "accepted"
      ? "bg-emerald-50 text-emerald-700"
      : status === "rejected"
      ? "bg-rose-50 text-rose-700"
      : "bg-amber-50 text-amber-700";

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ${statusClass}`}
    >
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="p-10 text-center">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-sky-900" />
      <p className="mt-4 text-sm font-black text-slate-500">
        Loading proposals...
      </p>
    </div>
  );
}

function ErrorState({ text }: { text: string }) {
  return (
    <div className="m-5 rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center">
      <p className="text-lg font-black text-rose-700">{text}</p>
      <p className="mt-2 text-sm font-semibold text-rose-500">
        Please refresh and try again.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-14 text-center">
      <Handshake className="mx-auto h-10 w-10 text-slate-400" />
      <h4 className="mt-4 text-xl font-black text-slate-950">
        No proposals to display
      </h4>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        New collaboration proposals will appear here.
      </p>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB");
}

function formatMoney(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "-";
  return `$${Number(value).toLocaleString()}`;
}

function getBusinessName(
  explicitName?: string,
  businessRef?: BusinessRef | string
) {
  if (explicitName) return explicitName;

  if (typeof businessRef === "object" && businessRef?.businessName) {
    return businessRef.businessName;
  }

  return "-";
}