import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

const ROWS = [
  { n: "01", href: "/crm", title: "home.domainSoftware", body: "home.domainSoftwareBody" },
  { n: "02", href: "/website-builder", title: "home.domainWeb", body: "home.domainWebBody" },
  { n: "03", href: "/meta-campaigns", title: "home.domainMarket", body: "home.domainMarketBody" },
  { n: "04", href: "/pricing", title: "home.domainSetup", body: "home.domainSetupBody" },
];

export default function PlatformDomains() {
  const { t, i18n } = useTranslation();
  const dir = getTextDirection(i18n.language);

  return (
    <section className="bg-white text-slate-900" dir={dir}>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-indigo-700">Bizuply</p>
          <h2 className="mt-3 max-w-[12ch] text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl">
            {t("home.domainsTitle")}
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">{t("home.domainsLead")}</p>
        </div>
        <ol className="divide-y divide-slate-200 border-y border-slate-200">
          {ROWS.map((row) => (
            <li key={row.n}>
              <Link
                to={row.href}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-4 py-6 transition hover:bg-indigo-50/60"
              >
                <span className="pt-1 text-sm font-black text-indigo-700">{row.n}</span>
                <span>
                  <span className="block text-2xl font-black tracking-[-0.03em]">{t(row.title)}</span>
                  <span className="mt-2 block text-base leading-7 text-slate-600">{t(row.body)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
