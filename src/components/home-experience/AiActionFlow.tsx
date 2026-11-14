import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./aiActionFlow.css";

const ACTIONS = [
  {
    id: "message",
    titleHe: "הודעת המשך ללקוח",
    titleEn: "Follow-up message",
    draftHe: "היי נועה, שמנו לב להתעניינות ורצינו להשאיר הצעה קצרה. זו טיוטה לדוגמה, ואפשר לערוך אותה לפני האישור.",
    draftEn: "Hi Emily, we noticed the interest and wanted to leave a short offer. This is a sample draft, and you can edit it before approving.",
  },
  {
    id: "task",
    titleHe: "משימת מעקב לצוות",
    titleEn: "Follow-up task",
    draftHe: "לחזור ללקוח היום ולבדוק שההצעה ברורה. המשימה נשארת בתוך ההדגמה ולא נשמרת.",
    draftEn: "Call the customer back today and check that the offer is clear. The task stays inside the demo and is not saved.",
  },
  {
    id: "visit",
    titleHe: "הצעה לתיאום שיחה",
    titleEn: "Suggest a call",
    draftHe: "להציע שיחה קצרה בשבוע הקרוב. לא נקבעת פגישה אמיתית ולא נשלחת הודעה.",
    draftEn: "Offer a short call next week. No real meeting is booked and no message is sent.",
  },
] as const;

const MARKS = [
  { id: "bold", label: "B", before: "**", after: "**" },
  { id: "italic", label: "I", before: "_", after: "_" },
  { id: "under", label: "U", before: "", after: "" },
] as const;

export default function AiActionFlow() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const editor = useRef<HTMLTextAreaElement | null>(null);
  const [actionId, setActionId] = useState<(typeof ACTIONS)[number]["id"]>("message");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [approved, setApproved] = useState(false);
  const action = ACTIONS.find((item) => item.id === actionId) || ACTIONS[0];
  const draft = drafts[action.id] ?? text(action.draftHe, action.draftEn);

  const choose = (id: (typeof ACTIONS)[number]["id"]) => {
    setActionId(id);
    setApproved(false);
  };

  const write = (value: string) => {
    setDrafts((current) => ({ ...current, [action.id]: value }));
    setApproved(false);
  };

  const wrap = (before: string, after: string) => {
    const field = editor.current;
    if (!field) return;
    const start = field.selectionStart ?? draft.length;
    const end = field.selectionEnd ?? draft.length;
    const selected = draft.slice(start, end) || text("טקסט", "text");
    const next = `${draft.slice(0, start)}${before}${selected}${after}${draft.slice(end)}`;
    write(next);
    requestAnimationFrame(() => {
      field.focus();
      const cursor = start + before.length + selected.length + after.length;
      field.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <section className="ai-section" id="insights" dir={dir} aria-labelledby="ai-title">
      <div className="ai-split">
        <div className="ai-demo">
          <div className="ai-demo-top">
            <p><i />{text("הדגמה מקומית", "Local demo")}</p>
            <div>
              <h3>Bizuply AI Action Flow</h3>
              <small>{text("מהאות לעסק, להמלצה, ולטיוטה לאישור", "From a signal, to a recommendation, to a draft for approval")}</small>
            </div>
          </div>
          <ol className="ai-steps" aria-label={text("שלבי ההדגמה", "Demo steps")}>
            <li className="is-on"><b>1</b>{text("זיהוי הזדמנות", "Opportunity")}</li>
            <li className="is-on"><b>2</b>{text("המלצה", "Recommendation")}</li>
            <li className={approved ? "is-on" : undefined}><b>3</b>{text("יצירת פעולה", "Action draft")}</li>
          </ol>
          <div className="ai-board">
            <article className="ai-signal">
              <header>
                <h4>{text("אות מהעסק", "Business signal")}</h4>
                <span aria-hidden="true">↗</span>
              </header>
              <strong>{text("עלייה של 42% במעורבות", "Engagement up 42%")}</strong>
              <p>{text("אצל לקוח לדוגמה. זה נתון להמחשה, לא מדידה חיה.", "For a sample customer. This is an illustration, not a live measurement.")}</p>
              <ul>
                <li>{text("3 שימושים חדשים בצוות", "3 new uses by the team")}</li>
                <li>{text("פניות על יכולות מתקדמות", "Questions about advanced features")}</li>
              </ul>
            </article>
            <article>
              <header>
                <h4>{text("המלצה", "Recommendation")}</h4>
              </header>
              <div role="radiogroup" aria-label={text("בחירת המלצה", "Choose a recommendation")}>
                {ACTIONS.map((item) => (
                  <label key={item.id} className={item.id === action.id ? "is-on" : undefined}>
                    <input type="radio" name="ai-action" checked={item.id === action.id} onChange={() => choose(item.id)} />
                    <span>{text(item.titleHe, item.titleEn)}</span>
                    {item.id === action.id ? <i aria-hidden="true">✓</i> : <i aria-hidden="true" />}
                  </label>
                ))}
              </div>
            </article>
            <article className="ai-draft">
              <header>
                <h4>{text("טיוטת פעולה", "Action draft")}</h4>
              </header>
              <div className="ai-editor">
                <div className="ai-tools" aria-label={text("עיצוב הטיוטה", "Format the draft")}>
                  {MARKS.map((mark) => (
                    <button key={mark.id} type="button" onClick={() => (mark.id === "under" ? editor.current?.focus() : wrap(mark.before, mark.after))}>{mark.label}</button>
                  ))}
                  <button type="button" onClick={() => editor.current?.focus()}>{text("עריכה", "Edit")}</button>
                </div>
                <textarea ref={editor} aria-label={text("טיוטת הפעולה", "Action draft")} value={draft} onChange={(event) => write(event.target.value)} />
              </div>
              <button type="button" className="ai-approve" onClick={() => setApproved(true)}>{text("אישור טיוטה", "Approve draft")}</button>
              {approved ? <p className="ai-ok" role="status">{text("הטיוטה אושרה בהדגמה. היא לא נשלחה ולא נשמרה.", "The draft was approved in the demo. It was not sent and it was not saved.")}</p> : null}
            </article>
          </div>
        </div>
        <div className="ai-copy">
          <p className="ai-kicker">AI Action Flow</p>
          <h2 id="ai-title">{text("מזהים הזדמנות, בוחרים המלצה, ומאשרים טיוטה", "Spot an opportunity, choose a recommendation, and approve a draft")}</h2>
          <p>{text("ההדגמה מציגה תובנה, המלצה וטיוטה מוכנות מראש. אין כאן מודל שכותב בזמן אמת, ואין שליחה ללקוח.", "The demo shows a prepared insight, recommendation, and draft. No model is writing live, and nothing is sent to a customer.")}</p>
        </div>
      </div>
    </section>
  );
}
