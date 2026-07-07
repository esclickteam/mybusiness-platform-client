type LaunchoraFieldType = "text" | "textarea" | "image" | "color" | "url";

type LaunchoraField = {
  id: string;
  key: string;
  name: string;
  type: LaunchoraFieldType;
  label: string;
  defaultValue: string;
};

function createField(
  id: string,
  type: LaunchoraFieldType,
  label: string,
  defaultValue: string,
): LaunchoraField {
  return {
    id,
    key: id,
    name: id,
    type,
    label,
    defaultValue,
  };
}

const brandName = createField("brandName", "text", "שם העסק", "לנצ׳ורה");
const logoText = createField("logoText", "text", "טקסט לוגו", "L");

const heroEyebrow = createField(
  "heroEyebrow",
  "text",
  "טקסט קטן מעל הכותרת",
  "זמינים לפרויקט הבא באוגוסט",
);

const heroTitle = createField(
  "heroTitle",
  "text",
  "כותרת ראשית",
  "עיצוב שמרגיש יקר ומוכר יותר.",
);

const heroSubtitle = createField(
  "heroSubtitle",
  "textarea",
  "טקסט פתיחה",
  "תבנית פורטפוליו/סטודיו שמובילה את הגולש בצורה טבעית: רושם ראשוני חזק, עבודות שמוכיחות יכולת, אמון, מחירון ופעולה.",
);

const heroPrimaryButton = createField(
  "heroPrimaryButton",
  "text",
  "כפתור ראשי",
  "לראות עבודות",
);

const heroSecondaryButton = createField(
  "heroSecondaryButton",
  "text",
  "כפתור משני",
  "מחירון",
);

const heroImage = createField(
  "heroImage",
  "image",
  "תמונה ראשית באזור הפתיחה",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
);

const heroCardTitle = createField(
  "heroCardTitle",
  "text",
  "טקסט כרטיס שחור באזור פתיחה",
  "פחות רעש. יותר רושם.",
);

const heroCaseStudyTitle = createField(
  "heroCaseStudyTitle",
  "text",
  "כותרת על התמונה באזור פתיחה",
  "חוויית מותג שמרגישה יקרה",
);

const socialProofTitle = createField(
  "socialProofTitle",
  "text",
  "כותרת הוכחה חברתית",
  "120+ לקוחות מרוצים",
);

const socialProofSubtitle = createField(
  "socialProofSubtitle",
  "text",
  "טקסט הוכחה חברתית",
  "מיתוג, אתרים וחוויית משתמש",
);

const workKicker = createField("workKicker", "text", "כותרת קטנה עבודות", "עבודות נבחרות");

const workTitle = createField(
  "workTitle",
  "text",
  "כותרת עבודות",
  "לא כרטיסים קטנים. עבודות גדולות שעושות רושם.",
);

const workText = createField(
  "workText",
  "textarea",
  "טקסט עבודות",
  "כל פרויקט מקבל במה, תמונה חזקה, תוצאה ברורה וכניסה למודאל — זה משפר הבנה, אמון ותחושת פרימיום.",
);

const projectOneTitle = createField("projectOneTitle", "text", "פרויקט 1 - שם", "ClearBank");
const projectOneSubtitle = createField(
  "projectOneSubtitle",
  "textarea",
  "פרויקט 1 - כותרת משנה",
  "מערכת פיננסית שמרגישה פשוטה, יוקרתית ומהירה.",
);
const projectOneCategory = createField("projectOneCategory", "text", "פרויקט 1 - קטגוריה", "Web App / UX");
const projectOneYear = createField("projectOneYear", "text", "פרויקט 1 - שנה", "2026");
const projectOneDescription = createField(
  "projectOneDescription",
  "textarea",
  "פרויקט 1 - תיאור",
  "בנינו חוויית משתמש שמפשטת נתונים מורכבים, מחזקת אמון ומובילה את המשתמש לפעולה ברורה.",
);
const projectOneResult = createField("projectOneResult", "text", "פרויקט 1 - תוצאה", "עלייה של 38% בהמרות בדמו");
const projectOneImage = createField(
  "projectOneImage",
  "image",
  "פרויקט 1 - תמונה",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
);

