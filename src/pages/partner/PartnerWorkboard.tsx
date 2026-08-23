import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, CalendarCheck } from "lucide-react";
import { fetchPartnerClients, partnerApiError } from "../../lib/partnerApi";
import type { PartnerClient } from "../../types/partner";
import BizuplyLoader from "../../components/ui/BizuplyLoader";
import { PartnerCard, PartnerEmpty } from "../../components/partner/partnerUi";
import {
  formatPartnerDateTime,
  openPartnerTasks,
  upcomingReminders,
  type PartnerWorkItem,
} from "../../lib/partnerWork";

export default function PartnerWorkboard() {
  const location = useLocation();
  const isReminders = location.pathname.includes("/reminders");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clients, setClients] = useState<PartnerClient[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPartnerClients({ page: 1, limit: 50 })
      .then((data) => {
        if (!cancelled) setClients(data.items || []);
      })
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

  return (
    <div className="space-y-5">
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
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          {error}
        </div>
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
              <p className="shrink-0 text-xs font-black text-slate-500">
                {formatPartnerDateTime(item.dueAt)}
              </p>
            </Link>
          ))}
          {!items.length ? (
            <PartnerEmpty>
              {isReminders ? "אין תזכורות עם תאריך יעד" : "אין משימות פתוחות"}
            </PartnerEmpty>
          ) : null}
        </PartnerCard>
      )}
    </div>
  );
}
