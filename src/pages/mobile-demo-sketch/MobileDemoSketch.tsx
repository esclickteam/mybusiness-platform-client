import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  Check,
  CircleUserRound,
  ClipboardList,
  CreditCard,
  Handshake,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  Lock,
  Megaphone,
  MessageCircle,
  PencilLine,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  UserPlus,
  UserRound,
  Workflow,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  MOBILE_DEMO_DURATION,
  MOBILE_DEMO_RAIL,
  MOBILE_DEMO_SCENES,
  MOBILE_DEMO_WIDTHS,
  sceneAt,
  type MobileDemoIconName,
  type MobileDemoSceneId,
} from "./mobileDemoRail";
import "./mobileDemoSketch.css";

const ICONS: Record<MobileDemoIconName, LucideIcon> = {
  LayoutDashboard,
  CircleUserRound,
  Workflow,
  MessageCircle,
  Megaphone,
  Handshake,
  Sparkles,
  PencilLine,
  UserRound,
  LayoutTemplate,
  Shield,
  CreditCard,
  HelpCircle,
};

const COPY = {
  he: {
    kicker: "סקיצה לאישור",
    title: "הדגמת המערכת במובייל",
    lead: "תצוגה בלבד. מקטע הלידים באתר לא הוחלף. החשבון והלקוחה הם נתוני דוגמה, ושום הודעה לא נשלחת.",
    legend: "אייקוני הסיידבר, לפי הסדר בסקיצה. בתוך החלון אין שמות.",
    widths: "אותו חלון ברוחבים 320, 375, 390 ו־430.",
    phone: "ברוחב מסך צר החלון תופס את רוחב התצוגה.",
    demo: "הדגמה",
    account: "סטודיו לדוגמה",
    leadTitle: "ליד חדש",
    leadBody: "נועה לוי נכנסה עכשיו ממודעת Meta.",
    source: "Meta",
    fresh: "עכשיו",
    crmTitle: "כרטיס לקוח",
    name: "נועה לוי",
    status: "ליד חדש",
    phoneLabel: "050-000-0148",
    note: "פנייה לדוגמה. לא לקוחה אמיתית.",
    openWa: "WhatsApp",
    openTask: "משימה",
    openMeet: "פגישה",
    waTitle: "שיחה",
    waIn: "שלום, ראיתי את המודעה ואשמח לפרטים.",
    waOut: "שלום נועה, תודה על הפנייה. נשמח לעזור.",
    waSaved: "נשמר בהדגמה. לא נשלח.",
    taskTitle: "משימת מעקב",
    taskBody: "לחזור אל נועה לוי",
    taskWhen: "מחר · 10:00",
    taskState: "נוצרה בהדגמה",
    meetTitle: "יומן",
    meetWhen: "מחר",
    free: "פנוי",
    meetName: "שיחת היכרות",
    meetSaved: "הפגישה נקבעה בהדגמה.",
    autoTitle: "אוטומציות",
    autoNew: "+ אוטומציה חדשה",
    steps: ["ליד חדש התקבל", "שליחת הודעת WhatsApp", "יצירת משימת מעקב", "פגישה נקבעה"],
    play: "הפעלה",
    pause: "השהיה",
    mute: "השתקה",
    unmute: "ביטול השתקה",
    full: "מסך מלא",
    exit: "יציאה ממסך מלא",
    progress: "התקדמות ההדגמה",
    rail: "תפריט המערכת",
    quiet: "ההדגמה שקטה",
  },
  en: {
    kicker: "Sketch for review",
    title: "Mobile system demo",
    lead: "Preview only. The lead section on the site is unchanged. The account and the customer are sample data, and nothing is sent.",
    legend: "Sidebar icons, in the sketch order. The window itself has no names.",
    widths: "The same window at 320, 375, 390 and 430.",
    phone: "On a narrow screen the window uses the available width.",
    demo: "Demo",
    account: "Sample studio",
    leadTitle: "New lead",
    leadBody: "Claire Bennett just arrived from a Meta ad.",
    source: "Meta",
    fresh: "Now",
    crmTitle: "Customer card",
    name: "Claire Bennett",
    status: "New lead",
    phoneLabel: "050-000-0148",
    note: "Sample enquiry. Not a real customer.",
    openWa: "WhatsApp",
    openTask: "Task",
    openMeet: "Meeting",
    waTitle: "Conversation",
    waIn: "Hi, I saw the ad and would like details.",
    waOut: "Hi Claire, thanks for writing. Happy to help.",
    waSaved: "Saved in the demo. Not sent.",
    taskTitle: "Follow-up task",
    taskBody: "Call Claire Bennett back",
    taskWhen: "Tomorrow · 10:00",
    taskState: "Created in the demo",
    meetTitle: "Calendar",
    meetWhen: "Tomorrow",
    free: "Open",
    meetName: "Intro call",
    meetSaved: "The meeting is booked in the demo.",
    autoTitle: "Automations",
    autoNew: "+ New automation",
    steps: ["New lead received", "WhatsApp message sent", "Follow-up task created", "Meeting booked"],
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    full: "Full screen",
    exit: "Exit full screen",
    progress: "Demo progress",
    rail: "System menu",
    quiet: "This demo is silent",
  },
} as const;

