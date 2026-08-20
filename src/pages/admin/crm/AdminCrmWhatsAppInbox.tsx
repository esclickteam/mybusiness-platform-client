import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { formatIsraelDate } from "./adminCrmLabels";
import { CrmCard, EmptyState, ErrorState, LoadingState, SecondaryButton } from "./AdminCrmUi";

type InboxItem = {
  id: string;
  adminCustomerId: string | null;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageAt: string;
  assignedAdminName: string;
  unreadCount: number;
  unresolved: boolean;
  matchStatus: string;
};

export default function AdminCrmWhatsAppInbox() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InboxItem[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unresolvedTotal, setUnresolvedTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unresolvedOnly, setUnresolvedOnly] = useState(false);

  async function load(nextUnresolved = unresolvedOnly) {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.whatsappInbox({
        unresolved: nextUnresolved ? "true" : undefined,
      });
      setItems(data.items || []);
      setUnreadTotal(data.unreadTotal || 0);
      setUnresolvedTotal(data.unresolvedTotal || 0);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת תיבת WhatsApp נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => load()} />;

  return (
    <div className="space-y-4">
      <CrmCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black text-purple-950">תיבת WhatsApp של BizUply</h2>
            <p className="text-sm font-bold text-slate-500">
              שיחות על המספר המנוהל של BizUply. לחיצה פותחת את אותו Customer 360.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-2xl bg-violet-50 px-3 py-2 text-sm font-black text-violet-700">
              {unreadTotal} שלא נקראו
            </span>
            <span className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-800">
              {unresolvedTotal} ללא שיוך
            </span>
            <SecondaryButton
              onClick={() => {
                const next = !unresolvedOnly;
                setUnresolvedOnly(next);
                load(next);
              }}
            >
              {unresolvedOnly ? "כל השיחות" : "רק לא משויכות"}
            </SecondaryButton>
          </div>
        </div>
      </CrmCard>
      {!items.length ? <EmptyState title="אין שיחות WhatsApp" /> : null}
      <div className="space-y-2">
        {items.map((row) => (
          <button
            key={row.id}
            type="button"
            className="w-full rounded-[24px] border border-purple-100 bg-white p-4 text-right shadow-sm"
            onClick={() => {
              if (row.adminCustomerId) navigate(`/admin/crm/customers/${row.adminCustomerId}?tab=whatsapp`);
            }}
            disabled={!row.adminCustomerId}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-purple-950">{row.name}</div>
                <div className="mt-1 text-sm font-bold" dir="ltr">{row.phone}</div>
                <div className="mt-2 text-sm text-slate-600">{row.lastMessage || "—"}</div>
              </div>
              <div className="text-left text-xs font-bold text-slate-500">
                <div>{formatIsraelDate(row.lastMessageAt, true)}</div>
                {row.unreadCount ? (
                  <div className="mt-2 inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[#7C4DFF] px-2 text-white">
                    {row.unreadCount}
                  </div>
                ) : null}
                <div className="mt-2">{row.assignedAdminName || "לא משויך"}</div>
                {row.unresolved ? <div className="mt-1 text-amber-700">דורש שיוך ידני</div> : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
