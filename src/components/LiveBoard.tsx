"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

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

const SOURCE_STYLES: Record<Source, string> = {
  meta: "bg-[#e7f0ff] text-[#1877f2]",
  site: "bg-indigo-50 text-indigo-700",
  google: "bg-amber-50 text-amber-700",
  whatsapp: "bg-emerald-50 text-emerald-700",
};

const STATUS_STYLES: Record<Status, string> = {
  new: "bg-slate-900 text-white",
  contacted: "bg-amber-50 text-amber-700",
  interested: "bg-violet-50 text-violet-700",
  won: "bg-emerald-50 text-emerald-700",
};

const AVATAR_TONES = [
  "from-indigo-500 to-violet-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-orange-400",
];

const ROWS_VISIBLE = 5;
const TICK_MS = 3200;
/** Enough arrivals to read as a working board without the counters running wild. */
const MAX_ARRIVALS = 12;

/**
 * The leads board as it behaves during a working day: enquiries arrive at the
 * top, the counters move with them, and a status flips as someone works the
 * list. Falls back to a still board under prefers-reduced-motion.
 */
export default function LiveBoard() {
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
  const [counts, setCounts] = useState({ total: 24, fresh: 9, working: 5, won: 2 });
  const cursor = useRef(ROWS_VISIBLE);
  const arrivals = useRef(0);

  // Seed on mount, and again if the language swaps the roster out.
  useEffect(() => {
    if (people.length < ROWS_VISIBLE) return;

    const order: Status[] = ["new", "contacted", "interested", "contacted", "won"];
    cursor.current = ROWS_VISIBLE;
    arrivals.current = 0;
    setCounts({ total: 24, fresh: 9, working: 5, won: 2 });
    setRows(
      Array.from({ length: ROWS_VISIBLE }, (_, i) => ({
        key: i,
        ...people[i],
        status: order[i] ?? "contacted",
      })),
    );
  }, [people]);

  useEffect(() => {
    if (reduceMotion || people.length < ROWS_VISIBLE) return;

    const id = window.setInterval(() => {
      if (arrivals.current >= MAX_ARRIVALS) {
        window.clearInterval(id);
        return;
      }
      arrivals.current += 1;

      const key = cursor.current;
      cursor.current += 1;
      const person = people[key % people.length];

      setRows((current) => {
        const next: Lead = { key, ...person, status: "new" };
        // Push the arrival on top, age the previous newest, drop the tail.
        const aged = current.map((row, index) =>
          index === 0 && row.status === "new"
            ? { ...row, status: "contacted" as Status }
            : row,
        );
        return [next, ...aged].slice(0, ROWS_VISIBLE);
      });

      setCounts((c) => {
        // A lead arrives; every few arrivals one moves on down the pipeline.
        const movesOn = arrivals.current % 3 === 0 && c.fresh > 6;
        const converts = arrivals.current % 4 === 0 && c.working > 3;
        return {
          total: c.total + 1,
          fresh: c.fresh + 1 - (movesOn ? 1 : 0),
          working: c.working + (movesOn ? 1 : 0) - (converts ? 1 : 0),
          won: c.won + (converts ? 1 : 0),
        };
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [people, reduceMotion]);

  const stats = [
    { label: t("live.statTotal"), value: counts.total, tone: "text-slate-900" },
    { label: t("live.statNew"), value: counts.fresh, tone: "text-indigo-700" },
    { label: t("live.statWorking"), value: counts.working, tone: "text-amber-600" },
    { label: t("live.statWon"), value: counts.won, tone: "text-emerald-600" },
  ];

  return (
    <div className="relative" dir="rtl">
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-indigo-300/30 via-violet-300/25 to-cyan-300/30 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/80 p-2 shadow-[0_30px_100px_rgba(79,70,229,0.2)] backdrop-blur-xl sm:p-3">
        <div className="overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white">
          {/* window bar */}
          <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50 px-4 py-3">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </span>

            <span className="text-xs font-bold text-slate-500">
              {t("live.crumb")}
            </span>

            <span className="ms-auto flex items-center gap-1.5" aria-hidden="true">
              <motion.span
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>

          <div className="p-4 text-start sm:p-5">
            <h3 className="text-lg font-black text-slate-900 sm:text-xl">
              {t("live.title")}
            </h3>

            {/* counters */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5"
                >
                  <p className="text-[0.68rem] font-bold text-slate-500">
                    {stat.label}
                  </p>
                  <p
                    className={`mt-0.5 text-xl font-black tabular-nums sm:text-2xl ${stat.tone}`}
                  >
                    <motion.span
                      key={stat.value}
                      initial={reduceMotion ? false : { y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="inline-block"
                    >
                      {stat.value}
                    </motion.span>
                  </p>
                </div>
              ))}
            </div>

            {/* rows */}
            <ul className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {rows.map((row, index) => (
                  <motion.li
                    key={row.key}
                    layout
                    initial={
                      reduceMotion ? false : { opacity: 0, y: -22, scale: 0.97 }
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
                        ? "border-indigo-200 bg-indigo-50/60"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${
                        AVATAR_TONES[row.key % AVATAR_TONES.length]
                      } text-[0.7rem] font-black text-white`}
                      aria-hidden="true"
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
                      className={`hidden shrink-0 rounded-lg px-2 py-1 text-[0.68rem] font-black sm:block ${
                        SOURCE_STYLES[row.source]
                      }`}
                    >
                      {t(`live.source_${row.source}`)}
                    </span>

                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-[0.68rem] font-black ${
                        STATUS_STYLES[row.status]
                      }`}
                    >
                      {t(`live.status_${row.status}`)}
                    </span>

                    {index === 0 && row.status === "new" ? (
                      <span className="shrink-0 text-[0.66rem] font-black text-indigo-600">
                        {t("live.justNow")}
                      </span>
                    ) : null}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
