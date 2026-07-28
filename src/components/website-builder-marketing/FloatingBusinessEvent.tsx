import React from "react";
import { CalendarCheck2, PackageCheck, UserRoundPlus } from "lucide-react";

const EVENTS = [
  {
    id: "lead",
    label: "ליד חדש התקבל",
    icon: UserRoundPlus,
    className: "wb-float--1",
  },
  {
    id: "booking",
    label: "תור חדש נקבע",
    icon: CalendarCheck2,
    className: "wb-float--2",
  },
  {
    id: "order",
    label: "הזמנה חדשה התקבלה",
    icon: PackageCheck,
    className: "wb-float--3",
  },
] as const;

export default function FloatingBusinessEvent() {
  return (
    <>
      {EVENTS.map((event) => {
        const Icon = event.icon;
        return (
          <div
            key={event.id}
            className={`wb-float ${event.className}`}
            aria-hidden="true"
          >
            <span className="wb-float__icon">
              <Icon size={16} strokeWidth={2.2} />
            </span>
            <p className="wb-float__label">{event.label}</p>
          </div>
        );
      })}
    </>
  );
}
