import { useTranslation } from "react-i18next";
import { homeText } from "./homeCopy";

function useLabels() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  return (hebrew: string, english: string) => homeText(language, hebrew, english);
}

const DEMO_HE = "הדגמה · לא נתוני לקוח אמיתיים";
const DEMO_EN = "Demo · not real customer data";

export function CrmBoard() {
  const text = useLabels();
  const rows = [
    [text("תמר לוי", "Tamar Levi"), text("טופס באתר", "Website form"), text("ליד חדש", "New lead"), false],
    [text("נועה ברק", "Noa Barak"), text("מודעת לידים ב־Meta", "Meta lead ad"), text("בטיפול", "In progress"), true],
    [text("יעל דהן", "Yael Dahan"), text("מודעת לידים ב־Meta", "Meta lead ad"), text("ליד חדש", "New lead"), false],
  ] as const;
  return (
    <figure className="ma-board" aria-label={text(
      "הדגמה: רשימת לידים, וכרטיס נועה ברק פתוח עם מקור, הערה ופגישה. לא נתוני לקוח אמיתיים.",
      "Demo: a lead list, with Noa Barak's record open — source, note and meeting. Not real customer data.",
    )}>
      <header className="ma-board__bar">
        <span>{text("לידים", "Leads")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="ma-board__body">
        <div className="ma-board__list">
          {rows.map(([name, source, status, on]) => (
            <div className={on ? "ma-row is-on" : "ma-row"} key={name}>
              <div>
                <strong>{name}</strong>
                <small>{source}</small>
              </div>
              <em className={on ? "is-hot" : undefined}>{status}</em>
            </div>
          ))}
        </div>
        <article className="ma-board__detail">
          <p>{text("סטודיו נורה", "Nora Studio")}</p>
          <h3>{text("נועה ברק", "Noa Barak")}</h3>
          <p className="ma-note">{text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday.")}</p>
          <ul>
            <li>{text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record")}</li>
            <li>{text("נוצרה משימת המשך", "Follow-up task created")}</li>
          </ul>
        </article>
      </div>
      <footer className="ma-board__foot">
        <div>
          <span>{text("הצעד הבא", "Next step")}</span>
          <strong>{text("חמישי · שיחת היכרות", "Thursday · intro call")}</strong>
        </div>
        <b>10:30</b>
      </footer>
    </figure>
  );
}

export function CrmWindow() {
  const text = useLabels();
  const rows = [
    [text("תמר לוי", "Tamar Levi"), text("ליד חדש", "New lead"), false],
    [text("נועה ברק", "Noa Barak"), text("בטיפול", "In progress"), true],
    [text("יעל דהן", "Yael Dahan"), text("ליד חדש", "New lead"), false],
  ] as const;
  return (
    <figure className="ma-window" aria-label={text(
      "הדגמה: חלון כרטיס לקוח. נועה ברק בטיפול, מקור Meta, והפגישה הבאה ב־10:30. לא נתוני לקוח אמיתיים.",
      "Demo: a customer-record window. Noa Barak is in progress, source Meta, next meeting at 10:30. Not real customer data.",
    )}>
      <header>
        <span>{text("כרטיס לקוח", "Customer record")}</span>
        <span>{text(DEMO_HE, DEMO_EN)}</span>
      </header>
      <div className="ma-window__body">
        <ul>
          {rows.map(([name, status, on]) => (
            <li key={name} className={on ? "is-on" : undefined}>
              <strong>{name}</strong>
              <em>{status}</em>
            </li>
          ))}
        </ul>
        <article>
          <p>{text("סטודיו נורה", "Nora Studio")}</p>
          <h3>{text("נועה ברק", "Noa Barak")}</h3>
          <b>10:30</b>
          <span>{text("הצעד הבא", "Next step")} · {text("חמישי · שיחת היכרות", "Thursday · intro call")}</span>
        </article>
      </div>
      <footer>
        <div><span>{text("מקור", "Source")}</span><strong>{text("מודעת לידים ב־Meta", "Meta lead ad")}</strong></div>
        <div><span>{text("הערה", "Note")}</span><strong>{text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday.")}</strong></div>
        <div><span>{text("פעילות", "Activity")}</span><strong>{text("תשובת WhatsApp נשמרה בכרטיס", "WhatsApp reply saved on the record")}</strong></div>
        <div><span>{text("משימה", "Task")}</span><strong>{text("נוצרה משימת המשך", "Follow-up task created")}</strong></div>
      </footer>
    </figure>
  );
}

export function WhatsAppSplit() {
  const text = useLabels();
  return (
    <figure className="ma-split" aria-label={text(
      "הדגמה: שיחת WhatsApp עם נועה ברק, לצד הכרטיס שעליו התשובה נשמרת. לא נתוני לקוח אמיתיים.",
      "Demo: a WhatsApp thread with Noa Barak, beside the record where the reply is saved. Not real customer data.",
    )}>
      <header className="ma-split__top">
        <span>{text(DEMO_HE, DEMO_EN)}</span>
        <span>{text("תיבה משותפת · 2 ממתינות", "Shared inbox · 2 waiting")}</span>
      </header>
      <article className="ma-split__record">
        <p>{text("סטודיו נורה", "Nora Studio")}</p>
        <h3>{text("נועה ברק", "Noa Barak")}</h3>
        <em>{text("בטיפול", "In progress")}</em>
        <ol>
          <li>{text("מודעת לידים ב־Meta", "Meta lead ad")}</li>
          <li>{text("שאלה על צילום לחמישי הקרוב.", "Asked about a shoot this Thursday.")}</li>
          <li className="is-link">{text("התשובה נשמרת בכרטיס הזה", "The reply is saved on this record")}</li>
          <li>{text("חמישי · שיחת היכרות", "Thursday · intro call")} · 10:30</li>
        </ol>
      </article>
      <div className="ma-split__thread">
        <p className="ma-in">{text(
          "היי, ראיתי את המודעה של סטודיו נורה. אפשר לשמוע על הצילום?",
          "Hi, I saw the Nora Studio ad. Can I hear more about the shoot?",
        )}</p>
        <p className="ma-out">{text(
          "היי נועה, שמחים שפנית. שיחת היכרות פנויה בחמישי ב־10:30.",
          "Hi Noa, glad you wrote. An intro call is open Thursday at 10:30.",
        )}<small>{text("נקראה · 10:41", "Read · 10:41")}</small></p>
        <footer>{text("חלון 24 השעות פתוח", "24-hour window open")}</footer>
      </div>
    </figure>
  );
}

export function WhatsAppOverlay() {
  const text = useLabels();
  return (
    <figure className="ma-over" aria-label={text(
      "הדגמה: כרטיס נועה ברק, והשיחה ב־WhatsApp נפתחת מתוך שורת הפעילות. לא נתוני לקוח אמיתיים.",
      "Demo: Noa Barak's record, with the WhatsApp thread opening from the activity line. Not real customer data.",
    )}>
      <header className="ma-over__who">
        <div>
          <span>{text(DEMO_HE, DEMO_EN)}</span>
          <p>{text("סטודיו נורה", "Nora Studio")}</p>
          <h3>{text("נועה ברק", "Noa Barak")}</h3>
        </div>
        <div className="ma-over__facts">
          <em>{text("בטיפול", "In progress")}</em>
          <small>{text("מקור", "Source")} · {text("מודעת לידים ב־Meta", "Meta lead ad")}</small>
          <b>10:30</b>
          <small>{text("חמישי · שיחת היכרות", "Thursday · intro call")}</small>
        </div>
      </header>
      <p className="ma-in">{text(
        "היי, ראיתי את המודעה של סטודיו נורה. אפשר לשמוע על הצילום?",
        "Hi, I saw the Nora Studio ad. Can I hear more about the shoot?",
      )}</p>
      <p className="ma-out">{text(
        "היי נועה, שמחים שפנית. שיחת היכרות פנויה בחמישי ב־10:30.",
        "Hi Noa, glad you wrote. An intro call is open Thursday at 10:30.",
      )}<small>{text("נקראה · 10:41", "Read · 10:41")}</small></p>
      <footer>
        <strong>{text("התשובה נשמרת בכרטיס הזה", "The reply is saved on this record")}</strong>
        <span>{text("חלון 24 השעות פתוח", "24-hour window open")}</span>
      </footer>
    </figure>
  );
}
