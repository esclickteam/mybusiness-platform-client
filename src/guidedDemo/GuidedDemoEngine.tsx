import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { demoProgress, runDemoSpecialAction, startDemoProgressBridge, stopDemoProgressBridge } from "./demoProgress";
import { isGuidedDemoActive, readGuidedDemoSession, restorePreviousAuth, clearGuidedDemoLocal } from "./sessionStore";
import { exitGuidedDemoSession, fetchGuidedDemoSession } from "../api/guidedDemoApi";
import { useAuth } from "../context/AuthContext";

const TARGET_WAIT_MS = 8000;
const POLL_MS = 120;

function currentStep(session) {
  if (!session) return null;
  const steps = session.steps || [];
  if (session.currentStepId) {
    return steps.find((s) => s.id === session.currentStepId) || steps[session.currentStepIndex] || null;
  }
  return steps[session.currentStepIndex] || null;
}

function moduleProgress(session) {
  const modules = session?.modules || [];
  const completed = new Set(session?.completedStepIds || []);
  const steps = session?.steps || [];
  return modules.map((mod) => {
    const modSteps = steps.filter((s) => s.module === mod.key);
    const done = modSteps.filter((s) => completed.has(s.id)).length;
    const current = session?.currentModule === mod.key;
    return {
      key: mod.key,
      title: mod.title,
      done,
      total: modSteps.length,
      current,
      complete: modSteps.length > 0 && done >= modSteps.length,
    };
  });
}

function findTarget(selector) {
  if (!selector) return null;
  return document.querySelector(`[data-demo-target="${selector}"]`);
}

function pad(rect) {
  const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
  const vh = typeof window === "undefined" ? 720 : window.innerHeight;
  const width = Math.min(rect.width + 12, Math.max(24, vw - 16));
  const height = Math.min(rect.height + 12, Math.max(24, vh - 16));
  return {
    top: Math.min(Math.max(8, rect.top - 6), Math.max(8, vh - height - 8)),
    left: Math.min(Math.max(8, rect.left - 6), Math.max(8, vw - width - 8)),
    width,
    height,
  };
}

