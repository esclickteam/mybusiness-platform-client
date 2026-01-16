export default function WhyBizuply() {
  return (
    <section className="why-bizuply">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h2>Why Bizuply</h2>
          <p>
            Everything your business needs — in one simple, powerful platform
          </p>
        </div>

        {/* Features */}
        <div className="features">
          {/* Feature 1 */}
          <div className="feature">
            <div className="icon">
              {/* One platform */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3V6M12 18V21M3 12H6M18 12H21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M7 7H11V11H7V7ZM13 7H17V11H13V7ZM7 13H11V17H7V13ZM13 13H17V17H13V13Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <h3>One platform instead of many tools</h3>
            <p>
              Manage clients, tasks, deals and automations in one place —
              no more switching between systems.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature">
            <div className="icon">
              {/* Daily work */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2L3 14H11L10 22L21 10H13V2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Built for real daily business work</h3>
            <p>
              Designed for real workflows, not theory.
              Everything is fast, practical and easy to use.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature">
            <div className="icon">
              {/* Growth */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 17L9 11L13 15L21 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 3V21H21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3>Designed to grow with you</h3>
            <p>
              Start simple and unlock advanced tools as your business grows —
              without switching platforms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
