import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  bool,
  Field,
  InfoCallout,
  PluginPanelProps,
  SettingsSection,
  SitePluginPanelFrame,
  str,
  TextInput,
  Toggle,
} from "./SitePluginPanelFrame";

export default function SmartSearchPanel(props: PluginPanelProps) {
  const { t } = useTranslation();
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "smart-search");

  return (
    <SitePluginPanelFrame
      {...props}
      icon={Search}
      accent="#2563EB"
      title={t("leftover.pluginSearch.title", "Smart search")}
      description={t(
        "leftover.pluginSearch.desc",
        "A site search button — click it to open a search bar that scans content and pages."
      )}
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save()}
      sidebar={
        <InfoCallout variant="tip">
          {t(
            "leftover.pluginSearch.editorHint",
            "In the editor: Plugins → “Enable floating plugin” → drag the search button where you want it. On the live site, clicking the button opens the search bar."
          )}
        </InfoCallout>
      }
    >
      <SettingsSection
        title={t("leftover.pluginSearch.enable", "Enable")}
        description={t(
          "leftover.pluginSearch.enableDesc",
          "Control whether the plugin is available on the site"
        )}
      >
        <Toggle
          label={t("leftover.pluginSearch.active", "Plugin is active on the site")}
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        <Toggle
          label={t("leftover.pluginSearch.showButton", "Show search button")}
          description={t(
            "leftover.pluginSearch.showButtonDesc",
            "A floating button that opens the search bar"
          )}
          checked={bool(settings.showTrigger, true)}
          onChange={(v) => updateField("showTrigger", v)}
        />
      </SettingsSection>

      <SettingsSection title={t("leftover.pluginSearch.look", "Look and text")}>
        <Field label={t("leftover.pluginSearch.placeholder", "Search-bar text")}>
          <TextInput
            value={str(settings.placeholder, t("leftover.pluginSearch.placeholderDefault", "Search the site..."))}
            onChange={(v) => updateField("placeholder", v)}
          />
        </Field>
        <Field
          label={t("leftover.pluginSearch.buttonColor", "Button color")}
          hint={t("leftover.pluginSearch.hexHint", "HEX code, for example #2563EB")}
        >
          <TextInput
            value={str(settings.accentColor, "#2563EB")}
            onChange={(v) => updateField("accentColor", v)}
          />
        </Field>
      </SettingsSection>

      <SettingsSection title={t("leftover.pluginSearch.results", "Search results")}>
        <Toggle
          label={t("leftover.pluginSearch.includePages", "Include page titles")}
          description={t(
            "leftover.pluginSearch.includePagesDesc",
            "Search will also show site page names"
          )}
          checked={bool(settings.showPages, true)}
          onChange={(v) => updateField("showPages", v)}
        />
      </SettingsSection>
    </SitePluginPanelFrame>
  );
}
