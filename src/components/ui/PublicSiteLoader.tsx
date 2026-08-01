import React from "react";
import { createPortal } from "react-dom";

type PublicSiteLoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

/**
 * Neutral bootstrap UI for published customer sites.
 * Intentionally has no Bizuply logo / brand colors.
 */
export function PublicSiteLoader({
  fullScreen = true,
  label = "Loading",
}: PublicSiteLoaderProps) {
  const loader = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: fullScreen ? "100%" : "auto",
        minHeight: fullScreen ? "100vh" : 120,
        background: "#ffffff",
        color: "#64748b",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "2px solid #e2e8f0",
          borderTopColor: "#94a3b8",
          animation: "bizuply-public-site-spin 0.7s linear infinite",
        }}
      />
      <style>
        {`@keyframes bizuply-public-site-spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );

  if (!fullScreen) return loader;

  const screen = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#ffffff",
      }}
    >
      {loader}
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(screen, document.body);
  }

  return screen;
}

export default PublicSiteLoader;
