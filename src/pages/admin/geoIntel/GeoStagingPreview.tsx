import React, { useEffect, useState } from "react";
import API, { setAuthToken } from "../../../api";
import AdminGeoIntel from "./AdminGeoIntel";

/**
 * תצוגת Staging מבודדת (VITE_GEO_STAGING=1).
 * ממשק עברי בלבד, ללא Header ציבורי / בורר שפה.
 */
export default function GeoStagingPreview() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    let cancelled = false;
    (async () => {
      try {
        const infoRes = await API.get("/geo-intel/staging-info");
        const tokenRes = await API.get("/geo-intel/staging-token");
        const token = tokenRes.data?.token;
        if (!token) throw new Error("אין טוקן Staging");
        localStorage.setItem("token", token);
        setAuthToken(token);
        if (!cancelled) {
          setInfo(infoRes.data);
          setReady(true);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.response?.data?.error || err.message || "כשל בטעינת Staging"
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div
        dir="rtl"
        lang="he"
        style={{ padding: 24, fontFamily: "Assistant, Heebo, sans-serif" }}
      >
        <h1>תצוגת GEO Staging</h1>
        <p style={{ color: "#be123c", fontWeight: 700 }}>{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div
        dir="rtl"
        lang="he"
        style={{ padding: 24, fontFamily: "Assistant, Heebo, sans-serif" }}
      >
        טוען GEO Staging…
      </div>
    );
  }

  return (
    <div dir="rtl" lang="he">
      <div
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "Assistant, Heebo, sans-serif",
        }}
      >
        סביבת Staging מבודדת · תשלום=
        {String(info?.paidApis)} · מפתח Gemini=
        {String(info?.geminiKeyPresent)} · מפתח OpenAI=
        {String(info?.openaiKeyPresent)} · DB={info?.mongoDb}
      </div>
      <AdminGeoIntel />
    </div>
  );
}
