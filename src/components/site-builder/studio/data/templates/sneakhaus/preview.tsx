import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import SneakhausPages from "./pages";

export default function SneakhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="sneakhaus" className="min-h-screen w-full overflow-x-hidden">
      <SneakhausPages initialPage="home" mode="preview" />
    </div>
  );
}
