import React from "react";
import AdionPages from "./pages";

export default function AdionPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="adion-preview"
      className="h-screen min-h-screen w-full overflow-y-auto overflow-x-hidden bg-[#fff8f0] text-[#301b12]"
    >
      <AdionPages initialPage="home" mode="preview" />
    </div>
  );
}