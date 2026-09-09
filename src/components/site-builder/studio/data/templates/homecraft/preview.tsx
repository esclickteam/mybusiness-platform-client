import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import HomecraftPages from "./pages";

export default function HomecraftPreview() {
  return (
    <div dir={templateDir()} data-template-id="homecraft" className="min-h-screen w-full overflow-x-hidden">
      <HomecraftPages initialPage="home" mode="preview" />
    </div>
  );
}
