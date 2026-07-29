import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type FooterLink = {
  label: string;
  to: string;
};

type SocialLink = FooterLink & {
  icon: string;
};

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

export default function Footer() {
  const { t } = useTranslation();

  const pagesLinks: FooterLink[] = [
    { label: t("footer.aboutUs"), to: "/about" },
    { label: t("footer.website"), to: "/website-builder" },
    { label: t("footer.crm"), to: "/crm" },
    { label: t("footer.automations"), to: "/automations" },
    { label: t("footer.agents"), to: "/agents" },
    { label: t("footer.collaborations"), to: "/collaborations" },
    { label: t("footer.pricing"), to: "/pricing" },
  ];

  const companyLinks: FooterLink[] = [
    { label: t("footer.aboutUs"), to: "/about" },
    { label: t("footer.joinBusiness"), to: "/business" },
  ];

  const supportLinks: FooterLink[] = [
    { label: t("footer.faq"), to: "/faq" },
    { label: t("footer.contact"), to: "/contact" },
    { label: t("footer.terms"), to: "/terms" },
    { label: t("footer.privacy"), to: "/privacy-policy" },
    { label: t("footer.accessibility"), to: "/accessibility" },
  ];

  const socialLinks: SocialLink[] = [
    { label: "Facebook", icon: "f", to: "#" },
    { label: "Instagram", icon: "◎", to: "#" },
    { label: "LinkedIn", icon: "in", to: "#" },
  ];

  return (
    <footer
      className="relative overflow-hidden bg-gradient-to-b from-[#f7f8ff] via-white to-[#eef3ff] text-slate-800"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[280px] w-[640px] -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 pb-10 pt-14 sm:px-6 lg:pt-16">
        <div className="overflow-hidden rounded-[1.75rem] border border-indigo-100/80 bg-white/90 shadow-[0_20px_60px_rgba(79,70,229,0.12)] backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-l from-indigo-50/80 via-white to-cyan-50/60 px-6 py-8 text-center sm:px-8">
            <Link to="/" className="inline-flex flex-col items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-lg font-black text-white shadow-xl shadow-indigo-200">
                B
              </span>
              <span className="text-2xl font-black tracking-[-0.04em] text-slate-800">
                Bizuply
              </span>
            </Link>

            <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-7 text-slate-600">
              {t("footer.tagline")}
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 text-center sm:grid-cols-3 sm:gap-6 sm:px-8">
            <FooterColumn title={t("footer.pages")} links={pagesLinks} />
            <FooterColumn title={t("footer.company")} links={companyLinks} />
            <FooterColumn title={t("footer.support")} links={supportLinks} />
          </div>

          <div className="border-t border-slate-100 px-6 py-5 text-center sm:px-8">
            <p className="text-sm font-semibold text-slate-500">
              {t("footer.rights", { year: new Date().getFullYear() })}
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs font-semibold leading-5 text-slate-400">
              1007 N Orange Street, 4th Floor, Ste 1382, Wilmington, DE 19801,
              United States.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="text-center">
      <h4 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h4>

      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={`${title}-${link.to}-${link.label}`}>
            <Link
              to={link.to}
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
