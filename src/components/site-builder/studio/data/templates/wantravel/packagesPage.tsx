import React from "react";
import type { WantravelSeed } from "./wantravelData";
import { BookingSection, PackagesGrid, Reveal, SafeImage } from "./shared";

export default function WantravelPackagesPage({
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
              <div className="wan-eyebrow-dark">חבילות נסיעה</div>
              <h1>חבילות מדויקות לכל סוג של חופשה</h1>
              <p>
                חבילות זוגיות, משפחתיות ואקזוטיות עם תכנון מלא, נראות יוקרתית
                וחוויית לקוח שמובילה להשארת פרטים.
              </p>
            </div>
          </Reveal>

          <Reveal className="wan-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1100&q=90"
              alt="חבילות נסיעה"
            />
          </Reveal>
        </div>
      </section>

      <section className="wan-section wan-packages-page-section">
        <div className="wan-container">
          <PackagesGrid data={data} />
        </div>
      </section>

      <BookingSection data={data} />
    </main>
  );
}