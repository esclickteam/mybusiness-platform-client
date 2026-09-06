import i18n from "../i18n/i18n";

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

function overlayText(key: string, fallback: string) {
  return String(i18n.t(`leftover.demoOverlay.${key}`, fallback));
}

export function getDemoActivityTimeline() {
  return [
    {
      id: "a1",
      time: overlayText("time20m", "לפני 20 דקות"),
      text: overlayText("a1", "ליד חדש נכנס מטופס האתר — דניאל כהן"),
    },
    {
      id: "a2",
      time: overlayText("timeToday", "היום 09:10"),
      text: overlayText("a2", "פגישת מעקב נקבעה עם יעל אברהם"),
    },
    {
      id: "a3",
      time: overlayText("yesterday", "אתמול"),
      text: overlayText("a3", "נשלחה הצעת מחיר לרון שמש"),
    },
    {
      id: "a4",
      time: overlayText("twoDays", "לפני יומיים"),
      text: overlayText("a4", "משימה הושלמה: לחזור ללקוחה מאיה"),
    },
    {
      id: "a5",
      time: overlayText("thisWeek", "השבוע"),
      text: overlayText("a5", "12 ביקורות חדשות · דירוג ממוצע 4.8"),
    },
  ];
}

export function getDemoCollabPartners() {
  return [
    {
      _id: "demo-partner-florista",
      businessName: overlayText("p1Name", "פלוריסטה — עיצוב פרחים לאירועים"),
      category: overlayText("p1Cat", "עיצוב אירועים"),
      description: overlayText(
        "p1Desc",
        "סידורי פרחים לצילומי זוגיות וחתונות קטנות בתל אביב."
      ),
      city: overlayText("p1City", "תל אביב"),
      area: overlayText("p1Area", "מרכז"),
      complementaryCategories: [overlayText("photo", "צילום"), overlayText("events", "אירועים")],
    },
    {
      _id: "demo-partner-makeup",
      businessName: overlayText("p2Name", "נועה גל — איפור כלות"),
      category: overlayText("p2Cat", "איפור"),
      description: overlayText(
        "p2Desc",
        "איפור טבעי לסשנים בסטודיו. מחפשת שיתופי פעולה עם צלמים."
      ),
      city: overlayText("p2City", "גבעתיים"),
      area: overlayText("p2Area", "גוש דן"),
      complementaryCategories: [overlayText("photo", "צילום"), overlayText("beauty", "יופי")],
    },
    {
      _id: "demo-partner-venue",
      businessName: overlayText("p3Name", "החצר הקטנה"),
      category: overlayText("p3Cat", "מתחם אירועים"),
      description: overlayText(
        "p3Desc",
        "גינה אורבנית עד 40 אורחים — מתאימה לצילומי משפחה."
      ),
      city: overlayText("p3City", "יפו"),
      area: overlayText("p3Area", "תל אביב-יפו"),
      complementaryCategories: [overlayText("photo", "צילום"), overlayText("events", "אירועים")],
    },
  ];
}

export function getDemoAdvisorRecommendation() {
  return {
    title: overlayText("recTitle", "המלצה השבוע"),
    question: overlayText("recQuestion", "אילו לידים כדאי לי לחזור אליהם היום?"),
    answer: overlayText(
      "recAnswer",
      "יש לך 3 לידים חדשים שעדיין לא קיבלו מענה. מומלץ להתחיל משני הלידים שהגיעו מ־Meta כי הם החדשים ביותר."
    ),
    body: overlayText(
      "recBody",
      "יש 3 לידים חדשים שעדיין לא קיבלו מענה. מומלץ ליצור איתם קשר היום — זו הזדמנות חמה שאפשר לפספס אם מחכים."
    ),
    actionLabel: overlayText("recAction", "פתחו את רשימת הלידים הרלוונטיים"),
    resultTitle: overlayText("recResultTitle", "התוצאה"),
    resultBody: overlayText(
      "recResultBody",
      "נפתחה רשימת 3 הלידים שכדאי לחזור אליהם היום. בדמו לא נשלחה הודעה אמיתית."
    ),
  };
}

export function getDemoAdvisorChat() {
  const recommendation = getDemoAdvisorRecommendation();
  return {
    question: recommendation.question,
    answer: recommendation.answer,
    actionLabel: recommendation.actionLabel,
    resultTitle: recommendation.resultTitle,
    resultBody: recommendation.resultBody,
  };
}
