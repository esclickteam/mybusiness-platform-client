import React from "react";
import PodcastixPages from "./pages";

export default function PodcastixPreview() {
  return (
    <div dir="rtl" data-template-id="podcastix-preview" className="min-h-screen w-full overflow-x-hidden">
      <PodcastixPages initialPage="home" mode="preview" />
    </div>
  );
}
