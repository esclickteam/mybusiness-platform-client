import { useEffect, useRef, useState } from "react";

type TextFn = (hebrew: string, english: string) => string;

type Mode = "crm" | "wa" | "auto";

const FILMS: Record<Mode, { src: string; poster: string }> = {
  crm: { src: "/demo-media/home/crm.mp4", poster: "/demo-media/home/crm.jpg" },
  wa: { src: "/demo-media/home/whatsapp.mp4", poster: "/demo-media/home/whatsapp.jpg" },
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

export function HeroProductStage({ text, label }: { text: TextFn; label: string }) {
  const reduced = useReduced();
  const [mode, setMode] = useState<Mode>("crm");
  const [panelKey, setPanelKey] = useState(0);
  const filmRef = useRef<HTMLVideoElement | null>(null);
  const pauseRotate = useRef(false);

  const copy: Record<
    Mode,
    {
      title: string;
      live: string;
      caption: string;
      filmLabel: string;
      kicker: string;
      name: string;
      body: string;
      pills: Array<[string, string]>;
    }
  > = {
    crm: {
      title: text("CRM · לידים", "CRM · Leads"),
      live: text("ליד חדש התקבל", "New lead received"),
      caption: text(
        "ליד חדש נכנס לרשימה — במבט גדול וקריא, לא דשבורד שלם.",
        "A new lead enters the list — large and readable, not a full dashboard.",
      ),
      filmLabel: text("הקלטת מסך ממוקדת · CRM", "Focused screen recording · CRM"),
      kicker: text("כרטיס לקוח", "Customer record"),
      name: text("תומר שפירא", "Tomer Shapira"),
      body: text("מקור: WhatsApp Business API", "Source: WhatsApp Business API"),
      pills: [
        [text("חדש", "New"), ""],
        [text("משימה ממתינה", "Pending task"), "blue"],
      ],
    },
    wa: {
      title: text("WhatsApp · שיחה", "WhatsApp · Chat"),
      live: text("השיחה ממשיכה במערכת", "Conversation continues in the system"),
      caption: text(
        "אותו לקוח ממשיך בשיחה — טקסט גדול, בלי חיתוך מסך רחב.",
        "The same customer continues in chat — large text, no wide-screen crop.",
      ),
      filmLabel: text("הקלטת מסך ממוקדת · WhatsApp", "Focused screen recording · WhatsApp"),
      kicker: text("שיחה פעילה", "Active chat"),
      name: text("תומר שפירא", "Tomer Shapira"),
      body: text("תבנית מאושרת · חלון שירות פתוח", "Approved template · open service window"),
      pills: [
        [text("בשיחה", "In chat"), "green"],
        [text("מקושר ל־CRM", "Linked to CRM"), "blue"],
      ],
    },
    auto: {
      title: text("אוטומציות · תהליך", "Automations · Flow"),
      live: text("פעולה נוצרה אוטומטית", "Action created automatically"),
      caption: text(
        "מאירוע עסקי לפעולה: פנייה → משימה → עדכון סטטוס.",
        "From business event to action: enquiry → task → status update.",
      ),
      filmLabel: text("הקלטת מסך ממוקדת · אוטומציות", "Focused screen recording · Automations"),
      kicker: text("תוצאת האוטומציה", "Automation result"),
      name: text("משימת המשך נוצרה", "Follow-up task created"),
      body: text("שיחת חזרה · משויכת לתומר שפירא", "Callback · assigned to Tomer Shapira"),
      pills: [
        [text("פעיל", "Active"), "green"],
        [text("CRM עודכן", "CRM updated"), "blue"],
      ],
    },
  };

  const cfg = copy[mode];

  useEffect(() => {
    const video = filmRef.current;
    if (!video || reduced) return;
    video.play().catch(() => undefined);
  }, [mode, reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    const order: Mode[] = ["crm", "wa", "auto"];
    const timer = window.setInterval(() => {
      if (pauseRotate.current) return;
      setMode((current) => {
        const next = order[(order.indexOf(current) + 1) % order.length];
        setPanelKey((value) => value + 1);
        return next;
      });
    }, 5600);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const show = (next: Mode) => {
    pauseRotate.current = true;
    setMode(next);
    setPanelKey((value) => value + 1);
    window.setTimeout(() => {
      pauseRotate.current = false;
    }, 9000);
  };

  return (
    <div className={`b2-stage is-${mode}`} aria-label={label}>
      <div className="b2-stage-canvas">
        <div className="b2-stage-glow" aria-hidden="true" />
        <div className="b2-stage-main">
          <div className="b2-stage-chrome">
            <i /><i /><i />
            <strong>{cfg.title}</strong>
            <em>{cfg.live}</em>
          </div>
          <div className="b2-panel is-on" key={`${mode}-${panelKey}`}>
            {mode === "crm" ? (
              <>
                <div className="b2-crm-toolbar" aria-hidden="true">
                  <span>{text("היום", "Today")}</span>
                  <span>{text("מקור · הכל", "Source · All")}</span>
                  <strong>{text("4 פתוחים", "4 open")}</strong>
                </div>
                <div className="b2-lead is-live">
                  <b><i className="b2-pulse" aria-hidden="true" />{text("תומר שפירא", "Tomer Shapira")}</b>
                  <span>WhatsApp</span>
                  <em className="b2-pill">{text("חדש", "New")}</em>
                </div>
                <div className="b2-lead">
                  <b>{text("מיכל שחר", "Michal Shahar")}</b>
                  <span>{text("אתר", "Website")}</span>
                  <em className="b2-pill blue">{text("בטיפול", "In progress")}</em>
                </div>
                <div className="b2-lead">
                  <b>{text("נועה כהן", "Noa Cohen")}</b>
                  <span>{text("קמפיין", "Campaign")}</span>
                  <em className="b2-pill">{text("משימה", "Task")}</em>
                </div>
                <div className="b2-lead">
                  <b>{text("איתי לוי", "Itay Levi")}</b>
                  <span>{text("המלצה", "Referral")}</span>
                  <em className="b2-pill green">{text("נסגר", "Closed")}</em>
                </div>
              </>
            ) : null}
            {mode === "wa" ? (
              <div className="b2-chat">
                <div className="b2-bubble in">
                  {text("שלום, אשמח לפרטים על השירות", "Hi, I would like details about the service")}
                  <small>{text("תומר · עכשיו", "Tomer · now")}</small>
                </div>
                <div className="b2-bubble out">
                  {text("שמחים שפנית. נציג ממשיך איתך מהמערכת.", "Glad you reached out. A teammate continues from the system.")}
                  <small>{text("BizUply · נשלח", "BizUply · sent")}</small>
                </div>
                <div className="b2-bubble in">
                  {text("מעולה, אפשר גם לקבוע שיחה?", "Great — can we also schedule a call?")}
                  <small>{text("תומר", "Tomer")}</small>
                </div>
              </div>
            ) : null}
            {mode === "auto" ? (
              <ol className="b2-auto-steps">
                <li className="is-on">
                  <span className="b2-num">1</span>
                  <div>
                    <strong>{text("פנייה התקבלה", "Enquiry received")}</strong>
                    <span>{text("ליד חדש מ־WhatsApp נכנס ל־CRM", "A new WhatsApp lead enters CRM")}</span>
                  </div>
                </li>
                <li className="is-on">
                  <span className="b2-num">2</span>
                  <div>
                    <strong>{text("נוצרת משימת המשך", "Follow-up task created")}</strong>
                    <span>{text("שיחת חזרה מתוזמנת לצוות", "A callback is scheduled for the team")}</span>
                  </div>
                </li>
                <li className="is-on">
                  <span className="b2-num">3</span>
                  <div>
                    <strong>{text("הסטטוס מתעדכן", "Status updates")}</strong>
                    <span>{text("אותו לקוח עובר ל־בטיפול", "The same customer moves to In progress")}</span>
                  </div>
                </li>
              </ol>
            ) : null}
          </div>
        </div>

        <aside className="b2-float" aria-live="polite">
          <p className="b2-kicker">{cfg.kicker}</p>
          <strong>{cfg.name}</strong>
          <span>{cfg.body}</span>
          <div className="b2-float-row">
            {cfg.pills.map(([labelText, tone]) => (
              <em key={labelText} className={`b2-pill${tone ? ` ${tone}` : ""}`}>{labelText}</em>
            ))}
          </div>
        </aside>

        <div className="b2-side" aria-hidden="true">
          <video
            ref={filmRef}
            key={FILMS[mode].src}
            src={FILMS[mode].src}
            poster={FILMS[mode].poster}
            muted
            playsInline
            loop
            autoPlay={!reduced}
          />
          <p>{cfg.filmLabel}</p>
        </div>
      </div>

      <div className="b2-tabs" role="tablist" aria-label={text("מעבר בין מוצרים", "Switch products")}>
        {(
          [
            ["crm", "CRM"],
            ["wa", "WhatsApp"],
            ["auto", text("אוטומציות", "Automations")],
          ] as const
        ).map(([key, labelText]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            className={mode === key ? "is-on" : undefined}
            onClick={() => show(key)}
          >
            {labelText}
          </button>
        ))}
      </div>
      <p className="b2-caption">{cfg.caption}</p>
    </div>
  );
}

type FlowStep = "message" | "crm" | "auto";

export function WhatsAppFlowStage({ text }: { text: TextFn }) {
  const reduced = useReduced();
  const [step, setStep] = useState<FlowStep>("message");
  const [live, setLive] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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
      { threshold: 0.28 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live || reduced) return undefined;
    const order: FlowStep[] = ["message", "crm", "auto"];
    const timer = window.setInterval(() => {
      setStep((current) => order[(order.indexOf(current) + 1) % order.length]);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [live, reduced]);

  const steps: Array<{ key: FlowStep; label: string; body: string }> = [
    {
      key: "message",
      label: text("1 · הודעה", "1 · Message"),
      body: text("נכנסת לתיבה העסקית", "Enters the business inbox"),
    },
    {
      key: "crm",
      label: text("2 · CRM", "2 · CRM"),
      body: text("כרטיס לקוח מתעדכן", "Customer record updates"),
    },
    {
      key: "auto",
      label: text("3 · אוטומציה", "3 · Automation"),
      body: text("נוצרת משימת המשך", "Follow-up task is created"),
    },
  ];

  return (
    <div className={`b2-wa-flow${live ? " is-live" : ""} is-${step}`} ref={rootRef}>
      <div className="b2-wa-steps" role="tablist" aria-label={text("תהליך WhatsApp → CRM", "WhatsApp → CRM flow")}>
        {steps.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={step === item.key}
            className={step === item.key ? "is-on" : undefined}
            onClick={() => setStep(item.key)}
          >
            <strong>{item.label}</strong>
            <span>{item.body}</span>
          </button>
        ))}
      </div>

      <div className="b2-wa-stage" aria-live="polite">
        <div className={`b2-wa-layer b2-wa-phone${step === "message" ? " is-focus" : ""}`}>
          <div className="pm-phone" aria-hidden="true">
            <div className="pm-phone-notch" />
            <div className="pm-phone-screen">
              <header>
                <strong>Northwind</strong>
                <span>{text("מחובר", "Online")}</span>
              </header>
              <div className="pm-chat">
                <p className="pm-bubble is-in">{text("שלום, אשמח לפרטים על השירות", "Hi, I would like details about the service")}</p>
                <p className="pm-bubble is-out">{text("שמחים שפנית. נציג ממשיך איתך עכשיו.", "Glad you reached out. A teammate will continue with you.")}</p>
                <p className="pm-bubble is-in">{text("מעולה, תודה", "Great, thank you")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`b2-wa-layer b2-wa-inbox${step === "message" || step === "crm" ? " is-focus" : ""}`}>
          <div className="pm-inbox" dir="auto">
            <header>
              <strong>WhatsApp</strong>
              <span>{text("תיבה עסקית", "Business inbox")}</span>
            </header>
            <ul>
              <li className="is-on">
                <b>{text("תומר שפירא", "Tomer Shapira")}</b>
                <span>{text("אשמח לפרטים על השירות", "I would like details about the service")}</span>
              </li>
              <li>
                <b>{text("אמה וילסון", "Emma Wilson")}</b>
                <span>{text("יום חמישי ב-10:00 נרשם ביומן", "Thursday at 10:00 is on the calendar")}</span>
              </li>
              <li>
                <b>{text("סופיה מיטשל", "Sophia Mitchell")}</b>
                <span>{text("בוקר חמישי מתאים?", "Does Thursday morning work?")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`b2-wa-layer b2-wa-crm${step === "crm" || step === "auto" ? " is-focus" : ""}`}>
          <div className="pm-crm" dir="auto">
            <p className="pm-kicker">{text("כרטיס לקוח", "Customer record")}</p>
            <strong>{text("תומר שפירא", "Tomer Shapira")}</strong>
            <span>{text("מקור: WhatsApp Business API", "Source: WhatsApp Business API")}</span>
            <div className="pm-crm-row">
              <em className="pm-pill pm-pill-work">{step === "auto" ? text("בטיפול", "In progress") : text("חדש", "New")}</em>
              <em className="pm-task">
                {step === "auto"
                  ? text("משימה: שיחת המשך", "Task: follow-up call")
                  : text("ממתין לעדכון", "Awaiting update")}
              </em>
            </div>
          </div>
        </div>

        <div className={`b2-wa-layer b2-wa-film${step === "auto" ? " is-focus" : ""}`} aria-hidden="true">
          <video
            key={step}
            src={
              step === "message"
                ? "/demo-media/home/whatsapp.mp4"
                : step === "crm"
                  ? "/demo-media/home/crm.mp4"
                  : "/demo-media/home/automations.mp4"
            }
            poster={
              step === "message"
                ? "/demo-media/home/whatsapp.jpg"
                : step === "crm"
                  ? "/demo-media/home/crm.jpg"
                  : "/demo-media/home/automations.jpg"
            }
            muted
            playsInline
            loop
            autoPlay={!reduced}
          />
          <p>
            {step === "message"
              ? text("הקלטה · הודעה נכנסת", "Recording · incoming message")
              : step === "crm"
                ? text("הקלטה · כרטיס ב־CRM", "Recording · CRM record")
                : text("הקלטה · אוטומציה", "Recording · automation")}
          </p>
        </div>
      </div>
    </div>
  );
}
