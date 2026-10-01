import React, { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import adminCrmApi from "../../../api/adminCrmApi";
import AdminSendGuidedDemoModal from "../AdminSendGuidedDemoModal";
import { preferredLocaleFromConnectionCountry } from "../../../guidedDemo/adminSendForm";
import {
  Badge,
  SOURCE_LABELS,
  WHATSAPP_INBOX_STATUS_LABELS,
  waitingTimeLabel,
} from "./adminCrmLabels";
import { ErrorState, LoadingState, SecondaryButton } from "./AdminCrmUi";
import WhatsAppFailedMessagesPanel from "./WhatsAppFailedMessagesPanel";
import WhatsAppWebThread from "./whatsappWeb/WhatsAppWebThread";
import { WhatsAppContactDialog, type WhatsAppContactDraft } from "./whatsappWeb/WhatsAppContactDialog";
import { WhatsAppNewMessageDialog } from "./whatsappWeb/WhatsAppNewMessageDialog";
import { WhatsAppContactPanel } from "./whatsappWeb/WhatsAppContactPanel";
import { conversationIdentity } from "./whatsappWeb/conversationIdentity";
import { useAdminWhatsAppCopy } from "./whatsappWeb/adminWhatsAppInboxCopy";
import { useVisualViewportFrame } from "./whatsappWeb/useVisualViewportFrame";
import { useAdminCrmWhatsAppRealtime } from "./whatsappWeb/useAdminCrmWhatsAppRealtime";
import {
  bumpThreadList,
  connectionBadgeLabel,
  connectionChipLabel,
  FALLBACK_INBOX_CONNECTIONS,
  listTimeLabel,
  normalizeManagedConnectionId,
  threadRowKey,
  type PublicWhatsAppThread,
  type WhatsAppInboxConnection,
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

/** Empty string = All connections. */
type ConnectionFilter = "" | string;

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
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>("");
  const [phoneNumberFilter, setPhoneNumberFilter] = useState("");
  const [connections, setConnections] = useState<WhatsAppInboxConnection[]>(
    FALLBACK_INBOX_CONNECTIONS
  );
  const [selected, setSelected] = useState<InboxItem | null>(null);
  const [banner, setBanner] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoPrefill, setDemoPrefill] = useState<{
    managedConnectionId?: string | null;
    phone?: string | null;
    contactName?: string | null;
  } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSummary, setSyncSummary] = useState<WhatsAppSyncSummary | null>(null);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);
  const [contactError, setContactError] = useState("");
  const { copy, dir } = useAdminWhatsAppCopy();
  const [narrow, setNarrow] = useState(false);
  const viewport = useVisualViewportFrame(mobileChat && narrow);

  const load = useCallback(
    async (
      nextUnresolved = unresolvedOnly,
      q = query,
      nextConnection: ConnectionFilter = connectionFilter,
      nextPhoneNumberId = phoneNumberFilter
    ) => {
      setLoading(true);
      setError("");
      try {
        const managedConnectionId = nextConnection
          ? normalizeManagedConnectionId(nextConnection)
          : undefined;
        const { data } = await adminCrmApi.whatsappInbox({
          unresolved: nextUnresolved ? "true" : undefined,
          q: q || undefined,
          limit: 500,
          managedConnectionId,
          phoneNumberId: nextPhoneNumberId || undefined,
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
              ? threadRowKey(row) === wantedThread || row.id === wantedThread
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
    [query, unresolvedOnly, connectionFilter, phoneNumberFilter, searchParams]
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  React.useEffect(() => {
    if (!mobileChat || !narrow) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileChat, narrow]);

  React.useEffect(() => {
    load();
    adminCrmApi
      .meta()
      .then(({ data }) => setPerms(data.permissions || {}))
      .catch(() => null);
    adminCrmApi
      .whatsappInboxConnections()
      .then(({ data }) => {
        const rows = (data.connections || []) as WhatsAppInboxConnection[];
        if (rows.length) setConnections(rows);
      })
      .catch(() => null);
  }, []);

  useAdminCrmWhatsAppRealtime({
    onMessage: (payload) => {
      if (!payload.thread?.id) {
        void load(unresolvedOnly, query, connectionFilter, phoneNumberFilter);
        return;
      }
      const eventConn = normalizeManagedConnectionId(
        payload.thread.managedConnectionId
      );
      const filterConn = normalizeManagedConnectionId(connectionFilter);
      if (filterConn && eventConn && filterConn !== eventConn) {
        return;
      }
      if (
        phoneNumberFilter &&
        payload.thread.phoneNumberId &&
        String(payload.thread.phoneNumberId) !== phoneNumberFilter
      ) {
        return;
      }
      setItems((prev) => {
        const existing = prev.find(
          (row) => threadRowKey(row) === threadRowKey(payload.thread!)
        );
        return bumpThreadList(prev, {
          ...(existing || {}),
          ...payload.thread,
          name: existing?.companyName || existing?.name || payload.thread.name,
          companyName: existing?.companyName || payload.thread.companyName,
          contactPersonName: existing?.contactPersonName || payload.thread.contactPersonName,
          contactSaved: existing?.contactSaved || payload.thread.contactSaved,
          contactId: existing?.contactId || payload.thread.contactId,
          email: existing?.email || payload.thread.email,
          country: existing?.country || payload.thread.country,
          notes: existing?.notes || payload.thread.notes,
          whatsappProfileName:
            payload.thread.whatsappProfileName || existing?.whatsappProfileName,
          phone: existing?.phone || payload.thread.phone,
          adminCustomerId:
            existing?.adminCustomerId ||
            payload.adminCustomerId ||
            payload.thread.adminCustomerId,
          managedConnectionId:
            existing?.managedConnectionId ||
            payload.thread.managedConnectionId ||
            "",
          hasConversation: true,
          lastMessage: payload.message?.bodyPreview || payload.thread.lastMessage,
          lastMessageAt: payload.message?.timestamp || payload.thread.lastMessageAt,
          unreadCount:
            selected && threadRowKey(selected) === threadRowKey(payload.thread)
              ? 0
              : payload.thread.unreadCount ?? existing?.unreadCount ?? 0,
        });
      });
      if (
        payload.message?.direction === "inbound" &&
        (!selected || threadRowKey(selected) !== threadRowKey(payload.thread))
      ) {
        setUnreadTotal((n) => n + 1);
      }
    },
    onThread: (payload) => {
      if (!payload.thread?.id) return;
      const eventConn = normalizeManagedConnectionId(
        payload.thread.managedConnectionId
      );
      const filterConn = normalizeManagedConnectionId(connectionFilter);
      if (filterConn && eventConn && filterConn !== eventConn) {
        return;
      }
      if (
        phoneNumberFilter &&
        payload.thread.phoneNumberId &&
        String(payload.thread.phoneNumberId) !== phoneNumberFilter
      ) {
        return;
      }
      setItems((prev) => {
        const existing = prev.find(
          (row) => threadRowKey(row) === threadRowKey(payload.thread!)
        );
        return bumpThreadList(prev, {
          ...(existing || {}),
          ...payload.thread,
          name: existing?.companyName || existing?.name || payload.thread.name,
          companyName: existing?.companyName || payload.thread.companyName,
          contactPersonName: existing?.contactPersonName || payload.thread.contactPersonName,
          contactSaved: existing?.contactSaved || payload.thread.contactSaved,
          contactId: existing?.contactId || payload.thread.contactId,
          email: existing?.email || payload.thread.email,
          country: existing?.country || payload.thread.country,
          notes: existing?.notes || payload.thread.notes,
          whatsappProfileName:
            payload.thread.whatsappProfileName || existing?.whatsappProfileName,
          phone: existing?.phone || payload.thread.phone,
          adminCustomerId:
            existing?.adminCustomerId ||
            payload.adminCustomerId ||
            payload.thread.adminCustomerId,
          managedConnectionId:
            existing?.managedConnectionId ||
            payload.thread.managedConnectionId ||
            "",
          hasConversation: Boolean(
            payload.thread.lastMessageAt ||
              payload.thread.lastMessage ||
              existing?.hasConversation
          ),
        });
      });
    },
    onReconnect: () => {
      void load(unresolvedOnly, query, connectionFilter, phoneNumberFilter);
    },
  });

  async function saveContact(draft: WhatsAppContactDraft) {
    setContactSaving(true);
    setContactError("");
    try {
      const payload = {
        companyName: draft.companyName,
        contactPersonName: draft.contactPersonName,
        phone: draft.phone,
        email: draft.email,
        country: draft.country,
        notes: draft.notes,
        whatsappProfileName: draft.whatsappProfileName || selected?.whatsappProfileName || "",
      };
      const { data } = draft.id
        ? await adminCrmApi.updateWhatsAppContact(draft.id, payload)
        : await adminCrmApi.createWhatsAppContact(payload);
      const contact = data.contact;
      setItems((prev) =>
        prev.map((row) =>
          row.phone && contact.phone && threadRowKey(row) === threadRowKey(selected || row) &&
          (row.contactId === contact.id || row.phone === selected?.phone || row.id === selected?.id)
            ? {
                ...row,
                contactSaved: true,
                contactId: contact.id,
                companyName: contact.companyName,
                contactPersonName: contact.contactPersonName,
                phone: contact.phone || row.phone,
                email: contact.email,
                country: contact.country,
                notes: contact.notes,
                adminCustomerId: contact.adminCustomerId || row.adminCustomerId,
                name: contact.companyName,
              }
            : row
        )
      );
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              contactSaved: true,
              contactId: contact.id,
              companyName: contact.companyName,
              contactPersonName: contact.contactPersonName,
              phone: contact.phone || prev.phone,
              email: contact.email,
              country: contact.country,
              notes: contact.notes,
              adminCustomerId: contact.adminCustomerId || prev.adminCustomerId,
              name: contact.companyName,
            }
          : prev
      );
      setContactOpen(false);
      setBanner(copy.contactSavedBanner);
      void load(unresolvedOnly, query, connectionFilter, phoneNumberFilter);
    } catch (err: any) {
      const code = err?.response?.data?.code;
      setContactError(code === "DUPLICATE_PHONE" ? copy.duplicatePhone : err?.response?.data?.error || copy.sendFailed);
    } finally {
      setContactSaving(false);
    }
  }

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
      await load(unresolvedOnly, query, connectionFilter);
    } catch (err: any) {
      setError(err?.response?.data?.error || "סנכרון שיחות WhatsApp נכשל");
    } finally {
      setSyncing(false);
    }
  }

  function selectConnection(next: ConnectionFilter) {
    setConnectionFilter(next);
    setSelected(null);
    setMobileChat(false);
    void load(unresolvedOnly, query, next, phoneNumberFilter);
  }

  function selectPhoneNumber(nextPhoneNumberId: string) {
    setPhoneNumberFilter(nextPhoneNumberId);
    setSelected(null);
    setMobileChat(false);
    void load(unresolvedOnly, query, connectionFilter, nextPhoneNumberId);
  }

  const phoneNumberOptions = useMemo(
    () => connections.filter((c) => Boolean(c.phoneNumberId)),
    [connections]
  );

  const filtered = useMemo(() => items, [items]);
  const selectedKey = selected ? threadRowKey(selected) : "";

  if (loading && !items.length) return <LoadingState />;
  if (error && !items.length) return <ErrorState message={error} onRetry={() => load()} />;

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-purple-100 bg-white shadow-[0_18px_50px_rgba(124,77,255,0.06)]"
      dir={dir}
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
              <h2 className="text-base font-black text-[#111b21]">{copy.conversations}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="min-h-10 rounded-full bg-[#7C4DFF] px-3 text-xs font-black text-white"
                  onClick={() => setNewMessageOpen(true)}
                >
                  {copy.newMessage}
                </button>
                <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-700">{unreadTotal}</span>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-black text-amber-800">{unresolvedTotal}</span>
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5" dir="ltr">
              <button
                type="button"
                onClick={() => selectConnection("")}
                className={[
                  "rounded-full px-2.5 py-1 text-[11px] font-black transition",
                  !connectionFilter
                    ? "bg-[#111b21] text-white"
                    : "bg-white text-[#54656f] ring-1 ring-[#d1d7db] hover:bg-[#f5f6f6]",
                ].join(" ")}
              >
                {copy.allConnections}
              </button>
              {connections.map((conn) => {
                const id = normalizeManagedConnectionId(conn.managedConnectionId);
                const active = connectionFilter === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => selectConnection(id)}
                    className={[
                      "rounded-full px-2.5 py-1 text-[11px] font-black transition",
                      active
                        ? "bg-[#111b21] text-white"
                        : "bg-white text-[#54656f] ring-1 ring-[#d1d7db] hover:bg-[#f5f6f6]",
                    ].join(" ")}
                    title={conn.connectionLabel || id}
                  >
                    {connectionChipLabel(conn) || connectionBadgeLabel(conn)}
                  </button>
                );
              })}
            </div>
            {phoneNumberOptions.length ? (
              <label className="mb-2 block text-[10px] font-bold text-[#667781]" dir="ltr">
                WhatsApp number
                <select
                  className="mt-1 min-h-9 w-full rounded-lg border-none bg-white px-2 text-[12px] font-bold text-[#111b21] outline-none"
                  value={phoneNumberFilter}
                  onChange={(e) => selectPhoneNumber(e.target.value)}
                >
                  <option value="">All numbers</option>
                  {phoneNumberOptions.map((opt) => (
                    <option key={opt.phoneNumberId} value={opt.phoneNumberId || ""}>
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
            <input
              className="min-h-10 w-full rounded-lg border-none bg-white px-3 text-sm outline-none"
              placeholder={copy.searchConversations}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  void load(unresolvedOnly, query, connectionFilter, phoneNumberFilter);
              }}
            />
            <div className="mt-2 flex gap-2">
              <SecondaryButton
                className="!min-h-9 !rounded-lg !px-3 !text-xs"
                onClick={() => {
                  const next = !unresolvedOnly;
                  setUnresolvedOnly(next);
                  void load(next, query, connectionFilter, phoneNumberFilter);
                }}
              >
                {unresolvedOnly ? "כל השיחות" : "לא משויכות"}
              </SecondaryButton>
              <SecondaryButton
                className="!min-h-9 !rounded-lg !px-3 !text-xs"
                onClick={() =>
                  void load(unresolvedOnly, query, connectionFilter, phoneNumberFilter)
                }
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
            <WhatsAppFailedMessagesPanel managedConnectionId={connectionFilter} />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {!filtered.length ? (
              <p className="px-4 py-16 text-center text-sm font-bold text-slate-400">{copy.noConversations}</p>
            ) : (
              filtered.map((row) => {
                const rowKey = threadRowKey(row);
                const active = Boolean(selectedKey && rowKey && selectedKey === rowKey);
                const badge = connectionBadgeLabel(row);
                const identity = conversationIdentity(row);
                return (
                  <button
                    key={rowKey || row.id}
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
                          threadRowKey(item) === rowKey
                            ? { ...item, unreadCount: 0 }
                            : item
                        )
                      );
                    }}
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#dfe5e7] text-sm font-black text-[#54656f]">
                      {(identity.title || "?").slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-[16px] font-black text-[#111b21]">{identity.title || copy.phone}</p>
                        <span className="shrink-0 text-[12px] text-[#667781]">
                          {listTimeLabel(row.lastMessageAt)}
                        </span>
                      </div>
                      {identity.person ? (
                        <p className="truncate text-[13px] font-bold text-[#111b21]">{identity.person}</p>
                      ) : null}
                      <div className="mt-0.5 flex flex-wrap items-center gap-1">
                        {badge ? (
                          <span
                            className="inline-flex items-center gap-1 rounded-md bg-[#e9edef] px-1.5 py-0.5 text-[10px] font-black tracking-wide text-[#111b21]"
                            dir="ltr"
                            title={row.connectionLabel || badge}
                          >
                            {row.connectionFlag ? (
                              <span aria-hidden>{row.connectionFlag}</span>
                            ) : null}
                            {badge}
                          </span>
                        ) : null}
                        {row.businessDisplayPhone || row.connectionLabel ? (
                          <span
                            className="truncate text-[11px] font-bold text-[#667781]"
                            dir="ltr"
                          >
                            {row.businessDisplayPhone || row.connectionLabel}
                          </span>
                        ) : null}
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
                        {identity.phone || row.phone || "—"}
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
            "min-h-0 min-w-0 w-full flex-1 flex-col bg-[#efeae2]",
            mobileChat ? "flex" : "hidden lg:flex",
            mobileChat && narrow ? "fixed z-40" : "",
          ].join(" ")}
          style={
            mobileChat && narrow && viewport
              ? { top: viewport.top, height: viewport.height, left: 0, right: 0 }
              : undefined
          }
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
              contactName={selected.whatsappProfileName || selected.name}
              companyName={selected.companyName}
              contactPersonName={selected.contactPersonName}
              contactSaved={Boolean(selected.contactSaved)}
              contactId={selected.contactId}
              whatsappProfileName={selected.whatsappProfileName}
              initialManagedConnectionId={selected.managedConnectionId || null}
              threadConnection={{
                managedConnectionId: selected.managedConnectionId,
                phoneNumberId: selected.phoneNumberId,
                businessDisplayPhone: selected.businessDisplayPhone,
                connectionLabel: selected.connectionLabel,
                connectionCountry: selected.connectionCountry,
                connectionFlag: selected.connectionFlag,
                connectionBadge: selected.connectionBadge,
                wabaId: selected.wabaId,
                sendFromLabel: selected.sendFromLabel,
                receivedOnLabel: selected.receivedOnLabel,
              }}
              canSend={Boolean(perms.whatsappSend || perms.conversationsReply)}
              canTemplates={Boolean(perms.whatsappTemplates)}
              canDemo={perms.demoSend !== false}
              onBanner={setBanner}
              onBack={() => setMobileChat(false)}
              onAddContact={() => {
                setContactError("");
                setContactOpen(true);
              }}
              onOpenSendDemo={(prefill) => {
                setDemoPrefill(prefill || null);
                setDemoOpen(true);
              }}
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
        {selected ? (
          <WhatsAppContactPanel
            row={selected}
            copy={copy}
            onAdd={() => {
              setContactError("");
              setContactOpen(true);
            }}
            onEdit={() => {
              setContactError("");
              setContactOpen(true);
            }}
          />
        ) : null}
      </div>

      <AdminSendGuidedDemoModal
        open={demoOpen}
        onClose={() => {
          setDemoOpen(false);
          setDemoPrefill(null);
        }}
        context={{
          customerName:
            demoPrefill?.contactName || selected?.name || "",
          phone: demoPrefill?.phone || selected?.phone || "",
          sourceType: "manual",
          sourceCustomerId: selected?.adminCustomerId || "",
          managedConnectionId:
            normalizeManagedConnectionId(
              demoPrefill?.managedConnectionId || selected?.managedConnectionId
            ) || undefined,
          preferredLocale:
            preferredLocaleFromConnectionCountry(selected?.connectionCountry) ||
            undefined,
        }}
      />
      <WhatsAppNewMessageDialog
        open={newMessageOpen}
        copy={copy}
        dir={dir}
        connections={connections}
        onClose={() => setNewMessageOpen(false)}
        onSent={() => {
          setNewMessageOpen(false);
          setBanner(copy.messageSent);
          void load(unresolvedOnly, query, connectionFilter, phoneNumberFilter);
        }}
      />
      <WhatsAppContactDialog
        open={contactOpen}
        copy={copy}
        dir={dir}
        saving={contactSaving}
        error={contactError}
        initial={
          selected
            ? {
                id: selected.contactId || undefined,
                companyName: selected.companyName || "",
                contactPersonName: selected.contactPersonName || "",
                phone: selected.phone || "",
                email: selected.email || "",
                country: selected.country || "",
                notes: selected.notes || "",
                whatsappProfileName: selected.whatsappProfileName || "",
              }
            : null
        }
        onClose={() => setContactOpen(false)}
        onSave={(draft) => void saveContact(draft)}
      />
    </div>
  );
}
