import React from "react";
import type { WantravelSeed } from "./wantravelData";
import {
  BookingSection,
  ProcessSection,
  Reveal,
  SafeImage,
} from "./shared";

export default function WantravelHowItWorksPage({
  data,
}: {
  data: WantravelSeed;
}) {
  return (
    <main className="wan-inner-page">
      <section className="wan-page-hero wan-page-hero-soft">
        <div className="wan-container wan-page-hero-grid">
          <Reveal>
            <div>
              <div className="wan-eyebrow-dark">איך זה עובד</div>
              <h1>תהליך פשוט, ברור ויוקרתי מהשיחה הראשונה עד החופשה</h1>
              <p>
                העמוד הזה מציג ללקוח איך השירות עובד, מוריד התנגדויות ומסביר
                למה כדאי להשאיר פרטים.
              </p>
            </div>
          </Reveal>

          <Reveal className="wan-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1100&q=90"
              alt="איך זה עובד"
            />
          </Reveal>
        </div>
      </section>

      <ProcessSection data={data} />

      <section className="wan-editorial-section">
        <div className="wan-container wan-editorial-grid">
          <Reveal className="wan-editorial-copy">
            <span>שירות אישי</span>
            <h2>כל לקוח מקבל מסלול שנבנה לפי הסגנון שלו.</h2>
            <p>
              לא בוחרים תבנית מוכנה. בונים חוויה לפי תקציב, יעד, אופי הטיול
              ורמת הליווי שהלקוח צריך.
            </p>
          </Reveal>

          <div className="wan-editorial-images">
            <Reveal className="wan-editorial-image wan-editorial-image-one">
              <SafeImage
                src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=90"
                alt="תכנון חופשה"
              />
            </Reveal>

            <Reveal
              className="wan-editorial-image wan-editorial-image-two"
              delay={180}
            >
              <SafeImage
                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=90"
                alt="טיול באיטליה"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <BookingSection data={data} />
    </main>
  );
}