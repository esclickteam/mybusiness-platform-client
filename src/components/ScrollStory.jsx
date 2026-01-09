export default function ScrollStory() {
  return (
    <section className="scroll-story">
      {/* Step 1 */}
      <div className="step step-left">
        <div className="step-inner">
          <span className="step-label">PLATFORM</span>
          <h3>Your business page</h3>
          <p>
            A clean, professional page that represents your business
            and centralizes everything in one place.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="step step-right">
        <div className="step-inner">
          <span className="step-label">WORK TOGETHER</span>
          <h3>Collaborations</h3>
          <p>
            Work with partners and other businesses —
            messages, proposals and shared activity.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="step step-left">
        <div className="step-inner">
          <span className="step-label">GROW SMART</span>
          <h3>CRM &amp; AI</h3>
          <p>
            Track clients, automate follow-ups
            and let AI guide your next move.
          </p>
        </div>
      </div>
    </section>
  );
}
