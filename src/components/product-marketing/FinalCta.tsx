import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  text: string;
  primaryLabel?: string;
  primaryTo?: string;
  /** @deprecated Prefer a single CTA — secondary is optional */
  secondaryLabel?: string;
  secondaryTo?: string;
};

export default function FinalCta({
  eyebrow,
  title,
  text,
  primaryLabel = "לצפייה בחבילות",
  primaryTo = "/pricing",
  secondaryLabel,
  secondaryTo = "/contact",
}: Props) {
  return (
    <Reveal from="scale" duration={0.9} amount={0.2}>
      <section className="pm-final">
        <span className="pm-final__glow" aria-hidden="true" />
        <div className="pm-final__inner">
          <p className="pm-eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2>{title}</h2>
          <p>{text}</p>

          <div className="pm-cta-row">
            <Link to={primaryTo} className="pm-cta pm-cta--light">
              {primaryLabel}
              <ArrowLeft size={17} aria-hidden="true" />
            </Link>
            {secondaryLabel ? (
              <Link to={secondaryTo} className="pm-cta pm-cta--outline-light">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
