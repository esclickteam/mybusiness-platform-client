import { useTranslation } from "react-i18next";
import type { PartnerMe } from "../../types/partner";
import { isInternationalPlanKey } from "../../lib/partnerInternationalPlan";

export default function InternationalFeeNotice({ me }: { me: PartnerMe }) {
  const { t } = useTranslation();
  const planKey = me.planKey || me.plan?.planKey || "";
  if (!isInternationalPlanKey(planKey)) return null;
  const status = me.internationalActivation?.status || me.status;
  const amount = me.internationalActivation?.manualCollection?.amountUsd || me.plan?.annualUsd || 5000;
  if (status === "pending_setup") {
    return (
      <section data-testid="international-fee-notice" className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{status}</p>
        <p className="mt-1 text-lg font-black text-slate-900">{t("partner.internationalFee.pendingTitle")}</p>
        <p className="mt-2 text-sm font-bold text-slate-700">{t("partner.internationalFee.pendingBody")}</p>
      </section>
    );
  }
  if (status !== "payment_due") return null;
  return (
    <section data-testid="international-fee-notice" className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-800">{t("partner.internationalFee.dueTitle")}</p>
      <p className="mt-2 text-sm font-bold text-amber-950">{t("partner.internationalFee.dueBody", { amount })}</p>
    </section>
  );
}
