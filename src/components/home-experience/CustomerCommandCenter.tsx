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
  cardHe: string;
  markHe: string;
  sourceHe: string;
  sourceEn: string;
  phoneHe: string;
  phoneEn: string;
  emailHe: string;
  emailEn: string;
  status: StatusId;
  arrived: string;
  activities: Activity[];
};

const STATUSES: StatusId[] = ["new", "contacted", "interested", "quote", "converted"];

const SEED: Customer[] = [
  {
    id: "noa",
    nameHe: "נועה לוי",
    nameEn: "Emily Johnson",
    cardHe: "נועה לוי / Noa Levi",
    markHe: "NL",
    sourceHe: "Meta",
    sourceEn: "Meta",
    phoneHe: "+972 54-789-1234",
    phoneEn: "+1 (415) 555-0142",
    emailHe: "noa.levi@gmail.com",
    emailEn: "emily.johnson@example.com",
    status: "contacted",
    arrived: "10:24",
    activities: [
      { id: "n1", kind: "whatsapp", textHe: "תשובה לליד: נשלחו פרטים נוספים.", textEn: "Reply to the lead: sent more details.", whenHe: "היום, 10:24", whenEn: "Today, 10:24" },
      { id: "n2", kind: "call", textHe: "שיחה עם נועה, סקירת האפשרויות. ביקשה פרטים נוספים עד מחר.", textEn: "Spoke with Emily, reviewed the options. She asked to get more info by tomorrow.", whenHe: "היום, 10:02", whenEn: "Today, 10:02" },
      { id: "n3", kind: "note", textHe: "מעוניינת להתקדם. מעדיפה המשך ב־WhatsApp.", textEn: "Interested in moving forward. Prefer contact by WhatsApp.", whenHe: "היום, 09:48", whenEn: "Today, 09:48" },
      { id: "n4", kind: "task", textHe: "לשלוח פירוט ולחזור אליה.", textEn: "Send detailed information and follow up.", whenHe: "יעד: מחר", whenEn: "Due: Tomorrow" },
    ],
  },
  {
    id: "daniel",
    nameHe: "דניאל כהן",
    nameEn: "Michael Anderson",
    cardHe: "דניאל כהן / Daniel Cohen",
    markHe: "DC",
    sourceHe: "האתר",
    sourceEn: "Website",
    phoneHe: "050-000-1002",
    phoneEn: "+1 (212) 555-0196",
    emailHe: "daniel.cohen@demo.bizuply.com",
    emailEn: "michael.anderson@example.com",
    status: "new",
    arrived: "10:08",
    activities: [
      { id: "d1", kind: "note", textHe: "ליד חדש מטופס באתר. עדיין לא נוצר קשר.", textEn: "A new lead from the website form. No contact yet.", whenHe: "10:08", whenEn: "10:08" },
    ],
  },
  {
    id: "maya",
    nameHe: "מאיה בר",
    nameEn: "Jessica Miller",
    cardHe: "מאיה בר / Maya Bar",
    markHe: "MB",
    sourceHe: "Google",
    sourceEn: "Google",
    phoneHe: "050-000-1003",
    phoneEn: "+1 (310) 555-0173",
    emailHe: "maya.bar@demo.bizuply.com",
    emailEn: "jessica.miller@example.com",
    status: "interested",
    arrived: "09:56",
    activities: [
      { id: "m1", kind: "call", textHe: "שאלה על מחיר וזמינות. ביקשה הצעת מחיר.", textEn: "Asked about price and availability. Requested a quote.", whenHe: "09:56", whenEn: "09:56" },
    ],
  },
  {
    id: "ori",
    nameHe: "אורי חזן",
    nameEn: "David Wilson",
    cardHe: "אורי חזן / Ori Hazan",
    markHe: "OH",
    sourceHe: "Meta",
    sourceEn: "Meta",
    phoneHe: "050-000-1004",
    phoneEn: "+1 (617) 555-0118",
    emailHe: "ori.hazan@demo.bizuply.com",
    emailEn: "david.wilson@example.com",
    status: "quote",
    arrived: "09:42",
    activities: [
      { id: "o1", kind: "task", textHe: "לעקוב אחרי הצעת המחיר שנשמרה בכרטיס.", textEn: "Follow up on the quote saved on the card.", whenHe: "היום", whenEn: "Today" },
    ],
  },
  {
    id: "tal",
    nameHe: "טל שחר",
    nameEn: "Sarah Thompson",
    cardHe: "טל שחר / Tal Shahar",
    markHe: "TS",
    sourceHe: "ידני",
    sourceEn: "Manual",
    phoneHe: "050-000-1005",
    phoneEn: "+1 (312) 555-0164",
    emailHe: "tal.shahar@demo.bizuply.com",
    emailEn: "sarah.thompson@example.com",
    status: "new",
    arrived: "09:20",
    activities: [
      { id: "t1", kind: "note", textHe: "נוסף ידנית לכרטיס. ממתין לפנייה ראשונה.", textEn: "Added manually to the card. Waiting for a first contact.", whenHe: "09:20", whenEn: "09:20" },
    ],
  },
  {
    id: "roni",
    nameHe: "רוני אלמוג",
    nameEn: "James Parker",
    cardHe: "רוני אלמוג / Roni Almog",
    markHe: "RA",
    sourceHe: "האתר",
    sourceEn: "Website",
    phoneHe: "050-000-1006",
    phoneEn: "+1 (206) 555-0137",
    emailHe: "roni.almog@demo.bizuply.com",
    emailEn: "james.parker@example.com",
    status: "contacted",
    arrived: "09:11",
    activities: [
      { id: "r1", kind: "whatsapp", textHe: "נשמרה פנייה ראשונה. לא נשלחה הודעה אמיתית.", textEn: "A first message was saved. Nothing was sent.", whenHe: "09:11", whenEn: "09:11" },
    ],
  },
];

