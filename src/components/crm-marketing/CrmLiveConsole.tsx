import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Facebook,
  Globe,
  MessageCircle,
  Phone,
  Search,
  StickyNote,
  UsersRound,
  Zap,
} from "lucide-react";
import { pipelineStages } from "./crmMarketingData";
import "./CrmLiveConsole.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type StageId = (typeof pipelineStages)[number]["id"];
type SourceId = "meta" | "google" | "website";

type ConsoleLead = {
  id: string;
  name: string;
  source: SourceId;
  sourceLabel: string;
  note: string;
};

const LEADS: Record<string, ConsoleLead> = {
  yossi: {
    id: "yossi",
    name: "יוסי לוי",
    source: "website",
    sourceLabel: "טופס באתר",
    note: "שיחה תועדה · חוזרים מחר",
  },
  dana: {
    id: "dana",
    name: "דנה אברהם",
    source: "meta",
    sourceLabel: "Instagram",
    note: "משימה: לשלוח הצעת מחיר",
  },
  itay: {
    id: "itay",
    name: "איתי מזרחי",
    source: "google",
    sourceLabel: "Google Ads",
    note: "הפך ללקוח · פגישה נקבעה",
  },
  michal: {
    id: "michal",
    name: "מיכל שמש",
    source: "website",
    sourceLabel: "טופס באתר",
    note: "פנייה חדשה מהאתר",
  },
  noa: {
    id: "noa",
    name: "נועה כהן",
    source: "meta",
    sourceLabel: "Facebook Lead Ads",
    note: "מעוניינת בטיפול ראשון",
  },
};

const SOURCE_META: Record<
  SourceId,
  { icon: typeof Facebook; color: string; short: string }
> = {
  meta: { icon: Facebook, color: "#1877f2", short: "Meta" },
  google: { icon: Zap, color: "#ea4335", short: "Google" },
  website: { icon: Globe, color: "#7c3aed", short: "אתר" },
};

type TimelineEntry = {
  icon: typeof StickyNote;
  label: string;
  time: string;
  accent: string;
};

type Frame = {
  caption: string;
  ms: number;
  stages: Partial<Record<keyof typeof LEADS, StageId>>;
  drawerId?: keyof typeof LEADS;
  timeline?: TimelineEntry[];
  toast?: { icon: typeof BellRing; text: string; tone: "info" | "warn" | "ok" };
};

const BASE: Partial<Record<keyof typeof LEADS, StageId>> = {
  yossi: "contacted",
  dana: "interested",
  itay: "converted",
  michal: "new",
};

