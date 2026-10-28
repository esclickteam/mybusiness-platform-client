/**
 * Public CRM page copy. Product names Bizuply and CRM stay untranslated.
 * Lead status labels match the product UI. Appointments, automations, and
 * ad-account connections belong to the Business plan, not CRM Only.
 */
import { marketingPublicUrl } from "./localePathCore.mjs";

export function crmPublicUrl(language) {
  return marketingPublicUrl("/crm", language);
}

export function crmAppPath(_language, path) {
  return path.startsWith("/") ? path : `/${path}`;
}

export const CRM_MEDIA_READY = false;

export const CRM_MEDIA = {
  hero: "/crm-page/hero-leads.webp",
  heroMobile: "/crm-page/hero-leads-mobile.webp",
  pipelineVideo: "/crm-page/lead-status.mp4",
  pipelinePoster: "/crm-page/lead-status-poster.webp",
  intakeVideo: "/crm-page/lead-intake.mp4",
  intakePoster: "/crm-page/lead-intake-poster.webp",
  profile: "/crm-page/customer-file.webp",
  profileMobile: "/crm-page/customer-file-mobile.webp",
  noteVideo: "/crm-page/customer-note.mp4",
  notePoster: "/crm-page/customer-note-poster.webp",
  taskVideo: "/crm-page/follow-up-task.mp4",
  taskPoster: "/crm-page/follow-up-task-poster.webp",
  appointments: "/crm-page/appointments.webp",
  dashboard: "/crm-page/dashboard.webp",
  dashboardMobile: "/crm-page/dashboard-mobile.webp",
};

const en = {
  lang: "en",
  dir: "ltr",
  title: "CRM Software for Small Businesses & Lead Management | Bizuply",
  description:
    "Organize leads, manage customers, track follow-ups, and connect supported Meta, Google Ads, and website inquiries with Bizuply CRM. Plans start at $49/month.",
  crumb: "CRM",
  hero: {
    eyebrow: "BIZUPLY CRM SOFTWARE",
    h1: "Manage every lead and customer relationship in one place",
    description:
      "Organize leads, manage customer information, track follow-ups, and keep your sales opportunities moving with Bizuply CRM. Connect inquiries from your marketing channels and website to one practical customer management workspace.",
    primary: "Get Started with CRM",
    secondary: "See How It Works",
    points: [
      "Centralized lead management",
      "Customer profiles and activity history",
      "Follow-up tasks and reminders",
      "Connected lead sources",
    ],
  },
  what: {
    h2: "What is CRM software?",
    p1: "Customer Relationship Management (CRM) software helps businesses organize information about leads and customers, document interactions, manage follow-up activities, and track opportunities over time.",
    p2: "Instead of keeping customer information across spreadsheets, messages, and separate notes, a CRM provides a structured place to understand who contacted your business, what they need, and what should happen next.",
    h3: "How does Bizuply CRM help businesses?",
    p3: "Bizuply brings lead details, customer records, activity history, and follow-up tasks into one environment. Teams can review new inquiries, update lead stages, document conversations, and keep customer information accessible throughout the relationship.",
    cards: [
      ["Capture Leads", "Bring incoming inquiries into an organized workflow."],
      ["Manage Contacts", "Keep customer information and communication history together."],
      ["Track Opportunities", "See where leads stand and which conversations need attention."],
      ["Plan Follow-Ups", "Create tasks and reminders for the next step."],
    ],
  },
  pipeline: {
    h2: "Know exactly where every lead stands",
    p: "New leads need timely attention, but not every opportunity is at the same stage. Bizuply CRM helps businesses organize leads by status, review their progress, and maintain a clear history of customer interactions.",
    stages: [
      ["New", "An inquiry has arrived and has not been handled yet."],
      ["Contacted", "Someone from the team has reached out."],
      ["Interested", "The conversation is active and the lead is considering the next step."],
      ["Converted", "The lead has become a customer."],
      ["Lost", "The opportunity is closed and the reason can stay on the record."],
      ["Old lead", "The inquiry is older and can be reviewed separately from current work."],
    ],
    journeyLabel: "One lead, moving forward",
    journey: "New → Contacted → Interested → Converted",
  },
  sources: {
    h2: "Bring your leads together from the channels you use",
    p: "Your next customer may discover your business through an advertisement, a website form, or another connected marketing channel. Bizuply helps bring supported inquiries into your CRM so your team can manage them through a consistent follow-up process.",
    cards: [
      ["Facebook & Instagram Lead Ads", "Connect eligible Meta lead forms to your Bizuply CRM and organize new inquiries alongside your existing customers and opportunities."],
      ["Google Ads Lead Forms", "Bring supported Google Ads lead form submissions into your lead management workflow."],
      ["Bizuply Website Forms", "Connect inquiries submitted through supported Bizuply website forms directly to your CRM."],
    ],
    diagramTitle: "Supported inquiries, one lead list",
    sourceNames: ["Meta Lead Ads", "Google Ads forms", "Website forms"],
    diagramTarget: "Bizuply CRM lead list",
    note: "Meta and Google Ads connections are part of the Business plan, after the business connects an authorized account and grants the required permissions. Website forms require a Bizuply website. CRM Only keeps the lead workspace itself.",
    links: [
      ["Meta campaigns", "/meta-campaigns"],
      ["Website Builder", "/website-builder"],
      ["WhatsApp", "https://whatsapp.bizuply.com/"],
    ],
  },
  profile: {
    h2: "Keep the full customer story in one place",
    p: "A customer relationship is more than a name and phone number. Bizuply helps teams maintain a detailed customer record with relevant contact information, interactions, tasks, appointments, and supporting documents.",
    items: [
      "Contact information",
      "Lead source",
      "Current status",
      "Notes",
      "Calls and communication records",
      "Follow-up tasks",
      "Appointments",
      "Documents",
      "Custom fields",
    ],
    closing: "When a team member opens a customer profile, they can review the available history and understand what has already happened before deciding on the next step.",
  },
  tasks: {
    h2: "Make follow-up part of your daily workflow",
    p: "Following up at the right time can make a meaningful difference in how customers experience your business. Bizuply lets teams document activity and create follow-up tasks with dates and times, helping important conversations stay visible.",
    cards: [
      ["Create Follow-Up Tasks", "Schedule the next action for a lead or customer."],
      ["Document Conversations", "Keep relevant notes and activity records connected to the customer profile."],
      ["See What Needs Attention", "Review pending and overdue tasks to organize daily priorities."],
    ],
  },
  appointments: {
    h2: "Connect customer relationships with appointments",
    p: "For service businesses, appointments are an important part of the customer journey. Bizuply's connected business tools can help bring scheduling information closer to customer records and follow-up activities.",
    cards: [
      ["Service Scheduling", "Define services and scheduling details in the supported appointment tools."],
      ["Appointment History", "Review relevant appointments as part of a customer's activity history."],
      ["Customer Booking Experience", "Give customers a way to select available services and times when online booking is enabled."],
    ],
    planNote: "Appointment scheduling and customer booking are included in the Bizuply Business plan. They are not included in CRM Only at $49 per month.",
    link: "Explore appointment scheduling",
  },
  dashboard: {
    h2: "Understand your pipeline at a glance",
    p: "Clear information helps teams decide where to focus. Bizuply's business dashboard brings together useful indicators, including lead activity, lead statuses, recent inquiries, and upcoming work where those features are enabled.",
    cards: [
      ["New Leads", "See recent inquiries entering your business."],
      ["Lead Status Overview", "Understand how opportunities are distributed across your pipeline."],
      ["Recent Activity", "Review the latest customer and lead updates."],
      ["Upcoming Appointments", "Keep scheduled customer interactions visible when appointment tools are enabled."],
    ],
  },
  audiences: {
    h2: "A CRM built for businesses that value organized relationships",
    cards: [
      ["Service Businesses", "Manage inquiries, customer details, and the follow-up work behind everyday service delivery.", "A clinic can keep website-form inquiries in one lead list and open the customer record before the next conversation."],
      ["Small Business Owners", "Keep customer information and opportunities organized without relying on scattered notes.", "An owner can see which inquiries are new, which were contacted, and which still need a follow-up task."],
      ["Sales Teams", "Work with structured lead stages and documented activity so team members can understand the next step.", "A real-estate desk can record calls with interested buyers and leave the status clear for the next person."],
      ["Marketing-Driven Businesses", "Bring supported advertising and website inquiries into a shared customer management process.", "A marketing agency can place eligible campaign inquiries next to the rest of the pipeline, once the right plan and account permissions are in place."],
    ],
  },
  sheet: {
    h2: "When is it time to move beyond spreadsheets?",
    p: "Spreadsheets can be useful for simple contact lists. As inquiries grow and more people become involved, businesses may need a clearer way to track customer activity, follow-up responsibilities, and lead progress.",
    columns: ["Need", "Spreadsheet", "Bizuply CRM"],
    rows: [
      ["Contact information", "Manual organization", "Structured customer records"],
      ["Lead stages", "Manually maintained", "Dedicated lead statuses"],
      ["Follow-up tracking", "Requires manual processes", "Customer-linked tasks"],
      ["Interaction history", "Must be documented manually", "Activity timeline"],
      ["Connected lead forms", "Requires additional setup", "Supported lead integrations"],
    ],
  },
  pricing: {
    h2: "Simple CRM pricing for your business",
    crmName: "CRM Only",
    crmPrice: "$49",
    crmPeriod: "/ month",
    crmDescription: "Customer and lead management for businesses that want a dedicated CRM workspace.",
    crmFeatures: [
      "Lead list and the six lead statuses",
      "Customer profiles, notes, and activity history",
      "Follow-up tasks with dates and times",
      "Custom fields on the customer record",
    ],
    crmExcludes: "Appointments, online booking, automations, collaborations, WhatsApp, and Meta or Google Ads connections are not included in CRM Only.",
    crmCta: "Choose CRM",
    businessName: "Bizuply Business",
    businessPrice: "$99",
    businessPeriod: "/ month",
    businessAlt: "or $990 / year",
    businessDescription: "A broader business platform that combines CRM with additional tools for managing operations and customer workflows.",
    businessFeatures: [
      "Everything in CRM Only",
      "Appointments and customer booking",
      "Automations",
      "Collaborations and the AI assistant",
      "WhatsApp, after the account is connected",
      "Meta campaign tools, after the authorized account is connected",
    ],
    businessCta: "Explore Business Plan",
    priceSentence: "CRM only is $49 per month. The Business plan is $99 per month or $990 per year.",
  },
  faq: {
    h2: "Frequently asked questions about CRM software",
    items: [
      ["What does CRM stand for?", "CRM stands for Customer Relationship Management. The term describes the processes and software businesses use to organize customer information, manage interactions, and build stronger relationships over time."],
      ["What is CRM software used for?", "CRM software helps businesses store contact details, track leads, document customer activity, plan follow-ups, and organize sales or service-related workflows."],
      ["Who needs a CRM system?", "A CRM can be useful for businesses that manage recurring customer conversations, receive multiple inquiries, or need a structured way to follow up with prospects and existing clients."],
      ["How is Bizuply CRM different from a spreadsheet?", "Bizuply offers dedicated lead stages, customer profiles, activity history, tasks, and supported integrations. These features can reduce the amount of manual organization required when managing customer relationships."],
      ["Can Bizuply collect leads from Facebook and Instagram?", "Bizuply supports lead collection from eligible Meta Lead Ads integrations after the business connects its authorized account and grants the required permissions."],
      ["Can Google Ads leads enter the CRM?", "Supported Google Ads lead form integrations can bring inquiries into Bizuply CRM. Availability depends on the connected account and integration configuration."],
      ["Can website forms create CRM leads?", "Supported forms on Bizuply websites can send inquiries into connected CRM workflows, keeping website-generated opportunities organized with other leads."],
      ["What information can I save in a customer profile?", "Customer profiles can include contact details, status information, notes, activity records, tasks, appointments, documents, and custom fields where those capabilities are enabled."],
      ["Can I assign follow-up tasks?", "Bizuply CRM supports customer-related follow-up tasks with dates and times, helping teams organize the next steps in their workflow."],
      ["Can I track lead status changes?", "Yes. Bizuply uses structured lead statuses, and supported status changes are recorded in the lead activity history."],
      ["Does Bizuply CRM include appointment scheduling?", "Bizuply offers connected appointment-management capabilities. Whether scheduling is included depends on the selected plan and configuration."],
      ["Is Bizuply suitable for small businesses?", "Yes. Bizuply CRM is intended to help businesses keep their leads, customer records, and follow-up activities organized as their operations develop."],
      ["How much does Bizuply CRM cost?", "The CRM-only plan is $49 per month. Bizuply also offers a broader Business plan at $99 per month or $990 per year, with additional features according to the plan."],
      ["Can I use the CRM without buying the full Business plan?", "Yes. Businesses can choose the CRM-only plan when they need customer and lead management without purchasing the broader Business package."],
      ["What is the difference between CRM and marketing automation?", "CRM focuses on organizing customer information, interactions, and opportunities. Marketing automation focuses on triggering actions or messages based on configured conditions. The two can complement each other when the appropriate tools are connected."],
    ],
  },
  final: {
    h2: "Bring clarity to every customer relationship",
    p: "Give your business one organized place to manage leads, understand customer history, and plan the next conversation.",
    primary: "Get Started with Bizuply CRM",
    secondary: "Explore the Platform",
  },
  chrome: {
    navAria: "Primary",
    about: "About",
    website: "Website",
    crm: "CRM",
    automations: "Automations",
    appointments: "Appointments",
    pricing: "Pricing",
    login: "Log in",
    cta: "Get started",
    langCode: "EN",
  },
};

