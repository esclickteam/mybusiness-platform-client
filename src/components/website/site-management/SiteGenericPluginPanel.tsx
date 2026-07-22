import React from "react";
import { ExternalLink, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";

type SiteGenericPluginPanelProps = {
  plugin: SitePluginDefinition;
  editorHref: string;
};

export default function SiteGenericPluginPanel({
  plugin,
  editorHref,
}: SiteGenericPluginPanelProps) {
  const Icon = getPluginIcon(plugin.key);
  const accent = getPluginAccent(plugin.key, plugin.accent);
  const price =
    plugin.priceLabel ||
    (plugin.priceMonthly != null
      ? plugin.priceMax
        ? `₪${plugin.priceMonthly}–${plugin.priceMax}/חודש`
        : `₪${plugin.priceMonthly}/חודש`
      : "כלול");

  return (
    <div className="mx-auto max-w-2xl rounded-[22px] border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div
        className="mx-auto grid h-14 w-14 place-items-center rounded-[16px] text-white shadow-md"
        style={{ background: accent }}
      >
        <Icon size={26} />
      </div>

      <h2 className="mt-4 text-xl font-black text-slate-950">{plugin.name}</h2>
      <p className="mt-2 text-sm font-bold text-violet-700">{price}</p>
      <p className="mt-3 text-sm font-bold leading-7 text-slate-500">
        {plugin.description}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
        <Settings2 size={13} />
        התוסף מותקן — הגדרה בעורך בקרוב
      </div>

      <Link
        to={editorHref}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-violet-700"
      >
        <ExternalLink size={15} />
        פתיחה בעורך
      </Link>
    </div>
  );
}
