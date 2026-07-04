import React from "react";
import ChanelPages from "./pages";

export default function ChanelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="chanel-preview"
      className="h-screen min-h-screen w-full bg-[#fff9f5] text-[#2b1b15]"
      style={{
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ChanelPages initialPage="home" mode="preview" />
    </div>
  );
}