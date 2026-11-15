import { useState } from "react";

type Action = "whatsapp" | "task" | "meeting";
type Result = { kicker: string; title: string; body: string };

type Copy = {
  title: [string, string];
  crm: string;
  source: string;
  name: string;
  statusNew: string;
  statusContact: string;
  actions: { id: Action; label: string }[];
  empty: Result;
  results: Record<Action, Result>;
  restart: string;
  local: string;
};

const COPY: Record<"he" | "en", Copy> = {
  he: {
    title: ["ליד חדש.", "הזדמנות חדשה."],
    crm: "CRM",
    source: "Meta",
    name: "נועה לוי",
    statusNew: "ליד חדש",
    statusContact: "נוצר קשר",
    actions: [
      { id: "whatsapp", label: "WhatsApp" },
      { id: "task", label: "יצירת משימה" },
      { id: "meeting", label: "קביעת פגישה" },
    ],
    empty: { kicker: "", title: "בחרו פעולה", body: "התוצאה תופיע כאן." },
    results: {
      whatsapp: {
        kicker: "הודעת הדגמה",
        title: "נוצר קשר",
        body: "שלום נועה, ראינו את הפנייה מ־Meta. נשמח לעזור.",
      },
      task: {
        kicker: "משימה בהדגמה",
        title: "משימת מעקב נוצרה",
        body: "לחזור אל נועה לוי מחר ב־10:00.",
      },
      meeting: {
        kicker: "אישור בהדגמה",
        title: "הפגישה נקבעה",
        body: "מחר ב־11:00, שיחת היכרות עם נועה לוי.",
      },
    },
    restart: "התחלה מחדש",
    local: "הדגמה מקומית בלבד. לא נשלח דבר.",
  },
  en: {
    title: ["A new lead.", "A new opportunity."],
    crm: "CRM",
    source: "Meta",
    name: "Claire Bennett",
    statusNew: "New lead",
    statusContact: "Contacted",
    actions: [
      { id: "whatsapp", label: "WhatsApp" },
      { id: "task", label: "Create task" },
      { id: "meeting", label: "Schedule meeting" },
    ],
    empty: { kicker: "", title: "Choose an action", body: "The result appears here." },
    results: {
      whatsapp: {
        kicker: "Demo message",
        title: "Contacted",
        body: "Hi Claire, we saw your Meta enquiry. Happy to help.",
      },
      task: {
        kicker: "Demo task",
        title: "Follow-up task created",
        body: "Call Claire Bennett tomorrow at 10:00.",
      },
      meeting: {
        kicker: "Demo confirmation",
        title: "Meeting confirmed",
        body: "Tomorrow at 11:00, an intro call with Claire Bennett.",
      },
    },
    restart: "Start over",
    local: "Local demo only. Nothing is sent.",
  },
};

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6.5h14v9H8.2L5 18.2V6.5Z" />
    </svg>
  );
}

function TaskIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.5h10v15H7v-15Z" />
      <path d="M9.2 9.2h5.6M9.2 12.4h5.6M9.2 15.6h3.4" />
    </svg>
  );
}

function MeetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 7.5h13v11h-13v-11Z" />
      <path d="M5.5 11h13M9 5.5v3.2M15 5.5v3.2" />
    </svg>
  );
}

const ICONS = { whatsapp: ChatIcon, task: TaskIcon, meeting: MeetIcon };

export default function MobileLeadCard({ language }: { language: string }) {
  const copy = language.startsWith("he") ? COPY.he : COPY.en;
  const [action, setAction] = useState<Action | null>(null);
  const result = action ? copy.results[action] : copy.empty;
  const contacted = action === "whatsapp";
  return (
    <div className="hx-mlead">
      <h2 className="hx-mlead-title">
        <span>{copy.title[0]}</span>
        <span>{copy.title[1]}</span>
      </h2>
      <article className="hx-mlead-card" aria-label={copy.name}>
        <div className="hx-mlead-top">
          <span className="hx-mlead-crm">{copy.crm}</span>
          <span className="hx-mlead-source">{copy.source}</span>
        </div>
        <h3 className="hx-mlead-name">{copy.name}</h3>
        <p className={`hx-mlead-status${contacted ? " is-contact" : ""}`}>
          {contacted ? copy.statusContact : copy.statusNew}
        </p>
        <div className="hx-mlead-actions">
          {copy.actions.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className="hx-mlead-action"
                aria-pressed={action === item.id}
                onClick={() => setAction(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className={`hx-mlead-result${action ? " is-set" : ""}`} aria-live="polite">
          {result.kicker ? <p className="hx-mlead-kicker">{result.kicker}</p> : null}
          <p className="hx-mlead-result-title">{result.title}</p>
          <p className="hx-mlead-result-body">{result.body}</p>
        </div>
        <button type="button" className="hx-mlead-restart" onClick={() => setAction(null)} disabled={!action}>
          {copy.restart}
        </button>
        <p className="hx-mlead-local">{copy.local}</p>
      </article>
    </div>
  );
}
