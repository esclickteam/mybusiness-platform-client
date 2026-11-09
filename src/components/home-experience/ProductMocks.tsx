/** Focused product illustrations for the homepage — demo data only, not live accounts. */

type TextFn = (hebrew: string, english: string) => string;

export function LeadBoard({ text }: { text: TextFn }) {
  const rows = [
    ["מיכל שחר", "אתר", "חדש", "Michal Shahar", "Website", "New"],
    ["תומר שפירא", "WhatsApp", "בטיפול", "Tomer Shapira", "WhatsApp", "In progress"],
    ["נועה כהן", "קמפיין", "משימה", "Noa Cohen", "Campaign", "Task"],
  ] as const;
  return (
    <div className="pm-board" dir="auto">
      <header className="pm-board-head">
        <strong>{text("לידים", "Leads")}</strong>
        <span>{text("היום", "Today")}</span>
      </header>
      <ul className="pm-board-list">
        {rows.map(([heName, heSrc, heStatus, enName, enSrc, enStatus]) => (
          <li key={enName}>
            <b>{text(heName, enName)}</b>
            <em>{text(heSrc, enSrc)}</em>
            <span className={`pm-pill pm-pill-${heStatus === "חדש" || heStatus === "New" ? "new" : "work"}`}>
              {text(heStatus, enStatus)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WaPhone({ text }: { text: TextFn }) {
  return (
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
  );
}

export function InboxPane({ text }: { text: TextFn }) {
  const threads = [
    ["אמה וילסון", "יום חמישי ב-10:00 נרשם.", "Emma Wilson", "Thursday at 10:00 is booked."],
    ["סופיה מיטשל", "בוקר חמישי מתאים?", "Sophia Mitchell", "Does Thursday morning work?"],
    ["אוליביה בנט", "ההצעה מוכנה.", "Olivia Bennett", "The proposal is ready."],
  ] as const;
  return (
    <div className="pm-inbox" dir="auto">
      <header>
        <strong>WhatsApp</strong>
        <span>{text("תיבה עסקית", "Business inbox")}</span>
      </header>
      <ul>
        {threads.map(([heName, heLine, enName, enLine]) => (
          <li key={enName}>
            <b>{text(heName, enName)}</b>
            <span>{text(heLine, enLine)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CrmCard({ text }: { text: TextFn }) {
  return (
    <div className="pm-crm" dir="auto">
      <p className="pm-kicker">{text("כרטיס לקוח", "Customer record")}</p>
      <strong>{text("תומר שפירא", "Tomer Shapira")}</strong>
      <span>{text("מקור: WhatsApp Business API", "Source: WhatsApp Business API")}</span>
      <div className="pm-crm-row">
        <em className="pm-pill pm-pill-work">{text("בטיפול", "In progress")}</em>
        <em className="pm-task">{text("משימה: שיחת המשך", "Task: follow-up call")}</em>
      </div>
    </div>
  );
}

export function PipelineStrip({ text }: { text: TextFn }) {
  const steps = [
    text("פנייה", "Enquiry"),
    "CRM",
    "WhatsApp",
    text("משימה", "Task"),
  ];
  return (
    <ol className="pm-pipe" aria-hidden="true">
      {steps.map((label, index) => (
        <li key={label} className={index < 3 ? "is-on" : undefined}>
          <i />
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

export function CampaignPulse({ text }: { text: TextFn }) {
  return (
    <div className="pm-camp" dir="auto">
      <header>
        <strong>{text("קמפיין Meta", "Meta campaign")}</strong>
        <span>{text("פעיל", "Live")}</span>
      </header>
      <div className="pm-camp-bars" aria-hidden="true">
        <i style={{ height: "42%" }} />
        <i style={{ height: "68%" }} />
        <i style={{ height: "55%" }} />
        <i style={{ height: "86%" }} />
        <i style={{ height: "74%" }} />
      </div>
      <p>{text("ליד חדש נכנס להמשך טיפול ב־CRM", "A new lead continues into CRM follow-up")}</p>
    </div>
  );
}

export function StudioFrame({
  src,
  mobileSrc,
  label,
  mode,
}: {
  src: string;
  /** Optional dedicated mobile hero — avoids stretching a desktop full-page shot. */
  mobileSrc?: string;
  label: string;
  mode: "desktop" | "mobile";
}) {
  const image = mode === "mobile" && mobileSrc ? mobileSrc : src;
  return (
    <figure className={`pm-site pm-site-${mode}`}>
      {mode === "desktop" ? (
        <div className="pm-site-chrome" aria-hidden="true">
          <span /><span /><span />
          <em>{label}</em>
        </div>
      ) : (
        <div className="pm-site-notch" aria-hidden="true" />
      )}
      <div className="pm-site-view">
        <img
          src={image}
          alt=""
          width={mode === "desktop" ? 1920 : 780}
          height={mode === "desktop" ? 1200 : 1600}
          loading="lazy"
          decoding="async"
        />
      </div>
    </figure>
  );
}
