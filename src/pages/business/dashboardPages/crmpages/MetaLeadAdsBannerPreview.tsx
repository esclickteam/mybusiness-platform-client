import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import MetaLeadAdsIntegration from "./MetaLeadAdsIntegration";

const page = {
  pageId: "822661257589077",
  pageName: "Evently360",
};

const form = {
  formId: "1121189987030582",
  formName: "טופס לידים",
};

export default function MetaLeadAdsBannerPreview() {
  const { i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage("he");
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
  }, [i18n]);

  return (
    <main>
      <MetaLeadAdsIntegration
        destination="business"
        previewStatus={{
          success: true,
          connectedPage: page,
          pages: [{ id: page.pageId, name: page.pageName }],
          forms: [{ id: form.formId, name: form.formName }],
          selectedForm: form,
          selectedForms: [form],
          metaAccountConnected: true,
          connectedPageId: page.pageId,
          selectedLeadFormId: form.formId,
          connectionHealthy: false,
          reconnectRequired: true,
          recoveryPendingCount: 5,
          intake: {
            failedCount: 5,
            metaConnected: true,
            pageName: page.pageName,
            leadCount: 109,
          },
        }}
      />
      <MetaLeadAdsIntegration
        destination="business"
        previewStatus={{
          success: true,
          connectedPage: page,
          pages: [{ id: page.pageId, name: page.pageName }],
          forms: [{ id: form.formId, name: form.formName }],
          selectedForm: form,
          selectedForms: [form],
          metaAccountConnected: true,
          connectedPageId: page.pageId,
          selectedLeadFormId: form.formId,
          connectionHealthy: true,
          reconnectRequired: false,
          recoveryPendingCount: 3,
          intake: {
            failedCount: 3,
            metaConnected: true,
            pageName: page.pageName,
            leadCount: 109,
            permissions: { ok: true, missing: [] },
            webhook: { status: "subscribed" },
          },
        }}
      />
    </main>
  );
}
