type IdoFieldType = "text" | "textarea" | "image" | "color" | "url";

type IdoField = {
  id: string;
  key: string;
  name: string;
  type: IdoFieldType;
  label: string;
  defaultValue: string;
};

function createField(
  id: string,
  type: IdoFieldType,
  label: string,
  defaultValue: string,
): IdoField {
  return {
    id,
    key: id,
    name: id,
    type,
    label,
    defaultValue,
  };
}

const brandName = createField("brandName", "text", "שם העסק", "IDO Beauty House");
const logoText = createField("logoText", "text", "טקסט לוגו", "IDO");
const tagline = createField("tagline", "text", "סלוגן", "Beauty House");

const heroEyebrow = createField(
  "heroEyebrow",
  "text",
  "טקסט קטן מעל הכותרת",
  "קליניקת יופי · תיאום תורים · חוויית פרימיום",
);

const heroTitle = createField(
  "heroTitle",
  "text",
  "כותרת ראשית",
  "סטודיו יופי שמרגיש יוקרתי מהקליק הראשון.",
);

const heroSubtitle = createField(
  "heroSubtitle",
  "textarea",
  "טקסט פתיחה",
  "תבנית IDO לקוסמטיקה ותיאום תורים עם חוויית פרימיום, גלריה, טיפולים וטופס קביעת תור.",
);

const primaryButtonText = createField(
  "primaryButtonText",
  "text",
  "טקסט כפתור ראשי",
  "קביעת תור",
);

const secondaryButtonText = createField(
  "secondaryButtonText",
  "text",
  "טקסט כפתור משני",
  "צפייה בטיפולים",
);

const heroImage = createField(
  "heroImage",
  "image",
  "תמונה ראשית",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1900&q=95",
);

const statOneValue = createField("statOneValue", "text", "נתון ראשון", "4.9");
const statOneLabel = createField("statOneLabel", "text", "כותרת נתון ראשון", "דירוג");

const statTwoValue = createField("statTwoValue", "text", "נתון שני", "3K+");
const statTwoLabel = createField("statTwoLabel", "text", "כותרת נתון שני", "לקוחות");

const statThreeValue = createField("statThreeValue", "text", "נתון שלישי", "15");
const statThreeLabel = createField("statThreeLabel", "text", "כותרת נתון שלישי", "טיפולים");

const servicesEyebrow = createField("servicesEyebrow", "text", "כותרת קטנה לטיפולים", "SERVICES");

const servicesTitle = createField(
  "servicesTitle",
  "text",
  "כותרת טיפולים",
  "טיפולים שמוצגים כמו מותג פרימיום, לא כמו רשימת מחירים.",
);

const serviceOneTitle = createField(
  "serviceOneTitle",
  "text",
  "טיפול ראשון - שם",
  "טיפול פנים Signature",
);

const serviceOneText = createField(
  "serviceOneText",
  "textarea",
  "טיפול ראשון - תיאור",
  "טיפול עומק לעור נקי, חיוני וזוהר עם התאמה אישית לפי מצב העור.",
);

const serviceOnePrice = createField("serviceOnePrice", "text", "טיפול ראשון - מחיר", "₪340");

const serviceTwoTitle = createField(
  "serviceTwoTitle",
  "text",
  "טיפול שני - שם",
  "עיצוב גבות פרימיום",
);

const serviceTwoText = createField(
  "serviceTwoText",
  "textarea",
  "טיפול שני - תיאור",
  "עיצוב מדויק לפי מבנה הפנים, עם גימור טבעי ונקי.",
);

const serviceTwoPrice = createField("serviceTwoPrice", "text", "טיפול שני - מחיר", "₪120");

const serviceThreeTitle = createField(
  "serviceThreeTitle",
  "text",
  "טיפול שלישי - שם",
  "טיפול Glow Renewal",
);

const serviceThreeText = createField(
  "serviceThreeText",
  "textarea",
  "טיפול שלישי - תיאור",
  "טיפול מתקדם למראה עור אחיד, מתוח ורענן יותר.",
);

const serviceThreePrice = createField("serviceThreePrice", "text", "טיפול שלישי - מחיר", "₪430");

const aboutEyebrow = createField("aboutEyebrow", "text", "כותרת קטנה אודות", "ABOUT");

