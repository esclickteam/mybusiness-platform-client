import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./whatsappOperations.css";

type Folder = "all" | "open" | "pending" | "closed";
type Pane = "inbox" | "chat" | "profile";
type Tick = "sent" | "delivered" | "read";

type ChatMessage = {
  id: string;
  from: "customer" | "business";
  textHe: string;
  textEn: string;
  time: string;
  tick?: Tick;
  fresh?: boolean;
};

type Activity = { id: string; textHe: string; textEn: string; time: string };

type Thread = {
  id: string;
  nameHe: string;
  nameEn: string;
  markHe: string;
  markEn: string;
  phoneHe: string;
  phoneEn: string;
  emailHe: string;
  emailEn: string;
  sourceHe: string;
  sourceEn: string;
  statusHe: string;
  statusEn: string;
  folder: Exclude<Folder, "all">;
  unread: number;
  tagsHe: string[];
  tagsEn: string[];
  messages: ChatMessage[];
  activities: Activity[];
};

const TEMPLATES = [
  {
    id: "order",
    he: "עדכון הזמנה",
    en: "Order update",
    bodyHe: "ההזמנה שלך כבר נארזה ומשולחת היום בשעות הערב.",
    bodyEn: "Your order is packed and goes out this evening.",
  },
  {
    id: "meeting",
    he: "תזכורת לפגישה",
    en: "Appointment reminder",
    bodyHe: "תזכורת: הפגישה מחר בין 10:00 ל־14:00.",
    bodyEn: "Reminder: the appointment is tomorrow between 10:00 and 14:00.",
  },
  {
    id: "follow",
    he: "הודעת המשך ללקוח",
    en: "Customer follow-up",
    bodyHe: "רצינו לוודא שהכול ברור. אפשר להשיב כאן ונמשיך מהכרטיס.",
    bodyEn: "We wanted to make sure everything is clear. You can reply here and we will continue from the record.",
  },
] as const;

