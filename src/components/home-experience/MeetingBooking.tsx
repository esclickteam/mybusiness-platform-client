import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./meetingBooking.css";

const DAYS = [
  { id: "19", he: "א׳", en: "Sun" },
  { id: "20", he: "ב׳", en: "Mon" },
  { id: "21", he: "ג׳", en: "Tue" },
  { id: "22", he: "ד׳", en: "Wed" },
  { id: "23", he: "ה׳", en: "Thu" },
];
const TIMES = ["10:00", "11:30", "14:00", "15:00", "16:00"];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v4.5l3 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13 2.5L5.5 13.5H11l-1 8 8.5-12H13l0-7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 19.5c.8-3.4 3.2-5 7-5s6.2 1.6 7 5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={direction === "prev" ? "M14 6l-6 6 6 6" : "M10 6l6 6-6 6"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function MeetingBooking() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [dayId, setDayId] = useState("21");
  const [time, setTime] = useState("11:30");
  const [booked, setBooked] = useState(false);
  const dayIndex = Math.max(0, DAYS.findIndex((item) => item.id === dayId));
  const day = DAYS[dayIndex];
  const customer = text("נועה לוי", "Emily Johnson");
  const dayLabel = `${text(day.he, day.en)} ${day.id}`;

  const chooseDay = (id: string) => {
    setDayId(id);
    setBooked(false);
  };
  const shiftDay = (delta: number) => {
    const next = DAYS[(dayIndex + delta + DAYS.length) % DAYS.length];
    chooseDay(next.id);
  };

  return (
    <section className="mt-section" id="calendar" dir={dir} aria-labelledby="mt-title">
      <div className="mt-split">
        <div className="mt-copy">
          <div className="mt-lead">
            <p className="mt-kicker"><CalendarIcon />{text("חוויית קביעת פגישה", "Booking experience")}</p>
            <h2 id="mt-title">{text("קביעת פגישות פשוטה, מהירה ומחוברת ללקוח", "Simple, fast booking, connected to the customer")}</h2>
            <p>{text("בוחרים יום ושעה לדוגמה ורואים את הסיכום על כרטיס הלקוח. לא נוצרת פגישה אמיתית.", "Choose a sample day and time and see the summary on the customer card. No real meeting is created.")}</p>
            <ul>
              <li>
                <CalendarIcon />
                <span><strong>{text("בחירת מועד נוח", "A convenient time")}</strong>{text("ימים ושעות לדוגמה, בצורה ברורה.", "Sample days and times, shown clearly.")}</span>
              </li>
              <li>
                <BoltIcon />
                <span><strong>{text("אישור בהדגמה", "Confirmation in the demo")}</strong>{text("האישור מופיע מיד, ורק על המסך.", "The confirmation appears at once, on screen only.")}</span>
              </li>
              <li>
                <PersonIcon />
                <span><strong>{text("קשר לכרטיס הלקוח", "Linked to the customer card")}</strong>{text("הסיכום מוצג ליד הלקוח לדוגמה. שום דבר לא נשמר.", "The summary sits beside the sample customer. Nothing is saved.")}</span>
              </li>
            </ul>
          </div>
          <button type="button" className="mt-confirm" onClick={() => setBooked(true)}>{text("קביעת פגישה בהדגמה", "Book in the demo")}</button>
        </div>
        <div className="mt-demo">
          <article className="mt-card">
            <header>
              <div>
                <h3>{text("1. בחירת יום", "1. Choose a day")}</h3>
                <p>{text("בחרו תאריך מתאים לפגישה", "Choose a date for the meeting")}</p>
              </div>
              <span className="mt-ico"><CalendarIcon /></span>
            </header>
            <div className="mt-days" role="listbox" aria-label={text("ימים לדוגמה", "Sample days")}>
              <button type="button" className="mt-nav" onClick={() => shiftDay(-1)} aria-label={text("היום הקודם", "Previous day")}><Chevron direction={dir === "rtl" ? "next" : "prev"} /></button>
              {DAYS.map((item) => (
                <button key={item.id} type="button" className={item.id === dayId ? "is-on" : undefined} aria-selected={item.id === dayId} onClick={() => chooseDay(item.id)}>
                  <b>{text(item.he, item.en)}</b>
                  <span>{item.id}</span>
                  {item.id === dayId ? <i aria-hidden="true">✓</i> : null}
                </button>
              ))}
              <button type="button" className="mt-nav" onClick={() => shiftDay(1)} aria-label={text("היום הבא", "Next day")}><Chevron direction={dir === "rtl" ? "prev" : "next"} /></button>
            </div>
          </article>
          <div className="mt-join" aria-hidden="true"><Chevron direction="next" /></div>
          <article className="mt-card">
            <header>
              <div>
                <h3>{text("2. בחירת שעה", "2. Choose a time")}</h3>
                <p>{text(`בחרו מתוך השעות הפנויות ביום ${dayLabel}`, `Choose an open time on ${dayLabel}`)}</p>
              </div>
              <span className="mt-ico"><ClockIcon /></span>
            </header>
            <div className="mt-times">
              {TIMES.map((item) => (
                <button key={item} type="button" className={item === time ? "is-on" : undefined} onClick={() => { setTime(item); setBooked(false); }}>
                  <bdi dir="ltr">{item}</bdi>
                  {item === time ? <i aria-hidden="true">✓</i> : null}
                </button>
              ))}
            </div>
          </article>
          {booked ? (
            <div className="mt-result">
              <div className="mt-join" aria-hidden="true"><Chevron direction="next" /></div>
              <div className="mt-success" role="status">
                <span>✓</span>
                <div>
                  <strong>{text("הפגישה נקבעה בהצלחה!", "The meeting was booked successfully!")}</strong>
                  <p>{text("הסיכום מוצג על כרטיס הלקוח בהדגמה בלבד. שום דבר לא נשמר.", "The summary is shown on the customer card in the demo only. Nothing was saved.")}</p>
                </div>
              </div>
              <div className="mt-summary">
                <div>
                  <PersonIcon />
                  <strong>{customer}</strong>
                  <small>{text("לקוחה פעילה", "Active customer")}</small>
                </div>
                <div>
                  <CalendarIcon />
                  <strong>{text(`פגישה עם ${customer}`, `Meeting with ${customer}`)}</strong>
                  <small><bdi dir="ltr">{dayLabel} · {time}</bdi></small>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