function pack(lang, dir, title, description, hero, rest) {
  return {
    ...en,
    ...rest,
    lang,
    dir,
    title,
    description,
    hero: { ...en.hero, ...hero },
    chrome: { ...en.chrome, ...(rest.chrome || {}) },
  };
}

const he = pack(
  "he",
  "rtl",
  "תוכנת CRM לעסקים קטנים וניהול לידים | Bizuply",
  "ארגנו לידים, נהלו לקוחות, עקבו אחרי משימות המשך, וחברו פניות נתמכות מ־Meta, מ־Google Ads ומהאתר עם Bizuply CRM. המסלולים מתחילים ב־49 דולר לחודש.",
  {
    eyebrow: "BIZUPLY CRM SOFTWARE",
    h1: "נהלו כל ליד וכל קשר עם הלקוח במקום אחד",
    description: "ארגנו לידים, נהלו את פרטי הלקוחות, עקבו אחרי המשך הטיפול, ושמרו על ההזדמנויות בתנועה עם Bizuply CRM. חברו פניות מערוצי השיווק ומהאתר לסביבת עבודה אחת לניהול לקוחות.",
    primary: "מתחילים עם CRM",
    secondary: "כך זה עובד",
    points: ["ניהול לידים במקום אחד", "פרופיל לקוח והיסטוריית פעילות", "משימות המשך ותזכורות", "מקורות לידים מחוברים"],
  },
  {
    crumb: "CRM",
    what: {
      h2: "מהי תוכנת CRM?",
      p1: "תוכנת ניהול קשרי לקוחות (CRM) עוזרת לעסקים לארגן מידע על לידים ולקוחות, לתעד אינטראקציות, לנהל המשך טיפול, ולעקוב אחרי הזדמנויות לאורך זמן.",
      p2: "במקום לפזר פרטי לקוחות בין גיליונות, הודעות ופתקים נפרדים, CRM נותן מקום מסודר להבין מי פנה לעסק, מה הוא צריך, ומה הצעד הבא.",
      h3: "איך Bizuply CRM עוזר לעסקים?",
      p3: "Bizuply מרכז פרטי ליד, רשומות לקוח, היסטוריית פעילות ומשימות המשך בסביבה אחת. הצוות יכול לעבור על פניות חדשות, לעדכן שלב, לתעד שיחה, ולהשאיר את המידע זמין לאורך הקשר.",
      cards: [
        ["קליטת לידים", "מכניסים פניות נכנסות לתהליך עבודה מסודר."],
        ["ניהול אנשי קשר", "שומרים פרטי לקוח והיסטוריית תקשורת יחד."],
        ["מעקב אחרי הזדמנויות", "רואים איפה כל ליד עומד ואיזו שיחה דורשת תשומת לב."],
        ["תכנון המשך טיפול", "יוצרים משימות ותזכורות לצעד הבא."],
      ],
    },
    pipeline: {
      h2: "לדעת בדיוק איפה כל ליד עומד",
      p: "ליד חדש צריך תשומת לב בזמן, אבל לא כל הזדמנות נמצאת באותו שלב. Bizuply CRM עוזר לסדר לידים לפי סטטוס, לבדוק את ההתקדמות, ולשמור היסטוריה ברורה של האינטראקציות.",
      stages: [
        ["חדש", "הפנייה הגיעה ועדיין לא טופלה."],
        ["נוצר קשר", "מישהו מהצוות כבר פנה."],
        ["מעוניין", "השיחה פעילה והליד שוקל את הצעד הבא."],
        ["הומר", "הליד הפך ללקוח."],
        ["אבוד", "ההזדמנות נסגרה, והסיבה יכולה להישאר ברשומה."],
        ["ליד ישן", "הפנייה ישנה יותר ואפשר לבדוק אותה בנפרד מהעבודה השוטפת."],
      ],
      journeyLabel: "ליד אחד, בדרך קדימה",
      journey: "חדש → נוצר קשר → מעוניין → הומר",
    },
    sources: {
      h2: "רכזו את הלידים מהערוצים שבהם אתם עובדים",
      p: "הלקוח הבא עשוי להגיע ממודעה, מטופס באתר, או מערוץ שיווק מחובר אחר. Bizuply עוזר להכניס פניות נתמכות ל־CRM כדי שהצוות יטפל בהן בתהליך אחיד.",
      cards: [
        ["Facebook ו־Instagram Lead Ads", "חברו טפסי לידים זכאים של Meta ל־Bizuply CRM וסדרו פניות חדשות לצד הלקוחות וההזדמנויות הקיימים."],
        ["טפסי לידים של Google Ads", "הכניסו פניות נתמכות מטפסי Google Ads לתהליך ניהול הלידים."],
        ["טפסים באתר Bizuply", "חברו פניות מטפסים נתמכים באתר Bizuply ישירות ל־CRM."],
      ],
      diagramTitle: "פניות נתמכות, רשימת לידים אחת",
      sourceNames: ["Meta Lead Ads", "טפסי Google Ads", "טפסי אתר"],
      diagramTarget: "רשימת הלידים ב־Bizuply CRM",
      note: "חיבור Meta ו־Google Ads הוא חלק מהחבילה העסקית, אחרי שהעסק מחבר חשבון מורשה ומאשר את ההרשאות הנדרשות. טפסי אתר דורשים אתר Bizuply. מסלול CRM בלבד כולל את סביבת הלידים עצמה.",
      links: [
        ["קמפיינים ב־Meta", "/meta-campaigns"],
        ["בניית אתרים", "/website-builder"],
        ["WhatsApp", "https://whatsapp.bizuply.com/"],
      ],
    },
    profile: {
      h2: "כל סיפור הלקוח במקום אחד",
      p: "קשר עם לקוח הוא יותר משם ומספר טלפון. Bizuply עוזר לצוות לשמור רשומת לקוח מפורטת עם פרטי קשר, אינטראקציות, משימות, פגישות ומסמכים תומכים.",
      items: ["פרטי קשר", "מקור הליד", "סטטוס נוכחי", "הערות", "שיחות ורשומות תקשורת", "משימות המשך", "פגישות", "מסמכים", "שדות מותאמים"],
      closing: "כשחבר צוות פותח פרופיל לקוח, הוא יכול לעבור על ההיסטוריה הזמינה ולהבין מה כבר קרה לפני שהוא מחליט על הצעד הבא.",
    },
    tasks: {
      h2: "הפכו את המשך הטיפול לחלק משגרת היום",
      p: "חזרה בזמן הנכון יכולה לשנות את הדרך שבה לקוחות חווים את העסק. Bizuply מאפשר לתעד פעילות וליצור משימות המשך עם תאריך ושעה, כדי ששיחות חשובות יישארו גלויות.",
      cards: [
        ["יצירת משימות המשך", "קובעים את הפעולה הבאה לליד או ללקוח."],
        ["תיעוד שיחות", "שומרים הערות ורשומות פעילות על פרופיל הלקוח."],
        ["לראות מה דורש טיפול", "בודקים משימות ממתינות ובאיחור כדי לסדר את סדר היום."],
      ],
    },
    appointments: {
      h2: "חברו את קשרי הלקוחות לתורים",
      p: "בעסקי שירות, תורים הם חלק חשוב ממסע הלקוח. הכלים המחוברים של Bizuply יכולים לקרב את מידע התיאום לרשומות הלקוח ולפעולות ההמשך.",
      cards: [
        ["תיאום שירות", "מגדירים שירותים ופרטי תיאום בכלי התורים הנתמכים."],
        ["היסטוריית תורים", "בודקים תורים רלוונטיים כחלק מהיסטוריית הפעילות של הלקוח."],
        ["חוויית הזמנה ללקוח", "נותנים ללקוחות לבחור שירות וזמן פנויים כשההזמנה המקוונת פעילה."],
      ],
      planNote: "תיאום תורים והזמנה על ידי הלקוח כלולים בחבילה העסקית של Bizuply. הם לא כלולים ב־CRM בלבד ב־49 דולר לחודש.",
      link: "לעמוד תיאום התורים",
    },
    dashboard: {
      h2: "תמונת מצב של הצינור במבט אחד",
      p: "מידע ברור עוזר לצוות להחליט איפה להתמקד. לוח הבקרה של Bizuply מרכז מדדים שימושיים, כולל פעילות לידים, סטטוסים, פניות אחרונות ועבודה קרובה כשהיכולות האלה פעילות.",
      cards: [
        ["לידים חדשים", "רואים פניות שנכנסו לאחרונה."],
        ["סקירת סטטוסים", "מבינים איך ההזדמנויות מתחלקות בצינור."],
        ["פעילות אחרונה", "עוברים על העדכונים האחרונים של לקוחות ולידים."],
        ["תורים קרובים", "שומרים אינטראקציות מתוזמנות גלויות כשכלי התורים פעילים."],
      ],
    },
    audiences: {
      h2: "CRM לעסקים שחשוב להם לנהל קשרים בצורה מסודרת",
      cards: [
        ["עסקי שירות", "מנהלים פניות, פרטי לקוח ואת עבודת ההמשך שמאחורי השירות היומיומי.", "קליניקה יכולה לשמור פניות מטופס באתר ברשימת לידים אחת ולפתוח את הרשומה לפני השיחה הבאה."],
        ["בעלי עסקים קטנים", "שומרים על פרטי לקוחות והזדמנויות בלי להסתמך על פתקים מפוזרים.", "בעל עסק יכול לראות אילו פניות חדשות, עם אילו כבר נוצר קשר, ואילו עדיין צריכות משימת המשך."],
        ["צוותי מכירות", "עובדים עם שלבי ליד מסודרים ופעילות מתועדת, כדי שכל אחד יבין את הצעד הבא.", "משרד נדל״ן יכול לתעד שיחות עם מתעניינים ולהשאיר את הסטטוס ברור לאדם הבא."],
        ["עסקים שמונעים משיווק", "מכניסים פניות נתמכות מפרסום ומהאתר לתהליך משותף של ניהול לקוחות.", "סוכנות שיווק יכולה להניח פניות מקמפיין זכאי לצד שאר הצינור, כשהמסלול וההרשאות מתאימים."],
      ],
    },
    sheet: {
      h2: "מתי כדאי לעבור מעבר לגיליון אלקטרוני?",
      p: "גיליון אלקטרוני יכול להתאים לרשימת אנשי קשר פשוטה. ככל שהפניות מתרבות ויותר אנשים מעורבים, העסק עשוי להזדקק לדרך ברורה יותר לעקוב אחרי פעילות, אחריות להמשך טיפול, והתקדמות הליד.",
      columns: ["צורך", "גיליון אלקטרוני", "Bizuply CRM"],
      rows: [
        ["פרטי קשר", "ארגון ידני", "רשומות לקוח מסודרות"],
        ["שלבי ליד", "תחזוקה ידנית", "סטטוסי ליד ייעודיים"],
        ["מעקב אחרי המשך טיפול", "דורש תהליך ידני", "משימות שמקושרות ללקוח"],
        ["היסטוריית אינטראקציות", "צריך לתעד ידנית", "ציר זמן של פעילות"],
        ["טפסי לידים מחוברים", "דורש הקמה נוספת", "חיבורי לידים נתמכים"],
      ],
    },
    pricing: {
      ...en.pricing,
      h2: "תמחור CRM פשוט לעסק",
      crmName: "CRM בלבד",
      crmDescription: "ניהול לקוחות ולידים לעסקים שרוצים סביבת CRM ייעודית.",
      crmFeatures: ["רשימת לידים וששת הסטטוסים", "פרופילי לקוח, הערות והיסטוריית פעילות", "משימות המשך עם תאריך ושעה", "שדות מותאמים ברשומת הלקוח"],
      crmExcludes: "תורים, הזמנה מקוונת, אוטומציות, שיתופי פעולה, WhatsApp וחיבורי Meta או Google Ads אינם כלולים ב־CRM בלבד.",
      crmCta: "בחירת CRM",
      businessName: "Bizuply Business",
      businessDescription: "פלטפורמה עסקית רחבה יותר שמשלבת CRM עם כלים נוספים לניהול תפעול ותהליכי לקוח.",
      businessFeatures: ["כל מה שכלול ב־CRM בלבד", "תורים והזמנה על ידי הלקוח", "אוטומציות", "שיתופי פעולה ועוזר AI", "WhatsApp, אחרי חיבור החשבון", "כלי קמפיין של Meta, אחרי חיבור חשבון מורשה"],
      businessCta: "לחבילה העסקית",
      priceSentence: "CRM בלבד עולה 49 דולר לחודש. החבילה העסקית עולה 99 דולר לחודש או 990 דולר לשנה.",
    },
    faq: {
      h2: "שאלות נפוצות על תוכנת CRM",
      items: [
        ["מה פירוש CRM?", "CRM הוא Customer Relationship Management, ניהול קשרי לקוחות. המונח מתאר את התהליכים והתוכנה שעסקים משתמשים בהם כדי לארגן מידע על לקוחות, לנהל אינטראקציות, ולבנות קשר לאורך זמן."],
        ["למה משמשת תוכנת CRM?", "תוכנת CRM עוזרת לשמור פרטי קשר, לעקוב אחרי לידים, לתעד פעילות, לתכנן המשך טיפול, ולארגן תהליכי מכירה או שירות."],
        ["מי צריך מערכת CRM?", "CRM יכול להתאים לעסק שמנהל שיחות חוזרות עם לקוחות, מקבל כמה פניות, או צריך דרך מסודרת לחזור למתעניינים וללקוחות קיימים."],
        ["במה Bizuply CRM שונה מגיליון אלקטרוני?", "ב־Bizuply יש שלבי ליד, פרופילי לקוח, היסטוריית פעילות, משימות וחיבורים נתמכים. אלה יכולים להפחית את הארגון הידני שנדרש לניהול קשרי לקוחות."],
        ["אפשר לאסוף לידים מ־Facebook ומ־Instagram?", "Bizuply תומך בקליטת לידים מחיבורי Meta Lead Ads זכאים, אחרי שהעסק מחבר חשבון מורשה ומאשר את ההרשאות הנדרשות."],
        ["לידים מ־Google Ads יכולים להיכנס ל־CRM?", "חיבורים נתמכים של טפסי Google Ads יכולים להכניס פניות ל־Bizuply CRM. הזמינות תלויה בחשבון המחובר ובהגדרת החיבור."],
        ["טפסים באתר יכולים ליצור לידים ב־CRM?", "טפסים נתמכים באתרי Bizuply יכולים לשלוח פניות לתהליכי CRM מחוברים, ולשמור הזדמנויות מהאתר יחד עם שאר הלידים."],
        ["איזה מידע אפשר לשמור בפרופיל לקוח?", "פרופיל יכול לכלול פרטי קשר, סטטוס, הערות, רשומות פעילות, משימות, פגישות, מסמכים ושדות מותאמים, כשהיכולות האלה פעילות."],
        ["אפשר לשייך משימות המשך?", "Bizuply CRM תומך במשימות המשך שקשורות ללקוח, עם תאריך ושעה, כדי לסדר את הצעדים הבאים."],
        ["אפשר לעקוב אחרי שינויי סטטוס?", "כן. Bizuply משתמש בסטטוסי ליד מסודרים, ושינויי סטטוס נתמכים נרשמים בהיסטוריית הפעילות."],
        ["תיאום תורים כלול ב־Bizuply CRM?", "ל־Bizuply יש יכולות תיאום מחוברות. אם התיאום כלול תלוי במסלול ובהגדרה. הוא כלול בחבילה העסקית, ולא ב־CRM בלבד ב־49 דולר."],
        ["Bizuply מתאים לעסקים קטנים?", "כן. Bizuply CRM נועד לעזור לעסקים לשמור על לידים, רשומות לקוח ופעולות המשך כשהפעילות מתפתחת."],
        ["כמה עולה Bizuply CRM?", "מסלול CRM בלבד עולה 49 דולר לחודש. יש גם חבילה עסקית רחבה יותר ב־99 דולר לחודש או 990 דולר לשנה, עם יכולות נוספות לפי המסלול."],
        ["אפשר להשתמש ב־CRM בלי החבילה העסקית המלאה?", "כן. אפשר לבחור במסלול CRM בלבד כשצריך ניהול לקוחות ולידים בלי לרכוש את החבילה העסקית הרחבה."],
        ["מה ההבדל בין CRM לאוטומציית שיווק?", "CRM מתמקד בארגון מידע, אינטראקציות והזדמנויות. אוטומציית שיווק מתמקדת בהפעלת פעולות או הודעות לפי תנאים שהוגדרו. השניים יכולים להשלים זה את זה כשהכלים המתאימים מחוברים."],
      ],
    },
    final: {
      h2: "בהירות בכל קשר עם לקוח",
      p: "תנו לעסק מקום מסודר אחד לנהל לידים, להבין את היסטוריית הלקוח, ולתכנן את השיחה הבאה.",
      primary: "מתחילים עם Bizuply CRM",
      secondary: "להכיר את הפלטפורמה",
    },
    chrome: { navAria: "ניווט ראשי", about: "אודות", website: "אתר", crm: "CRM", automations: "אוטומציות", appointments: "תורים", pricing: "מחירים", login: "כניסה", cta: "מתחילים", langCode: "HE" },
  },
);

