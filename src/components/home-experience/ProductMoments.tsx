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
