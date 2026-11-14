import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./customerJourney.css";

type TextFn = (hebrew: string, english: string) => string;
type StepId = "meta" | "crm" | "whatsapp" | "automation" | "ai" | "calendar";
type StatusId = "new" | "contacted" | "interested";

type DemoState = {
  leadCaptured: boolean;
  crmOpen: boolean;
  status: StatusId;
  replied: boolean;
  automation: boolean;
  draftReady: boolean;
  draftSaved: boolean;
  slot: string;
  meeting: string | null;
};

const STEPS: StepId[] = ["meta", "crm", "whatsapp", "automation", "ai", "calendar"];
const PHONE = "050-123-4587";
const EMAIL = "noa.levi@gmail.com";
const INITIAL: DemoState = {
  leadCaptured: false,
  crmOpen: false,
  status: "new",
  replied: false,
  automation: false,
  draftReady: false,
  draftSaved: false,
  slot: "thu-1030",
  meeting: null,
};

const SLOTS = [
  { id: "thu-1030", he: "יום ה׳ · 10:30", en: "Thursday · 10:30" },
  { id: "thu-1600", he: "יום ה׳ · 16:00", en: "Thursday · 16:00" },
  { id: "sun-1100", he: "יום א׳ · 11:00", en: "Sunday · 11:00" },
] as const;

function useLabels() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  return { text, dir: getTextDirection(language) };
}

function statusLabel(text: TextFn, status: StatusId, meeting: string | null) {
  if (meeting) return text("נקבעה פגישה", "Meeting booked");
  if (status === "contacted") return text("נוצר קשר", "Contacted");
  if (status === "interested") return text("מעוניין", "Interested");
  return text("חדש", "New");
}

function customerName(text: TextFn) {
  return text("נועה לוי", "Noa Levi");
}

function Arrow() {
  return <i className="bj-arrow" aria-hidden="true" />;
}

function Mark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.2 8.2 6.4 11.4 12.8 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SideIcon({ id }: { id: string }) {
  const pen = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, "aria-hidden": true as const };
  if (id === "home") return <svg {...pen}><path d="M3 7.2 8 3.2l5 4V13H3Z" /></svg>;
  if (id === "crm") return <svg {...pen}><circle cx="8" cy="5.2" r="2" /><path d="M3.5 13c.6-2.2 2.2-3.2 4.5-3.2s3.9 1 4.5 3.2" /></svg>;
  if (id === "auto") return <svg {...pen}><path d="M3 8h10M8 3v10" /></svg>;
  if (id === "ai") return <svg {...pen}><path d="M8 2.8 9.2 6.4 13 8 9.2 9.6 8 13.2 6.8 9.6 3 8l3.8-1.6Z" /></svg>;
  return <svg {...pen}><rect x="3" y="3.5" width="10" height="9" rx="1.2" /><path d="M3 6.2h10M6 2.8v2M10 2.8v2" /></svg>;
}

function ProductNav({ step, text }: { step: StepId | "summary"; text: TextFn }) {
  const active = step === "automation" ? "auto" : step === "ai" ? "ai" : step === "calendar" ? "cal" : "crm";
  const items = [
    ["home", text("דף הבית", "Home")],
    ["crm", text("CRM ולידים", "CRM and leads")],
    ["auto", text("אוטומציות", "Automations")],
    ["ai", text("AI ותובנות", "AI and insights")],
    ["cal", text("יומן ופגישות", "Calendar")],
  ];
  return (
    <aside className="bj-side" aria-hidden="true">
      <strong className="bj-logo">Bizuply</strong>
      {items.map(([id, label]) => (
        <span key={id} className={id === active ? "is-on" : undefined}>
          <SideIcon id={id} />
          {label}
        </span>
      ))}
    </aside>
  );
}

function Who({ text, demo }: { text: TextFn; demo: DemoState }) {
  return (
    <div className="bj-who">
      <b aria-hidden="true">{text("נ", "N")}</b>
      <span>
        <strong>{customerName(text)}</strong>
        <bdi dir="ltr">{PHONE}</bdi>
      </span>
      <em className="bj-status">{statusLabel(text, demo.status, demo.meeting)}</em>
    </div>
  );
}

