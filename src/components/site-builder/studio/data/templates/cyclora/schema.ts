export const cycloraSchema = {
  brand: {
    type: "object",
    label: "מותג",
    fields: {
      name: { type: "text", label: "שם המותג" },
      tagline: { type: "text", label: "תיאור קצר" },
      email: { type: "text", label: "אימייל" },
      phone: { type: "text", label: "טלפון" },
    },
  },
  hero: {
    type: "object",
    label: "אזור פתיחה",
    fields: {
      marquee: { type: "text", label: "כותרת ענקית" },
      title: { type: "text", label: "כותרת" },
      accent: { type: "text", label: "הדגשה" },
      description: { type: "textarea", label: "תיאור" },
      microcopy: { type: "textarea", label: "טקסט משלים" },
      primaryButton: { type: "text", label: "כפתור ראשי" },
      secondaryButton: { type: "text", label: "כפתור משני" },
      scrollLabel: { type: "text", label: "טקסט גלילה" },
      orbitMedia: {
        type: "array",
        label: "תמונות מרחפות",
        itemLabel: "תמונה",
        fields: {
          value: { type: "image", label: "מדיה" },
        },
      },
    },
  },
  strategies: {
    type: "array",
    label: "פתרונות",
    itemLabel: "פתרון",
    fields: {
      eyebrow: { type: "text", label: "תגית" },
      title: { type: "text", label: "כותרת" },
      description: { type: "textarea", label: "תיאור" },
      metric: { type: "text", label: "מדד" },
    },
  },
  cases: {
    type: "array",
    label: "עבודות",
    itemLabel: "פרויקט",
    fields: {
      eyebrow: { type: "text", label: "תגית" },
      title: { type: "text", label: "שם הפרויקט" },
      category: { type: "text", label: "קטגוריה" },
      year: { type: "text", label: "שנה" },
      image: { type: "image", label: "תמונה או וידאו" },
    },
  },
  testimonials: {
    type: "array",
    label: "המלצות",
    itemLabel: "המלצה",
    fields: {
      quote: { type: "textarea", label: "המלצה" },
      name: { type: "text", label: "שם" },
      role: { type: "text", label: "תפקיד" },
      avatar: { type: "image", label: "תמונה" },
      badge: { type: "text", label: "תגית" },
    },
  },
  plans: {
    type: "array",
    label: "תוכניות",
    itemLabel: "תוכנית",
    fields: {
      name: { type: "text", label: "שם" },
      tag: { type: "text", label: "תגית" },
      price: { type: "text", label: "מחיר" },
      suffix: { type: "text", label: "סיומת מחיר" },
      description: { type: "textarea", label: "תיאור" },
      button: { type: "text", label: "כפתור" },
      featured: { type: "boolean", label: "מומלצת" },
    },
  },
  faq: {
    type: "array",
    label: "שאלות ותשובות",
    itemLabel: "שאלה",
    fields: {
      question: { type: "text", label: "שאלה" },
      answer: { type: "textarea", label: "תשובה" },
    },
  },
  cta: {
    type: "object",
    label: "קריאה לפעולה",
    fields: {
      eyebrow: { type: "text", label: "תגית" },
      title: { type: "text", label: "כותרת" },
      accent: { type: "text", label: "הדגשה" },
      description: { type: "textarea", label: "תיאור" },
      button: { type: "text", label: "כפתור" },
    },
  },
};