function Icon({ name }: { name: "phone" | "chat" | "task" | "note" | "user" | "source" | "alert" | "calendar" | "check" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "phone" ? <path d="M7 3.5h2.2l1.2 3.2-1.7.8a12.2 12.2 0 0 0 5.8 5.8l.8-1.7 3.2 1.2V15a2.5 2.5 0 0 1-2.5 2.5A13.5 13.5 0 0 1 4.5 6 2.5 2.5 0 0 1 7 3.5Z" /> : null}
      {name === "chat" ? <path d="M5 6.5h14v9H9l-4 3v-3H5v-9Z" /> : null}
      {name === "task" ? <path d="M8 4.5h8v3H8v-3Zm-2 3h12v12H6v-12Zm3.2 6.2 1.6 1.6 3.2-3.4" /> : null}
      {name === "note" ? <path d="M7 3.5h7l4 4V20H7V3.5Zm7 0v4h4" /> : null}
      {name === "user" ? <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm-6 7.2a6 6 0 0 1 12 0" /> : null}
      {name === "source" ? <path d="M8 8.5a3.2 3.2 0 1 0 0 7h1.2M16 8.5a3.2 3.2 0 1 1 0 7h-1.2M9 12h6" /> : null}
      {name === "alert" ? <path d="M12 4.5 20 19H4L12 4.5Zm0 5.2v4.2M12 17.2h.1" /> : null}
      {name === "calendar" ? <path d="M7 5.5V3.8M17 5.5V3.8M4.5 9h15M6 5.5h12v13H6v-13Z" /> : null}
      {name === "check" ? <path d="M6 12.5 10 16l8-8" /> : null}
    </svg>
  );
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
  const [composer, setComposer] = useState<ActivityKind | "">("");
  const [feed, setFeed] = useState<"all" | "note" | "task" | "call" | "whatsapp">("all");
  const [nav, setNav] = useState<"customers" | "inbox" | "tasks" | "calls" | "whatsapp" | "notes">("customers");
  const [statusOpen, setStatusOpen] = useState(false);
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

  const source = text(customer.sourceHe, customer.sourceEn);
  const displayName = text(customer.cardHe, customer.nameEn);
  const mark = text(customer.markHe, customer.nameEn.split(" ").map((part) => part[0] || "").join("").slice(0, 2));
  const phone = text(customer.phoneHe, customer.phoneEn);
  const email = text(customer.emailHe, customer.emailEn);
  const stageIndex = STATUSES.indexOf(customer.status);
  const newCount = customers.filter((item) => item.status === "new").length;
  const attention = customers.filter((item) => item.status === "new" || item.status === "contacted").length;
  const tasks = customers.reduce((sum, item) => sum + item.activities.filter((activity) => activity.kind === "task").length, 0);
  const shownNew = 22 + newCount;
  const shownAttention = 3 + attention;
  const shownFollow = 10 + tasks;
  const visible = customer.activities.filter((activity) => feed === "all" || activity.kind === feed);
  const chooseNav = (id: "customers" | "inbox" | "tasks" | "calls" | "whatsapp" | "notes", next: typeof feed) => {
    setNav(id);
    setFeed(next);
  };
  const openComposer = (kind: "task" | "note") => {
    setComposer(kind);
    window.setTimeout(() => document.getElementById(kind === "task" ? "cc-task" : "cc-note")?.focus(), 0);
  };

  const tabs = [
    ["all", text("פעילות", "Activity"), "customers"],
    ["note", text("הערות", "Notes"), "notes"],
    ["task", text("משימות", "Tasks"), "tasks"],
    ["call", text("שיחות", "Calls"), "calls"],
  ] as const;

  return (
    <section className="cc-section" id="crm" dir={dir} aria-labelledby="cc-title">
      <h2 id="cc-title" className="cc-sr">{text("כרטיס הלקוח", "Customer card")}</h2>
      <div className="cc-app">
        <div className="cc-side" aria-label={text("הדגמת המוצר", "Product demo")}>
          <p className="cc-brand"><span />Bizuply CRM</p>
          {([
            ["customers", "all", text("לקוחות", "Customers"), "user"],
            ["inbox", "all", text("תיבת לידים", "Leads Inbox"), "alert"],
            ["tasks", "task", text("משימות", "Tasks"), "task"],
            ["calls", "call", text("שיחות", "Calls"), "phone"],
            ["whatsapp", "whatsapp", "WhatsApp", "chat"],
            ["notes", "note", text("הערות", "Notes"), "note"],
          ] as const).map(([id, next, label, icon]) => (
            <button key={id} type="button" className={nav === id ? "is-on" : undefined} onClick={() => chooseNav(id, next)}>
              <Icon name={icon} />{label}
            </button>
          ))}
        </div>
        <div className="cc-body">

        <div className="cc-stage">
          <div className="cc-metrics" aria-label={text("סיכום הדגמה", "Demo summary")}>
            <p><Icon name="user" /><span><small>{text("לידים חדשים", "New leads")}</small><b>{shownNew}</b></span></p>
            <p><Icon name="alert" /><span><small>{text("דורשים טיפול", "Needs attention")}</small><b>{shownAttention}</b></span></p>
            <p><Icon name="calendar" /><span><small>{text("מעקבים להיום", "Follow-ups today")}</small><b>{shownFollow}</b></span></p>
          </div>

          <div className="cc-layout">
            <div className="cc-list">
              <p className="cc-list-title">{text("לידים נכנסים", "Incoming leads")}<b>{shownNew}</b></p>
              <ul>
                {customers.map((item) => {
                  const on = item.id === customer.id;
                  return (
                    <li key={item.id}>
                      <button type="button" className={on ? "is-on" : undefined} aria-current={on ? "true" : undefined} onClick={() => { setSelectedId(item.id); setNotice(""); }}>
                        <i />
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
              <div className="cc-identity">
              <header className="cc-person">
                <b aria-hidden="true">{mark}</b>
                <div className="cc-person-main">
                  <h3>{displayName}</h3>
                  <div className="cc-person-meta">
                    <span className="cc-source"><Icon name="source" />{source}</span>
                    <span className="cc-status-wrap">
                      <button type="button" className={`cc-status is-${customer.status}`} aria-expanded={statusOpen} onClick={() => setStatusOpen((open) => !open)}>
                        {statusLabel(customer.status)}
                        <i />
                      </button>
                      {statusOpen ? (
                        <span className="cc-status-menu">
                          {STATUSES.map((status) => (
                            <button key={status} type="button" onClick={() => { setStatus(status); setStatusOpen(false); }}>{statusLabel(status)}</button>
                          ))}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>
              </header>

              <div className="cc-contact">
                <button type="button" onClick={() => logLocal("call")}><Icon name="phone" /><bdi dir="ltr">{phone}</bdi></button>
                <button type="button" className="is-whatsapp" onClick={() => logLocal("whatsapp")}><Icon name="chat" />WhatsApp</button>
                <span><bdi dir="ltr">{email}</bdi></span>
              </div>
              </div>

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

              <div className="cc-phone-actions">
                <button type="button" onClick={() => logLocal("call")}><Icon name="phone" />{text("שיחה", "Call")}</button>
                <button type="button" onClick={() => logLocal("whatsapp")}><Icon name="chat" />WhatsApp</button>
                <button type="button" onClick={() => openComposer("task")}><Icon name="task" />{text("משימה", "Task")}</button>
              </div>
              <div className="cc-tabs" role="tablist" aria-label={text("היסטוריית פעילות", "Activity history")}>
                {tabs.map(([id, label, nextNav]) => (
                  <button key={id} type="button" role="tab" aria-selected={feed === id} className={feed === id ? "is-on" : undefined} onClick={() => chooseNav(nextNav, id)}>{label}</button>
                ))}
              </div>
            </article>

            <div className="cc-feed">
              <ol className="cc-timeline">
                {visible.map((activity) => (
                  <li key={activity.id} className={`is-${activity.kind}`}>
                    <i><Icon name={activity.kind === "whatsapp" ? "chat" : activity.kind === "call" ? "phone" : activity.kind === "task" ? "check" : "note"} /></i>
                    <div>
                      <strong>{kindLabel(activity.kind)}</strong>
                      <p>{text(activity.textHe, activity.textEn)}</p>
                    </div>
                    <time>{text(activity.whenHe, activity.whenEn)}</time>
                  </li>
                ))}
              </ol>
              {visible.length === 0 ? <p className="cc-empty">{text("אין פריטים בתצוגה הזו.", "Nothing in this view.")}</p> : null}
              {notice ? <p className="cc-notice" role="status">{notice}</p> : null}
              <button type="button" className="cc-follow" onClick={() => (task.trim() ? addActivity("task", task) : openComposer("task"))}>
                <Icon name="check" />
                {text("יצירת משימת מעקב", "Create follow-up task")}
              </button>
            </div>

            <aside className="cc-actions">
              <h4>{text("פעולות", "Actions")}</h4>
              <button type="button" onClick={() => logLocal("call")}><Icon name="phone" />{text("שיחה", "Call")}</button>
              <button type="button" onClick={() => logLocal("whatsapp")}><Icon name="chat" />WhatsApp</button>
              <button type="button" onClick={() => openComposer("task")}><Icon name="task" />{text("יצירת משימה", "Create task")}</button>
              <button type="button" onClick={() => openComposer("note")}><Icon name="note" />{text("הוספת הערה", "Add note")}</button>
              {composer === "task" || composer === "note" ? (
                <form onSubmit={(event) => { event.preventDefault(); addActivity(composer, composer === "task" ? task : note); }}>
                  <label htmlFor={composer === "task" ? "cc-task" : "cc-note"}>
                    {composer === "task" ? text("משימה חדשה", "New task") : text("הערה לכרטיס", "Note on the card")}
                  </label>
                  {composer === "task" ? (
                    <input id="cc-task" value={task} onChange={(event) => setTask(event.target.value)} placeholder={text("מה צריך לעשות?", "What needs to be done?")} />
                  ) : (
                    <textarea id="cc-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder={text("הערה קצרה לצוות", "A short note for the team")} />
                  )}
                  <button type="submit">{composer === "task" ? text("שמירת משימה", "Save task") : text("שמירת הערה", "Save note")}</button>
                </form>
              ) : null}
            </aside>
            <div className="cc-details">
                <h4>{text("פרטי לקוח", "Customer details")}</h4>
                <p><Icon name="user" /><span>{displayName}</span></p>
                <p><Icon name="source" /><span>{text("מקור", "Source")}: {source}</span></p>
                <p><Icon name="check" /><span>{text("סטטוס", "Status")}</span><b className={`cc-status is-${customer.status}`}>{statusLabel(customer.status)}</b></p>
                <p><Icon name="phone" /><bdi dir="ltr">{phone}</bdi></p>
                <p><Icon name="chat" /><bdi dir="ltr">{email}</bdi></p>
              </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
