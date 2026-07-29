export type WebsiteTypeBlock = {
  id: string;
  label: string;
  /** Short teaser until full examples/explanations are added */
  teaser: string;
  templateId: string;
  templateTitle: string;
  from: "right" | "left";
  accent: string;
  accentSoft: string;
};

export const websiteTypeBlocks: WebsiteTypeBlock[] = [
  {
    id: "branding",
    label: "אתר תדמית",
    teaser: "נוכחות מקצועית שמספרת את הסיפור של העסק ובונה אמון מהמבט הראשון.",
    templateId: "brandforge",
    templateTitle: "Brandforge",
    from: "right",
    accent: "#111827",
    accentSoft: "#F59E0B",
  },
  {
    id: "store",
    label: "אתר חנות",
    teaser: "חנות אונליין עם קטלוג, עמוד מוצר וסל קניות — מוכנה למכור.",
    templateId: "velmora",
    templateTitle: "Velmora",
    from: "left",
    accent: "#9A6F3B",
    accentSoft: "#E7C9A0",
  },
  {
    id: "booking",
    label: "אתר זימון פגישות",
    teaser: "תורים, שירותים ומחירים במקום אחד — הלקוח קובע לבד.",
    templateId: "lunelle",
    templateTitle: "Lunelle",
    from: "right",
    accent: "#2A171C",
    accentSoft: "#E8B8C1",
  },
  {
    id: "real-estate",
    label: "אתר נדל״ן",
    teaser: "נכסים, סוכנים ופניות — תצוגה פרימיום שמובילה ללידים.",
    templateId: "brokeria",
    templateTitle: "Brokeria",
    from: "left",
    accent: "#C9A962",
    accentSoft: "#E8D5A3",
  },
  {
    id: "restaurant",
    label: "אתר מסעדה",
    teaser: "תפריט, אווירה והזמנת שולחן — חוויה שמזמינה להגיע.",
    templateId: "aurelia",
    templateTitle: "Aurelia",
    from: "right",
    accent: "#8B1E3F",
    accentSoft: "#E8B4B8",
  },
  {
    id: "courses",
    label: "אתר קורסים",
    teaser: "קורסים, סילבוס ומרצים — פלטפורמה שמוכרת למידה.",
    templateId: "lectora",
    templateTitle: "Lectora",
    from: "left",
    accent: "#1D4ED8",
    accentSoft: "#93C5FD",
  },
];
