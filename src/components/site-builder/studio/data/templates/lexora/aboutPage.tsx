import React from "react";
import type { LexoraSeed } from "./lexoraData";
import { ConsultationSection, FaqSection, Reveal, SafeImage } from "./shared";

export default function LexoraAboutPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container">
          <Reveal>
            <div className="lex-page-kicker">{data.about.eyebrow}</div>
            <h1>{data.about.title}</h1>
            <p>{data.about.text}</p>
          </Reveal>
        </div>
      </section>

      <section className="lex-team-section">
        <div className="lex-container">
          <div className="lex-team-grid">
            {data.about.team.map((member, index) => (
              <Reveal key={member.name} className="lex-team-card" delay={index * 100}>
                <SafeImage src={member.image} alt={member.name} />
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <span>אודות</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FaqSection data={data} />
      <ConsultationSection data={data} />
    </main>
  );
}