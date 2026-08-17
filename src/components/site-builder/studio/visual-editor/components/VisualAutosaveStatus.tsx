import type { VisualAutosaveStatus as AutosaveStatus } from "../utils/visualAutosaveController";

const LABELS: Record<AutosaveStatus, string> = {
  clean: "נשמר",
  dirty: "",
  saving: "שומר...",
  saved: "נשמר",
  error: "השמירה נכשלה",
  offline: "אין חיבור — השינויים יישמרו כשיחזור",
};

type VisualAutosaveStatusProps = {
  status: AutosaveStatus;
  onRetry?: () => void;
};

export default function VisualAutosaveStatus({
  status,
  onRetry,
}: VisualAutosaveStatusProps) {
  const label = LABELS[status] || "";

  return (
    <div
      className="hidden max-w-[220px] items-center gap-2 sm:flex"
      data-testid="visual-autosave-status"
      data-autosave-status={status}
    >
      {label ? (
        <span
          className={[
            "truncate text-[11px] font-bold",
            status === "error" || status === "offline"
              ? "text-rose-600"
              : status === "saving"
                ? "text-violet-600"
                : "text-slate-500",
          ].join(" ")}
        >
          {label}
        </span>
      ) : null}
      {status === "error" ? (
        <button
          type="button"
          data-testid="visual-autosave-retry"
          onClick={onRetry}
          className="shrink-0 text-[11px] font-black text-violet-700 underline-offset-2 hover:underline"
        >
          נסה שוב
        </button>
      ) : null}
    </div>
  );
}