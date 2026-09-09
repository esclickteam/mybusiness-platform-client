/**
 * unique92 — leftover insert-library / grapes editor chrome after unique91.
 * Exact keys only. Skip one-letter social shorthands (אי/לין/אקס), names, comments.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  תוכן: r("Content", "Contenido", "Conteúdo", "محتوى"),
  "✦ חדש": r("✦ New", "✦ Nuevo", "✦ Novo", "✦ جديد"),
  חבילה: r("Package", "Paquete", "Pacote", "باقة"),
  כמוסה: r("Capsule", "Cápsula", "Cápsula", "كبسولة"),
  מקדמה: r("Deposit", "Anticipo", "Sinal", "عربون"),
  "צל רך": r("Soft shadow", "Sombra suave", "Sombra suave", "ظل ناعم"),
  "טאב שני": r("Second tab", "Segunda pestaña", "Segunda aba", "التبويب الثاني"),
  "בקשת תור": r("Booking request", "Solicitud de cita", "Pedido de agendamento", "طلب موعد"),
  "עמודה א׳": r("Column A", "Columna A", "Coluna A", "العمود أ"),
  "עמודה ב׳": r("Column B", "Columna B", "Coluna B", "العمود ب"),
  "עמודה ג׳": r("Column C", "Columna C", "Coluna C", "العمود ج"),
  "א · ב · ₪": r("A · B · ₪", "A · B · ₪", "A · B · ₪", "أ · ب · ₪"),
  "טאב ראשון": r("First tab", "Primera pestaña", "Primeira aba", "التبويب الأول"),
  "טאב שלישי": r("Third tab", "Tercera pestaña", "Terceira aba", "التبويب الثالث"),
  "תוכן הטאב": r("Tab content", "Contenido de la pestaña", "Conteúdo da aba", "محتوى التبويب"),
  "תחום העסק": r("Business field", "Área del negocio", "Área do negócio", "مجال العمل"),
  "אזור מעוצב": r("Designed area", "Zona diseñada", "Área desenhada", "منطقة مصممة"),
  "כותרת סקשן": r("Section title", "Título de sección", "Título da seção", "عنوان القسم"),
  "כרטיס מידע": r("Info card", "Tarjeta de información", "Cartão de informação", "بطاقة معلومات"),
  "מיקס צבעים": r("Color mix", "Mezcla de color", "Mistura de cores", "مزيج ألوان"),
  "סקציה חדשה": r("New section", "Sección nueva", "Seção nova", "قسم جديد"),
  "תפקיד בעסק": r("Role in the business", "Cargo en el negocio", "Cargo no negócio", "دور في العمل"),
  "הטבה מיוחדת": r("Special offer", "Oferta especial", "Oferta especial", "عرض خاص"),
  "כותרת כרטיס": r("Card title", "Título de tarjeta", "Título do cartão", "عنوان البطاقة"),
  "כפתור פעולה": r("Action button", "Botón de acción", "Botão de ação", "زر إجراء"),
  "מחובר ליומן": r("Connected to calendar", "Conectado al calendario", "Conectado à agenda", "متصل بالتقويم"),
  "תשלום מקדמה": r("Deposit payment", "Pago de anticipo", "Pagamento de sinal", "دفع العربون"),
  "גלריה מעוצבת": r("Designed gallery", "Galería diseñada", "Galeria desenhada", "معرض مصمم"),
  "יוצאים לדרך.": r("Let's get started.", "Salimos al camino.", "Vamos começar.", "ننطلق في الطريق."),
  "ליצירת קשר →": r("Contact →", "Contacto →", "Contato →", "للتواصل →"),
  "מוצר מהמערכת": r("Product from the system", "Producto del sistema", "Produto do sistema", "منتج من المنظومة"),
  "תצוגת עבודות": r("Work display", "Muestra de trabajos", "Exibição de trabalhos", "عرض الأعمال"),
  "✓ אחריות מלאה": r("✓ Full warranty", "✓ Garantía completa", "✓ Garantia completa", "✓ ضمان كامل"),
  "חבילה מקצועית": r("Professional package", "Paquete profesional", "Pacote profissional", "باقة مهنية"),
  "מוצרים לרכישה": r("Products for sale", "Productos a la venta", "Produtos à venda", "منتجات للشراء"),
  "מוצרים מהחנות": r("Store products", "Productos de la tienda", "Produtos da loja", "منتجات المتجر"),
  "שירות מהמערכת": r("Service from the system", "Servicio del sistema", "Serviço do sistema", "خدمة من المنظومة"),
  "שם השדה - ערך": r("Field name - value", "Nombre del campo - valor", "Nome do campo - valor", "اسم الحقل - قيمة"),
  "✓ זמינות גבוהה": r("✓ High availability", "✓ Alta disponibilidad", "✓ Alta disponibilidade", "✓ توفر عالٍ"),
  "✓ שירות מקצועי": r("✓ Professional service", "✓ Servicio profesional", "✓ Serviço profissional", "✓ خدمة مهنية"),
  "בחרו שעה פנויה": r("Choose an open time", "Elegid una hora libre", "Escolha um horário livre", "اختاروا ساعة متاحة"),
  "שליחה בוואטסאפ": r("Send on WhatsApp", "Envío por WhatsApp", "Envio no WhatsApp", "إرسال عبر واتساب"),
  "איך קובעים תור?": r("How do you book?", "¿Cómo se pide cita?", "Como se agenda?", "كيف تُحجزون موعداً؟"),
  "כיתוב מעל וידאו": r("Caption over video", "Texto sobre el vídeo", "Texto sobre o vídeo", "نص فوق الفيديو"),
  "בחירת תאריך ושעה": r("Pick date and time", "Elegid fecha y hora", "Escolha data e hora", "اختيار تاريخ وساعة"),
  "וידאו תדמית לעסק": r("Business brand video", "Vídeo de marca del negocio", "Vídeo de marca do negócio", "فيديو هوية للعمل"),
  "מכירים את הצורך.": r("We know the need.", "Conocemos la necesidad.", "Conhecemos a necessidade.", "نعرف الحاجة."),
  "מוצר פרימיום לעסק": r("Premium product for the business", "Producto premium para el negocio", "Produto premium para o negócio", "منتج فاخر للعمل"),
  "סקציה רכה ומעוצבת": r("Soft designed section", "Sección suave y diseñada", "Seção suave e desenhada", "قسم ناعم ومصمم"),
  "בונים פתרון מתאים.": r("Building the right solution.", "Construimos la solución adecuada.", "Construímos a solução certa.", "نبني الحل المناسب."),
  "כותרת סקשן מקצועית": r("Professional section title", "Título de sección profesional", "Título de seção profissional", "عنوان قسم مهني"),
  "כותרת על תמונת רקע": r("Title on a background image", "Título sobre imagen de fondo", "Título sobre imagem de fundo", "عنوان على صورة خلفية"),
  "כותרת ראשית מרשימה": r("Impressive main title", "Título principal impresionante", "Título principal impressionante", "عنوان رئيسي مبهر"),
  "נחזור אליכם בהקדם.": r("We will get back to you soon.", "Os responderemos pronto.", "Retornaremos em breve.", "سنعود إليكم قريباً."),
  "סקציה כהה ויוקרתית": r("Dark luxury section", "Sección oscura y de lujo", "Seção escura e luxuosa", "قسم داكن وفاخر"),
  "סקציה עם תמונת רקע": r("Section with background image", "Sección con imagen de fondo", "Seção com imagem de fundo", "قسم بصورة خلفية"),
  "האם אפשר לשלם באתר?": r("Can you pay on the site?", "¿Se puede pagar en el sitio?", "Dá para pagar no site?", "هل يمكن الدفع في الموقع؟"),
  "השאירו פרטים לתיאום": r("Leave details to book", "Dejad datos para coordinar", "Deixe dados para agendar", "اتركوا بيانات للتنسيق"),
  "סקציה חצויה מקצועית": r("Professional split section", "Sección partida profesional", "Seção partida profissional", "قسم مقسوم مهني"),
  "✓ יתרון ראשון של העסק": r("✓ First business advantage", "✓ Primera ventaja del negocio", "✓ Primeira vantagem do negócio", "✓ الميزة الأولى للعمل"),
  "חדש · אתר מקצועי לעסק": r("New · a professional site for the business", "Nuevo · un sitio profesional para el negocio", "Novo · um site profissional para o negócio", "جديد · موقع مهني للعمل"),
  "חיבור לסליקה של העסק.": r("Connected to the business checkout.", "Conexión al cobro del negocio.", "Ligação à cobrança do negócio.", "ربط بتحصيل العمل."),
  "“הצלחה מתחילה בהחלטה.”": r("“Success starts with a decision.”", "“El éxito empieza con una decisión.”", "“O sucesso começa com uma decisão.”", "«النجاح يبدأ بقرار.»"),
  "✓ יתרון שני שמחזק אמון": r("✓ Second advantage that builds trust", "✓ Segunda ventaja que refuerza la confianza", "✓ Segunda vantagem que reforça a confiança", "✓ الميزة الثانية التي تعزّز الثقة"),
  "הצטרפות למועדון לקוחות": r("Join the customer club", "Uníos al club de clientes", "Entre no clube de clientes", "انضموا لنادي الزبائن"),
  "קובעים תור ישירות מהאתר": r("Book directly from the site", "Pedid cita directo desde el sitio", "Agende direto pelo site", "احجزوا موعداً مباشرة من الموقع"),
  "שם א-ת": r("Name A–Z", "Nombre A–Z", "Nome A–Z", "الاسم أ–ي"),
  "מה תרצו למדוד או לאיזה אירוע?": r(
    "What would you like to try on, or which event?",
    "¿Qué queréis probaros, o para qué evento?",
    "O que você quer provar, ou para qual evento?",
    "ماذا تريدون قياسه، أو لأي مناسبة؟",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique92.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique92 rows`);
