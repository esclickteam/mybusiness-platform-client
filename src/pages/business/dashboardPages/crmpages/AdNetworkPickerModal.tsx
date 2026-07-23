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

function NetworkLogo({
  src,
  alt,
  wide = false,
}: {
  src: string;
  alt: string;
  wide?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={
        wide
          ? "h-11 w-16 object-contain"
          : "h-12 w-12 object-contain"
      }
      draggable={false}
    />
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden>
      <rect width="48" height="48" rx="10" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M14.2 19.4h4.3v14.4h-4.3V19.4zm2.2-7c1.4 0 2.5 1.1 2.5 2.5S17.8 17.4 16.4 17.4 13.9 16.3 13.9 14.9 15 12.4 16.4 12.4zm7 7h4.1v2h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.3 2.9 5.3 6.8v7.9h-4.3v-7c0-1.7 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7v7.1h-4.3V19.4z"
      />
    </svg>
  );
}

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
    logo: <NetworkLogo src="/meta.svg" alt="Meta" wide />,
  },
  {
    id: "google",
    labelKey: "google",
    available: true,
    logo: <NetworkLogo src="/google-ads.svg" alt="Google Ads" />,
  },
  {
    id: "linkedin",
    labelKey: "linkedin",
    available: false,
    logo: <LinkedInLogo />,
  },
  {
    id: "tiktok",
    labelKey: "tiktok",
    available: false,
    logo: <NetworkLogo src="/tiktok.svg" alt="TikTok" />,
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
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-900/45 p-0 sm:items-start sm:p-4 sm:pt-10"
      dir={dir}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label={t("crm.common.close")}
        onClick={onClose}
      />
      <div className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)] sm:max-h-none sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between bg-[#0F766E] px-4 py-3 text-white sm:px-5 sm:py-4">
          <h2 className="text-base font-black sm:text-lg">{t("crm.leads.adNetworks.title")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition hover:bg-white/25"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-4 sm:gap-4 sm:p-5">
          {NETWORKS.map((network) => (
            <button
              key={network.id}
              type="button"
              onClick={() => {
                if (!network.available) return;
                onSelect(network.id);
              }}
              className={[
                "relative flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border bg-[#F3F4F6] p-3 transition sm:min-h-[140px] sm:gap-3",
                network.available
                  ? "border-slate-200 hover:border-sky-300 hover:bg-white"
                  : "cursor-not-allowed border-slate-100 opacity-55",
              ].join(" ")}
            >
              {network.logo}
              <span className="text-xs font-black text-slate-600 sm:text-sm">
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
