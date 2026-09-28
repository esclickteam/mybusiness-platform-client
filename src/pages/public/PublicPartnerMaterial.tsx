import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicPartnerCenterShare, type PartnerMaterial } from "../../lib/partnerCenterApi";
import { getTextDirection } from "../../i18n/localeUtils";
const READY: Record<string, string> = {
  en: "Ready for production",
  he: "מוכן להפקה",
  es: "Listo para producción",
  "pt-BR": "Pronto para produção",
  ar: "جاهز للإنتاج",
};

export default function PublicPartnerMaterial() {
  const { token } = useParams();
  const [item, setItem] = useState<PartnerMaterial | null>(null);
  const [error, setError] = useState("");
  const dir = getTextDirection(item?.locale || "en");

  useEffect(() => {
    if (!token) return;
    fetchPublicPartnerCenterShare(token)
      .then(setItem)
      .catch((err) => setError(err?.response?.data?.error || "Not found"));
  }, [token]);

  return (
    <div dir={dir} className="min-h-screen bg-[#F7F8FA] px-4 py-10">
      <article className="mx-auto max-w-3xl rounded-[24px] bg-white p-6 shadow-sm">
        {error ? <p className="font-bold text-rose-600">{error}</p> : null}
        {item ? (
          <>
            <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">Bizuply</p>
            <p className="mt-2 text-3xl font-black">{item.title}</p>
            <p className="mt-2 font-bold text-slate-500">{item.description}</p>
            {item.videoReady && item.localeVideoUrl ? (
              <video className="mt-6 w-full rounded-2xl" controls src={item.localeVideoUrl} />
            ) : item.assetType === "video_script" || item.assetType === "short_video" ? (
              <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
              {READY[item.locale] || READY.en}
              </p>
            ) : null}
            <pre className="mt-6 whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-700">
              {item.body}
            </pre>
          </>
        ) : null}
      </article>
    </div>
  );
}
