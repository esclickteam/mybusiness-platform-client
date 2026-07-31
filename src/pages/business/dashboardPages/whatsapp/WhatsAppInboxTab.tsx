import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Loader2, Send, Trash2 } from "lucide-react";
import {
  clearWhatsAppConversation,
  listWhatsAppConversationMessages,
  listWhatsAppConversations,
  replyWhatsAppConversation,
  type WhatsAppConversation,
  type WhatsAppMessageLog,
} from "../../../../api/whatsappApi";
import {
  btnPrimary,
  btnSecondary,
  cardBase,
  inputBase,
} from "../../../../styles/bizuplyUi";

type OutletCtx = { businessId: string | null };

function statusClass(status: string) {
  if (status === "sent" || status === "delivered" || status === "read" || status === "received") {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "failed") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

export default function WhatsAppInboxTab() {
  const { t } = useTranslation();
  const { businessId } = useOutletContext<OutletCtx>();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<WhatsAppConversation[]>(
    []
  );
  const [selectedPhone, setSelectedPhone] = useState("");
  const [messages, setMessages] = useState<WhatsAppMessageLog[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);

  const loadConversations = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const rows = await listWhatsAppConversations(businessId);
      setConversations(rows);
      if (!selectedPhone && rows[0]?.phone) {
        setSelectedPhone(rows[0].phone);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.loadInbox")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  useEffect(() => {
    if (!businessId || !selectedPhone) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingMessages(true);
        const rows = await listWhatsAppConversationMessages(
          businessId,
          selectedPhone
        );
        if (!cancelled) setMessages(rows);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || t("whatsapp.errors.loadInbox")
        );
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId, selectedPhone, t]);

  const handleReply = async () => {
    if (!businessId || !selectedPhone || !reply.trim()) return;
    try {
      setSending(true);
      const result = await replyWhatsAppConversation(
        businessId,
        selectedPhone,
        { body: reply.trim() }
      );
      if (!result?.providerMessageId) {
        toast.error(t("whatsapp.errors.replyFailed"));
        return;
      }
      setReply("");
      const rows = await listWhatsAppConversationMessages(
        businessId,
        selectedPhone
      );
      setMessages(rows);
      await loadConversations();
      toast.success(t("whatsapp.inbox.replySent"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.replyFailed")
      );
    } finally {
      setSending(false);
    }
  };

  const handleClearConversation = async () => {
    if (!businessId || !selectedPhone) return;
    if (!window.confirm(t("whatsapp.inbox.confirmClear"))) return;
    try {
      setClearing(true);
      await clearWhatsAppConversation(businessId, selectedPhone);
      setMessages([]);
      setReply("");
      const rows = await listWhatsAppConversations(businessId);
      setConversations(rows);
      setSelectedPhone(rows[0]?.phone || "");
      toast.success(t("whatsapp.inbox.cleared"));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || t("whatsapp.errors.clearConversation")
      );
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <div className={`${cardBase} flex items-center justify-center gap-2 p-10`}>
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        <span className="text-sm font-semibold text-slate-600">
          {t("whatsapp.loading")}
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.3fr]">
      <section className={`${cardBase} overflow-hidden`}>
        <div className="border-b border-slate-100 px-4 py-4">
          <h2 className="text-lg font-black text-slate-900">
            {t("whatsapp.inbox.title")}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {t("whatsapp.inbox.subtitle")}
          </p>
        </div>
        <div className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="px-4 py-12 text-center text-sm font-medium text-slate-400">
              {t("whatsapp.inbox.empty")}
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.phone}
                type="button"
                onClick={() => setSelectedPhone(conv.phone)}
                className={[
                  "w-full px-4 py-3 text-start transition",
                  selectedPhone === conv.phone
                    ? "bg-emerald-50"
                    : "hover:bg-slate-50",
                ].join(" ")}
              >
                <p className="text-sm font-black text-slate-900">
                  {conv.recipientName || conv.phone}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                  {conv.lastBody || "—"}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-400">
                  {conv.lastMessageAt
                    ? new Date(conv.lastMessageAt).toLocaleString()
                    : ""}
                </p>
              </button>
            ))
          )}
        </div>
      </section>

      <section className={`${cardBase} flex min-h-[420px] flex-col`}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900">
              {selectedPhone
                ? conversations.find((c) => c.phone === selectedPhone)
                    ?.recipientName || selectedPhone
                : t("whatsapp.inbox.selectConversation")}
            </h3>
            {selectedPhone && (
              <p className="mt-0.5 text-xs font-semibold text-slate-500" dir="ltr">
                {selectedPhone}
              </p>
            )}
          </div>
          {selectedPhone && (
            <button
              type="button"
              className={btnSecondary}
              disabled={clearing}
              onClick={() => {
                void handleClearConversation();
              }}
            >
              {clearing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              {clearing
                ? t("whatsapp.inbox.clearing")
                : t("whatsapp.inbox.clearConversation")}
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto bg-[#ECE5DD] p-4">
          {loadingMessages ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("whatsapp.loading")}
            </div>
          ) : messages.length === 0 ? (
            <p className="py-10 text-center text-sm font-medium text-slate-500">
              {t("whatsapp.inbox.noMessages")}
            </p>
          ) : (
            messages.map((msg) => {
              const outbound = msg.direction !== "inbound";
              return (
                <div
                  key={msg._id}
                  className={[
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    outbound
                      ? "ms-auto rounded-ee-md bg-[#DCF8C6] text-slate-800"
                      : "me-auto rounded-es-md bg-white text-slate-800",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap font-medium">
                    {msg.body || "—"}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <span>
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleString()
                        : ""}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 ${statusClass(msg.status)}`}
                    >
                      {t(`whatsapp.history.status.${msg.status}`, {
                        defaultValue: msg.status,
                      })}
                    </span>
                    {msg.providerMessageId && (
                      <span className="font-mono" dir="ltr">
                        {msg.providerMessageId}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-100 p-4">
          <p className="mb-2 text-xs font-medium text-slate-500">
            {t("whatsapp.inbox.sessionHint")}
          </p>
          <div className="flex gap-2">
            <input
              className={inputBase}
              value={reply}
              disabled={!selectedPhone || sending}
              onChange={(e) => setReply(e.target.value)}
              placeholder={t("whatsapp.inbox.replyPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleReply();
                }
              }}
            />
            <button
              type="button"
              className={btnPrimary}
              disabled={!selectedPhone || !reply.trim() || sending}
              onClick={handleReply}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {t("whatsapp.inbox.reply")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
