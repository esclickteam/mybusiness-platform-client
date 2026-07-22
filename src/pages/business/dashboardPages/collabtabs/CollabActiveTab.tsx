import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  Inbox,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  TrendingUp,
  UserRoundCheck,
  UsersRound,
  Wand2,
  XCircle,
} from "lucide-react";

import API from "@api";
import { BizuplyLoadingState } from "../../../../components/ui/BizuplyLoader";

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

  const allProposalsCount =
    activeProposals.length + sentProposals.length + receivedProposals.length;

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
    if (!id) return;

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
    if (!id) return;

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
    if (!id) return;

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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1fr_360px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Build. Partner. Grow.
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Collaboration Center
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              Manage partner proposals, referral opportunities and business
              collaborations from one clean workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-[0_14px_30px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5"
              >
                <Search className="h-4 w-4" />
                Find Partners
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
                Create Proposal
              </button>
            </div>
          </div>

          <div className="hidden xl:block">
            <div className="relative mx-auto h-52 max-w-sm rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="absolute -left-5 top-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-700 shadow-lg shadow-sky-100">
                <UsersRound className="h-7 w-7" />
              </div>

              <div className="absolute right-8 top-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <Handshake className="h-6 w-6" />
              </div>

              <div className="ml-10 mt-16 rounded-3xl bg-white p-4 shadow-sm">
                <div className="h-3 w-28 rounded-full bg-sky-200" />
                <div className="mt-3 h-2 w-44 rounded-full bg-slate-100" />
                <div className="mt-2 h-2 w-36 rounded-full bg-slate-100" />
              </div>

              <div className="absolute bottom-6 right-6 rounded-2xl bg-white px-4 py-3 shadow-md">
                <p className="text-xs font-black text-slate-400">
                  Partner match
                </p>
                <p className="mt-1 text-lg font-black text-emerald-600">92%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Collaborations"
          value={activeProposals.length}
          helper="live collaborations"
          icon={Handshake}
          tone="sky"
        />
        <StatCard
          label="Sent Proposals"
          value={sentProposals.length}
          helper="waiting for response"
          icon={Send}
          tone="violet"
        />
        <StatCard
          label="Pending Received"
          value={pendingReceived}
          helper="needs your action"
          icon={Inbox}
          tone="amber"
        />
        <StatCard
          label="Accepted"
          value={acceptedCount}
          helper="approved proposals"
          icon={CheckCircle2}
          tone="emerald"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-sky-50/60 p-5 sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700">
                  <TrendingUp className="h-4 w-4" />
                  Proposal pipeline
                </div>

                <h3 className="mt-3 text-2xl font-black text-slate-950">
                  Collaboration Proposals
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {proposalsToShow.length} proposals shown ·{" "}
                  {formatMoney(totalAmount)} total value
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <TabButton
                  active={view === "active"}
                  onClick={() => setView("active")}
                  icon={Handshake}
                  label="Active"
                  count={activeProposals.length}
                />
                <TabButton
                  active={view === "sent"}
                  onClick={() => setView("sent")}
                  icon={Send}
                  label="Sent"
                  count={sentProposals.length}
                />
                <TabButton
                  active={view === "received"}
                  onClick={() => setView("received")}
                  icon={Inbox}
                  label="Received"
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
            <EmptyState view={view} />
          ) : (
            <div className="grid gap-4 p-5 sm:p-6 2xl:grid-cols-2">
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

        <aside className="space-y-5">
          <HumanUpsellCard />

          <QuickActionsCard />

          <ReadinessCard
            allProposalsCount={allProposalsCount}
            activeCount={activeProposals.length}
            sentCount={sentProposals.length}
            receivedCount={receivedProposals.length}
          />
        </aside>
      </div>
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
    <article className="group rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-100 hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-black text-slate-950">
              {proposal.title || "Untitled proposal"}
            </h4>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <Clock3 className="h-4 w-4" />
              Created {formatDate(proposal.createdAt)}
            </p>
          </div>
        </div>

        <StatusBadge status={proposal.status || "pending"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoTile
          label="From"
          value={getBusinessName(
            proposal.fromBusinessName,
            proposal.fromBusinessId
          )}
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

      <p className="mt-4 rounded-2xl bg-slate-50/80 p-4 text-sm font-semibold leading-6 text-slate-600">
        {proposal.description || "No description provided."}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-black text-sky-700 transition hover:text-violet-700"
        >
          View details
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="flex flex-wrap justify-end gap-2">
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-100 transition hover:-translate-y-0.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Accept
              </button>
            </>
          )}
        </div>
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
          ? "bg-gradient-to-r from-violet-700 to-fuchsia-600 text-white shadow-lg shadow-violet-100"
          : "border border-slate-100 bg-white text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
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
      : normalized === "cancelled" || normalized === "canceled"
      ? "bg-slate-100 text-slate-600 ring-slate-200"
      : "bg-amber-50 text-amber-700 ring-amber-100";

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-black capitalize ring-1 ${statusClass}`}
    >
      {status}
    </span>
  );
}

function HumanUpsellCard() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-sky-500 p-5 text-white shadow-[0_20px_70px_rgba(124,58,237,0.22)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/18 text-white backdrop-blur">
          <UserRoundCheck className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-xl font-black">
          Human Collaboration Manager
        </h3>

        <p className="mt-2 text-sm font-semibold leading-6 text-white/85">
          Let a Bizuply representative find partners, contact them, follow up
          and manage the collaboration process for this business.
        </p>

        <div className="mt-4 space-y-2 text-sm font-bold text-white/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Partner research and outreach
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Follow-up messages and reminders
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Monthly collaboration report
          </div>
        </div>

        <button
          type="button"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-black text-violet-700 shadow-lg shadow-violet-700/10 transition hover:-translate-y-0.5"
        >
          Activate Human Service
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function QuickActionsCard() {
  const actions = [
    {
      label: "Find Partners",
      helper: "Discover matching businesses",
      icon: Search,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Create Proposal",
      helper: "Start a new collaboration",
      icon: Plus,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Business Messages",
      helper: "Manage partner conversations",
      icon: MessageCircle,
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <h3 className="text-lg font-black text-slate-950">Quick Actions</h3>

      <div className="mt-4 space-y-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${action.tone}`}
              >
                <action.icon className="h-5 w-5" />
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-slate-950">
                  {action.label}
                </span>
                <span className="block truncate text-xs font-semibold text-slate-500">
                  {action.helper}
                </span>
              </span>
            </span>

            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-violet-600" />
          </button>
        ))}
      </div>
    </section>
  );
}

