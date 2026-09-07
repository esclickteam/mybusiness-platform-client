import React from "react";
import { useTranslation } from "react-i18next";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import { getTextDirection } from "../../../../../../i18n/localeUtils";

export default function VowlineThumbnail() {
  const { i18n } = useTranslation();
  const images = [
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=500&q=75",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=75",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=500&q=75",
  ];

  return (
    <div dir={getTextDirection(i18n.language)} className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F8F4F0", color: "#1A2430" }}>
      <div className="flex items-center justify-between">
        <span className="text-4xl leading-none" style={{ fontFamily: "\"Great Vibes\", cursive", color: "#5B7C99" }}>Vowline</span>
        <div className="grid h-8 w-8 place-items-center border text-xs font-bold" style={{ borderColor: "#5B7C99", color: "#5B7C99" }}>V</div>
      </div>
      <div className="mt-6 grid h-28 grid-cols-5 gap-2">
        <img src={images[0]} alt="" className="col-span-3 h-full w-full object-cover" />
        <div className="col-span-2 grid gap-2">
          <img src={images[1]} alt="" className="h-full w-full object-cover" />
          <img src={images[2]} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="mt-6 border-t pt-5 text-center" style={{ borderColor: "#5B7C9933" }}>
        <p className="text-[10px] font-bold tracking-[0.28em]" style={{ color: "#5B7C99" }}>{tx("תכנון חתונות")}</p>
        <h3 className="mx-auto mt-2 max-w-[220px] text-xl font-semibold leading-tight">{tx("יום חתונה שמרגיש קל, אישי ויפהפה.")}</h3>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 text-center text-xs font-bold text-white" style={{ background: "#5B7C99" }}>
        {tx("שיחת היכרות")}</div>
    </div>
  );
}
