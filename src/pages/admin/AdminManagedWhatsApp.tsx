import React, { useCallback, useEffect, useState } from "react";
import { MessageSquare, RefreshCw, Shield } from "lucide-react";

import {
  getAdminManagedWhatsAppStatus,
  listAdminManagedWhatsAppAudit,
  syncAdminManagedWhatsAppTemplates,
  updateAdminManagedWhatsAppSettings,
  type AdminManagedWhatsAppAuditItem,
  type AdminManagedWhatsAppStatus,
  type ManagedWhatsAppAllowlistMode,
} from "../../api/adminManagedWhatsAppApi";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function StatusPill({
  ok,
  labelOk,
  labelBad,
}: {
  ok: boolean;
  labelOk: string;
  labelBad: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        background: ok ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
        color: ok ? "#047857" : "#b91c1c",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: ok ? "#10b981" : "#ef4444",
        }}
      />
      {ok ? labelOk : labelBad}
    </span>
  );
}

export default function AdminManagedWhatsApp() {
  const { user } = useAuth() as { user: { role?: string } | null };
  const [status, setStatus] = useState<AdminManagedWhatsAppStatus | null>(null);
  const [audit, setAudit] = useState<AdminManagedWhatsAppAuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncFlash, setSyncFlash] = useState("");
  const [allowlistText, setAllowlistText] = useState("");

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [st, aud] = await Promise.all([
        getAdminManagedWhatsAppStatus(),
        listAdminManagedWhatsAppAudit(30).catch(() => ({ items: [] })),
      ]);
      setStatus(st);
      setAllowlistText((st.allowlistBusinessIds || []).join("\n"));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.message || "טעינת הסטטוס נכשלה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleManagedMode(next: boolean) {
    if (!isAdmin || saving) return;
    setSaving(true);
    setError("");
    try {
      const data = await updateAdminManagedWhatsAppSettings({
        managedModeEnabled: next,
      });
      setStatus(data);
      setAllowlistText((data.allowlistBusinessIds || []).join("\n"));
    } catch (err: any) {
      setError(err?.message || "שמירת ההגדרה נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function saveAllowlist(mode: ManagedWhatsAppAllowlistMode) {
    if (!isAdmin || saving) return;
    setSaving(true);
    setError("");
    try {
      const ids = allowlistText
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const data = await updateAdminManagedWhatsAppSettings({
        allowlistMode: mode,
        allowlistBusinessIds: mode === "allowlist" ? ids : [],
      });
      setStatus(data);
      setAllowlistText((data.allowlistBusinessIds || []).join("\n"));
    } catch (err: any) {
      setError(err?.message || "שמירת allowlist נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function runSync() {
    if (!isAdmin || syncing) return;
    setSyncing(true);
    setError("");
    setSyncFlash("");
    try {
      const data = await syncAdminManagedWhatsAppTemplates();
      setStatus(data);
      const c = data.sync?.counts || data.templates;
      setSyncFlash(
        `סנכרון הושלם: APPROVED ${c?.APPROVED ?? 0} · PENDING ${c?.PENDING ?? 0} · REJECTED ${c?.REJECTED ?? 0}`
      );
      const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
        items: [],
      }));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.message || "סנכרון תבניות נכשל");
    } finally {
      setSyncing(false);
    }
  }

  if (!isAdmin) {
    return (
      <div dir="rtl">
        <AdminHeader />
        <main style={{ padding: 24 }}>
          <p>אין הרשאה לצפות בעמוד זה.</p>
        </main>
      </div>
    );
  }

  const modeOn = Boolean(status?.managedModeEnabled);
  const wabaOk = Boolean(status?.connection?.wabaConnected);
  const phoneOk = Boolean(status?.connection?.phoneNumberConnected);
  const tokenOk = status?.connection?.accessToken === "configured";

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <AdminHeader />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 48px" }}>
        <header style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <MessageSquare size={22} />
            <h1 style={{ margin: 0, fontSize: 26 }}>WhatsApp Managed Mode</h1>
          </div>
          <p style={{ margin: "8px 0 0", color: "#64748b", maxWidth: 640 }}>
            חיבור WhatsApp מרכזי של Bizuply לעסקים מורשים — עד ש-Meta יאשרו WABA
            נפרד לכל לקוח. ההגדרה נשמרת בשרת בלבד.
          </p>
        </header>

        {error ? (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 10,
              background: "#fef2f2",
              color: "#991b1b",
            }}
          >
            {error}
          </div>
        ) : null}
        {syncFlash ? (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 10,
              background: "#ecfdf5",
              color: "#065f46",
            }}
          >
            {syncFlash}
          </div>
        ) : null}

        {loading || !status ? (
          <p>טוען…</p>
        ) : (
          <>
            <section
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong style={{ fontSize: 16 }}>סטטוס מערכת</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    <StatusPill ok={modeOn} labelOk="פעיל" labelBad="כבוי" />
                    <StatusPill
                      ok={wabaOk}
                      labelOk="WABA מחובר"
                      labelBad="WABA לא מחובר"
                    />
                    <StatusPill
                      ok={phoneOk}
                      labelOk="Phone Number מחובר"
                      labelBad="Phone Number לא מחובר"
                    />
                    <StatusPill
                      ok={tokenOk}
                      labelOk="Access Token: Configured"
                      labelBad="Access Token: Missing"
                    />
                  </div>
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: saving ? "wait" : "pointer",
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={modeOn}
                    disabled={saving}
                    onChange={(e) => void toggleManagedMode(e.target.checked)}
                  />
                  הפעל WhatsApp מנוהל לכל העסקים
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                  marginTop: 18,
                }}
              >
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>מספר תבניות APPROVED</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>
                    {status.templates?.APPROVED ?? 0}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>טלפון (מוסתר)</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {status.connection?.displayPhoneMasked || "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>סנכרון אחרון</div>
                  <div style={{ fontSize: 15 }}>
                    {formatDate(status.connection?.lastTemplatesSyncAt)}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>שגיאת חיבור אחרונה</div>
                  <div style={{ fontSize: 14, color: status.lastError ? "#b91c1c" : "#64748b" }}>
                    {status.lastError || status.connection?.connectionReason || "אין"}
                  </div>
                </div>
              </div>

              <p style={{ marginTop: 16, color: "#475569", fontSize: 14 }}>
                {modeOn
                  ? "כאשר פעיל: עסקים מורשים משתמשים בחיבור המרכזי, בלי לחבר WABA משלהם, ובוחרים רק תבנית מאושרת."
                  : "כאשר כבוי: אין fallback לחיבור המרכזי — נדרש חיבור WhatsApp של העסק."}
              </p>

              <button
                type="button"
                onClick={() => void runSync()}
                disabled={syncing}
                style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: syncing ? "wait" : "pointer",
                }}
              >
                <RefreshCw size={16} />
                {syncing ? "מסנכרן…" : "סנכרון תבניות Meta"}
              </button>
            </section>

            <section
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Shield size={18} />
                <strong>עסקים מורשים</strong>
              </div>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                All entitled משתמש ב-entitlement / allowlist הקיימים. Allowlist
                מגביל לרשימת מזהי עסקים בלבד.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="allowMode"
                    checked={status.allowlistMode === "all_entitled"}
                    onChange={() => void saveAllowlist("all_entitled")}
                    disabled={saving}
                  />
                  All entitled businesses
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="allowMode"
                    checked={status.allowlistMode === "allowlist"}
                    onChange={() => void saveAllowlist("allowlist")}
                    disabled={saving}
                  />
                  Allowlist
                </label>
              </div>
              {status.allowlistMode === "allowlist" ? (
                <>
                  <textarea
                    value={allowlistText}
                    onChange={(e) => setAllowlistText(e.target.value)}
                    rows={5}
                    placeholder="businessId לכל שורה"
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      padding: 10,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => void saveAllowlist("allowlist")}
                    disabled={saving}
                    style={{
                      marginTop: 10,
                      border: "1px solid #cbd5e1",
                      borderRadius: 10,
                      padding: "8px 12px",
                      background: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    שמור Allowlist
                  </button>
                </>
              ) : null}
            </section>

            <section
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
              }}
            >
              <strong>Audit log</strong>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                {audit.length === 0 ? (
                  <li style={{ color: "#94a3b8" }}>אין פעולות עדיין</li>
                ) : (
                  audit.map((row) => (
                    <li
                      key={row.id}
                      style={{
                        padding: "10px 0",
                        borderBottom: "1px solid #f1f5f9",
                        fontSize: 13,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{row.action}</div>
                      <div style={{ color: "#64748b" }}>
                        {row.actorEmail || row.actorUserId || "—"} ·{" "}
                        {formatDate(row.createdAt)}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}