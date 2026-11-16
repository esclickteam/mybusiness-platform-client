/**
 * Draft for legal review. Not rendered on /privacy and not a published policy.
 * Activate the banner copy only after counsel approves it and the flag is on.
 */

export const PUBLIC_ANALYTICS_LEGAL_DRAFT = {
  status: "draft_for_legal_review",
  published: false,
  he: {
    cookie: "מדידת התוכן הציבורי באתר ביזאפלי פועלת רק אחרי מתג אנליטיקס שנשאר כבוי עד לבחירה מפורשת. בחירה ישנה לפרסום או לעוגיות הכרחיות אינה אישור למדידה. המדידה נפרדת מעוגיית הפרסום של Meta. נשמרים סוג האירוע, נתיב בלי פרמטרים, שפה, מזהה אקראי, מזהה ביקור, מארח המפנה, סוג מכשיר, וקוד מדינה אם רשת ההפצה מוסרת אותו. המזהה האקראי הוא מזהה מקוון של הדפדפן, והנתונים אינם אנונימיים לחלוטין: אפשר לקשור אירועים לאותו דפדפן עד למחיקה. לא נשמרים שם, דוא״ל, טלפון, תוכן טפסים, סכומי מחשבון או כתובת IP. MongoDB מוחקת את הרשומות 180 יום אחרי שנשמרו. ביטול ההסכמה מוחק את רשומות המזהה שבדפדפן גם אם איסוף האירועים כבוי, ואינו יוצר מזהה חדש. הגישה לדוח היא למנהלי הפלטפורמה בלבד.",
    privacy: "אם המבקר אישר במפורש מדידת אנליטיקס, ביזאפלי שומרת אירועי תוכן מהאתר הציבורי באוסף נפרד מנתוני האתרים של לקוחות. המזהה שבשימוש הוא מזהה מקוון אקראי, לא שם של אדם, ולכן הנתונים אינם אנונימיים לחלוטין. המטרה היא להבין אילו מדריכים נקראים ואילו מהם קודמים לפנייה או הרשמה. הרשמה משויכת לתוכן רק אם נרשמה קודם צפייה באותו תוכן תחת אותה הסכמה. אין במדידה הזו מעקב פרסומי, ואין חיבור של המספרים אל דוח Search Console כאילו הם אותו קהל. הרשומות נמחקות אוטומטית אחרי 180 יום, וגם מיד עם ביטול ההסכמה.",
  },
  en: {
    cookie: "Public content measurement on Bizuply runs only after the analytics switch, which stays off until an explicit choice. An older choice about advertising or necessary cookies is not consent to this measurement. It is separate from the Meta advertising cookie. The record stores the event, a path without parameters, the language, a random identifier, a visit identifier, the referring host, the device type, and a country code when the edge network provides one. That random identifier is an online identifier for the browser, so the records are not fully anonymous: events can be connected to the same browser until they are deleted. It does not store a name, email, phone, form contents, calculator amounts, or an IP address. MongoDB deletes each record 180 days after it was stored. Withdrawing consent deletes the records for that browser identifier even when collection is switched off, and it does not create a new identifier. The report is available only to platform administrators.",
    privacy: "When a visitor explicitly allows analytics, Bizuply stores public-site content events in a collection separate from customer-website analytics. The identifier is a random online identifier, not a person's name, and the records are therefore not fully anonymous. The purpose is to see which guides are read and which precede an inquiry or registration. A registration is attributed to content only when a view of that content was already stored under the same consent. This measurement is not advertising, and its counts are not combined with Search Console as if they were the same audience. Records are deleted automatically after 180 days, and also immediately when consent is withdrawn.",
  },
};
