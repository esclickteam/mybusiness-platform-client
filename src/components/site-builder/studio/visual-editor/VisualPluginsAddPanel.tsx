import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Puzzle, Search, Trash2 } from "lucide-react";

import {
  getSitePlugins,
  updateSitePlugins,
  type SitePluginDefinition,
} from "../../../../api/sitePluginsApi";
import { saveSitePluginSettings, getSitePluginSettings } from "../../../../api/sitePluginSettingsApi";
import { getPluginAccent, getPluginIcon } from "../../../../data/sitePluginNav";
import {
  buildPluginWidgetMarker,
  getPluginEditorAction,
} from "../../../../data/pluginEditorRegistry";
import { pageHasCountdownWidget } from "../../../site-plugins/countdown/mountCountdownWidgets";
import { getPageTemplateById } from "./library/pageLibrary";
import type { VisualLibraryPageTemplate } from "./library/visualLibraryTypes";
import BizuplyLoader from "../../../ui/BizuplyLoader";

type VisualPluginsAddPanelProps = {
  siteId?: string;
  editor: any;
  onAddLibraryPage?: (page: VisualLibraryPageTemplate) => void;
  onAddHtml?: (html: string) => string | void | Promise<string | void>;
  onAdded?: (title: string) => void;
  onOverlayInstalled?: () => void;
};

