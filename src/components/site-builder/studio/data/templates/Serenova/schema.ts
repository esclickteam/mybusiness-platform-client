export const serenovaSchema = {
  templateId: "serenova",
  name: "Serenova",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "logoText", label: "טקסט לוגו", type: "text" },

    { key: "heroEyebrow", label: "כותרת קטנה בהירו", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "טקסט הירו", type: "textarea" },
    { key: "heroPrimaryButton", label: "כפתור ראשי", type: "text" },
    { key: "heroSecondaryButton", label: "כפתור משני", type: "text" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },

    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "aboutText", label: "טקסט אודות", type: "textarea" },
    { key: "aboutImage", label: "תמונת אודות", type: "image" },

    { key: "servicesTitle", label: "כותרת שירותים", type: "textarea" },
    { key: "pricingTitle", label: "כותרת מחירון", type: "textarea" },
    { key: "galleryTitle", label: "כותרת גלריה", type: "textarea" },
    { key: "blogTitle", label: "כותרת מאמרים", type: "textarea" },
    { key: "faqTitle", label: "כותרת שאלות", type: "textarea" },

    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "contactText", label: "טקסט יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "address", label: "כתובת", type: "text" },

    { key: "ctaTitle", label: "כותרת CTA", type: "textarea" },
    { key: "ctaText", label: "טקסט CTA", type: "textarea" },
    { key: "ctaButton", label: "כפתור CTA", type: "text" },
  ],
};