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
import { Link } from "react-router-dom";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";
import { useMetaAdsDateRange } from "./useMetaAdsDateRange";
import { humanizeMetaCustomerLabel } from "./metaCampaignUtils";

export default function MetaPortfolioPage() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<{ businessId: string }>();
  const { serverWindow, query, labelKey } = useMetaAdsDateRange();
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
    const data = await getMetaPortfolio(businessId, {
      window: serverWindow,
      since: query.since,
      until: query.until,
    });
    setRows(data.campaigns || data.allocation?.campaigns || []);
    setAllocation(data.allocation || null);
  }

  useEffect(() => {
    void load();
  }, [businessId, serverWindow, query.since, query.until]);

  const payload = {
    mode: form.mode,
    objective: form.objective,
    targetCpl: Number(form.targetCpl),
    accountCap: Number(form.accountCap),
    maxChangePct: Number(form.maxChangePct),
    window: serverWindow,
    since: query.since,
    until: query.until,
  };

  return (
    <div className="space-y-4" data-testid="portfolio-page">
      <section className={`${cardBase} p-4`}>
        <h2 className="text-lg font-black">{t("metaCampaigns.portfolio.title")}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">{t("metaCampaigns.portfolio.subtitle")}</p>
        <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">
          {t("metaCampaigns.ux.showingRange", { range: t(labelKey) })}
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          {rows.every((row) => !row.results && !row.spend)
            ? t("metaCampaigns.ux.portfolioNoData")
            : t("metaCampaigns.ux.portfolioHasData")}
        </p>
        <Link
          to={`../copilot?q=${encodeURIComponent(t("metaCampaigns.ux.askAiBudget"))}`}
          className="mt-2 inline-flex text-sm font-black text-violet-700 underline"
        >
          {t("metaCampaigns.ux.askAiBudget")}
        </Link>
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

      <div className="space-y-3 md:hidden">
        {rows.length === 0 ? (
          <p className={`${cardBase} p-4 text-sm font-semibold text-slate-500`}>
            {t("metaCampaigns.ux.portfolioNoData")}
          </p>
        ) : (
          rows.map((row) => (
            <article key={row.campaignId} className={`${cardBase} space-y-2 p-4`}>
              <p className="break-words font-black">{row.name}</p>
              <p className="text-xs font-semibold text-slate-500">{row.status}</p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-xs text-slate-500">{t("metaCampaigns.table.budget")}</dt>
                  <dd className="font-bold">{row.currentBudget}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{t("metaCampaigns.portfolio.colProposed")}</dt>
                  <dd className="font-bold">{row.proposedBudget}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{t("metaCampaigns.table.spend")}</dt>
                  <dd className="font-bold">{row.spend}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{t("metaCampaigns.kpis.cpl")}</dt>
                  <dd className="font-bold">{row.cpl}</dd>
                </div>
              </dl>
              <p className="text-sm font-black">{humanizeMetaCustomerLabel(row.recommendation, t)}</p>
              {row.reason ? (
                <p className="text-xs text-slate-500">{humanizeMetaCustomerLabel(row.reason, t)}</p>
              ) : null}
            </article>
          ))
        )}
      </div>
      <div className={`${cardBase} hidden overflow-auto md:block`}>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-start text-xs font-black uppercase text-slate-500">
              <th className="p-2">{t("metaCampaigns.table.name")}</th>
              <th className="p-2">{t("metaCampaigns.table.status")}</th>
              <th className="p-2">{t("metaCampaigns.table.budget")}</th>
              <th className="p-2">{t("metaCampaigns.portfolio.colProposed")}</th>
              <th className="p-2">{t("metaCampaigns.table.spend")}</th>
              <th className="p-2">{t("metaCampaigns.table.results")}</th>
              <th className="p-2">{t("metaCampaigns.kpis.cpl")}</th>
              <th className="p-2">{t("metaCampaigns.portfolio.colRec")}</th>
              <th className="p-2">{t("metaCampaigns.portfolio.colReason")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.campaignId} className="border-b border-slate-100">
                <td className="p-2 font-bold">{row.name}</td>
                <td className="p-2">{humanizeMetaCustomerLabel(row.status, t)}</td>
                <td className="p-2">{row.currentBudget}</td>
                <td className="p-2">{row.proposedBudget}</td>
                <td className="p-2">{row.spend}</td>
                <td className="p-2">{row.results}</td>
                <td className="p-2">{row.cpl}</td>
                <td className="p-2 font-black">{humanizeMetaCustomerLabel(row.recommendation, t)}</td>
                <td className="p-2 text-xs">{humanizeMetaCustomerLabel(row.reason, t)}</td>
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
        {t("metaCampaigns.ux.history")}
      </button>
      {history.length ? (
        <ul className={`${cardBase} space-y-2 p-3 text-sm`}>
          {history.slice(0, 8).map((row) => (
            <li key={row.id}>
              {t("metaCampaigns.ux.portfolioHistoryRow", {
                mode: humanizeMetaCustomerLabel(row.mode, t),
                from: row.totals?.currentBudget,
                to: row.totals?.proposedBudget,
                status: humanizeMetaCustomerLabel(row.status, t),
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
