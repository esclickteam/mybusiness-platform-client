type LandingSite = {
  businessName?: string;
  templateSlug?: string;
  language?: string;
  dir?: "rtl" | "ltr";
  productLoginUrl?: string;
  content?: Record<string, unknown>;
};

const NAMES: Record<string, string> = {
  beautyflow: "BeautyFlow",
  "global-properties": "Global Properties",
  dinevo: "Dinevo",
  cliny: "Cliny",
};

export default function ProductPublicLanding({ site }: { site: LandingSite }) {
  const branding = (site.content?.branding || {}) as Record<string, string>;
  const page = (site.content?.site || {}) as Record<string, string>;
  const productName = NAMES[site.templateSlug || ""] || site.templateSlug || "";
  const loginHref = site.productLoginUrl || "";
  return (
    <main dir={site.dir || "rtl"} style={{ maxWidth: 720, margin: "0 auto", padding: 32 }}>
      {branding.logo ? <img src={branding.logo} alt="" style={{ height: 56 }} /> : null}
      <p style={{ fontWeight: 800, letterSpacing: 0.4 }}>{productName}</p>
      <h1 style={{ color: branding.primaryColor }}>{branding.businessName || site.businessName}</h1>
      <p>{page.homeBody || branding.tagline}</p>
      {loginHref ? (
        <a
          href={loginHref}
          rel="noreferrer"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 18px",
            borderRadius: 999,
            background: "#24124d",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          כניסה למערכת
        </a>
      ) : null}
    </main>
  );
}
