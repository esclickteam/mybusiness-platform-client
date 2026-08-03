import React from "react";

type PortalPreviewKind =
  | "portal-login"
  | "portal-register"
  | "portal-account"
  | "portal-orders"
  | "portal-cart"
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
        borderRadius: 16,
        border: `1px solid ${line}`,
        padding: "14px 16px",
        fontSize: 14,
        fontWeight: 600,
        color: "#94a3b8",
        background: "#fff",
        textAlign: "right",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
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
        borderRadius: 16,
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
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    direction: "rtl",
    fontFamily: "inherit",
    overflow: "hidden",
    background:
      kind === "portal-account" || kind === "portal-orders" || kind === "portal-cart"
        ? soft
        : "#fff",
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
          ההרשמה נשמרת לאתר ולעסק הזה בלבד.
        </div>
        <Field placeholder="שם מלא" line={line} ink={ink} />
        <Field placeholder="אימייל" line={line} ink={ink} />
        <Field placeholder="טלפון (אופציונלי)" line={line} ink={ink} />
        <Field placeholder="סיסמה" line={line} ink={ink} />
        <PrimaryButton label="יצירת חשבון" background={ink} />
      </div>
    );
  }

  if (kind === "portal-account") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 24, fontWeight: 900, color: ink }}>שלום לקוח/ה</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 4 }}>
          client@example.com
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
          {["ההזמנות שלי", "העגלה שלי", "פרטי החשבון"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 14px",
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
        {["הזמנות קודמות", "עמוד מוגן", "המשך רכישה"].map((label) => (
          <div
            key={label}
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              border: `1px solid ${line}`,
              fontWeight: 800,
              fontSize: 14,
              color: ink,
              background: "#fff",
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
      <div style={{ ...wrap, background: "#fff", gap: 10 }}>
        {[
          { title: "הזמנה #1042", meta: "שולמה · ₪249.00" },
          { title: "הזמנה #1038", meta: "בטיפול · ₪128.50" },
          { title: "הזמנה #1021", meta: "נשלחה · ₪89.00" },
        ].map((order) => (
          <div
            key={order.title}
            style={{
              padding: "16px 18px",
              borderRadius: 18,
              border: `1px solid ${line}`,
              background: soft,
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 14, color: ink, marginBottom: 4 }}>
              {order.title}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: muted }}>{order.meta}</div>
          </div>
        ))}
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
        התחברות לאתר זה בלבד — לא לחשבון BizUply.
      </div>
      <Field placeholder="אימייל" line={line} ink={ink} />
      <Field placeholder="סיסמה" line={line} ink={ink} />
      <PrimaryButton label="התחברות" background={ink} />
      <div style={{ fontSize: 13, fontWeight: 800, color: accent, marginTop: 2 }}>
        אין לכם חשבון? הרשמה
      </div>
    </div>
  );
}