function pageHasPluginContent(root: ParentNode | null | undefined, pluginKey: string) {
  if (!root) return false;
  const hay = (root as HTMLElement).innerHTML || "";
  if (pluginKey === "booking") {
    return /data-bizuply-booking-mount|data-bizuply-widget=["']booking["']|section-booking-showcase/.test(hay);
  }
  if (pluginKey === "reviews") {
    return /section-testimonials|data-bizuply-reviews|ביקורות/.test(hay);
  }
  if (pluginKey === "leads") {
    return /data-bizuply-block=["']lead-form["']|data-bizuply-crm-lead|section-contact/.test(hay);
  }
  if (pluginKey === "store") {
    return /data-bizuply-block=["']products["']|bizuply-products|data-store-plugin|section-products/.test(hay);
  }
  if (pluginKey === "countdown") {
    return pageHasCountdownWidget(root as HTMLElement);
  }
  return Boolean(
    (root as HTMLElement).querySelector?.(
      `[data-bizuply-plugin="${pluginKey}"], [data-bizuply-widget="${pluginKey}"]`
    )
  );
}

export default function VisualPluginsAddPanel({
  siteId,
  editor,
  onAddLibraryPage,
  onAddHtml,
  onAdded,
  onOverlayInstalled,
}: VisualPluginsAddPanelProps) {
  const [loading, setLoading] = useState(Boolean(siteId));
  const [catalog, setCatalog] = useState<SitePluginDefinition[]>([]);
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);
  const [overlayActive, setOverlayActive] = useState<Record<string, boolean>>({});
  const [contentActive, setContentActive] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [pageWidgetsEpoch, setPageWidgetsEpoch] = useState(0);
  const autoActivatedRef = useRef(false);

  const refreshContentActive = useCallback(
    (enabled: string[]) => {
      const root = editor?.canvasRef?.current as HTMLElement | null;
      const next: Record<string, boolean> = {};
      enabled.forEach((key) => {
        const kind = getPluginEditorAction(key).kind;
        if (kind === "overlay") return;
        next[key] = pageHasPluginContent(root, key);
      });
      setContentActive(next);
    },
    [editor?.canvasRef]
  );

  const activateOverlay = useCallback(
    async (plugin: SitePluginDefinition, silent = false) => {
      if (!siteId) return false;
      try {
        const current = await getSitePluginSettings(siteId, plugin.key);
        const nextSettings: Record<string, unknown> = {
          ...current,
          isActive: true,
          showTrigger: true,
          buttonMode: "floating",
          triggerPosition: current?.triggerPosition || { x: 88, y: 82 },
        };

        if (plugin.key === "whatsapp-float" && !String(current?.phone || "").trim()) {
          try {
            const { getMySite } = await import("../../../../api/mySitesApi");
            const site = await getMySite(siteId);
            const business = (site as any)?.business || {};
            const phone = String(
              business.whatsappUrl ||
                business.whatsapp ||
                business.whatsappLink ||
                business.phone ||
                (site as any)?.brand?.phone ||
                ""
            ).trim();
            if (phone) nextSettings.phone = phone;
          } catch {
            // keep empty
          }
        }

        await saveSitePluginSettings(siteId, plugin.key, nextSettings);
        setOverlayActive((prev) => ({ ...prev, [plugin.key]: true }));
        if (!silent) {
          if (plugin.key === "whatsapp-float" && !String(nextSettings.phone || "").trim()) {
            onAdded?.(
              `«${plugin.name}» הופעל — הזינו מספר WhatsApp בפאנל הניהול של התוסף`
            );
          } else {
            onAdded?.(`«${plugin.name}» פעיל בעורך ובאתר`);
          }
        }
        return true;
      } catch {
        if (!silent) onAdded?.(`שגיאה בהפעלת ${plugin.name}`);
        return false;
      }
    },
    [onAdded, siteId]
  );

  const loadAndActivateOverlays = useCallback(
    async (plugins: SitePluginDefinition[], enabled: string[]) => {
      if (!siteId) return;
      const enabledSet = new Set(enabled);
      const overlays = plugins.filter(
        (p) => enabledSet.has(p.key) && getPluginEditorAction(p.key).kind === "overlay"
      );
      const next: Record<string, boolean> = {};
      let activatedAny = false;

      await Promise.all(
        overlays.map(async (plugin) => {
          try {
            const settings = await getSitePluginSettings(siteId, plugin.key);
            const alreadyOn = settings?.isActive !== false;
            if (alreadyOn) {
              next[plugin.key] = true;
              return;
            }
            const ok = await activateOverlay(plugin, true);
            next[plugin.key] = ok;
            if (ok) activatedAny = true;
          } catch {
            const ok = await activateOverlay(plugin, true);
            next[plugin.key] = ok;
            if (ok) activatedAny = true;
          }
        })
      );

      setOverlayActive(next);
      // Only refresh overlays when we actually changed settings — avoids remount loops.
      if (activatedAny) {
        onOverlayInstalled?.();
      }
    },
    [activateOverlay, onOverlayInstalled, siteId]
  );

  useEffect(() => {
    if (!siteId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    autoActivatedRef.current = false;
    getSitePlugins(siteId)
      .then(async (data) => {
        if (cancelled) return;
        setCatalog(data.catalog);
        setEnabledPlugins(data.enabledPlugins);
        await loadAndActivateOverlays(data.catalog, data.enabledPlugins);
        if (cancelled) return;
        refreshContentActive(data.enabledPlugins);
        autoActivatedRef.current = true;
      })
      .catch(() => {
        if (cancelled) return;
        setCatalog([]);
        setEnabledPlugins([]);
        setOverlayActive({});
        setContentActive({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Intentionally siteId-only: unstable callback identities were remount-looping the panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  useEffect(() => {
    refreshContentActive(enabledPlugins);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledPlugins, pageWidgetsEpoch, editor?.activePageId, editor?.activePageID]);

  const installed = useMemo(() => {
    const set = new Set(enabledPlugins);
    const q = query.trim().toLowerCase();
    return catalog
      .filter((p) => set.has(p.key))
      .filter((p) => {
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      });
  }, [catalog, enabledPlugins, query]);

  async function removeOverlay(plugin: SitePluginDefinition) {
    if (!siteId) return;
    if (
      !window.confirm(
        `להסיר את «${plugin.name}» מהאתר לגמרי?\nהתוסף יוסר גם מהגדרות ומחנות התוספים.`
      )
    ) {
      return;
    }
    try {
      const { enabledPlugins: currentEnabled } = await getSitePlugins(siteId);
      const result = await updateSitePlugins(
        siteId,
        currentEnabled.filter((key) => key !== plugin.key)
      );
      setEnabledPlugins(result.enabledPlugins);
      setOverlayActive((prev) => ({ ...prev, [plugin.key]: false }));
      onOverlayInstalled?.();
      onAdded?.(`«${plugin.name}» הוסר מהאתר`);
    } catch {
      onAdded?.(`שגיאה בהסרת ${plugin.name}`);
    }
  }

  async function insertPlugin(plugin: SitePluginDefinition) {
    const action = getPluginEditorAction(plugin.key);

    if (action.kind === "overlay" && siteId) {
      const ok = await activateOverlay(plugin, false);
      if (ok) onOverlayInstalled?.();
      return;
    }

    if (action.kind === "page" && action.pageTemplateId) {
      const page = getPageTemplateById(action.pageTemplateId);
      if (page && typeof onAddLibraryPage === "function") {
        onAddLibraryPage(page);
        setContentActive((prev) => ({ ...prev, [plugin.key]: true }));
        setPageWidgetsEpoch((e) => e + 1);
        onAdded?.(`עמוד «${page.title}» נוסף — ${plugin.name} פעיל`);
        return;
      }
    }

    if (action.kind === "section" && action.sectionId) {
      if (siteId && !enabledPlugins.includes(plugin.key)) {
        try {
          const result = await updateSitePlugins(siteId, [
            ...enabledPlugins,
            plugin.key,
          ]);
          setEnabledPlugins(result.enabledPlugins);
        } catch {
          // still insert
        }
      }
      if (typeof editor?.addLibrarySection === "function") {
        editor.addLibrarySection(action.sectionId, "append");
      } else {
        editor?.addSection?.("after", undefined, action.sectionId);
      }
      setContentActive((prev) => ({ ...prev, [plugin.key]: true }));
      setPageWidgetsEpoch((e) => e + 1);
      onAdded?.(
        plugin.key === "booking"
          ? `«${plugin.name}» נוסף ופעיל — מחובר ליומן ה-CRM`
          : `«${plugin.name}» נוסף ופעיל בעמוד`
      );
      return;
    }

    const html = buildPluginWidgetMarker(plugin.key, plugin.name);
    if (typeof onAddHtml === "function") {
      await onAddHtml(html);
    } else if (typeof editor?.insertHtmlWidget === "function") {
      await editor.insertHtmlWidget(html, {
        label: plugin.name,
        width: plugin.key === "countdown" ? 520 : undefined,
        height: plugin.key === "countdown" ? 180 : undefined,
      });
    } else if (typeof editor?.insertHtmlAtSelection === "function") {
      editor.insertHtmlAtSelection(html);
    } else {
      onAdded?.(`«${plugin.name}» — נשמר; הוסיפו דרך סקשן מתאים`);
      return;
    }
    setContentActive((prev) => ({ ...prev, [plugin.key]: true }));
    setPageWidgetsEpoch((epoch) => epoch + 1);
    onAdded?.(`«${plugin.name}» נוסף ופעיל בעמוד`);
  }

  if (!siteId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <Puzzle className="h-10 w-10 text-violet-400" />
        <p className="mt-3 text-sm font-bold text-slate-700">תוספים</p>
        <p className="mt-1 max-w-xs text-xs text-slate-500">
          שמרו את האתר כדי להוסיף תוספים מהעורך
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <BizuplyLoader size="sm" label="טוען תוספים..." />
      </div>
    );
  }

  if (enabledPlugins.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <Puzzle className="h-10 w-10 text-violet-400" />
        <p className="mt-3 text-sm font-bold text-slate-700">אין תוספים מותקנים</p>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          התקינו תוספים מפאנל הניהול → חנות תוספים, ואז חזרו לכאן
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש תוסף..."
            className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none"
          />
        </label>
        <p className="mt-3 text-xs font-bold text-slate-500">
          {installed.length} תוספים מותקנים — תוספים צפים פעילים מיד; לחצו «הוספה» לסקשנים בעמוד
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {installed.map((plugin) => {
            const Icon = getPluginIcon(plugin.key);
            const accent = getPluginAccent(plugin.key, plugin.accent);
            const action = getPluginEditorAction(plugin.key);
            const isOverlay = action.kind === "overlay";
            const isOverlayActive = isOverlay && overlayActive[plugin.key];
            const isContentActive = !isOverlay && Boolean(contentActive[plugin.key]);
            const isActive = isOverlayActive || isContentActive;

            return (
              <div
                key={plugin.key}
                className={`group flex flex-col rounded-2xl border bg-white p-4 text-right transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isActive
                    ? "border-emerald-200 hover:border-emerald-300"
                    : "border-slate-200 hover:border-violet-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                    style={{ background: accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-slate-800">{plugin.name}</h4>
                    <p className="mt-1 line-clamp-2 text-[11px] font-bold leading-5 text-slate-400">
                      {plugin.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`mt-3 inline-flex items-center gap-1 self-start rounded-full px-2.5 py-1 text-[10px] font-black ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-violet-50 text-violet-700"
                  }`}
                >
                  <Download className="h-3 w-3" />
                  {isOverlay
                    ? isOverlayActive
                      ? "פעיל בעורך ובאתר"
                      : "ממתין להפעלה"
                    : isContentActive
                      ? "פעיל בעמוד הנוכחי"
                      : action.kind === "page"
                        ? "הוספת עמוד"
                        : action.kind === "section"
                          ? "הוספת סקשן לעמוד"
                          : "הוספת רכיב"}
                </span>

                <div className="mt-3 flex flex-wrap gap-2">
                  {isOverlay && isOverlayActive ? (
                    <>
                      <button
                        type="button"
                        onClick={() => removeOverlay(plugin)}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] font-black text-rose-600 transition hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        הסרה מהאתר
                      </button>
                      <button
                        type="button"
                        onClick={() => activateOverlay(plugin).then((ok) => ok && onOverlayInstalled?.())}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-[11px] font-black text-violet-700 transition hover:bg-violet-100"
                      >
                        רענון
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => insertPlugin(plugin)}
                      className={`inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-[11px] font-black transition ${
                        isContentActive
                          ? "border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
                          : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                    >
                      {isOverlay
                        ? "הפעלה בעורך"
                        : isContentActive
                          ? "הוספה שוב"
                          : "הוספה ופתיחה בעורך"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {installed.length === 0 ? (
          <p className="py-12 text-center text-sm font-bold text-slate-500">
            לא נמצאו תוספים לחיפוש
          </p>
        ) : null}
      </div>
    </div>
  );
}
