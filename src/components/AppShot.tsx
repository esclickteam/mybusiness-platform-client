"use client";

type AppShotProps = {
  src: string;
  alt: string;
  /** Intrinsic size, so the browser reserves the space and nothing shifts. */
  width: number;
  height: number;
  /** Path chip in the window bar, e.g. "CRM · ניהול לידים". */
  crumb: string;
  /** Skip lazy loading for the shot that is visible on first paint. */
  priority?: boolean;
  className?: string;
};

/**
 * Browser chrome around a real capture of the product. Every screenshot on the
 * home page goes through here so the framing stays identical.
 */
export default function AppShot({
  src,
  alt,
  width,
  height,
  crumb,
  priority = false,
  className = "",
}: AppShotProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/40 via-violet-200/30 to-cyan-200/35 blur-2xl" />

      <figure className="relative m-0 overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/80 p-2 shadow-[0_24px_80px_rgba(79,70,229,0.16)] backdrop-blur-xl sm:p-3">
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-200/80 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50 px-3 py-2.5 sm:px-4">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            </span>

            <span className="truncate text-xs font-bold text-slate-500">
              {crumb}
            </span>
          </div>

          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            className="block h-auto w-full"
          />
        </div>
      </figure>
    </div>
  );
}
