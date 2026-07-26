import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  Eye,
  Handshake,
  LayoutDashboard,
  LayoutTemplate,
  Lightbulb,
  LogOut,
  CircleHelp,
  PenLine,
  Settings,
  Sparkles,
  Star,
  Target,
  User,
  UserPlus,
  UsersRound,
  ListChecks,
  Mail,
  TrendingUp,
} from "lucide-react";

function CountUp({ value, decimals = 0, active }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const total = 46;
    const id = window.setInterval(() => {
      frame += 1;
      const p = Math.min(1, frame / total);
      const eased = 1 - (1 - p) ** 3;
      const next = value * eased;
      setN(decimals ? Number(next.toFixed(decimals)) : Math.round(next));
      if (p >= 1) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [active, value, decimals]);

  return <>{decimals ? n.toFixed(decimals) : n}</>;
}

function Sparkline({ color = "#6D28D9" }) {
  return (
    <svg viewBox="0 0 84 28" className="mt-2 h-7 w-full" aria-hidden="true">
      <path
        d="M1 22 C12 20, 18 14, 28 15 S44 22, 54 10 S70 4, 83 6"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M1 22 C12 20, 18 14, 28 15 S44 22, 54 10 S70 4, 83 6 L83 28 L1 28 Z"
        fill={color}
        opacity="0.12"
      />
    </svg>
  );
}

const railIcons = [
  { key: "dashboard", icon: LayoutDashboard, active: true },
  { key: "profile", icon: User },
  { key: "collabs", icon: Handshake },
  { key: "ai", icon: Sparkles },
  { key: "edit", icon: PenLine },
  { key: "people", icon: UsersRound },
  { key: "layout", icon: LayoutTemplate },
  { key: "billing", icon: CreditCard },
  { key: "help", icon: CircleHelp },
];

const navItems = [
  { key: "dashboard", icon: LayoutDashboard, active: true },
  { key: "leads", icon: UserPlus },
  { key: "clients", icon: UsersRound },
  { key: "tasks", icon: ListChecks },
  { key: "calendar", icon: CalendarDays },
  { key: "reports", icon: Eye },
  { key: "tips", icon: Lightbulb },
  { key: "settings", icon: Settings },
];

export default function AboutDashboardShowcase({ labels }) {
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => setReady(true), 120);
    const t2 = window.setTimeout(() => setToast(true), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const kpis = [
    {
      key: "views",
      value: 109,
      decimals: 0,
      icon: Eye,
      tone: "bg-violet-100 text-[#6D28D9]",
      delta: "+445%",
      deltaTone: "text-emerald-700 bg-emerald-50",
      spark: "#6D28D9",
      footer: labels.kpiFooters.views,
    },
    {
      key: "leads",
      value: 6,
      decimals: 0,
      icon: UserPlus,
      tone: "bg-sky-100 text-sky-600",
      delta: "+100%",
      deltaTone: "text-emerald-700 bg-emerald-50",
      spark: "#0ea5e9",
      footer: labels.kpiFooters.leads,
    },
    {
      key: "reviews",
      value: 4.8,
      decimals: 1,
      icon: Star,
      tone: "bg-amber-100 text-amber-600",
      delta: "+12%",
      deltaTone: "text-emerald-700 bg-emerald-50",
      spark: "#f59e0b",
      footer: labels.kpiFooters.reviews,
    },
    {
      key: "collabs",
      value: 4,
      decimals: 0,
      icon: Handshake,
      tone: "bg-rose-100 text-rose-500",
      delta: "+33%",
      deltaTone: "text-emerald-700 bg-emerald-50",
      spark: "#f43f5e",
      footer: labels.kpiFooters.collabs,
    },
  ];

  return (
    <motion.div
      className="about-dash relative mx-auto w-full max-w-5xl"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-l from-[#6D28D9]/14 via-[#2563EB]/8 to-cyan-300/10 blur-xl" />

      <div className="about-dash-shell relative overflow-hidden rounded-[1.4rem] border border-slate-200 bg-[#F3F5FA] shadow-[0_24px_60px_rgba(109,40,217,0.16)]">
        <div className="grid min-h-[500px] grid-cols-[56px_1fr] sm:grid-cols-[56px_200px_1fr]">
          {/* Compact icon rail — matches product sidebar strip */}
          <aside className="flex flex-col items-center gap-2 border-e border-slate-200 bg-[#F7F8FC] py-3">
            {railIcons.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.span
                  key={item.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.03 }}
                  className={`grid h-9 w-9 place-items-center rounded-xl ${
                    item.active
                      ? "bg-gradient-to-br from-violet-200 via-sky-100 to-white text-[#6D28D9] shadow-sm"
                      : "text-slate-400"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.75} />
                </motion.span>
              );
            })}
          </aside>

          {/* Labeled nav — desktop */}
          <aside className="hidden border-e border-slate-200 bg-white p-3 sm:block">
            <div className="mb-5 flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#2563EB] text-white">
                <LayoutDashboard size={16} />
              </span>
              <span className="text-[0.95rem] font-black tracking-tight text-slate-900">
                BizUply
              </span>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[0.8rem] font-bold ${
                      item.active
                        ? "bg-[#6D28D9] text-white shadow-[0_10px_22px_rgba(109,40,217,0.3)]"
                        : "text-slate-600"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{labels.nav[item.key]}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 space-y-1 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-[0.8rem] font-bold text-slate-500">
                <CircleHelp size={16} />
                <span>{labels.help}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-[0.8rem] font-bold text-slate-500">
                <LogOut size={16} />
                <span>{labels.logout}</span>
              </div>
            </div>
          </aside>

          {/* Main panel */}
          <div className="relative bg-[#F7F8FC] p-3 sm:p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#6D28D9] text-sm font-black text-white">
                {labels.avatar}
              </div>
              <div className="text-start">
                <p className="text-sm font-black text-slate-900">{labels.owner}</p>
                <p className="text-xs font-semibold text-slate-500">{labels.role}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={kpi.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="rounded-2xl border border-white bg-white p-3.5 text-start shadow-[0_8px_22px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[0.78rem] font-bold text-slate-500">
                          {labels.kpi[kpi.key]}
                        </p>
                        <p className="mt-1 text-[1.7rem] font-black tabular-nums leading-none text-slate-900">
                          <CountUp
                            value={kpi.value}
                            decimals={kpi.decimals}
                            active={ready}
                          />
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`grid h-8 w-8 place-items-center rounded-xl ${kpi.tone}`}
                        >
                          <Icon size={15} />
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${kpi.deltaTone}`}
                        >
                          <TrendingUp size={10} />
                          {kpi.delta}
                        </span>
                      </div>
                    </div>
                    <Sparkline color={kpi.spark} />
                    <p className="mt-1 text-[0.68rem] font-semibold leading-4 text-slate-400">
                      {kpi.footer}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 text-start shadow-[0_10px_28px_rgba(109,40,217,0.07)]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="mb-3 flex items-start gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-[#6D28D9]">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className="text-[0.95rem] font-black text-slate-900">
                    {labels.recsTitle}
                  </p>
                  <p className="mt-0.5 text-[0.78rem] font-semibold text-slate-500">
                    {labels.recsSubtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: "urgent",
                    badge: labels.urgent,
                    badgeTone: "bg-rose-100 text-rose-600",
                    border: "border-rose-100",
                    icon: Target,
                    iconTone: "bg-rose-50 text-rose-500",
                    title: labels.recTitles.urgent,
                    text: labels.recText.urgent,
                    cta: labels.viewLeads,
                    ctaTone: "bg-sky-100 text-sky-700",
                  },
                  {
                    key: "recommended",
                    badge: labels.recommended,
                    badgeTone: "bg-amber-100 text-amber-700",
                    border: "border-amber-100",
                    icon: Mail,
                    iconTone: "bg-amber-50 text-amber-600",
                    title: labels.recTitles.recommended,
                    text: labels.recText.recommended,
                    cta: labels.sendFollowUp,
                    ctaTone: "bg-violet-100 text-[#6D28D9]",
                  },
                ].map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <motion.div
                      key={row.key}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.08 }}
                      className={`flex flex-col gap-2 rounded-xl border bg-[#FCFCFE] p-3 sm:flex-row sm:items-center sm:justify-between ${row.border}`}
                    >
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${row.iconTone}`}
                        >
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black ${row.badgeTone}`}
                          >
                            {row.badge}
                          </span>
                          <p className="mt-1 text-[0.84rem] font-black text-slate-800">
                            {row.title}
                          </p>
                          <p className="mt-0.5 text-[0.75rem] font-semibold leading-5 text-slate-500">
                            {row.text}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`inline-flex h-9 shrink-0 items-center self-start rounded-lg px-3 text-xs font-black sm:self-center ${row.ctaTone}`}
                      >
                        {row.cta}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-4 start-4 z-20 flex max-w-[240px] items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 text-start shadow-[0_14px_34px_rgba(16,185,129,0.2)]"
              initial={{ opacity: 0, y: 18 }}
              animate={
                toast
                  ? { opacity: 1, y: [0, -4, 0] }
                  : { opacity: 0, y: 18 }
              }
              transition={
                toast
                  ? {
                      opacity: { duration: 0.3 },
                      y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                    }
                  : {}
              }
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[0.8rem] font-black text-slate-900">
                  {labels.toastTitle}
                </p>
                <p className="text-[0.72rem] font-semibold text-slate-500">
                  {labels.toastText}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
