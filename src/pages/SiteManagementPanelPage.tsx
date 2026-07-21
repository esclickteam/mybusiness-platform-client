import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Globe2,
  LayoutGrid,
  Loader2,
  Puzzle,
  Settings2,
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
import {
  getSectionIcon,
  PLUGIN_SECTION_MAP,
  SECTION_META,
  type SitePanelSection,
} from "../data/sitePluginNav";

function PlaceholderPluginPanel({
  title,
  description,
  editorHref,
}: {
  title: string;
  description: string;
  editorHref: string;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-7 text-slate-500">
        {description}
      </p>
      <Link
        to={editorHref}
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-violet-700"
      >
        <ExternalLink size={16} />
        הגדרה בעורך האתר
      </Link>
    </div>
  );
}

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
      const section = PLUGIN_SECTION_MAP[key];
      if (section && !items.includes(section)) {
        items.push(section);
      }
    });

    return items;
  }, [enabledPlugins]);

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
        const section = PLUGIN_SECTION_MAP[pluginKey];
        if (section) setActiveSection(section);
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
    return (
      <div dir="rtl" className="grid min-h-[60vh] place-items-center bg-[#F7F8FC]">
        <div className="flex items-center gap-3 text-sm font-black text-slate-500">
          <Loader2 size={24} className="animate-spin text-violet-600" />
          טוען פאנל ניהול...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-sm font-black text-rose-600">{error}</p>
        <button
          type="button"
          onClick={() => navigate(`${basePath}/website`)}
          className="mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white"
        >
          <ArrowRight size={16} />
          חזרה לאתרים שלי
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8FC] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 xl:flex-row">
        <aside className="w-full shrink-0 xl:w-[280px]">
          <div className="sticky top-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-100 p-5">
              <button
                type="button"
                onClick={() => navigate(`${basePath}/website`)}
                className="mb-4 inline-flex items-center gap-2 text-xs font-black text-slate-500 transition hover:text-violet-700"
              >
                <ArrowRight size={14} />
                חזרה לאתרים שלי
              </button>

              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-black text-violet-700 ring-1 ring-violet-100">
                <Settings2 size={13} />
                פאנל ניהול
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                {siteName}
              </h1>

              <p className="mt-1 text-xs font-bold text-slate-400">
                {sitePublished ? "מפורסם" : "טיוטה"}
                {publicUrl ? ` · ${publicUrl.replace(/^https?:\/\//, "")}` : ""}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={editorHref}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
                >
                  <ExternalLink size={13} />
                  עורך
                </Link>
                {sitePublished && publicUrl ? (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-black text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
                  >
                    <Globe2 size={13} />
                    אתר חי
                  </a>
                ) : null}
              </div>
            </div>

            <nav className="p-2">
              {navSections.map((section) => {
                const Icon = getSectionIcon(section);
                const meta = SECTION_META[section];
                const active = activeSection === section;

                return (
                  <button
                    key={section}
                    type="button"
                    onClick={() => setActiveSection(section)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-right text-sm font-black transition ${
                      active
                        ? "bg-slate-950 text-white shadow-lg"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    <Icon size={17} />
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {activeSection === "overview" ? (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-600">
                  <LayoutGrid size={13} />
                  סקירה כללית
                </div>
                <h2 className="mt-4 text-2xl font-black text-slate-950">
                  ברוכים הבאים לפאנל הניהול
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                  מכאן מנהלים את כל מה שקשור לאתר — תוספים, חנות, יומן, סליקה
                  ועוד. כל הגדרה שתעשו כאן משפיעה על האתר הזה בלבד.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveSection("plugins")}
                  className="rounded-[28px] border border-violet-200 bg-violet-50/50 p-6 text-right transition hover:bg-violet-50"
                >
                  <Puzzle className="text-violet-600" size={24} />
                  <h3 className="mt-3 text-lg font-black text-slate-950">
                    חנות תוספים
                  </h3>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {enabledPlugins.length
                      ? `${enabledPlugins.length} תוספים פעילים`
                      : "התקינו תוספים לאתר"}
                  </p>
                </button>

                {enabledPlugins.map((key) => {
                  const section = PLUGIN_SECTION_MAP[key];
                  if (!section) return null;
                  const Icon = getSectionIcon(section);
                  const meta = SECTION_META[section];

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveSection(section)}
                      className="rounded-[28px] border border-slate-200 bg-white p-6 text-right transition hover:border-violet-200"
                    >
                      <Icon className="text-slate-700" size={24} />
                      <h3 className="mt-3 text-lg font-black text-slate-950">
                        {meta.label}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-slate-500">
                        {meta.description}
                      </p>
                    </button>
                  );
                })}
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

          {activeSection === "leads" && enabledSet.has("leads") ? (
            <PlaceholderPluginPanel
              title="טופס לידים"
              description="הוסיפו בלוק 'טופס לידים' בעורך האתר. הפניות יגיעו ל-CRM של העסק."
              editorHref={editorHref}
            />
          ) : null}

          {activeSection === "reviews" && enabledSet.has("reviews") ? (
            <PlaceholderPluginPanel
              title="ביקורות"
              description="הוסיפו בלוק 'ביקורות' בעורך האתר והציגו המלצות לקוחות."
              editorHref={editorHref}
            />
          ) : null}

          {activeSection === "club" && enabledSet.has("club") ? (
            <PlaceholderPluginPanel
              title="מועדון לקוחות"
              description="הוסיפו בלוק 'מועדון לקוחות' בעורך האתר לאזור לקוחות והטבות."
              editorHref={editorHref}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
