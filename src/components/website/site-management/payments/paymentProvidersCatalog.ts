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
      "אופציונלי: הגדירו Webhook ב-Stripe לכתובת {API_BASE}/store/stripe/webhook/{businessId} והדביקו את ה-Webhook secret.",
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
    description: "קבלו תשלומים בכרטיס אשראי או חיוב דרך Max.",
    accent: "#111827",
    logoText: "MAX",
    badges: ["תומך בתשלומים", "תומך בהוראות קבע"],
    supportsInstallments: true,
    supportsRecurring: true,
    createAccountUrl: "https://www.max.co.il/",
    contactUrl: "https://www.max.co.il/",
    instructions: [
      "הזינו את מספר המסוף (Masof) ואת מפתח ה-API מחשבון Max by Hyp.",
      "לחצו חיבור כדי לשמור את הפרטים באתר.",
      "ודאו שמטבע האתר תואם למטבע בחשבון Max (מומלץ ₪).",
    ],
    fields: [
      {
        key: "terminalNumber",
        label: "Masof (מזהה מסוף)",
        placeholder: "לדוגמה 123456",
        required: true,
      },
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "מפתח API",
        required: true,
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
    description: "קבלו תשלומים בכרטיס ובאפליקציית bit.",
    accent: "#E10600",
    logoText: "bit",
    supportsInstallments: true,
    createAccountUrl: "https://payme.page/",
    contactUrl: "https://payme.page/",
    instructions: [
      "הזינו את מפתח ה-API ואת האימייל מחשבון PayMe.",
      "לחצו חיבור כדי לקשר את חשבון bit לאתר.",
      "ודאו שמטבע האתר תואם למטבע בחשבון PayMe (מומלץ ₪).",
    ],
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "מפתח API",
        required: true,
      },
      {
        key: "accountId",
        label: "אימייל",
        placeholder: "merchant@example.com",
        type: "email",
        required: true,
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
    instructions: [
      "הזינו את פרטי העסק המורשה ואת הסיסמה מחשבון Grow.",
      "לחצו חיבור כדי לקשר את החשבון לאתר.",
      "ודאו שמטבע האתר תואם למטבע בחשבון Grow (מומלץ ₪).",
    ],
    fields: [
      {
        key: "merchantId",
        label: "עסק מורשה",
        placeholder: "מזהה עסק / Licensed business",
        required: true,
      },
      {
        key: "apiSecret",
        label: "סיסמה",
        type: "password",
        required: true,
        keepOnEmptyHint: "השאירו ריק כדי לשמור על הסיסמה הקיימת",
      },
      {
        key: "pageCode",
        label: "מספר תשלומים מקסימלי (אופציונלי)",
        placeholder: "לדוגמה 12",
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
    instructions: [
      "הזינו את מפתח ה-API ואת מזהה דף התשלום (Payment Page UID).",
      "לחצו חיבור כדי לקשר את חשבון PayPlus לאתר.",
      "ודאו שמטבע האתר תואם למטבע בחשבון PayPlus (מומלץ ₪).",
    ],
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "מפתח API",
        required: true,
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
    instructions: [
      "הזינו את מספר הטרמינל ואת האימייל הרשום בחשבון Tranzila.",
      "לחצו חיבור כדי לקשר את החשבון לאתר.",
      "ודאו שמטבע האתר תואם למטבע בחשבון Tranzila (מומלץ ₪).",
    ],
    fields: [
      {
        key: "terminalNumber",
        label: "Terminal",
        placeholder: "מספר טרמינל",
        required: true,
      },
      {
        key: "accountId",
        label: "אימייל רשום",
        placeholder: "merchant@example.com",
        type: "email",
        required: true,
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
    createAccountUrl: "https://www.cal-online.co.il/",
    contactUrl: "https://www.cal-online.co.il/",
    instructions: [
      "הזינו את מפתח ה-API ואת האימייל מחשבון Cal.",
      "לחצו חיבור כדי לקשר את החשבון לאתר.",
      "ודאו שמטבע האתר תואם למטבע בחשבון Cal (מומלץ ₪).",
    ],
    fields: [
      {
        key: "apiKey",
        label: "API Key",
        placeholder: "מפתח API",
        required: true,
      },
      {
        key: "accountId",
        label: "אימייל",
        placeholder: "merchant@example.com",
        type: "email",
        required: true,
      },
    ],
  },
];

export function getPaymentProviderCatalogItem(key: string) {
  return SITE_PAYMENT_PROVIDERS.find((item) => item.key === key) || null;
}

export function isProviderConnected(status?: string, isEnabled?: boolean) {
  return status === "connected" && isEnabled !== false;
}
