import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Globe2,
  Layers,
  Puzzle,
  Sparkles,
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
import StoreProductsManager from "../components/store/StoreProductsManager";
import BizuplyLoader from "../components/ui/BizuplyLoader";
import { PLUGIN_PANEL_MAP } from "../components/website/site-management/plugins/pluginPanels";
import SiteDynamicPluginPanel from "../components/website/site-management/plugins/SiteDynamicPluginPanel";
import { btnPrimary, btnSecondary } from "../components/website/site-management/siteManagementUi";
import {
  getPluginAccent,
  getPluginIcon,
  getSectionIcon,
  getSectionMetaForPlugin,
  PLUGIN_SECTION_MAP,
  resolvePluginSection,
  SECTION_META,
  type SitePanelSection,
} from "../data/sitePluginNav";

const CORE_PLUGIN_KEYS = new Set(["store", "booking", "payments", "invoices"]);

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
      const section = resolvePluginSection(key);
      if (section && !items.includes(section)) {
        items.push(section);
      }
    });

    return items;
  }, [enabledPlugins]);

  const activeMeta = getSectionMetaForPlugin(activeSection, catalog);

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
        const section = resolvePluginSection(pluginKey);
        if (section) setActiveSection(section);
      } else if (
        activeSection !== "overview" &&
        activeSection !== "plugins" &&
        (activeMeta.pluginKey === pluginKey ||
          resolvePluginSection(pluginKey) === activeSection)
      ) {
        setActiveSection("plugins");
      }

      const hints = result.editorHints || [];
      const storeHint = hints.find((h) => h.action === "add-products-page");
      if (storeHint && enabled) {
        const go = window.confirm(
          `${storeHint.message || "להוסיף עמוד מוצרים?"}\n\nלחצו אישור לפתיחת העורך עם עמוד חנות שיסתנכרן עם המוצרים.`
        );
        if (go) {
          navigate(
            `${editorHref}?addPlugin=store&addPage=${encodeURIComponent(storeHint.pageTemplateId || "page-products-01")}`
          );
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || "עדכון התוסף נכשל");
    } finally {
      setSavingPlugins(false);
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="grid min-h-[50vh] place-items-center bg-gradient-to-b from-violet-50/30 to-white">
        <BizuplyLoader size="md" label="טוען פאנל ניהול..." />
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="mx-auto max-w-xl px-6 py-16 text-center">
        <p className="text-sm font-semibold text-rose-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate(`${basePath}/website`)}
          className={`mt-4 ${btnPrimary}`}
        >
          <ArrowRight size={16} />
          חזרה לאתרים שלי
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-[#faf7ff] via-[#f3f8ff] to-white">
      <div className="sticky top-0 z-20 border-b border-violet-100/80 bg-white/85 shadow-[0_4px_20px_rgba(99,102,241,0.05)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`${basePath}/website`)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-violet-100/80 bg-gradient-to-br from-violet-50 to-sky-50 text-violet-700 transition hover:border-sky-200 hover:text-sky-700"
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
            <Link to={editorHref} className={btnSecondary + " h-9 px-3 text-xs"}>
              <ExternalLink size={14} />
              עורך
            </Link>
            {sitePublished && publicUrl ? (
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary + " h-9 px-3 text-xs hover:border-emerald-200 hover:text-emerald-700"}
              >
                <Globe2 size={14} />
                אתר חי
              </a>
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] overflow-x-auto px-4 md:px-6">
          <nav className="flex min-w-max gap-0.5 border-t border-violet-50 pt-0.5">
            {navSections.map((section) => {
              const Icon = getSectionIcon(section);
              const meta = SECTION_META[section];
              const active = activeSection === section;

              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => setActiveSection(section)}
                  className={`relative inline-flex items-center gap-2 rounded-t-md px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-b from-violet-50/80 to-sky-50/40 text-slate-800"
                      : "text-slate-500 hover:bg-violet-50/40 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {meta.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-l from-violet-400 via-sky-400 to-cyan-400" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-6">
        {activeSection !== "overview" && activeSection !== "plugins" ? (
          <div className="mb-5 rounded-md border border-violet-100/70 bg-white/80 px-4 py-3 backdrop-blur-sm">
            <h2 className="text-base font-bold text-slate-900">{activeMeta.label}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{activeMeta.description}</p>
          </div>
        ) : null}

        {activeSection === "overview" ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "תוספים פעילים",
                  value: enabledPlugins.length,
                  accent: "border-violet-400",
                  bg: "from-violet-50/80",
                },
                {
                  label: "סטטוס אתר",
                  value: sitePublished ? "מפורסם" : "טיוטה",
                  accent: sitePublished ? "border-emerald-400" : "border-amber-400",
                  bg: sitePublished ? "from-emerald-50/80" : "from-amber-50/80",
                },
                {
                  label: "זמין בחנות",
                  value: catalog.length - enabledPlugins.length,
                  accent: "border-indigo-400",
                  bg: "from-indigo-50/80",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-md border-r-4 bg-gradient-to-l ${stat.bg} to-white p-5 shadow-[0_4px_16px_rgba(99,102,241,0.05)] ${stat.accent}`}
                >
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-violet-100/70 bg-white/90 p-5 shadow-[0_4px_18px_rgba(99,102,241,0.05)] md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-md border border-violet-100/80 bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-violet-700">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">ניהול מהיר</h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      גישה מהירה לתוספים והגדרות של האתר
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection("plugins")}
                  className={btnPrimary + " h-10 text-xs"}
                >
                  <Puzzle size={14} />
                  חנות תוספים
                </button>
              </div>

              {enabledPlugins.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {enabledPlugins.map((key) => {
                    const plugin = catalog.find((item) => item.key === key);
                    if (!plugin) return null;
                    const Icon = getPluginIcon(plugin.key);
                    const accent = getPluginAccent(plugin.key, plugin.accent);
                    const section = resolvePluginSection(key);
                    const canManage = Boolean(section);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (canManage && section) setActiveSection(section);
                          else setActiveSection("plugins");
                        }}
                        className="flex items-center gap-3 rounded-md border border-slate-200/80 bg-white/80 p-3 text-right transition hover:border-violet-200/70 hover:bg-white hover:shadow-[0_4px_14px_rgba(99,102,241,0.07)]"
                      >
                        <div
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-sm"
                          style={{ background: accent }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 text-right">
                          <span className="block truncate text-sm font-semibold text-slate-800">
                            {plugin.name}
                          </span>
                          <span className="text-[11px] text-sky-700">לחצו לניהול</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-md border border-dashed border-violet-200/70 bg-gradient-to-b from-violet-50/30 to-white py-8 text-center">
                  <Layers size={28} className="mx-auto text-sky-400/70" />
                  <p className="mt-2 text-sm text-slate-500">
                    עדיין לא הותקנו תוספים
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveSection("plugins")}
                    className={`mt-3 ${btnSecondary} text-xs`}
                  >
                    גלו את חנות התוספים
                  </button>
                </div>
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

        {(() => {
          const pluginKey =
            activeMeta.pluginKey ||
            (catalog.find((p) => resolvePluginSection(p.key) === activeSection)
              ?.key ??
              "");
          const PluginPanel = PLUGIN_PANEL_MAP[activeSection as keyof typeof PLUGIN_PANEL_MAP];
          if (!pluginKey || !enabledSet.has(pluginKey)) return null;
          if (CORE_PLUGIN_KEYS.has(pluginKey)) return null;

          if (PluginPanel) {
            return (
              <PluginPanel
                siteId={siteId}
                businessId={businessId}
                editorHref={editorHref}
              />
            );
          }

          const plugin = catalog.find((item) => item.key === pluginKey);
          return (
            <SiteDynamicPluginPanel
              siteId={siteId}
              businessId={businessId}
              editorHref={editorHref}
              pluginKey={pluginKey}
              plugin={plugin}
            />
          );
        })()}
      </div>
    </div>
  );
}
