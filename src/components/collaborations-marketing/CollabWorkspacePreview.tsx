import React from "react";
import { Handshake } from "lucide-react";
import { AppFrame, Reveal, SectionHeading } from "../product-marketing";

const MATCHES = [
  { name: "סטודיו לצילום אירועים", area: "תל אביב · משלים", score: 92 },
  { name: "מעצבת פנים עצמאית", area: "מרכז · קהל חופף", score: 84 },
  { name: "חברת הפקות קטנה", area: "שרון · ערוץ הפניות", score: 71 },
];

const PROPOSALS = [
  { name: "הפניות הדדיות · סטודיו צילום", state: "נשלחה", tone: "info" },
  { name: "חבילה משותפת · מעצבת פנים", state: "בהתמחרות", tone: "warn" },
  { name: "אירוע משותף · חברת הפקות", state: "אושרה", tone: "ok" },
];

export default function CollabWorkspacePreview() {
  return (
    <section className="pm-section pm-section--tight">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Handshake size={14} aria-hidden="true" />
              ככה זה נראה במערכת
            </>
          }
          title={
            <>
              מהתאמה להצעה — <span className="pm-grad">ולשיחה אחת</span>
            </>
          }
          lead="התאמות מדורגות לפי רלוונטיות, צינור הצעות עם סטטוס, וצ׳אט עסקי שנשמר על ההזדמנות עצמה."
        />

        <Reveal from="up" distance={26} duration={0.7}>
          <AppFrame
            crumb="שיתופי פעולה · שוק והצעות"
            rail={["פרופיל שיתוף", "גילוי שותפים", "שוק הזדמנויות", "הצעות", "צ׳אט"]}
            railActive={2}
            caption="שוק ההזדמנויות: התאמות עם ציון רלוונטיות, סטטוס לכל הצעה, והשיחה שממשיכה באותו מקום."
          >
            <div className="pmk-kpis">
              <div className="pmk-kpi">
                <span>התאמות פתוחות</span>
                <strong>26</strong>
              </div>
              <div className="pmk-kpi">
                <span>הצעות בתהליך</span>
                <strong>9</strong>
              </div>
              <div className="pmk-kpi">
                <span>שיתופים שנסגרו</span>
                <strong>4</strong>
              </div>
              <div className="pmk-kpi">
                <span>הפניות שהתקבלו</span>
                <strong>37</strong>
              </div>
            </div>

            <div className="pmk-cols pmk-cols--wide">
              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>שותפים מתאימים</h4>
                  <span>לפי תחום ואזור</span>
                </div>

                <ul className="pmk-list">
                  {MATCHES.map((match) => (
                    <li key={match.name} className="pmk-match">
                      <div className="pmk-row__main">
                        <strong>{match.name}</strong>
                        <em>{match.area}</em>
                      </div>
                      <span className="pmk-match__bar" aria-hidden="true">
                        <i style={{ width: `${match.score}%` }} />
                      </span>
                      <span className="pmk-match__score">{match.score}%</span>
                    </li>
                  ))}
                </ul>

                <div className="pmk-card__head" style={{ marginTop: "0.9rem" }}>
                  <h4>צינור הצעות</h4>
                </div>

                <ul className="pmk-list">
                  {PROPOSALS.map((proposal) => (
                    <li className="pmk-row" key={proposal.name}>
                      <div className="pmk-row__main">
                        <strong>{proposal.name}</strong>
                      </div>
                      <span className={`pmk-pill pmk-pill--${proposal.tone}`}>
                        {proposal.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>צ׳אט עסקי</h4>
                  <span>סטודיו צילום אירועים</span>
                </div>

                <div className="pmk-chat">
                  <p className="pmk-bubble pmk-bubble--them">
                    היי, ראיתי את ההצעה להפניות הדדיות — מעניין אותנו.
                  </p>
                  <p className="pmk-bubble">
                    מעולה. אני מציע שנתחיל בחודש ניסיון עם עמלה על כל הפנייה שנסגרת.
                  </p>
                  <p className="pmk-bubble pmk-bubble--them">
                    מסכימים. אפשר לקבוע שיחה לסגירת הפרטים?
                  </p>
                  <p className="pmk-bubble">
                    שלחתי הזמנה ליומן לחמישי ב־11:00 — מופיעה גם אצלכם בפגישות.
                  </p>
                </div>

                <p className="pmk-note">
                  השיחה נשמרת על ההזדמנות, כך שגם מי שיצטרף אחר כך רואה את ההקשר.
                </p>
              </div>
            </div>
          </AppFrame>
        </Reveal>
      </div>
    </section>
  );
}
