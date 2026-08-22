import React, { useState } from "react";
import {
  copyGuidedDemoLink,
  duplicateGuidedDemo,
  extendGuidedDemo,
  previewGuidedDemo,
  recordGuidedDemoManualShare,
  resendGuidedDemo,
  revokeGuidedDemo,
} from "../../api/guidedDemoApi";
import {
  buildManualWhatsAppUrl,
  invitationIdOf,
  invitationLinkAvailable,
  invitationNeedsNewLink,
  invitationPhone,
  openExternalUrl,
  type GuidedDemoInvitationRow,
} from "../../guidedDemo/adminSendForm";

export default function AdminGuidedDemoActions({
  invitation,
  whatsAppApiAvailable,
  onChanged,
  onCreated,
  demoLink: demoLinkOverride,
  showUnavailableHint = false,
}: {
  invitation: GuidedDemoInvitationRow;
  whatsAppApiAvailable?: boolean;
  onChanged?: () => void | Promise<void>;
  onCreated?: (result: any) => void;
  demoLink?: string;
  showUnavailableHint?: boolean;
}) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const id = invitationIdOf(invitation);
  const linkAvailable = invitationLinkAvailable({
    ...invitation,
    demoLink: demoLinkOverride || invitation.demoLink,
  });
  const needsNew = invitationNeedsNewLink(invitation);
  const demoLink = demoLinkOverride || invitation.demoLink || "";

  async function resolveLiveLink() {
    if (demoLink && linkAvailable) return demoLink;
    const data = await copyGuidedDemoLink(id);
    return data.demoLink as string;
  }

  async function run(key: string, fn: () => Promise<void>) {
    if (!id || busy) return;
    setBusy(key);
    setError("");
    setMessage("");
    try {
      await fn();
      await onChanged?.();
    } catch (err: any) {
      setError(err?.response?.data?.error || "הפעולה נכשלה");
    } finally {
      setBusy("");
    }
  }

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <div className="flex flex-wrap gap-1">
        {invitation.status !== "revoked" ? (
          <button
            type="button"
            className="rounded-lg border px-2 py-1 text-[11px] font-black disabled:opacity-40"
            disabled={Boolean(busy)}
            data-testid="admin-demo-open"
            title="פותח תצוגת אדמין — לא מממש את קישור הלקוח החד-פעמי"
            onClick={() =>
              void run("open", async () => {
                const data = await previewGuidedDemo(id);
                const url = String(data?.previewUrl || "");
                if (!url) {
                  throw new Error("לא ניתן לפתוח תצוגת אדמין");
                }
                openExternalUrl(url);
                setMessage("תצוגת האדמין נפתחה בחלון חדש — ללא מימוש קישור הלקוח");
              })
            }
          >
            {busy === "open" ? "פותח..." : "פתיחת הדמו"}
          </button>
        ) : null}

        {linkAvailable ? (
          <>
            <button
              type="button"
              className="rounded-lg border px-2 py-1 text-[11px] font-black disabled:opacity-40"
              disabled={Boolean(busy)}
              data-testid="admin-demo-copy-link"
              onClick={() =>
                void run("copy", async () => {
                  const url = await resolveLiveLink();
                  await navigator.clipboard?.writeText(url);
                  setMessage("הקישור הועתק");
                })
              }
            >
              {busy === "copy" ? "מעתיק..." : "העתקת קישור"}
            </button>
            <button
              type="button"
              className="rounded-lg border px-2 py-1 text-[11px] font-black disabled:opacity-40"
              disabled={Boolean(busy)}
              data-testid="admin-demo-manual-whatsapp"
              onClick={() =>
                void run("manual", async () => {
                  const url = await resolveLiveLink();
                  const share = buildManualWhatsAppUrl({
                    phone: invitationPhone(invitation),
                    customerName: invitation.customerName,
                    demoUrl: url,
                  });
                  openExternalUrl(share);
                  void recordGuidedDemoManualShare(id).catch(() => null);
                  setMessage("WhatsApp נפתח — שלחו ידנית מהאפליקציה");
                })
              }
            >
              שליחה ידנית ב-WhatsApp
            </button>
          </>
        ) : null}

        <button
          type="button"
          className="rounded-lg border px-2 py-1 text-[11px] font-black disabled:opacity-40"
          disabled={Boolean(busy) || !whatsAppApiAvailable}
          title={
            whatsAppApiAvailable
              ? ""
              : "שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע"
          }
          data-testid="admin-demo-api-whatsapp"
          onClick={() =>
            void run("api", async () => {
              const result = await resendGuidedDemo(id);
              if (result?.delivery && result.delivery.ok === false) {
                throw Object.assign(new Error(result.delivery.error || "שליחת WhatsApp נכשלה"), {
                  response: { data: { error: result.delivery.error } },
                });
              }
              setMessage("ההודעה נשלחה ב-WhatsApp");
            })
          }
        >
          שליחה אוטומטית ב-WhatsApp
        </button>

        {invitation.status !== "revoked" ? (
          <button
            type="button"
            className="rounded-lg border px-2 py-1 text-[11px] font-black disabled:opacity-40"
            disabled={Boolean(busy)}
            onClick={() =>
              void run("extend", async () => {
                await extendGuidedDemo(id, 24);
                setMessage("התוקף הוארך");
              })
            }
          >
            הארכת תוקף
          </button>
        ) : null}

        {invitation.status !== "revoked" ? (
          <button
            type="button"
            className="rounded-lg border border-rose-200 px-2 py-1 text-[11px] font-black text-rose-700 disabled:opacity-40"
            disabled={Boolean(busy)}
            onClick={() =>
              void run("revoke", async () => {
                await revokeGuidedDemo(id);
                setMessage("הקישור בוטל");
              })
            }
          >
            ביטול קישור
          </button>
        ) : null}

        {needsNew ? (
          <button
            type="button"
            className="rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-800 disabled:opacity-40"
            disabled={Boolean(busy)}
            data-testid="admin-demo-new-link"
            onClick={() =>
              void run("duplicate", async () => {
                const result = await duplicateGuidedDemo(id, { send: false });
                setMessage("נוצר קישור חדש");
                onCreated?.(result);
              })
            }
          >
            יצירת קישור חדש
          </button>
        ) : null}
      </div>
      {message ? <p className="mt-1 text-[11px] font-bold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-1 text-[11px] font-bold text-rose-600">{error}</p> : null}
      {!whatsAppApiAvailable && showUnavailableHint ? (
        <p className="mt-1 text-[11px] font-bold text-amber-700">
          שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע
        </p>
      ) : null}
    </div>
  );
}
