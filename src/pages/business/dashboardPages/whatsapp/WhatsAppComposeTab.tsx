import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Loader2,
  Search,
  Send,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  getWhatsAppStatus,
  listWhatsAppLists,
  listWhatsAppRecipients,
  listWhatsAppTemplates,
  sendWhatsAppCampaign,
  type WhatsAppConnection,
  type WhatsAppMailingList,
  type WhatsAppRecipient,
  type WhatsAppTemplate,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

type AudienceType = "all_clients" | "selected_clients" | "mailing_list";

function renderPreview(body: string, name = "ישראל ישראלי") {
  return String(body || "")
    .replace(/\{\{\s*name\s*\}\}/gi, name)
    .replace(/\{\{\s*date\s*\}\}/gi, "30/07/2026")
    .replace(/\{\{\s*time\s*\}\}/gi, "10:00")
    .replace(/\{\{\s*service\s*\}\}/gi, "טיפול");
}

export default function WhatsAppComposeTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [lists, setLists] = useState<WhatsAppMailingList[]>([]);
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>([]);
  const [query, setQuery] = useState("");

  const [templateId, setTemplateId] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [useCustomBody, setUseCustomBody] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [audienceType, setAudienceType] = useState<AudienceType>("all_clients");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [mailingListId, setMailingListId] = useState("");

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [status, tpls, ls, people] = await Promise.all([
          getWhatsAppStatus(businessId),
          listWhatsAppTemplates(businessId),
          listWhatsAppLists(businessId),
          listWhatsAppRecipients(businessId),
        ]);
        if (cancelled) return;
        setConnection(status);
        setTemplates(tpls);
        setLists(ls);
        setRecipients(people);
        if (tpls[0]?._id) {
          setTemplateId(tpls[0]._id);
          setCustomBody(tpls[0].body);
        }
        if (ls[0]?._id) setMailingListId(ls[0]._id);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || t("whatsapp.errors.loadCompose")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [businessId, t]);

  const selectedTemplate = useMemo(
    () => templates.find((tpl) => tpl._id === templateId) || null,
    [templateId, templates]
  );

  const body = useCustomBody ? customBody : selectedTemplate?.body || customBody;

  const filteredRecipients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipients;
    return recipients.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.email || "").toLowerCase().includes(q)
    );
  }, [query, recipients]);

  const estimatedCount = useMemo(() => {
    if (audienceType === "all_clients") return recipients.length;
    if (audienceType === "selected_clients") return selectedClientIds.length;
    if (audienceType === "mailing_list") {
      return (
        lists.find((l) => l._id === mailingListId)?.memberCount ||
        lists.find((l) => l._id === mailingListId)?.members?.length ||
        0
      );
    }
    return 0;
  }, [
    audienceType,
    recipients.length,
    selectedClientIds.length,
    lists,
    mailingListId,
  ]);

  const toggleClient = (id: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onTemplateChange = (id: string) => {
    setTemplateId(id);
    const tpl = templates.find((item) => item._id === id);
    if (tpl && !useCustomBody) setCustomBody(tpl.body);
  };

  const handleSend = async () => {
    if (!businessId) return;
    if (!body.trim()) {
      toast.error(t("whatsapp.compose.emptyBody"));
      return;
    }
    if (audienceType === "selected_clients" && !selectedClientIds.length) {
      toast.error(t("whatsapp.compose.noSelectedClients"));
      return;
    }
    if (audienceType === "mailing_list" && !mailingListId) {
      toast.error(t("whatsapp.compose.noList"));
      return;
    }
    if (!connection?.connected) {
      toast.error(t("whatsapp.compose.notConnected"));
      return;
    }

    try {
      setSending(true);
      const campaign = await sendWhatsAppCampaign(businessId, {
        name: campaignName.trim() || undefined,
        templateId: useCustomBody ? undefined : templateId || undefined,
        body: useCustomBody ? customBody : undefined,
        audienceType,
        clientIds:
          audienceType === "selected_clients" ? selectedClientIds : undefined,
        mailingListId:
          audienceType === "mailing_list" ? mailingListId : undefined,
      });

      toast.success(
        t("whatsapp.compose.sendSuccess", {
          sent: campaign?.stats?.sent ?? 0,
          failed: campaign?.stats?.failed ?? 0,
        })
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.sendFailed")
      );
    } finally {
      setSending(false);
    }
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
    <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="space-y-4">
        {!connection?.connected && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{t("whatsapp.compose.notConnectedTitle")}</p>
              <p className="mt-1 font-medium text-amber-800">
                {t("whatsapp.compose.notConnectedHint")}
              </p>
            </div>
          </div>
        )}

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h2 className="text-base font-black text-slate-900">
            {t("whatsapp.compose.messageTitle")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.compose.messageSubtitle")}
          </p>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.compose.campaignName")}
              </span>
              <input
                className={inputBase}
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder={t("whatsapp.compose.campaignNamePlaceholder")}
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={!useCustomBody ? btnPrimary : btnSecondary}
                onClick={() => {
                  setUseCustomBody(false);
                  if (selectedTemplate) setCustomBody(selectedTemplate.body);
                }}
              >
                {t("whatsapp.compose.fromTemplate")}
              </button>
              <button
                type="button"
                className={useCustomBody ? btnPrimary : btnSecondary}
                onClick={() => setUseCustomBody(true)}
              >
                {t("whatsapp.compose.customMessage")}
              </button>
            </div>

            {!useCustomBody && (
              <label className="grid gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  {t("whatsapp.compose.selectTemplate")}
                </span>
                <select
                  className={inputBase}
                  value={templateId}
                  onChange={(e) => onTemplateChange(e.target.value)}
                >
                  {templates.map((tpl) => (
                    <option key={tpl._id} value={tpl._id}>
                      {tpl.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.compose.body")}
              </span>
              <textarea
                className={`${inputBase} min-h-[160px] py-3`}
                value={body}
                onChange={(e) => {
                  setUseCustomBody(true);
                  setCustomBody(e.target.value);
                }}
                placeholder={t("whatsapp.compose.bodyPlaceholder")}
              />
              <span className="text-xs font-medium text-slate-400">
                {t("whatsapp.compose.variablesHint")}{" "}
                <span dir="ltr" className="font-bold text-slate-500">
                  {"{{name}} {{date}} {{time}} {{service}}"}
                </span>
              </span>
            </label>
          </div>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h2 className="text-base font-black text-slate-900">
            {t("whatsapp.compose.audienceTitle")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.compose.audienceSubtitle")}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {(
              [
                ["all_clients", "whatsapp.compose.audienceAll"],
                ["selected_clients", "whatsapp.compose.audienceSelected"],
                ["mailing_list", "whatsapp.compose.audienceList"],
              ] as const
            ).map(([value, labelKey]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAudienceType(value)}
                className={[
                  "rounded-xl border px-3 py-3 text-start transition",
                  audienceType === value
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 text-sm font-black">
                  <Users className="h-4 w-4" />
                  {t(labelKey)}
                </div>
              </button>
            ))}
          </div>

          {audienceType === "mailing_list" && (
            <label className="mt-4 grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.compose.selectList")}
              </span>
              <select
                className={inputBase}
                value={mailingListId}
                onChange={(e) => setMailingListId(e.target.value)}
              >
                {lists.length === 0 && (
                  <option value="">{t("whatsapp.compose.noListsYet")}</option>
                )}
                {lists.map((list) => (
                  <option key={list._id} value={list._id}>
                    {list.name} ({list.memberCount ?? list.members?.length ?? 0})
                  </option>
                ))}
              </select>
            </label>
          )}

          {audienceType === "selected_clients" && (
            <div className="mt-4">
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${inputBase} ps-10`}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("whatsapp.compose.searchClients")}
                />
              </div>
              <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {filteredRecipients.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm font-medium text-slate-400">
                    {t("whatsapp.compose.noClients")}
                  </p>
                ) : (
                  filteredRecipients.map((client) => {
                    const checked = selectedClientIds.includes(client.id);
                    return (
                      <label
                        key={client.id}
                        className={[
                          "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition",
                          checked ? "bg-emerald-50" : "hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleClient(client.id)}
                          className="h-4 w-4 accent-emerald-600"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-slate-800">
                            {client.name}
                          </span>
                          <span className="block truncate text-xs font-medium text-slate-500">
                            {client.phone}
                          </span>
                        </span>
                        {checked && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
        <section className={`${cardBase} overflow-hidden`}>
          <div className="border-b border-slate-100 bg-gradient-to-l from-emerald-50 via-white to-sky-50 px-4 py-3">
            <h3 className="text-sm font-black text-slate-900">
              {t("whatsapp.compose.preview")}
            </h3>
          </div>
          <div className="bg-[#ECE5DD] p-4">
            <div className="ms-auto max-w-[85%] rounded-2xl rounded-ee-md bg-[#DCF8C6] px-3 py-2 text-sm font-medium leading-relaxed text-slate-800 shadow-sm">
              {renderPreview(body) || t("whatsapp.compose.previewEmpty")}
            </div>
          </div>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {t("whatsapp.compose.readyToSend")}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {estimatedCount}
              </p>
              <p className="text-sm font-medium text-slate-500">
                {t("whatsapp.compose.recipientsCount")}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={sending || estimatedCount === 0}
            onClick={handleSend}
            className={`${btnPrimary} mt-4 w-full`}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending
              ? t("whatsapp.compose.sending")
              : t("whatsapp.compose.sendCta")}
          </button>
        </section>
      </aside>
    </div>
  );
}
