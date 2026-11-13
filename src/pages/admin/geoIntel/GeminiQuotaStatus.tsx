import React from "react";

type QuotaDimensions = Record<string, string | number | boolean> | null;

type GeminiProviderError = {
  httpStatus?: number | null;
  googleStatus?: string;
  message?: string;
  quotaMetric?: string;
  quotaId?: string;
  quotaValue?: string;
  quotaDimensions?: QuotaDimensions;
  model?: string;
  retryDelay?: string;
  billingMessage?: string;
  classification?: string;
  capturedAt?: string;
};

const CLASSIFICATION: Record<string, string> = {
  rpm: "בקשות לדקה (RPM)",
  tpm: "טוקנים לדקה (TPM)",
  rpd: "בקשות ליום (RPD)",
  free_tier: "מסלול חינמי",
  paid_tier: "מסלול בתשלום",
  spending_cap: "תקרת הוצאה",
  billing: "בעיית חיוב",
  unknown: "Google לא ציין את סוג המכסה",
};

function shown(value: unknown) {
  if (value == null || value === "") return "לא הוחזר";
  return String(value);
}

function dimensionsText(dimensions: QuotaDimensions) {
  if (!dimensions) return "לא הוחזר";
  const parts = Object.entries(dimensions).map(([key, value]) => `${key}: ${value}`);
  return parts.length ? parts.join(" · ") : "לא הוחזר";
}

export default function GeminiQuotaStatus({
  error,
}: {
  error?: GeminiProviderError | null;
}) {
  return (
    <div className="geo-card" style={{ marginTop: 12 }}>
      <h3>שגיאת מכסה אחרונה — Gemini</h3>
      <p className="geo-note">
        המודל נשאר gemini-3.8-flash. הפרטים נשמרים רק מהשגיאה ש־Google מחזיר, בלי מפתח API.
      </p>
      {!error ? (
        <p className="geo-note">אין שגיאת מכסה שמורה. בכישלון הבא יישמרו שדות המכסה אם Google יחזיר אותם.</p>
      ) : (
        <TableRows error={error} />
      )}
    </div>
  );
}

function TableRows({ error }: { error: GeminiProviderError }) {
  const rows: Array<[string, string]> = [
    ["סיווג", CLASSIFICATION[error.classification || ""] || CLASSIFICATION.unknown],
    ["HTTP status", shown(error.httpStatus)],
    ["Google status", shown(error.googleStatus)],
    ["quotaMetric", shown(error.quotaMetric)],
    ["quotaId", shown(error.quotaId)],
    ["quotaValue", shown(error.quotaValue)],
    ["quotaDimensions", dimensionsText(error.quotaDimensions || null)],
    ["model", shown(error.model)],
    ["retryDelay", shown(error.retryDelay)],
    ["חיוב / תקרת הוצאה", shown(error.billingMessage)],
    ["הודעה", shown(error.message)],
    ["נשמר", shown(error.capturedAt)],
  ];
  return (
    <dl className="geo-quota-details">
      {rows.map(([label, value]) => (
        <React.Fragment key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
