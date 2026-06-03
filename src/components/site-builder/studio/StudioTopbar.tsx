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
  const canSave = ready && slugValid;

  return (
    <header className="z-50 flex h-[76px] shrink-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/95 px-5 shadow-[0_12px_45px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
      {/* BRAND */}
      <div className="flex min-w-[260px] items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 via-fuchsia-600 to-pink-500 text-base font-black text-white shadow-xl shadow-violet-200">
          B
          <span className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-black leading-none text-slate-950">
            Bizuply Website Studio
          </p>
          <p className="mt-1 truncate text-xs font-bold leading-none text-slate-400">
            עורך אתר מקצועי בלי קוד
          </p>
        </div>
      </div>

      {/* URL */}
      <div className="hidden min-w-[360px] max-w-[520px] flex-1 items-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 xl:flex" dir="ltr">
        <span className="shrink-0 px-3 text-xs font-black text-slate-400">
          URL
        </span>

        <input
          value={slug}
          onChange={(event) => {
            const value = event.target.value
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
              .replace(/-+/g, "-");

            setSlug(value);
          }}
          className={[
            "min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-black outline-none",
            slugValid ? "text-slate-800" : "text-rose-600",
          ].join(" ")}
          dir="ltr"
          placeholder="hadar-beauty"
        />

        <span className="shrink-0 border-l border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-500">
          .bizuply.com
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-x-auto">
        <ToolbarButton title="ביטול פעולה אחרונה" onClick={onUndo}>
          ביטול
        </ToolbarButton>

        <ToolbarButton title="ביצוע מחדש" onClick={onRedo}>
          בצע שוב
        </ToolbarButton>

        <Divider />

        <DeviceButton
          active={device === "Desktop"}
          onClick={() => setDevice("Desktop")}
          title="תצוגת דסקטופ"
        >
          דסקטופ
        </DeviceButton>

        <DeviceButton
          active={device === "Tablet"}
          onClick={() => setDevice("Tablet")}
          title="תצוגת טאבלט"
        >
          טאבלט
        </DeviceButton>

        <DeviceButton
          active={device === "Mobile"}
          onClick={() => setDevice("Mobile")}
          title="תצוגת מובייל"
        >
          מובייל
        </DeviceButton>

        <Divider />

        <ToolbarButton title="ניהול תמונות ומדיה" onClick={onMedia}>
          מדיה
        </ToolbarButton>

        <ToolbarButton title="תצוגה מקדימה" onClick={onPreview}>
          תצוגה
        </ToolbarButton>

        <ToolbarButton title="איפוס האתר לברירת מחדל" onClick={onReset}>
          איפוס
        </ToolbarButton>

        <button
          type="button"
          title="בנייה חכמה עם AI"
          className="shrink-0 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-100 hover:shadow-lg hover:shadow-violet-100"
        >
          AI ✨
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={!canSave}
          title={!slugValid ? "הכתובת לא תקינה" : "שמירה כטיוטה"}
          className={[
            "shrink-0 rounded-2xl border px-4 py-3 text-xs font-black shadow-sm transition",
            canSave
              ? "border-violet-200 bg-white text-violet-700 hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-lg hover:shadow-violet-100"
              : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400",
          ].join(" ")}
        >
          שמירה
        </button>

        <button
          type="button"
          onClick={onPublish}
          disabled={!canSave}
          title={!slugValid ? "הכתובת לא תקינה" : "פרסום האתר"}
          className={[
            "shrink-0 rounded-2xl px-5 py-3 text-xs font-black text-white shadow-xl transition",
            canSave
              ? "bg-gradient-to-l from-violet-700 via-fuchsia-600 to-pink-500 shadow-violet-200 hover:-translate-y-0.5"
              : "cursor-not-allowed bg-slate-300 shadow-none",
          ].join(" ")}
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
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-lg hover:shadow-violet-100"
    >
      {children}
    </button>
  );
}

function DeviceButton({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "shrink-0 rounded-2xl px-4 py-3 text-xs font-black transition",
        active
          ? "bg-slate-950 text-white shadow-lg shadow-slate-200"
          : "border border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-8 w-px shrink-0 bg-slate-200" />;
}