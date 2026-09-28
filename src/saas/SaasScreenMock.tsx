import type { SaasScreenshot } from "./logic";

type Props = {
  screen: SaasScreenshot;
  accent?: string;
  accentSecondary?: string;
  productName?: string;
  framed?: boolean;
};

const NAV = ["Home", "Work", "People", "Calendar", "Billing"];

function Bars({ accent }: { accent: string }) {
  const heights = [42, 68, 50, 80, 62, 90, 74];
  return (
    <div className="flex h-28 items-end gap-2">
      {heights.map((height, index) => (
        <span
          key={index}
          className="flex-1 rounded-t-lg"
          style={{
            height: `${height}%`,
            background: index % 2 ? accent : `${accent}55`,
          }}
        />
      ))}
    </div>
  );
}

function Rows({
  items,
  accent,
}: {
  items: string[];
  accent: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm"
        >
          <span>{item}</span>
          <span className="rounded-full px-2 py-0.5 text-[10px] text-white" style={{ background: accent }}>
            Open
          </span>
        </div>
      ))}
    </div>
  );
}

function ScreenBody({
  screenKey,
  accent,
  productName,
}: {
  screenKey: string;
  accent: string;
  productName: string;
}) {
  if (screenKey === "customers") {
    return (
      <Rows
        accent={accent}
        items={["Avery Cole", "Northwind Plumbing", "Lina Ortiz", "Harbor Electric"]}
      />
    );
  }
  if (screenKey === "jobs" || screenKey === "orders") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {["New", "Scheduled", "Done"].map((column) => (
          <div key={column} className="rounded-xl bg-white p-2 shadow-sm">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">{column}</p>
            <div className="space-y-1.5">
              <div className="rounded-lg bg-slate-50 px-2 py-2 text-[10px] font-semibold text-slate-600">Visit window</div>
              <div className="rounded-lg bg-slate-50 px-2 py-2 text-[10px] font-semibold text-slate-600">Follow-up</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (screenKey === "calendar") {
    return (
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }, (_, index) => (
          <div
            key={index}
            className="aspect-square rounded-md bg-white text-center text-[9px] font-bold leading-5 text-slate-400 shadow-sm"
            style={index % 5 === 0 ? { background: accent, color: "white" } : undefined}
          >
            {index + 1}
          </div>
        ))}
      </div>
    );
  }
  if (screenKey === "reports") {
    return (
      <div>
        <p className="mb-2 text-[11px] font-bold text-slate-500">Workload this week</p>
        <Bars accent={accent} />
      </div>
    );
  }
  if (screenKey === "billing") {
    return (
      <Rows
        accent={accent}
        items={["Invoice 1042 · Draft", "Invoice 1048 · Sent", "Invoice 1051 · Draft"]}
      />
    );
  }
  if (screenKey === "settings") {
    return (
      <div className="space-y-2">
        {["Your logo", "Brand colors", "Custom domain", "Plan prices"].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-sm">
            {item}
            <span className="h-4 w-8 rounded-full" style={{ background: accent }} />
          </div>
        ))}
      </div>
    );
  }
  if (screenKey === "admin" || screenKey === "super_admin") {
    return (
      <Rows
        accent={accent}
        items={
          screenKey === "super_admin"
            ? ["Workspace · Northwind", "Workspace · Harbor", "Roles · Owner"]
            : ["Team roles", "Permissions", "Branding"]
        }
      />
    );
  }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {["Today", "Queue", "Calendar"].map((label) => (
          <div key={label} className="rounded-xl bg-white px-2 py-3 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-black text-slate-800">{productName.slice(0, 1)}</p>
          </div>
        ))}
      </div>
      <Bars accent={accent} />
    </div>
  );
}

export default function SaasScreenMock({
  screen,
  accent = "#5B4DFF",
  accentSecondary = "#38BDF8",
  productName = "Platform",
  framed = true,
}: Props) {
  const mobile = screen.key === "mobile";
  const body = (
    <div className="flex h-full min-h-[220px] bg-[#f4f6fb]">
      {!mobile && (
        <aside
          className="hidden w-16 shrink-0 flex-col gap-2 p-2 sm:flex"
          style={{ background: `linear-gradient(180deg, ${accent}, ${accentSecondary})` }}
        >
          <span className="mx-auto mt-1 h-7 w-7 rounded-lg bg-white/90" />
          {NAV.map((item) => (
            <span key={item} className="h-2 rounded-full bg-white/35" />
          ))}
        </aside>
      )}
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Interface preview
            </p>
            <p className="text-sm font-black text-slate-900">{screen.label}</p>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
            {productName}
          </span>
        </div>
        <ScreenBody screenKey={screen.key} accent={accent} productName={productName} />
      </div>
    </div>
  );

  if (screen.imageUrl) {
    return (
      <img
        src={screen.imageUrl}
        alt={`${productName} ${screen.label}`}
        className="h-full w-full object-cover"
      />
    );
  }

  if (mobile) {
    return (
      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,#eef2ff,transparent_60%)] p-6">
        <div className="w-[180px] overflow-hidden rounded-[28px] border-[6px] border-slate-900 bg-white shadow-2xl">
          <div className="h-4 bg-slate-900" />
          <div className="p-3">
            <p className="text-[10px] font-black" style={{ color: accent }}>
              {productName}
            </p>
            <p className="mt-2 text-[11px] font-bold text-slate-800">Today</p>
            <div className="mt-2 space-y-1.5">
              {["09:30 Visit", "11:00 Follow-up", "14:15 New request"].map((item) => (
                <div key={item} className="rounded-lg bg-slate-50 px-2 py-1.5 text-[10px] font-semibold text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!framed) return body;

  return (
    <div className="overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-2 h-5 flex-1 rounded-full bg-slate-100" />
      </div>
      {body}
    </div>
  );
}
