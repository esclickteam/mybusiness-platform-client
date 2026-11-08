import { useEffect, useRef, useState } from "react";

type TextFn = (hebrew: string, english: string) => string;

type HeroStep = "lead" | "crm" | "wa" | "auto" | "task";
type WaStep = "message" | "crm" | "auto";

const HERO_FILMS: Record<HeroStep, { src: string; poster: string }> = {
  lead: { src: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg" },
  crm: { src: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg" },
  wa: { src: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg" },
  auto: { src: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg" },
  task: { src: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg" },
};

const WA_FILMS: Record<WaStep, { src: string; poster: string }> = {
  message: { src: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg" },
  crm: { src: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg" },
  auto: { src: "/demo-media/home/automations.mp4", poster: "/demo-media/home/automations.jpg" },
};

function useReduced() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 900px)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const apply = () => setNarrow(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return narrow;
}

export function HeroProductStage({
  text,
  label,
  onWatchDemo,
}: {
  text: TextFn;
  label: string;
  onWatchDemo?: (step: HeroStep) => void;
}) {
  const reduced = useReduced();
  const narrow = useNarrow();
  const [step, setStep] = useState<HeroStep>("lead");
  const [paused, setPaused] = useState(false);
  const filmRef = useRef<HTMLVideoElement | null>(null);

  const steps: Array<{
    key: HeroStep;
    short: string;
    title: string;
    status: string;
    detail: string;
  }> = [
    {
      key: "lead",
      short: text("ליד", "Lead"),
      title: text("ליד חדש נכנס", "New lead arrives"),
      status: text("תומר שפירא · מקור WhatsApp", "Tomer Shapira · WhatsApp source"),
      detail: text("פנייה חדשה מופיעה ברשימת הלידים.", "A new enquiry appears in the lead list."),
    },
    {
      key: "crm",
      short: "CRM",
      title: text("כרטיס לקוח ב־CRM", "Customer record in CRM"),
      status: text("סטטוס: חדש · ממתין לטיפול", "Status: New · awaiting follow-up"),
      detail: text("אותה פנייה נשמרת כרשומת לקוח.", "The same enquiry is saved as a customer record."),
    },
    {
      key: "wa",
      short: "WhatsApp",
      title: text("הודעת WhatsApp", "WhatsApp message"),
      status: text("השיחה ממשיכה בתיבה העסקית", "Conversation continues in the inbox"),
      detail: text("הודעה והמשך טיפול באותו לקוח.", "Message and follow-up for the same customer."),
    },
    {
      key: "auto",
      short: text("אוטומציה", "Auto"),
      title: text("אוטומציה מופעלת", "Automation runs"),
      status: text("תהליך: פנייה → משימה", "Flow: enquiry → task"),
      detail: text("המערכת מריצה תהליך מוגדר מראש.", "The system runs a predefined flow."),
    },
    {
      key: "task",
      short: text("משימה", "Task"),
      title: text("משימת מעקב נוצרה", "Follow-up task created"),
      status: text("שיחת חזרה · משויכת לצוות", "Callback · assigned to the team"),
      detail: text("הצעד הבא מוכן לעבודה.", "The next step is ready to work."),
    },
  ];

  const current = steps.find((item) => item.key === step) || steps[0];
  const film = HERO_FILMS[step];
  const activeIndex = steps.findIndex((item) => item.key === step);

  useEffect(() => {
    const video = filmRef.current;
    if (!video || reduced) return;
    video.currentTime = 0;
    video.play().catch(() => undefined);
  }, [step, reduced]);

  useEffect(() => {
    if (reduced || paused) return undefined;
    const order = steps.map((item) => item.key);
    const timer = window.setInterval(() => {
      setStep((currentStep) => order[(order.indexOf(currentStep) + 1) % order.length]);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused, reduced, steps.length]);

  const select = (next: HeroStep) => {
    setPaused(true);
    setStep(next);
    window.setTimeout(() => setPaused(false), 10000);
  };

  return (
    <div className={`b2-journey is-${step}${narrow ? " is-mobile" : ""}`} aria-label={label}>
      <ol className="b2-journey-rail" aria-label={text("תהליך עסקי", "Business flow")}>
        {steps.map((item, index) => (
          <li key={item.key} className={index <= activeIndex ? "is-done" : undefined}>
            <button
              type="button"
              className={step === item.key ? "is-on" : undefined}
              aria-current={step === item.key ? "step" : undefined}
              onClick={() => select(item.key)}
            >
              <span className="b2-journey-num">{index + 1}</span>
              <span className="b2-journey-label">{item.short}</span>
            </button>
            {index < steps.length - 1 ? <i className="b2-journey-link" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>

      <div className="b2-theater" key={step}>
        <header className="b2-theater-chrome">
          <div className="b2-theater-dots" aria-hidden="true"><i /><i /><i /></div>
          <strong>{current.title}</strong>
          <em>{text("הקלטת מסך מערכת · נתוני דמו", "System screen recording · demo data")}</em>
        </header>

        <div className="b2-theater-screen">
          <video
            ref={filmRef}
            className="b2-theater-film"
            src={film.src}
            poster={film.poster}
            muted
            playsInline
            loop
            autoPlay={!reduced}
            aria-label={current.title}
          />
        </div>
        <div className="b2-theater-status">
          <p className="b2-theater-kicker">{text("שלב פעיל", "Active step")}</p>
          <p className="b2-theater-title">{current.status}</p>
          <p className="b2-theater-detail">{current.detail}</p>
        </div>
      </div>

      <div className="b2-journey-actions">
        {onWatchDemo ? (
          <button type="button" className="b2-watch" onClick={() => onWatchDemo(step)}>
            {text("צפו בהדגמת המערכת", "Watch the system demo")}
          </button>
        ) : null}
        <p className="b2-caption">
          {text(
            "ליד חדש ← CRM ← WhatsApp ← אוטומציה ← משימת מעקב",
            "New lead ← CRM ← WhatsApp ← Automation ← Follow-up task",
          )}
        </p>
      </div>
    </div>
  );
}

export function WhatsAppFlowStage({
  text,
  onWatchDemo,
}: {
  text: TextFn;
  onWatchDemo?: (step: WaStep) => void;
}) {
  const reduced = useReduced();
  const narrow = useNarrow();
  const [step, setStep] = useState<WaStep>("message");
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const filmRef = useRef<HTMLVideoElement | null>(null);

  const steps: Array<{ key: WaStep; label: string; result: string }> = [
    {
      key: "message",
      label: text("הודעה נכנסת", "Incoming message"),
      result: text("שיחה נפתחת בתיבה העסקית", "A chat opens in the business inbox"),
    },
    {
      key: "crm",
      label: text("כרטיס לקוח", "Customer record"),
      result: text("אותה פנייה נשמרת ב־CRM", "The same enquiry is saved in CRM"),
    },
    {
      key: "auto",
      label: text("אוטומציה", "Automation"),
      result: text("נוצרת משימת מעקב להמשך", "A follow-up task is created"),
    },
  ];

  const activeIndex = steps.findIndex((item) => item.key === step);
  const current = steps[activeIndex] || steps[0];
  const film = WA_FILMS[step];

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = filmRef.current;
    if (!video || reduced) return;
    video.currentTime = 0;
    video.play().catch(() => undefined);
  }, [step, reduced]);

  useEffect(() => {
    if (!live || reduced || paused) return undefined;
    const order: WaStep[] = ["message", "crm", "auto"];
    const timer = window.setInterval(() => {
      setStep((currentStep) => order[(order.indexOf(currentStep) + 1) % order.length]);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [live, paused, reduced]);

  const select = (next: WaStep) => {
    setPaused(true);
    setStep(next);
    window.setTimeout(() => setPaused(false), 10000);
  };

  return (
    <div className={`b2-wa-journey${live ? " is-live" : ""} is-${step}${narrow ? " is-mobile" : ""}`} ref={rootRef}>
      <div className="b2-wa-path" role="tablist" aria-label={text("תהליך WhatsApp", "WhatsApp flow")}>
        {steps.map((item, index) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={step === item.key}
            className={`${step === item.key ? "is-on" : ""}${index <= activeIndex ? " is-reached" : ""}`}
            onClick={() => select(item.key)}
          >
            <span className="b2-wa-path-num">{index + 1}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
        <div className="b2-wa-path-progress" style={{ ["--wa-p" as string]: String((activeIndex + 1) / steps.length) }} aria-hidden="true" />
      </div>

      <div className="b2-wa-theater" key={step} aria-live="polite">
        <div className="b2-wa-main">
          <video
            ref={filmRef}
            src={film.src}
            poster={film.poster}
            muted
            playsInline
            loop
            autoPlay={!reduced}
            aria-label={current.label}
          />
        </div>

        <div className="b2-wa-bridge" aria-hidden="true">
          <span />
        </div>

        <aside className="b2-wa-aside">
          {step === "message" ? (
            <div className="b2-wa-card b2-wa-card-chat">
              <header>
                <strong>Northwind</strong>
                <span>{text("מחובר", "Online")}</span>
              </header>
              <p className="b2-bubble in">{text("שלום, אשמח לפרטים על השירות", "Hi, I would like details about the service")}</p>
              <p className="b2-bubble out">{text("שמחים שפנית. נציג ממשיך איתך עכשיו.", "Glad you reached out. A teammate will continue with you.")}</p>
            </div>
          ) : null}
          {step === "crm" ? (
            <div className="b2-wa-card b2-wa-card-crm">
              <p className="b2-kicker">{text("כרטיס לקוח", "Customer record")}</p>
              <strong>{text("תומר שפירא", "Tomer Shapira")}</strong>
              <span>{text("מקור: WhatsApp Business API", "Source: WhatsApp Business API")}</span>
              <div className="b2-float-row">
                <em className="b2-pill">{text("חדש", "New")}</em>
                <em className="b2-pill blue">{text("ממתין לעדכון", "Awaiting update")}</em>
              </div>
            </div>
          ) : null}
          {step === "auto" ? (
            <div className="b2-wa-card b2-wa-card-auto">
              <p className="b2-kicker">{text("תוצאת האוטומציה", "Automation result")}</p>
              <strong>{text("משימת מעקב נוצרה", "Follow-up task created")}</strong>
              <span>{text("שיחת חזרה · משויכת לתומר שפירא", "Callback · assigned to Tomer Shapira")}</span>
              <div className="b2-float-row">
                <em className="b2-pill green">{text("פעיל", "Active")}</em>
                <em className="b2-pill blue">{text("CRM עודכן", "CRM updated")}</em>
              </div>
            </div>
          ) : null}
          <p className="b2-wa-result">{current.result}</p>
          {onWatchDemo ? (
            <button type="button" className="b2-watch b2-watch-ink" onClick={() => onWatchDemo(step)}>
              {text("צפו בהקלטת המערכת", "Watch the system recording")}
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
