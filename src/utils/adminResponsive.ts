/**
 * Shared responsive classes for admin floating panels (softphone, notifications).
 * Classes are fully static so Tailwind JIT can detect them.
 */
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
  "inset-x-0 bottom-0 top-auto h-[min(85dvh,560px)] w-full rounded-t-[28px] rounded-b-none",
  "pb-[env(safe-area-inset-bottom)]",
  "shadow-[0_-16px_48px_rgba(15,23,42,0.2)]",
  "sm:inset-auto sm:left-4 sm:top-20 sm:left-6",
  "sm:h-[min(560px,calc(100dvh-6.5rem))] sm:w-[min(380px,calc(100vw-24px))]",
  "sm:rounded-[28px] sm:pb-0",
  "sm:shadow-2xl",
].join(" ");

export const ADMIN_PAGE_SHELL_CLASS =
  "min-h-screen bg-[#f6f2fb] px-3 py-5 text-right text-slate-800 sm:px-4 sm:py-7 md:px-8";

export const ADMIN_MOBILE_BACKDROP_CLASS =
  "fixed inset-0 z-[9998] bg-slate-950/35 backdrop-blur-[2px] sm:hidden";
