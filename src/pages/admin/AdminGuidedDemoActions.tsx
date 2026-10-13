import React, { useState } from "react";
import AdminRowMenu from "./shell/AdminRowMenu";
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

  const menuItems = [
    linkAvailable
      ? {
          label: busy === "copy" ? "מעתיק..." : "העתקת קישור",
          disabled: Boolean(busy),
          testId: "admin-demo-copy-link",
          onClick: () =>
            void run("copy", async () => {
              const url = await resolveLiveLink();
              await navigator.clipboard?.writeText(url);
              setMessage("הקישור הועתק");
            }),
        }
      : null,
    linkAvailable
      ? {
          label: "שליחה ידנית ב-WhatsApp",
          disabled: Boolean(busy),
          testId: "admin-demo-manual-whatsapp",
          onClick: () =>
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
            }),
        }
      : null,
    {
      label: "שליחה אוטומטית ב-WhatsApp",
      disabled: Boolean(busy) || !whatsAppApiAvailable,
      testId: "admin-demo-api-whatsapp",
      title: whatsAppApiAvailable ? undefined : "שליחה אוטומטית ב-WhatsApp אינה זמינה כרגע",
      onClick: () =>
        void run("api", async () => {
          const result = await resendGuidedDemo(id);
          if (result?.delivery && result.delivery.ok === false) {
            throw Object.assign(new Error(result.delivery.error || "שליחת WhatsApp נכשלה"), {
              response: { data: { error: result.delivery.error } },
            });
          }
          setMessage("ההודעה נשלחה ב-WhatsApp");
        }),
    },
    invitation.status !== "revoked"
      ? {
          label: "הארכת תוקף",
          disabled: Boolean(busy),
          onClick: () =>
            void run("extend", async () => {
              await extendGuidedDemo(id, 24);
              setMessage("התוקף הוארך");
            }),
        }
      : null,
    invitation.status !== "revoked"
      ? {
          label: "ביטול קישור",
          danger: true,
          disabled: Boolean(busy),
          onClick: () =>
            void run("revoke", async () => {
              await revokeGuidedDemo(id);
              setMessage("הקישור בוטל");
            }),
        }
      : null,
    needsNew
      ? {
          label: "יצירת קישור חדש",
          disabled: Boolean(busy),
          testId: "admin-demo-new-link",
          onClick: () =>
            void run("duplicate", async () => {
              const result = await duplicateGuidedDemo(id, { send: false });
              setMessage("נוצר קישור חדש");
              onCreated?.(result);
            }),
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    testId?: string;
    title?: string;
  }[];

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <div className="biz-row-actions">
        {invitation.status !== "revoked" ? (
          <button
            type="button"
            className="biz-btn biz-btn-secondary biz-btn-row"
            disabled={Boolean(busy)}
            data-testid="admin-demo-open"
            title="פותח תצוגת אדמין — לא משפיע על קישור הלקוח"
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
        <AdminRowMenu items={menuItems} />
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
