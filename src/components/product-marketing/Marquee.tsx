import React from "react";

type Props = {
  children: React.ReactNode;
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Seamless horizontal ticker.
 * The track is duplicated so the -100% translate loops without a visible seam.
 */
export default function Marquee({
  children,
  duration = 38,
  reverse = false,
  className,
}: Props) {
  return (
    <div
      className={`pm-marquee${className ? ` ${className}` : ""}`}
      data-direction={reverse ? "reverse" : "forward"}
      style={
        { "--pm-marquee-duration": `${duration}s` } as React.CSSProperties
      }
    >
      <div className="pm-marquee__track">{children}</div>
      <div className="pm-marquee__track" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
