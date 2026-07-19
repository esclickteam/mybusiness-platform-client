const dashboardDemoInsights = [
  {
    id: "followup_needed",
    type: "followup",
    title: "נדרש מעקב אחרי לקוחות",
    description:
      "שלחתם הודעות ללקוחות לפני יותר מ-48 שעות ועדיין לא קיבלתם תשובה.",
    actionLabel: "שליחת מעקב",
    priority: "high",
    metric: {
      value: 2,
      label: "שיחות",
    },
    meta: {
      conversations: ["demo-conv-1", "demo-conv-2"],
      stateHash: "demo_followup_2",
    },
  },
  {
    id: "untreated_leads",
    type: "leads",
    title: "יש לידים שלא טופלו",
    description: "לידים חדשים ממתינים ב-CRM — כדאי ליצור קשר בהקדם.",
    actionLabel: "צפייה בלידים",
    priority: "high",
    metric: {
      value: 3,
      label: "לידים חדשים",
    },
    meta: {
      stateHash: "demo_leads_3",
    },
  },
  {
    id: "clients_without_appointments",
    type: "revenue",
    title: "לקוחות שעדיין לא קבעו תור",
    description:
      "יש לקוחות שנוספו לאחרונה ועדיין אין להם תור קרוב.",
    actionLabel: "הזמנה לקביעת תור",
    priority: "medium",
  },
  {
    id: "no_published_website",
    type: "website",
    title: "פרסמו את האתר שלכם",
    description:
      "עדיין אין אתר מפורסם — בניית אתר תעזור לקבל לידים ולחשוף את העסק.",
    actionLabel: "בניית אתר",
    priority: "medium",
  },
  {
    id: "missing_seo",
    type: "seo",
    title: "השלימו הגדרות SEO",
    description:
      'לאתר "האתר שלי" חסרות הגדרות SEO — כותרת, תיאור או תמונה לשיתוף.',
    actionLabel: "עריכת SEO",
    priority: "medium",
    meta: {
      siteId: "demo-site-id",
      stateHash: "demo_missing_seo",
    },
  },
];

export default dashboardDemoInsights;
