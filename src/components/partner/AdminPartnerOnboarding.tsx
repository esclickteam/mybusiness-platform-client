import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAdminPartnerOnboarding,
  fetchAdminPartnerOnboardingList,
  type AdminOnboardingRow,
  type PartnerOnboardingSnapshot,
} from "../../lib/partnerCenterApi";

function statusLabel(status: string) {
  if (status === "sales_ready") return "Sales Ready";
  if (status === "in_progress") return "In progress";
  return "Not ready";
}

function when(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

export default function AdminPartnerOnboarding() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<AdminOnboardingRow[]>([]);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState("");
  const [detail, setDetail] = useState<(PartnerOnboardingSnapshot & { partner?: { name: string } }) | null>(null);

  async function load(search = q) {
    setError("");
    try {
      const data = await fetchAdminPartnerOnboardingList(search);
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Could not load onboarding");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openPartner(partnerId: string) {
    setOpenId(partnerId);
    const data = await fetchAdminPartnerOnboarding(partnerId);
    setDetail(data);
  }

  return (
    <section className="mb-8 rounded-[20px] border border-slate-100 bg-white p-5" data-testid="admin-onboarding">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C3AED]">Partner onboarding</p>
          <h2 className="text-xl font-black text-slate-900">Where each partner stands</h2>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name, slug, login email, contact email, legal name"
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-bold"
          />
          <button type="submit" className="h-10 rounded-xl bg-slate-900 px-4 text-xs font-black text-white">
            Search
          </button>
        </form>
      </div>
      {error ? <p className="mb-3 text-sm font-bold text-rose-600">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-[11px] font-black uppercase text-slate-400">
            <tr>
              <th className="pb-2 pe-3">Partner</th>
              <th className="pb-2 pe-3">Started</th>
              <th className="pb-2 pe-3">Progress</th>
              <th className="pb-2 pe-3">Modules</th>
              <th className="pb-2 pe-3">Last activity</th>
              <th className="pb-2 pe-3">Sales Ready</th>
              <th className="pb-2 pe-3">Training completed</th>
              <th className="pb-2">Stuck</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.partnerId} className="border-t border-slate-100">
                <td className="py-3 pe-3 font-black">
                  <button type="button" className="text-[#6D28D9]" onClick={() => openPartner(row.partnerId)}>
                    {row.name}
                  </button>
                  <div className="text-[11px] font-bold text-slate-400">{row.slug}</div>
                </td>
                <td className="pe-3 font-bold">{row.started ? "Yes" : "No"}</td>
                <td className="pe-3 font-black">{row.percent}%</td>
                <td className="pe-3 font-bold">
                  {row.modulesCompleted}/{row.modulesTotal}
                </td>
                <td className="pe-3 font-bold">{when(row.lastActivityAt)}</td>
                <td className="pe-3 font-black">{statusLabel(row.salesReadyStatus)}</td>
                <td className="pe-3 font-bold">{when(row.trainingCompletedAt)}</td>
                <td className="font-bold">
                  {row.stuckModule ? `Module ${row.stuckModule.n} – ${row.stuckModule.title}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && openId ? (
        <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-black">{detail.partner?.name || "Partner"} — current step</h3>
            <Link className="text-xs font-black text-[#6D28D9]" to={`/admin/partners/${openId}`}>
              Open partner file
            </Link>
          </div>
          <p className="text-sm font-black text-slate-800">{detail.nextAction?.title}</p>
          <p className="mt-1 text-sm font-bold text-slate-600">{detail.nextAction?.detail}</p>
          <p className="mt-2 text-xs font-bold text-slate-500">
            {detail.modulesCompleted} of {detail.modulesTotal} modules · {detail.percent}% · {statusLabel(detail.salesReadyStatus)}
          </p>
          {detail.stuckModule ? (
            <p className="mt-2 text-sm font-bold text-amber-800">
              Stuck on Module {detail.stuckModule.n} – {detail.stuckModule.title}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
