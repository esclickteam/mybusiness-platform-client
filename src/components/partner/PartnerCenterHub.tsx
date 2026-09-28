import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Copy,
  Download,
  Eye,
  Heart,
  Languages,
  Search,
  Share2,
  Star,
  Plus,
} from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { coerceSupportedLanguage, getTextDirection } from "../../i18n/localeUtils";
import { LANGUAGE_META } from "../../i18n/languages";
import {
  archivePartnerCenterMaterial,
  fetchPartnerCenterKpis,
  fetchPartnerCenterMaterial,
  fetchPartnerCenterMaterials,
  reseedPartnerCenter,
  savePartnerCenterKpi,
  savePartnerCenterMaterial,
  sharePartnerCenterMaterial,
  togglePartnerCenterFavorite,
  type PartnerMaterial,
} from "../../lib/partnerCenterApi";

const HUB = [
  { id: "training", key: "hubTraining", categories: ["learn_bizuply", "sales_training"] },
  { id: "sales", key: "hubSales", categories: ["sales_training", "scripts_templates", "demo_presentation"] },
  { id: "marketing", key: "hubMarketing", categories: ["marketing_materials"] },
  { id: "videos", key: "hubVideos", categories: ["videos", "learn_bizuply"] },
  { id: "industry", key: "hubIndustry", categories: ["industry_kits"] },
  { id: "brand", key: "hubBrand", categories: ["brand_assets"] },
] as const;

