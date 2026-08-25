import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import AdminSendGuidedDemoModal from "../AdminSendGuidedDemoModal";
import {
  Badge,
  SOURCE_LABELS,
  WHATSAPP_INBOX_STATUS_LABELS,
  waitingTimeLabel,
} from "./adminCrmLabels";
import { ErrorState, LoadingState, SecondaryButton } from "./AdminCrmUi";
import WhatsAppWebThread from "./whatsappWeb/WhatsAppWebThread";
import { useAdminCrmWhatsAppRealtime } from "./whatsappWeb/useAdminCrmWhatsAppRealtime";
import {
  bumpThreadList,
  listTimeLabel,
  type PublicWhatsAppThread,
} from "./whatsappWeb/whatsAppWebMessages";

type InboxItem = PublicWhatsAppThread & {
  assignedAdminName?: string;
};

type WhatsAppSyncSummary = {
  scanned?: number;
  conversations?: number;
  messagesAdded?: number;
  skipped?: number;
  failed?: number;
};

export default function AdminCrmWhatsAppInbox() {
  const [searchParams] = useSearchParams();
  const [perms, setPerms] = useState<any>({});
  const [items, setItems] = useState<InboxItem[]>([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [unresolvedTotal, setUnresolvedTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unresolvedOnly, setUnresolvedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<InboxItem | null>(null);
  const [banner, setBanner] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<WhatsAppSyncSummary | null>(null);

  const load = useCallback(
    async (nextUnresolved = unresolvedOnly, q = query) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await adminCrmApi.whatsappInbox({
          unresolved: nextUnresolved ? "true" : undefined,
          q: q || undefined,
          limit: 500,
        });
        const nextItems = data.items || [];
        setItems(nextItems);
        setUnreadTotal(data.unreadTotal || 0);
        setUnresolvedTotal(data.unresolvedTotal || 0);
        const wantedCustomer = searchParams.get("customer");
        const wantedThread = searchParams.get("thread");
        if ((wantedCustomer || wantedThread) && nextItems.length) {
          const match = nextItems.find((row) =>
            wantedThread
              ? row.id === wantedThread
              : row.adminCustomerId === wantedCustomer
          );
          if (match) {
            setSelected(match);
            setMobileChat(true);
          }
        }
      } catch (err: any) {
        setError(err?.response?.data?.error || "טעינת תיבת WhatsApp נכשלה");
      } finally {
        setLoading(false);
      }
    },
    [query, unresolvedOnly, searchParams]
  );

  React.useEffect(() => {
    load();
    adminCrmApi.meta().then(({ data }) => setPerms(data.permissions || {})).catch(() => null);
  }, []);

  useAdminCrmWhatsAppRealtime({
    onMessage: (payload) => {
      if (!payload.thread?.id) {
        void load(unresolvedOnly, query);
        return;
      }
      setItems((prev) => {
        const existing =
          prev.find((row) => row.id === payload.thread!.id) ||
          prev.find(
            (row) =>
              payload.adminCustomerId &&
              row.adminCustomerId === payload.adminCustomerId
          );
        return bumpThreadList(prev, {
          ...(existing || {}),
          ...payload.thread,
          name: existing?.name || payload.thread.name,
          phone: existing?.phone || payload.thread.phone,
          adminCustomerId:
            existing?.adminCustomerId ||
            payload.adminCustomerId ||
            payload.thread.adminCustomerId,
          hasConversation: true,
          lastMessage: payload.message?.bodyPreview || payload.thread.lastMessage,
          lastMessageAt: payload.message?.timestamp || payload.thread.lastMessageAt,
          unreadCount:
            selected?.id === payload.thread.id ||
            selected?.adminCustomerId === payload.adminCustomerId
              ? 0
              : payload.thread.unreadCount ?? existing?.unreadCount ?? 0,
        });
      });
      if (payload.message?.direction === "inbound" && selected?.id !== payload.thread.id) {
        setUnreadTotal((n) => n + 1);
      }
    },
    onThread: (payload) => {
      if (!payload.thread?.id) return;
      setItems((prev) => {
        const existing =
          prev.find((row) => row.id === payload.thread!.id) ||
          prev.find(
            (row) =>
              payload.adminCustomerId &&
              row.adminCustomerId === payload.adminCustomerId
          );
        return bumpThreadList(prev, {
          ...(existing || {}),
          ...payload.thread,
          name: existing?.name || payload.thread.name,
          phone: existing?.phone || payload.thread.phone,
          adminCustomerId:
            existing?.adminCustomerId ||
            payload.adminCustomerId ||
            payload.thread.adminCustomerId,
          hasConversation: Boolean(
            payload.thread.lastMessageAt ||
              payload.thread.lastMessage ||
              existing?.hasConversation
          ),
        });
      });
    },
    onReconnect: () => {
      void load(unresolvedOnly, query);
    },
  });

  async function syncConversations() {
    setSyncing(true);
    setError("");
    try {
      const { data } = await adminCrmApi.whatsappSync();
      const summary: WhatsAppSyncSummary = data.sync || data;
      setSyncSummary(summary);
      const created = Number(summary.messagesAdded || 0);
      const skipped = Number(summary.skipped || 0);
      const conversations = Number(summary.conversations || 0);
      const failed = Number(summary.failed || 0);
      setBanner(
        failed > 0
          ? `הסנכרון הושלם — ${conversations} שיחות, ${created} הודעות נוספו, ${skipped} כבר היו קיימות. נכשלו ${failed}.`
          : `הסנכרון הושלם — ${conversations} שיחות, ${created} הודעות נוספו, ${skipped} כבר היו קיימות.`
      );
      await load(unresolvedOnly, query);
    } catch (err: any) {
      setError(err?.response?.data?.error || "סנכרון שיחות WhatsApp נכשל");
    } finally {
      setSyncing(false);
    }
  }

  const filtered = useMemo(() => items, [items]);

  if (loading && !items.length) return <LoadingState />;
  if (error && !items.length) return <ErrorState message={error} onRetry={() => load()} />;

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-[0_18px_50px_rgba(124,77,255,0.06)]"
      dir="rtl"
    >
      {banner ? (
        <div className="shrink-0 border-b border-purple-100 bg-violet-50 px-4 py-2 text-sm font-bold text-[#7C4DFF]">
          {banner}
        </div>
      ) : null}
      <div className="flex min-h-0 min-w-0 flex-1">
        <aside
          className={[
            "flex w-full shrink-0 flex-col border-purple-100 bg-white lg:w-[360px] lg:border-s",
            mobileChat ? "hidden lg:flex" : "flex",
          ].join(" ")}
        >
          <div className="border-b border-[#e9edef] bg-[#f0f2f5] px-3 py-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-base font-black text-[#111b21]">שיחות</h2>
              <div className="flex gap-1 text-[11px] font-black">
                <span className="rounded-full bg-violet-50 px-2 py-1 text-violet-700">{unreadTotal}</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-800">{unresolvedTotal}</span>
              </div>
            </div>
            <input
              className="min-h-10 w-full rounded-lg border-none bg-white px-3 text-sm outline-none"
              placeholder="חיפוש או מספר טלפון"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void load(unresolvedOnly, query);
              }}
            />
            <div className="mt-2 flex gap-2">
              <SecondaryButton
                className="!min-h-9 !rounded-lg !px-3 !text-xs"
                onClick={() => {
                  const next = !unresolvedOnly;
                  setUnresolvedOnly(next);
                  void load(next, query);
                }}
              >
                {unresolvedOnly ? "כל השיחות" : "לא משויכות"}
              </SecondaryButton>
              <SecondaryButton
                className="!min-h-9 !rounded-lg !px-3 !text-xs"
                onClick={() => void load(unresolvedOnly, query)}
              >
                חיפוש
              </SecondaryButton>
              <SecondaryButton
                className="!min-h-9 !rounded-lg !px-3 !text-xs"
                onClick={() => void syncConversations()}
                disabled={syncing}
              >
                {syncing ? "מסנכרן שיחות..." : "סנכרון שיחות"}
              </SecondaryButton>
            </div>
            {syncing || syncSummary ? (
              <div className="mt-2 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-[11px] font-bold text-violet-800">
                {syncing ? (
                  <p>מסנכרן שיחות...</p>
                ) : null}
                {syncSummary ? (
                  <p>
                    נסרקו {syncSummary.scanned || 0} לקוחות · נמצאו{" "}
                    {syncSummary.conversations || 0} שיחות · נוספו{" "}
                    {syncSummary.messagesAdded || 0} הודעות · דולגו{" "}
                    {syncSummary.skipped || 0}
                    {Number(syncSummary.failed || 0) > 0
                      ? ` · נכשלו ${syncSummary.failed}`
                      : ""}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {!filtered.length ? (
              <p className="px-4 py-16 text-center text-sm font-bold text-slate-400">אין לקוחות עם מספר טלפון</p>
            ) : (
              filtered.map((row) => {
                const active =
                  selected?.id === row.id ||
                  Boolean(
                    selected?.adminCustomerId &&
                      row.adminCustomerId &&
                      selected.adminCustomerId === row.adminCustomerId
                  );
                return (
                  <button
                    key={row.adminCustomerId || row.id}
                    type="button"
                    className={[
                      "flex w-full items-center gap-3 border-b border-[#e9edef] px-3 py-3 text-right",
                      active ? "bg-[#f0f2f5]" : "bg-white hover:bg-[#f5f6f6]",
                    ].join(" ")}
                    onClick={() => {
                      setSelected(row);
                      setMobileChat(true);
                      setItems((prev) =>
                        prev.map((item) =>
                          item.id === row.id ||
                          (row.adminCustomerId &&
                            item.adminCustomerId === row.adminCustomerId)
                            ? { ...item, unreadCount: 0 }
                            : item
                        )
                      );
                    }}
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#dfe5e7] text-sm font-black text-[#54656f]">
                      {(row.name || "?").slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-[16px] font-black text-[#111b21]">{row.name}</p>
                        <span className="shrink-0 text-[12px] text-[#667781]">
                          {listTimeLabel(row.lastMessageAt)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1">
                        {row.inboxStatus ? (
                          <Badge
                            tone={
                              row.inboxStatus === "waiting_for_staff"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }
                          >
                            {row.inboxStatusLabel ||
                              WHATSAPP_INBOX_STATUS_LABELS[row.inboxStatus] ||
                              row.inboxStatus}
                          </Badge>
                        ) : null}
                        {row.waitingSince && row.inboxStatus === "waiting_for_staff" ? (
                          <span className="text-[11px] font-bold text-amber-800">
                            {waitingTimeLabel(row.waitingSince)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-[12px] font-bold text-slate-500" dir="ltr">
                        {row.phone || "—"}
                        {row.leadSource
                          ? ` · ${SOURCE_LABELS[row.leadSource] || row.leadSource}`
                          : ""}
                        {row.assignedStaffName || row.assignedAdminName
                          ? ` · ${row.assignedStaffName || row.assignedAdminName}`
                          : ""}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] text-[#667781]">
                          {row.hasConversation
                            ? row.lastMessage || "—"
                            : "אין שיחה עדיין"}
                        </p>
                        {row.unreadCount ? (
                          <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#25d366] px-1.5 text-[11px] font-black text-white">
                            {row.unreadCount}
                          </span>
                        ) : null}
                      </div>
                      {row.handoffAckStatus === "failed" && row.handoffAckError ? (
                        <p className="mt-0.5 truncate text-[11px] font-bold text-rose-700">
                          אישור אוטומטי נכשל
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section
          className={[
            "min-h-0 min-w-0 w-full flex-1 flex-col",
            mobileChat ? "flex" : "hidden lg:flex",
          ].join(" ")}
        >
          {selected ? (
            <WhatsAppWebThread
              customerId={selected.adminCustomerId}
              threadId={
                selected.threadId ||
                (selected.id && !String(selected.id).startsWith("customer:")
                  ? selected.id
                  : null)
              }
              phone={selected.phone}
              contactName={selected.name}
              canSend={Boolean(perms.whatsappSend || perms.conversationsReply)}
              canTemplates={Boolean(perms.whatsappTemplates)}
              canDemo={perms.demoSend !== false}
              onBanner={setBanner}
              onBack={() => setMobileChat(false)}
              onOpenSendDemo={() => setDemoOpen(true)}
            />
          ) : (
            <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center bg-[#f0f2f5] text-center">
              <div className="max-w-sm px-6">
                <p className="text-2xl font-black text-[#41525d]">WhatsApp של BizUply</p>
                <p className="mt-3 text-sm font-bold leading-6 text-[#667781]">
                  בחרו שיחה מהרשימה כדי לקרוא ולשלוח הודעות בזמן אמת, כמו ב-WhatsApp Web.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <AdminSendGuidedDemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        context={{
          customerName: selected?.name || "",
          phone: selected?.phone || "",
          sourceType: "manual",
          sourceCustomerId: selected?.adminCustomerId || "",
        }}
      />
    </div>
  );
}
