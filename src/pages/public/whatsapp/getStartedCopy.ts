import { PRICE_PER_NUMBER_USD as PRICE } from "./siteConfig";

/** Copy for /get-started and its signup form. Languages without an entry use English. */
export type Actor = "you" | "meta" | "bizuply";
export type StageCopy = { title: string; text: string; actors: Actor[]; meta?: boolean };

export type GetStartedCopy = {
  hero: { eyebrow: string; title: string; lead: string; login: string; start: string; request: string };
  stagesTitle: string;
  stagesLabel: string;
  step: (n: number) => string;
  actors: Record<Actor, string>;
  metaRequirement: string;
  accountStage: { selfServe: StageCopy; request: StageCopy };
  nextStages: StageCopy[];
  needsTitle: string;
  needs: string[];
  approval: { strong: string; text: string; link: string };
  migrate: { strong: string; before: string; after: string };
  statuses: { eyebrow: string; title: string; lead: string; status: string; meaning: string; rows: Array<[string, string]> };
  signup: {
    eyebrow: string;
    title: string;
    lead: string;
    methods: (providers: string[]) => string;
    pay: string;
    details: string;
    requestTitle: string;
    requestLead: string;
  };
  form: {
    title: string;
    sub: string;
    continue: string;
    openingCheckout: string;
    note: string;
    haveAccount: string;
    login: string;
    emailRequired: string;
    emailInvalid: string;
    passwordShort: string;
    emailTakenBefore: string;
    emailTakenLink: string;
    emailTakenAfter: string;
    rateLimited: string;
    checkoutFailed: (supportEmail: string) => string;
  };
};

