import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import logo from "../images/logo_final.svg";
import { getTextDirection, normalizeLanguage } from "../i18n/localeUtils";

type FooterLink = {
  label: string;
  to: string;
};

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

/** Compact footer on the page background — no card shell. */
export default function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();
  const footerDir = getTextDirection(normalizeLanguage(i18n.language));

  const solutionsLinks: FooterLink[] = [
    { label: t("footer.crm"), to: "/crm" },
    { label: t("footer.website"), to: "/website-builder" },
    { label: t("footer.automations"), to: "/automations" },
    { label: t("footer.agents"), to: "/agents" },
    { label: t("footer.collaborations"), to: "/collaborations" },
    { label: t("footer.appointments"), to: "/appointments" },
  ];

  const companyLinks: FooterLink[] = [
    { label: t("footer.aboutUs"), to: "/about" },
    { label: t("footer.pricing"), to: "/pricing" },
    { label: t("footer.contact"), to: "/contact" },
  ];

  const supportLinks: FooterLink[] = [
    { label: t("footer.faq"), to: "/faq" },
    { label: t("footer.terms"), to: "/terms" },
    { label: t("footer.privacy"), to: "/privacy-policy" },
    { label: t("footer.accessibility"), to: "/accessibility" },
  ];

  return (
    <footer
      className="relative border-t border-slate-200/70 bg-transparent text-slate-700"
      dir={footerDir}
    >
      <div className="relative mx-auto max-w-5xl px-4 py-6 text-start sm:px-6 sm:py-8">
        <Link to="/" className="inline-flex items-center" aria-label="BizUply">
          <img
            src={logo}
            alt="BizUply"
            width={280}
            height={88}
            className="h-[4.75rem] w-auto max-w-[min(20rem,80vw)] object-contain sm:h-[5.5rem]"
            loading="lazy"
            decoding="async"
          />
        </Link>

        <div className="mt-5 grid max-w-3xl gap-5 sm:grid-cols-3 sm:gap-4">
          <FooterColumn title={t("footer.solutions")} links={solutionsLinks} />
          <FooterColumn title={t("footer.company")} links={companyLinks} />
          <FooterColumn title={t("footer.support")} links={supportLinks} />
        </div>

        <div className="mt-5 h-px max-w-xl bg-slate-200/80" />

        <p className="mt-3 text-[11px] font-semibold text-slate-400 sm:text-xs">
          {t("footer.rights", { year })}
        </p>
      </div>
    </footer>
  );
}

function scrollPageToTop() {
  const scroller = document.querySelector(".app-scroll-area");
  if (scroller instanceof HTMLElement) scroller.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="text-start">
      <h4 className="mb-1.5 text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-400">
        {title}
      </h4>
      <ul className="space-y-0.5">
        {links.map((link) => (
          <li key={`${title}-${link.to}-${link.label}`}>
            <Link
              to={link.to}
              onClick={() => {
                window.setTimeout(scrollPageToTop, 0);
                window.setTimeout(scrollPageToTop, 50);
              }}
              className="text-[13px] font-semibold leading-5 text-slate-600 transition hover:text-indigo-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
