import React, { useEffect, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import { Badge, formatIsraelDate } from "../adminCrmLabels";
import { CrmCard, PrimaryButton, SecondaryButton } from "../AdminCrmUi";
import ProposalBuilderModal from "./ProposalBuilderModal";
import ProposalDocumentView from "./ProposalDocumentView";
import { PROPOSAL_STATUS_LABELS } from "./proposalLabels";
import { AdminModal } from "../AdminModal";

const STATUS_LABELS = PROPOSAL_STATUS_LABELS;

export default function CustomerProposalsSection({
  customerId,
  openBuilder = false,
  onBuilderClose,
}: {
  customerId: string;
  openBuilder?: boolean;
  onBuilderClose?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  async function load() {
    try {
      const { data } = await adminCrmApi.listProposals(customerId);
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }

  useEffect(() => {
    void load();
  }, [customerId]);

  useEffect(() => {
    if (openBuilder) setBuilderOpen(true);
  }, [openBuilder]);

  function closeBuilder() {
    setBuilderOpen(false);
    onBuilderClose?.();
    void load();
  }

  return (
    <>
      <CrmCard className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">הצעות מחיר</h3>
            <p className="text-sm font-bold text-slate-500">יצירה, הנפקה ומעקב אחרי הצעות ללקוח</p>
          </div>
          <PrimaryButton compact onClick={() => setBuilderOpen(true)}>
            יצירת הצעה
          </PrimaryButton>
        </div>

        <div className="mt-4 space-y-3">
          {items.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-bold"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-black text-slate-900">
                    {row.proposalNumber} · גרסה {row.version}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    נוצר {formatIsraelDate(row.createdAt, true)} · בתוקף עד{" "}
                    {formatIsraelDate(row.expiresAt, true)}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    חודשי ₪{row.totals?.monthlyIls || 0} · חד־פעמי ₪
                    {(row.totals?.oneTimeIls || 0) + (row.totals?.servicesIls || 0)} · שנתי ₪
                    {row.totals?.yearlyIls || 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    צפיות: {row.viewCount || 0}
                    {row.lastViewedAt
                      ? ` · אחרונה ${formatIsraelDate(row.lastViewedAt, true)}`
                      : ""}
                    {row.createdByName ? ` · נוצר ע״י ${row.createdByName}` : ""}
                  </p>
                  {row.approvedByName ? (
                    <p className="mt-1 text-xs font-black text-emerald-700">
                      נחתם: {row.approvedByName}
                      {row.approvedByIdNumber ? ` · ת״ז ${row.approvedByIdNumber}` : ""}
                      {row.approvedByBusinessNumber
                        ? ` · ח״פ ${row.approvedByBusinessNumber}`
                        : ""}
                      {row.paidAt ? ` · שולם ${formatIsraelDate(row.paidAt, true)}` : ""}
                    </p>
                  ) : null}
                  {row.signatureData ? (
                    <img
                      src={row.signatureData}
                      alt="חתימה"
                      className="mt-2 h-14 rounded-lg border border-slate-200 bg-white p-1"
                    />
                  ) : null}
                </div>
                <Badge
                  tone={
                    row.status === "paid" || row.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : row.status === "signed" || row.status === "payment_pending"
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : row.status === "question_asked" || row.status === "thinking"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-violet-50 text-violet-700 border-violet-100"
                  }
                >
                  {STATUS_LABELS[row.status] || row.status}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <SecondaryButton compact onClick={() => setPreview(row)}>
                  צפייה / Preview
                </SecondaryButton>
                {row.publicUrl ? (
                  <SecondaryButton
                    compact
                    onClick={() => void navigator.clipboard?.writeText(row.publicUrl)}
                  >
                    העתקת קישור
                  </SecondaryButton>
                ) : null}
                {row.status !== "draft" ? (
                  <SecondaryButton
                    compact
                    onClick={async () => {
                      await adminCrmApi.reviseProposal(row.id);
                      await load();
                      setBuilderOpen(true);
                    }}
                  >
                    יצירת גרסה חדשה
                  </SecondaryButton>
                ) : (
                  <SecondaryButton
                    compact
                    onClick={() => {
                      setBuilderOpen(true);
                    }}
                  >
                    המשך עריכה
                  </SecondaryButton>
                )}
              </div>
            </div>
          ))}
          {!items.length ? (
            <p className="text-sm font-bold text-slate-500">עדיין אין הצעות ללקוח זה.</p>
          ) : null}
        </div>
      </CrmCard>

      <ProposalBuilderModal
        open={builderOpen}
        customerId={customerId}
        onClose={closeBuilder}
        onIssued={() => void load()}
      />

      <AdminModal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview?.proposalNumber || "תצוגת הצעה"}
        size="xl"
      >
        {preview ? <ProposalDocumentView interactive proposal={preview} /> : null}
      </AdminModal>
    </>
  );
}
