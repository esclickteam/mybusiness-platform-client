export const wantravelSchema = {
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
        { id: "title", label: "כותרת ראשית", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
        { id: "primaryButton", label: "כפתור ראשי", type: "text" },
        { id: "secondaryButton", label: "כפתור משני", type: "text" },
        { id: "image", label: "תמונת רקע", type: "image" },
        { id: "floatingImage", label: "תמונה צפה", type: "image" },
        { id: "cardTitle", label: "כותרת כרטיס", type: "textarea" },
        { id: "cardText", label: "טקסט כרטיס", type: "textarea" },
      ],
    },
    {
      id: "destinations",
      label: "יעדים",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
      ],
    },
    {
      id: "packages",
      label: "חבילות",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
      ],
    },
    {
      id: "process",
      label: "תהליך",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
      ],
    },
    {
      id: "reviews",
      label: "המלצות",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
      ],
    },
    {
      id: "booking",
      label: "טופס",
      fields: [
        { id: "eyebrow", label: "טקסט עליון", type: "text" },
        { id: "title", label: "כותרת", type: "textarea" },
        { id: "text", label: "תיאור", type: "textarea" },
        { id: "button", label: "כפתור שליחה", type: "text" },
      ],
    },
  ],
} as any;