const FRAMES: Frame[] = [
  {
    caption: "צינור הלידים כפי שהוא עכשיו",
    ms: 3000,
    stages: BASE,
  },
  {
    caption: "ליד חדש נכנס מ־Facebook Lead Ads",
    ms: 3200,
    stages: { ...BASE, noa: "new" },
    toast: {
      icon: Facebook,
      text: "ליד חדש · נועה כהן מ־Facebook Lead Ads",
      tone: "info",
    },
  },
  {
    caption: "מתעדים שיחה והליד עובר סטטוס",
    ms: 3600,
    stages: { ...BASE, noa: "contacted" },
    drawerId: "noa",
    timeline: [
      {
        icon: Facebook,
        label: "התקבל מ־Facebook Lead Ads",
        time: "09:41",
        accent: "#1877f2",
      },
      {
        icon: Phone,
        label: "שיחה יוצאת · 4 דקות",
        time: "10:12",
        accent: "#0891b2",
      },
      {
        icon: StickyNote,
        label: "הערה: מעוניינת בטיפול ראשון",
        time: "10:14",
        accent: "#7c3aed",
      },
    ],
  },
  {
    caption: "משימה עם תאריך — והתראה כשעובר הזמן",
    ms: 3400,
    stages: { ...BASE, noa: "contacted" },
    drawerId: "noa",
    timeline: [
      {
        icon: Phone,
        label: "שיחה יוצאת · 4 דקות",
        time: "10:12",
        accent: "#0891b2",
      },
      {
        icon: MessageCircle,
        label: "וואטסאפ · נשלחה הצעת מחיר",
        time: "10:20",
        accent: "#16a34a",
      },
      {
        icon: CalendarClock,
        label: "משימה: לחזור לנועה · מחר 11:00",
        time: "10:21",
        accent: "#f59e0b",
      },
    ],
    toast: {
      icon: BellRing,
      text: "משימה שעבר זמנה · לחזור לדנה אברהם",
      tone: "warn",
    },
  },
  {
    caption: "הליד הומר — וממשיך כלקוח במערכת",
    ms: 3200,
    stages: { ...BASE, noa: "converted" },
    drawerId: "noa",
    timeline: [
      {
        icon: MessageCircle,
        label: "וואטסאפ · נשלחה הצעת מחיר",
        time: "10:20",
        accent: "#16a34a",
      },
      {
        icon: CheckCircle2,
        label: "סטטוס שונה ל״הומר״",
        time: "11:38",
        accent: "#059669",
      },
      {
        icon: CalendarClock,
        label: "נקבעה פגישה · ראשון 09:30",
        time: "11:40",
        accent: "#4f46e5",
      },
    ],
    toast: {
      icon: CheckCircle2,
      text: "נועה כהן הומרה ללקוחה · פגישה נקבעה",
      tone: "ok",
    },
  },
];

const NAV = [
  { label: "לידים", icon: UsersRound, active: true },
  { label: "לקוחות", icon: UsersRound },
  { label: "פגישות", icon: CalendarClock },
  { label: "שירותים", icon: Zap },
  { label: "הגדרות", icon: Search },
];

