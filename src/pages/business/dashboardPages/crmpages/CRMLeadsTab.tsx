import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MetaLeadAdsIntegration from "./MetaLeadAdsIntegration";
import GoogleAdsLeadIntegration from "./GoogleAdsLeadIntegration";
import AdNetworkPickerModal, {
  type AdNetworkId,
} from "./AdNetworkPickerModal";
import { useLocaleDir } from "../../../../hooks/useLocaleDir";
import CRMLeadsWorkspace from "./workspace/CRMLeadsWorkspace";

type LeadsTabMode = "active" | "old";

type CRMLeadsTabProps = {
  businessId?: string;
  mode?: LeadsTabMode;
};

export default function CRMLeadsTab({
  businessId,
  mode = "active",
}: CRMLeadsTabProps) {
  const dir = useLocaleDir();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAdNetworkPicker, setShowAdNetworkPicker] = useState(false);

  const showMetaSetup =
    searchParams.get("metaSetup") === "1" ||
    searchParams.get("meta_connected") === "1" ||
    Boolean(searchParams.get("meta_error"));
  const showGoogleSetup =
    searchParams.get("googleSetup") === "1" ||
    searchParams.get("google_connected") === "1" ||
    Boolean(searchParams.get("google_error"));

  useEffect(() => {
    const metaConnected = searchParams.get("meta_connected") === "1";
    const metaError = searchParams.get("meta_error");
    if (!metaConnected && !metaError) return;
    if (searchParams.get("metaSetup") === "1") return;
    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const openMetaSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.set("metaSetup", "1");
    next.delete("googleSetup");
    next.delete("leadId");
    setSearchParams(next, { replace: false });
  };

  const openGoogleSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.set("googleSetup", "1");
    next.delete("metaSetup");
    next.delete("leadId");
    setSearchParams(next, { replace: false });
  };

  const closeMetaSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("metaSetup");
    setSearchParams(next, { replace: false });
  };

  const closeGoogleSetup = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("googleSetup");
    setSearchParams(next, { replace: false });
  };

  const handleAdNetworkSelect = (network: AdNetworkId) => {
    setShowAdNetworkPicker(false);
    if (network === "meta") openMetaSetup();
    if (network === "google") openGoogleSetup();
  };

  return (
    <div className="w-full min-w-0 bg-[#F7F8FC] p-2 sm:p-5" dir={dir}>
      {showMetaSetup ? (
        <MetaLeadAdsIntegration
          businessId={businessId}
          onBack={closeMetaSetup}
        />
      ) : showGoogleSetup ? (
        <GoogleAdsLeadIntegration
          businessId={businessId}
          onBack={closeGoogleSetup}
        />
      ) : (
        <>
          <CRMLeadsWorkspace
            businessId={businessId}
            mode={mode}
            onConnectAds={() => setShowAdNetworkPicker(true)}
          />
          <AdNetworkPickerModal
            open={showAdNetworkPicker}
            onClose={() => setShowAdNetworkPicker(false)}
            onSelect={handleAdNetworkSelect}
          />
        </>
      )}
    </div>
  );
}
