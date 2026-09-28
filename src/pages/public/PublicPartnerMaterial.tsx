import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchPublicPartnerCenterShare, type PartnerMaterial } from "../../lib/partnerCenterApi";
import API from "@api";
import { coerceSupportedLanguage, detectLanguageFromNavigator, getTextDirection } from "../../i18n/localeUtils";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function PublicPartnerMaterial() {
  const { token } = useParams();
  const { t, i18n } = useTranslation();
  const [item, setItem] = useState<PartnerMaterial | null>(null);
  const [missing, setMissing] = useState(false);
  const uiLocale = coerceSupportedLanguage(i18n.language || detectLanguageFromNavigator() || "en");
  const dir = getTextDirection(item?.locale || uiLocale);

  useEffect(() => {
    if (!token) {
      setMissing(true);
      return;
    }
    setMissing(false);
    setItem(null);
    fetchPublicPartnerCenterShare(token)
      .then((row) => {
        setItem(row);
        if (row?.locale) i18n.changeLanguage(coerceSupportedLanguage(row.locale));
      })
      .catch(() => setMissing(true));
  }, [token, i18n]);

  return (
    <div dir={dir} className="min-h-screen bg-[#F7F8FA] px-4 py-10">
      <article className="mx-auto max-w-3xl rounded-[24px] bg-white p-6 shadow-sm">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        {missing ? (
          <p className="font-bold text-rose-600">{t("partnerCenter.shareNotFound")}</p>
        ) : null}
        {item ? (
          <>
            <p className="text-xs font-black uppercase tracking-wide text-[#7C3AED]">Bizuply</p>
            <p className="mt-2 text-3xl font-black">{item.title}</p>
            <p className="mt-2 font-bold text-slate-500">{item.description}</p>
            {item.videoReady && item.localeVideoUrl ? (
              <video className="mt-6 w-full rounded-2xl" controls src={item.localeVideoUrl} />
            ) : item.assetType === "video_script" || item.assetType === "short_video" ? (
              <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
                {t("partnerCenter.readyForProduction")}
              </p>
            ) : null}
            <pre className="mt-6 whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-700">
              {item.body}
            </pre>
            <div className="mt-6">
              <a
                className="inline-flex rounded-2xl bg-[#6D28D9] px-4 py-2 text-sm font-black text-white"
                href={`${String(API.defaults.baseURL || "/api").replace(/\/$/, "")}/partner-center/share/${token}/pdf`}
              >
                {t("partnerCenter.download")}
              </a>
            </div>
          </>
        ) : null}
      </article>
    </div>
  );
}
