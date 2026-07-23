import React from "react";

import SiteAuthLoginWidget from "../../site-plugins/site-auth/SiteAuthLoginWidget";
import {
  mergeSiteAuthSettings,
  shouldShowFloatingAuthButton,
} from "../../site-plugins/site-auth/siteAuthUtils";
import { siteHasAuthPlugin } from "../../../api/siteMemberAuthApi";

type PublicSiteAuthBarProps = {
  site: Record<string, any>;
};

export default function PublicSiteAuthBar({ site }: PublicSiteAuthBarProps) {
  if (!siteHasAuthPlugin(site)) return null;

  const settings = mergeSiteAuthSettings(site?.pluginSettings?.["site-auth"]);
  if (!shouldShowFloatingAuthButton(settings)) return null;

  return <SiteAuthLoginWidget site={site} settings={settings} variant="floating" mode="live" />;
}
