/**
 * unique32 — leftover 8–11 chrome titles after unique31.
 * Skip personal names, streets, cities, insurance brands, and government labels.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "הזמנת שקית": r("Order a bag", "Pedir una bolsa", "Pedir uma sacola", "طلب كيس"),
  "אחרי גילוח": r("After shave", "Después del afeitado", "Após o barbear", "بعد الحلاقة"),
  "מגרש אימון": r("A training field", "Un campo de entrenamiento", "Um campo de treino", "ملعب تدريب"),
  "רשתות נישה": r("Niche networks", "Redes de nicho", "Redes de nicho", "شبكات متخصصة"),
  "שאלה נקייה": r("A clean question", "Una pregunta limpia", "Uma pergunta limpa", "سؤال نظيف"),
  "פחות סיכון": r("Less risk", "Menos riesgo", "Menos risco", "مخاطرة أقل"),
  "ציון פעולה": r("An action score", "Una nota de acción", "Uma nota de ação", "درجة إجراء"),
  "גישה נכונה": r("The right approach", "El enfoque correcto", "A abordagem certa", "النهج الصحيح"),
  "בנייה חדשה": r("New construction", "Obra nueva", "Construção nova", "بناء جديد"),
  "עיסוי פנים": r("A facial massage", "Un masaje facial", "Uma massagem facial", "مساج وجه"),
  "תמיכת סדנה": r("Workshop support", "Soporte de taller", "Suporte de oficina", "دعم الورشة"),
  "לחות משקמת": r("Restorative moisture", "Hidratación reparadora", "Hidratação reparadora", "ترطيب مرمّم"),
  "צריבת הבשר": r("Searing the meat", "Sellado de la carne", "Selagem da carne", "تحمير اللحم"),
  "סלסה יומית": r("Daily salsa", "Salsa diaria", "Salsa diária", "صلصة يومية"),
  "עמוד גירוד": r("A scratching post", "Un rascador", "Um arranhador", "عمود خدش"),
  "שמיכת פליז": r("A fleece blanket", "Una manta polar", "Um cobertor de fleece", "بطانية فليس"),
  "שיחה קבועה": r("A regular call", "Una llamada fija", "Uma conversa regular", "مكالمة ثابتة"),
  "האזנה מלאה": r("Full listening", "Escucha plena", "Escuta plena", "إنصات كامل"),
  "סקיצה מלאה": r("A full sketch", "Un boceto completo", "Um esboço completo", "مسودة كاملة"),
  "רענון שנתי": r("An annual refresh", "Una renovación anual", "Uma renovação anual", "تحديث سنوي"),
  "מוצר ומסחר": r("Product and commerce", "Producto y comercio", "Produto e comércio", "منتج وتجارة"),
  "מומחה עסקי": r("A business expert", "Un experto de negocio", "Um especialista de negócio", "خبير أعمال"),
  "עורכי תחום": r("Field editors", "Editores del ámbito", "Editores da área", "محرّرو المجال"),
  "יומן הורים": r("A parents journal", "Una agenda de padres", "Um diário de pais", "دفتر أهل"),
  "ערכות רכות": r("Soft kits", "Kits suaves", "Kits macios", "أطقم ناعمة"),
  "מנורת לילה": r("A night lamp", "Una lámpara de noche", "Uma luminária noturna", "مصباح ليلي"),
  "שמיכת עגלה": r("A stroller blanket", "Una manta de carrito", "Um cobertor de carrinho", "بطانية عربة"),
  "קהילה קודם": r("Community first", "Comunidad primero", "Comunidade primeiro", "المجتمع أولاً"),
  "שליחת בריף": r("Send a brief", "Enviar un brief", "Enviar um brief", "إرسال موجز"),
  "חתונה מלאה": r("A full wedding", "Una boda completa", "Um casamento completo", "زفاف كامل"),
  "תיאום הגעה": r("Arrival coordination", "Coordinación de llegada", "Coordenação de chegada", "تنسيق الوصول"),
  "אופק השבחה": r("An appreciation horizon", "Un horizonte de revalorización", "Um horizonte de valorização", "أفق رفع القيمة"),
  "תסריט אישי": r("A personal script", "Un guion personal", "Um roteiro pessoal", "سيناريو شخصي"),
  "חיבור מהיר": r("A fast connection", "Una conexión rápida", "Uma conexão rápida", "اتصال سريع"),
  "כריות פשתן": r("Linen pillows", "Cojines de lino", "Almofadas de linho", "وسائد كتان"),
  "אגרטל קרמי": r("A ceramic vase", "Un jarrón de cerámica", "Um vaso de cerâmica", "مزهرية خزف"),
  "נרות ארומה": r("Aroma candles", "Velas de aroma", "Velas de aroma", "شموع عطر"),
  "מדדי קמפוס": r("Campus metrics", "Indicadores de campus", "Indicadores de campus", "مؤشرات الحرم"),
  "הסרה בטוחה": r("Safe removal", "Eliminación segura", "Remoção segura", "إزالة آمنة"),
  "עגילי טיפה": r("Drop earrings", "Pendientes de gota", "Brincos de gota", "أقراط قطرة"),
  "מדיה מוכנה": r("Ready media", "Medios listos", "Mídia pronta", "وسائط جاهزة"),
  "השקות בשנה": r("Launches per year", "Lanzamientos al año", "Lançamentos por ano", "إطلاقات في السنة"),
  "מדפי קריאה": r("Reading shelves", "Estantes de lectura", "Prateleiras de leitura", "رفوف قراءة"),
  "פינת קריאה": r("A reading nook", "Un rincón de lectura", "Um canto de leitura", "ركن قراءة"),
  "מחברת פשתן": r("A linen notebook", "Un cuaderno de lino", "Um caderno de linho", "دفتر كتان"),
  "הרגעה אחרי": r("After calming", "Después de calmar", "Depois de acalmar", "بعد التهدئة"),
  "נישות עומק": r("Depth niches", "Nichos de profundidad", "Nichos de profundidade", "منافذ عمق"),
  "שלחו דרישה": r("Send a request", "Enviar una solicitud", "Enviar uma solicitação", "أرسلوا طلباً"),
  "גבות הצללה": r("Brow shading", "Sombreado de cejas", "Sombreamento de sobrancelhas", "تظليل الحواجب"),
  "חומוס ביתי": r("Homemade hummus", "Hummus casero", "Homus caseiro", "حمّص منزلي"),
  "שמפו בוטני": r("Botanical shampoo", "Champú botánico", "Shampoo botânico", "شامبو نباتي"),
  "מסכה משקמת": r("A restorative mask", "Una mascarilla reparadora", "Uma máscara reparadora", "قناع مرمّم"),
  "שינויים שמדווחים מנטיז": r("Changes reported from the field", "Cambios reportados desde el terreno", "Mudanças relatadas do campo", "تغييرات تُبلَّغ من الميدان"),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/i18n/templateExactLexicon.unique32.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique32 rows`);
