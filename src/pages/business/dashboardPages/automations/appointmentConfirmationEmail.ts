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
  { label: "טלפון הליד", token: "{{lead.phone}}", optional: true },
  { label: "מקור הליד", token: "{{lead.source}}", optional: true },
] as const;

export const STORE_ORDER_EMAIL_VARIABLES = [
  { label: "שם פרטי", token: "{{customer.firstName}}" },
  { label: "שם הלקוח", token: "{{customer.fullName}}" },
  { label: "מספר הזמנה", token: "{{order.number}}" },
  { label: "סה״כ", token: "{{order.total}}" },
  { label: "פריטים", token: "{{order.items}}" },
  { label: "כתובת משלוח", token: "{{order.shippingAddress}}" },
  { label: "שם החנות", token: "{{store.name}}" },
  { label: "אימייל לקוח", token: "{{customer.email}}", optional: true },
  { label: "טלפון לקוח", token: "{{customer.phone}}", optional: true },
  { label: "שם מוצר", token: "{{order.productName}}", optional: true },
  { label: "וריאנט", token: "{{order.variant}}", optional: true },
  { label: "כמות", token: "{{order.quantity}}", optional: true },
  { label: "סכום ביניים", token: "{{order.subtotal}}", optional: true },
  { label: "הנחה", token: "{{order.discount}}", optional: true },
  { label: "משלוח", token: "{{order.shipping}}", optional: true },
  { label: "מע״מ", token: "{{order.tax}}", optional: true },
  { label: "קישור הזמנה", token: "{{order.viewUrl}}", optional: true },
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
  if (
    key === "store_order_paid" ||
    key === "order_created" ||
    key === "payment_succeeded"
  ) {
    return [...STORE_ORDER_EMAIL_VARIABLES];
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
    phone: "050-0000000",
    source: "אתר",
    optionalDetailsHtml: "<tr><td style=\"padding:6px 0;font-size:15px;line-height:1.6;color:#334155;\"><strong style=\"color:#0f172a;\">טלפון:</strong> 050-0000000</td></tr><tr><td style=\"padding:6px 0;font-size:15px;line-height:1.6;color:#334155;\"><strong style=\"color:#0f172a;\">מקור:</strong> אתר</td></tr>",
    optionalDetailsText: "טלפון: 050-0000000\nמקור: אתר",
  },
  customer: {
    firstName: "דנה",
    fullName: "דנה כהן",
    email: "dana@example.com",
    phone: "050-0000000",
  },
  order: {
    number: "ORD-1001",
    orderNumber: "ORD-1001",
    total: "185.00 ₪",
    items: "חולצה (M) × 2 — 120.00 ₪",
    itemsHtml: "<p>חולצה (M) × 2 — 120.00 ₪</p>",
    totalsHtml: "<p>סה״כ שולם: 185.00 ₪</p>",
    shippingAddress: "תל אביב",
    customerNotes: "E2E",
    viewUrl: "https://www.bizuply.com/order/example",
  },
  store: { name: "BizUply E2E Store", url: "" },
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
            <td dir="rtl" style="padding:28px 28px 28px 28px;color:#1f2937;text-align:right;direction:rtl;">
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

export const STORE_ORDER_CONFIRMATION_SUBJECT =
  "אישור הזמנה {{order.number}} — {{store.name}}";

export const STORE_ORDER_CONFIRMATION_HTML = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>אישור הזמנה</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;" dir="rtl">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:28px 12px;" dir="rtl">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;" dir="rtl">
          <tr>
            <td style="background:#111827;padding:28px;text-align:right;" dir="rtl">
              <div style="font-size:22px;font-weight:800;color:#ffffff;">{{store.name}}</div>
              <div style="margin-top:8px;font-size:13px;color:#d1d5db;">מספר הזמנה: {{order.number}}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;text-align:right;" dir="rtl">
              <h1 style="margin:0 0 14px 0;font-size:22px;color:#111827;">תודה על ההזמנה</h1>
              <p style="margin:0 0 10px;font-size:16px;font-weight:700;">שלום {{customer.firstName}},</p>
              <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#4b5563;">תודה על ההזמנה! התשלום התקבל וההזמנה שלך בהכנה.</p>
              {{order.itemsHtml}}
              <div style="margin-top:28px;color:#374151;font-size:14px;white-space:pre-wrap;">{{order.shippingAddress}}</div>
              <div style="margin-top:28px;">{{order.totalsHtml}}</div>
              <p style="margin:28px 0 0;text-align:center;">
                <a href="{{order.viewUrl}}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:8px;">צפייה בהזמנה</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f9fafb;text-align:center;font-size:12px;color:#9ca3af;">
              המייל נשלח מ־{{store.name}} באמצעות BizUply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const STORE_ORDER_CONFIRMATION_TEXT = `תודה על ההזמנה

שלום {{customer.firstName}},

מספר הזמנה: {{order.number}}
{{store.name}}

{{order.items}}

{{order.shippingAddress}}

סה״כ שולם: {{order.total}}

{{order.viewUrl}}`;

export const STORE_ORDER_CONFIRMATION_EMAIL_DEFAULTS = {
  recipientType: "store_customer_email",
  subject: STORE_ORDER_CONFIRMATION_SUBJECT,
  html: STORE_ORDER_CONFIRMATION_HTML,
  body: STORE_ORDER_CONFIRMATION_HTML,
  text: STORE_ORDER_CONFIRMATION_TEXT,
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
