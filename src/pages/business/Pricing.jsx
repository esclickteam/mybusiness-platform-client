import React, { useMemo, useState, startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Bot,
  CalendarCheck2,
  Check,
  Globe,
  Handshake,
  Headset,
  Megaphone,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  PRICING_ADDONS,
  PRICING_CATEGORY_LABELS,
  PRICING_CATEGORY_ORDER,
} from "../../data/pricingAddonsData";
import {
  PRICING_PACKAGES,
  WEBSITE_ADDON,
} from "../../data/pricingPackagesData";

const ICON_MAP = {
  headset: Headset,
  "calendar-check": CalendarCheck2,
  handshake: Handshake,
  bot: Bot,
  sparkles: Sparkles,
  megaphone: Megaphone,
  message: MessageCircle,
  globe: Globe,
};

function AddonIcon({ name, accent }) {
  const Icon = ICON_MAP[name] || Sparkles;
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

function formatIls(amount) {
  return `₪${Number(amount).toLocaleString("he-IL")}`;
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
  const [websiteAddonByPlan, setWebsiteAddonByPlan] = useState({
    monthly: false,
    yearly: false,
  });

  const API_BASE = import.meta.env.VITE_API_URL;
  const userId = user?._id || user?.userId || user?.id;
  const websiteAddonLabel = isHe ? WEBSITE_ADDON.labelHe : WEBSITE_ADDON.labelEn;
  const websiteAddonHint = isHe ? WEBSITE_ADDON.hintHe : WEBSITE_ADDON.hintEn;

  const catLabel = (key) => {
    const entry = PRICING_CATEGORY_LABELS[key];
    if (!entry) return key;
    return isHe ? entry.he : entry.en;
  };

  const toggleWebsiteAddon = (planType) => {
    setWebsiteAddonByPlan((prev) => ({
      ...prev,
      [planType]: !prev[planType],
    }));
  };

  const handleCheckout = async (plan) => {
    const wantsWebsiteAddon = Boolean(
      plan.allowsWebsiteAddon && websiteAddonByPlan[plan.type]
    );

    if (!plan.checkoutPlan) {
      navigate("/contact", {
        state: {
          prefillMessage: t("pricing.websiteContactMessage"),
        },
      });
      return;
    }

    // Website add-on is a one-time ILS charge — collect via contact for now
    if (wantsWebsiteAddon) {
      navigate("/contact", {
        state: {
          prefillMessage: t("pricing.packageWithWebsiteContactMessage", {
            package: plan.name,
            price: formatIls(plan.price),
            period: plan.pricePeriod,
            websitePrice: formatIls(WEBSITE_ADDON.price),
          }),
        },
      });
      return;
    }

    try {
      setLoadingPlan(plan.checkoutPlan);

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
          plan: plan.checkoutPlan,
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

  const packages = useMemo(
    () =>
      PRICING_PACKAGES.map((pkg) => ({
        ...pkg,
        name: isHe ? pkg.nameHe : pkg.nameEn,
        badge: isHe ? pkg.badgeHe : pkg.badgeEn,
        description: isHe ? pkg.descriptionHe : pkg.descriptionEn,
        note: isHe ? pkg.noteHe : pkg.noteEn,
        button: isHe ? pkg.buttonHe : pkg.buttonEn,
        pricePeriod: isHe ? pkg.pricePeriodHe : pkg.pricePeriodEn,
        features: isHe ? pkg.featuresHe : pkg.featuresEn,
      })),
    [isHe]
  );

  const categories = useMemo(
    () => ["all", ...PRICING_CATEGORY_ORDER],
    []
  );

  const filteredAddons = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRICING_ADDONS.filter((addon) => {
      if (activeCategory !== "all" && addon.category !== activeCategory) {
        return false;
      }
      const name = isHe ? addon.name : addon.nameEn;
      const description = isHe ? addon.description : addon.descriptionEn;
      if (!q) return true;
      return (
        name.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q) ||
        addon.key.toLowerCase().includes(q)
      );
    }).map((addon) => ({
      ...addon,
      displayName: isHe ? addon.name : addon.nameEn,
      displayDescription: isHe ? addon.description : addon.descriptionEn,
      displayPrice: isHe ? addon.priceLabel : addon.priceLabelEn,
    }));
  }, [activeCategory, query, isHe]);

  const selectedAddons = useMemo(
    () =>
      PRICING_ADDONS.filter((a) => selectedKeys.has(a.key)).map((addon) => ({
        ...addon,
        displayName: isHe ? addon.name : addon.nameEn,
      })),
    [selectedKeys, isHe]
  );

  const toggleAddon = (key) => {
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#ffffff_0%,#f7f8ff_42%,#eef3ff_76%,#ffffff_100%)] text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-200/35 blur-3xl" />
        <div className="absolute -right-40 top-80 h-[420px] w-[420px] rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -left-40 top-[680px] h-[420px] w-[420px] rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#6366f1_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.08]" />
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

        {/* Service packages */}
        <section className="mx-auto mt-16 grid max-w-6xl gap-7 lg:grid-cols-3">
          {packages.map((plan, index) => {
            const isLoading =
              plan.checkoutPlan != null && loadingPlan === plan.checkoutPlan;
            const websiteAddonChecked = Boolean(
              plan.allowsWebsiteAddon && websiteAddonByPlan[plan.type]
            );

            return (
              <motion.article
                key={plan.type}
                {...fadeUp}
                transition={{
                  duration: 0.55,
                  delay: reduceMotion ? 0 : 0.06 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative overflow-hidden rounded-[2.25rem] border p-3 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                  plan.highlighted
                    ? "border-indigo-200 bg-gradient-to-br from-teal-100/80 via-violet-100 to-sky-100 shadow-[0_30px_100px_rgba(79,70,229,0.26)] lg:scale-[1.02]"
                    : "border-white/80 bg-white/75 shadow-[0_24px_80px_rgba(79,70,229,0.12)]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute start-6 top-6 z-20 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wide text-indigo-700 shadow-xl">
                    {t("pricing.mostPopular")}
                  </div>
                )}

                <div
                  className={`relative flex h-full flex-col rounded-[1.85rem] border p-6 sm:p-7 ${
                    plan.highlighted
                      ? "border-white/50 bg-white/55"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="relative flex flex-1 flex-col text-start">
                    <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-3.5 py-1.5 text-sm font-black text-indigo-700">
                      {plan.badge}
                    </div>

                    <h2 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                      {plan.name}
                    </h2>

                    <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
                      {plan.description}
                    </p>

                    <div className="mt-7 flex items-end gap-2">
                      <span className="text-5xl font-black tracking-[-0.05em] sm:text-6xl">
                        {formatIls(plan.price)}
                      </span>
                      <span className="pb-2 text-sm font-black text-slate-500">
                        {plan.pricePeriod}
                      </span>
                    </div>

                    <div className="mt-4 rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-700">
                      {plan.note}
                    </div>

                    <div className="mt-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                    <ul className="mt-6 grid gap-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 text-[10px] text-white">
                            ✓
                          </span>
                          <span className="text-sm font-bold leading-5 text-slate-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {plan.allowsWebsiteAddon && (
                      <label
                        className={`mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 transition ${
                          websiteAddonChecked
                            ? "border-indigo-300 bg-indigo-50/80 shadow-sm"
                            : "border-slate-200 bg-slate-50/70 hover:border-indigo-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={websiteAddonChecked}
                          onChange={() => toggleWebsiteAddon(plan.type)}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-black leading-5 text-slate-900">
                            {websiteAddonLabel}
                          </span>
                          <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">
                            {websiteAddonHint}
                          </span>
                        </span>
                      </label>
                    )}

                    {websiteAddonChecked && (
                      <p className="mt-3 text-sm font-black text-indigo-700">
                        {t("pricing.websiteAddonSelectedNote", {
                          packagePrice: formatIls(plan.price),
                          period: plan.pricePeriod,
                          websitePrice: formatIls(WEBSITE_ADDON.price),
                        })}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handleCheckout(plan)}
                      disabled={isLoading}
                      className={`group mt-auto inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-sm font-black shadow-xl transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:text-base ${
                        plan.allowsWebsiteAddon ? "mt-6" : "mt-8"
                      } ${
                        plan.highlighted
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "border border-violet-200 bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 text-slate-900"
                      }`}
                    >
                      {isLoading ? t("pricing.processing") : plan.button}
                      {!isLoading && (
                        <span className="ms-2 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                          →
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* Additional BizUply business services */}
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

                return (
                  <motion.button
                    layout={!reduceMotion}
                    key={addon.key}
                    type="button"
                    onClick={() => toggleAddon(addon.key)}
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.28 }}
                    className={`group relative overflow-hidden rounded-[1.75rem] border p-5 text-start transition duration-300 ${
                      selected
                        ? "border-indigo-300 bg-gradient-to-br from-violet-50 via-white to-cyan-50 shadow-[0_18px_50px_rgba(79,70,229,0.18)] ring-2 ring-indigo-200"
                        : "border-slate-200/90 bg-white/90 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_16px_40px_rgba(79,70,229,0.12)]"
                    }`}
                  >
                    {addon.featured && (
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

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                      {addon.displayDescription}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-indigo-700">
                        {addon.displayPrice}
                      </span>

                      <span
                        className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-black transition ${
                          selected
                            ? "bg-slate-900 text-white"
                            : "bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100"
                        }`}
                      >
                        {selected ? (
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
                  {selectedAddons.map((a) => a.displayName).join(" · ")}
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