function Notice({ children }: { children: string }) {
  if (!children) return null;
  return <p className="bj-note" role="status">{children}</p>;
}

function MetaScene({ text, demo, onCapture }: { text: TextFn; demo: DemoState; onCapture: () => void }) {
  const rows = [
    { title: text("ליד חדש נקלט", "New lead captured"), detail: customerName(text), done: demo.leadCaptured },
    { title: text("יצירת כרטיס CRM", "CRM record created"), detail: demo.crmOpen ? text("פתוח", "Open") : text("בתהליך", "In progress"), done: demo.crmOpen },
    { title: text("הפעלת תהליך אוטומטי", "Automation started"), detail: text("שליחת הודעה ב־WhatsApp", "WhatsApp message"), done: demo.automation },
  ];
  return (
    <>
      <div className="bj-scene-head">
        <h3>{text("ליד חדש נכנס למערכת", "A new lead entered the system")}</h3>
        <span className="bj-badge">{text("קמפיין לידים · Meta Ads", "Lead campaign · Meta Ads")}</span>
      </div>
      <div className="bj-meta">
        <article className="bj-meta-card">
          <div className="bj-brand-row">
            <strong className="bj-meta-word">Meta</strong>
            <span className="bj-ads">Meta Ads</span>
          </div>
          <h3>{text("טופס לידים", "Lead form")}</h3>
          <div className="bj-form-person">
            <b aria-hidden="true">{text("נ", "N")}</b>
            <span><strong>{customerName(text)}</strong></span>
          </div>
          <p className="bj-field"><bdi dir="ltr">{PHONE}</bdi></p>
          <p className="bj-field"><bdi dir="ltr">{EMAIL}</bdi></p>
          <button type="button" className="bj-action" onClick={onCapture} disabled={demo.leadCaptured}>
            {demo.leadCaptured ? text("הפרטים נקלטו", "Details captured") : text("שליחת פרטים", "Send details")}
            <Mark />
          </button>
        </article>
        <span className="bj-chevron" aria-hidden="true">‹</span>
        <article className="bj-meta-card">
          <h3>{text("העברה ל־CRM", "Passed into the CRM")}</h3>
          <ol className="bj-steps">
            {rows.map((row) => (
              <li key={row.title} className={row.done ? "is-done" : undefined}>
                <b />
                <span>
                  <strong>{row.title}</strong>
                  <small className="bj-muted">{row.detail}</small>
                </span>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </>
  );
}

function CrmScene({ text, demo, onOpen, onStatus }: { text: TextFn; demo: DemoState; onOpen: () => void; onStatus: (status: StatusId) => void }) {
  const statuses: StatusId[] = ["new", "contacted", "interested"];
  return (
    <>
      <Who text={text} demo={demo} />
      <article className="bj-card-block">
        <p className="bj-muted">{demo.leadCaptured ? text("מקור · Meta Lead Ads", "Source · Meta Lead Ads") : text("ממתין לקליטה מהקמפיין", "Waiting for campaign intake")}</p>
        <h3>{customerName(text)}</h3>
        {!demo.crmOpen ? (
          <button type="button" className="bj-action" onClick={onOpen}>{text("פתיחת כרטיס", "Open the record")}</button>
        ) : (
          <>
            <dl className="bj-facts">
              <div><dt>{text("טלפון", "Phone")}</dt><dd><bdi dir="ltr">{PHONE}</bdi></dd></div>
              <div><dt>{text("אימייל", "Email")}</dt><dd><bdi dir="ltr">{EMAIL}</bdi></dd></div>
              <div><dt>{text("סטטוס", "Status")}</dt><dd>{statusLabel(text, demo.status, null)}</dd></div>
              {demo.meeting ? <div><dt>{text("פגישה", "Meeting")}</dt><dd>{SLOTS.find((item) => item.id === demo.meeting) ? text(SLOTS.find((item) => item.id === demo.meeting)!.he, SLOTS.find((item) => item.id === demo.meeting)!.en) : ""}</dd></div> : null}
            </dl>
            <div className="bj-status-row" role="group" aria-label={text("עדכון סטטוס", "Update status")}>
              {statuses.map((status) => (
                <button key={status} type="button" className={demo.status === status ? "bj-choice is-on" : "bj-choice"} aria-pressed={demo.status === status} onClick={() => onStatus(status)}>
                  {statusLabel(text, status, null)}
                </button>
              ))}
            </div>
          </>
        )}
      </article>
    </>
  );
}

function WhatsAppScene({ text, demo, onReply }: { text: TextFn; demo: DemoState; onReply: () => void }) {
  return (
    <>
      <Who text={text} demo={demo} />
      <div className="bj-chat">
        <header>
          <strong>{customerName(text)}</strong>
          <span className="bj-muted">{text("חלון 24 השעות · הדגמה", "24-hour window · demo")}</span>
        </header>
        <div className="bj-log">
          <p>{text("היי, ראיתי את המודעה. אפשר לשמוע פרטים?", "Hi, I saw the ad. Can I hear the details?")} <small>09:18</small></p>
          {demo.replied ? (
            <p className="is-out">
              {text("היי נועה, תודה שפנית. נשלח פרטים ונתאם שיחה קצרה.", "Hi Noa, thanks for writing. We'll send details and set a short call.")}
              <small>{text("נשמר בהדגמה · לא נשלח", "Saved in the demo · not sent")}</small>
            </p>
          ) : null}
        </div>
        <button type="button" className="bj-action" onClick={onReply} disabled={demo.replied}>
          {demo.replied ? text("התשובה נשמרה", "Reply saved") : text("שליחת תשובה", "Send a reply")}
        </button>
      </div>
    </>
  );
}

function AutomationScene({ text, demo, onRun }: { text: TextFn; demo: DemoState; onRun: () => void }) {
  const nodes = [
    [text("טריגר", "Trigger"), text("ליד חדש", "New lead")],
    [text("תנאי", "Condition"), text("המקור הוא Meta", "Source is Meta")],
    [text("תוצאה", "Result"), text("משימת המשך ב־CRM", "A follow-up task in the CRM")],
  ];
  return (
    <>
      <Who text={text} demo={demo} />
      <div className="bj-flow">
        {nodes.map(([kind, label], index) => (
          <article key={kind} className={demo.automation || index === 0 ? "bj-node is-on" : "bj-node"}>
            <small>{index + 1} · {kind}</small>
            <strong>{label}</strong>
          </article>
        ))}
      </div>
      <button type="button" className="bj-action" onClick={onRun} disabled={demo.automation}>
        {demo.automation ? text("האוטומציה רצה", "Automation ran") : text("הרצת אוטומציה", "Run automation")}
      </button>
      {demo.automation ? <p className="bj-note">{text("נוצרה משימה לנועה לוי. לא נשלחה הודעה ולא שונו נתונים אמיתיים.", "A task was created for Noa Levi. No message was sent and no live data changed.")}</p> : null}
    </>
  );
}

function AiScene({ text, demo, onDraft, onSave }: { text: TextFn; demo: DemoState; onDraft: () => void; onSave: () => void }) {
  const draft = text(
    "היי נועה, ראינו את הפנייה מהקמפיין. נשמח לקבוע שיחת היכרות קצרה השבוע.",
    "Hi Noa, we saw the enquiry from the campaign. We'd like to set a short intro call this week.",
  );
  return (
    <>
      <Who text={text} demo={demo} />
      <article className="bj-card-block">
        <p className="bj-muted">{text("תובנה", "Insight")}</p>
        <h3>{text("נועה ממתינה לשיחת היכרות", "Noa is waiting for an intro call")}</h3>
        <p className={demo.draftReady ? "bj-draft" : "bj-draft"}>{demo.draftReady ? draft : text("היועץ מכין טיוטה. הוא לא שולח אותה.", "The advisor prepares a draft. It does not send it.")}</p>
        <div className="bj-actions-row">
          <button type="button" className="bj-action" onClick={onDraft} disabled={demo.draftReady}>{text("יצירת טיוטה", "Create a draft")}</button>
          <button type="button" className="bj-action is-line" onClick={onSave} disabled={!demo.draftReady || demo.draftSaved}>
            {demo.draftSaved ? text("הטיוטה נשמרה", "Draft saved") : text("שמירת טיוטה", "Save the draft")}
          </button>
        </div>
      </article>
    </>
  );
}

function CalendarScene({ text, demo, onPick, onBook }: { text: TextFn; demo: DemoState; onPick: (id: string) => void; onBook: () => void }) {
  return (
    <>
      <Who text={text} demo={demo} />
      <article className="bj-card-block">
        <p className="bj-muted">{text("שיחת היכרות · השבוע בהדגמה", "Intro call · this demo week")}</p>
        <h3>{text("חלון פנוי לנועה", "An open window for Noa")}</h3>
        <div className="bj-slots" role="listbox" aria-label={text("שעות", "Times")}>
          {SLOTS.map((slot) => (
            <button key={slot.id} type="button" role="option" aria-selected={demo.slot === slot.id} className={demo.slot === slot.id ? "bj-slot is-on" : "bj-slot"} onClick={() => onPick(slot.id)}>
              {text(slot.he, slot.en)}
            </button>
          ))}
        </div>
        <button type="button" className="bj-action" onClick={onBook}>
          {demo.meeting ? text("עדכון הפגישה", "Update the meeting") : text("קביעת פגישה", "Book a meeting")}
        </button>
      </article>
    </>
  );
}

function SummaryScene({ text, demo }: { text: TextFn; demo: DemoState }) {
  const slot = SLOTS.find((item) => item.id === demo.meeting);
  const rows = [
    [text("קליטת ליד מ־Meta", "Lead captured from Meta"), demo.leadCaptured ? text("נקלט", "Captured") : text("לא בוצע", "Not done")],
    [text("כרטיס CRM", "CRM record"), demo.crmOpen ? statusLabel(text, demo.status, null) : text("לא נפתח", "Not opened")],
    [text("תגובת WhatsApp", "WhatsApp reply"), demo.replied ? text("נשמרה בהדגמה", "Saved in the demo") : text("לא נשלחה", "Not sent")],
    [text("אוטומציה", "Automation"), demo.automation ? text("רצה מקומית", "Ran locally") : text("לא הורצה", "Not run")],
    [text("טיוטת AI", "AI draft"), demo.draftSaved ? text("נשמרה", "Saved") : demo.draftReady ? text("נוצרה ולא נשמרה", "Created, not saved") : text("לא נוצרה", "Not created")],
    [text("פגישה ביומן", "Calendar meeting"), slot ? text(slot.he, slot.en) : text("לא נקבעה", "Not booked")],
  ];
  return (
    <div className="bj-summary">
      <h3>{text("המסע של נועה לוי", "Noa Levi's journey")}</h3>
      <p className="bj-muted">{text("אותה לקוחה, מהקמפיין ועד היומן. הכול נשאר בהדגמה המקומית.", "The same customer, from the campaign to the calendar. Everything stays in the local demo.")}</p>
      <ul>
        {rows.map(([label, value]) => (
          <li key={label}><span>{label}</span><em>{value}</em></li>
        ))}
      </ul>
    </div>
  );
}

function brief(text: TextFn, step: StepId, demo: DemoState) {
  const name = customerName(text);
  if (step === "meta") {
    return {
      kicker: text("שלב ראשון · Meta וקמפיינים", "Step one · Meta and campaigns"),
      title: text("הקמפיין פוגש את נועה.", "The campaign meets Noa."),
      body: text("מודעת לידים פעילה מביאה את נועה לוי להשאיר פרטים, והליד נכנס למערכת Bizuply.", "An active lead ad brings Noa Levi in, and the lead enters Bizuply."),
      points: [
        [text("מודעת לידים אקטיבית", "An active lead ad"), true],
        [text("קליטה אוטומטית למערכת", "Automatic intake into the system"), demo.leadCaptured],
        [text("יצירת כרטיס CRM לנועה לוי", "A CRM record for Noa Levi"), demo.crmOpen],
      ],
    };
  }
  if (step === "crm") {
    return {
      kicker: text("שלב שני · CRM וקליטת ליד", "Step two · CRM and lead intake"),
      title: text("כרטיס אחד לנועה.", "One record for Noa."),
      body: text("פותחים את הכרטיס ומעדכנים סטטוס. ההמשך נשאר על אותה לקוחה.", "Open the record and update the status. The rest of the journey stays on the same customer."),
      points: [
        [text("כרטיס נועה לוי פתוח", "Noa Levi's record is open"), demo.crmOpen],
        [text("הסטטוס עודכן", "The status was updated"), demo.status !== "new"],
        [text("המקור נשאר Meta", "The source stays Meta"), demo.leadCaptured],
      ],
    };
  }
  if (step === "whatsapp") {
    return {
      kicker: text("שלב שלישי · WhatsApp Business API", "Step three · WhatsApp Business API"),
      title: text("התשובה נשארת על הכרטיס.", "The reply stays on the record."),
      body: text("נועה כתבה אחרי המודעה. התשובה נשמרת בהדגמה על אותו כרטיס, בלי שליחה אמיתית.", "Noa wrote after the ad. The reply is saved on the same record in the demo, and nothing is actually sent."),
      points: [
        [text("שיחה מחוברת לכרטיס", "A thread linked to the record"), true],
        [text("תשובה בהדגמה המקומית", "A reply in the local demo"), demo.replied],
        [text("הסטטוס מתעדכן", "The status updates"), demo.replied || demo.status !== "new"],
      ],
    };
  }
  if (step === "automation") {
    return {
      kicker: text("שלב רביעי · אוטומציות", "Step four · Automations"),
      title: text("תהליך שממשיך לבד.", "A flow that continues on its own."),
      body: text("ליד חדש שמקורו Meta מקבל משימת המשך. ההרצה לא שולחת הודעה ולא משנה נתונים אמיתיים.", "A new lead from Meta gets a follow-up task. The run sends no message and changes no live data."),
      points: [
        [text("טריגר של ליד חדש", "A new-lead trigger"), true],
        [text("תנאי: המקור הוא Meta", "Condition: the source is Meta"), true],
        [text("משימה על הכרטיס של נועה", "A task on Noa's record"), demo.automation],
      ],
    };
  }
  if (step === "ai") {
    return {
      kicker: text("שלב חמישי · AI ותובנות", "Step five · AI and insights"),
      title: text("תובנה, ואז טיוטה.", "An insight, then a draft."),
      body: text(`${name} ממתינה לשיחה. היועץ מכין טיוטה, והשמירה נשארת בהדגמה.`, `${name} is waiting for a call. The advisor prepares a draft, and saving stays inside the demo.`),
      points: [
        [text("תובנה על נועה לוי", "An insight about Noa Levi"), true],
        [text("טיוטה שנוצרה", "A draft that was created"), demo.draftReady],
        [text("טיוטה שנשמרה מקומית", "A draft saved locally"), demo.draftSaved],
      ],
    };
  }
  return {
    kicker: text("שלב שישי · יומן ופגישות", "Step six · Calendar and meetings"),
    title: text("הפגישה נכנסת ליומן.", "The meeting enters the calendar."),
    body: text("קובעים לנועה שיחת היכרות. הפגישה נשמרת על הכרטיס בהדגמה.", "Book an intro call for Noa. The meeting is saved on the record in the demo."),
    points: [
      [text("חלון פנוי ביומן", "An open window on the calendar"), true],
      [text("שיחת היכרות לנועה לוי", "An intro call for Noa Levi"), Boolean(demo.meeting)],
      [text("הפגישה שמורה על הכרטיס", "The meeting is stored on the record"), Boolean(demo.meeting)],
    ],
  };
}

function Panel({
  text,
  step,
  demo,
  summary,
  onRestart,
}: {
  text: TextFn;
  step: StepId;
  demo: DemoState;
  summary: boolean;
  onRestart: () => void;
}) {
  if (summary) {
    return (
      <aside className="bj-panel">
        <p className="bj-panel-kicker">{text("סיכום המסע", "Journey summary")}</p>
        <h3>{text("נועה עברה את הדרך.", "Noa made it through.")}</h3>
        <p>{text("אפשר לחזור לכל שלב בלי לאבד את מה שכבר נעשה, או לפתוח מסע חדש מאותה נקודה.", "Go back to any step without losing what already happened, or start a new journey from the same point.")}</p>
        <button type="button" className="bj-restart" onClick={onRestart}>{text("התחלת מסע חדש", "Start a new journey")}</button>
      </aside>
    );
  }
  const copy = brief(text, step, demo);
  const index = STEPS.indexOf(step);
  return (
    <aside className="bj-panel">
      <div className="bj-panel-top">
        <p className="bj-panel-kicker">{copy.kicker}</p>
        <b className="bj-panel-num">{String(index + 1).padStart(2, "0")}</b>
      </div>
      <h3>{copy.title}</h3>
      <p>{copy.body}</p>
      <ul className="bj-checks">
        {copy.points.map(([label, done]) => (
          <li key={String(label)} className={done ? "is-done" : undefined}>
            <i aria-hidden="true">{done ? "✓" : ""}</i>
            {label}
          </li>
        ))}
      </ul>
      <Link className="bj-discover" to="/register">
        <span>{text("לגלות את Bizuply", "Discover Bizuply")}</span>
        <Arrow />
      </Link>
    </aside>
  );
}

function Scene({
  text,
  step,
  summary,
  demo,
  setDemo,
  notice,
  setNotice,
}: {
  text: TextFn;
  step: StepId;
  summary: boolean;
  demo: DemoState;
  setDemo: (patch: Partial<DemoState> | ((current: DemoState) => DemoState)) => void;
  notice: string;
  setNotice: (value: string) => void;
}) {
  if (summary) return <SummaryScene text={text} demo={demo} />;
  const patch = (next: Partial<DemoState>, message: string) => {
    setDemo(next);
    setNotice(message);
  };
  return (
    <>
      {step === "meta" ? (
        <MetaScene text={text} demo={demo} onCapture={() => patch({ leadCaptured: true }, text("הליד של נועה לוי נכנס למערכת.", "Noa Levi's lead entered the system."))} />
      ) : null}
      {step === "crm" ? (
        <CrmScene
          text={text}
          demo={demo}
          onOpen={() => patch({ crmOpen: true }, text("הכרטיס של נועה לוי נפתח.", "Noa Levi's record is open."))}
          onStatus={(status) => patch({ status, crmOpen: true }, text("הסטטוס עודכן על הכרטיס.", "The status was updated on the record."))}
        />
      ) : null}
      {step === "whatsapp" ? (
        <WhatsAppScene
          text={text}
          demo={demo}
          onReply={() => patch(
            { replied: true, status: demo.status === "new" ? "contacted" : demo.status },
            text("התשובה נשמרה על הכרטיס. היא לא נשלחה.", "The reply was saved on the record. It was not sent."),
          )}
        />
      ) : null}
      {step === "automation" ? (
        <AutomationScene text={text} demo={demo} onRun={() => patch({ automation: true }, text("האוטומציה רצה בהדגמה המקומית.", "The automation ran in the local demo."))} />
      ) : null}
      {step === "ai" ? (
        <AiScene
          text={text}
          demo={demo}
          onDraft={() => patch({ draftReady: true }, text("הטיוטה נוצרה. היא עדיין לא נשמרה.", "The draft was created. It is not saved yet."))}
          onSave={() => patch({ draftSaved: true }, text("הטיוטה נשמרה בהדגמה.", "The draft was saved in the demo."))}
        />
      ) : null}
      {step === "calendar" ? (
        <CalendarScene
          text={text}
          demo={demo}
          onPick={(slot) => setDemo({ slot, meeting: demo.meeting ? slot : demo.meeting })}
          onBook={() => patch({ meeting: demo.slot }, text("הפגישה נקבעה ביומן ההדגמה.", "The meeting was booked on the demo calendar."))}
        />
      ) : null}
      <Notice>{notice}</Notice>
    </>
  );
}

export default function CustomerJourney() {
  const { text, dir } = useLabels();
  const [step, setStep] = useState(0);
  const [summary, setSummary] = useState(false);
  const [demo, setDemoState] = useState<DemoState>(INITIAL);
  const [notice, setNotice] = useState("");
  const current = STEPS[step];

  const setDemo = (patch: Partial<DemoState> | ((current: DemoState) => DemoState)) => {
    setDemoState((prev) => (typeof patch === "function" ? patch(prev) : { ...prev, ...patch }));
  };

  const go = (index: number) => {
    setSummary(false);
    setStep(index);
    setNotice("");
  };

  const labels = [
    text("Meta וקמפיינים", "Meta and campaigns"),
    text("CRM וקליטת ליד", "CRM and lead intake"),
    text("WhatsApp API", "WhatsApp API"),
    text("אוטומציות", "Automations"),
    text("AI ותובנות", "AI and insights"),
    text("יומן ופגישות", "Calendar and meetings"),
  ];

  const scene = (
    <div className="bj-scene" key={summary ? "summary" : current}>
      <Scene text={text} step={current} summary={summary} demo={demo} setDemo={setDemo} notice={notice} setNotice={setNotice} />
    </div>
  );

  return (
    <section className="bj-journey" id="how" dir={dir} aria-labelledby="ht-how-title">
      <div className="bj-wrap">
        <header className="bj-head">
          <div>
            <p className="bj-kicker">THE BIZUPLY JOURNEY</p>
            <h2 className="bj-title" id="ht-how-title">
              <span>{text("איך Bizuply עובדת?", "How does Bizuply work?")}</span>
              <span className="bj-title-soft">{text("מ-Meta ועד פגישה.", "From Meta to a meeting.")}</span>
            </h2>
          </div>
          <p className="bj-lead">
            {text(
              "מסע אחד רציף, מהקליטה של הליד בקמפיין ועד לתיאום פגישה ביומן — במקום אחד.",
              "One continuous journey, from the lead on a campaign to a meeting on the calendar — in one place.",
            )}
          </p>
        </header>

        <ol className="bj-track">
          {labels.map((label, index) => {
            const on = !summary && index === step;
            const done = summary || index < step;
            return (
              <li key={label}>
                <button
                  type="button"
                  className={on ? "is-on" : done ? "is-done" : undefined}
                  aria-current={on ? "step" : undefined}
                  onClick={() => go(index)}
                >
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="bj-phone-only">
          <ol className="bj-phone-steps">
            {labels.map((label, index) => (
              <li key={label}>
                <button type="button" className={!summary && index === step ? "is-on" : undefined} aria-current={!summary && index === step ? "step" : undefined} onClick={() => go(index)}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <article className="bj-person">
            <b aria-hidden="true">{text("נ", "N")}</b>
            <span>
              <strong>{customerName(text)}</strong>
              <bdi dir="ltr">{PHONE}</bdi>
            </span>
            <em>{statusLabel(text, demo.status, demo.meeting)}</em>
          </article>
        </div>

        <div className="bj-layout">
          <Panel text={text} step={current} demo={demo} summary={summary} onRestart={() => { setDemoState(INITIAL); setStep(0); setSummary(false); setNotice(""); }} />
          <div className="bj-window">
            <div className="bj-chrome">
              <span className="bj-dots" aria-hidden="true"><i /><i /><i /></span>
              <span className="bj-url">app.bizuply.com/journey</span>
              <span className="bj-pill">{text("הדגמה מקומית", "Local demo")}</span>
            </div>
            <div className="bj-app">
              <ProductNav step={summary ? "summary" : current} text={text} />
              <div className="bj-main bj-phone-demo">{scene}</div>
            </div>
          </div>
          <div className="bj-nav">
            <button type="button" className="bj-prev" onClick={() => (summary ? go(STEPS.length - 1) : go(step - 1))} disabled={!summary && step === 0}>
              <Arrow />
              {text("השלב הקודם", "Previous step")}
            </button>
            {summary ? null : (
              <button type="button" className="bj-next" onClick={() => (step === STEPS.length - 1 ? (setSummary(true), setNotice("")) : go(step + 1))}>
                <Arrow />
                {step === STEPS.length - 1 ? text("לסיכום המסע", "Journey summary") : text("השלב הבא", "Next step")}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bj-fade" aria-hidden="true" />
    </section>
  );
}
