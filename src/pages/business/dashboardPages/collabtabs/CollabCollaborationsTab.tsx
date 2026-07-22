import React, { useMemo, useState } from "react";
import {
  Clock3,
  FileText,
  Handshake,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

import CollabActiveTab from "./CollabActiveTab";
import CollabPendingTab from "./CollabPendingTab";
import PartnershipAgreementsTab from "../PartnershipAgreementsTab";

type CollabView = "active" | "pending" | "agreements";

type CollabCollaborationsTabProps = {
  isDevUser?: boolean;
  userBusinessId?: string | null;
  token?: string | null;
};

type TabItem = {
  key: CollabView;
  label: string;
  description: string;
  icon: React.ElementType;
};

const tabs: TabItem[] = [
  {
    key: "active",
    label: "Active Collaborations",
    description: "Approved and active partner collaborations",
    icon: Handshake,
  },
  {
    key: "pending",
    label: "Pending Collaborations",
    description: "Requests and proposals waiting for approval",
    icon: Clock3,
  },
  {
    key: "agreements",
    label: "Partnership Agreements",
    description: "Upload, manage and send collaboration agreements",
    icon: FileText,
  },
];

export default function CollabCollaborationsTab({
  userBusinessId,
  token,
}: CollabCollaborationsTabProps) {
  const [activeView, setActiveView] = useState<CollabView>("active");

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.key === activeView) || tabs[0];
  }, [activeView]);

  const ActiveIcon = activeTab.icon;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50 to-violet-50 p-5 shadow-[0_18px_70px_rgba(15,23,42,0.06)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-2 text-xs font-black text-violet-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Collaboration Workspace
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              Business Collaborations
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              Manage active partnerships, pending requests and official
              collaboration agreements from one professional workspace.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100 text-violet-700">
                <ActiveIcon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Current view
                </p>
                <p className="mt-1 text-base font-black text-slate-800">
                  {activeTab.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
        <div className="grid gap-3 lg:grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveView(tab.key)}
                className={[
                  "group flex items-center gap-3 rounded-[1.5rem] border p-4 text-left transition",
                  isActive
                    ? "border-violet-200 bg-gradient-to-br from-violet-50 to-sky-50 shadow-[0_14px_35px_rgba(124,58,237,0.12)] ring-2 ring-violet-100"
                    : "border-transparent bg-slate-50/70 hover:-translate-y-0.5 hover:border-sky-100 hover:bg-white hover:shadow-md",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
                    isActive
                      ? "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-white shadow-[0_12px_28px_rgba(124,58,237,0.20)]"
                      : "bg-white text-sky-700 shadow-sm group-hover:bg-sky-50",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span
                    className={[
                      "block truncate text-sm font-black",
                      isActive ? "text-violet-800" : "text-slate-800",
                    ].join(" ")}
                  >
                    {tab.label}
                  </span>

                  <span className="mt-1 block line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
                    {tab.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-100 bg-white/70 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur sm:p-5">
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
              <LayoutGrid className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-800">
                {activeTab.label}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {activeTab.description}
              </p>
            </div>
          </div>
        </div>

        {activeView === "active" && (
          <CollabActiveTab userBusinessId={userBusinessId} />
        )}

        {activeView === "pending" && <CollabPendingTab token={token} />}

        {activeView === "agreements" && (
          <PartnershipAgreementsTab userBusinessId={userBusinessId} />
        )}
      </section>
    </section>
  );
}