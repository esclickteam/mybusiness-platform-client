import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  cancelInvistimoScheduledMessage,
  createInvistimoScheduledMessage,
  listInvistimoScheduledMessages,
  listWhatsAppLists,
  listWhatsAppTemplates,
  type WhatsAppCampaign,
  type WhatsAppMailingList,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import { getTextDirection } from "../../../../i18n/localeUtils";
import {
  btnPrimary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";
import type { WhatsAppHubOutletContext } from "./WhatsAppMain";

export default function WhatsAppInvistimoScheduledTab() {
  const { t, i18n } = useTranslation();
  const { businessId } = useOutletContext<WhatsAppHubOutletContext>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<WhatsAppCampaign[]>([]);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [lists, setLists] = useState<WhatsAppMailingList[]>([]);
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [mailingListId, setMailingListId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [consent, setConsent] = useState(false);

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [campaigns, tpls, ls] = await Promise.all([
        listInvistimoScheduledMessages(businessId),
        listWhatsAppTemplates(businessId),
        listWhatsAppLists(businessId),
      ]);
      setRows(campaigns);
      setTemplates(tpls);
      setLists(ls);
      if (!templateId && tpls[0]?._id) setTemplateId(tpls[0]._id);
      if (!mailingListId && ls[0]?._id) setMailingListId(ls[0]._id);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.loadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const schedule = async () => {
    if (!businessId) return;
    try {
      setSaving(true);
      await createInvistimoScheduledMessage(businessId, {
        name,
        templateId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        audienceType: mailingListId ? "mailing_list" : "manual",
        mailingListId: mailingListId || null,
        consentConfirmed: consent,
      });
      toast.success(t("whatsapp.invistimoOps.scheduledSaved"));
      setName("");
      setConsent(false);
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.saveError")
      );
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id: string) => {
    if (!businessId) return;
    try {
      await cancelInvistimoScheduledMessage(businessId, id);
      await load();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.invistimoOps.saveError")
      );
    }
  };

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-4">
      <div className={`${cardBase} p-4`}>
        <h2 className="text-base font-black text-slate-900">
          {t("whatsapp.invistimoOps.scheduledTitle")}
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          {t("whatsapp.invistimoOps.scheduledSubtitle")}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            className={inputBase}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("whatsapp.compose.campaignName")}
          />
          <input
            type="datetime-local"
            className={inputBase}
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
          />
          <select
            className={inputBase}
            value={templateId}
            onChange={(event) => setTemplateId(event.target.value)}
          >
            {templates.map((tpl) => (
              <option key={tpl._id} value={tpl._id}>
                {tpl.name}
              </option>
            ))}
          </select>
          <select
            className={inputBase}
            value={mailingListId}
            onChange={(event) => setMailingListId(event.target.value)}
          >
            <option value="">{t("whatsapp.invistimoOps.noList")}</option>
            {lists.map((list) => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
          />
          {t("whatsapp.invistimoOps.consent")}
        </label>
        <button
          type="button"
          className={`${btnPrimary} mt-3`}
          disabled={saving}
          onClick={() => void schedule()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {t("whatsapp.invistimoOps.schedule")}
        </button>
      </div>

      <section className={`${cardBase} p-4`}>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("whatsapp.invistimoOps.noScheduled")}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((row) => (
              <li
                key={row._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2"
              >
                <div>
                  <div className="text-sm font-bold">{row.name}</div>
                  <div className="text-xs text-slate-500">
                    {row.templateName || "—"} · {row.status}
                    {row.scheduledAt
                      ? ` · ${new Date(row.scheduledAt).toLocaleString()}`
                      : ""}
                  </div>
                </div>
                {row.status !== "cancelled" ? (
                  <button
                    type="button"
                    className="text-xs font-bold text-rose-700"
                    onClick={() => void cancel(row._id)}
                  >
                    {t("whatsapp.invistimoOps.cancel")}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
