import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Puzzle, Search, Trash2 } from "lucide-react";

import {
  getSitePlugins,
  type SitePluginDefinition,
} from "../../../../api/sitePluginsApi";
import { saveSitePluginSettings, getSitePluginSettings } from "../../../../api/sitePluginSettingsApi";
import { getPluginAccent, getPluginIcon } from "../../../../data/sitePluginNav";
import {
  buildPluginWidgetMarker,
  getPluginEditorAction,
} from "../../../../data/pluginEditorRegistry";
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
  const [query, setQuery] = useState("");

  const loadOverlayStates = useCallback(
    async (plugins: SitePluginDefinition[], enabled: string[]) => {
      if (!siteId) return;
      const enabledSet = new Set(enabled);
      const overlays = plugins.filter(
        (p) => enabledSet.has(p.key) && getPluginEditorAction(p.key).kind === "overlay"
      );
      const next: Record<string, boolean> = {};
      await Promise.all(
        overlays.map(async (plugin) => {
          try {
            const settings = await getSitePluginSettings(siteId, plugin.key);
            next[plugin.key] = settings?.isActive !== false;
          } catch {
            next[plugin.key] = false;
          }
        })
      );
      setOverlayActive(next);
    },
    [siteId]
  );

  useEffect(() => {
    if (!siteId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getSitePlugins(siteId)
      .then(async (data) => {
        setCatalog(data.catalog);
        setEnabledPlugins(data.enabledPlugins);
        await loadOverlayStates(data.catalog, data.enabledPlugins);
      })
      .catch(() => {
        setCatalog([]);
        setEnabledPlugins([]);
        setOverlayActive({});
      })
      .finally(() => setLoading(false));
  }, [siteId, loadOverlayStates]);

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

  async function activateOverlay(plugin: SitePluginDefinition) {
    if (!siteId) return;
    try {
      const current = await getSitePluginSettings(siteId, plugin.key);
      await saveSitePluginSettings(siteId, plugin.key, {
        ...current,
        isActive: true,
        showTrigger: true,
        triggerPosition: current?.triggerPosition || { x: 88, y: 82 },
      });
      setOverlayActive((prev) => ({ ...prev, [plugin.key]: true }));
      onOverlayInstalled?.();
      onAdded?.(`«${plugin.name}» הופעל — גררו את הכפתור הצף למיקום הרצוי`);
    } catch {
      onAdded?.(`שגיאה בהפעלת ${plugin.name}`);
    }
  }

  async function removeOverlay(plugin: SitePluginDefinition) {
    if (!siteId) return;
    try {
      const current = await getSitePluginSettings(siteId, plugin.key);
      await saveSitePluginSettings(siteId, plugin.key, {
        ...current,
        isActive: false,
        showTrigger: false,
      });
      setOverlayActive((prev) => ({ ...prev, [plugin.key]: false }));
      onOverlayInstalled?.();
      onAdded?.(`«${plugin.name}» הוסר מהעמוד`);
    } catch {
      onAdded?.(`שגיאה בהסרת ${plugin.name}`);
    }
  }

  async function insertPlugin(plugin: SitePluginDefinition) {
    const action = getPluginEditorAction(plugin.key);

    if (action.kind === "overlay" && siteId) {
      await activateOverlay(plugin);
      return;
    }

    if (action.kind === "page" && action.pageTemplateId) {
      const page = getPageTemplateById(action.pageTemplateId);
      if (page && typeof onAddLibraryPage === "function") {
        onAddLibraryPage(page);
        onAdded?.(`עמוד «${page.title}» נוסף — ${plugin.name}`);
        return;
      }
    }

    if (action.kind === "section" && action.sectionId) {
      if (typeof editor?.addLibrarySection === "function") {
        editor.addLibrarySection(action.sectionId);
      } else {
        editor?.addSection?.("after", undefined, action.sectionId);
      }
      onAdded?.(`«${plugin.name}» נוסף לעמוד`);
      return;
    }

    const html = buildPluginWidgetMarker(plugin.key, plugin.name);
    if (typeof onAddHtml === "function") {
      onAddHtml(html);
    } else if (typeof editor?.insertHtmlAtSelection === "function") {
      editor.insertHtmlAtSelection(html);
    } else if (typeof editor?.addSection === "function") {
      editor.addSection("append");
      onAdded?.(`«${plugin.name}» — הוסיפו את הרכיב מהסקשן החדש`);
      return;
    }
    onAdded?.(`«${plugin.name}» — נשמר; הוסיפו דרך סקשן מתאים`);
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
          התקינו תוספים מפאנל הניהול → חנות תוספים, ואז חזרו לכאן להוספה לעמוד
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
          {installed.length} תוספים מותקנים — לחצו להוספה לעמוד הנוכחי
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

            return (
              <div
                key={plugin.key}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg"
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

                <span className="mt-3 inline-flex items-center gap-1 self-start rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-black text-violet-700">
                  <Download className="h-3 w-3" />
                  {action.kind === "page"
                    ? "הוספת עמוד"
                    : action.kind === "section"
                      ? "הוספת סקשן"
                      : action.kind === "overlay"
                        ? isOverlayActive
                          ? "פעיל בעמוד"
                          : "הפעלת תוסף צף"
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
                        הסרה
                      </button>
                      <button
                        type="button"
                        onClick={() => activateOverlay(plugin)}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-[11px] font-black text-violet-700 transition hover:bg-violet-100"
                      >
                        הפעלה מחדש
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => insertPlugin(plugin)}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-3 py-2 text-[11px] font-black text-white transition hover:bg-violet-700"
                    >
                      {isOverlay ? "הוספה לעמוד" : "הוספה"}
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
