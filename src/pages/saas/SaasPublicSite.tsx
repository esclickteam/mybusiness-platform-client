import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api";
import ProductPublicLanding from "../../saas/ProductPublicLanding";
import TableflowGuest from "../../saas/TableflowGuest";
import { isHostedShellProduct } from "../../saas/productAccess";

type Site = {
  slug: string;
  templateSlug: string;
  status: string;
  businessName: string;
  content: Record<string, unknown>;
  language?: string;
  dir?: "rtl" | "ltr";
  productLoginUrl?: string;
};

export default function SaasPublicSite() {
  const { slug = "" } = useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "suspended" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    API.get(`/saas-marketplace/sites/${slug}`)
      .then((res) => {
        if (!alive) return;
        setSite(res.data.site);
        setState("ready");
      })
      .catch((err: unknown) => {
        if (!alive) return;
        const status = err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : 0;
        setState(status === 403 ? "suspended" : "missing");
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state === "loading") return <p style={{ padding: 24 }}>טוען…</p>;
  if (state === "suspended") return <p style={{ padding: 24 }}>המערכת מושהית. הנתונים נשמרים.</p>;
  if (!site) return <p style={{ padding: 24 }}>האתר לא נמצא.</p>;

  if (isHostedShellProduct(site.templateSlug)) {
    return <TableflowGuest content={site.content as never} language={site.language} />;
  }

  return <ProductPublicLanding site={site} />;
}
