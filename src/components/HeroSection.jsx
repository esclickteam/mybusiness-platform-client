import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero">
      <h1>
        Run your business.
        <br />
        <span className="hero-accent">All in one place.</span>
      </h1>

      <p>
        A professional business page, collaborations,
        CRM and AI — built to grow with you.
      </p>

      <div className="hero-actions">
        <Link to="/register" className="btn-primary">
          Get started free
        </Link>
        <Link to="/how-it-works" className="btn-ghost">
          How it works
        </Link>
      </div>
    </section>
  );
}