function downloadText(name: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name.endsWith(".md") ? name : `${name}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PartnerCenterHub({
  admin = false,
}: {
  admin?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const locale = coerceSupportedLanguage(i18n.language);
  const dir = getTextDirection(locale);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [industry, setIndustry] = useState("");
  const [assetType, setAssetType] = useState("");
  const [audience, setAudience] = useState("");
  const [status, setStatus] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [items, setItems] = useState<PartnerMaterial[]>([]);
  const [meta, setMeta] = useState<Record<string, string[]>>({});
  const [counts, setCounts] = useState<{ total: number; byCategory: Record<string, number> }>({
    total: 0,
    byCategory: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<PartnerMaterial | null>(null);
  const [editor, setEditor] = useState<PartnerMaterial | null>(null);
  const [toast, setToast] = useState("");
  const [kpis, setKpis] = useState<any[]>([]);
  const [kpiForm, setKpiForm] = useState({
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    periodEnd: new Date().toISOString().slice(0, 10),
    leadsContacted: 0,
    replies: 0,
    qualifiedLeads: 0,
    demosBooked: 0,
    demosCompleted: 0,
    followUps: 0,
    customersClosed: 0,
    activeCustomers: 0,
  });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPartnerCenterMaterials(
        {
          locale,
          q: q || undefined,
          category: category || undefined,
          industry: industry || undefined,
          assetType: assetType || undefined,
          audience: audience || undefined,
          status: admin ? status || undefined : undefined,
          favorites: !admin && favoritesOnly ? "1" : undefined,
        },
        admin
      );
      setItems(data.items || []);
      setMeta(data.meta || {});
      setCounts({ total: data.counts?.total || 0, byCategory: data.counts?.byCategory || {} });
      if (!admin) {
        const kpi = await fetchPartnerCenterKpis().catch(() => ({ items: [] }));
        setKpis(kpi.items || []);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, category, industry, assetType, audience, status, favoritesOnly]);

  const hubCounts = useMemo(() => {
    return HUB.map((hub) => ({
      ...hub,
      count: hub.categories.reduce((sum, cat) => sum + (counts.byCategory[cat] || 0), 0),
    }));
  }, [counts]);

  function notify(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  }

  async function onCopy(item: PartnerMaterial) {
    await navigator.clipboard.writeText(item.body || item.script || item.title);
    notify(t("partnerCenter.copied"));
  }

  async function onShare(item: PartnerMaterial) {
    if (item.audience !== "client_facing") {
      notify(t("partnerCenter.shareClientOnly"));
      return;
    }
    const share = await sharePartnerCenterMaterial(item.id, locale, admin);
    const url = `${window.location.origin}/partner-materials/${share.token}`;
    await navigator.clipboard.writeText(url);
    notify(t("partnerCenter.shareCopied"));
  }

  async function onFavorite(item: PartnerMaterial) {
    const result = await togglePartnerCenterFavorite(item.id);
    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, favorite: result.favorite } : row)));
  }

  return (
    <div dir={dir} className="mx-auto max-w-[1480px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7C3AED]">
            Bizuply Partner
          </p>
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{t("partnerCenter.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm font-bold text-slate-500">{t("partnerCenter.subtitle")}</p>
          {admin ? <p className="mt-1 text-xs font-bold text-violet-700">{t("partnerCenter.adminHint")}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSwitcher />
          {admin ? (
            <>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black"
                onClick={() => reseedPartnerCenter(false).then(load)}
              >
                {t("partnerCenter.reseed")}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white"
                onClick={() =>
                  setEditor({
                    id: "",
                    slug: "",
                    category: "scripts_templates",
                    assetType: "document",
                    audience: "internal_partner_training",
                    industry: "all",
                    status: "draft",
                    visibility: "partners",
                    featured: false,
                    version: 1,
                    sortOrder: 100,
                    locale,
                    title: "",
                    description: "",
                    body: "",
                    locales: Object.fromEntries(
                      LANGUAGE_META.map((l) => [
                        l.code,
                        { title: l.nativeLabel, description: "", body: "", script: "" },
                      ])
                    ),
                  } as PartnerMaterial)
                }
              >
                <Plus className="h-4 w-4" />
                {t("partnerCenter.create")}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {hubCounts.map((hub) => (
          <button
            key={hub.id}
            type="button"
            onClick={() => setCategory(hub.categories[0])}
            className="rounded-[16px] border border-slate-100 bg-white p-4 text-start shadow-[0_4px_20px_rgba(15,23,42,0.05)]"
          >
            <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">{t(`partnerCenter.${hub.key}`)}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{hub.count}</p>
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-[16px] border border-slate-100 bg-white p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 inset-inline-start-3" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") load();
            }}
            placeholder={t("partnerCenter.search")}
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pe-3 ps-10 text-sm font-bold"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            ["category", category, setCategory, meta.CATEGORIES],
            ["industry", industry, setIndustry, meta.INDUSTRIES],
            ["assetType", assetType, setAssetType, meta.ASSET_TYPES],
            ["audience", audience, setAudience, meta.AUDIENCES],
            ...(admin ? [["status", status, setStatus, meta.STATUSES] as const] : []),
          ].map(([key, value, setter, options]) => (
            <select
              key={String(key)}
              value={String(value || "")}
              onChange={(e) => (setter as (v: string) => void)(e.target.value)}
              className="h-10 min-w-[140px] rounded-2xl border border-slate-200 bg-white px-3 text-xs font-black"
              aria-label={t(`partnerCenter.${key}`)}
            >
              <option value="">{t(`partnerCenter.${key}`)} — {t("partnerCenter.all")}</option>
              {(options || []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}
          {!admin ? (
            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              className={`h-10 rounded-2xl px-3 text-xs font-black ${favoritesOnly ? "bg-violet-100 text-violet-800" : "border border-slate-200"}`}
            >
              {t("partnerCenter.favorites")}
            </button>
          ) : null}
          <button type="button" onClick={load} className="h-10 rounded-2xl bg-slate-900 px-4 text-xs font-black text-white">
            {t("partnerCenter.search")}
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-bold text-rose-600">{error}</p> : null}
      {loading ? <p className="text-sm font-bold text-slate-500">…</p> : null}
      {!loading && items.length === 0 ? <p className="text-sm font-bold text-slate-500">{t("partnerCenter.empty")}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="flex flex-col rounded-[16px] border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${item.audience === "client_facing" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                {item.audience === "client_facing" ? t("partnerCenter.clientFacing") : t("partnerCenter.internal")}
              </span>
              {item.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 text-[11px] font-black text-violet-800">
                  <Star className="h-3 w-3" /> {t("partnerCenter.featured")}
                </span>
              ) : null}
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{item.category}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{item.assetType}</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">{item.title}</h2>
            <p className="mt-1 line-clamp-3 text-sm font-bold text-slate-500">{item.description}</p>
            <p className="mt-3 text-[11px] font-bold text-slate-400">
              {t("partnerCenter.lastUpdated")}: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(locale) : "—"} · {t("partnerCenter.version")} {item.version}
              {item.estimatedDurationMinutes ? ` · ${t("partnerCenter.duration", { n: item.estimatedDurationMinutes })}` : ""}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => setPreview(item)}>
                <Eye className="h-3.5 w-3.5" /> {t("partnerCenter.preview")}
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onCopy(item)}>
                <Copy className="h-3.5 w-3.5" /> {t("partnerCenter.copy")}
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
                onClick={() => downloadText(item.slug || item.title, item.body || item.script || "")}
              >
                <Download className="h-3.5 w-3.5" /> {t("partnerCenter.download")}
              </button>
              <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onShare(item)}>
                <Share2 className="h-3.5 w-3.5" /> {t("partnerCenter.share")}
              </button>
              {!admin ? (
                <button type="button" className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onFavorite(item)}>
                  <Heart className={`h-3.5 w-3.5 ${item.favorite ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>
              ) : (
                <>
                  <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={async () => setEditor(await fetchPartnerCenterMaterial(item.id, locale, true))}>
                    {t("partnerCenter.edit")}
                  </button>
                  <button type="button" className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-black text-rose-700" onClick={() => archivePartnerCenterMaterial(item.id).then(load)}>
                    {t("partnerCenter.archive")}
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {!admin ? (
        <section className="mt-10 rounded-[16px] border border-slate-100 bg-white p-5">
          <h2 className="text-xl font-black">{t("partnerCenter.kpiTitle")}</h2>
          <p className="mb-4 text-sm font-bold text-slate-500">{t("partnerCenter.kpiHint")}</p>
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await savePartnerCenterKpi(kpiForm);
              const data = await fetchPartnerCenterKpis();
              setKpis(data.items || []);
            }}
          >
            {Object.entries(kpiForm).map(([key, value]) => (
              <label key={key} className="text-xs font-black text-slate-500">
                {key}
                <input
                  className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-900"
                  type={key.startsWith("period") ? "date" : "number"}
                  value={value as any}
                  onChange={(e) => setKpiForm((prev) => ({ ...prev, [key]: key.startsWith("period") ? e.target.value : Number(e.target.value) }))}
                />
              </label>
            ))}
            <button type="submit" className="h-10 self-end rounded-2xl bg-[#6D28D9] px-4 text-sm font-black text-white">
              {t("partnerCenter.save")}
            </button>
          </form>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-start text-sm">
              <thead>
                <tr className="text-xs font-black text-slate-500">
                  <th className="p-2">period</th>
                  <th className="p-2">reply%</th>
                  <th className="p-2">qualify%</th>
                  <th className="p-2">show%</th>
                  <th className="p-2">close%</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 font-bold">
                    <td className="p-2">{String(row.periodStart).slice(0, 10)}</td>
                    <td className="p-2">{row.rates?.replyRate ?? "—"}</td>
                    <td className="p-2">{row.rates?.qualifyRate ?? "—"}</td>
                    <td className="p-2">{row.rates?.demoShowRate ?? "—"}</td>
                    <td className="p-2">{row.rates?.closeRate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {preview ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6" onClick={() => setPreview(null)}>
          <div
            dir={dir}
            className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white p-6 sm:rounded-[28px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[#7C3AED]">
                  {preview.audience === "client_facing" ? t("partnerCenter.clientFacing") : t("partnerCenter.internal")}
                </p>
                <h3 className="text-2xl font-black">{preview.title}</h3>
              </div>
              <button type="button" className="rounded-xl px-3 py-2 text-sm font-black" onClick={() => setPreview(null)}>
                {t("partnerCenter.cancel")}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-700">{preview.body || preview.script}</pre>
          </div>
        </div>
      ) : null}

      {editor && admin ? (
        <MaterialEditor
          item={editor}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            load();
          }}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-4 inset-inline-end-4 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function MaterialEditor({
  item,
  onClose,
  onSaved,
}: {
  item: PartnerMaterial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(item.locale || "en");
  const [form, setForm] = useState<PartnerMaterial>(item);
  const [busy, setBusy] = useState(false);

  function patchLocale(lng: string, patch: Record<string, string>) {
    setForm((prev) => ({
      ...prev,
      locales: {
        ...(prev.locales || {}),
        [lng]: { ...(prev.locales?.[lng] || {}), ...patch },
      },
    }));
  }

  async function save() {
    setBusy(true);
    try {
      await savePartnerCenterMaterial(
        {
          slug: form.slug,
          category: form.category,
          assetType: form.assetType,
          audience: form.audience,
          industry: form.industry,
          status: form.status,
          visibility: form.visibility,
          featured: form.featured,
          fileUrl: form.fileUrl,
          videoUrl: form.videoUrl,
          locales: form.locales,
        },
        form.id || undefined
      );
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  const current = form.locales?.[tab] || {};

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 sm:items-center sm:p-6">
      <div className="max-h-[94dvh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-white p-6 sm:rounded-[28px]">
        <h3 className="mb-4 text-xl font-black">{form.id ? t("partnerCenter.edit") : t("partnerCenter.create")}</h3>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <input className="h-11 rounded-xl border px-3 text-sm font-bold" placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <select className="h-11 rounded-xl border px-3 text-sm font-bold" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as any })}>
            <option value="internal_partner_training">{t("partnerCenter.internal")}</option>
            <option value="client_facing">{t("partnerCenter.clientFacing")}</option>
          </select>
          <input className="h-11 rounded-xl border px-3 text-sm font-bold" placeholder="file URL" value={form.fileUrl || ""} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} />
          <input className="h-11 rounded-xl border px-3 text-sm font-bold" placeholder="video URL" value={form.videoUrl || ""} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {LANGUAGE_META.map((lng) => (
            <button
              key={lng.code}
              type="button"
              onClick={() => setTab(lng.code)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${tab === lng.code ? "bg-[#6D28D9] text-white" : "bg-slate-100"}`}
            >
              <Languages className="h-3 w-3" /> {lng.nativeLabel}
            </button>
          ))}
        </div>
        <input
          className="mb-2 h-11 w-full rounded-xl border px-3 text-sm font-black"
          placeholder="title"
          value={current.title || ""}
          onChange={(e) => patchLocale(tab, { title: e.target.value })}
        />
        <textarea
          className="mb-4 min-h-[220px] w-full rounded-xl border p-3 text-sm font-bold"
          placeholder="body"
          value={current.body || current.script || ""}
          onChange={(e) => patchLocale(tab, { body: e.target.value, script: e.target.value })}
        />
        <div className="flex gap-2">
          <button type="button" disabled={busy} className="rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" onClick={save}>
            {t("partnerCenter.save")}
          </button>
          <button type="button" className="rounded-2xl border px-4 py-2 text-sm font-black" onClick={onClose}>
            {t("partnerCenter.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
