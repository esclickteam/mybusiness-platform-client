"use client";

import React from "react";
import { NavLink, useParams } from "react-router-dom";

type ChatButtonProps = {
  previewContent?: React.ReactNode;
  renderTopBar?: () => React.ReactNode;
};

export default function ChatButton({
  previewContent,
  renderTopBar,
}: ChatButtonProps) {
  const { businessId } = useParams<{ businessId: string }>();

  if (!businessId) return null;

  return (
    <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      {/* EDIT / ACTION */}
      <div className="order-2 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] xl:order-1">
        <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-l from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80 px-6 py-8 text-white sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-black text-black/80 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Client Communication
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Messages Center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Manage customer conversations, reply faster, and keep all client
              messages organized in one professional inbox.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="rounded-[1.75rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 text-3xl shadow-xl shadow-violet-200/20">
                  💬
                </div>

                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-800">
                    Chat with Clients
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Open the full messages dashboard to view conversations,
                    respond to customers, and manage incoming requests.
                  </p>
                </div>
              </div>

              <NavLink
                to={`/business/${businessId}/dashboard/messages`}
                className={({ isActive }) =>
                  [
                    "inline-flex h-13 items-center justify-center rounded-2xl px-6 text-sm font-black shadow-xl transition",
                    "hover:-translate-y-0.5 active:translate-y-0",
                    isActive
                      ? "bg-violet-700 text-white shadow-violet-500/25"
                      : "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-violet-200/20 hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100",
                  ].join(" ")
                }
              >
                Open Messages
              </NavLink>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Inbox
                </p>
                <p className="mt-2 text-sm font-bold text-slate-700">
                  Customer chats
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Status
                </p>
                <p className="mt-2 text-sm font-bold text-emerald-600">
                  Ready
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Action
                </p>
                <p className="mt-2 text-sm font-bold text-slate-700">
                  Reply & manage
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <aside className="order-1 xl:order-2">
        <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          {renderTopBar && (
            <div className="border-b border-slate-100 bg-white/80 px-5 py-4">
              {renderTopBar()}
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50 p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />

            <div className="relative">
              <div className="mb-5 rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-xl backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">
                      Live preview
                    </div>

                    <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-800">
                      Client Chat Preview
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      This area shows how the chat section appears in the
                      business profile.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 text-2xl shadow-xl shadow-violet-200/20">
                    💬
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur">
                {previewContent ? (
                  previewContent
                ) : (
                  <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                      💭
                    </div>

                    <h4 className="mt-4 text-lg font-black text-slate-800">
                      No preview available
                    </h4>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                      The chat preview content will appear here once available.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}