function ReadinessCard({
  allProposalsCount,
  activeCount,
  sentCount,
  receivedCount,
}: {
  allProposalsCount: number;
  activeCount: number;
  sentCount: number;
  receivedCount: number;
}) {
  const checks = [
    {
      label: "Profile is ready",
      completed: true,
    },
    {
      label: "Created or received proposals",
      completed: allProposalsCount > 0,
    },
    {
      label: "Active collaboration exists",
      completed: activeCount > 0,
    },
    {
      label: "Sent partner proposal",
      completed: sentCount > 0,
    },
    {
      label: "Received partner proposal",
      completed: receivedCount > 0,
    },
  ];

  const completed = checks.filter((check) => check.completed).length;
  const percent = Math.round((completed / checks.length) * 100);

  return (
    <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">
            Collaboration Readiness
          </h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Complete the flow to generate more partner leads.
          </p>
        </div>

        <p className="text-lg font-black text-violet-700">{percent}%</p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between gap-3 text-sm font-bold"
          >
            <span className="text-slate-600">{check.label}</span>
            {check.completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <span className="h-5 w-5 rounded-full border-2 border-slate-200" />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-100"
      >
        <Wand2 className="h-4 w-4" />
        Improve Collaboration Profile
      </button>
    </section>
  );
}

function LoadingState() {
  return <BizuplyLoadingState label="Loading proposals..." />;
}

function ErrorState({ text }: { text: string }) {
  return (
    <div className="m-5 rounded-[2rem] border border-rose-100 bg-rose-50 p-10 text-center">
      <XCircle className="mx-auto h-10 w-10 text-rose-600" />
      <p className="mt-4 text-lg font-black text-rose-700">{text}</p>
      <p className="mt-2 text-sm font-semibold text-rose-500">
        Please refresh and try again.
      </p>
    </div>
  );
}

function EmptyState({ view }: { view: ProposalView }) {
  const text =
    view === "active"
      ? "Active collaborations will appear here once a proposal is accepted."
      : view === "sent"
      ? "Sent proposals will appear here after you contact a potential partner."
      : "Received proposals will appear here when businesses contact you.";

  return (
    <div className="m-5 rounded-[2rem] border border-dashed border-sky-200 bg-gradient-to-br from-sky-50/70 to-violet-50/70 px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
        <Handshake className="h-7 w-7" />
      </div>

      <h4 className="mt-4 text-xl font-black text-slate-950">
        No proposals to display
      </h4>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
        {text}
      </p>

      <button
        type="button"
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-5 text-sm font-black text-white shadow-lg shadow-violet-100 transition hover:-translate-y-0.5"
      >
        <Plus className="h-4 w-4" />
        Create First Proposal
      </button>
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

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "-";

  return `$${numericValue.toLocaleString()}`;
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