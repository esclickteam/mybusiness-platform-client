import React from "react";
import { Search } from "lucide-react";

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
  const { settings, loading, saving, message, save, updateField } =
    useSitePluginSettings(props.siteId, "smart-search");

  return (
    <SitePluginPanelFrame
      {...props}
      icon={Search}
      accent="#2563EB"
      title="חיפוש חכם"
      description="כפתור חיפוש באתר — לחיצה פותחת שורת חיפוש שסורקת את התוכן והעמודים."
      loading={loading}
      saving={saving}
      message={message}
      onSave={() => save()}
      sidebar={
        <InfoCallout variant="tip">
          בעורך: תוספים → «הפעלת תוסף צף» → גררו את כפתור החיפוש למיקום הרצוי.
          בלחיצה על הכפתור באתר החי תיפתח שורת חיפוש.
        </InfoCallout>
      }
    >
      <SettingsSection
        title="הפעלה"
        description="שליטה על זמינות התוסף באתר"
      >
        <Toggle
          label="תוסף פעיל באתר"
          checked={bool(settings.isActive, true)}
          onChange={(v) => updateField("isActive", v)}
        />
        <Toggle
          label="הצג כפתור חיפוש"
          description="כפתור צף שפותח את שורת החיפוש"
          checked={bool(settings.showTrigger, true)}
          onChange={(v) => updateField("showTrigger", v)}
        />
      </SettingsSection>

      <SettingsSection title="מראה וטקסט">
        <Field label="טקסט בשורת החיפוש">
          <TextInput
            value={str(settings.placeholder, "חיפוש באתר...")}
            onChange={(v) => updateField("placeholder", v)}
          />
        </Field>
        <Field label="צבע כפתור" hint="קוד HEX, למשל #2563EB">
          <TextInput
            value={str(settings.accentColor, "#2563EB")}
            onChange={(v) => updateField("accentColor", v)}
          />
        </Field>
      </SettingsSection>

      <SettingsSection title="תוצאות חיפוש">
        <Toggle
          label="כלול גם כותרות עמודים"
          description="חיפוש יציג גם שמות עמודים באתר"
          checked={bool(settings.showPages, true)}
          onChange={(v) => updateField("showPages", v)}
        />
      </SettingsSection>
    </SitePluginPanelFrame>
  );
}
