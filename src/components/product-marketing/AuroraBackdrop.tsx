import React from "react";

type Props = {
  vivid?: boolean;
  mesh?: boolean;
  beam?: boolean;
  grain?: boolean;
  dark?: boolean;
};

/** Ambient layer stack (aurora blobs, dot mesh, light beam, film grain). */
export default function AuroraBackdrop({
  vivid = false,
  mesh = true,
  beam = true,
  grain = false,
  dark = false,
}: Props) {
  return (
    <>
      <div
        className={`pm-aurora${vivid ? " pm-aurora--vivid" : ""}`}
        aria-hidden="true"
      >
        <span className="pm-aurora__blob" />
        <span className="pm-aurora__blob" />
        <span className="pm-aurora__blob" />
      </div>
      {mesh ? (
        <div
          className={`pm-mesh${dark ? " pm-mesh--light" : ""}`}
          aria-hidden="true"
        />
      ) : null}
      {beam ? (
        <div
          className={`pm-beam${dark ? " pm-beam--dark" : ""}`}
          aria-hidden="true"
        />
      ) : null}
      {grain ? <div className="pm-grain" aria-hidden="true" /> : null}
    </>
  );
}