const EN: GetStartedCopy = {
  hero: {
    eyebrow: "Connect WhatsApp",
    title: "Connect your WhatsApp number.",
    lead: "Numbers are connected through Meta's Embedded Signup inside the WhatsApp API portal. Here's what happens at each step, who acts, and which Meta checks can apply.",
    login: "Log in",
    start: `Get started for $${PRICE}`,
    request: "Request access",
  },
  stagesTitle: "Onboarding, step by step",
  stagesLabel: "Onboarding stages",
  step: (n) => `Step ${n}: `,
  actors: { you: "You", meta: "Meta", bizuply: "Bizuply" },
  metaRequirement: "Meta requirement",
  accountStage: {
    selfServe: {
      title: "Create your WhatsApp API account",
      text: `Create your account and activate your $${PRICE}/month WhatsApp API subscription.`,
      actors: ["you"],
    },
    request: {
      title: "Request your WhatsApp API account",
      text: `Send the request form below. We reply by email with access to your WhatsApp API account and its $${PRICE}/month subscription.`,
      actors: ["you", "bizuply"],
    },
  },
  nextStages: [
    {
      title: "Connect Meta",
      text: "In the WhatsApp API portal, open WhatsApp → Connection and start Meta's Embedded Signup. Sign in with your Facebook account and choose, or create, the Meta Business account and WhatsApp Business Account.",
      actors: ["you", "meta"],
      meta: true,
    },
    {
      title: "Add and verify your WhatsApp number",
      text: "Enter the number and confirm you own it with a one-time code sent by SMS or voice call. Set the display name customers will see.",
      actors: ["you", "meta"],
      meta: true,
    },
    {
      title: "Complete Meta review and registration",
      text: "Meta registers the number on the Cloud API and reviews the display name, and may ask for business verification. Add a payment method in Meta for messaging charges. Until review is done, messaging volume can be limited.",
      actors: ["you", "meta"],
      meta: true,
    },
    {
      title: "Generate your API key and configure webhooks",
      text: "In the portal, open WhatsApp → API / Developers to create an API key and set the webhook URL that receives incoming messages and delivery statuses.",
      actors: ["you"],
    },
    {
      title: "Send your first message",
      text: "Submit a message template for Meta's review, then send your first message through the API. Conversations you start outside the 24-hour customer service window need an approved template.",
      actors: ["you", "meta"],
    },
  ],
  needsTitle: "What you'll need",
  needs: [
    "A Facebook account with admin access to your company's Meta Business account, or permission to create one",
    "A phone number that can receive an SMS or voice call",
    "A display name that matches your business and follows Meta's display name guidelines",
    "A payment method you can add in Meta for messaging charges",
  ],
  approval: {
    strong: "Approval isn't instant or guaranteed.",
    text: "Meta decides on display names, business verification and messaging limits, and can take longer for some businesses or categories. Bizuply doesn't add its own approval queue, and it can't skip Meta's requirements.",
    link: "About Meta business verification",
  },
  migrate: {
    strong: "Using the number in the WhatsApp app today?",
    before:
      "Depending on what Meta supports for that number, you may need to migrate it or remove it from the app before it can be registered on the Cloud API. Email",
    after: "before you connect and we'll check it with you first.",
  },
  statuses: {
    eyebrow: "After you connect",
    title: "Statuses you'll see in the portal.",
    lead: "WhatsApp → Connection in the portal shows Meta's live status for your account and number, with a message explaining what to do whenever action is needed.",
    status: "Status",
    meaning: "What it tells you",
    rows: [
      ["Connection", "Whether the WhatsApp Business Account and number are linked to your WhatsApp API account and ready to send."],
      ["Phone number registration", "Whether the number is registered on the WhatsApp Cloud API."],
      ["Code verification", "Whether ownership of the number was confirmed with the one-time code."],
      ["Display name", "Meta's review status for the name shown to customers."],
      ["Business verification", "Whether Meta has verified the business, when it's required."],
      ["Quality rating", "Meta's rating of recent message quality, based on customer feedback."],
      ["Messaging limit", "How many unique customers you can start conversations with in 24 hours. Meta raises this over time."],
      ["Payment method", "Whether Meta has a valid payment method for messaging charges."],
    ],
  },
  signup: {
    eyebrow: "Get started",
    title: "Up and running in minutes.",
    lead: `$${PRICE}/month per WhatsApp number. Meta messaging charges are billed separately by Meta.`,
    methods: (names) => {
      if (!names.length) return "Sign up with your email and a password.";
      const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}` : names[0];
      return `Sign up with ${list}, or with your email and a password.`;
    },
    pay: "Pay securely with Lemon Squeezy. Your WhatsApp API portal opens right away.",
    details: "Add your business details and connect your number inside the portal.",
    requestTitle: "Request onboarding.",
    requestLead: `$${PRICE}/month per WhatsApp number. Meta messaging charges are additional. Send us your details and we'll reply by email with access and the next steps.`,
  },
  form: {
    title: "Create your WhatsApp API account",
    sub: `$${PRICE}/month per WhatsApp number. Cancel anytime.`,
    continue: "Continue",
    openingCheckout: "Opening checkout…",
    note: `Next: secure $${PRICE}/month checkout with Lemon Squeezy.`,
    haveAccount: "Already have an account?",
    login: "Log in",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    passwordShort: "Use at least 8 characters.",
    emailTakenBefore: "This email already has an account.",
    emailTakenLink: "Log in",
    emailTakenAfter: "to continue.",
    rateLimited: "Too many attempts. Try again in a few minutes.",
    checkoutFailed: (support) => `We couldn't open checkout right now. Please try again or email ${support}.`,
  },
};

// U+200E keeps "$29" reading left-to-right inside Hebrew sentences.
const P = `\u200E$${PRICE}`;

