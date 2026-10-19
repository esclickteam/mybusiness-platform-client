import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_AD_ACCOUNT_TIMEZONE } from "./metaAdsCalendar";

type TimeZoneValue = {
  timeZone: string;
  setTimeZone: (value: string) => void;
};

export const MetaAdsTimeZoneContext = createContext<TimeZoneValue>({
  timeZone: DEFAULT_AD_ACCOUNT_TIMEZONE,
  setTimeZone: () => undefined,
});

export function MetaAdsTimeZoneProvider({ children }: { children: React.ReactNode }) {
  const [timeZone, setStored] = useState(DEFAULT_AD_ACCOUNT_TIMEZONE);
  const value = useMemo<TimeZoneValue>(
    () => ({
      timeZone,
      setTimeZone: (next: string) => {
        const zone = String(next || "").trim();
        if (zone) setStored(zone);
      },
    }),
    [timeZone]
  );
  return <MetaAdsTimeZoneContext.Provider value={value}>{children}</MetaAdsTimeZoneContext.Provider>;
}

export function useMetaAdsTimeZone() {
  return useContext(MetaAdsTimeZoneContext);
}
