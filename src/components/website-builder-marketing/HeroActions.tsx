import React from "react";
import { Link } from "react-router-dom";

type Props = {
  primaryTo?: string;
};

export default function HeroActions({ primaryTo = "/register" }: Props) {
  return (
    <div className="wb-hero__actions">
      <Link to={primaryTo} className="wb-hero__btn wb-hero__btn--primary">
        התחילו לבנות
      </Link>
      <a href="#wb-templates" className="wb-hero__btn wb-hero__btn--secondary">
        צפו בתבניות
      </a>
    </div>
  );
}