type Copy = (typeof COPY)["he"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function SceneIcon({ scene, size = 16 }: { scene: MobileDemoSceneId; size?: number }) {
  const key = MOBILE_DEMO_SCENES.find((item) => item.id === scene)?.rail || "dashboard";
  const spec = MOBILE_DEMO_RAIL.find((item) => item.key === key) || MOBILE_DEMO_RAIL[0];
  const Icon = ICONS[spec.icon];
  return <Icon size={size} strokeWidth={2} aria-hidden="true" />;
}

function SceneView({ scene, local, copy, motion }: { scene: MobileDemoSceneId; local: number; copy: Copy; motion: boolean }) {
  if (scene === "lead") {
    return (
      <div className={motion ? "mdsk-scene is-motion" : "mdsk-scene"}>
        <div className="mdsk-head">
          <h2><SceneIcon scene="lead" />{copy.account}</h2>
        </div>
        <article className="mdsk-card">
          <div className="mdsk-row">
            <h3>{copy.leadTitle}</h3>
            <span className="mdsk-badge">{copy.fresh}</span>
          </div>
          <p className="mdsk-meta">{copy.name} · {copy.source}</p>
          <p className="mdsk-note">{copy.leadBody}</p>
        </article>
      </div>
    );
  }
  if (scene === "crm") {
    return (
      <div className={motion ? "mdsk-scene is-motion" : "mdsk-scene"}>
        <div className="mdsk-head">
          <h2><SceneIcon scene="crm" />{copy.crmTitle}</h2>
          <span className="mdsk-badge is-blue">{copy.source}</span>
        </div>
        <article className="mdsk-card">
          <h3>{copy.name}</h3>
          <p className="mdsk-meta"><span className="mdsk-badge">{copy.status}</span></p>
          <p className="mdsk-meta">{copy.phoneLabel}</p>
          <p className="mdsk-note">{copy.note}</p>
        </article>
        <div className="mdsk-actions">
          <span className="mdsk-btn is-line">{copy.openWa}</span>
          <span className="mdsk-btn is-line">{copy.openTask}</span>
          <span className="mdsk-btn is-line">{copy.openMeet}</span>
        </div>
      </div>
    );
  }
  if (scene === "whatsapp") {
    const sent = local > 0.42;
    return (
      <div className={motion ? "mdsk-scene is-motion" : "mdsk-scene"}>
        <div className="mdsk-head">
          <h2><SceneIcon scene="whatsapp" />{copy.waTitle}</h2>
          <span className="mdsk-badge">{copy.name}</span>
        </div>
        <div className="mdsk-thread">
          <p className="mdsk-bubble is-in">{copy.waIn}</p>
          <p className={sent ? "mdsk-bubble is-out is-show" : "mdsk-bubble is-out is-wait"}>{copy.waOut}</p>
        </div>
        <p className="mdsk-note">{copy.waSaved}</p>
      </div>
    );
  }
  if (scene === "task") {
    const done = local > 0.4;
    return (
      <div className={motion ? "mdsk-scene is-motion" : "mdsk-scene"}>
        <div className="mdsk-head">
          <h2><ClipboardList size={16} aria-hidden="true" />{copy.taskTitle}</h2>
          <span className={done ? "mdsk-badge is-green" : "mdsk-badge"}>{copy.taskState}</span>
        </div>
        <article className="mdsk-card">
          <div className="mdsk-task">
            <span className={done ? "mdsk-check is-on" : "mdsk-check"}>{done ? <Check size={14} strokeWidth={3} aria-hidden="true" /> : null}</span>
            <div>
              <h3>{copy.taskBody}</h3>
              <p className="mdsk-meta">{copy.taskWhen}</p>
              <p className="mdsk-note">{copy.name}</p>
            </div>
          </div>
        </article>
      </div>
    );
  }
  if (scene === "meeting") {
    const booked = local > 0.38;
    return (
      <div className={motion ? "mdsk-scene is-motion" : "mdsk-scene"}>
        <div className="mdsk-head">
          <h2><CalendarDays size={16} aria-hidden="true" />{copy.meetTitle}</h2>
          <span className="mdsk-badge is-blue">{copy.meetWhen}</span>
        </div>
        <ul className="mdsk-slots">
          <li><span>09:00</span><span>{copy.free}</span></li>
          <li className={booked ? "is-on" : undefined}><span>11:00</span><span>{booked ? copy.meetName : copy.free}</span></li>
          <li><span>13:00</span><span>{copy.free}</span></li>
        </ul>
        <p className="mdsk-note">{booked ? copy.meetSaved : copy.note}</p>
      </div>
    );
  }
  const glyphs = [UserPlus, MessageCircle, ClipboardList, CalendarDays];
  return (
    <div className={motion ? "mdsk-scene is-motion" : "mdsk-scene"}>
      <div className="mdsk-head">
        <h2><SceneIcon scene="automations" />{copy.autoTitle}</h2>
        <span className="mdsk-btn">{copy.autoNew}</span>
      </div>
      <div className="mdsk-flow">
        {copy.steps.map((label, index) => {
          const Glyph = glyphs[index];
          const on = local >= (index + 0.15) / copy.steps.length;
          return (
            <div key={label}>
              {index > 0 ? <div className="mdsk-link" aria-hidden="true" /> : null}
              <article className={on ? "mdsk-step" : "mdsk-step is-wait"}>
                <span className={index === 1 ? "mdsk-glyph is-wa" : "mdsk-glyph"}><Glyph size={18} aria-hidden="true" /></span>
                <strong>{label}</strong>
                <span className={on ? "mdsk-ok is-on" : "mdsk-ok"}>{on ? <Check size={13} strokeWidth={3} aria-hidden="true" /> : null}</span>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const RECORDING_SRC = "/recordings/bizuply-mobile-demo.mp4";

/** When each real module becomes visible, so the sketch icon matches the screen. */
const RECORDING_RAIL: { at: number; rail: (typeof MOBILE_DEMO_RAIL)[number]["key"] }[] = [
  { at: 0, rail: "dashboard" },
  { at: 6.1, rail: "crm" },
  { at: 12.5, rail: "automations" },
  { at: 19.1, rail: "whatsapp" },
  { at: 25.2, rail: "meta" },
  { at: 31.0, rail: "collab" },
  { at: 35.2, rail: "advisor" },
  { at: 39.4, rail: "edit" },
  { at: 43.6, rail: "profile" },
  { at: 47.8, rail: "build" },
  { at: 52.4, rail: "security" },
  { at: 56.2, rail: "billing" },
  { at: 60.2, rail: "help" },
];

function railAt(time: number) {
  let rail = RECORDING_RAIL[0].rail;
  for (const cue of RECORDING_RAIL) {
    if (time + 0.05 >= cue.at) rail = cue.rail;
  }
  return rail;
}

function DemoPlayer({ copy, he, poster }: { copy: Copy; he: boolean; poster: boolean }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manual, setManual] = useState<"play" | "pause" | null>(null);
  const [inView, setInView] = useState(false);
  const [time, setTime] = useState(0);
  const playing = inView && (manual === "play" || (manual == null && !poster && !reduced));

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return undefined;
    node.muted = true;
    if (playing) {
      const pending = node.play();
      if (pending) pending.catch(() => setManual("pause"));
    } else {
      node.pause();
    }
    return undefined;
  }, [playing]);

  const active = railAt(time);

  return (
    <div className="mdsk-demo" ref={rootRef} data-playing={playing ? "true" : "false"} data-reduced={reduced ? "true" : "false"}>
      <div className="mdsk-window">
        <div className="mdsk-chrome">
          <span className="mdsk-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mdsk-url"><Lock size={11} aria-hidden="true" /><span>app.bizuply.com</span></span>
          <RefreshCw size={13} aria-hidden="true" />
        </div>
        <header className="mdsk-top" dir={he ? "rtl" : "ltr"}>
          <div className="mdsk-brand">
            <img src="/logo-mark.svg" alt="BizUply" />
          </div>
          <div className="mdsk-tools" aria-hidden="true">
            <Search size={16} />
            <Bell size={16} />
            <span className="mdsk-avatar">B</span>
          </div>
        </header>
        <div className="mdsk-app">
          <nav className="mdsk-rail" aria-label={copy.rail}>
            {MOBILE_DEMO_RAIL.map((item) => {
              const Icon = ICONS[item.icon];
              const current = item.key === active;
              return (
                <span key={item.key} aria-label={he ? item.he : item.en} aria-current={current ? "true" : undefined}>
                  <Icon size={18} strokeWidth={current ? 2.25 : 2} aria-hidden="true" />
                </span>
              );
            })}
          </nav>
          <div className="mdsk-main is-film" dir={he ? "rtl" : "ltr"}>
            <div className="mdsk-film">
              <video
                ref={videoRef}
                src={RECORDING_SRC}
                playsInline
                loop
                muted
                preload="auto"
                onTimeUpdate={(event) => setTime(event.currentTarget.currentTime || 0)}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mdsk-toggle"
          aria-pressed={playing}
          onClick={() => setManual(playing ? "pause" : "play")}
        >
          {playing ? copy.pause : copy.play}
        </button>
      </div>
    </div>
  );
}

export function MobileDemoRecording() {
  const { i18n } = useTranslation();
  const he = (i18n.language || "he").toLowerCase().startsWith("he");
  const copy = he ? COPY.he : COPY.en;
  return (
    <div className="mdsk-embed" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <DemoPlayer copy={copy} he={he} poster={false} />
    </div>
  );
}

export default function MobileDemoSketch() {
  const { i18n } = useTranslation();
  const he = (i18n.language || "he").toLowerCase().startsWith("he");
  const copy = he ? COPY.he : COPY.en;
  return (
    <div className="mdsk-page" dir={he ? "rtl" : "ltr"} lang={he ? "he" : "en"}>
      <Helmet>
        <title>{copy.title} | BizUply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mdsk-wrap">
        <p className="mdsk-kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p className="mdsk-lead">{copy.lead}</p>
        <p className="mdsk-lead">{copy.legend}</p>
        <ol className="mdsk-legend">
          {MOBILE_DEMO_RAIL.map((item, index) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.key}>
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                <span>{index + 1}. {he ? item.he : item.en}</span>
              </li>
            );
          })}
        </ol>
        <div className="mdsk-live">
          <p className="mdsk-lead">{copy.phone}</p>
          <DemoPlayer copy={copy} he={he} poster={false} />
        </div>
        <div className="mdsk-board">
          <p className="mdsk-lead">{copy.widths}</p>
          {MOBILE_DEMO_WIDTHS.map((width) => (
            <figure className="mdsk-frame" style={{ ["--w" as string]: `${width}px` }} key={width}>
              <figcaption>{width}px</figcaption>
              <DemoPlayer copy={copy} he={he} poster={width !== 390} />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
