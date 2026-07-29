import React from "react";
import { CrmScreenById } from "./CrmShowcaseScreens";

type Props = {
  screenId: string;
  title: string;
  accent: string;
  accentSoft: string;
  isCenter?: boolean;
};

export default function CrmBrowserMockup({
  screenId,
  title,
  accent,
  accentSoft,
  isCenter = false,
}: Props) {
  return (
    <div
      className={`crm-mockup-shell${isCenter ? " is-center" : ""}`}
      style={
        {
          "--crm-glow": accent,
          "--crm-glow-soft": accentSoft,
        } as React.CSSProperties
      }
    >
      <span className="crm-mockup-glow" aria-hidden="true" />
      <div className="crm-mockup">
        <div className="crm-mockup__chrome">
          <span className="crm-mockup__dot" />
          <span className="crm-mockup__dot" />
          <span className="crm-mockup__dot" />
          <span className="crm-mockup__url">{title}</span>
        </div>
        <div className="crm-mockup__viewport">
          <CrmScreenById id={screenId} />
        </div>
      </div>
    </div>
  );
}
