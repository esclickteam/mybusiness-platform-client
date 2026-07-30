import React, { useMemo, useState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  Bell,
  Bot,
  CalendarCheck2,
  CalendarDays,
  Check,
  CircleDot,
  Compass,
  CreditCard,
  FileText,
  Flame,
  FormInput,
  Handshake,
  Headset,
  LayoutGrid,
  Mail,
  Plus,
  Puzzle,
  Route,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Timer,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  PRICING_ADDONS,
  PRICING_CATEGORY_LABELS,
  PRICING_CATEGORY_ORDER,
} from "../../data/pricingAddonsData";

const ICON_MAP = {
  "shopping-bag": ShoppingBag,
  calendar: CalendarDays,
  "calendar-check": CalendarCheck2,
  "credit-card": CreditCard,
  "file-text": FileText,
  mail: Mail,
  star: Star,
  users: Users,
  flame: Flame,
  "form-input": FormInput,
  route: Route,
  timer: Timer,
  "circle-dot": CircleDot,
  bot: Bot,
  compass: Compass,
  accessibility: Accessibility,
  headset: Headset,
  handshake: Handshake,
  search: Search,
  bell: Bell,
  puzzle: Puzzle,
  "layout-grid": LayoutGrid,
};

function AddonIcon({ name, accent }) {
  const Icon = ICON_MAP[name] || Puzzle;
  return (
    <span
      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/70 shadow-sm"
      style={{
        background: `linear-gradient(145deg, ${accent}22, ${accent}10)`,
        color: accent,
      }}
    >
      <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
    </span>
  );
}

