import React from "react";

/**
 * Isolate emails, URLs, phones, IDs and other inherently LTR values inside RTL UI.
 */
export default function LtrIsolate({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  return (
    <Tag dir="ltr" className={`ltr-isolate ${className}`.trim()}>
      {children}
    </Tag>
  );
}
