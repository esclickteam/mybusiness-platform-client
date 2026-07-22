import React, { useEffect, useMemo, useState } from "react";
import API from "@api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  FileText,
  Hash,
  Link as LinkIcon,
  ListChecks,
  Mail,
  MessageSquareText,
  Phone,
  Plus,
  Save,
  Sparkles,
  Tag,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

const CUSTOM_FIELDS_STORAGE_KEY = "bizuply_custom_client_fields";

const defaultCustomFields = [
  {
    id: "weight",
    key: "weight",
    label: "Weight",
    type: "number",
    description: "Client weight / numeric value",
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    options: [],
    active: true,
    order: 1,
  },
  {
    id: "summary",
    key: "summary",
    label: "Client Summary",
    type: "textarea",
    description: "Internal or client-facing summary",
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    options: [],
    active: true,
    order: 2,
  },
  {
    id: "clientStatus",
    key: "clientStatus",
    label: "Client Status",
    type: "status",
    description: "Current client status",
    required: false,
    showInClientProfile: true,
    showInClientPortal: false,
    clientCanEdit: false,
    options: ["New", "In progress", "Waiting", "Completed", "Cancelled"],
    active: true,
    order: 3,
  },
];

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w\u0590-\u05FF-]/g, "")
    .toLowerCase();
}

function normalizeCustomField(field, index) {
  const label = String(field?.label || field?.name || "").trim();
  const key = normalizeKey(field?.key || label || `field_${index + 1}`);

  return {
    id: String(field?.id || key || `field_${index + 1}`),
    key,
    label: label || key || `Field ${index + 1}`,
    type: String(field?.type || "text"),
    description: String(field?.description || ""),
    required: Boolean(field?.required),
    showInClientProfile: field?.showInClientProfile !== false,
    showInClientPortal: Boolean(field?.showInClientPortal),
    clientCanEdit: Boolean(field?.clientCanEdit),
    options: Array.isArray(field?.options) ? field.options : [],
    active: field?.active !== false,
    order: Number(field?.order) || index + 1,
  };
}

function getStoredCustomFields() {
  if (typeof window === "undefined") {
    return defaultCustomFields;
  }

  const raw = window.localStorage.getItem(CUSTOM_FIELDS_STORAGE_KEY);
  const parsed = raw ? safeJsonParse(raw, []) : [];

  const normalized = Array.isArray(parsed)
    ? parsed.map(normalizeCustomField)
    : [];

  if (!normalized.length) {
    window.localStorage.setItem(
      CUSTOM_FIELDS_STORAGE_KEY,
      JSON.stringify(defaultCustomFields)
    );

    return defaultCustomFields;
  }

  return normalized;
}

function getClientCustomValues(clientId) {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(
    `bizuply_client_custom_fields_${clientId}`
  );

  return raw ? safeJsonParse(raw, {}) : {};
}

function saveClientCustomValues(clientId, values) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    `bizuply_client_custom_fields_${clientId}`,
    JSON.stringify(values)
  );
}

function createDefaultValue(field) {
  if (field.type === "boolean") return false;
  if (field.type === "checkbox") return false;
  if (field.type === "checklist") return [];
  if (field.type === "number") return "";
  return "";
}

function getFieldIcon(type) {
  if (type === "number") return Hash;
  if (type === "date") return CalendarDays;
  if (type === "status") return Tag;
  if (type === "select") return ListChecks;
  if (type === "textarea") return MessageSquareText;
  if (type === "link") return LinkIcon;
  if (type === "file") return FileText;
  return Sparkles;
}

