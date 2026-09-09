import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SavoryPages from "./pages";

export default function SavoryPreview() {
  return (
    <div
      dir={templateDir()}
      data-template-id="savory"
      className="min-h-screen w-full"
      style={{ background: "#12100E", overflowX: "hidden" }}
    >
      <SavoryPages initialPage="home" mode="preview" />
    </div>
  );
}
