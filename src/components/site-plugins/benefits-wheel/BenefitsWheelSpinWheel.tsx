import React, { useMemo } from "react";

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
  size = 280,
  spinning = false,
}: BenefitsWheelSpinWheelProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 8;
  const n = segments.length;
  const slice = 360 / n;

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
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div
        className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1"
        style={{
          width: 0,
          height: 0,
          borderLeft: "14px solid transparent",
          borderRight: "14px solid transparent",
          borderTop: "28px solid #1e293b",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 4.2s cubic-bezier(0.15, 0.85, 0.2, 1)"
            : "none",
        }}
      >
        <circle cx={cx} cy={cy} r={r + 6} fill="#fff" stroke="#e2e8f0" strokeWidth={4} />
        <g>
          {slices.map((sliceItem, i) => (
            <g key={i}>
              <path d={sliceItem.path} fill={sliceItem.color || "#7C3AED"} stroke="#fff" strokeWidth={2} />
              <text
                x={sliceItem.labelPos.x}
                y={sliceItem.labelPos.y}
                fill="#fff"
                fontSize={n > 8 ? 9 : 11}
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${sliceItem.mid}, ${sliceItem.labelPos.x}, ${sliceItem.labelPos.y})`}
                style={{ pointerEvents: "none", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
              >
                {sliceItem.label.length > 14
                  ? `${sliceItem.label.slice(0, 12)}…`
                  : sliceItem.label}
              </text>
            </g>
          ))}
        </g>
        <circle cx={cx} cy={cy} r={28} fill="#fff" stroke="#cbd5e1" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={18} fill="url(#wheelHub)" />
        <defs>
          <radialGradient id="wheelHub">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
