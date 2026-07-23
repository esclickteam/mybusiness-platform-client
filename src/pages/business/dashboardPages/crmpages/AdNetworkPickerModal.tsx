import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

export type AdNetworkId = "meta" | "google" | "linkedin" | "tiktok";

type AdNetworkPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (network: AdNetworkId) => void;
};

const NETWORKS: Array<{
  id: AdNetworkId;
  labelKey: string;
  available: boolean;
  logo: React.ReactNode;
}> = [
  {
    id: "meta",
    labelKey: "meta",
    available: true,
    logo: (
      <svg viewBox="0 0 36 24" className="h-10 w-14" aria-hidden>
        <path
          fill="#0082FB"
          d="M18.5 3.2c-3.4 0-5.6 1.8-6.6 5.4 1.3-1.8 2.9-2.5 4.6-2.1 1 .2 1.7.9 2.5 1.7 1.3 1.3 2.8 2.8 5.9 2.8 3.4 0 5.6-1.8 6.6-5.4-1.3 1.8-2.9 2.5-4.6 2.1-1-.2-1.7-.9-2.5-1.7-1.3-1.3-2.8-2.8-5.9-2.8zm-6.6 7.2c-3.4 0-5.6 1.8-6.6 5.4 1.3-1.8 2.9-2.5 4.6-2.1 1 .2 1.7.9 2.5 1.7 1.3 1.3 2.8 2.8 5.9 2.8 3.4 0 5.6-1.8 6.6-5.4-1.3 1.8-2.9 2.5-4.6 2.1-1-.2-1.7-.9-2.5-1.7-1.3-1.3-2.8-2.8-5.9-2.8z"
        />
      </svg>
    ),
  },
  {
    id: "google",
    labelKey: "google",
    available: true,
    logo: (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
        <path fill="#34A853" d="M24 8c4.4 0 8.4 1.6 11.5 4.3l-4.9 4.9C28.6 15.5 26.4 14.6 24 14.6c-5.1 0-9.4 3.4-10.9 8.1l-5.7-4.4C10.1 11.7 16.5 8 24 8z" />
        <path fill="#FBBC05" d="M13.1 22.7c-.5 1.5-.8 3.1-.8 4.8s.3 3.3.8 4.8l-5.7 4.4C6.5 33.7 6 31 6 27.5s.5-6.2 1.4-9l5.7 4.2z" />
        <path fill="#EA4335" d="M24 40.4c-7.5 0-13.9-3.7-16.6-9.5l5.7-4.4c1.5 4.7 5.8 8.1 10.9 8.1 2.6 0 5-.9 6.8-2.4l5.1 5.1C32.7 39.1 28.6 40.4 24 40.4z" />
        <path fill="#4285F4" d="M42.2 24c0-1.2-.1-2.4-.4-3.5H24v7h10.3c-.5 2.4-1.8 4.4-3.8 5.7l5.1 5.1C39.6 35.1 42.2 30 42.2 24z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    labelKey: "linkedin",
    available: false,
    logo: (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0A66C2] text-xl font-black text-white">
        in
      </div>
    ),
  },
  {
    id: "tiktok",
    labelKey: "tiktok",
    available: false,
    logo: (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-black text-white">
        ♪
      </div>
    ),
  },
];

export default function AdNetworkPickerModal({
  open,
  onClose,
  onSelect,
}: AdNetworkPickerModalProps) {
  const { t } = useTranslation();
  const dir = useLocaleDir();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/45 p-4" dir={dir}>
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t("crm.common.close")}
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between bg-[#0F766E] px-5 py-4 text-white">
          <h2 className="text-lg font-black">{t("crm.leads.adNetworks.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              type="button"
              onClick={() => {
                if (!network.available) return;
                onSelect(network.id);
              }}
              className={[
                "relative flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border bg-[#F3F4F6] transition",
                network.available
                  ? "border-slate-200 hover:border-sky-300 hover:bg-white"
                  : "cursor-not-allowed border-slate-100 opacity-55",
              ].join(" ")}
            >
              {network.logo}
              <span className="text-sm font-black text-slate-600">
                {t(`crm.leads.adNetworks.${network.labelKey}`)}
              </span>
              {!network.available && (
                <span className="absolute bottom-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-500 ring-1 ring-slate-200">
                  {t("crm.leads.adNetworks.comingSoon")}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
