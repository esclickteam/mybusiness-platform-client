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
      <div className="pm-meta__who">
        <div>
          <strong>{text("נועה ברק", "Noa Barak")}</strong>
          <span>{text("נכנסה ל־CRM", "Entered the CRM")}</span>
        </div>
        <em>{text("בטיפול", "In progress")}</em>
      </div>
      <footer className="pm-meta__stats">
        {stats.map(([label, value]) => (
          <div key={label}><span>{label}</span><b>{value}</b></div>
        ))}
      </footer>
    </figure>
  );
}

export function FlowMoment() {
  const text = useLabels();
  const steps = [
    [text("טריגר", "Trigger"), text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record"), false],
    [text("פעולה", "Action"), text("נוצרה משימת המשך", "Follow-up task created"), true],
    [text("על הכרטיס", "On the record"), text("חמישי · שיחת היכרות", "Thursday · intro call") + " · 10:30", false],
  ] as const;
  return (
    <figure className="pm-flow" data-reveal aria-label={text(
      "הדגמה: הרצת אוטומציה אחת לנועה ברק. הרצת בדיקה לא שולחת הודעה ולא משנה נתונים.",
      "Demo: one automation run for Noa Barak. A test run sends nothing and changes no data.",
    )}>
      <header className="pm-flow__bar">
        <span>{text("ההרצה הזו", "This run")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <ol className="pm-flow__steps">
        {steps.map(([kind, label, on]) => (
          <li key={kind} className={on ? "is-on" : undefined}>
            <small>{kind}</small>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>
      <p className="pm-flow__note">{text("הרצת בדיקה · לא נשלחה הודעה", "Test run · no message sent")}</p>
    </figure>
  );
}

export function AdviceMoment() {
  const text = useLabels();
  return (
    <figure className="pm-advice" aria-label={text(
      "הדגמה: המלצה של היועץ העסקי לפני השיחה עם נועה ברק. הוא מייעץ ולא מבצע פעולה. לא נתוני לקוח אמיתיים.",
      "Demo: a Business Advisor recommendation before the call with Noa Barak. It advises and takes no action. Not real customer data.",
    )}>
      <p className="pm-advice__kicker">{text(DEMO_HE, DEMO_EN)}</p>
      <p className="pm-advice__kicker">{text("המלצה", "Recommendation")}</p>
      <h3>{text("לפני השיחה בחמישי, לאשר עם נועה את 10:30.", "Before Thursday's call, confirm 10:30 with Noa.")}</h3>
      <p className="pm-advice__body">{text(
        "היא שאלה על צילום. התשובה כבר שמורה בכרטיס.",
        "She asked about a shoot. The reply is already on her record.",
      )}</p>
      <p className="pm-advice__limit">{text("מייעץ בלבד · לא מבצע פעולה", "Advises only · takes no action")}</p>
    </figure>
  );
}

export function ScoreMoment() {
  const text = useLabels();
  const lines = [
    text("מודעת לידים ב־Meta", "Meta lead ad"),
    text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday."),
    text("חמישי · שיחת היכרות", "Thursday · intro call") + " · 10:30",
  ];
  return (
    <figure className="pm-score" aria-label={text(
      "הדגמה: סיכום לפני השיחה עם נועה ברק, וסיווג כליד חם. לא נתוני לקוח אמיתיים.",
      "Demo: a summary before the call with Noa Barak, classified as a hot lead. Not real customer data.",
    )}>
      <header className="pm-score__bar">
        <span>{text("סיכום לפני השיחה", "Summary before the call")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="pm-score__main">
        <h3>{text("נועה ברק", "Noa Barak")}</h3>
        <em className="pm-score__mark">{text("ליד חם", "Hot lead")}</em>
      </div>
      <ul>
        {lines.map((line) => <li key={line}>{line}</li>)}
      </ul>
    </figure>
  );
}

export function DayMoment() {
  const text = useLabels();
  return (
    <figure className="pm-day" data-reveal aria-label={text(
      "הדגמה: יום חמישי ביומן, ובו שיחת היכרות עם נועה ברק ב־10:30. לא נתוני לקוח אמיתיים.",
      "Demo: Thursday on the calendar, with Noa Barak's intro call at 10:30. Not real customer data.",
    )}>
      <header className="pm-day__bar">
        <span>{text("חמישי", "Thursday")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="pm-day__grid">
        <span>10:00</span>
        <span />
        <span className="is-now">10:30</span>
        <div className="pm-day__event">
          <strong>{text("שיחת היכרות", "Intro call")}</strong>
          <small>{text("נועה ברק", "Noa Barak")} · {text("סטודיו נורה", "Nora Studio")}</small>
        </div>
        <span>11:00</span>
        <span />
      </div>
      <p className="pm-day__foot">{text("פתוחה על הכרטיס שלה", "Open on her record")}</p>
    </figure>
  );
}
