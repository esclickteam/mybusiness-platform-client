import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GripVertical } from "lucide-react";

import {
  buildWhatsAppUrl,
  isWhatsAppWithinHours,
  matchesDeviceTarget,
  matchesPageTarget,
  mergeWhatsAppFloatSettings,
  type WhatsAppFloatSettings,
} from "./whatsappFloatUtils";

type WhatsAppFloatWidgetProps = {
  settings?: Partial<WhatsAppFloatSettings> | null;
  fallbackPhone?: string;
  mode?: "live" | "editor";
  pageId?: string;
  pagePath?: string;
  siteSlug?: string;
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
  pageId,
  pagePath,
  siteSlug,
  onPositionChange,
}: WhatsAppFloatWidgetProps) {
  const cfg = mergeWhatsAppFloatSettings(settings);
  const agents = Array.isArray(cfg.agents) ? cfg.agents.filter((a) => a.phone) : [];
  const [agentId, setAgentId] = useState(agents[0]?.id || "");
  const selected = agents.find((a) => a.id === agentId) || agents[0];
  const pageMessage =
    (pagePath && cfg.pageMessages?.[pagePath]) ||
    (pageId && cfg.pageMessages?.[pageId]) ||
    cfg.message;
  const phone =
    String(selected?.phone || cfg.phone || "").trim() ||
    String(fallbackPhone || "").trim();
  const online = isWhatsAppWithinHours(cfg);
  const href = online
    ? buildWhatsAppUrl(phone, selected?.message || pageMessage)
    : "";
  const hideOnMobile = cfg.showOnMobile === false;
  const hideOnDesktop = cfg.showOnDesktop === false;
  if (mode === "live" && !matchesPageTarget(cfg.pageTargeting, pageId)) return null;
  if (mode === "live" && !matchesDeviceTarget({
    mobile: cfg.showOnMobile !== false,
    desktop: cfg.showOnDesktop !== false,
    tablet: true,
  })) return null;
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
    // Match Smart Bot: never clobber live drag with prop sync.
    if (dragRef.current) return;
    setDragPos(position);
    dragPosRef.current = position;
  }, [position.x, position.y]);

  useEffect(() => {
    dragPosRef.current = dragPos;
  }, [dragPos]);

  function onPointerDown(e: React.PointerEvent) {
    if (!isEditor) return;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
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
    e.preventDefault();
    const vw = Math.max(1, window.innerWidth);
    const vh = Math.max(1, window.innerHeight);
    const dx = ((e.clientX - dragRef.current.startX) / vw) * 100;
    const dy = ((e.clientY - dragRef.current.startY) / vh) * 100;
    if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
      dragRef.current.moved = true;
    }
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
      e.preventDefault();
      e.stopPropagation();
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }

  if (cfg.isActive === false) return null;

  const triggerClassName = [
    "relative flex h-14 w-14 touch-none items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 select-none",
    missingPhone
      ? "cursor-not-allowed bg-[#25D366]"
      : "bg-[#25D366] hover:bg-[#1ebe57]",
    isEditor
      ? "cursor-grab active:cursor-grabbing ring-2 ring-emerald-300 ring-offset-2"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const triggerStyle = {
    touchAction: "none" as const,
  };

  const ui = (
    <div
      className={[
        hideOnMobile ? "hidden sm:block" : "",
        hideOnDesktop ? "sm:hidden" : "",
        !hideOnMobile && !hideOnDesktop ? "block" : "",
      ]
        .filter(Boolean)
        .join(" ") || "block"}
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
      {isEditor ? (
        <button
          type="button"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={(e) => {
            if (suppressClickRef.current) {
              e.preventDefault();
              return;
            }
          }}
          aria-label="WhatsApp"
          title={
            missingPhone
              ? "הגדירו מספר WhatsApp בהגדרות התוסף"
              : "גררו לכל מקום בעמוד"
          }
          className={triggerClassName}
          style={triggerStyle}
        >
          <GripVertical
            size={12}
            className="absolute -left-1 -top-1 opacity-80"
          />
          <WhatsAppLogo size={30} />
        </button>
      ) : (
        <a
          href={href || undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (suppressClickRef.current || !href) e.preventDefault();
            if (href && siteSlug) {
              fetch(`/api/site-builder/public/${encodeURIComponent(siteSlug)}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  eventType: "whatsapp_click",
                  pagePath,
                  source: "whatsapp-float",
                }),
              }).catch(() => undefined);
            }
          }}
          aria-label="WhatsApp"
          title={missingPhone ? "Set WhatsApp number in settings" : "WhatsApp"}
          className={triggerClassName}
        >
          <WhatsAppLogo size={30} />
        </a>
      )}
      {!isEditor && agents.length > 1 ? (
        <div className="mt-2 flex flex-col gap-1 rounded-xl bg-white p-2 text-xs shadow">
          {agents.map((agent) => (
            <button
              key={agent.id}
              type="button"
              onClick={() => setAgentId(agent.id)}
              className={agent.id === (selected?.id || "") ? "font-bold text-emerald-700" : "text-slate-600"}
            >
              {agent.name || agent.phone}
            </button>
          ))}
        </div>
      ) : null}
      {!isEditor && !online ? (
        <div className="mt-2 max-w-[180px] rounded-lg bg-white p-2 text-[11px] text-slate-600 shadow">
          {cfg.offlineMessage || "We are currently offline"}
        </div>
      ) : null}
      {isEditor ? (
        <div className="mt-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-center text-[10px] font-bold text-white">
          WhatsApp · גררו
        </div>
      ) : null}
    </div>
  );

  if (typeof document === "undefined") return ui;
  return createPortal(ui, document.body);
}
