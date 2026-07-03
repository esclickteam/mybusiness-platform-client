import React from "react";

import AelinePages from "./pages";

export default function AelineThumbnail() {
  return (
    <div className="h-full w-full overflow-hidden rounded-[26px] bg-[#f4f1e9]">
      <div
        className="origin-top-left scale-[0.22]"
        style={{
          width: 1440,
          height: 1200,
        }}
      >
        <AelinePages />
      </div>
    </div>
  );
}