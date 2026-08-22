import React from "react";
import { isGuidedDemoActive } from "./sessionStore";

type Props = {
  target: string;
  children: React.ReactNode;
  className?: string;
};

export default function GuidedDemoSandboxButton({
  target,
  children,
  className,
}: Props) {
  if (!isGuidedDemoActive()) return null;
  return (
    <button
      type="button"
      data-demo-target={target}
      className={
        className ||
        "inline-flex items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black text-violet-800 shadow-sm"
      }
    >
      {children}
    </button>
  );
}
