import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./whatsappOperations.css";

type Folder = "all" | "open" | "pending" | "closed";
type Tick = "saved" | "delivered" | "read";

type ChatMessage = {
  id: string;
  from: "customer" | "business";
  textHe: string;
  textEn: string;
  time: string;
  tick?: Tick;
};

type Thread = {
  id: string;
  nameHe: string;
  nameEn: string;
  initials: string;
  phone: string;
  email: string;
  folder: Exclude<Folder, "all">;
  unread: number;
  tagsHe: string[];
  tagsEn: string[];
  messages: ChatMessage[];
};

const TEMPLATES = [
  { id: "order", he: "עדכון הזמנה", en: "Order update", bodyHe: "ההזמנה שלך כבר נארזה ומשולחת היום בשעות הערב.", bodyEn: "Your order is packed and goes out this evening." },
  { id: "meeting", he: "תזכורת לפגישה", en: "Appointment reminder", bodyHe: "תזכורת: הפגישה מחר בין 10:00 ל־14:00.", bodyEn: "Reminder: the meeting is tomorrow between 10:00 and 14:00." },
  { id: "offer", he: "מבצע מיוחד", en: "Special offer", bodyHe: "יש הצעה להמשך. ההודעה נשמרת כאן בלבד ולא נשלחת.", bodyEn: "There is a follow-up offer. This message stays here and is not sent." },
] as const;

const SEED: Thread[] = [
  {
    id: "noa",
    nameHe: "נועה לוי",
    nameEn: "Noa Levi",
    initials: "נל",
    phone: "050-000-2001",
    email: "noa.levi@demo.bizuply.com",
    folder: "open",
    unread: 2,
    tagsHe: ["לקוחה פעילה", "רכישה חוזרת"],
    tagsEn: ["Active customer", "Repeat purchase"],
    messages: [
      { id: "n1", from: "customer", textHe: "היי, אפשר לקבל עדכון לגבי ההזמנה שלי?", textEn: "Hi, can I get an update on my order?", time: "10:02" },
      { id: "n2", from: "business", textHe: "היי נועה, כמובן. ההזמנה שלך כבר נארזה ומשולחת היום בשעות הערב.", textEn: "Hi Noa. Your order is packed and goes out this evening.", time: "10:08", tick: "read" },
      { id: "n3", from: "customer", textHe: "מעולה! מתי אפשר להגיע?", textEn: "Great! When should I expect it?", time: "10:12" },
      { id: "n4", from: "business", textHe: "ההזמנה צפויה להגיע מחר בין 10:00 ל־14:00.", textEn: "It should arrive tomorrow between 10:00 and 14:00.", time: "10:15", tick: "delivered" },
      { id: "n5", from: "customer", textHe: "תודה רבה.", textEn: "Thank you.", time: "10:24" },
    ],
  },
  {
    id: "daniel",
    nameHe: "דניאל כהן",
    nameEn: "Daniel Cohen",
    initials: "דכ",
    phone: "050-000-2002",
    email: "daniel.cohen@demo.bizuply.com",
    folder: "open",
    unread: 0,
    tagsHe: ["ליד חדש"],
    tagsEn: ["New lead"],
    messages: [
      { id: "d1", from: "customer", textHe: "שלום, ראיתי את האתר ורציתי לשמוע פרטים.", textEn: "Hello, I saw the website and wanted a few details.", time: "09:47" },
    ],
  },
  {
    id: "maya",
    nameHe: "מאיה כץ",
    nameEn: "Maya Katz",
    initials: "מכ",
    phone: "050-000-2003",
    email: "maya.katz@demo.bizuply.com",
    folder: "pending",
    unread: 1,
    tagsHe: ["פגישה"],
    tagsEn: ["Meeting"],
    messages: [
      { id: "m1", from: "customer", textHe: "יש לכם מועד נוסף לסדנה?", textEn: "Do you have another time for the workshop?", time: "09:12" },
    ],
  },
  {
    id: "eitan",
    nameHe: "איתן בר",
    nameEn: "Eitan Bar",
    initials: "אב",
    phone: "050-000-2004",
    email: "eitan.bar@demo.bizuply.com",
    folder: "closed",
    unread: 0,
    tagsHe: ["טופל"],
    tagsEn: ["Handled"],
    messages: [
      { id: "e1", from: "business", textHe: "שמחנו לעזור. השיחה נשמרה בהדגמה.", textEn: "Glad we could help. The conversation stayed in the demo.", time: "18:20", tick: "read" },
    ],
  },
  {
    id: "roni",
    nameHe: "רוני חדד",
    nameEn: "Roni Haddad",
    initials: "רח",
    phone: "050-000-2005",
    email: "roni.haddad@demo.bizuply.com",
    folder: "pending",
    unread: 0,
    tagsHe: ["הצעה"],
    tagsEn: ["Offer"],
    messages: [
      { id: "r1", from: "customer", textHe: "תודה על העדכון. אחזור אליכם.", textEn: "Thanks for the update. I will get back to you.", time: "17:05" },
    ],
  },
  {
    id: "lior",
    nameHe: "ליאור פרץ",
    nameEn: "Lior Peretz",
    initials: "לפ",
    phone: "050-000-2006",
    email: "lior.peretz@demo.bizuply.com",
    folder: "closed",
    unread: 0,
    tagsHe: ["נסגר"],
    tagsEn: ["Closed"],
    messages: [
      { id: "l1", from: "business", textHe: "הכול בסדר, קיבלתי. תודה.", textEn: "All set. Thank you.", time: "16:40", tick: "read" },
    ],
  },
];

