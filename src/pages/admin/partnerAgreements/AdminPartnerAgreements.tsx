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
import { availabilityLabel } from "../../../lib/partnerAgreementRules";

const FILTERS: { id: TerritoryAvailability | "all"; label: string }[] = [
  { id: "all", label: "All countries" },
  { id: "available", label: "Available" },
  { id: "agreement_pending", label: "Agreement pending" },
  { id: "exclusive_active", label: "Exclusive active" },
  { id: "expiring_soon", label: "Expiring soon" },
];

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function AdminPartnerAgreements() {
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
        if (!cancelled) setError(agreementError(err, "Could not load partner agreements."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    <div className="min-h-screen bg-[#F7F8FA]" dir="ltr">
      <AdminHeader />
      <main className="mx-auto max-w-[1480px] space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#7C4DFF]">Bizuply Admin</p>
            <h1 className="text-3xl font-black text-slate-900">Partner Agreements</h1>
            <p className="mt-1 max-w-2xl text-sm font-semibold text-slate-600">
              The legal agreement is a fixed template. Create a record only when you are ready to set the partner and commercial details. Nothing is generated or sent on its own.
            </p>
          </div>
          <Link
            to="/admin/partner-agreements/new"
            className="rounded-2xl bg-[#7C4DFF] px-4 py-2.5 text-sm font-black text-white"
          >
            Create agreement
          </Link>
        </div>

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}

        <section data-testid="territory-availability" className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Territory availability</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            A country stays available until an exclusive agreement is signed, paid, and active.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-black ${
                  filter === item.id ? "bg-[#7C4DFF] text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.label}
                {item.id !== "all" ? ` · ${counts[item.id] || 0}` : ""}
              </button>
            ))}
          </div>
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search country, partner, or agreement"
            className="mt-4 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold outline-none focus:border-violet-400"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs font-black uppercase text-slate-400">
                <tr>
                  <th className="py-2">Country</th>
                  <th>Status</th>
                  <th>Partner</th>
                  <th>Agreement</th>
                  <th>Start</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="py-4 font-bold text-slate-500" colSpan={6}>
                      Loading territories...
                    </td>
                  </tr>
                ) : (
                  visibleCountries.slice(0, filter === "available" || filter === "all" ? 80 : 200).map((row) => (
                    <tr key={row.countryCode} className="border-t border-slate-100" data-testid={`territory-${row.countryCode}`}>
                      <td className="py-2 font-black">
                        {row.countryName} <span className="font-bold text-slate-400">{row.countryCode}</span>
                      </td>
                      <td className="font-bold">{availabilityLabel(row.availability)}</td>
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
                Showing 80 of {visibleCountries.length}. Search to narrow the list.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-black">Agreements</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="text-xs font-black uppercase text-slate-400">
                <tr>
                  <th className="py-2">Number</th>
                  <th>Partner</th>
                  <th>Territory</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Term</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="py-4 font-bold text-slate-500" colSpan={7}>
                      No agreements yet.
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
                      <td>{row.territoryType === "exclusive" ? "Exclusive" : row.territoryType === "non_exclusive" ? "Non-exclusive" : "—"}</td>
                      <td className="capitalize">{statusLabel(row.status)}</td>
                      <td className="capitalize">{row.paymentStatus}</td>
                      <td>
                        {row.startDate || "—"} to {row.endDate || "—"}
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
