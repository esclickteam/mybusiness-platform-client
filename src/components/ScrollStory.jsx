// ScrollStory.jsx
export default function ScrollStory() {
  return (
    <section className="scroll-story">
      {/* =============================
          INTRO – DASHBOARD OVERVIEW
      ============================== */}
      <div className="step step-center">
        <div className="step-inner">
          <div className="step-content step-content-center">
            <span className="step-label">OVERVIEW</span>
            <h3>Everything you need. In one dashboard.</h3>
            <p>
              See your business performance at a glance — activity, reviews,
              appointments and insights, all connected in one place.
            </p>
          </div>

          <div className="step-visual">
            <img
              src="/images/dashboard-preview-v3.png"
              alt="Business dashboard preview"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* =============================
          Step 1 – Business Page
          IMAGE LEFT | TEXT RIGHT
      ============================== */}
      <div className="step step-left">
        <div className="step-inner step-with-visual">
          {/* IMAGE */}
          <div className="step-visual">
            <img
              src="/images/business-page-v2.png"
              alt="Business page preview"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* TEXT */}
          <div className="step-content">
            <span className="step-label">PLATFORM</span>
            <h3>Your business page</h3>
            <p>
              A clean, professional page that represents your business and
              centralizes everything in one place.
            </p>
          </div>
        </div>
      </div>

      {/* =============================
          Step 2 – Collaborations
          TEXT LEFT | IMAGE RIGHT
      ============================== */}
      <div className="step step-right">
        <div className="step-inner step-with-visual">
          {/* TEXT */}
          <div className="step-content">
            <span className="step-label">WORK TOGETHER</span>
            <h3>Collaborations</h3>
            <p>
              Work with partners and other businesses — messages, proposals and
              shared activity.
            </p>
          </div>

          {/* IMAGE */}
          <div className="step-visual">
            <img
              src="/images/collaborations-v2.png"
              alt="Collaborations preview"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* =============================
          Step 3 – CRM & AI
          IMAGE LEFT | TEXT RIGHT
      ============================== */}
      <div className="step step-left">
        <div className="step-inner step-with-visual">
          {/* IMAGE */}
          <div className="step-visual">
            <img
              src="/images/crm-ai.png"
              alt="CRM and AI preview"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* TEXT */}
          <div className="step-content">
            <span className="step-label">GROW SMART</span>
            <h3>CRM &amp; AI</h3>
            <p>
              Track clients, automate follow-ups and let AI guide your next move.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
