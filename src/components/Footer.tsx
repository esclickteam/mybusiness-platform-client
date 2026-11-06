import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const logo = "/logo-mark.svg";
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
    { label: t("footer.platform"), to: "/platform" },
    { label: t("footer.services"), to: "/services" },
    { label: t("footer.crm"), to: "/crm" },
    { label: t("footer.website"), to: "/website-builder" },
    { label: t("footer.automations"), to: "/automations" },
    { label: t("footer.agents"), to: "/agents" },
    { label: t("footer.collaborations"), to: "/collaborations" },
    { label: t("footer.appointments"), to: "/appointments" },
    { label: t("footer.whatsapp"), to: "/whatsapp-api" },
    { label: t("footer.meta"), to: "/meta-campaigns" },
    { label: t("footer.guides"), to: "/guides" },
  ];

  const companyLinks: FooterLink[] = [
    { label: t("footer.aboutUs"), to: "/about" },
    { label: t("footer.pricing"), to: "/pricing" },
    { label: t("footer.contact"), to: "/contact" },
    { label: t("footer.partners"), to: "/partners" },
  ];

  const supportLinks: FooterLink[] = [
    { label: t("footer.faq"), to: "/faq" },
    { label: t("footer.terms"), to: "/terms" },
    { label: t("footer.privacy"), to: "/privacy" },
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
          aria-label={t("footer.logoAria")}
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
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{t("footer.tagline")}</p>

        <div className="mt-5 grid w-full max-w-3xl gap-5 sm:grid-cols-3 sm:gap-4">
          <FooterColumn title={t("footer.solutions")} links={solutionsLinks} />
          <FooterColumn title={t("footer.company")} links={companyLinks} />
          <FooterColumn title={t("footer.support")} links={supportLinks} />
        </div>

        <div className="mx-auto mt-5 h-px w-full max-w-xl bg-slate-200/80" />

        <p className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
          <a className="text-slate-600 hover:text-indigo-700" href="https://www.facebook.com/bizuply" rel="noopener noreferrer">Facebook</a>
          <a className="text-slate-600 hover:text-indigo-700" href="https://www.instagram.com/bizuply" rel="noopener noreferrer">Instagram</a>
        </p>
        <p className="mt-3 text-[11px] font-semibold text-slate-600 sm:text-xs">
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
      <p className="mb-1.5 text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-600">
        {title}
      </p>
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
