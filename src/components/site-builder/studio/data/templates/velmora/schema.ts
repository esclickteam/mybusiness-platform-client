import type { StudioTemplateSchema } from "../templateEditorTypes";

export const velmoraSchema: StudioTemplateSchema = {
  sections: [
    {
      id: "header",
      label: "Header",
      description: "לוגו, תפריט וכפתור סל קניות",
      fields: [
        { key: "logoTitle", label: "שם המותג", type: "text" },
        { key: "logoSubtitle", label: "טקסט קטן מתחת ללוגו", type: "text" },
        { key: "cartLabel", label: "טקסט כפתור סל", type: "text" },
      ],
    },
    {
      id: "hero",
      label: "פתיח ראשי",
      description: "הכותרת הראשית והכפתור הראשון באתר",
      fields: [
        { key: "eyebrow", label: "טקסט עליון", type: "text" },
        { key: "title", label: "כותרת ראשית", type: "text" },
        { key: "subtitle", label: "תיאור", type: "textarea" },
        { key: "buttonText", label: "טקסט כפתור", type: "text" },
      ],
    },
    {
      id: "about",
      label: "אודות / סיפור מותג",
      fields: [
        { key: "eyebrow", label: "טקסט עליון", type: "text" },
        { key: "title", label: "כותרת", type: "text" },
        { key: "text", label: "טקסט", type: "textarea" },
        { key: "buttonText", label: "טקסט כפתור", type: "text" },
        { key: "image", label: "תמונה", type: "image" },
      ],
    },
    {
      id: "inspiration",
      label: "בלוק השראה",
      fields: [
        { key: "eyebrow", label: "טקסט עליון", type: "text" },
        { key: "title", label: "כותרת", type: "text" },
        { key: "text", label: "טקסט", type: "textarea" },
        { key: "buttonText", label: "טקסט כפתור", type: "text" },
        { key: "backgroundImage", label: "תמונת רקע", type: "image" },
      ],
    },
    {
      id: "collections",
      label: "קולקציות",
      fields: [{ key: "title", label: "כותרת", type: "text" }],
    },
    {
      id: "customBox",
      label: "סטיילינג אישי",
      fields: [
        { key: "eyebrow", label: "טקסט עליון", type: "text" },
        { key: "title", label: "כותרת", type: "text" },
        { key: "text", label: "טקסט", type: "textarea" },
        { key: "buttonText", label: "טקסט כפתור", type: "text" },
      ],
    },
    {
      id: "gallery",
      label: "גלריה נעה",
      fields: [
        { key: "title", label: "כותרת", type: "text" },
        { key: "speed", label: "מהירות אנימציה", type: "number" },
      ],
    },
    {
      id: "productsStrip",
      label: "מוצרים נבחרים",
      fields: [
        { key: "eyebrow", label: "טקסט עליון", type: "text" },
        { key: "title", label: "כותרת", type: "text" },
        { key: "buttonText", label: "טקסט כפתור", type: "text" },
      ],
    },
    {
      id: "contact",
      label: "יצירת קשר",
      fields: [
        { key: "eyebrow", label: "טקסט עליון", type: "text" },
        { key: "title", label: "כותרת", type: "text" },
        { key: "text", label: "טקסט", type: "textarea" },
        { key: "phone", label: "טלפון", type: "text" },
        { key: "email", label: "אימייל", type: "text" },
        { key: "address", label: "כתובת", type: "text" },
        { key: "buttonText", label: "טקסט כפתור", type: "text" },
      ],
    },
  ],
};