import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { homeText } from "./homeCopy";
import "./meetingBooking.css";

const DAYS = [
  { id: "19", labelHe: "א׳ 19", labelEn: "Sun 19" },
  { id: "20", labelHe: "ב׳ 20", labelEn: "Mon 20" },
  { id: "21", labelHe: "ג׳ 21", labelEn: "Tue 21" },
  { id: "22", labelHe: "ד׳ 22", labelEn: "Wed 22" },
  { id: "23", labelHe: "ה׳ 23", labelEn: "Thu 23" },
];
const TIMES = ["10:00", "11:30", "14:00", "15:00", "16:00"];

export default function MeetingBooking() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const dir = getTextDirection(language);
  const [dayId, setDayId] = useState("21");
  const [time, setTime] = useState("11:30");
  const [booked, setBooked] = useState(false);
  const day = DAYS.find((item) => item.id === dayId) || DAYS[2];
  const customer = text("נועה לוי", "Emily Johnson");

  return (
    <section className="mt-section" id="calendar" dir={dir} aria-labelledby="mt-title">
      <div className="mt-split">
        <div className="mt-copy">
          <p className="mt-kicker">{text("חוויית קביעת פגישה", "Booking experience")}</p>
          <h2 id="mt-title">{text("קביעת פגישה פשוטה ומחוברת ללקוח", "A simple booking, connected to the customer")}</h2>
          <p>{text("בוחרים יום ושעה לדוגמה ורואים את הסיכום על כרטיס הלקוח. לא נוצרת פגישה אמיתית.", "Choose a sample day and time and see the summary on the customer card. No real meeting is created.")}</p>
          <ul>
            <li>{text("בחירת מועד נוח", "Pick a convenient time")}</li>
            <li>{text("אישור שנשאר בהדגמה", "Confirmation that stays in the demo")}</li>
            <li>{text("קשר לכרטיס הלקוח", "A link to the customer card")}</li>
          </ul>
        </div>
        <div className="mt-demo">
          <h3>{text("1. בחירת יום", "1. Choose a day")}</h3>
          <div className="mt-days" role="listbox" aria-label={text("ימים לדוגמה", "Sample days")}>
            {DAYS.map((item) => (
              <button key={item.id} type="button" className={item.id === dayId ? "is-on" : undefined} aria-selected={item.id === dayId} onClick={() => { setDayId(item.id); setBooked(false); }}>
                {text(item.labelHe, item.labelEn)}
              </button>
            ))}
          </div>
          <h3>{text("2. בחירת שעה", "2. Choose a time")}</h3>
          <div className="mt-times">
            {TIMES.map((item) => (
              <button key={item} type="button" className={item === time ? "is-on" : undefined} onClick={() => { setTime(item); setBooked(false); }}>
                <bdi dir="ltr">{item}</bdi>
              </button>
            ))}
          </div>
          <button type="button" className="mt-confirm" onClick={() => setBooked(true)}>{text("קביעת פגישה בהדגמה", "Book in the demo")}</button>
          {booked ? (
            <div className="mt-summary" role="status">
              <p>{text("הפגישה נקבעה בהדגמה", "The meeting was booked in the demo")}</p>
              <strong>{text(`פגישה עם ${customer}`, `Meeting with ${customer}`)}</strong>
              <span><bdi dir="ltr">{text(day.labelHe, day.labelEn)} · {time}</bdi></span>
              <small>{text("הסיכום מוצג על כרטיס הלקוח בהדגמה בלבד. שום דבר לא נשמר.", "The summary is shown on the customer card in the demo only. Nothing was saved.")}</small>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