const SEED: Thread[] = [
  {
    id: "noa",
    nameHe: "נועה לוי",
    nameEn: "Emily Johnson",
    markHe: "נל",
    markEn: "EJ",
    phoneHe: "054-000-2101",
    phoneEn: "+1 (415) 555-0142",
    emailHe: "noa.levi@example.com",
    emailEn: "emily.johnson@example.com",
    sourceHe: "CRM · לקוחה פעילה",
    sourceEn: "CRM · Active customer",
    statusHe: "פתוחה",
    statusEn: "Open",
    folder: "open",
    unread: 2,
    tagsHe: ["לקוחה פעילה", "רכישה חוזרת", "VIP"],
    tagsEn: ["Active customer", "Repeat purchase", "VIP"],
    messages: [
      { id: "n1", from: "customer", textHe: "היי, אפשר לקבל עדכון לגבי ההזמנה שלי?", textEn: "Hi, can I get an update on my order?", time: "10:02" },
      { id: "n2", from: "business", textHe: "היי, כמובן. ההזמנה שלך כבר נארזה ומשולחת היום בשעות הערב.", textEn: "Hi. Of course. Your order is packed and goes out this evening.", time: "10:08", tick: "read" },
      { id: "n3", from: "customer", textHe: "מעולה! מתי אפשר להגיע?", textEn: "Great! When should I expect it?", time: "10:12" },
      { id: "n4", from: "business", textHe: "ההזמנה צפויה להגיע מחר בין 10:00 ל־14:00.", textEn: "It should arrive tomorrow between 10:00 and 14:00.", time: "10:15", tick: "read" },
      { id: "n5", from: "customer", textHe: "תודה רבה.", textEn: "Thank you.", time: "10:24" },
    ],
    activities: [
      { id: "na1", textHe: "שיחה נכנסת על עדכון הזמנה.", textEn: "Inbound conversation about an order update.", time: "10:24" },
    ],
  },
  {
    id: "daniel",
    nameHe: "דניאל כהן",
    nameEn: "Michael Anderson",
    markHe: "דכ",
    markEn: "MA",
    phoneHe: "052-000-2102",
    phoneEn: "+1 (212) 555-0196",
    emailHe: "daniel.cohen@example.com",
    emailEn: "michael.anderson@example.com",
    sourceHe: "האתר",
    sourceEn: "Website",
    statusHe: "פתוחה",
    statusEn: "Open",
    folder: "open",
    unread: 0,
    tagsHe: ["ליד חדש"],
    tagsEn: ["New lead"],
    messages: [
      { id: "d1", from: "customer", textHe: "שלום, ראיתי את האתר ורציתי לשמוע פרטים.", textEn: "Hello, I saw the website and wanted a few details.", time: "09:47" },
    ],
    activities: [{ id: "da1", textHe: "פנייה חדשה מהאתר.", textEn: "A new enquiry from the website.", time: "09:47" }],
  },
  {
    id: "maya",
    nameHe: "מאיה כץ",
    nameEn: "Jessica Miller",
    markHe: "מכ",
    markEn: "JM",
    phoneHe: "053-000-2103",
    phoneEn: "+1 (310) 555-0173",
    emailHe: "maya.katz@example.com",
    emailEn: "jessica.miller@example.com",
    sourceHe: "ידני",
    sourceEn: "Manual",
    statusHe: "בטיפול",
    statusEn: "In progress",
    folder: "pending",
    unread: 1,
    tagsHe: ["פגישה"],
    tagsEn: ["Appointment"],
    messages: [
      { id: "m1", from: "customer", textHe: "יש לכם מועד נוסף לסדנה?", textEn: "Do you have another time for the workshop?", time: "09:12" },
    ],
    activities: [{ id: "ma1", textHe: "ממתינה לתיאום מועד.", textEn: "Waiting for another appointment time.", time: "09:12" }],
  },
  {
    id: "eitan",
    nameHe: "איתן בר",
    nameEn: "David Wilson",
    markHe: "אב",
    markEn: "DW",
    phoneHe: "058-000-2104",
    phoneEn: "+1 (617) 555-0118",
    emailHe: "eitan.bar@example.com",
    emailEn: "david.wilson@example.com",
    sourceHe: "CRM",
    sourceEn: "CRM",
    statusHe: "טופל",
    statusEn: "Handled",
    folder: "closed",
    unread: 0,
    tagsHe: ["טופל"],
    tagsEn: ["Handled"],
    messages: [
      { id: "e1", from: "business", textHe: "שמחנו לעזור. השיחה נשארת בהדגמה.", textEn: "Glad we could help. This conversation stays in the demo.", time: "08:20", tick: "read" },
    ],
    activities: [{ id: "ea1", textHe: "השיחה סומנה כטופלה בהדגמה.", textEn: "The conversation was marked handled in the demo.", time: "08:20" }],
  },
  {
    id: "roni",
    nameHe: "רוני חדד",
    nameEn: "Sarah Thompson",
    markHe: "רח",
    markEn: "ST",
    phoneHe: "054-000-2105",
    phoneEn: "+1 (312) 555-0164",
    emailHe: "roni.haddad@example.com",
    emailEn: "sarah.thompson@example.com",
    sourceHe: "Meta",
    sourceEn: "Meta",
    statusHe: "בטיפול",
    statusEn: "In progress",
    folder: "pending",
    unread: 0,
    tagsHe: ["המשך"],
    tagsEn: ["Follow-up"],
    messages: [
      { id: "r1", from: "customer", textHe: "תודה על העדכון. אחזור אליכם.", textEn: "Thanks for the update. I will get back to you.", time: "07:05" },
    ],
    activities: [{ id: "ra1", textHe: "הלקוחה ביקשה לחזור בהמשך.", textEn: "The customer asked to continue later.", time: "07:05" }],
  },
  {
    id: "lior",
    nameHe: "ליאור פרץ",
    nameEn: "James Parker",
    markHe: "לפ",
    markEn: "JP",
    phoneHe: "052-000-2106",
    phoneEn: "+1 (206) 555-0137",
    emailHe: "lior.peretz@example.com",
    emailEn: "james.parker@example.com",
    sourceHe: "האתר",
    sourceEn: "Website",
    statusHe: "נסגר",
    statusEn: "Closed",
    folder: "closed",
    unread: 0,
    tagsHe: ["נסגר"],
    tagsEn: ["Closed"],
    messages: [
      { id: "l1", from: "business", textHe: "הכול בסדר, קיבלתי. תודה.", textEn: "All set. Thank you.", time: "06:40", tick: "read" },
    ],
    activities: [{ id: "la1", textHe: "השיחה נסגרה בהדגמה.", textEn: "The conversation was closed in the demo.", time: "06:40" }],
  },
];