const es = pack(
  "es",
  "ltr",
  "Software CRM para pequeñas empresas y gestión de leads | Bizuply",
  "Organice leads, gestione clientes, haga seguimiento y conecte consultas compatibles de Meta, Google Ads y su sitio con Bizuply CRM. Los planes empiezan en 49 dólares al mes.",
  {
    h1: "Gestione cada lead y cada relación con el cliente en un solo lugar",
    description: "Organice leads, gestione la información de clientes, haga seguimiento y mantenga las oportunidades en movimiento con Bizuply CRM. Conecte las consultas de sus canales y de su sitio a un espacio práctico de gestión de clientes.",
    primary: "Empezar con CRM",
    secondary: "Ver cómo funciona",
    points: ["Gestión centralizada de leads", "Perfiles e historial de actividad", "Tareas de seguimiento y recordatorios", "Fuentes de leads conectadas"],
  },
  {
    crumb: "CRM",
    what: {
      h2: "¿Qué es un software CRM?",
      p1: "El software de Customer Relationship Management (CRM) ayuda a las empresas a organizar la información de leads y clientes, documentar interacciones, gestionar el seguimiento y seguir las oportunidades en el tiempo.",
      p2: "En lugar de repartir los datos entre hojas de cálculo, mensajes y notas sueltas, un CRM ofrece un lugar estructurado para entender quién contactó al negocio, qué necesita y cuál es el siguiente paso.",
      h3: "¿Cómo ayuda Bizuply CRM a las empresas?",
      p3: "Bizuply reúne los datos del lead, el expediente, el historial y las tareas de seguimiento en un mismo entorno. El equipo puede revisar consultas nuevas, actualizar la etapa, documentar la conversación y dejar la información accesible durante toda la relación.",
      cards: [
        ["Captar leads", "Lleve las consultas entrantes a un flujo de trabajo ordenado."],
        ["Gestionar contactos", "Mantenga juntos los datos del cliente y el historial de comunicación."],
        ["Seguir oportunidades", "Vea en qué punto está cada lead y qué conversación necesita atención."],
        ["Planificar el seguimiento", "Cree tareas y recordatorios para el siguiente paso."],
      ],
    },
    pipeline: {
      h2: "Sepa exactamente en qué punto está cada lead",
      p: "Un lead nuevo necesita atención a tiempo, pero no todas las oportunidades están en la misma etapa. Bizuply CRM ayuda a organizar los leads por estado, revisar su avance y conservar un historial claro de las interacciones.",
      stages: [
        ["Nuevo", "La consulta llegó y todavía no se atendió."],
        ["Contactado", "Alguien del equipo ya se comunicó."],
        ["Interesado", "La conversación sigue activa y el lead valora el siguiente paso."],
        ["Convertido", "El lead pasó a ser cliente."],
        ["Perdido", "La oportunidad se cerró y el motivo puede quedar en el expediente."],
        ["lead viejo", "La consulta es más antigua y puede revisarse aparte del trabajo actual."],
      ],
      journeyLabel: "Un lead, avanzando",
      journey: "Nuevo → Contactado → Interesado → Convertido",
    },
    sources: {
      h2: "Reúna los leads de los canales que ya usa",
      p: "El próximo cliente puede llegar por un anuncio, un formulario del sitio u otro canal de marketing conectado. Bizuply ayuda a llevar las consultas compatibles al CRM para que el equipo las atienda con el mismo proceso.",
      cards: [
        ["Facebook e Instagram Lead Ads", "Conecte formularios de leads de Meta elegibles a Bizuply CRM y organice las consultas nuevas junto a sus clientes y oportunidades."],
        ["Formularios de Google Ads", "Incorpore los envíos compatibles de formularios de Google Ads al flujo de gestión de leads."],
        ["Formularios del sitio Bizuply", "Conecte las consultas de los formularios compatibles de un sitio Bizuply directamente al CRM."],
      ],
      diagramTitle: "Consultas compatibles, una sola lista",
      sourceNames: ["Meta Lead Ads", "Formularios de Google Ads", "Formularios del sitio"],
      diagramTarget: "Lista de leads de Bizuply CRM",
      note: "Las conexiones de Meta y Google Ads forman parte del plan Business, después de que el negocio conecta una cuenta autorizada y concede los permisos necesarios. Los formularios del sitio requieren un sitio Bizuply. CRM Only incluye el espacio de trabajo de leads.",
      links: [
        ["Campañas de Meta", "/meta-campaigns"],
        ["Website Builder", "/website-builder"],
        ["WhatsApp", "https://whatsapp.bizuply.com/"],
      ],
    },
    profile: {
      h2: "Toda la historia del cliente en un solo lugar",
      p: "Una relación con el cliente es más que un nombre y un teléfono. Bizuply ayuda al equipo a mantener un expediente con datos de contacto, interacciones, tareas, citas y documentos.",
      items: ["Datos de contacto", "Origen del lead", "Estado actual", "Notas", "Llamadas y registros de comunicación", "Tareas de seguimiento", "Citas", "Documentos", "Campos personalizados"],
      closing: "Cuando alguien del equipo abre el perfil, puede revisar el historial disponible y entender qué ocurrió antes de decidir el siguiente paso.",
    },
    tasks: {
      h2: "Haga del seguimiento parte del trabajo diario",
      p: "Responder en el momento adecuado cambia la experiencia del cliente. Bizuply permite documentar la actividad y crear tareas con fecha y hora, para que las conversaciones importantes sigan visibles.",
      cards: [
        ["Crear tareas de seguimiento", "Programe la siguiente acción para un lead o un cliente."],
        ["Documentar conversaciones", "Guarde notas y registros de actividad en el perfil del cliente."],
        ["Ver qué necesita atención", "Revise tareas pendientes y vencidas para ordenar el día."],
      ],
    },
    appointments: {
      h2: "Conecte las relaciones con las citas",
      p: "En un negocio de servicios, las citas forman parte del recorrido del cliente. Las herramientas conectadas de Bizuply pueden acercar la agenda al expediente y al seguimiento.",
      cards: [
        ["Agenda de servicios", "Defina servicios y detalles de horario en las herramientas de citas compatibles."],
        ["Historial de citas", "Revise las citas relevantes dentro del historial del cliente."],
        ["Reserva para el cliente", "Ofrezca elegir servicio y horario disponibles cuando la reserva en línea está activa."],
      ],
      planNote: "La agenda y la reserva del cliente están incluidas en el plan Bizuply Business. No están incluidas en CRM Only a 49 dólares al mes.",
      link: "Ver la agenda de citas",
    },
    dashboard: {
      h2: "Entienda el pipeline de un vistazo",
      p: "Una información clara ayuda al equipo a decidir dónde concentrarse. El panel de Bizuply reúne indicadores útiles: actividad de leads, estados, consultas recientes y trabajo próximo cuando esas funciones están activas.",
      cards: [
        ["Leads nuevos", "Vea las consultas que acaban de entrar."],
        ["Resumen de estados", "Entienda cómo se reparten las oportunidades en el pipeline."],
        ["Actividad reciente", "Revise las últimas actualizaciones de clientes y leads."],
        ["Próximas citas", "Mantenga visibles las interacciones programadas cuando las herramientas de citas están activas."],
      ],
    },
    audiences: {
      h2: "Un CRM para negocios que cuidan las relaciones con orden",
      cards: [
        ["Negocios de servicios", "Gestione consultas, datos del cliente y el seguimiento detrás del servicio diario.", "Una clínica puede guardar las consultas del formulario del sitio en una sola lista y abrir el expediente antes de la siguiente conversación."],
        ["Dueños de pequeños negocios", "Mantenga clientes y oportunidades ordenados sin depender de notas dispersas.", "El dueño puede ver qué consultas son nuevas, cuáles ya se contactaron y cuáles todavía necesitan una tarea."],
        ["Equipos de ventas", "Trabaje con etapas claras y actividad documentada para que cualquiera entienda el siguiente paso.", "Una oficina inmobiliaria puede registrar llamadas con compradores interesados y dejar el estado claro para la siguiente persona."],
        ["Negocios impulsados por marketing", "Lleve las consultas compatibles de publicidad y del sitio a un mismo proceso de clientes.", "Una agencia puede colocar las consultas elegibles de una campaña junto al resto del pipeline, con el plan y los permisos adecuados."],
      ],
    },
    sheet: {
      h2: "¿Cuándo conviene ir más allá de la hoja de cálculo?",
      p: "Una hoja de cálculo puede servir para una lista simple de contactos. Cuando llegan más consultas y participa más gente, el negocio puede necesitar una forma más clara de seguir la actividad, la responsabilidad del seguimiento y el avance del lead.",
      columns: ["Necesidad", "Hoja de cálculo", "Bizuply CRM"],
      rows: [
        ["Datos de contacto", "Organización manual", "Expedientes estructurados"],
        ["Etapas del lead", "Mantenidas a mano", "Estados de lead dedicados"],
        ["Seguimiento", "Requiere procesos manuales", "Tareas vinculadas al cliente"],
        ["Historial de interacciones", "Hay que documentarlo a mano", "Línea de tiempo de actividad"],
        ["Formularios de leads conectados", "Requiere una configuración adicional", "Integraciones de leads compatibles"],
      ],
    },
    pricing: {
      ...en.pricing,
      h2: "Precios claros de CRM para su negocio",
      crmName: "CRM Only",
      crmDescription: "Gestión de clientes y leads para negocios que quieren un espacio de CRM dedicado.",
      crmFeatures: ["Lista de leads y los seis estados", "Perfiles, notas e historial", "Tareas de seguimiento con fecha y hora", "Campos personalizados en el expediente"],
      crmExcludes: "Citas, reserva en línea, automatizaciones, colaboraciones, WhatsApp y las conexiones de Meta o Google Ads no están incluidas en CRM Only.",
      crmCta: "Elegir CRM",
      businessDescription: "Una plataforma más amplia que combina CRM con herramientas adicionales para la operación y los flujos con clientes.",
      businessFeatures: ["Todo lo de CRM Only", "Citas y reserva del cliente", "Automatizaciones", "Colaboraciones y asistente de IA", "WhatsApp, después de conectar la cuenta", "Herramientas de campañas de Meta, después de conectar la cuenta autorizada"],
      businessCta: "Ver el plan Business",
      priceSentence: "CRM Only cuesta 49 dólares al mes. El plan Business cuesta 99 dólares al mes o 990 dólares al año.",
    },
    faq: {
      h2: "Preguntas frecuentes sobre el software CRM",
      items: [
        ["¿Qué significa CRM?", "CRM significa Customer Relationship Management, gestión de la relación con el cliente. Describe los procesos y el software que las empresas usan para organizar la información de clientes, gestionar interacciones y construir la relación en el tiempo."],
        ["¿Para qué sirve un software CRM?", "Sirve para guardar contactos, seguir leads, documentar la actividad, planificar seguimientos y organizar flujos de venta o de servicio."],
        ["¿Quién necesita un CRM?", "Puede servir a un negocio que mantiene conversaciones recurrentes, recibe varias consultas o necesita una forma ordenada de volver a contactar a prospectos y clientes."],
        ["¿En qué se diferencia Bizuply CRM de una hoja de cálculo?", "Bizuply ofrece etapas de lead, perfiles, historial, tareas e integraciones compatibles. Eso puede reducir la organización manual de las relaciones con clientes."],
        ["¿Bizuply puede recoger leads de Facebook e Instagram?", "Bizuply admite la recepción de leads desde integraciones elegibles de Meta Lead Ads, después de que el negocio conecta su cuenta autorizada y concede los permisos necesarios."],
        ["¿Los leads de Google Ads entran al CRM?", "Las integraciones compatibles de formularios de Google Ads pueden llevar consultas a Bizuply CRM. La disponibilidad depende de la cuenta conectada y de la configuración."],
        ["¿Los formularios del sitio crean leads?", "Los formularios compatibles de un sitio Bizuply pueden enviar consultas a los flujos de CRM conectados y dejar esas oportunidades junto al resto de los leads."],
        ["¿Qué información puedo guardar en un perfil?", "El perfil puede incluir contacto, estado, notas, actividad, tareas, citas, documentos y campos personalizados cuando esas funciones están activas."],
        ["¿Puedo asignar tareas de seguimiento?", "Bizuply CRM admite tareas de seguimiento del cliente con fecha y hora, para ordenar el siguiente paso."],
        ["¿Puedo seguir los cambios de estado?", "Sí. Bizuply usa estados de lead estructurados, y los cambios compatibles quedan en el historial de actividad."],
        ["¿Bizuply CRM incluye la agenda de citas?", "Bizuply ofrece herramientas de citas conectadas. Si la agenda está incluida depende del plan y de la configuración. Forma parte del plan Business, no de CRM Only a 49 dólares al mes."],
        ["¿Bizuply sirve para pequeños negocios?", "Sí. Bizuply CRM está pensado para mantener leads, expedientes y seguimientos ordenados a medida que la operación crece."],
        ["¿Cuánto cuesta Bizuply CRM?", "El plan CRM Only cuesta 49 dólares al mes. También existe un plan Business más amplio a 99 dólares al mes o 990 dólares al año, con funciones adicionales según el plan."],
        ["¿Puedo usar el CRM sin el plan Business completo?", "Sí. Puede elegir CRM Only cuando necesita gestionar clientes y leads sin comprar el paquete Business."],
        ["¿Cuál es la diferencia entre CRM y la automatización de marketing?", "El CRM organiza información, interacciones y oportunidades. La automatización de marketing dispara acciones o mensajes según condiciones configuradas. Pueden complementarse cuando las herramientas adecuadas están conectadas."],
      ],
    },
    final: {
      h2: "Claridad en cada relación con el cliente",
      p: "Dé a su negocio un lugar ordenado para gestionar leads, entender el historial y preparar la siguiente conversación.",
      primary: "Empezar con Bizuply CRM",
      secondary: "Explorar la plataforma",
    },
    chrome: { langCode: "ES", about: "Nosotros", website: "Sitio", automations: "Automatizaciones", appointments: "Citas", pricing: "Precios", login: "Entrar", cta: "Empezar" },
  },
);

