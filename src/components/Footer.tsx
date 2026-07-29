import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { getTextDirection, normalizeLanguage } from "../i18n/localeUtils";

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
  const { t, i18n } = useTranslation();
  const footerDir = getTextDirection(normalizeLanguage(i18n.language));

  const productLinks: FooterLink[] = [
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
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800"
      dir={footerDir}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-24 h-[320px] w-[320px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[320px] w-[320px] rounded-full bg-violet-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-16 text-start sm:px-6 lg:px-8 lg:pt-20">
        <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-2 shadow-[0_28px_90px_rgba(79,70,229,0.14)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
          <div className="rounded-[1.6rem] border border-slate-100 bg-white/90 px-5 py-8 sm:rounded-[2rem] sm:px-8 sm:py-10 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr]">
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center"
                  aria-label="BizUply"
                >
                  <img
                    src={logo}
                    alt="BizUply"
                    className="h-20 w-auto max-w-[min(22rem,75vw)] object-contain sm:h-[5.5rem] sm:max-w-[24rem]"
                  />
                </Link>

                <p className="mt-5 max-w-sm text-base font-semibold leading-7 text-slate-600">
                  {t("footer.tagline")}
                </p>

                <div className="mt-6 flex items-center gap-3">
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

              <FooterColumn title={t("footer.product")} links={productLinks} />
              <FooterColumn title={t("footer.company")} links={companyLinks} />
              <FooterColumn title={t("footer.support")} links={supportLinks} />
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="flex flex-col gap-5 text-sm font-semibold text-slate-500 lg:flex-row lg:items-center lg:justify-between">
              <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>

              <p
                dir="ltr"
                className="max-w-2xl leading-6 lg:text-end"
              >
                1007 N Orange Street, 4th Floor, Ste 1382, Wilmington, DE
                19801, United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="text-start">
      <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h4>

      <ul className="space-y-3">
        {links.map((link) => (
          <li key={`${link.to}-${link.label}`}>
            <Link
              to={link.to}
              className="group inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-indigo-700"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-200 transition group-hover:bg-indigo-600"
                aria-hidden="true"
              />
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