function cloneThreads() {
  return SEED.map((thread) => ({
    ...thread,
    tagsHe: [...thread.tagsHe],
    tagsEn: [...thread.tagsEn],
    messages: thread.messages.map((message) => ({ ...message })),
    activities: thread.activities.map((activity) => ({ ...activity })),
  }));
}

function Icon({ name }: { name: "search" | "send" | "task" | "file" | "check" | "plus" | "reset" | "phone" | "mail" | "box" | "calendar" | "reply" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "search" ? <path d="M10.5 5.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm5.2 8.8 3.3 3.2" /> : null}
      {name === "send" ? <path d="M4.5 12 19 5.5 13.5 19l-2-6.2L4.5 12Z" /> : null}
      {name === "task" ? <path d="M8 4.5h8v3H8v-3Zm-2 3h12v12H6v-12Zm3.2 6.2 1.6 1.6 3.2-3.4" /> : null}
      {name === "file" ? <path d="M7 3.5h7l4 4V20H7V3.5Zm7 0v4h4" /> : null}
      {name === "check" ? <path d="M6 12.5 10 16l8-8" /> : null}
      {name === "plus" ? <path d="M12 6v12M6 12h12" /> : null}
      {name === "reset" ? <path d="M7 8.5A6.5 6.5 0 1 1 6.2 14M7 5.5v3.2h3.2" /> : null}
      {name === "phone" ? <path d="M7 3.5h2.2l1.2 3.2-1.7.8a12.2 12.2 0 0 0 5.8 5.8l.8-1.7 3.2 1.2V15a2.5 2.5 0 0 1-2.5 2.5A13.5 13.5 0 0 1 4.5 6 2.5 2.5 0 0 1 7 3.5Z" /> : null}
      {name === "mail" ? <path d="M4.5 7.5h15v10h-15v-10Zm0 0 7.5 5.5 7.5-5.5" /> : null}
      {name === "box" ? <path d="M4 8.5 12 4.5l8 4v9l-8 4-8-4v-9Zm8 0v9M4 8.5l8 4 8-4" /> : null}
      {name === "calendar" ? <path d="M7 5.5V3.8M17 5.5V3.8M4.5 9h15M6 5.5h12v13H6v-13Z" /> : null}
      {name === "reply" ? <path d="M8 8.5H5.5L9 5l3.5 3.5H10a5 5 0 0 1 5 5V16" /> : null}
    </svg>
  );
}

