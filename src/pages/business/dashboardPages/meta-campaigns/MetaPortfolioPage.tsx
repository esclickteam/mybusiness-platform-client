import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  analyzeMetaPortfolio,
  applyMetaPortfolio,
  getMetaPortfolio,
  getMetaPortfolioHistory,
  simulateMetaPortfolio,
  type PortfolioAllocation,
  type PortfolioCampaignRow,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";

export default function MetaPortfolioPage() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<{ businessId: string }>();
  const [rows, setRows] = useState<PortfolioCampaignRow[]>([]);
  const [allocation, setAllocation] = useState<PortfolioAllocation | null>(null);
  const [history, setHistory] = useState<PortfolioAllocation[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [form, setForm] = useState({
    mode: "KEEP_TOTAL",
    objective: "BLENDED_CPL",
    targetCpl: "25",
    accountCap: "300",
    maxChangePct: "10",
  });

  async function load() {
    if (!businessId) return;
    const data = await getMetaPortfolio(businessId);
    setRows(data.campaigns || data.allocation?.campaigns || []);
    setAllocation(data.allocation || null);
  }

  useEffect(() => {
    void load();
  }, [businessId]);

  const payload = {
    mode: form.mode,
    objective: form.objective,
    targetCpl: Number(form.targetCpl),
    accountCap: Number(form.accountCap),
    maxChangePct: Number(form.maxChangePct),
  };

  return (
    <div className="space-y-4" data-testid="portfolio-page">
      <section className={`${cardBase} p-4`}>
        <h2 className="text-lg font-black">{t("metaCampaigns.portfolio.title")}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">{t("metaCampaigns.portfolio.subtitle")}</p>
      </section>

      <section className={`${cardBase} grid gap-3 p-4 md:grid-cols-5`}>
        <label className="text-xs font-black uppercase text-slate-500">
          {t("metaCampaigns.portfolio.keepTotal")}
          <select
            className={`${inputBase} mt-1`}
            value={form.mode}
            onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))}
          >
            <option value="KEEP_TOTAL">{t("metaCampaigns.portfolio.keepTotal")}</option>
            <option value="GROWTH">{t("metaCampaigns.portfolio.growth")}</option>
          </select>
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          {t("metaCampaigns.portfolio.targetCpl")}
          <input className={`${inputBase} mt-1`} value={form.targetCpl} onChange={(e) => setForm((p) => ({ ...p, targetCpl: e.target.value }))} />
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          {t("metaCampaigns.portfolio.accountCap")}
          <input className={`${inputBase} mt-1`} value={form.accountCap} onChange={(e) => setForm((p) => ({ ...p, accountCap: e.target.value }))} />
        </label>
        <label className="text-xs font-black uppercase text-slate-500">
          {t("metaCampaigns.portfolio.maxChange")}
          <input className={`${inputBase} mt-1`} value={form.maxChangePct} onChange={(e) => setForm((p) => ({ ...p, maxChangePct: e.target.value }))} />
        </label>
        <div className="flex flex-wrap items-end gap-2">
          <button
            type="button"
            className={btnPrimary}
            onClick={async () => {
              const data = await analyzeMetaPortfolio(businessId, payload);
              setAllocation(data.allocation);
              setRows(data.allocation.campaigns || []);
            }}
          >
            {t("metaCampaigns.portfolio.analyze")}
          </button>
          <button
            type="button"
            className={btnSecondary}
            data-testid="portfolio-simulate"
            onClick={async () => {
              const data = await simulateMetaPortfolio(businessId, payload);
              setAllocation(data.allocation);
              setRows(data.allocation.campaigns || []);
            }}
          >
            {t("metaCampaigns.portfolio.simulate")}
          </button>
        </div>
      </section>

      <div className={`${cardBase} overflow-auto`}>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-black uppercase text-slate-500">
              <th className="p-2">Campaign</th>
              <th className="p-2">Status</th>
              <th className="p-2">Budget</th>
              <th className="p-2">Proposed</th>
              <th className="p-2">Spend</th>
              <th className="p-2">Results</th>
              <th className="p-2">CPL</th>
              <th className="p-2">Rec</th>
              <th className="p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.campaignId} className="border-b border-slate-100">
                <td className="p-2 font-bold">{row.name}</td>
                <td className="p-2">{row.status}</td>
                <td className="p-2">{row.currentBudget}</td>
                <td className="p-2">{row.proposedBudget}</td>
                <td className="p-2">{row.spend}</td>
                <td className="p-2">{row.results}</td>
                <td className="p-2">{row.cpl}</td>
                <td className="p-2 font-black">{row.recommendation}</td>
                <td className="p-2 text-xs">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allocation ? (
        <section className={`${cardBase} space-y-2 p-4`} data-testid="portfolio-review">
          <p className="text-sm font-black">{t("metaCampaigns.portfolio.review")}</p>
          <p>{t("metaCampaigns.portfolio.currentTotal")}: {allocation.totals?.currentBudget}</p>
          <p>{t("metaCampaigns.portfolio.proposedTotal")}: {allocation.totals?.proposedBudget}</p>
          <p>{t("metaCampaigns.portfolio.blendedCpl")}: {allocation.blended?.blendedCpl} / {t("metaCampaigns.portfolio.targetCpl")} {form.targetCpl}</p>
          {allocation.explanation ? (
            <p className="text-sm text-slate-600">{t("metaCampaigns.portfolio.explanation")}: {allocation.explanation}</p>
          ) : null}
          {allocation.id ? (
            confirming ? (
              <button
                type="button"
                className={btnPrimary}
                data-testid="portfolio-confirm-apply"
                onClick={async () => {
                  const data = await applyMetaPortfolio(businessId, allocation.id as string);
                  setAllocation(data.allocation);
                  setConfirming(false);
                }}
              >
                {t("metaCampaigns.portfolio.confirm")}
              </button>
            ) : (
              <button type="button" className={btnSecondary} onClick={() => setConfirming(true)}>
                {t("metaCampaigns.portfolio.apply")}
              </button>
            )
          ) : null}
        </section>
      ) : null}

      <button
        type="button"
        className={btnSecondary}
        onClick={async () => setHistory(await getMetaPortfolioHistory(businessId))}
      >
        History
      </button>
      {history.length ? (
        <pre className={`${cardBase} overflow-auto p-3 text-xs`}>{JSON.stringify(history, null, 2)}</pre>
      ) : null}
    </div>
  );
}
