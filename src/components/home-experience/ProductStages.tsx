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

function DemoBar({ text }: { text: (hebrew: string, english: string) => string }) {
  return (
    <p className="ps-bar">
      <span>BizUply</span>
      <span>{text(DEMO_HE, DEMO_EN)}</span>
    </p>
  );
}

type LeadId = "noa" | "tamar" | "yael";

export function CrmStage() {
  const text = useLabels();
  const leads: {
    id: LeadId;
    name: string;
    place: string;
    source: string;
    status: string;
    tone: string;
    note: string;
    activity: string[];
  }[] = [
    {
      id: "noa",
      name: text("נועה ברק", "Noa Barak"),
      place: text("סטודיו נורה", "Nora Studio"),
      source: text("מודעת לידים ב־Meta", "Meta lead ad"),
      status: text("בטיפול", "In progress"),
      tone: "is-progress",
      note: text("שאלה על צילום אחרי שראתה את המודעה.", "Asked about a shoot after seeing the ad."),
      activity: [
        text("הליד נכנס ממודעת Meta", "Lead arrived from a Meta ad"),
        text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record"),
        text("נוצרה משימת המשך", "Follow-up task created"),
      ],
    },
    {
      id: "tamar",
      name: text("תמר לוי", "Tamar Levi"),
      place: text("פנייה מהאתר", "Website enquiry"),
      source: text("טופס באתר", "Website form"),
      status: text("ליד חדש", "New lead"),
      tone: "is-new",
      note: text("ביקשה לשמוע על חבילת צילום.", "Asked to hear about a photo package."),
      activity: [
        text("טופס באתר התקבל", "Website form received"),
        text("עדיין אין שיחה", "No conversation yet"),
      ],
    },
    {
      id: "yael",
      name: text("יעל דהן", "Yael Dahan"),
      place: text("מודעת לידים ב־Meta", "Meta lead ad"),
      source: text("מודעת לידים ב־Meta", "Meta lead ad"),
      status: text("נוצר קשר", "Contacted"),
      tone: "is-contact",
      note: text("שוחחנו, וממתינים לתשובה שלה.", "We spoke, and are waiting on her reply."),
      activity: [
        text("הליד נכנס ממודעת Meta", "Lead arrived from a Meta ad"),
        text("שיחה נרשמה בכרטיס", "A call was logged on the record"),
      ],
    },
  ];
  const [id, setId] = useState<LeadId>("noa");
  const lead = leads.find((item) => item.id === id) || leads[0];
  return (
    <div className="ps-crm" aria-label={text("הדגמה של רשימת לידים וכרטיס לקוח. לא נתוני לקוח אמיתיים.", "A demo of the lead list and a customer record. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="ps-crm-body">
        <ul className="ps-crm-list" aria-label={text("לידים", "Leads")}>
          {leads.map((item) => (
            <li key={item.id}>
              <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.source}</small>
                </span>
                <em className={item.tone}>{item.status}</em>
              </button>
            </li>
          ))}
        </ul>
        <article className="ps-crm-card" aria-live="polite">
          <p>{lead.place}</p>
          <h3>{lead.name}</h3>
          <em className={lead.tone}>{lead.status}</em>
          <dl>
            <div><dt>{text("מקור", "Source")}</dt><dd>{lead.source}</dd></div>
            <div><dt>{text("הערה", "Note")}</dt><dd>{lead.note}</dd></div>
          </dl>
        </article>
        <ol className="ps-crm-activity" aria-label={text("פעילות", "Activity")}>
          {lead.activity.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

type ThreadId = "noa" | "tamar" | "yael";

export function WhatsAppStage() {
  const text = useLabels();
  const threads: {
    id: ThreadId;
    name: string;
    place: string;
    status: string;
    source: string;
    preview: string;
    window: string;
    saved: boolean;
    messages: { out: boolean; body: string; meta?: string }[];
  }[] = [
    {
      id: "noa",
      name: text("נועה ברק", "Noa Barak"),
      place: text("סטודיו נורה", "Nora Studio"),
      status: text("בטיפול", "In progress"),
      source: text("מודעת לידים ב־Meta", "Meta lead ad"),
      preview: text("אפשר לשמוע על הצילום?", "Can I hear more about the shoot?"),
      window: text("חלון 24 השעות פתוח", "24-hour window open"),
      saved: true,
      messages: [
        { out: false, body: text("היי, ראיתי את המודעה של סטודיו נורה. אפשר לשמוע על הצילום?", "Hi, I saw the Nora Studio ad. Can I hear more about the shoot?") },
        { out: true, body: text("היי נועה, שמחים שפנית. נשלח פרטים על הצילום עוד היום.", "Hi Noa, glad you wrote. We'll send details about the shoot later today."), meta: text("נקראה · 09:18", "Read · 09:18") },
      ],
    },
    {
      id: "tamar",
      name: text("תמר לוי", "Tamar Levi"),
      place: text("פנייה מהאתר", "Website enquiry"),
      status: text("ליד חדש", "New lead"),
      source: text("טופס באתר", "Website form"),
      preview: text("אשמח לשמוע על החבילה.", "I'd like to hear about the package."),
      window: text("חלון 24 השעות פתוח", "24-hour window open"),
      saved: false,
      messages: [
        { out: false, body: text("היי, אשמח לשמוע על חבילת הצילום.", "Hi, I'd like to hear about the photo package."), meta: text("ממתינה · 11:42", "Waiting · 11:42") },
      ],
    },
    {
      id: "yael",
      name: text("יעל דהן", "Yael Dahan"),
      place: text("מודעת לידים ב־Meta", "Meta lead ad"),
      status: text("נוצר קשר", "Contacted"),
      source: text("מודעת לידים ב־Meta", "Meta lead ad"),
      preview: text("אחשוב על זה ואחזור.", "I'll think it over and come back."),
      window: text("חלון 24 השעות פתוח", "24-hour window open"),
      saved: true,
      messages: [
        { out: false, body: text("תודה, אחשוב על זה ואחזור.", "Thanks, I'll think it over and come back.") },
        { out: true, body: text("מעולה, אנחנו כאן כשתרצי.", "Of course, we're here when you're ready."), meta: text("נקראה · 16:02", "Read · 16:02") },
      ],
    },
  ];
  const [id, setId] = useState<ThreadId>("noa");
  const thread = threads.find((item) => item.id === id) || threads[0];
  return (
    <div className="ps-wa" aria-label={text("הדגמה של תיבת שיחות WhatsApp המחוברת לכרטיס. לא נתוני לקוח אמיתיים.", "A demo of the WhatsApp inbox linked to the customer record. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="ps-wa-body">
        <ul className="ps-wa-list" aria-label={text("שיחות", "Conversations")}>
          {threads.map((item) => (
            <li key={item.id}>
              <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <b aria-hidden="true">{item.name.trim().charAt(0)}</b>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.preview}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="ps-wa-thread" aria-live="polite">
          <header>
            <strong>{thread.name}</strong>
            <span>{thread.place}</span>
          </header>
          <div className="ps-wa-log">
            {thread.messages.map((message) => (
              <p key={message.body} className={message.out ? "is-out" : undefined}>
                {message.body}
                {message.meta ? <small>{message.meta}</small> : null}
              </p>
            ))}
          </div>
          <footer>
            {thread.saved ? <span>{text("התשובה נשמרת בכרטיס הזה", "The reply is saved on this record")}</span> : <span>{text("ההודעה תופיע בכרטיס", "The message shows on the record")}</span>}
            <em>{thread.window}</em>
          </footer>
        </div>
        <aside className="ps-wa-record">
          <span>{text("כרטיס מחובר", "Linked record")}</span>
          <strong>{thread.name}</strong>
          <em>{thread.status}</em>
          <span>{thread.source}</span>
          <span>{thread.place}</span>
        </aside>
      </div>
    </div>
  );
}

export function FlowStage() {
  const text = useLabels();
  const nodes = [
    { id: "trigger", kind: text("טריגר", "Trigger"), label: text("ליד חדש", "New lead"), body: text("התהליך מתחיל כשנכנס ליד חדש.", "The flow starts when a new lead arrives.") },
    { id: "condition", kind: text("תנאי", "Condition"), label: text("המקור הוא Meta", "Source is Meta"), body: text("ממשיכים רק אם מקור הליד הוא Meta.", "It continues only when the lead source is Meta.") },
    { id: "tag", kind: text("פעולה", "Action"), label: text("הוספת תגית", "Add a tag"), body: text("מוסיפים תגית לפנייה לצילום.", "Adds a tag for the shoot enquiry.") },
    { id: "task", kind: text("פעולה", "Action"), label: text("יצירת משימה ב־CRM", "Create a CRM task"), body: text("יוצרים משימת המשך ב־CRM.", "Creates a follow-up task in the CRM.") },
  ];
  const [id, setId] = useState("task");
  const node = nodes.find((item) => item.id === id) || nodes[0];
  return (
    <div className="ps-flow" aria-label={text("הדגמה של עורך תהליך: טריגר, תנאי ופעולות. הרצת בדיקה לא שולחת הודעה ולא משנה נתונים.", "A demo of the flow editor: a trigger, a condition and actions. A test run sends nothing and changes no data.")}>
      <DemoBar text={text} />
      <div className="ps-flow-body">
        <ol className="ps-flow-canvas">
          <i className="ps-flow-rail" aria-hidden="true"><b /></i>
          {nodes.map((item) => (
            <li key={item.id}>
              <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <small>{item.kind}</small>
                <strong>{item.label}</strong>
              </button>
            </li>
          ))}
        </ol>
        <aside className="ps-flow-side" aria-live="polite">
          <p>{node.kind}</p>
          <h3>{node.label}</h3>
          <p>{node.body}</p>
          <p className="ps-flow-sample">{text("הדוגמה רצה על הכרטיס של נועה ברק, בלי לשנות אותו.", "The sample runs on Noa Barak's record without changing it.")}</p>
          <p className="ps-flow-test">{text("הרצת בדיקה · לא נשלחה הודעה ולא שונו נתונים", "Test run · no message sent and no data changed")}</p>
        </aside>
      </div>
    </div>
  );
}

type CampaignId = "shoot" | "packages";

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
      status: text("בטיפול", "In progress"),
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
    <div className="ps-meta" aria-label={text("הדגמה של קמפיינים ב־Meta ומעבר ליד ל־CRM. לא נתוני לקוח אמיתיים.", "A demo of Meta campaigns and a lead passing into the CRM. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="ps-meta-switch" role="tablist" aria-label={text("קמפיינים", "Campaigns")}>
        {campaigns.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === id} className={item.id === id ? "is-on" : undefined} onClick={() => setId(item.id)}>
            {item.name}
          </button>
        ))}
      </div>
      <div className="ps-meta-body" aria-live="polite">
        <div className="ps-meta-chart">
          <header>
            <strong>{campaign.name}</strong>
            <span>{campaign.channel}</span>
          </header>
          <div className="ps-bars" aria-hidden="true">
            {campaign.bars.map((height, index) => (
              <i key={`${campaign.id}-${index}`} style={{ height: `${height}%` }} />
            ))}
          </div>
          <p>{text("לידים לפי יום · הדגמה", "Leads by day · demo")}</p>
        </div>
        <div className="ps-meta-side">
          <ul className="ps-metrics">
            {metrics.map(([label, value]) => (
              <li key={label}><span>{label}</span><strong>{value}</strong></li>
            ))}
          </ul>
          <div className="ps-pass">
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
    draft: string;
    move: string;
  }[] = [
    {
      id: "hot",
      kicker: text("ליד חם", "Hot lead"),
      title: text("נועה ברק", "Noa Barak"),
      who: text("סטודיו נורה", "Nora Studio"),
      draft: text("היי נועה, נשמח לקבוע שיחה קצרה על הצילום.", "Hi Noa, we'd like to set a short call about the shoot."),
      move: text("השיחה נשארת אצלכם. היועץ לא קובע ולא שולח.", "The conversation stays with you. The advisor does not book or send."),
    },
    {
      id: "wait",
      kicker: text("ממתין למענה", "Waiting for a reply"),
      title: text("תמר לוי", "Tamar Levi"),
      who: text("טופס באתר", "Website form"),
      draft: text("היי תמר, רצינו לוודא שקיבלת את הפרטים על החבילה.", "Hi Tamar, we wanted to check that you received the package details."),
      move: text("זו טיוטת מעקב. היא לא נשמרת ולא נשלחת.", "This is a follow-up draft. It is not saved and not sent."),
    },
    {
      id: "cost",
      kicker: text("עלות לליד", "Cost per lead"),
      title: text("צילום לחמישי", "Thursday shoot"),
      who: text("קמפיין Meta", "Meta campaign"),
      draft: text("כדאי לבדוק את הקמפיין לפני שמגדילים תקציב.", "Review the campaign before raising the budget."),
      move: text("היועץ לא משנה תקציב ולא עוצר קמפיין.", "The advisor does not change a budget or pause a campaign."),
    },
  ];
  const [id, setId] = useState<InsightId>("hot");
  const insight = insights.find((item) => item.id === id) || insights[0];
  return (
    <div className="ps-ai" aria-label={text("הדגמה של תובנות היועץ העסקי. הוא ממליץ ואינו מבצע פעולה. לא נתוני לקוח אמיתיים.", "A demo of Business Advisor insights. It recommends and takes no action. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="ps-ai-body">
        <ul className="ps-ai-list" aria-label={text("תובנות", "Insights")}>
          {insights.map((item) => (
            <li key={item.id}>
              <button type="button" className={item.id === id ? "is-on" : undefined} aria-pressed={item.id === id} onClick={() => setId(item.id)}>
                <small>{item.kicker}</small>
                <strong>{item.title}</strong>
              </button>
            </li>
          ))}
        </ul>
        <div className="ps-ai-stage" aria-live="polite">
          <article className="ps-ai-rec">
            <p>{text("המלצה", "Recommendation")}</p>
            <h3>{insight.title}</h3>
            <span>{insight.who}</span>
            <blockquote>
              <small>{text("טיוטה · לא נשלח", "Draft · not sent")}</small>
              {insight.draft}
            </blockquote>
          </article>
          <article className="ps-ai-yours">
            <p>{text("אצלכם", "With you")}</p>
            <strong>{insight.move}</strong>
            <em>{text("מייעץ בלבד · לא מבצע פעולה", "Advises only · takes no action")}</em>
          </article>
        </div>
      </div>
    </div>
  );
}

type DayId = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export function CalendarStage() {
  const text = useLabels();
  const days: { id: DayId; label: string }[] = [
    { id: "sun", label: text("א׳", "Sun") },
    { id: "mon", label: text("ב׳", "Mon") },
    { id: "tue", label: text("ג׳", "Tue") },
    { id: "wed", label: text("ד׳", "Wed") },
    { id: "thu", label: text("ה׳", "Thu") },
    { id: "fri", label: text("ו׳", "Fri") },
    { id: "sat", label: text("ש׳", "Sat") },
  ];
  const meetings: Record<string, { name: string; place: string; service: string; time: string; note: string } | undefined> = {
    tue: {
      name: text("יעל דהן", "Yael Dahan"),
      place: text("מודעת לידים ב־Meta", "Meta lead ad"),
      service: text("שיחת המשך", "Follow-up call"),
      time: "14:00",
      note: text("אחרי השיחה שנרשמה בכרטיס.", "After the call logged on her record."),
    },
    thu: {
      name: text("נועה ברק", "Noa Barak"),
      place: text("סטודיו נורה", "Nora Studio"),
      service: text("שיחת היכרות", "Intro call"),
      time: "10:30",
      note: text("פגישה על הכרטיס, אחרי פניית הצילום.", "A meeting on the record, after the shoot enquiry."),
    },
    fri: {
      name: text("תמר לוי", "Tamar Levi"),
      place: text("טופס באתר", "Website form"),
      service: text("שיחה על חבילה", "Package call"),
      time: "16:15",
      note: text("עדיין לא נקבעה שיחה ב־WhatsApp.", "No WhatsApp reply has been sent yet."),
    },
  };
  const [day, setDay] = useState<DayId>("thu");
  const meeting = meetings[day];
  const selected = days.find((item) => item.id === day) || days[4];
  return (
    <div className="ps-cal" aria-label={text("הדגמה של יומן שבועי. בחירת יום פותחת את הפגישה. לא נתוני לקוח אמיתיים.", "A demo of the week calendar. Choosing a day opens the meeting. Not real customer data.")}>
      <DemoBar text={text} />
      <div className="ps-cal-body">
        <div className="ps-cal-week" role="listbox" aria-label={text("ימים", "Days")}>
          {days.map((item) => {
            const booked = meetings[item.id];
            return (
              <button key={item.id} type="button" role="option" aria-selected={item.id === day} className={item.id === day ? "is-on" : undefined} onClick={() => setDay(item.id)}>
                <span>{item.label}</span>
                {booked ? <strong>{booked.time}<small>{booked.name}</small></strong> : <em>{text("פנוי", "Open")}</em>}
              </button>
            );
          })}
        </div>
        <article className="ps-cal-detail" aria-live="polite">
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
