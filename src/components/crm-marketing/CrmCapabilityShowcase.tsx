import React from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  ListChecks,
  MessageCircle,
  Phone,
  StickyNote,
  UserRound,
} from "lucide-react";
import { StickyShowcase } from "../product-marketing";
import type { ShowcaseItem } from "../product-marketing";
import {
  clientActivityTypes,
  clientFileFormats,
  leadActivityTypes,
} from "./crmMarketingData";
import "./crmSections.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function StageShell({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="crx-stage">
      <div className="crx-stage__head">
        <p className="crx-stage__title">{title}</p>
        <span className="crx-stage__meta">{meta}</span>
      </div>
      {children}
    </div>
  );
}

function LeadStage() {
  const entries = [
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
    {
      icon: MessageCircle,
      label: "וואטסאפ · נשלחה הצעת מחיר",
      time: "10:20",
      accent: "#16a34a",
    },
    {
      icon: CheckCircle2,
      label: "סטטוס שונה ל״מעוניין״",
      time: "11:02",
      accent: "#2563eb",
    },
  ];

  return (
    <StageShell title="כרטיס הליד" meta="תיעוד · משימות · סטטוס">
      <div className="crx-lead">
        <div className="crx-lead__head">
          <span className="crx-lead__avatar">נ</span>
          <div>
            <b>נועה כהן</b>
            <i>Facebook Lead Ads · 052‑000‑0000</i>
          </div>
          <span className="crx-lead__status">מעוניין</span>
        </div>

        <div className="crx-chips">
          {leadActivityTypes.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>

        <ul className="crx-timeline">
          {entries.map((entry, index) => {
            const Icon = entry.icon;
            return (
              <motion.li
                key={entry.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.09,
                  ease: EASE,
                }}
              >
                <span
                  className="crx-timeline__icon"
                  style={{ background: entry.accent }}
                >
                  <Icon size={13} />
                </span>
                <b>{entry.label}</b>
                <em>{entry.time}</em>
              </motion.li>
            );
          })}
        </ul>

        <div className="crx-task">
          <CalendarClock size={16} aria-hidden="true" />
          משימה: לחזור לנועה · מחר 11:00 — תופיע במרכז ההתראות
        </div>
      </div>
    </StageShell>
  );
}

function ClientStage() {
  return (
    <StageShell title="תיק הלקוח" meta="פרופיל · פגישות · נתונים">
      <div className="crx-tabs">
        <span className="is-active">פרופיל</span>
        <span>פגישות</span>
        <span>נתוני לקוח</span>
      </div>

      <ul className="crx-kv">
        <li>
          <i>שם מלא</i>
          <b>נועה כהן</b>
        </li>
        <li>
          <i>טלפון</i>
          <b>052‑000‑0000</b>
        </li>
        <li>
          <i>סטטוס</i>
          <b>לקוחה</b>
        </li>
        <li>
          <i>סה״כ הכנסות</i>
          <b>₪ 1,840</b>
        </li>
      </ul>

      <div className="crx-chips">
        {clientActivityTypes.map((type) => (
          <span key={type}>{type}</span>
        ))}
      </div>

      <div className="crx-files">
        {clientFileFormats.map((format) => (
          <span key={format}>
            <FileText size={12} aria-hidden="true" />
            {format}
          </span>
        ))}
      </div>
    </StageShell>
  );
}