export default function GuidedDemoEngine() {
  const { user, loginWithToken, logout } = useAuth() as {
    user: { businessId?: string; isGuidedDemo?: boolean } | null;
    loginWithToken: Function;
    logout: Function;
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(() => readGuidedDemoSession());
  const [hole, setHole] = useState(null);
  const [nudge, setNudge] = useState("");
  const [missingTarget, setMissingTarget] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const waitRef = useRef(0);

  const step = currentStep(session);
  const progress = useMemo(() => moduleProgress(session), [session]);
  const total = session?.totalSteps || (session?.steps || []).length || 0;
  const done = session?.completedSteps || (session?.completedStepIds || []).length || 0;
  const percent = session?.completionPercent ?? (total ? Math.round((done / total) * 100) : 0);
  const isComplete = session?.status === "completed";
  const businessId = user?.businessId;

  useEffect(() => {
    if (!isGuidedDemoActive()) return undefined;
    startDemoProgressBridge();
    const unsub = demoProgress.subscribe(setSession);
    const onNudge = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      setNudge(detail?.message || "");
      window.setTimeout(() => setNudge(""), 2400);
    };
    window.addEventListener("guided-demo:nudge", onNudge);
    if (!readGuidedDemoSession()?.introSeenAt) setIntroOpen(true);
    void fetchGuidedDemoSession()
      .then((data) => {
        if (data?.session) demoProgress.emit(data.session);
      })
      .catch(() => {
        /* keep local snapshot */
      });
    return () => {
      unsub();
      stopDemoProgressBridge();
      window.removeEventListener("guided-demo:nudge", onNudge);
    };
  }, []);

  const goToStepRoute = useCallback(
    (nextStep) => {
      if (!nextStep?.route || !businessId) return;
      const dest = `/business/${businessId}${nextStep.route}`;
      if (!location.pathname.startsWith(dest.split("?")[0])) {
        navigate(dest);
      }
    },
    [businessId, location.pathname, navigate]
  );

  useEffect(() => {
    if (!step || introOpen || isComplete) return;
    goToStepRoute(step);
  }, [step?.id, introOpen, isComplete, goToStepRoute]);

  useEffect(() => {
    if (!step || introOpen || isComplete) {
      setHole(null);
      return undefined;
    }
    if (!step.target || step.action === "acknowledge") {
      setHole(null);
      setMissingTarget(false);
      return undefined;
    }

    let cancelled = false;
    const started = Date.now();
    waitRef.current = started;

    const tick = () => {
      if (cancelled) return;
      const el = findTarget(step.target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        const rect = pad(el.getBoundingClientRect());
        setHole(rect);
        setMissingTarget(false);
        return;
      }
      if (Date.now() - started > TARGET_WAIT_MS) {
        setMissingTarget(true);
        setHole(null);
        void demoProgress.report("DEMO_STEP_FAILED", { reason: "target_missing", target: step.target });
        return;
      }
      window.setTimeout(tick, POLL_MS);
    };

    tick();
    const onScroll = () => {
      const el = findTarget(step.target);
      if (!el) return;
      setHole(pad(el.getBoundingClientRect()));
    };
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [step?.id, step?.target, introOpen, isComplete, location.pathname]);

  useEffect(() => {
    if (!step || introOpen || isComplete) return undefined;
    const isClick = step.completionRule?.type === "click" || step.action === "click";
    const onClick = (event: MouseEvent) => {
      const targetEl = (event.target as HTMLElement)?.closest?.("[data-demo-target]");
      const key = targetEl?.getAttribute?.("data-demo-target");
      if (isClick && key && key === step.target) {
        if (step.target === "automations-demo-trigger" || step.target === "messages-demo-send" || step.target === "whatsapp-demo-send") {
          event.preventDefault();
          event.stopPropagation();
          void runDemoSpecialAction(step);
          return;
        }
        void demoProgress.completeStep("DEMO_CLICK", { target: key });
        return;
      }
      if (isClick && step.target && key !== step.target) {
        const blocked = (event.target as HTMLElement)?.closest?.("a,button,select");
        if (blocked) demoProgress.notifyWrongAction();
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [step?.id, step?.target, introOpen, isComplete]);

  useEffect(() => {
    if (step?.id) void demoProgress.report("DEMO_STEP_STARTED", { stepId: step.id });
  }, [step?.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (introOpen || isComplete || session?.pendingHandoff) {
        event.preventDefault();
        return;
      }
      if (step?.action === "acknowledge" || step?.completionRule?.type === "acknowledge") {
        event.preventDefault();
        void handleAck();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introOpen, isComplete, step?.id, session?.pendingHandoff]);

  async function handleExit() {
    try {
      await exitGuidedDemoSession();
    } catch {
      /* ignore */
    }
    const prev = restorePreviousAuth();
    clearGuidedDemoLocal();
    if (prev.token && prev.user) {
      loginWithToken(prev.user, prev.token, { skipRedirect: true });
      const role = prev.user.role;
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/", { replace: true });
      return;
    }
    logout?.();
    navigate("/", { replace: true });
  }

  async function handleStart() {
    setIntroOpen(false);
    await demoProgress.report("DEMO_INTRO_SEEN");
  }

  async function handleAck() {
    await demoProgress.completeStep("DEMO_ACKNOWLEDGE");
  }

  async function handleBack() {
    await demoProgress.report("DEMO_BACK");
  }

  async function handleSkipModule() {
    await demoProgress.report("DEMO_MODULE_SKIP", { moduleKey: session?.currentModule });
  }

  async function handleHandoff() {
    await demoProgress.report("DEMO_HANDOFF_ACK");
  }

  async function handleHeadlineBlur(event: React.FocusEvent<HTMLHeadingElement>) {
    const text = String(event.currentTarget.textContent || "").trim();
    if (!text) return;
    await demoProgress.report("WEBSITE_TEXT_CHANGED", { text });
  }

  async function handleCta(cta: string, path: string) {
    try {
      await demoProgress.report("demo_cta_clicked", { cta });
    } catch {
      /* ignore */
    }
    await handleExit();
    navigate(path);
  }

  if (!isGuidedDemoActive() || !session) return null;

  const currentModule = progress.find((m) => m.current);
  const handoff = session.pendingHandoff;
  const showWebsiteHero =
    !introOpen &&
    !isComplete &&
    !handoff &&
    (step?.target === "website-headline" ||
      step?.target === "website-cta" ||
      step?.id === "site-edit-headline");

  const overlay = (
    <div dir="rtl" className="pointer-events-none fixed inset-0 z-[2147483000]">
      {hole && !handoff ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-2xl"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            boxShadow: "0 0 0 9999px rgba(15,23,42,0.62), 0 0 0 3px #8b5cf6, 0 0 28px rgba(139,92,246,0.85)",
            borderRadius: 16,
          }}
        />
      ) : introOpen || isComplete || handoff ? null : (
        <div className="pointer-events-none absolute inset-0 bg-slate-900/35" />
      )}

      {hole && !handoff ? (
        <div
          aria-hidden
          className="pointer-events-none absolute text-3xl"
          style={{
            top: Math.max(8, hole.top - 28),
            left: hole.left + hole.width / 2 - 12,
          }}
        >
          👇
        </div>
      ) : null}

      <div className="pointer-events-auto absolute inset-x-0 top-3 z-[2147483001] flex justify-center px-3">
        <div className="flex max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-violet-200 bg-white/95 px-4 py-2 text-xs font-black text-slate-700 shadow-lg">
          <span>
            {currentModule ? `${currentModule.title} — שלב ${currentModule.done + 1} מתוך ${currentModule.total}` : "דמו Bizuply"}
          </span>
          <span className="text-violet-600">השלמת הדמו: {percent}%</span>
          {progress.map((mod) => (
            <span key={mod.key} className={mod.complete ? "text-emerald-600" : mod.current ? "text-violet-700" : "text-slate-400"}>
              {mod.title} {mod.complete ? "✓" : `${mod.done}/${mod.total}`}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleExit()}
        className="pointer-events-auto absolute left-3 top-3 z-[2147483002] rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 shadow"
      >
        יציאה מהדמו
      </button>

      {nudge ? (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-[2147483003] flex justify-center px-4">
          <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 shadow ring-1 ring-amber-200">
            {nudge}
          </div>
        </div>
      ) : null}

      {showWebsiteHero ? (
        <div className="pointer-events-auto absolute left-1/2 top-[22%] z-[2147483002] w-[min(92vw,560px)] -translate-x-1/2 rounded-[28px] bg-white p-8 text-center shadow-2xl">
          <p className="text-xs font-black tracking-[0.2em] text-violet-500">סטודיו לצילום · תל אביב</p>
          <h1
            data-demo-target="website-headline"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleHeadlineBlur}
            className="mt-3 text-3xl font-black text-slate-900 outline-none focus:ring-2 focus:ring-violet-300"
          >
            {step?.suggestedValue && step.id === "site-edit-headline"
              ? "סטודיו נועה — רגעים שנשארים"
              : step?.suggestedValue || "סטודיו נועה — רגעים שנשארים"}
          </h1>
          <button
            type="button"
            data-demo-target="website-cta"
            className="mt-6 rounded-full bg-[#6D28D9] px-6 py-3 text-sm font-black text-white"
          >
            קבעו פגישת ייעוץ
          </button>
        </div>
      ) : null}

      {introOpen ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483004] flex items-center justify-center bg-slate-950/55 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guided-demo-intro-title"
            className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl"
          >
            <h2 id="guided-demo-intro-title" className="text-2xl font-black text-slate-900">ברוכים הבאים לדמו האישי שלכם ב-Bizuply 👋</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              בכמה הדקות הקרובות תוכלו להשתמש במערכת בעצמכם ולראות איך היא עובדת בפועל.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              אנחנו נסמן לכם בדיוק איפה ללחוץ — והדמו יתקדם לפי הפעולות שתבצעו.
            </p>
            <p className="mt-4 text-sm font-black text-slate-800">הדמו שלכם כולל:</p>
            <ul className="mt-2 space-y-1 text-sm font-bold text-emerald-700">
              {(session.modules || []).map((mod) => (
                <li key={mod.key}>✓ {mod.title}</li>
              ))}
            </ul>
            <button
              type="button"
              autoFocus
              onClick={() => void handleStart()}
              className="mt-6 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
            >
              מתחילים
            </button>
          </div>
        </div>
      ) : null}

      {handoff && !introOpen && !isComplete ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483004] flex items-center justify-center bg-slate-950/55 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900">
              מעולה! סיימתם להכיר את {handoff.fromTitle} 🎉
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              עכשיו נראה איך Bizuply עובדת ב{handoff.toTitle}.
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => void handleHandoff()}
              className="mt-6 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
            >
              המשך ל{handoff.toTitle}
            </button>
          </div>
        </div>
      ) : null}

      {isComplete ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483004] flex items-center justify-center bg-slate-950/55 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900">הדמו הסתיים 🎉</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              סיימת את הדמו של Bizuply.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              ראית כיצד ניתן לרכז את הכלים והתהליכים שבחרנו עבורך במקום אחד ולנהל אותם בצורה פשוטה ומסודרת.
            </p>
            <ul className="mt-4 space-y-1 text-sm font-bold text-emerald-700">
              {progress.map((mod) => (
                <li key={mod.key}>✓ {mod.title}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => void handleCta("start", "/contact")}
              className="mt-6 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white"
            >
              רוצה לראות איך זה יכול להתאים לעסק שלך?
            </button>
            <button
              type="button"
              onClick={() => void handleCta("talk", "/contact")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700"
            >
              דברו איתי
            </button>
          </div>
        </div>
      ) : null}

      {!introOpen && !isComplete && !handoff && step ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-auto absolute bottom-4 left-1/2 z-[2147483002] w-[min(92vw,440px)] -translate-x-1/2 rounded-3xl border border-violet-200 bg-white p-4 text-right shadow-2xl"
        >
          <p className="text-[11px] font-black uppercase tracking-wide text-violet-600">
            {currentModule?.title} · שלב {done + 1} מתוך {total}
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-900">{step.title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{step.instruction}</p>
          {step.suggestedValue ? (
            <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">
              טקסט מוצע: {step.suggestedValue}
            </p>
          ) : null}
          {missingTarget ? (
            <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-800">
              לא הצלחנו לפתוח את השלב הזה. נסו שוב.
              <button
                type="button"
                className="mr-2 underline"
                onClick={() => {
                  setMissingTarget(false);
                  goToStepRoute(step);
                }}
              >
                נסו שוב
              </button>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              {step.allowBack !== false && (session.currentStepIndex || 0) > 0 ? (
                <button
                  type="button"
                  onClick={() => void handleBack()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600"
                >
                  שלב קודם
                </button>
              ) : null}
              {currentModule && session.modules?.find((m) => m.key === currentModule.key)?.skipAllowed !== false ? (
                <button
                  type="button"
                  onClick={() => void handleSkipModule()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-500"
                >
                  דלג על המודול
                </button>
              ) : null}
            </div>
            {step.action === "acknowledge" || step.completionRule?.type === "acknowledge" ? (
              <button
                type="button"
                onClick={() => void handleAck()}
                className="rounded-xl bg-[#6D28D9] px-4 py-2 text-xs font-black text-white"
              >
                המשך
              </button>
            ) : (
              <span className="text-[11px] font-bold text-slate-400">הדמו יתקדם כשתבצעו את הפעולה</span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );

  if (typeof document === "undefined") return overlay;
  return createPortal(overlay, document.body);
}
