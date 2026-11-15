/**
 * Draft for legal review. Not rendered on /privacy and not a published policy.
 * Activate the banner copy only after counsel approves it and the flag is on.
 */

export const PUBLIC_ANALYTICS_LEGAL_DRAFT = {
  status: "draft_for_legal_review",
  published: false,
  he: {
    cookie: "מדידת התוכן הציבורי באתר ביזאפלי פועלת רק אחרי מתג אנליטיקס שנשאר כבוי עד לבחירה מפורשת. היא נפרדת מעוגיית הפרסום של Meta. נשמרים סוג האירוע, נתיב בלי פרמטרים, שפה, מזהה אקראי, מזהה ביקור, מארח המפנה, סוג מכשיר, וקוד מדינה אם רשת ההפצה מוסרת אותו. לא נשמרים שם, דוא״ל, טלפון, תוכן טפסים, סכומי מחשבון או כתובת IP. הרשומות נמחקות אחרי 180 יום. ביטול ההסכמה מוחק את רשומות המזהה שבדפדפן ומפסיק אירועים חדשים. הגישה לדוח היא למנהלי הפלטפורמה בלבד.",
    privacy: "אם המבקר אישר מדידה, ביזאפלי שומרת אירועי תוכן מהאתר הציבורי באוסף נפרד מנתוני האתרים של לקוחות. המטרה היא להבין אילו מדריכים נקראים ואילו מהם קודמים לפנייה או הרשמה. אין במדידה הזו מעקב פרסומי, ואין חיבור של המספרים אל דוח Search Console כאילו הם אותו קהל.",
  },
  en: {
    cookie: "Public content measurement on Bizuply runs only after the analytics switch, which stays off until an explicit choice. It is separate from the Meta advertising cookie. The record stores the event, a path without parameters, the language, a random identifier, a visit identifier, the referring host, the device type, and a country code when the edge network provides one. It does not store a name, email, phone, form contents, calculator amounts, or an IP address. Records are deleted after 180 days. Withdrawing consent deletes the records for that browser identifier and stops new events. The report is available only to platform administrators.",
    privacy: "When a visitor allows measurement, Bizuply stores public-site content events in a collection separate from customer-website analytics. The purpose is to see which guides are read and which precede an inquiry or registration. This measurement is not advertising, and its counts are not combined with Search Console as if they were the same audience.",
  },
};
