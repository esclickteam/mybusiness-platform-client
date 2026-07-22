"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGlobe, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

type ProfileContactBlockProps = {
  phone?: string;
  email?: string;
  formattedPhone?: string;
  websiteUrl?: string;
  whatsappUrl?: string;
  normalizedWebsiteUrl?: string;
  normalizedWhatsappUrl?: string;
  showEmptyPlaceholders?: boolean;
  phonePlaceholder?: string;
  emailPlaceholder?: string;
};

export default function ProfileContactBlock({
  phone = "",
  email = "",
  formattedPhone = "",
  websiteUrl = "",
  whatsappUrl = "",
  normalizedWebsiteUrl = "",
  normalizedWhatsappUrl = "",
  showEmptyPlaceholders = false,
  phonePlaceholder,
  emailPlaceholder,
}: ProfileContactBlockProps) {
  const { t } = useTranslation();
  const notAdded = t("businessProfile.contact.notAdded");
  const resolvedPhonePlaceholder = phonePlaceholder || notAdded;
  const resolvedEmailPlaceholder = emailPlaceholder || notAdded;

  const showPhone = Boolean(phone) || showEmptyPlaceholders;
  const showEmail = Boolean(email) || showEmptyPlaceholders;
  const phoneValue = formattedPhone || phone || resolvedPhonePlaceholder;
  const emailValue = email || resolvedEmailPlaceholder;

  if (!showPhone && !showEmail && !websiteUrl && !whatsappUrl) {
    return null;
  }

  return (
    <>
      {(showPhone || showEmail) && (
        <div className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-2 gap-3">
          {showPhone && (
            <div className="profile-contact-card group w-full min-w-0 rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-3 shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(79,70,229,0.14)] sm:p-4">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span
                  className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-violet-600"
                  style={{ animationDelay: "0s" }}
                  aria-hidden
                >
                  <FaPhoneAlt size={16} className="sm:hidden" />
                  <FaPhoneAlt size={18} className="hidden sm:block" />
                </span>

                <div className="min-w-0 flex-1 text-start">
                  <p className="text-[11px] font-black text-slate-400 sm:text-xs">
                    {t("businessProfile.contact.phone")}
                  </p>

                  <p
                    dir="ltr"
                    className="mt-0.5 text-sm font-black text-slate-800 sm:mt-1 sm:text-lg"
                  >
                    {phoneValue}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showEmail && (
            <div className="profile-contact-card group w-full min-w-0 rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-3 shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(79,70,229,0.14)] sm:p-4">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <span
                  className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-violet-600"
                  style={{ animationDelay: "0.35s" }}
                  aria-hidden
                >
                  <FaEnvelope size={16} className="sm:hidden" />
                  <FaEnvelope size={18} className="hidden sm:block" />
                </span>

                <div className="min-w-0 flex-1 text-start">
                  <p className="text-[11px] font-black text-slate-400 sm:text-xs">
                    {t("businessProfile.contact.email")}
                  </p>

                  <p
                    dir="ltr"
                    className="mt-0.5 truncate text-sm font-black text-slate-800 sm:mt-1 sm:text-lg"
                  >
                    {emailValue}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {(websiteUrl || whatsappUrl) && (
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {websiteUrl && (
            <a
              href={normalizedWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="profile-contact-action group flex h-[52px] min-w-[200px] flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-5 text-sm font-black !text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 sm:max-w-xs sm:flex-none"
            >
              <span
                className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-white"
                style={{ animationDelay: "0.15s" }}
                aria-hidden
              >
                <FaGlobe size={17} />
              </span>
              {t("businessProfile.contact.websiteCta")}
            </a>
          )}

          {whatsappUrl && (
            <a
              href={normalizedWhatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="profile-contact-action group flex h-[52px] min-w-[200px] flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-500 px-5 text-sm font-black !text-white shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5 sm:max-w-xs sm:flex-none"
            >
              <span
                className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-white"
                style={{ animationDelay: "0.55s" }}
                aria-hidden
              >
                <FaWhatsapp size={19} />
              </span>
              {t("businessProfile.contact.whatsappCta")}
            </a>
          )}
        </div>
      )}
    </>
  );
}