function CalendarStage() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const withAppt = new Set([4, 9, 12, 18, 23, 27]);

  return (
    <StageShell title="יומן התורים" meta="חלונות פנויים · תשלום">
      <div className="crx-calendar">
        <div className="crx-month">
          <div className="crx-month__head">
            <span>אוגוסט</span>
            <span>6 תורים</span>
          </div>
          <div className="crx-month__grid">
            {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((dow) => (
              <span key={dow} className="is-dow">
                {dow}
              </span>
            ))}
            {days.map((day) => (
              <span
                key={day}
                className={
                  day === 12
                    ? "is-today"
                    : withAppt.has(day)
                      ? "has-appt"
                      : undefined
                }
              >
                {day > 0 && day <= 31 ? day : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="crx-slots">
          <div className="crx-slots__row">
            {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"].map(
              (slot) => (
                <span
                  key={slot}
                  className={
                    slot === "10:00"
                      ? "is-picked"
                      : slot === "09:30"
                        ? "is-taken"
                        : undefined
                  }
                >
                  {slot}
                </span>
              ),
            )}
          </div>

          <div className="crx-appt">
            <div className="crx-appt__row">
              <span>שירות</span>
              <b>ייעוץ ראשוני</b>
            </div>
            <div className="crx-appt__row">
              <span>משך</span>
              <b>45 דקות</b>
            </div>
            <div className="crx-appt__row">
              <span>מחיר</span>
              <b>₪ 240</b>
            </div>
            <div className="crx-appt__row">
              <span>תשלום</span>
              <span className="crx-appt__paid">שולם</span>
            </div>
          </div>

          <div className="crx-task">
            <Clock size={16} aria-hidden="true" />
            אישור במייל נשלח ללקוח ולעסק מיד עם קביעת התור
          </div>
        </div>
      </div>
    </StageShell>
  );
}

function ServicesStage() {
  const services = [
    { name: "ייעוץ ראשוני", duration: "45 דק׳", price: "₪ 240" },
    { name: "טיפול מלא", duration: "90 דק׳", price: "₪ 480" },
    { name: "פגישת מעקב", duration: "30 דק׳", price: "₪ 160" },
    { name: "סדנה קבוצתית", duration: "120 דק׳", price: "₪ 320" },
  ];

  const hours = [
    { day: "ראשון", from: "09:00", to: "18:00", open: true, span: 0.75 },
    { day: "שני", from: "09:00", to: "18:00", open: true, span: 0.75 },
    { day: "שלישי", from: "10:00", to: "20:00", open: true, span: 0.85 },
    { day: "רביעי", from: "09:00", to: "16:00", open: true, span: 0.6 },
    { day: "חמישי", from: "09:00", to: "18:00", open: true, span: 0.75 },
    { day: "שישי", from: "09:00", to: "13:00", open: true, span: 0.35 },
    { day: "שבת", from: "—", to: "—", open: false, span: 0 },
  ];

  return (
    <StageShell title="שירותים ושעות פעילות" meta="הבסיס לזימון תורים">
      <ul className="crx-services">
        {services.map((service, index) => (
          <motion.li
            key={service.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
          >
            <b>{service.name}</b>
            <i>{service.duration}</i>
            <em>{service.price}</em>
          </motion.li>
        ))}
      </ul>

      <ul className="crx-hours">
        {hours.map((row, index) => (
          <li key={row.day} className={row.open ? undefined : "is-closed"}>
            <span>{row.day}</span>
            <span className="crx-hours__bar">
              <motion.span
                className="crx-hours__fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${row.span * 100}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  duration: 0.75,
                  delay: index * 0.06,
                  ease: EASE,
                }}
              />
            </span>
            <em>
              {row.from} – {row.to}
            </em>
          </li>
        ))}
      </ul>
    </StageShell>
  );
}

const ITEMS: ShowcaseItem[] = [
  {
    id: "lead",
    icon: ListChecks,
    title: "כרטיס ליד שמספר את כל הסיפור",
    text: "פרטי הפנייה והשדות מהטופס, תיעוד של הערות, שיחות ווואטסאפ, שינויי סטטוס אוטומטיים ומשימה עם תאריך ושעה שקופצת בהתראות כשעובר הזמן.",
    accent: "#7c3aed",
    render: () => <LeadStage />,
  },
  {
    id: "client",
    icon: UserRound,
    title: "תיק לקוח שממשיך אחרי הסגירה",
    text: "פרטי קשר, סטטוס מחושב לפי היסטוריית הפגישות, סך ההכנסות, ציר זמן תיעוד עם שבעה סוגי רשומות, העלאת מסמכים ושדות נתונים מותאמים.",
    accent: "#2563eb",
    render: () => <ClientStage />,
  },
  {
    id: "calendar",
    icon: CalendarClock,
    title: "יומן תורים שמחשב לבד מה פנוי",
    text: "לוח חודשי עם תצוגות היום, הנבחר והעתידי. החלונות הפנויים נגזרים משעות הפעילות וממשך השירות בקפיצות של 15 דקות, והתור נשמר עם מחיר וסטטוס תשלום.",
    accent: "#0891b2",
    render: () => <CalendarStage />,
  },
  {
    id: "services",
    icon: Clock,
    title: "שירותים ושעות פעילות במקום אחד",
    text: "קטלוג שירותים עם שם, תיאור, משך, מחיר ותמונה, ולוח שבועי של שעות פעילות. שניהם מזינים גם את היומן הפנימי וגם את עמוד הזימון ללקוחות.",
    accent: "#059669",
    render: () => <ServicesStage />,
  },
];

export default function CrmCapabilityShowcase() {
  return <StickyShowcase items={ITEMS} interval={7200} />;
}
