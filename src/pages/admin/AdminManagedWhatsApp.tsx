import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, RefreshCw, Shield } from "lucide-react";

import {
  completeAdminManagedEmbeddedSignup,
  getAdminManagedEmbeddedSignupConfig,
  getAdminManagedWhatsAppHealth,
  getAdminManagedWhatsAppStatus,
  listAdminManagedWhatsAppAudit,
  registerAdminManagedWhatsAppPhone,
  syncAdminManagedWhatsAppTemplates,
  updateAdminManagedWhatsAppSettings,
  type AdminManagedWhatsAppAuditItem,
  type AdminManagedWhatsAppHealth,
  type AdminManagedWhatsAppStatus,
  type ManagedWhatsAppAllowlistMode,
  type ManagedWhatsAppConnectionSummary,
} from "../../api/adminManagedWhatsAppApi";
import { splitE164ForMetaPrefill } from "../business/dashboardPages/whatsapp/embeddedSignupEnteredPhone";
import {
  extractEmbeddedSignupSessionAssets,
  embeddedSignupAssetsLogFields,
} from "../business/dashboardPages/whatsapp/embeddedSignupSessionAssets";
import { loadFacebookSdk } from "../../utils/loadFacebookSdk";
import {
  getAdminWhatsAppBillingMargin,
  type WhatsAppBillingMarginReport,
} from "../../api/whatsappBillingApi";
import { useAuth } from "../../context/AuthContext";
import { useLocaleDir } from "../../hooks/useLocaleDir";
import { useTranslation } from "react-i18next";
import AdminHeader from "./AdminsHeader";
import AdminPageHeader from "./shell/AdminPageHeader";
import {
  ADMIN_MANAGED_PAGE_CONNECTION_ID,
  ADMIN_MANAGED_PAGE_SLOT,
  adminManagedSyncFinished,
  adminManagedWhatsAppCopy,
  type AdminManagedWhatsAppCopy,
  isAuthorizedAdminManagedConnection,
  isManagedConnectionReady,
  shouldShowManagedConnectButton,
} from "./adminManagedWhatsAppScope";

const US_CONNECTION_ID = ADMIN_MANAGED_PAGE_CONNECTION_ID;
const US_DISPLAY_PHONE = "+1 210 944 4809";
const US_E164 = "+12109444809";

const FIXED_MANAGED_SLOTS = [ADMIN_MANAGED_PAGE_SLOT];

type EmbeddedSignupSession = {
  phoneNumberId: string;
  wabaId: string;
  metaBusinessId?: string;
};

function connectionSummaryFromStatus(
  connections: ManagedWhatsAppConnectionSummary[] | undefined,
  connectionId: string
): ManagedWhatsAppConnectionSummary {
  const slot = FIXED_MANAGED_SLOTS.find((s) => s.connectionId === connectionId)!;
  const found = (connections || []).find(
    (c) => String(c.connectionId || "").trim().toUpperCase() === connectionId
  );
  return {
    ...slot,
    ...found,
    connectionId,
    country: slot.country,
    label: found?.label || slot.label,
    flag: found?.flag || slot.flag,
    enabled: found?.enabled !== false,
    isFixed: true,
    expectedDisplayPhone:
      found?.expectedDisplayPhone || slot.expectedDisplayPhone,
  };
}

function isManagedConnectionSendReady(
  conn?: ManagedWhatsAppConnectionSummary | null
) {
  if (conn?.sendReady) return true;
  if (conn?.phoneRegistered && isManagedConnectionReady(conn)) return true;
  const status = String(conn?.connectionStatus || "").toUpperCase();
  return status === "READY" && Boolean(conn?.phoneRegistered !== false);
}

function connectionNeedsPin(conn?: ManagedWhatsAppConnectionSummary | null) {
  if (!isManagedConnectionReady(conn)) return false;
  if (conn?.sendReady || conn?.phoneRegistered) return false;
  const reg = String(conn?.registrationStatus || "").toLowerCase();
  if (reg === "registered") return false;
  return true;
}

