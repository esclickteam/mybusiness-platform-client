import React from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus } from "lucide-react";

type CropCard = {
  id: "square" | "vertical" | "horizontal";
  labelKey: string;
  hintKey: string;
  aspectClass: string;
};

const CROP_CARDS: CropCard[] = [
  {
    id: "square",
    labelKey: "metaCampaigns.wizard.crop.square",
    hintKey: "metaCampaigns.wizard.crop.squareHint",
    aspectClass: "aspect-square",
  },
  {
    id: "vertical",
    labelKey: "metaCampaigns.wizard.crop.vertical",
    hintKey: "metaCampaigns.wizard.crop.verticalHint",
    aspectClass: "aspect-[9/16]",
  },
  {
    id: "horizontal",
    labelKey: "metaCampaigns.wizard.crop.horizontal",
    hintKey: "metaCampaigns.wizard.crop.horizontalHint",
    aspectClass: "aspect-[1.91/1]",
  },
];

type Props = {
  imageUrl?: string;
  /** Selected ad formats from the wizard (optional filter). */
  selectedFormats?: string[];
  /** Placement flags — when set, only matching crops are emphasized. */
  showSquare?: boolean;
  showVertical?: boolean;
  showHorizontal?: boolean;
};

export default function MetaPlacementCropPreview({
  imageUrl,
  selectedFormats = [],
  showSquare = true,
  showVertical = true,
  showHorizontal = true,
}: Props) {
  const { t } = useTranslation();

  const visibility: Record<CropCard["id"], boolean> = {
    square:
      showSquare &&
      (selectedFormats.length === 0 ||
        selectedFormats.some((f) => /feed|square|standard/i.test(f))),
    vertical:
      showVertical &&
      (selectedFormats.length === 0 ||
        selectedFormats.some((f) => /story|reels|vertical/i.test(f))),
    horizontal:
      showHorizontal &&
      (selectedFormats.length === 0 ||
        selectedFormats.some((f) => /feed|horizontal|right_column/i.test(f))),
  };

  const visibleCards = CROP_CARDS.filter((card) => visibility[card.id]);

  return (
    <div className="grid gap-4 sm:grid-cols-3" dir="rtl">
      {(visibleCards.length ? visibleCards : CROP_CARDS).map((card) => (
        <div
          key={card.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className={`relative w-full overflow-hidden bg-slate-100 ${card.aspectClass}`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                <ImagePlus className="h-8 w-8 opacity-70" />
                <p className="px-3 text-center text-[11px] font-semibold">
                  {t("metaCampaigns.wizard.crop.noImage")}
                </p>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 px-3 py-2.5">
            <p className="text-sm font-black text-slate-900">{t(card.labelKey)}</p>
            <p className="text-[11px] font-semibold text-slate-500">
              {t(card.hintKey)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
