export const salonixSchema = {
  templateId: "salonix",
  name: "Salonix",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "servicesTitle", label: "כותרת שירותים", type: "text" },
    { key: "servicesSubtitle", label: "תת-כותרת שירותים", type: "textarea" },
    { key: "welcomeTitle", label: "כותרת welcome", type: "textarea" },
    { key: "welcomeText", label: "טקסט welcome", type: "textarea" },
    { key: "welcomeImage", label: "תמונת welcome", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "aboutText", label: "טקסט אודות", type: "textarea" },
    { key: "galleryTitle", label: "כותרת גלריה", type: "text" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "text" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "address", label: "כתובת", type: "text" },
  ],
};
