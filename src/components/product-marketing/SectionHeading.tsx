import React from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  accent?: string;
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  accent,
  className,
}: Props) {
  return (
    <div
      className={`pm-heading-block${center ? " pm-heading-block--center" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      {eyebrow ? (
        <Reveal from="up" distance={16} duration={0.55}>
          <p
            className="pm-eyebrow"
            style={accent ? { color: accent } : undefined}
          >
            {eyebrow}
          </p>
        </Reveal>
      ) : null}

      <Reveal from="up" distance={26} blur delay={0.06}>
        <h2 className="pm-title">{title}</h2>
      </Reveal>

      {lead ? (
        <Reveal from="up" distance={20} delay={0.14}>
          <p className="pm-lead">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
