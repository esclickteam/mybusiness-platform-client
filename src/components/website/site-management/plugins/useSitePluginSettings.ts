import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getSitePluginSettings,
  saveSitePluginSettings,
} from "../../../../api/sitePluginSettingsApi";

export function useSitePluginSettings(siteId: string, pluginKey: string) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const load = useCallback(async () => {
    if (!siteId || !pluginKey) return;
    setLoading(true);
    setMessage(null);
    try {
      const data = await getSitePluginSettings(siteId, pluginKey);
      setSettings(data);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || t("leftover.pluginSettings.loadError", "Could not load settings"),
      });
    } finally {
      setLoading(false);
    }
  }, [siteId, pluginKey, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(next?: Record<string, unknown>) {
    if (!siteId || !pluginKey) return;
    const payload = next || settings;
    setSaving(true);
    setMessage(null);
    try {
      const saved = await saveSitePluginSettings(siteId, pluginKey, payload);
      setSettings(saved);
      setMessage({ type: "success", text: t("leftover.pluginSettings.saved", "Settings saved") });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || t("leftover.pluginSettings.saveError", "Could not save"),
      });
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: string, value: unknown) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return {
    settings,
    setSettings,
    loading,
    saving,
    message,
    save,
    updateField,
    reload: load,
  };
}
