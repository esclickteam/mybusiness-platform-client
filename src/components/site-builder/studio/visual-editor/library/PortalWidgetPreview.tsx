import React from "react";

type PortalPreviewKind =
  | "portal-login"
  | "portal-register"
  | "portal-account"
  | "portal-orders"
  | "portal-cart"
  | "portal-forgot-password"
  | "portal-reset-password"
  | string;

type Props = {
  kind: PortalPreviewKind;
  accent?: string;
  ink?: string;
  muted?: string;
  line?: string;
  soft?: string;
};

function Field({
  placeholder,
  line,
  ink,
}: {
  placeholder: string;
  line: string;
  ink: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        border: `1px solid ${line}`,
        padding: "14px 16px",
        fontSize: 14,
        fontWeight: 600,
        color: "#94a3b8",
        background: "#fff",
        textAlign: "right",
      }}
    >
      <span style={{ color: ink, opacity: 0.35 }}>{placeholder}</span>
    </div>
  );
}

function PrimaryButton({
  label,
  background,
}: {
  label: string;
  background: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        background,
        color: "#fff",
        padding: "14px 16px",
        fontSize: 14,
        fontWeight: 800,
        textAlign: "center",
        boxShadow: "0 14px 28px -18px rgba(15,23,42,0.55)",
      }}
    >
      {label}
    </div>
  );
}

export default function PortalWidgetPreview({
  kind,
  accent = "#0e7490",
  ink = "#0f172a",
  muted = "#64748b",
  line = "#e2e8f0",
  soft = "#f8fafc",
}: Props) {
  const wrap: React.CSSProperties = {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    direction: "rtl",
    fontFamily: "inherit",
    overflow: "hidden",
    background: soft,
  };

  if (kind === "portal-register") {
    return (
      <div style={{ ...wrap, background: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: "0.04em" }}>
          אזור אישי
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: ink, lineHeight: 1.15 }}>
          הרשמה
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55, marginBottom: 4 }}>
          מלאו את הפרטים כדי לפתוח חשבון ולהמשיך באתר.
        </div>
        <Field placeholder="שם מלא" line={line} ink={ink} />
        <Field placeholder="אימייל" line={line} ink={ink} />
        <Field placeholder="טלפון (אופציונלי)" line={line} ink={ink} />
        <Field placeholder="סיסמה" line={line} ink={ink} />
        <PrimaryButton label="יצירת חשבון" background={ink} />
      </div>
    );
  }

  if (kind === "portal-forgot-password" || kind === "portal-reset-password") {
    const isReset = kind === "portal-reset-password";
    return (
      <div style={{ ...wrap, background: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: "0.04em" }}>
          אזור אישי
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: ink, lineHeight: 1.15 }}>
          {isReset ? "סיסמה חדשה" : "שכחתי סיסמה"}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55 }}>
          {isReset
            ? "בחרו סיסמה חדשה לאזור האישי."
            : "נשלח קישור לאיפוס סיסמה לאימייל שלכם."}
        </div>
        <Field
          placeholder={isReset ? "סיסמה חדשה" : "אימייל"}
          line={line}
          ink={ink}
        />
        {isReset ? <Field placeholder="אימות סיסמה" line={line} ink={ink} /> : null}
        <PrimaryButton
          label={isReset ? "שמירת סיסמה" : "שליחת קישור"}
          background={ink}
        />
      </div>
    );
  }

  if (kind === "portal-account") {
    return (
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: ink,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
            }}
          >
            ל
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: ink }}>שלום לקוח/ה</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: muted }}>
              client@example.com
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            ["הזמנות", "3"],
            ["קורסים", "2"],
            ["הודעות", "0"],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "12px 8px",
                borderRadius: 14,
                border: `1px solid ${line}`,
                background: "#fff",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: muted }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: ink }}>{value}</div>
            </div>
          ))}
        </div>
        {["ההזמנות שלי", "העגלה שלי", "פרטי החשבון"].map((label) => (
          <div
            key={label}
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: `1px solid ${line}`,
              background: "#fff",
              fontWeight: 800,
              fontSize: 13,
              color: ink,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    );
  }

  if (kind === "portal-orders") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 12, fontWeight: 800, color: muted, letterSpacing: "0.04em" }}>
          היסטוריית הזמנות
        </div>
        <div
          style={{
            borderRadius: 16,
            border: `1px solid ${line}`,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 0.8fr",
              gap: 8,
              padding: "12px 14px",
              background: soft,
              borderBottom: `1px solid ${line}`,
              fontSize: 11,
              fontWeight: 800,
              color: muted,
            }}
          >
            <div>הזמנה</div>
            <div>סטטוס</div>
            <div>סכום</div>
          </div>
          {[
            ["#1042", "שולמה", "₪249"],
            ["#1038", "בטיפול", "₪128"],
            ["#1021", "נשלחה", "₪89"],
          ].map(([order, status, total], index, arr) => (
            <div
              key={order}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr 0.8fr",
                gap: 8,
                padding: 14,
                borderBottom: index === arr.length - 1 ? "0" : `1px solid ${line}`,
                fontSize: 13,
                fontWeight: 800,
                color: ink,
                alignItems: "center",
              }}
            >
              <div>{order}</div>
              <div
                style={{
                  width: "fit-content",
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: soft,
                  border: `1px solid ${line}`,
                  fontSize: 11,
                  color: accent,
                }}
              >
                {status}
              </div>
              <div>{total}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "portal-cart") {
    return (
      <div style={{ ...wrap, background: "#fff" }}>
        {[
          { name: "מוצר לדוגמה × 1", price: "₪120.00" },
          { name: "תוספת × 2", price: "₪60.00" },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              paddingBottom: 12,
              borderBottom: `1px solid ${line}`,
              fontWeight: 700,
              fontSize: 14,
              color: ink,
            }}
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}
        <div style={{ fontWeight: 900, fontSize: 18, color: ink, marginTop: 4 }}>
          סה״כ: ₪180.00
        </div>
        <PrimaryButton label="המשך לתשלום" background={accent} />
      </div>
    );
  }

  return (
    <div style={{ ...wrap, background: "#fff" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: "0.04em" }}>
        אזור אישי
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, color: ink, lineHeight: 1.15 }}>
        התחברות
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: muted, lineHeight: 1.55, marginBottom: 4 }}>
        הזינו את הפרטים שלכם כדי להיכנס לחשבון באתר.
      </div>
      <Field placeholder="אימייל" line={line} ink={ink} />
      <Field placeholder="סיסמה" line={line} ink={ink} />
      <PrimaryButton label="התחברות" background={ink} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: accent }}>
          אין לכם חשבון? הרשמה
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: muted }}>
          שכחתי סיסמה
        </div>
      </div>
    </div>
  );
}
