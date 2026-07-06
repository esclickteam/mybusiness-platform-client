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
          defaultValue: "California, USA",
        },
        {
          id: "brand.address",
          key: "brand.address",
          path: "brand.address",
          label: "כתובת",
          type: "text",
          defaultValue: "210 Wallet Street, California, Main HQ, USA",
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
      title: "Hero",
      fields: [
        {
          id: "hero.kicker",
          key: "hero.kicker",
          path: "hero.kicker",
          label: "תגית עליונה",
          type: "text",
          defaultValue: "[ California, USA ]",
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
          defaultValue: "We help you build, manage & grow your business",
        },
        {
          id: "hero.description",
          key: "hero.description",
          path: "hero.description",
          label: "תיאור",
          type: "textarea",
          defaultValue:
            "A bold digital agency template with floating cards, moving strips, creative sections, strong typography and premium visual motion.",
        },
        {
          id: "hero.primaryButton",
          key: "hero.primaryButton",
          path: "hero.primaryButton",
          label: "טקסט כפתור ראשי",
          type: "text",
          defaultValue: "Get Started",
        },
        {
          id: "hero.badgeText",
          key: "hero.badgeText",
          path: "hero.badgeText",
          label: "טקסט עיגול בפרונט",
          type: "text",
          defaultValue: "1.2k Projects",
        },
        {
          id: "hero.floatingText",
          key: "hero.floatingText",
          path: "hero.floatingText",
          label: "טקסט צף",
          type: "text",
          defaultValue: "Creative Studio",
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
          defaultValue: "Built by us, flown by them.",
        },
        {
          id: "servicesDescription",
          key: "servicesDescription",
          path: "servicesDescription",
          label: "תיאור שירותים",
          type: "textarea",
          defaultValue:
            "Smooth service strips, icon cards and a duplicated moving row to create the same premium moving-template feeling.",
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
          defaultValue: "About",
        },
        {
          id: "about.title",
          key: "about.title",
          path: "about.title",
          label: "כותרת אודות",
          type: "textarea",
          defaultValue:
            "At Virello, we innovate digital solutions empowering brands to connect, grow, & lead",
        },
        {
          id: "about.description",
          key: "about.description",
          path: "about.description",
          label: "תיאור אודות",
          type: "textarea",
          defaultValue:
            "We combine strategy, design, development and motion to create digital experiences that feel premium, memorable and business-driven.",
        },
        {
          id: "about.button",
          key: "about.button",
          path: "about.button",
          label: "כפתור אודות",
          type: "text",
          defaultValue: "More About Us",
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
          defaultValue: "Years of Experience",
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
          defaultValue: "Why Us",
        },
        {
          id: "whyUs.title",
          key: "whyUs.title",
          path: "whyUs.title",
          label: "כותרת",
          type: "textarea",
          defaultValue: "Why Virello right for business",
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
          defaultValue: "Projects",
        },
        {
          id: "projects.title",
          key: "projects.title",
          path: "projects.title",
          label: "כותרת פרויקטים",
          type: "textarea",
          defaultValue: "We build great products",
        },
        {
          id: "projects.button",
          key: "projects.button",
          path: "projects.button",
          label: "כפתור פרויקטים",
          type: "text",
          defaultValue: "All Projects",
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
          defaultValue: "Testimonials",
        },
        {
          id: "testimonials.title",
          key: "testimonials.title",
          path: "testimonials.title",
          label: "כותרת המלצות",
          type: "textarea",
          defaultValue: "Don’t take our word for it",
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
          defaultValue: "Team",
        },
        {
          id: "team.title",
          key: "team.title",
          path: "team.title",
          label: "כותרת צוות",
          type: "textarea",
          defaultValue: "Small team, massive impact",
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
          defaultValue: "Pricing",
        },
        {
          id: "pricing.title",
          key: "pricing.title",
          path: "pricing.title",
          label: "כותרת מחירים",
          type: "textarea",
          defaultValue: "Find the best option, choose yours",
        },
        {
          id: "pricing.monthlyLabel",
          key: "pricing.monthlyLabel",
          path: "pricing.monthlyLabel",
          label: "טקסט חודשי",
          type: "text",
          defaultValue: "Monthly",
        },
        {
          id: "pricing.yearlyLabel",
          key: "pricing.yearlyLabel",
          path: "pricing.yearlyLabel",
          label: "טקסט שנתי",
          type: "text",
          defaultValue: "Yearly",
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
          defaultValue: "Process",
        },
        {
          id: "process.title",
          key: "process.title",
          path: "process.title",
          label: "כותרת תהליך",
          type: "textarea",
          defaultValue: "Take a tour of our work process",
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
          defaultValue: "Faq's",
        },
        {
          id: "faq.title",
          key: "faq.title",
          path: "faq.title",
          label: "כותרת FAQ",
          type: "textarea",
          defaultValue: "Ask away, we're here to help",
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
          defaultValue: "Our Blog",
        },
        {
          id: "blog.title",
          key: "blog.title",
          path: "blog.title",
          label: "כותרת בלוג",
          type: "textarea",
          defaultValue: "Modern tips for digital growth",
        },
        {
          id: "blog.button",
          key: "blog.button",
          path: "blog.button",
          label: "כפתור בלוג",
          type: "text",
          defaultValue: "All Articles",
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
          defaultValue: "Contact",
        },
        {
          id: "contact.title",
          key: "contact.title",
          path: "contact.title",
          label: "כותרת יצירת קשר",
          type: "textarea",
          defaultValue: "Let’s build something great",
        },
        {
          id: "contact.description",
          key: "contact.description",
          path: "contact.description",
          label: "תיאור יצירת קשר",
          type: "textarea",
          defaultValue:
            "Leave your details and we’ll get back to you for a strategy call.",
        },
        {
          id: "contact.button",
          key: "contact.button",
          path: "contact.button",
          label: "כפתור שליחה",
          type: "text",
          defaultValue: "Send Message",
        },
        {
          id: "contact.ctaTitle",
          key: "contact.ctaTitle",
          path: "contact.ctaTitle",
          label: "כותרת CTA",
          type: "textarea",
          defaultValue: "Let’s work together or talk—we’re happy to help!",
        },
        {
          id: "contact.ctaDescription",
          key: "contact.ctaDescription",
          path: "contact.ctaDescription",
          label: "תיאור CTA",
          type: "textarea",
          defaultValue:
            "Ready to build a moving, premium and memorable digital brand? Let's create the next version together.",
        },
        {
          id: "contact.ctaButton",
          key: "contact.ctaButton",
          path: "contact.ctaButton",
          label: "כפתור CTA",
          type: "text",
          defaultValue: "Let's Talk",
        },
      ],
    },
  ],
} as any;