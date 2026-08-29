import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { btnPrimary } from "../../../../styles/bizuplyUi";
import CreateCampaignModeModal from "./CreateCampaignModeModal";

type Props = {
  basePath: string;
  className?: string;
};

export default function CreateCampaignButton({
  basePath,
  className = btnPrimary,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        data-testid="create-campaign-entry"
      >
        <Plus className="h-4 w-4" />
        {t("metaCampaigns.actions.create")}
      </button>
      <CreateCampaignModeModal
        open={open}
        basePath={basePath}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
