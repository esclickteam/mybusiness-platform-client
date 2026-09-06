import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  CheckCircle2,
  Headphones,
  Mail,
  MessageCircle,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  detectPhoneCountry,
  detectPhoneCountrySync,
} from "../utils/detectPhoneCountry";
import { getTextDirection } from "../i18n/localeUtils";

type SupportFormData = {
  name: string;
  email: string;
  phone: string;
  issueDescription: string;
};

type StatusMessage = {
  type: "success" | "error";
  message: string;
} | null;

export default function BusinessSupport() {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [formData, setFormData] = useState<SupportFormData>({
    name: "",
    email: "",
    phone: "",
    issueDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<StatusMessage>(null);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const { name, email, phone, issueDescription } = formData;

    if (!name.trim() || !email.trim() || !phone.trim() || !issueDescription.trim()) {
      setStatus({
        type: "error",
        message: t("support.business.requiredFields"),
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          issueDescription,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send");
      }

      setStatus({
        type: "success",
        message: t("support.business.sent"),
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        issueDescription: "",
      });
    } catch (error) {
      console.error("Support form error:", error);

      setStatus({
        type: "error",
        message: t("support.business.sendError"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir={pageDir}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/40 px-4 py-6 text-start text-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 px-6 py-10 shadow-[0_24px_80px_rgba(109,40,217,0.10)] sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/80 px-4 py-1.5 text-xs font-black text-violet-700 shadow-sm backdrop-blur">
              <Headphones size={15} />
              {t("support.business.badge")}
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-800 sm:text-5xl">
              {t("support.business.title")}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {t("support.business.intro")}
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <form
            onSubmit={handleFormSubmit}
            className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-7"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight text-slate-800">
                {t("support.business.formTitle")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {t("support.business.formHint")}
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("support.business.fullName")} <span className="text-violet-600">*</span>
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder={t("support.business.namePlaceholder")}
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("support.business.phone")} <span className="text-violet-600">*</span>
                </label>

                <PhoneInput
                  key={phoneCountry}
                  country={phoneCountry}
                  preferredCountries={["il", "us", "gb", "ca", "fr", "de"]}
                  enableSearch
                  value={formData.phone}
                  onChange={(phone) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone,
                    }))
                  }
                  inputProps={{
                    name: "phone",
                    required: true,
                    disabled: loading,
                  }}
                  containerClass="!w-full"
                  inputClass="!h-12 !w-full !rounded-2xl !border !border-slate-200 !bg-white !pe-14 !ps-4 !text-start !text-sm !font-semibold !text-slate-900 !shadow-sm !outline-none focus:!border-violet-400 focus:!ring-4 focus:!ring-violet-100 disabled:!cursor-not-allowed disabled:!bg-slate-50 disabled:!text-slate-400"
                  buttonClass="!rounded-e-2xl !border-slate-200 !bg-slate-50 hover:!bg-slate-100"
                  dropdownClass="!rounded-2xl !border-slate-200 !text-start !shadow-2xl"
                  searchClass="!rounded-xl !border-slate-200 !px-3 !py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("support.business.email")} <span className="text-violet-600">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder={t("support.business.emailPlaceholder")}
                    required
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-extrabold text-slate-800">
                  {t("support.business.message")} <span className="text-violet-600">*</span>
                </label>

                <div className="relative">
                  <MessageCircle
                    size={18}
                    className="pointer-events-none absolute start-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="issueDescription"
                    value={formData.issueDescription}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder={t("support.business.messagePlaceholder")}
                    required
                    rows={6}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white py-3 ps-11 pe-4 text-sm font-medium leading-6 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 px-6 text-sm font-black text-black shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? t("support.business.sending") : t("support.business.submit")}
                <Send size={17} />
              </button>

              {status && (
                <div
                  className={[
                    "flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-bold leading-6",
                    status.type === "success"
                      ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                      : "border border-rose-100 bg-rose-50 text-rose-700",
                  ].join(" ")}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                  ) : (
                    <XCircle size={19} className="mt-0.5 shrink-0" />
                  )}

                  <span>{status.message}</span>
                </div>
              )}
            </div>
          </form>

          <aside className="rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-sky-50 p-6 shadow-[0_24px_80px_rgba(109,40,217,0.10)] sm:p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Headphones size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-800">
              {t("support.business.asideTitle")}
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {t("support.business.asideText")}
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-black text-slate-400">{t("support.business.responseTime")}</p>
                <p className="mt-1 text-sm font-black text-slate-900">
                  {t("support.business.responseHint")}
                </p>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-black text-slate-400">
                  {t("support.business.directEmail")}
                </p>
                <a
                  href="mailto:support@bizuply.com"
                  className="mt-1 inline-flex text-sm font-black text-violet-700 underline-offset-4 hover:underline"
                >
                  support@bizuply.com
                </a>
              </div>

              <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="text-xs font-black text-slate-400">
                  {t("support.business.attachTitle")}
                </p>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-700">
                  {t("support.business.attachHint")}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
