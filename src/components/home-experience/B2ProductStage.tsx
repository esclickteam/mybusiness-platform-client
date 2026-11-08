import { useEffect, useRef, useState } from "react";

type TextFn = (hebrew: string, english: string) => string;

type HeroStep = "lead" | "crm" | "wa" | "auto" | "task";
type WaStep = "message" | "crm" | "auto";

type FilmRef = { src: string; poster: string; startAt: number };

const FILM_V = "v=7";

const HERO_FILMS_DESKTOP: Record<HeroStep, FilmRef> = {
  lead: {
    src: `/demo-media/home/walkthrough/hero-01-lead.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/hero-01-lead.jpg?${FILM_V}`,
    startAt: 0.08,
  },
  crm: {
    src: `/demo-media/home/walkthrough/hero-02-crm.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/hero-02-crm.jpg?${FILM_V}`,
    startAt: 0.1,
  },
  wa: {
    src: `/demo-media/home/walkthrough/hero-03-whatsapp.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/hero-03-whatsapp.jpg?${FILM_V}`,
    startAt: 0.12,
  },
  auto: {
    src: `/demo-media/home/walkthrough/hero-04-automation.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/hero-04-automation.jpg?${FILM_V}`,
    startAt: 0.1,
  },
  task: {
    src: `/demo-media/home/walkthrough/hero-05-task.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/hero-05-task.jpg?${FILM_V}`,
    startAt: 0.08,
  },
};

const HERO_FILMS_MOBILE: Record<HeroStep, FilmRef> = {
  lead: {
    src: `/demo-media/home/walkthrough/mobile-01-lead.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/mobile-01-lead.jpg?${FILM_V}`,
    startAt: 0.08,
  },
  crm: {
    src: `/demo-media/home/walkthrough/mobile-02-crm.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/mobile-02-crm.jpg?${FILM_V}`,
    startAt: 0.1,
  },
  wa: {
    src: `/demo-media/home/walkthrough/mobile-03-whatsapp.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/mobile-03-whatsapp.jpg?${FILM_V}`,
    startAt: 0.12,
  },
  auto: {
    src: `/demo-media/home/walkthrough/mobile-04-automation.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/mobile-04-automation.jpg?${FILM_V}`,
    startAt: 0.1,
  },
  task: {
    src: `/demo-media/home/walkthrough/mobile-05-task.mp4?${FILM_V}`,
    poster: `/demo-media/home/walkthrough/mobile-05-task.jpg?${FILM_V}`,
    startAt: 0.08,
  },
};

const WA_FILMS_DESKTOP: Record<WaStep, FilmRef> = {
  message: HERO_FILMS_DESKTOP.wa,
  crm: HERO_FILMS_DESKTOP.crm,
  auto: HERO_FILMS_DESKTOP.auto,
};

