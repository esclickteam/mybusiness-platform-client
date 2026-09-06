import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SteelworksPages from "./pages";

export default function SteelworksPreview() {
  return (
    <div dir={templateDir()} data-template-id="steelworks" className="min-h-screen w-full" style={{ background: "#1a1a1a", overflowX: "hidden" }}>
      <SteelworksPages initialPage="home" mode="preview" />
    </div>
  );
}
