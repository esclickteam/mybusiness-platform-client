export const adionSchema = {
  id: "adion",
  name: "Virello",

  sections: [
    {
      id: "brand",
      title: "מותג",
      fields: [
        {
          id: "brand.name",
          key: "brand.name",
          path: "brand.name",
          label: "שם המותג",
          type: "text",
          defaultValue: "virello",
        },
        {
          id: "brand.email",
          key: "brand.email",
          path: "brand.email",
          label: "אימייל",
          type: "text",
          defaultValue: "hello@virello.com",
        },
        {
          id: "brand.location",
          key: "brand.location",
          path: "brand.location",
          label: "מיקום",
          type: "text",
          defaultValue: "תל אביב, ישראל",
        },
        {
          id: "brand.address",
          key: "brand.address",
          path: "brand.address",
          label: "כתובת",
          type: "text",
          defaultValue: "רחוב הברזל 12, תל אביב",
        },
        {
          id: "brand.phone",
          key: "brand.phone",
          path: "brand.phone",
          label: "טלפון",
          type: "text",
          defaultValue: "+1 000 000 0000",
        },
      ],
    },

    {
      id: "hero",
      title: "הירו",
      fields: [
        {
          id: "hero.kicker",
          key: "hero.kicker",
          path: "hero.kicker",
          label: "תגית עליונה",
          type: "text",
          defaultValue: "[ תל אביב, ישראל ]",
        },
        {
          id: "hero.title",
          key: "hero.title",
          path: "hero.title",
          label: "כותרת ראשית",
          type: "text",
          defaultValue: "virello",
        },
        {
          id: "hero.subtitle",
          key: "hero.subtitle",
          path: "hero.subtitle",
          label: "כותרת משנה",
          type: "textarea",
          defaultValue: "אנחנו עוזרים לבנות, לנהל ולצמוח עם העסק",
        },
        {
          id: "hero.description",
          key: "hero.description",
          path: "hero.description",
          label: "תיאור",
          type: "textarea",
          defaultValue:
            "תבנית סוכנות דיגיטלית נועזת עם כרטיסים צפים, רצועות נעות, סקשנים יצירתיים, טיפוגרפיה חזקה ותנועה ויזואלית פרימיום.",
        },
        {
          id: "hero.primaryButton",
          key: "hero.primaryButton",
          path: "hero.primaryButton",
          label: "טקסט כפתור ראשי",
          type: "text",
          defaultValue: "מתחילים עכשיו",
        },
        {
          id: "hero.badgeText",
          key: "hero.badgeText",
          path: "hero.badgeText",
          label: "טקסט עיגול בפרונט",
          type: "text",
          defaultValue: "1.2k פרויקטים",
        },
        {
          id: "hero.floatingText",
          key: "hero.floatingText",
          path: "hero.floatingText",
          label: "טקסט צף",
          type: "text",
          defaultValue: "סטודיו יצירתי",
        },
      ],
    },

    {
      id: "services",
      title: "שירותים",
      fields: [
        {
          id: "servicesTitle",
          key: "servicesTitle",
          path: "servicesTitle",
          label: "כותרת שירותים",
          type: "textarea",
          defaultValue: "נבנה על ידינו, מוטס על ידם.",
        },
        {
          id: "servicesDescription",
          key: "servicesDescription",
          path: "servicesDescription",
          label: "תיאור שירותים",
          type: "textarea",
          defaultValue:
            "רצועות שירות חלקות, כרטיסי אייקונים ושורה נעה כפולה שיוצרים את אותה תחושת תבנית פרימיום בתנועה.",
        },
      ],
    },

    {
      id: "about",
      title: "אודות",
      fields: [
        {
          id: "about.kicker",
          key: "about.kicker",
          path: "about.kicker",
          label: "תגית אודות",
          type: "text",
          defaultValue: "אודות",
        },
        {
          id: "about.title",
          key: "about.title",
          path: "about.title",
          label: "כותרת אודות",
          type: "textarea",
          defaultValue:
            "ב־Virello אנחנו מחדשים פתרונות דיגיטליים שמעצימים מותגים להתחבר, לצמוח ולהוביל",
        },
        {
          id: "about.description",
          key: "about.description",
          path: "about.description",
          label: "תיאור אודות",
          type: "textarea",
          defaultValue:
            "אנחנו משלבים אסטרטגיה, עיצוב, פיתוח ותנועה כדי ליצור חוויות דיגיטליות יוקרתיות, זכירות ומכוונות תוצאה עסקית.",
        },
        {
          id: "about.button",
          key: "about.button",
          path: "about.button",
          label: "כפתור אודות",
          type: "text",
          defaultValue: "עוד עלינו",
        },
        {
          id: "about.experience.value",
          key: "about.experience.value",
          path: "about.experience.value",
          label: "מספר שנות ניסיון",
          type: "text",
          defaultValue: "07",
        },
        {
          id: "about.experience.label",
          key: "about.experience.label",
          path: "about.experience.label",
          label: "טקסט שנות ניסיון",
          type: "text",
          defaultValue: "שנות ניסיון",
        },
      ],
    },

    {
      id: "whyUs",
      title: "למה אנחנו",
      fields: [
        {
          id: "whyUs.kicker",
          key: "whyUs.kicker",
          path: "whyUs.kicker",
          label: "תגית",
          type: "text",
          defaultValue: "למה אנחנו",
        },
        {
          id: "whyUs.title",
          key: "whyUs.title",
          path: "whyUs.title",
          label: "כותרת",
          type: "textarea",
          defaultValue: "למה Virello נכון לעסק שלכם",
        },
      ],
    },

    {
      id: "projects",
      title: "פרויקטים",
      fields: [
        {
          id: "projects.kicker",
          key: "projects.kicker",
          path: "projects.kicker",
          label: "תגית פרויקטים",
          type: "text",
          defaultValue: "פרויקטים",
        },
        {
          id: "projects.title",
          key: "projects.title",
          path: "projects.title",
          label: "כותרת פרויקטים",
          type: "textarea",
          defaultValue: "אנחנו בונים מוצרים מעולים",
        },
        {
          id: "projects.button",
          key: "projects.button",
          path: "projects.button",
          label: "כפתור פרויקטים",
          type: "text",
          defaultValue: "כל הפרויקטים",
        },
      ],
    },

    {
      id: "testimonials",
      title: "המלצות",
      fields: [
        {
          id: "testimonials.kicker",
          key: "testimonials.kicker",
          path: "testimonials.kicker",
          label: "תגית המלצות",
          type: "text",
          defaultValue: "המלצות",
        },
        {
          id: "testimonials.title",
          key: "testimonials.title",
          path: "testimonials.title",
          label: "כותרת המלצות",
          type: "textarea",
          defaultValue: "אל תסתמכו רק על המילה שלנו",
        },
      ],
    },

    {
      id: "team",
      title: "צוות",
      fields: [
        {
          id: "team.kicker",
          key: "team.kicker",
          path: "team.kicker",
          label: "תגית צוות",
          type: "text",
          defaultValue: "צוות",
        },
        {
          id: "team.title",
          key: "team.title",
          path: "team.title",
          label: "כותרת צוות",
          type: "textarea",
          defaultValue: "צוות קטן, השפעה גדולה",
        },
      ],
    },

    {
      id: "pricing",
      title: "מחירים",
      fields: [
        {
          id: "pricing.kicker",
          key: "pricing.kicker",
          path: "pricing.kicker",
          label: "תגית מחירים",
          type: "text",
          defaultValue: "מחירים",
        },
        {
          id: "pricing.title",
          key: "pricing.title",
          path: "pricing.title",
          label: "כותרת מחירים",
          type: "textarea",
          defaultValue: "מצאו את האפשרות הנכונה ובחרו",
        },
        {
          id: "pricing.monthlyLabel",
          key: "pricing.monthlyLabel",
          path: "pricing.monthlyLabel",
          label: "טקסט חודשי",
          type: "text",
          defaultValue: "חודשי",
        },
        {
          id: "pricing.yearlyLabel",
          key: "pricing.yearlyLabel",
          path: "pricing.yearlyLabel",
          label: "טקסט שנתי",
          type: "text",
          defaultValue: "שנתי",
        },
      ],
    },

    {
      id: "process",
      title: "תהליך עבודה",
      fields: [
        {
          id: "process.kicker",
          key: "process.kicker",
          path: "process.kicker",
          label: "תגית תהליך",
          type: "text",
          defaultValue: "תהליך",
        },
        {
          id: "process.title",
          key: "process.title",
          path: "process.title",
          label: "כותרת תהליך",
          type: "textarea",
          defaultValue: "הציצו לתהליך העבודה שלנו",
        },
      ],
    },

    {
      id: "faq",
      title: "שאלות ותשובות",
      fields: [
        {
          id: "faq.kicker",
          key: "faq.kicker",
          path: "faq.kicker",
          label: "תגית FAQ",
          type: "text",
          defaultValue: "שאלות נפוצות",
        },
        {
          id: "faq.title",
          key: "faq.title",
          path: "faq.title",
          label: "כותרת FAQ",
          type: "textarea",
          defaultValue: "שאלו בחופשיות — אנחנו כאן לעזור",
        },
      ],
    },

    {
      id: "blog",
      title: "בלוג",
      fields: [
        {
          id: "blog.kicker",
          key: "blog.kicker",
          path: "blog.kicker",
          label: "תגית בלוג",
          type: "text",
          defaultValue: "הבלוג שלנו",
        },
        {
          id: "blog.title",
          key: "blog.title",
          path: "blog.title",
          label: "כותרת בלוג",
          type: "textarea",
          defaultValue: "טיפים מודרניים לצמיחה דיגיטלית",
        },
        {
          id: "blog.button",
          key: "blog.button",
          path: "blog.button",
          label: "כפתור בלוג",
          type: "text",
          defaultValue: "כל המאמרים",
        },
      ],
    },

    {
      id: "contact",
      title: "יצירת קשר",
      fields: [
        {
          id: "contact.kicker",
          key: "contact.kicker",
          path: "contact.kicker",
          label: "תגית יצירת קשר",
          type: "text",
          defaultValue: "צור קשר",
        },
        {
          id: "contact.title",
          key: "contact.title",
          path: "contact.title",
          label: "כותרת יצירת קשר",
          type: "textarea",
          defaultValue: "בואו נבנה משהו גדול",
        },
        {
          id: "contact.description",
          key: "contact.description",
          path: "contact.description",
          label: "תיאור יצירת קשר",
          type: "textarea",
          defaultValue:
            "השאירו פרטים ונחזור אליכם לשיחת אסטרטגיה.",
        },
        {
          id: "contact.button",
          key: "contact.button",
          path: "contact.button",
          label: "כפתור שליחה",
          type: "text",
          defaultValue: "שליחת הודעה",
        },
        {
          id: "contact.ctaTitle",
          key: "contact.ctaTitle",
          path: "contact.ctaTitle",
          label: "כותרת CTA",
          type: "textarea",
          defaultValue: "בואו נעבוד יחד או נדבר — נשמח לעזור!",
        },
        {
          id: "contact.ctaDescription",
          key: "contact.ctaDescription",
          path: "contact.ctaDescription",
          label: "תיאור CTA",
          type: "textarea",
          defaultValue:
            "מוכנים לבנות מותג דיגיטלי נע, פרימיום ובלתי נשכח? בואו ניצור יחד את הגרסה הבאה.",
        },
        {
          id: "contact.ctaButton",
          key: "contact.ctaButton",
          path: "contact.ctaButton",
          label: "כפתור CTA",
          type: "text",
          defaultValue: "דברו איתנו",
        },
      ],
    },
  ],
} as any;