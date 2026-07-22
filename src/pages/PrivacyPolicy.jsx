import React from "react";
import { Helmet } from "react-helmet-async";

function PrivacyPolicy() {
  const sectionBase =
    "scroll-mt-28 rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8";

  const h2Base =
    "mb-5 text-2xl font-black tracking-[-0.03em] text-slate-800 sm:text-3xl";

  const h3Base =
    "mb-3 mt-7 text-xl font-black tracking-[-0.02em] text-slate-900";

  const pBase = "mb-4 text-base font-medium leading-8 text-slate-600";

  const ulBase =
    "mb-5 ml-5 list-disc space-y-2 text-base font-medium leading-8 text-slate-600";

  const sections = [
    "Introduction",
    "Scope and Application",
    "Definitions",
    "Data We Collect",
    "How We Use Your Data",
    "Data Sharing",
    "Cookies",
    "Data Retention",
    "User Rights",
    "Refunds and Payments",
    "Limitation of Liability",
    "Data Location",
    "Policy Updates",
    "Legal Compliance",
    "Legal Disclaimer",
    "Governing Law",
    "Contact and DPO",
    "Final Clause",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] text-slate-800">
      <Helmet>
        <title>Privacy Policy - BizUply</title>
        <meta
          name="description"
          content="Read the BizUply Privacy Policy, including how we collect, use, store, protect, and share user and business data."
        />
        <link rel="canonical" href="https://bizuply.com/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none absolute left-[-12%] top-[-10%] h-[520px] w-[520px] rounded-full bg-amber-200/55 blur-3xl" />
      <div className="pointer-events-none absolute right-[-12%] top-[16%] h-[560px] w-[560px] rounded-full bg-emerald-100/75 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] left-[24%] h-[560px] w-[560px] rounded-full bg-white/85 blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pb-10 pt-20 text-center sm:px-8 lg:px-10 lg:pt-24">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/70 px-4 py-2 text-sm font-black text-amber-800 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Privacy Center
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[1.03] tracking-[-0.05em] text-slate-800 sm:text-6xl lg:text-7xl">
          Privacy Policy
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-600 sm:text-xl">
          This Privacy Policy explains how BizUply collects, stores, uses, and
          protects personal and business information across the platform.
        </p>

        <div className="mx-auto mt-8 inline-flex rounded-2xl border border-white/80 bg-white/70 px-5 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
          Last Updated: October 14, 2025
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.34fr_0.66fr] lg:px-10">
        {/* Sidebar */}
        <aside className="h-fit rounded-[2.5rem] border border-white/80 bg-white/70 p-6 shadow-xl shadow-slate-900/5 backdrop-blur lg:sticky lg:top-24">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 text-2xl shadow-lg shadow-slate-900/20">
            🔐
          </div>

          <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-800">
            Policy Overview
          </h2>

          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            Quick navigation between privacy, data, security, user rights and
            legal sections.
          </p>

          <nav className="mt-6 max-h-[55vh] space-y-2 overflow-auto pr-1">
            {sections.map((section, index) => (
              <a
                key={section}
                href={`#section-${index + 1}`}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-4 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-800"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs text-amber-800">
                  {index + 1}
                </span>
                {section}
              </a>
            ))}
          </nav>

          <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
            <p className="text-sm font-black text-amber-300">Privacy Contact</p>
            <p className="mt-2 break-all text-sm font-bold text-white/80">
              privacy@bizuply.com
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <section id="section-1" className={sectionBase}>
            <h2 className={h2Base}>1. Introduction</h2>

            <p className={pBase}>
              This Privacy Policy explains how <strong>BizUply</strong>{" "}
              operated by private ownership, under U.S. law collects, stores,
              uses, and protects personal information of its users and business
              clients “Users”, “Businesses”, or “You”. By using the BizUply
              platform, you agree to the terms described herein.
            </p>

            <p className={pBase}>
              BizUply is a cloud-based SaaS platform headquartered in New York,
              USA, designed to provide business management, client
              communication, and AI automation tools to small and medium-sized
              businesses “SMBs”.
            </p>

            <p className={pBase}>
              This Privacy Policy applies to all our products, services,
              websites, and applications “Platform” and describes in detail how
              we process data, what information we collect, and what rights you
              have regarding your information.
            </p>

            <p className={pBase}>
              By accessing or using our Platform, you acknowledge that you have
              read and understood this Privacy Policy. If you do not agree,
              please do not use BizUply or any of its services.
            </p>
          </section>

          <section id="section-2" className={sectionBase}>
            <h2 className={h2Base}>2. Scope and Application</h2>

            <p className={pBase}>
              This Privacy Policy applies to all users, including businesses,
              employees, administrators, affiliates, and website visitors
              interacting with BizUply in any form, whether via desktop, mobile
              applications, API integrations, or third-party plug-ins.
            </p>

            <p className={pBase}>
              It governs the processing of personal and non-personal information
              by BizUply and explains our data handling practices in compliance
              with U.S. federal law, New York State privacy regulations, and
              international standards such as GDPR and CCPA for reference
              purposes only.
            </p>

            <p className={pBase}>
              This policy does not apply to third-party services, links, or
              integrations not owned or operated by BizUply. We encourage you to
              review their respective privacy policies before engaging with
              them.
            </p>
          </section>

          <section id="section-3" className={sectionBase}>
            <h2 className={h2Base}>3. Definitions</h2>

            <p className={pBase}>
              <strong>“BizUply”</strong> – Refers to the private-owned SaaS
              company registered and operated under U.S. law, based in New York,
              USA.
            </p>

            <p className={pBase}>
              <strong>“Platform”</strong> – Includes all BizUply products,
              websites, systems, servers, applications, APIs, AI modules, CRM
              dashboards, automation tools, and related software infrastructure.
            </p>

            <p className={pBase}>
              <strong>“User”</strong> – Any natural or legal person using the
              BizUply services, including business owners, employees, clients,
              or visitors of the website.
            </p>

            <p className={pBase}>
              <strong>“Personal Information”</strong> – Data that identifies or
              can reasonably identify an individual, including but not limited
              to name, email, phone number, address, payment details, business
              profile data, and digital identifiers such as IP addresses or
              cookies.
            </p>

            <p className={pBase}>
              <strong>“Third Parties”</strong> – External entities engaged by
              BizUply for hosting, payment processing, analytics, or
              communication purposes, under binding confidentiality and data
              protection agreements.
            </p>
          </section>

          <section id="section-4" className={sectionBase}>
            <h2 className={h2Base}>4. Data We Collect</h2>

            <p className={pBase}>
              BizUply collects both personal and non-personal data required to
              deliver, improve, and secure its services. Data collection may
              occur directly from you, automatically through your device, or
              from verified business integrations.
            </p>

            <h3 className={h3Base}>4.1. Personal Data You Provide</h3>
            <ul className={ulBase}>
              <li>Full name, email, and phone number</li>
              <li>Business name, registration number, and address</li>
              <li>Payment and billing information</li>
              <li>Login credentials encrypted</li>
              <li>Communications, reviews, and feedback sent via the platform</li>
            </ul>

            <h3 className={h3Base}>4.2. Data Collected Automatically</h3>
            <ul className={ulBase}>
              <li>IP address and approximate geolocation</li>
              <li>Device type, browser version, and operating system</li>
              <li>Session activity, interaction history, and timestamps</li>
              <li>Cookies and tracking pixels for analytics and performance</li>
            </ul>

            <h3 className={h3Base}>4.3. Business and Analytical Data</h3>
            <ul className={ulBase}>
              <li>Client and appointment records</li>
              <li>Business messages and chat logs</li>
              <li>AI analysis of performance metrics and recommendations</li>
              <li>Aggregated insights generated from anonymized usage data</li>
            </ul>
          </section>

          <section id="section-5" className={sectionBase}>
            <h2 className={h2Base}>5. How We Use Your Data</h2>

            <p className={pBase}>
              BizUply uses collected information solely for legitimate business
              purposes related to the operation and enhancement of its Platform.
              We do not sell or rent personal data under any circumstance.
            </p>

            <ul className={ulBase}>
              <li>To provide and maintain our services and customer accounts</li>
              <li>To process payments, invoices, and billing cycles</li>
              <li>To improve product performance, UX, and AI accuracy</li>
              <li>To send service updates, alerts, or marketing offers</li>
              <li>To ensure compliance with legal and regulatory requirements</li>
              <li>To prevent fraud, abuse, or unauthorized access</li>
              <li>To support customer service and technical troubleshooting</li>
              <li>To analyze user behavior for statistical and security purposes</li>
            </ul>

            <p className={pBase}>
              All processing is done under secure data management protocols and
              complies with New York privacy standards and international best
              practices.
            </p>
          </section>

          <section id="section-6" className={sectionBase}>
            <h2 className={h2Base}>6. Data Sharing and Third Parties</h2>

            <p className={pBase}>
              BizUply does not sell or trade personal data. However, we may
              share limited information with verified third parties only when
              necessary to operate the Platform, fulfill our legal obligations,
              or provide core services under strict confidentiality and security
              standards.
            </p>

            <h3 className={h3Base}>6.1. Authorized Service Providers</h3>

            <p className={pBase}>
              We may share data with carefully selected third-party service
              providers that assist us in:
            </p>

            <ul className={ulBase}>
              <li>Hosting and server infrastructure e.g., AWS, Google Cloud</li>
              <li>Payment processing and billing e.g., Stripe, PayPal</li>
              <li>
                Customer communication and notifications e.g., Twilio, SendGrid
              </li>
              <li>
                Analytics, security, and performance monitoring e.g.,
                Cloudflare
              </li>
              <li>AI and automation modules for analytics or predictions</li>
            </ul>

            <p className={pBase}>
              All providers are bound by confidentiality agreements and may use
              the information only for the purpose of providing contracted
              services to BizUply, in accordance with this Policy and applicable
              law.
            </p>

            <h3 className={h3Base}>6.2. Legal Requirements</h3>

            <p className={pBase}>
              We may disclose information to law enforcement, government
              agencies, or legal advisors if required to comply with applicable
              laws, court orders, or protect our rights, security, or property,
              including fraud prevention and dispute resolution.
            </p>

            <h3 className={h3Base}>6.3. Business Transfers</h3>

            <p className={pBase}>
              In the event of a merger, acquisition, reorganization, or sale of
              assets, personal data may be transferred to the acquiring entity,
              provided that the same data protection obligations continue to
              apply.
            </p>
          </section>

          <section id="section-7" className={sectionBase}>
            <h2 className={h2Base}>7. Cookies and Tracking Technologies</h2>

            <p className={pBase}>
              BizUply uses cookies, pixels, and tracking technologies to enhance
              user experience, improve system functionality, and analyze usage
              data. These tools help us understand performance, measure traffic,
              and ensure platform security.
            </p>

            <h3 className={h3Base}>7.1. Types of Cookies Used</h3>

            <ul className={ulBase}>
              <li>Essential cookies – required for system operation and login</li>
              <li>Functional cookies – store user preferences and settings</li>
              <li>Analytics cookies – help monitor usage patterns and performance</li>
              <li>Security cookies – protect accounts and prevent unauthorized access</li>
              <li>
                Marketing cookies – used only with consent, for internal
                campaign analysis
              </li>
            </ul>

            <h3 className={h3Base}>7.2. Managing Cookies</h3>

            <p className={pBase}>
              Users may disable cookies through their browser settings. However,
              disabling essential cookies may impact functionality or access to
              certain system features.
            </p>

            <p className={pBase}>
              BizUply does not respond to “Do Not Track” browser signals. For
              more information, contact us at{" "}
              <strong>support@bizuply.com</strong>.
            </p>
          </section>

          <section id="section-8" className={sectionBase}>
            <h2 className={h2Base}>8. Data Retention and Security</h2>

            <p className={pBase}>
              BizUply retains personal and business data only as long as
              necessary to provide its services, comply with legal obligations,
              and prevent abuse or fraud. Once data is no longer required, it is
              securely deleted or anonymized.
            </p>

            <p className={pBase}>
              We employ industry-standard security measures including
              encryption, firewalls, intrusion detection, two-factor
              authentication, and restricted access to protect all stored data.
              However, no online system is entirely immune to breaches. By using
              BizUply, you acknowledge and accept the inherent risks of
              transmitting data over the Internet.
            </p>

            <p className={pBase}>
              In the event of a data breach, BizUply will notify affected users
              as required by law.
            </p>
          </section>

          <section id="section-9" className={sectionBase}>
            <h2 className={h2Base}>9. User Rights</h2>

            <p className={pBase}>
              Under applicable privacy regulations including U.S. federal and
              New York law, users have the following rights:
            </p>

            <ul className={ulBase}>
              <li>The right to access personal data stored by BizUply</li>
              <li>The right to correct or update inaccurate information</li>
              <li>The right to request deletion “Right to be Forgotten”</li>
              <li>The right to receive a copy of personal data “Data Portability”</li>
              <li>The right to object to processing or marketing use</li>
            </ul>

            <p className={pBase}>
              Requests must be submitted in writing to{" "}
              <strong>privacy@bizuply.com</strong>. BizUply will verify the
              identity of the requester and respond within 30 business days, in
              accordance with U.S. law.
            </p>
          </section>

          <section id="section-10" className={sectionBase}>
            <h2 className={h2Base}>10. Refunds, Payments, and Legal Waiver</h2>

            <p className={pBase}>
              All payments, subscriptions, and service fees made to BizUply are
              final and non-refundable under any circumstances, including but
              not limited to account closure, user dissatisfaction, technical
              issues, downtime, or business suspension.
            </p>

            <p className={pBase}>
              By using BizUply, the User explicitly agrees and confirms that:
            </p>

            <ul className={ulBase}>
              <li>No refund, credit, or compensation will be granted for any reason.</li>
              <li>
                The User waives any right to claim damages, initiate lawsuits,
                or demand monetary relief against BizUply, its owners,
                employees, partners, or affiliates.
              </li>
              <li>
                BizUply shall not be liable for indirect, consequential, or
                incidental losses including profit loss, data loss, or
                reputational harm.
              </li>
            </ul>

            <p className={pBase}>
              The User acknowledges full understanding that use of the BizUply
              platform is entirely at their own discretion and risk.
            </p>

            <p className={pBase}>
              No verbal or written communication shall override this section.
              This clause is final and binding under New York State law.
            </p>
          </section>

          <section id="section-11" className={sectionBase}>
            <h2 className={h2Base}>11. Limitation of Liability</h2>

            <p className={pBase}>
              BizUply provides its services “As-Is” and “As Available.” We make
              no warranties regarding uninterrupted operation, accuracy,
              completeness, or suitability for any purpose.
            </p>

            <p className={pBase}>
              To the maximum extent permitted by law, BizUply and its
              affiliates disclaim all liability for any direct, indirect,
              incidental, consequential, or punitive damages arising out of the
              use of or inability to use the Platform.
            </p>

            <p className={pBase}>
              In any case, BizUply’s total liability shall not exceed the amount
              paid by the user in the thirty 30 days preceding the event giving
              rise to the claim.
            </p>
          </section>

          <section id="section-12" className={sectionBase}>
            <h2 className={h2Base}>
              12. Data Location and International Transfers
            </h2>

            <p className={pBase}>
              All personal and business data collected by BizUply is processed
              and stored exclusively in the United States of America, primarily
              within secure servers located in New York and other U.S.
              jurisdictions that comply with federal data protection standards.
            </p>

            <p className={pBase}>
              BizUply does not intentionally transfer or store user data outside
              of the United States. In the rare event of data processing through
              third-party services located abroad, such transfer will be
              performed only when necessary to operate the Platform, and always
              under contractual clauses ensuring equivalent security,
              confidentiality, and lawful handling.
            </p>

            <p className={pBase}>
              By using BizUply, you consent to the processing of your personal
              data within the United States and acknowledge that your
              information will be governed solely by U.S. and New York State law.
            </p>
          </section>

          <section id="section-13" className={sectionBase}>
            <h2 className={h2Base}>13. Policy Updates and Notifications</h2>

            <p className={pBase}>
              BizUply reserves the right to modify, update, or revise this
              Privacy Policy at any time, at its sole discretion. The latest
              version will be published on our official website at{" "}
              <strong>www.bizuply.com/privacy</strong>.
            </p>

            <p className={pBase}>
              Substantial changes will be communicated via email or in-platform
              notifications where applicable. Continued use of the Platform
              after such updates constitutes full acceptance of the revised
              Policy.
            </p>

            <p className={pBase}>
              Users are responsible for reviewing this Policy periodically to
              remain informed of any changes.
            </p>
          </section>

          <section id="section-14" className={sectionBase}>
            <h2 className={h2Base}>14. Legal Compliance and Cooperation</h2>

            <p className={pBase}>
              BizUply operates under the laws of the United States and the State
              of New York. The Company will cooperate with legal authorities,
              regulators, and compliance bodies as required by applicable law.
            </p>

            <p className={pBase}>
              We may retain or disclose certain records if required by subpoena,
              judicial order, or governmental request, provided such disclosure
              complies with U.S. law and due process requirements.
            </p>

            <p className={pBase}>
              BizUply is committed to preventing illegal activity, fraud, money
              laundering, or misuse of its systems. Any suspected violation will
              be reported to the relevant authorities.
            </p>
          </section>

          <section id="section-15" className={sectionBase}>
            <h2 className={h2Base}>15. Legal Disclaimer and No Liability</h2>

            <p className={pBase}>
              The User expressly acknowledges that use of the BizUply Platform,
              services, and associated materials is entirely at their own risk.
              All content and data are provided “As-Is” without warranties,
              expressed or implied, including but not limited to fitness for a
              particular purpose, merchantability, accuracy, or reliability.
            </p>

            <p className={pBase}>
              BizUply, its owners, affiliates, employees, contractors, and
              partners shall not be held liable for any direct, indirect,
              special, consequential, punitive, or incidental damages arising
              from the use of or inability to use the Platform.
            </p>

            <p className={pBase}>
              This includes, without limitation, loss of profits, data,
              goodwill, business interruption, or claims of third parties.
            </p>

            <p className={pBase}>
              The User hereby releases and waives any right to initiate legal
              action, arbitration, or class action against BizUply for any cause
              related to service use, fees, or data handling.
            </p>

            <p className={pBase}>
              This waiver applies globally and perpetually and is binding upon
              the User, their affiliates, successors, and representatives.
            </p>
          </section>

          <section id="section-16" className={sectionBase}>
            <h2 className={h2Base}>16. Governing Law and Jurisdiction</h2>

            <p className={pBase}>
              This Privacy Policy, along with any disputes arising hereunder,
              shall be governed exclusively by the laws of the State of New
              York, United States, without regard to conflict of law principles.
            </p>

            <p className={pBase}>
              Any dispute, claim, or proceeding shall be brought exclusively
              before the competent courts of New York City, New York, USA.
            </p>

            <p className={pBase}>
              Users agree to submit to the personal jurisdiction of such courts
              and waive any objection to venue or forum.
            </p>
          </section>

          <section id="section-17" className={sectionBase}>
            <h2 className={h2Base}>
              17. Contact Information and Data Protection Officer
            </h2>

            <p className={pBase}>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please contact:
            </p>

            <div className="mb-5 rounded-3xl border border-slate-100 bg-white/80 p-5 text-base font-medium leading-8 text-slate-600">
              <p>
                <strong>BizUply – Data Protection Office</strong>
              </p>
              <p>
                Email: <strong>privacy@bizuply.com</strong>
              </p>
              <p>
                General Support: <strong>support@bizuply.com</strong>
              </p>
              <p>Headquarters: New York, NY, United States</p>
            </div>

            <p className={pBase}>
              BizUply’s appointed Data Protection Officer DPO is responsible for
              monitoring compliance, responding to user inquiries, and ensuring
              all internal data handling practices meet industry and legal
              standards.
            </p>
          </section>

          <section id="section-18" className={sectionBase}>
            <h2 className={h2Base}>18. Final Clause</h2>

            <p className={pBase}>
              By accessing or using the BizUply Platform, you confirm that you
              have read, understood, and agreed to all terms set forth in this
              Privacy Policy. You further acknowledge that this Policy
              constitutes the entire and exclusive statement of understanding
              between you and BizUply regarding privacy and supersedes any prior
              agreements or representations.
            </p>

            <p className={pBase}>
              If any part of this Policy is deemed unenforceable, the remaining
              sections shall continue in full effect to the maximum extent
              permitted by law.
            </p>

            <p className={pBase}>
              Use of BizUply signifies explicit and irrevocable consent to all
              clauses contained herein.
            </p>

            <div className="mt-6 rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">
                Last Updated
              </p>
              <p className="mt-2 text-xl font-black">October 14, 2025</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;