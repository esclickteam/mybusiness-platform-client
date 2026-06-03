import React from "react";

type Props = {
  editorRefContainer: React.RefObject<HTMLDivElement>;
  publicUrl: string;
  layersRef: React.RefObject<HTMLDivElement>;
};

export default function StudioCanvas({
  editorRefContainer,
  publicUrl,
  layersRef,
}: Props) {
  return (
    <main className="relative min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_30%),linear-gradient(135deg,#f8f7ff,#ffffff)] p-5">
      <div className="mb-4 flex h-14 items-center justify-between rounded-[1.6rem] border border-white bg-white/90 px-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-2xl">
        <div>
          <p className="text-xs font-black text-violet-700">תצוגת אתר חיה</p>
          <p className="mt-1 text-sm font-black text-slate-800" dir="ltr">
            {publicUrl}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            Canvas פעיל
          </span>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
            עריכה חופשית
          </span>
        </div>
      </div>

      <div className="h-[calc(100%-4.5rem)] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_34px_120px_rgba(15,23,42,0.13)]">
        <div ref={editorRefContainer} className="h-full w-full" />
      </div>

      <div className="hidden">
        <div ref={layersRef} />
      </div>
    </main>
  );
}