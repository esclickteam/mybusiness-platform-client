import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { btnPrimary } from "../../../../styles/bizuplyUi";
import { isGuidedDemoActive } from "@/guidedDemo/sessionStore";
import CreateCampaignModeModal from "./CreateCampaignModeModal";
import {
  META_CAMPAIGNS_CREATE_PATH,
  metaCampaignsChildPath,
} from "./campaignCreationMode";

type Props = {
  basePath: string;
  className?: string;
};

export default function CreateCampaignButton({
  basePath,
  className = btnPrimary,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onCreate = () => {
    // The guided tour walks the manual Ads Manager flow step by step.
    if (isGuidedDemoActive()) {
      navigate(metaCampaignsChildPath(basePath, META_CAMPAIGNS_CREATE_PATH));
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={onCreate}
        data-testid="create-campaign-entry"
        data-demo-target="meta-create-campaign"
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
