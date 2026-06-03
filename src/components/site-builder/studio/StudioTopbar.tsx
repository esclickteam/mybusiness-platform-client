import React from "react";
import type { DeviceMode } from "./types";

type Props = {
  slug: string;
  setSlug: (value: string) => void;
  slugValid: boolean;
  device: DeviceMode;
  setDevice: (value: DeviceMode) => void;
  ready: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onMedia: () => void;
  onReset: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

export default function StudioTopbar({
  slug,
  setSlug,
  device,
  setDevice,
  ready,
  slugValid,
  onUndo,
  onRedo,
  onPreview,
  onMedia,
  onReset,
  onSaveDraft,
  onPublish,
}: Props) {
  return (
    <header className="z-50 flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/95 px-5 shadow-[0_12px_45px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-fuchsia-600 text-base font-black text-white shadow-xl shadow-violet-200">
          B
        </div>

        <div>
          <p className="text-base font-black leading-none text-slate-950">
            Bizuply Website Studio
          </p>
          <p className="mt-1 text-xs font-bold leading-none text-slate-400">
            עורך אתר מקצועי בלי קוד
          </p>
        </div>
      </div>

      <div className="flex min-w-[430px] items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50" dir="ltr">
        <span className="px-3 text-xs font-black text-slate-400">URL</span>
        <input
          value={slug}
          onChange={(event) => setSlug(event.target.value.toLowerCase().trim())}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-black text-slate-800 outline-none"
          dir="ltr"
          placeholder="hadar-beauty"
        />
        <span className="border-l border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-500">
          .bizuply.com
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ToolbarButton onClick={onUndo}>ביטול</ToolbarButton>
        <ToolbarButton onClick={onRedo}>בצע שוב</ToolbarButton>

        <div className="mx-1 h-8 w-px bg-slate-200" />

        <DeviceButton active={device === "Desktop"} onClick={() => setDevice("Desktop")}>
          דסקטופ
        </DeviceButton>
        <DeviceButton active={device === "Tablet"} onClick={() => setDevice("Tablet")}>
          טאבלט
        </DeviceButton>
        <DeviceButton active={device === "Mobile"} onClick={() => setDevice("Mobile")}>
          מובייל
        </DeviceButton>

        <div className="mx-1 h-8 w-px bg-slate-200" />

        <ToolbarButton onClick={onMedia}>מדיה</ToolbarButton>
        <ToolbarButton onClick={onPreview}>תצוגה מקדימה</ToolbarButton>
        <ToolbarButton onClick={onReset}>איפוס</ToolbarButton>

        <button
          type="button"
          className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs font-black text-violet-700 transition hover:bg-violet-100"
        >
          AI לבניית אתר ✨
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={!ready || !slugValid}
          className="rounded-2xl border border-violet-200 bg-white px-4 py-3 text-xs font-black text-violet-700 shadow-sm transition hover:bg-violet-50 disabled:opacity-40"
        >
          שמירה כטיוטה
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={!ready || !slugValid}
          className="rounded-2xl bg-gradient-to-l from-violet-700 to-fuchsia-600 px-5 py-3 text-xs font-black text-white shadow-xl shadow-violet-200 transition hover:-translate-y-0.5 disabled:opacity-40"
        >
          פרסום 🚀
        </button>
      </div>
    </header>
  );
}

function ToolbarButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      {children}
    </button>
  );
}

function DeviceButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-3 text-xs font-black transition",
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}