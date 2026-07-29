export type CrmTopicSection = {
  id: "leads" | "clients" | "appointments";
  eyebrow: string;
  title: string;
  text: string;
  primary: string;
  gallery: Array<{
    src: string;
    frame: "wide" | "phone";
  }>;
  accent: string;
};

export const crmTopicSections: CrmTopicSection[] = [
  {
    id: "leads",
    eyebrow: "לידים",
    title: "ניהול לידים מקצה לקצה",
    text: "קליטה מ־Meta, מ־Google ומהאתר, סטטוסים, משימות, כרטיס ליד ומרכז התראות — כל צינור המכירות במקום אחד",
    primary: "/leads1.jpeg",
    gallery: [
      { src: "/leads2.jpeg", frame: "wide" },
      { src: "/leads3.jpeg", frame: "phone" },
    ],
    accent: "#6d28d9",
  },
  {
    id: "clients",
    eyebrow: "לקוחות",
    title: "ניהול לקוחות פרימיום",
    text: "מאגר לקוחות, תיק מלא, שדות מותאמים ותיעוד שוטף עם מסמכים שממשיך אחרי הסגירה",
    primary: "/leads4.jpeg",
    gallery: [{ src: "/leads5.jpeg", frame: "wide" }],
    accent: "#2563eb",
  },
  {
    id: "appointments",
    eyebrow: "פגישות",
    title: "יומן פגישות מסונכרן",
    text: "תורים, סטטוסי תשלום ויומן חי שמחוברים ללקוחות ולקטלוג השירותים של העסק",
    primary: "/leads7.jpeg",
    gallery: [{ src: "/leads6.jpeg", frame: "wide" }],
    accent: "#4f46e5",
  },
];
