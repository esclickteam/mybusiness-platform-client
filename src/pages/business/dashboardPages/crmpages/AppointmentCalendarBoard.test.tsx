import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AppointmentCalendarBoard from "./AppointmentCalendarBoard";

const weekdayLabels = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

describe("AppointmentCalendarBoard", () => {
  it("renders compact month cells with appointment chips", () => {
    render(
      <AppointmentCalendarBoard
        view="month"
        isMobile={false}
        anchor={new Date("2026-10-19T12:00:00")}
        selectedDate="2026-10-19"
        weekdayLabels={weekdayLabels}
        todayIso="2026-10-19"
        appointments={[
          {
            _id: "1",
            date: "2026-10-19",
            time: "10:00",
            duration: 45,
            serviceName: "Cut",
            label: "Dana",
          },
        ]}
        onSelectDate={() => undefined}
        onOpenAppointment={() => undefined}
        onCreateAt={() => undefined}
        onDropAppointment={() => undefined}
      />
    );
    expect(document.querySelector('[data-calendar-layout="month"]')).toBeTruthy();
    expect(screen.getByText(/10:00 Dana/)).toBeTruthy();
  });

  it("uses agenda layout on mobile month view", () => {
    render(
      <AppointmentCalendarBoard
        view="month"
        isMobile
        anchor={new Date("2026-10-19T12:00:00")}
        selectedDate="2026-10-19"
        weekdayLabels={weekdayLabels}
        todayIso="2026-10-19"
        appointments={[
          {
            _id: "1",
            date: "2026-10-19",
            time: "10:00",
            duration: 45,
            label: "Dana",
          },
        ]}
        onSelectDate={() => undefined}
        onOpenAppointment={() => undefined}
        onCreateAt={() => undefined}
        onDropAppointment={() => undefined}
      />
    );
    expect(document.querySelector('[data-calendar-layout="agenda"]')).toBeTruthy();
  });
});
