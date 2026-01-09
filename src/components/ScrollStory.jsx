// ScrollStory.jsx
export default function ScrollStory() {
  return (
    <section className="scroll-story">
      {/* Step 1 – Business Page + Visual */}
      <div className="step step-left">
        <div className="step-inner step-with-visual">
          {/* TEXT */}
          <div className="step-content">
            <span className="step-label">PLATFORM</span>
            <h3>Your business page</h3>
            <p>
              A clean, professional page that represents your business and
              centralizes everything in one place.
            </p>
          </div>

          {/* VISUAL */}
          <div className="step-visual">
            <img
              className="step-visual-img"
              src="/images/hero-business-page.png"
              alt="Business page preview"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Step 2 – Collaborations */}
      <div className="step step-right">
        <div className="step-inner">
          <span className="step-label">WORK TOGETHER</span>
          <h3>Collaborations</h3>
          <p>
            Work with partners and other businesses — messages, proposals and
            shared activity.
          </p>
        </div>
      </div>

      {/* Step 3 – CRM & AI */}
      <div className="step step-left">
        <div className="step-inner">
          <span className="step-label">GROW SMART</span>
          <h3>CRM &amp; AI</h3>
          <p>
            Track clients, automate follow-ups and let AI guide your next move.
          </p>
        </div>
      </div>
    </section>
  );
}
