import React, { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Loader2,
  PlugZap,
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
  previewWhatsAppCampaign,
  previewWhatsAppComposeTemplate,
  sendWhatsAppCampaign,
  syncWhatsAppTemplates,
  type WhatsAppAppointmentStrategy,
  type WhatsAppCampaignPreviewRow,
  type WhatsAppConnection,
  type WhatsAppMailingList,
  type WhatsAppMappingAppointment,
  type WhatsAppRecipient,
  type WhatsAppSendPreviewState,
  type WhatsAppTemplate,
  type WhatsAppVariableMapping,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };
type AudienceType = "selected_clients" | "mailing_list";

export default function WhatsAppComposeTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { businessId } = useOutletContext<OutletCtx>();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connection, setConnection] = useState<WhatsAppConnection | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [lists, setLists] = useState<WhatsAppMailingList[]>([]);
  const [recipients, setRecipients] = useState<WhatsAppRecipient[]>([]);
  const [query, setQuery] = useState("");

  const [templateId, setTemplateId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [audienceType, setAudienceType] =
    useState<AudienceType>("selected_clients");
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [mailingListId, setMailingListId] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  );
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [previewBody, setPreviewBody] = useState("");
  const [previewMissing, setPreviewMissing] = useState<string[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [appointments, setAppointments] = useState<WhatsAppMappingAppointment[]>(
    []
  );
  const [appointmentState, setAppointmentState] =
    useState<WhatsAppSendPreviewState>("not_needed");
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [appointmentStrategy, setAppointmentStrategy] =
    useState<WhatsAppAppointmentStrategy>("next_upcoming");
  const [recipientAppointments, setRecipientAppointments] = useState<
    Record<string, string>
  >({});
  const [campaignRows, setCampaignRows] = useState<
    WhatsAppCampaignPreviewRow[]
  >([]);
  const [campaignVariableKeys, setCampaignVariableKeys] = useState<string[]>(
    []
  );
  const [campaignReadyCount, setCampaignReadyCount] = useState(0);

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    const preselected = searchParams.get("templateId") || "";

    const pickApproved = (rows: WhatsAppTemplate[]) =>
      rows.filter(
        (tpl) =>
          tpl.source === "meta" &&
          String(tpl.metaStatus || "").toUpperCase() === "APPROVED" &&
          tpl.status !== "archived"
      );

    (async () => {
      try {
        setLoading(true);
        // Fast path: local DB lists + status without CreditCard resolve.
        // Template sync from Meta runs after the UI is interactive.
        const [status, listed, ls, people] = await Promise.all([
          getWhatsAppStatus(businessId),
          listWhatsAppTemplates(businessId, { approvedOnly: true }),
          listWhatsAppLists(businessId),
          listWhatsAppRecipients(businessId),
        ]);
        if (cancelled) return;

        setConnection(status);
        setLists(ls);
        setRecipients(people);
        if (ls[0]?._id) setMailingListId(ls[0]._id);

        let approved = pickApproved(listed);
        setTemplates(approved);
        if (preselected && approved.some((tpl) => tpl._id === preselected)) {
          setTemplateId(preselected);
        } else if (approved[0]?._id) {
          setTemplateId(approved[0]._id);
        } else {
          setTemplateId("");
        }
        if (!cancelled) setLoading(false);

        // Background refresh so newly approved Meta templates appear without
        // blocking the compose screen.
        if (status?.connected) {
          try {
            const synced = await syncWhatsAppTemplates(businessId);
            if (cancelled) return;
            const syncedApproved = pickApproved(synced.templates || []);
            if (syncedApproved.length) {
              setTemplates(syncedApproved);
              setTemplateId((current) => {
                if (current && syncedApproved.some((tpl) => tpl._id === current)) {
                  return current;
                }
                if (
                  preselected &&
                  syncedApproved.some((tpl) => tpl._id === preselected)
                ) {
                  return preselected;
                }
                return syncedApproved[0]?._id || "";
              });
            }
          } catch {
            // Keep listed templates if sync fails.
          }
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || t("whatsapp.errors.loadCompose")
        );
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [businessId, t, searchParams]);

  const selectedTemplate = useMemo(
    () => templates.find((tpl) => tpl._id === templateId) || null,
    [templateId, templates]
  );

  const body = selectedTemplate?.body || "";
  const mappings: WhatsAppVariableMapping[] =
    selectedTemplate?.variableMappings || [];
  const manualMappings = mappings.filter((m) => m.source === "manual");
  const mappingReady = useMemo(() => {
    if (!selectedTemplate) return false;
    if (selectedTemplate.mappingReady) return true;
    if (selectedTemplate.mappingStatus === "ready") return true;
    const vars = selectedTemplate.variables || [];
    return vars.length === 0;
  }, [selectedTemplate]);

  useEffect(() => {
    if (!selectedTemplate) {
      setVariableValues({});
      return;
    }
    // Only seed manual mapping fields — never Meta example values for mapped vars.
    const next: Record<string, string> = {};
    const manuals = (selectedTemplate.variableMappings || []).filter(
      (m) => m.source === "manual"
    );
    for (const row of manuals) {
      next[row.variable] = "";
    }
    setVariableValues(next);
    setAppointmentId("");
    setAppointments([]);
    setAppointmentState("not_needed");
    setAppointmentMessage("");
    setPreviewBody("");
    setPreviewMissing([]);
  }, [selectedTemplate?._id]);

  const selectedRecipient = useMemo(() => {
    if (audienceType !== "selected_clients" || selectedClientIds.length !== 1) {
      return null;
    }
    return recipients.find((r) => r.id === selectedClientIds[0]) || null;
  }, [audienceType, selectedClientIds, recipients]);

  const needsAppointment = useMemo(
    () => mappings.some((m) => m.source === "appointment" && m.field),
    [mappings]
  );

  const multiRecipient =
    (audienceType === "selected_clients" && selectedClientIds.length > 1) ||
    audienceType === "mailing_list";

  useEffect(() => {
    if (!businessId || !selectedTemplate || !mappingReady) {
      setPreviewBody("");
      setPreviewMissing([]);
      setCampaignRows([]);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setPreviewLoading(true);
      try {
        if (multiRecipient) {
          const data = await previewWhatsAppCampaign(businessId, {
            templateId: selectedTemplate._id,
            audienceType,
            clientIds:
              audienceType === "selected_clients"
                ? selectedClientIds
                : undefined,
            mailingListId:
              audienceType === "mailing_list" ? mailingListId : undefined,
            variables: variableValues,
            appointmentStrategy,
            recipientAppointments,
          });
          if (cancelled) return;
          setCampaignRows(data.rows || []);
          setCampaignVariableKeys(data.variableKeys || []);
          setCampaignReadyCount(data.readyCount || 0);
          setPreviewMissing([]);
          setAppointmentMessage("");
          const firstReady = (data.rows || []).find((r) => r.ready);
          setPreviewBody(firstReady?.previewBody || selectedTemplate.body || "");
          return;
        }

        if (
          audienceType !== "selected_clients" ||
          selectedClientIds.length !== 1
        ) {
          setCampaignRows([]);
          setPreviewBody(selectedTemplate.body || "");
          setPreviewMissing([]);
          return;
        }

        const data = await previewWhatsAppComposeTemplate(
          businessId,
          selectedTemplate._id,
          {
            crmClientId: selectedRecipient?.id || null,
            phone: selectedRecipient?.phone || "",
            name: selectedRecipient?.name || "",
            appointmentId: appointmentId || null,
            manualValues: variableValues,
          }
        );
        if (cancelled) return;
        setCampaignRows([]);
        setPreviewBody(data.previewBody || "");
        setPreviewMissing(data.missing || []);
        setAppointments(data.appointments || []);
        setAppointmentState(data.appointmentState || "not_needed");
        setAppointmentMessage(data.selectAppointmentMessage || "");
        if (
          data.appointmentId &&
          data.appointmentState === "ready" &&
          data.appointmentId !== appointmentId
        ) {
          setAppointmentId(String(data.appointmentId));
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setPreviewBody("");
          setPreviewMissing([]);
          setCampaignRows([]);
          setAppointmentMessage(
            (error as { response?: { data?: { error?: string } } })?.response
              ?.data?.error || t("whatsapp.compose.previewFailed")
          );
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [
    businessId,
    selectedTemplate?._id,
    mappingReady,
    audienceType,
    selectedClientIds,
    selectedRecipient?.id,
    selectedRecipient?.phone,
    selectedRecipient?.name,
    appointmentId,
    variableValues,
    needsAppointment,
    multiRecipient,
    mailingListId,
    appointmentStrategy,
    recipientAppointments,
    t,
  ]);

  const missingVariables = useMemo(() => {
    const manualMissing = manualMappings
      .filter((m) => m.required !== false)
      .map((m) => m.variable)
      .filter((key) => !variableValues[key]?.trim());

    if (multiRecipient) {
      if (appointmentStrategy === "skip_missing") {
        return manualMissing;
      }
      const blocked = campaignRows.filter((r) => !r.ready);
      if (blocked.length && campaignReadyCount === 0) {
        return ["appointment"];
      }
      if (
        appointmentStrategy === "per_client" &&
        campaignRows.some((r) => !r.ready)
      ) {
        return ["appointment"];
      }
      return manualMissing;
    }

    const resolvedMissing = previewMissing.filter((key) => {
      const mapped = mappings.find((m) => m.variable === key);
      return mapped?.source !== "manual";
    });

    return Array.from(new Set([...manualMissing, ...resolvedMissing]));
  }, [
    manualMappings,
    variableValues,
    previewMissing,
    mappings,
    multiRecipient,
    appointmentStrategy,
    campaignRows,
    campaignReadyCount,
  ]);

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
    if (audienceType === "selected_clients") return selectedClientIds.length;
    if (audienceType === "mailing_list") {
      return (
        lists.find((l) => l._id === mailingListId)?.memberCount ||
        lists.find((l) => l._id === mailingListId)?.members?.length ||
        0
      );
    }
    return 0;
  }, [audienceType, selectedClientIds.length, lists, mailingListId]);

  const readyToSendCount = multiRecipient
    ? campaignReadyCount
    : estimatedCount;

  const toggleClient = (id: string) => {
    setSelectedClientIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      return next;
    });
    setAppointmentId("");
    setAppointments([]);
    setAppointmentMessage("");
    setRecipientAppointments((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleSend = async () => {
    if (!businessId) return;
    if (!connection?.connected) {
      toast.error(t("whatsapp.compose.notConnected"));
      return;
    }
    if (!connection?.readyToSend) {
      toast.error(t("whatsapp.compose.registrationRequired"));
      return;
    }
    if (!templateId || !selectedTemplate) {
      toast.error(t("whatsapp.compose.noTemplatesYet"));
      return;
    }
    if (selectedTemplate.metaStatus !== "APPROVED") {
      toast.error(t("whatsapp.compose.templateNotApproved"));
      return;
    }
    if (!mappingReady) {
      toast.error(t("whatsapp.compose.mappingRequiredToast"));
      return;
    }
    if (missingVariables.length) {
      toast.error(
        t("whatsapp.compose.missingVariables", {
          vars: missingVariables.map((v) => `{{${v}}}`).join(", "),
        })
      );
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
    if (multiRecipient && readyToSendCount < 1) {
      toast.error(t("whatsapp.compose.noReadyRecipients"));
      return;
    }
    if (!consentConfirmed) {
      toast.error(t("whatsapp.compose.consentRequired"));
      return;
    }

    try {
      setSending(true);
      const campaign = await sendWhatsAppCampaign(businessId, {
        name: campaignName.trim() || undefined,
        templateId,
        audienceType,
        clientIds:
          audienceType === "selected_clients" ? selectedClientIds : undefined,
        mailingListId:
          audienceType === "mailing_list" ? mailingListId : undefined,
        variables: variableValues,
        appointmentId:
          selectedClientIds.length === 1 ? appointmentId || null : null,
        appointmentStrategy: needsAppointment
          ? appointmentStrategy
          : "next_upcoming",
        recipientAppointments,
        consentConfirmed: true,
      });

      if ((campaign?.stats?.sent ?? 0) < 1) {
        toast.error(
          t("whatsapp.compose.sendFailedStats", {
            failed: campaign?.stats?.failed ?? 0,
          })
        );
        return;
      }

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
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p>{t("whatsapp.compose.notConnectedTitle")}</p>
                <p className="mt-1 font-medium text-amber-800">
                  {t("whatsapp.compose.notConnectedHint")}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => navigate("../settings")}
            >
              <PlugZap className="h-4 w-4" />
              {t("whatsapp.compose.connectCta")}
            </button>
          </div>
        )}

        {connection?.connected && !connection?.readyToSend && (
          <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p>{t("whatsapp.compose.registrationRequired")}</p>
                <p className="mt-1 font-medium text-amber-800">
                  {t("whatsapp.compose.registrationRequiredHint")}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={btnPrimary}
              onClick={() => navigate("../settings")}
            >
              <PlugZap className="h-4 w-4" />
              {t("whatsapp.compose.connectCta")}
            </button>
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

            <label className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.compose.selectTemplate")}
              </span>
              <select
                className={inputBase}
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
              >
                {templates.length === 0 && (
                  <option value="">
                    {t("whatsapp.compose.noTemplatesYet")}
                  </option>
                )}
                {templates.map((tpl) => {
                  const ready =
                    tpl.mappingReady ||
                    tpl.mappingStatus === "ready" ||
                    !(tpl.variables || []).length;
                  const metaLabel = t("whatsapp.compose.approvedMetaActive");
                  return (
                    <option key={tpl._id} value={tpl._id}>
                      {tpl.name} · {tpl.language} · {metaLabel}
                      {ready
                        ? ` · ${t("whatsapp.compose.mappingReadySuffix")}`
                        : ` · ${t("whatsapp.compose.mappingNeededSuffix")}`}
                    </option>
                  );
                })}
              </select>
            </label>

            {selectedTemplate && !mappingReady ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm font-semibold text-amber-800">
                {t("whatsapp.compose.mappingBanner")}{" "}
                <button
                  type="button"
                  className="font-black text-emerald-700 underline"
                  onClick={() => navigate("../templates")}
                >
                  {t("whatsapp.compose.goToMapping")}
                </button>
              </div>
            ) : null}

            {manualMappings.length > 0 && (
              <div className="grid gap-2 rounded-xl border border-slate-200 p-3">
                <p className="text-xs font-black text-slate-600">
                  {t("whatsapp.compose.manualValues")}
                </p>
                {manualMappings.map((row) => (
                  <label key={row.variable} className="grid gap-1">
                    <span className="text-xs font-semibold text-slate-500">
                      <span dir="ltr">{`{{${row.variable}}}`}</span>
                      {row.friendlyName ? ` · ${row.friendlyName}` : ""}
                    </span>
                    <input
                      className={inputBase}
                      value={variableValues[row.variable] || ""}
                      onChange={(e) =>
                        setVariableValues((prev) => ({
                          ...prev,
                          [row.variable]: e.target.value,
                        }))
                      }
                      placeholder={t("whatsapp.compose.variablePlaceholder", {
                        n: row.variable,
                      })}
                    />
                  </label>
                ))}
              </div>
            )}

            {needsAppointment &&
            audienceType === "selected_clients" &&
            selectedClientIds.length === 1 ? (
              <div className="grid gap-2 rounded-xl border border-sky-200 bg-sky-50/60 p-3">
                <label className="grid gap-1">
                  <span className="text-xs font-black text-slate-600">
                    {t("whatsapp.compose.selectAppointment")}
                  </span>
                  <select
                    className={inputBase}
                    value={appointmentId}
                    onChange={(e) => setAppointmentId(e.target.value)}
                    disabled={appointmentState === "none"}
                  >
                    <option value="">
                      {appointmentState === "none"
                        ? t("whatsapp.compose.noAppointmentForClient")
                        : t("whatsapp.compose.selectAppointment")}
                    </option>
                    {appointments.map((appt) => (
                      <option key={appt.id} value={appt.id}>
                        {appt.label}
                      </option>
                    ))}
                  </select>
                </label>
                {appointmentMessage ? (
                  <p className="text-xs font-semibold text-amber-800">
                    {appointmentMessage}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-1.5">
              <span className="text-xs font-black text-slate-600">
                {t("whatsapp.compose.body")}
              </span>
              <div
                className={`${inputBase} min-h-[120px] whitespace-pre-wrap py-3 text-slate-700`}
                dir={
                  String(selectedTemplate?.language || "")
                    .toLowerCase()
                    .startsWith("en")
                    ? "ltr"
                    : undefined
                }
                style={
                  String(selectedTemplate?.language || "")
                    .toLowerCase()
                    .startsWith("en")
                    ? { textAlign: "left" }
                    : undefined
                }
              >
                {body || t("whatsapp.compose.previewEmpty")}
              </div>
            </div>
          </div>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <h2 className="text-base font-black text-slate-900">
            {t("whatsapp.compose.audienceTitle")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.compose.audienceSubtitle")}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(
              [
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

          {needsAppointment && multiRecipient ? (
            <div className="mt-4 grid gap-2 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
              <p className="text-xs font-black text-slate-700">
                {t("whatsapp.compose.appointmentRule")}
              </p>
              {(
                [
                  ["next_upcoming", "whatsapp.compose.ruleNextUpcoming"],
                  ["per_client", "whatsapp.compose.rulePerClient"],
                  ["skip_missing", "whatsapp.compose.ruleSkipMissing"],
                ] as const
              ).map(([value, labelKey]) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-start gap-2 text-sm font-semibold text-slate-700"
                >
                  <input
                    type="radio"
                    className="mt-0.5 accent-emerald-600"
                    checked={appointmentStrategy === value}
                    onChange={() => setAppointmentStrategy(value)}
                  />
                  <span>{t(labelKey)}</span>
                </label>
              ))}
            </div>
          ) : null}

          {campaignRows.length > 0 ? (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-xs font-black text-slate-700">
                  {t("whatsapp.compose.recipientPreviewTitle")}
                </p>
                <p className="text-[11px] font-semibold text-slate-500">
                  {t("whatsapp.compose.recipientPreviewHint", {
                    ready: campaignReadyCount,
                    total: campaignRows.length,
                  })}
                </p>
              </div>
              <table className="min-w-full text-left text-xs">
                <thead className="bg-white text-slate-500">
                  <tr>
                    <th className="px-3 py-2 font-bold">
                      {t("whatsapp.compose.colRecipient")}
                    </th>
                    <th className="px-3 py-2 font-bold">
                      {t("whatsapp.compose.colPhone")}
                    </th>
                    <th className="px-3 py-2 font-bold">
                      {t("whatsapp.compose.colAppointment")}
                    </th>
                    {campaignVariableKeys.map((key) => (
                      <th key={key} className="px-3 py-2 font-bold" dir="ltr">
                        {`{{${key}}}`}
                      </th>
                    ))}
                    <th className="px-3 py-2 font-bold">
                      {t("whatsapp.compose.colStatus")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaignRows.map((row) => (
                    <tr
                      key={`${row.crmClientId || row.phone}`}
                      className="border-t border-slate-100"
                    >
                      <td className="px-3 py-2 font-semibold text-slate-800">
                        {row.name}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-600" dir="ltr">
                        {row.phone}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-600">
                        {appointmentStrategy === "per_client" &&
                        row.crmClientId &&
                        (row.validationStatus === "select_appointment" ||
                          row.validationStatus === "missing_appointment" ||
                          row.appointments.length > 1) ? (
                          <select
                            className={`${inputBase} min-w-[180px] py-1 text-xs`}
                            value={
                              recipientAppointments[row.crmClientId] ||
                              row.appointmentId ||
                              ""
                            }
                            onChange={(e) =>
                              setRecipientAppointments((prev) => ({
                                ...prev,
                                [row.crmClientId as string]: e.target.value,
                              }))
                            }
                          >
                            <option value="">
                              {row.validationStatus === "missing_appointment"
                                ? t("whatsapp.compose.noAppointmentForClient")
                                : t("whatsapp.compose.selectAppointment")}
                            </option>
                            {row.appointments.map((appt) => (
                              <option key={appt.id} value={appt.id}>
                                {appt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          row.appointmentLabel || "—"
                        )}
                      </td>
                      {campaignVariableKeys.map((key) => (
                        <td
                          key={key}
                          className="px-3 py-2 font-medium text-slate-700"
                        >
                          {row.resolved?.[key] || "—"}
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <span
                          className={[
                            "rounded-md px-2 py-0.5 text-[11px] font-bold",
                            row.ready
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-800",
                          ].join(" ")}
                        >
                          {row.ready
                            ? t("whatsapp.compose.statusReady")
                            : row.validationLabel ||
                              t("whatsapp.compose.statusMissingAppointment")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
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
            <div
              className="ms-auto max-w-[85%] rounded-2xl rounded-ee-md bg-[#DCF8C6] px-3 py-2 text-sm font-medium leading-relaxed text-slate-800 shadow-sm whitespace-pre-wrap"
              dir={
                String(selectedTemplate?.language || "")
                  .toLowerCase()
                  .startsWith("en")
                  ? "ltr"
                  : undefined
              }
              style={
                String(selectedTemplate?.language || "")
                  .toLowerCase()
                  .startsWith("en")
                  ? { textAlign: "left" }
                  : undefined
              }
            >
              {previewLoading
                ? t("whatsapp.compose.previewLoading")
                : previewBody || t("whatsapp.compose.previewEmpty")}
            </div>
            {appointmentMessage && !previewLoading ? (
              <p className="mt-3 text-xs font-semibold text-amber-800">
                {appointmentMessage}
              </p>
            ) : null}
          </div>
        </section>

        <section className={`${cardBase} p-4 sm:p-5`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                {t("whatsapp.compose.readyToSend")}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {readyToSendCount}
              </p>
              <p className="text-sm font-medium text-slate-500">
                {multiRecipient
                  ? t("whatsapp.compose.readyRecipientsCount", {
                      ready: readyToSendCount,
                      total: estimatedCount,
                    })
                  : t("whatsapp.compose.recipientsCount")}
              </p>
            </div>
          </div>

          <label className="mt-4 flex items-start gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              className="mt-0.5 accent-emerald-600"
              checked={consentConfirmed}
              onChange={(e) => setConsentConfirmed(e.target.checked)}
            />
            <span>{t("whatsapp.compose.consentLabel")}</span>
          </label>

          <button
            type="button"
            disabled={
              sending ||
              !connection?.connected ||
              !connection?.readyToSend ||
              readyToSendCount === 0 ||
              !templateId ||
              !consentConfirmed ||
              !mappingReady ||
              missingVariables.length > 0 ||
              (needsAppointment &&
                selectedClientIds.length === 1 &&
                (appointmentState === "none" ||
                  (appointmentState === "select" && !appointmentId)))
            }
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

          <button
            type="button"
            className={`${btnSecondary} mt-2 w-full`}
            onClick={() => navigate("../templates")}
          >
            {t("whatsapp.compose.manageTemplates")}
          </button>
        </section>
      </aside>
    </div>
  );
}
