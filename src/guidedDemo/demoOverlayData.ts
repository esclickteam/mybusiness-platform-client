export const DEMO_DASHBOARD_OVERLAY = {
  website: {
    totalViews: 184,
    uniqueVisitors: 63,
    viewsChange: 18,
    viewsSeries: [18, 21, 19, 24, 28, 31, 27, 33, 36, 34, 39, 42, 40, 44],
  },
  leads: {
    newCount: 8,
    untreatedCount: 3,
    quotedCount: 2,
    closedCount: 1,
    change: 22,
    series: [2, 3, 2, 4, 5, 6, 5, 7, 8, 6, 7, 8, 9, 8],
  },
  reviews: {
    averageRating: 4.8,
    totalCount: 12,
    newCount: 3,
    change: 9,
    series: [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8],
  },
  collaborations: {
    totalInPeriod: 4,
    newInPeriod: 2,
    change: 14,
    series: [1, 1, 2, 2, 3, 3, 4],
  },
};

export const DEMO_ACTIVITY_TIMELINE = [
  { id: "a1", time: "לפני 20 דקות", text: "ליד חדש נכנס מטופס האתר — דניאל כהן" },
  { id: "a2", time: "היום 09:10", text: "פגישת מעקב נקבעה עם יעל אברהם" },
  { id: "a3", time: "אתמול", text: "נשלחה הצעת מחיר לרון שמש" },
  { id: "a4", time: "לפני יומיים", text: "משימה הושלמה: לחזור ללקוחה מאיה" },
  { id: "a5", time: "השבוע", text: "12 ביקורות חדשות · דירוג ממוצע 4.8" },
];

export const DEMO_COLLAB_PARTNERS = [
  {
    _id: "demo-partner-florista",
    businessName: "פלוריסטה — עיצוב פרחים לאירועים",
    category: "עיצוב אירועים",
    description: "סידורי פרחים לצילומי זוגיות וחתונות קטנות בתל אביב.",
    city: "תל אביב",
    area: "מרכז",
    complementaryCategories: ["צילום", "אירועים"],
  },
  {
    _id: "demo-partner-makeup",
    businessName: "נועה גל — איפור כלות",
    category: "איפור",
    description: "איפור טבעי לסשנים בסטודיו. מחפשת שיתופי פעולה עם צלמים.",
    city: "גבעתיים",
    area: "גוש דן",
    complementaryCategories: ["צילום", "יופי"],
  },
  {
    _id: "demo-partner-venue",
    businessName: "החצר הקטנה",
    category: "מתחם אירועים",
    description: "גינה אורבנית עד 40 אורחים — מתאימה לצילומי משפחה.",
    city: "יפו",
    area: "תל אביב-יפו",
    complementaryCategories: ["צילום", "אירועים"],
  },
];

export const DEMO_ADVISOR_RECOMMENDATION = {
  title: "המלצה השבוע",
  body: "יש 3 לידים חדשים שעדיין לא קיבלו מענה. מומלץ ליצור איתם קשר היום — זו הזדמנות חמה שאפשר לפספס אם מחכים.",
  actionLabel: "טפלו בלידים שלא נענו",
  resultTitle: "התוצאה",
  resultBody: "סומנו 3 לידים למעקב. בדמו לא נשלחה הודעה אמיתית ולא נוצר תיק לקוח אמיתי.",
};
