export type CrmShowcaseScreen = {
  id: string;
  title: string;
  label: string;
  accent: string;
  accentSoft: string;
};

export const crmShowcaseScreens: CrmShowcaseScreen[] = [
  {
    id: "leads",
    title: "ניהול לידים",
    label: "לידים מ־Meta",
    accent: "#6d28d9",
    accentSoft: "#c4b5fd",
  },
  {
    id: "lead-detail",
    title: "כרטיס ליד",
    label: "פעילות ומעקב",
    accent: "#2563eb",
    accentSoft: "#93c5fd",
  },
  {
    id: "notifications",
    title: "מרכז התראות",
    label: "לידים בזמן אמת",
    accent: "#0ea5e9",
    accentSoft: "#7dd3fc",
  },
  {
    id: "clients",
    title: "ניהול לקוחות",
    label: "דשבורד פרימיום",
    accent: "#7c3aed",
    accentSoft: "#ddd6fe",
  },
  {
    id: "customer",
    title: "פרופיל לקוח",
    label: "תיעוד ומשימות",
    accent: "#5b21b6",
    accentSoft: "#c4b5fd",
  },
  {
    id: "calendar",
    title: "יומן פגישות",
    label: "תורים מסונכרנים",
    accent: "#4f46e5",
    accentSoft: "#a5b4fc",
  },
];
