export type LexoraService = {
  title: string;
  text: string;
  stat: string;
  image: string;
};

export type LexoraCase = {
  year: string;
  type: string;
  title: string;
  text: string;
  result: string;
  duration: string;
  image: string;
};

export type LexoraStep = {
  number: string;
  title: string;
  text: string;
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
    personName: string;
    personRole: string;
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
      "משרד עורכי דין מודרני המשלב חשיבה עסקית, דיוק משפטי וליווי אישי בתיקים מסחריים, מקרקעין, חוזים וליטיגציה.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=90",
    primaryButton: "קביעת ייעוץ",
    secondaryButton: "תחומי התמחות",
  },

  stats: [
    { value: "+18", label: "שנות ניסיון" },
    { value: "96%", label: "שביעות רצון" },
    { value: "+420", label: "תיקים שטופלו" },
  ],

  intro: {
    eyebrow: "אודות המשרד",
    title: "משלבים מומחיות משפטית עם הבנה עסקית ותוצאה ברורה",
    text:
      "המשרד מלווה לקוחות פרטיים, חברות ויזמים בהחלטות משפטיות מורכבות — משלב הבדיקה הראשונית ועד סגירת ההליך.",
    personName: "עו״ד דניאל רוזן",
    personRole: "שותף מייסד",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=90",
  },

  services: {
    eyebrow: "תחומי התמחות",
    title: "שירותים משפטיים לעולם עסקי משתנה",
    text:
      "שירותים משפטיים מדויקים ללקוחות שצריכים בהירות, אחריות, זמינות וחשיבה אסטרטגית.",
    items: [
      {
        title: "משפט מסחרי וחוזים",
        text: "ניסוח, בדיקה וניהול מו״מ בהסכמים מסחריים, שותפויות, ספקים ולקוחות.",
        stat: "+160 הסכמים",
        image:
          "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=90",
      },
      {
        title: "מקרקעין ונדל״ן",
        text: "ליווי עסקאות רכישה, מכירה, שכירות, בדיקות משפטיות וניהול סיכונים.",
        stat: "+90 עסקאות",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=90",
      },
      {
        title: "ליטיגציה ויישוב סכסוכים",
        text: "ייצוג בהליכים משפטיים, מכתבי התראה, משא ומתן והסכמי פשרה.",
        stat: "+120 הליכים",
        image:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=90",
      },
      {
        title: "ליווי חברות ויזמים",
        text: "ייעוץ שוטף לחברות, הקמה, מסמכי מדיניות, שותפויות והסכמי השקעה.",
        stat: "+75 חברות",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=90",
      },
    ],
  },

  cases: {
    eyebrow: "תיקים נבחרים",
    title: "תוצאות משפטיות שנבנו מתוך אסטרטגיה מדויקת",
    text:
      "דוגמאות לתחומי טיפול, תהליכים ותוצאות שממחישים את אופי העבודה של המשרד.",
    items: [
      {
        year: "2024",
        type: "מקרקעין",
        title: "ליווי עסקת נדל״ן מורכבת",
        text: "בדיקות משפטיות, ניהול משא ומתן והשלמת עסקה מסחרית תחת לוחות זמנים צפופים.",
        result: "העסקה הושלמה",
        duration: "11 שבועות",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=90",
      },
      {
        year: "2023",
        type: "מסחרי",
        title: "הסכם שותפים לחברת שירותים",
        text: "בניית מנגנוני הגנה, חלוקת אחריות, סודיות, יציאה מהשותפות ומניעת מחלוקות עתידיות.",
        result: "הסכם נחתם",
        duration: "4 שבועות",
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=90",
      },
      {
        year: "2022",
        type: "ליטיגציה",
        title: "סכסוך עסקי שהסתיים בפשרה",
        text: "ניתוח משפטי, בניית טקטיקת מו״מ והגעה לפתרון שחסך הליך ממושך.",
        result: "פשרה מאושרת",
        duration: "8 שבועות",
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=90",
      },
    ],
  },

  process: {
    eyebrow: "תהליך העבודה",
    title: "בהירות, סדר ואסטרטגיה מהרגע הראשון",
    text:
      "כל תיק מתחיל באבחון משפטי ברור, ממשיך בתכנון מסודר ומסתיים בפעולה מדויקת מול הצד השני או בית המשפט.",
    steps: [
      {
        number: "01",
        title: "פגישת אבחון",
        text: "מבינים את המצב המשפטי, המסמכים, הסיכונים והיעד הרצוי.",
      },
      {
        number: "02",
        title: "תכנון אסטרטגיה",
        text: "בונים דרך פעולה, לוחות זמנים, חלופות משפטיות וסיכויי הצלחה.",
      },
      {
        number: "03",
        title: "ביצוע וליווי",
        text: "מטפלים בהתכתבויות, חוזים, מו״מ או ייצוג — עם עדכונים שוטפים.",
      },
    ],
  },

  about: {
    eyebrow: "הצוות",
    title: "אנשי מקצוע שמדברים משפטית, אבל חושבים עסקית",
    text:
      "הגישה שלנו משלבת מקצועיות משפטית, זמינות גבוהה ויכולת להסביר ללקוח את המצב בצורה פשוטה וברורה.",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=90",
  },

  faqs: [
    {
      question: "איך מתחילים טיפול משפטי?",
      answer:
        "מתחילים בפגישת ייעוץ קצרה שבה בודקים את המסמכים, מגדירים את הבעיה ומחליטים על דרך פעולה.",
    },
    {
      question: "האם ניתן לקבל ליווי שוטף לעסק?",
      answer:
        "כן. המשרד נותן ליווי משפטי שוטף לחברות, עצמאים ויזמים לפי צורך חודשי או לפי פרויקט.",
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