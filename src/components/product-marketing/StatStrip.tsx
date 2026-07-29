import React from "react";
import CountUp from "./CountUp";
import { Stagger, StaggerItem } from "./Reveal";

export type MarketingStat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
};

type Props = {
  stats: MarketingStat[];
  dark?: boolean;
  className?: string;
};

export default function StatStrip({ stats, dark = false, className }: Props) {
  return (
    <Stagger
      className={`pm-stats${className ? ` ${className}` : ""}`}
      gap={0.09}
      amount={0.4}
    >
      {stats.map((stat) => (
        <StaggerItem
          key={stat.label}
          as="div"
          className={`pm-stat${dark ? " pm-stat--dark" : ""}`}
        >
          <span className="pm-stat__value">
            <CountUp
              to={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              decimals={stat.decimals}
            />
          </span>
          <span className="pm-stat__label">{stat.label}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
