import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../../api";
import dashboardDemoStats from "../../../demo/dashboardDemoStats";
import dashboardDemoClients from "../../../demo/dashboardDemoClients";

type DemoPayload = {
  modules: string[];
  moduleLabels: { key: string; label: string }[];
  expiresAt?: string;
};

export default function AdminCrmGuidedDemo() {
  const { token } = useParams();
  const [data, setData] = useState<DemoPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data: res } = await API.get(`/public/guided-demo/${token}`);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setError("קישור הדמו אינו תקף או שפג תוקפו.");
      }
    }
    if (token) load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const selected = new Set(data?.modules || []);

  return (
    <div className="min-h-screen bg-[#F7F4FF] px-4 py-8" dir="rtl" style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}>
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-xs font-black text-[#7C4DFF]">BizUply · דמו מודרך</p>
        <h1 className="text-3xl font-black text-purple-950">סיור קצר במערכת</h1>
        {error ? <p className="font-bold text-rose-700">{error}</p> : null}
        {data ? (
          <>
            <p className="font-bold text-slate-600">
              זהו דמו חד־פעמי של המודולים שנבחרו עבורכם. הנתונים לדוגמה קיימים במערכת ההדגמה של BizUply.
            </p>
            <div className="flex flex-wrap gap-2">
              {(data.moduleLabels || []).map((mod) => (
                <span key={mod.key} className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#7C4DFF] border border-purple-100">
                  {mod.label}
                </span>
              ))}
            </div>
            {selected.has("dashboard") || selected.has("appointments") ? (
              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <h2 className="font-black">לוח בקרה לדוגמה · {dashboardDemoStats.businessName}</h2>
                <p className="mt-2 text-sm font-bold">צפיות: {dashboardDemoStats.views_count} · תורים: {dashboardDemoStats.appointments_count}</p>
              </section>
            ) : null}
            {selected.has("crm") || selected.has("leads") ? (
              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <h2 className="font-black">CRM לדוגמה</h2>
                <ul className="mt-2 space-y-1 text-sm font-bold">
                  {(dashboardDemoClients as { name?: string; fullName?: string }[]).slice(0, 4).map((client, idx) => (
                    <li key={idx}>{client.name || client.fullName || "לקוח"}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            <Link
              to="/register"
              className="inline-flex min-h-11 items-center rounded-2xl bg-[#7C4DFF] px-5 text-sm font-black text-white"
            >
              לפתיחת חשבון
            </Link>
          </>
        ) : !error ? (
          <p className="font-bold">טוען דמו…</p>
        ) : null}
      </div>
    </div>
  );
}
