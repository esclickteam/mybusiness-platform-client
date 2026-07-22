import React from "react";
import { createPortal } from "react-dom";
import logo from "../../images/logo_final.svg";
import "./BizuplyLoader.css";

export type BizuplyLoaderSize = "xs" | "sm" | "md" | "lg" | "xl";

export type BizuplyLoaderProps = {
  size?: BizuplyLoaderSize;
  fullScreen?: boolean;
  overlay?: boolean;
  compact?: boolean;
  label?: string;
  className?: string;
};

const LOGO_SIZE_CLASS: Record<BizuplyLoaderSize, string> = {
  xs: "bizuply-loader__logo-base--xs",
  sm: "bizuply-loader__logo-base--sm",
  md: "bizuply-loader__logo-base--md",
  lg: "bizuply-loader__logo-base--lg",
  xl: "bizuply-loader__logo-base--xl",
};

export function BizuplyLoader({
  size = "xl",
  fullScreen = false,
  overlay = false,
  compact = false,
  label,
  className = "",
}: BizuplyLoaderProps) {
  const logoMaskStyle = {
    "--bizuply-logo-url": `url(${logo})`,
  } as React.CSSProperties;

  const loader = (
    <div
      className={`bizuply-loader ${fullScreen ? "bizuply-loader--hero" : ""} ${fullScreen || compact ? "" : "bizuply-loader--inline"} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label || "Loading"}
    >
      <div className="bizuply-loader__logo-stage" style={logoMaskStyle}>
        <img
          src={logo}
          alt="Bizuply"
          className={`bizuply-loader__logo-base ${LOGO_SIZE_CLASS[size]}`}
          draggable={false}
        />
        <div className="bizuply-loader__logo-shine" aria-hidden="true" />
      </div>

      {label ? <p className="bizuply-loader__label">{label}</p> : null}
    </div>
  );

  if (fullScreen) {
    const screen = (
      <div
        className={`bizuply-loader-screen ${overlay ? "bizuply-loader-screen--overlay" : ""}`.trim()}
      >
        {loader}
      </div>
    );

    if (typeof document !== "undefined") {
      return createPortal(screen, document.body);
    }

    return screen;
  }

  return loader;
}

export function BizuplyLoadingState({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[45vh] w-full items-center justify-center p-6 ${className}`.trim()}
    >
      <BizuplyLoader size="xl" label={label} />
    </div>
  );
}

export default BizuplyLoader;
