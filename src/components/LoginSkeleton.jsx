import React from "react";

export function LoginSkeleton({ title = "טוען התחברות...", logo = "/logo.svg" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8 animate-pulse text-center">
      {logo && (
        <img
          src={logo}
          alt="טוען לוגו"
          className="w-24 h-24 mb-6 opacity-60"
        />
      )}
      <div className="h-6 w-48 bg-gray-300 rounded mb-4" />
      <div className="w-full max-w-md space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  );
}
