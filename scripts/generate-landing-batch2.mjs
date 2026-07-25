#!/usr/bin/env node
/**
 * Generates 10 unique professional landing templates (category: landing).
 * Run: node scripts/generate-landing-batch2.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

const TEMPLATES = [
  {
    id: "advisora",
    name: "Advisora",
    logo: "A",
    niche: "business-consulting",
    badge: "חדש",
    tagline: "ייעוץ עסקי",
    description: "דף נחיתה לייעוץ עסקי: הירו סמכותי, שירותי ייעוץ, תהליך עבודה, מקרי בוחן וטופס שיחה.",
    fonts: { display: "Fraunces:opsz,wght@9..144,600;9..144,700", body: "Sora:wght@400;500;600;700", displayCss: '"Fraunces"', bodyCss: '"Sora"' },
    palette: { primary: "#C9A227", secondary: "#0B1F3A", accent: "#E6C65C", background: "#0B1F3A", surface: "#132B4D", text: "#F4F1E8", muted: "#A8B3C4", dark: "#071428" },
    heroImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=85",
    style: "navyGold",
    copy: {
      heroTitle: "צמיחה עסקית\nעם כיוון ברור.",
      heroSubtitle: "ליווי אסטרטגי למנכ״לים ובעלי עסקים — החלטות חדות, תכנית פעולה, ומדידה שבועית.",
      heroPrimary: "תיאום שיחת אבחון",
      heroSecondary: "לשירותים",
      s2: "שירותי ייעוץ",
      s3: "תוצאות מדידות",
      s4: "מקרי בוחן",
      s5: "תהליך העבודה",
      s6: "לקוחות מספרים",
      s7: "שאלות נפוצות",
      s8: "בואו נדבר על העסק",
      cta: "מוכנים לשלב הבא?",
      phone: "03-600-1122",
      email: "hello@advisora.co.il",
      address: "רוטשילד 1, תל אביב",
      items: [
        ["אסטרטגיה עסקית", "מיפוי שוק, מיצוב ומפת צמיחה ל־12 חודשים."],
        ["ייעול תפעול", "תהליכים, KPI וצוותים שעובדים בלי בלאגן."],
        ["גיוס והשקעות", "הכנה למשקיעים, פיץ׳ וסגירת סיבוב."],
      ],
    },
  },
  {
    id: "markora",
    name: "Markora",
    logo: "M",
    niche: "marketing",
    badge: "Premium",
    tagline: "שיווק דיגיטלי",
    description: "דף נחיתה לסוכנות שיווק: הירו נועז, שירותי מדיה, קמפיינים, תוצאות וטופס בריף.",
    fonts: { display: "Syne:wght@600;700;800", body: "DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700", displayCss: '"Syne"', bodyCss: '"DM Sans"' },
    palette: { primary: "#FF2D55", secondary: "#0A0A0B", accent: "#FF6B8A", background: "#0A0A0B", surface: "#141416", text: "#F7F7F8", muted: "#9B9BA3", dark: "#050505" },
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=85",
    style: "boldMagenta",
    copy: {
      heroTitle: "שיווק שלא\nמתנצל.",
      heroSubtitle: "קמפיינים, תוכן ומדיה שמביאים לידים אמיתיים — לא רק לייקים.",
      heroPrimary: "קבלו הצעה",
      heroSecondary: "לעבודות",
      s2: "מה אנחנו עושים",
      s3: "מספרים מהשטח",
      s4: "קמפיינים נבחרים",
      s5: "שיטת העבודה",
      s6: "לקוחות על Markora",
      s7: "שאלות נפוצות",
      s8: "שלחו בריף קצר",
      cta: "מוכנים לגדול מהר יותר?",
      phone: "03-555-9090",
      email: "go@markora.co.il",
      address: "דיזנגוף 50, תל אביב",
      items: [
        ["מדיה ממומנת", "Meta, Google וטיקטוק עם אופטימיזציה יומית."],
        ["מיתוג ותוכן", "מסר חד, ויז׳ואל חזק, ונוכחות עקבית."],
        ["דפי נחיתה ו־CRO", "המרות גבוהות יותר מאותו תקציב."],
      ],
    },
  },
  {
    id: "glintica",
    name: "Glintica",
    logo: "G",
    niche: "makeup",
    badge: "חדש",
    tagline: "איפור מקצועי",
    description: "דף נחיתה למאפרת: הירו זוהר, שירותי איפור, גלריה, חבילות כלות וטופס הזמנה.",
    fonts: { display: "Cormorant+Infant:wght@500;600;700", body: "Mulish:wght@400;500;600;700", displayCss: '"Cormorant Infant"', bodyCss: '"Mulish"' },
    palette: { primary: "#D4A0A7", secondary: "#1F1A1C", accent: "#E8C4C8", background: "#1F1A1C", surface: "#2A2326", text: "#F8F1F2", muted: "#B5A6A9", dark: "#120E10" },
    heroImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=85",
    style: "roseNoir",
    copy: {
      heroTitle: "איפור שמאיר\nאת הפנים.",
      heroSubtitle: "כלות, אירועים וצילומים — מראה מדויק שמתאים אליכן, לא אליי.",
      heroPrimary: "הזמנת תור",
      heroSecondary: "לגלריה",
      s2: "שירותי איפור",
      s3: "לפני ואחרי",
      s4: "חבילות",
      s5: "הגלריה",
      s6: "כלות מספרות",
      s7: "שאלות נפוצות",
      s8: "קבעו מועד",
      cta: "היום המושלם מתחיל באיפור מדויק.",
      phone: "052-400-7788",
      email: "book@glintica.co.il",
      address: "רמת גן · ניידות לכל הארץ",
      items: [
        ["איפור כלות", "ניסיון מלא, טסט והתאמה לסגנון החתונה."],
        ["איפור ערב", "לאירועים, מסיבות וצילומי תוכן."],
        ["איפור לצילום", "עמידות גבוהה תחת אור סטודיו."],
      ],
    },
  },
  {
    id: "bladehaus",
    name: "Bladehaus",
    logo: "B",
    niche: "barber",
    badge: "Premium",
    tagline: "מספרת גברים",
    description: "דף נחיתה למספרה: הירו חד, מחירון שירותים, צוות ספרים, שעות וטופס תור.",
    fonts: { display: "Bebas+Neue", body: "Barlow:wght@400;500;600;700", displayCss: '"Bebas Neue"', bodyCss: '"Barlow"' },
    palette: { primary: "#E8E8E8", secondary: "#111111", accent: "#C0A060", background: "#111111", surface: "#1A1A1A", text: "#F2F2F2", muted: "#8A8A8A", dark: "#000000" },
    heroImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1400&q=85",
    style: "barberChrome",
    copy: {
      heroTitle: "תספורת חדה.\nסטייל מדויק.",
      heroSubtitle: "ברברינג קלאסי עם דיוק מודרני — תספורת, זקן וטיפוח לגברים.",
      heroPrimary: "קביעת תור",
      heroSecondary: "למחירון",
      s2: "השירותים",
      s3: "הצוות",
      s4: "מחירון",
      s5: "האווירה",
      s6: "לקוחות קבועים",
      s7: "שעות פתיחה",
      s8: "שמרו מקום",
      cta: "התור הבא שלכם מחכה.",
      phone: "03-222-3344",
      email: "cut@bladehaus.co.il",
      address: "אלנבי 88, תל אביב",
      items: [
        ["תספורת קלאסית", "גזירה מדויקת לפי מבנה הפנים."],
        ["עיצוב זקן", "קווים נקיים וטיפוח מלא."],
        ["חבילת ג׳נטלמן", "תספורת + זקן + טיפול פנים."],
      ],
    },
  },
  {
    id: "lexhaven",
    name: "Lexhaven",
    logo: "L",
    niche: "legal",
    badge: "חדש",
    tagline: "משרד עורכי דין",
    description: "דף נחיתה למשרד עו״ד: הירו רציני, תחומי התמחות, צוות, אמינות וטופס ייעוץ.",
    fonts: { display: "Libre+Baskerville:wght@400;700", body: "Karla:wght@400;500;600;700", displayCss: '"Libre Baskerville"', bodyCss: '"Karla"' },
    palette: { primary: "#7A1F2B", secondary: "#F7F3EE", accent: "#A33A48", background: "#F7F3EE", surface: "#FFFFFF", text: "#1C1412", muted: "#6E625C", dark: "#2A1518" },
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=85",
    style: "legalIvory",
    copy: {
      heroTitle: "ייצוג משפטי\nבגובה העיניים.",
      heroSubtitle: "ליווי אישי בדיני חברות, חוזים ונדל״ן — שפה ברורה, אסטרטגיה חדה.",
      heroPrimary: "תיאום ייעוץ",
      heroSecondary: "לתחומים",
      s2: "תחומי התמחות",
      s3: "למה Lexhaven",
      s4: "הצוות המשפטי",
      s5: "תהליך הליווי",
      s6: "לקוחות ממליצים",
      s7: "שאלות נפוצות",
      s8: "בקשת ייעוץ ראשוני",
      cta: "השיחה הראשונה יכולה לשנות את התמונה.",
      phone: "03-718-4400",
      email: "office@lexhaven.co.il",
      address: "דרך מנחם בגין 144, תל אביב",
      items: [
        ["דיני חברות", "הסכמים, מיזוגים וליווי שוטף לעסקים."],
        ["נדל״ן", "עסקאות מכר, שכירות וליווי קבלנים."],
        ["ליטיגציה אזרחית", "ייצוג בבתי משפט עד תוצאה."],
      ],
    },
  },
  {
    id: "pulsefit",
    name: "Pulsefit",
    logo: "P",
    niche: "fitness",
    badge: "חדש",
    tagline: "אימון אישי",
    description: "דף נחיתה למאמן כושר: הירו אנרגטי, תוכניות אימון, תוצאות, מחירון וטופס התחלה.",
    fonts: { display: "Oswald:wght@500;600;700", body: "IBM+Plex+Sans:wght@400;500;600;700", displayCss: '"Oswald"', bodyCss: '"IBM Plex Sans"' },
    palette: { primary: "#C8FF3D", secondary: "#121212", accent: "#E0FF7A", background: "#121212", surface: "#1C1C1C", text: "#F4F4F4", muted: "#9A9A9A", dark: "#0A0A0A" },
    heroImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1400&q=85",
    style: "neonFit",
    copy: {
      heroTitle: "כוח. משמעת.\nתוצאה.",
      heroSubtitle: "אימון אישי ותוכניות תזונה שמביאים שינוי אמיתי — לא סיסמאות.",
      heroPrimary: "התחלת אימון",
      heroSecondary: "לתוכניות",
      s2: "תוכניות אימון",
      s3: "תוצאות מתאמנים",
      s4: "השיטה",
      s5: "מחירון",
      s6: "מה אומרים עלינו",
      s7: "שאלות נפוצות",
      s8: "בואו נתחיל",
      cta: "הגרסה החזקה שלכם מתחילה עכשיו.",
      phone: "050-900-1122",
      email: "train@pulsefit.co.il",
      address: "אולפן אימון · תל אביב",
      items: [
        ["ירידה במשקל", "תוכנית אישית + מעקב שבועי."],
        ["בניית שריר", "פרוגרסיב אולד עם תזונה מותאמת."],
        ["כושר כללי", "אנרגיה, יציבה וביצועים יומיומיים."],
      ],
    },
  },
  {
    id: "lenscraft",
    name: "Lenscraft",
    logo: "LC",
    niche: "photography",
    badge: "Premium",
    tagline: "סטודיו צילום",
    description: "דף נחיתה לסטודיו צילום: הירו ויזואלי, גלריות, חבילות צילום וטופס הזמנה.",
    fonts: { display: "Space+Grotesk:wght@500;600;700", body: "Inter+Tight:wght@400;500;600;700", displayCss: '"Space Grotesk"', bodyCss: '"Inter Tight"' },
    palette: { primary: "#E11D48", secondary: "#0F0F10", accent: "#FB7185", background: "#0F0F10", surface: "#18181B", text: "#FAFAFA", muted: "#A1A1AA", dark: "#09090B" },
    heroImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=85",
    style: "photoMono",
    copy: {
      heroTitle: "רגעים שנשארים\nבתמונה.",
      heroSubtitle: "צילומי מוצר, מותג ואירועים — שפה ויזואלית חדה שמספרת את הסיפור שלכם.",
      heroPrimary: "הזמנת צילום",
      heroSecondary: "לגלריות",
      s2: "סוגי צילום",
      s3: "גלריה נבחרת",
      s4: "חבילות",
      s5: "תהליך העבודה",
      s6: "לקוחות",
      s7: "שאלות נפוצות",
      s8: "דברו איתנו",
      cta: "הפריים הבא שלכם מתחיל כאן.",
      phone: "052-777-3311",
      email: "hello@lenscraft.co.il",
      address: "סטודיו יפו · ניידות",
      items: [
        ["צילום מוצר", "תמונות שממירות — לא רק יפות."],
        ["צילום מותג", "קמפיינים, פורטרטים ותדמית."],
        ["אירועים", "חתונות, השקות ואירועי חברה."],
      ],
    },
  },
  {
    id: "numeris",
    name: "Numeris",
    logo: "N",
    niche: "accounting",
    badge: "חדש",
    tagline: "הנהלת חשבונות",
    description: "דף נחיתה להנהלת חשבונות: הירו נקי, שירותי כספים, שקיפות, חבילות וטופס הצטרפות.",
    fonts: { display: "Literata:opsz,wght@7..72,600;7..72,700", body: "Figtree:wght@400;500;600;700", displayCss: '"Literata"', bodyCss: '"Figtree"' },
    palette: { primary: "#0F6E56", secondary: "#F3F6F4", accent: "#1D9B75", background: "#F3F6F4", surface: "#FFFFFF", text: "#143028", muted: "#5E7268", dark: "#0B241C" },
    heroImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
    style: "ledgerGreen",
    copy: {
      heroTitle: "המספרים ברורים.\nהעסק רגוע.",
      heroSubtitle: "הנהלת חשבונות, דוחות וייעוץ מס לעסקים קטנים ובינוניים — בזמן ובשקיפות.",
      heroPrimary: "שיחת היכרות",
      heroSecondary: "לחבילות",
      s2: "השירותים שלנו",
      s3: "למה Numeris",
      s4: "חבילות חודשיות",
      s5: "איך זה עובד",
      s6: "לקוחות מספרים",
      s7: "שאלות נפוצות",
      s8: "הצטרפות מהירה",
      cta: "סדר פיננסי מתחיל בשיחה אחת.",
      phone: "03-650-8800",
      email: "office@numeris.co.il",
      address: "רחובות · שירות ארצי אונליין",
      items: [
        ["הנהלת חשבונות", "רישום שוטף, סגירות חודש ודוחות."],
        ["ייעוץ מס", "תכנון חכם והפחתת טעויות יקרות."],
        ["שכר וספקים", "ניהול תשלומים בלי כאב ראש."],
      ],
    },
  },
  {
    id: "formara",
    name: "Formara",
    logo: "F",
    niche: "interior-design",
    badge: "Premium",
    tagline: "עיצוב פנים",
    description: "דף נחיתה לסטודיו עיצוב פנים: הירו אדריכלי, פרויקטים, תהליך עיצוב וטופס ייעוץ.",
    fonts: { display: "Instrument+Serif", body: "Manrope:wght@400;500;600;700", displayCss: '"Instrument Serif"', bodyCss: '"Manrope"' },
    palette: { primary: "#8B5E3C", secondary: "#1E1C1A", accent: "#C4A484", background: "#1E1C1A", surface: "#2A2623", text: "#F3EEE7", muted: "#A39A90", dark: "#12100E" },
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    style: "interiorClay",
    copy: {
      heroTitle: "חללים שמרגישים\nכמו בית.",
      heroSubtitle: "עיצוב פנים לדירות, משרדים ועסקים — חומרים מדויקים, אור נכון, ואווירה שנשארת.",
      heroPrimary: "תיאום פגישה",
      heroSecondary: "לפרויקטים",
      s2: "תחומי עיצוב",
      s3: "פרויקטים נבחרים",
      s4: "הגישה שלנו",
      s5: "תהליך העיצוב",
      s6: "לקוחות מספרים",
      s7: "שאלות נפוצות",
      s8: "ספרו לנו על החלל",
      cta: "בואו נעצב את החלל הבא שלכם.",
      phone: "054-321-7788",
      email: "studio@formara.co.il",
      address: "סטודיו יפו · פרויקטים ארציים",
      items: [
        ["דירות מגורים", "תכנון מלא מחלוקה ועד ריהוט."],
        ["משרדים", "חללי עבודה שמייצרים פוקוס ומותג."],
        ["מסחרי", "חנויות ובתי קפה עם נוכחות."],
      ],
    },
  },
  {
    id: "vowline",
    name: "Vowline",
    logo: "V",
    niche: "wedding-planning",
    badge: "חדש",
    tagline: "תכנון חתונות",
    description: "דף נחיתה לתכנון חתונות: הירו רומנטי-מודרני, חבילות, תהליך, גלריה וטופס ייעוץ.",
    fonts: { display: "Great+Vibes", body: "Outfit:wght@300;400;500;600;700", displayCss: '"Great Vibes"', bodyCss: '"Outfit"' },
    palette: { primary: "#5B7C99", secondary: "#F8F4F0", accent: "#8FA9C0", background: "#F8F4F0", surface: "#FFFFFF", text: "#243040", muted: "#7A8490", dark: "#1A2430" },
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=90",
    img2: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=85",
    style: "weddingBlue",
    copy: {
      heroTitle: "היום שלכם,\nבדיוק כמו שחלמתם.",
      heroSubtitle: "תכנון חתונות מלא — עיצוב, ספקים, לו״ז וניהול ביום האירוע.",
      heroPrimary: "שיחת היכרות",
      heroSecondary: "לחבילות",
      s2: "חבילות תכנון",
      s3: "רגעים מהחתונות",
      s4: "איך אנחנו עובדים",
      s5: "ספקים ושותפים",
      s6: "זוגות מספרים",
      s7: "שאלות נפוצות",
      s8: "בואו נתחיל לתכנן",
      cta: "החתונה המושלמת מתחילה בשיחה רגועה.",
      phone: "052-888-4411",
      email: "love@vowline.co.il",
      address: "תל אביב · כל הארץ",
      items: [
        ["תכנון מלא", "מהקונספט ועד סיום האירוע."],
        ["ניהול יום האירוע", "צוות בשטח שדואג להכול."],
        ["עיצוב וקונספט", "שפה עיצובית עקבית ויפה."],
      ],
    },
  },
];

function pascal(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function defaultData(t) {
  const c = t.copy;
  const [i1, i2, i3] = c.items;
  return `export const ${t.id}DefaultData = {
  templateId: "${t.id}",
  name: "${t.name}",
  brandName: "${t.name}",
  logoText: "${t.logo}",
  navHome: "בית",
  navServices: "שירותים",
  navAbout: "אודות",
  navContact: "יצירת קשר",
  heroEyebrow: "${t.tagline}",
  heroTitle: ${JSON.stringify(c.heroTitle)},
  heroSubtitle: ${JSON.stringify(c.heroSubtitle)},
  heroPrimaryButton: "${c.heroPrimary}",
  heroSecondaryButton: "${c.heroSecondary}",
  heroImage: "${t.heroImage}",
  sectionImage: "${t.img2}",
  heroStatOne: "120+",
  heroStatOneLabel: "לקוחות",
  heroStatTwo: "4.9",
  heroStatTwoLabel: "דירוג ממוצע",
  heroStatThree: "8+",
  heroStatThreeLabel: "שנות ניסיון",
  sectionTwoTitle: "${c.s2}",
  sectionThreeTitle: "${c.s3}",
  sectionFourTitle: "${c.s4}",
  sectionFiveTitle: "${c.s5}",
  sectionSixTitle: "${c.s6}",
  sectionSevenTitle: "${c.s7}",
  sectionEightTitle: "${c.s8}",
  itemOneTitle: ${JSON.stringify(i1[0])},
  itemOneText: ${JSON.stringify(i1[1])},
  itemTwoTitle: ${JSON.stringify(i2[0])},
  itemTwoText: ${JSON.stringify(i2[1])},
  itemThreeTitle: ${JSON.stringify(i3[0])},
  itemThreeText: ${JSON.stringify(i3[1])},
  reviewOneText: "שירות מקצועי, מדויק ונעים. הרגשנו שיש מישהו שאפשר לסמוך עליו לאורך כל הדרך.",
  reviewOneName: "נועה שחר",
  reviewOneRole: "לקוחה",
  reviewTwoText: "תהליך ברור, תקשורת מצוינת ותוצאה שעברה את הציפיות. ממליצים בחום.",
  reviewTwoName: "איתי ברק",
  reviewTwoRole: "לקוח עסקי",
  reviewThreeText: "הצוות היה זמין, מקצועי ויצירתי. חוויה ברמה גבוהה מהפגישה הראשונה.",
  reviewThreeName: "מיכל רוזן",
  reviewThreeRole: "לקוחה",
  faqOneQuestion: "איך מתחילים?",
  faqOneAnswer: "משאירים פרטים בטופס או מתקשרים — ומתאמים שיחת היכרות קצרה להבנת הצרכים.",
  faqTwoQuestion: "מה כולל הליווי?",
  faqTwoAnswer: "ליווי מותאם אישית לפי המטרות שלכם, עם שלבים ברורים ותיאום ציפיות מראש.",
  faqThreeQuestion: "תוך כמה זמן רואים תוצאות?",
  faqThreeAnswer: "תלוי בפרויקט — בדרך כלל כיוון ברור כבר אחרי הפגישה הראשונה, ותוצאות מדידות בהמשך.",
  contactTitle: "${c.s8}",
  contactText: "השאירו פרטים ונחזור אליכם עם מענה מקצועי ומהיר.",
  contactButton: "שליחה",
  phone: "${c.phone}",
  email: "${c.email}",
  address: "${c.address}",
  ctaTitle: "${c.cta}",
  ctaText: "בואו נדבר על מה שחשוב לכם — בלי התחייבות, עם כיוון ברור.",
  ctaButton: "${c.heroPrimary}",
};
`;
}

function editorCss(t) {
  const p = t.palette;
  const f = t.fonts;
  return `export const ${t.id}EditorCss = \`
@import url('https://fonts.googleapis.com/css2?family=${f.display}&family=${f.body}&display=swap');

[data-template-id="${t.id}"],
[data-template-id="${t.id}-preview"] {
  --p: ${p.primary};
  --s: ${p.secondary};
  --a: ${p.accent};
  --bg: ${p.background};
  --surface: ${p.surface};
  --text: ${p.text};
  --muted: ${p.muted};
  --dark: ${p.dark};
  font-family: ${f.bodyCss}, sans-serif;
  color: var(--text);
  background: var(--bg);
}

[data-template-id="${t.id}"] .t-display,
[data-template-id="${t.id}-preview"] .t-display {
  font-family: ${f.displayCss}, serif;
}

@keyframes t-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes t-scale {
  from { transform: scale(1.08); }
  to { transform: scale(1); }
}
@keyframes t-line {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

[data-template-id="${t.id}"] .t-anim,
[data-template-id="${t.id}-preview"] .t-anim {
  animation: t-up 0.85s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="${t.id}"] .t-d1,
[data-template-id="${t.id}-preview"] .t-d1 { animation-delay: .12s; }
[data-template-id="${t.id}"] .t-d2,
[data-template-id="${t.id}-preview"] .t-d2 { animation-delay: .24s; }
[data-template-id="${t.id}"] .t-ken,
[data-template-id="${t.id}-preview"] .t-ken { animation: t-scale 14s ease-out both; }
[data-template-id="${t.id}"] .t-line,
[data-template-id="${t.id}-preview"] .t-line {
  transform-origin: right center;
  animation: t-line .9s .35s cubic-bezier(0.22,1,0.36,1) both;
}
[data-template-id="${t.id}"] .t-card,
[data-template-id="${t.id}-preview"] .t-card {
  border-radius: 0;
  transition: transform .45s ease, border-color .3s ease, background .3s ease;
}
[data-template-id="${t.id}"] .t-card:hover,
[data-template-id="${t.id}-preview"] .t-card:hover {
  transform: translateY(-4px);
}
\`;
`;
}

function schema(t) {
  return `export const ${t.id}Schema = {
  templateId: "${t.id}",
  name: "${t.name}",
  fields: [
    { key: "brandName", label: "שם המותג", type: "text" },
    { key: "heroTitle", label: "כותרת הירו", type: "textarea" },
    { key: "heroSubtitle", label: "טקסט הירו", type: "textarea" },
    { key: "heroImage", label: "תמונת הירו", type: "image" },
    { key: "heroPrimaryButton", label: "כפתור ראשי", type: "text" },
    { key: "sectionTwoTitle", label: "כותרת סקשן 2", type: "text" },
    { key: "contactTitle", label: "כותרת יצירת קשר", type: "textarea" },
    { key: "phone", label: "טלפון", type: "text" },
    { key: "email", label: "אימייל", type: "text" },
    { key: "ctaTitle", label: "כותרת CTA", type: "textarea" },
  ],
};
`;
}

function preview(t) {
  const P = pascal(t.id);
  return `import React from "react";
import ${P}Pages from "./pages";

export default function ${P}Preview() {
  return (
    <div dir="rtl" data-template-id="${t.id}-preview" className="min-h-screen w-full" style={{ background: "${t.palette.background}", overflowX: "hidden" }}>
      <${P}Pages initialPage="home" mode="preview" />
    </div>
  );
}
`;
}

function thumbnail(t) {
  const P = pascal(t.id);
  const p = t.palette;
  return `import React from "react";

export default function ${P}Thumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "${p.background}", color: "${p.text}" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, ${p.primary}55, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "${p.primary}", color: "${p.dark}", borderRadius: 0 }}>${t.logo}</div>
          <span className="text-sm font-bold" style={{ fontFamily: ${JSON.stringify(t.fonts.displayCss)} }}>${t.name}</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "${p.primary}" }}>${t.tagline}</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: ${JSON.stringify(t.fonts.displayCss)} }}>${t.copy.heroTitle.replace(/\\n/g, " ")}</h3>
        <div className="mt-5 h-px w-14" style={{ background: "${p.primary}" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["120+", "4.9", "8+"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "${p.primary}44", color: "${p.primary}", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
}

function meta(t) {
  const P = pascal(t.id);
  const p = t.palette;
  const blocks = [
    "header", "hero", "services", "stats", "showcase", "process", "testimonials", "faq", "contact", "footer",
  ];
  return `import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ${P}Pages, { ${t.id}Pages } from "./pages";
import ${P}Preview from "./preview";
import ${P}Thumbnail from "./thumbnail";
import { ${t.id}EditorCss } from "./editorCss";
import { ${t.id}Schema } from "./schema";
import { ${t.id}DefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "${p.primary}",
  secondary: "${p.secondary}",
  accent: "${p.accent}",
  background: "${p.background}",
  surface: "${p.surface}",
  text: "${p.text}",
  muted: "${p.muted}",
  dark: "${p.dark}",
};

const blocks = [
${blocks.map((b) => `  { type: "${b}", variant: "${t.style}-${b}", title: "${b}" },`).join("\n")}
];

export const ${t.id}Seed = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  description: "${t.description}",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  niche: "${t.niche}",
  layout: "full",
  image: (${t.id}DefaultData as Record<string, any>).heroImage,
  heroTitle: (${t.id}DefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (${t.id}DefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: \`${t.id}-\${index + 1}-\${block.type}\`, ...block })),
  pages: ${t.id}Pages,
  editor: { pages: ${t.id}Pages, css: ${t.id}EditorCss },
  css: ${t.id}EditorCss,
  data: ${t.id}DefaultData,
  defaultData: ${t.id}DefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ${t.id}Template = {
  id: "${t.id}",
  key: "${t.id}",
  name: "${t.name}",
  title: "${t.name}",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "landing",
  categoryLabel: "דפי נחיתה",
  badge: "${t.badge}",
  description: "${t.description}",
  thumbnail: React.createElement(${P}Thumbnail),
  preview: React.createElement(${P}Preview),
  component: ${P}Pages,
  Component: ${P}Pages,
  seed: ${t.id}Seed,
  pages: ${t.id}Pages,
  editorCss: ${t.id}EditorCss,
  schema: ${t.id}Schema,
  defaultData: ${t.id}DefaultData,
  renderer: {
    key: "${t.id}",
    name: "${t.name}",
    Component: ${P}Pages,
    component: ${P}Pages,
    pages: ${t.id}Pages,
    editorMode: "visual-react",
    editorCss: ${t.id}EditorCss,
    schema: ${t.id}Schema,
    defaultData: ${t.id}DefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ${t.id}Template;
`;
}

/** Unique section layouts per style — square cards (border-radius: 0 via .t-card) */
function styleLayouts(style) {
  const commonItems = `[getValue(data,"itemOneTitle"),getValue(data,"itemOneText")],[getValue(data,"itemTwoTitle"),getValue(data,"itemTwoText")],[getValue(data,"itemThreeTitle"),getValue(data,"itemThreeText")]`;

  const heroes = {
    navyGold: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-l from-[#0B1F3A] via-[#0B1F3A]/85 to-[#0B1F3A]/35" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-20 pt-28 lg:px-8">
        <div className="max-w-2xl">
          <p className="t-anim text-xs font-semibold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim t-d1 mt-4 whitespace-pre-line text-5xl font-bold leading-[1.02] text-white md:text-7xl">{getValue(data,"heroTitle")}</h1>
          <div className="t-line mt-5 h-px w-24 bg-[var(--p)]" />
          <p className="t-anim t-d2 mt-6 max-w-lg text-lg leading-8 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="t-anim t-d2 mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/30 px-8 py-3.5 text-sm font-semibold text-white">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </div>
      </div>
    </section>`,
    boldMagenta: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 opacity-30" style={{background:"radial-gradient(circle at 80% 20%, #FF2D5566, transparent 40%)"}} />
      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 py-28 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="t-anim text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim t-d1 mt-4 whitespace-pre-line text-6xl font-extrabold leading-[0.95] md:text-8xl">{getValue(data,"heroTitle")}</h1>
          <p className="t-anim t-d2 mt-6 max-w-md text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/20 px-8 py-4 text-sm font-semibold">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </div>
        <div className="overflow-hidden border border-white/10">
          <img src={getValue(data,"heroImage")} alt="" className="t-ken h-[480px] w-full object-cover" />
        </div>
      </div>
    </section>`,
    roseNoir: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1F1A1C] via-[#1F1A1C]/50 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-end px-5 pb-20 text-center">
        <p className="t-anim text-xs tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display t-anim t-d1 mt-4 whitespace-pre-line text-5xl font-semibold leading-[1.05] md:text-7xl">{getValue(data,"heroTitle")}</h1>
        <p className="t-anim t-d2 mt-5 max-w-xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-semibold text-[var(--dark)]">{getValue(data,"heroPrimaryButton")}</button>
          <button type="button" className="border border-white/25 px-8 py-3.5 text-sm">{getValue(data,"heroSecondaryButton")}</button>
        </div>
      </div>
    </section>`,
    barberChrome: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden bg-black">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover opacity-55 grayscale" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 lg:px-8">
        <p className="t-anim text-xs font-bold uppercase tracking-[0.4em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display t-anim t-d1 mt-3 whitespace-pre-line text-7xl leading-[0.9] tracking-wide text-white md:text-9xl">{getValue(data,"heroTitle")}</h1>
        <p className="t-anim t-d2 mt-6 max-w-lg text-lg text-white/70">{getValue(data,"heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={openModal} className="bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black">{getValue(data,"heroPrimaryButton")}</button>
          <button type="button" className="border border-[var(--a)] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[var(--a)]">{getValue(data,"heroSecondaryButton")}</button>
        </div>
      </div>
    </section>`,
    legalIvory: `<section data-template-section-type="hero" className="bg-[var(--bg)] px-5 pb-16 pt-28 lg:px-8 lg:pb-24 lg:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="t-anim text-xs font-bold uppercase tracking-[0.28em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim t-d1 mt-4 whitespace-pre-line text-5xl font-bold leading-[1.08] md:text-6xl">{getValue(data,"heroTitle")}</h1>
          <div className="t-line mt-5 h-0.5 w-20 bg-[var(--p)]" />
          <p className="t-anim t-d2 mt-6 text-lg leading-8 text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-[var(--p)] px-8 py-3.5 text-sm font-semibold text-[var(--p)]">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </div>
        <div className="overflow-hidden border border-[var(--p)]/20">
          <img src={getValue(data,"heroImage")} alt="" className="h-[460px] w-full object-cover" />
        </div>
      </div>
    </section>`,
    neonFit: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#121212]/75" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 lg:px-8">
        <p className="t-anim text-xs font-bold uppercase tracking-[0.35em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display t-anim t-d1 mt-3 whitespace-pre-line text-6xl font-bold uppercase leading-[0.92] md:text-8xl">{getValue(data,"heroTitle")}</h1>
        <p className="t-anim t-d2 mt-6 max-w-xl text-lg text-white/75">{getValue(data,"heroSubtitle")}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-4 text-sm font-bold uppercase text-black">{getValue(data,"heroPrimaryButton")}</button>
          <button type="button" className="border border-white/30 px-8 py-4 text-sm font-bold uppercase text-white">{getValue(data,"heroSecondaryButton")}</button>
        </div>
      </div>
    </section>`,
    photoMono: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-5 lg:px-8">
        <div className="max-w-xl">
          <p className="t-anim text-xs font-semibold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display t-anim t-d1 mt-4 whitespace-pre-line text-5xl font-bold leading-[1.02] md:text-7xl">{getValue(data,"heroTitle")}</h1>
          <p className="t-anim t-d2 mt-6 text-lg text-white/70">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/30 px-8 py-3.5 text-sm font-semibold text-white">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </div>
      </div>
    </section>`,
    ledgerGreen: `<section data-template-section-type="hero" className="bg-[var(--bg)] px-5 pb-16 pt-28 lg:px-8 lg:pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-10 border border-[var(--p)]/15 bg-white p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12" style={{borderRadius:0}}>
          <div>
            <p className="t-anim text-xs font-bold uppercase tracking-[0.25em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
            <h1 className="t-display t-anim t-d1 mt-4 whitespace-pre-line text-5xl font-bold leading-[1.05] md:text-6xl">{getValue(data,"heroTitle")}</h1>
            <p className="t-anim t-d2 mt-5 max-w-xl text-lg text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
              <button type="button" className="border border-[var(--p)] px-8 py-3.5 text-sm font-semibold text-[var(--p)]">{getValue(data,"heroSecondaryButton")}</button>
            </div>
          </div>
          <img src={getValue(data,"heroImage")} alt="" className="h-72 w-full object-cover lg:h-80" />
        </div>
      </div>
    </section>`,
    interiorClay: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#1E1C1A]/55" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-20 lg:px-8">
        <div className="max-w-3xl border border-white/15 bg-[#1E1C1A]/70 p-8 backdrop-blur-md lg:p-12" style={{borderRadius:0}}>
          <p className="text-xs tracking-[0.3em] text-[var(--a)]">{getValue(data,"heroEyebrow")}</p>
          <h1 className="t-display mt-3 whitespace-pre-line text-5xl leading-[1.05] md:text-7xl">{getValue(data,"heroTitle")}</h1>
          <p className="mt-5 max-w-xl text-[var(--muted)]">{getValue(data,"heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-white">{getValue(data,"heroPrimaryButton")}</button>
            <button type="button" className="border border-white/30 px-8 py-3.5 text-sm text-white">{getValue(data,"heroSecondaryButton")}</button>
          </div>
        </div>
      </div>
    </section>`,
    weddingBlue: `<section data-template-section-type="hero" className="relative min-h-[100svh] overflow-hidden">
      <img src={getValue(data,"heroImage")} alt="" className="t-ken absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#F8F4F0] via-[#F8F4F0]/40 to-transparent" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-end px-5 pb-16 text-center">
        <p className="t-anim text-xs font-semibold uppercase tracking-[0.3em] text-[var(--p)]">{getValue(data,"heroEyebrow")}</p>
        <h1 className="t-display t-anim t-d1 mt-3 whitespace-pre-line text-6xl leading-[1.1] text-[var(--dark)] md:text-8xl">{getValue(data,"heroTitle")}</h1>
        <p className="t-anim t-d2 mt-5 max-w-xl text-lg text-[var(--muted)]" style={{fontFamily:'Outfit, sans-serif'}}>{getValue(data,"heroSubtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-8 py-3.5 text-sm font-semibold text-white" style={{fontFamily:'Outfit, sans-serif'}}>{getValue(data,"heroPrimaryButton")}</button>
          <button type="button" className="border border-[var(--p)] px-8 py-3.5 text-sm font-semibold text-[var(--p)]" style={{fontFamily:'Outfit, sans-serif'}}>{getValue(data,"heroSecondaryButton")}</button>
        </div>
      </div>
    </section>`,
  };

  const services = {
    default: `<section data-template-section-type="services" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[${commonItems}].map(([title,text]) => (
            <article key={title} className="t-card border border-[var(--p)]/25 bg-[var(--surface)] p-7">
              <div className="mb-5 h-1 w-10 bg-[var(--p)]" />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>`,
    stacked: `<section data-template-section-type="services" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data,"sectionTwoTitle")}</h2>
        <div className="mt-10 divide-y divide-white/10 border border-white/10">
          {[${commonItems}].map(([title,text],i) => (
            <article key={title} className="t-card grid gap-2 bg-[var(--surface)] p-7 md:grid-cols-[80px_1fr]">
              <span className="text-3xl font-bold text-[var(--p)]">0{i+1}</span>
              <div><h3 className="text-xl font-bold">{title}</h3><p className="mt-2 text-sm text-[var(--muted)]">{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>`,
  };

  return { hero: heroes[style] || heroes.navyGold, services: style === "boldMagenta" || style === "barberChrome" || style === "neonFit" ? services.stacked : services.default };
}

function pages(t) {
  const P = pascal(t.id);
  const layouts = styleLayouts(t.style);
  const lightBg = ["legalIvory", "ledgerGreen", "weddingBlue"].includes(t.style);
  const headerBorder = lightBg ? "border-[var(--p)]/15 bg-[var(--bg)]/90" : "border-white/10 bg-[var(--bg)]/80";
  const headerBtn = lightBg
    ? "bg-[var(--p)] px-5 py-2.5 text-sm font-bold text-white"
    : "border border-[var(--p)] px-5 py-2.5 text-sm font-semibold text-[var(--p)]";

  return `import React, { useMemo, useState } from "react";
import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { ${t.id}DefaultData } from "./defaultData";
import { useTemplatePageNavigation } from "../shared/useTemplatePageNavigation";
import { ${t.id}EditorCss } from "./editorCss";

export const ${t.id}Pages = [{ id: "home", label: "בית", slug: "/" }];

type ${P}PagesProps = {
  initialPage?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  page?: string;
  pageId?: string;
  initialPageId?: string;
  activePageId?: string;
  currentPageId?: string;
};

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (${t.id}DefaultData as Record<string, any>)[key] ?? "";
}

function Header({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" className="absolute inset-x-0 top-0 z-50 border-b ${headerBorder} backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center text-sm font-bold" style={{ background: "var(--p)", color: "var(--dark)", borderRadius: 0 }}>{getValue(data, "logoText")}</span>
          <span className="t-display text-2xl font-bold">{getValue(data, "brandName")}</span>
        </div>
        <button type="button" onClick={openModal} className="hidden sm:inline-flex ${headerBtn}">{getValue(data, "heroPrimaryButton")}</button>
      </div>
    </header>
  );
}

function Hero({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    ${layouts.hero}
  );
}

function Services({ data }: { data: Record<string, any> }) {
  return (
    ${layouts.services}
  );
}

function Stats({ data }: { data: Record<string, any> }) {
  const stats = [
    [getValue(data, "heroStatOne"), getValue(data, "heroStatOneLabel")],
    [getValue(data, "heroStatTwo"), getValue(data, "heroStatTwoLabel")],
    [getValue(data, "heroStatThree"), getValue(data, "heroStatThreeLabel")],
  ];
  return (
    <section data-template-section-type="stats" className="border-y border-[var(--p)]/20 bg-[var(--surface)] px-5 py-14 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        {stats.map(([n, l]) => (
          <div key={l} className="t-card border border-[var(--p)]/20 p-6 text-center">
            <div className="t-display text-4xl font-bold text-[var(--p)] md:text-5xl">{n}</div>
            <div className="mt-2 text-sm text-[var(--muted)]">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Showcase({ data }: { data: Record<string, any> }) {
  return (
    <section data-template-section-type="showcase" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden border border-[var(--p)]/20">
          <img src={getValue(data, "sectionImage")} alt="" className="h-[420px] w-full object-cover transition duration-700 hover:scale-105" />
        </div>
        <div>
          <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "sectionFourTitle")}</h2>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{getValue(data, "heroSubtitle")}</p>
          <div className="mt-8 grid gap-4">
            {["אבחון מדויק", "תכנית ברורה", "ליווי צמוד"].map((step, i) => (
              <div key={step} className="t-card flex items-center gap-4 border border-[var(--p)]/20 bg-[var(--surface)] p-4">
                <span className="grid h-10 w-10 place-items-center bg-[var(--p)] text-sm font-bold text-[var(--dark)]">{i + 1}</span>
                <span className="font-semibold">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process({ data }: { data: Record<string, any> }) {
  const steps = [
    ["01", "היכרות", "מבינים מטרות, קהל ואילוצים."],
    ["02", "תכנון", "בונים מסלול פעולה מדיד."],
    ["03", "ביצוע", "מיישמים עם בקרה שוטפת."],
    ["04", "שיפור", "מדידה ואופטימיזציה מתמדת."],
  ];
  return (
    <section data-template-section-type="process" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "sectionFiveTitle")}</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([num, title, text]) => (
            <article key={num} className="t-card border border-[var(--p)]/20 bg-[var(--bg)] p-6">
              <div className="t-display text-3xl text-[var(--p)]">{num}</div>
              <h3 className="mt-3 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ data }: { data: Record<string, any> }) {
  const reviews = [
    [getValue(data, "reviewOneText"), getValue(data, "reviewOneName"), getValue(data, "reviewOneRole")],
    [getValue(data, "reviewTwoText"), getValue(data, "reviewTwoName"), getValue(data, "reviewTwoRole")],
    [getValue(data, "reviewThreeText"), getValue(data, "reviewThreeName"), getValue(data, "reviewThreeRole")],
  ];
  return (
    <section data-template-section-type="testimonials" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "sectionSixTitle")}</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reviews.map(([text, name, role]) => (
            <blockquote key={name} className="t-card border border-[var(--p)]/20 bg-[var(--surface)] p-7">
              <p className="leading-8 text-[var(--text)]">"{text}"</p>
              <footer className="mt-6 border-t border-[var(--p)]/15 pt-4">
                <p className="font-bold">{name}</p>
                <p className="text-sm text-[var(--muted)]">{role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);
  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];
  return (
    <section data-template-section-type="faq" className="bg-[var(--surface)] px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="t-display text-center text-4xl font-bold md:text-5xl">{getValue(data, "sectionSevenTitle")}</h2>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a], i) => (
            <div key={q} className="t-card border border-[var(--p)]/20 bg-[var(--bg)]">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-right">
                <span className="font-bold">{q}</span>
                <span className="grid h-8 w-8 place-items-center bg-[var(--p)] text-[var(--dark)]">{open === i ? "−" : "+"}</span>
              </button>
              {open === i ? <p className="px-5 pb-5 text-sm leading-7 text-[var(--muted)]">{a}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <section data-template-section-type="contact" className="px-5 py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div>
          <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "contactTitle")}</h2>
          <p className="mt-4 text-[var(--muted)]">{getValue(data, "contactText")}</p>
          <div className="mt-8 space-y-3 text-sm">
            <p><span className="text-[var(--p)]">טלפון</span> · {getValue(data, "phone")}</p>
            <p><span className="text-[var(--p)]">אימייל</span> · {getValue(data, "email")}</p>
            <p><span className="text-[var(--p)]">כתובת</span> · {getValue(data, "address")}</p>
          </div>
        </div>
        <form className="t-card grid gap-4 border border-[var(--p)]/20 bg-[var(--surface)] p-8">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="טלפון" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none focus:border-[var(--p)]" placeholder="אימייל" />
          <button type="button" onClick={openModal} className="bg-[var(--p)] px-7 py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </section>
  );
}

function Footer({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <footer data-template-section-type="footer" className="border-t border-[var(--p)]/20 px-5 pb-10 pt-16 lg:px-8">
      <div className="mx-auto max-w-7xl border border-[var(--p)]/25 bg-[var(--surface)] p-10 text-center lg:p-16" style={{ borderRadius: 0 }}>
        <h2 className="t-display text-4xl font-bold md:text-5xl">{getValue(data, "ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">{getValue(data, "ctaText")}</p>
        <button type="button" onClick={openModal} className="mt-8 bg-[var(--p)] px-8 py-3.5 text-sm font-bold text-[var(--dark)]">{getValue(data, "ctaButton")}</button>
      </div>
      <p className="mt-8 text-center text-xs text-[var(--muted)]">© {new Date().getFullYear()} {getValue(data, "brandName")}</p>
    </footer>
  );
}

function ContactModal({ data, open, onClose }: { data: Record<string, any>; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[var(--p)]/30 bg-[var(--surface)] p-8" style={{ borderRadius: 0 }}>
        <button type="button" onClick={onClose} className="absolute left-4 top-4 text-2xl">×</button>
        <h3 className="t-display text-3xl font-bold">{getValue(data, "contactTitle")}</h3>
        <form className="mt-6 grid gap-3">
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="שם מלא" />
          <input className="border border-[var(--p)]/20 bg-transparent px-5 py-4 text-right outline-none" placeholder="טלפון" />
          <button type="button" className="bg-[var(--p)] py-4 text-sm font-bold text-[var(--dark)]">{getValue(data, "contactButton")}</button>
        </form>
      </div>
    </div>
  );
}

function HomePage({ data, openModal }: { data: Record<string, any>; openModal: () => void }) {
  return (
    <>
      <Hero data={data} openModal={openModal} />
      <Services data={data} />
      <Stats data={data} />
      <Showcase data={data} />
      <Process data={data} />
      <Testimonials data={data} />
      <Faq data={data} />
      <Contact data={data} openModal={openModal} />
      <Footer data={data} openModal={openModal} />
    </>
  );
}

export default function ${P}Pages(props: ${P}PagesProps) {
  const { initialPage = "home", mode = "preview", data, onPageChange, isPublic, viewMode, runtimeMode, page, pageId, initialPageId, activePageId, currentPageId } = props;
  const mergedData = useMemo(() => ({ ...${t.id}DefaultData, ...(data ?? {}) }), [data]);
  const { currentPage } = useTemplatePageNavigation(
    { page, pageId, initialPage, initialPageId, activePageId, currentPageId, onPageChange, isPublic, viewMode, runtimeMode },
    { allowedPages: ["home"], fallbackPage: "home" },
  );
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div dir="rtl" data-template-id={mode === "preview" ? "${t.id}-preview" : "${t.id}"} className="min-h-screen w-full overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: ${t.id}EditorCss }} />
      <Header data={mergedData} openModal={() => setModalOpen(true)} />
      <VisualPageStack
        activePageId={currentPage}
        pages={[{ id: "home", content: <HomePage data={mergedData} openModal={() => setModalOpen(true)} /> }]}
      />
      <ContactModal data={mergedData} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
`;
}

// Generate all
for (const t of TEMPLATES) {
  const dir = path.join(ROOT, t.id);
  write(path.join(dir, "defaultData.ts"), defaultData(t));
  write(path.join(dir, "editorCss.ts"), editorCss(t));
  write(path.join(dir, "schema.ts"), schema(t));
  write(path.join(dir, "preview.tsx"), preview(t));
  write(path.join(dir, "thumbnail.tsx"), thumbnail(t));
  write(path.join(dir, "meta.ts"), meta(t));
  write(path.join(dir, "pages.tsx"), pages(t));
  console.log("✓", t.id);
}

// Wire index.ts
const indexPath = path.join(ROOT, "index.ts");
let index = fs.readFileSync(indexPath, "utf8");
const imports = TEMPLATES.map((t) => `import { ${t.id}Template } from "./${t.id}/meta";`).join("\n");
const entries = TEMPLATES.map((t) => `  ${t.id}Template,`).join("\n");

if (!index.includes("advisoraTemplate")) {
  if (!index.includes('from "./handcraft/meta"')) {
    // insert after fluxora
    index = index.replace(
      'import { fluxoraTemplate } from "./fluxora/meta";',
      'import { fluxoraTemplate } from "./fluxora/meta";\n' + imports,
    );
  } else {
    index = index.replace(
      'import { handcraftTemplate } from "./handcraft/meta";',
      'import { handcraftTemplate } from "./handcraft/meta";\n' + imports,
    );
  }
  // add to array after handcraftTemplate or fluxoraTemplate
  if (index.includes("  handcraftTemplate,")) {
    index = index.replace("  handcraftTemplate,\n", "  handcraftTemplate,\n" + entries + "\n");
  } else {
    index = index.replace("  fluxoraTemplate,\n", "  fluxoraTemplate,\n" + entries + "\n");
  }
  fs.writeFileSync(indexPath, index, "utf8");
  console.log("✓ index.ts updated");
} else {
  console.log("index.ts already has advisora");
}

console.log("Done. Generated", TEMPLATES.length, "landing templates.");
