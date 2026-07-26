import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  CalendarDays,
  Eye,
  Handshake,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  CircleHelp,
  Settings,
  Sparkles,
  Star,
  Target,
  UserPlus,
  UsersRound,
  ListChecks,
  Mail,
} from "lucide-react";

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

const kpis = [
  {
    key: "views",
    value: 109,
    decimals: 0,
    icon: Eye,
    tone: "bg-violet-100 text-[#6D28D9]",
    delta: null,
  },
  {
    key: "leads",
    value: 6,
    decimals: 0,
    icon: UserPlus,
    tone: "bg-sky-100 text-sky-600",
    delta: "+100%",
    deltaTone: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "reviews",
    value: 4.1,
    decimals: 1,
    icon: Star,
    tone: "bg-amber-100 text-amber-600",
    delta: null,
  },
  {
    key: "collabs",
    value: 4,
    decimals: 0,
    icon: Handshake,
    tone: "bg-rose-100 text-rose-500",
    delta: null,
  },
];

function CountUp({ value, decimals = 0, active }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const total = 42;
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

export default function AboutDashboardShowcase({ labels }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-4.5, 4.5]);
  const glareX = useTransform(sx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(sy, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45), transparent 45%)`;

  useEffect(() => {
    const t1 = window.setTimeout(() => setReady(true), 180);
    const t2 = window.setTimeout(() => setToast(true), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="about-dash relative mx-auto w-full max-w-5xl [perspective:1400px]"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-l from-[#6D28D9]/18 via-[#2563EB]/10 to-cyan-300/12 blur-xl" />

      <div className="about-dash-shell relative overflow-hidden rounded-[1.45rem] border border-slate-200/90 bg-[#F7F8FC] shadow-[0_28px_70px_rgba(109,40,217,0.18)]">
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-40"
          style={{ background: glare }}
        />

        <div className="grid min-h-[460px] grid-cols-[92px_1fr] sm:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="border-e border-slate-200 bg-white p-3 sm:p-4">
            <div className="mb-5 flex items-center justify-center gap-2 sm:justify-start">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#6D28D9] text-white">
                <LayoutDashboard size={17} />
              </span>
              <span className="hidden text-[0.95rem] font-black tracking-tight text-slate-900 sm:inline">
                BizUply
              </span>
            </div>

            <div className="space-y-1.5">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.035 }}
                    className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-[0.8rem] font-bold sm:justify-start sm:px-3 ${
                      item.active
                        ? "bg-[#6D28D9] text-white shadow-[0_10px_24px_rgba(109,40,217,0.35)]"
                        : "text-slate-600"
                    }`}
                  >
                    <Icon size={17} />
                    <span className="hidden sm:inline">
                      {labels.nav[item.key]}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 space-y-1.5 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-bold text-slate-500 sm:justify-start sm:px-3">
                <CircleHelp size={16} />
                <span className="hidden sm:inline">{labels.help}</span>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-bold text-slate-500 sm:justify-start sm:px-3">
                <LogOut size={16} />
                <span className="hidden sm:inline">{labels.logout}</span>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="relative bg-[#F7F8FC] p-3.5 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <motion.div
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#6D28D9] text-sm font-black text-white">
                  {labels.avatar}
                </div>
                <div className="text-start">
                  <p className="text-sm font-black text-slate-900">{labels.owner}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {labels.role}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <motion.div
                    key={kpi.key}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.25 + i * 0.07,
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                    }}
                    whileHover={{ y: -3 }}
                    className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-[0_8px_22px_rgba(15,23,42,0.05)]"
                  >
                    <div className="mb-2 flex items-center justify-center">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl ${kpi.tone}`}
                      >
                        <Icon size={17} />
                      </span>
                    </div>
                    <p className="text-[1.65rem] font-black tabular-nums leading-none text-slate-900">
                      <CountUp
                        value={kpi.value}
                        decimals={kpi.decimals}
                        active={ready}
                      />
                    </p>
                    <p className="mt-1.5 text-[0.78rem] font-bold text-slate-600">
                      {labels.kpi[kpi.key]}
                    </p>
                    {kpi.delta ? (
                      <p
                        className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-black ${kpi.deltaTone}`}
                      >
                        {kpi.delta}
                      </p>
                    ) : (
                      <p className="mt-2 text-[11px] font-semibold text-slate-400">
                        {labels.kpiSub[kpi.key]}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_10px_28px_rgba(109,40,217,0.07)]"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.45 }}
            >
              <div className="mb-3 flex flex-col items-center text-center">
                <div className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-violet-100 text-[#6D28D9]">
                  <Sparkles size={16} />
                </div>
                <p className="text-[0.95rem] font-black text-slate-900">
                  {labels.recsTitle}
                </p>
                <p className="mt-1 text-[0.78rem] font-semibold leading-5 text-slate-500">
                  {labels.recsSubtitle}
                </p>
              </div>

              <div className="space-y-2">
                {[
                  {
                    key: "urgent",
                    badge: labels.urgent,
                    badgeTone: "bg-rose-100 text-rose-600",
                    icon: Target,
                    iconTone: "text-rose-500",
                    cta: labels.viewLeads,
                  },
                  {
                    key: "recommended",
                    badge: labels.recommended,
                    badgeTone: "bg-amber-100 text-amber-700",
                    icon: Mail,
                    iconTone: "text-amber-500",
                    cta: labels.sendFollowUp,
                  },
                ].map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <motion.div
                      key={row.key}
                      initial={{ opacity: 0, x: i % 2 ? 18 : -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 + i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-[#F7F8FC] p-3 text-center sm:flex-row sm:justify-between"
                    >
                      <button
                        type="button"
                        className="order-3 inline-flex h-9 items-center rounded-lg bg-gradient-to-l from-[#6D28D9] to-[#2563EB] px-3 text-xs font-black text-white sm:order-1"
                      >
                        {row.cta}
                      </button>
                      <div className="order-2 min-w-0 flex-1">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-black ${row.badgeTone}`}
                        >
                          {row.badge}
                        </span>
                        <p className="mt-1 text-[0.8rem] font-bold leading-5 text-slate-700">
                          {labels.recText[row.key]}
                        </p>
                      </div>
                      <Icon className={`order-1 sm:order-3 ${row.iconTone}`} size={18} />
                    </motion.div>
                  );
                })}
              </div>

              <p className="mt-3 text-center text-xs font-black text-[#6D28D9]">
                {labels.viewAllRecs}
              </p>
            </motion.div>

            <motion.div
              className="absolute bottom-4 start-4 z-30 flex max-w-[240px] items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-3 text-start shadow-[0_14px_34px_rgba(16,185,129,0.22)]"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={
                toast
                  ? { opacity: 1, y: [0, -5, 0], scale: 1 }
                  : { opacity: 0, y: 24, scale: 0.94 }
              }
              transition={
                toast
                  ? {
                      opacity: { duration: 0.3 },
                      y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                      scale: { type: "spring", stiffness: 200, damping: 14 },
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
