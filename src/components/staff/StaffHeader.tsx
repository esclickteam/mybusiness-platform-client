import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Coffee,
  LayoutDashboard,
  LogOut,
  Play,
  Power,
  Search,
  Timer,
  UserPlus,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AdminSoftphoneLauncher from "../AdminSoftphoneLauncher";

/**
 * Top staff chrome — softphone launcher lives here (same pattern as admin header).
 * Shift controls + quick search stay in one professional row.
 */
export default function StaffHeader() {
  const { user, logout } = useAuth() as {
    user: { name?: string; email?: string } | null;
    logout?: () => void;
  };
  const navigate = useNavigate();

  const [isWorking, setIsWorking] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [shiftSec, setShiftSec] = useState(0);
  const [searchPhone, setSearchPhone] = useState("");

  useEffect(() => {
    if (!isWorking || isOnBreak) return;
    const id = window.setInterval(() => setShiftSec((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [isWorking, isOnBreak]);

  const shiftLabel = useMemo(() => {
    const h = Math.floor(shiftSec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((shiftSec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (shiftSec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, [shiftSec]);

  const statusTone = isOnBreak
    ? "bg-amber-100 text-amber-800 ring-amber-200"
    : isWorking
      ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
      : "bg-slate-100 text-slate-600 ring-slate-200";

  const statusText = isOnBreak
    ? "בהפסקה"
    : isWorking
      ? "פעיל"
      : "לא פעיל";

  const handleSearch = () => {
    const phone = searchPhone.trim();
    if (!phone) return;
    navigate(`/staff/profile?phone=${encodeURIComponent(phone)}`);
  };

  return (
    <header
      dir="rtl"
      className="fixed inset-x-0 top-0 z-[9997] border-b border-violet-200/80 bg-gradient-to-l from-[#f7f3ff] via-white to-[#eefbf8] shadow-[0_8px_30px_rgba(91,44,255,0.08)]"
      style={{ fontFamily: '"Assistant", "Rubik", sans-serif' }}
      data-staff-header="true"
    >
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4">
        <Link
          to="/staff/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl border border-violet-100 bg-white/90 px-3 py-2 text-sm font-black text-slate-800 shadow-sm transition hover:border-violet-200"
        >
          <LayoutDashboard className="h-4 w-4 text-[#7C4DFF]" />
          <span className="hidden sm:inline">דשבורד עובד</span>
        </Link>

        <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-violet-100 bg-white/80 px-3 py-2 shadow-sm">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-[#7C4DFF]">
            <Timer className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-bold text-slate-400">זמן משמרת</p>
            <p className="font-mono text-sm font-black text-slate-800" dir="ltr">
              {shiftLabel}
            </p>
          </div>
          <span
            className={`ms-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ring-1 ${statusTone}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusText}
          </span>
        </div>

        {!isWorking ? (
          <HeaderBtn
            label="התחל משמרת"
            tone="violet"
            onClick={() => {
              setIsWorking(true);
              setShiftSec(0);
              setIsOnBreak(false);
            }}
          >
            <Play className="h-4 w-4" />
          </HeaderBtn>
        ) : (
          <>
            <HeaderBtn
              label={isOnBreak ? "חזרה" : "הפסקה"}
              tone="amber"
              active={isOnBreak}
              onClick={() => setIsOnBreak((v) => !v)}
            >
              <Coffee className="h-4 w-4" />
            </HeaderBtn>
            <HeaderBtn
              label="סיום"
              tone="rose"
              onClick={() => {
                setIsWorking(false);
                setIsOnBreak(false);
              }}
            >
              <Power className="h-4 w-4" />
            </HeaderBtn>
          </>
        )}

        <div className="mx-1 hidden h-8 w-px bg-violet-100 sm:block" />

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="חיפוש מספר טלפון..."
            className="min-w-0 flex-1 border-0 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:text-slate-300"
            dir="ltr"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-black text-white"
          >
            חפש
          </button>
        </div>

        <Link
          to="/staff/create-user"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-[#7C4DFF] sm:h-12 sm:w-12"
          aria-label="יצירת בעל עסק"
          title="יצירת בעל עסק"
        >
          <UserPlus className="h-5 w-5" strokeWidth={2.2} />
        </Link>

        {/* Same softphone launcher behavior as admin header */}
        <AdminSoftphoneLauncher />

        <button
          type="button"
          onClick={() => logout?.()}
          aria-label="התנתקות"
          className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-2xl bg-[#7C4DFF] px-3 text-sm font-black text-white shadow-md shadow-[#7C4DFF]/25 transition hover:-translate-y-0.5 hover:bg-[#6B3FE0] sm:h-12 sm:px-4"
        >
          <LogOut className="h-4 w-4 sm:hidden" />
          <span className="hidden sm:inline">התנתקות</span>
        </button>

        {user?.name || user?.email ? (
          <span className="hidden text-xs font-bold text-slate-400 lg:inline">
            {user?.name || user?.email}
          </span>
        ) : null}
      </div>
    </header>
  );
}

function HeaderBtn({
  label,
  onClick,
  children,
  tone = "slate",
  active = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "slate" | "violet" | "amber" | "rose";
  active?: boolean;
}) {
  const tones: Record<string, string> = {
    slate: "bg-white text-slate-600 border border-slate-200",
    violet: "bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/25",
    amber: active
      ? "bg-amber-500 text-white"
      : "bg-amber-50 text-amber-700 border border-amber-200",
    rose: "bg-gradient-to-br from-rose-500 to-red-500 text-white shadow-md shadow-rose-500/25",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-black transition ${tones[tone]}`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
