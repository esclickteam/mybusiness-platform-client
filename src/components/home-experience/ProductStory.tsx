import { useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { homeText } from "./homeCopy";

function useLabels() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  return (hebrew: string, english: string) => homeText(language, hebrew, english);
}

type TextFn = (hebrew: string, english: string) => string;
type StatusId = "new" | "contacted" | "interested" | "converted";

const STATUS_ORDER: StatusId[] = ["new", "contacted", "interested", "converted"];

function statusLabel(text: TextFn, status: StatusId) {
  if (status === "new") return text("חדש", "New");
  if (status === "contacted") return text("נוצר קשר", "Contacted");
  if (status === "interested") return text("מעוניין", "Interested");
  return text("הומר", "Converted");
}

function Spark({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100;
    const y = 88 - (value / max) * 72;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,96 ${points} 100,96`} />
      <polyline points={points} />
    </svg>
  );
}

function StoryMeta({ text }: { text: TextFn }) {
  const [on, setOn] = useState(0);
  const campaigns = [
    {
      name: text("צילום לחמישי", "Thursday shoot"),
      spend: "$186",
      leads: "8",
      cost: "$23",
      person: text("נועה ברק", "Noa Barak"),
      status: text("מעוניין", "Interested"),
      bars: [28, 46, 38, 62, 54, 84, 70],
    },
    {
      name: text("חבילות סטודיו", "Studio packages"),
      spend: "$96",
      leads: "3",
      cost: "$32",
      person: text("יעל דהן", "Yael Dahan"),
      status: text("נוצר קשר", "Contacted"),
      bars: [22, 18, 40, 30, 48, 26, 36],
    },
  ];
  const current = campaigns[on];
  return (
    <div className="hc-scene hc-scene-meta">
      <div className="hc-switch" role="group" aria-label={text("חיבור ל־Meta", "Meta connection")}>
        {campaigns.map((item, index) => (
          <button key={item.name} type="button" className={index === on ? "is-on" : undefined} aria-pressed={index === on} onClick={() => setOn(index)}>
            {item.name}
          </button>
        ))}
      </div>
      <p className="hc-channel">{text("פייסבוק ואינסטגרם", "Facebook and Instagram")} · {text("30 הימים בהדגמה", "30 demo days")}</p>
      <ul className="hc-metrics">
        <li><span>{text("הוצאה", "Spend")}</span><strong>{current.spend}</strong></li>
        <li><span>{text("לידים", "Leads")}</span><strong>{current.leads}</strong></li>
        <li><span>{text("עלות לליד", "Cost per lead")}</span><strong>{current.cost}</strong></li>
      </ul>
      <div className="hc-chart">
        <Spark values={current.bars} />
        <span>{text("לידים לפי יום · הדגמה", "Leads by day · demo")}</span>
      </div>
      <p className="hc-pass">
        <span>{text("עבר ל־CRM", "Passed into the CRM")}</span>
        <strong>{current.person}</strong>
        <em>{current.status}</em>
      </p>
    </div>
  );
}

function StoryCrm({ text }: { text: TextFn }) {
  const leads = [
    { id: "noa", name: text("נועה ברק", "Noa Barak"), source: text("Meta", "Meta"), note: text("שאלה על צילום אחרי שראתה את המודעה.", "Asked about a shoot after seeing the ad.") },
    { id: "tamar", name: text("תמר לוי", "Tamar Levi"), source: text("טופס באתר", "Website form"), note: text("ביקשה לשמוע על חבילת צילום.", "Asked to hear about a photo package.") },
    { id: "yael", name: text("יעל דהן", "Yael Dahan"), source: text("Meta", "Meta"), note: text("שוחחנו, וממתינים לתשובה שלה.", "We spoke, and are waiting on her reply.") },
  ];
  const [id, setId] = useState("noa");
  const [status, setStatus] = useState<StatusId>("new");
  const lead = leads.find((item) => item.id === id) || leads[0];
  const advance = () => {
    const index = STATUS_ORDER.indexOf(status);
    if (index < STATUS_ORDER.length - 1) setStatus(STATUS_ORDER[index + 1]);
  };
  return (
    <div className="hc-scene hc-scene-crm">
      <div className="hc-people" role="list">
        {leads.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === id ? "is-on" : undefined}
            aria-pressed={item.id === id}
            onClick={() => {
              setId(item.id);
              setStatus("new");
            }}
          >
            <b>{item.name.trim().charAt(0)}</b>
            <span><strong>{item.name}</strong><small>{item.source}</small></span>
          </button>
        ))}
      </div>
      <article className={status === "new" ? undefined : "is-moved"} aria-live="polite">
        <p className="hc-arrive">{status === "new" ? text("ליד חדש נכנס ומוכן לטיפול", "A new lead arrived and is ready") : text("הליד עבר לשלב הבא בהדגמה", "The lead moved to the next demo stage")}</p>
        <h3>{lead.name}</h3>
        <em>{statusLabel(text, status)}</em>
        <dl>
          <div><dt>{text("מקור", "Source")}</dt><dd>{lead.source}</dd></div>
          <div><dt>{text("הערה", "Note")}</dt><dd>{lead.note}</dd></div>
        </dl>
        <ol className="hc-status" aria-label={text("שלבי הצינור", "Pipeline stages")}>
          {STATUS_ORDER.map((column, index) => {
            const current = STATUS_ORDER.indexOf(status);
            const state = index < current ? "is-done" : index === current ? "is-on" : undefined;
            return (
              <li key={column} className={state}>
                <i>{index + 1}</i>
                <span>{statusLabel(text, column)}</span>
              </li>
            );
          })}
        </ol>
        <button type="button" className="pv-btn" onClick={advance} disabled={status === "converted"}>
          {status === "converted" ? text("זה השלב האחרון בהדגמה", "This is the last demo stage") : text("העברה לשלב הבא", "Move to the next stage")}
        </button>
      </article>
    </div>
  );
}

function StoryChat({ text }: { text: TextFn }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hc-scene hc-scene-wa">
      <header>
        <b>{text("נועה ברק", "Noa Barak").trim().charAt(0)}</b>
        <span>
          <strong>{text("נועה ברק", "Noa Barak")}</strong>
          <small>{text("סטודיו נורה", "Nora Studio")} · {text("מודעת לידים ב־Meta", "Meta lead ad")}</small>
        </span>
        <em>{open ? text("נוצר קשר", "Contacted") : text("מעוניין", "Interested")}</em>
      </header>
      <div className="hc-log">
        <p className="is-in">{text("היי, ראיתי את המודעה. אפשר לשמוע על הצילום?", "Hi, I saw the ad. Can I hear more about the shoot?")}<small>09:14</small></p>
        <p className="is-out">{text("היי נועה, נשלח פרטים על הצילום עוד היום.", "Hi Noa, we'll send the shoot details later today.")}<small>{text("נקראה · 09:18", "Read · 09:18")}</small></p>
        {open ? <p className="is-out is-draft">{text("טיוטת המשך · לא נשלחה", "Follow-up draft · not sent")}</p> : null}
      </div>
      <footer>
        <span>{text("חלון 24 השעות פתוח בהדגמה", "The 24-hour window is open in the demo")}</span>
        <button type="button" className="pv-btn" onClick={() => setOpen(true)}>{text("הצגת תשובה בהדגמה", "Show a demo reply")}</button>
      </footer>
    </div>
  );
}

function StoryFlow({ text }: { text: TextFn }) {
  const nodes = [
    { id: "trigger", kind: text("טריגר", "Trigger"), label: text("ליד חדש", "New lead") },
    { id: "condition", kind: text("תנאי", "Condition"), label: text("המקור הוא Meta", "Source is Meta") },
    { id: "action", kind: text("פעולה", "Action"), label: text("הוספת תגית", "Add a tag") },
    { id: "result", kind: text("תוצאה", "Result"), label: text("יצירת משימה ב־CRM", "Create a CRM task") },
  ];
  const [id, setId] = useState("trigger");
  const [ran, setRan] = useState(false);
  const active = Math.max(0, nodes.findIndex((item) => item.id === id));
  return (
    <div className={ran ? "hc-scene hc-scene-flow is-ran" : "hc-scene hc-scene-flow"}>
      <ol>
        {nodes.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={`${item.id === id ? "is-on" : ""}${ran && index <= active ? " is-reached" : ""}`}
              aria-pressed={item.id === id}
              onClick={() => setId(item.id)}
            >
              <small>{index + 1} · {item.kind}</small>
              <strong>{item.label}</strong>
            </button>
          </li>
        ))}
      </ol>
      <div className="hc-flow-result">
        <p>{text("הדוגמה רצה על הכרטיס של נועה ברק, בלי לשנות אותו.", "The sample runs on Noa Barak's record without changing it.")}</p>
        <button type="button" className="pv-btn" onClick={() => { setRan(true); setId("result"); }}>{text("הרצת בדיקה", "Run a test")}</button>
        {ran ? <em>{text("הרצת בדיקה · לא נשלחה הודעה ולא שונו נתונים", "Test run · no message sent and no data changed")}</em> : null}
      </div>
    </div>
  );
}

function StoryAi({ text }: { text: TextFn }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="hc-scene hc-scene-ai">
      <ol>
        <li>
          <small>{text("הסטטוס בכרטיס", "Status on the record")}</small>
          <strong>{text("מעוניין", "Interested")}</strong>
        </li>
        <li>
          <small>{text("תובנה", "Insight")}</small>
          <strong>{text("נועה ברק ממתינה להמשך", "Noa Barak is waiting on a next step")}</strong>
        </li>
        <li>
          <small>{text("המלצה", "Recommendation")}</small>
          <p>{text("השיחה נשארת אצלכם. היועץ לא קובע ולא שולח.", "The conversation stays with you. The advisor does not book or send.")}</p>
        </li>
        <li className={shown ? "is-open" : undefined}>
          <small>{shown ? text("טיוטה מוצגת · לא נשלח", "Draft shown · not sent") : text("טיוטה · לא נשלח", "Draft · not sent")}</small>
          <p>{shown ? text("היי נועה, נשמח לקבוע שיחה קצרה על הצילום.", "Hi Noa, we'd like to set a short call about the shoot.") : text("היועץ מציע טיוטה. הוא לא שולח אותה.", "The advisor suggests a draft. It does not send it.")}</p>
        </li>
      </ol>
      <button type="button" className="pv-btn" onClick={() => setShown(true)}>{text("הצגת הטיוטה", "Show the draft")}</button>
    </div>
  );
}

function StoryWeek({ text }: { text: TextFn }) {
  const days = [
    { id: "tue", label: text("ג׳", "Tue"), time: "14:00", name: text("יעל דהן", "Yael Dahan"), service: text("שיחת המשך", "Follow-up call") },
    { id: "thu", label: text("ה׳", "Thu"), time: "10:30", name: text("נועה ברק", "Noa Barak"), service: text("שיחת היכרות", "Intro call") },
    { id: "fri", label: text("ו׳", "Fri"), time: "16:15", name: text("תמר לוי", "Tamar Levi"), service: text("שיחה על חבילה", "Package call") },
  ];
  const [id, setId] = useState("thu");
  const day = days.find((item) => item.id === id) || days[1];
  return (
    <div className="hc-scene hc-scene-cal">
      <div className="hc-days" role="listbox" aria-label={text("ימים", "Days")}>
        {days.map((item) => (
          <button key={item.id} type="button" role="option" aria-selected={item.id === id} className={item.id === id ? "is-on" : undefined} onClick={() => setId(item.id)}>
            <span>{item.label}</span>
            <strong>{item.time}</strong>
            <small>{item.name}</small>
          </button>
        ))}
      </div>
      <article aria-live="polite">
        <p>{day.label} · {day.time}</p>
        <h3>{day.name}</h3>
        <strong>{day.service}</strong>
        <em>{text("פתוחה על הכרטיס", "Open on the record")}</em>
      </article>
    </div>
  );
}

function StoryScene({ id, text }: { id: string; text: TextFn }) {
  if (id === "crm") return <StoryCrm text={text} />;
  if (id === "whatsapp") return <StoryChat text={text} />;
  if (id === "flow") return <StoryFlow text={text} />;
  if (id === "ai") return <StoryAi text={text} />;
  if (id === "calendar") return <StoryWeek text={text} />;
  return <StoryMeta text={text} />;
}

export function JourneyStage({ onWatch }: { onWatch: (index: number) => void }) {
  const text = useLabels();
  const steps = [
    {
      id: "meta",
      watch: 0,
      label: text("שיווק ותוצאות", "Campaigns"),
      kicker: text("שלב 1 מתוך 6", "Step 1 of 6"),
      title: text("מהקמפיין אל הליד ב־CRM", "From the campaign to the lead in the CRM"),
      body: text("עוברים בין קמפיינים ורואים את מדדי ההדגמה, ואת הליד שנכנס לכרטיס. אלה לא תוצאות אמיתיות של BizUply.", "Switch campaigns and see the demo metrics, and the lead that entered a record. These are not real BizUply results."),
      result: text("הליד מסומן כהדגמה", "The lead is marked as a demo"),
    },
    {
      id: "crm",
      watch: 1,
      label: text("קבלת לידים", "Lead intake"),
      kicker: text("שלב 2 מתוך 6", "Step 2 of 6"),
      title: text("קבלת לידים וניהול ב־CRM", "Lead intake and CRM management"),
      body: text("כל פנייה, מליד חדש ועד לקוח קבוע, מתועדת ומנוהלת במקום אחד — עם תמונה מלאה, סטטוס ברור והמשך טיפול מהיר.", "Every enquiry, from a new lead to a returning customer, is recorded and managed in one place — with the full picture, a clear status and a fast next step."),
      result: text("מעבר מהיר לשלב הבא", "A fast move to the next stage"),
    },
    {
      id: "whatsapp",
      watch: 2,
      label: text("תקשורת ויחסים", "Conversations"),
      kicker: text("שלב 3 מתוך 6", "Step 3 of 6"),
      title: text("השיחה נשארת על אותו כרטיס", "The conversation stays on the same record"),
      body: text("ממשיכים ב־WhatsApp מתוך הכרטיס. התשובה נשמרת שם, בחלון הזמן שמדיניות Meta מאפשרת.", "Continue on WhatsApp from the record. The reply is saved there, inside the window Meta's policy allows."),
      result: text("הסטטוס נשאר ליד השיחה", "The status stays next to the thread"),
    },
    {
      id: "flow",
      watch: 4,
      label: text("אוטומציות חכמות", "Automations"),
      kicker: text("שלב 4 מתוך 6", "Step 4 of 6"),
      title: text("טריגר, תנאי, ואז פעולה", "A trigger, a condition, then an action"),
      body: text("ליד חדש שמקורו Meta יכול לקבל תגית ומשימת המשך. הרצת הבדיקה לא שולחת הודעה ולא משנה נתונים.", "A new lead whose source is Meta can get a tag and a follow-up task. The test run sends nothing and changes no data."),
      result: text("משימה ב־CRM, בלי שליחה", "A CRM task, with nothing sent"),
    },
    {
      id: "ai",
      watch: 5,
      label: text("תובנות AI", "AI insights"),
      kicker: text("שלב 5 מתוך 6", "Step 5 of 6"),
      title: text("המלצה ברורה. השליחה נשארת אצלכם", "A clear recommendation. Sending stays with you"),
      body: text("היועץ העסקי מציג נתון, תובנה וטיוטה. הוא לא שולח הודעה, לא קובע פגישה ולא משנה תקציב.", "Business Advisor shows a figure, an insight and a draft. It does not send a message, book a meeting or change a budget."),
      result: text("הפעולה נשארת אצל הצוות", "The action stays with the team"),
    },
    {
      id: "calendar",
      watch: 3,
      label: text("פגישות ויומן", "Meetings"),
      kicker: text("שלב 6 מתוך 6", "Step 6 of 6"),
      title: text("הפגישה נפתחת מתוך השבוע", "The meeting opens from the week"),
      body: text("בוחרים יום ורואים את הפגישה שעל הכרטיס. מעבר שבוע בהדגמה מציג שבוע בלי פגישות.", "Pick a day and see the meeting on the record. Moving the demo week shows a week with no meetings."),
      result: text("פרטי פגישה בלחיצה", "Meeting details on click"),
    },
  ];
  const [step, setStep] = useState(0);
  const railRef = useRef<HTMLOListElement | null>(null);
  const current = steps[step];
  const go = (index: number, focus = false) => {
    const next = (index + steps.length) % steps.length;
    setStep(next);
    if (focus) railRef.current?.querySelectorAll("button")[next]?.focus();
  };
  const onKey = (event: KeyboardEvent<HTMLOListElement>) => {
    const rtl = event.currentTarget.closest("[dir]")?.getAttribute("dir") === "rtl";
    const forward = rtl ? event.key === "ArrowLeft" : event.key === "ArrowRight";
    const backward = rtl ? event.key === "ArrowRight" : event.key === "ArrowLeft";
    if (forward || event.key === "ArrowDown") {
      event.preventDefault();
      go(step + 1, true);
    }
    if (backward || event.key === "ArrowUp") {
      event.preventDefault();
      go(step - 1, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      go(0, true);
    }
    if (event.key === "End") {
      event.preventDefault();
      go(steps.length - 1, true);
    }
  };
  return (
    <div className="pv-journey hc-story">
      <header className="pv-journey-head hc-story-head">
        <h2 id="ht-how-title">{text("איך Bizuply עובדת?", "How does Bizuply work?")}</h2>
        <p>{text("תהליך פשוט שמרכז את כל ניהול העסק, השיווק והלקוחות במקום אחד.", "A clear process that keeps the business, the marketing and the customers in one place.")}</p>
      </header>
      <ol className="pv-steps hc-rail" ref={railRef} aria-label={text("איך Bizuply עובדת?", "How does Bizuply work?")} onKeyDown={onKey}>
        {steps.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={index === step ? "is-on" : index < step ? "is-done" : undefined}
              aria-current={index === step ? "step" : undefined}
              onClick={() => go(index)}
            >
              <i aria-hidden="true">{index + 1}</i>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="hc-record" data-step={current.id}>
        <header className="hc-record-top">
          <strong>BizUply</strong>
          <span>{text("נועה ברק", "Noa Barak")} · {text("סטודיו נורה", "Nora Studio")}</span>
          <em>{text("הדגמה · לא נתוני לקוח אמיתיים", "Demo · not real customer data")}</em>
        </header>
        <div className="hc-record-body" key={current.id}>
          <StoryScene id={current.id} text={text} />
        </div>
        <footer className="hc-record-foot">
          <div>
            <p className="pv-kicker">{current.kicker}</p>
            <h3>{current.title}</h3>
            <p>{current.body}</p>
          </div>
          <p className="hc-result"><span>{text("תוצאה", "Result")}</span>{current.result}</p>
          <div className="pv-actions">
            <button type="button" className="pv-btn" onClick={() => go(step + 1)}>{text("המשך לשלב הבא", "Continue to the next step")}</button>
            <button type="button" className="pv-btn pv-btn-line" onClick={() => onWatch(current.watch)}>{text("לצפות בשלב הזה", "Watch this step")}</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
