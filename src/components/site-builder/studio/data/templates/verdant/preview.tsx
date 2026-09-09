import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import VerdantPages from "./pages";

export default function VerdantPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="verdant"
      className="min-h-screen w-full"
      style={{ background: "#0e1210", overflowX: "hidden" }}
    >
      <VerdantPages initialPage="home" mode="preview" />
    </div>
  );
}
