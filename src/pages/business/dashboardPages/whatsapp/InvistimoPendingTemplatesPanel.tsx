import React, { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  listInvistimoPendingTemplates,
  type InvistimoPendingTemplatePreview,
} from "../../../../api/whatsappApi";
import { btnSecondary, cardBase } from "../../../../styles/bizuplyUi";

type Props = {
  businessId: string;
};

function previewText(row: InvistimoPendingTemplatePreview): string {
  return [row.preview.header, row.preview.body, row.preview.footer, row.preview.buttons.join(" · ")]
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join("\n");
}

export default function InvistimoPendingTemplatesPanel({ businessId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<InvistimoPendingTemplatePreview[]>([]);
  const [accountName, setAccountName] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const report = await listInvistimoPendingTemplates(businessId);
      if (report.sendEnabled || report.editEnabled || report.activateEnabled || report.persisted) {
        throw new Error("Preview response is not read-only");
      }
      setRows(report.templates || []);
      setAccountName(report.accountName || "");
    } catch (loadError) {
      setRows([]);
      const responseMessage = (
        loadError as { response?: { data?: { error?: string } } }
      )?.response?.data?.error;
      setError(responseMessage || (loadError instanceof Error ? loadError.message : "Failed to read templates"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // The panel is scoped to one tenant and reloads only from its own button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  return (
    <section
      className={`${cardBase} space-y-3 p-4`}
      data-testid="invistimo-pending-templates"
      aria-label="תבניות חשבון Bizuply"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">תבניות חשבון Bizuply</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            קריאה בלבד מחשבון Messaging 1713214566994439
            {accountName ? ` · ${accountName}` : ""}. נפרד מחשבון 360dialog 1042912532080617.
            אין כאן שליחה, עריכה או הפעלה.
          </p>
        </div>
        <button type="button" className={btnSecondary} onClick={() => void load()} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          רענון תצוגה
        </button>
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-start text-sm">
          <thead className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-3 py-2">שם</th>
              <th className="px-3 py-2">שפה</th>
              <th className="px-3 py-2">קטגוריה</th>
              <th className="px-3 py-2">סטטוס</th>
              <th className="px-3 py-2">תצוגה מקדימה</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-xs font-semibold text-slate-400">
                  טוען תבניות
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-xs font-semibold text-slate-400">
                  אין תבניות מאושרות להצגה
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`${row.name}:${row.language}`} className="border-b border-slate-50 align-top">
                  <td className="px-3 py-2 font-bold text-slate-800">{row.name}</td>
                  <td className="px-3 py-2">{row.language}</td>
                  <td className="px-3 py-2">{row.category}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="max-w-md whitespace-pre-wrap px-3 py-2 text-slate-600">{previewText(row) || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
