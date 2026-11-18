import React, { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  getInvistimoCutoverReadiness,
  type InvistimoCutoverReadiness,
} from "../../../../api/whatsappApi";
import { btnSecondary, cardBase } from "../../../../styles/bizuplyUi";

type Props = { businessId: string };

export default function InvistimoCutoverReadinessPanel({ businessId }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState<InvistimoCutoverReadiness | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const next = await getInvistimoCutoverReadiness(businessId);
      if (
        next.executeEnabled ||
        next.sendEnabled ||
        next.registerEnabled ||
        next.readyToCutover ||
        next.webhookEnabled ||
        next.queuesPaused ||
        next.activatesOnBoot
      ) {
        throw new Error("Readiness response tried to enable cutover");
      }
      setReport(next);
    } catch (loadError) {
      setReport(null);
      const responseMessage = (loadError as { response?: { data?: { error?: string } } })?.response
        ?.data?.error;
      setError(responseMessage || (loadError instanceof Error ? loadError.message : "Failed to read readiness"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  return (
    <section className={`${cardBase} space-y-3 p-4`} data-testid="invistimo-cutover-readiness">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900">מוכנות להחלפת הספק</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            חשבון Bizuply 1713214566994439 מול 360dialog 1042912532080617. הקליטה החדשה כבויה והתורים
            לא מושהים. המסך לא מפעיל מעבר, לא שולח הודעה ולא רושם את המספר.
          </p>
        </div>
        <button type="button" className={btnSecondary} onClick={() => void load()} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          רענון מוכנות
        </button>
      </div>
      {error ? (
        <p className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
      {report ? (
        <ul className="space-y-2">
          {report.checks.map((check) => (
            <li key={check.id} className="rounded-xl border border-slate-100 px-3 py-2 text-sm">
              <span className="font-black">{check.pass ? "PASS" : "חסר"}</span>
              <span className="mx-2 font-bold text-slate-800">{check.id}</span>
              <span className="text-slate-600">{check.detail}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
