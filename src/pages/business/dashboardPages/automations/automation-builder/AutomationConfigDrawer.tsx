import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Shell only — config forms stay as children (live updateSelectedData behavior).
 */
export default function AutomationConfigDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="af-drawer-backdrop af-drawer-backdrop--config" role="presentation">
      <aside
        className="af-drawer af-drawer--config"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="af-drawer__header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="af-drawer__close"
            aria-label="סגור"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </header>
        <div className="af-drawer__body af-drawer__body--config">{children}</div>
        {footer ? <footer className="af-drawer__footer">{footer}</footer> : null}
      </aside>
    </div>,
    document.body
  );
}