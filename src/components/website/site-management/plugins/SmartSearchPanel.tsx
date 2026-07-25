import React from "react";
import { Search } from "lucide-react";

import { useSitePluginSettings } from "./useSitePluginSettings";
import {
  bool,
  Field,
  PluginPanelProps,
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
    >
      <Toggle
        label="תוסף פעיל באתר"
        checked={bool(settings.isActive, true)}
        onChange={(v) => updateField("isActive", v)}
      />
      <Toggle
        label="הצג כפתור חיפוש"
        checked={bool(settings.showTrigger, true)}
        onChange={(v) => updateField("showTrigger", v)}
      />
      <Field label="טקסט בשורת החיפוש">
        <TextInput
          value={str(settings.placeholder, "חיפוש באתר...")}
          onChange={(v) => updateField("placeholder", v)}
        />
      </Field>
      <Field label="צבע כפתור">
        <TextInput
          value={str(settings.accentColor, "#2563EB")}
          onChange={(v) => updateField("accentColor", v)}
        />
      </Field>
      <Toggle
        label="כלול גם כותרות עמודים בתוצאות"
        checked={bool(settings.showPages, true)}
        onChange={(v) => updateField("showPages", v)}
      />
      <p className="rounded-xl border border-dashed border-blue-200 bg-blue-50/60 p-3 text-xs font-bold leading-relaxed text-blue-900">
        בעורך: תוספים → «הפעלת תוסף צף» → גררו את כפתור החיפוש למיקום הרצוי.
        בלחיצה על הכפתור באתר החי תיפתח שורת חיפוש.
      </p>
    </SitePluginPanelFrame>
  );
}