const ptBR = pack(
  "pt-BR",
  "ltr",
  "Software de CRM para pequenas empresas e gestão de leads | Bizuply",
  "Organize leads, gerencie clientes, acompanhe retornos e conecte consultas compatíveis de Meta, Google Ads e do site com o Bizuply CRM. Os planos começam em US$ 49 por mês.",
  {
    h1: "Gerencie cada lead e cada relação com o cliente em um só lugar",
    description: "Organize leads, gerencie as informações dos clientes, acompanhe os retornos e mantenha as oportunidades em movimento com o Bizuply CRM. Conecte as consultas dos seus canais e do site a um espaço prático de gestão de clientes.",
    primary: "Começar com o CRM",
    secondary: "Ver como funciona",
    points: ["Gestão centralizada de leads", "Perfis e histórico de atividade", "Tarefas de retorno e lembretes", "Fontes de leads conectadas"],
  },
  {
    crumb: "CRM",
    what: {
      h2: "O que é um software de CRM?",
      p1: "O software de Customer Relationship Management (CRM) ajuda as empresas a organizar informações de leads e clientes, registrar interações, gerir retornos e acompanhar oportunidades ao longo do tempo.",
      p2: "Em vez de espalhar dados em planilhas, mensagens e anotações soltas, um CRM oferece um lugar estruturado para entender quem entrou em contato, o que precisa e qual é o próximo passo.",
      h3: "Como o Bizuply CRM ajuda as empresas?",
      p3: "O Bizuply reúne os dados do lead, o cadastro do cliente, o histórico e as tarefas de retorno em um só ambiente. A equipe pode revisar consultas novas, atualizar a etapa, registrar a conversa e manter a informação acessível durante a relação.",
      cards: [
        ["Captar leads", "Traga as consultas recebidas para um fluxo organizado."],
        ["Gerir contatos", "Mantenha os dados do cliente e o histórico de comunicação juntos."],
        ["Acompanhar oportunidades", "Veja em que ponto cada lead está e qual conversa precisa de atenção."],
        ["Planejar o retorno", "Crie tarefas e lembretes para o próximo passo."],
      ],
    },
    pipeline: {
      h2: "Saiba exatamente em que ponto cada lead está",
      p: "Um lead novo precisa de atenção no tempo certo, mas nem toda oportunidade está na mesma etapa. O Bizuply CRM ajuda a organizar os leads por status, revisar o avanço e manter um histórico claro das interações.",
      stages: [
        ["Novo", "A consulta chegou e ainda não foi atendida."],
        ["Contato", "Alguém da equipe já falou com a pessoa."],
        ["Interessado", "A conversa continua e o lead avalia o próximo passo."],
        ["Convertido", "O lead passou a ser cliente."],
        ["Perdido", "A oportunidade foi encerrada e o motivo pode ficar no cadastro."],
        ["Velha lead.", "A consulta é mais antiga e pode ser revista separada do trabalho atual."],
      ],
      journeyLabel: "Um lead, avançando",
      journey: "Novo → Contato → Interessado → Convertido",
    },
    sources: {
      h2: "Reúna os leads dos canais que você usa",
      p: "O próximo cliente pode chegar por um anúncio, um formulário do site ou outro canal de marketing conectado. O Bizuply ajuda a trazer consultas compatíveis para o CRM, para a equipe seguir um processo consistente.",
      cards: [
        ["Facebook e Instagram Lead Ads", "Conecte formulários de lead elegíveis da Meta ao Bizuply CRM e organize as novas consultas junto dos clientes e das oportunidades."],
        ["Formulários do Google Ads", "Traga envios compatíveis de formulários do Google Ads para o fluxo de gestão de leads."],
        ["Formulários do site Bizuply", "Conecte consultas de formulários compatíveis de um site Bizuply diretamente ao CRM."],
      ],
      diagramTitle: "Consultas compatíveis, uma lista de leads",
      sourceNames: ["Meta Lead Ads", "Formulários do Google Ads", "Formulários do site"],
      diagramTarget: "Lista de leads do Bizuply CRM",
      note: "As conexões de Meta e Google Ads fazem parte do plano Business, depois que o negócio conecta uma conta autorizada e concede as permissões necessárias. Formulários de site exigem um site Bizuply. O CRM Only inclui o espaço de trabalho dos leads.",
      links: [
        ["Campanhas da Meta", "/meta-campaigns"],
        ["Website Builder", "/website-builder"],
        ["WhatsApp", "https://whatsapp.bizuply.com/"],
      ],
    },
    profile: {
      h2: "A história completa do cliente em um só lugar",
      p: "Uma relação com o cliente é mais do que nome e telefone. O Bizuply ajuda a equipe a manter um cadastro com contato, interações, tarefas, compromissos e documentos.",
      items: ["Informações de contato", "Origem do lead", "Status atual", "Notas", "Ligações e registros de comunicação", "Tarefas de retorno", "Compromissos", "Documentos", "Campos personalizados"],
      closing: "Quando alguém da equipe abre o perfil, pode revisar o histórico disponível e entender o que já aconteceu antes de decidir o próximo passo.",
    },
    tasks: {
      h2: "Faça o retorno parte do trabalho do dia",
      p: "Retornar no momento certo muda a experiência do cliente. O Bizuply permite registrar a atividade e criar tarefas com data e hora, para que conversas importantes continuem visíveis.",
      cards: [
        ["Criar tarefas de retorno", "Agende a próxima ação para um lead ou cliente."],
        ["Registrar conversas", "Guarde notas e registros de atividade no perfil do cliente."],
        ["Ver o que precisa de atenção", "Revise tarefas pendentes e atrasadas para organizar o dia."],
      ],
    },
    appointments: {
      h2: "Conecte as relações com os compromissos",
      p: "Em negócios de serviço, os horários fazem parte da jornada do cliente. As ferramentas conectadas do Bizuply podem aproximar a agenda do cadastro e do acompanhamento.",
      cards: [
        ["Agenda de serviços", "Defina serviços e detalhes de horário nas ferramentas de agendamento compatíveis."],
        ["Histórico de compromissos", "Revise os compromissos relevantes no histórico do cliente."],
        ["Reserva para o cliente", "Ofereça a escolha de serviço e horário disponíveis quando a reserva online está ativa."],
      ],
      planNote: "A agenda e a reserva pelo cliente estão no plano Bizuply Business. Não estão incluídas no CRM Only de US$ 49 por mês.",
      link: "Ver o agendamento",
    },
    dashboard: {
      h2: "Entenda o pipeline em um olhar",
      p: "Informação clara ajuda a equipe a decidir onde focar. O painel do Bizuply reúne indicadores úteis, incluindo atividade de leads, status, consultas recentes e o trabalho próximo quando esses recursos estão ativos.",
      cards: [
        ["Leads novos", "Veja as consultas que acabaram de entrar."],
        ["Visão dos status", "Entenda como as oportunidades se distribuem no pipeline."],
        ["Atividade recente", "Revise as últimas atualizações de clientes e leads."],
        ["Próximos compromissos", "Mantenha as interações agendadas visíveis quando as ferramentas de agenda estão ativas."],
      ],
    },
    audiences: {
      h2: "Um CRM para negócios que valorizam relações organizadas",
      cards: [
        ["Negócios de serviço", "Gerencie consultas, dados do cliente e o retorno por trás do atendimento do dia.", "Uma clínica pode manter as consultas do formulário do site em uma lista e abrir o cadastro antes da próxima conversa."],
        ["Donos de pequenos negócios", "Mantenha clientes e oportunidades organizados sem depender de anotações espalhadas.", "O dono pode ver quais consultas são novas, quais já tiveram contato e quais ainda precisam de uma tarefa."],
        ["Equipes de vendas", "Trabalhe com etapas claras e atividade registrada para que qualquer pessoa entenda o próximo passo.", "Um escritório imobiliário pode registrar ligações com compradores interessados e deixar o status claro para a próxima pessoa."],
        ["Negócios movidos por marketing", "Traga consultas compatíveis de anúncios e do site para um processo comum de clientes.", "Uma agência pode colocar consultas elegíveis de campanha ao lado do restante do pipeline, com o plano e as permissões certos."],
      ],
    },
    sheet: {
      h2: "Quando vale ir além da planilha?",
      p: "Uma planilha pode servir para uma lista simples de contatos. Quando as consultas aumentam e mais pessoas participam, o negócio pode precisar de um modo mais claro de acompanhar atividade, responsabilidade de retorno e avanço do lead.",
      columns: ["Necessidade", "Planilha", "Bizuply CRM"],
      rows: [
        ["Informações de contato", "Organização manual", "Cadastros estruturados"],
        ["Etapas do lead", "Mantidas à mão", "Status de lead dedicados"],
        ["Acompanhamento", "Exige processos manuais", "Tarefas ligadas ao cliente"],
        ["Histórico de interações", "Precisa ser registrado à mão", "Linha do tempo de atividade"],
        ["Formulários de lead conectados", "Exige configuração adicional", "Integrações de lead compatíveis"],
      ],
    },
    pricing: {
      ...en.pricing,
      h2: "Preço simples de CRM para o seu negócio",
      crmDescription: "Gestão de clientes e leads para quem quer um espaço de CRM dedicado.",
      crmFeatures: ["Lista de leads e os seis status", "Perfis, notas e histórico", "Tarefas de retorno com data e hora", "Campos personalizados no cadastro"],
      crmExcludes: "Agenda, reserva online, automações, colaborações, WhatsApp e conexões de Meta ou Google Ads não estão incluídos no CRM Only.",
      crmCta: "Escolher CRM",
      businessDescription: "Uma plataforma mais ampla que combina CRM com ferramentas adicionais para a operação e os fluxos com clientes.",
      businessFeatures: ["Tudo do CRM Only", "Agenda e reserva do cliente", "Automações", "Colaborações e assistente de IA", "WhatsApp, depois de conectar a conta", "Ferramentas de campanha da Meta, depois de conectar a conta autorizada"],
      businessCta: "Ver o plano Business",
      priceSentence: "O CRM Only custa US$ 49 por mês. O plano Business custa US$ 99 por mês ou US$ 990 por ano.",
    },
    faq: {
      h2: "Perguntas frequentes sobre software de CRM",
      items: [
        ["O que significa CRM?", "CRM significa Customer Relationship Management, gestão do relacionamento com o cliente. O termo descreve os processos e o software que as empresas usam para organizar informações, gerir interações e construir a relação ao longo do tempo."],
        ["Para que serve um software de CRM?", "Serve para guardar contatos, acompanhar leads, registrar atividade, planejar retornos e organizar fluxos de venda ou de serviço."],
        ["Quem precisa de um CRM?", "Pode ser útil para um negócio que mantém conversas recorrentes, recebe várias consultas ou precisa de um modo estruturado de retornar a interessados e clientes."],
        ["Como o Bizuply CRM difere de uma planilha?", "O Bizuply oferece etapas de lead, perfis, histórico, tarefas e integrações compatíveis. Isso pode reduzir a organização manual das relações com clientes."],
        ["O Bizuply coleta leads do Facebook e do Instagram?", "O Bizuply aceita leads de integrações elegíveis de Meta Lead Ads depois que o negócio conecta a conta autorizada e concede as permissões necessárias."],
        ["Leads do Google Ads entram no CRM?", "Integrações compatíveis de formulários do Google Ads podem levar consultas ao Bizuply CRM. A disponibilidade depende da conta conectada e da configuração."],
        ["Formulários do site criam leads?", "Formulários compatíveis em sites Bizuply podem enviar consultas para fluxos de CRM conectados e manter essas oportunidades junto dos outros leads."],
        ["Que informações posso salvar em um perfil?", "O perfil pode incluir contato, status, notas, atividade, tarefas, compromissos, documentos e campos personalizados quando esses recursos estão ativos."],
        ["Posso atribuir tarefas de retorno?", "O Bizuply CRM aceita tarefas de retorno do cliente com data e hora, para organizar o próximo passo."],
        ["Posso acompanhar mudanças de status?", "Sim. O Bizuply usa status de lead estruturados, e as mudanças compatíveis ficam no histórico de atividade."],
        ["O Bizuply CRM inclui agendamento?", "O Bizuply oferece recursos de agenda conectados. Se o agendamento está incluído depende do plano e da configuração. Ele faz parte do plano Business, não do CRM Only."],
        ["O Bizuply serve para pequenos negócios?", "Sim. O Bizuply CRM foi feito para manter leads, cadastros e retornos organizados à medida que a operação cresce."],
        ["Quanto custa o Bizuply CRM?", "O plano CRM Only custa US$ 49 por mês. Há também um plano Business mais amplo por US$ 99 ao mês ou US$ 990 ao ano, com recursos adicionais conforme o plano."],
        ["Posso usar o CRM sem o plano Business completo?", "Sim. Dá para escolher o CRM Only quando a necessidade é gerir clientes e leads sem comprar o pacote Business."],
        ["Qual é a diferença entre CRM e automação de marketing?", "O CRM organiza informação, interações e oportunidades. A automação de marketing dispara ações ou mensagens conforme condições configuradas. Os dois podem se complementar quando as ferramentas certas estão conectadas."],
      ],
    },
    final: {
      h2: "Clareza em cada relação com o cliente",
      p: "Dê ao negócio um lugar organizado para gerir leads, entender o histórico e planejar a próxima conversa.",
      primary: "Começar com o Bizuply CRM",
      secondary: "Explorar a plataforma",
    },
    chrome: { langCode: "PT", about: "Sobre", website: "Site", automations: "Automações", appointments: "Agenda", pricing: "Preços", login: "Entrar", cta: "Começar" },
  },
);

