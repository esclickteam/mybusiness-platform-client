function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en])
  );
}

const AI_CONFIG = {
  criteria: {
    label: row("What matters in the score?", "מה חשוב לך בדירוג?", "¿Qué importa en la puntuación?", "O que importa na pontuação?", "ما الأهم في التقييم؟"),
    default: row(
      "Fit to the service, urgency, and purchase potential",
      "התאמה לשירות, דחיפות ופוטנציאל רכישה",
      "Encaje con el servicio, urgencia y potencial de compra",
      "Ajuste ao serviço, urgência e potencial de compra",
      "الملاءمة للخدمة والإلحاح وإمكانية الشراء"
    ),
  },
  fieldsHint: {
    label: row("Which lead fields should AI analyze?", "אילו נתוני ליד לנתח?", "¿Qué datos del lead debe analizar la IA?", "Quais dados do lead a IA deve analisar?", "أي بيانات للعميل المحتمل يجب تحليلها؟"),
    default: row(
      "Name, source, message, status, and existing tags",
      "שם, מקור, הודעה, סטטוס ותגיות קיימות",
      "Nombre, origen, mensaje, estado y etiquetas existentes",
      "Nome, origem, mensagem, status e tags existentes",
      "الاسم والمصدر والرسالة والحالة والوسوم الحالية"
    ),
  },
  scoreMin: { label: row("Minimum score", "ציון מינימום", "Puntuación mínima", "Pontuação mínima", "الحد الأدنى للدرجة") },
  scoreMax: { label: row("Maximum score", "ציון מקסימום", "Puntuación máxima", "Pontuação máxima", "الحد الأقصى للدرجة") },
  saveAsTag: { label: row("Where should the result be saved (tag)?", "איפה לשמור את התוצאה (תגית)?", "¿Dónde guardar el resultado (etiqueta)?", "Onde salvar o resultado (tag)?", "أين تُحفظ النتيجة (وسم)؟") },
  categories: { label: row("Categories", "קטגוריות", "Categorías", "Categorias", "فئات") },
  maxTags: { label: row("Maximum tags", "מספר תגיות מרבי", "Máximo de etiquetas", "Máximo de tags", "الحد الأقصى للوسوم") },
  threshold: { label: row("Detection threshold", "סף זיהוי", "Umbral de detección", "Limiar de detecção", "عتبة الكشف") },
  style: { label: row("Tone", "סגנון", "Tono", "Tom", "أسلوب") },
  channel: { label: row("Channel", "ערוץ", "Canal", "Canal", "قناة") },
  createTask: { label: row("Create a task", "ליצור משימה", "Crear una tarea", "Criar uma tarefa", "إنشاء مهمة") },
  dueInHours: { label: row("Due in hours", "לביצוע תוך שעות", "Para hacer en horas", "Prazo em horas", "للتنفيذ خلال ساعات") },
  lookbackHours: { label: row("Lookback (hours)", "מבט לאחור (שעות)", "Mirada atrás (horas)", "Olhar para trás (horas)", "نظرة للخلف (ساعات)") },
  title: {
    label: row("Title", "כותרת", "Título", "Título", "العنوان"),
    default: row("Daily digest", "תקציר יומי", "Resumen diario", "Resumo diário", "ملخص يومي"),
  },
  extraInstructions: { label: row("Extra instructions for AI", "הנחיות נוספות ל-AI", "Instrucciones extra para la IA", "Instruções extra para a IA", "تعليمات إضافية للذكاء") },
  option1: row("Hot", "חם", "Caliente", "Quente", "ساخن"),
  option2: row("Medium", "בינוני", "Medio", "Médio", "متوسط"),
  option3: row("Cold", "קר", "Frío", "Frio", "بارد"),
};

export function extraAiConfigLocaleObject(locale) {
  return {
    automations: {
      aiConfig: Object.fromEntries(
        Object.entries(AI_CONFIG).map(([key, value]) => {
          if (value.en) return [key, value[locale] || value.en];
          return [key, pickLocaleMap(value, locale)];
        })
      ),
    },
  };
}
