import React, { useEffect, useMemo, useState } from "react";
import { Puzzle } from "lucide-react";

import { getMySite } from "../../../../api/mySitesApi";
import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../../data/sitePluginNav";
import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  bool,
  Field,
  PluginPanelProps,
  SitePluginPanelFrame,
  str,
  Toggle,
} from "./SitePluginPanelFrame";
import { inputBase } from "../siteManagementUi";

type SitePageOption = { id: string; title: string };

type SiteDynamicPluginPanelProps = PluginPanelProps & {
  pluginKey: string;
  plugin?: SitePluginDefinition;
};

export default function SiteDynamicPluginPanel({
  siteId,
  businessId,
  editorHref,
  pluginKey,
  plugin,
}: SiteDynamicPluginPanelProps) {
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(siteId, pluginKey);
  const [pages, setPages] = useState<SitePageOption[]>([]);

  useEffect(() => {
    getMySite(siteId)
      .then((site) => {
        const list = Array.isArray(site?.pages) ? site.pages : [];
        setPages(
          list.map((p: any) => ({
            id: String(p.id || p._id || ""),
            title: String(p.title || p.name || "עמוד"),
          }))
        );
      })
      .catch(() => setPages([]));
  }, [siteId]);

  const Icon = getPluginIcon(pluginKey);
  const accent = getPluginAccent(pluginKey, plugin?.accent);
  const title = plugin?.name || pluginKey;
  const description =
    plugin?.description || "הגדרות התוסף וחיבור לעמודים באתר";

  const scope = str(settings.scope, "site-wide");
  const pageIds = useMemo(
    () => (Array.isArray(settings.pageIds) ? settings.pageIds.map(String) : []),
    [settings.pageIds]
  );

  function togglePage(pageId: string) {
    const next = pageIds.includes(pageId)
      ? pageIds.filter((id) => id !== pageId)
      : [...pageIds, pageId];
    updateField("pageIds", next);
    if (next.length > 0 && scope === "site-wide") {
      updateField("scope", "pages");
    }
  }

  return (
    <SitePluginPanelFrame
      siteId={siteId}
      businessId={businessId}
      editorHref={editorHref}
      icon={Icon}
      accent={accent}
      title={title}
      description={description}
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save()}
      extraActions={
        <a
          href={`${editorHref}?addPlugin=${encodeURIComponent(pluginKey)}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-3 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
        >
          <Puzzle size={14} />
          הוספה בעורך
        </a>
      }
    >
      <Toggle
        label="תוסף פעיל באתר"
        checked={bool(settings.isActive, true)}
        onChange={(v) => updateField("isActive", v)}
      />

      <div className="rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-xs leading-relaxed text-sky-900">
        <strong>חיבור אוטומטי:</strong> לאחר שמירה, הוסיפו את התוסף לעמוד דרך{" "}
        <strong>עורך האתר → הוספה → תוספים</strong>. חנות ומוצרים מסתנכרנים
        אוטומטית עם עמוד המוצרים.
      </div>

      <Field label="הצגה">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "site-wide", label: "בכל האתר" },
            { value: "pages", label: "בעמודים נבחרים" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("scope", opt.value)}
              className={`rounded-md px-3 py-2 text-xs font-semibold transition ${
                scope === opt.value
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Field>

      {scope === "pages" ? (
        <Field label="עמודים באתר">
          {pages.length === 0 ? (
            <p className="text-xs text-slate-500">
              אין עמודים עדיין — צרו עמודים בעורך האתר.
            </p>
          ) : (
            <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {pages.map((page) => {
                const checked = pageIds.includes(page.id);
                return (
                  <label
                    key={page.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      checked ? "bg-violet-50 text-violet-900" : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePage(page.id)}
                      className="rounded border-slate-300"
                    />
                    {page.title}
                  </label>
                );
              })}
            </div>
          )}
        </Field>
      ) : null}

      {pluginKey === "whatsapp-float" ? (
        <Field label="מספר WhatsApp">
          <input
            className={inputBase}
            value={str(settings.phone)}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="972501234567"
          />
        </Field>
      ) : null}

      {pluginKey === "whatsapp-catalog" ? (
        <Toggle
          label="סנכרון עם מוצרי החנות"
          checked={bool(settings.syncWithStore, true)}
          onChange={(v) => updateField("syncWithStore", v)}
        />
      ) : null}
    </SitePluginPanelFrame>
  );
}
