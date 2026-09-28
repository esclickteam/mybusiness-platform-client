import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchMarketplace } from "../../saas/api";
import SaasScreenMock from "../../saas/SaasScreenMock";
import {
  filterProducts,
  formatUsd,
  MARKETPLACE_CATEGORIES,
  type SaasProduct,
} from "../../saas/logic";
import {
  GhostButton,
  PrimaryButton,
  SaasFooter,
  SaasHeader,
  SaasSeo,
} from "../../saas/SaasWidgets";
import "../../saas/saas.css";

const TRUST = [
  ["Fully Built & Tested", "Ready to launch"],
  ["White Label", "Your brand, your business"],
  ["Save on Development", "Skip months of custom development"],
];

export default function SaasMarketplacePage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const [products, setProducts] = useState<SaasProduct[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchMarketplace()
      .then((data) => {
        if (!active) return;
        setProducts(data.products || []);
        setError("");
      })
      .catch(() => {
        if (active) setError("The marketplace could not be loaded. Refresh and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => filterProducts(products, category), [products, category]);
  const hero = products.find((item) => item.slug === "serviceflow") || products[0];

  function setCategory(next: string) {
    const query = new URLSearchParams(params);
    if (!next || next === "all") query.delete("category");
    else query.set("category", next);
    setParams(query, { replace: true });
  }

  return (
    <div className="saas-market min-h-screen" dir="ltr" lang="en">
      <SaasSeo
        title="Ready-to-Launch SaaS Platforms | Bizuply"
        description="Launch your own software business without spending months and tens of thousands of dollars on custom development."
      />
      <SaasHeader />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="saas-rise">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6D4AFF]">SaaS Marketplace</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.05]">
              Ready-to-Launch SaaS Platforms
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Launch your own software business without spending months and tens of thousands of dollars on custom development.
            </p>
            <p className="mt-4 text-base font-semibold text-slate-800">
              Fully built. White-label. Multi-tenant. Ready to sell.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryButton href="#platforms">Browse SaaS Platforms</PrimaryButton>
              <GhostButton href="#how-it-works">How It Works</GhostButton>
            </div>
          </div>
          <div className="saas-rise relative">
            {hero ? (
              <SaasScreenMock
                screen={{ key: "dashboard", label: "Dashboard", imageUrl: hero.mainImageUrl }}
                accent={hero.accent}
                accentSecondary={hero.accentSecondary}
                productName={hero.name}
              />
            ) : (
              <div className="h-72 rounded-[28px] bg-white shadow-sm" />
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {TRUST.map(([title, text]) => (
            <article key={title} className="rounded-3xl border border-white bg-white px-5 py-6 shadow-sm">
              <h2 className="text-lg font-black">{title}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">{text}</p>
            </article>
          ))}
        </section>

        <section id="platforms" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
              All Systems
            </FilterChip>
            {MARKETPLACE_CATEGORIES.map((item) => (
              <FilterChip
                key={item.id}
                active={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </FilterChip>
            ))}
          </div>

          {error ? <p className="mt-8 text-sm font-semibold text-rose-600">{error}</p> : null}
          {loading ? <p className="mt-8 text-sm font-semibold text-slate-500">Loading platforms…</p> : null}
          {!loading && !error && visible.length === 0 ? (
            <p className="mt-8 text-sm font-semibold text-slate-500">No platforms in this category yet.</p>
          ) : null}

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {visible.map((product) => (
              <article key={product.slug} className="saas-card overflow-hidden rounded-[28px] border border-white bg-white shadow-sm">
                <div className="relative h-56 bg-slate-50">
                  <SaasScreenMock
                    framed={false}
                    screen={{
                      key: "dashboard",
                      label: "Dashboard",
                      imageUrl: product.mainImageUrl || product.screenshots?.[0]?.imageUrl,
                    }}
                    accent={product.accent}
                    accentSecondary={product.accentSecondary}
                    productName={product.name}
                  />
                  {product.badge ? (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6D4AFF]">{product.categoryLabel}</p>
                  <h3 className="mt-2 text-2xl font-black">{product.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-black">{formatUsd(product.priceUsd)}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        Estimated custom development: {product.estimatedDevCostLabel}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link to={`/saas/${product.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-slate-950 px-4 text-sm font-bold text-white">
                      View Platform
                    </Link>
                    <a
                      href={product.demoUrl || `/saas/${product.slug}#gallery`}
                      className="inline-flex min-h-11 items-center rounded-full border border-slate-200 px-4 text-sm font-bold text-slate-800"
                      {...(product.demoUrl ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      Live Demo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="text-3xl font-black tracking-tight">How It Works</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["1", "Choose a platform", "Pick a ready-to-launch SaaS that matches the market you want to serve."],
              ["2", "Make it yours", "Apply your logo, colors, domain, and subscription prices."],
              ["3", "Get the codebase", "Source code, super admin, and documentation come with the platform."],
              ["4", "Start selling", "Offer the software to businesses under your own brand."],
            ].map(([step, title, text]) => (
              <li key={step} className="rounded-3xl bg-white p-5 shadow-sm">
                <span className="text-sm font-black text-[#6D4AFF]">{step}</span>
                <h3 className="mt-2 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SaasFooter />
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-gradient-to-r from-[#5B4DFF] to-[#7C4DFF] text-white shadow"
          : "bg-white text-slate-600 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
