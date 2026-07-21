export const horizonSchema = {
  templateId: "horizon",
  name: "Horizon",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "תת-כותרת", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "aboutText", label: "טקסט אודות", type: "textarea" },
    { key: "servicesTitle", label: "כותרת שירותים", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
