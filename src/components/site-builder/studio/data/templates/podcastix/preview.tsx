import React from "react";
import { templateDir } from "../../../../../../i18n/templateDir";
import PodcastixPages from "./pages";

export default function PodcastixPreview() {
  return (
    <div dir={templateDir()} data-template-id="podcastix" className="min-h-screen w-full overflow-x-hidden">
      <PodcastixPages initialPage="home" mode="preview" />
    </div>
  );
}
