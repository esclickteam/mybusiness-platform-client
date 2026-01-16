import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="final-cta-compact">
      <div className="final-cta-compact-inner">
        <div className="final-cta-brand">bizuply</div>

        <h2 className="final-cta-headline">Run your business in one place.</h2>

        <Link to="/register" className="btn-primary btn-lg">
          Get started free
        </Link>

        <p className="final-cta-note">No credit card required.</p>
      </div>
    </section>
  );
}
