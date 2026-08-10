import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClose: () => void;
  /** Return false to abort close (e.g. unsaved changes confirm cancelled). */
  onRequestClose?: () => boolean | void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  allowBackdropClose?: boolean;
};

/**
 * Shell only — config forms stay as children (live updateSelectedData behavior).
 */
export default function AutomationConfigDrawer({
  open,
  title,
  subtitle,
  icon,
  onClose,
  onRequestClose,
  children,
  footer,
  allowBackdropClose = true,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requestClose = () => {
    const result = onRequestClose?.();
    if (result === false) {
      setConfirmOpen(true);
      return;
    }
    setConfirmOpen(false);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setConfirmOpen(false);
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onRequestClose, onClose]);

  if (!open) return null;

  return (
    <div
      className="af-drawer-backdrop af-drawer-backdrop--config"
      role="presentation"
      onClick={() => {
        if (!allowBackdropClose) return;
        requestClose();
      }}
    >
      <aside
        className="af-drawer af-drawer--config"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="af-drawer__header">
          <div className="af-drawer__header-main">
            {icon ? (
              <span className="af-drawer__header-icon" aria-hidden>
                {icon}
              </span>
            ) : null}
            <div>
              <h2>{title}</h2>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          <button
            type="button"
            className="af-drawer__close"
            aria-label="סגור"
            onClick={requestClose}
          >
            <X size={16} />
          </button>
        </header>
        <div className="af-drawer__body af-drawer__body--config">{children}</div>
        {footer ? <footer className="af-drawer__footer">{footer}</footer> : null}

        {confirmOpen ? (
          <div className="af-drawer-confirm" role="alertdialog" aria-modal="true">
            <div className="af-drawer-confirm__card">
              <p>יש שינויים שלא נשמרו. לצאת בלי לשמור?</p>
              <div className="af-drawer-confirm__actions">
                <button
                  type="button"
                  className="af-btn af-btn--secondary"
                  onClick={() => setConfirmOpen(false)}
                >
                  המשך עריכה
                </button>
                <button
                  type="button"
                  className="af-btn af-btn--danger"
                  onClick={() => {
                    setConfirmOpen(false);
                    onClose();
                  }}
                >
                  צא בלי לשמור
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
