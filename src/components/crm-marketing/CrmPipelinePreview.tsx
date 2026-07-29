import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type StageKey = "new" | "contacted" | "interested" | "converted";

type LeadCard = {
  id: string;
  nameKey: string;
  sourceKey: string;
  stage: StageKey;
};

const STAGES: StageKey[] = ["new", "contacted", "interested", "converted"];

const INITIAL_LEADS: LeadCard[] = [
  { id: "l1", nameKey: "lead1", sourceKey: "meta", stage: "new" },
  { id: "l2", nameKey: "lead2", sourceKey: "form", stage: "contacted" },
  { id: "l3", nameKey: "lead3", sourceKey: "instagram", stage: "interested" },
  { id: "l4", nameKey: "lead4", sourceKey: "meta", stage: "converted" },
  { id: "l5", nameKey: "lead5", sourceKey: "manual", stage: "new" },
];

export default function CrmPipelinePreview() {
  const { t } = useTranslation();
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [pulseId, setPulseId] = useState<string | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    if (reduceMotion) return undefined;

    const timer = window.setInterval(() => {
      setLeads((prev) => {
        const movable = prev.find((lead) => lead.stage !== "converted");
        if (!movable) {
          return INITIAL_LEADS.map((lead) => ({ ...lead }));
        }
        const nextStage =
          STAGES[Math.min(STAGES.indexOf(movable.stage) + 1, STAGES.length - 1)];
        setPulseId(movable.id);
        window.setTimeout(() => setPulseId(null), 700);
        return prev.map((lead) =>
          lead.id === movable.id ? { ...lead, stage: nextStage } : lead
        );
      });
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="crm-pipe" aria-hidden="true">
      <div className="crm-pipe__chrome">
        <div className="crm-pipe__dots">
          <span />
          <span />
          <span />
        </div>
        <p className="crm-pipe__title">
          {t("productPages.crm.pipelinePreviewTitle")}
        </p>
        <span className="crm-pipe__live">
          <i />
          {t("productPages.crm.pipelineLive")}
        </span>
      </div>

      <div className="crm-pipe__board">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage);
          return (
            <div key={stage} className="crm-pipe__col">
              <div className="crm-pipe__col-head">
                <span className={`crm-pipe__dot crm-pipe__dot--${stage}`} />
                <span>{t(`productPages.crm.pipelineStage.${stage}`)}</span>
                <em>{stageLeads.length}</em>
              </div>
              <div className="crm-pipe__col-body">
                <AnimatePresence initial={false}>
                  {stageLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: pulseId === lead.id ? 1.02 : 1,
                      }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={`crm-pipe__card${
                        pulseId === lead.id ? " is-pulse" : ""
                      }`}
                    >
                      <strong>
                        {t(`productPages.crm.pipelineLeads.${lead.nameKey}`)}
                      </strong>
                      <span>
                        {t(`productPages.crm.pipelineSources.${lead.sourceKey}`)}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
