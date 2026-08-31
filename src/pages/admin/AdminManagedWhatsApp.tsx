import React, { useCallback, useEffect, useState } from "react";
import { Link2, MessageSquare, RefreshCw, Shield } from "lucide-react";

import {
  getAdminManagedWhatsAppHealth,
  getAdminManagedWhatsAppStatus,
  listAdminManagedWhatsAppAudit,
  saveAndVerifyAdminManagedWhatsAppConnection,
  createAdminManagedWhatsAppConnection,
  deleteAdminManagedWhatsAppConnection,
  registerAdminManagedWhatsAppPhone,
  syncAdminManagedWhatsAppTemplates,
  updateAdminManagedWhatsAppSettings,
  type AdminManagedWhatsAppAuditItem,
  type AdminManagedWhatsAppHealth,
  type AdminManagedWhatsAppStatus,
  type ManagedWhatsAppAllowlistMode,
  type ManagedWhatsAppConnectionSummary,
} from "../../api/adminManagedWhatsAppApi";
import {
  getAdminWhatsAppBillingMargin,
  type WhatsAppBillingMarginReport,
} from "../../api/whatsappBillingApi";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "./AdminsHeader";

const DEFAULT_CONNECTION_ID = "IL_MANAGED";

function connectionTabLabel(conn: ManagedWhatsAppConnectionSummary) {
  const flag =
    conn.flag ||
    (conn.country === "IL" ? "🇮🇱" : conn.country === "US" ? "🇺🇸" : "");
  return `${flag ? `${flag} ` : ""}${conn.label || conn.connectionId}`;
}

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

function healthHeadline(status?: string) {
  switch (status) {
    case "healthy":
      return { emoji: "🟢", label: "מחובר ותקין", color: "#047857", bg: "#ecfdf5" };
    case "degraded":
      return { emoji: "🟠", label: "מחובר אך קיימת בעיה", color: "#c2410c", bg: "#fff7ed" };
    case "failed":
      return { emoji: "🔴", label: "החיבור אינו תקין", color: "#b91c1c", bg: "#fef2f2" };
    default:
      return { emoji: "⚪", label: "לא הוגדר", color: "#475569", bg: "#f8fafc" };
  }
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

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  padding: "10px 12px",
  fontSize: 14,
  boxSizing: "border-box",
};

function okLabel(ok: boolean, good: string, bad: string) {
  return ok ? good : bad;
}

function formatTokenExpiration(health?: AdminManagedWhatsAppHealth) {
  if (health?.tokenExpirationStatus === "never" || health?.tokenExpiration === "never") {
    return "Never expires";
  }
  if (health?.tokenExpirationStatus === "dated" && health.tokenExpiration) {
    return formatDate(health.tokenExpiration);
  }
  return "לא ניתן להוכיח";
}

function formatTokenValidity(health?: AdminManagedWhatsAppHealth) {
  if (health?.tokenValidNow === true) return "Valid";
  if (health?.tokenValidNow === false) return "Invalid";
  return "לא ידוע";
}