export default function CrmLiveConsole() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = window.setTimeout(
      () => setIndex((value) => (value + 1) % FRAMES.length),
      FRAMES[index].ms,
    );
    return () => window.clearTimeout(id);
  }, [inView, reduceMotion, index]);

  const frame = FRAMES[index];
  const entries = Object.entries(frame.stages) as [
    keyof typeof LEADS,
    StageId,
  ][];

  const counts = pipelineStages.map(
    (stage) => entries.filter(([, value]) => value === stage.id).length,
  );
  const openTasks = frame.drawerId ? 3 : 2;
  const drawerLead = frame.drawerId ? LEADS[frame.drawerId] : null;

  return (
    <div className="clc" ref={ref}>
      <div className="clc__frame">
        <div className="clc__chrome">
          <span className="clc__dot" />
          <span className="clc__dot" />
          <span className="clc__dot" />
          <span className="clc__url">
            <span className="clc__url-lock" aria-hidden="true" />
            app.bizuply.com/dashboard/crm/leads
          </span>
        </div>

        <div className="clc__body">
          <aside className="clc__nav" aria-hidden="true">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className={item.active ? "is-active" : undefined}
                >
                  <Icon size={13} />
                  {item.label}
                </span>
              );
            })}
          </aside>

          <div className="clc__main">
            <div className="clc__toolbar" aria-hidden="true">
              <span className="clc__search">
                <Search size={12} />
                חיפוש שם, טלפון, אימייל או מקור
              </span>
              <span className="clc__filters">
                <b className="is-active">כל הסטטוסים</b>
                <b>Meta</b>
                <b>Google</b>
                <b>אתר</b>
              </span>
            </div>

            <ul className="clc__kpis" aria-hidden="true">
              {pipelineStages.map((stage, i) => (
                <li key={stage.id} style={{ "--clc-accent": stage.accent } as React.CSSProperties}>
                  <motion.b
                    key={`${stage.id}-${counts[i]}`}
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {counts[i]}
                  </motion.b>
                  <i>{stage.label}</i>
                </li>
              ))}
              <li style={{ "--clc-accent": "#f59e0b" } as React.CSSProperties}>
                <b>{openTasks}</b>
                <i>משימות פתוחות</i>
              </li>
            </ul>

            <div className="clc__board">
              {pipelineStages.map((stage) => (
                <div className="clc__column" key={stage.id}>
                  <p
                    className="clc__column-head"
                    style={
                      { "--clc-accent": stage.accent } as React.CSSProperties
                    }
                  >
                    <span />
                    {stage.label}
                  </p>

                  <div className="clc__column-body">
                    <AnimatePresence>
                      {entries
                        .filter(([, value]) => value === stage.id)
                        .map(([leadId]) => {
                          const lead = LEADS[leadId];
                          const source = SOURCE_META[lead.source];
                          const SourceIcon = source.icon;
                          return (
                            <motion.div
                              key={lead.id}
                              layoutId={`clc-${lead.id}`}
                              layout
                              className={`clc__card${
                                drawerLead?.id === lead.id ? " is-open" : ""
                              }`}
                              initial={
                                reduceMotion
                                  ? false
                                  : { opacity: 0, scale: 0.85, y: -10 }
                              }
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.55, ease: EASE }}
                            >
                              <span className="clc__card-name">
                                {lead.name}
                              </span>
                              <span
                                className="clc__card-source"
                                style={{ color: source.color }}
                              >
                                <SourceIcon size={10} />
                                {source.short}
                              </span>
                              <span className="clc__card-note">
                                {lead.note}
                              </span>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {drawerLead ? (
              <motion.aside
                className="clc__drawer"
                aria-hidden="true"
                initial={reduceMotion ? false : { x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <div className="clc__drawer-head">
                  <span className="clc__avatar">
                    {drawerLead.name.charAt(0)}
                  </span>
                  <div>
                    <b>{drawerLead.name}</b>
                    <i>{drawerLead.sourceLabel}</i>
                  </div>
                </div>

                <div className="clc__drawer-actions">
                  <span>
                    <Phone size={11} />
                    שיחה
                  </span>
                  <span>
                    <MessageCircle size={11} />
                    וואטסאפ
                  </span>
                  <span>
                    <StickyNote size={11} />
                    הערה
                  </span>
                </div>

                <p className="clc__drawer-title">ציר זמן</p>
                <ul className="clc__timeline">
                  <AnimatePresence initial={false}>
                    {(frame.timeline || []).map((entry, i) => {
                      const Icon = entry.icon;
                      return (
                        <motion.li
                          key={entry.label}
                          initial={
                            reduceMotion ? false : { opacity: 0, x: 18 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: i * 0.12,
                            ease: EASE,
                          }}
                        >
                          <span
                            className="clc__timeline-icon"
                            style={{ background: entry.accent }}
                          >
                            <Icon size={10} />
                          </span>
                          <span className="clc__timeline-label">
                            {entry.label}
                          </span>
                          <span className="clc__timeline-time">
                            {entry.time}
                          </span>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </motion.aside>
            ) : null}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {frame.toast ? (
            <motion.div
              key={frame.toast.text}
              className={`clc__toast clc__toast--${frame.toast.tone}`}
              initial={
                reduceMotion ? false : { opacity: 0, y: 16, scale: 0.95 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <frame.toast.icon size={15} />
              {frame.toast.text}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ol className="clc__steps">
        {FRAMES.map((item, i) => (
          <li key={item.caption} className={i === index ? "is-active" : ""}>
            <button type="button" onClick={() => setIndex(i)}>
              <span className="clc__steps-track">
                <motion.span
                  className="clc__steps-fill"
                  initial={false}
                  animate={{ scaleX: i <= index ? 1 : 0 }}
                  transition={{
                    duration:
                      i === index && !reduceMotion ? item.ms / 1000 : 0.3,
                    ease: "linear",
                  }}
                />
              </span>
              {item.caption}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
