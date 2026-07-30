import React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";

export type AdNetworkId = "meta" | "google";

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

const NETWORKS: Array<{
  id: AdNetworkId;
  labelKey: string;
  logo: React.ReactNode;
}> = [
  {
    id: "meta",
    labelKey: "meta",
    logo: <NetworkLogo src="/meta.svg" alt="Meta" wide />,
  },
  {
    id: "google",
    labelKey: "google",
    logo: <NetworkLogo src="/google-ads.svg" alt="Google Ads" />,
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
              onClick={() => onSelect(network.id)}
              className="relative flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-[#F3F4F6] p-3 transition hover:border-sky-300 hover:bg-white sm:min-h-[140px] sm:gap-3"
            >
              {network.logo}
              <span className="text-xs font-black text-slate-600 sm:text-sm">
                {t(`crm.leads.adNetworks.${network.labelKey}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
