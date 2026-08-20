import React, { useEffect, useState } from "react";
import adminCrmApi from "../../../api/adminCrmApi";
import { ACTIVITY_LABELS, formatIsraelDate } from "./adminCrmLabels";
import { EmptyState, ErrorState, LoadingState } from "./AdminCrmUi";

export default function AdminCrmActivities() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.globalActivities();
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הפעילויות נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!items.length) return <EmptyState title="אין פעילויות עדיין" />;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item._id} className="rounded-[24px] border border-purple-100 bg-white p-4">
          <div className="text-xs font-black text-[#7C4DFF]">
            {ACTIVITY_LABELS[item.type] || item.type} · {formatIsraelDate(item.occurredAt, true)}
          </div>
          <p className="mt-1 font-bold text-slate-800">{item.description || "—"}</p>
        </article>
      ))}
    </div>
  );
}
