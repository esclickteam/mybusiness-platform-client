import React, { useMemo } from "react";
import {
  appointmentTone,
  DAY_END_HOUR,
  DAY_START_HOUR,
  getMonthCells,
  getWeekDates,
  hourRange,
  layoutDayEvents,
  minutesFromClientY,
  minutesToTime,
  parseTimeMinutes,
  PX_PER_HOUR,
  toIsoDate,
  type CalendarView,
} from "./appointmentCalendarLayout";
import "./crmWorkspace.css";

export type BoardAppointment = {
  _id: string;
  date?: string;
  time?: string;
  duration?: number;
  serviceName?: string;
  status?: string;
  paid?: boolean;
  completed?: boolean;
  label: string;
};

type DropTarget = { date: string; time: string };

type Props = {
  view: CalendarView;
  isMobile: boolean;
  anchor: Date;
  selectedDate: string;
  weekdayLabels: string[];
  todayIso: string;
  appointments: BoardAppointment[];
  onSelectDate: (iso: string) => void;
  onOpenAppointment: (id: string) => void;
  onCreateAt: (date: string, time?: string) => void;
  onDropAppointment: (id: string, target: DropTarget) => void;
};

function toneClass(item: BoardAppointment) {
  return `tone-${appointmentTone(item)}`;
}

function toTimed(item: BoardAppointment) {
  const start = parseTimeMinutes(item.time);
  const duration = Number(item.duration) || 30;
  return {
    id: item._id,
    date: item.date || "",
    startMinutes: start,
    endMinutes: start + duration,
  };
}

export default function AppointmentCalendarBoard({
  view,
  isMobile,
  anchor,
  selectedDate,
  weekdayLabels,
  todayIso,
  appointments,
  onSelectDate,
  onOpenAppointment,
  onCreateAt,
  onDropAppointment,
}: Props) {
  const byDate = useMemo(() => {
    return appointments.reduce<Record<string, BoardAppointment[]>>((acc, item) => {
      if (!item.date) return acc;
      (acc[item.date] ||= []).push(item);
      return acc;
    }, {});
  }, [appointments]);

  const effectiveView: CalendarView = isMobile && view === "month" ? "agenda" : view;

  const onDragStart = (event: React.DragEvent, id: string) => {
    event.dataTransfer.setData("text/appointment-id", id);
    event.dataTransfer.effectAllowed = "move";
  };

  const readId = (event: React.DragEvent) =>
    event.dataTransfer.getData("text/appointment-id");

  if (effectiveView === "agenda") {
    const dayItems = [...(byDate[selectedDate] || [])].sort(
      (a, b) => parseTimeMinutes(a.time) - parseTimeMinutes(b.time)
    );
    return (
      <div className="crm-cal-board" data-calendar-layout="agenda">
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
          <strong className="text-sm">{selectedDate}</strong>
          <button type="button" className="crm-btn crm-btn-primary h-8 px-3 text-xs" onClick={() => onCreateAt(selectedDate)}>
            +
          </button>
        </div>
        {dayItems.length === 0 ? (
          <p className="px-3 py-6 text-sm font-semibold text-slate-500">—</p>
        ) : (
          dayItems.map((item) => (
            <button
              key={item._id}
              type="button"
              className={`crm-side-row ${toneClass(item)}`}
              onClick={() => onOpenAppointment(item._id)}
            >
              <span className="text-xs font-black text-slate-500">{item.time || "—"}</span>
              <span className="truncate text-sm font-bold">
                {item.label} · {item.serviceName || ""}
              </span>
            </button>
          ))
        )}
      </div>
    );
  }

  if (effectiveView === "month") {
    const cells = getMonthCells(anchor);
    const currentMonth = anchor.getMonth();
    return (
      <div className="crm-cal-board" data-calendar-layout="month">
        <div className="crm-cal-month">
          {weekdayLabels.map((label) => (
            <div key={label} className="head">
              {label}
            </div>
          ))}
          {cells.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="cell is-muted" />;
            }
            const iso = toIsoDate(cell);
            const items = byDate[iso] || [];
            return (
              <div
                key={iso}
                className={[
                  "cell",
                  cell.getMonth() !== currentMonth ? "is-muted" : "",
                  iso === todayIso ? "is-today" : "",
                  iso === selectedDate ? "is-selected" : "",
                ].join(" ")}
                onClick={() => onSelectDate(iso)}
                onDoubleClick={() => onCreateAt(iso)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const id = readId(event);
                  if (!id) return;
                  const source = appointments.find((item) => item._id === id);
                  onDropAppointment(id, { date: iso, time: source?.time || "09:00" });
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">{cell.getDate()}</span>
                  {items.length > 0 && (
                    <span className="text-[10px] font-black text-violet-700">{items.length}</span>
                  )}
                </div>
                {items.slice(0, 4).map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    draggable
                    onDragStart={(event) => onDragStart(event, item._id)}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenAppointment(item._id);
                    }}
                    className={`crm-chip ${toneClass(item)}`}
                  >
                    {item.time} {item.label}
                  </button>
                ))}
                {items.length > 4 && (
                  <div className="mt-1 text-[10px] font-bold text-slate-400">+{items.length - 4}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const days = effectiveView === "day" ? [selectedDate] : getWeekDates(anchor);
  const hours = hourRange();
  const gridHeight = (DAY_END_HOUR - DAY_START_HOUR) * PX_PER_HOUR;

  return (
    <div className="crm-cal-board" data-calendar-layout={effectiveView}>
      <div className={`crm-timegrid ${effectiveView === "day" ? "is-day" : "is-week"}`}>
        <div className="gutter">
          {hours.map((hour) => (
            <div key={hour} className="hour-label">
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        {days.map((iso) => {
          const laid = layoutDayEvents((byDate[iso] || []).map(toTimed));
          const byId = Object.fromEntries((byDate[iso] || []).map((item) => [item._id, item]));
          return (
            <div
              key={iso}
              className="lane"
              style={{ height: gridHeight }}
              onClick={() => onSelectDate(iso)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const id = readId(event);
                if (!id) return;
                const time = minutesToTime(minutesFromClientY(event.clientY, event.currentTarget.getBoundingClientRect().top));
                onDropAppointment(id, { date: iso, time });
              }}
              onDoubleClick={(event) => {
                const time = minutesToTime(minutesFromClientY(event.clientY, event.currentTarget.getBoundingClientRect().top));
                onCreateAt(iso, time);
              }}
            >
              {laid.map((slot) => {
                const item = byId[slot.id];
                if (!item) return null;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    draggable
                    onDragStart={(event) => onDragStart(event, slot.id)}
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenAppointment(slot.id);
                    }}
                    className={`crm-event crm-chip ${toneClass(item)}`}
                    style={{
                      top: slot.topPx,
                      height: slot.heightPx,
                      insetInlineStart: `${slot.insetPct}%`,
                      width: `${slot.widthPct}%`,
                    }}
                    title={`${item.time} ${item.label}`}
                  >
                    <div>{item.time}</div>
                    <div className="truncate">{item.label}</div>
                    <div className="truncate font-semibold opacity-80">{item.serviceName}</div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
