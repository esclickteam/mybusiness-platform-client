import { useTranslation } from "react-i18next";
import { homeText } from "./homeCopy";

function useLabels() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  return (hebrew: string, english: string) => homeText(language, hebrew, english);
}

const DEMO_HE = "הדגמה · לא נתוני לקוח אמיתיים";
const DEMO_EN = "Demo · not real customer data";

export function CrmMoment() {
  const text = useLabels();
  const leads = [
    [text("תמר לוי", "Tamar Levi"), text("טופס באתר", "Website form"), text("ליד חדש", "New lead"), false],
    [text("נועה ברק", "Noa Barak"), text("מודעת לידים ב־Meta", "Meta lead ad"), text("בטיפול", "In progress"), true],
    [text("יעל דהן", "Yael Dahan"), text("מודעת לידים ב־Meta", "Meta lead ad"), text("ליד חדש", "New lead"), false],
  ] as const;
  return (
    <figure
      className="pm-crm"
      data-reveal
      aria-label={text(
        "הדגמה של כרטיס הלקוחה נועה ברק: סטטוס, מקור, הערה, פגישה ופעילות. לא נתוני לקוח אמיתיים.",
        "A demo record for Noa Barak: status, source, note, meeting and activity. Not real customer data.",
      )}
    >
      <header className="pm-crm__bar">
        <span>{text("כרטיס לקוח", "Customer record")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="pm-crm__body">
        <ul>
          {leads.map(([name, source, status, on]) => (
            <li key={name} className={on ? "is-on" : undefined}>
              <span>
                <strong>{name}</strong>
                <small>{source}</small>
              </span>
              <em>{status}</em>
            </li>
          ))}
        </ul>
        <article className="pm-crm__detail">
          <p className="pm-kicker">{text("סטודיו נורה", "Nora Studio")}</p>
          <div className="pm-crm__who">
            <h3>{text("נועה ברק", "Noa Barak")}</h3>
            <span className="pm-status">{text("בטיפול", "In progress")}</span>
          </div>
          <p className="pm-note">{text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday.")}</p>
          <div className="pm-meet">
            <span>
              <em>{text("הצעד הבא", "Next step")}</em>
              {text("חמישי · שיחת היכרות", "Thursday · intro call")}
            </span>
            <strong>10:30</strong>
          </div>
        </article>
      </div>
      <footer className="pm-crm__facts">
        <div><span>{text("מקור", "Source")}</span><strong>{text("מודעת לידים ב־Meta", "Meta lead ad")}</strong></div>
        <div><span>{text("הערה", "Note")}</span><strong>{text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday.")}</strong></div>
        <div><span>{text("פעילות", "Activity")}</span><strong>{text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record")}</strong></div>
        <div><span>{text("משימה", "Task")}</span><strong>{text("נוצרה משימת המשך", "Follow-up task created")}</strong></div>
      </footer>
    </figure>
  );
}

export function WhatsAppMoment() {
  const text = useLabels();
  const steps = [
    [text("מודעת לידים ב־Meta", "Meta lead ad"), false],
    [text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday."), false],
    [text("התשובה נשמרת בכרטיס הזה", "The reply is saved on this record"), true],
    [text("חמישי · שיחת היכרות", "Thursday · intro call") + " · 10:30", false],
  ] as const;
  return (
    <figure
      className="pm-wa"
      data-reveal
      aria-label={text(
        "הדגמה של שיחת WhatsApp עם נועה ברק, מחוברת לכרטיס שלה. לא נתוני לקוח אמיתיים.",
        "A demo WhatsApp thread with Noa Barak, linked to her record. Not real customer data.",
      )}
    >
      <header className="pm-wa__bar">
        <span>{text(DEMO_HE, DEMO_EN)}</span>
        <span>{text("תיבה משותפת · 2 ממתינות", "Shared inbox · 2 waiting")}</span>
      </header>
      <article className="pm-wa__record">
        <p>{text("סטודיו נורה", "Nora Studio")}</p>
        <h3>{text("נועה ברק", "Noa Barak")}</h3>
        <em>{text("בטיפול", "In progress")}</em>
        <ol>
          {steps.map(([label, linked]) => (
            <li key={label} className={linked ? "is-link" : undefined}>{label}</li>
          ))}
        </ol>
      </article>
      <div className="pm-wa__thread">
        <header>
          <b aria-hidden="true">{text("נועה ברק", "Noa Barak").trim().charAt(0)}</b>
          <div>
            <strong>{text("נועה ברק", "Noa Barak")}</strong>
            <span>{text("סטודיו נורה", "Nora Studio")}</span>
          </div>
        </header>
        <div className="pm-wa__log">
          <p className="pm-bubble">
            {text(
              "היי, ראיתי את המודעה של סטודיו נורה. אפשר לשמוע על הצילום?",
              "Hi, I saw the Nora Studio ad. Can I hear more about the shoot?",
            )}
          </p>
          <p className="pm-bubble is-out">
            {text(
              "היי נועה, שמחים שפנית. שיחת היכרות פנויה בחמישי ב־10:30.",
              "Hi Noa, glad you wrote. An intro call is open Thursday at 10:30.",
            )}
            <small>{text("נקראה · 10:41", "Read · 10:41")}</small>
          </p>
        </div>
        <footer className="pm-wa__foot">
          <span className="is-saved">{text("התשובה נשמרת בכרטיס הזה", "The reply is saved on this record")}</span>
          <span className="pm-window">{text("חלון 24 השעות פתוח", "24-hour window open")}</span>
        </footer>
      </div>
    </figure>
  );
}

export function MetaMoment() {
  const text = useLabels();
  const stats = [
    [text("הוצאה", "Spend"), "$24"],
    [text("לידים", "Leads"), "1"],
    [text("עלות לליד", "Cost per lead"), "$24"],
    [text("חשיפה", "Reach"), "1,840"],
  ] as const;
  return (
    <figure className="pm-meta" data-reveal aria-label={text(
      "הדגמה: מודעת הלידים של סטודיו נורה, והליד שנכנס ממנה ל־CRM — נועה ברק. לא נתוני לקוח אמיתיים.",
      "Demo: the Nora Studio lead ad, and the lead it sent into the CRM — Noa Barak. Not real customer data.",
    )}>
      <header className="pm-meta__bar">
        <span>Meta</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="pm-meta__ad">
        <p>{text("סטודיו נורה", "Nora Studio")}</p>
        <h3>{text("צילום לחמישי הקרוב", "A shoot this Thursday")}</h3>
        <small>{text("מודעת לידים · פייסבוק ואינסטגרם", "Lead ad · Facebook and Instagram")}</small>
      </div>
      <div className="pm-meta__pass" aria-hidden="true"><i /></div>
      <div className="pm-meta__who">
        <div>
          <strong>{text("נועה ברק", "Noa Barak")}</strong>
          <span>{text("נכנסה ל־CRM", "Entered the CRM")}</span>
        </div>
        <em>{text("בטיפול", "In progress")}</em>
      </div>
      <footer className="pm-meta__stats">
        {stats.map(([label, value], index) => (
          <div key={label} className={index === 1 ? "is-lead" : undefined}><span>{label}</span><b>{value}</b></div>
        ))}
      </footer>
    </figure>
  );
}

export function FlowMoment() {
  const text = useLabels();
  const steps = [
    { kind: text("טריגר", "Trigger"), label: text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record"), tone: "" },
    { kind: text("פעולה", "Action"), label: text("נוצרה משימת המשך", "Follow-up task created"), tone: "is-on" },
    { kind: text("על הכרטיס", "On the record"), label: text("חמישי · שיחת היכרות", "Thursday · intro call"), tone: "is-result", time: "10:30" },
  ];
  return (
    <figure className="pm-flow" data-reveal aria-label={text(
      "הדגמה: הרצת אוטומציה אחת לנועה ברק. הרצת בדיקה לא שולחת הודעה ולא משנה נתונים.",
      "Demo: one automation run for Noa Barak. A test run sends nothing and changes no data.",
    )}>
      <header className="pm-flow__bar">
        <span>{text("ההרצה הזו", "This run")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <ol className="pm-flow__rail">
        <i className="pm-flow__track" aria-hidden="true"><b /></i>
        {steps.map((step) => (
          <li key={step.kind} className={step.tone || undefined}>
            <span className="pm-flow__node" />
            <small>{step.kind}</small>
            {step.time ? <b>{step.time}</b> : null}
            <strong>{step.label}</strong>
          </li>
        ))}
      </ol>
      <p className="pm-flow__note">{text("הרצת בדיקה · לא נשלחה הודעה", "Test run · no message sent")}</p>
    </figure>
  );
}

export function AiMoment() {
  const text = useLabels();
  return (
    <figure className="pm-ai" data-reveal aria-label={text(
      "הדגמה: סיכום של נועה ברק, תובנה לאשר את 10:30, והמלצה בלבד. היועץ לא מבצע פעולה. לא נתוני לקוח אמיתיים.",
      "Demo: a summary of Noa Barak, an insight to confirm 10:30, and a recommendation only. The advisor takes no action. Not real customer data.",
    )}>
      <div className="pm-ai__summary">
        <span>{text(DEMO_HE, DEMO_EN)}</span>
        <strong>{text("נועה ברק", "Noa Barak")}</strong>
        <em>{text("ליד חם", "Hot lead")}</em>
        <small>Meta</small>
      </div>
      <div className="pm-ai__insight">
        <span>{text("תובנה", "Insight")}</span>
        <b>10:30</b>
        <p>{text("לאשר עם נועה", "Confirm with Noa")}</p>
      </div>
      <p className="pm-ai__limit">{text("מייעץ בלבד · לא מבצע פעולה", "Advises only · takes no action")}</p>
    </figure>
  );
}

export function DayMoment() {
  const text = useLabels();
  const days = [
    [text("א׳", "Sun"), false],
    [text("ב׳", "Mon"), false],
    [text("ג׳", "Tue"), false],
    [text("ד׳", "Wed"), false],
    [text("ה׳", "Thu"), true],
  ] as const;
  const hours = ["10:00", "10:30", "11:00"];
  const event = () => (
    <i className="pm-week__event">
      <b>{text("נועה ברק", "Noa Barak")}</b>
      <small>{text("שיחת היכרות", "Intro call")}</small>
    </i>
  );
  return (
    <figure className="pm-day" data-reveal aria-label={text(
      "הדגמה: שבוע עבודה, ובו יום חמישי מסומן ושיחת היכרות עם נועה ברק ב־10:30. לא נתוני לקוח אמיתיים.",
      "Demo: a work week, with Thursday marked and Noa Barak's intro call at 10:30. Not real customer data.",
    )}>
      <header className="pm-day__bar">
        <span>{text("חמישי", "Thursday")} · 10:30</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="pm-week__board">
        <div className="pm-week__row is-head">
          <span />
          {days.map(([label, on]) => <span key={label} className={on ? "is-day" : undefined}>{label}</span>)}
        </div>
        {hours.map((hour) => (
          <div className="pm-week__row" key={hour}>
            <span className={hour === "10:30" ? "is-now" : undefined}>{hour}</span>
            {days.map(([label, on]) => (
              <span key={label} className={on ? "is-day" : undefined}>{on && hour === "10:30" ? event() : null}</span>
            ))}
          </div>
        ))}
      </div>
      <div className="pm-week__phone">
        <div className="pm-week__days">
          {days.map(([label, on]) => <span key={label} className={on ? "is-on" : undefined}>{label}</span>)}
        </div>
        <div className="pm-week__agenda">
          <span>10:00</span>
          <span />
          <span className="is-now">10:30</span>
          {event()}
          <span>11:00</span>
          <span />
        </div>
      </div>
      <p className="pm-day__foot">{text("פתוחה על הכרטיס שלה", "Open on her record")}</p>
    </figure>
  );
}
