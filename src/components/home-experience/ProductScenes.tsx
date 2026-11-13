import type { CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { homeText } from "./homeCopy";

export type SceneId =
  | "lead"
  | "crm"
  | "whatsapp"
  | "inbox"
  | "task"
  | "automation"
  | "done"
  | "meta"
  | "calendar"
  | "advisor";

type Copy = {
  name: string;
  leadBody: string;
  leadStatus: string;
  pulseTitle: string;
  pulseRows: string[];
  pulseValues: string[];
  pulseNote: string;
  t: (hebrew: string, english: string) => string;
};

function useSceneCopy(): Copy {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const hero = cinematicFor(language).hero as {
    leadName?: string;
    leadBody?: string;
    leadStatus?: string;
    pulseTitle?: string;
    pulseRows?: string[];
    pulseValues?: string[];
    pulseNote?: string;
  };
  return {
    name: hero.leadName || "Dana Levi",
    leadBody: hero.leadBody || "",
    leadStatus: hero.leadStatus || "",
    pulseTitle: hero.pulseTitle || "",
    pulseRows: hero.pulseRows || [],
    pulseValues: hero.pulseValues || [],
    pulseNote: hero.pulseNote || "",
    t: (hebrew, english) => homeText(language, hebrew, english),
  };
}

function Dots() {
  return (
    <span className="ps-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function Window({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`ps-window ${className}`}>
      <header className="ps-window-bar">
        <Dots />
        <strong>{title}</strong>
      </header>
      <div className="ps-window-body">{children}</div>
    </section>
  );
}

function Lead({ copy }: { copy: Copy }) {
  const { t, name, leadBody, leadStatus } = copy;
  return (
    <div className="ps-grid ps-grid-lead">
      <Window title={t("לידים", "Leads")}>
        <article className="ps-row is-hot">
          <span className="ps-avatar" aria-hidden="true">{name.slice(0, 1)}</span>
          <span>
            <strong>{name}</strong>
            <small>{t("מקור בדיקה", "Test source")}</small>
          </span>
          <em>{leadStatus}</em>
        </article>
        <article className="ps-row">
          <span className="ps-avatar is-quiet" aria-hidden="true">2</span>
          <span>
            <strong>{t("טופס באתר", "Website form")}</strong>
            <small>{t("מקור נוסף ברשימה", "Another source on the list")}</small>
          </span>
          <em>{t("בטיפול", "In progress")}</em>
        </article>
        <article className="ps-row">
          <span className="ps-avatar is-quiet" aria-hidden="true">3</span>
          <span>
            <strong>{t("טופס Meta", "Meta form")}</strong>
            <small>{t("נכנס לרשימת הלידים", "Arrives on the lead list")}</small>
          </span>
          <em>{leadStatus}</em>
        </article>
      </Window>
      <Window title={t("כרטיס פתוח", "Open card")} className="ps-float">
        <p className="ps-kicker">{leadStatus}</p>
        <h3>{name}</h3>
        <p>{leadBody}</p>
        <ul className="ps-check">
          <li>
            <i aria-hidden="true" />
            <span>{t("רשימה", "List")}</span>
            <strong>{t("מופיע ברשימה", "Appears in the list")}</strong>
          </li>
          <li>
            <i aria-hidden="true" />
            <span>{t("כרטיס", "Record")}</span>
            <strong>{t("הכרטיס נפתח", "The card opens")}</strong>
          </li>
          <li>
            <i aria-hidden="true" />
            <span>{t("מקור", "Source")}</span>
            <strong>{t("המקור נשמר על הרשומה", "The source stays on the record")}</strong>
          </li>
        </ul>
      </Window>
    </div>
  );
}

function Crm({ copy }: { copy: Copy }) {
  const { t, name, pulseTitle, pulseRows, pulseValues, pulseNote } = copy;
  const steps = [t("חדש", "New"), t("מתעניין", "Interested"), t("פגישה", "Meeting")];
  return (
    <div className="ps-grid ps-grid-crm">
      <Window title={t("כרטיס לקוח", "Customer record")} className="ps-float">
        <div className="ps-person">
          <span className="ps-avatar" aria-hidden="true">{name.slice(0, 1)}</span>
          <span>
            <strong>{name}</strong>
            <small>{t("מקור בדיקה", "Test source")}</small>
          </span>
        </div>
        <ol className="ps-pipe">
          {steps.map((step, index) => (
            <li key={step} className={index === 1 ? "is-on" : undefined}>{step}</li>
          ))}
        </ol>
        <div className="ps-note">
          <span>{t("הערת שיחה", "Call note")}</span>
          <p>{t("שיחה. מתעניינת בשירות.", "Called. Interested in the service.")}</p>
          <small>{t("נשמר בהיסטוריית הלקוח", "Saved to the customer history")}</small>
        </div>
      </Window>
      <Window title={pulseTitle}>
        <ul className="ps-stats">
          {pulseRows.map((row, index) => (
            <li key={row}>
              <strong>{pulseValues[index]}</strong>
              <span>{row}</span>
            </li>
          ))}
        </ul>
        <p className="ps-disclaimer">{pulseNote}</p>
      </Window>
    </div>
  );
}

function Thread({ copy, demo }: { copy: Copy; demo: boolean }) {
  const { t, name } = copy;
  return (
    <div className="ps-grid ps-grid-wa">
      <Window title={t("תיבת שיחות", "Inbox")}>
        <article className="ps-row is-hot">
          <span className="ps-avatar is-wa" aria-hidden="true">{name.slice(0, 1)}</span>
          <span>
            <strong>{name}</strong>
            <small>{t("מחובר לכרטיס הלקוח", "Linked to the customer record")}</small>
          </span>
        </article>
        <article className="ps-row">
          <span className="ps-avatar is-quiet" aria-hidden="true">2</span>
          <span>
            <strong>{t("שיחה נוספת", "Another conversation")}</strong>
            <small>{t("תיבה משותפת לצוות", "Shared team inbox")}</small>
          </span>
        </article>
      </Window>
      <div className="ps-phone ps-float">
        <header className="ps-phone-bar">
          <strong>WhatsApp</strong>
          <small>{name}</small>
        </header>
        <div className="ps-thread">
          <p className="ps-bubble is-in">{t("שלום, שלחתי פנייה לגבי השירות.", "Hi, I sent an enquiry about the service.")}</p>
          <p className="ps-bubble is-out">{t("תודה. אפשר להציע זמן להמשך.", "Thanks. I can suggest a time to continue.")}</p>
        </div>
        <ul className="ps-chips">
          <li>{t("נשמר בשיחה", "Saved in this thread")}</li>
          {demo ? <li>{t("לא נשלח ללקוח אמיתי", "Not sent to a real person")}</li> : <li>{t("חלון 24 שעות", "24-hour window")}</li>}
        </ul>
      </div>
      <aside className="ps-stack">
        <p className="ps-chip-card">
          <span>{t("תבנית מעקב", "Follow-up template")}</span>
          <small>{t("תבנית מאושרת לשליחה יזומה", "An approved template for an outbound message")}</small>
        </p>
        <p className="ps-chip-card">
          <span>{t("נתוני שליחה", "Delivery data")}</span>
          <small>{t("נשלח, נקרא ותגובה", "Sent, read and reply")}</small>
        </p>
      </aside>
    </div>
  );
}

function Task({ copy }: { copy: Copy }) {
  const { t, name } = copy;
  return (
    <div className="ps-grid ps-grid-task">
      <Window title={t("משימת המשך", "Follow-up task")} className="ps-float">
        <p className="ps-kicker">{t("על כרטיס הלקוח", "On the customer record")}</p>
        <h3>{name}</h3>
        <p className="ps-when">{t("יום חמישי, 10:00", "Thursday, 10:00")}</p>
        <p>{t("המשימה נשמרת ומופיעה ברשימה.", "The task is saved and listed.")}</p>
      </Window>
      <Window title={t("הצעד הבא", "Next step")}>
        <ol className="ps-agenda">
          <li>
            <time>10:00</time>
            <span>{t("שיחת המשך", "Follow-up call")}</span>
          </li>
          <li className="is-quiet">
            <time>14:30</time>
            <span>{t("פגישה ביומן", "Calendar meeting")}</span>
          </li>
        </ol>
      </Window>
    </div>
  );
}

function Automation({ copy }: { copy: Copy }) {
  const { t } = copy;
  const nodes = [
    [t("טריגר", "Trigger"), t("הסטטוס עובר למתעניין", "Status moves to Interested")],
    [t("פעולה", "Action"), t("הוספת תגית", "Add a tag")],
    [t("פעולה", "Action"), t("רישום הערה", "Log a note")],
  ];
  return (
    <div className="ps-auto">
      <ol className="ps-flow">
        {nodes.map(([kicker, label]) => (
          <li key={label}>
            <span>{kicker}</span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>
      <p className="ps-result">
        <span>{t("הרצת בדיקה", "Test run")}</span>
        <strong>{t("בלי שליחת הודעות ובלי שינוי נתונים", "Sends nothing and changes no data")}</strong>
      </p>
    </div>
  );
}

function Done({ copy }: { copy: Copy }) {
  const { t, name } = copy;
  const rows = [
    [t("סטטוס", "Status"), t("מתעניין", "Interested")],
    [t("הערה", "Note"), t("נשמרה בהיסטוריה", "Saved to history")],
    [t("משימה", "Task"), t("יום חמישי, 10:00", "Thursday, 10:00")],
  ];
  return (
    <Window title={t("כרטיס מעודכן", "Updated record")} className="ps-float ps-done">
      <p className="ps-kicker">{name}</p>
      <h3>{t("הסטטוס, ההערה והמשימה שמורים", "Status, note and task are saved")}</h3>
      <ul className="ps-check">
        {rows.map(([label, value]) => (
          <li key={label}>
            <i aria-hidden="true" />
            <span>{label}</span>
            <strong>{value}</strong>
          </li>
        ))}
      </ul>
      <p className="ps-meta">{t("הצוות רואה את הצעד הבא", "The team can see the next step")}</p>
    </Window>
  );
}

function Meta({ copy }: { copy: Copy }) {
  const { t, name, pulseNote } = copy;
  const bars = [
    [t("הוצאה", "Spend"), "72%"],
    [t("לידים", "Leads"), "58%"],
    [t("עלות לליד", "Cost per lead"), "40%"],
    [t("חשיפה", "Reach"), "84%"],
  ];
  return (
    <div className="ps-grid ps-grid-meta">
      <Window title={t("קמפיין", "Campaign")}>
        <p className="ps-kicker">{t("פייסבוק ואינסטגרם", "Facebook and Instagram")}</p>
        <ul className="ps-bars">
          {bars.map(([label, width]) => (
            <li key={label}>
              <span>{label}</span>
              <i style={{ "--bar": width } as CSSProperties} />
            </li>
          ))}
        </ul>
        <p className="ps-disclaimer">{pulseNote}</p>
      </Window>
      <div className="ps-handoff">
        <p className="ps-chip-card">
          <span>{t("טופס Meta", "Meta form")}</span>
          <small>{name}</small>
        </p>
        <i className="ps-arrow" aria-hidden="true" />
        <p className="ps-chip-card ps-float">
          <span>{t("אל ה־CRM", "Into the CRM")}</span>
          <small>{t("מקור: Meta", "Source: Meta")}</small>
        </p>
      </div>
    </div>
  );
}

function Calendar({ copy }: { copy: Copy }) {
  const { i18n } = useTranslation();
  const { t, name } = copy;
  const language = i18n.language || "en";
  const days = [9, 10, 11, 12, 13].map((day) => ({
    day,
    label: new Intl.DateTimeFormat(language, { weekday: "short" }).format(new Date(2026, 10, day)),
    on: day === 12,
  }));
  return (
    <div className="ps-grid ps-grid-cal">
      <Window title={t("יומן", "Calendar")}>
        <p className="ps-kicker">{t("שעות פעילות", "Business hours")} · 09:00–17:00</p>
        <ol className="ps-week">
          {days.map((item) => (
            <li key={item.day} className={item.on ? "is-on" : undefined}>
              <span>{item.label}</span>
              <strong>{item.day}</strong>
            </li>
          ))}
        </ol>
        <div className="ps-slot">
          <time>10:00</time>
          <span>{name}</span>
          <small>{t("ייעוץ", "Consultation")} · {t("45 דק׳", "45 min")}</small>
        </div>
        <p className="ps-meta">{t("מרווחים של 15 דקות", "15-minute openings")}</p>
      </Window>
      <Window title={t("התור", "The booking")} className="ps-float">
        <p className="ps-kicker">{t("עמוד הזמנה ציבורי", "Public booking page")}</p>
        <h3>{name}</h3>
        <ul className="ps-check">
          <li>
            <i aria-hidden="true" />
            <span>{t("שירות", "Service")}</span>
            <strong>{t("ייעוץ", "Consultation")}</strong>
          </li>
          <li>
            <i aria-hidden="true" />
            <span>{t("סטטוס תשלום", "Payment status")}</span>
            <strong>{t("לא שולם", "Unpaid")}</strong>
          </li>
          <li>
            <i aria-hidden="true" />
            <span>{t("כרטיס", "Record")}</span>
            <strong>{t("מחובר ללקוח", "Tied to the customer")}</strong>
          </li>
        </ul>
      </Window>
    </div>
  );
}

function Advisor({ copy }: { copy: Copy }) {
  const { t, name } = copy;
  const templates = [
    t("דירוג וסיווג", "Score and classify"),
    t("ליד חם", "Hot lead"),
    t("סיכום לפני שיחה", "Summary before a call"),
    t("טיוטת מעקב", "Draft a follow-up"),
  ];
  return (
    <div className="ps-grid ps-grid-ai">
      <Window title={t("היועץ העסקי", "Business Advisor")} className="ps-float">
        <p className="ps-kicker">{t("מייעץ. לא מבצע את הפעולה.", "Suggests. Does not take the action.")}</p>
        <article className="ps-advice">
          <span>{t("דורש מענה", "Needs a reply")}</span>
          <strong>{name}</strong>
          <p>{t("אין תשובה עדיין. כדאי להכין טיוטת מעקב.", "No reply yet. A follow-up is worth drafting.")}</p>
        </article>
        <article className="ps-advice">
          <span>{t("טיוטת מעקב", "Draft follow-up")}</span>
          <p>{t("טיוטה בלבד. נשארת להחלטת הצוות.", "A draft only. It stays for the team to decide.")}</p>
        </article>
      </Window>
      <Window title={t("תבניות AI", "AI templates")}>
        <ul className="ps-templates">
          {templates.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="ps-disclaimer">{t("בודקים כל תבנית לפני שמפעילים.", "Review each template before turning it on.")}</p>
      </Window>
    </div>
  );
}

export default function ProductScene({ scene, fit = false }: { scene: SceneId; fit?: boolean }) {
  const copy = useSceneCopy();
  return (
    <div className={`ps-stage${fit ? " is-fit" : " is-feature"}`} data-scene={scene} aria-hidden="true">
      <div className="ps-canvas" key={scene}>
        {scene === "lead" ? <Lead copy={copy} /> : null}
        {scene === "crm" ? <Crm copy={copy} /> : null}
        {scene === "whatsapp" ? <Thread copy={copy} demo /> : null}
        {scene === "inbox" ? <Thread copy={copy} demo={false} /> : null}
        {scene === "task" ? <Task copy={copy} /> : null}
        {scene === "automation" ? <Automation copy={copy} /> : null}
        {scene === "done" ? <Done copy={copy} /> : null}
        {scene === "meta" ? <Meta copy={copy} /> : null}
        {scene === "calendar" ? <Calendar copy={copy} /> : null}
        {scene === "advisor" ? <Advisor copy={copy} /> : null}
      </div>
    </div>
  );
}
