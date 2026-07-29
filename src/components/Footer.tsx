import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LOGO_SRC = "/bizuply logo.png";

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
  const { t } = useTranslation();
  const year = new Date().getFullYear();

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

  return (
    <footer
      className="relative border-t border-slate-200/70 bg-transparent text-slate-700"
      dir="rtl"
    >
      <div className="relative mx-auto max-w-5xl px-5 py-10 text-center sm:px-6 sm:py-12">
        <Link to="/" className="inline-flex items-center justify-center">
          <img
            src={LOGO_SRC}
            alt="Bizuply"
            width={140}
            height={40}
            className="h-9 w-auto object-contain sm:h-10"
            loading="lazy"
            decoding="async"
          />
        </Link>

        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-500">
          {t("footer.tagline")}
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-3 sm:gap-4">
          <FooterColumn title={t("footer.pages")} links={pagesLinks} />
          <FooterColumn title={t("footer.company")} links={companyLinks} />
          <FooterColumn title={t("footer.support")} links={supportLinks} />
        </div>

        <div className="mx-auto mt-8 h-px max-w-xl bg-slate-200/80" />

        <p className="mt-5 text-xs font-semibold text-slate-400 sm:text-sm">
          {t("footer.rights", { year })}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="text-center">
      <h4 className="mb-3 text-[0.7rem] font-black uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={`${title}-${link.to}-${link.label}`}>
            <Link
              to={link.to}
              className="text-sm font-semibold text-slate-600 transition hover:text-indigo-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
