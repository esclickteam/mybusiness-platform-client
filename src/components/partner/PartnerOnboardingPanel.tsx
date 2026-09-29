import React from "react";
import { Check, Circle, Lock, Play } from "lucide-react";
import type { PartnerMaterial } from "../../lib/partnerCenterApi";
import type { PartnerOnboardingSnapshot } from "../../lib/partnerCenterApi";
import { partnerProductDemoUrl } from "../../lib/partnerOnboardingDemo";

function statusLabel(status: string) {
  if (status === "sales_ready") return "Sales Ready";
  if (status === "in_progress") return "In progress";
  return "Not ready";
}

function statusClass(status: string) {
  if (status === "sales_ready") return "bg-emerald-100 text-emerald-800";
  if (status === "in_progress") return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-600";
}

function formatWhen(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

type Props = {
  snapshot: PartnerOnboardingSnapshot;
  materials: PartnerMaterial[];
  busy?: boolean;
  onStart: () => void;
  onOpenMaterial: (slug: string, tab?: string) => void;
  onWatch: (slug: string) => void;
  onDownload: (slug: string) => void;
  onToggleModule: (slug: string, complete: boolean) => void;
  onToggleCheckpoint: (id: string, complete: boolean) => void;
  onToggleChecklist: (key: string, done: boolean) => void;
  onSelectKit: (slug: string) => void;
  onHub: (category: string) => void;
};

export default function PartnerOnboardingPanel({
  snapshot,
  materials,
  busy,
  onStart,
  onOpenMaterial,
  onWatch,
  onDownload,
  onToggleModule,
  onToggleCheckpoint,
  onToggleChecklist,
  onSelectKit,
  onHub,
}: Props) {
  const bySlug = new Map(materials.map((row) => [row.slug, row]));
  const kits = materials.filter((row) => row.category === "industry_kits");
  const next = snapshot.nextAction;
  const recommendedSlug = next.type === "module" ? next.key : snapshot.stuckModule?.slug;
  const firstIncomplete = snapshot.modules.find((row) => !snapshot.completedModuleSlugs.includes(row.slug));

  function materialTitle(slug?: string, fallback = "") {
    if (!slug) return fallback;
    return bySlug.get(slug)?.title || fallback || slug;
  }

  function goNextAction() {
    if (next.type === "start") onStart();
    else if (next.type === "module") onWatch(next.key);
    else if (next.type === "material" && next.slug) onOpenMaterial(next.slug);
    else if (next.type === "industry") onHub("industry_kits");
    else if (next.type === "checklist") onHub("sales_training");
    else if (next.type === "checkpoint") {
      document.getElementById(`checkpoint-${next.key}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (next.type === "launch") {
      document.getElementById("partner-launch-dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const launchActions = [
    { label: "Send Demo", onClick: () => onOpenMaterial(snapshot.shortcuts.demoQuick || "demo-script-quick") },
    { label: "Open Sales Materials", onClick: () => onHub("sales_training") },
    { label: "Open Marketing Materials", onClick: () => onHub("marketing_materials") },
    { label: "Industry Kits", onClick: () => onHub("industry_kits") },
    { label: "Client-Facing PDFs", onClick: () => onHub("demo_presentation") },
    { label: "WhatsApp Templates", onClick: () => onOpenMaterial(snapshot.shortcuts.waTemplate || "wa-first-outreach") },
    { label: "Email Templates", onClick: () => onOpenMaterial(snapshot.shortcuts.emailTemplate || "email-introduction") },
    { label: "Track Leads", href: "/partner/dashboard/crm" },
    { label: "KPI Tracker", onClick: () => onOpenMaterial(snapshot.shortcuts.kpi || "kpi-tracker-guide") },
  ];

  return (
    <div className="mb-8 space-y-5" data-testid="partner-onboarding">
      <section className="rounded-[20px] border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-[0_8px_30px_rgba(109,40,217,0.08)] sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7C3AED]">Start Here</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">Partner Onboarding</h2>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-relaxed text-slate-600">
          You will learn Bizuply as one operating system — dashboard, CRM, leads, WhatsApp, campaigns,
          automations, website, follow-ups, team, and how to present it. Complete the 12 modules first,
          then the practice checkpoints and Sales Ready checklist. {snapshot.estimatedTime}.
        </p>
        <p className="mt-2 text-sm font-bold text-slate-600">
          <span className="text-slate-900">Sales Ready</span> means you can run a calm demo, answer common
          objections, and use the sales and marketing materials with a real prospect.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={goNextAction}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white shadow-[0_8px_18px_rgba(109,40,217,0.28)] disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            {snapshot.started ? next.title : "Start Partner Onboarding"}
          </button>
          <span className={`rounded-full px-3 py-1 text-[11px] font-black ${statusClass(snapshot.salesReadyStatus)}`}>
            {statusLabel(snapshot.salesReadyStatus)}
          </span>
        </div>
      </section>

      <section className="rounded-[20px] border border-slate-100 bg-white p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7C3AED]">Recommended next action</p>
            <h3 className="mt-1 text-lg font-black text-slate-900">{next.title}</h3>
            {next.detail ? <p className="mt-1 text-sm font-bold text-slate-500">{next.detail}</p> : null}
          </div>
          <p className="text-sm font-black text-slate-700">
            {snapshot.modulesCompleted} of {snapshot.modulesTotal} modules completed
            <span className="ms-2 text-slate-400">{snapshot.percent}% complete</span>
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#6D28D9]" style={{ width: `${snapshot.percent}%` }} />
        </div>
      </section>

      {snapshot.salesReadyStatus === "sales_ready" ? (
        <section id="partner-launch-dashboard" className="rounded-[20px] border border-emerald-100 bg-emerald-50/70 p-5">
          <h3 className="text-xl font-black text-emerald-950">You’re ready to start selling Bizuply</h3>
          <p className="mt-1 text-sm font-bold text-emerald-800">Use these materials next. Do not go hunting through the library.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {launchActions.map((action) =>
              action.href ? (
                <a
                  key={action.label}
                  href={action.href}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-800 shadow-sm"
                >
                  {action.label}
                </a>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  className="rounded-2xl bg-white px-4 py-3 text-start text-sm font-black text-slate-800 shadow-sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              )
            )}
          </div>
        </section>
      ) : null}

      <section>
        <h3 className="mb-3 text-lg font-black text-slate-900">Guided training path</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {snapshot.modules.map((mod) => {
            const item = bySlug.get(mod.slug);
            const complete = snapshot.completedModuleSlugs.includes(mod.slug);
            const isNext = recommendedSlug === mod.slug;
            const locked = Boolean(firstIncomplete && mod.n > firstIncomplete.n && !complete);
            return (
              <article
                key={mod.slug}
                id={`onboarding-module-${mod.n}`}
                className={`rounded-[18px] border bg-white p-4 ${
                  complete ? "border-emerald-200" : isNext ? "border-violet-300 ring-2 ring-violet-100" : "border-slate-100"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#6D28D9] px-2.5 py-1 text-[11px] font-black text-white">Module {mod.n}</span>
                  {complete ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-black text-emerald-800">
                      <Check className="h-3 w-3" /> Completed
                    </span>
                  ) : isNext ? (
                    <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-black text-violet-800">Up next</span>
                  ) : locked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-500">
                      <Lock className="h-3 w-3" /> Recommended later
                    </span>
                  ) : null}
                  <span className={`rounded-full px-2 py-1 text-[11px] font-black ${item?.videoReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                    {item?.videoReady ? "Video Ready" : "Video not ready"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-600">{mod.minutes} min</span>
                </div>
                <h4 className="text-base font-black text-slate-900">{item?.title || mod.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-500">{item?.description || ""}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="rounded-xl bg-[#6D28D9] px-3 py-2 text-xs font-black text-white" onClick={() => onWatch(mod.slug)}>
                    Watch Video
                  </button>
                  <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onDownload(mod.slug)}>
                    Download Guide
                  </button>
                  <a
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black"
                    href={partnerProductDemoUrl(mod.demoKey)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Demo
                  </a>
                  <button
                    type="button"
                    disabled={busy}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black disabled:opacity-50"
                    onClick={() => onToggleModule(mod.slug, !complete)}
                  >
                    {complete ? "Completed" : "Mark Complete"}
                  </button>
                  {mod.n > 1 ? (
                    <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onWatch(snapshot.modules[mod.n - 2].slug)}>
                      Previous
                    </button>
                  ) : null}
                  {mod.n < 12 ? (
                    <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onWatch(snapshot.modules[mod.n].slug)}>
                      Next
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {[4, 8, 12].map((after) => {
        const tasks = snapshot.checkpoints.filter((row) => row.afterModules === after);
        const unlocked = snapshot.modulesCompleted >= after;
        return (
          <section key={after} className="rounded-[18px] border border-slate-100 bg-white p-5">
            <h3 className="text-base font-black text-slate-900">Practice checkpoint · after Modules {after === 4 ? "1–4" : after === 8 ? "5–8" : "9–12"}</h3>
            <p className="mt-1 text-sm font-bold text-slate-500">
              {unlocked ? "Simple practice, not a test. Mark each one when you can do it out loud." : "Unlocks when the modules above are complete."}
            </p>
            <div className="mt-3 space-y-2">
              {tasks.map((task) => {
                const done = snapshot.completedCheckpointIds.includes(task.id);
                return (
                  <div key={task.id} id={`checkpoint-${task.id}`} className="flex flex-col gap-2 rounded-2xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-800">{task.title}</p>
                      <p className="text-xs font-bold text-slate-500">{task.hint}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!unlocked || busy}
                      className={`rounded-xl px-3 py-2 text-xs font-black disabled:opacity-40 ${done ? "bg-emerald-100 text-emerald-800" : "border border-slate-200"}`}
                      onClick={() => onToggleCheckpoint(task.id, !done)}
                    >
                      {done ? "Done" : "Mark done"}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="rounded-[18px] border border-slate-100 bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900">Sales Ready checklist</h3>
          <span className={`rounded-full px-3 py-1 text-[11px] font-black ${statusClass(snapshot.salesReadyStatus)}`}>
            {statusLabel(snapshot.salesReadyStatus)}
          </span>
        </div>
        <ul className="space-y-2">
          {snapshot.checklistItems.map((item) => {
            const done = Boolean(snapshot.checklist[item.key]);
            return (
              <li key={item.key} className="flex flex-col gap-2 rounded-2xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  {done ? <Check className="mt-0.5 h-4 w-4 text-emerald-600" /> : <Circle className="mt-0.5 h-4 w-4 text-slate-300" />}
                  <div>
                    <p className="text-sm font-black text-slate-800">{item.title}</p>
                    {item.key === "industry_kit" && snapshot.industryKitSlug ? (
                      <p className="text-xs font-bold text-slate-500">{materialTitle(snapshot.industryKitSlug)}</p>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.slug ? (
                    <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black" onClick={() => onOpenMaterial(item.slug!)}>
                      Open
                    </button>
                  ) : null}
                  {item.key === "industry_kit" ? (
                    <select
                      className="h-9 max-w-[220px] rounded-xl border border-slate-200 px-2 text-xs font-black"
                      value={snapshot.industryKitSlug}
                      onChange={(e) => onSelectKit(e.target.value)}
                    >
                      <option value="">Select a kit</option>
                      {kits.map((kit) => (
                        <option key={kit.slug} value={kit.slug}>
                          {kit.title}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  {!item.auto ? (
                    <button
                      type="button"
                      disabled={busy}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black disabled:opacity-50"
                      onClick={() => onToggleChecklist(item.key, !done)}
                    >
                      {done ? "Done" : "Mark done"}
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs font-bold text-slate-400">
          Training completed: {formatWhen(snapshot.trainingCompletedAt)} · Last activity: {formatWhen(snapshot.lastActivityAt)}
        </p>
      </section>
    </div>
  );
}
