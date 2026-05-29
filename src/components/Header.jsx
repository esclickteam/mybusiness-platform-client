import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo_final.svg";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/solutions", label: "Solutions" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDashboard =
    location.pathname.includes("/dashboard") ||
    location.pathname.includes("/business/");

  if (isDashboard) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[999] border-b border-white/60 bg-white/75 shadow-[0_10px_35px_rgba(79,70,229,0.08)] backdrop-blur-2xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            aria-label="Bizuply home"
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/80 bg-white shadow-lg shadow-indigo-100 transition group-hover:-translate-y-0.5">
              <span className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
              <img
                src={logo}
                alt="Bizuply Logo"
                className="relative h-8 w-8 object-contain"
              />
            </span>

            <span className="hidden text-2xl font-black tracking-[-0.04em] text-slate-950 sm:block">
              Bizuply
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 rounded-full border border-slate-100 bg-white/80 p-1 shadow-sm backdrop-blur lg:flex">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-4 py-2.5 text-sm font-black transition ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-100"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-3 lg:flex">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-50 text-indigo-700">
                    <FaUser className="text-xs" />
                  </span>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-6 py-3 text-sm font-black text-white shadow-[0_14px_34px_rgba(99,102,241,0.28)] transition hover:-translate-y-0.5"
                >
                  Try it Free
                  <span className="ml-2 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </>
            ) : (
              <>
                <div className="max-w-[190px] truncate rounded-full border border-slate-100 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
                  Hello, {user.name}
                </div>

                <Link
                  to="/dashboard"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5"
                >
                  My Account
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full px-4 py-3 text-sm font-black text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {!user && (
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-indigo-100"
              >
                Try it Free
              </Link>
            )}

            {user && (
              <Link
                to="/dashboard"
                className="rounded-full bg-indigo-50 px-4 py-2.5 text-xs font-black text-indigo-700"
              >
                Account
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-100 bg-white text-slate-950 shadow-lg shadow-indigo-100 transition hover:bg-indigo-50"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 rounded-full bg-slate-950" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-950" />
                <span className="block h-0.5 w-5 rounded-full bg-slate-950" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
}