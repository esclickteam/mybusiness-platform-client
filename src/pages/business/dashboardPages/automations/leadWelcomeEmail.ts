export const LEAD_WELCOME_SUBJECT = "תודה שפנית אל {{business.name}}";
export const LEAD_OPENING_SUBJECT = "תודה על הפנייה";

export const LEAD_WELCOME_HTML = "<!DOCTYPE html>\n<html lang=\"he\" dir=\"rtl\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>קיבלנו את פנייתך</title>\n</head>\n<body style=\"margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;\">\n  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f6fb;padding:24px 12px;\">\n    <tr>\n      <td align=\"center\">\n        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8ecf4;\">\n          <tr>\n            <td dir=\"rtl\" style=\"padding:28px 28px 28px 28px;color:#1f2937;text-align:right;direction:rtl;\">\n              <h1 style=\"margin:0 0 14px 0;font-size:22px;line-height:1.35;color:#4f46e5;\">קיבלנו את פנייתך</h1>\n              <p style=\"margin:0 0 12px 0;font-size:16px;line-height:1.7;\">שלום {{lead.name}},</p>\n              <p style=\"margin:0 0 18px 0;font-size:16px;line-height:1.7;\">\n                תודה שפנית אל <strong>{{business.name}}</strong>. קיבלנו את פנייתך ונחזור אליך בהקדם.\n              </p>\n              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 0 18px 0;\">\n                {{lead.optionalDetailsHtml}}\n              </table>\n              <p style=\"margin:0;font-size:15px;line-height:1.7;\">\n                בברכה,<br/>\n                <strong>{{business.name}}</strong>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td dir=\"rtl\" style=\"padding:14px 28px 22px 28px;background:#fafbff;border-top:1px solid #eef1f7;color:#94a3b8;font-size:12px;text-align:center;direction:rtl;\">\n              מופעל באמצעות Bizuply\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>";
export const LEAD_OPENING_HTML = "<!DOCTYPE html>\n<html lang=\"he\" dir=\"rtl\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>תודה על הפנייה</title>\n</head>\n<body style=\"margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;\">\n  <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f4f6fb;padding:24px 12px;\">\n    <tr>\n      <td align=\"center\">\n        <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e8ecf4;\">\n          <tr>\n            <td dir=\"rtl\" style=\"padding:28px 28px 28px 28px;color:#1f2937;text-align:right;direction:rtl;\">\n              <h1 style=\"margin:0 0 14px 0;font-size:22px;line-height:1.35;color:#4f46e5;\">תודה שפנית אלינו</h1>\n              <p style=\"margin:0 0 12px 0;font-size:16px;line-height:1.7;\">שלום {{lead.name}},</p>\n              <p style=\"margin:0 0 18px 0;font-size:16px;line-height:1.7;\">\n                שמחנו לקבל את פנייתך אל <strong>{{business.name}}</strong>. נחזור אליך בהקדם עם כל הפרטים.\n              </p>\n              <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin:0 0 18px 0;\">\n                {{lead.optionalDetailsHtml}}\n              </table>\n              <p style=\"margin:0;font-size:15px;line-height:1.7;\">\n                בברכה,<br/>\n                <strong>{{business.name}}</strong>\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td dir=\"rtl\" style=\"padding:14px 28px 22px 28px;background:#fafbff;border-top:1px solid #eef1f7;color:#94a3b8;font-size:12px;text-align:center;direction:rtl;\">\n              מופעל באמצעות Bizuply\n            </td>\n          </tr>\n        </table>\n      </td>\n    </tr>\n  </table>\n</body>\n</html>";

export const LEAD_WELCOME_TEXT = "קיבלנו את פנייתך\n\nשלום {{lead.name}},\n\nתודה שפנית אל {{business.name}}. קיבלנו את פנייתך ונחזור אליך בהקדם.\n{{lead.optionalDetailsText}}\n\nבברכה,\n{{business.name}}";
export const LEAD_OPENING_TEXT = "תודה שפנית אלינו\n\nשלום {{lead.name}},\n\nשמחנו לקבל את פנייתך אל {{business.name}}. נחזור אליך בהקדם עם כל הפרטים.\n{{lead.optionalDetailsText}}\n\nבברכה,\n{{business.name}}";

export const LEAD_WELCOME_EMAIL_DEFAULTS = {
  recipientType: "lead_email",
  subject: LEAD_WELCOME_SUBJECT,
  html: LEAD_WELCOME_HTML,
  body: LEAD_WELCOME_HTML,
  text: LEAD_WELCOME_TEXT,
};

export const LEAD_OPENING_EMAIL_DEFAULTS = {
  recipientType: "lead_email",
  subject: LEAD_OPENING_SUBJECT,
  html: LEAD_OPENING_HTML,
  body: LEAD_OPENING_HTML,
  text: LEAD_OPENING_TEXT,
};

export const REQUIRED_LEAD_EMAIL_TOKENS = [
  "{{lead.name}}",
  "{{business.name}}",
] as const;
