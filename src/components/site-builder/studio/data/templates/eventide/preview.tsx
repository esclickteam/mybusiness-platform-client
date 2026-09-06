import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import EventidePages from "./pages";

export default function EventidePreview() {
  return (
    <div dir={templateDir()} data-template-id="eventide" className="min-h-screen w-full overflow-x-hidden">
      <EventidePages initialPage="home" mode="preview" />
    </div>
  );
}
