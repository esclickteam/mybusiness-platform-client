export const adionSchema = {
  id: "adion",
  name: "Adion",
  fields: [
    {
      id: "brand.name",
      label: "שם המותג",
      type: "text",
      defaultValue: "adion",
    },
    {
      id: "brand.email",
      label: "אימייל",
      type: "text",
      defaultValue: "adioninc@support.com",
    },
    {
      id: "brand.location",
      label: "מיקום",
      type: "text",
      defaultValue: "California, USA",
    },
    {
      id: "hero.title",
      label: "כותרת ראשית",
      type: "text",
      defaultValue: "adion",
    },
    {
      id: "hero.subtitle",
      label: "כותרת משנה",
      type: "textarea",
      defaultValue: "בונים, מנהלים ומגדילים מותגים דיגיטליים שנראים אחרת.",
    },
    {
      id: "hero.description",
      label: "תיאור",
      type: "textarea",
      defaultValue:
        "סטודיו מודרני לעיצוב, UX, פיתוח ומיתוג — עם תנועה, צבע, טיפוגרפיה גדולה וחוויית משתמש מרשימה.",
    },
    {
      id: "hero.primaryButton",
      label: "טקסט כפתור",
      type: "text",
      defaultValue: "דברו איתנו",
    },
  ],
};