import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./customerCommand.css";

type StatusId = "new" | "contacted" | "interested" | "quote" | "converted";
type ActivityKind = "whatsapp" | "call" | "note" | "task";

type Activity = {
  id: string;
  kind: ActivityKind;
  textHe: string;
  textEn: string;
  whenHe: string;
  whenEn: string;
};

type Customer = {
  id: string;
  nameHe: string;
  nameEn: string;
  sourceHe: string;
  sourceEn: string;
  phone: string;
  email: string;
  status: StatusId;
  arrived: string;
  activities: Activity[];
};

const STATUSES: StatusId[] = ["new", "contacted", "interested", "quote", "converted"];

const SEED: Customer[] = [
  {
    id: "noa",
    nameHe: "נועה לוי",
    nameEn: "Noa Levi",
    sourceHe: "Meta",
    sourceEn: "Meta",
    phone: "050-000-1001",
    email: "noa.levi@demo.bizuply.com",
    status: "contacted",
    arrived: "10:24",
    activities: [
      { id: "n1", kind: "whatsapp", textHe: "הלקוחה ביקשה פרטים נוספים. ההודעה נשמרה בהדגמה.", textEn: "The customer asked for more details. The message stayed in the demo.", whenHe: "10:24", whenEn: "10:24" },
      { id: "n2", kind: "call", textHe: "שיחה קצרה: עברה על האפשרויות וביקשה לחזור מחר.", textEn: "A short call: she reviewed the options and asked for a follow-up tomorrow.", whenHe: "10:02", whenEn: "10:02" },
      { id: "n3", kind: "note", textHe: "מעוניינת להתקדם. מעדיפה המשך ב־WhatsApp.", textEn: "Interested in moving forward. Prefers WhatsApp.", whenHe: "09:48", whenEn: "09:48" },
      { id: "n4", kind: "task", textHe: "לשלוח פירוט ולחזור אליה.", textEn: "Send the details and follow up.", whenHe: "מחר", whenEn: "Tomorrow" },
    ],
  },
  {
    id: "daniel",
    nameHe: "דניאל כהן",
    nameEn: "Daniel Cohen",
    sourceHe: "האתר",
    sourceEn: "Website",
    phone: "050-000-1002",
    email: "daniel.cohen@demo.bizuply.com",
    status: "new",
    arrived: "10:08",
    activities: [
      { id: "d1", kind: "note", textHe: "ליד חדש מטופס באתר. עדיין לא נוצר קשר.", textEn: "A new lead from the website form. No contact yet.", whenHe: "10:08", whenEn: "10:08" },
    ],
  },
  {
    id: "maya",
    nameHe: "מאיה בר",
    nameEn: "Maya Bar",
    sourceHe: "Google",
    sourceEn: "Google",
    phone: "050-000-1003",
    email: "maya.bar@demo.bizuply.com",
    status: "interested",
    arrived: "09:56",
    activities: [
      { id: "m1", kind: "call", textHe: "שאלה על מחיר וזמינות. ביקשה הצעת מחיר.", textEn: "Asked about price and availability. Requested a quote.", whenHe: "09:56", whenEn: "09:56" },
    ],
  },
  {
    id: "ori",
    nameHe: "אורי חזן",
    nameEn: "Ori Hazan",
    sourceHe: "Meta",
    sourceEn: "Meta",
    phone: "050-000-1004",
    email: "ori.hazan@demo.bizuply.com",
    status: "quote",
    arrived: "09:42",
    activities: [
      { id: "o1", kind: "task", textHe: "לעקוב אחרי הצעת המחיר שנשמרה בכרטיס.", textEn: "Follow up on the quote saved on the card.", whenHe: "היום", whenEn: "Today" },
    ],
  },
  {
    id: "tal",
    nameHe: "טל שחר",
    nameEn: "Tal Shahar",
    sourceHe: "ידני",
    sourceEn: "Manual",
    phone: "050-000-1005",
    email: "tal.shahar@demo.bizuply.com",
    status: "new",
    arrived: "09:20",
    activities: [
      { id: "t1", kind: "note", textHe: "נוסף ידנית לכרטיס. ממתין לפנייה ראשונה.", textEn: "Added manually to the card. Waiting for a first contact.", whenHe: "09:20", whenEn: "09:20" },
    ],
  },
  {
    id: "roni",
    nameHe: "רוני אלמוג",
    nameEn: "Roni Almog",
    sourceHe: "האתר",
    sourceEn: "Website",
    phone: "050-000-1006",
    email: "roni.almog@demo.bizuply.com",
    status: "contacted",
    arrived: "09:11",
    activities: [
      { id: "r1", kind: "whatsapp", textHe: "נשמרה פנייה ראשונה. לא נשלחה הודעה אמיתית.", textEn: "A first message was saved. Nothing was sent.", whenHe: "09:11", whenEn: "09:11" },
    ],
  },
];

function initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
}

export default function CustomerCommandCenter() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [customers, setCustomers] = useState<Customer[]>(SEED);
  const [selectedId, setSelectedId] = useState(SEED[0].id);
  const [note, setNote] = useState("");
  const [task, setTask] = useState("");
  const [notice, setNotice] = useState("");
  const customer = customers.find((item) => item.id === selectedId) || customers[0];

  const statusLabel = (status: StatusId) => {
    const labels: Record<StatusId, [string, string]> = {
      new: ["חדש", "New"],
      contacted: ["נוצר קשר", "Contacted"],
      interested: ["מעוניין", "Interested"],
      quote: ["הצעת מחיר", "Quote"],
      converted: ["הומר", "Converted"],
    };
    return text(labels[status][0], labels[status][1]);
  };

  const kindLabel = (kind: ActivityKind) => {
    const labels: Record<ActivityKind, [string, string]> = {
      whatsapp: ["הודעה", "Message"],
      call: ["שיחה", "Call"],
      note: ["הערה", "Note"],
      task: ["משימה", "Task"],
    };
    return text(labels[kind][0], labels[kind][1]);
  };

  const patch = (id: string, update: (current: Customer) => Customer, message: string) => {
    setCustomers((current) => current.map((item) => (item.id === id ? update(item) : item)));
    setNotice(message);
  };

  const setStatus = (status: StatusId) => {
    if (status === customer.status) {
      setNotice(text("הסטטוס כבר מעודכן בכרטיס.", "This status is already on the card."));
      return;
    }
    const labels: Record<StatusId, [string, string]> = {
      new: ["חדש", "New"],
      contacted: ["נוצר קשר", "Contacted"],
      interested: ["מעוניין", "Interested"],
      quote: ["הצעת מחיר", "Quote"],
      converted: ["הומר", "Converted"],
    };
    patch(
      customer.id,
      (current) => ({
        ...current,
        status,
        activities: [
          {
            id: `s-${Date.now()}`,
            kind: "note",
            textHe: `הסטטוס עודכן ל${labels[status][0]}.`,
            textEn: `Status updated to ${labels[status][1]}.`,
            whenHe: "עכשיו",
            whenEn: "Now",
          },
          ...current.activities,
        ],
      }),
      text("הסטטוס עודכן בהדגמה המקומית.", "The status was updated in the local demo."),
    );
  };

  const addActivity = (kind: ActivityKind, body: string) => {
    const value = body.trim();
    if (!value) {
      setNotice(text("יש להזין טקסט קצר לפני השמירה.", "Enter a short line before saving."));
      return;
    }
    patch(
      customer.id,
      (current) => ({
        ...current,
        activities: [{ id: `${kind}-${Date.now()}`, kind, textHe: value, textEn: value, whenHe: "עכשיו", whenEn: "Now" }, ...current.activities],
      }),
      kind === "task"
        ? text("המשימה נשמרה על הכרטיס. היא לא נוצרה במערכת האמיתית.", "The task was saved on the card. It was not created in the live system.")
        : text("ההערה נשמרה על הכרטיס. היא לא נכתבה למסד הנתונים.", "The note was saved on the card. It was not written to the database."),
    );
    if (kind === "task") setTask("");
    else setNote("");
  };

  const logLocal = (kind: "call" | "whatsapp") => {
    const body = kind === "call"
      ? text("שיחה סומנה בהדגמה. לא בוצעה חיוג.", "A call was logged in the demo. No call was placed.")
      : text("הודעה נשמרה בהדגמה. היא לא נשלחה.", "A message was saved in the demo. It was not sent.");
    patch(
      customer.id,
      (current) => ({
        ...current,
        activities: [{
        id: `${kind}-${Date.now()}`,
        kind,
        textHe: kind === "call" ? "שיחה סומנה בהדגמה. לא בוצעה חיוג." : "הודעה נשמרה בהדגמה. היא לא נשלחה.",
        textEn: kind === "call" ? "A call was logged in the demo. No call was placed." : "A message was saved in the demo. It was not sent.",
        whenHe: "עכשיו",
        whenEn: "Now",
      }, ...current.activities],
      }),
      body,
    );
  };

  const name = text(customer.nameHe, customer.nameEn);
  const source = text(customer.sourceHe, customer.sourceEn);
  const stageIndex = STATUSES.indexOf(customer.status);
  const newCount = customers.filter((item) => item.status === "new").length;
  const attention = customers.filter((item) => item.status === "new" || item.status === "contacted").length;
  const tasks = customers.reduce((sum, item) => sum + item.activities.filter((activity) => activity.kind === "task").length, 0);

  return (
    <section className="cc-section" id="crm" dir={dir} aria-labelledby="cc-title">
      <div className="cc-wrap">
        <header className="cc-head">
          <p className="cc-kicker">{text("CRM וניהול לידים", "CRM and lead management")}</p>
          <h2 id="cc-title">{text("כרטיס הלקוח, מוכן לפעולה.", "The customer card, ready for action.")}</h2>
          <p>{text("רואים את פרטי הקשר, המקור, הסטטוס וההיסטוריה בכרטיס אחד. כל פעולה כאן נשארת בהדגמה המקומית.", "Contact details, source, status and history sit on one card. Every action here stays in the local demo.")}</p>
        </header>

        <div className="cc-stage">
          <div className="cc-metrics" aria-label={text("סיכום הדגמה", "Demo summary")}>
            <p><b>{newCount}</b><span>{text("לידים חדשים", "New leads")}</span></p>
            <p><b>{attention}</b><span>{text("דורשים טיפול", "Need attention")}</span></p>
            <p><b>{tasks}</b><span>{text("משימות בכרטיסים", "Tasks on cards")}</span></p>
          </div>

          <div className="cc-layout">
            <div className="cc-list">
              <p className="cc-list-title">{text("לידים נכנסים", "Incoming leads")}<b>{customers.length}</b></p>
              <ul>
                {customers.map((item) => {
                  const on = item.id === customer.id;
                  return (
                    <li key={item.id}>
                      <button type="button" className={on ? "is-on" : undefined} aria-current={on ? "true" : undefined} onClick={() => { setSelectedId(item.id); setNotice(""); }}>
                        <span>
                          <strong>{text(item.nameHe, item.nameEn)}</strong>
                          <small>{text(item.sourceHe, item.sourceEn)}</small>
                        </span>
                        <em>{item.arrived}</em>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <article className="cc-card" aria-live="polite">
              <header className="cc-person">
                <b aria-hidden="true">{initials(name)}</b>
                <div>
                  <h3>{name}</h3>
                  <p>{text("מקור", "Source")}: {source}</p>
                </div>
                <span className={`cc-status is-${customer.status}`}>{statusLabel(customer.status)}</span>
              </header>

              <ol className="cc-pipeline" aria-label={text("התקדמות בצינור המכירות", "Sales pipeline progress")}>
                {STATUSES.map((status, index) => (
                  <li key={status} className={index < stageIndex ? "is-done" : index === stageIndex ? "is-on" : undefined}>
                    <button type="button" onClick={() => setStatus(status)} aria-current={index === stageIndex ? "step" : undefined}>
                      <i />
                      {statusLabel(status)}
                    </button>
                  </li>
                ))}
              </ol>

              <dl className="cc-facts">
                <div><dt>{text("טלפון", "Phone")}</dt><dd><bdi dir="ltr">{customer.phone}</bdi></dd></div>
                <div><dt>{text("אימייל", "Email")}</dt><dd><bdi dir="ltr">{customer.email}</bdi></dd></div>
                <div><dt>{text("מקור הליד", "Lead source")}</dt><dd>{source}</dd></div>
              </dl>

              <h4>{text("היסטוריית פעילות", "Activity history")}</h4>
              <ol className="cc-activity">
                {customer.activities.map((activity) => (
                  <li key={activity.id} className={`is-${activity.kind}`}>
                    <b>{kindLabel(activity.kind)}</b>
                    <span>{text(activity.textHe, activity.textEn)}</span>
                    <em>{text(activity.whenHe, activity.whenEn)}</em>
                  </li>
                ))}
              </ol>
              {notice ? <p className="cc-notice" role="status">{notice}</p> : null}
            </article>

            <aside className="cc-actions">
              <h4>{text("פעולות על הכרטיס", "Actions on the card")}</h4>
              <button type="button" onClick={() => logLocal("call")}>{text("סימון שיחה", "Log a call")}</button>
              <button type="button" onClick={() => logLocal("whatsapp")}>{text("שמירת הודעה", "Save a message")}</button>
              <form onSubmit={(event) => { event.preventDefault(); addActivity("task", task); }}>
                <label htmlFor="cc-task">{text("משימה חדשה", "New task")}</label>
                <input id="cc-task" value={task} onChange={(event) => setTask(event.target.value)} placeholder={text("מה צריך לעשות?", "What needs to be done?")} />
                <button type="submit">{text("יצירת משימה", "Create task")}</button>
              </form>
              <form onSubmit={(event) => { event.preventDefault(); addActivity("note", note); }}>
                <label htmlFor="cc-note">{text("הערה לכרטיס", "Note on the card")}</label>
                <textarea id="cc-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder={text("הערה קצרה לצוות", "A short note for the team")} />
                <button type="submit">{text("הוספת הערה", "Add note")}</button>
              </form>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
