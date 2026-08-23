import React, { lazy, Suspense } from "react";
import { isGuidedDemoActive } from "./sessionStore";

const Engine = lazy(() => import("./GuidedDemoEngine"));

export default function GuidedDemoHost() {
  if (typeof window === "undefined") return null;
  if (!isGuidedDemoActive()) return null;
  return (
    <Suspense fallback={null}>
      <Engine />
    </Suspense>
  );
}
