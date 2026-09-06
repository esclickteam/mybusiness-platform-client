import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import TrailhausPages from "./pages";

export default function TrailhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="trailhaus" className="min-h-screen w-full overflow-x-hidden">
      <TrailhausPages initialPage="home" mode="preview" />
    </div>
  );
}
