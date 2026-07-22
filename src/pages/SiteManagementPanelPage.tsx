import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Globe2,
  Loader2,
  Puzzle,
} from "lucide-react";

import { getMySite } from "../api/mySitesApi";
import {
  getSitePlugins,
  updateSitePlugins,
  type SitePluginDefinition,
} from "../api/sitePluginsApi";
import SitePluginStore from "../components/website/site-management/SitePluginStore";
import SiteBookingPanel from "../components/website/site-management/SiteBookingPanel";
import SitePaymentsPanel from "../components/website/site-management/SitePaymentsPanel";
import SiteMorningInvoicePanel from "../components/website/site-management/SiteMorningInvoicePanel";
import SiteGenericPluginPanel from "../components/website/site-management/SiteGenericPluginPanel";
import StoreProductsManager from "../components/store/StoreProductsManager";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import {
  getPluginAccent,
  getPluginIcon,
  getSectionIcon,
  PLUGIN_SECTION_MAP,
  SECTION_META,
  type SitePanelSection,
} from "../data/sitePluginNav";

const MANAGEMENT_PANEL_KEYS = new Set([
  "store",
  "booking",
  "payments",
  "invoices",
]);

export default function SiteManagementPanelPage() {
  const { businessId = "", siteId = "" } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingPlugins, setSavingPlugins] = useState(false);
  const [siteName, setSiteName] = useState("האתר שלי");
  const [sitePublished, setSitePublished] = useState(false);
  const [publicUrl, setPublicUrl] = useState("");
  const [catalog, setCatalog] = useState<SitePluginDefinition[]>([]);
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);
  const [detectedFromSite, setDetectedFromSite] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<SitePanelSection>("overview");
  const [error, setError] = useState("");

  const basePath = `/business/${businessId}/dashboard`;
  const editorHref = `${basePath}/website/sites/${siteId}/edit`;

  const loadPanel = useCallback(async () => {
    if (!siteId) return;

    setLoading(true);
    setError("");

    try {
      const [site, plugins] = await Promise.all([
        getMySite(siteId),
        getSitePlugins(siteId),
      ]);

      if (!site) {
        setError("האתר לא נמצא");
        return;
      }

      setSiteName(String(site.name || "האתר שלי"));
      setSitePublished(Boolean(site.published || site.status === "published"));
      setPublicUrl(String(site.publicUrl || ""));
      setCatalog(plugins.catalog);
      setEnabledPlugins(plugins.enabledPlugins);
      setDetectedFromSite(plugins.detectedFromSite || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "שגיאה בטעינת הפאנל");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    loadPanel();
  }, [loadPanel]);

  const enabledSet = useMemo(() => new Set(enabledPlugins), [enabledPlugins]);

  const navSections = useMemo(() => {
    const items: SitePanelSection[] = ["overview", "plugins"];

    enabledPlugins.forEach((key) => {
      if (!MANAGEMENT_PANEL_KEYS.has(key)) return;
      const section = PLUGIN_SECTION_MAP[key];
      if (section && !items.includes(section)) {
        items.push(section);
      }
    });

    return items;
  }, [enabledPlugins]);

  const activePluginDef = useMemo(() => {
    const pluginKey = SECTION_META[activeSection]?.pluginKey;
    if (!pluginKey) return null;
    return catalog.find((item) => item.key === pluginKey) || null;
  }, [activeSection, catalog]);

  const activeMeta = SECTION_META[activeSection];

  async function handleTogglePlugin(pluginKey: string, enabled: boolean) {
    const next = enabled
      ? [...enabledPlugins, pluginKey]
      : enabledPlugins.filter((key) => key !== pluginKey);

    setSavingPlugins(true);

    try {
      const result = await updateSitePlugins(siteId, next);
      setEnabledPlugins(result.enabledPlugins);
      setDetectedFromSite([]);

      if (enabled) {
        if (MANAGEMENT_PANEL_KEYS.has(pluginKey)) {
          const section = PLUGIN_SECTION_MAP[pluginKey];
          if (section) setActiveSection(section);
        }
      } else if (
        activeSection !== "overview" &&
        activeSection !== "plugins" &&
        SECTION_META[activeSection]?.pluginKey === pluginKey
      ) {
        setActiveSection("plugins");
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || "עדכון התוסף נכשל");
    } finally {
      setSavingPlugins(false);
    }
  }

  if (loading) {
    return <BizuplyLoader fullScreen label="טוען פאנל ניהול..." />;
  }

  if (error) {
    return (
      <div dir="rtl" className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-sm font-semibold text-rose-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate(`${basePath}/website`)}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
        >
          <ArrowRight size={16} />
          חזרה לאתרים שלי
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`${basePath}/website`)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
              aria-label="חזרה לאתרים שלי"
            >
              <ArrowRight size={16} />
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">
                  {siteName}
                </h1>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    sitePublished
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                      : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                  }`}
                >
                  {sitePublished ? "מפורסם" : "טיוטה"}
                </span>
              </div>
              {publicUrl ? (
                <p className="truncate text-xs text-slate-400">
                  {publicUrl.replace(/^https?:\/\//, "")}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to={editorHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
            >
              <ExternalLink size={14} />
              עורך
            </Link>
            {sitePublished && publicUrl ? (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
              >
                <Globe2 size={14} />
                אתר חי
              </a>
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] overflow-x-auto px-4 md:px-6">
          <nav className="flex min-w-max gap-1 border-t border-slate-100 pt-1">
            {navSections.map((section) => {
              const Icon = getSectionIcon(section);
              const meta = SECTION_META[section];
              const active = activeSection === section;

              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "text-violet-700"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon size={16} />
                  {meta.label}
                  {active ? (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet-600" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-6">
        {activeSection !== "overview" && activeSection !== "plugins" ? (
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">{activeMeta.label}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{activeMeta.description}</p>
          </div>
        ) : null}

        {activeSection === "overview" ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">תוספים פעילים</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {enabledPlugins.length}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">סטטוס אתר</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {sitePublished ? "מפורסם" : "טיוטה"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">זמין בחנות</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {catalog.length - enabledPlugins.length}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">ניהול מהיר</h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    גישה מהירה לתוספים והגדרות של האתר
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection("plugins")}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white transition hover:bg-violet-700"
                >
                  <Puzzle size={14} />
                  חנות תוספים
                </button>
              </div>

              {enabledPlugins.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {enabledPlugins.map((key) => {
                    const plugin = catalog.find((item) => item.key === key);
                    if (!plugin) return null;
                    const Icon = getPluginIcon(plugin.key);
                    const accent = getPluginAccent(plugin.key, plugin.accent);
                    const section = PLUGIN_SECTION_MAP[key];
                    const canManage = MANAGEMENT_PANEL_KEYS.has(key);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (canManage && section) setActiveSection(section);
                          else setActiveSection("plugins");
                        }}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-right transition hover:border-violet-200 hover:bg-white"
                      >
                        <div
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white"
                          style={{ background: accent }}
                        >
                          <Icon size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {plugin.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  עדיין לא הותקנו תוספים. פתחו את חנות התוספים כדי להתחיל.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {activeSection === "plugins" ? (
          <SitePluginStore
            catalog={catalog}
            enabledPlugins={enabledPlugins}
            detectedFromSite={detectedFromSite}
            saving={savingPlugins}
            onToggle={handleTogglePlugin}
          />
        ) : null}

        {activeSection === "store" && enabledSet.has("store") ? (
          <StoreProductsManager businessId={businessId} embedded />
        ) : null}

        {activeSection === "booking" && enabledSet.has("booking") ? (
          <SiteBookingPanel businessId={businessId} siteId={siteId} />
        ) : null}

        {activeSection === "payments" && enabledSet.has("payments") ? (
          <SitePaymentsPanel businessId={businessId} />
        ) : null}

        {activeSection === "invoices" && enabledSet.has("invoices") ? (
          <SiteMorningInvoicePanel businessId={businessId} />
        ) : null}

        {activePluginDef &&
        enabledSet.has(activePluginDef.key) &&
        !MANAGEMENT_PANEL_KEYS.has(activePluginDef.key) ? (
          <SiteGenericPluginPanel
            plugin={activePluginDef}
            editorHref={editorHref}
          />
        ) : null}
      </div>
    </div>
  );
}