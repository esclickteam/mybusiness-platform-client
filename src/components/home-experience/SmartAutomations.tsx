import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./smartAutomations.css";

type Kind = "trigger" | "condition" | "action" | "result";

type Step = {
  kind: Kind;
  titleHe: string;
  titleEn: string;
  bodyHe: string;
  bodyEn: string;
  sampleHe: string;
  sampleEn: string;
};

type Flow = {
  id: string;
  nameHe: string;
  nameEn: string;
  resultHe: string;
  resultEn: string;
  steps: [Step, Step, Step, Step];
};

const FLOWS: Flow[] = [
  {
    id: "meta-lead",
    nameHe: "מעקב אחרי ליד חדש ממטה",
    nameEn: "Follow up after a new Meta lead",
    resultHe: "הסימולציה הסתיימה: משימת המעקב נשמרה בכרטיס הלקוח בהדגמה.",
    resultEn: "Simulation finished: the follow-up task was saved on the customer card in the demo.",
    steps: [
      {
        kind: "trigger",
        titleHe: "ליד חדש",
        titleEn: "New lead",
        bodyHe: "ליד חדש נכנס למערכת.",
        bodyEn: "A new lead entered the system.",
        sampleHe: "נועה לוי · עכשיו",
        sampleEn: "Emily Johnson · just now",
      },
      {
        kind: "condition",
        titleHe: "מקור = Meta",
        titleEn: "Source = Meta",
        bodyHe: "בודקים אם מקור הליד הוא Meta.",
        bodyEn: "Check whether the lead source is Meta.",
        sampleHe: "מקור: Meta",
        sampleEn: "Source: Meta",
      },
      {
        kind: "action",
        titleHe: "יצירת משימת מעקב",
        titleEn: "Create follow-up task",
        bodyHe: "נוצרת משימה לצוות, בלי שליחה החוצה.",
        bodyEn: "A task is created for the team, with nothing sent out.",
        sampleHe: "לחזור אל הליד היום",
        sampleEn: "Call the lead back today",
      },
      {
        kind: "result",
        titleHe: "נשמר ב־CRM",
        titleEn: "Saved to CRM",
        bodyHe: "המשימה מופיעה בכרטיס הלקוח בהדגמה.",
        bodyEn: "The task appears on the customer card in the demo.",
        sampleHe: "נשמר מקומית · לא נכתב למסד",
        sampleEn: "Saved locally · not written to the database",
      },
    ],
  },
  {
    id: "appointment",
    nameHe: "תזכורת לפני פגישה",
    nameEn: "Reminder before an appointment",
    resultHe: "הסימולציה הסתיימה: תזכורת הפגישה הוכנה בהדגמה ולא נשלחה.",
    resultEn: "Simulation finished: the appointment reminder was prepared in the demo and was not sent.",
    steps: [
      {
        kind: "trigger",
        titleHe: "פגישה מחר",
        titleEn: "Appointment tomorrow",
        bodyHe: "פגישה קרובה נמצאה ביומן.",
        bodyEn: "An upcoming appointment was found on the calendar.",
        sampleHe: "מחר · 10:00",
        sampleEn: "Tomorrow · 10:00",
      },
      {
        kind: "condition",
        titleHe: "עדיין לא נשלחה תזכורת",
        titleEn: "Reminder not sent yet",
        bodyHe: "בודקים שתזכורת עדיין לא הוכנה.",
        bodyEn: "Check that a reminder has not already been prepared.",
        sampleHe: "סטטוס: ממתין",
        sampleEn: "Status: waiting",
      },
      {
        kind: "action",
        titleHe: "הכנת תבנית מאושרת",
        titleEn: "Prepare an approved template",
        bodyHe: "נבחרת תבנית תזכורת. ההודעה לא נשלחת.",
        bodyEn: "An approved reminder template is chosen. The message is not sent.",
        sampleHe: "תזכורת לפגישה",
        sampleEn: "Appointment reminder",
      },
      {
        kind: "result",
        titleHe: "התזכורת מוכנה",
        titleEn: "Reminder is ready",
        bodyHe: "הנוסח מוצג בהדגמה בלבד.",
        bodyEn: "The wording is shown in the demo only.",
        sampleHe: "לא נשלח ב־WhatsApp",
        sampleEn: "Not sent on WhatsApp",
      },
    ],
  },
  {
    id: "quiet-chat",
    nameHe: "מעקב אחרי שיחה ללא מענה",
    nameEn: "Follow up on a quiet conversation",
    resultHe: "הסימולציה הסתיימה: משימת ההמשך נרשמה בהדגמה בלבד.",
    resultEn: "Simulation finished: the follow-up task was recorded in the demo only.",
    steps: [
      {
        kind: "trigger",
        titleHe: "אין מענה 24 שעות",
        titleEn: "No reply for 24 hours",
        bodyHe: "שיחה פתוחה נשארה בלי תשובה.",
        bodyEn: "An open conversation stayed without a reply.",
        sampleHe: "דניאל כהן · אתמול",
        sampleEn: "Michael Anderson · yesterday",
      },
      {
        kind: "condition",
        titleHe: "השיחה עדיין פתוחה",
        titleEn: "Conversation is still open",
        bodyHe: "בודקים שהשיחה לא נסגרה.",
        bodyEn: "Check that the conversation is still open.",
        sampleHe: "סטטוס: פתוחה",
        sampleEn: "Status: open",
      },
      {
        kind: "action",
        titleHe: "משימת המשך לצוות",
        titleEn: "Follow-up task for the team",
        bodyHe: "נפתחת משימה מקומית, בלי הודעה ללקוח.",
        bodyEn: "A local task is opened, with no message to the customer.",
        sampleHe: "לחזור לשיחה",
        sampleEn: "Return to the conversation",
      },
      {
        kind: "result",
        titleHe: "המשימה בהדגמה",
        titleEn: "Task in the demo",
        bodyHe: "התוצאה נשארת על המסך הזה.",
        bodyEn: "The result stays on this screen.",
        sampleHe: "לא נכתב למסד הנתונים",
        sampleEn: "Not written to the database",
      },
    ],
  },
];

