import React from "react";
import ChanelPages from "./pages";

export default function ChanelPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="chanel-preview"
      className="h-screen min-h-screen w-full bg-[#fff9f5] text-[#2b1b15]"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          minHeight: "100%",
          overflow: "hidden",
        }}
      >
        <ChanelPages initialPage="home" mode="preview" />
      </div>
    </div>
  );
}