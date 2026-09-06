import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../../../i18n/localeUtils";
import {
  createEmailSender,
  deleteEmailSender,
  listEmailSenders,
  refreshEmailSender,
  renameEmailSender,
  setDefaultEmailSender,
  type EmailSender,
  type EmailSenderDnsRecord,
} from "../../../../api/emailSendersApi";
import {
  buildDomainManagerInstructions,
  domainFromEmail,
  senderDisplayName,
} from "./businessEmailDns";

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

function DnsField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { t } = useTranslation();
  if (!value) return null;
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">{label}</span>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
          onClick={() => void copyText(value)}
        >
          {t("emailSenders.copy")}
        </button>
      </div>
      <p className="mt-1 break-all font-mono text-xs text-slate-800" dir="ltr">
        {value}
      </p>
    </div>
  );
}

function VerificationModal({
  sender,
  onClose,
  onVerified,
}: {
  sender: EmailSender;
  onClose: () => void;
  onVerified: (sender: EmailSender) => void;
}) {
  const [records, setRecords] = useState<EmailSenderDnsRecord[]>(
    sender.domainVerification?.records || []
  );
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const email = sender.email;
  const domain = sender.domain || domainFromEmail(email);
  const name = senderDisplayName(sender);

  async function loadRecords() {
    setLoading(true);
    setError("");
    try {
      const result = await refreshEmailSender(sender.senderId);
      const next = result.sender;
      setRecords(
        result.domainInfo?.records?.length
          ? result.domainInfo.records
          : next.domainVerification?.records || []
      );
      if (next.verificationStatus === "verified") {
        setSuccess(true);
        onVerified(next);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("emailSenders.loadRecordsError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sender.senderId]);

  async function checkVerification() {
    setChecking(true);
    setError("");
    setSuccess(false);
    try {
      const result = await refreshEmailSender(sender.senderId);
      const next = result.sender;
      setRecords(
        result.domainInfo?.records?.length
          ? result.domainInfo.records
          : next.domainVerification?.records || []
      );
      if (next.verificationStatus === "verified") {
        setSuccess(true);
        onVerified(next);
        window.setTimeout(onClose, 1400);
        return;
      }
      setError(t("emailSenders.stillPending"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("emailSenders.checkFailed"));
    } finally {
      setChecking(false);
    }
  }

  const instructions = useMemo(
    () =>
      buildDomainManagerInstructions({
        domain,
        email,
        displayName: name,
        records,
        labels: {
          title: t("emailSenders.instructionsTitle"),
          domain: t("emailSenders.instructionsDomain"),
          email: t("emailSenders.instructionsEmail"),
          name: t("emailSenders.instructionsName"),
          addDns: t("emailSenders.instructionsAddDns"),
          noRecords: t("emailSenders.instructionsNoRecords"),
          after: t("emailSenders.instructionsAfter"),
          recordType: t("emailSenders.recordType"),
          recordHost: t("emailSenders.recordHost"),
          recordValue: t("emailSenders.recordValue"),
          recordPriority: t("emailSenders.recordPriority"),
        },
      }),
    [domain, email, name, records, t]
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-4"
      dir={pageDir}
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-semibold">{t("emailSenders.verifyTitle")}</h3>
          <p className="mt-2 text-sm text-slate-600">
            {t("emailSenders.verifyLead", { email, domain })}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {t("emailSenders.verifyAfter")}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <p className="text-sm font-medium text-slate-800">
            {t("emailSenders.addWhereManaged")}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {t("emailSenders.selfManageHint")}
          </p>
          <button
            type="button"
            className="mt-2 text-sm text-slate-700 underline"
            onClick={() => setShowHelp((v) => !v)}
          >
            {t("emailSenders.moreInfo")}
          </button>
          {showHelp ? (
            <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {t("emailSenders.helpText")}
            </p>
          ) : null}

          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">{t("emailSenders.loadingRecords")}</p>
            ) : records.length ? (
              records.map((record, index) => (
                <div
                  key={`${record.name || "dns"}-${index}`}
                  className="rounded-xl border border-slate-200 p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DnsField label={t("emailSenders.type")} value={record.type || "TXT"} />
                    <DnsField label={t("emailSenders.host")} value={record.name || ""} />
                    <div className="sm:col-span-2">
                      <DnsField label={t("emailSenders.value")} value={record.value || ""} />
                    </div>
                    {record.priority ? (
                      <DnsField label={t("emailSenders.priority")} value={record.priority} />
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-amber-800">
                {t("emailSenders.recordsUnavailable")}
              </p>
            )}
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              onClick={() => setShowShare((v) => !v)}
            >
              {t("emailSenders.someoneElse")}
            </button>
            {showShare ? (
              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-medium">{t("emailSenders.copyInstructionsTitle")}</p>
                <pre
                  className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 text-xs text-slate-700"
                  dir={pageDir}
                >
                  {instructions}
                </pre>
                <button
                  type="button"
                  className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"
                  onClick={async () => {
                    await copyText(instructions);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? t("emailSenders.copied") : t("emailSenders.copyInstructions")}
                </button>
              </div>
            ) : null}
          </div>

          {success ? (
            <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {t("emailSenders.verifiedSuccess")}
            </p>
          ) : null}
          {error ? (
            <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            onClick={onClose}
          >
            {t("emailSenders.close")}
          </button>
          <button
            type="button"
            disabled={checking}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
            onClick={() => void checkVerification()}
          >
            {checking ? t("emailSenders.checking") : t("emailSenders.checkVerification")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmailSendersPanel() {
  const { t, i18n } = useTranslation();
  const pageDir = getTextDirection(i18n.language);
  const [senders, setSenders] = useState<EmailSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [verifySender, setVerifySender] = useState<EmailSender | null>(null);
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setSenders(await listEmailSenders());
    } catch (e) {
      setError(e instanceof Error ? e.message : t("emailSenders.loadSendersError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function addSender() {
    setBusy(true);
    setError("");
    try {
      await createEmailSender({ displayName, email });
      setDisplayName("");
      setEmail("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("emailSenders.addSenderError"));
    } finally {
      setBusy(false);
    }
  }

  async function saveName(senderId: string) {
    setBusy(true);
    setError("");
    try {
      await renameEmailSender(senderId, editingName);
      setEditingId("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("emailSenders.renameError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="email-senders"
      dir={pageDir}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold">{t("emailSenders.title")}</h2>
        <p className="mt-1 text-sm text-slate-600">
          {t("emailSenders.subtitle")}
        </p>
      </div>

      {error ? (
        <p className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">{t("emailSenders.loadingSenders")}</p>
      ) : senders.length ? (
        <div className="mt-4 space-y-3">
          {senders.map((sender) => {
            const pending = sender.verificationStatus !== "verified";
            const name = senderDisplayName(sender);
            return (
              <div
                key={sender.senderId}
                className="rounded-xl border border-slate-200 px-3 py-3 text-sm"
              >
                <div className="font-semibold">{name}</div>
                <div className="mt-0.5 break-all text-slate-600" dir="ltr">
                  {sender.email}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {pending ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      {t("emailSenders.needsVerification")}
                    </span>
                  ) : (
                    <>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        {t("emailSenders.verified")}
                      </span>
                      {sender.isDefault ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {t("emailSenders.default")}
                        </span>
                      ) : null}
                    </>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pending ? (
                    <button
                      type="button"
                      className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"
                      onClick={() => setVerifySender(sender)}
                    >
                      {t("emailSenders.completeVerification")}
                    </button>
                  ) : (
                    <>
                      {!sender.isDefault ? (
                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          onClick={() =>
                            setDefaultEmailSender(sender.senderId).then(load)
                          }
                        >
                          {t("emailSenders.setDefault")}
                        </button>
                      ) : null}
                      {editingId === sender.senderId ? (
                        <>
                          <input
                            className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder="Invistimo"
                          />
                          <button
                            type="button"
                            className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white"
                            onClick={() => void saveName(sender.senderId)}
                          >
                            {t("emailSenders.save")}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                          onClick={() => {
                            setEditingId(sender.senderId);
                            setEditingName(name);
                          }}
                        >
                          {t("emailSenders.editSenderName")}
                        </button>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    className="rounded-xl border border-red-200 px-3 py-2 text-sm text-red-700"
                    onClick={() =>
                      deleteEmailSender(sender.senderId).then(load)
                    }
                  >
                    {t("emailSenders.remove")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {t("emailSenders.empty")}
        </p>
      )}

      <div className="mt-6 border-t border-slate-100 pt-4">
        <h3 className="text-sm font-semibold">{t("emailSenders.addTitle")}</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="text-sm">
            {t("emailSenders.senderName")}
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="Invistimo"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </label>
          <label className="text-sm">
            {t("emailSenders.emailAddress")}
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              placeholder="support@invistimo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              dir="ltr"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={busy || !email}
          className="mt-3 rounded-xl bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-50"
          onClick={() => void addSender()}
        >
          {t("emailSenders.addButton")}
        </button>
      </div>

      {verifySender ? (
        <VerificationModal
          sender={verifySender}
          onClose={() => setVerifySender(null)}
          onVerified={(next) => {
            setSenders((prev) =>
              prev.map((row) => (row.senderId === next.senderId ? next : row))
            );
          }}
        />
      ) : null}
    </section>
  );
}
