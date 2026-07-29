import React, { useEffect, useMemo, useState } from "react";
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
  type WhatsAppAutomationTrigger,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

const TRIGGERS: WhatsAppAutomationTrigger[] = [
  "new_lead_welcome",
  "lead_no_response",
  "lead_followup_2",
  "appointment_reminder_1_day",
  "appointment_reminder_hours",
  "appointment_thanks",
  "appointment_review_request",
  "new_client_welcome",
  "inactive_client",
];

const DEFAULTS: Record<
  WhatsAppAutomationTrigger,
  {
    nameKey: string;
    hoursBefore?: number;
    delayMinutes?: number;
    delayHours?: number;
    delayDays?: number;
  }
> = {
  new_lead_welcome: {
    nameKey: "whatsapp.automations.defaults.new_lead_welcome",
    delayMinutes: 10,
  },
  lead_no_response: {
    nameKey: "whatsapp.automations.defaults.lead_no_response",
    delayHours: 24,
  },
  lead_followup_2: {
    nameKey: "whatsapp.automations.defaults.lead_followup_2",
    delayDays: 3,
  },
  appointment_reminder_1_day: {
    nameKey: "whatsapp.automations.defaults.appointment_reminder_1_day",
  },
  appointment_reminder_hours: {
    nameKey: "whatsapp.automations.defaults.appointment_reminder_hours",
    hoursBefore: 2,
  },
  appointment_thanks: {
    nameKey: "whatsapp.automations.defaults.appointment_thanks",
  },
  appointment_review_request: {
    nameKey: "whatsapp.automations.defaults.appointment_review_request",
    delayHours: 24,
  },
  new_client_welcome: {
    nameKey: "whatsapp.automations.defaults.new_client_welcome",
    delayMinutes: 5,
  },
  inactive_client: {
    nameKey: "whatsapp.automations.defaults.inactive_client",
    delayDays: 30,
  },
};

export default function WhatsAppAutomationsTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [automations, setAutomations] = useState<WhatsAppAutomation[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [trigger, setTrigger] =
    useState<WhatsAppAutomationTrigger>("new_lead_welcome");
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [hoursBefore, setHoursBefore] = useState(2);
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayHours, setDelayHours] = useState(24);
  const [delayDays, setDelayDays] = useState(3);

  const applyTriggerDefaults = (next: WhatsAppAutomationTrigger) => {
    const conf = DEFAULTS[next];
    setTrigger(next);
    setName(t(conf.nameKey));
    if (conf.hoursBefore != null) setHoursBefore(conf.hoursBefore);
    if (conf.delayMinutes != null) setDelayMinutes(conf.delayMinutes);
    if (conf.delayHours != null) setDelayHours(conf.delayHours);
    if (conf.delayDays != null) setDelayDays(conf.delayDays);
  };

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
      if (!name) applyTriggerDefaults(trigger);
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

  const showHoursBefore = trigger === "appointment_reminder_hours";
  const showDelayMinutes =
    trigger === "new_lead_welcome" || trigger === "new_client_welcome";
  const showDelayHours =
    trigger === "lead_no_response" || trigger === "appointment_review_request";
  const showDelayDays =
    trigger === "lead_followup_2" || trigger === "inactive_client";

  const triggerHint = useMemo(
    () => t(`whatsapp.automations.hints.${trigger}`),
    [t, trigger]
  );

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
        delayMinutes,
        delayHours,
        delayDays,
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

  const timingLabel = (auto: WhatsAppAutomation) => {
    if (auto.trigger === "appointment_reminder_hours") {
      return t("whatsapp.automations.timing.hoursBefore", {
        count: auto.hoursBefore ?? 24,
      });
    }
    if (
      auto.trigger === "new_lead_welcome" ||
      auto.trigger === "new_client_welcome"
    ) {
      return t("whatsapp.automations.timing.minutes", {
        count: auto.delayMinutes ?? 10,
      });
    }
    if (
      auto.trigger === "lead_no_response" ||
      auto.trigger === "appointment_review_request"
    ) {
      return t("whatsapp.automations.timing.hours", {
        count: auto.delayHours ?? 24,
      });
    }
    if (
      auto.trigger === "lead_followup_2" ||
      auto.trigger === "inactive_client"
    ) {
      return t("whatsapp.automations.timing.days", {
        count: auto.delayDays ?? 3,
      });
    }
    return "";
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
          <label className="grid gap-1.5 md:col-span-2">
            <span className="text-xs font-black text-slate-600">
              {t("whatsapp.automations.trigger")}
            </span>
            <select
              className={inputBase}
              value={trigger}
              onChange={(e) =>
                applyTriggerDefaults(
                  e.target.value as WhatsAppAutomationTrigger
                )
              }
            >
              {TRIGGERS.map((key) => (
                <option key={key} value={key}>
                  {t(`whatsapp.automations.triggers.${key}`)}
                </option>
              ))}
            </select>
            <span className="text-xs font-medium text-slate-400">
              {triggerHint}
            </span>
          </label>

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

          {showHoursBefore && (
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

          {showDelayMinutes && (
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.automations.delayMinutes")}
              </span>
              <input
                type="number"
                min={1}
                max={10080}
                className={inputBase}
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(Number(e.target.value) || 10)}
              />
            </label>
          )}

          {showDelayHours && (
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.automations.delayHours")}
              </span>
              <input
                type="number"
                min={1}
                max={720}
                className={inputBase}
                value={delayHours}
                onChange={(e) => setDelayHours(Number(e.target.value) || 24)}
              />
            </label>
          )}

          {showDelayDays && (
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.automations.delayDays")}
              </span>
              <input
                type="number"
                min={1}
                max={365}
                className={inputBase}
                value={delayDays}
                onChange={(e) => setDelayDays(Number(e.target.value) || 3)}
              />
            </label>
          )}
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
                  {timingLabel(auto) ? ` · ${timingLabel(auto)}` : ""}
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
