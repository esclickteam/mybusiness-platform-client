import React from "react";

type Props = {
  editorRefContainer: React.RefObject<HTMLDivElement | null>;
  publicUrl: string;
  layersRef: React.RefObject<HTMLDivElement | null>;
};

export default function StudioCanvas({
  editorRefContainer,
  publicUrl,
  layersRef,
}: Props) {
  return (
    <main className="relative min-h-0 min-w-0 overflow-auto bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_30%),linear-gradient(135deg,#f8f7ff,#ffffff)] p-4 lg:p-5">
      {/* TOP CANVAS BAR */}
      <div className="mb-4 flex h-16 min-w-[820px] items-center justify-between gap-4 rounded-[1.7rem] border border-white/80 bg-white/90 px-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]" />

            <p className="text-xs font-black text-violet-700">
              תצוגת אתר חיה
            </p>
          </div>

          <p
            className="max-w-[520px] truncate text-sm font-black text-slate-800"
            dir="ltr"
            title={publicUrl}
          >
            {publicUrl}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <StatusBadge tone="emerald">Canvas פעיל</StatusBadge>
          <StatusBadge tone="violet">עריכה חופשית</StatusBadge>
          <StatusBadge tone="slate">Drag & Drop</StatusBadge>
        </div>
      </div>

      {/* CANVAS FRAME */}
      <div className="relative h-[calc(100%-5rem)] min-h-[720px] min-w-[820px] overflow-hidden rounded-[2.15rem] border border-white bg-white shadow-[0_34px_120px_rgba(15,23,42,0.13)]">
        {/* DECORATION */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-white/80 to-transparent" />

        <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          <span className="text-[11px] font-black text-slate-500">
            Live Editor
          </span>
        </div>

        <div className="h-full min-h-[720px] w-full min-w-[820px] overflow-hidden">
          <div
            ref={editorRefContainer}
            className="h-full min-h-[720px] w-full min-w-[820px]"
          />
        </div>
      </div>

      {/* HIDDEN LAYERS CONTAINER */}
      <div className="hidden">
        <div ref={layersRef} />
      </div>
    </main>
  );
}

function StatusBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "emerald" | "violet" | "slate";
}) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-black ring-1",
        styles[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}