import React from "react";
import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";
import type { LexoraSeed } from "./lexoraData";
import { ConsultationSection, ProcessSection, Reveal } from "./shared";

export default function LexoraProcessPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container">
          <Reveal>
            <div className="lex-page-kicker">{tx("תהליך העבודה")}</div>
            <h1>{tx("כל תיק מתחיל באבחון ברור וממשיך בדרך פעולה מדויקת")}</h1>
            <p>
              {tx("תהליך עבודה מסודר שמסביר ללקוח מה קורה בכל שלב ומחזק אמון.")}
            </p>
          </Reveal>
        </div>
      </section>

      <ProcessSection data={data} />
      <ConsultationSection data={data} />
    </main>
  );
}