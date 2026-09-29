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

export default function SaasTemplateDemoPage() {
  const { slug = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const { t, dir, htmlLang } = useSaasLocale();
  const mode = modeOf(params.get("mode"));
  const [product, setProduct] = useState<SaasProduct | null>(null);
  const [blockedMode, setBlockedMode] = useState("");
  const [missing, setMissing] = useState(false);
  const blocked = blockedMode === mode;

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
    mode === "admin" ? product?.adminDemoUrl : mode === "customer" ? product?.customerDemoUrl : product?.demoSelectorUrl;
  const engine = isPublicDemoUrl(stored) ? String(stored) : "";
  const labels = {
    admin: t("saasMarket.templateDemo.admin"),
    customer: t("saasMarket.templateDemo.customer"),
    full: t("saasMarket.templateDemo.explore"),
  };

  return (
    <div className="saas-demo-shell" dir={dir} lang={htmlLang}>
      <SaasSeo title={product ? `${product.name} demo` : t("saasMarket.seoTitle")} description={product?.tagline || product?.shortDescription || ""} />
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
              onClick={() => setParams({ mode: item })}
            >
              {labels[item]}
            </button>
          ))}
        </div>
      </header>
      <div className="saas-demo-stage">
        {missing ? <p className="saas-demo-empty">{t("saasMarket.product.missing")}</p> : null}
        {engine && !blocked ? (
          <iframe
            title={product?.name || "demo"}
            src={engine}
            onLoad={(event) => {
              try {
                const href = event.currentTarget.contentWindow?.location?.href || "";
                if (!href || href === "about:blank") setBlockedMode(mode);
              } catch {
                setBlockedMode("");
              }
            }}
          />
        ) : (
          <div className="saas-demo-empty">
            {engine ? (
              <a href={engine}>{labels[mode]}</a>
            ) : (
              <p>{t("saasMarket.platforms.demoPreparing")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
