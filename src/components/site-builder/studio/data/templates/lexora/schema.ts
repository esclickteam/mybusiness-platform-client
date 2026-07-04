export const lexoraSchema = {
  sections: [
    {
      id: "brand",
      label: "מותג",
      fields: [
        { id: "name", label: "שם העסק", type: "text" },
        { id: "logoText", label: "אות בלוגו", type: "text" },
        { id: "badge", label: "תגית", type: "text" },
      ],
    },
    {
      id: "hero",
      label: "פתיח",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
        { id: "image", label: "תמונת רקע", type: "image" },
        { id: "primaryButton", label: "כפתור ראשי", type: "text" },
        { id: "secondaryButton", label: "כפתור משני", type: "text" },
      ],
    },
    {
      id: "services",
      label: "שירותים",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
      ],
    },
    {
      id: "cases",
      label: "תיקים",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
      ],
    },
    {
      id: "consultation",
      label: "טופס ייעוץ",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
        { id: "button", label: "כפתור", type: "text" },
      ],
    },
  ],
} as any;