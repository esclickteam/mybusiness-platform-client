export type WantravelDestination = {
  title: string;
  country: string;
  tag: string;
  image: string;
};

export type WantravelPackage = {
  title: string;
  location: string;
  price: string;
  image: string;
  features: string[];
};

export type WantravelStep = {
  number: string;
  title: string;
  text: string;
};

export type WantravelReview = {
  name: string;
  role: string;
  text: string;
};

export type WantravelSeed = {
  brand: {
    name: string;
    logoText: string;
    badge: string;
  };
  nav: {
    label: string;
    href: string;
  }[];
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    primaryButton: string;
    secondaryButton: string;
    image: string;
    floatingImage: string;
    cardTitle: string;
    cardText: string;
  };
  stats: {
    value: string;
    label: string;
  }[];
  marquee: string[];
  destinations: {
    eyebrow: string;
    title: string;
    text: string;
    items: WantravelDestination[];
  };
  packages: {
    eyebrow: string;
    title: string;
    text: string;
    items: WantravelPackage[];
  };
  process: {
    eyebrow: string;
    title: string;
    text: string;
    steps: WantravelStep[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    items: WantravelReview[];
  };
  booking: {
    eyebrow: string;
    title: string;
    text: string;
    noteOne: string;
    noteTwo: string;
    button: string;
  };
  footer: {
    text: string;
  };
};

export const wantravelSeed: WantravelSeed = {
  brand: {
    name: "Wantravel",
    logoText: "W",
    badge: "Travel Boutique",
  },

  nav: [
    { label: "יעדים", href: "#destinations" },
    { label: "חבילות", href: "#packages" },
    { label: "איך זה עובד", href: "#process" },
    { label: "המלצות", href: "#reviews" },
  ],

  hero: {
    eyebrow: "חופשות בוטיק בהתאמה אישית",
    title: "חופשה שמרגישה כאילו נתפרה רק בשבילך",
    text:
      "תכנון נסיעות יוקרתי, חכם ומדויק — מטיסות ומלונות ועד מסלולים, חוויות, אטרקציות וליווי אישי.",
    primaryButton: "בואו נבנה מסלול",
    secondaryButton: "לראות יעדים",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1900&q=85",
    floatingImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85",
    cardTitle: "נסיעות שמתחילות ברעיון ומסתיימות בחוויה בלתי נשכחת",
    cardText:
      "חבילות נבחרות, יעדים טרנדיים, שירות אישי ונראות יוקרתית שמתאימה לסוכנות נסיעות מודרנית.",
  },

  stats: [
    { value: "48+", label: "יעדים בעולם" },
    { value: "1,200+", label: "מטיילים מרוצים" },
    { value: "24/7", label: "ליווי אישי" },
  ],

  marquee: [
    "חופשות פרימיום",
    "ירח דבש",
    "טיולים משפחתיים",
    "יעדים אקזוטיים",
    "מסלולים מותאמים אישית",
    "שירות אישי",
  ],

  destinations: {
    eyebrow: "יעדים נבחרים",
    title: "מקומות שמתחילים בתמונה ומסתיימים בזיכרון",
    text:
      "מבחר יעדים אהובים במיוחד עם התאמה לזוגות, משפחות, חופשות יוקרה, נופש רגוע או חוויה מלאה באקשן.",
    items: [
      {
        title: "סנטוריני",
        country: "יוון",
        tag: "רומנטי",
        image:
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85",
      },
      {
        title: "באלי",
        country: "אינדונזיה",
        tag: "טרופי",
        image:
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
      },
      {
        title: "האלפים",
        country: "שוויץ",
        tag: "יוקרה",
        image:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85",
      },
      {
        title: "מרקש",
        country: "מרוקו",
        tag: "תרבות",
        image:
          "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=900&q=85",
      },
    ],
  },

  packages: {
    eyebrow: "חבילות מומלצות",
    title: "תכנון חכם. חוויה מלאה.",
    text:
      "חבילות לדוגמה שממחישות את איכות השירות, רמת התכנון והנראות המקצועית של סוכנות הנסיעות שלך.",
    items: [
      {
        title: "חופשה זוגית חלומית",
        location: "יוון / איטליה / צרפת",
        price: "החל מ־₪3,490",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
        features: ["מלונות בוטיק", "מסלול מותאם אישית", "ליווי לפני הטיסה"],
      },
      {
        title: "טיול משפחתי מאורגן",
        location: "אירופה הקלאסית",
        price: "החל מ־₪5,900",
        image:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85",
        features: ["אטרקציות לילדים", "טיסות ומלונות", "תכנון מלא"],
      },
      {
        title: "מסע אקזוטי",
        location: "תאילנד / וייטנאם / באלי",
        price: "החל מ־₪6,700",
        image:
          "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=85",
        features: ["חופים פרטיים", "חוויות מקומיות", "העברות ונציגות"],
      },
    ],
  },

  process: {
    eyebrow: "איך זה עובד",
    title: "תהליך פשוט שנראה ומרגיש פרימיום",
    text:
      "המטרה היא לתת לעסק תבנית יוקרתית ומקצועית, שנראית מעולה ומובילה לפניות, השארת פרטים ותכנון חופשה.",
    steps: [
      {
        number: "01",
        title: "שיחת התאמה",
        text: "מבינים את התקציב, הסגנון, היעד והחוויה שהלקוח רוצה לקבל.",
      },
      {
        number: "02",
        title: "בניית מסלול",
        text: "יוצרים תכנון חכם עם מלונות, טיסות, יעדים, המלצות וחוויות.",
      },
      {
        number: "03",
        title: "סגירה וליווי",
        text: "מרכזים את כל הפרטים במקום אחד ומלווים את הלקוח עד החזרה.",
      },
    ],
  },

  reviews: {
    eyebrow: "המלצות",
    title: "לקוחות אוהבים חוויות שמרגישות מדויקות",
    items: [
      {
        name: "נועה ועמית",
        role: "חופשה זוגית ביוון",
        text:
          "הכול היה מתוקתק, רגוע ומדויק. הרגשנו שמישהו באמת תכנן לנו את החופשה כאילו זו החופשה שלו.",
      },
      {
        name: "משפחת לוי",
        role: "טיול משפחתי באירופה",
        text:
          "פעם ראשונה שלא היינו צריכים לרדוף אחרי מלונות, טיסות ואטרקציות. הכול היה במקום אחד.",
      },
    ],
  },

  booking: {
    eyebrow: "מתחילים מכאן",
    title: "בואו נתכנן את החופשה הבאה שלכם",
    text:
      "אזור השארת פרטים שמתאים להמרה — עם מקום לשם, טלפון, יעד מבוקש והודעה חופשית.",
    noteOne: "ליווי לפני, במהלך ואחרי",
    noteTwo: "התאמה לפי תקציב, סגנון ויעד",
    button: "שליחת פנייה",
  },

  footer: {
    text: "תבנית תיירות יוקרתית לביזאפלי",
  },
};