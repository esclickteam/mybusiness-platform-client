import React, { useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Settings2, Sparkles, X } from "lucide-react";
import { btnSecondary, cardBase, modalOverlay } from "../../../../styles/bizuplyUi";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import {
  type CampaignCreationMode,
  META_CAMPAIGNS_CREATE_AI_PATH,
  META_CAMPAIGNS_CREATE_PATH,
  metaCampaignsChildPath,
} from "./campaignCreationMode";

type Props = {
  open: boolean;
  basePath: string;
  onClose: () => void;
  onSelect?: (mode: CampaignCreationMode) => void;
};

export default function CreateCampaignModeModal({
  open,
  basePath,
  onClose,
  onSelect,
}: Props) {
  const { t } = useTranslation();
  const dir = useLocaleDir();
  const navigate = useNavigate();
  const titleId = useId();
  const subtitleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const choose = (mode: CampaignCreationMode) => {
    onSelect?.(mode);
    const child =
      mode === "AI_ASSISTED"
        ? META_CAMPAIGNS_CREATE_AI_PATH
        : META_CAMPAIGNS_CREATE_PATH;
    navigate(metaCampaignsChildPath(basePath, child));
    onClose();
  };

  return (
    <div
      className={modalOverlay}
      role="presentation"
      dir={dir}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        className={`${cardBase} relative w-full max-w-3xl overflow-hidden p-5 sm:p-6`}
      >
        <button
          type="button"
          className="absolute end-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          aria-label={t("metaCampaigns.creationMode.close")}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>

        <header className="pe-10">
          <h2
            id={titleId}
            className="text-lg font-black tracking-tight text-slate-900 sm:text-xl"
          >
            {t("metaCampaigns.creationMode.title")}
          </h2>
          <p
            id={subtitleId}
            className="mt-1 text-sm font-semibold text-slate-500"
          >
            {t("metaCampaigns.creationMode.subtitle")}
          </p>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ModeCard
            mode="MANUAL"
            icon={Settings2}
            title={t("metaCampaigns.creationMode.manual.title")}
            description={t("metaCampaigns.creationMode.manual.description")}
            cta={t("metaCampaigns.creationMode.manual.cta")}
            highlighted={false}
            onChoose={choose}
          />
          <ModeCard
            mode="AI_ASSISTED"
            icon={Sparkles}
            title={t("metaCampaigns.creationMode.ai.title")}
            description={t("metaCampaigns.creationMode.ai.description")}
            cta={t("metaCampaigns.creationMode.ai.cta")}
            highlighted
            onChoose={choose}
          />
        </div>
      </div>
    </div>
  );
}

function ModeCard({
  mode,
  icon: Icon,
  title,
  description,
  cta,
  highlighted,
  onChoose,
}: {
  mode: CampaignCreationMode;
  icon: React.ElementType;
  title: string;
  description: string;
  cta: string;
  highlighted: boolean;
  onChoose: (mode: CampaignCreationMode) => void;
}) {
  return (
    <button
      type="button"
      data-creation-mode={mode}
      onClick={() => onChoose(mode)}
      className={[
        "flex h-full flex-col items-stretch rounded-xl border p-4 text-start transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
        highlighted
          ? "border-violet-200 bg-gradient-to-l from-violet-50/90 via-sky-50/70 to-cyan-50/50 hover:border-violet-300"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70",
      ].join(" ")}
    >
      <span
        className={[
          "grid h-10 w-10 place-items-center rounded-lg border",
          highlighted
            ? "border-violet-200 bg-white text-violet-600"
            : "border-slate-200 bg-slate-50 text-slate-600",
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </span>
      <strong className="mt-3 text-sm font-black text-slate-900">{title}</strong>
      <em className="mt-1.5 flex-1 text-sm font-semibold not-italic leading-5 text-slate-500">
        {description}
      </em>
      <span className={`${btnSecondary} mt-4 w-full`}>{cta}</span>
    </button>
  );
}
