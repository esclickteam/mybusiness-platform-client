import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { demoProgress, runDemoSpecialAction, startDemoProgressBridge, stopDemoProgressBridge } from "./demoProgress";
import { isGuidedDemoActive, readGuidedDemoSession, restorePreviousAuth, clearGuidedDemoLocal } from "./sessionStore";
import { exitGuidedDemoSession, fetchGuidedDemoSession } from "../api/guidedDemoApi";
import { useAuth } from "../context/AuthContext";
import {
  calcHand,
  findDemoTarget,
  holeOptionsForKind,
  INTRO_CATEGORIES,
  inputValueSatisfied,
  padHole,
  readDemoInputValue,
  resolveStepKind,
  type HandPos,
  type Hole,
} from "./overlayHelpers";
import { CalendarCheck, LayoutDashboard, LayoutTemplate, Sparkles, Users, Workflow } from "lucide-react";

const BRAND = "#6D28D9";
const TARGET_WAIT_MS = 10000;
const POLL_MS = 120;
const HEADER_OFFSET = 72;
const SPECIAL_TARGETS = new Set(["automations-demo-trigger", "messages-demo-send", "whatsapp-demo-send"]);

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

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
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

function nextStepInModule(session: any, step: any) {
  const modSteps = moduleSteps(session, step?.module);
  const idx = modSteps.findIndex((s: any) => s.id === step?.id);
  return idx >= 0 ? modSteps[idx + 1] || null : null;
}

function isAcknowledge(step: any) {
  return resolveStepKind(step) === "acknowledge";
}

function isDiscreteInput(el: Element | null) {
  if (!el) return false;
  if (el instanceof HTMLSelectElement) return true;
  if (!(el instanceof HTMLInputElement)) return false;
  return ["date", "datetime-local", "time", "checkbox", "radio", "number"].includes(el.type);
}

const INTRO_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  crm: Users,
  work: CalendarCheck,
  auto: Workflow,
  growth: Sparkles,
  web: LayoutTemplate,
};

