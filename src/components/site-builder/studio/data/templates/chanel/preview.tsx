import React from "react";
import ChanelPages from "./pages";

export default function ChanelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="chanel"
      className="h-screen min-h-screen w-full bg-white text-[#2a1b16]"
      style={{ overflow: "hidden" }}
    >
      <ChanelPages initialPage="home" mode="preview" />
    </div>
  );
}
