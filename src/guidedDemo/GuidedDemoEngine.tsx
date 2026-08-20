import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { demoProgress, runDemoSpecialAction, startDemoProgressBridge, stopDemoProgressBridge } from "./demoProgress";
import { isGuidedDemoActive, readGuidedDemoSession, restorePreviousAuth, clearGuidedDemoLocal } from "./sessionStore";
import { exitGuidedDemoSession, fetchGuidedDemoSession } from "../api/guidedDemoApi";
import { useAuth } from "../context/AuthContext";

const BRAND = "#6D28D9";
const TARGET_WAIT_MS = 8000;
const POLL_MS = 100;
const HEADER_OFFSET = 72;
const SPECIAL_TARGETS = new Set(["automations-demo-trigger", "messages-demo-send", "whatsapp-demo-send"]);

type Hole = { top: number; left: number; width: number; height: number };
type HandPos = { x: number; y: number; flip: boolean; dx: number; dy: number };
type CardPos = { top: number; left: number; width: number };
type ToastState = { message: string; kind: "success" | "nudge" } | null;

function currentStep(session: any) {
  if (!session) return null;
  const steps = session.steps || [];
  if (session.currentStepId) {
    return steps.find((s: any) => s.id === session.currentStepId) || steps[session.currentStepIndex] || null;
  }
  return steps[session.currentStepIndex] || null;
}

function moduleSteps(session: any, moduleKey?: string) {
  const steps = session?.steps || [];
  if (!moduleKey) return steps;
  return steps.filter((s: any) => s.module === moduleKey);
}

function moduleProgress(session: any) {
  const modules = session?.modules || [];
  const completed = new Set(session?.completedStepIds || []);
  const steps = session?.steps || [];
  return modules.map((mod: any) => {
    const modSteps = steps.filter((s: any) => s.module === mod.key);
    const done = modSteps.filter((s: any) => completed.has(s.id)).length;
    return {
      key: mod.key,
      title: mod.title,
      done,
      total: modSteps.length,
      current: session?.currentModule === mod.key,
      complete: modSteps.length > 0 && done >= modSteps.length,
      steps: modSteps,
    };
  });
}

