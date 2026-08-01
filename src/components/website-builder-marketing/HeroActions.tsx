import React from "react";
import { Link } from "react-router-dom";

type Props = {
  primaryTo?: string;
};

export default function HeroActions({ primaryTo = "/pricing" }: Props) {
  return (
    <div className="wb-hero__actions">
      <Link to={primaryTo} className="wb-hero__btn wb-hero__btn--primary">
        הירשמו עכשיו
      </Link>
    </div>
  );
}
