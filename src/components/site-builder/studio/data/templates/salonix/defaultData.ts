export const salonixImages = {
  logoMark:
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=200&q=80",
  heroSlides: [
    "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1800&q=85",
  ],
  welcome:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=85",
  services: [
    {
      title: "טיפולי ציפורניים",
      anchor: "nail-care",
      image:
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85",
    },
    {
      title: "שירותים נוספים",
      anchor: "extras",
      image:
        "https://images.unsplash.com/photo-1599206676335-193c82b13c9e?auto=format&fit=crop&w=800&q=85",
    },
    {
      title: "ילדות",
      anchor: "kids",
      image:
        "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=85",
    },
    {
      title: "פדיקור",
      anchor: "pedicure",
      image:
        "https://images.unsplash.com/photo-1519415510232-855967f88c72?auto=format&fit=crop&w=800&q=85",
    },
    {
      title: "שעווה",
      anchor: "waxing",
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85",
    },
    {
      title: "הרמת ריסים",
      anchor: "lashes",
      image:
        "https://images.unsplash.com/photo-1583001939226-7a2c11ad0702?auto=format&fit=crop&w=800&q=85",
    },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1604902396830-aca29e19b067?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1599206676335-193c82b13c9e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1583001939226-7a2c11ad0702?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85",
  ],
};

export const salonixPriceCategories = [
  {
    id: "nail-care",
    title: "טיפולי ציפורניים",
    items: [
      { name: "מניקור קלאסי", price: "₪90" },
      { name: "מניקור + לק ג׳ל", price: "₪130" },
      { name: "בנייה בג׳ל", price: "₪180+" },
      { name: "אבקת DIP", price: "₪200+" },
      { name: "מילוי", price: "₪160+" },
      { name: "בנייה אנטומית", price: "₪220" },
    ],
  },
  {
    id: "extras",
    title: "שירותים נוספים",
    items: [
      { name: "עיצוב (לציפורן)", price: "מ־₪15" },
      { name: "החלפת לק — רגיל", price: "₪45" },
      { name: "החלפת לק — ג׳ל", price: "₪70" },
      { name: "תיקון שבר", price: "₪25" },
      { name: "הסרת ג׳ל", price: "₪50" },
    ],
  },
  {
    id: "kids",
    title: "ילדות",
    items: [
      { name: "מניקור ילדות", price: "₪60" },
      { name: "פדיקור ילדות", price: "₪80" },
    ],
  },
  {
    id: "pedicure",
    title: "פדיקור",
    items: [
      {
        name: "פדיקור ספא קלאסי",
        price: "₪120",
        note: "גזיזה, טיפול קוטיקula, מגבת חמה.",
      },
      {
        name: "פדיקור טרופי",
        price: "₪160",
        note: "טיפול כף רגל, הסרת עור קשה, עיסוי קצר.",
      },
      {
        name: "פדיקור חתימה",
        price: "₪190",
        note: "פילינג, פרaffin, אבן חמה ועיסוי.",
      },
    ],
  },
  {
    id: "waxing",
    title: "שעווה",
    items: [
      { name: "גבות", price: "₪45" },
      { name: "שפם", price: "₪30" },
      { name: "פנים מלא", price: "₪120" },
      { name: "בית שחי", price: "₪55" },
      { name: "רגליים", price: "₪90–₪160" },
    ],
  },
  {
    id: "lashes",
    title: "הרמת ריסים",
    groups: [
      {
        title: "קלאסי",
        items: [
          { name: "סט חדש", price: "₪280" },
          { name: "מילוי", price: "₪180" },
        ],
      },
      {
        title: "ווליום",
        items: [
          { name: "סט חדש", price: "₪380" },
          { name: "מילוי", price: "₪240" },
        ],
      },
    ],
  },
];

export const salonixDefaultData = {
  templateId: "salonix",
  name: "Salonix",
  brandName: "Salonix",
  logoText: "SX",

  navHome: "בית",
  navAbout: "אודות",
  navServices: "שירותים",
  navBooking: "קביעת תור",
  navGallery: "גלריה",
  navContact: "צור קשר",

  heroSlideOne: salonixImages.heroSlides[0],
  heroSlideTwo: salonixImages.heroSlides[1],
  heroSlideThree: salonixImages.heroSlides[2],
  heroSlideFour: salonixImages.heroSlides[3],

  servicesTitle: "השירותים שלנו",
  servicesSubtitle: "טיפוח ציפורניים מקצועי לנשים ולגברים",

  welcomeTitle: "ברוכים הבאים\nלסלוניקס",
  welcomeText:
    "סלוניקס הוא סטודיו לטיפוח ציפורניים בלב תל אביב — מקום שקט, נקי ומוקפד, שבו כל פרט חשוב. אנחנו משלבים טכניקות מקצועיות, חומרים איכותיים ויחס אישי, כדי שכל ביקור ירגיש מפנק ומדויק.\n\nהצוות שלנו מתמחה במניקור, ג׳ל, פדיקור, עיצובים ושירותי יופי משלימים. אנחנו מאמינים בנראות נקייה, עמידות לאורך זמן וחוויה שמרגישה כמו פינוק אמיתי.",
  welcomeButton: "קראו עוד",
  welcomeImage: salonixImages.welcome,

  aboutTitle: "הסיפור\nשל סלוניקס",
  aboutText:
    "סלוניקס נולד מתוך אהבה לפרטים הקטנים — קו נקי, צבע מדויק, גימור שמחזיק. אנחנו עובדים בקצב נעים, עם תשומת לב לכל לקוחה ולקוח, ומתחייבים לסטנדרט גבוה של ניקיון ובטיחות.\n\nכל קובץ ופצירה חד-פעמיים. כל כלי עובר חיטוי. כל טיפול מתוכנן לפי הצורך האישי שלכם — בלי קיצורי דרך.\n\nבואו לבקר, להתרווח, ולצאת עם ציפורניים שמרגישות בדיוק נכון.",
  aboutImage: salonixImages.welcome,

  galleryTitle: "הגלריה שלנו",
  gallerySubtitle:
    "הצצה לעיצובים, צבעים וטקסטורות מהסטודיו. כל יום אנחנו יוצרים מחדש.",
  galleryButton: "לכל העבודות",

  contactTitle: "צור קשר",
  contactSubtitle: "נשמח לעמוד לרשותכם",
  contactText:
    "השאירו פרטים, התקשרו או שלחו הודעה — ונחזור אליכם לתיאום תור בזמן שמתאים לכם.",
  contactButton: "שליחה",
  contactNameLabel: "שם מלא",
  contactEmailLabel: "אימייל",
  contactPhoneLabel: "טלפון",
  contactMessageLabel: "הודעה",

  bookingTitle: "קביעת תור",
  bookingText:
    "בחרו טיפול, תאריך ושעה — ונאשר את התור בהקדם. מחכים לראות אתכם בסטודיו.",
  bookingButton: "לקביעת תור",

  phone: "03-555-1234",
  email: "hello@salonix.co.il",
  address: "רothschild 45, תל אביב",
  bookingUrl: "#booking",

  hoursLineOne: "א׳–ד׳: 09:30–19:00",
  hoursLineTwo: "ה׳–ו׳: 09:30–20:00",
  hoursLineThree: "שבת: 09:30–17:00",

  footerText: "© 2026 Salonix. כל הזכויות שמורות.",
  floatCallLabel: "התקשרו",
  floatBookLabel: "תור",

  heroImage: salonixImages.heroSlides[0],
};
