import React, { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAi } from "../context/AiContext";

type AiSuggestion = {
  id: string;
  text?: string;
  conversationId?: string;
};

type AiModalProps = {
  loading?: boolean;
  activeSuggestion?: AiSuggestion | null;
  approveSuggestion?: (id: string, text: string) => Promise<void> | void;
  rejectSuggestion?: (id: string) => Promise<void> | void;
  closeModal?: () => void;
};

export default function AiModal(props: AiModalProps) {
  const aiContext = useAi() as {
    activeSuggestion?: AiSuggestion | null;
    approveSuggestion: (id: string, text: string) => Promise<void> | void;
    rejectSuggestion: (id: string) => Promise<void> | void;
    closeModal: () => void;
    loading?: boolean;
  };

  const activeSuggestion =
    props.activeSuggestion ?? aiContext.activeSuggestion ?? null;

  const approveSuggestion =
    props.approveSuggestion ?? aiContext.approveSuggestion;

  const rejectSuggestion =
    props.rejectSuggestion ?? aiContext.rejectSuggestion;

  const closeModal = props.closeModal ?? aiContext.closeModal;

  const loading = props.loading ?? aiContext.loading ?? false;

  const location = useLocation();
  const navigate = useNavigate();

  const [editedText, setEditedText] = useState("");

  const isBusinessManagementTab =
    location.pathname.startsWith("/business/") &&
    (location.pathname.includes("/dashboard") ||
      location.pathname.includes("/chat"));

  useEffect(() => {
    if (activeSuggestion) {
      setEditedText(activeSuggestion.text || "");
    }
  }, [activeSuggestion]);

  if (!activeSuggestion || !isBusinessManagementTab) return null;

  const handleApprove = async () => {
    await approveSuggestion(activeSuggestion.id, editedText);
    closeModal();

    if (activeSuggestion.conversationId) {
      navigate(`/business/chat/${activeSuggestion.conversationId}`);
    }
  };

  const handleReject = async () => {
    await rejectSuggestion(activeSuggestion.id);
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={closeModal}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-6 text-white">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white backdrop-blur">
                <Bot className="h-7 w-7" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-sky-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Recommendation
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight">
                  New AI Message
                </h2>

                <p className="mt-1 max-w-xl text-sm font-semibold leading-6 text-sky-100/90">
                  Review, edit and approve the suggested response before sending
                  it to the customer.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <label className="block">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-sky-900" />
                <span className="text-sm font-black text-slate-900">
                  Suggested message
                </span>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-900">
                Editable
              </span>
            </div>

            <textarea
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
              spellCheck={false}
              rows={8}
              className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              placeholder="AI message..."
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-rose-50 px-5 text-sm font-black text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-5 w-5" />
              Reject
            </button>

            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-5 w-5" />
              Close
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={loading || !editedText.trim()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 text-sm font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-sky-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              {loading ? "Sending..." : "Approve & Send"}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            The message will only be sent after approval.
          </div>
        </div>
      </div>
    </div>
  );
}