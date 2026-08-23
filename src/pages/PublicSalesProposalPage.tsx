import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
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

type Mode = "main" | "signing" | "question" | "thinking" | "done";

export default function PublicSalesProposalPage() {
  const { token = "" } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<"loading" | "ready" | "expired" | "error">("loading");
  const [proposal, setProposal] = useState<any>(null);
  const [mode, setMode] = useState<Mode>("main");
  const [question, setQuestion] = useState("");
  const [thinkingReason, setThinkingReason] = useState("need_time");
  const [thinkingNote, setThinkingNote] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [approvedDate, setApprovedDate] = useState(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  });
  const sigPadRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await API.get(`/public/proposals/${encodeURIComponent(token)}`);
        if (!alive) return;
        setProposal(data.proposal);
        setState("ready");
        if (["signed", "signing_pending"].includes(data.proposal?.status)) {
          setMode("signing");
        }
        if (data.proposal?.status === "payment_pending") {
          setMode("signing");
          setMessage("התשלום ממתין להשלמה. ניתן לנסות שוב.");
        }
        if (["paid", "accepted"].includes(data.proposal?.status)) {
          setMode("done");
          setMessage("התשלום התקבל. תודה! ניצור איתך קשר להמשך ההטמעה.");
        }
        if (searchParams.get("checkout") === "success") {
          setMode("done");
          setMessage("התשלום התקבל בהצלחה. תודה! ניצור איתך קשר להמשך.");
        }
        if (searchParams.get("checkout") === "cancel") {
          setMode("signing");
          setMessage("התשלום בוטל. אפשר לנסות שוב בכל עת.");
        }
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
  }, [token, searchParams]);

  async function startSigning() {
    setBusy(true);
    setMessage("");
    try {
      const { data } = await API.post(`/public/proposals/${encodeURIComponent(token)}/accept`);
      setProposal(data.proposal);
      setMode("signing");
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "הפעולה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function signAndPay() {
    setBusy(true);
    setMessage("");
    try {
      const alreadySigned = Boolean(proposal?.signedAt);
      let payload: Record<string, string> = {};
      if (!alreadySigned) {
        if (!fullName.trim() || fullName.trim().length < 2) {
          setMessage("יש למלא שם מלא");
          setBusy(false);
          return;
        }
        if (!idNumber.trim() || idNumber.trim().length < 5) {
          setMessage("יש למלא תעודת זהות");
          setBusy(false);
          return;
        }
        if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
          setMessage("יש לחתום באזור החתימה");
          setBusy(false);
          return;
        }
        const signatureData = sigPadRef.current.getTrimmedCanvas().toDataURL("image/png");
        payload = {
          approvedByName: fullName.trim(),
          approvedByIdNumber: idNumber.trim(),
          approvedByBusinessNumber: businessNumber.trim(),
          approvedAt: approvedDate,
          signatureData,
        };
      }
      const { data } = await API.post(
        `/public/proposals/${encodeURIComponent(token)}/checkout`,
        payload
      );
      setProposal(data.proposal);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setMessage("נוצר קישור תשלום, אך לא התקבלה כתובת. נסו שוב.");
    } catch (err: any) {
      setMessage(err?.response?.data?.error || "חתימה / תשלום נכשלו");
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
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-2xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white"
          >
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
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-2xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white"
          >
            צרו קשר
          </Link>
        </div>
      </div>
    );
  }

  const alreadyPaid = ["paid", "accepted"].includes(proposal.status);

  return (
    <div
      className="min-h-screen w-full bg-[linear-gradient(180deg,#f8f5ff_0%,#f5f6fb_40%,#ffffff_100%)] px-3 py-6 sm:px-6 sm:py-10"
      dir="rtl"
    >
      <ProposalDocumentView
        interactive
        proposal={proposal}
        footer={
          <div className="space-y-3 border-t border-slate-100 pt-6">
            {mode === "main" && !alreadyPaid ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void startSigning()}
                  className="min-h-12 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-base font-black text-white disabled:opacity-60"
                >
                  אני רוצה להתחיל
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setMode("question")}
                  className="min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"
                >
                  יש לי שאלה על ההצעה
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setMode("thinking")}
                  className="min-h-11 w-full rounded-2xl px-4 py-3 text-sm font-bold text-slate-500"
                >
                  אני רוצה לחשוב על זה
                </button>
              </>
            ) : null}

            {mode === "signing" && !alreadyPaid ? (
              <div className="space-y-4 rounded-3xl border border-violet-100 bg-violet-50/40 p-4 sm:p-5">
                <h3 className="text-lg font-black text-slate-900">אישור וחתימה</h3>
                {proposal.signedAt ? (
                  <p className="text-sm font-semibold text-emerald-800">
                    ההצעה כבר נחתמה על ידי {proposal.approvedByName}. ניתן להמשיך לתשלום.
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold leading-6 text-slate-600">
                      אני מאשר/ת כי קראתי את פרטי ההצעה והתנאים, ואני מבקש/ת להתקדם בהתאם לרכיבים
                      ולמחירים המופיעים בהצעה זו.
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block text-sm font-black text-slate-800">
                        שם מלא
                        <input
                          className="mt-1 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </label>
                      <label className="block text-sm font-black text-slate-800">
                        ת״ז
                        <input
                          className="mt-1 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                        />
                      </label>
                      <label className="block text-sm font-black text-slate-800">
                        מספר עסק / ח״פ
                        <input
                          className="mt-1 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                          value={businessNumber}
                          onChange={(e) => setBusinessNumber(e.target.value)}
                          placeholder="אופציונלי"
                        />
                      </label>
                      <label className="block text-sm font-black text-slate-800">
                        תאריך
                        <input
                          type="date"
                          className="mt-1 min-h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm"
                          value={approvedDate}
                          onChange={(e) => setApprovedDate(e.target.value)}
                        />
                      </label>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-sm font-black text-slate-800">חתימה</p>
                        <button
                          type="button"
                          className="text-xs font-bold text-slate-500"
                          onClick={() => sigPadRef.current?.clear()}
                        >
                          ניקוי
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <SignatureCanvas
                          ref={sigPadRef}
                          penColor="#111827"
                          canvasProps={{
                            className: "w-full h-40 touch-none",
                            style: { width: "100%", height: 160 },
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void signAndPay()}
                  className="min-h-12 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-base font-black text-white disabled:opacity-60"
                >
                  {busy
                    ? "מעביר לתשלום..."
                    : proposal.signedAt
                      ? "המשך לתשלום ב-Stripe"
                      : "אישור, חתימה ומעבר לתשלום"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("main")}
                  className="w-full text-sm font-bold text-slate-500"
                >
                  חזרה
                </button>
              </div>
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
                <button
                  type="button"
                  onClick={() => setMode("main")}
                  className="w-full text-sm font-bold text-slate-500"
                >
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
                <button
                  type="button"
                  onClick={() => setMode("main")}
                  className="w-full text-sm font-bold text-slate-500"
                >
                  חזרה
                </button>
              </div>
            ) : null}

            {mode === "done" ? (
              <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                {message}
              </p>
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
