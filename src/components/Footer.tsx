import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LOGO_SRC = "/bizuply logo.png";

/** Slim site footer — sits on the page background, no card, no link columns. */
export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative border-t border-indigo-100/60 bg-gradient-to-b from-white via-[#f7f8ff] to-[#eef3ff] text-slate-700"
      dir="rtl"
    >
      <div className="relative mx-auto max-w-3xl px-5 py-12 text-center sm:px-6 sm:py-14">
        <Link to="/" className="inline-flex flex-col items-center gap-3">
          <img
            src={LOGO_SRC}
            alt="Bizuply"
            width={160}
            height={48}
            className="h-12 w-auto object-contain sm:h-14"
            loading="lazy"
            decoding="async"
          />
        </Link>

        <p className="mx-auto mt-5 max-w-md text-sm font-semibold leading-7 text-slate-600 sm:text-base">
          {t("footer.tagline")}
        </p>

        <p className="mt-8 text-sm font-semibold text-slate-500">
          {t("footer.rights", { year })}
        </p>
      </div>
    </footer>
  );
}
