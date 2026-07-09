import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Plans() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;

  const handleCheckout = async (plan) => {
    try {
      setLoadingPlan(plan);

      if (!userId) {
        alert("User data not loaded yet.");
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
        alert("Failed to start Stripe Checkout");
        setLoadingPlan(null);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Error, please try again.");
      setLoadingPlan(null);
    }
  };

  const features = [
    "Professional Business Page",
    "Smart CRM for Clients & Appointments",
    "Built-in Messaging System",
    "Ratings & Reviews Management",
    "Business Collaboration Network",
    "AI Business Advisor & Smart Insights",
    "Create and Track Client Tasks",
    "Log and Document Client Calls",
    "Automated Notifications",
    "Predictive Analytics",
  ];

  const plans = [
    {
      type: "monthly",
      name: "Monthly Plan",
      price: "$149",
      duration: "/month",
      description:
        "Full access to all BizUply features. Flexible monthly billing.",
      button: "Start Monthly",
      highlighted: false,
      badge: "Flexible",
      note: "Best for testing and growing month by month.",
    },
    {
      type: "yearly",
      name: "Yearly Plan",
      price: "$1490",
      duration: "/year",
      description:
        "Best value for serious businesses. Save money and grow faster.",
      button: "Start Yearly",
      highlighted: true,
      badge: "Best Value",
      note: "$124/month · Save $298",
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
            ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-indigo-200"
            : "border border-slate-200 bg-white text-slate-950 shadow-slate-100 hover:border-indigo-200 hover:text-indigo-700"
        }`}
      >
        {isLoading ? "Processing..." : label}
        {!isLoading && (
          <span className="ml-2 transition group-hover:translate-x-1">→</span>
        )}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-950">
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
            BIZUPLY PRICING
          </div>

          <h1 className="mt-8 text-5xl font-black leading-[0.98] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
            Choose your
            <br />
            <span className="bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
              business plan.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            All the tools your business needs — CRM, business page, messaging,
            reviews, collaborations, automations and AI insights — in one smart
            platform.
          </p>
        </header>

        {/* Pricing cards */}
        <section className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.type}
              className={`relative overflow-hidden rounded-[2.5rem] border p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? "border-indigo-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 shadow-[0_30px_100px_rgba(79,70,229,0.26)]"
                  : "border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(79,70,229,0.14)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute right-8 top-8 z-20 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-indigo-700 shadow-xl">
                  Most Popular
                </div>
              )}

              <div
                className={`relative h-full rounded-[2rem] border p-7 sm:p-8 ${
                  plan.highlighted
                    ? "border-white/20 bg-slate-950 text-white"
                    : "border-slate-100 bg-white text-slate-950"
                }`}
              >
                {plan.highlighted && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/35 blur-3xl" />
                    <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-400/25 blur-3xl" />
                  </div>
                )}

                <div className="relative">
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
                              : "bg-gradient-to-br from-indigo-600 to-cyan-500 text-white"
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