function connectionTabLabel(conn: ManagedWhatsAppConnectionSummary) {
  const flag =
    conn.flag ||
    (conn.country === "IL" ? "🇮🇱" : conn.country === "US" ? "🇺🇸" : "");
  const title = conn.label || conn.connectionId;
  // Include connectionId so IL_MANAGED vs accidental ISRAEL duplicates are visible.
  const id = String(conn.connectionId || "").trim();
  if (id && id !== title && id !== title.toUpperCase()) {
    return `${flag ? `${flag} ` : ""}${title}`;
  }
  return `${flag ? `${flag} ` : ""}${title}`;
}

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function healthHeadline(status: string | undefined, copy: AdminManagedWhatsAppCopy) {
  switch (status) {
    case "healthy":
      return { emoji: "🟢", label: copy.healthConnected, color: "#047857", bg: "#ecfdf5" };
    case "degraded":
      return { emoji: "🟠", label: copy.healthDegraded, color: "#c2410c", bg: "#fff7ed" };
    case "failed":
      return { emoji: "🔴", label: copy.healthFailed, color: "#b91c1c", bg: "#fef2f2" };
    default:
      return { emoji: "⚪", label: copy.healthUnset, color: "#475569", bg: "#f8fafc" };
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

function formatTokenExpiration(
  health: AdminManagedWhatsAppHealth | undefined,
  copy: AdminManagedWhatsAppCopy
) {
  if (health?.tokenExpirationStatus === "never" || health?.tokenExpiration === "never") {
    return copy.neverExpires;
  }
  if (health?.tokenExpirationStatus === "dated" && health.tokenExpiration) {
    return formatDate(health.tokenExpiration, copy.dateLocale);
  }
  return copy.cannotProve;
}

function formatTokenValidity(
  health: AdminManagedWhatsAppHealth | undefined,
  copy: AdminManagedWhatsAppCopy
) {
  if (health?.tokenValidNow === true) return copy.valid;
  if (health?.tokenValidNow === false) return copy.invalid;
  return copy.unknown;
}

function ManagedConnectionHealthPanel({
  health,
  copy,
}: {
  health?: AdminManagedWhatsAppHealth;
  copy: AdminManagedWhatsAppCopy;
}) {
  const headline = healthHeadline(health?.status, copy);
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
        {copy.connectionState}: {headline.emoji} {headline.label}
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
          {copy.tokenLabel}:{" "}
          {okLabel(Boolean(health?.tokenConfigured), copy.configured, copy.notConfigured)}
        </div>
        <div>
          {copy.tokenType}: {health?.tokenTypeLabel || health?.tokenType || copy.unknown}
        </div>
        <div>
          {copy.tokenValidity}: {formatTokenValidity(health, copy)}
        </div>
        <div>
          {copy.tokenExpiration}: {formatTokenExpiration(health, copy)}
        </div>
        {health?.tokenExpirationStatus === "unknown" && health?.tokenExpirationReason ? (
          <div style={{ color: "#9a3412" }}>
            {copy.expirationProof}: {health.tokenExpirationReason}
          </div>
        ) : null}
        {health?.dataAccessExpiresAt && health.dataAccessExpiresAt !== "never" ? (
          <div>
            Data access expires: {formatDate(health.dataAccessExpiresAt, copy.dateLocale)}
          </div>
        ) : null}
        <div>
          {copy.permissions}:{" "}
          {health?.requiredPermissionsOk === true
            ? "whatsapp_business_messaging + whatsapp_business_management"
            : health?.requiredPermissionsOk === false
              ? `${copy.missing}: ${(health.missingPermissions || []).join(", ") || copy.unknown}`
              : copy.notChecked}
        </div>
        <div>
          {copy.wabaAssigned}:{" "}
          {health?.wabaAssignmentStatus === "pass" ||
          health?.wabaAssignedToSystemUser === true
            ? copy.ok
            : health?.wabaAssignmentStatus === "not_applicable"
              ? copy.notRelevantBsp
              : health?.wabaAssignmentStatus === "fail" ||
                  health?.wabaAssignedToSystemUser === false
                ? copy.notAssigned
                : copy.cannotProve}
        </div>
        {health?.wabaAssignmentReason ? (
          <div style={{ color: "#64748b", fontSize: 12 }}>
            {health.wabaAssignmentReason}
          </div>
        ) : null}
        <div>
          {copy.wabaLabel}: {okLabel(Boolean(health?.wabaAccessible), copy.ok, copy.errorWord)}
        </div>
        <div>
          {copy.whatsappNumber}:{" "}
          {okLabel(Boolean(health?.phoneNumberAccessible), copy.ok, copy.errorWord)}
        </div>
        <div>
          {copy.lastCheck}: {formatDate(health?.lastCheckedAt, copy.dateLocale)}
        </div>
        <div>
          {copy.lastSuccessfulCheck}: {formatDate(health?.lastSuccessfulCheckAt, copy.dateLocale)}
        </div>
        <div>
          {copy.lastSuccessfulSend}: {formatDate(health?.lastSuccessfulSendAt, copy.dateLocale)}
        </div>
        {health?.errorMessage ? (
          <div style={{ color: "#b91c1c", marginTop: 4 }}>
            {copy.lastError}: {health.errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminManagedWhatsApp() {
  const { user } = useAuth() as { user: { role?: string } | null };
  const { i18n } = useTranslation();
  const dir = useLocaleDir();
  const language = i18n.resolvedLanguage || i18n.language;
  const copy = adminManagedWhatsAppCopy(language);
  const copyRef = useRef(copy);
  copyRef.current = copy;
  const navigate = useNavigate();
  const [status, setStatus] = useState<AdminManagedWhatsAppStatus | null>(null);
  const [audit, setAudit] = useState<AdminManagedWhatsAppAuditItem[]>([]);
  const [marginReport, setMarginReport] =
    useState<WhatsAppBillingMarginReport | null>(null);
  const [marginLoading, setMarginLoading] = useState(false);
  const [marginError, setMarginError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [connectingUs, setConnectingUs] = useState(false);
  const [error, setError] = useState("");
  const [syncFlash, setSyncFlash] = useState("");
  const [allowlistText, setAllowlistText] = useState("");
  const [registerPin, setRegisterPin] = useState("");
  const [registering, setRegistering] = useState(false);
  const [activeConnectionId, setActiveConnectionId] = useState(US_CONNECTION_ID);
  const [connectionEnabled, setConnectionEnabled] = useState(true);
  const embeddedSessionRef = useRef<EmbeddedSignupSession | null>(null);
  const statusSectionRef = useRef<HTMLElement | null>(null);
  const templatesSectionRef = useRef<HTMLElement | null>(null);

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const applyStatus = useCallback((st: AdminManagedWhatsAppStatus) => {
    setStatus(st);
    setAllowlistText((st.allowlistBusinessIds || []).join("\n"));
    setActiveConnectionId(US_CONNECTION_ID);
    setConnectionEnabled(
      st.connection?.enabled !== false &&
        st.connectionMeta?.enabled !== false
    );
  }, []);

  const load = useCallback(async () => {
      setLoading(true);
      setError("");
      const target = US_CONNECTION_ID;
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
        setError(err?.message || copyRef.current.loadStatusFailed);
      } finally {
        setLoading(false);
      }
    },
    [applyStatus, activeConnectionId]
  );

  useEffect(() => {
    void load();
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
      setMarginError(err?.message || copyRef.current.loadMarginFailed);
    } finally {
      setMarginLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMargin();
  }, [loadMargin]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type !== "WA_EMBEDDED_SIGNUP") return;
        const assets = extractEmbeddedSignupSessionAssets(data);
        console.info(
          "[admin-managed-whatsapp] Embedded Signup session event",
          embeddedSignupAssetsLogFields(
            assets,
            typeof data?.event === "string" ? data.event : undefined
          )
        );
        if (assets?.phoneNumberId && assets?.wabaId) {
          embeddedSessionRef.current = {
            phoneNumberId: assets.phoneNumberId,
            wabaId: assets.wabaId,
            metaBusinessId: assets.metaBusinessId,
          };
        } else if (
          typeof data?.event === "string" &&
          data.event === "FINISH_OBO_MIGRATION"
        ) {
          embeddedSessionRef.current = null;
        }
      } catch {
        // Ignore non-JSON postMessages from the popup.
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  async function connectUsEmbeddedSignup() {
    if (!isAdmin || connectingUs) return;
    setConnectingUs(true);
    setError("");
    setSyncFlash("");
    embeddedSessionRef.current = null;
    try {
      const signup = await getAdminManagedEmbeddedSignupConfig();
      if (!signup.appId || !signup.configId) {
        throw new Error(copyRef.current.signupMissing);
      }
      if (!signup.encryptionReady || !signup.ready) {
        throw new Error(copyRef.current.signupNotReady);
      }

      const FB = await loadFacebookSdk(
        signup.appId,
        signup.graphVersion || "v21.0"
      );
      const prefill = splitE164ForMetaPrefill(US_E164);

      await new Promise<void>((resolve, reject) => {
        let settled = false;
        const finish = (fn: () => void) => {
          if (settled) return;
          settled = true;
          fn();
        };

        FB.login(
          (response) => {
            void (async () => {
              try {
                const code = response?.authResponse?.code;
                if (!code) {
                  finish(() => reject(new Error(copyRef.current.signupCancelled)));
                  return;
                }
                await new Promise((r) => setTimeout(r, 600));
                const assets = embeddedSessionRef.current;
                if (!assets?.phoneNumberId || !assets?.wabaId) {
                  finish(() =>
                    reject(new Error(copyRef.current.signupAssetsMissing))
                  );
                  return;
                }
                const data = await completeAdminManagedEmbeddedSignup({
                  managedConnectionId: US_CONNECTION_ID,
                  code,
                  phoneNumberId: assets.phoneNumberId,
                  wabaId: assets.wabaId,
                  metaBusinessId: assets.metaBusinessId,
                  // PIN is collected separately after ES — never invent/skip it.
                });
                applyStatus(data);
                setActiveConnectionId(US_CONNECTION_ID);
                const registered = Boolean(
                  data.registration?.phoneRegistered || data.registration?.sendReady
                );
                if (registered) {
                  setSyncFlash(copyRef.current.signupUsaDone);
                } else {
                  setSyncFlash(copyRef.current.signupUsaPin);
                  setRegisterPin("");
                }
                const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
                  items: [],
                }));
                setAudit(aud.items || []);
                finish(resolve);
              } catch (err: any) {
                finish(() =>
                  reject(
                    new Error(
                      err?.response?.data?.error ||
                        err?.message ||
                        copyRef.current.signupFailed
                    )
                  )
                );
              }
            })();
          },
          {
            config_id: signup.configId,
            response_type: "code",
            override_default_response_type: true,
            extras: {
              setup: prefill ? { business: { phone: prefill } } : {},
              featureType: "",
              sessionInfoVersion: "3",
            },
          }
        );
      });
    } catch (err: any) {
      setError(err?.message || copyRef.current.signupConnectFailed);
    } finally {
      setConnectingUs(false);
    }
  }

  async function selectConnection(connectionId: string) {
    if (!isAuthorizedAdminManagedConnection(connectionId)) return;
    if (connectionId === activeConnectionId && status) return;
    setActiveConnectionId(US_CONNECTION_ID);
    await load();
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
      setError(err?.message || copyRef.current.saveSettingsFailed);
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
      setError(err?.message || copyRef.current.saveAllowlistFailed);
    } finally {
      setSaving(false);
    }
  }

  async function registerPhone() {
    if (!isAdmin || registering) return;
    const pin = registerPin.replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(pin)) {
      setError(copyRef.current.pinInvalid);
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
          ? copyRef.current.registeredCanSend
          : copyRef.current.registeredNotReady
      );
      const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
        items: [],
      }));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || copyRef.current.registerFailed);
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
      setSyncFlash(adminManagedSyncFinished(language, activeConnectionId, c));
      const aud = await listAdminManagedWhatsAppAudit(30).catch(() => ({
        items: [],
      }));
      setAudit(aud.items || []);
    } catch (err: any) {
      setError(err?.message || copyRef.current.syncFailed);
    } finally {
      setSyncing(false);
    }
  }

  function scrollToSection(ref: React.RefObject<HTMLElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!isAdmin) {
    return (
      <div dir={dir}>
        <AdminHeader />
        <main style={{ padding: 24 }}>
          <p>{copy.noAccess}</p>
        </main>
      </div>
    );
  }

  const modeOn = Boolean(status?.managedModeEnabled);
  const wabaOk = Boolean(status?.connection?.wabaConnected);
  const phoneOk = Boolean(status?.connection?.phoneNumberConnected);
  const tokenOk = status?.connection?.accessToken === "configured";
  const connectionReady = Boolean(status?.connection?.connectionReady);
  const sendRegistered = Boolean(
    status?.registration?.phoneRegistered || status?.registration?.sendReady
  );
  const needsRegistration = connectionReady && !sendRegistered;
  const fixedConnections = FIXED_MANAGED_SLOTS.map((slot) =>
    connectionSummaryFromStatus(status?.connections, slot.connectionId)
  );
  const usSummary = fixedConnections.find((c) => c.connectionId === US_CONNECTION_ID);
  const usReady = isManagedConnectionReady(usSummary);
  const showIlCredentialForm = false;
  // Show USA detail + PIN whenever credentials exist or active status needs registration —
  // never hide the PIN form behind a misleading "Not connected" card state.
  const showUsDetailPanel =
    activeConnectionId === US_CONNECTION_ID &&
    (usReady ||
      connectionReady ||
      Boolean(status?.connection?.wabaConnected) ||
      Boolean(status?.configForm?.phoneNumberId) ||
      needsRegistration);

  return (
    <div dir={dir} style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <AdminHeader />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 48px" }}>
        <AdminPageHeader
          title={copy.title}
          description={copy.description}
        />

        {status ? (
          <div
            style={{
              display: "grid",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {fixedConnections.map((conn) => {
              const active = conn.connectionId === activeConnectionId;
              const ready = isManagedConnectionReady(conn);
              const sendReady = isManagedConnectionSendReady(conn);
              const pinNeeded = connectionNeedsPin(conn);
              const isUs = conn.connectionId === US_CONNECTION_ID;
              const phoneLabel =
                conn.displayPhoneMasked ||
                conn.expectedDisplayPhone ||
                (isUs ? US_DISPLAY_PHONE : "");
              return (
                <div
                  key={conn.connectionId}
                  role="button"
                  tabIndex={0}
                  onClick={() => void selectConnection(conn.connectionId)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      void selectConnection(conn.connectionId);
                    }
                  }}
                  style={{
                    border: active ? "2px solid #0f172a" : "1px solid #e2e8f0",
                    background: "#fff",
                    borderRadius: 14,
                    padding: "14px 16px",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
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
                        {conn.flag} {conn.label}
                      </strong>
                      {phoneLabel ? (
                        <div
                          style={{
                            marginTop: 4,
                            color: "#64748b",
                            fontSize: 14,
                          }}
                          dir="ltr"
                        >
                          {phoneLabel}
                        </div>
                      ) : null}
                      <div style={{ marginTop: 8 }}>
                        {sendReady ? (
                          <StatusPill ok labelOk={copy.ready} labelBad="" />
                        ) : pinNeeded ? (
                          <StatusPill ok={false} labelOk="" labelBad={copy.pinNeeded} />
                        ) : ready ? (
                          <StatusPill ok labelOk={copy.connected} labelBad="" />
                        ) : (
                          <span style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>
                            {copy.notConnected}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {shouldShowManagedConnectButton(conn) ? (
                        <button
                          type="button"
                          onClick={() => void connectUsEmbeddedSignup()}
                          disabled={connectingUs}
                          style={{
                            border: "none",
                            borderRadius: 10,
                            padding: "10px 14px",
                            background: "#0369a1",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: connectingUs ? "wait" : "pointer",
                          }}
                        >
                          {connectingUs ? copy.connecting : copy.connect}
                        </button>
                      ) : null}
                      {isUs && ready && pinNeeded ? (
                        <button
                          type="button"
                          onClick={() => {
                            void selectConnection(US_CONNECTION_ID);
                            scrollToSection(statusSectionRef);
                          }}
                          style={{
                            border: "none",
                            borderRadius: 10,
                            padding: "10px 14px",
                            background: "#c2410c",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {copy.enterPin}
                        </button>
                      ) : null}
                      {isUs && ready ? (
                        <>
                          {!pinNeeded ? (
                            <button
                              type="button"
                              onClick={() => navigate("/admin/crm/whatsapp")}
                              style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: 10,
                                padding: "8px 12px",
                                background: "#fff",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {copy.openInbox}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => {
                              void selectConnection(US_CONNECTION_ID);
                              scrollToSection(templatesSectionRef);
                            }}
                            style={{
                              border: "1px solid #e2e8f0",
                              borderRadius: 10,
                              padding: "8px 12px",
                              background: "#fff",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {copy.templates}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              void selectConnection(US_CONNECTION_ID);
                              scrollToSection(statusSectionRef);
                            }}
                            style={{
                              border: "1px solid #e2e8f0",
                              borderRadius: 10,
                              padding: "8px 12px",
                              background: "#fff",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {copy.connectionStatus}
                          </button>
                          {!pinNeeded ? null : (
                            <button
                              type="button"
                              onClick={() => void connectUsEmbeddedSignup()}
                              disabled={connectingUs}
                              style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: 10,
                                padding: "8px 12px",
                                background: "#fff",
                                fontWeight: 600,
                                cursor: connectingUs ? "wait" : "pointer",
                              }}
                            >
                              {connectingUs ? copy.connecting : copy.reconnect}
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
          <p>{copy.loading}</p>
        ) : (
          <>
            <section
              ref={statusSectionRef}
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
                    {copy.systemStatus} · {US_CONNECTION_ID}
                  </strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 10,
                    }}
                  >
                    <StatusPill ok={modeOn} labelOk={copy.statusActive} labelBad={copy.statusInactive} />
                    <StatusPill
                      ok={wabaOk && connectionReady}
                      labelOk={copy.wabaConnected}
                      labelBad={copy.wabaDisconnected}
                    />
                    <StatusPill
                      ok={phoneOk && connectionReady}
                      labelOk={copy.phoneConnected}
                      labelBad={copy.phoneDisconnected}
                    />
                    <StatusPill
                      ok={tokenOk}
                      labelOk={copy.tokenConfigured}
                      labelBad={copy.tokenMissing}
                    />
                    <StatusPill
                      ok={connectionReady}
                      labelOk={
                        sendRegistered
                          ? copy.connectionReadyLabel
                          : copy.connectionConfiguredLabel
                      }
                      labelBad={copy.connectionNotReady}
                    />
                    <StatusPill
                      ok={sendRegistered}
                      labelOk={copy.registrationRegistered}
                      labelBad={copy.registrationPinNeeded}
                    />
                  </div>
                  <p
                    style={{
                      margin: "10px 0 0",
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    {copy.statusScopeNote}
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
                  {copy.enableManaged}
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
                    {copy.approvedTemplates}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>
                    {connectionReady ? status.templates?.APPROVED ?? 0 : 0}
                  </div>
                  {!connectionReady ? (
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                      {copy.templatesAfterReady}
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
                  <div style={{ color: "#64748b", fontSize: 12 }}>{copy.registrationLabel}</div>
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
                      ? copy.registered
                      : copy.pinRequired}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{copy.phoneMasked}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {status.connection?.displayPhoneMasked || "—"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{copy.lastSync}</div>
                  <div style={{ fontSize: 15 }}>
                    {formatDate(status.connection?.lastTemplatesSyncAt, copy.dateLocale)}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>
                    {copy.lastConnectionError}
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
                        copy.none
                      : status.lastError ||
                        status.registration?.lastError ||
                        status.connection?.connectionReason ||
                        copy.none}
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
                <strong style={{ fontSize: 14 }}>{copy.businessConnections}</strong>
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
                      {copy.managedConnection}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {!connectionReady
                        ? "NOT READY"
                        : sendRegistered
                          ? "READY TO SEND"
                          : "CONFIGURED · PIN REQUIRED"}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {copy.privateConnected}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {status.businessConnections?.privateConnected ?? 0}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {copy.privateDisconnected}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {status.businessConnections?.privateDisconnected ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: 16, color: "#475569", fontSize: 14 }}>
                {modeOn
                  ? copy.modeOnExplain
                  : copy.modeOffExplain}
              </p>

              <div ref={templatesSectionRef} style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => void runSync()}
                disabled={syncing || !connectionReady}
                title={
                  connectionReady
                    ? undefined
                    : copy.syncNeedConnection
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
                {syncing ? copy.syncing : copy.syncTemplates}
              </button>
              </div>
            </section>

            {(showIlCredentialForm || showUsDetailPanel) ? (
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
                  {copy.centralConnection} ·{" "}
                  {status.connectionMeta?.label || activeConnectionId}
                </strong>
              </div>
              <p style={{ color: "#64748b", fontSize: 14 }}>{copy.connectionIntro}</p>
              {showIlCredentialForm ? (
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
                  {copy.activeEnabled}
                </label>
              ) : null}
              <ManagedConnectionHealthPanel health={status.health} copy={copy} />
              {showIlCredentialForm &&
              !status.connection?.managedBusinessIdConfigured ? (
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
                  {copy.missingBusinessId}
                </div>
              ) : null}

              {showUsDetailPanel && sendRegistered ? (
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
                  {copy.registrationRegistered}
                </div>
              ) : (showIlCredentialForm || showUsDetailPanel) && needsRegistration ? (
                <div
                style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 12,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                }}
              >
                <strong style={{ fontSize: 14 }}>{copy.pinTitle}</strong>
                <p style={{ color: "#9a3412", fontSize: 13, margin: "8px 0 0" }}>
                  {copy.pinBodyBefore}{" "}
                  {status.configForm?.displayPhoneNumber ||
                    status.connection?.displayPhoneMasked ||
                    ""}
                  {copy.pinBodyAfter}
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
                      {copy.pinLabel}
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
                    {registering ? copy.registering : copy.registerPhone}
                  </button>
                </div>
              </div>
              ) : null}
            </section>
            ) : null}

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
                <strong>{copy.authorizedBusinesses}</strong>
              </div>
              <p style={{ color: "#64748b", fontSize: 14 }}>{copy.allowlistHelp}</p>
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
                  {copy.allEntitled}
                </label>
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="radio"
                    name="allowMode"
                    checked={status.allowlistMode === "allowlist"}
                    onChange={() => void saveAllowlist("allowlist")}
                    disabled={saving}
                  />
                  {copy.allowlist}
                </label>
              </div>
              {status.allowlistMode === "allowlist" ? (
                <>
                  <textarea
                    value={allowlistText}
                    onChange={(e) => setAllowlistText(e.target.value)}
                    rows={5}
                    placeholder={copy.allowlistPlaceholder}
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
                    {copy.saveAllowlist}
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
                <strong>{copy.billingTitle}</strong>
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
                  {copy.refresh}
                </button>
              </div>
              {marginError ? (
                <p style={{ color: "#b91c1c", marginTop: 12 }}>{marginError}</p>
              ) : null}
              {marginLoading && !marginReport ? (
                <p style={{ color: "#64748b", marginTop: 12 }}>{copy.loadingReport}</p>
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
                      [copy.messages, marginReport.totals.messageCount],
                      [copy.charge, marginReport.totals.chargeIls],
                      [copy.metaCost, marginReport.totals.metaCostIls],
                      [copy.margin, marginReport.totals.marginIls],
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
                            ? value.toLocaleString(copy.dateLocale)
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
                          <th style={{ padding: "8px 6px" }}>{copy.business}</th>
                          <th style={{ padding: "8px 6px" }}>{copy.msgs}</th>
                          <th style={{ padding: "8px 6px" }}>{copy.charge}</th>
                          <th style={{ padding: "8px 6px" }}>{copy.metaCost}</th>
                          <th style={{ padding: "8px 6px" }}>{copy.margin}</th>
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
                              {copy.noBilledUsage}
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
              <strong>{copy.auditLog}</strong>
              <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0" }}>
                {audit.length === 0 ? (
                  <li style={{ color: "#94a3b8" }}>{copy.auditEmpty}</li>
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
                        {formatDate(row.createdAt, copy.dateLocale)}
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
