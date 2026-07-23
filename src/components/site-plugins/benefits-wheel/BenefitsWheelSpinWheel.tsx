import React, { useId, useMemo } from "react";

import type { BenefitsWheelSegment } from "./benefitsWheelUtils";

type BenefitsWheelSpinWheelProps = {
  segments: BenefitsWheelSegment[];
  rotation: number;
  size?: number;
  spinning?: boolean;
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

export default function BenefitsWheelSpinWheel({
  segments,
  rotation,
  size = 240,
  spinning = false,
}: BenefitsWheelSpinWheelProps) {
  const hubGradientId = useId().replace(/:/g, "");
  const pad = 16;
  const pointerHeight = 22;
  const viewSize = size + pad * 2;
  const cx = viewSize / 2;
  const cy = viewSize / 2;
  const r = size / 2 - 10;
  const n = segments.length;
  const slice = 360 / n;
  const boxHeight = viewSize + pointerHeight;

  const slices = useMemo(() => {
    return segments.map((seg, i) => {
      const start = i * slice;
      const end = (i + 1) * slice;
      const mid = start + slice / 2;
      const labelPos = polarToCartesian(cx, cy, r * 0.62, mid);
      return {
        ...seg,
        path: describeArc(cx, cy, r, start, end),
        mid,
        labelPos,
      };
    });
  }, [segments, cx, cy, r, slice, n]);

  return (
    <div
      className="relative mx-auto shrink-0 select-none"
      style={{ width: viewSize, height: boxHeight }}
    >
      <div
        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
        style={{
          top: 0,
          width: 0,
          height: 0,
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          borderTop: `${pointerHeight}px solid #1e293b`,
        }}
      />

      <svg
        width={viewSize}
        height={viewSize}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        className="absolute left-0 overflow-visible"
        style={{ top: pointerHeight }}
        overflow="visible"
      >
        <circle cx={cx} cy={cy} r={r + 6} fill="#fff" stroke="#e2e8f0" strokeWidth={3} />
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: spinning
              ? "transform 4.2s cubic-bezier(0.15, 0.85, 0.2, 1)"
              : "none",
          }}
        >
          {slices.map((sliceItem, i) => (
            <g key={i}>
              <path
                d={sliceItem.path}
                fill={sliceItem.color || "#7C3AED"}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={sliceItem.labelPos.x}
                y={sliceItem.labelPos.y}
                fill="#fff"
                fontSize={n > 8 ? 9 : 11}
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${sliceItem.mid}, ${sliceItem.labelPos.x}, ${sliceItem.labelPos.y})`}
                style={{ pointerEvents: "none" }}
              >
                {sliceItem.label.length > 14
                  ? `${sliceItem.label.slice(0, 12)}…`
                  : sliceItem.label}
              </text>
            </g>
          ))}
        </g>
        <circle cx={cx} cy={cy} r={26} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={16} fill={`url(#${hubGradientId})`} />
        <defs>
          <radialGradient id={hubGradientId}>
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
