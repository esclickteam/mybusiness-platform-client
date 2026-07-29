import React from "react";
import { Workflow } from "lucide-react";
import { AppFrame, Reveal, SectionHeading } from "../product-marketing";

const RULE = [
  { tag: "טריגר", text: "ליד חדש נכנס מ־Facebook Lead Ads" },
  { tag: "תנאי", text: "לא נוצר קשר בתוך 60 דקות" },
  { tag: "פעולה", text: "תזכורת לנציג + משימה עם דד־ליין להיום" },
];

const RUNS = [
  { name: "פולואפ ליד שלא נענה", when: "לפני 4 דקות", state: "הושלם", tone: "ok" },
  { name: "תזכורת לפני פגישה", when: "מתוזמן ל־08:30", state: "ממתין", tone: "warn" },
  { name: "עדכון סטטוס להומר", when: "רץ עכשיו", state: "פעיל", tone: "live" },
  { name: "משימה לליד חדש", when: "לפני 22 דקות", state: "הושלם", tone: "ok" },
];

export default function AutomationsBuilderPreview() {
  return (
    <section className="pm-section pm-section--tight">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Workflow size={14} aria-hidden="true" />
              ככה זה נראה במערכת
            </>
          }
          title={
            <>
              בונים תהליך בשלוש שורות —{" "}
              <span className="pm-grad">ורואים מה רץ</span>
            </>
          }
          lead="טריגר, תנאי ופעולה בצד אחד, יומן הריצות בצד השני. אין תרשימי זרימה ואין קוד."
        />

        <Reveal from="up" distance={26} duration={0.7}>
          <AppFrame
            crumb="אוטומציות · בונה תהליכים"
            rail={["לידים", "אוטומציות", "משימות", "התראות", "הגדרות"]}
            railActive={1}
            caption="בונה התהליכים: טריגר מ־Lead Ads, תנאי זמן ופעולה כפולה — וכל ריצה נשמרת ביומן עם סטטוס."
          >
            <div className="pmk-kpis">
              <div className="pmk-kpi">
                <span>תהליכים פעילים</span>
                <strong>7</strong>
              </div>
              <div className="pmk-kpi">
                <span>ריצות היום</span>
                <strong>184</strong>
              </div>
              <div className="pmk-kpi">
                <span>משימות שנפתחו</span>
                <strong>32</strong>
              </div>
              <div className="pmk-kpi">
                <span>ממתינות להמשך</span>
                <strong>5</strong>
              </div>
            </div>

            <div className="pmk-cols pmk-cols--wide">
              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>פולואפ ליד שלא נענה</h4>
                  <span>פעיל</span>
                </div>

                <div className="pmk-flow">
                  {RULE.map((step, index) => (
                    <React.Fragment key={step.tag}>
                      <div className="pmk-flow__step">
                        <span className="pmk-flow__tag">{step.tag}</span>
                        <p>{step.text}</p>
                      </div>
                      {index < RULE.length - 1 ? (
                        <span className="pmk-flow__link" aria-hidden="true" />
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>

                <p className="pmk-note">
                  כל שינוי נשמר על הליד עצמו — אותו סטטוס שרואים בכרטיס ב־CRM.
                </p>
              </div>

              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>יומן ריצות</h4>
                  <span>24 שעות</span>
                </div>

                <ul className="pmk-list">
                  {RUNS.map((run) => (
                    <li className="pmk-row" key={run.name}>
                      <div className="pmk-row__main">
                        <strong>{run.name}</strong>
                        <em>{run.when}</em>
                      </div>
                      <span className={`pmk-pill pmk-pill--${run.tone}`}>
                        {run.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AppFrame>
        </Reveal>
      </div>
    </section>
  );
}
