import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CalendarClock, Loader2, Plus, Trash2 } from "lucide-react";
import {
  createWhatsAppAutomation,
  deleteWhatsAppAutomation,
  listWhatsAppAutomations,
  listWhatsAppTemplates,
  updateWhatsAppAutomation,
  type WhatsAppAutomation,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

export default function WhatsAppAutomationsTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [automations, setAutomations] = useState<WhatsAppAutomation[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [name, setName] = useState("");
  const [trigger, setTrigger] =
    useState<WhatsAppAutomation["trigger"]>("appointment_reminder_1_day");
  const [templateId, setTemplateId] = useState("");
  const [hoursBefore, setHoursBefore] = useState(24);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [autos, tpls] = await Promise.all([
        listWhatsAppAutomations(businessId),
        listWhatsAppTemplates(businessId),
      ]);
      setAutomations(autos);
      setTemplates(tpls);
      if (!templateId && tpls[0]?._id) setTemplateId(tpls[0]._id);
      if (!name) setName(t("whatsapp.automations.defaultReminderName"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadAutomations")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const createAutomation = async () => {
    if (!businessId || !name.trim() || !templateId) {
      toast.error(t("whatsapp.automations.required"));
      return;
    }
    try {
      setSaving(true);
      await createWhatsAppAutomation(businessId, {
        name: name.trim(),
        trigger,
        templateId,
        hoursBefore,
        enabled: true,
      });
      toast.success(t("whatsapp.automations.created"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.saveAutomation")
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (auto: WhatsAppAutomation) => {
    if (!businessId) return;
    try {
      await updateWhatsAppAutomation(businessId, auto._id, {
        enabled: !auto.enabled,
      });
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.saveAutomation")
      );
    }
  };

  const removeAutomation = async (id: string) => {
    if (!businessId) return;
    if (!window.confirm(t("whatsapp.automations.confirmDelete"))) return;
    try {
      await deleteWhatsAppAutomation(businessId, id);
      toast.success(t("whatsapp.automations.deleted"));
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.deleteAutomation")
      );
    }
  };

  const templateName = (auto: WhatsAppAutomation) => {
    if (typeof auto.templateId === "object" && auto.templateId?.name) {
      return auto.templateId.name;
    }
    const found = templates.find((tpl) => tpl._id === auto.templateId);
    return found?.name || "—";
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className={`${cardBase} p-4 sm:p-5`}>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <CalendarClock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {t("whatsapp.automations.title")}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {t("whatsapp.automations.subtitle")}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              {t("whatsapp.automations.name")}
            </span>
            <input
              className={inputBase}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              {t("whatsapp.automations.trigger")}
            </span>
            <select
              className={inputBase}
              value={trigger}
              onChange={(e) =>
                setTrigger(e.target.value as WhatsAppAutomation["trigger"])
              }
            >
              <option value="appointment_reminder_1_day">
                {t("whatsapp.automations.triggers.appointment_reminder_1_day")}
              </option>
              <option value="appointment_reminder_hours">
                {t("whatsapp.automations.triggers.appointment_reminder_hours")}
              </option>
            </select>
          </label>
          {trigger === "appointment_reminder_hours" && (
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.automations.hoursBefore")}
              </span>
              <input
                type="number"
                min={1}
                max={168}
                className={inputBase}
                value={hoursBefore}
                onChange={(e) => setHoursBefore(Number(e.target.value) || 24)}
              />
            </label>
          )}
          <label className="grid gap-1.5">
            <span className="text-xs font-black text-slate-600">
              {t("whatsapp.automations.template")}
            </span>
            <select
              className={inputBase}
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {templates.map((tpl) => (
                <option key={tpl._id} value={tpl._id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          className={`${btnPrimary} mt-4`}
          disabled={saving}
          onClick={createAutomation}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {t("whatsapp.automations.save")}
        </button>
      </section>

      <div className="grid gap-3">
        {automations.length === 0 ? (
          <div className={`${cardBase} px-4 py-12 text-center text-sm font-medium text-slate-400`}>
            {t("whatsapp.automations.empty")}
          </div>
        ) : (
          automations.map((auto) => (
            <article
              key={auto._id}
              className={`${cardBase} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    {auto.name}
                  </h3>
                  <span
                    className={[
                      "rounded-md px-2 py-0.5 text-[11px] font-black",
                      auto.enabled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {auto.enabled
                      ? t("whatsapp.automations.enabled")
                      : t("whatsapp.automations.disabled")}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {t(`whatsapp.automations.triggers.${auto.trigger}`)}
                  {" · "}
                  {t("whatsapp.automations.usesTemplate", {
                    name: templateName(auto),
                  })}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {t("whatsapp.automations.stats", {
                    sent: auto.stats?.sent ?? 0,
                    failed: auto.stats?.failed ?? 0,
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => toggleEnabled(auto)}
                >
                  {auto.enabled
                    ? t("whatsapp.automations.disable")
                    : t("whatsapp.automations.enable")}
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => removeAutomation(auto._id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("whatsapp.automations.delete")}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
