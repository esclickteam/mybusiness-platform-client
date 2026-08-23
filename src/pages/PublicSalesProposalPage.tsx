import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api";
import ProposalDocumentView from "./admin/crm/proposals/ProposalDocumentView";
import BizuplyLoader from "../components/ui/BizuplyLoader";

const THINKING_OPTIONS = [
  { value: "need_time", label: "צריך עוד זמן" },
  { value: "consult", label: "רוצה להתייעץ" },
  { value: "price", label: "המחיר" },
  { value: "clarification", label: "צריך הבהרה" },
  { value: "other", label: "אחר" },
];

export default function PublicSalesProposalPage() {
  const { token = "" } = useParams<{ token: string }>();
  const [state, setState] = useState<"loading" | "ready" | "expired" | "error">("loading");
  const [proposal, setProposal] = useState<any>(null);
  const [mode, setMode] = useState<"main" | "question" | "thinking" | "done">("main");
  const [question, setQuestion] = useState("");
  const [thinkingReason, setThinkingReason] = useState("need_time");
  const [thinkingNote, setThinkingNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await API.get(`/public/proposals/${encodeURIComponent(token)}`);
        if (!alive) return;
        setProposal(data.proposal);
        setState("ready");
      } catch (err: any) {
        if (!alive) return;
        if (err?.response?.status === 410 || err?.response?.data?.code === "PROPOSAL_EXPIRED") {
          setProposal(err?.response?.data?.proposal || null);
          setState("expired");
        } else setState("error");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  async function accept() {
    setBusy(true);
    try {
      const { data } = await API.post(`/public/proposals/${encodeURIComponent(token)}/accept`);
      setProposal(data.proposal);
      setMode("done");
      setMessage("קיבלנו את הבקשה שלך. ניצור איתך קשר להמשך.");
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "הפעולה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function sendQuestion() {
    setBusy(true);
    try {
      const { data } = await API.post(`/public/proposals/${encodeURIComponent(token)}/question`, {
        text: question,
      });
      setProposal(data.proposal);
      setMode("done");
      setMessage("השאלה התקבלה. נחזור אליך בהקדם.");
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "שליחה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function sendThinking() {
    setBusy(true);
    try {
      const { data } = await API.post(`/public/proposals/${encodeURIComponent(token)}/thinking`, {
        reason: thinkingReason,
        note: thinkingNote,
      });
      setProposal(data.proposal);
      setMode("done");
      setMessage("תודה! נמשיך איתך בקצב שנוח לך.");
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "שליחה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f6fb]" dir="rtl">
        <BizuplyLoader />
      </div>
    );
  }

  if (state === "expired") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f6fb] p-6" dir="rtl">
        <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-slate-900">תוקף ההצעה פג</h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            אם תרצה/י לקבל הצעה מעודכנת, ניתן לפנות אלינו.
          </p>
          <Link to="/contact" className="mt-6 inline-flex rounded-2xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white">
            צרו קשר
          </Link>
        </div>
      </div>
    );
  }

  if (state === "error" || !proposal) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f6fb] p-6" dir="rtl">
        <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-slate-900">ההצעה לא נמצאה</h1>
          <Link to="/contact" className="mt-6 inline-flex rounded-2xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white">
            צרו קשר
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f5ff_0%,#f5f6fb_40%,#ffffff_100%)] px-4 py-8" dir="rtl">
      <ProposalDocumentView
        interactive
        proposal={proposal}
        footer={
          <div className="space-y-3 border-t border-slate-100 pt-6">
            {mode === "main" ? (
              <>
                <button
                  type="button"
                  disabled={busy || proposal.status === "accepted"}
                  onClick={() => void accept()}
                  className="min-h-12 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-base font-black text-white disabled:opacity-60"
                >
                  {proposal.status === "accepted" ? "הבקשה כבר התקבלה" : "אני רוצה להתחיל"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setMode("question")}
                  className="min-h-11 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
                >
                  יש לי שאלה על ההצעה
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setMode("thinking")}
                  className="min-h-11 w-full rounded-2xl text-sm font-bold text-slate-500"
                >
                  אני רוצה לחשוב על זה
                </button>
              </>
            ) : null}

            {mode === "question" ? (
              <div className="space-y-3">
                <label className="block text-sm font-black text-slate-800">
                  מה תרצה/י לשאול?
                  <textarea
                    className="mt-2 min-h-28 w-full rounded-2xl border px-4 py-3 text-sm"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={busy || !question.trim()}
                  onClick={() => void sendQuestion()}
                  className="min-h-11 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
                >
                  שליחת שאלה
                </button>
                <button type="button" onClick={() => setMode("main")} className="w-full text-sm font-bold text-slate-500">
                  חזרה
                </button>
              </div>
            ) : null}

            {mode === "thinking" ? (
              <div className="space-y-3">
                <p className="text-sm font-black text-slate-800">מה יעזור לך להחליט?</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {THINKING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setThinkingReason(opt.value)}
                      className={[
                        "min-h-11 rounded-2xl border px-3 py-2 text-sm font-black",
                        thinkingReason === opt.value
                          ? "border-[#6D28D9] bg-[#6D28D9]/5 text-[#6D28D9]"
                          : "border-slate-200",
                      ].join(" ")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <textarea
                  className="min-h-24 w-full rounded-2xl border px-4 py-3 text-sm"
                  placeholder="פירוט אופציונלי"
                  value={thinkingNote}
                  onChange={(e) => setThinkingNote(e.target.value)}
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void sendThinking()}
                  className="min-h-11 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
                >
                  שליחה
                </button>
                <button type="button" onClick={() => setMode("main")} className="w-full text-sm font-bold text-slate-500">
                  חזרה
                </button>
              </div>
            ) : null}

            {mode === "done" ? (
              <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{message}</p>
            ) : null}

            {message && mode !== "done" ? (
              <p className="text-sm font-bold text-rose-600">{message}</p>
            ) : null}
          </div>
        }
      />
    </div>
  );
}
