import React from "react";
import { Bell, CheckCheck, Clock3, Flame, RefreshCw, Settings } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import "./automationsNotificationsDemo.css";

type DemoKind = "new_lead" | "task_due" | "regular";

type DemoNotification = {
  id: string;
  kind: DemoKind;
  typeLabel: string;
  title: string;
  text: string;
  time: string;
  unread: boolean;
  meta?: string;
};

const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "1",
    kind: "new_lead",
    typeLabel: "ליד חדש",
    title: "ליד חדש: נועה כהן",
    text: "נכנס ליד חדש מ־Facebook Lead Ads — מעוניינת בייעוץ ראשוני.",
    time: "עכשיו",
    unread: true,
    meta: "מקור: Meta",
  },
  {
    id: "2",
    kind: "task_due",
    typeLabel: "משימה ללקוח",
    title: "משימה ללקוח: אורי לוי",
    text: "לחזור עם הצעת מחיר לחבילת אתר + CRM. זמן הטיפול הגיע.",
    time: "לפני 12 דק׳",
    unread: true,
    meta: "זמן טיפול: היום 16:30",
  },
  {
    id: "3",
    kind: "new_lead",
    typeLabel: "ליד חדש",
    title: "ליד חדש: דנה אברהם",
    text: "פנייה מהאתר — ביקשה לקבוע תור להדגמה בשבוע הבא.",
    time: "לפני שעה",
    unread: true,
    meta: "מקור: אתר",
  },
  {
    id: "4",
    kind: "task_due",
    typeLabel: "משימה ללקוח",
    title: "משימה ללקוח: סטודיו ברק",
    text: "פולואפ אחרי שיחת היכרות — לשלוח סיכום וקישור לזימון.",
    time: "לפני 3 שעות",
    unread: false,
    meta: "זמן טיפול: היום 11:00",
  },
  {
    id: "5",
    kind: "regular",
    typeLabel: "התראה",
    title: "תזכורת פגישה",
    text: "פגישת ייעוץ עם יעל שמעוני מתחילה בעוד שעתיים.",
    time: "לפני 5 שעות",
    unread: false,
  },
];

function KindIcon({ kind }: { kind: DemoKind }) {
  if (kind === "task_due") return <Clock3 size={18} aria-hidden="true" />;
  if (kind === "new_lead") return <Flame size={18} aria-hidden="true" />;
  return <Bell size={18} aria-hidden="true" />;
}

export default function AutomationsNotificationsDemo() {
  const unreadCount = DEMO_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <section className="pm-section amx-notif" aria-label="דוגמת התראות">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Bell size={14} aria-hidden="true" />
              התראות חכמות
            </>
          }
          title={
            <>
              האוטומציה לא רצה בשקט —{" "}
              <span className="pm-grad">היא מודיעה בזמן</span>
            </>
          }
          lead="ליד חדש, משימה שעבר זמנה או תזכורת לפגישה — הכל עולה למרכז ההתראות. כך זה נראה במערכת, עם דוגמאות פקטיביות שמדמות את מה שתקבלו ביום־יום."
        />

        <Reveal from="up" delay={0.08}>
          <div className="amx-notif__stage">
            <div className="amx-notif__glow" aria-hidden="true" />

            <div className="amx-notif__bell-wrap" aria-hidden="true">
              <span className="amx-notif__bell">
                <Bell size={22} strokeWidth={2.2} />
                <span className="amx-notif__count">{unreadCount}</span>
              </span>
              <p>ככה זה נראה במערכת</p>
            </div>

            <div className="amx-notif__panel" dir="rtl">
              <header className="amx-notif__head">
                <div>
                  <p className="amx-notif__badge">מרכז התראות</p>
                  <h3>התראות</h3>
                  <p className="amx-notif__sub">
                    לידים חדשים, משימות לטיפול ועדכונים מהמערכת
                  </p>
                </div>
                <div className="amx-notif__head-actions">
                  <span>
                    <Settings size={15} />
                  </span>
                  <span>
                    <RefreshCw size={15} />
                  </span>
                </div>
              </header>

              <div className="amx-notif__tabs" aria-hidden="true">
                <span className="is-active">הכל</span>
                <span>לא נקראו · {unreadCount}</span>
              </div>

              <div className="amx-notif__toolbar" aria-hidden="true">
                <span>{unreadCount} התראות שלא נקראו</span>
                <span className="amx-notif__mark">
                  <CheckCheck size={14} />
                  סמן הכל
                </span>
              </div>

              <ul className="amx-notif__list">
                {DEMO_NOTIFICATIONS.map((item) => (
                  <li
                    key={item.id}
                    className={`amx-notif__item${item.unread ? " is-unread" : ""}`}
                  >
                    <span
                      className={`amx-notif__icon amx-notif__icon--${item.kind}`}
                    >
                      <KindIcon kind={item.kind} />
                    </span>

                    <div className="amx-notif__body">
                      <div className="amx-notif__row">
                        <span className="amx-notif__type">{item.typeLabel}</span>
                        <time>{item.time}</time>
                      </div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                      {item.meta ? (
                        <span className="amx-notif__meta">{item.meta}</span>
                      ) : null}
                    </div>

                    {item.unread ? <span className="amx-notif__dot" /> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
