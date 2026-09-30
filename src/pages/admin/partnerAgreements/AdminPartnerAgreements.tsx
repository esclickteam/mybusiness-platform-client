import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../AdminsHeader";
import {
  agreementError,
  fetchTerritoryAvailability,
  listPartnerAgreements,
  type CountryOption,
  type PartnerAgreement,
  type TerritoryAvailability,
} from "../../../lib/partnerAgreementApi";
import { agreementStatusLabel, fill } from "./partnerAgreementPageCopy.js";
import { usePartnerAgreementPage } from "./usePartnerAgreementPage";

const FILTER_IDS: (TerritoryAvailability | "all")[] = [
  "all",
  "available",
  "agreement_pending",
  "exclusive_active",
  "renewal_window",
  "expiring_soon",
];

export default function AdminPartnerAgreements() {
  const { text, dir, locale } = usePartnerAgreementPage();
  const copy = text.list;
  const [items, setItems] = useState<PartnerAgreement[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<TerritoryAvailability | "all">(() => {
    const requested = new URLSearchParams(window.location.search).get("filter");
    if (
      requested === "all" ||
      requested === "available" ||
      requested === "agreement_pending" ||
      requested === "exclusive_active" ||
      requested === "renewal_window" ||
      requested === "expiring_soon"
    ) {
      return requested;
    }
    return "exclusive_active";
  });
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [agreements, territories] = await Promise.all([
          listPartnerAgreements(),
          fetchTerritoryAvailability(),
        ]);
        if (cancelled) return;
        setItems(agreements.items || []);
        setCountries(territories.countries || []);
        setCounts(territories.counts || {});
      } catch (err) {
        if (!cancelled) setError(agreementError(err, copy.loadError));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [copy.loadError]);

  const visibleCountries = useMemo(() => {
    const query = q.trim().toLowerCase();
    const rank: Record<string, number> = {
      exclusive_active: 0,
      expiring_soon: 1,
      agreement_pending: 2,
      available: 3,
    };
    return countries.filter((row) => {
      if (filter !== "all" && row.availability !== filter) return false;
      if (!query) return true;
      return (
        row.countryName.toLowerCase().includes(query) ||
        row.countryCode.toLowerCase().includes(query) ||
        row.partnerName.toLowerCase().includes(query) ||
        row.agreementNumber.toLowerCase().includes(query)
      );
    }).sort((a, b) => (rank[a.availability] ?? 9) - (rank[b.availability] ?? 9) || a.countryName.localeCompare(b.countryName));
  }, [countries, filter, q]);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-6 px-4 py-6" dir={dir} lang={locale}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#7C4DFF]">{copy.eyebrow}</p>
            <h1 className="text-3xl font-black text-slate-900">{copy.title}</h1>
            <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-600">{copy.intro}</p>
          </div>
          <Link
            to="/admin/partner-agreements/new"
            className="rounded-2xl bg-[#7C4DFF] px-4 py-2.5 text-sm font-black text-white"
          >
            {copy.create}
          </Link>
        </div>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

        <section data-testid="territory-availability" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">{copy.territoryTitle}</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">{copy.territoryHelp}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`rounded-full px-3 py-1.5 text-sm font-black ${
                  filter === id ? "bg-[#7C4DFF] text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {copy[id]}
                {id !== "all" ? ` · ${counts[id] || 0}` : ""}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder={copy.search}
            className="mt-4 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-start text-sm">
              <thead className="text-xs font-black uppercase text-slate-400">
                <tr>
                  <th className="py-2 text-start">{copy.country}</th>
                  <th className="text-start">{copy.status}</th>
                  <th className="text-start">{copy.partner}</th>
                  <th className="text-start">{copy.agreement}</th>
                  <th className="text-start">{copy.start}</th>
                  <th className="text-start">{copy.expiry}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="py-4 font-bold text-slate-500" colSpan={6}>
                      {copy.loading}
                    </td>
                  </tr>
                ) : (
                  visibleCountries.slice(0, filter === "available" || filter === "all" ? 80 : 200).map((row) => (
                    <tr key={row.countryCode} className="border-t border-slate-100" data-testid={`territory-${row.countryCode}`}>
                      <td className="py-2 font-black">
                        {row.countryName} <span className="font-bold text-slate-400">{row.countryCode}</span>
                      </td>
                      <td className="font-bold">{copy[row.availability] || row.availability}</td>
                      <td>{row.partnerName || "—"}</td>
                      <td>
                        {row.agreementId ? (
                          <Link className="font-black text-[#6D28D9]" to={`/admin/partner-agreements/${row.agreementId}`}>
                            {row.agreementNumber}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{row.startDate || "—"}</td>
                      <td>{row.endDate || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {(filter === "available" || filter === "all") && visibleCountries.length > 80 ? (
              <p className="mt-2 text-xs font-bold text-slate-500">
                {fill(copy.showing, { shown: 80, total: visibleCountries.length })}
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">{copy.agreements}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-start text-sm">
              <thead className="text-xs font-black uppercase text-slate-400">
                <tr>
                  <th className="py-2 text-start">{copy.number}</th>
                  <th className="text-start">{copy.partner}</th>
                  <th className="text-start">{copy.country}</th>
                  <th className="text-start">{copy.type}</th>
                  <th className="text-start">{copy.status}</th>
                  <th className="text-start">{copy.payment}</th>
                  <th className="text-start">{copy.term}</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="py-4 font-bold text-slate-500" colSpan={7}>
                      {copy.empty}
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="py-2">
                        <Link className="font-black text-[#6D28D9]" to={`/admin/partner-agreements/${row.id}`}>
                          {row.agreementNumber}
                        </Link>
                      </td>
                      <td className="font-bold">{row.brandName || row.legalCompanyName || "—"}</td>
                      <td>
                        {row.countryName || "—"} {row.countryCode}
                      </td>
                      <td>{row.territoryType === "exclusive" ? copy.exclusive : row.territoryType === "non_exclusive" ? copy.nonExclusive : "—"}</td>
                      <td>{agreementStatusLabel(row.status, text)}</td>
                      <td>{agreementStatusLabel(row.paymentStatus, text)}</td>
                      <td>
                        {row.startDate || "—"} {copy.rangeTo} {row.endDate || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
