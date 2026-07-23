import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gift, GripVertical, X } from "lucide-react";

import BenefitsWheelSpinWheel from "./BenefitsWheelSpinWheel";
import {
  type BenefitsWheelSettings,
  markAutoShownThisSession,
  normalizeSegments,
  pickWinningIndex,
  readVisitorSavedPrize,
  readVisitorSpinCount,
  rotationDeltaForSegment,
  wasAutoShownThisSession,
  writeVisitorSpin,
} from "./benefitsWheelUtils";
import { saveBenefitsWheelSpin } from "../../../api/benefitsWheelApi";

type BenefitsWheelWidgetProps = {
  siteId: string;
  slug?: string;
  settings: BenefitsWheelSettings;
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

export default function BenefitsWheelWidget({
  siteId,
  slug,
  settings,
  mode = "live",
  onPositionChange,
}: BenefitsWheelWidgetProps) {
  const segmentCount = Math.min(12, Math.max(3, Number(settings.segmentCount) || 6));
  const segments = useMemo(
    () => normalizeSegments(settings.segments, segmentCount),
    [settings.segments, segmentCount]
  );
  const spinsAllowed = Math.max(1, Number(settings.spinsPerUser) || 1);
  const position = settings.triggerPosition || { x: 88, y: 82 };
  const isEditor = mode === "editor";

  const [open, setOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<{
    label: string;
    index: number;
    couponCode?: string;
  } | null>(null);
  const [lastWinIndex, setLastWinIndex] = useState<number | null>(null);
  const rotationRef = useRef(0);
  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  useEffect(() => {
    setDragPos(position);
  }, [position.x, position.y]);

  useEffect(() => {
    if (isEditor || !settings.isActive) return;

    const spinsUsed = readVisitorSpinCount(siteId);
    const canSpinNow = spinsUsed < spinsAllowed;

    if (!canSpinNow) {
      const saved = readVisitorSavedPrize(siteId);
      if (saved?.label) {
        setWonPrize({
          label: saved.label,
          index: saved.index ?? 0,
          couponCode: saved.couponCode || segments[saved.index ?? 0]?.couponCode,
        });
        setLastWinIndex(typeof saved.index === "number" ? saved.index : null);
      }
    }

    if (settings.autoOpenOnFirstVisit !== false && !wasAutoShownThisSession(siteId) && canSpinNow) {
      const t = window.setTimeout(() => {
        setWonPrize(null);
        setOpen(true);
        markAutoShownThisSession(siteId);
      }, 800);
      return () => window.clearTimeout(t);
    }
  }, [isEditor, settings.autoOpenOnFirstVisit, settings.isActive, siteId, spinsAllowed, segments]);

  const spinsUsed = isEditor ? 0 : readVisitorSpinCount(siteId);
  const canSpin = isEditor || spinsUsed < spinsAllowed;

  const handleSpin = useCallback(async () => {
    if (spinning || !canSpin) return;

    const winIndex = pickWinningIndex(segments.length, lastWinIndex);
    const extraSpins = 5 + Math.floor(Math.random() * 4);
    const delta = rotationDeltaForSegment(
      rotationRef.current,
      winIndex,
      segments.length,
      extraSpins
    );
    const prize = {
      label: segments[winIndex]?.label || "הטבה",
      index: winIndex,
      couponCode: segments[winIndex]?.couponCode?.trim() || "",
    };

    setSpinning(true);
    setWonPrize(null);
    rotationRef.current += delta;
    setRotation(rotationRef.current);

    window.setTimeout(async () => {
      setSpinning(false);
      setWonPrize(prize);
      setLastWinIndex(winIndex);

      if (!isEditor) {
        writeVisitorSpin(siteId, prize);
        if (slug) {
          try {
            await saveBenefitsWheelSpin(slug, {
              prizeLabel: prize.label,
              segmentIndex: prize.index,
              couponCode: prize.couponCode,
            });
          } catch {
            // prize still saved locally
          }
        }
      }
    }, 4300);
  }, [canSpin, isEditor, lastWinIndex, segments, siteId, slug, spinning]);

  function openModal() {
    if (canSpin) setWonPrize(null);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPos.x,
      origY: dragPos.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    const vw = window.innerWidth || 1;
    const vh = window.innerHeight || 1;
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    const next = {
      x: Math.min(96, Math.max(4, dragRef.current.origX - dx)),
      y: Math.min(96, Math.max(4, dragRef.current.origY + dy)),
    };
    setDragPos(next);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    dragRef.current = null;
    onPositionChange?.(dragPos);
  }

  if (settings.isActive === false) return null;

  const showTrigger = settings.showTrigger !== false;

  return (
    <>
      {showTrigger ? (
        <button
          type="button"
          onClick={openModal}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`fixed z-[99990] flex items-center gap-2 rounded-full shadow-[0_8px_32px_rgba(124,58,237,0.45)] transition hover:scale-105 ${
            isEditor ? "cursor-grab ring-2 ring-violet-400 ring-offset-2" : "cursor-pointer"
          }`}
          style={{
            right: `${dragPos.x}%`,
            bottom: `${100 - dragPos.y}%`,
            transform: "translate(50%, 50%)",
            background: "linear-gradient(135deg, #7C3AED, #a855f7)",
            color: "#fff",
            padding: isEditor ? "10px 14px" : "14px 18px",
          }}
          aria-label={settings.title || "גלגל הטבות"}
        >
          {isEditor ? <GripVertical size={16} className="opacity-80" /> : <Gift size={20} />}
          <span className="text-sm font-bold">{settings.title || "גלגל הטבות"}</span>
        </button>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !spinning) closeModal();
          }}
        >
          <div
            dir="rtl"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_24px_80px_rgba(99,102,241,0.25)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 bg-gradient-to-l from-violet-500 via-fuchsia-500 to-pink-500" />

            <button
              type="button"
              onClick={closeModal}
              disabled={spinning}
              className="absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
              aria-label="סגירה"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="px-6 pb-6 pt-5 text-center">
              <h3 className="text-xl font-black text-slate-900">
                {settings.title || "גלגל ההטבות"}
              </h3>
              {settings.subtitle ? (
                <p className="mt-1 text-sm text-slate-500">{settings.subtitle}</p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">סובבו וגלו מה זכיתם!</p>
              )}

              <div className="my-5 overflow-visible px-2">
                <BenefitsWheelSpinWheel
                  segments={segments}
                  rotation={rotation}
                  spinning={spinning}
                  size={280}
                />
              </div>

              {wonPrize && !spinning ? (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-700">🎉 מזל טוב!</p>
                  <p className="mt-1 text-lg font-black text-emerald-900">{wonPrize.label}</p>
                  {wonPrize.couponCode ? (
                    <div className="mt-3 rounded-lg border border-dashed border-emerald-300 bg-white px-3 py-2">
                      <p className="text-[11px] font-semibold text-emerald-600">קוד ההטבה שלך</p>
                      <p className="mt-0.5 font-mono text-base font-black tracking-wider text-emerald-900">
                        {wonPrize.couponCode}
                      </p>
                    </div>
                  ) : null}
                  <p className="mt-2 text-[11px] text-emerald-600">ההטבה נשמרה עבורך</p>
                </div>
              ) : null}

              {wonPrize && !spinning && canSpin ? (
                <button
                  type="button"
                  onClick={() => setWonPrize(null)}
                  className="mb-2 inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-lg"
                >
                  סובבו שוב!
                </button>
              ) : null}

              {canSpin && !wonPrize ? (
                <button
                  type="button"
                  disabled={spinning}
                  onClick={handleSpin}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-l from-violet-600 to-fuchsia-500 text-sm font-bold text-white shadow-lg disabled:opacity-60"
                >
                  {spinning ? "מסתובב..." : "סובבו את הגלגל!"}
                </button>
              ) : !canSpin && !wonPrize ? (
                <p className="text-sm font-semibold text-slate-500">כבר השתמשתם בסיבובים שלכם</p>
              ) : wonPrize ? (
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-sm font-bold text-violet-700"
                >
                  סגירה
                </button>
              ) : null}

              {isEditor ? (
                <p className="mt-3 text-[11px] text-violet-600">
                  מצב עורך — גררו את הכפתור הצף למיקום הרצוי
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
