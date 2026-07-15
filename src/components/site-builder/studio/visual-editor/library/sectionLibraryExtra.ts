import type { VisualLibrarySectionTemplate } from "./visualLibraryTypes";
import {
  aboutCover,
  aboutEditorial,
  aboutFounderQuote,
  aboutSplit,
  aboutStatsCollage,
  aboutStory,
  aboutTimeline,
  blogBlock,
  contactBlock,
  ctaBlock,
  ctaImage,
  eventsBlock,
  faqSplit,
  featuresGrid,
  featuresOrbit,
  featuresSplit,
  featuresTimeline,
  heroCentered,
  heroCollage,
  heroEditorial,
  heroSplit,
  portfolioGrid,
  portfolioMasonry,
  pricingBlock,
  pricingComparison,
  productSpotlight,
  productsGrid,
  promoteBlock,
  resumeBlock,
  servicesBento,
  servicesCards,
  servicesList,
  servicesSpotlight,
  statsEditorial,
  teamEditorial,
  testimonialsBlock,
  testimonialsFeatured,
} from "./sectionCatalogBuilders";

const serviceItems = [
  {
    title: "ייעוץ אישי",
    copy: "ליווי מקצועי מותאם למטרות העסק שלכם.",
    cta: "לפרטים",
  },
  {
    title: "עיצוב וחוויה",
    copy: "ממשק נקי, ברור ומדויק למותג שלכם.",
    cta: "לפרטים",
  },
  {
    title: "צמיחה ושיווק",
    copy: "אסטרטגיה שמביאה לידים איכותיים.",
    cta: "לפרטים",
  },
  {
    title: "תמיכה שוטפת",
    copy: "זמינות גבוהה וליווי לאורך כל הדרך.",
    cta: "לפרטים",
  },
];

const featureItems = [
  { title: "מהיר להתחלה", copy: "מעלים אתר מקצועי תוך זמן קצר." },
  { title: "מותאם לנייד", copy: "כל סקשן נראה מעולה גם במובייל." },
  { title: "שליטה מלאה", copy: "עורכים טקסטים, תמונות וצבעים בקלות." },
  { title: "מוכן לקידום", copy: "מבנה נקי שעוזר להופיע בגוגל." },
  { title: "עיצוב ממותג", copy: "צבעים וטיפוגרפיה שמייצגים אתכם." },
  { title: "תמיכה בעברית", copy: "RTL מלא ותוכן בעברית מההתחלה." },
];

const plans = [
  {
    name: "התחלה",
    price: "₪149",
    features: "עמוד בסיס\nעריכה מלאה\nתמיכה במייל",
  },
  {
    name: "צמיחה",
    price: "₪299",
    features: "עד 5 עמודים\nספריית סקשנים\nAI מובנה",
    popular: true,
  },
  {
    name: "מקצועי",
    price: "₪499",
    features: "ללא הגבלה\nדומיין מותאם\nעדיפות בתמיכה",
  },
];

/**
 * Expanded Hebrew section catalog — many layout variants per category
 * for AI site building and in-editor "Add Section" library.
 */
