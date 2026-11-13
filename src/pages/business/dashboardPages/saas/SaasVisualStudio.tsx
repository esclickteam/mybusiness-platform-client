import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../../api";
import WebsiteStudioPage from "../../../../components/site-builder/studio/WebsiteStudioPage";

export default function SaasVisualStudio() {
  const { businessId = "", tenantId = "" } = useParams();
  const [siteId, setSiteId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    API.post(`/saas-owner/${tenantId}/studio`)
      .then((response) => {
        if (!alive) return;
        setSiteId(String(response.data?.siteId || ""));
      })
      .catch(() => {
        if (alive) setError("אין הרשאה לפתוח את עיצוב המערכת הזו");
      });
    return () => {
      alive = false;
    };
  }, [tenantId]);

  if (error) return <p className="p-6 text-sm font-bold text-rose-700">{error}</p>;
  if (!siteId) return <p className="p-6 text-sm">פותח את עורך האתר של העותק…</p>;

  return (
    <WebsiteStudioPage
      businessId={businessId}
      siteId={siteId}
      initialSlug="saas-copy"
    />
  );
}
