import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import {
  LOST_REASON_LABELS,
  SOURCE_LABELS,
  STAGE_LABELS,
  formatIsraelDate,
} from "./adminCrmLabels";
import { ErrorState, LoadingState, PrimaryButton, SecondaryButton } from "./AdminCrmUi";

type Card = {
  adminCustomerId: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  leadSource?: string;
  assignedAdminName?: string;
  lastActivityAt?: string;
  nextFollowUpAt?: string;
  packageInterest?: string;
  estimatedValue?: number;
  currentPackageLabel?: string;
};

export default function AdminCrmPipeline() {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<{ stage: string; items: Card[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState<string | null>(null);
  const [lostFor, setLostFor] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState("no_response");
  const [lostNote, setLostNote] = useState("");
  const [pendingStage, setPendingStage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.pipeline();
      setColumns(data.columns || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הפייפליין נכשלה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function move(id: string, salesStage: string, extra: Record<string, unknown> = {}) {
    setSaving(true);
    try {
      await adminCrmApi.movePipeline({ adminCustomerId: id, salesStage, ...extra });
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "ההעברה נכשלה. התצוגה לא עודכנה.");
      await load();
    } finally {
      setSaving(false);
      setDragging(null);
    }
  }

  function onDrop(stage: string) {
    if (!dragging) return;
    if (stage === "lost") {
      setLostFor(dragging);
      setPendingStage("lost");
      return;
    }
    move(dragging, stage);
  }

  if (loading) return <LoadingState />;
  if (error && !columns.length) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-3">
      {error ? <ErrorState message={error} onRetry={load} /> : null}
      {saving ? <p className="text-sm font-bold text-slate-500">שומר שינוי שלב...</p> : null}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.stage}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col.stage)}
            className="min-h-[70vh] w-[280px] shrink-0 rounded-[24px] border border-purple-100 bg-white/80 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-purple-950">{STAGE_LABELS[col.stage] || col.stage}</h3>
              <span className="rounded-full bg-purple-50 px-2 text-xs font-black text-[#7C4DFF]">{col.items.length}</span>
            </div>
            <div className="space-y-2">
              {col.items.map((card) => (
                <article
                  key={card.adminCustomerId}
                  draggable
                  onDragStart={() => setDragging(card.adminCustomerId)}
                  onClick={() => navigate(`/admin/crm/customers/${card.adminCustomerId}`)}
                  className="cursor-grab rounded-2xl border border-purple-100 bg-white p-3 text-right shadow-sm"
                >
                  <div className="font-black text-slate-900">{card.companyName || card.contactName || "ללא שם"}</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">{card.contactName}</div>
                  <div className="mt-1 text-xs font-bold" dir="ltr">{card.phone || "—"}</div>
                  <div className="mt-2 text-[11px] font-bold text-slate-500">
                    {SOURCE_LABELS[card.leadSource || ""] || card.leadSource || "—"} · {card.assignedAdminName || "לא משויך"}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    מעקב: {formatIsraelDate(card.nextFollowUpAt)} · פעילות: {formatIsraelDate(card.lastActivityAt)}
                  </div>
                  <div className="mt-1 text-[11px] font-black text-[#7C4DFF]">
                    {card.currentPackageLabel || card.packageInterest || "—"}
                    {card.estimatedValue ? ` · ₪${card.estimatedValue}` : ""}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {lostFor ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-[28px] bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              move(lostFor, pendingStage || "lost", { reason: lostReason, note: lostNote });
              setLostFor(null);
            }}
          >
            <h2 className="text-lg font-black">סיבת הפסד</h2>
            <select value={lostReason} onChange={(e) => setLostReason(e.target.value)} className="min-h-11 w-full rounded-2xl border px-3 font-bold">
              {Object.entries(LOST_REASON_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <textarea value={lostNote} onChange={(e) => setLostNote(e.target.value)} className="min-h-24 w-full rounded-2xl border p-3" placeholder="הערה (אופציונלי)" />
            <div className="flex gap-2">
              <PrimaryButton type="submit">שמירה</PrimaryButton>
              <SecondaryButton type="button" onClick={() => setLostFor(null)}>ביטול</SecondaryButton>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
