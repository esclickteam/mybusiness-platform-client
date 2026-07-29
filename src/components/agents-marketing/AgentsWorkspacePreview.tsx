import React from "react";
import { Headset } from "lucide-react";
import { AppFrame, Reveal, SectionHeading } from "../product-marketing";

const QUEUE = [
  {
    initials: "דנ",
    name: "דנה לוי · שיפוץ מטבח",
    meta: "Facebook · נכנס לפני 12 דקות",
    state: "בטיפול נציג",
    tone: "live",
  },
  {
    initials: "אמ",
    name: "אמיר כהן · הצעת מחיר",
    meta: "אתר · נוצר קשר",
    state: "נקבעה פגישה",
    tone: "ok",
  },
  {
    initials: "רו",
    name: "רונית בר · ייעוץ ראשוני",
    meta: "Google Ads · ממתין למסמכים",
    state: "ממתין ללקוח",
    tone: "warn",
  },
  {
    initials: "יו",
    name: "יובל שדה · חידוש התקשרות",
    meta: "Instagram · ליד חדש",
    state: "בתור",
    tone: "info",
  },
];

const ACTIVITY = [
  <>
    <strong>שיחה יוצאת</strong> לדנה לוי — 3 דקות, סוכם על שיחת המשך מחר ב־10:00
  </>,
  <>
    <strong>מולאו פרטים</strong> בכרטיס הליד: תקציב, מיקום ולוח זמנים
  </>,
  <>
    <strong>נקבעה פגישה</strong> לאמיר כהן ביומן — ראשון, 09:30
  </>,
  <>
    <strong>נפתחה משימה</strong> לבעל העסק: לאשר הצעת מחיר עד סוף היום
  </>,
];

export default function AgentsWorkspacePreview() {
  return (
    <section className="pm-section pm-section--tight">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Headset size={14} aria-hidden="true" />
              ככה זה נראה במערכת
            </>
          }
          title={
            <>
              הנציג עובד בתוך ה־CRM —{" "}
              <span className="pm-grad">ואתם רואים הכל</span>
            </>
          }
          lead="תור הפניות עם סטטוס ומי מטפל, ולידו יומן פעילות שמתעד כל שיחה, פגישה ומשימה שנפתחה."
        />

        <Reveal from="up" distance={26} duration={0.7}>
          <AppFrame
            crumb="CRM · טיפול נציג"
            rail={["לידים", "לקוחות", "פגישות", "נציגים", "דוחות"]}
            railActive={3}
            caption="תור הטיפול: כל פנייה עם המקור, הסטטוס והנציג המטפל — ולידו תיעוד הפעולות שבוצעו בשמכם."
          >
            <div className="pmk-kpis">
              <div className="pmk-kpi">
                <span>פניות בטיפול</span>
                <strong>18</strong>
              </div>
              <div className="pmk-kpi">
                <span>זמן תגובה ממוצע</span>
                <strong>8 דק׳</strong>
              </div>
              <div className="pmk-kpi">
                <span>פגישות שנקבעו</span>
                <strong>11</strong>
              </div>
              <div className="pmk-kpi">
                <span>שיחות שלא נענו</span>
                <strong>0</strong>
              </div>
            </div>

            <div className="pmk-cols pmk-cols--wide">
              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>תור פניות</h4>
                  <span>מתעדכן בזמן אמת</span>
                </div>

                <ul className="pmk-list">
                  {QUEUE.map((lead) => (
                    <li className="pmk-row" key={lead.name}>
                      <span className="pmk-avatar" aria-hidden="true">
                        {lead.initials}
                      </span>
                      <div className="pmk-row__main">
                        <strong>{lead.name}</strong>
                        <em>{lead.meta}</em>
                      </div>
                      <span className={`pmk-pill pmk-pill--${lead.tone}`}>
                        {lead.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>יומן פעילות הנציג</h4>
                  <span>היום</span>
                </div>

                <ul className="pmk-time">
                  {ACTIVITY.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p className="pmk-note">
                  אותו תיעוד מופיע בכרטיס הליד — אין פעולה שקורית מחוץ למערכת.
                </p>
              </div>
            </div>
          </AppFrame>
        </Reveal>
      </div>
    </section>
  );
}
