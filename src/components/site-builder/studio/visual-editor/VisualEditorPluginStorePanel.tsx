import React, { useCallback, useEffect, useState } from "react";
import { Puzzle, X } from "lucide-react";

import {
  getSitePlugins,
  updateSitePlugins,
  type SitePluginDefinition,
} from "../../../../api/sitePluginsApi";
import SitePluginStore from "../../../website/site-management/SitePluginStore";
import BizuplyLoader from "../../../ui/BizuplyLoader";

type VisualEditorPluginStorePanelProps = {
  open: boolean;
  siteId?: string;
  onClose: () => void;
  onInstalled?: () => void;
};

export default function VisualEditorPluginStorePanel({
  open,
  siteId,
  onClose,
  onInstalled,
}: VisualEditorPluginStorePanelProps) {
  const [catalog, setCatalog] = useState<SitePluginDefinition[]>([]);
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);
  const [detectedFromSite, setDetectedFromSite] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const id = String(siteId || "").trim();
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await getSitePlugins(id);
      setCatalog(Array.isArray(data.catalog) ? data.catalog : []);
      setEnabledPlugins(
        Array.isArray(data.enabledPlugins) ? data.enabledPlugins : [],
      );
      setDetectedFromSite(
        Array.isArray(data.detectedFromSite) ? data.detectedFromSite : [],
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "טעינת חנות התוספים נכשלה",
      );
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  async function handleToggle(pluginKey: string, enabled: boolean) {
    const id = String(siteId || "").trim();
    if (!id) return;
    const key = String(pluginKey || "").trim();
    if (!key) return;

    setSavingKey(key);
    setError("");
    try {
      const next = enabled
        ? Array.from(new Set([...enabledPlugins, key]))
        : enabledPlugins.filter((item) => item !== key);
      const result = await updateSitePlugins(id, next);
      setEnabledPlugins(
        Array.isArray(result.enabledPlugins) ? result.enabledPlugins : next,
      );
      if (Array.isArray(result.catalog) && result.catalog.length) {
        setCatalog(result.catalog);
      }
      onInstalled?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "עדכון התוסף נכשל",
      );
    } finally {
      setSavingKey(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed bottom-4 right-[80px] top-[64px] z-[2147483200] flex w-[min(920px,calc(100vw-112px))] max-w-[calc(100vw-112px)] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_32px_100px_rgba(15,23,42,0.24)]"
      dir="rtl"
      data-visual-editor-plugin-store="true"
    >
      <div className="flex min-h-0 w-full flex-col">
        <header className="flex h-[74px] shrink-0 items-center justify-between border-b border-slate-200 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-50 text-violet-700">
              <Puzzle className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-black text-slate-800">
                חנות תוספים
              </h2>
              <p className="mt-1 text-xs font-bold text-slate-400">
                התקינו תוספים ישירות מתוך עריכת האתר
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
            aria-label="סגירה"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {error ? (
          <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        {!siteId ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <p className="text-sm font-black text-slate-700">
              שמרו את האתר כדי לפתוח את חנות התוספים
            </p>
          </div>
        ) : loading ? (
          <div className="grid flex-1 place-items-center">
            <BizuplyLoader size="sm" label="טוען חנות תוספים..." />
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <SitePluginStore
              catalog={catalog}
              enabledPlugins={enabledPlugins}
              detectedFromSite={detectedFromSite}
              saving={Boolean(savingKey)}
              onToggle={handleToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
}
