import type { SitePaymentCredentials, SitePaymentProviderKey } from "../../../../api/sitePaymentsApi";

export type PaymentCredentialFieldKey = keyof SitePaymentCredentials;

export type PaymentProviderField = {
  key: PaymentCredentialFieldKey;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  required?: boolean;
  keepOnEmptyHint?: string;
};

export type PaymentProviderCatalogItem = {
  key: SitePaymentProviderKey;
  name: string;
  subtitle?: string;
  description: string;
  accent: string;
  logoText: string;
  badges?: string[];
  supportsInstallments?: boolean;
  supportsRecurring?: boolean;
  /** When true, connect button shows בקרוב and credentials cannot be entered */
  comingSoon?: boolean;
  createAccountUrl?: string;
  contactUrl?: string;
  learnMoreUrl?: string;
  instructions: string[];
  fields: PaymentProviderField[];
};

export const SITE_PAYMENT_PROVIDERS: PaymentProviderCatalogItem[] = [
  {
    key: "stripe",
    name: "Stripe",
    description: "קבלו תשלומים בכרטיס אשראי דרך Stripe — סליקה בינלאומית מאובטחת.",
    accent: "#635BFF",
    logoText: "Stripe",
    badges: ["תומך בהוראות קבע", "בינלאומי"],
    supportsRecurring: true,
    createAccountUrl: "https://dashboard.stripe.com/register",
    contactUrl: "https://support.stripe.com/",
    learnMoreUrl: "https://stripe.com/docs/keys",
    instructions: [
      "היכנסו ל-Stripe Dashboard והעתיקו את Publishable key ואת Secret key.",
      "הזינו את המפתחות בטופס ולחצו חיבור.",
      "אופציונלי: הגדירו Webhook ב-Stripe לכתובת api.bizuply.com/api/store/stripe/webhook/{businessId} והדביקו את ה-Webhook secret.",
    ],
    fields: [
      {
        key: "publicKey",
        label: "Publishable key",
        placeholder: "pk_live_... או pk_test_...",
        required: true,
      },
      {
        key: "apiSecret",
        label: "Secret key",
        placeholder: "sk_live_... או sk_test_...",
        type: "password",
        required: true,
        keepOnEmptyHint: "השאירו ריק כדי לשמור על המפתח הקיים",
      },
      {
        key: "webhookSecret",
        label: "Webhook secret (אופציונלי)",
        placeholder: "whsec_...",
        type: "password",
        keepOnEmptyHint: "השאירו ריק כדי לשמור על הסוד הקיים",
      },
    ],
  },
  {
    key: "hyp",
    name: "Max by Hyp",
    description: "קבלו תשלומים בכרטיס אשראי או חיוב דרך Max by Hyp (Hyp Pay).",
    accent: "#111827",
    logoText: "MAX",
    badges: ["תומך בתשלומים", "תומך בהוראות קבע"],
    supportsInstallments: true,
    supportsRecurring: true,
    createAccountUrl: "https://lp.hyp.co.il/api/",
    contactUrl: "https://pay.hyp.co.il/",
    learnMoreUrl: "https://developers.hyp.co.il/pay/",
    instructions: [
      "הזינו Masof (מספר מסוף), API Key ו-PassP מחשבון Hyp Pay (הגדרות → דף תשלום ו-API).",
      "PassP נדרש לפי התיעוד הרשמי של Hyp Pay ל-APISign.",
      "אישור תשלום מתבצע רק אחרי VERIFY מול pay.hyp.co.il — לא מדף ההצלחה בדפדפן.",
      "הגדירו בפורטל Hyp כתובת הצלחה ו-Webhook לכתובת api שלכם: /api/store/payments/hyp/webhook/{businessId}.",
      "ודאו שמטבע האתר תואם למטבע בחשבון Max (מומלץ ₪).",
    ],
    fields: [
      {
        key: "terminalNumber",
        label: "Masof (מספר מסוף)",
        placeholder: "לדוגמה 0010345518",
        required: true,
      },
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "מפתח API (KEY)",
        required: true,
      },
      {
        key: "apiSecret",
        label: "PassP (סיסמת API)",
        placeholder: "סיסמת API מפורטל Hyp",
        type: "password",
        required: true,
        keepOnEmptyHint: "השאירו ריק כדי לשמור על הסיסמה הקיימת",
      },
    ],
  },
  {
    key: "paypal",
    name: "PayPal",
    description: "קבלו תשלומים דרך PayPal.",
    accent: "#0070BA",
    logoText: "PayPal",
    createAccountUrl: "https://www.paypal.com/il/business",
    contactUrl: "https://www.paypal.com/il/smarthelp/contact-us",
    instructions: [
      "הזינו את כתובת האימייל של חשבון PayPal העסקי.",
      "לחצו חיבור. בהמשך ניתן יהיה להשלים הפניה ל-PayPal.",
      "ודאו שמטבע האתר תואם למטבע בחשבון PayPal.",
    ],
    fields: [
      {
        key: "accountId",
        label: "כתובת אימייל",
        placeholder: "business@example.com",
        type: "email",
        required: true,
      },
    ],
  },
  {
    key: "payme",
    name: "bit",
    subtitle: "ספק תשלום: Isracard powered by PayMe",
    description: "קבלו תשלומים בכרטיס ובאפליקציית bit דרך PayMe.",
    accent: "#E10600",
    logoText: "bit",
    supportsInstallments: true,
    createAccountUrl: "https://payme.page/",
    contactUrl: "https://payme.page/",
    learnMoreUrl: "https://docs.payme.io/",
    instructions: [
      "הזינו את seller_payme_id (מפתח פרטי) מחשבון PayMe.",
      "אופציונלי: אימייל החשבון לזיהוי.",
      "לאחר חיבור, הזמנות יוצרות generate-sale; אישור תשלום מגיע ב-Callback + אימות get-sales — לא מדף ההצלחה.",
      "Sandbox: https://sandbox.payme.io · Live: https://live.payme.io",
    ],
    fields: [
      {
        key: "apiKey",
        label: "seller_payme_id (API Key)",
        placeholder: "מפתח פרטי PayMe",
        required: true,
      },
      {
        key: "accountId",
        label: "אימייל (אופציונלי)",
        placeholder: "merchant@example.com",
        type: "email",
      },
    ],
  },
  {
    key: "grow",
    name: "Grow by Meshulam",
    description: "קבלו תשלומים דרך Grow (משולם).",
    accent: "#2563EB",
    logoText: "grow",
    supportsInstallments: true,
    createAccountUrl: "https://grow.meshulam.co.il/",
    contactUrl: "https://grow.meshulam.co.il/",
    learnMoreUrl: "https://grow-il.readme.io/",
    instructions: [
      "הזינו userId (עסק מורשה) ו-pageCode מחשבון Grow.",
      "לאחר חיבור, הזמנות יוצרות createPaymentProcess; אישור מגיע ב-notifyUrl + אימות getPaymentProcessInfo.",
      "דף ההצלחה בדפדפן אינו מאשר תשלום.",
    ],
    fields: [
      {
        key: "merchantId",
        label: "userId (עסק מורשה)",
        placeholder: "מזהה עסק Grow",
        required: true,
      },
      {
        key: "pageCode",
        label: "pageCode",
        placeholder: "קוד דף תשלום",
        required: true,
      },
    ],
  },
  {
    key: "payplus",
    name: "PayPlus",
    description: "קבלו תשלומים בכרטיס אשראי דרך PayPlus.",
    accent: "#0F766E",
    logoText: "Pay+",
    supportsInstallments: true,
    createAccountUrl: "https://www.payplus.co.il/",
    contactUrl: "https://www.payplus.co.il/",
    learnMoreUrl: "https://docs.payplus.co.il/",
    instructions: [
      "הזינו api-key, secret-key ו-Payment Page UID.",
      "אישור תשלום מגיע ב-refURL_callback עם אימות HMAC + ipn-full — לא מדף ההצלחה.",
      "Sandbox: restapidev.payplus.co.il · Live: restapi.payplus.co.il",
    ],
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "api-key",
        required: true,
      },
      {
        key: "apiSecret",
        label: "Secret Key",
        placeholder: "secret-key",
        type: "password",
        required: true,
        keepOnEmptyHint: "השאירו ריק כדי לשמור על המפתח הקיים",
      },
      {
        key: "pageCode",
        label: "Payment Page UID",
        placeholder: "מזהה דף תשלום",
        required: true,
      },
    ],
  },
  {
    key: "tranzila",
    name: "Tranzila",
    description: "קבלו תשלומים בכרטיס אשראי דרך Tranzila.",
    accent: "#1D4ED8",
    logoText: "TZ",
    supportsInstallments: true,
    createAccountUrl: "https://www.tranzila.com/",
    contactUrl: "https://www.tranzila.com/",
    learnMoreUrl: "https://docs.tranzila.com/",
    instructions: [
      "הזינו את שם הטרמינל (terminal) מחשבון Tranzila.",
      "אופציונלי: אימייל לזיהוי.",
      "אישור תשלום מגיע ב-notify_url עם Response=000 — לא מדף ההצלחה.",
    ],
    fields: [
      {
        key: "terminalNumber",
        label: "Terminal",
        placeholder: "שם טרמינל",
        required: true,
      },
      {
        key: "accountId",
        label: "אימייל (אופציונלי)",
        placeholder: "merchant@example.com",
        type: "email",
      },
    ],
  },
  {
    key: "cal",
    name: "Cal",
    description: "קבלו תשלומים בכרטיס אשראי דרך Cal.",
    accent: "#DC2626",
    logoText: "Cal",
    supportsInstallments: true,
    comingSoon: true,
    createAccountUrl: "https://www.cal-online.co.il/",
    contactUrl: "https://www.cal-online.co.il/",
    instructions: [
      "חיבור Cal יושלם בקרוב — אין כרגע תיעוד API מסחרי ברור התואם לשדות במערכת.",
      "לא ניתן להזין Credentials עד שהחיבור יהיה פעיל.",
    ],
    fields: [],
  },
];

export function getPaymentProviderCatalogItem(key: string) {
  return SITE_PAYMENT_PROVIDERS.find((item) => item.key === key) || null;
}

export function isProviderConnected(status?: string, isEnabled?: boolean) {
  return status === "connected" && isEnabled !== false;
}
