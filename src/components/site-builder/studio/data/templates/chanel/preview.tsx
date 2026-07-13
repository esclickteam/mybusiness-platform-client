import React from "react";

import ChanelPages from "./pages";

export default function ChanelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="chanel-preview"
      className="relative h-screen min-h-screen w-full overflow-hidden bg-[#f5f0e8] text-[#1a1a1a]"
    >
      <div className="h-full w-full overflow-x-hidden overflow-y-auto">
        <ChanelPages initialPage="home" mode="preview" />
      </div>
    </div>
  );
}
