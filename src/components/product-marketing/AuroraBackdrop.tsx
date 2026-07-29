import React from "react";

type Props = {
  mesh?: boolean;
};

/** Soft ambient layer (aurora blobs plus an optional dot mesh). */
export default function AuroraBackdrop({ mesh = true }: Props) {
  return (
    <>
      <div className="pm-aurora" aria-hidden="true">
        <span className="pm-aurora__blob" />
        <span className="pm-aurora__blob" />
        <span className="pm-aurora__blob" />
      </div>
      {mesh ? <div className="pm-mesh" aria-hidden="true" /> : null}
    </>
  );
}
