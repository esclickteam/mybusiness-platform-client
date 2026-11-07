import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl, normalizeMarketingLocale } from "../lib/localePath.mjs";
import "../styles/publicStage.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  detectPhoneCountry,
  detectPhoneCountrySync,
} from "../utils/detectPhoneCountry";
import API from "../api";
import { NOTICE_VERSION } from "../lib/trackingConsent";
import { createConsentKey, storePrivacyConsent } from "../lib/privacyConsentClient";

function Contact() {
  const { t, i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const location = useLocation();
  const prefillMessage =
    typeof location.state?.prefillMessage === "string"
      ? location.state.prefillMessage
      : "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: prefillMessage,
  });

  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const consentKeyRef = useRef(createConsentKey());
  const [loading, setLoading] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState(detectPhoneCountrySync);

  useEffect(() => {
    let active = true;
    detectPhoneCountry().then((code) => {
      if (active && code) setPhoneCountry(code);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!prefillMessage) return;
    setFormData((prev) =>
      prev.message === prefillMessage
        ? prev
        : { ...prev, message: prefillMessage }
    );
  }, [prefillMessage]);

  const highlights = [
    [t("contact.highlight1Title"), t("contact.highlight1Text")],
    [t("contact.highlight2Title"), t("contact.highlight2Text")],
    [t("contact.highlight3Title"), t("contact.highlight3Text")],
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const { name, phone, email, message } = formData;

    if (!name || !phone || !email || !message) {
      setStatus({ type: "error", messageKey: "fillAllFields" });
      return;
    }

    setLoading(true);

    try {
      let saved;
      try {
        saved = await storePrivacyConsent({
          consentKey: consentKeyRef.current,
          source: "contact",
          email,
          termsAccepted: false,
          marketingOptIn,
          locale: i18n.language,
        });
      } catch (error) {
        error.message = error?.message || "consent_not_stored";
        throw error;
      }
      const payload = {
        name,
        phone,
        email,
        issueDescription: message,
        locale: i18n.language,
      };
      if (saved.status === "stored") {
        payload.marketingOptIn = marketingOptIn;
        payload.noticeVersion = NOTICE_VERSION;
        payload.consentKey = consentKeyRef.current;
      }
      const { data } = await API.post("/support", payload);
      if (data?.success !== true) throw new Error("support_failed");
      if (saved.status === "stored" && data?.consentStored !== true) {
        throw new Error("consent_not_stored");
      }

      setStatus({
        type: "success",
        messageKey: "success",
      });

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      const failedBeforeSave = ["consent_not_stored", "consent_key_required", "email_invalid"].includes(
        error?.message
      );
      setStatus({
        type: "error",
        messageKey: failedBeforeSave ? "consentSaveFailed" : "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="co-page contact-stage relative min-h-screen overflow-hidden text-slate-800"
      dir={getTextDirection(i18n.language)}
    >
      <Helmet>
        <title>{t("contact.seoTitle")}</title>
        <meta name="description" content={t("contact.seoDescription")} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={marketingPublicUrl("/contact", locale)} />

        <meta property="og:title" content={t("contact.ogTitle")} />
        <meta property="og:description" content={t("contact.ogDescription")} />
        <meta property="og:url" content={marketingPublicUrl("/contact", locale)} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bizuply.com/og-image.jpg" />
      </Helmet>

      <section className="stage-hero relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-24">
        {/* Left side */}
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t("contact.badge")}
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
            {t("contact.heroTitle")}
          </h1>

          <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
            {t("contact.heroSubtitle")}
          </p>

          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {highlights.map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm backdrop-blur"
              >
                <p className="text-2xl font-black text-slate-800">{title}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-700">
              {t("contact.directEmailLabel")}
            </p>
            <p className="mt-3 text-lg font-black text-slate-800">
              {t("contact.directEmail")}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              {t("contact.directEmailText")}
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-amber-200/70 via-white to-emerald-100/80 blur-2xl" />

          <div className="stage-panel relative overflow-hidden p-5 sm:p-7">
            <div className="mb-7">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700">
                {t("contact.formLabel")}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-800 sm:text-4xl">
                {t("contact.formTitle")}
              </h2>
              <p className="mt-3 text-base font-medium leading-7 text-slate-600">
                {t("contact.formSubtitle")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-black text-slate-800">
                  {t("contact.nameLabel")}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder={t("contact.namePlaceholder")}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label id="contact-phone-label" htmlFor="contact-phone" className="mb-2 block text-sm font-black text-slate-800">
                  {t("contact.phoneLabel")}
                </label>

                <div className="bizuply-phone-wrapper" dir="ltr">
                  <PhoneInput
                    key={phoneCountry}
                    country={phoneCountry}
                    preferredCountries={["il", "us", "gb", "fr", "de"]}
                    priority={{ il: 0, us: 1, gb: 2, fr: 3, de: 4 }}
                    enableSearch
                    value={formData.phone}
                    onChange={(phone) =>
                      setFormData((prev) => ({ ...prev, phone }))
                    }
                    inputProps={{
                      id: "contact-phone",
                      name: "phone",
                      required: true,
                      disabled: loading,
                      autoComplete: "tel",
                      "aria-labelledby": "contact-phone-label",
                    }}
                    containerClass="!w-full"
                    inputClass="!h-14 !w-full !rounded-2xl !border !border-slate-200 !bg-white !ps-14 !pe-5 !text-base !font-semibold !text-slate-800 !shadow-none !outline-none transition focus:!border-slate-950 focus:!ring-4 focus:!ring-slate-950/10"
                    buttonClass="!rounded-s-2xl !border-slate-200 !bg-white"
                    dropdownClass="!rounded-2xl !border-slate-200 !shadow-xl"
                    searchClass="!rounded-xl !border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-black text-slate-800">
                  {t("contact.emailLabel")}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder={t("contact.emailPlaceholder")}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-black text-slate-800">
                  {t("contact.messageLabel")}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  rows={6}
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100/80 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </div>

              <p className="text-sm font-medium leading-6 text-slate-600">
                {t("contact.privacyNotice")}
              </p>
              <label className="flex items-start gap-3 text-sm font-semibold leading-6 text-slate-700">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={marketingOptIn}
                  onChange={(event) => setMarketingOptIn(event.target.checked)}
                />
                <span>{t("contact.marketingConsent")}</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl shadow-slate-900/20 transition hover:-translate-y-0.5 hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? t("contact.sendingButton") : t("contact.sendButton")}
                {!loading && (
                  <span className="ms-2 transition group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {status && (
              <div
                className={`mt-5 rounded-2xl border px-5 py-4 text-sm font-black ${
                  status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {t(`contact.${status.messageKey}`)}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
