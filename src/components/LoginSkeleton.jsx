import React from "react";

export function LoginSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-8 text-center">
      {/* Spinner טעינה */}
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8" />

      {/* שלד מבני */}
      <div className="w-full max-w-md animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}
