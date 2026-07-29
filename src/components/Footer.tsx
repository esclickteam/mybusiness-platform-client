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

/** Compact, centered footer on the page background. */
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
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-6 text-center sm:px-6 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center justify-center"
          aria-label="BizUply"
        >
          <img
            src={logo}
            alt="BizUply"
            width={180}
            height={56}
            className="h-11 w-auto max-w-[11rem] object-contain sm:h-12 sm:max-w-[12.5rem]"
            loading="lazy"
            decoding="async"
          />
        </Link>

        <div className="mt-5 grid w-full max-w-3xl gap-5 sm:grid-cols-3 sm:gap-4">
          <FooterColumn title={t("footer.solutions")} links={solutionsLinks} />
          <FooterColumn title={t("footer.company")} links={companyLinks} />
          <FooterColumn title={t("footer.support")} links={supportLinks} />
        </div>

        <div className="mx-auto mt-5 h-px w-full max-w-xl bg-slate-200/80" />

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
    <div className="text-center">
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
