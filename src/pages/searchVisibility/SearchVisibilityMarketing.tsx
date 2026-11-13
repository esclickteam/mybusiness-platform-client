import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { svCopy } from "./copy";
import "./searchVisibility.css";

export default function SearchVisibilityMarketing() {
  const { i18n } = useTranslation();
  const t = svCopy(i18n.language);
  return (
    <main className="search-visibility" dir={t.dir}>
      <Helmet>
        <title>{`${t.product} | Bizuply`}</title>
        <meta name="description" content={t.marketLead} />
      </Helmet>
      <div className="sv-wrap">
        <p className="sv-kicker">{t.kicker}</p>
        <h1>{t.marketTitle}</h1>
        <p className="sv-lead">{t.marketLead}</p>
        <p className="sv-row">
          <Link className="sv-link-button" to="/search-visibility">{t.scanCta}</Link>
        </p>
        <div className="sv-grid">
          <article className="sv-card"><h2>{t.seo}</h2><p>{t.seoBody}</p></article>
          <article className="sv-card"><h2>{t.geo}</h2><p>{t.geoBody}</p></article>
          <article className="sv-card"><h2>{t.aeo}</h2><p>{t.aeoBody}</p></article>
        </div>
        <div className="sv-grid" style={{ marginTop: 16 }}>
          <article className="sv-card"><h2>{t.what}</h2><p>{t.whatBody}</p></article>
          <article className="sv-card"><h2>{t.how}</h2><p>{t.howBody}</p></article>
          <article className="sv-card"><h2>{t.report}</h2><p>{t.reportBody}</p></article>
        </div>
        <p className="sv-note" style={{ marginTop: 16 }}>{t.limits}: {t.limitsBody}</p>
      </div>
    </main>
  );
}
