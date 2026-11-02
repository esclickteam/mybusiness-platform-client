import React, { useEffect, useState } from "react";
import API, { setAuthToken } from "../../../api";
import AdminGeoIntel from "./AdminGeoIntel";

/**
 * Staging-only preview boot (VITE_GEO_STAGING=1).
 * Fetches harness token, authenticates API client, renders GEO UI
 * without production login / DNS / deploy.
 */
export default function GeoStagingPreview() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const infoRes = await API.get("/geo-intel/staging-info");
        const tokenRes = await API.get("/geo-intel/staging-token");
        const token = tokenRes.data?.token;
        if (!token) throw new Error("No staging token");
        localStorage.setItem("token", token);
        setAuthToken(token);
        if (!cancelled) {
          setInfo(infoRes.data);
          setReady(true);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.error || err.message || "Staging boot failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: 24, fontFamily: "Assistant, sans-serif" }}>
        <h1>GEO Staging Preview</h1>
        <p style={{ color: "#be123c", fontWeight: 700 }}>{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ padding: 24, fontFamily: "Assistant, sans-serif" }}>
        Loading GEO staging…
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: "8px 14px",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "Assistant, sans-serif",
        }}
      >
        STAGING HARNESS · paidApis={String(info?.paidApis)} · geminiKey=
        {String(info?.geminiKeyPresent)} · openaiKey=
        {String(info?.openaiKeyPresent)} · db={info?.mongoDb}
      </div>
      <AdminGeoIntel />
    </div>
  );
}
