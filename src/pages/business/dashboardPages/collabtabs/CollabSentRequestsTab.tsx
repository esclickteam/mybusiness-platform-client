import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  FileSignature,
  Loader2,
  RefreshCw,
  Send,
  Tags,
  Trash2,
  XCircle,
} from "lucide-react";

import API from "../../../../api";

type BusinessRef = {
  _id?: string;
  businessName?: string;
};

type SentProposal = {
  _id?: string;
  proposalId?: string;
  fromBusinessName?: string;
  toBusinessName?: string;
  fromBusinessId?: BusinessRef | string;
  toBusinessId?: BusinessRef | string;
  title?: string;
  description?: string;
  giving?: string[];
  receiving?: string[];
  payment?: string;
  amount?: number | string | null;
  validUntil?: string | null;
  status?: string;
  agreementId?: string;
  createdAt?: string;
};

type CollabSentRequestsTabProps = {
  refreshFlag?: number | string | boolean;
};

export default function CollabSentRequestsTab({
  refreshFlag,
}: CollabSentRequestsTabProps) {
  const [sentRequests, setSentRequests] = useState<SentProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSentRequests = async () => {
    setLoading(true);

    try {
      const res = await API.get("/business/my/proposals/sent");
      setSentRequests(res.data.proposalsSent || []);
      setError(null);
    } catch (err) {
      console.error("Error loading sent proposals:", err);
      setError("Error loading sent proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, [refreshFlag]);

  const pendingCount = useMemo(() => {
    return sentRequests.filter((request) => request.status === "pending").length;
  }, [sentRequests]);

  const acceptedCount = useMemo(() => {
    return sentRequests.filter((request) => request.status === "accepted").length;
  }, [sentRequests]);

  const rejectedCount = useMemo(() => {
    return sentRequests.filter((request) => request.status === "rejected").length;
  }, [sentRequests]);

  const handleCancelProposal = async (proposalId: string) => {
    if (!proposalId) return;

    if (!window.confirm("Are you sure you want to cancel this proposal?")) {
      return;
    }

    try {
      await API.delete(`/business/my/proposals/${proposalId}`);

      setSentRequests((prev) =>
        prev.filter((proposal) => getProposalId(proposal) !== proposalId)
      );

      alert("Proposal successfully cancelled");
    } catch (err) {
      console.error("Error cancelling proposal:", err);
      alert("Error cancelling the proposal");
    }
  };

  const handleResendProposal = (proposal: SentProposal) => {
    alert(
      `Resend proposal to ${
        getBusinessName(proposal.toBusinessId) || "Public Market"
      } (feature coming soon)`
    );
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState text={error} onRetry={fetchSentRequests} />;
  }

  return (
    <section className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Send className="h-4 w-4" />
              Sent Proposals
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Track proposals you sent
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              Review outgoing collaboration proposals, track their status and
              cancel requests that are no longer relevant.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchSentRequests}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Sent"
          value={sentRequests.length}
          helper="outgoing proposals"
          icon={Send}
          tone="sky"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          helper="waiting for answer"
          icon={FileSignature}
          tone="amber"
        />
        <StatCard
          label="Accepted"
          value={acceptedCount}
          helper="approved proposals"
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Rejected"
          value={rejectedCount}
          helper="declined proposals"
          icon={XCircle}
          tone="rose"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-white to-sky-50/60 p-5">
          <div>
            <h3 className="text-2xl font-black text-slate-950">
              Outgoing Requests
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {sentRequests.length} sent proposals shown
            </p>
          </div>
        </div>

        {sentRequests.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 p-5 xl:grid-cols-2">
            {sentRequests.map((request) => {
              const proposalId = getProposalId(request);

              return (
                <SentRequestCard
                  key={proposalId}
                  request={request}
                  onResend={() => handleResendProposal(request)}
                  onCancel={() => handleCancelProposal(proposalId)}
                />
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

function SentRequestCard({
  request,
  onResend,
  onCancel,
}: {
  request: SentProposal;
  onResend: () => void;
  onCancel: () => void;
}) {
  const status = request.status || "pending";

  return (
    <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-100 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <FileSignature className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {cleanString(request.title) || "Sent proposal"}
            </h4>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Sent on {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile
          icon={Building2}
          label="From"
          value={
            request.fromBusinessName ||
            getBusinessName(request.fromBusinessId) ||
            "—"
          }
        />

        <InfoTile
          icon={Building2}
          label="To"
          value={
            request.toBusinessName ||
            getBusinessName(request.toBusinessId) ||
            "Public Market"
          }
        />

        <InfoTile
          icon={DollarSign}
          label="Amount"
          value={formatMoney(request.amount)}
        />

        <InfoTile
          icon={CalendarClock}
          label="Valid Until"
          value={formatDate(request.validUntil)}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          Description
        </p>

        <p className="text-sm font-semibold leading-7 text-slate-600">
          {cleanString(request.description) || "No description provided."}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ListBlock
          title="What you provide"
          items={request.giving || []}
          emptyText="No provided items"
        />

        <ListBlock
          title="What you receive"
          items={request.receiving || []}
          emptyText="No requested items"
        />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          <Tags className="h-4 w-4 text-sky-700" />
          Payment
        </p>

        <p className="text-sm font-black text-slate-950">
          {cleanString(request.payment) || "—"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onResend}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.18)] transition hover:-translate-y-0.5"
        >
          <Send className="h-4 w-4" />
          Resend
        </button>

        {status === "pending" && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-4 text-sm font-black text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>
    </article>
  );
}

function ListBlock({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText: string;
}) {
  const cleanedItems = items.map(cleanString).filter(Boolean);

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {title}
      </p>

      {cleanedItems.length ? (
        <ul className="space-y-2">
          {cleanedItems.map((item, index) => (
            <li
              key={`${title}-${item}-${index}`}
              className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm font-semibold text-slate-500">{emptyText}</p>
      )}
    </div>
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
  tone: "sky" | "violet" | "amber" | "emerald" | "rose";
}) {
  const toneClass = {
    sky: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    rose: "bg-rose-50 text-rose-700",
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
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sky-700">
        <Icon className="h-4 w-4" />

        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>
      </div>

      <p className="truncate text-sm font-black text-slate-950">{value}</p>
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
        Loading sent proposals...
      </p>
    </div>
  );
}

function ErrorState({
  text,
  onRetry,
}: {
  text: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center">
      <XCircle className="mx-auto h-10 w-10 text-rose-600" />

      <p className="mt-4 text-lg font-black text-rose-700">{text}</p>

      <p className="mt-2 text-sm font-semibold text-rose-500">
        Please refresh and try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-100 px-5 text-sm font-black text-rose-700 transition hover:bg-rose-200"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm">
        <Send className="h-7 w-7" />
      </div>

      <h4 className="mt-4 text-xl font-black text-slate-950">
        No proposals sent yet
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        Outgoing collaboration proposals will appear here once this business
        sends requests to partners.
      </p>
    </div>
  );
}

function cleanString(value?: unknown) {
  return value ? String(value).replace(/^"+|"+$/g, "").trim() : "";
}

function formatMoney(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "—";

  const num = Number(value);

  if (Number.isNaN(num)) return String(value);

  return `$${num.toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US");
}

function getBusinessName(value?: BusinessRef | string) {
  if (!value) return "";

  if (typeof value === "string") return "";

  return value.businessName || "";
}

function getProposalId(proposal: SentProposal) {
  return proposal.proposalId || proposal._id || "";
}