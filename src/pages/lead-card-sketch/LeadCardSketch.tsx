import { useState } from "react";
import { Helmet } from "react-helmet-async";
import "../../styles/homeExperience.css";
import "./leadCardSketch.css";

type Lang = "he" | "en";
type Action = "whatsapp" | "task" | "meeting";

type Result = { kicker: string; title: string; body: string };

type Copy = {
  pageTitle: string;
  review: string;
  heroNote: string;
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
  hero: { kicker: string; lineOne: string; lineTwo: string; lead: string; see: string };
};

const COPY: Record<Lang, Copy> = {
  he: {
    pageTitle: "סקיצת כרטיס ליד | BizUply",
    review: "סקיצה לאישור. לא באתר הפעיל.",
    heroNote: "כך הכרטיס יושב בתוך ה־Hero הקיים. הכותרת והכפתור של ה־Hero לא משתנים.",
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
    hero: {
      kicker: "BizUply | CRM חכם לעסקים בצמיחה",
      lineOne: "העסק שלכם.",
      lineTwo: "עובד חכם יותר.",
      lead: "CRM, תקשורת עם לקוחות ב־WhatsApp, אוטומציות חכמות, ניהול פגישות ודוחות — בפלטפורמה אחת שמקדמת את העסק שלכם.",
      see: "קבעו הדגמה אישית",
    },
  },
  en: {
    pageTitle: "Lead card sketch | BizUply",
    review: "Sketch for approval. Not on the live site.",
    heroNote: "The card sits inside the current Hero. The Hero headline and button stay as they are.",
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
    hero: {
      kicker: "BizUply | Smart CRM for growing businesses",
      lineOne: "Your business.",
      lineTwo: "Working smarter.",
      lead: "CRM, customer communication on WhatsApp, smart automations, meeting management and reports — in one platform that moves your business forward.",
      see: "Schedule a personal demo",
    },
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

function LeadDemo({
  copy,
  action,
  onAction,
  onRestart,
}: {
  copy: Copy;
  action: Action | null;
  onAction: (action: Action) => void;
  onRestart: () => void;
}) {
  const result = action ? copy.results[action] : copy.empty;
  const contacted = action === "whatsapp";
  return (
    <div className="lcs-demo">
      <h2 className="lcs-title">
        <span>{copy.title[0]}</span>
        <span>{copy.title[1]}</span>
      </h2>
      <article className="lcs-card" aria-label={copy.name}>
        <div className="lcs-top">
          <span className="lcs-crm">{copy.crm}</span>
          <span className="lcs-source">{copy.source}</span>
        </div>
        <h3 className="lcs-name">{copy.name}</h3>
        <p className={`lcs-status${contacted ? " is-contact" : ""}`}>
          {contacted ? copy.statusContact : copy.statusNew}
        </p>
        <div className="lcs-actions">
          {copy.actions.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className="lcs-action"
                data-action={item.id}
                aria-pressed={action === item.id}
                onClick={() => onAction(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className={`lcs-result${action ? " is-set" : ""}`} aria-live="polite">
          {result.kicker ? <p className="lcs-kicker">{result.kicker}</p> : null}
          <p className="lcs-result-title">{result.title}</p>
          <p className="lcs-result-body">{result.body}</p>
        </div>
        <button type="button" className="lcs-restart" onClick={onRestart} disabled={!action}>
          {copy.restart}
        </button>
        <p className="lcs-local">{copy.local}</p>
      </article>
    </div>
  );
}

function HeroLine({ text, hot = -1 }: { text: string; hot?: number }) {
  const words = text.split(" ");
  return (
    <span className="hx-line">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className={index === hot ? "hx-word is-hot" : "hx-word"}>
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export default function LeadCardSketch() {
  const [lang, setLang] = useState<Lang>("he");
  const [action, setAction] = useState<Action | null>(null);
  const copy = COPY[lang];
  const dir = lang === "he" ? "rtl" : "ltr";

  function chooseLanguage(next: Lang) {
    setLang(next);
    setAction(null);
  }

  return (
    <div className="lcs" dir={dir} lang={lang}>
      <Helmet>
        <title>{copy.pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="lcs-bar">
        <p>{copy.review}</p>
        <div className="lcs-langs" role="group" aria-label={lang === "he" ? "שפה" : "Language"}>
          <button type="button" aria-pressed={lang === "he"} onClick={() => chooseLanguage("he")}>
            עברית
          </button>
          <button type="button" aria-pressed={lang === "en"} onClick={() => chooseLanguage("en")}>
            English
          </button>
        </div>
      </header>

      <section id="lead-demo" aria-label={copy.title.join(" ")}>
        <LeadDemo copy={copy} action={action} onAction={setAction} onRestart={() => setAction(null)} />
      </section>

      <p className="lcs-hero-note">{copy.heroNote}</p>
      <section className="hx-page" id="lead-hero">
        <div className="hx-hero">
          <div className="hx-geo hx-geo-a" aria-hidden="true" />
          <div className="hx-geo hx-geo-b" aria-hidden="true" />
          <div className="hx-geo hx-geo-c" aria-hidden="true" />
          <div className="hx-hero-pin">
            <div className="hx-hero-copy">
              <p className="hx-hero-kicker">{copy.hero.kicker}</p>
              <h1 className="hx-display">
                <HeroLine text={copy.hero.lineOne} />
                <HeroLine text={copy.hero.lineTwo} hot={copy.hero.lineTwo.split(" ").length - 1} />
              </h1>
              <p className="hx-lead">{copy.hero.lead}</p>
              <div className="hx-actions">
                <a className="hx-btn hx-btn-line" href="#lead-hero" onClick={(event) => event.preventDefault()}>
                  {copy.hero.see}
                  <i />
                </a>
              </div>
            </div>
          </div>
          <div className="hx-hero-stage">
            <div className="hx-hero-stage-inner">
              <LeadDemo copy={copy} action={action} onAction={setAction} onRestart={() => setAction(null)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
