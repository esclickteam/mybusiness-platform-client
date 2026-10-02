import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import "./menuSelect.css";

export type MenuOption = {
  value: string;
  label: string;
};

type MenuSelectProps = {
  id?: string;
  value: string;
  options: MenuOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  theme?: "dark" | "light";
  fit?: boolean;
};

function placeMenu(button: HTMLElement, menu: HTMLElement) {
  const rect = button.getBoundingClientRect();
  const margin = 8;
  const gap = 6;
  const spaceBelow = window.innerHeight - rect.bottom - margin;
  const spaceAbove = rect.top - margin;
  const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
  const maxHeight = Math.max(140, Math.min(320, openUp ? spaceAbove - gap : spaceBelow - gap));
  const width = Math.min(Math.max(rect.width, 220), window.innerWidth - margin * 2);
  const direction = getComputedStyle(button).direction;
  let left = direction === "rtl" ? rect.right - width : rect.left;
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
  const top = openUp ? Math.max(margin, rect.top - gap - maxHeight) : rect.bottom + gap;
  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;
  menu.style.width = `${width}px`;
  menu.style.maxHeight = `${maxHeight}px`;
  menu.dataset.placement = openUp ? "up" : "down";
}

export default function MenuSelect({
  id,
  value,
  options,
  onChange,
  ariaLabel,
  theme = "dark",
  fit = false,
}: MenuSelectProps) {
  const listId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const typeBuffer = useRef("");
  const typeTimer = useRef<number | null>(null);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const current = options.find((option) => option.value === value) || options[selectedIndex];
  const active = Math.min(activeIndex, Math.max(options.length - 1, 0));

  useLayoutEffect(() => {
    if (!open) return undefined;
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return undefined;
    const update = () => placeMenu(button, menu);
    update();
    const selected = menu.querySelector<HTMLElement>('[aria-selected="true"]');
    selected?.scrollIntoView?.({ block: "nearest" });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  function choose(next: string) {
    onChange(next);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function move(delta: number) {
    if (!options.length) return;
    setActiveIndex((index) => {
      const start = Math.min(index, options.length - 1);
      return (start + delta + options.length) % options.length;
    });
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(selectedIndex);
        setOpen(true);
      } else {
        move(1);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(selectedIndex);
        setOpen(true);
      } else {
        move(-1);
      }
    } else if (event.key === "Home" && open) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End" && open) {
      event.preventDefault();
      setActiveIndex(Math.max(options.length - 1, 0));
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      if (options[active]) choose(options[active].value);
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (open && event.key.length === 1 && /\S/.test(event.key)) {
      typeBuffer.current = `${typeBuffer.current}${event.key}`.toLowerCase();
      if (typeTimer.current) window.clearTimeout(typeTimer.current);
      typeTimer.current = window.setTimeout(() => {
        typeBuffer.current = "";
      }, 700);
      const match = options.findIndex((option) => option.label.toLowerCase().startsWith(typeBuffer.current));
      if (match >= 0) setActiveIndex(match);
    }
  }

  useEffect(() => {
    if (!open) return;
    const node = menuRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView?.({ block: "nearest" });
  }, [open, active]);

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          id={listId}
          className="ms-menu"
          data-theme={theme}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.length ? (
            options.map((option, index) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  id={`${listId}-opt-${index}`}
                  aria-selected={selected}
                  data-active={index === active ? "true" : "false"}
                  className={`ms-option${selected ? " is-selected" : ""}${index === active ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => choose(option.value)}
                >
                  <span className="ms-option-label" dir="auto">{option.label}</span>
                  {selected ? <Check size={16} aria-hidden="true" /> : <span className="ms-option-spacer" aria-hidden="true" />}
                </button>
              );
            })
          ) : (
            <div className="ms-empty">—</div>
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className={`ms${fit ? " is-fit" : ""}`} data-theme={theme}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className="ms-trigger"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && options[active] ? `${listId}-opt-${active}` : undefined}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setOpen((currentOpen) => !currentOpen);
        }}
        onKeyDown={onKeyDown}
      >
        <span className="ms-value" dir="auto">{current?.label || "—"}</span>
        <ChevronDown size={16} aria-hidden="true" className={open ? "is-open" : ""} />
      </button>
      {menu}
    </div>
  );
}
