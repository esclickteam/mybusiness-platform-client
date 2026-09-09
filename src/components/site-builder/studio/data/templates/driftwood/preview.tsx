import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import DriftwoodPages from "./pages";
export default function DriftwoodPreview() {
  return (
    <div dir={templateDir()} data-template-id="driftwood" className="min-h-screen w-full" style={{ background: "#f0e8dc", color: "#3c2e22" }}>
      <DriftwoodPages initialPage="home" mode="preview" />
    </div>
  );
}
