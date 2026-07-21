export const parcelSchema = {
  templateId: "parcel",
  name: "Parcel",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "טקסט הירו", type: "textarea" },
    { key: "heroPrimary", label: "כפתור ראשי", type: "text" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "bandOneTitle", label: "פס 1 - כותרת", type: "text" },
    { key: "bandOneText", label: "פס 1 - טקסט", type: "textarea" },
    { key: "bandOneImage", label: "פס 1 - תמונה", type: "image" },
    { key: "aboutTitle", label: "כותרת אודות", type: "textarea" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "address", label: "כתובת", type: "text" }
  ],
};
