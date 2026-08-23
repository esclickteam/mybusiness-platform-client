/**
 * Shared responsive classes for admin floating panels (softphone, notifications).
 * Classes are fully static so Tailwind JIT can detect them.
 */
import type { CSSProperties } from "react";
export const ADMIN_FLOATING_PANEL_CLASS = [
  "fixed z-[9999] flex flex-col overflow-hidden border border-slate-200/90 bg-white text-slate-900",
  // Mobile: bottom sheet
  "inset-x-0 bottom-0 top-auto h-[min(92dvh,720px)] w-full rounded-t-[28px] rounded-b-none",
  "pb-[env(safe-area-inset-bottom)]",
  "shadow-[0_-16px_48px_rgba(15,23,42,0.2)]",
  // Desktop: floating card under header
  "sm:inset-auto sm:left-4 sm:top-20 sm:left-6",
  "sm:h-[min(680px,calc(100dvh-6.5rem))] sm:w-[min(400px,calc(100vw-24px))]",
  "sm:rounded-[30px] sm:pb-0",
  "sm:shadow-[0_24px_80px_rgba(15,23,42,0.18)]",
].join(" ");

export const ADMIN_FLOATING_PANEL_COMPACT_CLASS = [
  "fixed z-[9999] flex flex-col overflow-hidden border border-slate-200/90 bg-white text-slate-900",
  "inset-x-0 bottom-0 top-auto h-[min(92dvh,680px)] w-full max-w-full rounded-t-[28px] rounded-b-none",
  "pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-[env(safe-area-inset-top)]",
  "shadow-[0_-16px_48px_rgba(15,23,42,0.2)]",
  "sm:inset-auto sm:left-4 sm:top-20 sm:left-6",
  "sm:h-[min(560px,calc(100dvh-6.5rem))] sm:w-[min(380px,calc(100vw-24px))]",
  "sm:max-w-[380px] sm:rounded-[28px] sm:pb-0 sm:pt-0",
  "sm:shadow-2xl",
].join(" ");

/** Panel classes when positioned under the notifications bell (all breakpoints). */
export const ADMIN_ANCHORED_PANEL_CLASS = [
  "fixed z-[9999] flex flex-col overflow-hidden border border-slate-200/90 bg-white text-slate-900",
  "rounded-[28px] shadow-2xl",
  "pb-[max(env(safe-area-inset-bottom),0.5rem)]",
].join(" ");

export function getAdminAnchoredPanelStyle(
  anchor: HTMLElement | null,
  viewport = typeof window !== "undefined"
    ? { width: window.innerWidth, height: window.innerHeight }
    : { width: 0, height: 0 }
): CSSProperties {
  if (!anchor || !viewport.width) {
    return { visibility: "hidden" };
  }

  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  const panelWidth = Math.min(380, viewport.width - margin * 2);
  const top = Math.min(rect.bottom + margin, viewport.height - margin);
  const maxHeight = Math.max(200, viewport.height - top - margin);

  // Drop below the bell, centered on it, then clamp so nothing is clipped.
  let left = rect.left + rect.width / 2 - panelWidth / 2;
  left = Math.max(margin, Math.min(left, viewport.width - panelWidth - margin));

  return {
    position: "fixed",
    top,
    left,
    right: "auto",
    width: panelWidth,
    maxHeight,
    visibility: "visible",
  };
}

export const ADMIN_PAGE_SHELL_CLASS =
  "min-h-screen bg-[#f6f2fb] px-3 py-5 text-right text-slate-800 sm:px-4 sm:py-7 md:px-8";

export const ADMIN_MOBILE_BACKDROP_CLASS =
  "fixed inset-0 z-[9998] bg-slate-950/35 backdrop-blur-[2px] sm:hidden";

export const ADMIN_PANEL_BACKDROP_CLASS =
  "fixed inset-0 z-[9998] bg-slate-950/35 backdrop-blur-[2px]";
