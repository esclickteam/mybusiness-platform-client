"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  MessageSquare,
  Phone,
  StickyNote,
} from "lucide-react";

function DemoShell({
  crumb,
  liveLabel,
  children,
}: {
  crumb: string;
  liveLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="relative w-full" dir="rtl">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-indigo-400/20 via-violet-300/15 to-cyan-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white shadow-[0_36px_100px_rgba(79,70,229,0.22)]">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-bold text-slate-500">{crumb}</span>
          <span className="ms-auto flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-black text-emerald-700">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            {liveLabel}
          </span>
        </div>
        <div className="p-4 text-start sm:p-5">{children}</div>
      </div>
    </div>
  );
}

/** Lead card that fills in, flips status, and grows a note + task. */
export function TourLeadCardDemo() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setPhase(3);
      return;
    }
    setPhase(0);
    const timers = [
      window.setTimeout(() => setPhase(1), 900),
      window.setTimeout(() => setPhase(2), 2200),
      window.setTimeout(() => setPhase(3), 3600),
    ];
    const loop = window.setInterval(() => {
      setPhase(0);
      window.setTimeout(() => setPhase(1), 900);
      window.setTimeout(() => setPhase(2), 2200);
      window.setTimeout(() => setPhase(3), 3600);
    }, 7000);
    return () => {
      timers.forEach(clearTimeout);
      window.clearInterval(loop);
    };
  }, [reduceMotion]);

  const status =
    phase >= 3 ? "interested" : phase >= 1 ? "contacted" : "new";

  return (
    <DemoShell crumb={t("tour.leadsCrumb")} liveLabel={t("live.liveBadge")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-600">
            {t("tour.demoLeadEyebrow")}
          </p>
          <h3 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
            {t("tour.demoLeadName")}
          </h3>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {t("tour.demoLeadService")}
          </p>
        </div>
        <motion.span
          key={status}
          initial={reduceMotion ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`rounded-xl px-3 py-1.5 text-xs font-black ${
            status === "new"
              ? "bg-slate-900 text-white"
              : status === "contacted"
                ? "bg-amber-100 text-amber-800"
                : "bg-violet-100 text-violet-800"
          }`}
        >
          {t(`live.status_${status}`)}
        </motion.span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {[
          { label: t("live.source_meta"), icon: Phone },
          { label: t("tour.demoLeadPhone"), icon: MessageSquare },
          { label: t("tour.demoLeadCity"), icon: FileText },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 0 ? 1 : 0, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
          >
            <item.icon size={14} className="text-indigo-600" />
            <p className="mt-1.5 text-xs font-black text-slate-800">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <AnimatePresence>
          {phase >= 2 ? (
            <motion.div
              key="note"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 px-3.5 py-3"
            >
              <StickyNote size={16} className="mt-0.5 shrink-0 text-indigo-600" />
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-wide text-indigo-600">
                  {t("tour.demoNoteLabel")}
                </p>
                <p className="mt-0.5 text-sm font-bold text-slate-800">
                  {t("tour.demoLeadNote")}
                </p>
              </div>
            </motion.div>
          ) : null}
          {phase >= 3 ? (
            <motion.div
              key="task"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/80 px-3.5 py-3"
            >
              <Clock3 size={16} className="shrink-0 text-amber-700" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] font-black uppercase tracking-wide text-amber-700">
                  {t("tour.demoTaskLabel")}
                </p>
                <p className="truncate text-sm font-bold text-slate-800">
                  {t("tour.demoLeadTask")}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-[0.65rem] font-black text-amber-800">
                {t("tour.demoTaskDue")}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}

/** Client dossier with history rows landing one by one. */
export function TourClientDemo() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(reduceMotion ? 3 : 0);

  const rows = [
    {
      title: t("tour.demoClientRow1Title"),
      meta: t("tour.demoClientRow1Meta"),
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      title: t("tour.demoClientRow2Title"),
      meta: t("tour.demoClientRow2Meta"),
      tone: "bg-indigo-50 text-indigo-700",
    },
    {
      title: t("tour.demoClientRow3Title"),
      meta: t("tour.demoClientRow3Meta"),
      tone: "bg-amber-50 text-amber-800",
    },
  ];

  useEffect(() => {
    if (reduceMotion) {
      setVisible(3);
      return;
    }
    setVisible(0);
    const timers = [
      window.setTimeout(() => setVisible(1), 600),
      window.setTimeout(() => setVisible(2), 1400),
      window.setTimeout(() => setVisible(3), 2200),
    ];
    const loop = window.setInterval(() => {
      setVisible(0);
      window.setTimeout(() => setVisible(1), 600);
      window.setTimeout(() => setVisible(2), 1400);
      window.setTimeout(() => setVisible(3), 2200);
    }, 5600);
    return () => {
      timers.forEach(clearTimeout);
      window.clearInterval(loop);
    };
  }, [reduceMotion]);

  return (
    <DemoShell crumb={t("tour.clientsCrumb")} liveLabel={t("live.liveBadge")}>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white">
          {t("tour.demoClientInitials")}
        </span>
        <div>
          <h3 className="text-xl font-black text-slate-900">
            {t("tour.demoClientName")}
          </h3>
          <p className="text-sm font-bold text-slate-500">
            {t("tour.demoClientMeta")}
          </p>
        </div>
        <span className="ms-auto rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800">
          {t("tour.demoClientBadge")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          t("tour.demoClientStat1"),
          t("tour.demoClientStat2"),
          t("tour.demoClientStat3"),
        ].map((stat) => (
          <div
            key={stat}
            className="rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-2 text-center text-[0.7rem] font-black text-slate-700"
          >
            {stat}
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {rows.slice(0, visible).map((row) => (
            <motion.li
              key={row.title}
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5"
            >
              <CheckCircle2 size={16} className="shrink-0 text-indigo-600" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-slate-900">
                  {row.title}
                </span>
                <span className="block truncate text-xs font-bold text-slate-400">
                  {row.meta}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-lg px-2 py-1 text-[0.65rem] font-black ${row.tone}`}
              >
                {t("tour.demoClientDone")}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </DemoShell>
  );
}

/** Day agenda: slots fill, one payment flips to paid. */
export function TourAppointmentsDemo() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [paid, setPaid] = useState(!!reduceMotion);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setPaid(true);
      return;
    }
    setPaid(false);
    setPulse(0);
    const t1 = window.setTimeout(() => setPulse(1), 700);
    const t2 = window.setTimeout(() => setPulse(2), 1500);
    const t3 = window.setTimeout(() => setPaid(true), 2800);
    const loop = window.setInterval(() => {
      setPaid(false);
      setPulse(0);
      window.setTimeout(() => setPulse(1), 700);
      window.setTimeout(() => setPulse(2), 1500);
      window.setTimeout(() => setPaid(true), 2800);
    }, 6200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.clearInterval(loop);
    };
  }, [reduceMotion]);

  const slots = [
    {
      time: "09:30",
      title: t("tour.demoAppt1Title"),
      price: "₪280",
      payKey: false,
    },
    {
      time: "11:00",
      title: t("tour.demoAppt2Title"),
      price: "₪450",
      payKey: true,
    },
    {
      time: "16:15",
      title: t("tour.demoAppt3Title"),
      price: "₪190",
      payKey: false,
    },
  ];

  return (
    <DemoShell
      crumb={t("tour.appointmentsCrumb")}
      liveLabel={t("live.liveBadge")}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white">
          <CalendarDays size={18} />
        </span>
        <div>
          <h3 className="text-lg font-black text-slate-900 sm:text-xl">
            {t("tour.demoApptTitle")}
          </h3>
          <p className="text-sm font-bold text-slate-500">
            {t("tour.demoApptSubtitle")}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {slots.map((slot, index) => {
          const show = reduceMotion || pulse >= index;
          const isPaid = slot.payKey ? paid : index === 0;
          return (
            <motion.li
              key={slot.time}
              initial={false}
              animate={
                show
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0.25, y: 8, scale: 0.98 }
              }
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
            >
              <span className="w-12 shrink-0 text-sm font-black tabular-nums text-slate-900">
                {slot.time}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">
                {slot.title}
              </span>
              <span className="shrink-0 text-sm font-black text-slate-900">
                {slot.price}
              </span>
              <motion.span
                key={`${slot.time}-${isPaid}`}
                initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.65rem] font-black ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                <CreditCard size={12} />
                {isPaid ? t("tour.demoApptPaid") : t("tour.demoApptUnpaid")}
              </motion.span>
            </motion.li>
          );
        })}
      </ul>
    </DemoShell>
  );
}
