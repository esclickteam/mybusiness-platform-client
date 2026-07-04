import React from "react";
import ChanelPages from "./pages";

export default function ChanelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="chanel"
      className="min-h-screen w-full bg-[#fff7f2] text-[#2b1b15]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <ChanelPages initialPage="home" mode="preview" />
    </div>
  );
}