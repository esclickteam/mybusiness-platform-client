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
  const clipId = useId().replace(/:/g, "");
  const hubGradientId = useId().replace(/:/g, "");
  const pointerHeight = 18;
  const pad = 10;
  const svgW = size + pad * 2;
  const svgH = size + pad * 2 + pointerHeight;
  const cx = svgW / 2;
  const cy = pad + pointerHeight + size / 2;
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
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="mx-auto block shrink-0 select-none"
      aria-hidden
    >
      <polygon
        points={`${cx - 9},${pad} ${cx + 9},${pad} ${cx},${pad + pointerHeight}`}
        fill="#1e293b"
      />

      <circle cx={cx} cy={cy} r={r + 5} fill="#fff" stroke="#e2e8f0" strokeWidth={2} />

      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id={hubGradientId}>
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transformBox: "view-box",
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
              >
                {sliceItem.label.length > 14
                  ? `${sliceItem.label.slice(0, 12)}…`
                  : sliceItem.label}
              </text>
            </g>
          ))}
        </g>
      </g>

      <circle cx={cx} cy={cy} r={24} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={15} fill={`url(#${hubGradientId})`} />
    </svg>
  );
}