export default function CRMCustomerFile({ client, businessId }) {
  const [events, setEvents] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const [newEvent, setNewEvent] = useState({
    type: "call",
    title: "",
    date: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    notes: "",
  });

  const [customFields, setCustomFields] = useState([]);
  const [customValues, setCustomValues] = useState({});
  const [savingCustomFields, setSavingCustomFields] = useState(false);

  useEffect(() => {
    const fields = getStoredCustomFields()
      .filter((field) => field.active && field.showInClientProfile)
      .sort((a, b) => a.order - b.order);

    setCustomFields(fields);
  }, []);

  useEffect(() => {
    if (!client?._id) return;

    const savedValues = getClientCustomValues(client._id);
    const clientValues = client?.customFields || {};

    setCustomValues({
      ...savedValues,
      ...clientValues,
    });
  }, [client?._id, client?.customFields]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRes = await API.get(
          `/appointments/by-client/${client._id}`,
          { params: { businessId } }
        );

        const appointments = apptRes.data.map((appt) => ({
          id: appt._id,
          type: "meeting",
          title: appt.serviceName || "Meeting",
          date: `${appt.date} ${appt.time}`,
          notes: appt.note || "",
          readonly: true,
        }));

        const eventsRes = await API.get(`/crm-events/${client._id}`);
        const crmEvents = eventsRes.data.map((ev) => ({
          id: ev._id,
          type: ev.type,
          title: ev.title,
          date: ev.date,
          notes: ev.notes,
          readonly: false,
        }));

        setEvents(
          [...appointments, ...crmEvents].sort((a, b) =>
            (b.date || "").localeCompare(a.date || "")
          )
        );
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load customer data");
      }
    };

    if (client?._id) fetchData();
  }, [client?._id, businessId]);

  const filledCustomFieldsCount = useMemo(() => {
    return customFields.filter((field) => {
      const value = customValues[field.key];

      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value;
      return String(value || "").trim().length > 0;
    }).length;
  }, [customFields, customValues]);

  const addEvent = async () => {
    if (!newEvent.title) {
      toast.error("Title is required");
      return;
    }

    try {
      const res = await API.post("/crm-events", {
        ...newEvent,
        clientId: client._id,
        businessId,
      });

      setEvents([
        {
          id: res.data._id,
          type: res.data.type,
          title: res.data.title,
          date: res.data.date,
          notes: res.data.notes,
          readonly: false,
        },
        ...events,
      ]);

      setNewEvent({ type: "call", title: "", date: "", notes: "" });
      setShowAdd(false);
      toast.success("✅ Event added");
    } catch {
      toast.error("❌ Failed to add event");
    }
  };

  const startEdit = (e) => {
    setEditingId(e.id);
    setEditDraft({ title: e.title, notes: e.notes });
  };

  const saveEdit = async (id) => {
    try {
      const res = await API.put(`/crm-events/${id}`, editDraft);
      setEvents(events.map((e) => (e.id === id ? { ...e, ...res.data } : e)));
      setEditingId(null);
      toast.success("✏️ Event updated");
    } catch {
      toast.error("❌ Failed to update");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ title: "", notes: "" });
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await API.delete(`/crm-events/${id}`);
      setEvents(events.filter((e) => e.id !== id));
      toast.success("🗑️ Event deleted");
    } catch {
      toast.error("❌ Failed to delete");
    }
  };

  const updateCustomValue = (key, value) => {
    setCustomValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveCustomFields = async () => {
    if (!client?._id) return;

    try {
      setSavingCustomFields(true);

      saveClientCustomValues(client._id, customValues);

      try {
        await API.patch(`/crm-clients/${client._id}/custom-fields`, {
          businessId,
          customFields: customValues,
        });
      } catch (apiError) {
        console.warn(
          "Custom fields backend endpoint is not ready yet. Saved locally.",
          apiError
        );
      }

      toast.success("✅ Client fields saved");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to save client fields");
    } finally {
      setSavingCustomFields(false);
    }
  };

  const typeLabels = {
    call: "📞 Call",
    message: "💬 Message",
    meeting: "📅 Meeting",
    task: "✅ Task",
    file: "📄 File",
  };

  return (
    <div className="min-h-screen bg-[#F6FAFD] p-4 text-slate-800 md:p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="relative overflow-hidden rounded-[2.3rem] border border-sky-100 bg-gradient-to-br from-white via-sky-50/80 to-violet-50/70 p-6 shadow-[0_26px_80px_rgba(14,165,233,0.10)]">
          <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-sky-200/55 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-120px] left-10 h-72 w-72 rounded-full bg-violet-200/45 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 top-10 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-100">
                <UserRound className="h-7 w-7" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-700 shadow-sm">
                  Client File
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
                  {client?.fullName || "Client profile"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-slate-500">
                  Manage client details, custom data fields, appointments and
                  CRM activity timeline from one clean customer file.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAdd((s) => !s)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              <Plus className="h-5 w-5" />
              Add Event
            </button>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <MiniMetric
            icon={Phone}
            label="Phone"
            value={client?.phone || "-"}
            helper="client contact"
          />

          <MiniMetric
            icon={Mail}
            label="Email"
            value={client?.email || "-"}
            helper="client email"
          />

          <MiniMetric
            icon={Sparkles}
            label="Custom fields"
            value={`${filledCustomFieldsCount}/${customFields.length}`}
            helper="filled values"
          />

          <MiniMetric
            icon={Clock3}
            label="Activity"
            value={events.length}
            helper="timeline records"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <main className="space-y-5">
            <CustomClientFieldsPanel
              fields={customFields}
              values={customValues}
              saving={savingCustomFields}
              onChange={updateCustomValue}
              onSave={saveCustomFields}
            />

            {showAdd && (
              <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">
                      Add CRM event
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Add a call, message, task, file note or activity record.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-4 p-5 lg:grid-cols-2">
                  <FormSmall label="Event type">
                    <select
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, type: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="call">Call</option>
                      <option value="message">Message</option>
                      <option value="meeting">Meeting</option>
                      <option value="task">Task</option>
                      <option value="file">File</option>
                    </select>
                  </FormSmall>

                  <FormSmall label="Title *">
                    <input
                      placeholder="Title *"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormSmall>

                  <FormSmall label="Date">
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, date: e.target.value })
                      }
                      className={inputClass}
                    />
                  </FormSmall>

                  <div className="lg:col-span-2">
                    <FormSmall label="Notes">
                      <textarea
                        placeholder="Notes"
                        value={newEvent.notes}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, notes: e.target.value })
                        }
                        rows={4}
                        className={textareaClass}
                      />
                    </FormSmall>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 p-5">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={addEvent}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950"
                  >
                    <Save className="h-5 w-5" />
                    Save
                  </button>
                </div>
              </section>
            )}

            <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="border-b border-slate-100 p-5">
                <h3 className="text-2xl font-black text-slate-800">
                  Activity Timeline
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Appointments and CRM events connected to this client.
                </p>
              </div>

              <div className="grid gap-4 p-5">
                {events.length === 0 ? (
                  <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-12 text-center">
                    <Sparkles className="mx-auto h-8 w-8 text-sky-700" />
                    <h4 className="mt-4 text-xl font-black text-slate-800">
                      No activity yet
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Add the first event or appointment activity.
                    </p>
                  </div>
                ) : (
                  events.map((e) => (
                    <article
                      key={e.id}
                      className="rounded-[1.7rem] border border-slate-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
                            {typeLabels[e.type] || e.type}
                          </div>

                          <p className="mt-2 text-xs font-bold text-slate-400">
                            {e.date || "No date"}
                          </p>
                        </div>

                        {!e.readonly && editingId !== e.id && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(e)}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-200"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteEvent(e.id)}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 text-xs font-black text-rose-700 transition hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === e.id ? (
                        <div className="mt-4 grid gap-3">
                          <input
                            value={editDraft.title}
                            onChange={(ev) =>
                              setEditDraft({
                                ...editDraft,
                                title: ev.target.value,
                              })
                            }
                            className={inputClass}
                          />

                          <textarea
                            value={editDraft.notes}
                            onChange={(ev) =>
                              setEditDraft({
                                ...editDraft,
                                notes: ev.target.value,
                              })
                            }
                            rows={4}
                            className={textareaClass}
                          />

                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={cancelEdit}
                              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() => saveEdit(e.id)}
                              className="rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 transition hover:bg-sky-950"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <h4 className="text-lg font-black text-slate-800">
                            {e.title}
                          </h4>

                          {e.notes && (
                            <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-500">
                              {e.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          </main>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] xl:sticky xl:top-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Client overview
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Basic customer details
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <OverviewRow label="Name" value={client?.fullName || "-"} />
                <OverviewRow label="Phone" value={client?.phone || "-"} />
                <OverviewRow label="Email" value={client?.email || "-"} />
                <OverviewRow
                  label="Custom fields"
                  value={`${filledCustomFieldsCount}/${customFields.length}`}
                />
                <OverviewRow label="Activities" value={events.length} />
              </div>
            </section>
          </aside>
        </section>
      </div>

      <ToastContainer position="top-center" autoClose={3500} />
    </div>
  );
}

function CustomClientFieldsPanel({
  fields,
  values,
  saving,
  onChange,
  onSave,
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">
            <Sparkles className="h-4 w-4" />
            Custom Client Fields
          </div>

          <h3 className="mt-3 text-2xl font-black text-slate-800">
            Client data fields
          </h3>

          <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
            Fields created in Mini SaaS appear here automatically for every
            client.
          </p>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-5 w-5" />
          {saving ? "Saving..." : "Save Client Data"}
        </button>
      </div>

      <div className="p-5">
        {fields.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-sky-700" />
            <h4 className="mt-4 text-xl font-black text-slate-800">
              No custom fields yet
            </h4>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Create fields from Mini SaaS, then they will appear here
              automatically.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {fields.map((field) => (
              <CustomFieldEditor
                key={field.id}
                field={field}
                value={
                  values[field.key] !== undefined
                    ? values[field.key]
                    : createDefaultValue(field)
                }
                onChange={(value) => onChange(field.key, value)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CustomFieldEditor({ field, value, onChange }) {
  const Icon = getFieldIcon(field.type);

  if (field.type === "textarea" || field.type === "summary") {
    return (
      <FieldBox field={field} icon={Icon}>
        <textarea
          value={String(value || "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.description || field.label}
          rows={5}
          className={textareaClass}
        />
      </FieldBox>
    );
  }

  if (field.type === "status" || field.type === "select") {
    return (
      <FieldBox field={field} icon={Icon}>
        <select
          value={String(value || field.options?.[0] || "")}
          onChange={(event) => onChange(event.target.value)}
          className={inputClass}
        >
          <option value="">Select</option>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FieldBox>
    );
  }

  if (field.type === "boolean" || field.type === "checkbox") {
    return (
      <button
        type="button"
        onClick={() => onChange(!Boolean(value))}
        className={[
          "rounded-[1.5rem] border p-4 text-left transition",
          value
            ? "border-sky-200 bg-sky-50"
            : "border-slate-100 bg-slate-50/60 hover:bg-white",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-900 shadow-sm">
              <Icon className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-900">
                {field.label}
              </p>

              {field.description && (
                <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                  {field.description}
                </p>
              )}
            </div>
          </div>

          <span
            className={[
              "grid h-6 w-6 place-items-center rounded-full border text-xs font-black",
              value
                ? "border-sky-700 bg-sky-700 text-white"
                : "border-slate-300 bg-white text-transparent",
            ].join(" ")}
          >
            ✓
          </span>
        </div>
      </button>
    );
  }

  return (
    <FieldBox field={field} icon={Icon}>
      <input
        value={String(value || "")}
        onChange={(event) => onChange(event.target.value)}
        type={
          field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : field.type === "email"
                ? "email"
                : field.type === "phone"
                  ? "tel"
                  : field.type === "link"
                    ? "url"
                    : "text"
        }
        placeholder={field.description || field.label}
        className={inputClass}
      />
    </FieldBox>
  );
}

function FieldBox({ field, icon: Icon, children }) {
  return (
    <label className="block rounded-[1.5rem] border border-slate-100 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-900 shadow-sm">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <span className="block text-sm font-black text-slate-900">
            {field.label}
            {field.required && <span className="ml-1 text-rose-500">*</span>}
          </span>

          {field.description && (
            <span className="mt-0.5 block text-xs font-semibold leading-5 text-slate-500">
              {field.description}
            </span>
          )}
        </div>
      </div>

      {children}
    </label>
  );
}

function MiniMetric({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400">{label}</p>
          <p className="mt-2 truncate text-2xl font-black tracking-tight text-slate-800">
            {value}
          </p>
          <p className="mt-2 text-xs font-black text-emerald-600">▲ Active</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">{helper}</p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-900">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function FormSmall({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-800">
        {label}
      </span>
      {children}
    </label>
  );
}

function OverviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>

      <span className="max-w-[190px] truncate text-sm font-black text-slate-800">
        {value || "Missing"}
      </span>
    </div>
  );
}