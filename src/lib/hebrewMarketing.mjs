/**
 * Hebrew marketing copy already used in the product UI, plus the public
 * WhatsApp API facts from the English product page ($29 per number, Meta fees separate).
 */

export const HEBREW_MARKETING_PAGES = {
  "/": {
    title: "Bizuply — נהלו את העסק שלכם. במקום אחד.",
    description:
      "פלטפורמה עסקית מודרנית עם עמוד עסקי מקצועי, שיתופי פעולה, CRM ובינה מלאכותית.",
    crumb: "Bizuply",
    h1: "Bizuply",
    paragraphs: [
      "ביזאפלי",
      "נהלו את העסק שלכם במקום אחד.",
      "פלטפורמה עסקית מודרנית עם עמוד עסקי מקצועי, שיתופי פעולה, CRM ובינה מלאכותית.",
    ],
  },
  "/crm": {
    title: "CRM ולידים מ־Meta | Bizuply",
    description:
      "Bizuply הם מפתחי Meta שעברו App Review. חברו Facebook Lead Ads ל־CRM ונהלו לידים, לקוחות ופגישות במקום אחד.",
    crumb: "CRM",
    h1: "כל ליד, כל לקוח, כל פגישה במקום אחד",
    paragraphs: [
      "פניות מ־Facebook, מ־Instagram, מ־Google Ads ומהאתר שלכם נכנסות אוטומטית לצינור אחד עם סטטוס, תיעוד ומשימות. ומשם ממשיכים לתיק לקוח, ליומן תורים ולקטלוג שירותים — באותה מערכת.",
    ],
  },
  "/automations": {
    title: "אוטומציות לעסק | Bizuply",
    description:
      "תזכורות, פולואפים, משימות והתראות שרצות ברקע ומחוברות ל־CRM — כדי שפחות פניות ייפלו בין הכיסאות.",
    crumb: "אוטומציות",
    h1: "אוטומציות לעסק",
    paragraphs: [
      "תזכורות, פולואפים, משימות והתראות שרצות ברקע ומחוברות ל־CRM — כדי שפחות פניות ייפלו בין הכיסאות.",
    ],
  },
  "/appointments": {
    title: "תיאום תורים | Bizuply",
    description: "נהלו יומן תורים, תזכורות ומעקב לקוחות עם מודול התורים של Bizuply.",
    crumb: "תורים",
    h1: "תיאום תורים",
    paragraphs: ["נהלו יומן תורים, תזכורות ומעקב לקוחות עם מודול התורים של Bizuply."],
  },
  "/website-builder": {
    title: "בניית אתרים מקצועיים | Bizuply",
    description:
      "בונים אתר, חנות או אתר עם זימון תורים מתוך 205 תבניות, עורכים בעורך ויזואלי ומפרסמים לדומיין שלכם — כשכל פנייה מהאתר נכנסת ל־CRM.",
    crumb: "בניית אתרים",
    h1: "בונים אתר מקצועי שמביא לקוחות",
    paragraphs: [
      "בוחרים תבנית מתוך 205 תבניות לפי תחום, עורכים כל אלמנט במקום, מוסיפים חנות, יומן ותוספים — ומפרסמים לכתובת שלכם. כל פנייה מהאתר נכנסת ישר לצינור הלידים ב־CRM.",
    ],
  },
  "/whatsapp-api": {
    title: "WhatsApp API לעסקים | Bizuply",
    description:
      "WhatsApp Business API על בסיס WhatsApp Cloud API של Meta. חיבור ל־CRM, לאתר או למערכת שלכם, עם מפתחות API, webhooks חתומים וניהול תבניות. 29 דולר לחודש למספר וואטסאפ מחובר. חיובי ההודעות של Meta נפרדים.",
    crumb: "WhatsApp API",
    h1: "WhatsApp API לעסקים",
    paragraphs: [
      "Bizuply מחברת את WhatsApp Cloud API של Meta לעסק: שליחת תבניות מאושרות, מעקב מסירה ו־webhooks חתומים.",
      "המנוי של Bizuply הוא 29 דולר לחודש עבור מספר וואטסאפ מחובר אחד. חיובי ההודעות של Meta מחויבים בנפרד, ואין כאן ניסיון חינם.",
    ],
  },
};

export function getHebrewMarketingPage(path) {
  return HEBREW_MARKETING_PAGES[path] || null;
}
