import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";
export default function SunriftThumbnail() {
  const { i18n } = useTranslation();
  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="grid h-full min-h-[260px] grid-cols-2">
        <div className="flex flex-col justify-center p-4" style={{ background: "#1a0f0a", color: "#fff4e8" }}>
          <p className="text-[10px]" style={{ color: "#ff8c42" }}>{tx("Beach Club · שקיעה")}</p>
          <h3 className="text-3xl font-bold leading-none" style={{ fontFamily: '"Bebas Neue", "Rubik"' }}>Sunrift</h3>
        </div>
        <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1473496165774-b890209ef8aa?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
    </div>
  );
}
