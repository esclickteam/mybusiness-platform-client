"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bot,
  BrainCircuit,
  ListChecks,
  MessageSquareText,
  Megaphone,
  ShieldAlert,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { useLocaleDir } from "@/hooks/useLocaleDir";

type AiAutomationsTabProps = {
  businessId?: string | null;
};

type AutomationCard = {
  id: string;
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
};

const AUTOMATION_CARDS: AutomationCard[] = [
  {
    id: "rank_leads",
    icon: ListChecks,
    titleKey: "advisor.aiAutomations.features.rankLeads.title",
    descKey: "advisor.aiAutomations.features.rankLeads.desc",
  },
  {
    id: "summarize_calls",
    icon: MessageSquareText,
    titleKey: "advisor.aiAutomations.features.summarizeCalls.title",
    descKey: "advisor.aiAutomations.features.summarizeCalls.desc",
  },
  {
    id: "auto_reply",
    icon: Bot,
    titleKey: "advisor.aiAutomations.features.autoReply.title",
    descKey: "advisor.aiAutomations.features.autoReply.desc",
  },
  {
    id: "risk_lead",
    icon: ShieldAlert,
    titleKey: "advisor.aiAutomations.features.riskLead.title",
    descKey: "advisor.aiAutomations.features.riskLead.desc",
  },
  {
    id: "campaign_change",
    icon: Megaphone,
    titleKey: "advisor.aiAutomations.features.campaignChange.title",
    descKey: "advisor.aiAutomations.features.campaignChange.desc",
  },
  {
    id: "tasks_from_chat",
    icon: Workflow,
    titleKey: "advisor.aiAutomations.features.tasksFromChat.title",
    descKey: "advisor.aiAutomations.features.tasksFromChat.desc",
  },
];

export default function AiAutomationsTab({
  businessId,
}: AiAutomationsTabProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const automationsPath = businessId
    ? `/business/${businessId}/dashboard/automations`
    : "/";

  return (
    <section
      dir={dir}
      className="min-h-[calc(100vh-180px)] rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <header className="overflow-hidden rounded-[24px] border border-amber-200/80 bg-gradient-to-l from-amber-50 via-orange-50 to-rose-50 px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-200 bg-white text-amber-700 shadow-sm">
              <Zap className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {t("advisor.aiAutomations.title")}
                </h2>
                <span className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                  {t("advisor.aiAutomations.badge")}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
                {t("advisor.aiAutomations.subtitle")}
              </p>
            </div>
          </div>

          <Link
            to={automationsPath}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-white px-5 text-sm font-black text-amber-900 shadow-sm transition hover:bg-amber-50"
          >
            <Sparkles className="h-4 w-4" />
            {t("advisor.aiAutomations.openBuilder")}
          </Link>
        </div>
      </header>

      <div className="mt-5 grid gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-sky-700" />
            <p className="text-sm font-black text-slate-900">
              {t("advisor.aiAutomations.advisorOnlyTitle")}
            </p>
          </div>
          <p className="mt-2 text-xs font-semibold leading-6 text-slate-600">
            {t("advisor.aiAutomations.advisorOnlyBody")}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-700" />
            <p className="text-sm font-black text-amber-900">
              {t("advisor.aiAutomations.automationsTitle")}
            </p>
          </div>
          <p className="mt-2 text-xs font-semibold leading-6 text-amber-900/80">
            {t("advisor.aiAutomations.automationsBody")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {AUTOMATION_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.id}
              className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base font-black text-slate-900">
                {t(card.titleKey)}
              </h3>
              <p className="mt-1.5 text-xs font-semibold leading-6 text-slate-600">
                {t(card.descKey)}
              </p>
              <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-amber-700">
                {t("advisor.aiAutomations.paidTag")}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