function Icon({ name }: { name: Kind | "play" | "bolt" | "reset" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "play" ? <path d="M8 6.5v11l10-5.5-10-5.5Z" /> : null}
      {name === "bolt" ? <path d="M13 3 6 13h5l-1 8 8-11h-5l0-7Z" /> : null}
      {name === "reset" ? <path d="M7 8.5A6.5 6.5 0 1 1 6.2 14M7 5.5v3.2h3.2" /> : null}
      {name === "trigger" ? <path d="M8 6.5v11l10-5.5-10-5.5Z" /> : null}
      {name === "condition" ? <path d="M12 4.5 19 12l-7 7.5L5 12l7-7.5Z" /> : null}
      {name === "action" ? <path d="M13 3 6 13h5l-1 8 8-11h-5l0-7Z" /> : null}
      {name === "result" ? <path d="M5 8.5h14v9H5v-9Zm0 0 7 4.5 7-4.5" /> : null}
    </svg>
  );
}

export default function SmartAutomations() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const timers = useRef<number[]>([]);
  const [flowId, setFlowId] = useState(FLOWS[0].id);
  const [selected, setSelected] = useState(1);
  const [cursor, setCursor] = useState(-1);
  const [running, setRunning] = useState(false);
  const flow = FLOWS.find((item) => item.id === flowId) || FLOWS[0];
  const done = cursor >= 3 && !running;

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  const reset = () => {
    clearTimers();
    setCursor(-1);
    setRunning(false);
    setSelected(1);
  };

  const chooseFlow = (id: string) => {
    clearTimers();
    setFlowId(id);
    setCursor(-1);
    setRunning(false);
    setSelected(1);
  };

  const run = () => {
    clearTimers();
    setCursor(-1);
    setSelected(0);
    setRunning(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCursor(3);
      setSelected(3);
      setRunning(false);
      return;
    }
    [0, 1, 2, 3].forEach((step) => {
      const timer = window.setTimeout(() => {
        setCursor(step);
        setSelected(step);
        if (step === 3) setRunning(false);
      }, 720 * (step + 1));
      timers.current.push(timer);
    });
  };

  const kindLabel = (kind: Kind) => {
    const labels: Record<Kind, [string, string]> = {
      trigger: ["טריגר", "Trigger"],
      condition: ["תנאי", "Condition"],
      action: ["פעולה", "Action"],
      result: ["תוצאה", "Result"],
    };
    return text(labels[kind][0], labels[kind][1]);
  };

  const progress = cursor < 0 ? 0 : ((cursor + 1) / 4) * 100;
  const step = flow.steps[selected] || flow.steps[0];

  return (
    <section className="au-section" id="automations" dir={dir} aria-labelledby="au-title">
      <div className="au-wrap">
        <header className="au-head">
          <p className="au-kicker"><Icon name="bolt" />Smart Automations</p>
          <h2 id="au-title">{text("אוטומציות חכמות לעבודה חלקה יותר", "Smart automations for smoother work")}</h2>
          <p>{text("בחרו תהליך והריצו סימולציה. שום הודעה לא נשלחת ושום דבר לא נשמר מחוץ למסך.", "Choose a process and run a simulation. No message is sent and nothing is stored outside this screen.")}</p>
        </header>

        <div className="au-app">
          <div className="au-bar">
            <button type="button" className="au-run" onClick={run} disabled={running}>
              <Icon name="play" />
              {running ? text("הסימולציה רצה", "Simulation running") : text("הרצת סימולציה", "Run simulation")}
            </button>
            <span className="au-badge">{text("סימולציה", "Simulation")}</span>
            <label className="au-picker">
              <span>{text("תהליך", "Process")}</span>
              <select value={flow.id} disabled={running} aria-label={text("בחירת תהליך", "Choose a process")} onChange={(event) => chooseFlow(event.target.value)}>
                {FLOWS.map((item) => (
                  <option key={item.id} value={item.id}>{text(item.nameHe, item.nameEn)}</option>
                ))}
              </select>
            </label>
            <span className="au-draft">{text("טיוטה", "Draft")}</span>
            <button type="button" className="au-reset" onClick={reset}><Icon name="reset" />{text("איפוס", "Reset")}</button>
          </div>

          <div className="au-body">
            <aside className="au-library">
              <h3>{text("ספריית בלוקים", "Block library")}</h3>
              <p>{text("ארבעת שלבי התהליך.", "The four steps of the process.")}</p>
              {(["trigger", "condition", "action", "result"] as Kind[]).map((kind) => (
                <button key={kind} type="button" onClick={() => setSelected(flow.steps.findIndex((item) => item.kind === kind))}>
                  <Icon name={kind} />
                  <span>
                    <strong>{kindLabel(kind)}</strong>
                    <small>{text(kind === "trigger" ? "נקודת ההתחלה" : kind === "condition" ? "הבדיקה" : kind === "action" ? "מה מבצעים" : "מה רואים בסוף", kind === "trigger" ? "Where it starts" : kind === "condition" ? "The check" : kind === "action" ? "What runs" : "What you see at the end")}</small>
                  </span>
                </button>
              ))}
            </aside>

            <div className="au-canvas">
              <ol className="au-flow">
                {flow.steps.map((item, index) => {
                  const reached = cursor >= index;
                  return (
                    <li key={item.kind}>
                      <button
                        type="button"
                        className={`is-${item.kind}${reached ? " is-done" : ""}${running && cursor === index ? " is-now" : ""}${selected === index ? " is-on" : ""}`}
                        aria-current={selected === index ? "step" : undefined}
                        onClick={() => setSelected(index)}
                      >
                        {reached ? <i className="au-check" aria-hidden="true">✓</i> : null}
                        <Icon name={item.kind} />
                        <strong>{text(item.titleHe, item.titleEn)}</strong>
                        <small>{text(item.bodyHe, item.bodyEn)}</small>
                        <em>{kindLabel(item.kind)}</em>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="au-progress" aria-live="polite">
                <span>
                  {running
                    ? text("סימולציה פעילה…", "Simulation in progress…")
                    : done
                      ? text("השלבים הושלמו", "Steps completed")
                      : text("הסימולציה מוכנה", "Simulation is ready")}
                </span>
                <div className="au-meter"><i style={{ width: `${progress}%` }} /></div>
                <b>{Math.max(cursor + 1, 0)} / 4</b>
              </div>
              {done ? <p className="au-result" role="status">{text(flow.resultHe, flow.resultEn)}</p> : null}
            </div>

            <aside className="au-inspector">
              <h3>{text("הגדרות הבלוק", "Block settings")}</h3>
              <p className={`au-kind is-${step.kind}`}><Icon name={step.kind} />{kindLabel(step.kind)}</p>
              <h4>{text(step.titleHe, step.titleEn)}</h4>
              <p>{text(step.bodyHe, step.bodyEn)}</p>
              <dl>
                <div>
                  <dt>{text("מה בודקים", "What it checks")}</dt>
                  <dd>{text(step.sampleHe, step.sampleEn)}</dd>
                </div>
              </dl>
              <p className="au-note">{text("הדגמה מקומית. לא נשלחת הודעה ולא נכתב למסד הנתונים.", "Local demo. No message is sent and nothing is written to the database.")}</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
