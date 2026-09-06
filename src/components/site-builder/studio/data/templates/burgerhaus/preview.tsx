import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import BurgerhausPages from "./pages";
export default function BurgerhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="burgerhaus" className="min-h-screen w-full" style={{ background: "#111111", color: "#f5f5f5" }}>
      <BurgerhausPages initialPage="home" mode="preview" />
    </div>
  );
}
