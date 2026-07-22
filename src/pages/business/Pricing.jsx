import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

export default function Plans() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;

  const handleCheckout = async (plan) => {
    try {
      setLoadingPlan(plan);

      if (!userId) {
        alert(t("pricing.alertUserNotLoaded"));
        setLoadingPlan(null);
        return;
      }

      const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan,
        }),
      });

      const data = await res.json();

      if (!data.url) {
        alert(t("pricing.alertCheckoutFailed"));
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(t("pricing.alertGenericError"));
      setLoadingPlan(null);
    }
  };

  const features = [
    t("pricing.feature1"),
    t("pricing.feature2"),
    t("pricing.feature3"),
    t("pricing.feature4"),
    t("pricing.feature5"),
    t("pricing.feature6"),
    t("pricing.feature7"),
    t("pricing.feature8"),
    t("pricing.feature9"),
    t("pricing.feature10"),
  ];

  const plans = [
    {
      type: "monthly",
      name: t("pricing.monthlyName"),
      price: t("pricing.monthlyPrice"),
      duration: t("pricing.monthlyDuration"),
      description: t("pricing.monthlyDescription"),
      button: t("pricing.monthlyButton"),
      highlighted: false,
      badge: t("pricing.monthlyBadge"),
      note: t("pricing.monthlyNote"),
    },
    {
      type: "yearly",
      name: t("pricing.yearlyName"),
      price: t("pricing.yearlyPrice"),
      duration: t("pricing.yearlyDuration"),
      description: t("pricing.yearlyDescription"),
      button: t("pricing.yearlyButton"),
      highlighted: true,
      badge: t("pricing.yearlyBadge"),
      note: t("pricing.yearlyNote"),
    },
  ];

  const renderButton = (type, label, highlighted) => {
    const isLoading = loadingPlan === type;

    return (
      <button
        type="button"
        aria-pressed={isLoading}
        onClick={() => handleCheckout(type)}
        disabled={isLoading}
        className={`group mt-8 inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-base font-black shadow-xl transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 ${
          highlighted
            ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-white shadow-indigo-200"
            : "border border-slate-200 bg-white text-slate-800 shadow-slate-100 hover:border-indigo-200 hover:text-indigo-700"
        }`}
      >
        {isLoading ? t("pricing.processing") : label}
        {!isLoading && (
          <span className="ms-2 transition group-hover:translate-x-1">→</span>
        )}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 top-[680px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute right-24 top-32 hidden h-56 w-56 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 lg:block" />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pt-24">
        {/* Header */}
        <header className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-5 py-2 text-sm font-black text-indigo-700 shadow-xl shadow-indigo-100/70 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 shadow-[0_0_16px_rgba(79,70,229,0.8)]" />
            {t("pricing.badge")}
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
            {t("pricing.heroTitleTop")}
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              {t("pricing.heroTitleHighlight")}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            {t("pricing.heroSubtitle")}
          </p>
        </header>

        {/* Pricing cards */}
        <section className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.type}
              className={`relative overflow-hidden rounded-[2.5rem] border p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? "border-indigo-200 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 shadow-[0_30px_100px_rgba(79,70,229,0.26)]"
                  : "border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(79,70,229,0.14)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute end-8 top-8 z-20 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-indigo-700 shadow-xl">
                  {t("pricing.mostPopular")}
                </div>
              )}

              <div
                className={`relative h-full rounded-[2rem] border p-7 sm:p-8 ${
                  plan.highlighted
                    ? "border-white/20 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
                    : "border-slate-100 bg-white text-slate-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/35 blur-3xl" />
                    <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
                  </div>
                )}

                <div className="relative text-start">
                  <div
                    className={`mb-6 inline-flex rounded-full px-4 py-2 text-sm font-black ${
                      plan.highlighted
                        ? "border border-white/10 bg-white/10 text-cyan-100"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {plan.badge}
                  </div>

                  <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    {plan.name}
                  </h2>

                  <p
                    className={`mt-4 text-base font-semibold leading-7 ${
                      plan.highlighted ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-6xl font-black tracking-[-0.06em]">
                      {plan.price}
                    </span>
                    <span
                      className={`pb-2 text-base font-black ${
                        plan.highlighted ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {plan.duration}
                    </span>
                  </div>

                  <div
                    className={`mt-5 rounded-2xl px-5 py-4 text-sm font-black ${
                      plan.highlighted
                        ? "border border-white/10 bg-white/10 text-cyan-100"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {plan.note}
                  </div>

                  <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  <ul className="mt-8 grid gap-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${
                            plan.highlighted
                              ? "bg-white text-indigo-700"
                              : "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-white"
                          }`}
                        >
                          ✓
                        </span>

                        <span
                          className={`text-sm font-bold leading-6 ${
                            plan.highlighted
                              ? "text-slate-200"
                              : "text-slate-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {renderButton(plan.type, plan.button, plan.highlighted)}
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
