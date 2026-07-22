import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTimes, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import logo from "../images/logo_final.svg";

export default function MobileMenu({ open, onClose, user, onLogout }) {
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { to: "/features", label: t("nav.features") },
    { to: "/solutions", label: t("nav.solutions") },
    { to: "/how-it-works", label: t("nav.howItWorks") },
    { to: "/pricing", label: t("nav.pricing") },
    { to: "/about", label: t("nav.about") },
  ];

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow || "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800/40 p-4 backdrop-blur-xl lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label={t("common.closeMenu")}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="relative ms-auto flex h-full w-full max-w-[420px] flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
        <div className="relative overflow-hidden border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/35 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
          </div>

          <div className="relative flex items-center justify-between gap-4">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3"
              aria-label="Bizuply home"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/10 shadow-xl shadow-indigo-950/30 backdrop-blur">
                <img
                  src={logo}
                  alt="BizUply"
                  className="h-8 w-8 object-contain"
                />
              </span>

              <span>
                <span className="block text-xl font-black tracking-[-0.04em]">
                  Bizuply
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-slate-300">
                  Business OS
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.closeMenu")}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="border-b border-slate-100 bg-gradient-to-br from-white to-indigo-50/70 px-5 py-5">
          {user ? (
            <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                {t("common.myAccount")}
              </p>
              <p className="mt-2 truncate text-lg font-black text-slate-800">
                {t("common.hello", { name: user.name })}
              </p>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">
                {t("home.startTrial")}
              </p>
              <p className="mt-2 text-lg font-black text-slate-800">
                {t("home.headlineTop")} {t("home.headlineHighlight")}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                {t("why.subtitle")}
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto bg-white px-5 py-5">
          <div className="space-y-3">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-2xl px-4 py-4 text-base font-black transition ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white shadow-lg shadow-indigo-100"
                      : "border border-slate-100 bg-white text-slate-800 shadow-sm hover:border-indigo-100 hover:bg-indigo-50/70 hover:text-indigo-700"
                  }`}
                >
                  <span>{item.label}</span>

                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    <FaChevronRight className="text-xs rtl:rotate-180" />
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-100 bg-gradient-to-br from-white to-indigo-50/70 px-5 py-5">
          {!user ? (
            <div className="grid gap-3">
              <Link
                to="/register"
                onClick={onClose}
                className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-6 py-4 text-base font-black text-white shadow-[0_16px_40px_rgba(99,102,241,0.26)] transition hover:-translate-y-0.5"
              >
                {t("home.startTrial")}
                <span className="ms-2 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </Link>

              <Link
                to="/login"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
              >
                {t("common.login")}
              </Link>

              <p className="text-center text-xs font-bold text-slate-500">
                {t("home.trustTrial")} · {t("home.trustNoCard")}
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="group inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-6 py-4 text-base font-black text-white shadow-[0_16px_40px_rgba(99,102,241,0.26)] transition hover:-translate-y-0.5"
              >
                {t("common.myAccount")}
                <span className="ms-2 transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="inline-flex w-full items-center justify-center rounded-full border border-rose-100 bg-white px-6 py-4 text-base font-black text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                {t("common.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
