import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Puzzle } from "lucide-react";

import { getMySite } from "../../../../api/mySitesApi";
import type { SitePluginDefinition } from "../../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../../data/sitePluginNav";
import { getPluginEditorAction } from "../../../../data/pluginEditorRegistry";
import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  bool,
  Field,
  InfoCallout,
  num,
  PluginPanelProps,
  SettingsSection,
  SitePluginPanelFrame,
  str,
  TextInput,
  Toggle,
} from "./SitePluginPanelFrame";

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
  const { t } = useTranslation();
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
            title: String(p.title || p.name || t("sitePlugins.dynamic.fallbackPage")),
          }))
        );
      })
      .catch(() => setPages([]));
  }, [siteId, t]);

  const Icon = getPluginIcon(pluginKey);
  const accent = getPluginAccent(pluginKey, plugin?.accent);
  const title = plugin?.name || pluginKey;
  const description =
    plugin?.description || t("sitePlugins.dynamic.fallbackDescription");
  const editorAction = getPluginEditorAction(pluginKey);
  const editorAddHref =
    editorAction.kind === "section" && editorAction.sectionId
      ? `${editorHref}?addSection=${encodeURIComponent(editorAction.sectionId)}&addPlugin=${encodeURIComponent(pluginKey)}`
      : editorAction.kind === "page" &&
          (editorAction.pageTemplateIds?.length || editorAction.pageTemplateId)
        ? `${editorHref}?addPages=${encodeURIComponent(
            (editorAction.pageTemplateIds?.length
              ? editorAction.pageTemplateIds
              : [editorAction.pageTemplateId as string]
            ).join(","),
          )}&addPlugin=${encodeURIComponent(pluginKey)}`
        : `${editorHref}?addPlugin=${encodeURIComponent(pluginKey)}`;

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
          href={editorAddHref}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Puzzle size={14} />
          {editorAction.kind === "overlay"
            ? t("sitePlugins.dynamic.openEditor")
            : t("sitePlugins.dynamic.addInEditor")}
        </a>
      }
      sidebar={
        <InfoCallout>
          {editorAction.kind === "overlay"
            ? t("sitePlugins.dynamic.overlayHint")
            : t("sitePlugins.dynamic.sectionHint")}
        </InfoCallout>
      }
    >
      <SettingsSection title={t("sitePlugins.dynamic.activation")}>
        <Toggle
          label={t("sitePlugins.dynamic.pluginActive")}
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
      </SettingsSection>

      <SettingsSection
        title={t("sitePlugins.dynamic.display")}
        description={t("sitePlugins.dynamic.displayHint")}
      >
        <div className="flex flex-wrap gap-2">
          {[
            { value: "site-wide", label: t("sitePlugins.dynamic.siteWide") },
            { value: "pages", label: t("sitePlugins.dynamic.selectedPages") },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateField("scope", opt.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                scope === opt.value
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {scope === "pages" ? (
          <Field label={t("sitePlugins.dynamic.sitePages")}>
            {pages.length === 0 ? (
              <p className="text-xs text-slate-500">
                {t("sitePlugins.dynamic.noPages")}
              </p>
            ) : (
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {pages.map((page) => {
                  const checked = pageIds.includes(page.id);
                  return (
                    <label
                      key={page.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                        checked
                          ? "bg-blue-50 text-blue-900"
                          : "hover:bg-slate-50"
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
      </SettingsSection>

      {pluginKey === "whatsapp-float" ? (
        <SettingsSection title="WhatsApp">
          <Field
            label={t("sitePlugins.dynamic.waNumber")}
            hint={t("sitePlugins.dynamic.waHint")}
          >
            <TextInput
              value={str(settings.phone)}
              onChange={(v) => updateField("phone", v)}
              placeholder="0501234567"
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.startMessage")}>
            <TextInput
              value={str(settings.message, t("sitePlugins.dynamic.defaultHello"))}
              onChange={(v) => updateField("message", v)}
            />
          </Field>
          <Toggle
            label={t("sitePlugins.dynamic.showMobile")}
            checked={bool(settings.showOnMobile, true)}
            onChange={(v) => updateField("showOnMobile", v)}
          />
          <Field
            label={t("sitePlugins.dynamic.xPos")}
            hint={t("sitePlugins.dynamic.xHint")}
          >
            <TextInput
              type="number"
              value={String(
                num(
                  (settings.triggerPosition as { x?: number } | undefined)?.x,
                  8
                )
              )}
              onChange={(v) =>
                updateField("triggerPosition", {
                  ...((settings.triggerPosition as object) || {}),
                  x: Math.min(95, Math.max(5, Number(v) || 8)),
                  y: num(
                    (settings.triggerPosition as { y?: number } | undefined)?.y,
                    88
                  ),
                })
              }
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.yPos")} hint={t("sitePlugins.dynamic.yHint")}>
            <TextInput
              type="number"
              value={String(
                num(
                  (settings.triggerPosition as { y?: number } | undefined)?.y,
                  88
                )
              )}
              onChange={(v) =>
                updateField("triggerPosition", {
                  ...((settings.triggerPosition as object) || {}),
                  x: num(
                    (settings.triggerPosition as { x?: number } | undefined)?.x,
                    8
                  ),
                  y: Math.min(95, Math.max(5, Number(v) || 88)),
                })
              }
            />
          </Field>
        </SettingsSection>
      ) : null}

      {pluginKey === "announcement-bar" ? (
        <SettingsSection title={t("sitePlugins.dynamic.barContent")}>
          <Field label={t("sitePlugins.dynamic.message")}>
            <TextInput
              value={str(settings.message)}
              onChange={(v) => updateField("message", v)}
              placeholder={t("sitePlugins.dynamic.messagePlaceholder")}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.linkOptional")}>
            <TextInput
              value={str(settings.linkUrl)}
              onChange={(v) => updateField("linkUrl", v)}
              placeholder="https://"
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.linkText")}>
            <TextInput
              value={str(settings.linkLabel)}
              onChange={(v) => updateField("linkLabel", v)}
              placeholder={t("sitePlugins.dynamic.details")}
            />
          </Field>
          <Toggle
            label={t("sitePlugins.dynamic.dismissible")}
            checked={bool(settings.dismissible, true)}
            onChange={(v) => updateField("dismissible", v)}
          />
        </SettingsSection>
      ) : null}

      {pluginKey === "cookie-banner" ? (
        <SettingsSection title={t("sitePlugins.dynamic.cookieBanner")}>
          <Field label={t("sitePlugins.dynamic.message")}>
            <TextInput
              value={str(settings.message)}
              onChange={(v) => updateField("message", v)}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.accept")}>
            <TextInput
              value={str(settings.acceptLabel, t("sitePlugins.dynamic.acceptDefault"))}
              onChange={(v) => updateField("acceptLabel", v)}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.decline")}>
            <TextInput
              value={str(settings.declineLabel, t("sitePlugins.dynamic.declineDefault"))}
              onChange={(v) => updateField("declineLabel", v)}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.policyUrl")}>
            <TextInput
              value={str(settings.policyUrl, "/privacy")}
              onChange={(v) => updateField("policyUrl", v)}
            />
          </Field>
        </SettingsSection>
      ) : null}

      {pluginKey === "exit-popup" ? (
        <SettingsSection title={t("sitePlugins.dynamic.popup")}>
          <Field label={t("sitePlugins.dynamic.headline")}>
            <TextInput
              value={str(settings.headline)}
              onChange={(v) => updateField("headline", v)}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.subheadline")}>
            <TextInput
              value={str(settings.subheadline)}
              onChange={(v) => updateField("subheadline", v)}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.cta")}>
            <TextInput
              value={str(settings.ctaLabel)}
              onChange={(v) => updateField("ctaLabel", v)}
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.delay")}>
            <TextInput
              value={String(num(settings.delaySeconds, 25))}
              onChange={(v) => updateField("delaySeconds", Number(v) || 25)}
              type="number"
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.trigger")}>
            <TextInput
              value={str(settings.trigger, "exit-or-delay")}
              onChange={(v) => updateField("trigger", v)}
              placeholder="exit / delay / exit-or-delay"
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.showEvery")}>
            <TextInput
              value={String(num(settings.showOncePerDays, 7))}
              onChange={(v) => updateField("showOncePerDays", Number(v) || 0)}
              type="number"
            />
          </Field>
          <Field label={t("sitePlugins.dynamic.success")}>
            <TextInput
              value={str(settings.successMessage)}
              onChange={(v) => updateField("successMessage", v)}
            />
          </Field>
          <Toggle
            label={t("sitePlugins.dynamic.requirePhone")}
            checked={bool(settings.requirePhone, true)}
            onChange={(v) => updateField("requirePhone", v)}
          />
        </SettingsSection>
      ) : null}

      {pluginKey === "whatsapp-catalog" ? (
        <SettingsSection title={t("sitePlugins.dynamic.sync")}>
          <Toggle
            label={t("sitePlugins.dynamic.syncStore")}
            checked={bool(settings.syncWithStore, true)}
            onChange={(v) => updateField("syncWithStore", v)}
          />
        </SettingsSection>
      ) : null}
    </SitePluginPanelFrame>
  );
}
