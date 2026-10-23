import { CAMPAIGN_FIXTURE } from "../../guidedDemo/fixtures/demoFixtures";
import "./productIllustrations.css";

const FLAGS = {
  en: "Illustration from the in-memory demo. Not a screenshot of a live account.",
  he: "המחשה מנתוני הדמו שבזיכרון. לא צילום מסך של חשבון פעיל.",
  es: "Ilustración con los datos de demostración en memoria. No es una captura de una cuenta real.",
  "pt-BR": "Ilustração com os dados de demonstração em memória. Não é uma captura de uma conta real.",
  ar: "توضيح من بيانات العرض في الذاكرة. ليست لقطة لحساب حقيقي.",
};

const LEVELS = {
  en: ["Campaign", "Ad set", "Ad"],
  he: ["קמפיין", "קבוצת מודעות", "מודעה"],
  es: ["Campaña", "Conjunto", "Anuncio"],
  "pt-BR": ["Campanha", "Conjunto", "Anúncio"],
  ar: ["حملة", "مجموعة", "إعلان"],
};

const STATUSES = {
  en: ["Accepted", "Sent", "Delivered", "Read", "Failed"],
  he: ["התקבל", "נשלח", "נמסר", "נקרא", "נכשל"],
  es: ["Aceptado", "Enviado", "Entregado", "Leído", "Fallido"],
  "pt-BR": ["Aceito", "Enviado", "Entregue", "Lido", "Falhou"],
  ar: ["مقبول", "أُرسل", "تم التسليم", "قُرئ", "فشل"],
};

function flag(locale) {
  return FLAGS[locale] || FLAGS.en;
}

export function CampaignIllustration({ locale = "en" }) {
  const sample = CAMPAIGN_FIXTURE[locale] || CAMPAIGN_FIXTURE.en;
  const labels = LEVELS[locale] || LEVELS.en;
  const columns = [
    [labels[0], sample.name, `${sample.location}`],
    [labels[1], sample.adSetName, `${sample.ageMin}–${sample.ageMax}`],
    [labels[2], sample.adName, sample.headline],
  ];
  return (
    <figure className="illu">
      <figcaption className="illu__flag">{flag(locale)}</figcaption>
      <div className="illu__frame">
        <div className="illu__bar" aria-hidden="true"><i /><i /><i /></div>
        <div className="illu__board">
          {columns.map(([label, title, detail]) => (
            <div className="illu__col" key={label}>
              <b>{label}</b>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

export function WhatsAppStatusIllustration({ locale = "en" }) {
  const steps = STATUSES[locale] || STATUSES.en;
  return (
    <figure className="illu">
      <figcaption className="illu__flag">{flag(locale)}</figcaption>
      <div className="illu__frame">
        <div className="illu__bar" aria-hidden="true"><i /><i /><i /></div>
        <div className="illu__flow">
          {steps.map((step) => (
            <div className="illu__step" key={step}>{step}</div>
          ))}
        </div>
      </div>
    </figure>
  );
}
