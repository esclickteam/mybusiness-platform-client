export const villaireSchema = {
  id: "villaire",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת קולנועית", type: "text" },
    { key: "heroSubtitle", label: "תיאור הירו", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו 21:9", type: "image" },
    { key: "featuredTitle", label: "שם הוילה המרכזית", type: "text" },
    { key: "featuredImage", label: "תמונת וילה מרכזית", type: "image" },
    { key: "principlesTitle", label: "כותרת עקרונות", type: "text" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "text" },
    { key: "cta", label: "טקסט כפתור", type: "text" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
  ],
};