export const SECTION_LIBRARY_EXTRA: VisualLibrarySectionTemplate[] = [
  // —— Welcome / Hero ——
  heroSplit({
    id: "section-hero-welcome-split",
    title: "ברוכים הבאים – פיצול",
    badge: "עסק שמצליח",
    headline: "בונים נוכחות דיגיטלית שמביאה לקוחות",
    copy: "אתר מקצועי בעברית, עם סקשנים מוכנים שמותאמים בדיוק לעסק שלכם.",
    primary: "התחילו עכשיו",
    secondary: "צפו בדוגמאות",
    image: "office",
    bg: "#f8fafc",
  }),
  heroCentered({
    id: "section-hero-welcome-center",
    title: "ברוכים הבאים – ממורכז",
    badge: "היי, נעים להכיר",
    headline: "המקום שלכם להתחיל מחדש",
    copy: "כותרת חזקה, מסר ברור וכפתור אחד שמוביל לפעולה.",
    primary: "דברו איתנו",
    image: "abstract",
    bg: "#0f172a",
  }),
  heroEditorial({
    id: "section-hero-welcome-warm",
    title: "ברוכים הבאים – Editorial",
    eyebrow: "ברוכים הבאים",
    headline: "יופי, איכות ושקט נפשי",
    copy: "טיפוגרפיה גדולה ותמונה אנכית – hero שנראה כמו מגזין.",
    primary: "קביעת תור",
    image: "beauty",
    bg: "#fff7ed",
  }),
  heroCollage({
    id: "section-hero-welcome-food",
    title: "ברוכים הבאים – קולאז׳",
    badge: "טעמים שנשארים",
    headline: "מהשולחן שלנו – אליכם",
    copy: "תפריט מזמין, אווירה חמה והזמנה בקליק.",
    primary: "להזמנה",
    images: ["food", "travel", "beauty"],
    bg: "#fffbeb",
  }),
  heroSplit({
    id: "section-hero-welcome-fitness",
    title: "ברוכים הבאים – ספורט",
    badge: "חזקים ביחד",
    headline: "האימון שמשנה את היום שלכם",
    copy: "תוכניות אישיות, מאמנים מקצועיים ותוצאות שמרגישים.",
    primary: "הצטרפו",
    image: "wellness",
    bg: "#ecfdf5",
  }),

  // —— About ——
  aboutStory({
    id: "section-about-story",
    title: "אודות – הסיפור שלנו",
    eyebrow: "הסיפור שלנו",
    headline: "עובדים עם לב, חושבים לטווח ארוך",
    copy: "מהיום הראשון בנינו עסק ששם את הלקוח במרכז – עם שקיפות, דיוק ותשומת לב לפרטים.",
    quote: "עיצוב טוב מרגישים עוד לפני שמסבירים אותו.",
    cta: "עוד עלינו",
    image: "team",
  }),
  aboutTimeline({
    id: "section-about-mission",
    title: "אודות – משימה / ציר זמן",
    headline: "להפוך רעיונות לתוצאות מדידות",
    copy: "המסע שלנו – צעד אחרי צעד.",
    bg: "#faf5ff",
  }),
  aboutFounderQuote({
    id: "section-about-place",
    title: "אודות – ציטוט מייסד",
    headline: "מרחב שנועד להשראה",
    quote: "בנינו את העסק סביב אמון – והלקוחות מרגישים את זה בכל מפגש.",
    founder: "המייסד/ת",
    role: "הסטודיו",
    image: "realestate",
  }),
  aboutStatsCollage({
    id: "section-about-craft",
    title: "אודות – קולאז׳ ומספרים",
    headline: "פרטים קטנים שעושים את ההבדל",
    copy: "כל פרויקט נבנה בקפידה – מחומרים ועד חוויית השירות.",
    image: "fashion",
  }),
  aboutEditorial({
    id: "section-about-editorial",
    title: "אודות – Editorial",
    headline: "סיפור מותג בטיפוגרפיה גדולה",
    copy: "פס תמונה צר, כותרת ענקית וטקסט קצר – קומפוזיציה לא־סימטרית.",
    cta: "קראו עוד",
    image: "beauty",
  }),
  aboutCover({
    id: "section-about-cover",
    title: "אודות – כיסוי מלא",
    headline: "מי אנחנו באמת",
    copy: "טקסט על גבי תמונה מלאה – לא עוד פיצול רגיל.",
    cta: "הכירו אותנו",
    image: "travel",
  }),
  aboutSplit({
    id: "section-about-split-classic",
    title: "אודות – פיצול קלאסי",
    eyebrow: "עלינו",
    headline: "עסק שמוביל עם תוצאות",
    copy: "גרסת פיצול קלאסית לתמונה וטקסט – שונה מכל השאר בספרייה.",
    cta: "גלו עוד",
    image: "office",
    imageRight: true,
    previewLayout: "about-split-image-right",
  }),

  // —— Portfolio ——
  portfolioMasonry({
    id: "section-portfolio-six",
    title: "פורטפוליו – Masonry כהה",
    headline: "עבודות נבחרות",
  }),
  portfolioGrid({
    id: "section-portfolio-three",
    title: "פורטפוליו – שלוש בולטות",
    headline: "פרויקטים אחרונים",
    count: 3,
    bg: "#f8fafc",
  }),
  portfolioGrid({
    id: "section-portfolio-four",
    title: "פורטפוליו – ארבע עמודות",
    headline: "מבחר יצירות",
    count: 4,
  }),

  // —— Services ——
  servicesBento({
    id: "section-services-three-icons",
    title: "שירותים – Bento",
    headline: "מה אנחנו מציעים",
    copy: "פריסה א־סימטרית של כרטיסים ותמונה.",
    items: serviceItems,
    image: "tech",
  }),
  servicesSpotlight({
    id: "section-services-four-icons",
    title: "שירותים – זרקור",
    headline: "הפתרונות שלנו",
    items: serviceItems.slice(0, 3),
    image: "beauty",
  }),
  servicesCards({
    id: "section-services-image-cards",
    title: "שירותים – תמונות מרובעות",
    headline: "איכות שאפשר לראות",
    items: serviceItems.slice(0, 3),
    withImages: true,
    imageKeys: ["beauty", "wellness", "food"],
    imageRadius: ["0px", "0px", "0px"],
    bg: "#ffffff",
    previewLayout: "services-cards-img",
  }),
  servicesList({
    id: "section-services-clean-list",
    title: "שירותים – רשימה נקייה",
    headline: "השירותים שלנו",
    items: [
      { title: "ייעוץ ראשוני", copy: "אבחון צרכים והמלצות ברורות.", meta: "45 דק׳" },
      { title: "ליווי חודשי", copy: "פגישות קבועות ומדידה שוטפת.", meta: "חודשי" },
      { title: "הקמת אתר", copy: "בנייה מלאה כולל תוכן ועיצוב.", meta: "פרויקט" },
      { title: "תחזוקה", copy: "עדכונים, גיבויים ושיפורים.", meta: "שוטף" },
    ],
  }),
  servicesCards({
    id: "section-services-booking-style",
    title: "שירותים – הזמנה מעוגלת",
    headline: "שמרו מקום אצלנו",
    items: [
      { title: "טיפול קלאסי", copy: "60 דקות של רוגע מוחלט.", cta: "הזמנה" },
      { title: "חבילת זוגיות", copy: "חוויה משותפת בעיצוב אישי.", cta: "הזמנה" },
      { title: "יום פינוק", copy: "חבילה מלאה לשחרור מלא.", cta: "הזמנה" },
    ],
    withImages: true,
    imageKeys: ["wellness", "beauty", "travel"],
    imageRadius: ["28px", "28px", "28px"],
    bg: "#faf5ff",
    previewLayout: "services-cards-pill",
  }),

  // —— Contact ——
  // Keep EXTRA contacts structurally different from mega form+image clones
  contactBlock({
    id: "section-contact-split-form",
    title: "יצירת קשר – פיצול מרובע",
    headline: "נשמח לשמוע מכם",
    copy: "השאירו פרטים ונחזור אליכם בהקדם עם מענה אישי.",
    variant: "split",
    image: "office",
    imageRadius: "0px",
    formRadius: "0px",
    previewLayout: "contact-extra-square-split",
  }),
  contactBlock({
    id: "section-contact-details-grid",
    title: "יצירת קשר – פרטים בלבד",
    headline: "איך מגיעים אלינו",
    copy: "",
    variant: "details",
    bg: "#ffffff",
    previewLayout: "contact-details-icons-grid",
  }),
  contactBlock({
    id: "section-contact-warm",
    title: "יצירת קשר – טופס מרכזי חם",
    headline: "דברו איתנו",
    copy: "שאלות, הצעות או סתם להגיד שלום – אנחנו כאן.",
    variant: "form-focus",
    image: "beauty",
    bg: "#fff7ed",
    formRadius: "32px",
    previewLayout: "contact-centered-minimal-form",
  }),

  // —— Products ——
  productsGrid({
    id: "section-products-grid-four",
    title: "מוצרים – רשת",
    headline: "המוצרים שלנו",
    items: [
      { title: "מוצר נבחר", price: "₪120", image: "product" },
      { title: "קולקציית קיץ", price: "₪89", image: "fashion" },
      { title: "ערכה מיוחדת", price: "₪159", image: "beauty" },
      { title: "מארז מתנה", price: "₪199", image: "food" },
    ],
  }),
  productSpotlight({
    id: "section-products-spotlight",
    title: "מוצרים – זרקור",
    headline: "הפריט שכולם מדברים עליו",
    copy: "עיצוב מדויק, איכות גבוהה, ומחיר שמכבד.",
    price: "₪249",
    cta: "לרכישה עכשיו",
    image: "product",
  }),
  productsGrid({
    id: "section-products-soft-grid",
    title: "מוצרים – רך",
    headline: "בחרו את שלכם",
    items: [
      { title: "סט בסיסי", price: "₪79", image: "fashion" },
      { title: "סט פרימיום", price: "₪149", image: "beauty" },
      { title: "מהדורה מוגבלת", price: "₪219", image: "product" },
      { title: "אקססוריז", price: "₪59", image: "travel" },
    ],
    bg: "#f8fafc",
  }),

  // —— Features ——
  featuresGrid({
    id: "section-features-three",
    title: "יתרונות – שלושה",
    headline: "למה לבחור בנו",
    eyebrow: "למה אנחנו",
    copy: "יתרונות ברורים שמרגישים בכל נקודת מגע עם הלקוח.",
    cta: "גלו עוד",
    items: featureItems.slice(0, 3),
    cols: 3,
  }),
  featuresTimeline({
    id: "section-features-six",
    title: "יתרונות – ציר זמן",
    headline: "איך זה עובד בשלושה־ארבעה צעדים",
    items: featureItems.slice(0, 4),
    bg: "#f8fafc",
  }),
  featuresOrbit({
    id: "section-features-numbered",
    title: "יתרונות – מסלול מוצר",
    headline: "המוצר במרכז, היתרונות סביבו",
    items: featureItems.slice(0, 4),
    image: "product",
  }),
  featuresSplit({
    id: "section-features-expertise",
    title: "יתרונות – מומחיות",
    headline: "תחומי ההתמחות שלנו",
    eyebrow: "המומחיות שלנו",
    copy: "רשימת יתרונות שמסבירה למה כדאי לעבוד איתנו.",
    cta: "דברו איתנו",
    items: featureItems.slice(0, 4),
    image: "tech",
  }),

  // —— Promote ——
  promoteBlock({
    id: "section-promote-newsletter",
    title: "קידום – ניוזלטר",
    headline: "היו הראשונים לדעת",
    copy: "עדכונים, טיפים ומבצעים ישירות למייל – בלי ספאם.",
    cta: "הרשמה",
    variant: "newsletter",
    image: "food",
  }),
  promoteBlock({
    id: "section-promote-banner",
    title: "קידום – באנר",
    headline: "מבצע השבוע מתחיל עכשיו",
    copy: "הנחה מיוחדת על החבילות הפופולריות – לזמן מוגבל.",
    cta: "למבצע",
    variant: "banner",
    image: "beauty",
  }),
  promoteBlock({
    id: "section-promote-soft",
    title: "קידום – באנר רך",
    headline: "הצטרפו לקהילה",
    copy: "תוכן איכותי והשראה שבועית למי שרוצה לצמוח.",
    cta: "מצטרפים",
    variant: "banner",
    image: "wellness",
    bg: "#ecfdf5",
  }),

  // —— CTA ——
  ctaBlock({
    id: "section-cta-dark",
    title: "CTA – כהה",
    headline: "מוכנים להתחיל?",
    copy: "שיחת היכרות קצרה – ותוכנית ברורה להמשך.",
    primary: "קביעת שיחה",
    secondary: "מידע נוסף",
    dark: true,
  }),
  ctaBlock({
    id: "section-cta-soft",
    title: "CTA – עדין",
    headline: "בואו נבנה את זה ביחד",
    copy: "צוות מקצועי, תהליך שקוף ותוצאה שאתם גאים בה.",
    primary: "צרו קשר",
    dark: false,
    bg: "#eef2ff",
  }),
  ctaImage({
    id: "section-cta-hire",
    title: "CTA – עם תמונה",
    headline: "מוכנים לצעד הבא?",
    copy: "פאנל צף על רקע תמונה – קריאה לפעולה שלא מפספסים.",
    primary: "קביעת שיחה",
    secondary: "מידע נוסף",
    image: "travel",
  }),

  // —— Reviews ——
  testimonialsBlock({
    id: "section-reviews-grid",
    title: "ביקורות – רשת",
    headline: "מה אומרים עלינו",
    items: [
      {
        quote: "שירות מקצועי, זמין ומדויק. הרגשנו שיש על מי לסמוך.",
        name: "נועה כהן",
        role: "בעלת עסק",
      },
      {
        quote: "האתר יצא בדיוק כמו שחלמנו – ואפילו יותר.",
        name: "יואב לוי",
        role: "מנהל שיווק",
      },
      {
        quote: "תהליך חלק, תקשורת מעולה ותוצאה מרשימה.",
        name: "דנה אברהם",
        role: "יזמית",
      },
    ],
  }),
  testimonialsBlock({
    id: "section-reviews-logos",
    title: "ביקורות – לוגואים",
    headline: "סומכים עלינו",
    items: [
      {
        quote: "העבודה איתם שינתה לנו את הדרך שבה אנחנו מופיעים מול לקוחות.",
        name: "נועה לוי",
        role: "מנכ״לית סטודיו",
      },
    ],
    variant: "logos",
  }),
  testimonialsFeatured({
    id: "section-reviews-soft",
    title: "ביקורות – מומלצת",
    headline: "לקוחות מספרים",
    items: [
      {
        quote: "הכל היה ברור מהדקה הראשונה. ממליצה בחום על התהליך והתוצאה.",
        name: "מיכל בר",
        role: "בעלת עסק",
      },
      {
        quote: "שיפרנו המרות תוך שבועיים בלבד.",
        name: "רועי כהן",
        role: "מנכ״ל",
      },
      {
        quote: "עיצוב נקי, מהיר וענייני – בדיוק מה שחיפשנו.",
        name: "שירה לוי",
        role: "מעצבת",
      },
    ],
    image: "team",
    bg: "#fffbeb",
  }),

  // —— Events ——
  eventsBlock({
    id: "section-events-cards",
    title: "אירועים – כרטיסים",
    headline: "אירועים קרובים",
    items: [
      { title: "סדנת פתיחה", date: "12.08", place: "תל אביב" },
      { title: "מפגש קהילה", date: "19.08", place: "אונליין" },
      { title: "יום פתוח", date: "26.08", place: "חיפה" },
    ],
  }),
  eventsBlock({
    id: "section-events-list",
    title: "אירועים – רשימה",
    headline: "לוח אירועים",
    items: [
      { title: "הרצאה פתוחה", date: "01.09", place: "ירושלים" },
      { title: "וובינר מקצועי", date: "05.09", place: "זום" },
      { title: "סדנת ידיים", date: "12.09", place: "תל אביב" },
      { title: "מסיבת השקה", date: "20.09", place: "הרצליה" },
    ],
    variant: "list",
  }),

  // —— Blog ——
  blogBlock({
    id: "section-blog-cards",
    title: "בלוג – כרטיסים",
    headline: "מהבלוג שלנו",
    items: [
      {
        title: "איך לבחור מסר מנצח לדף הבית",
        excerpt: "טיפים פרקטיים לכותרת שמביאה פעולה.",
        date: "מרץ 2026",
      },
      {
        title: "5 טעויות נפוצות באתרי עסקים",
        excerpt: "ומה אפשר לתקן תוך שעה.",
        date: "פבר׳ 2026",
      },
      {
        title: "עיצוב בעברית: מה חשוב לדעת",
        excerpt: "RTL, קריאות וחוויית משתמש.",
        date: "ינו׳ 2026",
      },
    ],
  }),
  blogBlock({
    id: "section-blog-featured",
    title: "בלוג – מומלץ",
    headline: "נשארים מעודכנים",
    featured: true,
    items: [
      {
        title: "המדריך המלא לבניית אתר שעובד בשבילכם",
        excerpt:
          "מעמוד ראשון ועד יצירת קשר – איך בונים מבנה שממיר מבקרים ללקוחות.",
      },
    ],
    bg: "#f8fafc",
  }),

  // —— Pricing ——
  pricingBlock({
    id: "section-pricing-cards-he",
    title: "תמחור – כרטיסים",
    headline: "בחרו את החבילה שלכם",
    plans,
  }),
  pricingComparison({
    id: "section-pricing-rows-he",
    title: "תמחור – השוואה",
    headline: "השוו בין החבילות",
    plans,
    bg: "#f8fafc",
  }),

  // —— Resume ——
  resumeBlock({
    id: "section-resume-experience",
    title: "קורות חיים – ניסיון",
    headline: "ניסיון מקצועי",
    items: [
      {
        role: "מעצבת בכירה",
        place: "סטודיו אלפא",
        dates: "2022–היום",
      },
      {
        role: "מנהלת פרויקטים",
        place: "חברת בטא",
        dates: "2019–2022",
      },
      {
        role: "פרילנסרית",
        place: "עצמאית",
        dates: "2016–2019",
      },
      {
        role: "בוגרת תקשורת חזותית",
        place: "מכללה למדיה",
        dates: "2012–2016",
      },
    ],
  }),
  resumeBlock({
    id: "section-resume-skills",
    title: "קורות חיים – מיומנויות",
    headline: "הכישורים שלי",
    variant: "skills",
    items: [
      { role: "עיצוב ממשק וחוויית משתמש", place: "", dates: "" },
      { role: "מיתוג ואסטרטגיית תוכן", place: "", dates: "" },
      { role: "ניהול לקוחות ופרויקטים", place: "", dates: "" },
      { role: "צילום ועריכת תמונה", place: "", dates: "" },
      { role: "הצגה מול קהל", place: "", dates: "" },
      { role: "עברית ואנגלית ברמה גבוהה", place: "", dates: "" },
    ],
  }),

  // —— Team / FAQ / Stats extras ——
  teamEditorial({
    id: "section-team-four",
    title: "צוות – Editorial",
    eyebrow: "הצוות",
    headline: "האנשים מאחורי המותג",
    copy: "שמות, תפקידים ומשפט קצר על כל אחד.",
    cta: "הכירו את כולם",
    members: [
      { name: "עדי כהן", role: "מייסדת" },
      { name: "יונתן לוי", role: "עיצוב" },
      { name: "מאיה רוזן", role: "שיווק" },
      { name: "איתי שמש", role: "פיתוח" },
    ],
  }),
  faqSplit({
    id: "section-faq-list-he",
    title: "שאלות נפוצות – פיצול",
    headline: "שאלות שחשוב לשאול",
    copy: "תשובות ברורות, בלי סיבובים. לא מצאתם? דברו איתנו.",
    items: [
      {
        q: "כמה זמן לוקח להקים אתר?",
        a: "בדרך כלל בין כמה ימים לשבועיים, תלוי בהיקף התוכן.",
      },
      {
        q: "אפשר לערוך לבד אחרי העלייה לאוויר?",
        a: "בוודאי. העורך מאפשר שינוי טקסטים, תמונות וסקשנים בקלות.",
      },
      {
        q: "האם יש תמיכה בעברית?",
        a: "כן – כולל ממשק RTL ותוכן בעברית מהיסוד.",
      },
      {
        q: "אפשר להחליף סקשנים בהמשך?",
        a: "כן. אפשר להוסיף מהספרייה או לבקש מה־AI וריאציה חדשה.",
      },
    ],
  }),
  statsEditorial({
    id: "section-stats-dark-he",
    title: "מספרים – Editorial",
    eyebrow: "BY THE NUMBERS",
    headline: "תוצאות שאפשר לספור",
    copy: "מאחורי כל מספר יש סיפור של לקוחות, אמון ותוצאות מדידות.",
    cta: "ספרו לנו על היעד שלכם",
    items: [
      { value: "120+", label: "פרויקטים" },
      { value: "98%", label: "שביעות רצון" },
      { value: "8 ש׳", label: "זמן תגובה" },
      { value: "5★", label: "דירוג ממוצע" },
    ],
    bg: "#fefce8",
  }),
];
