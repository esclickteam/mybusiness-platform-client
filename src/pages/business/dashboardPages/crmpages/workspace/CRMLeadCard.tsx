import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  X,
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
import { leadSourceLabel } from "./leadSourceLabel";

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
  const [reloadToken, setReloadToken] = useState(0);
  const seenLeadId = useRef("");
  const recordReady = Boolean(lead && String(lead._id) === String(leadId));

  useEffect(() => {
    let cancelled = false;
    const requestedId = leadId;
    const switched = seenLeadId.current !== requestedId;
    seenLeadId.current = requestedId;
    if (switched) {
      setLead(null);
      setError("");
      setNotice("");
      setNote("");
      setTaskText("");
      setTaskDue("");
      setCallNote("");
      setMeetingTitle("");
      setMeetingAt("");
      setDocName("");
      setDocUrl("");
      setDealName("");
      setDealAmount("");
      setCustomValues({});
      setTimeline([]);
      setDeals([]);
    }

    (async () => {
      try {
        const [{ data }, settings, events, dealRows] = await Promise.all([
          API.get(`/crm/leads/${requestedId}`),
          fetchWorkspaceSettings(),
          fetchTimeline(requestedId),
          fetchDeals({ leadId: requestedId }),
        ]);
        if (cancelled) return;
        const next = data?.lead;
        if (!next || String(next._id) !== String(requestedId)) {
          setLead(null);
          setError(t("crm.leads.errors.recordMismatch"));
          return;
        }
        setLead(next);
        setStatus(next.status || "new");
        setCustomValues(next.customValues || {});
        setFields(settings.leadCustomFields || []);
        setTimeline(events);
        setDeals(dealRows);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, t("crm.leads.errors.loadFailed")));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [leadId, reloadToken, t]);

  const flash = (message: string) => {
    setNotice(message);
    onChanged();
    setReloadToken((value) => value + 1);
  };

  const saveCustom = async () => {
    if (!recordReady || !lead) return;
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
    if (!recordReady || !lead) return;
    setStatus(next);
    try {
      await API.patch(`/crm/leads/${lead._id}/status`, { status: next });
      flash(t("crm.workspace.statusUpdated"));
    } catch (err) {
      setError(getApiErrorMessage(err, t("crm.leads.errors.updateStatusFailed")));
    }
  };

  const addActivity = async (type: string, text: string, extra: Record<string, unknown> = {}) => {
    if (!recordReady || !lead || !text.trim()) return;
    await API.post(`/crm/leads/${lead._id}/activities`, { type, text, ...extra });
    flash(t("crm.workspace.saved"));
  };

  const payments = useMemo(
    () => deals.filter((deal) => deal.status === "won"),
    [deals]
  );

  if (!recordReady || !lead) {
    return (
      <div className="crm-dossier fixed inset-0 z-50 p-3">
        <div className="crm-dossier-panel mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-3">
          <p className="text-sm font-bold text-slate-500">{error || t("crm.common.loading")}</p>
          <button type="button" className="crm-close" onClick={onClose}>
            {t("crm.common.close")}
          </button>
        </div>
      </div>
    );
  }

  const name = lead.fullName || lead.name || t("crm.common.unnamedClient");
  const personalDirty =
    JSON.stringify(customValues) !== JSON.stringify(lead.customValues || {});
  const statusLabel = t(`crm.leads.statuses.${lead.status || "new"}`, {
    defaultValue: lead.status || "new",
  });

  return (
    <div className="crm-dossier fixed inset-0 z-50" dir={getTextDirection(i18n.language)}>
      <div className="crm-dossier-panel">
        <header className="crm-dossier-head">
          <div className="crm-record-title">
            <div className="min-w-0">
              <p className="crm-dossier-kicker">
                {t("crm.leads.drawer.dossierBadge")}
              </p>
              <h2>{name}</h2>
            </div>
            <button type="button" onClick={onClose} className="crm-close">
              <X className="h-4 w-4" />
              {t("crm.common.close")}
            </button>
          </div>
          <div className="crm-record-facts">
            <span className="crm-chip" dir="ltr">{lead.phone || t("crm.common.noPhone")}</span>
            <span className="crm-chip">{lead.email || t("crm.common.noEmail")}</span>
            <span className="crm-chip">{leadSourceLabel(lead) || "—"}</span>
            <span className={`crm-status-pill is-${lead.status || "new"}`}>{statusLabel}</span>
          </div>
          <div className="crm-file-actions">
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
              className="crm-status-select"
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

        <div className="crm-file-body">
        <nav className="crm-file-tabs" aria-label={t("crm.leads.drawer.dossierBadge")}>
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`shrink-0 px-3 py-2 text-xs font-black ${
                tab === key ? "text-[#5B21B6]" : "text-slate-500"
              }`}
              aria-current={tab === key ? "page" : undefined}
            >
              {t(`crm.workspace.tabs.${key}`)}
            </button>
          ))}
        </nav>

        <div className="crm-file-main">
          <div className="crm-file-scroll">
          {error && <p className="crm-banner is-error">{error}</p>}
          {notice && <p className="crm-banner is-ok">{notice}</p>}

          {tab === "overview" && (
            <div className="crm-pane">
              <div className="crm-facts">
                <Fact label={t("crm.common.name")} value={name} />
                <Fact label={t("crm.common.phone")} value={lead.phone} ltr />
                <Fact label={t("crm.common.email")} value={lead.email} />
                <Fact label={t("crm.common.status")} value={statusLabel} />
                <Fact label={t("crm.leads.table.agent")} value={lead.assignedToName || t("crm.leads.unassignedAgent")} />
                <Fact label={t("crm.leads.table.source")} value={leadSourceLabel(lead)} />
              </div>
              <label className="crm-field">
                <span>{t("crm.leads.table.agent")}</span>
                <select
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
              </label>
            </div>
          )}

          {tab === "personal" && (
            <div className="crm-pane">
              {fields.filter((field) => field.active !== false).length === 0 && (
                <p className="crm-empty">{t("crm.workspace.noCustomFields")}</p>
              )}
              {fields.filter((field) => field.active !== false).map((field) => (
                <label key={field.id} className="crm-field">
                  <span>{field.label}</span>
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
                      type={field.type === "number" || field.type === "money" ? "number" : field.type === "url" ? "url" : "text"}
                      value={String(customValues[field.key] ?? "")}
                      onChange={(event) =>
                        setCustomValues((prev) => ({ ...prev, [field.key]: event.target.value }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          )}

          {tab === "source" && (
            <div className="crm-pane">
            <div className="crm-facts">
              <Fact label={t("crm.workspace.adPlatform")} value={leadSourceLabel({ source: lead.provider || lead.source })} />
              <Fact label={t("crm.leads.drawer.campaign")} value={lead.facebook?.campaignName || lead.google?.campaignName || lead.campaignName} />
              <Fact label={t("crm.leads.drawer.campaignId")} value={lead.facebook?.campaignId || lead.google?.campaignId} />
              <Fact label={t("crm.workspace.adset")} value={lead.facebook?.adsetName} />
              <Fact label={t("crm.workspace.ad")} value={lead.facebook?.adName} />
              <Fact label={t("crm.workspace.adId")} value={lead.facebook?.adId} />
              <Fact label={t("crm.leads.drawer.form")} value={lead.facebook?.formName || lead.google?.formName || lead.formName} />
              <Fact label={t("crm.leads.drawer.formId")} value={lead.facebook?.formId || lead.formId} />
              <Fact label={t("crm.workspace.receivedAt")} value={lead.facebook?.createdTime || lead.google?.createdTime || lead.createdAt} />
            </div>
              {(lead.facebook?.campaignId || lead.google?.campaignId) && (
                <a
                  className="crm-secondary"
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
            <div className="crm-facts">
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
            <div className="crm-pane">
              <section className="crm-composer">
                <label className="crm-field">
                  <span>{t("crm.common.note")}</span>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={t("crm.leads.drawer.notePlaceholder")}
                  />
                </label>
                <div className="crm-inline">
                  <select value={callOutcome} onChange={(event) => setCallOutcome(event.target.value)}>
                    <option value="answered">{t("crm.workspace.callOutcomes.answered")}</option>
                    <option value="no_answer">{t("crm.workspace.callOutcomes.no_answer")}</option>
                    <option value="interested">{t("crm.workspace.callOutcomes.interested")}</option>
                    <option value="not_interested">{t("crm.workspace.callOutcomes.not_interested")}</option>
                  </select>
                  <input value={callNote} onChange={(event) => setCallNote(event.target.value)} placeholder={t("crm.workspace.callNote")} />
                  <button
                    type="button"
                    className="crm-secondary"
                    onClick={() => void logCall(lead._id, callOutcome, callNote).then(() => { setCallNote(""); flash(t("crm.workspace.callLogged")); })}
                  >
                    {t("crm.workspace.logCall")}
                  </button>
                </div>
              </section>
              <ol className="crm-timeline">
                {timeline.map((event, index) => (
                  <TimelineItem key={event.id || index} event={event} locale={locale} />
                ))}
              </ol>
            </div>
          )}

          {tab === "tasks" && (
            <div className="crm-pane">
              <section className="crm-composer">
                <label className="crm-field">
                  <span>{t("crm.common.task")}</span>
                  <input value={taskText} onChange={(event) => setTaskText(event.target.value)} placeholder={t("crm.leads.drawer.taskPlaceholder")} />
                </label>
                <label className="crm-field">
                  <span>{t("crm.leads.drawer.dueTime")}</span>
                  <input type="datetime-local" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} />
                </label>
              </section>
              <ul className="crm-timeline">
                {(lead.activities || [])
                  .filter((activity) => activity.type === "task")
                  .map((activity) => (
                    <li key={String(activity._id || activity.id)}>
                      <p className="crm-timeline-meta">
                        <span>{t("crm.common.task")}</span>
                        <time>{activity.createdAt ? new Date(String(activity.createdAt)).toLocaleString(locale) : ""}</time>
                      </p>
                      <p>{String(activity.text || "")}</p>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {tab === "meetings" && (
            <section className="crm-composer">
              <label className="crm-field">
                <span>{t("crm.workspace.meetingTitle")}</span>
                <input value={meetingTitle} onChange={(event) => setMeetingTitle(event.target.value)} placeholder={t("crm.workspace.meetingTitle")} />
              </label>
              <label className="crm-field">
                <span>{t("crm.leads.drawer.dueTime")}</span>
                <input type="datetime-local" value={meetingAt} onChange={(event) => setMeetingAt(event.target.value)} />
              </label>
            </section>
          )}

          {tab === "documents" && (
            <div className="crm-pane">
              <section className="crm-composer">
                <label className="crm-field">
                  <span>{t("crm.workspace.documentName")}</span>
                  <input value={docName} onChange={(event) => setDocName(event.target.value)} placeholder={t("crm.workspace.documentName")} />
                </label>
                <label className="crm-field">
                  <span>URL</span>
                  <input value={docUrl} onChange={(event) => setDocUrl(event.target.value)} placeholder="https://" dir="ltr" />
                </label>
              </section>
              <ul className="crm-timeline">
                {(lead.documents || []).map((doc) => (
                  <li key={doc.url}>
                    <a href={doc.url} target="_blank" rel="noreferrer">{doc.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "deals" && (
            <div className="crm-pane">
              <section className="crm-composer">
                <div className="crm-inline">
                  <input value={dealName} onChange={(event) => setDealName(event.target.value)} placeholder={t("crm.workspace.dealName")} />
                  <input value={dealAmount} onChange={(event) => setDealAmount(event.target.value)} placeholder={t("crm.workspace.dealAmount")} />
                </div>
              </section>
              <ul className="crm-timeline">
                {deals.map((deal) => (
                  <li key={deal._id}>
                    {deal.name} · {deal.amount} {deal.currency} · {deal.status}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "payments" && (
            <ul className="crm-timeline">
              {payments.length ? (
                payments.map((deal) => (
                  <li key={deal._id}>
                    {deal.name} · {deal.amount} {deal.currency}
                  </li>
                ))
              ) : (
                <p className="crm-empty">{t("crm.leads.drawer.paymentsEmpty")}</p>
              )}
            </ul>
          )}
          </div>
          {tab === "personal" && (
            <FormBar
              dirty={personalDirty}
              saving={saving}
              unsavedLabel={t("crm.workspace.unsaved")}
              cancelLabel={t("crm.common.cancel")}
              saveLabel={saving ? t("crm.common.saving") : t("crm.common.save")}
              onCancel={() => setCustomValues(lead.customValues || {})}
              onSave={() => void saveCustom()}
            />
          )}
          {tab === "activity" && (
            <FormBar
              dirty={Boolean(note.trim())}
              unsavedLabel={t("crm.workspace.unsaved")}
              cancelLabel={t("crm.common.cancel")}
              saveLabel={t("crm.workspace.saveNote")}
              onCancel={() => setNote("")}
              onSave={() => void addActivity("note", note).then(() => setNote(""))}
            />
          )}
          {tab === "tasks" && (
            <FormBar
              dirty={Boolean(taskText.trim())}
              unsavedLabel={t("crm.workspace.unsaved")}
              cancelLabel={t("crm.common.cancel")}
              saveLabel={t("crm.workspace.addTask")}
              onCancel={() => { setTaskText(""); setTaskDue(""); }}
              onSave={() =>
                void addActivity("task", taskText, { taskDueAt: taskDue }).then(() => {
                  setTaskText("");
                  setTaskDue("");
                })
              }
            />
          )}
          {tab === "meetings" && (
            <FormBar
              dirty={Boolean(meetingTitle.trim())}
              unsavedLabel={t("crm.workspace.unsaved")}
              cancelLabel={t("crm.common.cancel")}
              saveLabel={t("crm.workspace.addMeeting")}
              onCancel={() => { setMeetingTitle(""); setMeetingAt(""); }}
              onSave={() => void createMeeting(lead._id, meetingTitle, meetingAt).then(() => { setMeetingTitle(""); setMeetingAt(""); flash(t("crm.workspace.saved")); })}
            />
          )}
          {tab === "documents" && (
            <FormBar
              dirty={Boolean(docName.trim() || docUrl.trim())}
              unsavedLabel={t("crm.workspace.unsaved")}
              cancelLabel={t("crm.common.cancel")}
              saveLabel={t("crm.workspace.addDocument")}
              onCancel={() => { setDocName(""); setDocUrl(""); }}
              onSave={() => void addDocument(lead._id, docName, docUrl).then(() => { setDocName(""); setDocUrl(""); flash(t("crm.workspace.saved")); })}
            />
          )}
          {tab === "deals" && (
            <FormBar
              dirty={Boolean(dealName.trim())}
              unsavedLabel={t("crm.workspace.unsaved")}
              cancelLabel={t("crm.common.cancel")}
              saveLabel={t("crm.workspace.addDeal")}
              onCancel={() => { setDealName(""); setDealAmount(""); }}
              onSave={() =>
                void createDeal({
                  name: dealName,
                  amount: Number(dealAmount) || 0,
                  leadId: lead._id,
                  contactName: name,
                }).then(() => { setDealName(""); setDealAmount(""); flash(t("crm.workspace.saved")); })
              }
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value, ltr = false }: { label: string; value?: unknown; ltr?: boolean }) {
  return (
    <div className="crm-fact">
      <p className="crm-fact__label">{label}</p>
      <p className="crm-fact__value" dir={ltr ? "ltr" : undefined}>{value ? String(value) : "—"}</p>
    </div>
  );
}

function FormBar({
  dirty,
  saving = false,
  unsavedLabel,
  cancelLabel,
  saveLabel,
  onCancel,
  onSave,
}: {
  dirty: boolean;
  saving?: boolean;
  unsavedLabel: string;
  cancelLabel: string;
  saveLabel: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="crm-form-bar">
      <p className="crm-unsaved">{dirty ? unsavedLabel : ""}</p>
      <div className="crm-form-bar-actions">
        <button type="button" className="crm-cancel" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className="crm-save" onClick={onSave} disabled={saving}>
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

function TimelineItem({ event, locale }: { event: TimelineEvent; locale: string }) {
  const { t } = useTranslation();
  const when = event.at ? new Date(event.at) : null;
  const valid = when && !Number.isNaN(when.getTime());
  const typeLabels: Record<string, string> = {
    note: t("crm.common.note"),
    task: t("crm.common.task"),
    call: t("crm.workspace.logCall"),
    meeting: t("crm.workspace.meeting"),
  };
  const typeLabel = typeLabels[event.type] || event.type || t("crm.workspace.tabs.activity");

  return (
    <li>
      <p className="crm-timeline-meta">
        <span>{typeLabel}</span>
        <time>{valid ? when.toLocaleString(locale) : ""}</time>
        <span>{event.actor || t("crm.common.systemUser")}</span>
        {event.callOutcome ? <span>{t(`crm.workspace.callOutcomes.${event.callOutcome}`)}</span> : null}
      </p>
      <p>{event.text}</p>
    </li>
  );
}
