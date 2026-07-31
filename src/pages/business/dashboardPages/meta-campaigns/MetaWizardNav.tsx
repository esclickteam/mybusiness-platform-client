import React from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import {
  getWizardDefinition,
  type WizardMainStep,
} from "./metaWizardConfig";

type Props = {
  mainStep: WizardMainStep;
  subStep: number;
  isLeads: boolean;
  onJumpMain?: (main: WizardMainStep) => void;
  onJumpSub?: (sub: number) => void;
};

const MAIN_KEYS: Record<WizardMainStep, string> = {
  1: "metaCampaigns.wizard.main.campaign.short",
  2: "metaCampaigns.wizard.main.audience.short",
  3: "metaCampaigns.wizard.main.ad.short",
};

export default function MetaWizardNav({
  mainStep,
  subStep,
  isLeads,
  onJumpMain,
  onJumpSub,
}: Props) {
  const { t } = useTranslation();
  const definition = getWizardDefinition(isLeads);
  const currentMainDef = definition.find((item) => item.main === mainStep);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {definition.map((mainDef) => {
          const isCurrent = mainDef.main === mainStep;
          const isCompleted = mainDef.main < mainStep;
          const canJump = isCompleted && onJumpMain;

          return (
            <button
              key={mainDef.main}
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onJumpMain(mainDef.main)}
              className={[
                "flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3 text-center transition sm:px-4 sm:py-4",
                isCurrent
                  ? "border-[#1877F2] bg-[#1877F2]/10 shadow-sm"
                  : isCompleted
                    ? "border-[#1877F2]/30 bg-white hover:border-[#1877F2]/50"
                    : "border-slate-200 bg-white text-slate-400",
                canJump ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-black",
                  isCurrent || isCompleted
                    ? "bg-[#1877F2] text-white"
                    : "bg-slate-100 text-slate-400",
                ].join(" ")}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  mainDef.main
                )}
              </span>
              <span
                className={[
                  "text-xs font-black sm:text-sm",
                  isCurrent || isCompleted ? "text-slate-900" : "text-slate-400",
                ].join(" ")}
              >
                {t(MAIN_KEYS[mainDef.main])}
              </span>
            </button>
          );
        })}
      </div>

      {currentMainDef ? (
        <div className="flex flex-wrap gap-2">
          {currentMainDef.subs.map((sub, index) => {
            const isCurrent = index === subStep;
            const isCompleted = index < subStep;
            const canJump = (isCompleted || isCurrent) && onJumpSub;

            return (
              <button
                key={sub.id}
                type="button"
                disabled={!canJump}
                onClick={() => canJump && onJumpSub(index)}
                className={[
                  "inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1.5 text-start transition",
                  isCurrent
                    ? "border-[#1877F2] bg-[#1877F2] text-white"
                    : isCompleted
                      ? "border-[#1877F2]/30 bg-[#1877F2]/5 text-slate-800 hover:border-[#1877F2]/50"
                      : "border-slate-200 bg-slate-50 text-slate-400",
                  canJump ? "cursor-pointer" : "cursor-default",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black",
                    isCurrent
                      ? "bg-white/25 text-white"
                      : isCompleted
                        ? "bg-[#1877F2] text-white"
                        : "bg-slate-200 text-slate-500",
                  ].join(" ")}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="truncate text-xs font-black">
                  {t(sub.titleKey)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
