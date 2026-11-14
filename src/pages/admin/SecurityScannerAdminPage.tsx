import { FormEvent, useEffect, useState } from "react";
import API from "../../api";
import "../business/dashboardPages/security/securityScanner.css";

type Scan = { id: string; tenantId: string; domain: string; status: string; mode: string; progress?: { phase?: string; checksDone?: number; checksTotal?: number } };

export default function SecurityScannerAdminPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [tenantId, setTenantId] = useState("");
  const [packageId, setPackageId] = useState("basic");
  const [siteId, setSiteId] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await API.get("/security-scanner/admin/scans");
    setScans(response.data.scans || []);
  }

  useEffect(() => {
    load().catch((reason) => setError(reason?.response?.data?.error || "לא ניתן לטעון את הסריקות"));
  }, []);

  async function stop(id: string) {
    await API.post(`/security-scanner/admin/scans/${id}/stop`);
    await load();
  }

  async function grant(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await API.post("/security-scanner/admin/entitlements", { tenantId, packageId, credits: 1 });
      setNotice(response.data.billingActivated ? "הופעל חיוב" : "ניתנה יתרת ניסיון. לא בוצע חיוב.");
    } catch (reason) {
      setError((reason as { response?: { data?: { error?: string } } }).response?.data?.error || "ההקצאה נכשלה");
    }
  }

  async function approve(event: FormEvent) {
    event.preventDefault();
    try {
      await API.post(`/security-scanner/admin/sites/${siteId}/approve`);
      setNotice("האישור המתועד סומן כמאושר.");
    } catch (reason) {
      setError((reason as { response?: { data?: { error?: string } } }).response?.data?.error || "האישור נכשל");
    }
  }

  return (
    <section className="security-scanner" dir="rtl" lang="he">
      <header className="security-scanner__hero">
        <p className="security-scanner__kicker">ניהול Bizuply Security Scanner</p>
        <h1>סריקות אבטחה</h1>
        <p>מסך אדמין. אין כאן חיוב ואין כאן הפעלה של סריקה על אתר לא מאושר.</p>
      </header>
      {error ? <p className="security-scanner__error">{error}</p> : null}
      {notice ? <p>{notice}</p> : null}
      <form className="security-scanner__card" onSubmit={grant}>
        <h2>הקצאת חבילת ניסיון</h2>
        <label>עסק<input value={tenantId} onChange={(event) => setTenantId(event.target.value)} required /></label>
        <label>חבילה
          <select value={packageId} onChange={(event) => setPackageId(event.target.value)}>
            <option value="basic">בסיסי · 149 ש״ח</option>
            <option value="professional">מקצועי · 399 ש״ח</option>
            <option value="monitoring">ניטור · 99 ש״ח לחודש</option>
          </select>
        </label>
        <button type="submit">הקצאה בלי חיוב</button>
      </form>
      <form className="security-scanner__card" onSubmit={approve}>
        <h2>אישור הרשאה מבעל נכס</h2>
        <label>מזהה אתר<input value={siteId} onChange={(event) => setSiteId(event.target.value)} required /></label>
        <button type="submit">אישור התיעוד</button>
      </form>
      <div className="security-scanner__list">
        {scans.map((scan) => (
          <article className="security-scanner__card" key={scan.id}>
            <div className="security-scanner__row">
              <strong>{scan.domain}</strong>
              <span>{scan.status} · {scan.progress?.phase || "—"} · {scan.progress?.checksDone || 0}/{scan.progress?.checksTotal || 0}</span>
            </div>
            <p className="security-scanner__muted">{scan.tenantId}</p>
            {["queued", "running", "leased"].includes(scan.status) ? <button className="security-scanner__danger" type="button" onClick={() => stop(scan.id)}>עצירת סריקה</button> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
