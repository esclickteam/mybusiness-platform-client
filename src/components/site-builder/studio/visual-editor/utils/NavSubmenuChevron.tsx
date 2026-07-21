import React from "react";

/** Thin down-V chevron matching common SaaS header menus (HubSpot-style). */
export function NavSubmenuChevron() {
  return (
    <span data-bizuply-nav-chevron="true" aria-hidden="true">
      <svg viewBox="0 0 12 8" aria-hidden="true" focusable="false">
        <path
          d="M1.5 1.75 L6 6.25 L10.5 1.75"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