function findTarget(selector?: string | null) {
  if (!selector) return null;
  return document.querySelector(`[data-demo-target="${selector}"]`);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function padHole(rect: DOMRect): Hole {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(rect.width + 14, Math.max(28, vw - 16));
  const height = Math.min(rect.height + 14, Math.max(28, vh - 16));
  return {
    top: clamp(rect.top - 7, 8, Math.max(8, vh - height - 8)),
    left: clamp(rect.left - 7, 8, Math.max(8, vw - width - 8)),
    width,
    height,
  };
}

function scrollTargetIntoView(el: Element) {
  const rect = el.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const visible = window.innerHeight - HEADER_OFFSET;
  const targetY = absoluteTop - HEADER_OFFSET - Math.max(0, (visible - rect.height) / 2);
  window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
}

function overlaps(a: Hole, b: DOMRect, margin = 8) {
  return !(
    a.left + a.width + margin < b.left ||
    b.right + margin < a.left ||
    a.top + a.height + margin < b.top ||
    b.bottom + margin < a.top
  );
}

function placeCard(hole: Hole | null, cardW: number, cardH: number): CardPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(cardW, vw - 16);
  if (!hole) {
    return { top: vh - cardH - 16, left: clamp((vw - width) / 2, 8, vw - width - 8), width };
  }
  const target = {
    left: hole.left + 7,
    top: hole.top + 7,
    right: hole.left + hole.width - 7,
    bottom: hole.top + hole.height - 7,
    width: hole.width - 14,
    height: hole.height - 14,
  } as DOMRect;
  const margin = 12;
  const candidates: Array<{ side: string; score: number; pos: CardPos }> = [];
  const sides = [
    {
      side: "right",
      space: vw - target.right - margin,
      pos: () => ({
        left: target.right + margin,
        top: clamp(target.top, 8, vh - cardH - 8),
        width,
      }),
    },
    {
      side: "left",
      space: target.left - margin,
      pos: () => ({
        left: target.left - width - margin,
        top: clamp(target.top, 8, vh - cardH - 8),
        width,
      }),
    },
    {
      side: "bottom",
      space: vh - target.bottom - margin,
      pos: () => ({
        left: clamp(target.left + target.width / 2 - width / 2, 8, vw - width - 8),
        top: target.bottom + margin,
        width,
      }),
    },
    {
      side: "top",
      space: target.top - margin,
      pos: () => ({
        left: clamp(target.left + target.width / 2 - width / 2, 8, vw - width - 8),
        top: target.top - cardH - margin,
        width,
      }),
    },
  ];
  for (const s of sides) {
    const pos = s.pos();
    const box: Hole = { ...pos, height: cardH };
    if (pos.left >= 8 && pos.left + width <= vw - 8 && pos.top >= 8 && pos.top + cardH <= vh - 8) {
      if (!overlaps(box, target)) candidates.push({ side: s.side, score: s.space, pos });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  if (candidates[0]) return candidates[0].pos;
  return { top: clamp(target.bottom + margin, 8, vh - cardH - 8), left: clamp((vw - width) / 2, 8, vw - width - 8), width };
}

function calcHand(hole: Hole): HandPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cx = hole.left + hole.width / 2;
  const cy = hole.top + hole.height / 2;
  let x = hole.left - 28;
  let y = hole.top - 42;
  let flip = false;
  if (x < 6) {
    x = hole.left + hole.width + 8;
    flip = true;
  }
  if (y < 6) y = hole.top + hole.height + 6;
  if (y + 40 > vh - 6) y = hole.top - 44;
  x = clamp(x, 6, vw - 40);
  y = clamp(y, 6, vh - 40);
  const dx = clamp(cx - (x + 18), -10, 10);
  const dy = clamp(cy - (y + 14), -10, 10);
  return { x, y, flip, dx, dy };
}

function nextStepInModule(session: any, step: any) {
  const modSteps = moduleSteps(session, step?.module);
  const idx = modSteps.findIndex((s: any) => s.id === step?.id);
  return idx >= 0 ? modSteps[idx + 1] || null : null;
}

function stepNeedsBlock(step: any) {
  return step?.completionRule?.type === "click" || step?.action === "click";
}

function DimBlockers({ hole, onBlock }: { hole: Hole; onBlock: () => void }) {
  const { top, left, width, height } = hole;
  const cls = "pointer-events-auto absolute bg-slate-900/60 transition-opacity duration-200";
  return (
    <>
      <div className={cls} style={{ top: 0, left: 0, right: 0, height: top }} onClick={onBlock} aria-hidden />
      <div className={cls} style={{ top: top + height, left: 0, right: 0, bottom: 0 }} onClick={onBlock} aria-hidden />
      <div className={cls} style={{ top, left: 0, width: left, height }} onClick={onBlock} aria-hidden />
      <div className={cls} style={{ top, left: left + width, right: 0, height }} onClick={onBlock} aria-hidden />
    </>
  );
}

function HandPointer({ hand, visible }: { hand: HandPos | null; visible: boolean }) {
  if (!hand || !visible) return null;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute z-[2147483003]"
      width="38"
      height="38"
      viewBox="0 0 24 24"
      style={{
        top: hand.y,
        left: hand.x,
        filter: "drop-shadow(0 2px 4px rgba(15,23,42,0.25))",
        animation: "guidedDemoHandNudge 1.05s ease-in-out infinite",
        ["--hand-dx" as string]: `${hand.dx}px`,
        ["--hand-dy" as string]: `${hand.dy}px`,
        ["--hand-flip" as string]: hand.flip ? "-1" : "1",
      }}
    >
      <path
        fill="#fff"
        stroke={BRAND}
        strokeWidth="1.2"
        d="M9 11V5.5a1.5 1.5 0 013 0V11h1V7.5a1.5 1.5 0 013 0V11h.5a2.5 2.5 0 012.45 2.04l-.82 5.74A2 2 0 0116.13 21H11a3 3 0 01-2.83-2L6.5 13.5A2.5 2.5 0 019 11z"
      />
    </svg>
  );
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
  const [hole, setHole] = useState<Hole | null>(null);
  const [hand, setHand] = useState<HandPos | null>(null);
  const [handHidden, setHandHidden] = useState(false);
  const [cardPos, setCardPos] = useState<CardPos | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [missingTarget, setMissingTarget] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const retryRef = useRef(0);

  const step = currentStep(session);
  const progress = useMemo(() => moduleProgress(session), [session]);
  const currentModule = progress.find((m: any) => m.current);
  const modSteps = useMemo(() => moduleSteps(session, currentModule?.key), [session, currentModule?.key]);
  const modStepIndex = step ? modSteps.findIndex((s: any) => s.id === step.id) : -1;
  const modStepNum = modStepIndex >= 0 ? modStepIndex + 1 : (currentModule?.done || 0) + 1;
  const modStepTotal = modSteps.length || currentModule?.total || 0;
  const nextPreview = step ? nextStepInModule(session, step) : null;
  const moduleIndex = progress.findIndex((m: any) => m.current);
  const isFullDemo = (session?.modules || []).length > 1;
  const isComplete = session?.status === "completed";
  const handoff = session?.pendingHandoff;
  const businessId = user?.businessId;
  const showPanel = !introOpen && !isComplete && !handoff && !!step;
  const showWebsiteHero =
    showPanel &&
    (step?.target === "website-headline" || step?.target === "website-cta" || step?.id === "site-edit-headline");

  const pushToast = useCallback((message: string, kind: ToastState["kind"]) => {
    if (!message) return;
    setToast({ message, kind });
    window.setTimeout(() => setToast(null), kind === "success" ? 3200 : 2400);
  }, []);

  useEffect(() => {
    if (!isGuidedDemoActive()) return undefined;
    startDemoProgressBridge();
    const unsub = demoProgress.subscribe(setSession);
    const onNudge = (event: Event) => pushToast((event as CustomEvent).detail?.message || "", "nudge");
    const onSuccess = (event: Event) => pushToast((event as CustomEvent).detail?.message || "", "success");
    window.addEventListener("guided-demo:nudge", onNudge);
    window.addEventListener("guided-demo:toast", onSuccess);
    if (!readGuidedDemoSession()?.introSeenAt) setIntroOpen(true);
    void fetchGuidedDemoSession()
      .then((data) => {
        if (data?.session) demoProgress.emit(data.session);
      })
      .catch(() => undefined);
    return () => {
      unsub();
      stopDemoProgressBridge();
      window.removeEventListener("guided-demo:nudge", onNudge);
      window.removeEventListener("guided-demo:toast", onSuccess);
    };
  }, [pushToast]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const goToStepRoute = useCallback(
    (nextStep: any) => {
      if (!nextStep?.route || !businessId) return;
      const dest = `/business/${businessId}${nextStep.route}`;
      if (!location.pathname.startsWith(dest.split("?")[0])) navigate(dest);
    },
    [businessId, location.pathname, navigate]
  );

  useEffect(() => {
    if (!step || introOpen || isComplete) return;
    goToStepRoute(step);
  }, [step?.id, introOpen, isComplete, goToStepRoute]);

  useEffect(() => {
    setHandHidden(false);
    setMissingTarget(false);
    retryRef.current += 1;
  }, [step?.id]);

  const layoutCard = useCallback(() => {
    const el = cardRef.current;
    const h = el?.offsetHeight || 210;
    const w = el?.offsetWidth || Math.min(420, window.innerWidth - 16);
    setCardPos(placeCard(hole, w, h));
  }, [hole]);

  useEffect(() => {
    if (!step || introOpen || isComplete || handoff) {
      setHole(null);
      setHand(null);
      return undefined;
    }
    if (!step.target || step.action === "acknowledge") {
      setHole(null);
      setHand(null);
      setMissingTarget(false);
      layoutCard();
      return undefined;
    }

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    let removeScroll: (() => void) | undefined;
    const token = ++retryRef.current;

    const sync = (el: Element) => {
      if (cancelled || token !== retryRef.current) return;
      const rect = padHole(el.getBoundingClientRect());
      setHole(rect);
      setHand(calcHand(rect));
      setMissingTarget(false);
    };

    const attach = (el: Element) => {
      scrollTargetIntoView(el);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled || token !== retryRef.current) return;
          sync(el);
          ro = new ResizeObserver(() => sync(el));
          ro.observe(el);
          const onMove = () => sync(el);
          window.addEventListener("resize", onMove);
          window.addEventListener("scroll", onMove, true);
          removeScroll = () => {
            window.removeEventListener("resize", onMove);
            window.removeEventListener("scroll", onMove, true);
          };
        });
      });
    };

    const poll = (started: number) => {
      if (cancelled || token !== retryRef.current) return;
      const el = findTarget(step.target);
      if (el) {
        attach(el);
        return;
      }
      if (Date.now() - started > TARGET_WAIT_MS) {
        setMissingTarget(true);
        setHole(null);
        setHand(null);
        void demoProgress.report("DEMO_STEP_FAILED", { reason: "target_missing", target: step.target });
        return;
      }
      window.setTimeout(() => poll(started), POLL_MS);
    };

    poll(Date.now());
    return () => {
      cancelled = true;
      ro?.disconnect();
      removeScroll?.();
    };
  }, [step?.id, step?.target, introOpen, isComplete, handoff, location.pathname]);

  useEffect(() => {
    layoutCard();
    const onMove = () => layoutCard();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [hole, step?.id, showPanel, layoutCard]);

  useEffect(() => {
    if (!step || introOpen || isComplete) return undefined;
    const isClick = stepNeedsBlock(step);
    const onClick = (event: MouseEvent) => {
      const targetEl = (event.target as HTMLElement)?.closest?.("[data-demo-target]");
      const key = targetEl?.getAttribute?.("data-demo-target");
      if (isClick && key && key === step.target) {
        setHandHidden(true);
        if (SPECIAL_TARGETS.has(step.target)) {
          event.preventDefault();
          event.stopPropagation();
          void runDemoSpecialAction(step);
          return;
        }
        void demoProgress.completeStep("DEMO_CLICK", { target: key });
        return;
      }
      if (isClick && step.target && key !== step.target) {
        const blocked = (event.target as HTMLElement)?.closest?.("a,button,select,input,textarea");
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
        void demoProgress.completeStep("DEMO_ACKNOWLEDGE");
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

  function handleRetryTarget() {
    setMissingTarget(false);
    retryRef.current += 1;
    if (step) goToStepRoute(step);
  }

  if (!isGuidedDemoActive() || !session) return null;

  const modProgressPct = modStepTotal ? Math.round((Math.max(0, modStepNum - 1) / modStepTotal) * 100) : 0;

  const overlay = (
    <div dir="rtl" className="pointer-events-none fixed inset-0 z-[2147483000] overflow-hidden">
      <style>{`
        @keyframes guidedDemoHandNudge {
          0%, 100% { transform: translate(0, 0) scaleX(var(--hand-flip, 1)); }
          50% { transform: translate(var(--hand-dx, 0), var(--hand-dy, 0)) scaleX(var(--hand-flip, 1)); }
        }
      `}</style>

      {hole && !handoff && stepNeedsBlock(step) ? <DimBlockers hole={hole} onBlock={() => demoProgress.notifyWrongAction()} /> : null}
      {hole && !handoff ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-2xl transition-all duration-200 ease-out"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            boxShadow: `0 0 0 2px ${BRAND}, 0 0 0 4px rgba(109,40,217,0.18), 0 0 24px rgba(109,40,217,0.35)`,
            animation: "pulse 2.4s ease-in-out infinite",
          }}
        />
      ) : showPanel && !hole && !showWebsiteHero ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-slate-900/35 transition-opacity duration-200" />
      ) : null}

      <HandPointer hand={hand} visible={Boolean(hole && !handoff && !handHidden && stepNeedsBlock(step))} />

      <button
        type="button"
        onClick={() => void handleExit()}
        className="pointer-events-auto absolute left-3 top-3 z-[2147483005] rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur"
      >
        יציאה מהדמו
      </button>

      {showPanel ? (
        <div className="pointer-events-auto absolute inset-x-0 top-3 z-[2147483004] flex justify-center px-3">
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-violet-100 bg-white/95 shadow-lg backdrop-blur transition-all duration-200"
            onClick={() => isMobile && setMobileExpanded((v) => !v)}
          >
            {isMobile ? (
              <div className="px-3 py-2.5">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-700">
                  <span className="truncate">
                    {currentModule?.title || "דמו"} · שלב {modStepNum} מתוך {modStepTotal || "—"}
                  </span>
                  {isFullDemo ? (
                    <span className="shrink-0 text-[10px] font-semibold text-slate-400">
                      מודול {moduleIndex + 1} מתוך {progress.length}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${modProgressPct}%`, background: BRAND }} />
                </div>
                {(mobileExpanded || !hole) && (
                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <p className="text-sm font-black text-slate-900">{step?.title}</p>
                    {nextPreview ? (
                      <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-400">הבא: {nextPreview.title}</p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {modSteps.map((s: any, i: number) => {
                        const done = (session.completedStepIds || []).includes(s.id);
                        const current = s.id === step?.id;
                        return (
                          <span
                            key={s.id}
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                              done ? "bg-emerald-100 text-emerald-700" : current ? "text-white" : "bg-slate-100 text-slate-400"
                            }`}
                            style={current ? { background: BRAND } : undefined}
                          >
                            {done ? "✓" : current ? "●" : "○"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-violet-700">{currentModule?.title || "דמו Bizuply"}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">
                      שלב {modStepNum} מתוך {modStepTotal || "—"}
                      {isFullDemo ? (
                        <span className="mr-2 text-[10px] text-slate-400">
                          · מודול {moduleIndex + 1} מתוך {progress.length}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 truncate text-sm font-black text-slate-900">{step?.title}</p>
                  </div>
                  <div className="flex shrink-0 gap-1 pt-1">
                    {modSteps.map((s: any) => {
                      const done = (session.completedStepIds || []).includes(s.id);
                      const current = s.id === step?.id;
                      return (
                        <span
                          key={s.id}
                          className={`text-xs font-black ${done ? "text-emerald-600" : current ? "text-violet-700" : "text-slate-300"}`}
                          aria-hidden
                        >
                          {done ? "✓" : current ? "●" : "○"}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {nextPreview ? (
                  <p className="mt-2 truncate border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-400">
                    הבא: {nextPreview.title}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="pointer-events-none absolute inset-x-0 top-[4.5rem] z-[2147483005] flex justify-center px-4 sm:top-20">
          <div
            className={`max-w-md rounded-2xl px-4 py-2.5 text-sm font-bold shadow-lg ring-1 transition-all duration-200 ${
              toast.kind === "success"
                ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
                : "bg-amber-50 text-amber-900 ring-amber-200"
            }`}
          >
            {toast.message}
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
            className="mt-6 rounded-full px-6 py-3 text-sm font-black text-white"
            style={{ background: BRAND }}
          >
            קבעו פגישת ייעוץ
          </button>
        </div>
      ) : null}

      {introOpen ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483006] flex items-center justify-center bg-slate-950/55 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="guided-demo-intro-title"
            className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl"
          >
            <h2 id="guided-demo-intro-title" className="text-2xl font-black text-slate-900">
              ברוכים הבאים לדמו האישי שלכם ב-Bizuply
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              בכמה הדקות הקרובות תוכלו להשתמש במערכת בעצמכם ולראות איך היא עובדת בפועל.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              אנחנו נסמן לכם בדיוק איפה ללחוץ — והדמו יתקדם לפי הפעולות שתבצעו.
            </p>
            <p className="mt-4 text-sm font-black text-slate-800">הדמו שלכם כולל:</p>
            <ul className="mt-2 space-y-1 text-sm font-bold text-emerald-700">
              {(session.modules || []).map((mod: any) => (
                <li key={mod.key}>✓ {mod.title}</li>
              ))}
            </ul>
            <button
              type="button"
              autoFocus
              onClick={() => void handleStart()}
              className="mt-6 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
              style={{ background: BRAND }}
            >
              מתחילים
            </button>
          </div>
        </div>
      ) : null}

      {handoff && !introOpen && !isComplete ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483006] flex items-center justify-center bg-slate-950/55 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900">מעולה! סיימתם להכיר את {handoff.fromTitle}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">עכשיו נראה איך Bizuply עובדת ב{handoff.toTitle}.</p>
            <button
              type="button"
              autoFocus
              onClick={() => void handleHandoff()}
              className="mt-6 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
              style={{ background: BRAND }}
            >
              המשך ל{handoff.toTitle}
            </button>
          </div>
        </div>
      ) : null}

      {isComplete ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483006] flex items-center justify-center bg-slate-950/55 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900">הדמו הסתיים</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">סיימת את הדמו של Bizuply.</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              ראית כיצד ניתן לרכז את הכלים והתהליכים שבחרנו עבורך במקום אחד ולנהל אותם בצורה פשוטה ומסודרת.
            </p>
            <ul className="mt-4 space-y-1 text-sm font-bold text-emerald-700">
              {progress.map((mod: any) => (
                <li key={mod.key}>✓ {mod.title}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => void handleCta("start", "/contact")}
              className="mt-6 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
              style={{ background: BRAND }}
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

      {showPanel ? (
        <div
          ref={cardRef}
          role="status"
          aria-live="polite"
          className="pointer-events-auto absolute z-[2147483004] rounded-2xl border border-violet-100 bg-white/95 p-4 text-right shadow-xl backdrop-blur transition-all duration-200"
          style={
            cardPos
              ? { top: cardPos.top, left: cardPos.left, width: cardPos.width, maxWidth: "calc(100vw - 16px)" }
              : { bottom: 16, left: "50%", transform: "translateX(-50%)", width: "min(92vw, 420px)" }
          }
        >
          <h3 className="text-base font-black text-slate-900">{step?.title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{step?.instruction}</p>
          {step?.suggestedValue ? (
            <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">טקסט מוצע: {step.suggestedValue}</p>
          ) : null}
          {missingTarget ? (
            <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-800">
              לא הצלחנו למצוא את האלמנט לשלב הזה. נסו לרענן או לחזור לנתיב הנכון.
              <button type="button" className="mr-2 underline" onClick={handleRetryTarget}>
                נסו שוב
              </button>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              {step?.allowBack !== false && (session.currentStepIndex || 0) > 0 ? (
                <button
                  type="button"
                  onClick={() => void handleBack()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600"
                >
                  שלב קודם
                </button>
              ) : null}
              {currentModule && session.modules?.find((m: any) => m.key === currentModule.key)?.skipAllowed !== false ? (
                <button
                  type="button"
                  onClick={() => void handleSkipModule()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-500"
                >
                  דלג על המודול
                </button>
              ) : null}
            </div>
            {step?.action === "acknowledge" || step?.completionRule?.type === "acknowledge" ? (
              <button
                type="button"
                onClick={() => void demoProgress.completeStep("DEMO_ACKNOWLEDGE")}
                className="rounded-xl px-4 py-2 text-xs font-black text-white"
                style={{ background: BRAND }}
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
