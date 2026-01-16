import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="final-cta">
      <div className="final-cta-inner">
        <h2 className="final-cta-title">
          Start with clarity.
          <br />
          Grow without chaos.
        </h2>

        <p className="final-cta-subtitle">
          Bizuply centralizes your business page, CRM, collaborations, and AI —
          so you can run everything in one place.
        </p>

        <ul className="final-cta-points" aria-label="Key benefits">
          <li>
            <span className="final-cta-dot" aria-hidden="true" />
            <span>
              <strong>Business Page + CRM</strong> — capture leads and follow up
              fast
            </span>
          </li>
          <li>
            <span className="final-cta-dot" aria-hidden="true" />
            <span>
              <strong>Collaborations</strong> — manage partners, proposals, and
              deals
            </span>
          </li>
          <li>
            <span className="final-cta-dot" aria-hidden="true" />
            <span>
              <strong>AI assistant</strong> — get smart next steps and
              priorities
            </span>
          </li>
        </ul>

        <div className="final-cta-actions">
          <Link to="/get-started" className="btn-primary btn-lg">
            Get started free
          </Link>

          <Link to="/pricing" className="btn-ghost btn-lg final-cta-secondary">
            See pricing
          </Link>
        </div>

        <p className="final-cta-note">No credit card required.</p>
      </div>
    </section>
  );
}
