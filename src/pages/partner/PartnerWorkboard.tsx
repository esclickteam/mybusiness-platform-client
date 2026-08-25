import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Bell, CalendarCheck } from "lucide-react";
import {
  createPartnerWorkItem,
  fetchPartnerClients,
  partnerApiError,
} from "../../lib/partnerApi";
import type { PartnerClient } from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { PartnerCard, PartnerEmpty, PartnerPrimaryButton } from "../../components/partner/partnerUi";
import {
  formatPartnerDateTime,
  openPartnerTasks,
  upcomingReminders,
  type PartnerWorkItem,
} from "../../lib/partnerWork";

export default function PartnerWorkboard() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const isReminders = location.pathname.includes("/reminders");
  const creating = params.get("new") === "1";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<PartnerClient[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [clientId, setClientId] = useState("");
  const [saving, setSaving] = useState(false);

  async function refresh() {
    const data = await fetchPartnerClients({ page: 1, limit: 50 });
    setClients(data.items || []);
  }

  useEffect(() => {
    let cancelled = false;
    refresh()
      .catch((err) => {
        if (!cancelled) setError(partnerApiError(err, "שגיאה בטעינת משימות"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items: PartnerWorkItem[] = useMemo(() => {
    if (isReminders) return upcomingReminders(clients, 50);
    return openPartnerTasks(clients);
  }, [clients, isReminders]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId || !title.trim()) {
      setError("יש לבחור לקוח ולמלא כותרת");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const due = dueAt ? `${dueAt}${dueTime ? `T${dueTime}` : "T09:00"}` : undefined;
      await createPartnerWorkItem({
        clientId,
        title: title.trim(),
        description,
        dueAt: due,
        kind: isReminders ? "reminder" : "task",
      });
      setTitle("");
      setDescription("");
      setDueAt("");
      setDueTime("");
      setParams({});
      await refresh();
    } catch (err: unknown) {
      setError(partnerApiError(err, "לא ניתן ליצור פריט"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            {isReminders ? "תזכורות" : "משימות"}
          </h2>
          <p className="text-sm font-bold text-slate-500">
            {isReminders
              ? "מעקבים עם תאריך יעד מתיקי הלקוחות."
              : "כל המשימות הפתוחות בכל תיקי הלקוחות."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setParams({ new: "1" })}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-black text-white"
        >
          {isReminders ? "תזכורת חדשה" : "משימה חדשה"}
        </button>
      </div>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      {creating ? (
        <form onSubmit={submit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-black">
            לקוח / עסקה
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2 font-bold"
            >
              <option value="">בחרו לקוח</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.contact?.businessName}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-black">
            {isReminders ? "טקסט התזכורת" : "כותרת"}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-2xl border px-3 py-2 font-bold"
            />
          </label>
          {!isReminders ? (
            <label className="block text-sm font-black">
              תיאור (אופציונלי)
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-2xl border px-3 py-2 font-bold"
              />
            </label>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-black">
              תאריך
              <input
                type="date"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                className="mt-1 w-full rounded-2xl border px-3 py-2 font-bold"
              />
            </label>
            <label className="block text-sm font-black">
              שעה (אופציונלי)
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="mt-1 w-full rounded-2xl border px-3 py-2 font-bold"
              />
            </label>
          </div>
          <PartnerPrimaryButton disabled={saving}>
            {saving ? "שומר..." : "שמירה"}
          </PartnerPrimaryButton>
        </form>
      ) : null}
      {loading ? (
        <BizuplyLoader label="טוען..." />
      ) : (
        <PartnerCard className="divide-y divide-slate-100 overflow-hidden">
          {items.map((item) => (
            <Link
              key={item.taskId}
              to={`/partner/dashboard/crm/${item.clientId}`}
              className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-violet-50/50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-50 text-violet-700">
                  {isReminders ? <Bell className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-black text-slate-900">{item.title}</p>
                  <p className="truncate text-xs font-bold text-slate-500">
                    {item.clientName}
                    {item.contactName ? ` · ${item.contactName}` : ""}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {formatPartnerDateTime(item.dueAt)}
              </span>
            </Link>
          ))}
          {!items.length ? (
            <PartnerEmpty>{isReminders ? "אין תזכורות" : "אין משימות פתוחות"}</PartnerEmpty>
          ) : null}
        </PartnerCard>
      )}
    </div>
  );
}
