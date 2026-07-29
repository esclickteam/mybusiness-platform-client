"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bell, MessageCircle, Phone } from "lucide-react";

type Source = "meta" | "site" | "google" | "whatsapp";
type Status = "new" | "contacted" | "interested" | "won";

type Lead = {
  key: number;
  name: string;
  initials: string;
  service: string;
  source: Source;
  status: Status;
};

type Toast = {
  id: number;
  name: string;
  source: Source;
};

const SOURCE_STYLES: Record<Source, string> = {
  meta: "bg-[#e7f0ff] text-[#1877f2]",
  site: "bg-sky-50 text-sky-700",
  google: "bg-amber-50 text-amber-700",
  whatsapp: "bg-emerald-50 text-emerald-700",
};

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-slate-900 text-white",
  contacted: "bg-amber-100 text-amber-800",
  interested: "bg-violet-100 text-violet-800",
  won: "bg-emerald-100 text-emerald-800",
};

const AVATARS = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-cyan-400",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-orange-400",
];

const ROWS = 4;
const TICK = 2800;
const MAX = 14;

/**
 * Cinematic hero stage: leads arrive with a toast, land on the board, counters
 * move, and a phone tray fills with the same events. Hard to miss, even in a
 * still screenshot after a couple of seconds.
 */
export default function LiveStage() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const people = useMemo(
    () =>
      (t("live.people", { returnObjects: true }) as unknown as
        | { name: string; initials: string; service: string; source: Source }[]
        | undefined) || [],
    [t],
  );

  const [rows, setRows] = useState<Lead[]>([]);
  const [counts, setCounts] = useState({
    total: 24,
    fresh: 9,
    working: 5,
    won: 2,
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [feed, setFeed] = useState<
    { id: number; name: string; source: Source; ago: string }[]
  >([]);
  const cursor = useRef(ROWS);
  const arrivals = useRef(0);

  useEffect(() => {
    if (people.length < ROWS) return;
    const order: Status[] = ["new", "contacted", "interested", "won"];
    cursor.current = ROWS;
    arrivals.current = 0;
    setCounts({ total: 24, fresh: 9, working: 5, won: 2 });
    setToasts([]);
    setRows(
      Array.from({ length: ROWS }, (_, i) => ({
        key: i,
        ...people[i],
        status: order[i] ?? "contacted",
      })),
    );
    setFeed(
      people.slice(0, 3).map((p, i) => ({
        id: i,
        name: p.name,
        source: p.source,
        ago: t("live.ago", { n: (i + 1) * 4 }),
      })),
    );
  }, [people, t]);

  useEffect(() => {
    if (reduceMotion || people.length < ROWS) return;

    const id = window.setInterval(() => {
      if (arrivals.current >= MAX) {
        window.clearInterval(id);
        return;
      }
      arrivals.current += 1;
      const key = cursor.current++;
      const person = people[key % people.length];

      const toast: Toast = {
        id: key,
        name: person.name,
        source: person.source,
      };
      setToasts((prev) => [toast, ...prev].slice(0, 2));
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== key));
      }, 2200);

      setRows((current) => {
        const next: Lead = { key, ...person, status: "new" };
        const aged = current.map((row, index) =>
          index === 0 && row.status === "new"
            ? { ...row, status: "contacted" as Status }
            : row,
        );
        return [next, ...aged].slice(0, ROWS);
      });

      setFeed((prev) =>
        [
          {
            id: key,
            name: person.name,
            source: person.source,
            ago: t("live.justNow"),
          },
          ...prev,
        ].slice(0, 4),
      );

      setCounts((c) => {
        const movesOn = arrivals.current % 3 === 0 && c.fresh > 6;
        const converts = arrivals.current % 4 === 0 && c.working > 3;
        return {
          total: c.total + 1,
          fresh: c.fresh + 1 - (movesOn ? 1 : 0),
          working: c.working + (movesOn ? 1 : 0) - (converts ? 1 : 0),
          won: c.won + (converts ? 1 : 0),
        };
      });
    }, TICK);

    return () => window.clearInterval(id);
  }, [people, reduceMotion, t]);

  const stats = [
    { label: t("live.statTotal"), value: counts.total, tone: "text-slate-900" },
    { label: t("live.statNew"), value: counts.fresh, tone: "text-indigo-700" },
    {
      label: t("live.statWorking"),
      value: counts.working,
      tone: "text-amber-700",
    },
    { label: t("live.statWon"), value: counts.won, tone: "text-emerald-700" },
  ];

  return (
    <div className="relative w-full" dir="rtl">
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-indigo-400/25 via-violet-300/20 to-cyan-300/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/90 bg-white shadow-[0_40px_120px_rgba(79,70,229,0.28)]">
        {/* Window bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-bold text-slate-500">
            {t("live.crumb")}
          </span>
          <span className="ms-auto flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-black text-emerald-700">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={reduceMotion ? undefined : { opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            {t("live.liveBadge")}
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
          {/* Main board */}
          <div className="relative p-4 text-start sm:p-5">
            {/* Flying toasts */}
            <div className="pointer-events-none absolute inset-x-4 top-3 z-20 flex flex-col gap-2 sm:inset-x-6">
              <AnimatePresence>
                {toasts.map((toast) => (
                  <motion.div
                    key={toast.id}
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: -24, scale: 0.94 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.96 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-white/95 px-3.5 py-2.5 shadow-[0_16px_40px_rgba(79,70,229,0.22)] backdrop-blur"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-600 text-white">
                      <Bell size={15} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-black uppercase tracking-wide text-indigo-600">
                        {t("live.toastEyebrow")}
                      </span>
                      <span className="block truncate text-sm font-black text-slate-900">
                        {toast.name}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-lg px-2 py-1 text-[0.65rem] font-black ${SOURCE_STYLES[toast.source]}`}
                    >
                      {t(`live.source_${toast.source}`)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <h3 className="pt-1 text-lg font-black text-slate-900 sm:text-xl">
              {t("live.title")}
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5"
                >
                  <p className="text-[0.65rem] font-bold text-slate-500">
                    {stat.label}
                  </p>
                  <p
                    className={`mt-0.5 text-xl font-black tabular-nums sm:text-2xl ${stat.tone}`}
                  >
                    <motion.span
                      key={stat.value}
                      initial={reduceMotion ? false : { y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="inline-block"
                    >
                      {stat.value}
                    </motion.span>
                  </p>
                </div>
              ))}
            </div>

            <ul className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {rows.map((row, index) => (
                  <motion.li
                    key={row.key}
                    layout
                    initial={
                      reduceMotion
                        ? false
                        : { opacity: 0, y: -28, scale: 0.97 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? undefined
                        : { opacity: 0, height: 0, marginTop: 0 }
                    }
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                      row.status === "new"
                        ? "border-indigo-300 bg-indigo-50 shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
                        AVATARS[row.key % AVATARS.length]
                      } text-[0.7rem] font-black text-white`}
                    >
                      {row.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black text-slate-900">
                        {row.name}
                      </span>
                      <span className="block truncate text-xs font-bold text-slate-400">
                        {row.service}
                      </span>
                    </span>
                    <span
                      className={`hidden shrink-0 rounded-lg px-2 py-1 text-[0.65rem] font-black sm:inline ${
                        SOURCE_STYLES[row.source]
                      }`}
                    >
                      {t(`live.source_${row.source}`)}
                    </span>
                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-[0.65rem] font-black ${
                        STATUS_STYLES[row.status]
                      }`}
                    >
                      {t(`live.status_${row.status}`)}
                    </span>
                    {index === 0 && row.status === "new" ? (
                      <span className="shrink-0 text-[0.65rem] font-black text-indigo-600">
                        {t("live.justNow")}
                      </span>
                    ) : null}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          {/* Phone / notification tray */}
          <aside className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-indigo-50/40 p-4 text-start sm:p-5 lg:border-t-0 lg:border-s">
            <div className="mx-auto w-full max-w-[17.5rem]">
              <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
                  <span className="text-sm font-black">
                    {t("live.phoneTitle")}
                  </span>
                  <Bell size={15} />
                </div>

                <ul className="divide-y divide-slate-100">
                  <AnimatePresence initial={false}>
                    {feed.map((item) => (
                      <motion.li
                        key={item.id}
                        initial={
                          reduceMotion ? false : { opacity: 0, x: 24 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex items-start gap-3 px-3.5 py-3"
                      >
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-700">
                          {item.source === "whatsapp" ? (
                            <MessageCircle size={14} />
                          ) : item.source === "meta" ? (
                            <Bell size={14} />
                          ) : (
                            <Phone size={14} />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-black text-slate-900">
                            {t("live.feedTitle", { name: item.name })}
                          </span>
                          <span className="mt-0.5 block text-[0.7rem] font-bold text-slate-400">
                            {t(`live.source_${item.source}`)} · {item.ago}
                          </span>
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <p className="mt-4 text-center text-xs font-bold leading-5 text-slate-500">
                {t("live.phoneNote")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
