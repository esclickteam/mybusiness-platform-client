/**
 * unique66 — leftover Emberplate through Tacoflare food chrome.
 * Skip chef names, streets, cities, Admin/Staff.
 * Do not add ו׳ / א׳ / ש׳ — remap those at render to שישי / ראשון / שבת.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Emberplate
  "ריב איי": r("Ribeye", "Ribeye", "Ribeye", "ريب آي"),
  "ציר הבשר": r("The meat axis", "El eje de la carne", "O eixo da carne", "محور اللحم"),
  "א׳–ה׳": r("Sun–Thu", "Dom–jue", "Dom–qui", "الأحد–الخميس"),

  // Noodlix
  "טון קוטסו": r("Tonkotsu", "Tonkotsu", "Tonkotsu", "تونكوتسو"),
  "קערות היום": r("Today's bowls", "Cuencos de hoy", "Tigelas de hoje", "أوعية اليوم"),
  "ציר איטי": r("A slow broth", "Un caldo lento", "Um caldo lento", "مرق بطيء"),
  "אטריות טריות": r("Fresh noodles", "Fideos frescos", "Macarrão fresco", "نودلز طازجة"),
  "הרכבה חמה": r("A hot assembly", "Un montaje caliente", "Uma montagem quente", "تركيب ساخن"),

  // Crustora
  דיאבלה: r("Diavola", "Diavola", "Diavola", "ديافولا"),

  // Mezzaline
  "מגש משותף": r("A shared platter", "Una bandeja compartida", "Uma bandeja compartilhada", "صينية مشتركة"),
  "״שולחן מלא צבעים — ככה נראית אהבה ים-תיכונית.״": r(
    "“A table full of color — that is how Mediterranean love looks.”",
    "“Una mesa llena de color — así se ve el amor mediterráneo.”",
    "“Uma mesa cheia de cor — assim parece o amor mediterrâneo.”",
    "«طاولة مليئة بالألوان — هكذا يبدو حب متوسطي.»",
  ),
  מהגינה: r("From the garden", "Del huerto", "Da horta", "من الحديقة"),
  "עשבי תיבול טריים כל בוקר": r(
    "Fresh herbs every morning",
    "Hierbas frescas cada mañana",
    "Ervas frescas toda manhã",
    "أعشاب طازجة كل صباح",
  ),
  "שולחן גן": r("A garden table", "Una mesa de jardín", "Uma mesa de jardim", "طاولة حديقة"),
  "מזטה · שמן זית · שולחן משותף": r(
    "Mezze · olive oil · a shared table",
    "Mezze · aceite de oliva · mesa compartida",
    "Mezze · azeite · mesa compartilhada",
    "مزة · زيت زيتون · طاولة مشتركة",
  ),

  // Sushisen
  "סשימי מורי": r("Mori sashimi", "Sashimi mori", "Sashimi mori", "ساشيمي موري"),
  "מסילת ניגירי": r("A nigiri rail", "Un raíl de nigiri", "Um trilho de nigiri", "سكة نيجيري"),
  מושבים: r("Seats", "Asientos", "Assentos", "مقاعد"),
  "דג טרי": r("Fresh fish", "Pescado fresco", "Peixe fresco", "سمك طازج"),
  "מנות יום": r("Daily dishes", "Platos del día", "Pratos do dia", "أطباق اليوم"),

  // Brunchhaus
  "רגעי בראנץ׳": r("Brunch moments", "Momentos de brunch", "Momentos de brunch", "لحظات برانش"),
  "פתק מהשף": r("A note from the chef", "Una nota del chef", "Um recado do chef", "ورقة من الشيف"),
  "הודעה קצרה": r("A short message", "Un mensaje breve", "Uma mensagem curta", "رسالة قصيرة"),

  // Tapasora
  "בנטו לילה": r("Night bento", "Bento de noche", "Bento noturno", "بنتو ليلي"),
  רוזה: r("Rosé", "Rosado", "Rosé", "روزيه"),

  // Spiceforge
  "גלגל התבלינים": r("The spice wheel", "La rueda de especias", "A roda de temperos", "عجلة التوابل"),
  "לטגן בצל": r("Fry the onion", "Freír cebolla", "Fritar cebola", "قلي البصل"),
  "להוסיף מסאלה": r("Add masala", "Añadir masala", "Adicionar masala", "إضافة ماسالا"),
  "לבשל לאט": r("Cook slowly", "Cocinar despacio", "Cozinhar devagar", "طبخ ببطء"),
  "להגיש חם": r("Serve hot", "Servir caliente", "Servir quente", "تقديم ساخناً"),

  // Streetbite
  "ערימת לילה": r("A night stack", "Una pila nocturna", "Uma pilha noturna", "كومة ليل"),
  עכשיו: r("Now", "Ahora", "Agora", "الآن"),
  מחר: r("Tomorrow", "Mañana", "Amanhã", "غداً"),
  "הקלידו הודעה...": r("Type a message...", "Escribid un mensaje...", "Digitem uma mensagem...", "اكتبوا رسالة..."),

  // Bakora
  לחמים: r("Breads", "Panes", "Pães", "خبز"),
  עוגות: r("Cakes", "Pasteles", "Bolos", "كعك"),
  "קמח T55": r("T55 flour", "Harina T55", "Farinha T55", "طحين T55"),
  "סיפור התנור": r("The oven story", "La historia del horno", "A história do forno", "قصة الفرن"),

  // Tacoflare
  סלסה: r("Salsa", "Salsa", "Salsa", "صلصة"),
  "חובב טאקוס": r("A taco fan", "Un fan de tacos", "Um fã de tacos", "محب تاكو"),
  בלוגר: r("Blogger", "Blogger", "Blogueiro", "مدوّن"),
  אורחת: r("Guest", "Invitada", "Convidada", "ضيفة"),
  ירק: r("Greens", "Verdura", "Verdura", "خضار"),
  הרכבה: r("Assembly", "Montaje", "Montagem", "تركيب"),
  "Tacoflare נפתח.": r("Tacoflare opened.", "Tacoflare abrió.", "Tacoflare abriu.", "Tacoflare افتتح."),
  "קרנה אסאדה": r("Carne asada", "Carne asada", "Carne asada", "كارنه أسادا"),
  קאמיטאס: r("Carnitas", "Carnitas", "Carnitas", "كارنيتاس"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique66.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique66 rows`);
