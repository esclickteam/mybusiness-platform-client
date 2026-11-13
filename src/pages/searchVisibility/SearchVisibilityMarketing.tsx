import { useState, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../../api";
import { svCopy } from "./copy";
import "./searchVisibility.css";

type Preview = {
  host?: string;
  pages?: number;
  scores?: { seo?: { score?: number | null }; geo?: { score?: number | null }; aeo?: { score?: number | null }; disclaimer?: string };
  findings?: Array<{ ruleId: string; status: string; titleHe?: string; titleEn?: string }>;
  note?: string;
};

export default function SearchVisibilityMarketing() {
  const { i18n } = useTranslation();
  const t = svCopy(i18n.language);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);

  async function scan(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setPreview(null);
    try {
      const response = await API.post("/search-visibility/preview", { url });
      setPreview(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "הסריקה לא הושלמה");
    } finally {
      setBusy(false);
    }
  }

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
        <form className="sv-row" onSubmit={scan}>
          <input className="sv-input" aria-label={t.url} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" />
          <button className="sv-button" type="submit" disabled={busy || url.trim().length < 4}>{busy ? "…" : t.scanCta}</button>
        </form>
        {error ? <p className="sv-note">{error}</p> : null}
        {preview ? (
          <section className="sv-panel">
            <h2>{preview.host}</h2>
            <p>{t.pageCount}: {preview.pages ?? 0}</p>
            <p>SEO {preview.scores?.seo?.score ?? "—"} · GEO {preview.scores?.geo?.score ?? "—"} · AEO {preview.scores?.aeo?.score ?? "—"}</p>
            <p>{preview.scores?.disclaimer}</p>
            <p>{preview.note}</p>
            <ul>
              {(preview.findings || []).slice(0, 6).map((row) => (
                <li key={row.ruleId}>{i18n.language.startsWith("he") ? row.titleHe : row.titleEn} — {row.status === "render_required" ? t.renderRequired : row.status}</li>
              ))}
            </ul>
            <Link className="sv-link-button" to={`/search-visibility?url=${encodeURIComponent(url)}`}>{t.login}</Link>
          </section>
        ) : null}
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
