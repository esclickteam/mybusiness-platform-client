import React from "react";

type Props = {
  src: string;
  title: string;
  priority?: boolean;
  isCenter?: boolean;
};

export default function TemplateBrowserMockup({
  src,
  title,
  priority = false,
  isCenter = false,
}: Props) {
  return (
    <div className={`wb-mockup-shell${isCenter ? " is-center" : ""}`}>
      <span className="wb-mockup-glow" aria-hidden="true" />
      <div className="wb-mockup">
        <div className="wb-mockup__chrome">
          <span className="wb-mockup__dot" />
          <span className="wb-mockup__dot" />
          <span className="wb-mockup__dot" />
          <span className="wb-mockup__url" />
        </div>
        <div className="wb-mockup__viewport">
          <img
            className="wb-mockup__img"
            src={src}
            alt={title}
            width={1600}
            height={1000}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
