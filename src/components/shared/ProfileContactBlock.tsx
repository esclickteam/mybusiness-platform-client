"use client";

import React from "react";
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
  phonePlaceholder = "לא נוסף",
  emailPlaceholder = "לא נוסף",
}: ProfileContactBlockProps) {
  const showPhone = Boolean(phone) || showEmptyPlaceholders;
  const showEmail = Boolean(email) || showEmptyPlaceholders;
  const phoneValue = formattedPhone || phone || phonePlaceholder;
  const emailValue = email || emailPlaceholder;

  if (!showPhone && !showEmail && !websiteUrl && !whatsappUrl) {
    return null;
  }

  return (
    <>
      {(showPhone || showEmail) && (
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-stretch justify-center gap-3">
          {showPhone && (
            <div className="profile-contact-card group w-full max-w-xs rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(79,70,229,0.14)] sm:w-auto sm:min-w-[240px]">
              <div className="flex items-center justify-center gap-3">
                <span
                  className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-violet-600"
                  style={{ animationDelay: "0s" }}
                  aria-hidden
                >
                  <FaPhoneAlt size={18} />
                </span>

                <div className="min-w-0 text-right">
                  <p className="text-xs font-black text-slate-400">טלפון</p>

                  <p
                    dir="ltr"
                    className="mt-1 text-lg font-black text-slate-950"
                  >
                    {phoneValue}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showEmail && (
            <div className="profile-contact-card group w-full max-w-xs rounded-2xl border border-violet-100/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(245,243,255,0.78)_100%)] p-4 shadow-[0_12px_32px_rgba(79,70,229,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(79,70,229,0.14)] sm:w-auto sm:min-w-[240px]">
              <div className="flex items-center justify-center gap-3">
                <span
                  className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-violet-600"
                  style={{ animationDelay: "0.35s" }}
                  aria-hidden
                >
                  <FaEnvelope size={18} />
                </span>

                <div className="min-w-0 text-right">
                  <p className="text-xs font-black text-slate-400">אימייל</p>

                  <p
                    dir="ltr"
                    className="mt-1 truncate text-lg font-black text-slate-950"
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
              className="profile-contact-action group flex h-[52px] min-w-[200px] flex-1 items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-l from-violet-600 to-blue-600 px-5 text-sm font-black !text-white shadow-xl shadow-violet-500/25 transition hover:-translate-y-0.5 sm:max-w-xs sm:flex-none"
            >
              <span
                className="profile-contact-icon inline-flex shrink-0 items-center justify-center text-white"
                style={{ animationDelay: "0.15s" }}
                aria-hidden
              >
                <FaGlobe size={17} />
              </span>
              כניסה לאתר העסק
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
              שליחת הודעה בוואטסאפ
            </a>
          )}
        </div>
      )}
    </>
  );
}
