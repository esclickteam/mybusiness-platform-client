import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  Loader2,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import API from "../../../../api";

type BusinessRef = {
  _id?: string;
  businessName?: string;
};

type PendingCollab = {
  _id: string;
  fromBusinessId?: BusinessRef;
  toBusinessId?: BusinessRef;
  subject?: string;
  description?: string;
  expiresAt?: string | null;
  status?: string;
  createdAt?: string;
};

type CollabPendingTabProps = {
  token?: string | null;
};

export default function CollabPendingTab({ token }: CollabPendingTabProps) {
  const [pendingCollabs, setPendingCollabs] = useState<PendingCollab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingCollabs = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get("/collab-contracts/collaborations/pending", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      setPendingCollabs(res.data.pendingCollaborations || []);
    } catch (err) {
      console.error("Error loading pending collaborations:", err);
      setError("An error occurred while loading the data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCollabs();
  }, [token]);

  const expiredCount = useMemo(() => {
    return pendingCollabs.filter((collab) => {
      if (!collab.expiresAt) return false;
      return new Date(collab.expiresAt).getTime() < Date.now();
    }).length;
  }, [pendingCollabs]);

  const activePendingCount = useMemo(() => {
    return pendingCollabs.length - expiredCount;
  }, [pendingCollabs.length, expiredCount]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState text={error} onRetry={fetchPendingCollabs} />;
  }

  return (
    <section className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Clock3 className="h-4 w-4" />
              Pending Collaborations
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Collaborations waiting for approval
            </h2>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              Review collaboration contracts that are still pending, check the
              partner details and track expiration dates.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPendingCollabs}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-white px-5 text-sm font-black text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pending"
          value={pendingCollabs.length}
          helper="waiting collaborations"
          icon={Handshake}
          tone="violet"
        />
        <StatCard
          label="Active Pending"
          value={activePendingCount}
          helper="still available"
          icon={ShieldCheck}
          tone="emerald"
        />
        <StatCard
          label="Expired"
          value={expiredCount}
          helper="past expiration date"
          icon={CalendarClock}
          tone="amber"
        />
        <StatCard
          label="Status"
          value="Pending"
          helper="current workflow"
          icon={Clock3}
          tone="sky"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-white to-sky-50/60 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-950">
                Pending Requests
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {pendingCollabs.length} collaborations shown
              </p>
            </div>
          </div>
        </div>

        {pendingCollabs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 p-5 xl:grid-cols-2">
            {pendingCollabs.map((collab) => (
              <PendingCollabCard key={collab._id} collab={collab} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function PendingCollabCard({ collab }: { collab: PendingCollab }) {
  const isExpired = collab.expiresAt
    ? new Date(collab.expiresAt).getTime() < Date.now()
    : false;

  return (
    <article className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-violet-100 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {collab.subject || "Pending collaboration"}
            </h4>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Created {formatDate(collab.createdAt)}
            </p>
          </div>
        </div>

        <StatusBadge status={collab.status || "Pending"} expired={isExpired} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile
          icon={Building2}
          label="From"
          value={collab.fromBusinessId?.businessName || "—"}
        />
        <InfoTile
          icon={Building2}
          label="To"
          value={collab.toBusinessId?.businessName || "—"}
        />
        <InfoTile
          icon={CalendarClock}
          label="Expires On"
          value={formatDate(collab.expiresAt) || "Unavailable"}
        />
        <InfoTile
          icon={CheckCircle2}
          label="Status"
          value={isExpired ? "Expired" : collab.status || "Pending"}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
          Description
        </p>

        <p className="text-sm font-semibold leading-7 text-slate-600">
          {collab.description || "No description provided."}
        </p>
      </div>
    </article>
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

function StatusBadge({
  status,
  expired,
}: {
  status: string;
  expired: boolean;
}) {
  const normalized = status.toLowerCase();

  const className = expired
    ? "bg-rose-50 text-rose-700 ring-rose-100"
    : normalized === "approved" || normalized === "accepted"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : "bg-amber-50 text-amber-700 ring-amber-100";

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ring-1 ${className}`}
    >
      {expired ? "Expired" : status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-700" />
      <p className="mt-4 text-sm font-black text-slate-500">
        Loading pending collaborations...
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
        <Clock3 className="h-7 w-7" />
      </div>

      <h4 className="mt-4 text-xl font-black text-slate-950">
        No pending collaborations
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        Pending collaboration contracts will appear here once businesses send
        or receive requests that still need review.
      </p>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US");
}