const HE: GetStartedCopy = {
  hero: {
    eyebrow: "חיבור WhatsApp",
    title: "חברו את מספר ה-WhatsApp שלכם.",
    lead: "מספרים מחוברים דרך Embedded Signup של Meta, מתוך פורטל ה-WhatsApp API. כך נראה כל שלב: מי פועל בו, ואילו בדיקות של Meta עשויות לחול.",
    login: "התחברות",
    start: `התחילו ב-${P}`,
    request: "בקשת גישה",
  },
  stagesTitle: "תהליך ההצטרפות, שלב אחר שלב",
  stagesLabel: "שלבי ההצטרפות",
  step: (n) => `שלב ${n}: `,
  actors: { you: "אתם", meta: "Meta", bizuply: "Bizuply" },
  metaRequirement: "דרישה של Meta",
  accountStage: {
    selfServe: {
      title: "יצירת חשבון WhatsApp API",
      text: `צרו חשבון והפעילו את מנוי ה-WhatsApp API בעלות ${P} לחודש.`,
      actors: ["you"],
    },
    request: {
      title: "בקשת חשבון WhatsApp API",
      text: `שלחו את טופס הבקשה שלמטה. נחזור אליכם במייל עם גישה לחשבון ה-WhatsApp API ולמנוי בעלות ${P} לחודש.`,
      actors: ["you", "bizuply"],
    },
  },
  nextStages: [
    {
      title: "חיבור Meta",
      text: "בפורטל ה-WhatsApp API, פתחו את WhatsApp ← חיבור והתחילו את Embedded Signup של Meta. התחברו עם חשבון הפייסבוק שלכם ובחרו, או צרו, חשבון Meta Business וחשבון WhatsApp Business.",
      actors: ["you", "meta"],
      meta: true,
    },
    {
      title: "הוספה ואימות של מספר ה-WhatsApp",
      text: "הזינו את המספר ואשרו שהוא שלכם באמצעות קוד חד-פעמי שנשלח ב-SMS או בשיחה קולית. הגדירו את שם התצוגה שהלקוחות יראו.",
      actors: ["you", "meta"],
      meta: true,
    },
    {
      title: "השלמת הבדיקה והרישום ב-Meta",
      text: "Meta רושמת את המספר ב-Cloud API, בודקת את שם התצוגה, ועשויה לבקש אימות עסק. הוסיפו אמצעי תשלום ב-Meta עבור עלויות ההודעות. עד לסיום הבדיקה, נפח ההודעות עשוי להיות מוגבל.",
      actors: ["you", "meta"],
      meta: true,
    },
    {
      title: "יצירת מפתח API והגדרת Webhooks",
      text: "בפורטל, פתחו את WhatsApp ← API / מפתחים כדי ליצור מפתח API ולהגדיר את כתובת ה-Webhook שמקבלת הודעות נכנסות וסטטוסי מסירה.",
      actors: ["you"],
    },
    {
      title: "שליחת ההודעה הראשונה",
      text: "שלחו תבנית הודעה לבדיקה של Meta, ואז שלחו את ההודעה הראשונה דרך ה-API. שיחות שאתם פותחים מחוץ לחלון השירות של 24 שעות דורשות תבנית מאושרת.",
      actors: ["you", "meta"],
    },
  ],
  needsTitle: "מה תצטרכו",
  needs: [
    "חשבון פייסבוק עם הרשאת ניהול לחשבון Meta Business של החברה, או הרשאה ליצור חשבון כזה",
    "מספר טלפון שיכול לקבל SMS או שיחה קולית",
    "שם תצוגה שתואם לעסק ועומד בהנחיות שמות התצוגה של Meta",
    "אמצעי תשלום שתוכלו להוסיף ב-Meta עבור עלויות ההודעות",
  ],
  approval: {
    strong: "האישור אינו מיידי או מובטח.",
    text: "Meta מחליטה על שמות תצוגה, אימות עסקים ומגבלות הודעות, והתהליך עשוי להימשך זמן רב יותר לחלק מהעסקים או מהקטגוריות. ל-Bizuply אין תור אישורים משלה, והיא לא יכולה לעקוף את הדרישות של Meta.",
    link: "על אימות עסקים ב-Meta",
  },
  migrate: {
    strong: "משתמשים היום במספר באפליקציית WhatsApp?",
    before:
      "בהתאם למה ש-Meta תומכת בו עבור המספר, ייתכן שתצטרכו להעביר אותו או להסיר אותו מהאפליקציה לפני שאפשר לרשום אותו ב-Cloud API. כתבו אל",
    after: "לפני החיבור, ונבדוק את זה איתכם קודם.",
  },
  statuses: {
    eyebrow: "אחרי החיבור",
    title: "הסטטוסים שתראו בפורטל.",
    lead: "המסך WhatsApp ← חיבור בפורטל מציג את הסטטוס העדכני מ-Meta עבור החשבון והמספר, עם הסבר מה לעשות בכל פעם שנדרשת פעולה.",
    status: "סטטוס",
    meaning: "מה הוא אומר",
    rows: [
      ["חיבור", "האם חשבון WhatsApp Business והמספר מקושרים לחשבון ה-WhatsApp API שלכם ומוכנים לשליחה."],
      ["רישום מספר הטלפון", "האם המספר רשום ב-WhatsApp Cloud API."],
      ["אימות קוד", "האם הבעלות על המספר אושרה באמצעות הקוד החד-פעמי."],
      ["שם תצוגה", "סטטוס הבדיקה של Meta עבור השם שמוצג ללקוחות."],
      ["אימות עסק", "האם Meta אימתה את העסק, כשהדבר נדרש."],
      ["דירוג איכות", "הדירוג של Meta לאיכות ההודעות האחרונות, על סמך משוב מלקוחות."],
      ["מגבלת הודעות", "עם כמה לקוחות ייחודיים אפשר לפתוח שיחה ב-24 שעות. Meta מעלה את המגבלה עם הזמן."],
      ["אמצעי תשלום", "האם ל-Meta יש אמצעי תשלום תקף עבור עלויות ההודעות."],
    ],
  },
  signup: {
    eyebrow: "התחילו עכשיו",
    title: "מתחילים לעבוד תוך דקות.",
    lead: `${P} לחודש לכל מספר WhatsApp. עלויות ההודעות של Meta מחויבות בנפרד על ידי Meta.`,
    methods: (names) => {
      if (!names.length) return "הירשמו עם אימייל וסיסמה.";
      const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} או ${names[names.length - 1]}` : names[0];
      return `הירשמו עם ${list}, או עם אימייל וסיסמה.`;
    },
    pay: "תשלום מאובטח דרך Lemon Squeezy. פורטל ה-WhatsApp API נפתח מיד.",
    details: "הוסיפו את פרטי העסק וחברו את המספר מתוך הפורטל.",
    requestTitle: "בקשת הצטרפות.",
    requestLead: `${P} לחודש לכל מספר WhatsApp. עלויות ההודעות של Meta בנוסף. שלחו לנו את הפרטים ונחזור אליכם במייל עם גישה והשלבים הבאים.`,
  },
  form: {
    title: "יצירת חשבון WhatsApp API",
    sub: `${P} לחודש לכל מספר WhatsApp. אפשר לבטל בכל עת.`,
    continue: "המשך",
    openingCheckout: "פותחים את התשלום…",
    note: `השלב הבא: תשלום מאובטח של ${P} לחודש דרך Lemon Squeezy.`,
    haveAccount: "כבר יש לכם חשבון?",
    login: "התחברות",
    emailRequired: "הזינו כתובת אימייל.",
    emailInvalid: "הזינו כתובת אימייל תקינה.",
    passwordShort: "השתמשו בלפחות 8 תווים.",
    emailTakenBefore: "לאימייל הזה כבר יש חשבון.",
    emailTakenLink: "התחברו",
    emailTakenAfter: "כדי להמשיך.",
    rateLimited: "יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.",
    checkoutFailed: (support) => `לא הצלחנו לפתוח את התשלום כרגע. נסו שוב או כתבו אל ${support}.`,
  },
};

const COPY: Record<string, GetStartedCopy> = { en: EN, he: HE };

export function getStartedCopy(lang: string): GetStartedCopy {
  return COPY[lang] || EN;
}
