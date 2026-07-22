import { useCallback, useEffect, useState } from "react";

import {
  getSitePluginSettings,
  saveSitePluginSettings,
} from "../../../../api/sitePluginSettingsApi";

export function useSitePluginSettings(siteId: string, pluginKey: string) {
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
        text: err?.response?.data?.error || "שגיאה בטעינת הגדרות",
      });
    } finally {
      setLoading(false);
    }
  }, [siteId, pluginKey]);

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
      setMessage({ type: "success", text: "ההגדרות נשמרו" });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.error || "שגיאה בשמירה",
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
