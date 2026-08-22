import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

type Slot = { startAt: string; endAt: string; label: string };

function formatWhen(iso: string, timezone: string) {
  try {
    return new Date(iso).toLocaleString("he-IL", {
      timeZone: timezone || "Asia/Jerusalem",
      weekday: "long",
      day: "numeric",
      month: "long",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
    });
  } catch {
    return iso;
  }
}

function formatDateHeading(iso: string, timezone: string) {
  try {
    return new Date(iso).toLocaleDateString("he-IL", {
      timeZone: timezone || "Asia/Jerusalem",
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string, timezone: string) {
  try {
    return new Date(iso).toLocaleTimeString("he-IL", {
      timeZone: timezone || "Asia/Jerusalem",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
    });
  } catch {
    return iso;
  }
}

export default function PublicIntroBookingPage() {
  const { token, businessId } = useParams();
  const rawToken = String(token || businessId || "").trim();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data: res } = await API.get(`/public/book/${encodeURIComponent(rawToken)}`);
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.error || "קישור התיאום אינו תקף או שפג תוקפו.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (rawToken) load();
    return () => {
      cancelled = true;
    };
  }, [rawToken]);

  const timezone = data?.timezone || "Asia/Jerusalem";
  const grouped = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of data?.slots || []) {
      const day = formatDateHeading(slot.startAt, timezone);
      const list = map.get(day) || [];
      list.push(slot);
      map.set(day, list);
    }
    return [...map.entries()];
  }, [data?.slots, timezone]);

  async function book() {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const { data: res } = await API.post(`/public/book/${encodeURIComponent(rawToken)}`, {
        startAt: selected,
      });
      setDone(res.booking);
    } catch (err: any) {
      setError(err?.response?.data?.error || "לא ניתן לקבוע את המועד. ייתכן שהוא כבר נתפס.");
      try {
        const { data: res } = await API.get(`/public/book/${encodeURIComponent(rawToken)}`);
        setData(res);
      } catch {
        /* ignore refresh errors */
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F7F4FF] px-4 py-6 sm:py-10"
      dir="rtl"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
    >
      <div className="mx-auto w-full max-w-xl space-y-4">
        <p className="text-xs font-black tracking-wide text-[#7C4DFF]">BizUply</p>
        <h1 className="text-2xl font-black leading-tight text-purple-950 sm:text-3xl">
          שיחה ראשונית עם BizUply
        </h1>
        <p className="text-base font-black text-[#7C4DFF]">15 דקות</p>
        <p className="font-bold text-slate-600">בחרו מועד שנוח לכם</p>

        {loading ? <p className="font-bold text-slate-500">טוען מועדים…</p> : null}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 font-bold text-rose-800">
            {error}
          </div>
        ) : null}

        {done ? (
          <section className="rounded-[28px] border border-emerald-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-emerald-800">השיחה נקבעה בהצלחה</h2>
            <p className="mt-3 font-black text-purple-950">{done.serviceName || "שיחה ראשונית"}</p>
            <p className="mt-1 font-bold text-slate-700">
              {new Date(done.startAt).toLocaleDateString("he-IL", {
                timeZone: done.timezone || timezone,
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}{" "}
              בשעה {formatTime(done.startAt, done.timezone || timezone)}
            </p>
            <p className="mt-1 font-black text-[#7C4DFF]">{done.durationMinutes || 15} דקות</p>
            <p className="mt-4 text-sm font-bold text-slate-500">ניצור איתך קשר במועד שנבחר.</p>
          </section>
        ) : data?.alreadyBooked ? (
          <section className="rounded-[28px] border border-emerald-200 bg-white p-5">
            <p className="font-black text-emerald-800">כבר נקבעה לכם שיחה ראשונית.</p>
          </section>
        ) : (
          <section className="space-y-4 rounded-[28px] border border-purple-100 bg-white p-4 sm:p-5">
            {!grouped.length && !loading ? (
              <p className="font-bold text-slate-500">אין מועדים פנויים כרגע.</p>
            ) : null}
            {grouped.map(([day, slots]) => (
              <div key={day}>
                <h3 className="mb-2 text-sm font-black text-slate-700">{day}</h3>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                  {slots.map((slot) => (
                    <button
                      key={slot.startAt}
                      type="button"
                      onClick={() => setSelected(slot.startAt)}
                      className={[
                        "min-h-12 rounded-2xl px-2 text-sm font-black",
                        selected === slot.startAt
                          ? "bg-[#7C4DFF] text-white"
                          : "border border-purple-100 bg-purple-50 text-slate-700",
                      ].join(" ")}
                    >
                      {formatTime(slot.startAt, timezone)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {selected ? (
              <p className="text-sm font-bold text-slate-600">
                נבחר: {formatWhen(selected, timezone)}
              </p>
            ) : null}
            <button
              type="button"
              disabled={!selected || saving}
              onClick={book}
              className="sticky bottom-4 mt-2 min-h-12 w-full rounded-2xl bg-[#7C4DFF] text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "קובע מועד…" : "אישור תיאום"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
