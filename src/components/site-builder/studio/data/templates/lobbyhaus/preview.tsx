import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import LobbyhausPages from "./pages";

export default function LobbyhausPreview() {
  return (
    <div dir={templateDir()} data-template-id="lobbyhaus" className="min-h-screen w-full overflow-x-hidden">
      <LobbyhausPages initialPage="home" mode="preview" />
    </div>
  );
}
