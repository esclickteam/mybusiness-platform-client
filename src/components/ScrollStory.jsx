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
            <div className="visual-card">
              <img
                src="/images/dashboard-preview-v3.png"
                alt="Business dashboard preview"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =============================
          Step 1 – Business Page
          IMAGE LEFT | TEXT RIGHT
      ============================== */}
      <div className="step step-left">
        <div className="step-inner step-with-visual">
          <div className="step-visual">
            <div className="visual-card">
              <img
                src="/images/business-page-v2.png"
                alt="Business page preview"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

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
          <div className="step-content">
            <span className="step-label">WORK TOGETHER</span>
            <h3>Collaborations</h3>
            <p>
              Work with partners and other businesses — messages, proposals and
              shared activity.
            </p>
          </div>

          <div className="step-visual">
            <div className="visual-card">
              <img
                src="/images/collaborations-v4.png"
                alt="Collaborations preview"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =============================
          Step 3 – CRM
          IMAGE LEFT | TEXT RIGHT
      ============================== */}
      <div className="step step-left">
        <div className="step-inner step-with-visual">
          <div className="step-visual">
            <div className="visual-card">
              <img
                src="/images/crm-preview-v2.png"
                alt="CRM preview"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="step-content">
            <span className="step-label">ORGANIZE</span>
            <h3>Smart CRM</h3>
            <p>
              Manage clients, track conversations, appointments and history —
              everything stays organized automatically.
            </p>
          </div>
        </div>
      </div>

      {/* =============================
          Step 4 – AI
          TEXT LEFT | IMAGE RIGHT
      ============================== */}
      <div className="step step-right">
        <div className="step-inner step-with-visual">
          <div className="step-content">
            <span className="step-label">GROW SMART</span>
            <h3>AI that works for you</h3>
            <p>
              Get smart recommendations, automated follow-ups and insights that
              help you decide what to do next — faster and better.
            </p>
          </div>

          <div className="step-visual">
            <div className="visual-card">
              <img
                src="/images/ai-preview.png"
                alt="AI assistant preview"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
