export function timeToMinutes(time: string) {
  const [hours, minutes] = String(time || "0:0").split(":").map(Number);
  return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
}

export function appointmentsOverlap(a: {
  date?: string;
  time?: string;
  duration?: number;
  _id?: string;
}, b: {
  date?: string;
  time?: string;
  duration?: number;
  _id?: string;
}) {
  if (!a?.date || !b?.date || a.date !== b.date) return false;
  if (a._id && b._id && String(a._id) === String(b._id)) return false;
  const aStart = timeToMinutes(a.time || "00:00");
  const bStart = timeToMinutes(b.time || "00:00");
  const aEnd = aStart + (Number(a.duration) || 30);
  const bEnd = bStart + (Number(b.duration) || 30);
  return aStart < bEnd && bStart < aEnd;
}

export function findAppointmentConflict<T extends {
  date?: string;
  time?: string;
  duration?: number;
  _id?: string;
}>(candidate: T, items: T[]) {
  return items.find((item) => appointmentsOverlap(candidate, item)) || null;
}
