import React, { useState } from "react";
import type { LucideIcon } from "lucide-react";

import { getPluginCoverUrl } from "../../../data/pluginCoverArt";

type PluginCoverImageProps = {
  pluginKey: string;
  pluginName: string;
  accent: string;
  Icon: LucideIcon;
  className?: string;
  variant?: "card" | "detail" | "hero";
};

export default function PluginCoverImage({
  pluginKey,
  pluginName,
  accent,
  Icon,
  className = "",
  variant = "card",
}: PluginCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const coverUrl = getPluginCoverUrl(pluginKey);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{
          background: `linear-gradient(145deg, ${accent}22 0%, ${accent}08 50%, #f8fafc 100%)`,
        }}
      >
        <div
          className={`grid place-items-center rounded-2xl text-white shadow-lg ${
            variant === "hero" ? "h-24 w-24" : variant === "detail" ? "h-20 w-20" : "h-16 w-16"
          }`}
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <Icon size={variant === "hero" ? 44 : variant === "detail" ? 32 : 28} strokeWidth={1.75} />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={coverUrl}
        alt={`${pluginName} — תצוגה מקדימה`}
        className={`h-full w-full object-cover transition duration-300 ${
          variant === "card" ? "group-hover:scale-[1.02]" : ""
        }`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
