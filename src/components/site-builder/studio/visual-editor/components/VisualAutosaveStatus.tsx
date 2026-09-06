import { useTranslation } from "react-i18next";
import type { VisualAutosaveStatus as AutosaveStatus } from "../utils/visualAutosaveController";

type VisualAutosaveStatusProps = {
  status: AutosaveStatus;
  onRetry?: () => void;
};

export default function VisualAutosaveStatus({
  status,
  onRetry,
}: VisualAutosaveStatusProps) {
  const { t } = useTranslation();
  const labels: Record<AutosaveStatus, string> = {
    clean: t("leftover.autosave.saved"),
    dirty: "",
    saving: t("leftover.autosave.saving"),
    saved: t("leftover.autosave.saved"),
    error: t("leftover.autosave.error"),
    offline: t("leftover.autosave.offline"),
  };
  const label = labels[status] || "";

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
          {t("leftover.autosave.retry")}
        </button>
      ) : null}
    </div>
  );
}