const projectTwoTitle = createField("projectTwoTitle", "text", "פרויקט 2 - שם", "Velora");
const projectTwoSubtitle = createField(
  "projectTwoSubtitle",
  "textarea",
  "פרויקט 2 - כותרת משנה",
  "מותג פרימיום לספורט ותנועה עם שפה ויזואלית חדה.",
);
const projectTwoCategory = createField("projectTwoCategory", "text", "פרויקט 2 - קטגוריה", "Brand / Art Direction");
const projectTwoYear = createField("projectTwoYear", "text", "פרויקט 2 - שנה", "2026");
const projectTwoDescription = createField(
  "projectTwoDescription",
  "textarea",
  "פרויקט 2 - תיאור",
  "שפה מותגית חדשה, היררכיית תוכן ברורה ועמוד מוצר שמדגיש תחושת ביצועים.",
);
const projectTwoResult = createField("projectTwoResult", "text", "פרויקט 2 - תוצאה", "פי 2.4 יותר הקלקות על CTA");
const projectTwoImage = createField(
  "projectTwoImage",
  "image",
  "פרויקט 2 - תמונה",
  "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=80",
);

const projectThreeTitle = createField("projectThreeTitle", "text", "פרויקט 3 - שם", "Harmen Studio");
const projectThreeSubtitle = createField(
  "projectThreeSubtitle",
  "textarea",
  "פרויקט 3 - כותרת משנה",
  "חנות דיגיטלית רגועה, נקייה ואלגנטית למוצרי בית.",
);
const projectThreeCategory = createField("projectThreeCategory", "text", "פרויקט 3 - קטגוריה", "E-Commerce");
const projectThreeYear = createField("projectThreeYear", "text", "פרויקט 3 - שנה", "2026");
const projectThreeDescription = createField(
  "projectThreeDescription",
  "textarea",
  "פרויקט 3 - תיאור",
  "עיצבנו מסע קנייה שמרגיש נעים, ברור ומדויק — מהעמוד הראשי ועד עמוד המוצר.",
);
const projectThreeResult = createField("projectThreeResult", "text", "פרויקט 3 - תוצאה", "שיפור של 31% בהוספה לסל");
const projectThreeImage = createField(
  "projectThreeImage",
  "image",
  "פרויקט 3 - תמונה",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
);

const servicesKicker = createField("servicesKicker", "text", "כותרת קטנה שירותים", "שירותים");
const servicesTitle = createField(
  "servicesTitle",
  "text",
  "כותרת שירותים",
  "כל סקציה באתר צריכה לעבוד בשביל ההמרה.",
);
const servicesText = createField(
  "servicesText",
  "textarea",
  "טקסט שירותים",
  "העיצוב נראה יפה, אבל המבנה מכוון פעולה: להבין, להתרשם, לסמוך, לפנות.",
);

const serviceOneTitle = createField("serviceOneTitle", "text", "שירות 1 - כותרת", "אסטרטגיה לפני עיצוב");
const serviceOneText = createField("serviceOneText", "textarea", "שירות 1 - טקסט", "מגדירים מטרה, קהל, מסר והיררכיה לפני שנוגעים בפיקסלים.");

const serviceTwoTitle = createField("serviceTwoTitle", "text", "שירות 2 - כותרת", "עיצוב אתר פרימיום");
const serviceTwoText = createField("serviceTwoText", "textarea", "שירות 2 - טקסט", "Hero חזק, תנועה עדינה, סקציות ברורות ו־CTA שלא הולך לאיבוד.");

const serviceThreeTitle = createField("serviceThreeTitle", "text", "שירות 3 - כותרת", "חוויית משתמש");
const serviceThreeText = createField("serviceThreeText", "textarea", "שירות 3 - טקסט", "מבנה שמוביל את הגולש טבעית: להבין, להאמין, ללחוץ, להשאיר פרטים.");

const serviceFourTitle = createField("serviceFourTitle", "text", "שירות 4 - כותרת", "פיתוח מדויק");
const serviceFourText = createField("serviceFourText", "textarea", "שירות 4 - טקסט", "React + Tailwind, רספונסיביות מלאה, ביצועים טובים וקוד שקל לתחזק.");

