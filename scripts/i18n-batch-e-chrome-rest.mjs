function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const NOTIFICATIONS = {
  clientFallback: row("Customer", "לקוח", "Cliente", "Cliente", "عميل"),
  reviewFrom: row(
    "⭐ New review from {{clientName}}",
    "⭐ ביקורת חדשה מ-{{clientName}}",
    "⭐ Nueva reseña de {{clientName}}",
    "⭐ Nova avaliação de {{clientName}}",
    "⭐ تقييم جديد من {{clientName}}"
  ),
  reviewFromComment: row(
    "⭐ New review from {{clientName}}: \"{{comment}}\"",
    "⭐ ביקורת חדשה מ-{{clientName}}: \"{{comment}}\"",
    "⭐ Nueva reseña de {{clientName}}: \"{{comment}}\"",
    "⭐ Nova avaliação de {{clientName}}: \"{{comment}}\"",
    "⭐ تقييم جديد من {{clientName}}: \"{{comment}}\""
  ),
};

const PUSH = {
  subscriptionLabel: row(
    "Push subscription",
    "מנוי Push",
    "Suscripción Push",
    "Assinatura Push",
    "اشتراك Push"
  ),
};

const PLUGINS_ADD = {
  announcementDefault: row(
    "Free shipping on orders over 300 ₪ — tap here for details",
    "משלוח חינם בהזמנות מעל 300 ₪ — לפרטים לחצו כאן",
    "Envío gratis en pedidos de más de 300 ₪ — toca aquí para más detalles",
    "Frete grátis em pedidos acima de 300 ₪ — toque aqui para detalhes",
    "شحن مجاني للطلبات فوق 300 ₪ — اضغطوا هنا للتفاصيل"
  ),
};

const DEMO = {
  sandboxMessage: row(
    "Demo message",
    "הודעת הדגמה",
    "Mensaje de demostración",
    "Mensagem de demonstração",
    "رسالة تجريبية"
  ),
};

const TEMPLATE_SEED = {
  defaultCategory: row(
    "Website template",
    "תבנית אתר",
    "Plantilla de sitio",
    "Modelo de site",
    "قالب موقع"
  ),
  defaultHeroTitle: row(
    "Ready business website",
    "אתר עסקי מוכן",
    "Sitio de negocio listo",
    "Site de negócio pronto",
    "موقع أعمال جاهز"
  ),
  defaultHeroSubtitle: row(
    "A ready website template you can fully edit.",
    "תבנית אתר מוכנה לעריכה מלאה.",
    "Plantilla de sitio lista para editar por completo.",
    "Modelo de site pronto para edição completa.",
    "قالب موقع جاهز للتحرير بالكامل."
  ),
};

export function extraEChromeRestLocaleObject(locale) {
  return {
    notifications: pickLocaleMap(NOTIFICATIONS, locale),
    push: pickLocaleMap(PUSH, locale),
    studio: {
      pluginsAdd: pickLocaleMap(PLUGINS_ADD, locale),
    },
    leftover: {
      demo: pickLocaleMap(DEMO, locale),
      templates: pickLocaleMap(TEMPLATE_SEED, locale),
    },
  };
}
