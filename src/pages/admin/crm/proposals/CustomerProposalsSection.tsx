import React, { useEffect, useState } from "react";
import adminCrmApi from "../../../../api/adminCrmApi";
import { Badge, formatIsraelDate } from "../adminCrmLabels";
import { CrmCard, PrimaryButton, SecondaryButton } from "../AdminCrmUi";
import ProposalBuilderModal from "./ProposalBuilderModal";
import EnterpriseProposalModal from "./EnterpriseProposalModal";
import ProposalDocumentView from "./ProposalDocumentView";
import EnterpriseProposalView from "./EnterpriseProposalView";
import { PROPOSAL_STATUS_LABELS } from "./proposalLabels";
import { AdminModal } from "../AdminModal";

const STATUS_LABELS: Record<string, string> = {
  ...PROPOSAL_STATUS_LABELS,
  issued: "נשלחה",
  declined: "בוטלה",
};

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
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] = useState<any>(null);
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

  function closeEnterprise() {
    setEnterpriseOpen(false);
    setEditingEnterprise(null);
    void load();
  }

  function openEnterprise(row?: any) {
    setBuilderOpen(false);
    setEditingEnterprise(row || null);
    setEnterpriseOpen(true);
  }

  return (
    <>
      <CrmCard className="lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">הצעות מחיר</h3>
            <p className="text-sm font-bold text-slate-500">יצירה, הנפקה ומעקב אחרי הצעות ללקוח</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton compact onClick={() => openEnterprise()}>
              הצעת Enterprise
            </SecondaryButton>
            <PrimaryButton compact onClick={() => setBuilderOpen(true)}>
              יצירת הצעה
            </PrimaryButton>
          </div>
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
                    {row.kind === "enterprise" ? "Enterprise · " : ""}
                    {row.enterprise?.title || row.proposalNumber} · גרסה {row.version}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    נוצר {formatIsraelDate(row.createdAt, true)} · בתוקף עד{" "}
                    {formatIsraelDate(row.expiresAt, true)}
                  </p>
                  {row.kind === "enterprise" ? (
                    <p className="mt-1 text-xs text-slate-600">
                      הקמה ₪{row.enterprise?.setupPriceIls || row.totals?.oneTimeIls || 0} · חודשי ₪
                      {row.enterprise?.monthlyPriceIls || row.totals?.monthlyIls || 0}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-600">
                      חודשי ₪{row.totals?.monthlyIls || 0} · חד־פעמי ₪
                      {(row.totals?.oneTimeIls || 0) + (row.totals?.servicesIls || 0)} · שנתי ₪
                      {row.totals?.yearlyIls || 0}
                    </p>
                  )}
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
                      {row.paidAt ? ` · שולם ${formatIsraelDate(row.paidAt, true)}` : ""}
                    </p>
                  ) : null}
                </div>
                <Badge
                  tone={
                    row.status === "paid" || row.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : row.status === "signed" || row.status === "payment_pending"
                        ? "bg-sky-50 text-sky-800 border-sky-200"
                        : row.status === "declined" || row.status === "expired"
                          ? "bg-slate-100 text-slate-600 border-slate-200"
                          : "bg-violet-50 text-violet-700 border-violet-100"
                  }
                >
                  {STATUS_LABELS[row.status] || row.status}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <SecondaryButton compact onClick={() => setPreview(row)}>
                  תצוגה מקדימה
                </SecondaryButton>
                {row.publicUrl ? (
                  <SecondaryButton
                    compact
                    onClick={() => void navigator.clipboard?.writeText(row.publicUrl)}
                  >
                    העתקת קישור
                  </SecondaryButton>
                ) : null}
                {row.publicUrl ? (
                  <SecondaryButton
                    compact
                    onClick={() => {
                      const text = encodeURIComponent(
                        `היי, הכנו לך הצעה מותאמת ב-BizUply:\n${row.publicUrl}`
                      );
                      window.open(`https://wa.me/?text=${text}`, "_blank");
                    }}
                  >
                    שליחה ללקוח
                  </SecondaryButton>
                ) : null}
                {row.status === "draft" ? (
                  <SecondaryButton
                    compact
                    onClick={() => {
                      if (row.kind === "enterprise") openEnterprise(row);
                      else setBuilderOpen(true);
                    }}
                  >
                    עריכה
                  </SecondaryButton>
                ) : null}
                <SecondaryButton
                  compact
                  onClick={async () => {
                    const { data } = await adminCrmApi.reviseProposal(row.id);
                    await load();
                    if (row.kind === "enterprise") openEnterprise(data.proposal);
                    else setBuilderOpen(true);
                  }}
                >
                  שכפול
                </SecondaryButton>
                {row.status !== "paid" && row.status !== "accepted" && row.status !== "declined" ? (
                  <SecondaryButton
                    compact
                    onClick={async () => {
                      await adminCrmApi.voidProposal(row.id);
                      await load();
                    }}
                  >
                    ביטול הצעה
                  </SecondaryButton>
                ) : null}
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
        onOpenEnterprise={() => openEnterprise()}
      />

      <EnterpriseProposalModal
        open={enterpriseOpen}
        customerId={customerId}
        existing={editingEnterprise}
        onClose={closeEnterprise}
        onIssued={() => void load()}
      />

      <AdminModal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview?.proposalNumber || "תצוגת הצעה"}
        size="xl"
      >
        {preview?.kind === "enterprise" || preview?.enterprise ? (
          <EnterpriseProposalView proposal={preview} />
        ) : preview ? (
          <ProposalDocumentView interactive proposal={preview} />
        ) : null}
      </AdminModal>
    </>
  );
}
