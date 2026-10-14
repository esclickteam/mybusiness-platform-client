import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

export type AdminRowAction = {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  testId?: string;
  title?: string;
};

type AdminRowMenuProps = {
  items: AdminRowAction[];
  label?: string;
};

type MenuPos = { top: number; left: number };

export default function AdminRowMenu({
  items,
  label = "פעולות",
}: AdminRowMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const visible = items.filter((item) => !item.hidden);

  function place() {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const width = 196;
    let left = rect.right - width;
    if (left < 8) left = Math.min(rect.left, window.innerWidth - width - 8);
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    if (left < 8) left = 8;
    const estimated = Math.min(320, visible.length * 34 + 12);
    let top = rect.bottom + 4;
    if (top + estimated > window.innerHeight - 8) {
      top = Math.max(8, rect.top - estimated - 4);
    }
    setPos({ top, left });
  }

  useEffect(() => {
    if (!open) return undefined;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    function close() {
      setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  if (visible.length === 0) return null;

  return (
    <div className="biz-row-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="biz-icon-btn is-row"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(event) => {
          event.stopPropagation();
          if (open) {
            setOpen(false);
            return;
          }
          place();
          setOpen(true);
        }}
      >
        <MoreHorizontal size={16} strokeWidth={2} />
      </button>
      {open && pos
        ? createPortal(
            <div
              className="biz-row-menu-panel is-fixed"
              id={menuId}
              role="menu"
              ref={panelRef}
              style={{ top: pos.top, left: pos.left }}
            >
              {visible.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  data-testid={item.testId}
                  title={item.title}
                  className={item.danger ? "is-danger" : undefined}
                  disabled={item.disabled}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpen(false);
                    item.onClick();
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
