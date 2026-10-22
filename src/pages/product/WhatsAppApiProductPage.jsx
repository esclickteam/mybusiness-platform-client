import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";

const COPY = {
  he: {
    title: "WhatsApp API לעסקים",
    paragraphs: [
      "Bizuply מחברת את WhatsApp Cloud API של Meta לעסק: שליחת תבניות מאושרות, מעקב מסירה ו־webhooks חתומים.",
      "המנוי של Bizuply הוא 29 דולר לחודש עבור מספר וואטסאפ מחובר אחד. חיובי ההודעות של Meta מחויבים בנפרד, ואין כאן ניסיון חינם.",
    ],
    crm: "מערכת CRM",
    automations: "אוטומציות",
  },
  en: {
    title: "WhatsApp API for businesses",
    paragraphs: [
      "Bizuply connects Meta's WhatsApp Cloud API to a business: approved template messages, delivery status and signed webhooks.",
      "The Bizuply subscription is $29 per month for one connected WhatsApp number. Meta's messaging charges are billed separately, and there is no free trial.",
    ],
    crm: "CRM",
    automations: "Automations",
  },
};

export default function WhatsAppApiProductPage() {
  const { i18n } = useTranslation();
  const hebrew = String(i18n.language || "").startsWith("he");
  const copy = hebrew ? COPY.he : COPY.en;
  return (
    <main className="mx-auto max-w-3xl px-5 py-16" dir={getTextDirection(i18n.language)} lang={hebrew ? "he" : "en"}>
      <p className="text-sm font-black tracking-wide text-slate-950">Bizuply</p>
      <h1 className="mt-3 text-4xl font-black text-slate-900">{copy.title}</h1>
      {copy.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-lg leading-8 text-slate-600">{paragraph}</p>
      ))}
      <p className="mt-8 flex flex-wrap gap-4 text-sm font-bold">
        <Link className="text-indigo-700" to="/crm">{copy.crm}</Link>
        <Link className="text-indigo-700" to="/automations">{copy.automations}</Link>
        <a className="text-indigo-700" href="https://whatsapp.bizuply.com/">whatsapp.bizuply.com</a>
      </p>
    </main>
  );
}