const finalCtaTitle = createField(
  "finalCtaTitle",
  "text",
  "כותרת CTA תחתון",
  "מוכנים לאתר שמרגיש הרבה יותר מקצועי?",
);

const finalCtaText = createField(
  "finalCtaText",
  "textarea",
  "טקסט CTA תחתון",
  "בואו נבנה תבנית עם חוויה חזקה, גלילה נעימה, פרויקטים מרשימים ו־CTA ברור שלא הולך לאיבוד.",
);

const finalCtaButton = createField("finalCtaButton", "text", "כפתור CTA תחתון", "להתחיל עכשיו");

export const launchoraSchema = {
  templateId: "launchora",
  name: "Launchora",
  editable: true,

  sections: [
    {
      id: "brand",
      label: "מותג",
      fields: [brandName, logoText],
    },
    {
      id: "hero",
      label: "אזור פתיחה",
      fields: [
        heroEyebrow,
        heroTitle,
        heroSubtitle,
        heroPrimaryButton,
        heroSecondaryButton,
        heroImage,
        heroCardTitle,
        heroCaseStudyTitle,
      ],
    },
    {
      id: "socialProof",
      label: "הוכחה חברתית",
      fields: [socialProofTitle, socialProofSubtitle],
    },
    {
      id: "work",
      label: "כותרת עבודות",
      fields: [workKicker, workTitle, workText],
    },
    {
      id: "projectOne",
      label: "פרויקט ראשון",
      fields: [
        projectOneTitle,
        projectOneSubtitle,
        projectOneCategory,
        projectOneYear,
        projectOneDescription,
        projectOneResult,
        projectOneImage,
      ],
    },
    {
      id: "projectTwo",
      label: "פרויקט שני",
      fields: [
        projectTwoTitle,
        projectTwoSubtitle,
        projectTwoCategory,
        projectTwoYear,
        projectTwoDescription,
        projectTwoResult,
        projectTwoImage,
      ],
    },
    {
      id: "projectThree",
      label: "פרויקט שלישי",
      fields: [
        projectThreeTitle,
        projectThreeSubtitle,
        projectThreeCategory,
        projectThreeYear,
        projectThreeDescription,
        projectThreeResult,
        projectThreeImage,
      ],
    },
    {
      id: "services",
      label: "שירותים",
      fields: [
        servicesKicker,
        servicesTitle,
        servicesText,
        serviceOneTitle,
        serviceOneText,
        serviceTwoTitle,
        serviceTwoText,
        serviceThreeTitle,
        serviceThreeText,
        serviceFourTitle,
        serviceFourText,
      ],
    },
    {
      id: "finalCta",
      label: "קריאה לפעולה תחתונה",
      fields: [finalCtaTitle, finalCtaText, finalCtaButton],
    },
  ],

  fields: {
    brandName,
    logoText,
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    heroPrimaryButton,
    heroSecondaryButton,
    heroImage,
    heroCardTitle,
    heroCaseStudyTitle,
    socialProofTitle,
    socialProofSubtitle,
    workKicker,
    workTitle,
    workText,
    projectOneTitle,
    projectOneSubtitle,
    projectOneCategory,
    projectOneYear,
    projectOneDescription,
    projectOneResult,
    projectOneImage,
    projectTwoTitle,
    projectTwoSubtitle,
    projectTwoCategory,
    projectTwoYear,
    projectTwoDescription,
    projectTwoResult,
    projectTwoImage,
    projectThreeTitle,
    projectThreeSubtitle,
    projectThreeCategory,
    projectThreeYear,
    projectThreeDescription,
    projectThreeResult,
    projectThreeImage,
    servicesKicker,
    servicesTitle,
    servicesText,
    serviceOneTitle,
    serviceOneText,
    serviceTwoTitle,
    serviceTwoText,
    serviceThreeTitle,
    serviceThreeText,
    serviceFourTitle,
    serviceFourText,
    finalCtaTitle,
    finalCtaText,
    finalCtaButton,
  },
} as any;