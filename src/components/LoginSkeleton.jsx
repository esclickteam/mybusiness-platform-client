import React from "react";

export function LoginSkeleton() {
  return (
    <div className="login-skeleton">
      <div className="skeleton-title" />
      <div className="skeleton-input" />
      <div className="skeleton-input" />
      <div className="skeleton-button" />
      <div className="skeleton-extra-options">
        <div className="skeleton-link" />
        <div className="skeleton-button-small" />
      </div>
    </div>
  );
}
