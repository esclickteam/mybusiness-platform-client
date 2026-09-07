import React from "react";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import type { LexoraSeed } from "./lexoraData";
import {
  CasesList,
  ConsultationSection,
  Reveal,
  type LexoraNavigate,
} from "./shared";

export default function LexoraCasesPage({
  data,
  onNavigate,
}: {
  data: LexoraSeed;
  onNavigate: LexoraNavigate;
}) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container">
          <Reveal>
            <div className="lex-page-kicker">{tx("תיקים נבחרים")}</div>
            <h1>{tx("תיקים שטופלו מתוך חשיבה משפטית ואסטרטגית")}</h1>
            <p>
              {tx("תצוגה יוקרתית של עבודות, הישגים וסוגי תיקים שהמשרד יודע להוביל.")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="lex-section">
        <div className="lex-container">
          <CasesList data={data} onNavigate={onNavigate} />
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}