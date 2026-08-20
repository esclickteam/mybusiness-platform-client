import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import { FOLLOW_UP_TYPE_LABELS, formatIsraelDate } from "./adminCrmLabels";
import { CrmCard, EmptyState, ErrorState, LoadingState, SecondaryButton } from "./AdminCrmUi";

type FollowUpRow = {
  adminCustomerId: string;
  contactName?: string;
  companyName?: string;
  phone?: string;
  nextFollowUpAt?: string;
  nextFollowUpNote?: string;
  nextFollowUpType?: string;
  assignedAdminName?: string;
  overdue?: boolean;
};

export default function AdminCrmFollowUps() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scope, setScope] = useState(searchParams.get("scope") || "today");
  const [items, setItems] = useState<FollowUpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(nextScope = scope) {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.followUps({ scope: nextScope });
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת המעקבים נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(scope);
  }, [scope]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          ["today", "מעקבים להיום"],
          ["overdue", "באיחור"],
          ["upcoming", "קרובים"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setScope(key)}
            className={`min-h-11 rounded-2xl px-4 text-sm font-black ${
              scope === key ? "bg-[#7C4DFF] text-white" : "bg-white border border-purple-100 text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? <ErrorState message={error} onRetry={() => load()} /> : null}
      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState title="אין מעקבים בתצוגה זו" />
      ) : (
        <div className="space-y-3">
          {items.map((row) => (
            <CrmCard key={row.adminCustomerId}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-black text-purple-950">
                    {row.companyName || row.contactName || "לקוח"}
                  </h3>
                  <p className="text-sm font-bold text-slate-500">
                    {row.contactName} · {row.phone || "אין טלפון"}
                  </p>
                  <p className={`mt-1 text-sm font-black ${row.overdue ? "text-rose-700" : "text-[#7C4DFF]"}`}>
                    מעקב הבא: {formatIsraelDate(row.nextFollowUpAt, true)}
                    {row.nextFollowUpType
                      ? ` · ${FOLLOW_UP_TYPE_LABELS[row.nextFollowUpType] || row.nextFollowUpType}`
                      : ""}
                  </p>
                  {row.nextFollowUpNote ? (
                    <p className="text-sm font-bold text-slate-600">{row.nextFollowUpNote}</p>
                  ) : null}
                  <p className="text-xs font-bold text-slate-400">
                    מטפל: {row.assignedAdminName || "לא משויך"}
                  </p>
                </div>
                <SecondaryButton onClick={() => navigate(`/admin/crm/customers/${row.adminCustomerId}?tab=tasks`)}>
                  לתיק הלקוח
                </SecondaryButton>
              </div>
            </CrmCard>
          ))}
        </div>
      )}
    </div>
  );
}
