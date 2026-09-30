import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminsHeader";
import API from "../../api";

type Tier = {
  tierKey: string;
  minUsers: number;
  maxUsers: number | null;
  annualPriceUsd: number | null;
  custom: boolean;
};

export default function AdminSubPartnerPricing() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/partner-program/sub-partner-pricing")
      .then((res) => setTiers(res.data.tiers || []))
      .catch(() => setError("Could not load Sub-Partner pricing."));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await API.put("/admin/partner-program/sub-partner-pricing", { tiers });
      setTiers(res.data.tiers || []);
      setMessage("Pricing saved. Purchased packages keep the price that was snapshotted.");
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || "Could not save pricing.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <AdminHeader />
      <main className="mx-auto max-w-[800px] px-4 py-6">
        <Link to="/admin/settings" className="text-sm font-black text-[#6D28D9]">Settings</Link>
        <h1 className="mt-3 text-3xl font-black">Sub-Partner Pricing</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          These prices are for additional Sub-Partner users. The Primary Partner user is included and is not counted.
        </p>
        <form onSubmit={save} className="mt-5 space-y-3 rounded-3xl border bg-white p-5">
          {tiers.map((tier, index) => (
            <label key={tier.tierKey} className="block text-sm font-bold text-slate-800">
              {tier.tierKey} additional users {tier.custom ? "(custom)" : "USD / year"}
              <input
                className="mt-1 w-full rounded-xl border px-3 py-2"
                value={tier.annualPriceUsd ?? ""}
                disabled={tier.custom}
                placeholder={tier.custom ? "Custom pricing" : ""}
                onChange={(e) => {
                  const next = [...tiers];
                  next[index] = { ...tier, annualPriceUsd: e.target.value === "" ? null : Number(e.target.value) };
                  setTiers(next);
                }}
              />
            </label>
          ))}
          <button className="rounded-xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white" type="submit">Save pricing</button>
          {message ? <p className="text-sm font-bold text-emerald-800">{message}</p> : null}
          {error ? <p className="text-sm font-bold text-rose-800">{error}</p> : null}
        </form>
      </main>
    </div>
  );
}
