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
    description: "קבלו תשלומים בכרטיס אשראי או חיוב דרך Max (CardCom Low Profile).",
    accent: "#111827",
    logoText: "MAX",
    badges: ["תומך בתשלומים", "תומך בהוראות קבע"],
    supportsInstallments: true,
    supportsRecurring: true,
    createAccountUrl: "https://www.max.co.il/",
    contactUrl: "https://www.max.co.il/",
    learnMoreUrl: "https://cardcomapi.zendesk.com/",
    instructions: [
      "הזינו את מספר המסוף (Masof / TerminalNumber) ואת שם המשתמש ל-API (UserName).",
      "אופציונלי: סיסמת PassP אם נדרשת במסוף שלכם.",
      "לאחר חיבור, תשלומי חנות יוצרים דף Low Profile; אישור תשלום מגיע ב-Webhook (Indicator) — לא מדף ההצלחה בדפדפן.",
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
        label: "UserName / API Key",
        placeholder: "שם משתמש API",
        required: true,
      },
      {
        key: "apiSecret",
        label: "PassP (אופציונלי)",
        placeholder: "סיסמת API אם קיימת",
        type: "password",
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
    description: "קבלו תשלומים בכרטיס ובאפליקציית bit.",
    accent: "#E10600",
    logoText: "bit",
    supportsInstallments: true,
    comingSoon: true,
    createAccountUrl: "https://payme.page/",
    contactUrl: "https://payme.page/",
    instructions: [
      "חיבור bit / PayMe יושלם בקרוב.",
      "לא ניתן להזין Credentials עד שהחיבור יהיה פעיל.",
    ],
    fields: [],
  },
  {
    key: "grow",
    name: "Grow by Meshulam",
    description: "קבלו תשלומים דרך Grow (משולם).",
    accent: "#2563EB",
    logoText: "grow",
    supportsInstallments: true,
    comingSoon: true,
    createAccountUrl: "https://grow.meshulam.co.il/",
    contactUrl: "https://grow.meshulam.co.il/",
    instructions: [
      "חיבור Grow יושלם בקרוב.",
      "לא ניתן להזין Credentials עד שהחיבור יהיה פעיל.",
    ],
    fields: [],
  },
  {
    key: "payplus",
    name: "PayPlus",
    description: "קבלו תשלומים בכרטיס אשראי דרך PayPlus.",
    accent: "#0F766E",
    logoText: "Pay+",
    supportsInstallments: true,
    comingSoon: true,
    createAccountUrl: "https://www.payplus.co.il/",
    contactUrl: "https://www.payplus.co.il/",
    instructions: [
      "חיבור PayPlus יושלם בקרוב.",
      "לא ניתן להזין Credentials עד שהחיבור יהיה פעיל.",
    ],
    fields: [],
  },
  {
    key: "tranzila",
    name: "Tranzila",
    description: "קבלו תשלומים בכרטיס אשראי דרך Tranzila.",
    accent: "#1D4ED8",
    logoText: "TZ",
    supportsInstallments: true,
    comingSoon: true,
    createAccountUrl: "https://www.tranzila.com/",
    contactUrl: "https://www.tranzila.com/",
    instructions: [
      "חיבור Tranzila יושלם בקרוב.",
      "לא ניתן להזין Credentials עד שהחיבור יהיה פעיל.",
    ],
    fields: [],
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
