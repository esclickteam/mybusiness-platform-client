export const DAY_START_HOUR = 7;
export const DAY_END_HOUR = 21;
export const PX_PER_HOUR = 48;
export const SNAP_MINUTES = 15;

export type CalendarView = "month" | "week" | "day" | "agenda";

export type TimedEvent = {
  id: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
};

export type LaidOutEvent = TimedEvent & {
  column: number;
  columns: number;
  topPx: number;
  heightPx: number;
  insetPct: number;
  widthPct: number;
};

export function toIsoDate(date: Date) {
  return date.toLocaleDateString("en-CA");
}

export function parseTimeMinutes(time?: string) {
  const [hours, minutes] = String(time || "00:00").split(":").map(Number);
  return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
}

export function minutesToTime(total: number) {
  const clamped = Math.max(0, Math.min(23 * 60 + 45, total));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function snapMinutes(value: number, step = SNAP_MINUTES) {
  return Math.round(value / step) * step;
}

export function hourRange() {
  return Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, index) => DAY_START_HOUR + index);
}

export function getMonthCells(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const first = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const leadingEmptyCells = first.getDay();
  const cells: Array<Date | null> = [];

  for (let i = 0; i < leadingEmptyCells; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

export function startOfWeek(anchor: Date) {
  const start = new Date(anchor);
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

export function getWeekDates(anchor: Date) {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, day) => {
    const next = new Date(start);
    next.setDate(start.getDate() + day);
    return toIsoDate(next);
  });
}

export function shiftAnchor(anchor: Date, view: CalendarView, direction: -1 | 1) {
  const next = new Date(anchor);
  if (view === "month") {
    next.setMonth(next.getMonth() + direction);
    return next;
  }
  if (view === "week") {
    next.setDate(next.getDate() + direction * 7);
    return next;
  }
  next.setDate(next.getDate() + direction);
  return next;
}

export function minutesFromClientY(clientY: number, gridTop: number) {
  const raw = ((clientY - gridTop) / PX_PER_HOUR) * 60 + DAY_START_HOUR * 60;
  return snapMinutes(Math.max(DAY_START_HOUR * 60, Math.min(DAY_END_HOUR * 60 - SNAP_MINUTES, raw)));
}

export function layoutDayEvents(events: TimedEvent[]): LaidOutEvent[] {
  const sorted = [...events].sort((a, b) => {
    if (a.startMinutes !== b.startMinutes) return a.startMinutes - b.startMinutes;
    return b.endMinutes - a.endMinutes;
  });

  const columnEnd: number[] = [];
  const assigned = sorted.map((event) => {
    let column = columnEnd.findIndex((end) => end <= event.startMinutes);
    if (column < 0) {
      column = columnEnd.length;
      columnEnd.push(event.endMinutes);
    } else {
      columnEnd[column] = event.endMinutes;
    }
    return { event, column };
  });

  return assigned.map(({ event, column }) => {
    const overlapping = assigned.filter(
      ({ event: other }) =>
        other.startMinutes < event.endMinutes && event.startMinutes < other.endMinutes
    );
    const columns = overlapping.reduce((max, item) => Math.max(max, item.column + 1), 1);
    const dayStart = DAY_START_HOUR * 60;
    const topPx = ((event.startMinutes - dayStart) / 60) * PX_PER_HOUR;
    const heightPx = Math.max(18, ((event.endMinutes - event.startMinutes) / 60) * PX_PER_HOUR);
    const widthPct = 100 / columns;
    return {
      ...event,
      column,
      columns,
      topPx,
      heightPx,
      insetPct: column * widthPct,
      widthPct: widthPct - 1,
    };
  });
}

export type AppointmentTone = "open" | "busy" | "paid" | "done";

export function appointmentTone(item: {
  status?: string;
  paid?: boolean;
  completed?: boolean;
}): AppointmentTone {
  const status = String(item.status || "").toLowerCase();
  if (item.completed || status === "completed") return "done";
  if (item.paid || status === "paid") return "paid";
  if (status === "cancelled" || status === "canceled" || status === "no_show") return "busy";
  return "open";
}
