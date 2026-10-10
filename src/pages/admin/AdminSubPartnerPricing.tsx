import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
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
      .catch(() => setError("לא ניתן לטעון את תמחור תת-הפרטנר."));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await API.put("/admin/partner-program/sub-partner-pricing", { tiers });
      setTiers(res.data.tiers || []);
      setMessage("התמחור נשמר. חבילות שכבר נרכשו שומרות על המחיר שנקבע ברכישה.");
    } catch (err: unknown) {
      const row = err as { response?: { data?: { error?: string } } };
      setError(row.response?.data?.error || "לא ניתן לשמור את התמחור.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <AdminHeader />
      <main className="mx-auto max-w-[800px] px-4 py-6">
        <AdminPageHeader
          title="תמחור תת-פרטנר"
          description="המחירים האלה מיועדים למשתמשי תת-פרטנר נוספים. משתמש הפרטנר הראשי כלול ואינו נספר."
        />
        <form onSubmit={save} className="mt-5 space-y-3 rounded-3xl border bg-white p-5">
          {tiers.map((tier, index) => (
            <label key={tier.tierKey} className="block text-sm font-bold text-slate-800">
              {tier.tierKey} משתמשים נוספים {tier.custom ? "(מותאם)" : "דולר לשנה"}
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
          <button className="biz-btn" type="submit">שמירת תמחור</button>
          {message ? <p className="text-sm font-bold text-emerald-800">{message}</p> : null}
          {error ? <p className="text-sm font-bold text-rose-800">{error}</p> : null}
        </form>
      </main>
    </div>
  );
}