function Icon({ name }: { name: "search" | "send" | "task" | "file" | "check" | "tag" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "search" ? <path d="M10.5 5.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm5.2 8.8 3.3 3.2" /> : null}
      {name === "send" ? <path d="M4.5 12 19 5.5 13.5 19l-2-6.2L4.5 12Z" /> : null}
      {name === "task" ? <path d="M8 4.5h8v3H8v-3Zm-2 3h12v12H6v-12Zm3.2 6.2 1.6 1.6 3.2-3.4" /> : null}
      {name === "file" ? <path d="M7 3.5h7l4 4V20H7V3.5Zm7 0v4h4" /> : null}
      {name === "check" ? <path d="M6 12.5 10 16l8-8" /> : null}
      {name === "tag" ? <path d="M4.5 12.5 12 5h6.5V11.5L11 19 4.5 12.5Z" /> : null}
    </svg>
  );
}

export default function WhatsAppOperations() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [threads, setThreads] = useState<Thread[]>(SEED);
  const [selectedId, setSelectedId] = useState(SEED[0].id);
  const [folder, setFolder] = useState<Folder>("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [tasks, setTasks] = useState<Record<string, string[]>>({});
  const thread = threads.find((item) => item.id === selectedId) || threads[0];

  const needle = query.trim().toLowerCase();
  const visibleThreads = threads.filter((item) => {
    const label = text(item.nameHe, item.nameEn).toLowerCase();
    return (folder === "all" || item.folder === folder) && (!needle || label.includes(needle));
  });

  const counts = {
    all: threads.length,
    open: threads.filter((item) => item.folder === "open").length,
    pending: threads.filter((item) => item.folder === "pending").length,
    closed: threads.filter((item) => item.folder === "closed").length,
  };

  const selectThread = (id: string) => {
    setSelectedId(id);
    setTemplatesOpen(false);
    setNotice("");
    setThreads((current) => current.map((item) => (item.id === id ? { ...item, unread: 0 } : item)));
  };

  const pushMessage = (bodyHe: string, bodyEn: string) => {
    const stamp = text("עכשיו", "Now");
    setThreads((current) => current.map((item) => (
      item.id === thread.id
        ? { ...item, messages: [...item.messages, { id: `m-${Date.now()}`, from: "business", textHe: bodyHe, textEn: bodyEn, time: stamp, tick: "saved" }] }
        : item
    )));
    setDraft("");
    setTemplatesOpen(false);
    setNotice(text("ההודעה נשמרה בהדגמה. היא לא נשלחה ב־WhatsApp.", "The message was saved in the demo. It was not sent on WhatsApp."));
  };

  const sendDraft = () => {
    const value = draft.trim();
    if (!value) {
      setNotice(text("יש לכתוב הודעה או לבחור תבנית לפני השמירה.", "Write a message or choose a template before saving."));
      return;
    }
    pushMessage(value, value);
  };

  const addTask = () => {
    const line = text(`משימת מעקב ל${text(thread.nameHe, thread.nameEn)}`, `Follow-up task for ${text(thread.nameHe, thread.nameEn)}`);
    setTasks((current) => ({ ...current, [thread.id]: [line, ...(current[thread.id] || [])] }));
    setNotice(text("המשימה נשמרה על הכרטיס בהדגמה. היא לא נוצרה במערכת האמיתית.", "The task was saved on the card in the demo. It was not created in the live system."));
  };

  const folderLabel = (id: Folder) => {
    const labels: Record<Folder, [string, string]> = {
      all: ["הכל", "All"],
      open: ["פתוחות", "Open"],
      pending: ["בטיפול", "In progress"],
      closed: ["סגורות", "Closed"],
    };
    return text(labels[id][0], labels[id][1]);
  };

  const name = text(thread.nameHe, thread.nameEn);
  const preview = (item: Thread) => {
    const last = item.messages[item.messages.length - 1];
    return last ? text(last.textHe, last.textEn) : "";
  };

  return (
    <section className="wa-section" id="whatsapp" dir={dir} aria-labelledby="wa-title">
      <div className="wa-wrap">
        <header className="wa-head">
          <p className="wa-kicker">WhatsApp Business API</p>
          <h2 id="wa-title">{text("מרכז התקשורת העסקי.", "The business conversation center.")}</h2>
          <p>{text("שיחה, תבנית מאושרת ופרטי הלקוח באותו מסך. כל הודעה כאן נשמרת בהדגמה ולא נשלחת.", "A conversation, an approved template and the customer details share one screen. Every message here stays in the demo and is not sent.")}</p>
        </header>

        <div className="wa-stage">
          <div className="wa-bar">
            <span className="wa-demo">{text("נתוני הדגמה", "Demo data")}</span>
            <span className="wa-live"><i />{text("מחובר · WhatsApp Business API", "Connected · WhatsApp Business API")}</span>
            <strong>{text("מרכז ניהול שיחות", "Conversation operations")}</strong>
          </div>

          <div className="wa-layout">
            <div className="wa-inbox">
              <div className="wa-inbox-head">
                <h3>{text("תיבת שיחות", "Inbox")}</h3>
                <button type="button" onClick={() => setNotice(text("שיחה חדשה נפתחת רק בהדגמה הזו, בלי מספר אמיתי.", "A new conversation opens only in this demo, with no real number."))}>{text("שיחה חדשה", "New chat")}</button>
              </div>
              <div className="wa-filters" role="tablist">
                {(["all", "open", "pending", "closed"] as Folder[]).map((id) => (
                  <button key={id} type="button" role="tab" aria-selected={folder === id} className={folder === id ? "is-on" : undefined} onClick={() => setFolder(id)}>
                    {folderLabel(id)} <b>{counts[id]}</b>
                  </button>
                ))}
              </div>
              <label className="wa-search">
                <Icon name="search" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text("חיפוש שיחה או לקוח", "Search a conversation or customer")} aria-label={text("חיפוש שיחה", "Search conversations")} />
              </label>
              <ul>
                {visibleThreads.map((item) => {
                  const on = item.id === thread.id;
                  return (
                    <li key={item.id}>
                      <button type="button" className={on ? "is-on" : undefined} aria-current={on ? "true" : undefined} onClick={() => selectThread(item.id)}>
                        <b aria-hidden="true">{language.startsWith("he") ? item.initials : item.nameEn.split(" ").map((part) => part[0]).join("")}</b>
                        <span>
                          <strong>{text(item.nameHe, item.nameEn)}</strong>
                          <small>{preview(item)}</small>
                        </span>
                        <em>{item.messages[item.messages.length - 1]?.time}</em>
                        {item.unread > 0 ? <i>{item.unread}</i> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {visibleThreads.length === 0 ? <p className="wa-empty">{text("אין שיחות בתצוגה הזו.", "No conversations in this view.")}</p> : null}
            </div>

            <div className="wa-chat">
              <header>
                <div>
                  <h3>{name}</h3>
                  <p>{text("איש קשר פעיל", "Active contact")}</p>
                </div>
              </header>
              <ol>
                {thread.messages.map((message) => (
                  <li key={message.id} className={message.from === "business" ? "is-out" : "is-in"}>
                    <p>{text(message.textHe, message.textEn)}</p>
                    <time>
                      {message.time}
                      {message.tick === "saved" ? <span>{text("נשמר", "Saved")}</span> : null}
                      {message.tick === "delivered" ? <span>✓✓</span> : null}
                      {message.tick === "read" ? <span className="is-read">✓✓</span> : null}
                    </time>
                  </li>
                ))}
              </ol>
              {notice ? <p className="wa-notice" role="status">{notice}</p> : null}
              <form className="wa-composer" onSubmit={(event) => { event.preventDefault(); sendDraft(); }}>
                <div className="wa-templates">
                  <button type="button" aria-expanded={templatesOpen} onClick={() => setTemplatesOpen((open) => !open)}>{text("תבנית מאושרת", "Approved template")}</button>
                  {templatesOpen ? (
                    <ul>
                      {TEMPLATES.map((template) => (
                        <li key={template.id}>
                          <button type="button" onClick={() => { setDraft(text(template.bodyHe, template.bodyEn)); setTemplatesOpen(false); }}>
                            <strong>{text(template.he, template.en)}</strong>
                            <small>{text(template.bodyHe, template.bodyEn)}</small>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <label className="wa-draft">
                  <span className="wa-sr">{text("טקסט ההודעה", "Message text")}</span>
                  <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={text("הקלידו הודעה ללקוח…", "Write a message to the customer…")} />
                </label>
                <button type="submit" className="wa-send" aria-label={text("שמירת ההודעה בהדגמה", "Save the message in the demo")}><Icon name="send" /></button>
              </form>
            </div>

            <aside className="wa-profile">
              <h3>{text("פרטי לקוח", "Customer profile")}</h3>
              <div className="wa-who">
                <b aria-hidden="true">{language.startsWith("he") ? thread.initials : thread.nameEn.split(" ").map((part) => part[0]).join("")}</b>
                <div>
                  <strong>{name}</strong>
                  <small>{text("איש קשר פעיל", "Active contact")}</small>
                </div>
              </div>
              <p><bdi dir="ltr">{thread.phone}</bdi></p>
              <p><bdi dir="ltr">{thread.email}</bdi></p>
              <h4>{text("תגיות", "Tags")}</h4>
              <div className="wa-tags">
                {text(thread.tagsHe.join("|"), thread.tagsEn.join("|")).split("|").map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <h4>{text("פעילות אחרונה", "Last activity")}</h4>
              <p className="wa-last">{thread.messages[thread.messages.length - 1]?.time} · {preview(thread)}</p>
              {(tasks[thread.id] || []).map((task) => <p key={task} className="wa-task">{task}</p>)}
              <button type="button" className="wa-primary" onClick={addTask}><Icon name="task" />{text("יצירת משימה", "Create task")}</button>
              <button type="button" className="wa-secondary" onClick={() => document.getElementById("crm")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                <Icon name="file" />{text("פתיחת כרטיס הלקוח", "Open customer record")}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