export default function Plans() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const isHe = (i18n.language || "he").startsWith("he");

  const [loadingPlan, setLoadingPlan] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [showIncluded, setShowIncluded] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;

  const catLabel = (key) => {
    const entry = PRICING_CATEGORY_LABELS[key];
    if (!entry) return key;
    return isHe ? entry.he : entry.en;
  };

  const localizeAddon = (addon) => ({
    ...addon,
    displayName: !isHe && addon.nameEn ? addon.nameEn : addon.name,
    displayDescription:
      !isHe && addon.descriptionEn ? addon.descriptionEn : addon.description,
    displayPrice:
      !isHe && addon.priceLabelEn ? addon.priceLabelEn : addon.priceLabel,
  });

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

  const categories = useMemo(() => {
    const present = new Set(PRICING_ADDONS.map((a) => a.category));
    return [
      "all",
      ...PRICING_CATEGORY_ORDER.filter((key) => present.has(key)),
    ];
  }, []);

  const filteredAddons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRICING_ADDONS.map(localizeAddon).filter((addon) => {
      if (!showIncluded && addon.isIncluded) return false;
      if (activeCategory !== "all" && addon.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        addon.displayName.toLowerCase().includes(q) ||
        addon.displayDescription.toLowerCase().includes(q) ||
        addon.key.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, query, showIncluded, isHe]);

  const selectedAddons = useMemo(
    () =>
      PRICING_ADDONS.map(localizeAddon).filter((a) => selectedKeys.has(a.key)),
    [selectedKeys, isHe]
  );

  const selectedEstimate = useMemo(() => {
    let min = 0;
    let max = 0;
    let customCount = 0;
    selectedAddons.forEach((addon) => {
      if (addon.priceMonthly == null) {
        if (addon.isAddon) customCount += 1;
        return;
      }
      min += addon.priceMonthly;
      max += addon.priceMax != null ? addon.priceMax : addon.priceMonthly;
    });
    return { min, max, customCount };
  }, [selectedAddons]);

  const toggleAddon = (key, isIncluded) => {
    if (isIncluded) return;
    startTransition(() => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    });
  };

  const clearSelection = () => setSelectedKeys(new Set());

  const goToContactWithAddons = () => {
    const names = selectedAddons.map((a) => a.displayName).join(", ");
    const message = names
      ? t("pricing.addonsContactMessage", { services: names })
      : t("pricing.addonsContactMessageEmpty");
    navigate("/contact", { state: { prefillMessage: message } });
  };

  const fadeUp = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      };

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
            ? "bg-slate-900 text-white shadow-indigo-300/50 hover:bg-slate-800"
            : "border border-violet-200 bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 text-slate-900 shadow-slate-100 hover:border-indigo-300"
        }`}
      >
        {isLoading ? t("pricing.processing") : label}
        {!isLoading && (
          <span className="ms-2 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            →
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 top-[680px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.08]" />
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute left-[12%] top-40 h-24 w-24 rounded-full bg-violet-400/20 blur-2xl"
              animate={{ y: [0, -18, 0], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-[16%] top-56 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl"
              animate={{ y: [0, 16, 0], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
      </div>

      <main
        className={`relative mx-auto max-w-7xl px-6 pb-36 pt-20 lg:px-8 lg:pt-24 ${
          selectedKeys.size > 0 ? "pb-44" : ""
        }`}
      >
        <motion.header className="mx-auto max-w-4xl text-center" {...fadeUp}>
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
        </motion.header>

        <section className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.type}
              {...fadeUp}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : 0.08 + index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative overflow-hidden rounded-[2.5rem] border p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? "border-indigo-200 bg-gradient-to-br from-teal-100/80 via-violet-100 to-sky-100 shadow-[0_30px_100px_rgba(79,70,229,0.26)]"
                  : "border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(79,70,229,0.14)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute start-8 top-8 z-20 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-indigo-700 shadow-xl">
                  {t("pricing.mostPopular")}
                </div>
              )}

              <div
                className={`relative h-full rounded-[2rem] border p-7 sm:p-8 ${
                  plan.highlighted
                    ? "border-white/50 bg-white/55 text-slate-800"
                    : "border-slate-100 bg-white text-slate-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-400/25 blur-3xl" />
                    <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
                  </div>
                )}

                <div className="relative text-start">
                  <div
                    className={`mb-6 inline-flex rounded-full px-4 py-2 text-sm font-black ${
                      plan.highlighted
                        ? "border border-indigo-100/80 bg-white/70 text-indigo-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {plan.badge}
                  </div>

                  <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    {plan.name}
                  </h2>

                  <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
                    {plan.description}
                  </p>

                  <div className="mt-8 flex items-end gap-2">
                    <span className="text-6xl font-black tracking-[-0.06em]">
                      {plan.price}
                    </span>
                    <span className="pb-2 text-base font-black text-slate-500">
                      {plan.duration}
                    </span>
                  </div>

                  <div
                    className={`mt-5 rounded-2xl px-5 py-4 text-sm font-black ${
                      plan.highlighted
                        ? "border border-indigo-100 bg-white/80 text-indigo-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {plan.note}
                  </div>

                  <div className="mt-8 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                  <ul className="mt-8 grid gap-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 text-xs text-white shadow-sm">
                          ✓
                        </span>
                        <span className="text-sm font-bold leading-6 text-slate-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {renderButton(plan.type, plan.button, plan.highlighted)}
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Additional business services / upsells */}
        <motion.section
          id="business-services"
          className="relative mx-auto mt-28 max-w-6xl"
          {...fadeUp}
        >
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 text-sm font-black text-violet-700 shadow-lg shadow-violet-100/60">
              <Sparkles size={14} aria-hidden="true" />
              {t("pricing.addonsBadge")}
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] text-slate-900 sm:text-5xl">
              {t("pricing.addonsTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {t("pricing.addonsSubtitle")}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-white/80 bg-white/70 p-4 shadow-[0_20px_60px_rgba(79,70,229,0.1)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="relative min-w-0 flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("pricing.addonsSearch")}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pe-4 ps-11 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowIncluded((v) => !v)}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-bold transition ${
                  showIncluded
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                }`}
              >
                {showIncluded
                  ? t("pricing.addonsHideIncluded")
                  : t("pricing.addonsShowIncluded")}
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {categories.map((key) => {
                const active = activeCategory === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                      active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-300"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700"
                    }`}
                  >
                    {catLabel(key)}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold text-slate-500">
            {t("pricing.addonsCount", { count: filteredAddons.length })}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAddons.map((addon) => {
                const selected = selectedKeys.has(addon.key);
                const included = Boolean(addon.isIncluded);
                const selectable = !included;

                return (
                  <motion.button
                    layout={!reduceMotion}
                    key={addon.key}
                    type="button"
                    disabled={!selectable}
                    onClick={() => toggleAddon(addon.key, included)}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.28 }}
                    className={`group relative overflow-hidden rounded-[1.75rem] border p-5 text-start transition duration-300 ${
                      included
                        ? "cursor-default border-emerald-100 bg-emerald-50/40"
                        : selected
                          ? "border-indigo-300 bg-gradient-to-br from-violet-50 via-white to-cyan-50 shadow-[0_18px_50px_rgba(79,70,229,0.18)] ring-2 ring-indigo-200"
                          : "border-slate-200/90 bg-white/90 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_40px_rgba(79,70,229,0.12)]"
                    }`}
                  >
                    {addon.featured && !included && (
                      <span className="absolute end-4 top-4 rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-violet-700">
                        {t("pricing.addonsFeatured")}
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      <AddonIcon name={addon.icon} accent={addon.accent} />
                      <div className="min-w-0 flex-1 pe-8">
                        <h3 className="text-base font-black text-slate-900">
                          {addon.displayName}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {catLabel(addon.category)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {addon.displayDescription}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span
                        className={`text-sm font-black ${
                          included ? "text-emerald-700" : "text-indigo-700"
                        }`}
                      >
                        {included
                          ? t("pricing.addonsIncluded")
                          : addon.displayPrice}
                      </span>

                      <span
                        className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-black transition ${
                          included
                            ? "bg-emerald-100 text-emerald-700"
                            : selected
                              ? "bg-slate-900 text-white"
                              : "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100"
                        }`}
                      >
                        {included ? (
                          <>
                            <Check size={14} />
                            {t("pricing.addonsInPlan")}
                          </>
                        ) : selected ? (
                          <>
                            <Check size={14} />
                            {t("pricing.addonsAdded")}
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            {t("pricing.addonsAdd")}
                          </>
                        )}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredAddons.length === 0 && (
            <div className="mt-8 rounded-[2rem] border border-dashed border-slate-200 bg-white/60 px-6 py-16 text-center">
              <p className="text-base font-bold text-slate-500">
                {t("pricing.addonsEmpty")}
              </p>
            </div>
          )}

          <div className="mt-12 overflow-hidden rounded-[2rem] border border-indigo-100 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 p-8 text-center shadow-[0_24px_70px_rgba(79,70,229,0.16)] sm:p-10">
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
              {t("pricing.addonsCtaTitle")}
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              {t("pricing.addonsCtaText")}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={goToContactWithAddons}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3.5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                {t("pricing.addonsCtaButton")}
              </button>
              <Link
                to="/agents"
                className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/80 px-7 py-3.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5"
              >
                {t("pricing.addonsCtaAgents")}
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <AnimatePresence>
        {selectedKeys.size > 0 && (
          <motion.div
            initial={reduceMotion ? false : { y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-indigo-100 bg-white/95 px-4 py-4 shadow-[0_-16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900">
                  {t("pricing.addonsSelected", { count: selectedKeys.size })}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">
                  {selectedEstimate.min > 0
                    ? selectedEstimate.min === selectedEstimate.max
                      ? t("pricing.addonsEstimate", {
                          amount: `₪${selectedEstimate.min}`,
                        })
                      : t("pricing.addonsEstimateRange", {
                          min: `₪${selectedEstimate.min}`,
                          max: `₪${selectedEstimate.max}`,
                        })
                    : null}
                  {selectedEstimate.customCount > 0
                    ? ` · ${t("pricing.addonsCustomCount", {
                        count: selectedEstimate.customCount,
                      })}`
                    : null}
                  {selectedEstimate.min === 0 &&
                  selectedEstimate.customCount === 0
                    ? selectedAddons
                        .map((a) => a.displayName)
                        .slice(0, 3)
                        .join(" · ")
                    : null}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-slate-300"
                >
                  <X size={14} />
                  {t("pricing.addonsClear")}
                </button>
                <button
                  type="button"
                  onClick={goToContactWithAddons}
                  className="inline-flex h-11 items-center rounded-full bg-slate-900 px-5 text-sm font-black text-white shadow-lg transition hover:bg-slate-800"
                >
                  {t("pricing.addonsRequestQuote")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