const ar = pack(
  "ar",
  "rtl",
  "برنامج CRM للشركات الصغيرة وإدارة العملاء المحتملين | Bizuply",
  "نظّموا العملاء المحتملين، وأديروا العملاء، وتابعوا خطوات المتابعة، واربطوا الاستفسارات المدعومة من Meta وGoogle Ads والموقع مع Bizuply CRM. تبدأ الخطط من 49 دولارًا في الشهر.",
  {
    h1: "أديروا كل عميل محتمل وكل علاقة مع العميل في مكان واحد",
    description: "نظّموا العملاء المحتملين، وأديروا معلومات العملاء، وتابعوا خطوات المتابعة، وأبقوا الفرص تتحرك مع Bizuply CRM. اربطوا الاستفسارات من قنوات التسويق والموقع بمساحة عملية لإدارة العملاء.",
    primary: "ابدأوا مع CRM",
    secondary: "شاهدوا كيف يعمل",
    points: ["إدارة مركزية للعملاء المحتملين", "ملفات العملاء وسجل النشاط", "مهام متابعة وتذكيرات", "مصادر عملاء محتملين متصلة"],
  },
  {
    crumb: "CRM",
    what: {
      h2: "ما هو برنامج CRM؟",
      p1: "يساعد برنامج إدارة علاقات العملاء (CRM) الأنشطة على تنظيم معلومات العملاء المحتملين والعملاء، وتوثيق التفاعلات، وإدارة المتابعة، وتتبع الفرص مع الوقت.",
      p2: "بدلًا من توزيع معلومات العملاء بين جداول ورسائل وملاحظات متفرقة، يوفّر CRM مكانًا منظمًا لفهم من تواصل مع النشاط، وماذا يحتاج، وما الخطوة التالية.",
      h3: "كيف يساعد Bizuply CRM الأنشطة؟",
      p3: "يجمع Bizuply تفاصيل العميل المحتمل وسجل العميل وتاريخ النشاط ومهام المتابعة في بيئة واحدة. يستطيع الفريق مراجعة الاستفسارات الجديدة وتحديث المرحلة وتوثيق الحديث وإبقاء المعلومات متاحة طوال العلاقة.",
      cards: [
        ["التقاط العملاء المحتملين", "أدخلوا الاستفسارات الواردة إلى مسار عمل منظم."],
        ["إدارة جهات الاتصال", "أبقوا معلومات العميل وسجل التواصل معًا."],
        ["تتبع الفرص", "شاهدوا أين يقف كل عميل محتمل وأي حديث يحتاج إلى انتباه."],
        ["تخطيط المتابعة", "أنشئوا مهام وتذكيرات للخطوة التالية."],
      ],
    },
    pipeline: {
      h2: "اعرفوا بالضبط أين يقف كل عميل محتمل",
      p: "العميل المحتمل الجديد يحتاج إلى انتباه في الوقت المناسب، لكن ليست كل فرصة في المرحلة نفسها. يساعد Bizuply CRM على تنظيم العملاء المحتملين حسب الحالة ومراجعة تقدمهم والاحتفاظ بسجل واضح للتفاعلات.",
      stages: [
        ["جديد", "وصل الاستفسار ولم يُعالَج بعد."],
        ["تم الاتصال", "تواصل أحد أفراد الفريق."],
        ["مهتم", "الحديث مستمر والعميل المحتمل يدرس الخطوة التالية."],
        ["المحوّلة", "أصبح العميل المحتمل عميلًا."],
        ["مفقود", "أُغلقت الفرصة ويمكن أن يبقى السبب في السجل."],
        ["عميل محتمل القديم", "الاستفسار أقدم ويمكن مراجعته بمعزل عن العمل الحالي."],
      ],
      journeyLabel: "عميل محتمل واحد، يتقدم",
      journey: "جديد → تم الاتصال → مهتم → المحوّلة",
    },
    sources: {
      h2: "اجمعوا العملاء المحتملين من القنوات التي تستخدمونها",
      p: "قد يكتشف العميل التالي نشاطكم عبر إعلان أو نموذج في الموقع أو قناة تسويق متصلة أخرى. يساعد Bizuply على إدخال الاستفسارات المدعومة إلى CRM ليديرها الفريق بعملية متابعة واحدة.",
      cards: [
        ["إعلانات العملاء المحتملين في Facebook وInstagram", "اربطوا نماذج Meta المؤهلة بـ Bizuply CRM ونظّموا الاستفسارات الجديدة إلى جانب العملاء والفرص الحالية."],
        ["نماذج Google Ads", "أدخلوا إرسالات نماذج Google Ads المدعومة إلى مسار إدارة العملاء المحتملين."],
        ["نماذج موقع Bizuply", "اربطوا الاستفسارات من النماذج المدعومة في موقع Bizuply مباشرة بـ CRM."],
      ],
      diagramTitle: "استفسارات مدعومة، قائمة واحدة",
      sourceNames: ["Meta Lead Ads", "نماذج Google Ads", "نماذج الموقع"],
      diagramTarget: "قائمة العملاء المحتملين في Bizuply CRM",
      note: "اتصالات Meta وGoogle Ads جزء من خطة Business، بعد أن يربط النشاط حسابًا مخوّلًا ويمنح الأذونات المطلوبة. نماذج الموقع تتطلب موقع Bizuply. خطة CRM فقط تشمل مساحة العملاء المحتملين نفسها.",
      links: [
        ["حملات Meta", "/meta-campaigns"],
        ["Website Builder", "/website-builder"],
        ["WhatsApp", "https://whatsapp.bizuply.com/"],
      ],
    },
    profile: {
      h2: "قصة العميل كاملة في مكان واحد",
      p: "العلاقة مع العميل أكثر من اسم ورقم هاتف. يساعد Bizuply الفريق على الاحتفاظ بسجل مفصّل يشمل بيانات الاتصال والتفاعلات والمهام والمواعيد والمستندات.",
      items: ["معلومات الاتصال", "مصدر العميل المحتمل", "الحالة الحالية", "ملاحظات", "المكالمات وسجلات التواصل", "مهام المتابعة", "المواعيد", "المستندات", "حقول مخصصة"],
      closing: "حين يفتح أحد أفراد الفريق ملف العميل، يستطيع مراجعة التاريخ المتاح وفهم ما حدث قبل أن يقرر الخطوة التالية.",
    },
    tasks: {
      h2: "اجعلوا المتابعة جزءًا من عمل اليوم",
      p: "المتابعة في الوقت المناسب تغيّر تجربة العميل. يتيح Bizuply توثيق النشاط وإنشاء مهام متابعة بتاريخ ووقت، لتبقى الأحاديث المهمة ظاهرة.",
      cards: [
        ["إنشاء مهام متابعة", "حدّدوا الإجراء التالي لعميل محتمل أو لعميل."],
        ["توثيق الأحاديث", "أبقوا الملاحظات وسجلات النشاط مرتبطة بملف العميل."],
        ["رؤية ما يحتاج إلى انتباه", "راجعوا المهام المعلقة والمتأخرة لترتيب أولويات اليوم."],
      ],
    },
    appointments: {
      h2: "اربطوا علاقات العملاء بالمواعيد",
      p: "في أنشطة الخدمات، المواعيد جزء مهم من رحلة العميل. يمكن لأدوات Bizuply المتصلة أن تقرّب معلومات الجدولة من سجل العميل ومن المتابعة.",
      cards: [
        ["جدولة الخدمة", "عرّفوا الخدمات وتفاصيل الجدولة في أدوات المواعيد المدعومة."],
        ["سجل المواعيد", "راجعوا المواعيد ذات الصلة ضمن تاريخ نشاط العميل."],
        ["تجربة الحجز للعميل", "امنحوا العملاء طريقة لاختيار الخدمة والوقت المتاحين حين يكون الحجز عبر الإنترنت مفعّلًا."],
      ],
      planNote: "جدولة المواعيد وحجز العميل مشمولان في خطة Bizuply Business. ليسا مشمولين في CRM فقط بسعر 49 دولارًا في الشهر.",
      link: "صفحة تنسيق المواعيد",
    },
    dashboard: {
      h2: "افهموا مسار الفرص بنظرة واحدة",
      p: "المعلومات الواضحة تساعد الفريق على تحديد موضع التركيز. تجمع لوحة Bizuply مؤشرات مفيدة، منها نشاط العملاء المحتملين وحالاتهم والاستفسارات الأخيرة والعمل القادم حين تكون هذه القدرات مفعّلة.",
      cards: [
        ["عملاء محتملون جدد", "شاهدوا الاستفسارات التي دخلت حديثًا."],
        ["نظرة على الحالات", "افهموا كيف تتوزع الفرص في المسار."],
        ["النشاط الأخير", "راجعوا آخر تحديثات العملاء والعملاء المحتملين."],
        ["المواعيد القادمة", "أبقوا التفاعلات المجدولة ظاهرة حين تكون أدوات المواعيد مفعّلة."],
      ],
    },
    audiences: {
      h2: "CRM للأنشطة التي تهتم بعلاقات منظمة",
      cards: [
        ["أنشطة الخدمات", "أديروا الاستفسارات وتفاصيل العميل وعمل المتابعة خلف تقديم الخدمة اليومي.", "يمكن لعيادة أن تبقي استفسارات نموذج الموقع في قائمة واحدة وتفتح السجل قبل الحديث التالي."],
        ["أصحاب الأنشطة الصغيرة", "أبقوا معلومات العملاء والفرص منظمة من دون الاعتماد على ملاحظات متفرقة.", "يستطيع المالك أن يرى أي الاستفسارات جديدة، وأيها تم الاتصال به، وأيها ما زال يحتاج إلى مهمة متابعة."],
        ["فرق المبيعات", "اعملوا بمراحل واضحة ونشاط موثّق حتى يفهم أي فرد الخطوة التالية.", "يمكن لمكتب عقاري أن يسجّل المكالمات مع المهتمين ويترك الحالة واضحة للشخص التالي."],
        ["أنشطة يقودها التسويق", "أدخلوا استفسارات الإعلان والموقع المدعومة إلى عملية مشتركة لإدارة العملاء.", "يمكن لوكالة أن تضع استفسارات الحملة المؤهلة إلى جانب بقية المسار، حين تكون الخطة والأذونات مناسبة."],
      ],
    },
    sheet: {
      h2: "متى يحين الانتقال إلى ما بعد جداول البيانات؟",
      p: "قد يفيد جدول البيانات في قائمة جهات اتصال بسيطة. حين تكثر الاستفسارات ويشارك المزيد من الأشخاص، قد يحتاج النشاط إلى طريقة أوضح لتتبع النشاط ومسؤولية المتابعة وتقدّم العميل المحتمل.",
      columns: ["الحاجة", "جدول بيانات", "Bizuply CRM"],
      rows: [
        ["معلومات الاتصال", "تنظيم يدوي", "سجلات عملاء منظمة"],
        ["مراحل العميل المحتمل", "تُحافَظ يدويًا", "حالات مخصصة للعميل المحتمل"],
        ["تتبع المتابعة", "يتطلب عمليات يدوية", "مهام مرتبطة بالعميل"],
        ["سجل التفاعلات", "يجب توثيقه يدويًا", "خط زمني للنشاط"],
        ["نماذج عملاء محتملين متصلة", "يتطلب إعدادًا إضافيًا", "تكاملات مدعومة للعملاء المحتملين"],
      ],
    },
    pricing: {
      ...en.pricing,
      h2: "تسعير CRM واضح لنشاطكم",
      crmName: "CRM فقط",
      crmDescription: "إدارة العملاء والعملاء المحتملين للأنشطة التي تريد مساحة CRM مخصصة.",
      crmFeatures: ["قائمة العملاء المحتملين والحالات الست", "ملفات العملاء والملاحظات وسجل النشاط", "مهام متابعة بتاريخ ووقت", "حقول مخصصة في سجل العميل"],
      crmExcludes: "المواعيد والحجز عبر الإنترنت والأتمتة والتعاون وWhatsApp واتصالات Meta أو Google Ads غير مشمولة في CRM فقط.",
      crmCta: "اختيار CRM",
      businessDescription: "منصة أعمال أوسع تجمع CRM مع أدوات إضافية لإدارة التشغيل ومسارات العملاء.",
      businessFeatures: ["كل ما في CRM فقط", "المواعيد وحجز العميل", "الأتمتة", "التعاون ومساعد الذكاء الاصطناعي", "WhatsApp بعد ربط الحساب", "أدوات حملات Meta بعد ربط الحساب المخوّل"],
      businessCta: "خطة Business",
      priceSentence: "CRM فقط بـ 49 دولارًا في الشهر. خطة Business بـ 99 دولارًا في الشهر أو 990 دولارًا في السنة.",
    },
    faq: {
      h2: "أسئلة شائعة عن برنامج CRM",
      items: [
        ["ماذا يعني CRM؟", "CRM هو Customer Relationship Management، أي إدارة علاقات العملاء. يصف المصطلح العمليات والبرنامج الذي تستخدمه الأنشطة لتنظيم معلومات العملاء وإدارة التفاعلات وبناء العلاقة مع الوقت."],
        ["فيما يُستخدم برنامج CRM؟", "يساعد على حفظ بيانات الاتصال وتتبع العملاء المحتملين وتوثيق النشاط وتخطيط المتابعة وتنظيم مسارات البيع أو الخدمة."],
        ["من يحتاج إلى نظام CRM؟", "يفيد النشاط الذي يدير أحاديث متكررة مع العملاء، أو يتلقى عدة استفسارات، أو يحتاج إلى طريقة منظمة للمتابعة مع المهتمين والعملاء الحاليين."],
        ["كيف يختلف Bizuply CRM عن جدول البيانات؟", "يقدّم Bizuply مراحل للعميل المحتمل وملفات وسجل نشاط ومهام وتكاملات مدعومة. يمكن أن يقلل ذلك من التنظيم اليدوي المطلوب لإدارة العلاقات."],
        ["هل يجمع Bizuply عملاء محتملين من Facebook وInstagram؟", "يدعم Bizuply جمع العملاء المحتملين من تكاملات Meta Lead Ads المؤهلة بعد أن يربط النشاط حسابه المخوّل ويمنح الأذونات المطلوبة."],
        ["هل تدخل عملاء Google Ads المحتملون إلى CRM؟", "يمكن لتكاملات نماذج Google Ads المدعومة أن تدخل الاستفسارات إلى Bizuply CRM. يعتمد التوفر على الحساب المتصل وإعداد التكامل."],
        ["هل تنشئ نماذج الموقع عملاء محتملين؟", "يمكن للنماذج المدعومة في مواقع Bizuply أن ترسل الاستفسارات إلى مسارات CRM المتصلة، وتُبقي فرص الموقع منظمة مع بقية العملاء المحتملين."],
        ["ما المعلومات التي يمكن حفظها في ملف العميل؟", "يمكن أن يشمل الملف بيانات الاتصال والحالة والملاحظات وسجلات النشاط والمهام والمواعيد والمستندات والحقول المخصصة حين تكون هذه القدرات مفعّلة."],
        ["هل يمكن تعيين مهام متابعة؟", "يدعم Bizuply CRM مهام متابعة مرتبطة بالعميل مع تاريخ ووقت، لمساعدة الفريق على تنظيم الخطوة التالية."],
        ["هل يمكن تتبع تغيّر الحالة؟", "نعم. يستخدم Bizuply حالات منظمة للعميل المحتمل، وتُسجَّل التغييرات المدعومة في سجل النشاط."],
        ["هل يشمل Bizuply CRM جدولة المواعيد؟", "يقدّم Bizuply قدرات جدولة متصلة. يعتمد شمول الجدولة على الخطة والإعداد. الجدولة مشمولة في خطة Business وليست في CRM فقط."],
        ["هل يناسب Bizuply الأنشطة الصغيرة؟", "نعم. صُمم Bizuply CRM لمساعدة الأنشطة على إبقاء العملاء المحتملين وسجلات العملاء والمتابعة منظمة مع تطوّر العمل."],
        ["كم يكلف Bizuply CRM؟", "خطة CRM فقط بـ 49 دولارًا في الشهر. تتوفر أيضًا خطة Business أوسع بـ 99 دولارًا في الشهر أو 990 دولارًا في السنة، مع قدرات إضافية حسب الخطة."],
        ["هل يمكن استخدام CRM من دون خطة Business الكاملة؟", "نعم. يمكن اختيار خطة CRM فقط عند الحاجة إلى إدارة العملاء والعملاء المحتملين من دون شراء الحزمة الأوسع."],
        ["ما الفرق بين CRM وأتمتة التسويق؟", "يركّز CRM على تنظيم المعلومات والتفاعلات والفرص. تركّز أتمتة التسويق على تشغيل إجراءات أو رسائل وفق شروط مضبوطة. يمكن أن يكمّل أحدهما الآخر حين تتصل الأدوات المناسبة."],
      ],
    },
    final: {
      h2: "وضوح في كل علاقة مع العميل",
      p: "امنحوا نشاطكم مكانًا منظمًا واحدًا لإدارة العملاء المحتملين وفهم تاريخ العميل والتخطيط للحديث التالي.",
      primary: "ابدأوا مع Bizuply CRM",
      secondary: "استكشفوا المنصة",
    },
    chrome: { navAria: "التنقل الرئيسي", about: "حول", website: "الموقع", automations: "الأتمتة", appointments: "المواعيد", pricing: "الأسعار", login: "دخول", cta: "ابدأوا", langCode: "AR" },
  },
);

