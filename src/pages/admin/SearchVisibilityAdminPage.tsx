import { FormEvent, useEffect, useState } from "react";
import API from "../../api";

type Job = { id: string; domain?: string; status?: string; phase?: string; businessId?: string; error?: string; stats?: { fetched?: number } };

export default function SearchVisibilityAdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [audit, setAudit] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [plan, setPlan] = useState("professional");

  async function reload() {
    const [jobRes, settingsRes, auditRes] = await Promise.all([
      API.get("/search-visibility/admin/jobs"),
      API.get("/search-visibility/admin/settings"),
      API.get("/search-visibility/admin/audit"),
    ]);
    setJobs(jobRes.data.jobs || []);
    setSettings(settingsRes.data.settings);
    setAudit(auditRes.data.audit || []);
  }

  useEffect(() => {
    reload().catch((error) => setMessage(error?.response?.data?.error || error.message));
  }, []);

  async function stop(id: string) {
    await API.post(`/search-visibility/admin/jobs/${id}/cancel`);
    await reload();
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const planByBusiness = { ...(settings?.planByBusiness || {}) };
    if (businessId.trim()) planByBusiness[businessId.trim()] = plan;
    const response = await API.put("/search-visibility/admin/settings", {
      defaultPlan: settings?.defaultPlan || "free",
      quotas: settings?.quotas,
      planByBusiness,
      blockedBusinessIds: settings?.blockedBusinessIds || [],
      retentionDays: settings?.retentionDays || 90,
    });
    setSettings(response.data.settings);
    setMessage(response.data.note || "");
    setBusinessId("");
  }

  return (
    <div dir="rtl" style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>סורק SEO, GEO ו־AEO</h1>
      <p>חיוב ומדידה חיה כבויים. מפתחות לא מוצגים במסך הזה.</p>
      {message ? <p>{message}</p> : null}
      <form onSubmit={save} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input value={businessId} onChange={(event) => setBusinessId(event.target.value)} placeholder="מזהה עסק" aria-label="מזהה עסק" />
        <select value={plan} onChange={(event) => setPlan(event.target.value)} aria-label="חבילה">
          <option value="free">חינם</option>
          <option value="professional">מקצועית</option>
          <option value="monitor">ניטור</option>
        </select>
        <button type="submit">שמירת מכסה</button>
      </form>
      <table>
        <thead>
          <tr><th>אתר</th><th>סטטוס</th><th>עסק</th><th>עמודים</th><th></th></tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.domain}</td>
              <td>{job.status} {job.phase} {job.error}</td>
              <td>{job.businessId}</td>
              <td>{job.stats?.fetched ?? "—"}</td>
              <td><button type="button" onClick={() => stop(job.id)}>עצירה</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>יומן</h2>
      <ul>
        {audit.slice(0, 20).map((row) => <li key={row.id || row._id}>{row.action} · {row.detail}</li>)}
      </ul>
      <p>גרסת כללים נשמרת על כל סריקה. עלות AI נוכחית: 0.</p>
    </div>
  );
}
