import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="final-cta">
      <h2>
        Start with clarity.
        <br />
        Grow without chaos.
      </h2>

      <Link to="/get-started" className="btn-primary btn-lg">
        Get started free
      </Link>
    </section>
  );
}
