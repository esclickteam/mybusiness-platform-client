/** WhatsApp API sales guides. Facts match the shipped product. No ranking claims. */

function pack(en, he) {
  return {
    en,
    he,
    es: en,
    "pt-BR": en,
    ar: en,
  };
}

function guide(title, description, h1, sections, faq) {
  return { title, description, h1, updated: "2026-10-30", sections, faq };
}

const ARTICLES = {
  "connect-whatsapp-business-platform": pack(
    guide(
      "How to connect WhatsApp Business Platform in Bizuply | Bizuply",
      "Pay $29/month for one number, then connect it with Meta Embedded Signup. Meta still reviews the display name.",
      "Connect a WhatsApp number in Bizuply",
      [
        ["The short path", ["Create the WhatsApp API account on Get Started and pay $29/month for one number. Open WhatsApp → Connection and start Meta Embedded Signup. Verify the number by SMS or voice call."]],
        ["What Meta still does", ["Meta reviews the display name and may ask for business verification. Messaging limits start low and rise with quality. Bizuply does not add an approval queue and cannot skip those checks."]],
        ["Before you move a live number", ["If the number is already in the WhatsApp or WhatsApp Business app, write to support@bizuply.com first. Do not disconnect a customer-facing number without a plan."]],
      ],
      [["Is there a trial?", "No. The subscription starts at $29 per month for one number. Meta messaging charges are separate."]]
    ),
    guide(
      "איך מחברים WhatsApp Business Platform בביזאפלי | ביזאפלי",
      "משלמים 29 דולר לחודש למספר אחד, ואז מחברים ב־Embedded Signup של Meta. Meta עדיין בודקת את שם התצוגה.",
      "חיבור מספר וואטסאפ בביזאפלי",
      [
        ["המסלול הקצר", ["יוצרים חשבון WhatsApp API ומשלמים 29 דולר לחודש למספר אחד. פותחים וואטסאפ → חיבור ומתחילים Embedded Signup. מאמתים את המספר ב־SMS או בשיחה."]],
        ["מה Meta עדיין עושה", ["Meta בודקת את שם התצוגה ועשויה לבקש אימות עסק. מגבלות השליחה מתחילות נמוך. ביזאפלי לא מוסיפה תור אישורים."]],
        ["לפני שמזיזים מספר חי", ["אם המספר באפליקציה, כותבים ל־support@bizuply.com קודם. לא מנתקים מספר של לקוחות בלי תכנון."]],
      ],
      [["יש ניסיון חינם?", "אין. המנוי מתחיל ב־29 דולר לחודש למספר אחד. חיובי Meta נפרדים."]]
    )
  ),
  "whatsapp-app-vs-api": pack(
    guide(
      "WhatsApp Business app vs Cloud API | Bizuply",
      "The phone app is for one person tapping messages. The Cloud API lets a CRM or backend send approved templates and share an inbox.",
      "What changes when you leave the phone app",
      [
        ["The app", ["WhatsApp Business on a phone is one device, one operator, and no shared inbox. It is not the Cloud API."]],
        ["The API in Bizuply", ["$29/month connects one number. Your systems send approved templates through the REST API. Replies stay in the Bizuply inbox. Status webhooks do not yet include those replies."]],
        ["Limits", ["A number already on the app may need a migration Meta supports. Quality ratings and opt-in rules stay with Meta."]],
      ],
      [["Does $29 include Meta's message fees?", "No. Meta bills by country and category to the payment method on the WhatsApp Business Account."]]
    ),
    guide(
      "אפליקציית WhatsApp Business מול Cloud API | ביזאפלי",
      "האפליקציה בטלפון מיועדת לאדם אחד. ה־Cloud API מאפשר ל־CRM או לשרת לשלוח תבניות מאושרות ולשתף תיבה.",
      "מה משתנה כשעוזבים את האפליקציה",
      [
        ["האפליקציה", ["WhatsApp Business בטלפון הוא מכשיר אחד, מפעיל אחד, בלי תיבה משותפת. זה לא Cloud API."]],
        ["ה־API בביזאפלי", ["29 דולר לחודש מחברים מספר אחד. המערכות שולחות תבניות מאושרות. תשובות נשארות בתיבה. webhooks עדיין לא כוללים אותן."]],
        ["מגבלות", ["מספר שכבר באפליקציה עשוי לדרוש העברה ש־Meta תומכת בה. דירוג איכות והסכמה נשארים אצל Meta."]],
      ],
      [["האם 29 הדולר כוללים את חיובי Meta?", "לא. Meta מחייבת לפי מדינה וקטגוריה לאמצעי התשלום בחשבון WhatsApp Business."]]
    )
  ),
  "whatsapp-conversations-in-bizuply": pack(
    guide(
      "How to manage WhatsApp conversations in Bizuply | Bizuply",
      "Replies open in the Bizuply inbox. Starting a chat outside the 24-hour window needs an approved template on a paid number.",
      "The inbox, the 24-hour window, and templates",
      [
        ["Where replies live", ["Customer replies appear in WhatsApp inbox. They are not posted to your webhook yet. Use Send test webhook only to check status events."]],
        ["When you can type freely", ["Inside the 24-hour customer-service window you reply from the inbox. Outside it, send an approved template."]],
        ["How to test", ["After a template is approved, open Connection and send a test to a number you own. Confirm consent. Meta may charge that send."]],
      ],
      [["Can one screen hold every client number?", "Not yet. Each number has its own workspace, $29 subscription, API key and webhook."]]
    ),
    guide(
      "איך מנהלים שיחות וואטסאפ בביזאפלי | ביזאפלי",
      "תשובות נפתחות בתיבה. פתיחת שיחה מחוץ לחלון 24 השעות דורשת תבנית מאושרת על מספר בתשלום.",
      "התיבה, חלון 24 השעות והתבניות",
      [
        ["איפה התשובות", ["תשובות לקוחות בתיבת וואטסאפ. הן עדיין לא נשלחות ל־webhook. Send test webhook בודק רק אירועי סטטוס."]],
        ["מתי אפשר לכתוב חופשי", ["בתוך חלון 24 השעות עונים מהתיבה. מחוץ לו שולחים תבנית מאושרת."]],
        ["איך בודקים", ["אחרי אישור תבנית, פותחים חיבור ושולחים בדיקה למספר שלכם. מאשרים הסכמה. Meta עשויה לחייב."]],
      ],
      [["אפשר מסך אחד לכל מספרי הלקוחות?", "עדיין לא. לכל מספר יש סביבה, מנוי 29 דולר, מפתח ו־webhook."]]
    )
  ),
};

export const WHATSAPP_SALES_GUIDE_SLUGS = Object.keys(ARTICLES);

export function getWhatsAppSalesGuide(slug, locale) {
  const row = ARTICLES[slug];
  if (!row) return null;
  return row[locale] || row.en;
}
