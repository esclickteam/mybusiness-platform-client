import React, { useEffect, useState } from "react";
import { CalendarCheck2, PackageCheck, UserRoundPlus } from "lucide-react";

const EVENTS = [
  {
    id: "lead",
    label: "ליד חדש התקבל",
    icon: UserRoundPlus,
    from: "start",
    y: "14%",
  },
  {
    id: "booking",
    label: "תור חדש נקבע",
    icon: CalendarCheck2,
    from: "end",
    y: "38%",
  },
  {
    id: "order",
    label: "הזמנה חדשה התקבלה",
    icon: PackageCheck,
    from: "start",
    y: "62%",
  },
] as const;

type Phase = "in" | "hold" | "out" | "idle";

export default function FloatingBusinessEvent() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("in");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("hold");
      return;
    }

    const timers: number[] = [];
    let i = 0;
    setPhase("in");

    const runCycle = () => {
      setIndex(i);
      setPhase("in");
      timers.push(
        window.setTimeout(() => setPhase("hold"), 40),
        window.setTimeout(() => setPhase("out"), 2200),
        window.setTimeout(() => {
          setPhase("idle");
          i = (i + 1) % EVENTS.length;
          timers.push(window.setTimeout(runCycle, 700));
        }, 2600),
      );
    };

    runCycle();
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, []);

  const event = EVENTS[index];
  const Icon = event.icon;

  return (
    <div className="wb-toast-layer" aria-hidden="true">
      <div
        key={`${event.id}-${index}`}
        className={`wb-toast wb-toast--${event.from} is-${phase}`}
        style={{ top: event.y }}
      >
        <span className="wb-toast__icon">
          <Icon size={16} strokeWidth={2.2} />
        </span>
        <p className="wb-toast__label">{event.label}</p>
      </div>
    </div>
  );
}