const aboutTitle = createField(
  "aboutTitle",
  "text",
  "כותרת אודות",
  "סטודיו ששם את התחושה של הלקוחה לפני הכול.",
);

const aboutText = createField(
  "aboutText",
  "textarea",
  "טקסט אודות",
  "IDO נבנתה לקליניקות שרוצות להיראות מדויק, נקי ויוקרתי. כל אזור בתבנית מיועד להוביל את הלקוחה לקביעת תור בצורה טבעית.",
);

const aboutImage = createField(
  "aboutImage",
  "image",
  "תמונת אודות",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=90",
);

const galleryEyebrow = createField("galleryEyebrow", "text", "כותרת קטנה גלריה", "GALLERY");

const galleryTitle = createField(
  "galleryTitle",
  "text",
  "כותרת גלריה",
  "גלריה גדולה, דרמטית ונקייה — בדיוק לעסקי יופי.",
);

const bookingEyebrow = createField("bookingEyebrow", "text", "כותרת קטנה תור", "BOOKING");

const bookingTitle = createField(
  "bookingTitle",
  "text",
  "כותרת קביעת תור",
  "קביעת תור בלי עומס. בלי בלאגן.",
);

const bookingText = createField(
  "bookingText",
  "textarea",
  "טקסט קביעת תור",
  "אזור שמוכן לחיבור ליומן, CRM, WhatsApp או כל מערכת תיאום תורים שתוסיף בהמשך.",
);

const bookingButtonText = createField(
  "bookingButtonText",
  "text",
  "טקסט כפתור בטופס",
  "שליחת בקשה לתור",
);

const faqEyebrow = createField("faqEyebrow", "text", "כותרת קטנה FAQ", "FAQ");

const faqTitle = createField(
  "faqTitle",
  "text",
  "כותרת FAQ",
  "שאלות שהלקוחה רוצה לדעת לפני שהיא קובעת.",
);

export const idoSchema = {
  templateId: "ido",
  name: "IDO",
  editable: true,

  sections: [
    {
      id: "brand",
      label: "מותג",
      fields: [brandName, logoText, tagline],
    },
    {
      id: "hero",
      label: "אזור פתיחה",
      fields: [
        heroEyebrow,
        heroTitle,
        heroSubtitle,
        primaryButtonText,
        secondaryButtonText,
        heroImage,
      ],
    },
    {
      id: "stats",
      label: "נתונים",
      fields: [
        statOneValue,
        statOneLabel,
        statTwoValue,
        statTwoLabel,
        statThreeValue,
        statThreeLabel,
      ],
    },
    {
      id: "services",
      label: "טיפולים",
      fields: [
        servicesEyebrow,
        servicesTitle,
        serviceOneTitle,
        serviceOneText,
        serviceOnePrice,
        serviceTwoTitle,
        serviceTwoText,
        serviceTwoPrice,
        serviceThreeTitle,
        serviceThreeText,
        serviceThreePrice,
      ],
    },
    {
      id: "about",
      label: "אודות הסטודיו",
      fields: [aboutEyebrow, aboutTitle, aboutText, aboutImage],
    },
    {
      id: "gallery",
      label: "גלריה",
      fields: [galleryEyebrow, galleryTitle],
    },
    {
      id: "booking",
      label: "קביעת תור",
      fields: [bookingEyebrow, bookingTitle, bookingText, bookingButtonText],
    },
    {
      id: "faq",
      label: "שאלות נפוצות",
      fields: [faqEyebrow, faqTitle],
    },
  ],

  fields: {
    brandName,
    logoText,
    tagline,
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    primaryButtonText,
    secondaryButtonText,
    heroImage,
    statOneValue,
    statOneLabel,
    statTwoValue,
    statTwoLabel,
    statThreeValue,
    statThreeLabel,
    servicesEyebrow,
    servicesTitle,
    serviceOneTitle,
    serviceOneText,
    serviceOnePrice,
    serviceTwoTitle,
    serviceTwoText,
    serviceTwoPrice,
    serviceThreeTitle,
    serviceThreeText,
    serviceThreePrice,
    aboutEyebrow,
    aboutTitle,
    aboutText,
    aboutImage,
    galleryEyebrow,
    galleryTitle,
    bookingEyebrow,
    bookingTitle,
    bookingText,
    bookingButtonText,
    faqEyebrow,
    faqTitle,
  },
} as any;