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

const devices: {
  value: DeviceMode;
  label: string;
  icon: string;
  title: string;
}[] = [
  {
    value: "Desktop",
    label: "דסקטופ",
    icon: "▭",
    title: "תצוגת דסקטופ",
  },
  {
    value: "Tablet",
    label: "טאבלט",
    icon: "▯",
    title: "תצוגת טאבלט",
  },
  {
    value: "Mobile",
    label: "מובייל",
    icon: "▮",
    title: "תצוגת מובייל",
  },
];

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

  const cleanSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <header className="z-50 flex h-[78px] shrink-0 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/90 px-4 shadow-[0_14px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:px-5">
      {/* BRAND */}
      <div className="flex min-w-[210px] items-center gap-3 lg:min-w-[270px]">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[1.15rem] bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-base font-black text-white shadow-xl shadow-violet-200">
          B
          <span className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400 shadow-sm" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-black leading-none tracking-[-0.03em] text-slate-800">
            Bizuply Studio
          </p>
          <p className="mt-1 truncate text-xs font-bold leading-none text-slate-400">
            בונה אתרים מקצועי לעסקים
          </p>
        </div>
      </div>

      {/* URL */}
      <div
        className={[
          "hidden min-w-[340px] max-w-[560px] flex-1 items-center overflow-hidden rounded-2xl border bg-slate-50 shadow-inner xl:flex",
          slugValid ? "border-slate-200" : "border-rose-200 bg-rose-50",
        ].join(" ")}
        dir="ltr"
      >
        <span className="shrink-0 border-r border-slate-200 bg-white px-3 py-3 text-xs font-black text-slate-400">
          https://
        </span>

        <input
          value={slug}
          onChange={(event) => setSlug(cleanSlug(event.target.value))}
          className={[
            "min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-black outline-none",
            slugValid ? "text-slate-800" : "text-rose-600",
          ].join(" ")}
          dir="ltr"
          placeholder="your-business"
        />

        <span className="shrink-0 border-l border-slate-200 bg-white px-3 py-3 text-sm font-black text-slate-500">
          .bizuply.com
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 overflow-x-auto">
        <IconButton title="ביטול פעולה אחרונה" onClick={onUndo} icon="↶">
          ביטול
        </IconButton>

        <IconButton title="ביצוע מחדש" onClick={onRedo} icon="↷">
          שוב
        </IconButton>

        <Divider />

        <div className="flex shrink-0 items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1">
          {devices.map((item) => (
            <DeviceButton
              key={item.value}
              active={device === item.value}
              onClick={() => setDevice(item.value)}
              title={item.title}
              icon={item.icon}
            >
              {item.label}
            </DeviceButton>
          ))}
        </div>

        <Divider />

        <IconButton title="ניהול תמונות ומדיה" onClick={onMedia} icon="▧">
          מדיה
        </IconButton>

        <IconButton title="תצוגה מקדימה" onClick={onPreview} icon="👁">
          תצוגה
        </IconButton>

        <IconButton title="איפוס האתר לברירת מחדל" onClick={onReset} icon="↺">
          איפוס
        </IconButton>

        <button
          type="button"
          title="בנייה חכמה עם AI"
          className="group shrink-0 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50 px-4 py-3 text-xs font-black text-violet-700 transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100"
        >
          <span className="ml-1 inline-block transition group-hover:rotate-12">
            ✨
          </span>
          AI
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
              ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 shadow-violet-200 hover:-translate-y-0.5 hover:shadow-violet-300"
              : "cursor-not-allowed bg-slate-300 shadow-none",
          ].join(" ")}
        >
          פרסום 🚀
        </button>
      </div>
    </header>
  );
}

function IconButton({
  children,
  onClick,
  title,
  icon,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="group shrink-0 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-xs font-black text-slate-600 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 hover:shadow-lg hover:shadow-violet-100"
    >
      <span className="ml-1 inline-block text-sm transition group-hover:scale-110">
        {icon}
      </span>
      {children}
    </button>
  );
}

function DeviceButton({
  children,
  active,
  onClick,
  title,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title?: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "shrink-0 rounded-xl px-3 py-2.5 text-xs font-black transition",
        active
          ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg shadow-slate-200"
          : "text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm",
      ].join(" ")}
    >
      <span className="ml-1">{icon}</span>
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-8 w-px shrink-0 bg-slate-200" />;
}
