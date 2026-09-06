import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { SitePluginDefinition } from "../../../api/sitePluginsApi";
import { getPluginAccent, getPluginIcon } from "../../../data/sitePluginNav";
import { btnPrimary } from "./siteManagementUi";

type SiteGenericPluginPanelProps = {
  plugin: SitePluginDefinition;
  editorHref: string;
};

export default function SiteGenericPluginPanel({
  plugin,
  editorHref,
}: SiteGenericPluginPanelProps) {
  const { t } = useTranslation();
  const Icon = getPluginIcon(plugin.key);
  const accent = getPluginAccent(plugin.key, plugin.accent);
  const price =
    plugin.priceLabel ||
    (plugin.priceMonthly != null
      ? plugin.priceMax
        ? t("leftover.pluginGeneric.priceRange", {
            min: plugin.priceMonthly,
            max: plugin.priceMax,
            defaultValue: "₪{{min}}–{{max}}/month",
          })
        : t("leftover.pluginGeneric.priceMonth", {
            price: plugin.priceMonthly,
            defaultValue: "₪{{price}}/month",
          })
      : t("leftover.pluginGeneric.included", "Included in the plan"));

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/50 to-white p-8 text-center shadow-sm">
      <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-2xl text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
      >
        <Icon size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-900">{plugin.name}</h2>
      <p className="mt-1 text-sm font-semibold text-violet-600">{price}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        {plugin.description}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <Settings2 size={14} />
        {t(
          "leftover.pluginGeneric.installedSoon",
          "Plugin installed — editor setup coming soon"
        )}
      </div>

      <Link to={editorHref} className={`mt-6 ${btnPrimary}`}>
        <ExternalLink size={15} />
        {t("leftover.pluginGeneric.openEditor", "Open in editor")}
      </Link>
    </div>
  );
}
