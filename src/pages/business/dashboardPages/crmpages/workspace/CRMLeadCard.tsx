import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Save,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../../i18n/localeUtils";
import API from "@api";
import { getApiErrorMessage } from "../../../../../utils/apiErrorMessage";
import {
  addDocument,
  assignLead,
  createDeal,
  createMeeting,
  fetchDeals,
  fetchTimeline,
  fetchWorkspaceSettings,
  logCall,
  patchLead,
  type CrmDeal,
  type LeadCustomField,
  type TimelineEvent,
  type WorkspaceLead,
} from "./crmWorkspaceApi";

type TabKey =
  | "overview"
  | "personal"
  | "source"
  | "form"
  | "activity"
  | "tasks"
  | "meetings"
  | "documents"
  | "deals"
  | "payments";

const TABS: TabKey[] = [
  "overview",
  "personal",
  "source",
  "form",
  "activity",
  "tasks",
  "meetings",
  "documents",
  "deals",
  "payments",
];

function whatsappHref(phone?: string) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default function CRMLeadCard({
  leadId,
  agents,
  onClose,
  onChanged,
}: {
  leadId: string;
  agents: Array<{ _id: string; name: string }>;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "he";
  const [lead, setLead] = useState<WorkspaceLead | null>(null);
  const [tab, setTab] = useState<TabKey>("overview");
  const [fields, setFields] = useState<LeadCustomField[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [deals, setDeals] = useState<CrmDeal[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [taskText, setTaskText] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [callNote, setCallNote] = useState("");
  const [callOutcome, setCallOutcome] = useState("answered");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingAt, setMeetingAt] = useState("");
  const [docName, setDocName] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [dealName, setDealName] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, unknown>>({});
  const [status, setStatus] = useState("new");

  const load = async () => {
    setError("");
    try {
      const [{ data }, settings, events, dealRows] = await Promise.all([
        API.get(`/crm/leads/${leadId}`),
        fetchWorkspaceSettings(),
        fetchTimeline(leadId),
        fetchDeals({ leadId }),
      ]);
      setLead(data.lead);
      setStatus(data.lead?.status || "new");
      setCustomValues(data.lead?.customValues || {});
      setFields(settings.leadCustomFields || []);
      setTimeline(events);
      setDeals(dealRows);
    } catch (err) {
      setError(getApiErrorMessage(err, t("crm.leads.errors.loadFailed")));
    }
  };

  useEffect(() => {
    void load();
  }, [leadId]);

  const flash = (message: string) => {
    setNotice(message);
    onChanged();
    void load();
  };

  const saveCustom = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      await patchLead(lead._id, {
        customValues,
        expectedUpdatedAt: lead.updatedAt,
      });
      flash(t("crm.workspace.saved"));
    } catch (err) {
      setError(getApiErrorMessage(err, t("crm.leads.errors.requestFailed")));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (next: string) => {
    if (!lead) return;
    setStatus(next);
    try {
      await API.patch(`/crm/leads/${lead._id}/status`, { status: next });
      flash(t("crm.workspace.statusUpdated"));
    } catch (err) {
      setError(getApiErrorMessage(err, t("crm.leads.errors.updateStatusFailed")));
    }
  };

  const addActivity = async (type: string, text: string, extra: Record<string, unknown> = {}) => {
    if (!lead || !text.trim()) return;
    await API.post(`/crm/leads/${lead._id}/activities`, { type, text, ...extra });
    flash(t("crm.workspace.saved"));
  };

  const payments = useMemo(
    () => deals.filter((deal) => deal.status === "won"),
    [deals]
  );

  if (!lead) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 p-3">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-center rounded-2xl bg-white">
          <p className="text-sm font-bold text-slate-500">{t("crm.common.loading")}</p>
        </div>
      </div>
    );
  }

  const name = lead.fullName || lead.name || t("crm.common.unnamedClient");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-2 sm:p-4" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto flex min-h-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-[#6D28D9]">
                {t("crm.leads.drawer.dossierBadge")}
              </p>
              <h2 className="text-xl font-black text-slate-900">{name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-slate-500">
                <span dir="ltr">{lead.phone || t("crm.common.noPhone")}</span>
                <span>{lead.email || t("crm.common.noEmail")}</span>
                <span>{t(`crm.leads.statuses.${lead.status || "new"}`, { defaultValue: lead.status })}</span>
                <span>{lead.assignedToName || t("crm.leads.unassignedAgent")}</span>
                <span>{lead.source}</span>
                <span>{lead.createdAt ? new Date(lead.createdAt).toLocaleString(locale) : ""}</span>
                <span>{lead.updatedAt ? new Date(lead.updatedAt).toLocaleString(locale) : ""}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
            >
              {t("crm.common.close")}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {lead.phone && (
              <a className="quick-btn" href={`tel:${lead.phone}`}>
                <Phone className="h-3.5 w-3.5" /> {t("crm.common.call")}
              </a>
            )}
            {whatsappHref(lead.phone) && (
              <a className="quick-btn" href={whatsappHref(lead.phone)} target="_blank" rel="noreferrer">
                <MessageCircle className="h-3.5 w-3.5" /> {t("crm.common.whatsapp")}
              </a>
            )}
            {lead.email && (
              <a className="quick-btn" href={`mailto:${lead.email}`}>
                <Mail className="h-3.5 w-3.5" /> {t("crm.common.email")}
              </a>
            )}
            <button type="button" className="quick-btn" onClick={() => setTab("tasks")}>
              <CheckCircle2 className="h-3.5 w-3.5" /> {t("crm.common.task")}
            </button>
            <button type="button" className="quick-btn" onClick={() => setTab("meetings")}>
              <CalendarDays className="h-3.5 w-3.5" /> {t("crm.workspace.meeting")}
            </button>
            <button type="button" className="quick-btn" onClick={() => setTab("activity")}>
              <Plus className="h-3.5 w-3.5" /> {t("crm.common.note")}
            </button>
            <select
              value={status}
              onChange={(event) => void changeStatus(event.target.value)}
              className="h-9 rounded-xl border border-slate-200 px-2 text-xs font-black"
            >
              {["new", "contacted", "in_progress", "interested", "quote", "negotiation", "converted", "lost", "old"].map(
                (value) => (
                  <option key={value} value={value}>
                    {t(`crm.leads.statuses.${value}`, { defaultValue: value })}
                  </option>
                )
              )}
            </select>
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`shrink-0 px-3 py-2 text-xs font-black ${
                tab === key ? "text-[#6D28D9] border-b-2 border-[#6D28D9]" : "text-slate-500"
              }`}
            >
              {t(`crm.workspace.tabs.${key}`)}
            </button>
          ))}
        </nav>

        <div className="flex-1 space-y-4 p-4">
          {error && <p className="rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
          {notice && <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{notice}</p>}

          {tab === "overview" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Fact label={t("crm.common.name")} value={name} />
              <Fact label={t("crm.common.phone")} value={lead.phone} ltr />
              <Fact label={t("crm.common.email")} value={lead.email} />
              <Fact label={t("crm.common.status")} value={lead.status} />
              <Fact label={t("crm.leads.table.agent")} value={lead.assignedToName} />
              <Fact label={t("crm.leads.table.source")} value={lead.source} />
            </div>
          )}

          {tab === "personal" && (
            <div className="space-y-3">
              {fields.filter((field) => field.active !== false).map((field) => (
                <label key={field.id} className="block text-xs font-black text-slate-600">
                  {field.label}
                  {field.type === "boolean" ? (
                    <input
                      type="checkbox"
                      className="ms-2"
                      checked={Boolean(customValues[field.key])}
                      onChange={(event) =>
                        setCustomValues((prev) => ({ ...prev, [field.key]: event.target.checked }))
                      }
                    />
                  ) : field.type === "select" ? (
                    <select
                      className="mt-1 h-10 w-full rounded-xl border px-3"
                      value={String(customValues[field.key] || "")}
                      onChange={(event) =>
                        setCustomValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                      }
                    >
                      <option value="">{t("crm.common.select")}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="mt-1 h-10 w-full rounded-xl border px-3"
                      type={field.type === "number" || field.type === "money" ? "number" : field.type === "url" ? "url" : "text"}
                      value={String(customValues[field.key] ?? "")}
                      onChange={(event) =>
                        setCustomValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                      }
                    />
                  )}
                </label>
              ))}
              <button type="button" onClick={() => void saveCustom()} className="quick-btn">
                <Save className="h-3.5 w-3.5" /> {saving ? t("crm.common.saving") : t("crm.common.save")}
              </button>
            </div>
          )}

          {tab === "source" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Fact label={t("crm.workspace.adPlatform")} value={lead.provider || lead.source} />
              <Fact label={t("crm.leads.drawer.campaign")} value={lead.facebook?.campaignName || lead.google?.campaignName || lead.campaignName} />
              <Fact label={t("crm.leads.drawer.campaignId")} value={lead.facebook?.campaignId || lead.google?.campaignId} />
              <Fact label={t("crm.workspace.adset")} value={lead.facebook?.adsetName} />
              <Fact label={t("crm.workspace.ad")} value={lead.facebook?.adName} />
              <Fact label={t("crm.workspace.adId")} value={lead.facebook?.adId} />
              <Fact label={t("crm.leads.drawer.form")} value={lead.facebook?.formName || lead.google?.formName || lead.formName} />
              <Fact label={t("crm.leads.drawer.formId")} value={lead.facebook?.formId || lead.formId} />
              <Fact label={t("crm.workspace.receivedAt")} value={lead.facebook?.createdTime || lead.google?.createdTime || lead.createdAt} />
              {(lead.facebook?.campaignId || lead.google?.campaignId) && (
                <a
                  className="quick-btn"
                  href="/business/dashboard/meta-campaigns"
                  onClick={(event) => {
                    event.preventDefault();
                    window.location.assign("../meta-campaigns");
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" /> {t("crm.workspace.openCampaign")}
                </a>
              )}
            </div>
          )}

          {tab === "form" && (
            <div className="space-y-2">
              {(lead.details || []).length ? (
                (lead.details || []).map((detail, index) => (
                  <Fact key={`${detail.label}-${index}`} label={detail.label} value={detail.value} />
                ))
              ) : (
                <p className="text-sm font-bold text-slate-500">{t("crm.leads.drawer.noFormData")}</p>
              )}
            </div>
          )}

          {tab === "activity" && (
            <div className="space-y-3">
              <textarea
                className="w-full rounded-xl border p-3 text-sm"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t("crm.leads.drawer.notePlaceholder")}
              />
              <button type="button" className="quick-btn" onClick={() => void addActivity("note", note).then(() => setNote(""))}>
                {t("crm.common.save")}
              </button>
              <div className="flex flex-wrap gap-2">
                <select value={callOutcome} onChange={(event) => setCallOutcome(event.target.value)} className="h-10 rounded-xl border px-2 text-xs font-black">
                  <option value="answered">{t("crm.workspace.callOutcomes.answered")}</option>
                  <option value="no_answer">{t("crm.workspace.callOutcomes.no_answer")}</option>
                  <option value="interested">{t("crm.workspace.callOutcomes.interested")}</option>
                  <option value="not_interested">{t("crm.workspace.callOutcomes.not_interested")}</option>
                </select>
                <input className="h-10 flex-1 rounded-xl border px-3 text-sm" value={callNote} onChange={(event) => setCallNote(event.target.value)} placeholder={t("crm.workspace.callNote")} />
                <button
                  type="button"
                  className="quick-btn"
                  onClick={() => void logCall(lead._id, callOutcome, callNote).then(() => flash(t("crm.workspace.callLogged")))}
                >
                  {t("crm.workspace.logCall")}
                </button>
              </div>
              <ol className="space-y-2">
                {timeline.map((event, index) => (
                  <li key={event.id || index} className="rounded-xl border border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-800">{event.text}</p>
                    <p className="mt-1 text-[11px] font-bold text-slate-400">
                      {event.at ? new Date(event.at).toLocaleString(locale) : ""} · {event.actor || t("crm.common.systemUser")}
                      {event.callOutcome ? ` · ${t(`crm.workspace.callOutcomes.${event.callOutcome}`)}` : ""}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === "tasks" && (
            <div className="space-y-3">
              <input className="h-10 w-full rounded-xl border px-3" value={taskText} onChange={(event) => setTaskText(event.target.value)} placeholder={t("crm.leads.drawer.taskPlaceholder")} />
              <input className="h-10 w-full rounded-xl border px-3" type="datetime-local" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} />
              <button
                type="button"
                className="quick-btn"
                onClick={() =>
                  void addActivity("task", taskText, { taskDueAt: taskDue }).then(() => {
                    setTaskText("");
                    setTaskDue("");
                  })
                }
              >
                {t("crm.workspace.addTask")}
              </button>
              <ul className="space-y-2">
                {(lead.activities || [])
                  .filter((activity) => activity.type === "task")
                  .map((activity) => (
                    <li key={String(activity._id || activity.id)} className="rounded-xl border p-3 text-sm font-bold">
                      {String(activity.text || "")}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {tab === "meetings" && (
            <div className="space-y-3">
              <input className="h-10 w-full rounded-xl border px-3" value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} placeholder={t("crm.workspace.meetingTitle")} />
              <input className="h-10 w-full rounded-xl border px-3" type="datetime-local" value={meetingAt} onChange={(event) => setMeetingAt(event.target.value)} />
              <button
                type="button"
                className="quick-btn"
                onClick={() =>
                  void createMeeting(lead._id, meetingTitle, meetingAt).then(() => flash(t("crm.workspace.saved")))
                }
              >
                {t("crm.workspace.addMeeting")}
              </button>
            </div>
          )}

          {tab === "documents" && (
            <div className="space-y-3">
              <input className="h-10 w-full rounded-xl border px-3" value={docName} onChange={(event) => setDocName(event.target.value)} placeholder={t("crm.workspace.documentName")} />
              <input className="h-10 w-full rounded-xl border px-3" value={docUrl} onChange={(event) => setDocUrl(event.target.value)} placeholder="https://" />
              <button
                type="button"
                className="quick-btn"
                onClick={() => void addDocument(lead._id, docName, docUrl).then(() => flash(t("crm.workspace.saved")))}
              >
                {t("crm.workspace.addDocument")}
              </button>
              <ul className="space-y-2">
                {(lead.documents || []).map((doc) => (
                  <li key={doc.url}>
                    <a className="text-sm font-bold text-[#6D28D9]" href={doc.url} target="_blank" rel="noreferrer">
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "deals" && (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input className="h-10 rounded-xl border px-3" value={dealName} onChange={(event) => setDealName(event.target.value)} placeholder={t("crm.workspace.dealName")} />
                <input className="h-10 rounded-xl border px-3" value={dealAmount} onChange={(event) => setDealAmount(event.target.value)} placeholder={t("crm.workspace.dealAmount")} />
              </div>
              <button
                type="button"
                className="quick-btn"
                onClick={() =>
                  void createDeal({
                    name: dealName,
                    amount: Number(dealAmount) || 0,
                    leadId: lead._id,
                    contactName: name,
                  }).then(() => flash(t("crm.workspace.saved")))
                }
              >
                {t("crm.workspace.addDeal")}
              </button>
              <ul className="space-y-2">
                {deals.map((deal) => (
                  <li key={deal._id} className="rounded-xl border p-3 text-sm font-bold">
                    {deal.name} · {deal.amount} {deal.currency} · {deal.status}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "payments" && (
            <ul className="space-y-2">
              {payments.length ? (
                payments.map((deal) => (
                  <li key={deal._id} className="rounded-xl border p-3 text-sm font-bold">
                    {deal.name} · {deal.amount} {deal.currency}
                  </li>
                ))
              ) : (
                <p className="text-sm font-bold text-slate-500">{t("crm.leads.drawer.paymentsEmpty")}</p>
              )}
            </ul>
          )}

          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-black text-slate-500">{t("crm.leads.table.agent")}</p>
            <select
              className="mt-2 h-10 w-full rounded-xl border px-3 text-sm"
              value={lead.assignedToUserId || ""}
              onChange={(event) => {
                const agent = agents.find((item) => item._id === event.target.value);
                void assignLead(lead._id, event.target.value, agent?.name || "").then(() =>
                  flash(t("crm.workspace.assigned"))
                );
              }}
            >
              <option value="">{t("crm.leads.unassignedAgent")}</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <style>{`.quick-btn{display:inline-flex;align-items:center;gap:6px;height:36px;border-radius:12px;border:1px solid #e2e8f0;background:#fff;padding:0 10px;font-size:12px;font-weight:800;color:#334155}`}</style>
    </div>
  );
}

function Fact({ label, value, ltr = false }: { label: string; value?: unknown; ltr?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[11px] font-black text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-800" dir={ltr ? "ltr" : undefined}>{value ? String(value) : "—"}</p>
    </div>
  );
}
