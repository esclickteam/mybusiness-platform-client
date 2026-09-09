import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import ReelhausPages from "./pages";

export default function ReelhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="reelhaus" className="min-h-screen w-full overflow-x-hidden">
      <ReelhausPages initialPage="home" mode="preview" />
    </div>
  );
}
