import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { fetchSaasProduct } from "../../saas/api";
import { SaasSeo, useSaasLocale } from "../../saas/chrome";
import { isPublicDemoUrl, type SaasProduct } from "../../saas/logic";
import "../../saas/saas.css";

const MODES = ["admin", "customer", "full"] as const;
type DemoMode = (typeof MODES)[number];

function modeOf(value: string | null): DemoMode {
  if (value === "admin" || value === "customer" || value === "full") return value;
  return "full";
}

/**
 * Bizuply is only the launcher. Cross-site iframes block SameSite=Lax
 * BeautyFlow auth cookies ("Demo login failed"). Prefer top-level navigation
 * into the real BeautyFlow demo host.
 */
export default function SaasTemplateDemoPage() {
  const { slug = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const { t, dir, htmlLang } = useSaasLocale();
  const mode = modeOf(params.get("mode"));
  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [missing, setMissing] = useState(false);
  const [launchError, setLaunchError] = useState("");
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchSaasProduct(slug)
      .then((data) => {
        if (!alive) return;
        if (data.product?.kind !== "template") {
          setProduct(null);
          setMissing(true);
          return;
        }
        setProduct(data.product);
        setMissing(false);
      })
      .catch(() => {
        if (alive) setMissing(true);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const stored =
    mode === "admin"
      ? product?.adminDemoUrl
      : mode === "customer"
        ? product?.customerDemoUrl
        : product?.demoSelectorUrl;
  const engine = isPublicDemoUrl(stored) ? String(stored) : "";

  useEffect(() => {
    if (!engine || launching) return;
    setLaunching(true);
    setLaunchError("");
    try {
      // Top-level navigation so BeautyFlow can set session cookies.
      window.location.replace(engine);
    } catch {
      setLaunchError(t("saasMarket.platforms.demoPreparing"));
      setLaunching(false);
    }
  }, [engine, launching, t]);

  const labels = {
    admin: t("saasMarket.templateDemo.admin"),
    customer: t("saasMarket.templateDemo.customer"),
    full: t("saasMarket.templateDemo.explore"),
  };

  return (
    <div className="saas-demo-shell" dir={dir} lang={htmlLang}>
      <SaasSeo
        title={product ? `${product.name} demo` : t("saasMarket.seoTitle")}
        description={product?.tagline || product?.shortDescription || ""}
      />
      <header className="saas-demo-bar">
        <Link to="/saas">{t("saasMarket.showcase.backToMarketplace")}</Link>
        <strong>{product?.name || ""}</strong>
        <span className="saas-demo-pill">{t("saasMarket.showcase.demoMode")}</span>
        <div className="saas-demo-modes">
          {MODES.map((item) => (
            <button
              key={item}
              type="button"
              className={item === mode ? "is-on" : ""}
              onClick={() => {
                setLaunching(false);
                setParams({ mode: item });
              }}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      </header>
      <div className="saas-demo-stage">
        <div className="saas-demo-empty">
          {missing ? <p>{t("saasMarket.product.missing")}</p> : null}
          {!missing && engine ? (
            <>
              <p>{launching ? t("saasMarket.platforms.watchDemo") : labels[mode]}</p>
              <p className="mt-2 text-sm opacity-80">
                {t("saasMarket.platforms.interactiveDemo")}
              </p>
              <a className="mt-4 inline-block rounded-full bg-[#24124d] px-5 py-3 text-sm font-black text-white" href={engine}>
                {labels[mode]}
              </a>
              {launchError ? <p className="mt-3 text-sm text-red-600">{launchError}</p> : null}
            </>
          ) : null}
          {!missing && !engine ? <p>{t("saasMarket.platforms.demoPreparing")}</p> : null}
        </div>
      </div>
    </div>
  );
}
