import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";

const REGISTER_PATH = "/partner/register?planKey=partner_international";

const COPY = {
  en: {
    title: "International Partner Program",
    lead: "Registration on this page is free and waits for admin approval. This page does not start a live charge. After approval the partner status is payment_due, and the $5,000 annual fee is collected outside Bizuply.",
    recurring: "Recurring commission follows the partner agreement: 30% for 1–19 active paying customers, 35% for 20–39, and 40% for 40 or more.",
    oneTime: "Eligible one-time deals on this track earn 10%. Existing partner tracks keep their current terms.",
    center: "Training and marketing materials stay in the existing Partner Center. They open only when the partner is active, the partnership agreement is active, and an admin has recorded the payment after the money arrived, including the amount, date, reference, and billing period. A $5,000 ledger entry alone does not open the center.",
    apply: "Apply for International Partner",
    login: "Partner sign in",
    fee: "$5,000 / year",
  },
  he: {
    title: "תוכנית שותפים בינלאומית",
    lead: "ההרשמה בעמוד הזה היא ללא תשלום וממתינה לאישור אדמין. העמוד לא מתחיל חיוב. אחרי האישור הסטטוס הוא payment_due, וגביית $5,000 לשנה מתבצעת מחוץ ל-Bizuply.",
    recurring: "עמלה חוזרת לפי ההסכם: 30% עבור 1–19 לקוחות משלמים פעילים, 35% עבור 20–39, ו-40% עבור 40 או יותר.",
    oneTime: "עסקאות חד-פעמיות זכאיות במסלול הזה מזכות ב-10%. המסלולים הקיימים נשארים עם התנאים הנוכחיים שלהם.",
    center: "ההכשרה וחומרי השיווק נשארים במרכז השותפים הקיים. הם נפתחים רק כשהשותף פעיל, הסכם השותפות פעיל, ואדמין תיעד את התשלום אחרי שהכסף התקבל, כולל סכום, תאריך, אסמכתה ותקופת חיוב. רישום של $5,000 ביומן לבדו לא פותח את המרכז.",
    apply: "הרשמה כשותף בינלאומי",
    login: "כניסת שותפים",
    fee: "$5,000 לשנה",
  },
} as const;

function copyFor(language: string) {
  return language.startsWith("he") ? COPY.he : COPY.en;
}

export default function PartnersRecruitment() {
  const { i18n } = useTranslation();
  const copy = copyFor(i18n.language || "en");
  const dir = getTextDirection(i18n.language);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12" dir={dir} data-testid="partners-recruitment">
      <Helmet>
        <title>International Partner Program | Bizuply</title>
        <meta
          name="description"
          content="Join the Bizuply International Partner program for $5,000 per year. Recurring commission is 30%, 35%, or 40% under the partner agreement, and eligible one-time deals earn 10%."
        />
        <link rel="canonical" href="https://bizuply.com/partners" />
      </Helmet>
      <p className="text-sm font-black uppercase tracking-wide text-[#6D28D9]">{copy.fee}</p>
      <h1 className="mt-2 text-4xl font-black text-slate-900">{copy.title}</h1>
      <p className="mt-4 text-lg text-slate-700">{copy.lead}</p>
      <ul className="mt-6 space-y-3 text-slate-800">
        <li>{copy.recurring}</li>
        <li>{copy.oneTime}</li>
        <li>{copy.center}</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white"
          to={REGISTER_PATH}
          data-testid="international-register-link"
        >
          {copy.apply}
        </Link>
        <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-800" to="/login">
          {copy.login}
        </Link>
      </div>
    </main>
  );
}
