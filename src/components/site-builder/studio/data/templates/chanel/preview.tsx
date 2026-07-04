import React from "react";
import ChanelPages from "./pages";

export default function ChanelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="chanel"
      className="h-screen min-h-screen w-full bg-[#fff8f3] text-[#241711]"
      style={{ overflow: "hidden" }}
    >
      <ChanelPages initialPage="home" mode="preview" />
    </div>
  );
}
