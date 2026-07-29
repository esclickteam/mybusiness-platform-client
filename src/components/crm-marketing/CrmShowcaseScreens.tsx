import React from "react";

function Stat({
  label,
  value,
  tone = "plain",
}: {
  label: string;
  value: string;
  tone?: "plain" | "purple" | "blue" | "green" | "amber";
}) {
  return (
    <div className={`crm-mock__stat crm-mock__stat--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Pill({
  text,
  tone = "blue",
}: {
  text: string;
  tone?: "blue" | "amber" | "purple" | "green" | "red" | "navy";
}) {
  return <span className={`crm-mock__pill crm-mock__pill--${tone}`}>{text}</span>;
}

export function CrmLeadsScreen() {
  const rows = [
    { name: "הילה דוד", status: "חדש", tone: "blue" as const, source: "Meta Lead Ads" },
    { name: "עדי נחום", status: "נוצר קשר", tone: "amber" as const, source: "Meta Lead Ads" },
    { name: "גיל סולומון", status: "מעוניין", tone: "purple" as const, source: "טופס באתר" },
    { name: "יעל קדוש", status: "הומר", tone: "green" as const, source: "Instagram" },
  ];

  return (
    <div className="crm-mock crm-mock--leads" dir="rtl">
      <div className="crm-mock__head">
        <div>
          <h3>ניהול לידים</h3>
          <p>מעקב מקצועי, פרופיל לקוח, הערות ומשימות</p>
        </div>
        <button type="button" className="crm-mock__btn">פתיחה</button>
      </div>
      <div className="crm-mock__stats">
        <Stat label="סה״כ לידים" value="20" tone="purple" />
        <Stat label="חדשים" value="9" tone="blue" />
        <Stat label="בטיפול" value="5" tone="amber" />
        <Stat label="הומרו" value="2" tone="green" />
      </div>
      <div className="crm-mock__toolbar">
        <div className="crm-mock__search">חיפוש לפי שם, טלפון או מקור…</div>
        <div className="crm-mock__filters">
          <Pill text="הכל" tone="navy" />
          <Pill text="חדש" tone="blue" />
          <Pill text="נוצר קשר" tone="amber" />
          <Pill text="מעוניין" tone="purple" />
        </div>
      </div>
      <div className="crm-mock__table">
        {rows.map((row) => (
          <div key={row.name} className="crm-mock__row">
            <div className="crm-mock__avatar">{row.name.slice(0, 2)}</div>
            <div className="crm-mock__row-main">
              <strong>{row.name}</strong>
              <span>{row.source}</span>
            </div>
            <Pill text={row.status} tone={row.tone} />
            <button type="button" className="crm-mock__btn crm-mock__btn--sm">פתיחה</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CrmLeadDetailScreen() {
  return (
    <div className="crm-mock crm-mock--detail" dir="rtl">
      <div className="crm-mock__detail-top">
        <div className="crm-mock__detail-id">
          <div className="crm-mock__avatar crm-mock__avatar--lg">ענ</div>
          <div>
            <h3>עדי נחום</h3>
            <p>Meta Lead Ads · 29.07.2026</p>
          </div>
        </div>
        <Pill text="נוצר קשר" tone="amber" />
      </div>
      <div className="crm-mock__detail-grid">
        <aside className="crm-mock__panel">
          <h4>פרטי מקור</h4>
          <div className="crm-mock__kv"><span>מקור</span><strong>Meta Lead Ads</strong></div>
          <div className="crm-mock__kv"><span>טופס</span><strong>ייעוץ עסקי</strong></div>
          <div className="crm-mock__kv"><span>עיר</span><strong>באר שבע</strong></div>
        </aside>
        <section className="crm-mock__panel crm-mock__panel--wide">
          <h4>תיעוד ומשימות</h4>
          <div className="crm-mock__note">
            לחזור ללקוח מחר ב־10:00 · משימה פתוחה לאמיר
          </div>
          <div className="crm-mock__actions-row">
            <button type="button" className="crm-mock__btn crm-mock__btn--ghost">WhatsApp</button>
            <button type="button" className="crm-mock__btn">שיחה</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export function CrmNotificationsScreen() {
  const items = ["עדי נחום", "גיל סולומון", "יעל קדוש", "נועה כהן"];
  return (
    <div className="crm-mock crm-mock--notif" dir="rtl">
      <div className="crm-mock__notif-badge">מרכז התראות</div>
      <h3>התראות</h3>
      <p>לידים חדשים, משימות לטיפול ועדכונים מהמערכת</p>
      <div className="crm-mock__tabs">
        <span className="is-active">הכל</span>
        <span>לא נקראו</span>
      </div>
      <div className="crm-mock__notif-list">
        {items.map((name, i) => (
          <div key={name} className="crm-mock__notif-item">
            <div className="crm-mock__notif-icon" aria-hidden="true" />
            <div>
              <Pill text="ליד חדש" tone="blue" />
              <strong>ליד חדש: {name}</strong>
              <span>נכנס ליד חדש למערכת</span>
            </div>
            <em>לפני {6 + i * 3} דק׳</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CrmClientsScreen() {
  const clients = [
    { name: "מיכל לוי", city: "רמת גן", status: "לקוח" },
    { name: "יואב כהן", city: "חיפה", status: "פעיל" },
    { name: "דנה אברהם", city: "ירושלים", status: "ליד" },
  ];
  return (
    <div className="crm-mock crm-mock--clients" dir="rtl">
      <div className="crm-mock__head">
        <div>
          <h3>ניהול לקוחות פרימיום</h3>
          <p>פרופילים, תורים ונתונים מותאמים</p>
        </div>
        <button type="button" className="crm-mock__btn">+ הוספת לקוח</button>
      </div>
      <div className="crm-mock__stats">
        <Stat label="סה״כ לקוחות" value="12" tone="purple" />
        <Stat label="פעילים" value="5" tone="green" />
        <Stat label="תורים" value="15" tone="blue" />
        <Stat label="הכנסה" value="$7.2K" tone="amber" />
      </div>
      <div className="crm-mock__table">
        {clients.map((c) => (
          <div key={c.name} className="crm-mock__row">
            <div className="crm-mock__avatar">{c.name.slice(0, 2)}</div>
            <div className="crm-mock__row-main">
              <strong>{c.name}</strong>
              <span>{c.city}</span>
            </div>
            <Pill text={c.status} tone={c.status === "ליד" ? "purple" : "green"} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CrmCustomerScreen() {
  return (
    <div className="crm-mock crm-mock--customer" dir="rtl">
      <div className="crm-mock__detail-top">
        <div className="crm-mock__detail-id">
          <div className="crm-mock__avatar crm-mock__avatar--lg crm-mock__avatar--purple">מל</div>
          <div>
            <h3>מיכל לוי</h3>
            <p>michal.levy.crm@gmail.com</p>
          </div>
        </div>
        <button type="button" className="crm-mock__btn">עריכה</button>
      </div>
      <div className="crm-mock__stats">
        <Stat label="סטטוס" value="לקוח" />
        <Stat label="תורים" value="3" tone="blue" />
        <Stat label="שדות" value="3" tone="purple" />
      </div>
      <div className="crm-mock__tabs crm-mock__tabs--underline">
        <span className="is-active">פרופיל לקוח</span>
        <span>תורים</span>
        <span>נתוני לקוח</span>
      </div>
      <div className="crm-mock__note">
        בוצע ייעוץ שיווק מלא לעסק, צורף קובץ סיכום ייעוץ
      </div>
      <button type="button" className="crm-mock__btn">שמירת תיעוד</button>
    </div>
  );
}

export function CrmCalendarScreen() {
  const days = Array.from({ length: 14 }, (_, i) => i + 15);
  return (
    <div className="crm-mock crm-mock--calendar" dir="rtl">
      <div className="crm-mock__head">
        <div>
          <h3>יומן פגישות</h3>
          <p>יולי 2026 · רשימה מסונכרנת</p>
        </div>
        <button type="button" className="crm-mock__btn">+ יצירת פגישה</button>
      </div>
      <div className="crm-mock__stats">
        <Stat label="סה״כ" value="15" tone="purple" />
        <Stat label="קרובים" value="8" tone="blue" />
        <Stat label="הכנסה" value="$7,250" tone="green" />
        <Stat label="לא שולם" value="7" tone="amber" />
      </div>
      <div className="crm-mock__cal">
        <aside className="crm-mock__panel">
          <Pill text="מתוזמן" tone="green" />
          <strong>אלי שמש</strong>
          <span>פגישת ייעוץ · 10:30 · 45 דק׳</span>
          <span className="crm-mock__paid">שולם · $250</span>
        </aside>
        <div className="crm-mock__cal-grid">
          {days.map((d) => (
            <div
              key={d}
              className={`crm-mock__cal-day${d === 28 ? " is-active" : ""}`}
            >
              <em>{d}</em>
              {d === 28 || d === 21 || d === 24 ? (
                <i className="crm-mock__cal-event">{d === 28 ? "10:30 אלי" : "09:00"}</i>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CrmScreenById({ id }: { id: string }) {
  switch (id) {
    case "leads":
      return <CrmLeadsScreen />;
    case "lead-detail":
      return <CrmLeadDetailScreen />;
    case "notifications":
      return <CrmNotificationsScreen />;
    case "clients":
      return <CrmClientsScreen />;
    case "customer":
      return <CrmCustomerScreen />;
    case "calendar":
      return <CrmCalendarScreen />;
    default:
      return <CrmLeadsScreen />;
  }
}
