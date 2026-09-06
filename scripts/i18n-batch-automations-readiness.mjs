function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pick(value, locale) {
  return value[locale] || value.en;
}

function pickMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, pick(value, locale)]),
  );
}

const READINESS = {
  comingSoon: row(
    "Coming soon — not available to enable yet",
    "בקרוב — עדיין לא זמין להפעלה",
    "Próximamente — aún no se puede activar",
    "Em breve — ainda não dá para ativar",
    "قريباً — غير متاح للتفعيل بعد",
  ),
  connectWhatsapp: row(
    "Connect WhatsApp Business (Bizuply) to enable",
    "חברו WhatsApp Business (Bizuply) כדי להפעיל",
    "Conecta WhatsApp Business (Bizuply) para activar",
    "Conecte o WhatsApp Business (Bizuply) para ativar",
    "اربطوا واتساب للأعمال (Bizuply) للتفعيل",
  ),
  noApprovedTemplates: row(
    "No approved WhatsApp templates (APPROVED) to choose from",
    "אין תבניות WhatsApp מאושרות (APPROVED) לבחירה",
    "No hay plantillas de WhatsApp aprobadas (APPROVED) para elegir",
    "Não há modelos de WhatsApp aprovados (APPROVED) para escolher",
    "لا توجد قوالب واتساب معتمدة (APPROVED) للاختيار",
  ),
  notAvailable: row(
    "This automation is not available to enable in the system yet",
    "האוטומציה עדיין לא זמינה להפעלה במערכת",
    "Esta automatización aún no se puede activar en el sistema",
    "Esta automação ainda não está disponível para ativar no sistema",
    "هذه الأتمتة غير متاحة للتفعيل في النظام بعد",
  ),
  connectCalendar: row(
    "Connect Google Calendar on the connections screen to enable",
    "חברו Google Calendar במסך החיבורים כדי להפעיל",
    "Conecta Google Calendar en conexiones para activar",
    "Conecte o Google Calendar na tela de conexões para ativar",
    "اربطوا تقويم Google في شاشة الاتصالات للتفعيل",
  ),
  cannotEnable: row(
    "This template cannot be enabled",
    "לא ניתן להפעיל תבנית זו",
    "No se puede activar esta plantilla",
    "Não é possível ativar este modelo",
    "لا يمكن تفعيل هذا القالب",
  ),
  noSupportedTrigger: row(
    "There is no supported trigger to enable this automation right now",
    "אין טריגר נתמך להפעלת האוטומציה הזו כרגע",
    "No hay un disparador compatible para activarla ahora",
    "Não há um gatilho compatível para ativar esta automação agora",
    "لا يوجد مشغّل مدعوم لتفعيل هذه الأتمتة الآن",
  ),
  missingApproved: row(
    "Missing approved WhatsApp templates: {{names}}",
    "חסרות תבניות WhatsApp מאושרות: {{names}}",
    "Faltan plantillas de WhatsApp aprobadas: {{names}}",
    "Faltam modelos de WhatsApp aprovados: {{names}}",
    "قوالب واتساب المعتمدة ناقصة: {{names}}",
  ),
  recipeNotAvailable: row(
    "This recipe is not available to enable on this account yet",
    "המתכון עדיין לא זמין להפעלה בחשבון הזה",
    "Esta receta aún no se puede activar en esta cuenta",
    "Esta receita ainda não está disponível para ativar nesta conta",
    "هذه الوصفة غير متاحة للتفعيل في هذا الحساب بعد",
  ),
  recipeMissing: row(
    "The recipe was not found on the server",
    "המתכון לא נמצא בשרת",
    "No se encontró la receta en el servidor",
    "A receita não foi encontrada no servidor",
    "لم يُعثر على الوصفة في الخادم",
  ),
};

const STORE_RUNTIME = {
  chooseVariant: row(
    "Choose a variant before adding to the cart",
    "בחרו וריאציה לפני הוספה לסל",
    "Elige una variante antes de añadir al carrito",
    "Escolha uma variação antes de adicionar ao carrinho",
    "اختاروا خياراً قبل الإضافة إلى السلة",
  ),
  leftInStock: row(
    "{{count}} left in stock",
    "נותרו {{count}} במלאי",
    "Quedan {{count}} en stock",
    "Restam {{count}} em estoque",
    "تبقّى {{count}} في المخزون",
  ),
  soldOut: row("Out of stock", "אזל מהמלאי", "Agotado", "Esgotado", "نفد من المخزون"),
};

export function extraAutomationsReadinessLocaleObject(locale) {
  return {
    automations: { readiness: pickMap(READINESS, locale) },
    publicWidgets: { store: pickMap(STORE_RUNTIME, locale) },
  };
}
