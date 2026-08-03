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
}: {
  placeholder: string;
  line: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        border: `1px solid ${line}`,
        padding: "12px 14px",
        fontSize: 14,
        fontWeight: 600,
        color: "#94a3b8",
        background: "#fff",
        textAlign: "right",
      }}
    >
      {placeholder}
    </div>
  );
}

function PrimaryButton({
  label,
  ink,
}: {
  label: string;
  ink: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 14,
        background: ink,
        color: "#fff",
        padding: "13px 16px",
        fontSize: 14,
        fontWeight: 800,
        textAlign: "center",
      }}
    >
      {label}
    </div>
  );
}

export default function PortalWidgetPreview({
  kind,
  accent = "#0284c7",
  ink = "#0f172a",
  muted = "#64748b",
  line = "#e2e8f0",
  soft = "#f8fafc",
}: Props) {
  const wrap: React.CSSProperties = {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    direction: "rtl",
    fontFamily: "inherit",
    overflow: "hidden",
  };

  if (kind === "portal-register") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 12, fontWeight: 800, color: accent }}>אזור אישי</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: ink, marginBottom: 2 }}>
          הרשמה
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: muted, lineHeight: 1.5, marginBottom: 6 }}>
          ההרשמה נשמרת לאתר ולעסק הזה בלבד.
        </div>
        <Field placeholder="שם מלא" line={line} />
        <Field placeholder="אימייל" line={line} />
        <Field placeholder="טלפון (אופציונלי)" line={line} />
        <Field placeholder="סיסמה" line={line} />
        <PrimaryButton label="יצירת חשבון" ink={ink} />
      </div>
    );
  }

  if (kind === "portal-account") {
    return (
      <div style={wrap}>
        <div style={{ fontSize: 22, fontWeight: 900, color: ink }}>שלום לקוח/ה</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: muted, marginBottom: 8 }}>
          client@example.com
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {["ההזמנות שלי", "העגלה שלי", "פרטי החשבון"].map((label) => (
            <div
              key={label}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: `1px solid ${line}`,
                background: soft,
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
              padding: "12px 14px",
              borderRadius: 14,
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
      <div style={wrap}>
        {[
          { title: "הזמנה #1042", meta: "שולמה · ₪249.00" },
          { title: "הזמנה #1038", meta: "בטיפול · ₪128.50" },
          { title: "הזמנה #1021", meta: "נשלחה · ₪89.00" },
        ].map((order) => (
          <div
            key={order.title}
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              border: `1px solid ${line}`,
              background: "#fff",
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
      <div style={wrap}>
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
              paddingBottom: 10,
              borderBottom: `1px solid ${line}`,
              fontWeight: 700,
              fontSize: 13,
              color: ink,
            }}
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}
        <div style={{ fontWeight: 900, fontSize: 16, color: ink, marginTop: 4 }}>
          סה״כ: ₪180.00
        </div>
        <PrimaryButton label="המשך לתשלום" ink={accent} />
      </div>
    );
  }

  // portal-login (default)
  return (
    <div style={wrap}>
      <div style={{ fontSize: 12, fontWeight: 800, color: accent }}>אזור אישי</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: ink, marginBottom: 2 }}>
        התחברות
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: muted, lineHeight: 1.5, marginBottom: 6 }}>
        התחברות לאתר זה בלבד — לא לחשבון BizUply.
      </div>
      <Field placeholder="אימייל" line={line} />
      <Field placeholder="סיסמה" line={line} />
      <PrimaryButton label="התחברות" ink={ink} />
      <div style={{ fontSize: 13, fontWeight: 800, color: accent, marginTop: 4 }}>
        אין לכם חשבון? הרשמה
      </div>
    </div>
  );
}
