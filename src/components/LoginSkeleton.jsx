import React from "react";

export function LoginSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto mt-32 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/2" />
      <div className="h-10 bg-gray-300 rounded" />
      <div className="h-10 bg-gray-300 rounded" />
      <div className="h-10 bg-gray-400 rounded w-1/2" />
    </div>
  );
}
