/** Decorative partner-portal illustration. Not live account data. */

type VisualCopy = {
  caption: string;
  portal: string;
  clients: string;
  commissions: string;
  sampleClient: string;
  sampleStatus: string;
  sampleCommission: string;
  sampleNote: string;
};

export default function PartnerPortalVisual({ copy }: { copy: VisualCopy }) {
  return (
    <figure className="ip-portal" aria-label={copy.caption}>
      <div className="ip-portal-shell">
        <div className="ip-portal-top">
          <span className="ip-portal-dot" aria-hidden="true" />
          <span className="ip-portal-dot" aria-hidden="true" />
          <span className="ip-portal-dot" aria-hidden="true" />
          <strong>{copy.portal}</strong>
        </div>
        <div className="ip-portal-body">
          <article className="ip-portal-panel">
            <h3>{copy.clients}</h3>
            <ul>
              <li>
                <span>{copy.sampleClient}</span>
                <em>{copy.sampleStatus}</em>
              </li>
              <li>
                <span>Acme Retail</span>
                <em>Active</em>
              </li>
              <li>
                <span>BrightPath</span>
                <em>Pending</em>
              </li>
            </ul>
          </article>
          <article className="ip-portal-panel ip-portal-panel-accent">
            <h3>{copy.commissions}</h3>
            <p className="ip-portal-metric">{copy.sampleCommission}</p>
            <p className="ip-portal-note">{copy.sampleNote}</p>
          </article>
        </div>
      </div>
      <figcaption>{copy.caption}</figcaption>
    </figure>
  );
}
