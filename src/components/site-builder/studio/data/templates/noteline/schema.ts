export const notelineSchema = {
  templateId: "noteline",
  name: "Noteline",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "טקסט הירו", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "heroPrimaryButton", label: "כפתור ראשי", type: "text" },
    { key: "sectionTwoTitle", label: "כותרת קורסים", type: "text" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "ctaTitle", label: "כותרת CTA", type: "textarea" },
  ],
};
