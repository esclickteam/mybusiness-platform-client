import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api";
import AdminHeader from "../AdminsHeader";
import AdminPageHeader from "../shell/AdminPageHeader";
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
  const [agreementQuery, setAgreementQuery] = useState("");
  const [agreementStatus, setAgreementStatus] = useState("");
  const [exclusive, setExclusive] = useState("");
  const [documents, setDocuments] = useState<{ id: string; files: { kind: string; filename?: string; uploadedAt?: string }[] } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [agreements, territories] = await Promise.all([
          listPartnerAgreements({
            q: agreementQuery || undefined,
            status: agreementStatus || undefined,
            exclusive: exclusive || undefined,
          }),
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
  }, [agreementQuery, agreementStatus, exclusive, copy.loadError]);

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
        <AdminPageHeader
          title={copy.title}
          description={copy.intro}
          actions={
            <Link to="/admin/partner-agreements/new" className="biz-btn">
              {copy.create}
            </Link>
          }
        />

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

        <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="agreement-search">
          <h2 className="text-xl font-black">{copy.agreements}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <input value={agreementQuery} onChange={(event) => setAgreementQuery(event.target.value)} placeholder="Number, company, signatory, territory" className="w-full max-w-md rounded-xl border px-3 py-2 text-sm font-semibold" />
            <select value={agreementStatus} onChange={(event) => setAgreementStatus(event.target.value)} className="rounded-xl border px-3 py-2 text-sm font-bold">
              <option value="">All statuses</option>
              {["draft", "bizuply_signed", "partner_signature_pending", "partially_signed", "fully_signed", "payment_pending", "verification_pending", "active", "expired", "terminated"].map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <select value={exclusive} onChange={(event) => setExclusive(event.target.value)} className="rounded-xl border px-3 py-2 text-sm font-bold">
              <option value="">Exclusive and non-exclusive</option>
              <option value="exclusive">Exclusive</option>
              <option value="non_exclusive">Non-exclusive</option>
            </select>
          </div>
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
                  <th className="text-start">Verification</th>
                  <th className="text-start">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td className="py-4 font-bold text-slate-500" colSpan={8}>
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
                      <td>
                        <div>{agreementStatusLabel(row.status, text)}</div>
                        <div className="text-xs font-bold" data-testid="list-signature-status">Signatures: {row.signatureStatus === "fully_signed" ? "Fully Signed" : row.signatureStatus === "awaiting_signatures" || !row.signatureStatus ? "Signature pending" : "Partially signed"}</div>
                      </td>
                      <td data-testid="list-payment-status">Payment: {row.status === "payment_pending" ? "Pending" : agreementStatusLabel(row.paymentStatus, text)}</td>
                      <td>{row.verificationStatus || "—"} · {row.activationStatus || "—"}</td>
                      <td className="space-x-2 py-2">
                        <Link className="font-black text-[#6D28D9]" to={`/admin/partner-agreements/${row.id}`}>View</Link>
                        <button type="button" className="font-black text-slate-800" onClick={async () => {
                          const res = await API.get(`/admin/partner-agreements/${row.id}/documents`);
                          setDocuments({ id: row.id, files: res.data?.documents?.files || [] });
                        }}>Documents ({row.documentCount || 0})</button>
                        {row.partnerId ? <Link className="font-black text-slate-800" to={`/admin/partners/${row.partnerId}`}>Dossier</Link> : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        {documents ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-5" data-testid="documents-panel">
            <h2 className="text-lg font-black">Documents ({documents.files.length})</h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold">
              {documents.files.map((file) => (
                <li key={`${file.kind}-${file.filename}`}>
                  {file.kind} · {file.filename} · {file.uploadedAt ? String(file.uploadedAt).slice(0, 16) : ""}
                  {" "}
                  <button type="button" className="font-black text-[#6D28D9]" onClick={async () => {
                    const res = await API.get(`/admin/partner-agreements/${documents.id}/verification/files/${file.kind}`, { responseType: "blob" });
                    const url = URL.createObjectURL(res.data);
                    window.open(url, "_blank", "noopener");
                  }}>Download</button>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-3 text-sm font-black" onClick={() => setDocuments(null)}>Close</button>
          </section>
        ) : null}
      </main>
    </div>
  );
}
