import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import WebsiteBuilderHero from "../../components/website-builder-marketing/WebsiteBuilderHero";

export default function WebsiteProductPage() {
  const { t } = useTranslation();

  return (
    <div dir="rtl" className="bg-[#f7f8fc]">
      <Helmet>
        <title>
          {t("productPages.website.seoTitle", {
            defaultValue: "בניית אתרים מקצועיים | Bizuply",
          })}
        </title>
        <meta
          name="description"
          content={t("productPages.website.seoDescription", {
            defaultValue:
              "צרו אתר, חנות או מערכת תורים מקצועית שמחוברת ללידים, ל־CRM ולאוטומציות של Bizuply.",
          })}
        />
        <link rel="canonical" href="https://bizuply.com/website-builder" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="בניית אתרים עם Bizuply" />
        <meta
          property="og:description"
          content="בונים אתר שלא רק נראה טוב — אלא עובד בשביל העסק."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BizUply" />
        <link rel="preload" as="image" href="/Adiondesk.png" />
      </Helmet>

      <WebsiteBuilderHero />
    </div>
  );
}
