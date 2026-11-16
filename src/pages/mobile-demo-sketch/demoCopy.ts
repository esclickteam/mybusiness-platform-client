export type DemoBoardText = {
  days: string[];
  leads: string;
  conversion: string;
  revenue: string;
  tasks: string;
  open: string;
  feed: [string, string, string, string][];
  stages: [string, string, string][];
  pipeline: string;
  source: string;
  next: string;
  nextAction: string;
  chats: string;
  online: string;
  reply: string;
  thread: string[];
  autoTitle: string;
  active: string;
  autoStat: string;
  trigger: string;
  newLead: string;
  condition: string;
  action: string;
  task: string;
  campaign: string;
  spend: string;
  reach: string;
  adOne: string;
  adTwo: string;
  edit: string;
  preview: string;
  publish: string;
  siteLine: string;
  siteCta: string;
  gallery: string;
  navTreatments: string;
  navAbout: string;
  serviceTitle: string;
  serviceOne: string;
  serviceTwo: string;
  titles: string[];
};

const he: DemoBoardText = {
  days: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  leads: "לידים",
  conversion: "המרה",
  revenue: "הכנסה",
  tasks: "משימות",
  open: "פתוחות",
  feed: [
    ["ת", "תמר לוי", "ליד חדש מ־Meta", "עכשיו"],
    ["ד", "דניאל כהן", "פגישה נקבעה", "14:30"],
    ["נ", "נועה ברק", "עסקה נסגרה", "אתמול"],
  ],
  stages: [
    ["חדש", "תמר לוי", "₪4,800"],
    ["בטיפול", "דניאל כהן", "₪6,200"],
    ["פגישה", "נועה ברק", "₪8,900"],
  ],
  pipeline: "בצנרת",
  source: "מקור · Meta",
  next: "הפעולה הבאה",
  nextAction: "שיחת WhatsApp",
  chats: "שיחות",
  online: "מחוברת · Meta",
  reply: "הודעה",
  thread: ["יש תור השבוע?", "מחר ב־10:30.", "מתאים לי", "קבעתי, אישור נשלח."],
  autoTitle: "ליד ממודעה",
  active: "פעיל",
  autoStat: "128 היום · 96%",
  trigger: "טריגר",
  newLead: "ליד חדש",
  condition: "תנאי",
  action: "פעולה",
  task: "משימה",
  campaign: "לידים · תל אביב",
  spend: "הוצאה",
  reach: "חשיפות",
  adOne: "מודעת קוסמטיקה",
  adTwo: "מודעת פגישת היכרות",
  edit: "עריכה",
  preview: "תצוגה",
  publish: "פרסום",
  siteLine: "טיפוח שמרגיש אישי",
  siteCta: "קביעת תור",
  gallery: "גלריה · 12",
  navTreatments: "טיפולים",
  navAbout: "אודות",
  serviceTitle: "הטיפולים",
  serviceOne: "טיפול פנים",
  serviceTwo: "ייעוץ עור",
  titles: ["לוח בקרה", "CRM · צינור", "CRM · כרטיס", "WhatsApp", "אוטומציות", "קמפיינים", "בניית אתרים"],
};

const en: DemoBoardText = {
  days: ["S", "M", "T", "W", "T", "F", "S"],
  leads: "Leads",
  conversion: "Conv.",
  revenue: "Revenue",
  tasks: "Tasks",
  open: "Open",
  feed: [
    ["C", "Claire Bennett", "New Meta lead", "Now"],
    ["J", "James Carter", "Meeting set", "14:30"],
    ["M", "Mia Collins", "Deal closed", "Yesterday"],
  ],
  stages: [
    ["New", "Claire Bennett", "₪4,800"],
    ["Active", "James Carter", "₪6,200"],
    ["Meeting", "Mia Collins", "₪8,900"],
  ],
  pipeline: "Pipeline",
  source: "Source · Meta",
  next: "Next step",
  nextAction: "WhatsApp call",
  chats: "Chats",
  online: "Online · Meta",
  reply: "Message",
  thread: ["Free this week?", "Tomorrow, 10:30.", "That works", "Booked and sent."],
  autoTitle: "Ad lead",
  active: "Live",
  autoStat: "128 today · 96%",
  trigger: "Trigger",
  newLead: "New lead",
  condition: "Rule",
  action: "Action",
  task: "Task",
  campaign: "Leads · Tel Aviv",
  spend: "Spend",
  reach: "Reach",
  adOne: "Skincare ad",
  adTwo: "Intro meeting ad",
  edit: "Edit",
  preview: "Preview",
  publish: "Publish",
  siteLine: "Care that feels personal",
  siteCta: "Book a visit",
  gallery: "Gallery · 12",
  navTreatments: "Treatments",
  navAbout: "About",
  serviceTitle: "Treatments",
  serviceOne: "Facial care",
  serviceTwo: "Skin consult",
  titles: ["Dashboard", "CRM · Pipeline", "CRM · Lead", "WhatsApp", "Automations", "Campaigns", "Website"],
};

export function demoBoardText(language: string): DemoBoardText {
  return language.toLowerCase().startsWith("he") ? he : en;
}

export function demoTextValues(copy: DemoBoardText): string[] {
  const values: string[] = [];
  const walk = (value: unknown) => {
    if (typeof value === "string") values.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk(copy);
  return values;
}