function ManagedConnectionHealthPanel({
  health,
}: {
  health?: AdminManagedWhatsAppHealth;
}) {
  const headline = healthHeadline(health?.status);
  return (
    <div
      style={{
        margin: "12px 0 16px",
        padding: 14,
        borderRadius: 12,
        background: headline.bg,
        border: "1px solid rgba(15,23,42,0.06)",
      }}
    >
      <strong style={{ color: headline.color, fontSize: 15 }}>
        מצב חיבור: {headline.emoji} {headline.label}
      </strong>
      <div
        style={{
          marginTop: 10,
          display: "grid",
          gap: 4,
          fontSize: 13,
          color: "#334155",
        }}
      >
        <div>
          Token:{" "}
          {okLabel(Boolean(health?.tokenConfigured), "מוגדר", "לא מוגדר")}
        </div>
        <div>
          Token type: {health?.tokenTypeLabel || health?.tokenType || "לא ידוע"}
        </div>
        <div>Token validity: {formatTokenValidity(health)}</div>
        <div>Token expiration: {formatTokenExpiration(health)}</div>
        {health?.tokenExpirationStatus === "unknown" && health?.tokenExpirationReason ? (
          <div style={{ color: "#9a3412" }}>
            הוכחת תפוגה: {health.tokenExpirationReason}
          </div>
        ) : null}
        {health?.dataAccessExpiresAt && health.dataAccessExpiresAt !== "never" ? (
          <div>Data access expires: {formatDate(health.dataAccessExpiresAt)}</div>
        ) : null}
        <div>
          הרשאות:{" "}
          {health?.requiredPermissionsOk === true
            ? "whatsapp_business_messaging + whatsapp_business_management"
            : health?.requiredPermissionsOk === false
              ? `חסר: ${(health.missingPermissions || []).join(", ") || "לא ידוע"}`
              : "לא נבדק"}
        </div>
        <div>
          WABA assigned:{" "}
          {health?.wabaAssignmentStatus === "pass" ||
          health?.wabaAssignedToSystemUser === true
            ? "תקין"
            : health?.wabaAssignmentStatus === "not_applicable"
              ? "לא רלוונטי (לא BSP)"
              : health?.wabaAssignmentStatus === "fail" ||
                  health?.wabaAssignedToSystemUser === false
                ? "לא משויך"
                : "לא ניתן להוכיח"}
        </div>
        {health?.wabaAssignmentReason ? (
          <div style={{ color: "#64748b", fontSize: 12 }}>
            {health.wabaAssignmentReason}
          </div>
        ) : null}
        <div>
          WABA: {okLabel(Boolean(health?.wabaAccessible), "תקין", "שגיאה")}
        </div>
        <div>
          מספר WhatsApp:{" "}
          {okLabel(Boolean(health?.phoneNumberAccessible), "תקין", "שגיאה")}
        </div>
        <div>בדיקה אחרונה: {formatDate(health?.lastCheckedAt)}</div>
        <div>
          בדיקה מוצלחת אחרונה: {formatDate(health?.lastSuccessfulCheckAt)}
        </div>
        <div>
          שליחה מוצלחת אחרונה: {formatDate(health?.lastSuccessfulSendAt)}
        </div>
        {health?.errorMessage ? (
          <div style={{ color: "#b91c1c", marginTop: 4 }}>
            שגיאה אחרונה: {health.errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminManagedWhatsApp() {
  const { user } = useAuth() as { user: { role?: string } | null };
  const [status, setStatus] = useState<AdminManagedWhatsAppStatus | null>(null);
  const [audit, setAudit] = useState<AdminManagedWhatsAppAuditItem[]>([]);
  const [marginReport, setMarginReport] =
    useState<WhatsAppBillingMarginReport | null>(null);
  const [marginLoading, setMarginLoading] = useState(false);
  const [marginError, setMarginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncFlash, setSyncFlash] = useState("");
  const [allowlistText, setAllowlistText] = useState("");
  const [wabaId, setWabaId] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [registerPin, setRegisterPin] = useState("");
  const [registering, setRegistering] = useState(false);
  const [activeConnectionId, setActiveConnectionId] =
    useState(DEFAULT_CONNECTION_ID);
  const [showAddForm, setShowAddForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState("");
  const [newCountry, setNewCountry] = useState("US");
  const [newPhone, setNewPhone] = useState("");
  const [newWabaId, setNewWabaId] = useState("");
  const [newPhoneNumberId, setNewPhoneNumberId] = useState("");
  const [newAccessToken, setNewAccessToken] = useState("");
  const [newEnabled, setNewEnabled] = useState(true);
  const [connectionEnabled, setConnectionEnabled] = useState(true);

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const applyStatus = useCallback((st: AdminManagedWhatsAppStatus) => {
    setStatus(st);
    setAllowlistText((st.allowlistBusinessIds || []).join("\n"));
    setWabaId(st.configForm?.wabaId || "");
    setPhoneNumberId(st.configForm?.phoneNumberId || "");
    setDisplayPhoneNumber(st.configForm?.displayPhoneNumber || "");
    setAccessToken("");
    const active =
      st.activeManagedConnectionId ||
      st.connection?.managedConnectionId ||
      st.defaultManagedConnectionId ||
      DEFAULT_CONNECTION_ID;
    setActiveConnectionId(active);
    setConnectionEnabled(
      st.connection?.enabled !== false &&
        st.connectionMeta?.enabled !== false
    );
  }, []);

  const load = useCallback(
    async (connectionId?: string) => {
      setLoading(true);
      setError("");
      const target = connectionId || activeConnectionId || DEFAULT_CONNECTION_ID;
      try {
        const [st, aud, liveHealth] = await Promise.all([
          getAdminManagedWhatsAppStatus(target),
          listAdminManagedWhatsAppAudit(30).catch(() => ({ items: [] })),
          getAdminManagedWhatsAppHealth(target).catch(() => null),
        ]);
        if (liveHealth) {
          const health = liveHealth.health || liveHealth;
          applyStatus({ ...st, health });
        } else {
          applyStatus(st);
        }
        setAudit(aud.items || []);
      } catch (err: any) {
        setError(err?.message || "טעינת הסטטוס נכשלה");
      } finally {
        setLoading(false);
      }
    },
    [applyStatus, activeConnectionId]
  );

  useEffect(() => {
    void load(DEFAULT_CONNECTION_ID);
    // initial load only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMargin = useCallback(async () => {
    setMarginLoading(true);
    setMarginError("");
    try {
      const report = await getAdminWhatsAppBillingMargin();
      setMarginReport(report);
    } catch (err: any) {
      setMarginError(err?.message || "טעינת דוח המרווח נכשלה");
    } finally {
      setMarginLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMargin();
  }, [loadMargin]);

  async function selectConnection(connectionId: string) {
    if (connectionId === activeConnectionId && status) return;
    setActiveConnectionId(connectionId);
    await load(connectionId);
  }

  async function toggleManagedMode(next: boolean) {
    if (!isAdmin || saving) return;
    setSaving(true);
    setError("");
    try {
      const data = await updateAdminManagedWhatsAppSettings({
        managedModeEnabled: next,
        managedConnectionId: activeConnectionId,
      });
      applyStatus(data);
    } catch (err: any) {
      setError(err?.message || "שמירת ההגדרה נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function setSendFrom(connectionId: string) {
    if (!isAdmin || saving) return;
    setSaving(true);
    setError("");
    try {
      const data = await updateAdminManagedWhatsAppSettings({
        defaultManagedConnectionId: connectionId,
        managedConnectionId: activeConnectionId,
      });
      applyStatus(data);
      setSyncFlash(`Send from: ${connectionId}`);
    } catch (err: any) {
      setError(err?.message || "עדכון חיבור השליחה נכשל");
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
        managedConnectionId: activeConnectionId,
      });
      applyStatus(data);
    } catch (err: any) {
      setError(err?.message || "שמירת allowlist נכשלה");
    } finally {
      setSaving(false);
    }
  }

  async function saveAndVerifyConnection() {
    if (!isAdmin || verifying) return;
    setVerifying(true);
    setError("");
    setSyncFlash("");
    try {
      const data = await saveAndVerifyAdminManagedWhatsAppConnection({
        managedConnectionId: activeConnectionId,
        wabaId: wabaId.trim(),
        phoneNumberId: phoneNumberId.trim(),
        displayPhoneNumber: displayPhoneNumber.trim(),
        accessToken: accessToken.trim() || undefined,
        enabled: connectionEnabled,
      });
      applyStatus(data);
      const liveOk = data.liveTest?.ok ?? data.health?.status === "healthy";
      const message =
        data.liveTest?.message ||
        (liveOk
          ? "החיבור ל-WhatsApp נבדק בהצלחה והטוקן תקין."
          : "הטוקן נשמר, אך Meta דחתה את החיבור. בדוק את הרשאות ה-System User.");
      if (liveOk) setSyncFlash(message);
      else setError(message);
      const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
        items: [],
      }));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.message || "שמירה ובדיקת חיבור נכשלו");
    } finally {
      setVerifying(false);
    }
  }

  async function registerPhone() {
    if (!isAdmin || registering) return;
    const pin = registerPin.replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(pin)) {
      setError("הזינו PIN דו-שלבי בן 6 ספרות");
      return;
    }
    setRegistering(true);
    setError("");
    setSyncFlash("");
    try {
      const data = await registerAdminManagedWhatsAppPhone(
        pin,
        activeConnectionId
      );
      applyStatus(data);
      setRegisterPin("");
      setSyncFlash(
        data.registration?.phoneRegistered || data.registration?.sendReady
          ? "המספר נרשם מול Meta — אפשר לשלוח הודעות"
          : "הרישום נשלח, אך המספר עדיין לא מסומן כמוכן לשליחה"
      );
      const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
        items: [],
      }));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "רישום המספר נכשל");
    } finally {
      setRegistering(false);
    }
  }

  async function runSync() {
    if (!isAdmin || syncing) return;
    setSyncing(true);
    setError("");
    setSyncFlash("");
    try {
      const data = await syncAdminManagedWhatsAppTemplates(activeConnectionId);
      applyStatus(data);
      const c = data.sync?.counts || data.templates;
      setSyncFlash(
        `סנכרון הושלם (${activeConnectionId}): APPROVED ${c?.APPROVED ?? 0} · PENDING ${c?.PENDING ?? 0} · REJECTED ${c?.REJECTED ?? 0}`
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

  async function createConnection() {
    if (!isAdmin || creating) return;
    setCreating(true);
    setError("");
    setSyncFlash("");
    try {
      const data = await createAdminManagedWhatsAppConnection({
        connectionName: newConnectionName.trim() || undefined,
        country: newCountry,
        label: newConnectionName.trim() || undefined,
        phoneNumber: newPhone.trim() || undefined,
        wabaId: newWabaId.trim() || undefined,
        phoneNumberId: newPhoneNumberId.trim() || undefined,
        accessToken: newAccessToken.trim() || undefined,
        enabled: newEnabled,
      });
      applyStatus(data);
      setShowAddForm(false);
      setNewConnectionName("");
      setNewPhone("");
      setNewWabaId("");
      setNewPhoneNumberId("");
      setNewAccessToken("");
      setNewEnabled(true);
      setSyncFlash(
        `נוסף חיבור Managed: ${data.activeManagedConnectionId || data.connectionMeta?.connectionId || ""}`
      );
      const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
        items: [],
      }));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "יצירת חיבור נכשלה");
    } finally {
      setCreating(false);
    }
  }

  async function removeConnection(connectionId: string) {
    if (!isAdmin || connectionId === DEFAULT_CONNECTION_ID) return;
    if (
      !window.confirm(
        `למחוק את החיבור ${connectionId}? החיבור הישראלי לא ייפגע.`
      )
    ) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = await deleteAdminManagedWhatsAppConnection(connectionId);
      applyStatus(data);
      setSyncFlash(`החיבור ${connectionId} הוסר`);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "מחיקה נכשלה");
    } finally {
      setSaving(false);
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
  const connectionReady = Boolean(status?.connection?.connectionReady);
  const tokenConfigured = Boolean(status?.configForm?.accessTokenConfigured);
  const sendRegistered = Boolean(
    status?.registration?.phoneRegistered || status?.registration?.sendReady
  );
  const needsRegistration = connectionReady && !sendRegistered;

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
            חיבורי WhatsApp מרכזיים של Bizuply (ישראל / USA) לעסקים מורשים.
            לכל חיבור הגדרות, סטטוס ותבניות נפרדים. ההגדרה וה-token נשמרים
            בשרת בלבד (מוצפנים) — Admin only.
          </p>
        </header>

        {status ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {(status.connections || []).map((conn) => {
              const active = conn.connectionId === activeConnectionId;
              return (
                <button
                  key={conn.connectionId}
                  type="button"
                  onClick={() => void selectConnection(conn.connectionId)}
                  style={{
                    border: active ? "2px solid #0f172a" : "1px solid #e2e8f0",
                    background: active ? "#0f172a" : "#fff",
                    color: active ? "#fff" : "#0f172a",
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {connectionTabLabel(conn)}
                  {!conn.enabled ? " (כבוי)" : ""}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              style={{
                border: "1px dashed #94a3b8",
                background: "#fff",
                color: "#0f172a",
                borderRadius: 999,
                padding: "8px 14px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              + Add Managed WhatsApp Connection
            </button>
          </div>
        ) : null}

        {showAddForm ? (
          <section
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 20,
              boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
              marginBottom: 16,
            }}
          >
            <strong>חיבור Managed חדש</strong>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              לא דורס את החיבור הישראלי. מומלץ להתחיל עם USA / US_MANAGED.
            </p>
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  Connection name
                </span>
                <input
                  style={fieldStyle}
                  value={newConnectionName}
                  onChange={(e) => setNewConnectionName(e.target.value)}
                  placeholder="USA"
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Country</span>
                <select
                  style={fieldStyle}
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
                >
                  <option value="US">🇺🇸 USA</option>
                  <option value="IL">🇮🇱 Israel</option>
                  <option value="GB">🇬🇧 UK</option>
                  <option value="EU">🇪🇺 EU</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  Phone number
                </span>
                <input
                  style={fieldStyle}
                  dir="ltr"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1..."
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>WABA ID</span>
                <input
                  style={fieldStyle}
                  dir="ltr"
                  value={newWabaId}
                  onChange={(e) => setNewWabaId(e.target.value)}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  Phone Number ID
                </span>
                <input
                  style={fieldStyle}
                  dir="ltr"
                  value={newPhoneNumberId}
                  onChange={(e) => setNewPhoneNumberId(e.target.value)}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  Access Token
                </span>
                <input
                  style={fieldStyle}
                  dir="ltr"
                  type="password"
                  value={newAccessToken}
                  onChange={(e) => setNewAccessToken(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={newEnabled}
                  onChange={(e) => setNewEnabled(e.target.checked)}
                />
                Active
              </label>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                onClick={() => void createConnection()}
                disabled={creating}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: creating ? "wait" : "pointer",
                }}
              >
                {creating ? "יוצר…" : "צור חיבור"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ביטול
              </button>
            </div>
          </section>
        ) : null}

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
                  <strong style={{ fontSize: 16 }}>
                    סטטוס מערכת · {activeConnectionId}
                  </strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <StatusPill ok={modeOn} labelOk="פעיל" labelBad="כבוי" />
                    <StatusPill
                      ok={wabaOk && connectionReady}
                      labelOk="WABA מחובר"
                      labelBad="WABA לא מחובר"
                    />
                    <StatusPill
                      ok={phoneOk && connectionReady}
                      labelOk="Phone Number מחובר"
                      labelBad="Phone Number לא מחובר"
                    />
                    <StatusPill
                      ok={tokenOk}
                      labelOk="Access Token: Configured"
                      labelBad="Access Token: Missing"
                    />
                    <StatusPill
                      ok={connectionReady}
                      labelOk="Connection: READY"
                      labelBad="Connection: NOT READY"
                    />
                    <StatusPill
                      ok={sendRegistered}
                      labelOk="רישום לשליחה: רשום"
                      labelBad="רישום לשליחה: נדרש PIN"
                    />
                  </div>
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    סטטוסים אלה משקפים רק את החיבור המרכזי של Bizuply — לא חיבורי
                    עסקים פרטיים.
                  </p>
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
                  <div style={{ color: "#64748b", fontSize: 12 }}>
                    תבניות APPROVED (Meta)
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>
                    {connectionReady ? status.templates?.APPROVED ?? 0 : 0}
                  </div>
                  {!connectionReady ? (
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                      יוצג רק אחרי חיבור READY + סנכרון
                    </div>
                  ) : null}
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>PENDING</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {connectionReady ? status.templates?.PENDING ?? 0 : 0}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>REJECTED</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {connectionReady ? status.templates?.REJECTED ?? 0 : 0}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>רישום לשליחה</div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color:
                        status.registration?.sendReady ||
                        status.registration?.phoneRegistered
                          ? "#047857"
                          : "#b91c1c",
                    }}
                  >
                    {status.registration?.sendReady ||
                    status.registration?.phoneRegistered
                      ? "רשום"
                      : "נדרש PIN"}
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
                  <div style={{ color: "#64748b", fontSize: 12 }}>
                    שגיאת חיבור אחרונה
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: status.lastError ? "#b91c1c" : "#64748b",
                    }}
                  >
                    {sendRegistered
                      ? status.lastError ||
                        status.connection?.connectionReason ||
                        "אין"
                      : status.lastError ||
                        status.registration?.lastError ||
                        status.connection?.connectionReason ||
                        "אין"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 12,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <strong style={{ fontSize: 14 }}>חיבורי עסקים (נפרד מהפלטפורמה)</strong>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                    marginTop: 10,
                  }}
                >
                  <div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      Managed connection
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {connectionReady ? "READY" : "NOT READY"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      עסקים עם WhatsApp פרטי מחובר
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {status.businessConnections?.privateConnected ?? 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      עסקים מנותקים (פרטי)
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {status.businessConnections?.privateDisconnected ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 12,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong style={{ fontSize: 14 }}>Send from</strong>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
                    ברירת המחדל לשליחות Managed בכל המערכת (כרגע Israel כדי למנוע
                    רגרסיה). בהמשך ניתן לשייך חיבור לכל עסק/אוטומציה.
                  </p>
                </div>
                <select
                  style={{ ...fieldStyle, maxWidth: 260 }}
                  value={
                    status.defaultManagedConnectionId || DEFAULT_CONNECTION_ID
                  }
                  disabled={saving}
                  onChange={(e) => void setSendFrom(e.target.value)}
                >
                  {(status.connections || []).map((conn) => (
                    <option key={conn.connectionId} value={conn.connectionId}>
                      {connectionTabLabel(conn)}
                    </option>
                  ))}
                </select>
              </div>

              <p style={{ marginTop: 16, color: "#475569", fontSize: 14 }}>
                {modeOn
                  ? "כאשר פעיל: עסקים מורשים משתמשים בחיבור המרכזי, בלי לחבר WABA משלהם, ובוחרים רק תבנית מאושרת."
                  : "כאשר כבוי: אין fallback לחיבור המרכזי — נדרש חיבור WhatsApp של העסק."}
              </p>

              <button
                type="button"
                onClick={() => void runSync()}
                disabled={syncing || !connectionReady}
                title={
                  connectionReady
                    ? undefined
                    : "יש לשמור ולבדוק חיבור לפני סנכרון תבניות"
                }
                style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: connectionReady ? "#0f172a" : "#94a3b8",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: syncing || !connectionReady ? "not-allowed" : "pointer",
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
                <Link2 size={18} />
                <strong>
                  חיבור WhatsApp מרכזי ·{" "}
                  {status.connectionMeta?.label || activeConnectionId}
                </strong>
              </div>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                הגדרה ידנית של WABA הפלטפורמה לחיבור זה בלבד (ללא OAuth). ה-Access
                Token נשמר מוצפן בשרת ולא מוחזר ללקוח. תבניות מסונכרנות שייכות רק
                ל־WABA של החיבור הפעיל.
              </p>
              <label
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                <input
                  type="checkbox"
                  checked={connectionEnabled}
                  onChange={(e) => setConnectionEnabled(e.target.checked)}
                />
                Active / Enabled
              </label>
              {activeConnectionId !== DEFAULT_CONNECTION_ID ? (
                <button
                  type="button"
                  onClick={() => void removeConnection(activeConnectionId)}
                  disabled={saving}
                  style={{
                    marginBottom: 12,
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                    color: "#b91c1c",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  מחק חיבור זה
                </button>
              ) : null}
              <ManagedConnectionHealthPanel health={status.health} />
              {!status.connection?.managedBusinessIdConfigured ? (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: "#fff7ed",
                    color: "#9a3412",
                    marginBottom: 12,
                    fontSize: 14,
                  }}
                >
                  חסר{" "}
                  <code>BIZUPLY_MANAGED_WHATSAPP_BUSINESS_ID</code> בשרת — לא
                  ניתן לשמור חיבור בלי מזהה עסק מרכזי.
                </div>
              ) : null}

              <div
                style={{
                  display: "grid",
                  gap: 14,
                  gridTemplateColumns: "1fr",
                }}
              >
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>WABA ID</span>
                  <input
                    style={fieldStyle}
                    dir="ltr"
                    value={wabaId}
                    onChange={(e) => setWabaId(e.target.value)}
                    placeholder="WhatsApp Business Account ID"
                    autoComplete="off"
                  />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    WhatsApp Phone Number ID
                  </span>
                  <input
                    style={fieldStyle}
                    dir="ltr"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    placeholder="Phone Number ID"
                    autoComplete="off"
                  />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    Display Phone Number / מספר לתצוגה
                  </span>
                  <input
                    style={fieldStyle}
                    dir="ltr"
                    value={displayPhoneNumber}
                    onChange={(e) => setDisplayPhoneNumber(e.target.value)}
                    placeholder="+9725..."
                    autoComplete="off"
                  />
                </label>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>
                    Meta Access Token
                  </span>
                  <input
                    style={fieldStyle}
                    dir="ltr"
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder={
                      tokenConfigured
                        ? "Configured — הזינו token חדש רק לעדכון"
                        : "הדביקו Access Token"
                    }
                    autoComplete="new-password"
                  />
                  <span style={{ color: "#64748b", fontSize: 12 }}>
                    סטטוס שמור:{" "}
                    {tokenConfigured ? "Configured" : "Not configured"}
                    {tokenConfigured
                      ? " (לא מוצג מלא; השאירו ריק כדי לשמור את הקיים)"
                      : ""}
                  </span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => void saveAndVerifyConnection()}
                disabled={
                  verifying || !status.connection?.managedBusinessIdConfigured
                }
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#0369a1",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: verifying ? "wait" : "pointer",
                }}
              >
                <Link2 size={16} />
                {verifying ? "מאמת מול Meta…" : "שמור ובדוק חיבור"}
              </button>

              {sendRegistered ? (
                <div
                  style={{
                    marginTop: 18,
                    padding: 14,
                    borderRadius: 12,
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    color: "#047857",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  רישום לשליחה: רשום
                </div>
              ) : needsRegistration ? (
                <div
                style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 12,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                }}
              >
                <strong style={{ fontSize: 14 }}>רישום מספר לשליחה (PIN)</strong>
                <p style={{ color: "#9a3412", fontSize: 13, margin: "8px 0 0" }}>
                  חיבור WABA יכול להיות READY ועדיין חסום לשליחה. Meta דורשת
                  רישום חד-פעמי עם PIN דו-שלבי של 6 ספרות של המספר{" "}
                  {status.configForm?.displayPhoneNumber ||
                    status.connection?.displayPhoneMasked ||
                    ""}
                  . זה לא קוד SMS — זה ה-PIN שהוגדר ב-Meta Business Manager למספר.
                </p>
                {status.registration?.lastError ? (
                  <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 8 }}>
                    {status.registration.lastError}
                  </p>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    alignItems: "end",
                    marginTop: 12,
                  }}
                >
                  <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                      PIN דו-שלבי
                    </span>
                    <input
                      style={{ ...fieldStyle, maxWidth: 180, letterSpacing: "0.35em" }}
                      dir="ltr"
                      type="password"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={registerPin}
                      onChange={(e) =>
                        setRegisterPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="••••••"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => void registerPhone()}
                    disabled={
                      registering ||
                      registerPin.replace(/\D/g, "").length !== 6 ||
                      !connectionReady
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 14px",
                      background: "#7c2d12",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: registering ? "wait" : "pointer",
                    }}
                  >
                    {registering ? "רושם מול Meta…" : "רישום מספר לשליחה"}
                  </button>
                </div>
              </div>
              ) : null}
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
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <strong>WhatsApp usage billing — margin</strong>
                <button
                  type="button"
                  onClick={() => void loadMargin()}
                  disabled={marginLoading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    padding: "8px 12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={14} />
                  רענון
                </button>
              </div>
              {marginError ? (
                <p style={{ color: "#b91c1c", marginTop: 12 }}>{marginError}</p>
              ) : null}
              {marginLoading && !marginReport ? (
                <p style={{ color: "#64748b", marginTop: 12 }}>טוען דוח...</p>
              ) : null}
              {marginReport ? (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: 10,
                      marginTop: 14,
                    }}
                  >
                    {[
                      ["הודעות", marginReport.totals.messageCount],
                      ["חיוב ₪", marginReport.totals.chargeIls],
                      ["עלות Meta ₪", marginReport.totals.metaCostIls],
                      ["מרווח ₪", marginReport.totals.marginIls],
                    ].map(([label, value]) => (
                      <div
                        key={String(label)}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 12,
                          padding: 12,
                          background: "#f8fafc",
                        }}
                      >
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>
                          {typeof value === "number"
                            ? value.toLocaleString("he-IL")
                            : value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ overflowX: "auto", marginTop: 14 }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 13,
                      }}
                    >
                      <thead>
                        <tr style={{ textAlign: "start", color: "#64748b" }}>
                          <th style={{ padding: "8px 6px" }}>Business</th>
                          <th style={{ padding: "8px 6px" }}>Msgs</th>
                          <th style={{ padding: "8px 6px" }}>Charge ₪</th>
                          <th style={{ padding: "8px 6px" }}>Meta ₪</th>
                          <th style={{ padding: "8px 6px" }}>Margin ₪</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(marginReport.businesses || []).slice(0, 25).map((row) => (
                          <tr
                            key={row.businessId}
                            style={{ borderTop: "1px solid #f1f5f9" }}
                          >
                            <td style={{ padding: "8px 6px" }}>
                              {row.businessId}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              {row.messageCount}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              {row.chargeIls}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              {row.metaCostIls}
                            </td>
                            <td style={{ padding: "8px 6px" }}>
                              {row.marginIls}
                            </td>
                          </tr>
                        ))}
                        {(marginReport.businesses || []).length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              style={{ padding: "12px 6px", color: "#94a3b8" }}
                            >
                              אין שימוש מחויב עדיין
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
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
