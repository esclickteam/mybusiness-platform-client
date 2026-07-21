export const salonixAssets = {
  bgService: "https://galanailsalon.com/images/bg-service.png",
  bgWelcome: "https://galanailsalon.com/images/bg-welcome.png",
  bgFooter: "https://galanailsalon.com/images/bg_footer.png",
  heroNext: "https://galanailsalon.com/images/next.png",
  callIcon: "https://galanailsalon.com/images/call.png",
  bookIcon: "https://galanailsalon.com/images/book.png",
  scrollTop: "https://galanailsalon.com/images/top.png",
  menuIcon: "https://galanailsalon.com/images/icon_menu.png",
};

export const salonixImages = {
  heroSlides: [
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/index-1-87635.jpg",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/index-2-95417.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/index-3-10910.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/index-4-19219.png",
  ],
  welcome: "https://galanailsalon.com/images/welcome.jpeg",
  services: [
    {
      title: "טיפולי ציפורניים",
      anchor: "nail-care",
      image:
        "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/service-dreamstime_xxl_30757928-w576-83765.jpg",
    },
    {
      title: "שירותים נוספים",
      anchor: "extras",
      image:
        "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/dreamstime_s_106080833.png",
    },
    {
      title: "ילדות",
      anchor: "kids",
      image: "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/images.jpeg",
    },
    {
      title: "פדיקור",
      anchor: "pedicure",
      image:
        "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/dreamstime_s_28806725.png",
    },
    {
      title: "שעווה",
      anchor: "waxing",
      image:
        "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/service-dreamstime_m_79205084-w576-67221.jpg",
    },
    {
      title: "הרמת ריסים",
      anchor: "lashes",
      image:
        "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/service-eyelash1-w576-93800.jpg",
    },
  ],
  gallery: [
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-11-27.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-3-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-1-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-2-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-4-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-5-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-6-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-7-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-8-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-9-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-10-25.png",
    "https://nz-website-media-r2-pub.gocheckin.net/16704-11411/page/gallery-1-31.png",
  ],
};

export const salonixPriceCategories = [
  {
    id: "nail-care",
    title: "טיפולי ציפורניים",
    image: salonixImages.services[0].image,
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
    image: salonixImages.services[1].image,
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
    image: salonixImages.services[2].image,
    items: [
      { name: "מניקור ילדות", price: "₪60" },
      { name: "פדיקור ילדות", price: "₪80" },
    ],
  },
  {
    id: "pedicure",
    title: "פדיקור",
    image: salonixImages.services[3].image,
    items: [
      { name: "פדיקור ספא קלאסי", price: "₪120", note: "גזיזה, טיפול קוטיקula, מגבת חמה." },
      { name: "פדיקור טרופי", price: "₪160", note: "טיפול כף רגל, הסרת עור קשה, עיסוי." },
      { name: "פדיקור חתימה", price: "₪190", note: "פילינג, paraffin, אבן חמה ועיסוי." },
    ],
  },
  {
    id: "waxing",
    title: "שעווה",
    image: salonixImages.services[4].image,
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
    image: salonixImages.services[5].image,
    groups: [
      { title: "קלאסי", items: [{ name: "סט חדש", price: "₪280" }, { name: "מילוי", price: "₪180" }] },
      { title: "ווליום", items: [{ name: "סט חדש", price: "₪380" }, { name: "מילוי", price: "₪240" }] },
    ],
  },
];

export const salonixDefaultData = {
  templateId: "salonix",
  name: "Salonix",
  brandName: "Salonix",
  logoText: "Salonix",

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
    "סלוניקס הוא סטודיו לטיפוח ציפורניים בלב תל אביב — מקום שקט, נקי ומוקפד, שבו כל פרט חשוב. אנחנו משלבים טכניקות מקצועיות, חומרים איכותיים ויחס אישי.\n\nהצוות שלנו מתמחה במניקור, ג׳ל, פדיקור, עיצובים ושירותי יופי משלימים — כדי שכל ביקור ירגיש מפנק, מדויק ובלתי נשכח.",
  welcomeButton: "קראו עוד",
  welcomeImage: salonixImages.welcome,

  aboutTitle: "הסיפור\nשל סלוניקס",
  aboutText:
    "סלוניקס נולד מתוך אהבה לפרטים הקטנים — קו נקי, צבע מדויק, גימור שמחזיק. כל קובץ ופצירה חד-פעמיים, כל כלי עובר חיטוי, וכל טיפול מתוכנן לפי הצורך האישי שלכם.\n\nבואו לבקר, להתרווח, ולצאת עם ציפורניים שמרגישות בדיוק נכון.",
  aboutImage: salonixImages.welcome,

  galleryTitle: "הגלריה שלנו",
  gallerySubtitle: "הצצה לעיצובים, צבעים וטקסטורות מהסטודיו — חוויה ייחודית ומרגיעה.",
  galleryButton: "לכל העבודות",

  contactTitle: "צור קשר",
  contactSubtitle: "נשמח לעמוד לרשותכם",
  contactText: "השאירו פרטים ונחזור אליכם לתיאום תור.",
  contactButton: "שליחה",
  contactNameLabel: "שם מלא",
  contactEmailLabel: "אימייל",
  contactPhoneLabel: "טלפון",
  contactMessageLabel: "הודעה",

  bookingTitle: "קביעת תור",
  bookingText: "בחרו טיפול, תאריך ושעה — ונאשר את התור בהקדם.",
  bookingButton: "לקביעת תור",

  phone: "03-555-1234",
  email: "hello@salonix.co.il",
  address: "רothschild 45, תל אביב",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21099.0!2d34.7818!3d32.0644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDAzJzUwLjAiTiAzNCc0NiczNC41IkU!5e0!3m2!1siw!2sil!4v1",

  hoursOneLabel: "א׳–ד׳:",
  hoursOneValue: "09:30–19:00",
  hoursTwoLabel: "ה׳–ו׳:",
  hoursTwoValue: "09:30–20:00",
  hoursThreeLabel: "שבת:",
  hoursThreeValue: "09:30–17:00",

  footerLocationTitle: "מיקום",
  footerHoursTitle: "שעות פעילות",
  footerSocialTitle: "עקבו אחרינו",

  footerText: "© 2026 Salonix. כל הזכויות שמורות.",
  floatCallLabel: "התקשרו",
  floatBookLabel: "תור",

  bgServiceImage: salonixAssets.bgService,
  bgWelcomeImage: salonixAssets.bgWelcome,
  bgFooterImage: salonixAssets.bgFooter,
  heroImage: salonixImages.heroSlides[0],
};
