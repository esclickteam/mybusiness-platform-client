import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./aiActionFlow.css";

const ACTIONS = [
  {
    id: "message",
    titleHe: "הודעת המשך ללקוח",
    titleEn: "Customer follow-up message",
    draftHe: "היי, שמנו לב להתעניינות ורצינו להשאיר הצעה קצרה. זו טיוטה לדוגמה ואפשר לערוך אותה.",
    draftEn: "Hi, we noticed the interest and wanted to leave a short offer. This is a sample draft and you can edit it.",
  },
  {
    id: "task",
    titleHe: "משימת מעקב לצוות",
    titleEn: "Follow-up task for the team",
    draftHe: "לחזור ללקוח היום ולבדוק אם ההצעה ברורה. המשימה נשארת בהדגמה.",
    draftEn: "Call the customer back today and check that the offer is clear. The task stays in the demo.",
  },
  {
    id: "visit",
    titleHe: "הצעה לתיאום שיחה",
    titleEn: "Suggest a call",
    draftHe: "להציע שיחה קצרה בשבוע הקרוב. לא נקבעת פגישה אמיתית.",
    draftEn: "Offer a short call next week. No real meeting is booked.",
  },
] as const;

export default function AiActionFlow() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [actionId, setActionId] = useState<(typeof ACTIONS)[number]["id"]>("message");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [approved, setApproved] = useState(false);
  const action = ACTIONS.find((item) => item.id === actionId) || ACTIONS[0];
  const draft = drafts[action.id] ?? text(action.draftHe, action.draftEn);

  const choose = (id: (typeof ACTIONS)[number]["id"]) => {
    setActionId(id);
    setApproved(false);
  };

  return (
    <section className="ai-section" id="insights" dir={dir} aria-labelledby="ai-title">
      <div className="ai-split">
        <div className="ai-demo">
          <div className="ai-demo-top">
            <p>{text("הדגמה מקומית", "Local demo")}</p>
            <h3>AI Action Flow</h3>
          </div>
          <ol className="ai-steps">
            <li className="is-on">{text("זיהוי הזדמנות", "Spot an opportunity")}</li>
            <li className="is-on">{text("המלצה", "Recommendation")}</li>
            <li className={approved ? "is-on" : undefined}>{text("טיוטת פעולה", "Action draft")}</li>
          </ol>
          <div className="ai-board">
            <article>
              <h4>{text("ההזדמנות", "The opportunity")}</h4>
              <p>{text("בהדגמה: מעורבות של לקוח לדוגמה עלתה, ויש מקום להמשך טיפול.", "In the demo: a sample customer’s engagement rose, and a follow-up would help.")}</p>
            </article>
            <article>
              <h4>{text("המלצה", "Recommendation")}</h4>
              <div role="radiogroup" aria-label={text("בחירת המלצה", "Choose a recommendation")}>
                {ACTIONS.map((item) => (
                  <label key={item.id} className={item.id === action.id ? "is-on" : undefined}>
                    <input type="radio" name="ai-action" checked={item.id === action.id} onChange={() => choose(item.id)} />
                    {text(item.titleHe, item.titleEn)}
                  </label>
                ))}
              </div>
            </article>
            <article>
              <h4>{text("טיוטה לעריכה", "Draft to edit")}</h4>
              <textarea aria-label={text("טיוטת הפעולה", "Action draft")} value={draft} onChange={(event) => { setDrafts((current) => ({ ...current, [action.id]: event.target.value })); setApproved(false); }} />
              <button type="button" onClick={() => setApproved(true)}>{text("אישור בהדגמה", "Approve in the demo")}</button>
              {approved ? <p className="ai-ok" role="status">{text("הטיוטה אושרה בהדגמה. היא לא נשלחה ולא נשמרה במערכת.", "The draft was approved in the demo. It was not sent and it was not saved in the system.")}</p> : null}
            </article>
          </div>
        </div>
        <div className="ai-copy">
          <p className="ai-kicker">AI Action Flow</p>
          <h2 id="ai-title">{text("מזהים הזדמנות, בוחרים המלצה, ומאשרים טיוטה", "Spot an opportunity, choose a recommendation, and approve a draft")}</h2>
          <p>{text("הזרימה מציגה טיוטות מוכנות מראש. אין כאן מודל שכותב בזמן אמת, ואין שליחה ללקוח.", "The flow shows drafts prepared in advance. No model is writing live, and nothing is sent to a customer.")}</p>
        </div>
      </div>
    </section>
  );
}
