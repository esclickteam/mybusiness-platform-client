export const BIZUPLY_EMAIL_LOGO_URL =
  "https://api.bizuply.com/uploads/logo.png";

export const APPOINTMENT_CONFIRMATION_SUBJECT = "אישור פגישה";

export const APPOINTMENT_EMAIL_VARIABLES = [
  { label: "שם הלקוח", token: "{{appointment.clientName}}" },
  { label: "שם העסק", token: "{{business.name}}" },
  { label: "תאריך הפגישה", token: "{{appointment.date}}" },
  { label: "שעת הפגישה", token: "{{appointment.time}}" },
  { label: "משך הפגישה", token: "{{appointment.duration}}" },
  {
    label: "שם השירות",
    token: "{{appointment.serviceName}}",
    optional: true,
  },
  { label: "מיקום", token: "{{appointment.location}}", optional: true },
  { label: "הערות", token: "{{appointment.notes}}", optional: true },
] as const;

export const LEAD_EMAIL_VARIABLES = [
  { label: "שם הליד", token: "{{lead.name}}" },
  { label: "שם העסק", token: "{{business.name}}" },
  { label: "אימייל הליד", token: "{{lead.email}}" },
] as const;

export type EmailTemplateVariable = {
  label: string;
  token: string;
  optional?: boolean;
};

export function emailVariablesForTrigger(
  triggerKey: string
): EmailTemplateVariable[] {
  const key = String(triggerKey || "");
  if (key === "appointment_created" || key === "appointment_reminder") {
    return [...APPOINTMENT_EMAIL_VARIABLES];
  }
  return [...LEAD_EMAIL_VARIABLES];
}

const OPTIONAL_DETAILS_SAMPLE_HTML = `<tr>
    <td style="padding:6px 0;font-size:15px;line-height:1.6;color:#334155;">
      <strong style="color:#0f172a;">שירות:</strong>
      תספורת
    </td>
  </tr><tr>
    <td style="padding:6px 0;font-size:15px;line-height:1.6;color:#334155;">
      <strong style="color:#0f172a;">מיקום:</strong>
      תל אביב
    </td>
  </tr>`;

export const APPOINTMENT_EMAIL_PREVIEW_CONTEXT = {
  appointment: {
    clientName: "דנה כהן",
    date: "13/04/2027",
    time: "14:40",
    duration: "30 דקות",
    serviceName: "תספורת",
    location: "תל אביב",
    notes: "",
    optionalDetailsHtml: OPTIONAL_DETAILS_SAMPLE_HTML,
    optionalDetailsText: "שירות: תספורת\nמיקום: תל אביב",
  },
  business: {
    name: "העסק שלי",
  },
  lead: {
    name: "ישראל ישראלי",
    email: "israel@example.com",
  },
};

export const APPOINTMENT_CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>אישור פגישה</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8ecf4;">
          <tr>
            <td align="center" style="padding:22px 24px 8px 24px;">
              <img src="https://api.bizuply.com/uploads/logo.png" alt="BizUply" width="140" style="display:block;max-width:140px;height:auto;border:0;" />
            </td>
          </tr>
          <tr>
            <td dir="rtl" style="padding:8px 28px 28px 28px;color:#1f2937;text-align:right;direction:rtl;">
              <h1 style="margin:0 0 14px 0;font-size:22px;line-height:1.35;color:#4f46e5;">הפגישה שלך נקבעה בהצלחה</h1>
              <p style="margin:0 0 12px 0;font-size:16px;line-height:1.7;">שלום {{appointment.clientName}},</p>
              <p style="margin:0 0 18px 0;font-size:16px;line-height:1.7;">
                הפגישה שלך עם <strong>{{business.name}}</strong> נקבעה בהצלחה.
              </p>
              <p style="margin:0 0 8px 0;font-size:15px;font-weight:bold;color:#0f172a;">פרטי הפגישה:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px 0;">
                <tr>
                  <td style="padding:6px 0;font-size:15px;line-height:1.6;color:#334155;">
                    <strong style="color:#0f172a;">תאריך:</strong>
                    {{appointment.date}}
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:15px;line-height:1.6;color:#334155;">
                    <strong style="color:#0f172a;">שעה:</strong>
                    {{appointment.time}}
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:15px;line-height:1.6;color:#334155;">
                    <strong style="color:#0f172a;">משך:</strong>
                    {{appointment.duration}}
                  </td>
                </tr>
                {{appointment.optionalDetailsHtml}}
              </table>
              <p style="margin:0;font-size:15px;line-height:1.7;">
                נתראה בקרוב,<br/>
                <strong>{{business.name}}</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td dir="rtl" style="padding:14px 28px 22px 28px;background:#fafbff;border-top:1px solid #eef1f7;color:#94a3b8;font-size:12px;text-align:center;direction:rtl;">
              מופעל באמצעות Bizuply
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const APPOINTMENT_CONFIRMATION_TEXT = `הפגישה שלך נקבעה בהצלחה

שלום {{appointment.clientName}},

הפגישה שלך עם {{business.name}} נקבעה בהצלחה.

פרטי הפגישה:
תאריך: {{appointment.date}}
שעה: {{appointment.time}}
משך: {{appointment.duration}}
{{appointment.optionalDetailsText}}

נתראה בקרוב,
{{business.name}}`;

export const APPOINTMENT_CONFIRMATION_EMAIL_DEFAULTS = {
  recipientType: "appointment_customer_email",
  subject: APPOINTMENT_CONFIRMATION_SUBJECT,
  html: APPOINTMENT_CONFIRMATION_HTML,
  body: APPOINTMENT_CONFIRMATION_HTML,
  text: APPOINTMENT_CONFIRMATION_TEXT,
};

function getByPath(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined;
  const parts = String(path).split(".").filter(Boolean);
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

export function interpolateEmailTemplate(
  template: string,
  context: unknown
): string {
  if (template == null) return "";
  return String(template).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = getByPath(context, key);
    return value == null ? "" : String(value);
  });
}

export function buildEmailPreviewContext(
  triggerKey: string,
  extras: { businessName?: string } = {}
) {
  const businessName = String(extras.businessName || "").trim();
  return {
    ...APPOINTMENT_EMAIL_PREVIEW_CONTEXT,
    business: {
      name: businessName || APPOINTMENT_EMAIL_PREVIEW_CONTEXT.business.name,
    },
  };
}

export function insertTokenAtCursor(
  current: string,
  token: string,
  start?: number | null,
  end?: number | null
): string {
  const value = String(current || "");
  const tokenText = String(token || "");
  if (start == null || start < 0) return `${value}${tokenText}`;
  const from = Math.min(start, value.length);
  const to = Math.min(end == null ? from : end, value.length);
  return `${value.slice(0, from)}${tokenText}${value.slice(to)}`;
}

export const REQUIRED_APPOINTMENT_EMAIL_TOKENS = [
  "{{appointment.clientName}}",
  "{{appointment.date}}",
  "{{appointment.time}}",
  "{{appointment.duration}}",
  "{{business.name}}",
] as const;
