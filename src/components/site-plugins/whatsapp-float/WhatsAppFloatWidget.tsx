import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GripVertical } from "lucide-react";

import {
  buildWhatsAppUrl,
  mergeWhatsAppFloatSettings,
  type WhatsAppFloatSettings,
} from "./whatsappFloatUtils";

type WhatsAppFloatWidgetProps = {
  settings?: Partial<WhatsAppFloatSettings> | null;
  fallbackPhone?: string;
  mode?: "live" | "editor";
  onPositionChange?: (pos: { x: number; y: number }) => void;
};

function WhatsAppLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="#fff"
        d="M16.01 3C9.38 3 4 8.29 4 14.81c0 2.55.83 4.91 2.24 6.85L4.7 27.7l6.3-1.64A12.1 12.1 0 0 0 16 26.62c6.63 0 12.01-5.29 12.01-11.81C28.01 8.29 22.64 3 16.01 3zm6.95 16.86c-.29.82-1.7 1.5-2.37 1.6-.61.09-1.38.13-2.23-.14-.51-.16-1.17-.38-2.02-.75-3.55-1.53-5.86-5.11-6.04-5.35-.18-.24-1.45-1.93-1.45-3.68s.92-2.61 1.25-2.96c.33-.35.72-.44.96-.44h.69c.22 0 .52-.08.81.62.29.71.99 2.45 1.08 2.63.09.18.15.39.03.62-.12.24-.18.39-.36.6-.18.21-.38.46-.54.62-.18.18-.36.37-.15.72.21.35.93 1.53 2 2.48 1.38 1.22 2.54 1.6 2.9 1.78.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.35.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.69z"
      />
    </svg>
  );
}

export default function WhatsAppFloatWidget({
  settings,
  fallbackPhone = "",
  mode = "live",
  onPositionChange,
}: WhatsAppFloatWidgetProps) {
  const cfg = mergeWhatsAppFloatSettings(settings);
  const phone = String(cfg.phone || "").trim() || String(fallbackPhone || "").trim();
  const href = buildWhatsAppUrl(phone, cfg.message);
  const hideOnMobile = cfg.showOnMobile === false;
  const missingPhone = !href;
  const isEditor = mode === "editor";
  const position = cfg.triggerPosition || { x: 8, y: 88 };

  const [dragPos, setDragPos] = useState(position);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const dragPosRef = useRef(dragPos);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    setDragPos(position);
    dragPosRef.current = position;
  }, [position.x, position.y]);

  useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: dragPosRef.current.x,
      origY: dragPosRef.current.y,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight);
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    if (Math.abs(dx) + Math.abs(dy) > 0.4) dragRef.current.moved = true;
    const next = {
      x: Math.min(96, Math.max(4, dragRef.current.origX - dx)),
      y: Math.min(96, Math.max(4, dragRef.current.origY + dy)),
    };
    dragPosRef.current = next;
    setDragPos(next);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragRef.current || !isEditor) return;
    if (e.pointerId !== dragRef.current.pointerId) return;
    const moved = dragRef.current.moved;
    dragRef.current = null;
    if (moved) {
      suppressClickRef.current = true;
      onPositionChange?.(dragPosRef.current);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);
    }
  }

  if (cfg.isActive === false) return null;

  const ui = (
    <div
      className={hideOnMobile ? "hidden sm:block" : "block"}
      style={{
        position: "fixed",
        zIndex: 2147483000,
        right: `${dragPos.x}%`,
        bottom: `${100 - dragPos.y}%`,
        transform: "translate(50%, 50%)",
      }}
      data-bizuply-widget="whatsapp-float"
      data-bizuply-plugin-runtime="true"
    >
      <a
        href={href || undefined}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (suppressClickRef.current || !href) e.preventDefault();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label="WhatsApp"
        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 ${
          missingPhone
            ? "cursor-not-allowed bg-slate-400"
            : "bg-[#25D366] hover:bg-[#1ebe57]"
        } ${isEditor ? "cursor-grab active:cursor-grabbing ring-2 ring-emerald-300 ring-offset-2" : ""}`}
        title={missingPhone ? "Set WhatsApp number in settings" : "WhatsApp"}
      >
        {isEditor ? (
          <GripVertical size={12} className="absolute -left-1 -top-1 opacity-80" />
        ) : null}
        <WhatsAppLogo size={30} />
      </a>
      {isEditor ? (
        <div className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-center text-[10px] font-bold text-white">
          WhatsApp
        </div>
      ) : null}
    </div>
  );

  if (typeof document === "undefined") return ui;
  return createPortal(ui, document.body);
}
