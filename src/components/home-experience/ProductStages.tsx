import { useState } from "react";
import { useTranslation } from "react-i18next";
import { homeText } from "./homeCopy";

function useLabels() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  return (hebrew: string, english: string) => homeText(language, hebrew, english);
}

const DEMO_HE = "הדגמה · לא נתוני לקוח אמיתיים";
const DEMO_EN = "Demo · not real customer data";

type TextFn = (hebrew: string, english: string) => string;
type LeadId = "noa" | "tamar" | "yael";
type StatusId = "new" | "contacted" | "interested" | "converted";

const STATUS_ORDER: StatusId[] = ["new", "contacted", "interested", "converted"];

function statusLabel(text: TextFn, status: StatusId) {
  if (status === "new") return text("חדש", "New");
  if (status === "contacted") return text("נוצר קשר", "Contacted");
  if (status === "interested") return text("מעוניין", "Interested");
  return text("הומר", "Converted");
}

function DemoBar({ text }: { text: TextFn }) {
  return (
    <p className="pv-bar">
      <span>BizUply</span>
      <span>{text(DEMO_HE, DEMO_EN)}</span>
    </p>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.2 6.2 11.4 13 4.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function JourneyStage({ onWatch }: { onWatch: (index: number) => void }) {
  const text = useLabels();
  const steps = [
    {
      id: "leads",
      watch: 0,
      label: text("קבלת לידים", "Lead intake"),
      kicker: text("שלב 1 מתוך 6", "Step 1 of 6"),
      title: text("קבלת לידים וניהול ב־CRM", "Lead intake and CRM management"),
      body: text("כל פנייה, מליד חדש ועד לקוח קבוע, מתועדת ומנוהלת במקום אחד — עם תמונה מלאה, סטטוס ברור והמשך טיפול מהיר.", "Every enquiry, from a new lead to a returning customer, is recorded and managed in one place — with the full picture, a clear status and a fast next step."),
      points: [
        text("קליטת לידים מכל הערוצים", "Lead intake from every channel"),
        text("כרטיס לקוח מלא ומסודר", "A complete customer record"),
        text("מעבר מהיר לשלב הבא", "A fast move to the next stage"),
      ],
    },
    {
      id: "whatsapp",
      watch: 2,
      label: text("תקשורת ויחסים", "Conversations"),
      kicker: text("שלב 2 מתוך 6", "Step 2 of 6"),
      title: text("השיחה נשארת על אותו כרטיס", "The conversation stays on the same record"),
      body: text("ממשיכים ב־WhatsApp מתוך הכרטיס. התשובה נשמרת שם, בחלון הזמן שמדיניות Meta מאפשרת.", "Continue on WhatsApp from the record. The reply is saved there, inside the window Meta's policy allows."),
      points: [
        text("תיבת שיחות מחוברת לכרטיס", "An inbox linked to the record"),
        text("הודעות נכנסות ויוצאות", "Incoming and outgoing messages"),
        text("הסטטוס נשאר ליד השיחה", "The status stays next to the thread"),
      ],
    },
    {
      id: "flow",
      watch: 4,
      label: text("אוטומציות חכמות", "Automations"),
      kicker: text("שלב 3 מתוך 6", "Step 3 of 6"),
      title: text("טריגר, תנאי, ואז פעולה", "A trigger, a condition, then an action"),
      body: text("ליד חדש שמקורו Meta יכול לקבל תגית ומשימת המשך. הרצת הבדיקה לא שולחת הודעה ולא משנה נתונים.", "A new lead whose source is Meta can get a tag and a follow-up task. The test run sends nothing and changes no data."),
      points: [
        text("טריגר של ליד חדש", "A new-lead trigger"),
        text("תנאי לפי מקור", "A condition on the source"),
        text("משימה ב־CRM, בלי שליחה", "A CRM task, with nothing sent"),
      ],
    },
    {
      id: "meta",
      watch: 1,
      label: text("שיווק ותוצאות", "Campaigns"),
      kicker: text("שלב 4 מתוך 6", "Step 4 of 6"),
      title: text("מהקמפיין אל הליד ב־CRM", "From the campaign to the lead in the CRM"),
      body: text("עוברים בין קמפיינים ורואים את מדדי ההדגמה, ואת הליד שנכנס לכרטיס. אלה לא תוצאות אמיתיות של BizUply.", "Switch campaigns and see the demo metrics, and the lead that entered a record. These are not real BizUply results."),
      points: [
        text("הוצאה, לידים ועלות לליד", "Spend, leads and cost per lead"),
        text("גרף לידים לפי יום", "A leads-by-day chart"),
        text("הליד מסומן כהדגמה", "The lead is marked as a demo"),
      ],
    },
    {
      id: "ai",
      watch: 5,
      label: text("תובנות AI", "AI insights"),
      kicker: text("שלב 5 מתוך 6", "Step 5 of 6"),
      title: text("המלצה ברורה. השליחה נשארת אצלכם", "A clear recommendation. Sending stays with you"),
      body: text("היועץ העסקי מציג נתון, תובנה וטיוטה. הוא לא שולח הודעה, לא קובע פגישה ולא משנה תקציב.", "Business Advisor shows a figure, an insight and a draft. It does not send a message, book a meeting or change a budget."),
      points: [
        text("תובנה על ליד או קמפיין", "An insight on a lead or a campaign"),
        text("טיוטה שלא נשלחת", "A draft that is not sent"),
        text("הפעולה נשארת אצל הצוות", "The action stays with the team"),
      ],
    },
    {
      id: "calendar",
      watch: 3,
      label: text("פגישות ויומן", "Meetings"),
      kicker: text("שלב 6 מתוך 6", "Step 6 of 6"),
      title: text("הפגישה נפתחת מתוך השבוע", "The meeting opens from the week"),
      body: text("בוחרים יום ורואים את הפגישה שעל הכרטיס. מעבר שבוע בהדגמה מציג שבוע בלי פגישות.", "Pick a day and see the meeting on the record. Moving the demo week shows a week with no meetings."),
      points: [
        text("שבוע עם פגישות צבעוניות", "A week with colored meetings"),
        text("פרטי פגישה בלחיצה", "Meeting details on click"),
        text("חלון פנוי לפי שעות העסק", "An open window from business hours"),
      ],
    },
  ];
  const [step, setStep] = useState(0);
  const current = steps[step];
  const next = () => setStep((value) => (value + 1) % steps.length);
  return (
    <div className="pv-journey">
      <header className="pv-journey-head">
        <h2 id="ht-how-title">{text("איך Bizuply עובדת?", "How does Bizuply work?")}</h2>
        <p>{text("תהליך פשוט שמרכז את כל ניהול העסק, השיווק והלקוחות במקום אחד.", "A clear process that keeps the business, the marketing and the customers in one place.")}</p>
      </header>
      <ol className="pv-steps">
        {steps.map((item, index) => (
          <li key={item.id}>
            <button type="button" className={index === step ? "is-on" : undefined} aria-current={index === step ? "step" : undefined} onClick={() => setStep(index)}>
              <i aria-hidden="true">{index + 1}</i>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="pv-split">
        <div className="pv-copy">
          <p className="pv-kicker">{current.kicker}</p>
          <h3>{current.title}</h3>
          <p>{current.body}</p>
          <ul className="pv-points">
            {current.points.map((point) => (
              <li key={point}><Mark />{point}</li>
            ))}
          </ul>
          <div className="pv-actions">
            <button type="button" className="pv-btn" onClick={next}>{text("המשך לשלב הבא", "Continue to the next step")}</button>
            <button type="button" className="pv-btn pv-btn-line" onClick={() => onWatch(current.watch)}>{text("לצפות בשלב הזה", "Watch this step")}</button>
          </div>
        </div>
        <div className="pv-scene" key={current.id} aria-live="polite">
          <JourneyScene id={current.id} text={text} />
        </div>
      </div>
    </div>
  );
}

function JourneyScene({ id, text }: { id: string; text: TextFn }) {
  if (id === "whatsapp") return <MiniChat text={text} />;
  if (id === "flow") return <MiniFlow text={text} />;
  if (id === "meta") return <MiniMeta text={text} />;
  if (id === "ai") return <MiniAi text={text} />;
  if (id === "calendar") return <MiniWeek text={text} />;
  return <MiniCrm text={text} />;
}

function MiniCrm({ text }: { text: TextFn }) {
  const leads = [
    { id: "tamar", name: text("תמר לוי", "Tamar Levi"), source: text("טופס באתר", "Website form") },
    { id: "noa", name: text("נועה ברק", "Noa Barak"), source: text("מודעת לידים ב־Meta", "Meta lead ad") },
    { id: "yael", name: text("יעל דהן", "Yael Dahan"), source: text("מודעת לידים ב־Meta", "Meta lead ad") },
  ];
  const [id, setId] = useState("tamar");
  const lead = leads.find((item) => item.id === id) || leads[0];
  return (
    <div className="pv-mini pv-mini-crm">
      <aside>
        <strong>BizUply</strong>
        <span className="is-on">CRM</span>
        <span>WhatsApp</span>
        <span>{text("יומן", "Calendar")}</span>
      </aside>
      <div className="pv-mini-main">
        <p className="pv-pop">{text("ליד חדש נכנס ומוכן לטיפול", "A new lead arrived and is ready")}</p>
        <ul>
          {leads.map((item) => (
            <li key={item.id}>
              <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <b>{item.name.trim().charAt(0)}</b>
                <span><strong>{item.name}</strong><small>{item.source}</small></span>
              </button>
            </li>
          ))}
        </ul>
        <article>
          <b>{lead.name.trim().charAt(0)}</b>
          <strong>{lead.name}</strong>
          <em>{id === "tamar" ? text("חדש", "New") : text("בכרטיס", "On the record")}</em>
          <span>{lead.source}</span>
          <small>{text("הלחיצה מחליפה את הכרטיס בהדגמה", "The click switches the demo record")}</small>
        </article>
      </div>
    </div>
  );
}

function MiniChat({ text }: { text: TextFn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pv-mini pv-mini-chat">
      <header>
        <strong>{text("נועה ברק", "Noa Barak")}</strong>
        <span>{text("סטודיו נורה", "Nora Studio")}</span>
      </header>
      <p>{text("היי, ראיתי את המודעה. אפשר לשמוע על הצילום?", "Hi, I saw the ad. Can I hear more about the shoot?")}</p>
      <p className="is-out">{text("היי נועה, נשלח פרטים על הצילום עוד היום.", "Hi Noa, we'll send the shoot details later today.")}<small>{text("נקראה · 09:18", "Read · 09:18")}</small></p>
      {open ? <p className="is-out is-draft">{text("טיוטת המשך · לא נשלחה", "Follow-up draft · not sent")}</p> : null}
      <button type="button" onClick={() => setOpen(true)}>{text("הצגת תשובה בהדגמה", "Show a demo reply")}</button>
    </div>
  );
}

function MiniFlow({ text }: { text: TextFn }) {
  const nodes = [
    text("ליד חדש", "New lead"),
    text("המקור הוא Meta", "Source is Meta"),
    text("משימה ב־CRM", "CRM task"),
  ];
  const [id, setId] = useState(0);
  return (
    <div className="pv-mini pv-mini-flow">
      {nodes.map((label, index) => (
        <button key={label} type="button" className={index === id ? "is-on" : undefined} aria-pressed={index === id} onClick={() => setId(index)}>
          <small>{index === 0 ? text("טריגר", "Trigger") : index === 1 ? text("תנאי", "Condition") : text("תוצאה", "Result")}</small>
          <strong>{label}</strong>
        </button>
      ))}
      <i aria-hidden="true" />
    </div>
  );
}

function MiniMeta({ text }: { text: TextFn }) {
  const [on, setOn] = useState(0);
  const campaigns = [
    [text("צילום לחמישי", "Thursday shoot"), "$186", "8"],
    [text("חבילות סטודיו", "Studio packages"), "$96", "3"],
  ];
  const current = campaigns[on];
  return (
    <div className="pv-mini pv-mini-meta">
      <div>
        {campaigns.map((item, index) => (
          <button key={item[0]} type="button" className={index === on ? "is-on" : undefined} aria-pressed={index === on} onClick={() => setOn(index)}>{item[0]}</button>
        ))}
      </div>
      <strong>{current[2]}</strong>
      <span>{text("לידים · הדגמה", "Leads · demo")}</span>
      <em>{current[1]}</em>
    </div>
  );
}

function MiniAi({ text }: { text: TextFn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pv-mini pv-mini-ai">
      <p>{text("תובנה", "Insight")}</p>
      <strong>{text("נועה ברק ממתינה להמשך", "Noa Barak is waiting on a next step")}</strong>
      <blockquote>{open ? text("היי נועה, נשמח לקבוע שיחה קצרה. הטיוטה לא נשלחה.", "Hi Noa, we'd like to set a short call. The draft was not sent.") : text("היועץ מציע טיוטה. הוא לא שולח אותה.", "The advisor suggests a draft. It does not send it.")}</blockquote>
      <button type="button" onClick={() => setOpen(true)}>{text("הצגת הטיוטה", "Show the draft")}</button>
    </div>
  );
}

function MiniWeek({ text }: { text: TextFn }) {
  const days = [
    [text("ג׳", "Tue"), "14:00", text("יעל דהן", "Yael Dahan")],
    [text("ה׳", "Thu"), "10:30", text("נועה ברק", "Noa Barak")],
    [text("ו׳", "Fri"), "16:15", text("תמר לוי", "Tamar Levi")],
  ];
  const [id, setId] = useState(1);
  const day = days[id];
  return (
    <div className="pv-mini pv-mini-week">
      <div>
        {days.map((item, index) => (
          <button key={item[0]} type="button" className={index === id ? "is-on" : undefined} aria-pressed={index === id} onClick={() => setId(index)}>
            <span>{item[0]}</span>
            <strong>{item[1]}</strong>
          </button>
        ))}
      </div>
      <article>
        <p>{day[1]}</p>
        <strong>{day[2]}</strong>
        <span>{text("פתוחה על הכרטיס", "Open on the record")}</span>
      </article>
    </div>
  );
}

const LEADS: {
  id: LeadId;
  he: string;
  en: string;
  placeHe: string;
  placeEn: string;
  sourceHe: string;
  sourceEn: string;
  noteHe: string;
  noteEn: string;
}[] = [
  { id: "tamar", he: "תמר לוי", en: "Tamar Levi", placeHe: "פנייה מהאתר", placeEn: "Website enquiry", sourceHe: "טופס באתר", sourceEn: "Website form", noteHe: "ביקשה לשמוע על חבילת צילום.", noteEn: "Asked to hear about a photo package." },
  { id: "noa", he: "נועה ברק", en: "Noa Barak", placeHe: "סטודיו נורה", placeEn: "Nora Studio", sourceHe: "מודעת לידים ב־Meta", sourceEn: "Meta lead ad", noteHe: "שאלה על צילום אחרי שראתה את המודעה.", noteEn: "Asked about a shoot after seeing the ad." },
  { id: "yael", he: "יעל דהן", en: "Yael Dahan", placeHe: "מודעת לידים ב־Meta", placeEn: "Meta lead ad", sourceHe: "מודעת לידים ב־Meta", sourceEn: "Meta lead ad", noteHe: "שוחחנו, וממתינים לתשובה שלה.", noteEn: "We spoke, and are waiting on her reply." },
];

export function CrmStage() {
  const text = useLabels();
  const [id, setId] = useState<LeadId>("tamar");
  const [statuses, setStatuses] = useState<Record<LeadId, StatusId>>({ tamar: "new", yael: "contacted", noa: "interested" });
  const [moved, setMoved] = useState("");
  const lead = LEADS.find((item) => item.id === id) || LEADS[0];
  const status = statuses[id];
  const advance = () => {
    const index = STATUS_ORDER.indexOf(statuses[id]);
    if (index >= STATUS_ORDER.length - 1) return;
    const next = STATUS_ORDER[index + 1];
    setStatuses((current) => ({ ...current, [id]: next }));
    setMoved(text("הליד עבר לשלב הבא בהדגמה", "The lead moved to the next demo stage"));
  };
  return (
    <div className="pv-app pv-crm" aria-label={text("הדגמה של לוח לידים וכרטיס לקוח. לא נתוני לקוח אמיתיים.", "A demo of the lead board and a customer record. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="pv-crm-shell">
        <aside className="pv-rail">
          <strong>BizUply</strong>
          <span className="is-on">CRM</span>
        </aside>
        <div className="pv-board" role="list" aria-label={text("שלבי הצינור", "Pipeline stages")}>
          {STATUS_ORDER.map((column) => (
            <section key={column} className={status === column ? "is-current" : undefined} aria-label={statusLabel(text, column)}>
              <header>
                <span>{statusLabel(text, column)}</span>
                <b>{LEADS.filter((item) => statuses[item.id] === column).length}</b>
              </header>
              {LEADS.filter((item) => statuses[item.id] === column).map((item) => (
                <button key={item.id} type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => { setId(item.id); setMoved(""); }}>
                  <b>{text(item.he, item.en).trim().charAt(0)}</b>
                  <span>
                    <strong>{text(item.he, item.en)}</strong>
                    <small>{text(item.sourceHe, item.sourceEn)}</small>
                  </span>
                </button>
              ))}
            </section>
          ))}
        </div>
        <article className={moved ? "pv-person is-moved" : "pv-person"} aria-live="polite">
          <b>{text(lead.he, lead.en).trim().charAt(0)}</b>
          <p>{text(lead.placeHe, lead.placeEn)}</p>
          <h3>{text(lead.he, lead.en)}</h3>
          <em>{statusLabel(text, status)}</em>
          <dl>
            <div><dt>{text("מקור", "Source")}</dt><dd>{text(lead.sourceHe, lead.sourceEn)}</dd></div>
            <div><dt>{text("הערה", "Note")}</dt><dd>{text(lead.noteHe, lead.noteEn)}</dd></div>
          </dl>
          <button type="button" className="pv-btn" onClick={advance} disabled={status === "converted"}>
            {status === "converted" ? text("זה השלב האחרון בהדגמה", "This is the last demo stage") : text("העברה לשלב הבא", "Move to the next stage")}
          </button>
          {moved ? <small>{moved}</small> : <small>{text("ההעברה מתבצעת רק בתוך ההדגמה", "The move happens only inside the demo")}</small>}
        </article>
      </div>
    </div>
  );
}

type Thread = {
  id: LeadId;
  name: string;
  place: string;
  source: string;
  preview: string;
  time: string;
  incoming: string;
  outgoing?: string;
  outgoingMeta?: string;
};

export function WhatsAppStage() {
  const text = useLabels();
  const threads: Thread[] = [
    {
      id: "noa",
      name: text("נועה ברק", "Noa Barak"),
      place: text("סטודיו נורה", "Nora Studio"),
      source: text("מודעת לידים ב־Meta", "Meta lead ad"),
      preview: text("אפשר לשמוע על הצילום?", "Can I hear more about the shoot?"),
      time: "09:18",
      incoming: text("היי, ראיתי את המודעה של סטודיו נורה. אפשר לשמוע על הצילום?", "Hi, I saw the Nora Studio ad. Can I hear more about the shoot?"),
      outgoing: text("היי נועה, שמחים שפנית. נשלח פרטים על הצילום עוד היום.", "Hi Noa, glad you wrote. We'll send details about the shoot later today."),
      outgoingMeta: text("נקראה · 09:18", "Read · 09:18"),
    },
    {
      id: "tamar",
      name: text("תמר לוי", "Tamar Levi"),
      place: text("פנייה מהאתר", "Website enquiry"),
      source: text("טופס באתר", "Website form"),
      preview: text("אשמח לשמוע על החבילה.", "I'd like to hear about the package."),
      time: "11:42",
      incoming: text("היי, אשמח לשמוע על חבילת הצילום.", "Hi, I'd like to hear about the photo package."),
    },
    {
      id: "yael",
      name: text("יעל דהן", "Yael Dahan"),
      place: text("מודעת לידים ב־Meta", "Meta lead ad"),
      source: text("מודעת לידים ב־Meta", "Meta lead ad"),
      preview: text("אחשוב על זה ואחזור.", "I'll think it over and come back."),
      time: "16:02",
      incoming: text("תודה, אחשוב על זה ואחזור.", "Thanks, I'll think it over and come back."),
      outgoing: text("מעולה, אנחנו כאן כשתרצי.", "Of course, we're here when you're ready."),
      outgoingMeta: text("נקראה · 16:02", "Read · 16:02"),
    },
  ];
  const [id, setId] = useState<LeadId>("noa");
  const [statuses, setStatuses] = useState<Record<LeadId, StatusId>>({ noa: "interested", tamar: "new", yael: "contacted" });
  const [drafts, setDrafts] = useState<Record<string, boolean>>({});
  const thread = threads.find((item) => item.id === id) || threads[0];
  const counts = STATUS_ORDER.slice(0, 3).map((status) => ({
    status,
    count: Object.values(statuses).filter((value) => value === status).length,
  }));
  return (
    <div className="pv-app pv-wa" aria-label={text("הדגמה של תיבת שיחות WhatsApp המחוברת לכרטיס. לא נתוני לקוח אמיתיים.", "A demo of the WhatsApp inbox linked to the customer record. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="pv-wa-shell">
        <aside>
          <div className="pv-counts" aria-label={text("סטטוסים בהדגמה", "Demo statuses")}>
            {counts.map((item) => (
              <span key={item.status}><b>{item.count}</b>{statusLabel(text, item.status)}</span>
            ))}
          </div>
          <ul>
            {threads.map((item) => (
              <li key={item.id}>
                <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                  <b>{item.name.trim().charAt(0)}</b>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.preview}</small>
                  </span>
                  <em>{statusLabel(text, statuses[item.id])}</em>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className={drafts[id] ? "pv-chat is-after" : "pv-chat is-before"} aria-live="polite">
          <header>
            <b>{thread.name.trim().charAt(0)}</b>
            <span>
              <strong>{thread.name}</strong>
              <small>{thread.place} · {thread.source}</small>
            </span>
            <em>{statusLabel(text, statuses[id])}</em>
          </header>
          <div className="pv-log">
            <p>{thread.incoming}<small>{thread.time}</small></p>
            {thread.outgoing ? <p className="is-out">{thread.outgoing}<small>{thread.outgoingMeta}</small></p> : null}
            {drafts[id] ? <p className="is-out is-draft">{text("תשובת הדגמה נשמרת על הכרטיס. היא לא נשלחה ללקוח.", "The demo reply is saved on the record. It was not sent to the customer.")}<small>{text("לא נשלח", "Not sent")}</small></p> : null}
          </div>
          <footer>
            {drafts[id]
              ? <em>{text("טיוטה מוצגת · לא נשלח", "Draft shown · not sent")}</em>
              : <span>{text("חלון 24 השעות פתוח בהדגמה", "The 24-hour window is open in the demo")}</span>}
            <button type="button" className="pv-btn" onClick={() => {
              setDrafts((current) => ({ ...current, [id]: true }));
              setStatuses((current) => ({ ...current, [id]: current[id] === "new" ? "contacted" : current[id] }));
            }}
            >
              {text("הצגת תשובה וסטטוס", "Show a reply and status")}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export function FlowStage() {
  const text = useLabels();
  const nodes = [
    { id: "trigger", tone: "is-trigger", kind: text("טריגר", "Trigger"), label: text("ליד חדש", "New lead"), body: text("התהליך מתחיל כשנכנס ליד חדש.", "The flow starts when a new lead arrives.") },
    { id: "condition", tone: "is-action", kind: text("תנאי", "Condition"), label: text("המקור הוא Meta", "Source is Meta"), body: text("ממשיכים רק אם מקור הליד הוא Meta.", "It continues only when the lead source is Meta.") },
    { id: "tag", tone: "is-action", kind: text("פעולה", "Action"), label: text("הוספת תגית", "Add a tag"), body: text("מוסיפים תגית לפנייה לצילום.", "Adds a tag for the shoot enquiry.") },
    { id: "task", tone: "is-result", kind: text("תוצאה", "Result"), label: text("יצירת משימה ב־CRM", "Create a CRM task"), body: text("יוצרים משימת המשך ב־CRM.", "Creates a follow-up task in the CRM.") },
  ];
  const [id, setId] = useState("trigger");
  const [ran, setRan] = useState(false);
  const active = Math.max(0, nodes.findIndex((item) => item.id === id));
  const node = nodes[active];
  return (
    <div className={ran ? "pv-app pv-flow is-ran" : "pv-app pv-flow"} aria-label={text("הדגמה של עורך תהליך: טריגר, תנאי ופעולות. הרצת בדיקה לא שולחת הודעה ולא משנה נתונים.", "A demo of the flow editor: a trigger, a condition and actions. A test run sends nothing and changes no data.")}>
      <DemoBar text={text} />
      <div className="pv-flow-row" style={{ direction: "ltr" }}>
        <ol className="pv-flow-cards">
          {nodes.map((item, index) => (
            <li key={item.id}>
              <button type="button" className={`${item.tone}${item.id === id ? " is-on" : ""}${ran && (index <= active || item.id === "task") ? " is-reached" : ""}`} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <small>{index + 1} · {item.kind}</small>
                <strong>{item.label}</strong>
                <span>{item.body}</span>
              </button>
            </li>
          ))}
        </ol>
        <aside className="pv-flow-screen" aria-live="polite">
          <header>
            <strong>{text("עורך האוטומציה", "Automation editor")}</strong>
            <span>{text("ליד חדש · Meta", "New lead · Meta")}</span>
          </header>
          <ol>
            {nodes.map((item, index) => (
              <li key={item.id} className={item.id === id ? "is-on" : ran && index <= active ? "is-reached" : undefined}>{index + 1}. {item.label}</li>
            ))}
          </ol>
          <p>{node.body}</p>
          <p>{text("הדוגמה רצה על הכרטיס של נועה ברק, בלי לשנות אותו.", "The sample runs on Noa Barak's record without changing it.")}</p>
          <button type="button" className="pv-btn" onClick={() => { setRan(true); setId("task"); }}>{text("הרצת בדיקה", "Run a test")}</button>
          {ran ? <em>{text("הרצת בדיקה · לא נשלחה הודעה ולא שונו נתונים", "Test run · no message sent and no data changed")}</em> : null}
        </aside>
      </div>
    </div>
  );
}

type CampaignId = "shoot" | "packages";

function Spark({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 88 - (value / max) * 72;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,96 ${points} 100,96`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={area} />
      <polyline points={points} />
    </svg>
  );
}

export function MetaStage() {
  const text = useLabels();
  const campaigns: {
    id: CampaignId;
    name: string;
    channel: string;
    spend: string;
    leads: string;
    cost: string;
    reach: string;
    bars: number[];
    person: string;
    status: string;
  }[] = [
    {
      id: "shoot",
      name: text("צילום לחמישי", "Thursday shoot"),
      channel: text("פייסבוק ואינסטגרם", "Facebook and Instagram"),
      spend: "$186",
      leads: "8",
      cost: "$23",
      reach: "12,400",
      bars: [28, 46, 38, 62, 54, 84, 70],
      person: text("נועה ברק", "Noa Barak"),
      status: text("מעוניין", "Interested"),
    },
    {
      id: "packages",
      name: text("חבילות סטודיו", "Studio packages"),
      channel: text("פייסבוק ואינסטגרם", "Facebook and Instagram"),
      spend: "$96",
      leads: "3",
      cost: "$32",
      reach: "6,400",
      bars: [22, 18, 40, 30, 48, 26, 36],
      person: text("יעל דהן", "Yael Dahan"),
      status: text("נוצר קשר", "Contacted"),
    },
  ];
  const [id, setId] = useState<CampaignId>("shoot");
  const campaign = campaigns.find((item) => item.id === id) || campaigns[0];
  const metrics = [
    [text("הוצאה", "Spend"), campaign.spend],
    [text("לידים", "Leads"), campaign.leads],
    [text("עלות לליד", "Cost per lead"), campaign.cost],
    [text("חשיפה", "Reach"), campaign.reach],
  ];
  return (
    <div className="pv-app pv-meta" aria-label={text("הדגמה של קמפיינים ב־Meta ומעבר ליד ל־CRM. לא נתוני לקוח אמיתיים.", "A demo of Meta campaigns and a lead passing into the CRM. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="pv-meta-shell">
        <aside>
          <strong>Meta</strong>
          {campaigns.map((item) => (
            <button key={item.id} type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>{item.name}</button>
          ))}
        </aside>
        <div aria-live="polite">
          <header>
            <div>
              <strong>{campaign.name}</strong>
              <span>{campaign.channel}</span>
            </div>
            <em>{text("30 הימים בהדגמה", "30 demo days")}</em>
          </header>
          <ul className="pv-metrics">
            {metrics.map(([label, value]) => (
              <li key={label}><span>{label}</span><strong>{value}</strong></li>
            ))}
          </ul>
          <div className="pv-chart">
            <Spark values={campaign.bars} />
            <span>{text("לידים לפי יום · הדגמה", "Leads by day · demo")}</span>
          </div>
          <div className="pv-pass">
            <span>{text("עבר ל־CRM", "Passed into the CRM")}</span>
            <strong>{campaign.person}</strong>
            <em>{campaign.status}</em>
          </div>
        </div>
      </div>
    </div>
  );
}

type InsightId = "hot" | "wait" | "cost";

export function AiStage() {
  const text = useLabels();
  const insights: {
    id: InsightId;
    kicker: string;
    title: string;
    who: string;
    figure: string;
    figureLabel: string;
    draft: string;
    move: string;
  }[] = [
    {
      id: "hot",
      kicker: text("ליד חם", "Hot lead"),
      title: text("נועה ברק", "Noa Barak"),
      who: text("סטודיו נורה", "Nora Studio"),
      figure: text("מעוניין", "Interested"),
      figureLabel: text("הסטטוס בכרטיס", "Status on the record"),
      draft: text("היי נועה, נשמח לקבוע שיחה קצרה על הצילום.", "Hi Noa, we'd like to set a short call about the shoot."),
      move: text("השיחה נשארת אצלכם. היועץ לא קובע ולא שולח.", "The conversation stays with you. The advisor does not book or send."),
    },
    {
      id: "wait",
      kicker: text("ממתין למענה", "Waiting for a reply"),
      title: text("תמר לוי", "Tamar Levi"),
      who: text("טופס באתר", "Website form"),
      figure: text("חדש", "New"),
      figureLabel: text("הסטטוס בכרטיס", "Status on the record"),
      draft: text("היי תמר, רצינו לוודא שקיבלת את הפרטים על החבילה.", "Hi Tamar, we wanted to check that you received the package details."),
      move: text("זו טיוטת מעקב. היא לא נשמרת ולא נשלחת.", "This is a follow-up draft. It is not saved and not sent."),
    },
    {
      id: "cost",
      kicker: text("עלות לליד", "Cost per lead"),
      title: text("צילום לחמישי", "Thursday shoot"),
      who: text("קמפיין Meta", "Meta campaign"),
      figure: "$23",
      figureLabel: text("עלות לליד בהדגמה", "Demo cost per lead"),
      draft: text("כדאי לבדוק את הקמפיין לפני שמגדילים תקציב.", "Review the campaign before raising the budget."),
      move: text("היועץ לא משנה תקציב ולא עוצר קמפיין.", "The advisor does not change a budget or pause a campaign."),
    },
  ];
  const [id, setId] = useState<InsightId>("hot");
  const [shown, setShown] = useState(false);
  const insight = insights.find((item) => item.id === id) || insights[0];
  return (
    <div className="pv-app pv-ai" aria-label={text("הדגמה של תובנות היועץ העסקי. הוא ממליץ ואינו מבצע פעולה. לא נתוני לקוח אמיתיים.", "A demo of Business Advisor insights. It recommends and takes no action. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="pv-ai-shell">
        <ul aria-label={text("תובנות", "Insights")}>
          {insights.map((item) => (
            <li key={item.id}>
              <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => { setId(item.id); setShown(false); }}>
                <small>{item.kicker}</small>
                <strong>{item.title}</strong>
              </button>
            </li>
          ))}
        </ul>
        <article aria-live="polite">
          <p>{text("תובנה", "Insight")}</p>
          <h3>{insight.title}</h3>
          <span>{insight.who}</span>
          <div className="pv-figure">
            <strong>{insight.figure}</strong>
            <span>{insight.figureLabel}</span>
          </div>
          <div className="pv-spark" aria-hidden="true"><Spark values={insight.id === "cost" ? [40, 36, 48, 44, 52, 46, 58] : [22, 28, 26, 40, 36, 48, 44]} /></div>
          <blockquote className="pv-rec">
            <small>{text("המלצה", "Recommendation")}</small>
            {insight.move}
          </blockquote>
          <blockquote className={shown ? "pv-draft is-open" : "pv-draft"}>
            <small>{shown ? text("טיוטה מוצגת · לא נשלח", "Draft shown · not sent") : text("טיוטה · לא נשלח", "Draft · not sent")}</small>
            {shown ? insight.draft : text("היועץ מציע טיוטה. הוא לא שולח אותה.", "The advisor suggests a draft. It does not send it.")}
          </blockquote>
          <button type="button" className="pv-btn" onClick={() => setShown(true)}>{text("הצגת הטיוטה", "Show the draft")}</button>
        </article>
      </div>
    </div>
  );
}

type DayId = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export function CalendarStage() {
  const text = useLabels();
  const days: { id: DayId; label: string; date: string }[] = [
    { id: "sun", label: text("א׳", "Sun"), date: "8" },
    { id: "mon", label: text("ב׳", "Mon"), date: "9" },
    { id: "tue", label: text("ג׳", "Tue"), date: "10" },
    { id: "wed", label: text("ד׳", "Wed"), date: "11" },
    { id: "thu", label: text("ה׳", "Thu"), date: "12" },
    { id: "fri", label: text("ו׳", "Fri"), date: "13" },
    { id: "sat", label: text("ש׳", "Sat"), date: "14" },
  ];
  const meetings: Record<string, { name: string; place: string; service: string; time: string; note: string; tone: string } | undefined> = {
    tue: { name: text("יעל דהן", "Yael Dahan"), place: text("מודעת לידים ב־Meta", "Meta lead ad"), service: text("שיחת המשך", "Follow-up call"), time: "14:00", note: text("אחרי השיחה שנרשמה בכרטיס.", "After the call logged on her record."), tone: "is-blue" },
    thu: { name: text("נועה ברק", "Noa Barak"), place: text("סטודיו נורה", "Nora Studio"), service: text("שיחת היכרות", "Intro call"), time: "10:30", note: text("פגישה על הכרטיס, אחרי פניית הצילום.", "A meeting on the record, after the shoot enquiry."), tone: "is-purple" },
    fri: { name: text("תמר לוי", "Tamar Levi"), place: text("טופס באתר", "Website form"), service: text("שיחה על חבילה", "Package call"), time: "16:15", note: text("עדיין לא נקבעה שיחה ב־WhatsApp.", "No WhatsApp reply has been sent yet."), tone: "is-green" },
  };
  const [week, setWeek] = useState(0);
  const [day, setDay] = useState<DayId>("thu");
  const meeting = week === 0 ? meetings[day] : undefined;
  const selected = days.find((item) => item.id === day) || days[4];
  const weekLabel = week === 0
    ? text("8–14 בנובמבר 2026 · שבוע ההדגמה", "8–14 November 2026 · demo week")
    : text("שבוע בלי פגישות בהדגמה", "A demo week with no meetings");
  return (
    <div className="pv-app pv-cal" aria-label={text("הדגמה של יומן שבועי. בחירת יום פותחת את הפגישה. לא נתוני לקוח אמיתיים.", "A demo of the week calendar. Choosing a day opens the meeting. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="pv-cal-shell">
        <div className="pv-cal-nav">
          <button type="button" onClick={() => setWeek((value) => value - 1)} aria-label={text("השבוע הקודם", "Previous week")}>‹</button>
          <strong>{weekLabel}</strong>
          <button type="button" onClick={() => setWeek((value) => value + 1)} aria-label={text("השבוע הבא", "Next week")}>›</button>
        </div>
        <div className="pv-cal-grid" role="listbox" aria-label={text("ימים", "Days")}>
          {days.map((item) => {
            const booked = week === 0 ? meetings[item.id] : undefined;
            return (
              <button key={item.id} type="button" role="option" aria-selected={item.id === day} className={item.id === day ? "is-on" : undefined} onClick={() => setDay(item.id)}>
                <span>{item.label}</span>
                <b>{item.date}</b>
                {booked ? <em className={booked.tone}>{booked.time}<small>{booked.name}</small></em> : <i>{text("פנוי", "Open")}</i>}
              </button>
            );
          })}
        </div>
        <article className="pv-cal-detail" aria-live="polite">
          {meeting ? (
            <>
              <p>{selected.label} · {meeting.time}</p>
              <h3>{meeting.name}</h3>
              <strong>{meeting.service}</strong>
              <span>{meeting.place}</span>
              <p>{meeting.note}</p>
              <em>{text("פתוחה על הכרטיס", "Open on the record")}</em>
            </>
          ) : (
            <>
              <p>{selected.label}</p>
              <h3>{text("אין פגישות ביום הזה", "No meetings on this day")}</h3>
              <em>{text("החלון הפנוי מחושב משעות העסק", "The open window comes from business hours")}</em>
            </>
          )}
        </article>
      </div>
    </div>
  );
}

export { JourneyStage };
