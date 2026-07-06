import React from "react";
import AdionPages from "./pages";

export default function AdionPreview() {
  return (
    <div
      dir="ltr"
      data-template-id="adion-preview"
      className="h-screen min-h-screen w-full overflow-hidden bg-[#10100e] text-[#f6efe3]"
    >
      <AdionPages initialPage="home" mode="preview" />
    </div>
  );
}