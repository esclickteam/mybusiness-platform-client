import { useTranslation } from "react-i18next";
import { homeText } from "./homeCopy";

function useLabels() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  return (hebrew: string, english: string) => homeText(language, hebrew, english);
}

export function CrmMoment() {
  const text = useLabels();
  const leads = [
    [text("תמר לוי", "Tamar Levi"), text("ליד חדש", "New lead")],
    [text("נועה ברק", "Noa Barak"), text("בטיפול", "In progress")],
    [text("יעל דהן", "Yael Dahan"), text("ליד חדש", "New lead")],
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
      <div className="pm-crm__glow" aria-hidden="true" />
      <p className="pm-demo">{text("הדגמה · לא נתוני לקוח אמיתיים", "Demo · not real customer data")}</p>
      <ul className="pm-crm__list" aria-hidden="true">
        {leads.map(([name, status], index) => (
          <li key={name} className={index === 1 ? "is-on" : undefined}>
            <span>{name}</span>
            <i>{status}</i>
          </li>
        ))}
      </ul>
      <article className="pm-crm__record">
        <p className="pm-kicker">{text("סטודיו נורה", "Nora Studio")}</p>
        <h3>{text("נועה ברק", "Noa Barak")}</h3>
        <div className="pm-crm__meta">
          <span className="pm-status">{text("בטיפול", "In progress")}</span>
          <span>{text("מקור · מודעת לידים ב־Meta", "Source · Meta lead ad")}</span>
        </div>
        <p className="pm-note">{text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday.")}</p>
        <div className="pm-meet">
          <strong>10:30</strong>
          <span>
            <em>{text("הצעד הבא", "Next step")}</em>
            {text("חמישי · שיחת היכרות", "Thursday · intro call")}
          </span>
        </div>
        <ol className="pm-log">
          <li>{text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record")}</li>
          <li>{text("נוצרה משימת המשך", "Follow-up task created")}</li>
        </ol>
      </article>
    </figure>
  );
}

export function WhatsAppMoment() {
  const text = useLabels();
  return (
    <figure
      className="pm-wa"
      data-reveal
      aria-label={text(
        "הדגמה של שיחת WhatsApp עם נועה ברק, מחוברת לכרטיס שלה. לא נתוני לקוח אמיתיים.",
        "A demo WhatsApp thread with Noa Barak, linked to her record. Not real customer data.",
      )}
    >
      <p className="pm-demo">{text("הדגמה · לא נתוני לקוח אמיתיים", "Demo · not real customer data")}</p>
      <aside className="pm-wa__link">
        <span>{text("כרטיס מקושר", "Linked record")}</span>
        <strong>{text("נועה ברק", "Noa Barak")}</strong>
        <em>{text("סטודיו נורה · בטיפול", "Nora Studio · in progress")}</em>
      </aside>
      <div className="pm-wa__thread">
        <header>
          <b aria-hidden="true">{text("נועה ברק", "Noa Barak").trim().charAt(0)}</b>
          <div>
            <strong>{text("נועה ברק", "Noa Barak")}</strong>
            <span>{text("תיבה משותפת · 2 ממתינות", "Shared inbox · 2 waiting")}</span>
          </div>
        </header>
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
        <p className="pm-window">{text("חלון 24 השעות פתוח", "24-hour window open")}</p>
      </div>
    </figure>
  );
}
