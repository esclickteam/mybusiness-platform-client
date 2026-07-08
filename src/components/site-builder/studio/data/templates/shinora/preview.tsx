import React from "react";
import ShinoraPages from "./pages";
import { shinoraDefaultData } from "./defaultData";

export default function ShinoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="shinora-preview"
      className="min-h-screen w-full bg-[#fff8f2] text-[#241612]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <ShinoraPages
        data={shinoraDefaultData}
        initialPage="home"
        mode="preview"
      />
    </div>
  );
}