import React, { useCallback, useRef } from "react";

type Props = {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  as?: "div" | "article" | "li";
  goldIndex?: number;
};

/**
 * Card whose highlight tracks the pointer.
 * Position is written to CSS custom properties so no React state churns on move.
 * Gold ring focus matches the About / homepage wow cards.
 */
export default function SpotlightCard({
  children,
  accent = "#7c3aed",
  className,
  as: Tag = "article",
  goldIndex = 0,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--pm-mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--pm-my", `${event.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`pm-spot${className ? ` ${className}` : ""}`}
      style={
        {
          "--pm-spot-accent": accent,
          "--gold-i": goldIndex,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
    >
      <div className="pm-spot__shell">{children}</div>
    </Tag>
  );
}
