import React, { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: "up" | "left" | "right" | "scale" | "fade";
};

/** Scroll-triggered reveal used by landing templates for real motion. */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
  variant = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hidden = {
    up: "translate-y-8 opacity-0",
    left: "translate-x-8 opacity-0",
    right: "-translate-x-8 opacity-0",
    scale: "scale-[0.94] opacity-0",
    fade: "opacity-0",
  }[variant];

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        visible ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hidden,
        className,
      ].join(" ")}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export function useCountUp(target: number, enabled: boolean, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target, duration]);

  return value;
}
