import React from "react";

import { SiteMemberAuthProvider } from "../../../context/SiteMemberAuthContext";
import {
  readSiteAuthSettings,
  siteHasAuthPlugin,
} from "../../../api/siteMemberAuthApi";
import { resolvePublicSiteAuthPage } from "./PublicSiteAuthPages";
import PublicVisualSiteRenderer from "./PublicVisualSiteRenderer";

type PublicSiteWithAuthProps = {
  site: Record<string, any>;
  pathname?: string;
  disableAnalytics?: boolean;
};

export default function PublicSiteWithAuth({
  site,
  pathname = "/",
  disableAnalytics,
}: PublicSiteWithAuthProps) {
  const slug = String(site?.slug || "");
  const authEnabled = siteHasAuthPlugin(site);
  const settings = readSiteAuthSettings(site);
  const authPage = authEnabled
    ? resolvePublicSiteAuthPage(pathname, site, settings)
    : null;

  const page =
    authPage ||
    (
      <PublicVisualSiteRenderer
        site={site}
        pathname={pathname}
        disableAnalytics={disableAnalytics}
      />
    );

  if (!authEnabled) {
    return page;
  }

  return <SiteMemberAuthProvider slug={slug}>{page}</SiteMemberAuthProvider>;
}
