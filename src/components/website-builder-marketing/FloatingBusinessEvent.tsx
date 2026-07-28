import React, { useEffect, useState } from "react";
import { CalendarCheck2, PackageCheck, UserRoundPlus } from "lucide-react";

const EVENTS = [
  {
    id: "lead",
    label: "ליד חדש התקבל",
    icon: UserRoundPlus,
  },
  {
    id: "booking",
    label: "תור חדש נקבע",
    icon: CalendarCheck2,
  },
  {
    id: "order",
    label: "הזמנה חדשה התקבלה",
    icon: PackageCheck,
  },
] as const;

export default function FloatingBusinessEvent() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hideTimer: number | undefined;
    const cycle = window.setInterval(() => {
      setVisible(false);
      hideTimer = window.setTimeout(() => {
        setIndex((value) => (value + 1) % EVENTS.length);
        setVisible(true);
      }, 280);
    }, 3400);

    return () => {
      window.clearInterval(cycle);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  const event = EVENTS[index];
  const Icon = event.icon;

  return (
    <div className="wb-toast-stack" aria-hidden="true">
      <div
        key={event.id}
        className={`wb-toast${visible ? " is-visible" : ""}`}
      >
        <span className="wb-toast__icon">
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <p className="wb-toast__label">{event.label}</p>
      </div>
    </div>
  );
}
