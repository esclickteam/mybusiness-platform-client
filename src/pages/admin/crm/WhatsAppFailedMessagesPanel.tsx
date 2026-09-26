import React, { useCallback, useEffect, useState } from "react";
import adminCrmApi from "../../../api/adminCrmApi";
import { SecondaryButton } from "./AdminCrmUi";
import {
  connectionBadgeLabel,
  normalizeManagedConnectionId,
  type WhatsAppInboxConnection,
} from "./whatsappWeb/whatsAppWebMessages";

export type FailedWhatsAppRow = {
  id: string;
  direction?: string;
  sentFrom?: string;
  customerName?: string;
  customerPhone?: string;
  connection?: string;
  connectionBadge?: string;
  connectionFlag?: string;
  managedConnectionId?: string;
  phoneNumberId?: string;
  phoneNumberLabel?: string;
  businessPhoneNumber?: string;
  wabaId?: string;
  metaError?: string;
  bodyPreview?: string;
  failedAt?: string | Date | null;
};

function formatWhen(value?: string | Date | null) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function WhatsAppFailedMessagesPanel({
  managedConnectionId = "",
}: {
  managedConnectionId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<FailedWhatsAppRow[]>([]);
  const [direction, setDirection] = useState<"" | "inbound" | "outbound">("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [phoneOptions, setPhoneOptions] = useState<WhatsAppInboxConnection[]>(
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await adminCrmApi.whatsappInboxConnections();
        if (cancelled) return;
        setPhoneOptions(
          (data.connections || []).filter((c: WhatsAppInboxConnection) =>
            Boolean(c.phoneNumberId)
          )
        );
      } catch {
        if (!cancelled) setPhoneOptions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await adminCrmApi.whatsappFailedMessages({
        managedConnectionId: managedConnectionId
          ? normalizeManagedConnectionId(managedConnectionId)
          : undefined,
        phoneNumberId: phoneNumberId || undefined,
        direction: direction || undefined,
        limit: 40,
      });
      setItems(data.items || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || "טעינת הודעות שנכשלו נכשלה");
    } finally {
      setLoading(false);
    }
  }, [direction, managedConnectionId, phoneNumberId]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  return (
    <div className="mt-2 rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="text-[11px] font-black text-rose-800"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "הסתר Failed Messages" : "Failed Messages"}
        </button>
        {open ? (
          <div className="flex flex-wrap items-center gap-1">
            {(["", "outbound", "inbound"] as const).map((dir) => (
              <button
                key={dir || "all"}
                type="button"
                onClick={() => setDirection(dir)}
                className={[
                  "rounded-full px-2 py-0.5 text-[10px] font-black",
                  direction === dir
                    ? "bg-rose-700 text-white"
                    : "bg-white text-rose-800 ring-1 ring-rose-200",
                ].join(" ")}
              >
                {dir === "" ? "All" : dir === "outbound" ? "Sent" : "Received"}
              </button>
            ))}
            <SecondaryButton
              className="!min-h-7 !rounded-lg !px-2 !text-[10px]"
              onClick={() => void load()}
              disabled={loading}
            >
              רענון
            </SecondaryButton>
          </div>
        ) : null}
      </div>
      {open ? (
        <div className="mt-2 space-y-2">
          {phoneOptions.length ? (
            <label className="block text-[10px] font-bold text-rose-800" dir="ltr">
              WhatsApp number
              <select
                className="mt-1 min-h-8 w-full rounded-lg border border-rose-200 bg-white px-2 text-[11px] font-bold text-[#111b21]"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
              >
                <option value="">All numbers</option>
                {phoneOptions.map((opt) => (
                  <option
                    key={opt.phoneNumberId}
                    value={opt.phoneNumberId || ""}
                  >
                    {opt.phoneNumberLabel ||
                      `${connectionBadgeLabel(opt)} ${
                        opt.businessPhoneNumber ||
                        opt.businessDisplayPhone ||
                        opt.phoneNumberId
                      }`}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="max-h-56 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="text-[11px] font-bold text-rose-700">טוען…</p>
            ) : null}
            {error ? (
              <p className="text-[11px] font-bold text-rose-700">{error}</p>
            ) : null}
            {!loading && !items.length ? (
              <p className="text-[11px] font-bold text-rose-700/80">
                אין הודעות שנכשלו בסינון הנוכחי
              </p>
            ) : null}
            {items.map((row) => (
              <div
                key={row.id}
                className="rounded-lg border border-rose-100 bg-white px-2.5 py-2 text-[11px] text-[#111b21]"
                dir="ltr"
              >
                <div className="flex flex-wrap items-center gap-1.5 font-black">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5">
                    {row.connectionFlag || ""}{" "}
                    {connectionBadgeLabel({
                      connectionBadge: row.connectionBadge,
                      managedConnectionId: row.managedConnectionId,
                    }) || row.connection || "—"}
                  </span>
                  <span className="text-[#667781]">
                    {formatWhen(row.failedAt)}
                  </span>
                </div>
                <p className="mt-1">
                  <span className="font-bold text-[#667781]">Sent from:</span>{" "}
                  {row.sentFrom || row.businessPhoneNumber || "—"}
                </p>
                <p>
                  <span className="font-bold text-[#667781]">Customer:</span>{" "}
                  {row.customerName || "—"} {row.customerPhone || ""}
                </p>
                <p>
                  <span className="font-bold text-[#667781]">Connection:</span>{" "}
                  {row.connection || row.managedConnectionId || "—"}
                </p>
                {row.phoneNumberLabel || row.phoneNumberId ? (
                  <p>
                    <span className="font-bold text-[#667781]">Number:</span>{" "}
                    {row.phoneNumberLabel || row.phoneNumberId}
                  </p>
                ) : null}
                <p className="mt-1 break-words font-bold text-rose-700">
                  Meta error: {row.metaError || "failed"}
                </p>
                {row.bodyPreview ? (
                  <p className="mt-1 line-clamp-2 text-[#54656f]">
                    {row.bodyPreview}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
