const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "src/pages/business/dashboardPages/crmpages/CRMLeadsTab.tsx"
);

let s = fs.readFileSync(file, "utf8");

const startMarker =
  '  return (\n    <div\n      className="w-full min-w-0 space-y-6 bg-[linear-gradient(165deg,#dbe7f3_0%,#e8eef5_35%,#d5dee8_100%)] p-3 sm:p-4"';
const endMarker = "      {selectedLead && (";

const start = s.indexOf(startMarker);
const end = s.indexOf(endMarker);

if (start < 0 || end < 0) {
  console.error("markers not found", { start, end });
  process.exit(1);
}

const replacement = `  return (
    <div className="w-full min-w-0 bg-[#F4F5F8] p-3 sm:p-4" dir={dir}>
      {showMetaSetup ? (
        <MetaLeadAdsIntegration
          businessId={businessId}
          onBack={closeMetaSetup}
        />
      ) : (
        <div className="flex h-[calc(100vh-7.5rem)] min-h-[640px] flex-col gap-4">
          <div className="grid shrink-0 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              {
                key: "total",
                label: t("crm.leads.stats.total"),
                value: stats.total,
                icon: UsersRound,
                card: "border-violet-100 bg-white",
                iconWrap: "bg-violet-100 text-violet-700",
              },
              {
                key: "new",
                label: t("crm.leads.stats.new"),
                value: stats.new,
                icon: Sparkles,
                card: "border-sky-100 bg-white",
                iconWrap: "bg-sky-100 text-sky-700",
              },
              {
                key: "contacted",
                label: t("crm.leads.stats.contacted"),
                value: stats.contacted,
                icon: Phone,
                card: "border-amber-100 bg-white",
                iconWrap: "bg-amber-100 text-amber-700",
              },
              {
                key: "converted",
                label: t("crm.leads.stats.converted"),
                value: stats.converted,
                icon: Trophy,
                card: "border-emerald-100 bg-white",
                iconWrap: "bg-emerald-100 text-emerald-700",
              },
              {
                key: "openTasks",
                label: t("crm.leads.stats.openTasks"),
                value: stats.openTasks,
                icon: Clock3,
                card: "border-rose-100 bg-white",
                iconWrap: "bg-rose-100 text-rose-700",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className={[
                    "rounded-2xl border p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]",
                    item.card,
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-500">{item.label}</p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                        {item.value}
                      </p>
                    </div>
                    <div
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        item.iconWrap,
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {error && (
            <div className="flex shrink-0 items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="shrink-0 space-y-3 border-b border-slate-100 p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openMetaSetup}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-black text-white shadow-sm transition hover:bg-violet-500"
                  >
                    <Facebook className="h-4 w-4" />
                    {t("crm.leads.connectMeta")}
                  </button>

                  <button
                    type="button"
                    onClick={() => fetchLeads()}
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    {loading ? (
                      <BizuplyLoader size="xs" compact />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {t("crm.leads.refreshLeads")}
                  </button>
                </div>

                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 xl:max-w-md">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("crm.leads.searchPlaceholder")}
                    className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-500">
                  <Filter className="h-3.5 w-3.5" />
                  {t("crm.common.filter")}
                </div>

                {(
                  ["all", "new", "contacted", "interested", "converted", "lost"] as const
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={[
                      "rounded-full px-3.5 py-1.5 text-xs font-black transition",
                      statusFilter === status
                        ? "bg-violet-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700",
                    ].join(" ")}
                  >
                    {status === "all"
                      ? t("crm.common.all")
                      : getStatusLabel(status, t)}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden shrink-0 border-b border-slate-100 bg-slate-50/80 px-4 py-3 text-[11px] font-black uppercase tracking-[0.08em] text-slate-400 xl:grid xl:grid-cols-[1.3fr_1.1fr_0.85fr_0.75fr_1.1fr_0.85fr_0.9fr] xl:gap-3">
              <div>{t("crm.leads.table.lead")}</div>
              <div>{t("crm.leads.table.contactDetails")}</div>
              <div>{t("crm.leads.table.source")}</div>
              <div>{t("crm.leads.table.status")}</div>
              <div>{t("crm.leads.table.nextTask")}</div>
              <div>{t("crm.leads.table.createdDate")}</div>
              <div>{t("crm.leads.table.actions")}</div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {loading ? (
                <div className="space-y-3 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-16 animate-pulse rounded-xl bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="flex min-h-full flex-col items-center justify-center p-10 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <Webhook className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800">
                    {t("crm.leads.emptyTitle")}
                  </h3>
                  <p className="mt-2 max-w-md text-sm font-semibold text-slate-500">
                    {t("crm.leads.emptyDescription")}
                  </p>
                </div>
              ) : (
                leadDateGroups.map((group) => (
                  <div key={group.key}>
                    <div className="sticky top-0 z-10 border-y border-slate-200/80 bg-[#EEF0F5] px-4 py-2">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 text-violet-600" />
                        <span className="capitalize">{group.label}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-500 ring-1 ring-slate-200">
                          {group.leads.length}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {group.leads.map((lead) => {
                        const status = lead.status || "new";
                        const leadName = getLeadName(lead, t);
                        const whatsAppPhone = normalizePhoneForWhatsApp(lead.phone);
                        const nextTask = getNextOpenTask(lead);

                        return (
                          <article
                            key={lead._id}
                            onClick={() => setSelectedLead(lead)}
                            className={[
                              "cursor-pointer px-4 py-3.5 transition hover:bg-violet-50/50",
                              selectedLead?._id === lead._id ? "bg-violet-50" : "bg-white",
                              "grid gap-3 xl:grid-cols-[1.3fr_1.1fr_0.85fr_0.75fr_1.1fr_0.85fr_0.9fr] xl:items-center",
                            ].join(" ")}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={[
                                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black",
                                  getAvatarTone(leadName),
                                ].join(" ")}
                              >
                                {getInitials(leadName)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-slate-800">
                                  {leadName}
                                </p>
                                <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                                  {getLeadFormName(lead, t)}
                                </p>
                              </div>
                            </div>

                            <div className="min-w-0 space-y-1">
                              {lead.phone ? (
                                <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-slate-700">
                                  <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                  <span className="truncate" dir="ltr">
                                    {lead.phone}
                                  </span>
                                </p>
                              ) : (
                                <p className="text-sm font-semibold text-slate-300">
                                  {t("crm.common.noPhone")}
                                </p>
                              )}
                              {lead.email && (
                                <p className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-500">
                                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                  <span className="truncate" dir="ltr">
                                    {lead.email}
                                  </span>
                                </p>
                              )}
                            </div>

                            <SourceBadge lead={lead} />

                            <div>
                              <LeadStatusBadge status={status} />
                            </div>

                            <div className="min-w-0">
                              {nextTask ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                  <p className="truncate text-xs font-black text-slate-700">
                                    {nextTask.text}
                                  </p>
                                  <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                    <CalendarDays className="h-3 w-3" />
                                    {formatShortDate(
                                      nextTask.taskDueAt || nextTask.createdAt || undefined,
                                      locale,
                                      emDash
                                    )}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-slate-300">
                                  {t("crm.leads.noNextTask")}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                              <Clock3 className="h-4 w-4 shrink-0 text-slate-400" />
                              <span>
                                {formatShortDate(lead.createdAt, locale, emDash)}
                              </span>
                            </div>

                            <div
                              className="flex items-center gap-1.5"
                              onClick={(event) => event.stopPropagation()}
                            >
                              {whatsAppPhone && (
                                <a
                                  href={"https://wa.me/" + whatsAppPhone}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-emerald-600 transition hover:bg-emerald-50"
                                  title={t("crm.common.whatsapp")}
                                >
                                  <MessageCircle className="h-4 w-4" />
                                </a>
                              )}
                              {lead.phone && (
                                <a
                                  href={"tel:" + lead.phone}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sky-600 transition hover:bg-sky-50"
                                  title={t("crm.common.call")}
                                >
                                  <Phone className="h-4 w-4" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => setSelectedLead(lead)}
                                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-violet-600 px-3 text-xs font-black text-white transition hover:bg-violet-500"
                              >
                                {t("crm.common.open")}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

`;

const out = s.slice(0, start) + replacement + s.slice(end);
fs.writeFileSync(file, out);
console.log("patched", { start, end, removed: end - start, added: replacement.length });
