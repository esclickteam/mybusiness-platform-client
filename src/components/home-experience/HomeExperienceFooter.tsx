import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import { changeAppLanguage } from "../../i18n/persistLanguage";
import { coerceSupportedLanguage } from "../../i18n/localeUtils";

const COLUMNS = [
  {
    he: "מוצר",
    en: "Product",
    links: [
      ["/platform", "הפלטפורמה", "Platform"],
      ["/crm", "CRM", "CRM"],
      ["/whatsapp-api", "WhatsApp API", "WhatsApp API"],
      ["/meta-campaigns", "קמפיינים", "Campaigns"],
      ["/website-builder", "בניית אתרים", "Website builder"],
      ["/automations", "אוטומציות", "Automations"],
      ["/appointments", "תורים", "Appointments"],
      ["/agents", "סוכני AI", "AI agents"],
      ["/saas", "תבניות SaaS", "SaaS templates"],
    ],
  },
  {
    he: "פתרונות",
    en: "Solutions",
    links: [
      ["/solutions/clinics", "קליניקות", "Clinics"],
      ["/solutions/beauty", "מכוני יופי", "Beauty"],
      ["/solutions/real-estate", "נדל״ן", "Real estate"],
      ["/solutions/restaurants", "מסעדות", "Restaurants"],
      ["/solutions/service-businesses", "נותני שירות", "Service businesses"],
      ["/solutions/agencies", "סוכנויות", "Agencies"],
      ["/solutions/lead-based", "עסקים מבוססי לידים", "Lead-based businesses"],
      ["/solutions/ready-systems", "מערכות מוכנות", "Ready systems"],
    ],
  },
  {
    he: "משאבים",
    en: "Resources",
    links: [
      ["/guides", "מדריכים", "Guides"],
      ["/faq", "שאלות נפוצות", "FAQ"],
      ["/services", "שירותים", "Services"],
      ["/pricing", "מחירים", "Pricing"],
    ],
  },
  {
    he: "חברה",
    en: "Company",
    links: [
      ["/about", "אודות", "About"],
    ],
  },
  {
    he: "שותפים",
    en: "Partners",
    links: [
      ["/collaborations", "מרכז שותפים", "Partner center"],
    ],
  },
  {
    he: "תמיכה",
    en: "Support",
    links: [
      ["/support", "תמיכה", "Support"],
      ["/contact", "יצירת קשר", "Contact"],
      ["/faq", "שאלות נפוצות", "FAQ"],
      ["/accessibility", "נגישות", "Accessibility"],
    ],
  },
] as const;

export default function HomeExperienceFooter() {
  const { i18n, t } = useTranslation();
  const he = i18n.language.startsWith("he");
  const text = (hebrew: string, english: string) => (he ? hebrew : english);
  const year = new Date().getFullYear();
  const region = coerceSupportedLanguage(i18n.language);

  return (
    <footer className="hx-footer">
      <div className="hx-wrap hx-footer-grid">
        <div className="hx-footer-brand">
          <Link to="/" aria-label={he ? "ביזאפלי (Bizuply)" : "Bizuply"}>
            <img src="/logo-mark.svg" alt={he ? "ביזאפלי (Bizuply)" : "Bizuply"} width="160" height="48" loading="lazy" decoding="async" />
          </Link>
          <p>
            {text(
              "Bizuply מחברת לקוחות, שיחות, קמפיינים ואוטומציות במערכת אחת.",
              "Bizuply connects customers, conversations, campaigns, and automations in one system.",
            )}
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.en}>
            <h3>{text(column.he, column.en)}</h3>
            {column.links.map(([to, hebrew, english]) => (
              <Link key={to} to={to}>
                {text(hebrew, english)}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="hx-wrap hx-footer-bottom">
        <p>{t("footer.rights", { year })}</p>
        <div className="hx-legal">
          <Link to="/terms">{text("תנאי שימוש", "Terms")}</Link>
          <Link to="/privacy">{text("פרטיות", "Privacy")}</Link>
          <Link to="/contact">{text("יצירת קשר", "Contact")}</Link>
        </div>
        <div className="hx-footer-tools">
          <LanguageSwitcher />
          <label>
            <span className="hx-note">{text("אזור", "Region")} </span>
            <select
              className="hx-select text-inherit"
              value={region}
              aria-label={text("בחירת אזור", "Choose a region")}
              onChange={(event) => {
                void changeAppLanguage(event.target.value);
              }}
            >
              <option value="he">ישראל</option>
              <option value="en">United States</option>
              <option value="es">España</option>
              <option value="pt-BR">Brasil</option>
              <option value="ar">المنطقة العربية</option>
            </select>
          </label>
          <div className="hx-socials">
            <a href="https://www.facebook.com/bizuply" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/bizuply" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