const WA_FILMS_MOBILE: Record<WaStep, FilmRef> = {
  message: HERO_FILMS_MOBILE.wa,
  crm: HERO_FILMS_MOBILE.crm,
  auto: HERO_FILMS_MOBILE.auto,
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

function seekAndPlay(video: HTMLVideoElement, startAt: number, reduced: boolean) {
  try {
    video.currentTime = startAt;
  } catch {
    /* ignore */
  }
  if (!reduced) video.play().catch(() => undefined);
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
  const [pulse, setPulse] = useState(0);
  const filmRef = useRef<HTMLVideoElement | null>(null);
  const films = narrow ? HERO_FILMS_MOBILE : HERO_FILMS_DESKTOP;

  const steps: Array<{
    key: HeroStep;
    short: string;
    title: string;
    status: string;
    detail: string;
    result: string;
  }> = [
    {
      key: "lead",
      short: text("ליד", "Lead"),
      title: text("ליד חדש נכנס", "New lead arrives"),
      status: text("פנייה חדשה מופיעה ברשימה", "A new enquiry appears in the list"),
      detail: text("שם, טלפון וסטטוס ״חדש״ — מוכנים לטיפול.", "Name, phone, and “New” status — ready to handle."),
      result: text("ליד חדש נשמר במערכת", "New lead saved in the system"),
    },
    {
      key: "crm",
      short: "CRM",
      title: text("כרטיס לקוח ב־CRM", "Customer record in CRM"),
      status: text("אותה פנייה נפתחת ככרטיס מלא", "The same enquiry opens as a full record"),
      detail: text("שיחה, WhatsApp ומשימה — מאותו כרטיס.", "Call, WhatsApp, and task — from the same card."),
      result: text("כרטיס לקוח פתוח לפעולה", "Customer card open for action"),
    },
    {
      key: "wa",
      short: "WhatsApp",
      title: text("הודעת WhatsApp", "WhatsApp message"),
      status: text("השיחה ממשיכה בתיבה העסקית", "Conversation continues in the inbox"),
      detail: text("הודעות נכנסות ויוצאות על אותו לקוח.", "Inbound and outbound messages for the same customer."),
      result: text("שיחה פעילה בתיבה", "Active conversation in the inbox"),
    },
    {
      key: "auto",
      short: text("אוטומציה", "Auto"),
      title: text("אוטומציה מופעלת", "Automation runs"),
      status: text("תהליך: ליד → WhatsApp → מעקב", "Flow: lead → WhatsApp → follow-up"),
      detail: text("המערכת מריצה תהליך מוגדר מראש.", "The system runs a predefined flow."),
      result: text("תהליך אוטומטי רץ", "Automation is running"),
    },
    {
      key: "task",
      short: text("משימה", "Task"),
      title: text("משימת מעקב נוצרה", "Follow-up task created"),
      status: text("הצעד הבא מוכן לצוות", "The next step is ready for the team"),
      detail: text("שיחת חזרה משויכת לאותו ליד.", "A callback task linked to the same lead."),
      result: text("משימת מעקב מוכנה", "Follow-up task ready"),
    },
  ];

  const current = steps.find((item) => item.key === step) || steps[0];
  const film = films[step];
  const activeIndex = steps.findIndex((item) => item.key === step);

  useEffect(() => {
    if (reduced || paused) return undefined;
    const order = steps.map((item) => item.key);
    const timer = window.setInterval(() => {
      setStep((currentStep) => order[(order.indexOf(currentStep) + 1) % order.length]);
      setPulse((value) => value + 1);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused, reduced, steps.length]);

  useEffect(() => {
    setPulse((value) => value + 1);
  }, [step]);

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
          <div className="b2-theater-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <strong>{current.title}</strong>
          <em>{text("הקלטת מסך מערכת · נתוני דמו", "System screen recording · demo data")}</em>
        </header>

        <div className="b2-theater-screen">
          <img className="b2-theater-poster" src={film.poster} alt="" width={1360} height={820} decoding="async" />
          <video
            key={`${step}-${film.src}-${narrow ? "m" : "d"}`}
            ref={filmRef}
            className="b2-theater-film"
            src={film.src}
            poster={film.poster}
            muted
            playsInline
            loop
            preload="auto"
            autoPlay={!reduced}
            aria-label={current.title}
            onLoadedData={(event) => seekAndPlay(event.currentTarget, film.startAt, reduced)}
          />
          <span className="b2-click-pulse" key={pulse} aria-hidden="true" />
          <p className="b2-theater-result">{current.result}</p>
        </div>
        <div className="b2-theater-status">
          <p className="b2-theater-kicker">{text("מה קורה עכשיו", "What happens now")}</p>
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
  const [pulse, setPulse] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const films = narrow ? WA_FILMS_MOBILE : WA_FILMS_DESKTOP;

  const steps: Array<{ key: WaStep; label: string; result: string; change: string }> = [
    {
      key: "message",
      label: text("הודעה נכנסת", "Incoming message"),
      result: text("שיחה נפתחת בתיבה העסקית", "A chat opens in the business inbox"),
      change: text("הודעה חדשה מופיעה בתיבה", "A new message appears in the inbox"),
    },
    {
      key: "crm",
      label: text("כרטיס לקוח", "Customer record"),
      result: text("אותה פנייה נשמרת ב־CRM", "The same enquiry is saved in CRM"),
      change: text("סטטוס הלקוח מתעדכן בכרטיס", "Customer status updates on the card"),
    },
    {
      key: "auto",
      label: text("אוטומציה", "Automation"),
      result: text("נוצרת משימת מעקב להמשך", "A follow-up task is created"),
      change: text("תהליך מופעל ויוצר משימה", "A flow runs and creates a task"),
    },
  ];

  const activeIndex = steps.findIndex((item) => item.key === step);
  const current = steps[activeIndex] || steps[0];
  const film = films[step];

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
    if (!live || reduced || paused) return undefined;
    const order: WaStep[] = ["message", "crm", "auto"];
    const timer = window.setInterval(() => {
      setStep((currentStep) => order[(order.indexOf(currentStep) + 1) % order.length]);
      setPulse((value) => value + 1);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [live, paused, reduced]);

  useEffect(() => {
    setPulse((value) => value + 1);
  }, [step]);

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
        <div className="b2-wa-main" style={{ backgroundImage: `url(${film.poster})` }}>
          {live ? (
            <video
              key={`${step}-${film.src}-${narrow ? "m" : "d"}`}
              src={film.src}
              poster={film.poster}
              muted
              playsInline
              loop
              preload="metadata"
              autoPlay={!reduced}
              aria-label={current.label}
              onLoadedData={(event) => seekAndPlay(event.currentTarget, film.startAt, reduced)}
            />
          ) : (
            <img src={film.poster} alt="" width={1360} height={820} loading="lazy" decoding="async" />
          )}
          <span className="b2-click-pulse" key={pulse} aria-hidden="true" />
          <p className="b2-wa-change">{current.change}</p>
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
              <strong>{text("יעל אברהם", "Yael Avraham")}</strong>
              <span>{text("מקור: WhatsApp Business API", "Source: WhatsApp Business API")}</span>
              <div className="b2-float-row">
                <em className="b2-pill">{text("חדש", "New")}</em>
                <em className="b2-pill blue">{text("סטטוס עודכן", "Status updated")}</em>
              </div>
            </div>
          ) : null}
          {step === "auto" ? (
            <div className="b2-wa-card b2-wa-card-auto">
              <p className="b2-kicker">{text("תוצאת האוטומציה", "Automation result")}</p>
              <strong>{text("משימת מעקב נוצרה", "Follow-up task created")}</strong>
              <span>{text("שיחת חזרה · משויכת ליעל אברהם", "Callback · assigned to Yael Avraham")}</span>
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
