import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero">
      <h1>
        Run your business.
        <br />
        All in one place.
      </h1>

      <p>
        A professional business page, collaborations,
        CRM and AI — built to grow with you.
      </p>

      <div className="hero-actions">
        <Link to="/get-started" className="btn-primary">
          Get started free
        </Link>
        <Link to="/product" className="btn-ghost">
          Watch demo
        </Link>
      </div>
    </section>
  );
}