export const CRM_COPY = { en, he, es, "pt-BR": ptBR, ar };

export function getCrmCopy(language) {
  const raw = String(language || "en");
  if (raw === "pt" || raw.toLowerCase() === "pt-br") return ptBR;
  return CRM_COPY[raw] || en;
}

export function crmFaqPairs(language) {
  return getCrmCopy(language).faq.items;
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderCrmPrerender(language) {
  const c = getCrmCopy(language);
  const blocks = [
    `<h1>${esc(c.hero.h1)}</h1>`,
    `<p>${esc(c.hero.description)}</p>`,
    `<h2>${esc(c.what.h2)}</h2>`,
    `<p>${esc(c.what.p1)}</p>`,
    `<p>${esc(c.what.p2)}</p>`,
    `<h3>${esc(c.what.h3)}</h3>`,
    `<p>${esc(c.what.p3)}</p>`,
    `<h2>${esc(c.pipeline.h2)}</h2>`,
    `<p>${esc(c.pipeline.p)}</p>`,
    `<p>${esc(c.pipeline.journey)}</p>`,
    `<h2>${esc(c.sources.h2)}</h2>`,
    `<p>${esc(c.sources.p)}</p>`,
    `<p>${esc(c.sources.note)}</p>`,
    `<h2>${esc(c.profile.h2)}</h2>`,
    `<p>${esc(c.profile.p)}</p>`,
    `<p>${esc(c.profile.closing)}</p>`,
    `<h2>${esc(c.tasks.h2)}</h2>`,
    `<p>${esc(c.tasks.p)}</p>`,
    `<h2>${esc(c.appointments.h2)}</h2>`,
    `<p>${esc(c.appointments.p)}</p>`,
    `<p>${esc(c.appointments.planNote)}</p>`,
    `<h2>${esc(c.dashboard.h2)}</h2>`,
    `<p>${esc(c.dashboard.p)}</p>`,
    `<h2>${esc(c.audiences.h2)}</h2>`,
    `<h2>${esc(c.sheet.h2)}</h2>`,
    `<p>${esc(c.sheet.p)}</p>`,
    `<h2>${esc(c.pricing.h2)}</h2>`,
    `<p>${esc(c.pricing.priceSentence)}</p>`,
    `<h2>${esc(c.faq.h2)}</h2>`,
    ...c.faq.items.map((item) => `<h3>${esc(item[0])}</h3><p>${esc(item[1])}</p>`),
    `<h2>${esc(c.final.h2)}</h2>`,
    `<p>${esc(c.final.p)}</p>`,
  ];
  return `<main lang="${esc(c.lang)}" dir="${c.dir}">${blocks.join("")}</main>`;
}

export function buildCrmHeaderPaint(language) {
  const c = getCrmCopy(language);
  const href = (path) => esc(marketingPublicUrl(path, c.lang).replace("https://bizuply.com", "") || "/");
  const links = [
    [c.chrome.about, "/about"],
    [c.chrome.website, "/website-builder"],
    [c.chrome.crm, "/crm"],
    [c.chrome.automations, "/automations"],
    [c.chrome.appointments, "/appointments"],
    [c.chrome.pricing, "/pricing"],
  ].map(([label, path]) => `<a class="crm-paint__link" href="${href(path)}">${esc(label)}</a>`).join("");
  return `<div class="crm-paint" lang="${esc(c.lang)}" dir="${c.dir}"><style>
.crm-paint{background:#fff;color:#0b1b33}
.crm-paint__header{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.96);border-bottom:1px solid #e2e8f0}
.crm-paint__bar{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;max-width:1180px;height:4.5rem;margin-inline:auto;padding-inline:clamp(.85rem,2.5vw,1.5rem);box-sizing:border-box}
.crm-paint__logo{display:inline-flex;align-items:center;gap:.55rem;color:#0b1b33;font-weight:800;text-decoration:none}
.crm-paint__logo img{width:2.2rem;height:2.2rem}
.crm-paint__nav,.crm-paint__actions{display:none;align-items:center;gap:.35rem}
.crm-paint__link{color:#1e293b;font-weight:700;font-size:.9rem;text-decoration:none;padding:.35rem .5rem;white-space:nowrap}
.crm-paint__login{color:#0b1b33;font-weight:700;text-decoration:none}
.crm-paint__cta{background:#0b1b33;color:#fff;font-weight:800;text-decoration:none;border-radius:.7rem;padding:.55rem .9rem}
.crm-paint__mobile{display:inline-flex;align-items:center;gap:.7rem;color:#0b1b33;font-weight:800}
@media(min-width:1100px){.crm-paint__nav,.crm-paint__actions{display:flex}.crm-paint__mobile{display:none}}
</style><header class="crm-paint__header"><nav class="crm-paint__bar" aria-label="${esc(c.chrome.navAria)}"><a class="crm-paint__logo" href="${href("/")}"><img src="/android-chrome-192x192.png" width="36" height="36" alt="Bizuply" /><span>Bizuply</span></a><div class="crm-paint__nav">${links}</div><div class="crm-paint__actions"><span>${esc(c.chrome.langCode)}</span><a class="crm-paint__login" href="${href("/login")}">${esc(c.chrome.login)}</a><a class="crm-paint__cta" href="${href("/pricing")}">${esc(c.chrome.cta)}</a></div><div class="crm-paint__mobile"><span>${esc(c.chrome.langCode)}</span></div></nav></header></div>`;
}
