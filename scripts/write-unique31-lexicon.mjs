/**
 * unique31 — leftover 8–11 chrome and product titles after unique30.
 * Skip personal names, streets, cities, and insurance-brand labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "כלכלה שקופה": r("Transparent economics", "Economía transparente", "Economia transparente", "اقتصاد شفاف"),
  "איכות אחידה": r("Consistent quality", "Calidad uniforme", "Qualidade uniforme", "جودة موحّدة"),
  "גזרות חכמות": r("Smart cuts", "Cortes inteligentes", "Cortes inteligentes", "قصّات ذكية"),
  "שליחת הרשמה": r("Send registration", "Enviar inscripción", "Enviar inscrição", "إرسال التسجيل"),
  "יועצת בכירה": r("A senior consultant", "Una consultora sénior", "Uma consultora sênior", "مستشارة أولى"),
  "סגירה ובקרה": r("Closing and control", "Cierre y control", "Fechamento e controle", "إغلاق ورقابة"),
  "כפפות אימון": r("Training gloves", "Guantes de entrenamiento", "Luvas de treino", "قفازات تدريب"),
  "הפעלה רציפה": r("Continuous operation", "Operación continua", "Operação contínua", "تشغيل مستمر"),
  "הכנסה חוזרת": r("Recurring revenue", "Ingresos recurrentes", "Receita recorrente", "دخل متكرر"),
  "תגמול שמניע": r("A motivating reward", "Una recompensa que motiva", "Uma recompensa que motiva", "مكافأة محفّزة"),
  "בהצעת מומחה": r("In an expert proposal", "En una propuesta de experto", "Em uma proposta de especialista", "في عرض خبير"),
  "רגעים מהדרך": r("Moments from the road", "Momentos del camino", "Momentos da estrada", "لحظات من الطريق"),
  "נתחיל בשיחה": r("Let's start with a talk", "Empecemos con una conversación", "Vamos começar com uma conversa", "لنبدأ بحديث"),
  "בקבוק השבוע": r("Bottle of the week", "Botella de la semana", "Garrafa da semana", "زجاجة الأسبوع"),
  "פולים טריים": r("Fresh beans", "Granos frescos", "Grãos frescos", "حبوب طازجة"),
  "חליטה ידנית": r("Hand brewing", "Infusionado a mano", "Infusão manual", "تحضير يدوي"),
  "משחזת זווית": r("An angle grinder", "Una amoladora angular", "Uma esmerilhadeira angular", "جلّاخ زاوية"),
  "מדפים לסדנה": r("Workshop shelves", "Estantes de taller", "Prateleiras de oficina", "رفوف للورشة"),
  "כפפות עבודה": r("Work gloves", "Guantes de trabajo", "Luvas de trabalho", "قفازات عمل"),
  "מדידה קשוחה": r("A tough measurement", "Una medición dura", "Uma medição rígida", "قياس صارم"),
  "עיסוי קטיפה": r("A velvet massage", "Un masaje de terciopelo", "Uma massagem de veludo", "مساج مخملي"),
  "שניות לטאקו": r("Seconds to taco", "Segundos al taco", "Segundos ao taco", "ثوانٍ للتاكو"),
  "חטיפי אימון": r("Training snacks", "Snacks de entrenamiento", "Lanches de treino", "وجبات تدريب"),
  "פורמט מחזיק": r("A format that holds", "Un formato que sostiene", "Um formato que segura", "صيغة تثبت"),
  "משרדי הנהלה": r("Executive offices", "Oficinas de dirección", "Escritórios da diretoria", "مكاتب الإدارة"),
  "פיקוח עליון": r("Top-level supervision", "Supervisión superior", "Supervisão de topo", "رقابة عليا"),
  "ברסקט מעושן": r("Smoked brisket", "Brisket ahumado", "Brisket defumado", "بريسكت مدخّن"),
  "טיוטת תגובה": r("A response draft", "Un borrador de respuesta", "Um rascunho de resposta", "مسودة رد"),
  "מיקום מדויק": r("A precise location", "Una ubicación precisa", "Um local preciso", "موقع دقيق"),
  "ארגזי העונה": r("Season crates", "Cajas de la temporada", "Caixas da estação", "صناديق الموسم"),
  "סרטון הסלון": r("The living-room video", "El vídeo del salón", "O vídeo da sala", "فيديو الصالون"),
  "משפחה צעירה": r("A young family", "Una familia joven", "Uma família jovem", "عائلة شابة"),
  "שיתוף בצוות": r("Team sharing", "Compartir en equipo", "Compartilhar em equipe", "مشاركة في الفريق"),
  "מצעים עננים": r("Cloud bedding", "Ropa de cama de nubes", "Roupa de cama nuvem", "أغطية غيم"),
  "שיעור מוקרן": r("A projected lesson", "Una clase proyectada", "Uma aula projetada", "درس معروض"),
  "בימוי למידה": r("Learning direction", "Dirección de aprendizaje", "Direção de aprendizagem", "إخراج تعلّم"),
  "תכנון מפורט": r("Detailed planning", "Planificación detallada", "Planejamento detalhado", "تخطيط مفصّل"),
  "רגעים מהחלל": r("Moments from the space", "Momentos del espacio", "Momentos do espaço", "لحظات من الفراغ"),
  "ווייב בגלים": r("A wave vibe", "Un vibe de olas", "Um vibe em ondas", "أجواء موجات"),
  "פסנתר קלאסי": r("A classical piano", "Un piano clásico", "Um piano clássico", "بيانو كلاسيكي"),
  "נכסים במאגר": r("Properties in stock", "Inmuebles en el inventario", "Imóveis no acervo", "عقارات في المخزون"),
  "רפואת חירום": r("Emergency medicine", "Medicina de urgencias", "Medicina de emergência", "طب طوارئ"),
  "קמפוס למידה": r("A learning campus", "Un campus de aprendizaje", "Um campus de aprendizagem", "حرم تعلّم"),
  "מסלול קמפוס": r("A campus track", "Una ruta de campus", "Uma trilha de campus", "مسار حرم"),
  "עבודה מוכחת": r("Proven work", "Trabajo demostrado", "Trabalho comprovado", "عمل مُثبت"),
  "התאמת חלוקה": r("A split match", "Ajuste de reparto", "Ajuste de divisão", "مواءمة تقسيم"),
  "שרשרת שכבות": r("A layer chain", "Una cadena de capas", "Uma cadeia de camadas", "سلسلة طبقات"),
  "עגילי חישוק": r("Hoop earrings", "Pendientes de aro", "Brincos de argola", "أقراط حلق"),
  "תזמון מדויק": r("Precise timing", "Temporización precisa", "Tempo preciso", "توقيت دقيق"),
  "דפדוף מסודר": r("Orderly paging", "Paginación ordenada", "Paginação ordenada", "تصفّح مرتّب"),
  "שימוש מעורב": r("Mixed use", "Uso mixto", "Uso misto", "استخدام مختلط"),
  "סכסוך מסחרי": r("A commercial dispute", "Un conflicto comercial", "Um conflito comercial", "نزاع تجاري"),
  "דירות במאגר": r("Apartments in stock", "Pisos en el inventario", "Apartamentos no acervo", "شقق في المخزون"),
  "מומחה אופנה": r("A fashion expert", "Un experto en moda", "Um especialista em moda", "خبير أزياء"),
  "אורחת קבועה": r("A regular guest", "Una invitada habitual", "Uma hóspede regular", "ضيفة دائمة"),
  "בחירת האופה": r("The baker's pick", "La elección del panadero", "A escolha do padeiro", "اختيار الخبّاز"),
  "הזמנת מאפים": r("Order pastries", "Pedir bollería", "Pedir padaria", "طلب معجنات"),
  "בייגל זרעים": r("A seed bagel", "Un bagel de semillas", "Um bagel de sementes", "بيغل بذور"),
  "ראייה עסקית": r("A business view", "Una visión de negocio", "Uma visão de negócio", "رؤية أعمال"),
  "שלושה צעדים": r("Three steps", "Tres pasos", "Três passos", "ثلاث خطوات"),
  "ידיים בחומר": r("Hands in the material", "Manos en el material", "Mãos no material", "أيدٍ في المادة"),
  "הדגמה צמודה": r("A close demo", "Una demo cercana", "Uma demonstração próxima", "عرض ملاصق"),
  "שיעור סגירה": r("A closing lesson", "Una clase de cierre", "Uma aula de fechamento", "درس إغلاق"),
  "מחזור ממוצע": r("Average turnover", "Ciclo medio", "Ciclo médio", "دورة متوسطة"),
  "נהלי הפעלה": r("Operating procedures", "Procedimientos de operación", "Procedimentos de operação", "إجراءات تشغيل"),
  "טרמינל אירוח / מדבר": r("A hospitality terminal / desert", "Una terminal de hospitalidad / desierto", "Um terminal de hospitalidade / deserto", "محطة ضيافة / صحراء"),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/i18n/templateExactLexicon.unique31.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique31 rows`);
