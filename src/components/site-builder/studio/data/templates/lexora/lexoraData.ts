export type LexoraService = {
  title: string;
  text: string;
  meta: string;
};

export type LexoraCase = {
  title: string;
  type: string;
  year: string;
  location: string;
  duration: string;
  status: string;
  text: string;
  image: string;
};

export type LexoraStep = {
  number: string;
  title: string;
  text: string;
};

export type LexoraTeamMember = {
  name: string;
  role: string;
  image: string;
};

export type LexoraFaq = {
  question: string;
  answer: string;
};

export type LexoraSeed = {
  brand: {
    name: string;
    logoText: string;
    badge: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    primaryButton: string;
    secondaryButton: string;
  };
  stats: {
    value: string;
    label: string;
  }[];
  intro: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
  };
  services: {
    eyebrow: string;
    title: string;
    text: string;
    items: LexoraService[];
  };
  cases: {
    eyebrow: string;
    title: string;
    text: string;
    items: LexoraCase[];
  };
  process: {
    eyebrow: string;
    title: string;
    text: string;
    steps: LexoraStep[];
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    team: LexoraTeamMember[];
  };
  faqs: LexoraFaq[];
  consultation: {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
  };
  footer: {
    text: string;
  };
};

export const lexoraSeed: LexoraSeed = {
  brand: {
    name: "Lexora",
    logoText: "L",
    badge: "משרד עורכי דין",
  },

  hero: {
    eyebrow: "ייעוץ משפטי אסטרטגי",
    title: "סטנדרט גבוה יותר לליווי משפטי",
    text:
      "משרד עורכי דין מודרני המשלב דיוק משפטי, חשיבה עסקית וליווי אישי בתיקים מסחריים, מקרקעין, חוזים וליטיגציה.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=90",
    primaryButton: "קביעת ייעוץ",
    secondaryButton: "תחומי התמחות",
  },

  stats: [
    { value: "18+", label: "שנות ניסיון" },
    { value: "98%", label: "לקוחות מרוצים" },
    { value: "420+", label: "תיקים שטופלו" },
  ],

  intro: {
    eyebrow: "אודות המשרד",
    title: "משפט, אסטרטגיה ודיוק עסקי תחת קורת גג אחת",
    text:
      "אנחנו מלווים לקוחות פרטיים, חברות ויזמים בהחלטות משפטיות מורכבות — מהשלב הראשוני ועד סגירת ההליך בצורה ברורה, מסודרת ומקצועית.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=90",
  },

  services: {
    eyebrow: "תחומי התמחות",
    title: "שירותים משפטיים לעולם עסקי משתנה",
    text:
      "ייעוץ וליווי משפטי ללקוחות שצריכים בהירות, זמינות, אחריות ופתרונות מעשיים.",
    items: [
      {
        title: "משפט מסחרי וחוזים",
        text:
          "ניסוח, בדיקה וניהול משא ומתן בהסכמים מסחריים, שותפויות, ספקים ולקוחות.",
        meta: "160+ הסכמים",
      },
      {
        title: "מקרקעין ונדל״ן",
        text:
          "ליווי עסקאות רכישה, מכירה, שכירות, בדיקות משפטיות וניהול סיכונים.",
        meta: "90+ עסקאות",
      },
      {
        title: "ליטיגציה ויישוב סכסוכים",
        text:
          "ייצוג בהליכים משפטיים, מכתבי התראה, משא ומתן והסכמי פשרה.",
        meta: "120+ הליכים",
      },
      {
        title: "ליווי חברות ויזמים",
        text:
          "ייעוץ שוטף לחברות, הקמה, מסמכי מדיניות, שותפויות והסכמי השקעה.",
        meta: "75+ חברות",
      },
    ],
  },

  cases: {
    eyebrow: "תיקים נבחרים",
    title: "תוצאות שנבנו מתוך אסטרטגיה משפטית מדויקת",
    text:
      "דוגמאות לתחומי טיפול, תהליכים ותוצאות שממחישים את אופי העבודה של המשרד.",
    items: [
      {
        title: "ליווי עסקת נדל״ן מורכבת",
        type: "מקרקעין",
        year: "2024",
        location: "תל אביב",
        duration: "11 שבועות",
        status: "העסקה הושלמה",
        text:
          "בדיקות משפטיות, ניהול משא ומתן והשלמת עסקה מסחרית תחת לוחות זמנים צפופים.",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=90",
      },
      {
        title: "הסכם שותפים לחברת שירותים",
        type: "מסחרי",
        year: "2023",
        location: "מרכז",
        duration: "4 שבועות",
        status: "הסכם נחתם",
        text:
          "בניית מנגנוני הגנה, חלוקת אחריות, סודיות, יציאה מהשותפות ומניעת מחלוקות עתידיות.",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=90",
      },
      {
        title: "סכסוך עסקי שהסתיים בפשרה",
        type: "ליטיגציה",
        year: "2022",
        location: "חיפה",
        duration: "8 שבועות",
        status: "פשרה מאושרת",
        text:
          "ניתוח משפטי, בניית טקטיקת משא ומתן והגעה לפתרון שחסך הליך ממושך.",
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=90",
      },
    ],
  },

  process: {
    eyebrow: "תהליך העבודה",
    title: "בהירות, סדר ואסטרטגיה מהרגע הראשון",
    text:
      "כל תיק מתחיל באבחון משפטי ברור, ממשיך בתכנון מסודר ומסתיים בפעולה מדויקת מול הצד השני, הרשות או בית המשפט.",
    steps: [
      {
        number: "01",
        title: "אבחון משפטי",
        text: "מבינים את המצב, המסמכים, הסיכונים והיעד הרצוי.",
      },
      {
        number: "02",
        title: "בניית אסטרטגיה",
        text: "מגדירים דרך פעולה, לוחות זמנים, חלופות משפטיות וסיכויי הצלחה.",
      },
      {
        number: "03",
        title: "ביצוע וליווי",
        text: "מטפלים בהתכתבויות, חוזים, משא ומתן או ייצוג — עם עדכונים שוטפים.",
      },
    ],
  },

  about: {
    eyebrow: "הצוות",
    title: "אנשי מקצוע שמדברים משפטית וחושבים עסקית",
    text:
      "הגישה שלנו משלבת מקצועיות משפטית, זמינות גבוהה ויכולת להסביר ללקוח את המצב בצורה פשוטה וברורה.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=90",
    team: [
      {
        name: "עו״ד דניאל רוזן",
        role: "שותף מייסד",
        image:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=90",
      },
      {
        name: "עו״ד נועה שחר",
        role: "משפט מסחרי",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=90",
      },
      {
        name: "עו״ד עמית לוי",
        role: "ליטיגציה",
        image:
          "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=90",
      },
    ],
  },

  faqs: [
    {
      question: "איך מתחילים טיפול משפטי?",
      answer:
        "מתחילים בפגישת ייעוץ שבה בודקים את המסמכים, מגדירים את הבעיה ומחליטים על דרך פעולה.",
    },
    {
      question: "האם ניתן לקבל ליווי שוטף לעסק?",
      answer:
        "כן. המשרד מעניק ליווי משפטי שוטף לחברות, עצמאים ויזמים לפי צורך חודשי או לפי פרויקט.",
    },
    {
      question: "כמה זמן נמשך תהליך משפטי?",
      answer:
        "זה תלוי בתחום ובמורכבות. לאחר אבחון ראשוני ניתן לקבל הערכת זמן ריאלית וברורה.",
    },
    {
      question: "האם הפגישה הראשונית מחייבת?",
      answer:
        "לא. מטרת הפגישה היא להבין את המצב, להסביר אפשרויות ולתת כיוון ראשוני.",
    },
  ],

  consultation: {
    eyebrow: "ייעוץ ראשוני",
    title: "צריכים החלטה משפטית ברורה?",
    text:
      "השאירו פרטים ונחזור אליכם לתיאום פגישת ייעוץ עם עורך דין מתאים מהמשרד.",
    button: "שליחת פנייה",
  },

  footer: {
    text: "תבנית משפטית יוקרתית בעברית לביזאפלי",
  },
};