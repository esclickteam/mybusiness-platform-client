import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import botFlow from "../data/preLoginBot.flow.json";

const SHOW_PRE_LOGIN_BOT = false;

export default function PreLoginBot() {
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState("entry");
  const navigate = useNavigate();

  if (!SHOW_PRE_LOGIN_BOT) return null;

  const current = botFlow[node];
  if (!current) return null;

  const handleAction = (btn) => {
    if (btn.route) {
      navigate(btn.route);
      return;
    }

    if (btn.routeWithRedirect) {
      navigate(btn.routeWithRedirect.path, {
        state: { redirect: btn.routeWithRedirect.redirect },
      });
      return;
    }

    if (btn.next) {
      setNode(btn.next);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ask BizUply"
          className="group relative flex items-center gap-2.5 rounded-full border border-slate-100 !bg-white px-4 py-2.5 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm text-white shadow-md shadow-indigo-200">
            💬
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
          </span>

          <span className="text-left">
            <span className="block text-xs font-black leading-none text-slate-950">
              Ask BizUply
            </span>
            <span className="mt-0.5 block text-[10px] font-bold text-slate-500">
              Get help instantly
            </span>
          </span>

          <span className="ml-1 text-sm font-black text-indigo-600 transition group-hover:translate-x-0.5">
            →
          </span>
        </button>
      )}

      {/* Bot window */}
      {open && (
        <div className="w-[calc(100vw-32px)] max-w-[420px] overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_28px_90px_rgba(15,23,42,0.22)] backdrop-blur-2xl">
          <div className="overflow-hidden rounded-[1.55rem] border border-slate-100 bg-white">
            {/* Header */}
            <header className="relative overflow-hidden bg-slate-950 px-5 py-5 text-white">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/35 blur-3xl" />
                <div className="absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />
              </div>

              <div className="relative flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xl shadow-xl shadow-indigo-950/30">
                    ✦
                    <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
                  </div>

                  <div>
                    <strong className="block text-lg font-black tracking-[-0.02em]">
                      BizUply Assistant
                    </strong>
                    <span className="mt-0.5 block text-xs font-semibold text-slate-300">
                      Smart guidance before you start
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-2xl font-light text-white transition hover:bg-white/15"
                >
                  ×
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="bg-gradient-to-br from-white to-indigo-50/60 px-5 py-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-indigo-100">
                  B
                </div>

                <div className="rounded-[1.35rem] rounded-tl-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold leading-6 text-slate-700">
                    {current.text}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {current.buttons?.map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => handleAction(btn)}
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 text-left text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:bg-indigo-50/70"
                  >
                    <span>{btn.label}</span>

                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-700 transition group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}