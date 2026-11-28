import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
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

export default function CollabCollaborationsTab({
  userBusinessId,
  token,
}: CollabCollaborationsTabProps) {
  const outlet = useOutletContext<{ userBusinessId?: string | null } | null>();
  const resolvedBusinessId = userBusinessId || outlet?.userBusinessId || null;
  const resolvedToken =
    token ||
    (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState<CollabView>("active");

  const tabs: TabItem[] = useMemo(
    () => [
      {
        key: "active",
        label: t("leftover.collab.workspace.tabActive"),
        description: t("leftover.collab.workspace.tabActiveHint"),
        icon: Handshake,
      },
      {
        key: "pending",
        label: t("leftover.collab.workspace.tabPending"),
        description: t("leftover.collab.workspace.tabPendingHint"),
        icon: Clock3,
      },
      {
        key: "agreements",
        label: t("leftover.collab.workspace.tabAgreements"),
        description: t("leftover.collab.workspace.tabAgreementsHint"),
        icon: FileText,
      },
    ],
    [t]
  );

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.key === activeView) || tabs[0];
  }, [activeView, tabs]);

  const ActiveIcon = activeTab.icon;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-[#E0E6F0] bg-white p-5 shadow-[0_1px_2px_rgba(17,25,50,0.04),0_8px_24px_rgba(17,25,50,0.04)] sm:p-7">
        <div className="pointer-events-none absolute inset-y-0 start-0 w-1 bg-[#2541F5]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#d9e1ff] bg-[#eef2ff] px-3 py-1.5 text-xs font-bold text-[#1c32c4]">
              <Sparkles className="h-4 w-4" />
              {t("leftover.collab.workspace.badge")}
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
              {t("leftover.collab.workspace.title")}
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-500">
              {t("leftover.collab.workspace.subtitle")}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#d9e1ff] bg-[#eef2ff] text-[#2541F5]">
                <ActiveIcon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-base font-black text-[#111932]">
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
                    ? "border-[#c9d4ff] bg-[#f8faff] shadow-none ring-1 ring-[#d9e1ff]"
                    : "border-transparent bg-[#f8fafc] hover:border-[#E0E6F0] hover:bg-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
                    isActive
                      ? "border border-[#d9e1ff] bg-[#eef2ff] text-[#2541F5]"
                      : "bg-white text-[#64748B] shadow-sm",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="min-w-0">
                  <span
                    className={[
                      "block truncate text-sm font-black",
                      isActive ? "text-[#1c32c4]" : "text-[#111932]",
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
          <CollabActiveTab userBusinessId={resolvedBusinessId} />
        )}

        {activeView === "pending" && <CollabPendingTab token={resolvedToken} />}

        {activeView === "agreements" && (
          <PartnershipAgreementsTab userBusinessId={resolvedBusinessId} />
        )}
      </section>
    </section>
  );
}