export default function WhatsAppOperations() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const timers = useRef<number[]>([]);
  const [threads, setThreads] = useState<Thread[]>(cloneThreads);
  const [selectedId, setSelectedId] = useState(SEED[0].id);
  const [folder, setFolder] = useState<Folder>("all");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskDraft, setTaskDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [pane, setPane] = useState<Pane>("inbox");
  const thread = threads.find((item) => item.id === selectedId) || threads[0];

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const needle = query.trim().toLowerCase();
  const visibleThreads = threads.filter((item) => {
    const label = `${item.nameHe} ${item.nameEn}`.toLowerCase();
    return (folder === "all" || item.folder === folder) && (!needle || label.includes(needle));
  });
  const counts = {
    all: threads.length,
    open: threads.filter((item) => item.folder === "open").length,
    pending: threads.filter((item) => item.folder === "pending").length,
    closed: threads.filter((item) => item.folder === "closed").length,
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

  const nameOf = (item: Thread) => text(item.nameHe, item.nameEn);
  const markOf = (item: Thread) => text(item.markHe, item.markEn);
  const lastText = (item: Thread) => {
    const last = item.messages[item.messages.length - 1];
    return last ? text(last.textHe, last.textEn) : "";
  };
  const tickLabel = (tick?: Tick) => {
    if (tick === "sent") return text("הדמיה · נשלחה", "Demo · Sent");
    if (tick === "delivered") return text("הדמיה · נמסרה", "Demo · Delivered");
    if (tick === "read") return text("הדמיה · נקראה", "Demo · Read");
    return "";
  };

  const selectThread = (id: string) => {
    setSelectedId(id);
    setTemplatesOpen(false);
    setTaskOpen(false);
    setPreview("");
    setTemplateId("");
    setNotice("");
    setPane("chat");
    setThreads((current) => current.map((item) => (item.id === id ? { ...item, unread: 0 } : item)));
  };

  const advanceTick = (threadId: string, messageId: string, tick: Tick) => {
    setThreads((current) => current.map((item) => (
      item.id === threadId
        ? { ...item, messages: item.messages.map((message) => (message.id === messageId ? { ...message, tick, fresh: false } : message)) }
        : item
    )));
  };

  const sendPreview = () => {
    const chosen = TEMPLATES.find((item) => item.id === templateId);
    if (!chosen) {
      setNotice(text("יש לבחור תבנית לפני השליחה בהדגמה.", "Choose a template before the demo send."));
      setTemplatesOpen(true);
      return;
    }
    const messageId = `out-${Date.now()}`;
    setThreads((current) => current.map((item) => (
      item.id === thread.id
        ? {
          ...item,
          messages: [...item.messages, { id: messageId, from: "business", textHe: chosen.bodyHe, textEn: chosen.bodyEn, time: text("עכשיו", "Now"), tick: "sent", fresh: true }],
          activities: [{ id: `act-${messageId}`, textHe: "הודעת תבנית הופיעה בהדמיה. היא לא נשלחה.", textEn: "A template message appeared in the simulation. It was not sent.", time: text("עכשיו", "Now") }, ...item.activities],
        }
        : item
    )));
    setPreview("");
    setTemplateId("");
    setTemplatesOpen(false);
    setNotice(text("ההודעה הופיעה בהדמיה. היא לא נשלחה ב־WhatsApp.", "The message appeared in the simulation. It was not sent on WhatsApp."));
    const delivered = window.setTimeout(() => advanceTick(thread.id, messageId, "delivered"), 700);
    const read = window.setTimeout(() => advanceTick(thread.id, messageId, "read"), 1500);
    timers.current.push(delivered, read);
  };

  const saveTask = () => {
    const value = taskDraft.trim();
    if (!value) {
      setNotice(text("יש להזין תיאור קצר למשימה.", "Enter a short task description."));
      return;
    }
    setThreads((current) => current.map((item) => (
      item.id === thread.id
        ? { ...item, activities: [{ id: `task-${Date.now()}`, textHe: value, textEn: value, time: text("עכשיו", "Now") }, ...item.activities] }
        : item
    )));
    setTaskDraft("");
    setTaskOpen(false);
    setNotice(text("המשימה נשמרה בהדגמה. היא לא נוצרה במערכת האמיתית.", "The task was saved in the demo. It was not created in the live system."));
  };

  const resetDemo = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setThreads(cloneThreads());
    setSelectedId(SEED[0].id);
    setFolder("all");
    setQuery("");
    setPreview("");
    setTemplateId("");
    setTemplatesOpen(false);
    setTaskOpen(false);
    setTaskDraft("");
    setPane("inbox");
    setNotice(text("ההדגמה אופסה. שום נתון לא נשמר מחוץ למסך.", "The demo was reset. Nothing was stored outside this screen."));
  };

  const addLocalChat = () => {
    const id = `guest-${Date.now()}`;
    const guest: Thread = {
      id,
      nameHe: "אורח הדגמה",
      nameEn: "Demo guest",
      markHe: "אד",
      markEn: "DG",
      phoneHe: "050-000-2199",
      phoneEn: "+1 (415) 555-0100",
      emailHe: "guest@example.com",
      emailEn: "guest@example.com",
      sourceHe: "הדגמה",
      sourceEn: "Demo",
      statusHe: "פתוחה",
      statusEn: "Open",
      folder: "open",
      unread: 1,
      tagsHe: ["הדגמה"],
      tagsEn: ["Demo"],
      messages: [{ id: `${id}-m`, from: "customer", textHe: "היי, זו שיחה חדשה בהדגמה בלבד.", textEn: "Hi, this is a new conversation in the demo only.", time: text("עכשיו", "Now") }],
      activities: [{ id: `${id}-a`, textHe: "שיחה מקומית נפתחה בהדגמה.", textEn: "A local conversation was opened in the demo.", time: text("עכשיו", "Now") }],
    };
    setThreads((current) => [guest, ...current]);
    setSelectedId(id);
    setPane("chat");
    setNotice(text("נפתחה שיחה מקומית. לא חובר מספר אמיתי.", "A local conversation was opened. No real number was connected."));
  };

  return (
    <section className="wa-section" id="whatsapp" dir={dir} aria-labelledby="wa-title">
      <div className="wa-wrap">
        <header className="wa-head">
          <p className="wa-kicker"><span />WhatsApp Business API</p>
          <h2 id="wa-title">{text("מרכז התקשורת העסקי ב־WhatsApp", "The WhatsApp business conversation center")}</h2>
          <p>{text("שיחות, תבניות מאושרות ופעולה על כרטיס הלקוח. הכול בהדגמה מקומית.", "Conversations, approved templates and an action on the customer record. All of it stays in a local demo.")}</p>
          <ul className="wa-points">
            <li>{text("תבניות מאושרות", "Approved templates")}</li>
            <li>{text("הקשר המלא ללקוח", "The full customer context")}</li>
            <li>{text("שירות ומכירות מהיר", "Faster service and sales")}</li>
          </ul>
        </header>

        <div className="wa-app">
          <div className="wa-bar">
            <span className="wa-demo">{text("הדגמה אינטראקטיבית", "Interactive demo")}</span>
            <span className="wa-live"><i />{text("מחובר בהדגמה", "Connected in the demo")}</span>
            <strong>{text("מרכז ניהול שיחות", "Conversation operations center")}</strong>
            <button type="button" className="wa-reset" onClick={resetDemo}><Icon name="reset" />{text("איפוס", "Reset")}</button>
          </div>

          <div className="wa-panes" role="tablist" aria-label={text("אזורי ההדגמה", "Demo areas")}>
            {(["inbox", "chat", "profile"] as Pane[]).map((id) => (
              <button key={id} type="button" role="tab" aria-selected={pane === id} className={pane === id ? "is-on" : undefined} onClick={() => setPane(id)}>
                {text(id === "inbox" ? "שיחות" : id === "chat" ? "שיחה" : "פרטים", id === "inbox" ? "Chats" : id === "chat" ? "Chat" : "Details")}
              </button>
            ))}
          </div>

          <div className="wa-layout" data-pane={pane}>
            <div className="wa-inbox">
              <div className="wa-inbox-head">
                <h3>{text("תיבת שיחות", "Inbox")}</h3>
                <button type="button" onClick={addLocalChat}><Icon name="plus" />{text("שיחה חדשה", "New chat")}</button>
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
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text("חיפוש שיחה או לקוח", "Search a conversation")} aria-label={text("חיפוש שיחה", "Search conversations")} />
              </label>
              <ul>
                {visibleThreads.map((item) => {
                  const on = item.id === thread.id;
                  return (
                    <li key={item.id}>
                      <button type="button" className={on ? "is-on" : undefined} aria-current={on ? "true" : undefined} onClick={() => selectThread(item.id)}>
                        <b aria-hidden="true">{markOf(item)}</b>
                        <span>
                          <strong>{nameOf(item)}</strong>
                          <small>{lastText(item)}</small>
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
              <header className="wa-chat-head">
                <b aria-hidden="true">{markOf(thread)}</b>
                <div>
                  <h3>{nameOf(thread)}</h3>
                  <p><span className="wa-status">{text(thread.statusHe, thread.statusEn)}</span> {text(thread.sourceHe, thread.sourceEn)}</p>
                </div>
              </header>
              <ol className="wa-thread">
                {thread.messages.map((message) => (
                  <li key={message.id} className={`${message.from === "business" ? "is-out" : "is-in"}${message.fresh ? " is-fresh" : ""}`}>
                    <p>{text(message.textHe, message.textEn)}</p>
                    <time>
                      {message.time}
                      {message.tick ? <span className={message.tick === "read" ? "is-read" : undefined}>{tickLabel(message.tick)}</span> : null}
                    </time>
                  </li>
                ))}
              </ol>
              {notice ? <p className="wa-notice" role="status">{notice}</p> : null}
              <div className="wa-composer">
                <div className="wa-template-row">
                  <button type="button" className={templateId ? "is-set" : undefined} aria-expanded={templatesOpen} onClick={() => setTemplatesOpen((open) => !open)}>
                    <Icon name={templateId === "order" ? "box" : templateId === "meeting" ? "calendar" : templateId === "follow" ? "reply" : "file"} />
                    {templateId
                      ? text(TEMPLATES.find((item) => item.id === templateId)?.he || "", TEMPLATES.find((item) => item.id === templateId)?.en || "")
                      : text("בחירת תבנית", "Choose a template")}
                  </button>
                  {templatesOpen ? (
                    <ul className="wa-template-menu">
                      {TEMPLATES.map((template) => (
                        <li key={template.id}>
                          <button
                            type="button"
                            className={templateId === template.id ? "is-on" : undefined}
                            onClick={() => {
                              setTemplateId(template.id);
                              setPreview(text(template.bodyHe, template.bodyEn));
                              setTemplatesOpen(false);
                            }}
                          >
                            <Icon name={template.id === "order" ? "box" : template.id === "meeting" ? "calendar" : "reply"} />
                            <span>
                              <strong>{text(template.he, template.en)}</strong>
                              <small>{text(template.bodyHe, template.bodyEn)}</small>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <p className={`wa-preview${preview ? " is-set" : ""}`} aria-live="polite">
                  <span>{text("תצוגה מקדימה", "Preview")}</span>
                  {preview
                    ? preview
                    : text("בחרו תבנית מאושרת כדי לראות את הנוסח לפני השליחה בהדגמה.", "Choose an approved template to see the wording before the demo send.")}
                </p>
                <button type="button" className="wa-send" onClick={sendPreview}>
                  <Icon name="send" />
                  {text("שליחה בהדגמה", "Send in the demo")}
                </button>
              </div>
            </div>

            <aside className="wa-profile">
              <h3>{text("פרטי לקוח", "Customer profile")}</h3>
              <div className="wa-who">
                <b aria-hidden="true">{markOf(thread)}</b>
                <div>
                  <strong>{nameOf(thread)}</strong>
                  <small className="wa-status">{text(thread.statusHe, thread.statusEn)}</small>
                </div>
              </div>
              <p className="wa-contact"><Icon name="phone" /><bdi dir="ltr">{text(thread.phoneHe, thread.phoneEn)}</bdi></p>
              <p className="wa-contact"><Icon name="mail" /><bdi dir="ltr">{text(thread.emailHe, thread.emailEn)}</bdi></p>
              <p className="wa-source">{text("מקור", "Source")}: {text(thread.sourceHe, thread.sourceEn)}</p>
              <h4>{text("תגיות", "Tags")}</h4>
              <div className="wa-tags">{text(thread.tagsHe.join("|"), thread.tagsEn.join("|")).split("|").map((tag) => <span key={tag}>{tag}</span>)}</div>
              <h4>{text("פעילות", "Activity")}</h4>
              <ul className="wa-activity">
                {thread.activities.map((activity) => {
                  const savedTask = activity.id.startsWith("task-");
                  return (
                    <li key={activity.id} className={savedTask ? "is-task" : undefined}>
                      {savedTask ? <em>{text("משימה נשמרה בהדגמה", "Task saved in the demo")}</em> : null}
                      <strong>{text(activity.textHe, activity.textEn)}</strong>
                      <time>{activity.time}</time>
                    </li>
                  );
                })}
              </ul>
              {taskOpen ? (
                <form className="wa-task-form" onSubmit={(event) => { event.preventDefault(); saveTask(); }}>
                  <label htmlFor="wa-task">{text("תיאור המשימה", "Task description")}</label>
                  <input id="wa-task" value={taskDraft} onChange={(event) => setTaskDraft(event.target.value)} placeholder={text("מה צריך להמשיך?", "What should happen next?")} />
                  <button type="submit">{text("שמירה בהדגמה", "Save in the demo")}</button>
                </form>
              ) : (
                <button type="button" className="wa-primary" onClick={() => { setTaskOpen(true); setPane("profile"); }}>
                  <Icon name="task" />{text("יצירת משימה", "Create task")}
                </button>
              )}
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
