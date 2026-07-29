import React from "react";
import "./appFrame.css";

export type AppFrameProps = {
  /** Path shown in the window bar, e.g. "CRM · טיפול נציג". */
  crumb: string;
  /** Short line under the frame explaining what the screen shows. */
  caption?: string;
  /** Module rail on the side of the window. */
  rail?: string[];
  /** Index of the rail item rendered as selected. */
  railActive?: number;
  children: React.ReactNode;
};

/**
 * Window chrome for the in-page product previews. The screens inside are
 * illustrative recreations of the dashboard, not live data.
 */
export default function AppFrame({
  crumb,
  caption,
  rail,
  railActive = 0,
  children,
}: AppFrameProps) {
  return (
    <figure className="pmk-frame">
      <div className="pmk-frame__bar">
        <span className="pmk-frame__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="pmk-frame__crumb">{crumb}</span>
        <span className="pmk-frame__live">
          <i aria-hidden="true" />
          תצוגה
        </span>
      </div>

      <div className="pmk-frame__body">
        {rail?.length ? (
          <nav className="pmk-rail" aria-hidden="true">
            {rail.map((item, index) => (
              <span
                key={item}
                className={`pmk-rail__item${
                  index === railActive ? " is-active" : ""
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
        ) : null}

        <div className="pmk-canvas">{children}</div>
      </div>

      {caption ? <figcaption className="pmk-frame__cap">{caption}</figcaption> : null}
    </figure>
  );
}
