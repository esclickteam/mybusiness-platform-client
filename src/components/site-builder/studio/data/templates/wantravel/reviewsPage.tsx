import React from "react";
import type { WantravelSeed } from "./wantravelData";
import { BookingSection, Reveal, ReviewsSection, SafeImage } from "./shared";

export default function WantravelReviewsPage({
  data,
}: {
  data: WantravelSeed;
}) {
  return (
    <main className="wan-inner-page">
      <section className="wan-page-hero">
        <div className="wan-container wan-page-hero-grid">
          <Reveal>
            <div>
              <div className="wan-eyebrow-dark">המלצות</div>
              <h1>לקוחות מרגישים את ההבדל כשהכול מתוכנן נכון</h1>
              <p>
                עמוד המלצות יוקרתי שמחזק אמון, מציג חוויות אמיתיות ומעודד
                לקוחות חדשים להתחיל תכנון.
              </p>
            </div>
          </Reveal>

          <Reveal className="wan-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1100&q=90"
              alt="לקוחות ממליצים"
            />
          </Reveal>
        </div>
      </section>

      <ReviewsSection data={data} />

      <BookingSection data={data} />
    </main>
  );
}