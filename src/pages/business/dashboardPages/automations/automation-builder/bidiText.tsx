import React from "react";

/**
 * Isolate Latin / digit runs so mixed Hebrew+English labels keep intended order
 * under RTL (e.g. "ליד חדש ב־CRM", "API", "WhatsApp", "Webhook", "Stripe").
 * Uses <bdi dir="ltr"> — no product-specific hardcoding.
 */
const LTR_RUN =
  /([A-Za-z][A-Za-z0-9+.#/_@%-]*(?:\s+[A-Za-z][A-Za-z0-9+.#/_@%-]*)*)/g;

export function MixedBidiText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const value = String(text || "");
  if (!value) return null;

  const parts = value.split(LTR_RUN);
  return (
    <Tag className={className} dir="auto">
      {parts.map((part, index) => {
        if (!part) return null;
        if (/^[A-Za-z]/.test(part)) {
          return (
            <bdi key={`ltr-${index}`} dir="ltr">
              {part}
            </bdi>
          );
        }
        return <React.Fragment key={`run-${index}`}>{part}</React.Fragment>;
      })}
    </Tag>
  );
}