function DimBlockers({ hole, onBlock }: { hole: Hole; onBlock: () => void }) {
  const { top, left, width, height } = hole;
  const cls = "pointer-events-auto absolute bg-slate-900/55 transition-opacity duration-200";
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
      width="40"
      height="40"
      viewBox="0 0 24 24"
      style={{
        top: hand.y,
        left: hand.x,
        filter: "drop-shadow(0 2px 4px rgba(15,23,42,0.28))",
        animation: "guidedDemoHandNudge 1.05s ease-in-out infinite",
        ["--hand-dx" as string]: `${hand.dx}px`,
        ["--hand-dy" as string]: `${hand.dy}px`,
        ["--hand-flip" as string]: hand.flip ? "-1" : "1",
        ["--hand-rot" as string]: `${hand.rotation}deg`,
        transformOrigin: "center",
      }}
    >
      <path
        fill="#fff"
        stroke={BRAND}
        strokeWidth="1.3"
        strokeLinejoin="round"
        d="M8 13.2V6.4a1.4 1.4 0 012.8 0V12h.2V7.2a1.4 1.4 0 012.8 0V12h.2V8.4a1.4 1.4 0 012.8 0v6.1c0 2.3-1.5 4.3-3.7 4.9l-.7.2H11a3.2 3.2 0 01-3.1-2.4L6.2 13.8A1.8 1.8 0 018 13.2z"
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
  const [introOpen, setIntroOpen] = useState(false);
  const [tourMinimized, setTourMinimized] = useState(false);
  const [finishConfirm, setFinishConfirm] = useState(false);
  const [inputReady, setInputReady] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const retryRef = useRef(0);
  const skipLockRef = useRef(false);

  const step = currentStep(session);
  const progress = useMemo(() => moduleProgress(session), [session]);
  const currentModule = progress.find((m: any) => m.current);
  const modSteps = useMemo(() => moduleSteps(session, currentModule?.key), [session, currentModule?.key]);
  const modStepIndex = step ? modSteps.findIndex((s: any) => s.id === step.id) : -1;
  const modStepNum = modStepIndex >= 0 ? modStepIndex + 1 : (currentModule?.done || 0) + 1;
  const modStepTotal = modSteps.length || currentModule?.total || 0;
  const nextPreview = step ? nextStepInModule(session, step) : null;
  const stepKind = resolveStepKind(step);
  const moduleIndex = progress.findIndex((m: any) => m.current);
  const globalStepIndex = Math.max(0, Number(session?.currentStepIndex || 0));
  const globalStepTotal = session?.totalSteps || (session?.steps || []).length || 0;
  const globalStepNum = Math.min(globalStepIndex + 1, globalStepTotal || 1);
  const isFullDemo = (session?.modules || []).length > 1;
  const isComplete = session?.status === "completed";
  const businessId = user?.businessId;
  const showPanel = !introOpen && !isComplete && !!step && !tourMinimized && !finishConfirm;
  const showWebsiteHero =
    showPanel &&
    (step?.target === "website-headline" || step?.target === "website-cta") &&
    !findDemoTarget(step?.target);

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
    skipLockRef.current = false;
    retryRef.current += 1;
    setInputReady(false);
  }, [step?.id]);

  const layoutCard = useCallback(() => {
    const el = cardRef.current;
    const h = el?.offsetHeight || 210;
    const w = el?.offsetWidth || Math.min(420, window.innerWidth - 16);
    setCardPos(placeCard(hole, w, h));
  }, [hole]);

  const skipMissingTarget = useCallback(
    async (target?: string | null) => {
      if (skipLockRef.current) return;
      skipLockRef.current = true;
      console.warn("[guided-demo] target missing, skipping step", {
        stepId: step?.id,
        target,
        path: location.pathname,
      });
      await demoProgress.report("DEMO_STEP_FAILED", { reason: "target_missing", target, skipped: true });
      await demoProgress.report("DEMO_STEP_SKIPPED", { reason: "target_missing", target });
    },
    [step?.id, location.pathname]
  );

  useEffect(() => {
    if (!step || introOpen || isComplete) {
      setHole(null);
      setHand(null);
      return undefined;
    }
    if (!step.target) {
      setHole(null);
      setHand(null);
      layoutCard();
      return undefined;
    }

    let cancelled = false;
    let ro: ResizeObserver | null = null;
    let removeScroll: (() => void) | undefined;
    const token = ++retryRef.current;

    const sync = (el: Element) => {
      if (cancelled || token !== retryRef.current) return;
      const kind = resolveStepKind(step);
      const rect = padHole(
        el.getBoundingClientRect(),
        window.innerWidth,
        window.innerHeight,
        holeOptionsForKind(kind)
      );
      setHole(rect);
      setHand(calcHand(rect, window.innerWidth, window.innerHeight));
    };

    const attach = (el: Element) => {
      try {
        el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
      } catch {
        scrollTargetIntoView(el);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled || token !== retryRef.current) return;
          sync(el);
          window.setTimeout(() => sync(el), 280);
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

    const poll = (started: number, navigated = false) => {
      if (cancelled || token !== retryRef.current) return;
      const el = findDemoTarget(step.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 2 && rect.height > 2) {
          attach(el);
          return;
        }
        try {
          el.scrollIntoView({ block: "center", inline: "nearest" });
        } catch {
          /* ignore */
        }
      }
      if (Date.now() - started > TARGET_WAIT_MS) {
        if (!navigated && step.route) {
          goToStepRoute(step);
          window.setTimeout(() => poll(Date.now(), true), 400);
          return;
        }
        setHole(null);
        setHand(null);
        void skipMissingTarget(step.target);
        return;
      }
      window.setTimeout(() => poll(started, navigated), POLL_MS);
    };

    poll(Date.now());
    return () => {
      cancelled = true;
      ro?.disconnect();
      removeScroll?.();
    };
  }, [step?.id, step?.target, introOpen, isComplete, location.pathname, layoutCard, goToStepRoute, skipMissingTarget]);

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
    const kind = resolveStepKind(step);
    const onClick = (event: MouseEvent) => {
      const targetEl = (event.target as HTMLElement)?.closest?.("[data-demo-target]");
      const key = targetEl?.getAttribute?.("data-demo-target");
      if (key && key === step.target) {
        setHandHidden(true);
        if (SPECIAL_TARGETS.has(step.target)) {
          event.preventDefault();
          event.stopPropagation();
          void runDemoSpecialAction(step);
          return;
        }
        if (kind === "navigation") {
          void demoProgress.completeStep("DEMO_CLICK", { target: key });
        }
        return;
      }
      if (kind === "navigation" && step.target && key !== step.target) {
        const blocked = (event.target as HTMLElement)?.closest?.("a,button,select,input,textarea");
        if (blocked) demoProgress.notifyWrongAction();
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [step?.id, step?.target, introOpen, isComplete]);

  useEffect(() => {
    if (!step || introOpen || isComplete) return undefined;
    if (String(step?.completionRule?.type) !== "input") return undefined;
    const rule = step.completionRule || {};
    const readFromEvent = (event: Event) => {
      const raw = event.target as HTMLElement | null;
      const scoped = raw?.closest?.("[data-demo-target]") as HTMLElement | null;
      const key = scoped?.getAttribute?.("data-demo-target");
      if (step.target && key && key !== step.target) return null;
      const el =
        (key === step.target && scoped) ||
        findDemoTarget(step.target) ||
        raw;
      return el;
    };
    const evaluate = (event: Event, autoComplete: boolean) => {
      const el = readFromEvent(event);
      if (!el) return;
      const value = readDemoInputValue(el);
      const satisfied = inputValueSatisfied(rule, value);
      setInputReady(satisfied);
      if (autoComplete && satisfied) {
        void demoProgress.completeStep("DEMO_INPUT", { target: step.target, value });
      }
    };
    const onInput = (event: Event) => evaluate(event, false);
    const onChange = (event: Event) => {
      const el = readFromEvent(event);
      evaluate(event, isDiscreteInput(el));
    };
    const onBlur = (event: Event) => evaluate(event, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("change", onChange, true);
    document.addEventListener("blur", onBlur, true);
    const current = findDemoTarget(step.target);
    if (current) setInputReady(inputValueSatisfied(rule, readDemoInputValue(current)));
    return () => {
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("blur", onBlur, true);
    };
  }, [step?.id, step?.target, introOpen, isComplete]);

  useEffect(() => {
    if (step?.id) void demoProgress.report("DEMO_STEP_STARTED", { stepId: step.id });
  }, [step?.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (introOpen || isComplete) {
        event.preventDefault();
        return;
      }
      if (isAcknowledge(step)) {
        event.preventDefault();
        void demoProgress.completeStep("DEMO_ACKNOWLEDGE");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introOpen, isComplete, step?.id]);

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

  async function handleExploreAlone() {
    setIntroOpen(false);
    setTourMinimized(true);
    await demoProgress.report("DEMO_INTRO_SEEN");
    await demoProgress.report("DEMO_EXPLORE_FREE");
  }

  async function handleBack() {
    await demoProgress.report("DEMO_BACK");
  }

  async function handleSkipModule() {
    await demoProgress.report("DEMO_MODULE_SKIP", { moduleKey: session?.currentModule });
  }

  async function handleFinishDemo() {
    setFinishConfirm(false);
    await demoProgress.report("DEMO_FINISH");
  }

  async function handleHeadlineBlur(event: React.FocusEvent<HTMLHeadingElement>) {
    const text = String(event.currentTarget.textContent || "").trim();
    if (!text) return;
    await demoProgress.report("WEBSITE_TEXT_CHANGED", { text, value: text });
  }

  async function handleInputContinue() {
    const el = findDemoTarget(step?.target);
    const value = readDemoInputValue(el);
    if (!inputValueSatisfied(step?.completionRule, value) && !step?.allowSkip) return;
    if (!inputValueSatisfied(step?.completionRule, value) && step?.allowSkip) {
      await demoProgress.report("DEMO_STEP_SKIPPED", { reason: "optional_input" });
      return;
    }
    await demoProgress.completeStep("DEMO_INPUT", { target: step?.target, value });
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

  const modProgressPct = modStepTotal ? Math.round((Math.max(0, modStepNum - 1) / modStepTotal) * 100) : 0;
  const globalProgressPct = globalStepTotal ? Math.round((Math.max(0, globalStepNum - 1) / globalStepTotal) * 100) : 0;

  const overlay = (
    <div dir="rtl" className="pointer-events-none fixed inset-0 z-[2147483000]">
      <style>{`
        @keyframes guidedDemoHandNudge {
          0%, 100% { transform: translate(0, 0) scaleX(var(--hand-flip, 1)) rotate(var(--hand-rot, 0deg)); }
          50% { transform: translate(var(--hand-dx, 0), var(--hand-dy, 0)) scaleX(var(--hand-flip, 1)) rotate(var(--hand-rot, 0deg)); }
        }
      `}</style>

      {hole && showPanel && stepKind === "navigation" ? (
        <DimBlockers
          hole={hole}
          onBlock={() => {
            demoProgress.notifyWrongAction();
          }}
        />
      ) : showPanel && !hole && !showWebsiteHero ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-slate-900/30 transition-opacity duration-200" />
      ) : null}

      {hole && showPanel ? (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-2xl transition-all duration-200 ease-out"
          style={{
            top: hole.top,
            left: hole.left,
            width: hole.width,
            height: hole.height,
            boxShadow: `0 0 0 2px ${BRAND}, 0 0 0 9999px rgba(15,23,42,0.45), 0 0 24px rgba(109,40,217,0.35)`,
          }}
        />
      ) : null}

      <HandPointer
        hand={
          hand
            ? ({
                ...hand,
              } as HandPos)
            : null
        }
        visible={Boolean(hole && !handHidden && (stepKind === "navigation" || stepKind === "commit"))}
      />

      {tourMinimized && !introOpen && !isComplete ? (
        <button
          type="button"
          onClick={() => setTourMinimized(false)}
          className="pointer-events-auto absolute bottom-4 left-1/2 z-[2147483005] -translate-x-1/2 rounded-full border border-violet-200 bg-white px-5 py-2.5 text-sm font-black text-violet-800 shadow-lg"
        >
          המשך הדמו
        </button>
      ) : null}

      {!tourMinimized ? (
        <div className="pointer-events-auto absolute left-3 top-3 z-[2147483005] flex gap-1.5">
          {showPanel ? (
            <button
              type="button"
              onClick={() => setTourMinimized(true)}
              className="rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur"
            >
              הסתר
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setFinishConfirm(true)}
            className="rounded-full border border-slate-200/90 bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm backdrop-blur"
          >
            סיום הדמו
          </button>
        </div>
      ) : null}

      {showPanel ? (
        <div className="pointer-events-auto absolute inset-x-0 top-3 z-[2147483004] flex justify-center px-3">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-violet-100 bg-white/95 shadow-lg backdrop-blur">
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-violet-700">{currentModule?.title || "BizUply"}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {isFullDemo ? `שלב ${globalStepNum} מתוך ${globalStepTotal || "—"}` : `שלב ${modStepNum} מתוך ${modStepTotal || "—"}`}
                  </p>
                  {isFullDemo && modStepTotal ? (
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                      {currentModule?.title} · שלב {modStepNum} מתוך {modStepTotal} במודול
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${isFullDemo ? globalProgressPct : modProgressPct}%`, background: BRAND }}
                />
              </div>
            </div>
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
            {step?.suggestedValue || "סטודיו נועה — רגעים שנשארים"}
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
            className="w-full max-w-xl rounded-[28px] bg-white p-6 text-right shadow-2xl sm:p-8"
          >
            <p className="text-xs font-black tracking-[0.16em] text-violet-500">BIZUPLY</p>
            <h2 id="guided-demo-intro-title" className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
              הדמו האישי שלכם מוכן
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
              בכמה דקות תראו איך BizUply מרכזת את ניהול העסק במקום אחד.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INTRO_CATEGORIES.map((item) => {
                const Icon = INTRO_ICONS[item.icon];
                return (
                  <div
                    key={item.key}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/50 px-3 py-4 text-center shadow-sm"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <p className="text-sm font-black leading-5 text-slate-800">{item.title}</p>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => void handleStart()}
              className="mt-6 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
              style={{ background: BRAND }}
            >
              התחלת הדמו
            </button>
            <button
              type="button"
              onClick={() => void handleExploreAlone()}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600"
            >
              אעבור לבד
            </button>
          </div>
        </div>
      ) : null}

      {finishConfirm && !isComplete ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483006] flex items-center justify-center bg-slate-950/55 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-[28px] bg-white p-6 text-right shadow-2xl">
            <h2 className="text-xl font-black text-slate-900">לסיים את הדמו?</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              ההתקדמות נשמרת לפי שלבים. סיום יציג את מסך הסיום בלבד — בלי להשפיע על חשבון אמיתי.
            </p>
            <button
              type="button"
              onClick={() => void handleFinishDemo()}
              className="mt-5 w-full rounded-2xl px-4 py-3 text-sm font-black text-white"
              style={{ background: BRAND }}
            >
              סיום הדמו
            </button>
            <button
              type="button"
              onClick={() => setFinishConfirm(false)}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600"
            >
              להמשיך במסלול
            </button>
          </div>
        </div>
      ) : null}

      {isComplete ? (
        <div className="pointer-events-auto absolute inset-0 z-[2147483006] flex items-center justify-center bg-slate-950/55 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-lg rounded-[28px] bg-white p-6 text-right shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900">הדמו הסתיים</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">סיימתם את המסלול המודרך של BizUply.</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              ראיתם איך הכלים המרכזיים מתחברים יחד לניהול העסק במקום אחד.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {INTRO_CATEGORIES.map((item) => {
                const Icon = INTRO_ICONS[item.icon];
                return (
                  <div
                    key={item.key}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/50 px-3 py-3 text-center"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-violet-700 ring-1 ring-violet-100">
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                    </span>
                    <p className="text-[11px] font-black leading-4 text-slate-800">{item.title}</p>
                  </div>
                );
              })}
            </div>
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
          <p className="text-[11px] font-bold text-violet-700">{currentModule?.title || "דמו"}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
            שלב {modStepNum} מתוך {modStepTotal || "—"}
          </p>
          <h3 className="mt-2 text-base font-black text-slate-900">{step?.title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">{step?.instruction}</p>
          {step?.suggestedValue ? (
            <p className="mt-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">טקסט מוצע: {step.suggestedValue}</p>
          ) : null}
          {nextPreview && stepKind !== "input" ? (
            <p className="mt-2 text-[11px] font-bold text-slate-400">הבא: {nextPreview.title}</p>
          ) : null}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${modProgressPct}%`, background: BRAND }} />
          </div>
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
            {isAcknowledge(step) ? (
              <button
                type="button"
                onClick={() => void demoProgress.completeStep("DEMO_ACKNOWLEDGE")}
                className="rounded-xl px-4 py-2 text-xs font-black text-white"
                style={{ background: BRAND }}
              >
                המשך
              </button>
            ) : step?.completionRule?.type === "input" && (inputReady || step?.allowSkip) ? (
              <button
                type="button"
                onClick={() => void handleInputContinue()}
                className="rounded-xl px-4 py-2 text-xs font-black text-white"
                style={{ background: BRAND }}
              >
                {inputReady ? "המשך" : "דלג"}
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
