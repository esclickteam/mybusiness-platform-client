/**
 * unique77 — leftover section-variant HTML sentences after unique76.
 * Skip interpolations, personal names, streets, cities, Admin/Staff, one-letter keys.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "שלום, ראיתי את המבצע באתר.": r("Hello, I saw the promo on the site.", "Hola, vi la oferta en el sitio.", "Olá, vi a oferta no site.", "مرحباً، رأيت العرض في الموقع."),
  "אנשים מקצועיים שמייצרים תוצאה": r("Professional people who produce a result", "Personas profesionales que generan un resultado", "Pessoas profissionais que geram um resultado", "ناس مهنيون يصنعون نتيجة"),
  "בוט חכם עם נראות של מותג גדול": r("A smart bot with the look of a big brand", "Un bot inteligente con presencia de marca grande", "Um bot inteligente com presença de marca grande", "بوت ذكي بحضور علامة كبيرة"),
  "בשמחה! אפשר להשאיר שם וטלפון?": r("Gladly! Can I leave a name and phone?", "¡Con gusto! ¿Puedo dejar nombre y teléfono?", "Com prazer! Posso deixar nome e telefone?", "بسرور! يمكن ترك اسم وهاتف؟"),
  "הצצה לתוצאות, לאווירה ולחוויה": r("A peek at the results, the atmosphere, and the experience", "Una mirada a los resultados, la atmósfera y la experiencia", "Uma olhada nos resultados, na atmosfera e na experiência", "لمحة على النتائج والأجواء والتجربة"),
  "הרשמה שנראית כמו מותג פרימיום": r("Signup that looks like a premium brand", "Un registro que parece una marca premium", "Uma inscrição que parece uma marca premium", "تسجيل يبدو كعلامة فاخرة"),
  "חודש ראשון במערכת במחיר מיוחד": r("First month in the system at a special price", "Primer mes en el sistema a un precio especial", "Primeiro mês no sistema a um preço especial", "الشهر الأول في المنظومة بسعر خاص"),
  "טקסט שמקבל כוח מתמונה מקצועית": r("Text that gets force from a professional photo", "Texto que gana fuerza con una foto profesional", "Texto que ganha força com uma foto profissional", "نص يكتسب قوة من صورة مهنية"),
  "טקסט שמתחזק עם נתונים אמיתיים": r("Text strengthened by real numbers", "Texto que se refuerza con datos reales", "Texto que se reforça com dados reais", "نص يتقوّى ببيانات حقيقية"),
  "כל היתרונות החשובים במקום אחד": r("All the important benefits in one place", "Todas las ventajas importantes en un solo lugar", "Todas as vantagens importantes em um só lugar", "كل المزايا المهمة في مكان واحد"),
  "לקוחות מספרים למה הם בחרו בנו": r("Customers tell why they chose us", "Los clientes cuentan por qué nos eligieron", "Os clientes contam por que nos escolheram", "زبائن يروون لماذا اختارونا"),
  "לתת שירות מדויק שמוביל לתוצאה": r("To give precise service that leads to a result", "Dar un servicio preciso que lleva a un resultado", "Dar um serviço preciso que leva a um resultado", "تقديم خدمة دقيقة تقود إلى نتيجة"),
  "מחובר · עונה ללקוחות בזמן אמת": r("Connected · answers customers in real time", "Conectado · responde a clientes en tiempo real", "Conectado · responde a clientes em tempo real", "متصل · يجيب الزبائن في الوقت الحقيقي"),
  "מלאו פרטים ואשרו הגעה לאירוע.": r("Fill in details and confirm you are coming.", "Rellenad datos y confirmad la asistencia al evento.", "Preencha os dados e confirme a presença no evento.", "املأوا البيانات وأكّدوا الحضور للفعالية."),
  "סיפור עסקי שמייצר חיבור ואמון": r("A business story that creates connection and trust", "Una historia de negocio que genera vínculo y confianza", "Uma história de negócio que gera conexão e confiança", "قصة عمل تصنع ارتباطاً وثقة"),
  "קבלו גישה ראשונים לכל מה שחדש": r("Get first access to everything new", "Recibid acceso primero a todo lo nuevo", "Receba acesso primeiro a tudo o que é novo", "احصلوا على وصول أول لكل ما هو جديد"),
  "קבלו הטבות ועדכונים לפני כולם": r("Get offers and updates before everyone else", "Recibid ofertas y novedades antes que nadie", "Receba ofertas e novidades antes de todo mundo", "احصلوا على عروض وتحديثات قبل الجميع"),
  "קבלו מדריך חינמי ישירות למייל": r("Get a free guide straight to your inbox", "Recibid una guía gratuita directo al correo", "Receba um guia gratuito direto no e-mail", "احصلوا على دليل مجاني مباشرة إلى البريد"),
  "רשימה שנראית כמו מותג פרימיום": r("A list that looks like a premium brand", "Una lista que parece una marca premium", "Uma lista que parece uma marca premium", "قائمة تبدو كعلامة فاخرة"),
  "שאלה על מוצר, משלוח או הזמנה?": r("A question about a product, shipping, or an order?", "¿Una pregunta sobre producto, envío o pedido?", "Uma pergunta sobre produto, entrega ou pedido?", "سؤال عن منتج أو شحن أو طلب؟"),
  "שירותים שמייצרים חוויה ותוצאה": r("Services that produce experience and a result", "Servicios que generan experiencia y resultado", "Serviços que geram experiência e resultado", "خدمات تصنع تجربة ونتيجة"),
  "שמחים להזמין אתכם לחגוג איתנו": r("We are glad to invite you to celebrate with us", "Os invitamos con gusto a celebrar con nosotros", "Temos prazer em convidar você para celebrar conosco", "يسعدنا دعوتكم للاحتفال معنا"),
  "תהליך ברור שמייצר חוויה בטוחה": r("A clear process that creates a safe experience", "Un proceso claro que genera una experiencia segura", "Um processo claro que gera uma experiência segura", "مسار واضح يصنع تجربة آمنة"),
  "תהליך פשוט וברור בשלושה שלבים": r("A simple, clear process in three steps", "Un proceso simple y claro en tres pasos", "Um processo simples e claro em três etapas", "مسار بسيط وواضح بثلاث خطوات"),
  "תנו לאתר לעבוד גם כשהעסק סגור": r("Let the site work even when the business is closed", "Dejad que el sitio trabaje también cuando el negocio está cerrado", "Deixe o site trabalhar mesmo com o negócio fechado", "دعوا الموقع يعمل حتى عندما يكون العمل مغلقاً"),
  "אתר שנראה חזק כבר מהרגע הראשון": r("A site that looks strong from the first moment", "Un sitio que se ve fuerte ya desde el primer momento", "Um site que parece forte desde o primeiro momento", "موقع يبدو قوياً من اللحظة الأولى"),
  "בוחרים שירות וקובעים שעה פנויה": r("Choose a service and pick an open time", "Elegís un servicio y reserváis una hora libre", "Escolha um serviço e reserve um horário livre", "تختارون خدمة وتحجزون ساعة متاحة"),
  "בשמחה! איזה שירות מעניין אותך?": r("Gladly! Which service interests you?", "¡Con gusto! ¿Qué servicio os interesa?", "Com prazer! Qual serviço interessa a você?", "بسرور! أي خدمة تهمكم؟"),
  "בשמחה! כמה משתתפים תרצו לרשום?": r("Gladly! How many guests would you like to register?", "¡Con gusto! ¿Cuántos participantes queréis registrar?", "Com prazer! Quantos participantes você quer inscrever?", "بسرور! كم مشاركاً تريدون تسجيلهم؟"),
  "הוסיפו תמונות אמיתיות של הצוות": r("Add real photos of the team", "Añadid fotos reales del equipo", "Adicione fotos reais da equipe", "أضيفوا صوراً حقيقية للفريق"),
  "הצטרפו לרשימת ההמתנה של המערכת": r("Join the system's waitlist", "Uníos a la lista de espera del sistema", "Entre na lista de espera do sistema", "انضموا لقائمة انتظار المنظومة"),
  "השאירו פרטים וקבלו הצעה מיוחדת": r("Leave details and get a special offer", "Dejad datos y recibid una oferta especial", "Deixe dados e receba uma oferta especial", "اتركوا بيانات واحصلوا على عرض خاص"),
  "השראה לקנייה דרך תמונות וסגנון": r("Shopping inspiration through photos and style", "Inspiración de compra a través de fotos y estilo", "Inspiração de compra por fotos e estilo", "إلهام للشراء عبر صور وأسلوب"),
  "טופס ברור שממיר מבקרים ללקוחות": r("A clear form that turns visitors into customers", "Un formulario claro que convierte visitas en clientes", "Um formulário claro que converte visitantes em clientes", "نموذج واضح يحوّل الزوّار إلى زبائن"),
  "כותרת טקסט חזקה שמובילה לפעולה": r("A strong text title that leads to action", "Un título de texto fuerte que lleva a la acción", "Um título de texto forte que leva à ação", "عنوان نص قوي يقود إلى إجراء"),
  "כל אחד בצוות מביא מומחיות אחרת": r("Each person on the team brings a different expertise", "Cada persona del equipo aporta otra especialidad", "Cada pessoa da equipe traz outra especialidade", "كل شخص في الفريق يجلب خبرة مختلفة"),
  "כל הפיצ׳רים החשובים במערכת אחת": r("All the important features in one system", "Todas las funciones importantes en un solo sistema", "Todos os recursos importantes em um só sistema", "كل الميزات المهمة في منظومة واحدة"),
  "כל מה שאפשר להציג ברשימת תגיות": r("Everything you can show in a tag list", "Todo lo que se puede mostrar en una lista de etiquetas", "Tudo o que se pode mostrar numa lista de tags", "كل ما يمكن عرضه في قائمة وسوم"),
  "לא רק לוגואים — גם מילים טובות": r("Not only logos — also good words", "No solo logos — también buenas palabras", "Não só logos — também boas palavras", "ليس الشعارات فقط — أيضاً كلمات طيبة"),
  "מבנה הפוך שמתאים לגיוון עמודים": r("A reversed layout that fits page variety", "Una estructura invertida que encaja en la variedad de páginas", "Uma estrutura invertida que combina com a variedade de páginas", "بنية معكوسة تناسب تنوّع الصفحات"),
  "מבצע החודש · קביעת תור אונליין": r("This month's promo · book online", "Oferta del mes · reserva online", "Oferta do mês · agendamento online", "عرض الشهر · حجز موعد أونلاين"),
  "מוצר אחד שמקבל את כל תשומת הלב": r("One product that gets all the attention", "Un producto que recibe toda la atención", "Um produto que recebe toda a atenção", "منتج واحد يأخذ كل الانتباه"),
  "מלאו פרטים ונחזור אליכם בהקדם.": r("Fill in details and we will get back to you soon.", "Rellenad datos y os responderemos pronto.", "Preencha os dados e voltaremos em breve.", "املأوا البيانات وسنعود إليكم قريباً."),
  "סקשן בסיסי שנראה כמו מותג גדול": r("A basic section that looks like a big brand", "Una sección básica que parece una marca grande", "Uma seção básica que parece uma marca grande", "قسم أساسي يبدو كعلامة كبيرة"),
  "עמוד פתיחה שנראה כמו מותג גדול": r("An opening page that looks like a big brand", "Una página de apertura que parece una marca grande", "Uma página de abertura que parece uma marca grande", "صفحة افتتاح تبدو كعلامة كبيرة"),
  "עסק מקצועי, ברור ונגיש ללקוחות": r("A professional business, clear and accessible to customers", "Un negocio profesional, claro y accesible para clientes", "Um negócio profissional, claro e acessível aos clientes", "عمل مهني وواضح ومتاح للزبائن"),
  "צריכים עזרה? שלחו פנייה מסודרת": r("Need help? Send a clear inquiry", "¿Necesitáis ayuda? Enviad una consulta ordenada", "Precisa de ajuda? Envie um contato organizado", "تحتاجون مساعدة؟ أرسلوا تواصلاً مرتّباً"),
  "רוצים שגם העסק שלכם יופיע כאן?": r("Want your business to appear here too?", "¿Queréis que también aparezca aquí vuestro negocio?", "Quer que o seu negócio também apareça aqui?", "تريدون أن يظهر عملكم هنا أيضاً؟"),
  "שלום, אני רוצה לדעת על השירות.": r("Hello, I want to know about the service.", "Hola, quiero saber sobre el servicio.", "Olá, quero saber sobre o serviço.", "مرحباً، أريد معرفة الخدمة."),
  "אנשים נוספים שמובילים את השירות": r("More people who lead the service", "Más personas que lideran el servicio", "Mais pessoas que lideram o serviço", "ناس إضافيون يقودون الخدمة"),
  "ביקורות שמחזקות את ההחלטה לקנות": r("Reviews that strengthen the decision to buy", "Reseñas que refuerzan la decisión de comprar", "Avaliações que reforçam a decisão de comprar", "تقييمات تعزّز قرار الشراء"),
  "בשמחה! אפשר לשלוח לי כמה פרטים?": r("Gladly! Can you send me a few details?", "¡Con gusto! ¿Podéis enviarme algunos datos?", "Com prazer! Pode me enviar alguns detalhes?", "بسرور! يمكن إرسال بعض التفاصيل لي؟"),
  "הוסיפו תמונות אמיתיות לכל שירות": r("Add real photos for every service", "Añadid fotos reales a cada servicio", "Adicione fotos reais a cada serviço", "أضيفوا صوراً حقيقية لكل خدمة"),
  "הטבה פשוטה וברורה ללקוחות חדשים": r("A simple, clear offer for new customers", "Una oferta simple y clara para clientes nuevos", "Uma oferta simples e clara para clientes novos", "عرض بسيط وواضح للزبائن الجدد"),
  "הפכו כניסות לאתר לפניות אמיתיות": r("Turn site visits into real inquiries", "Convertid las visitas al sitio en consultas reales", "Transforme visitas ao site em contatos reais", "حوّلوا زيارات الموقع إلى تواصل حقيقي"),
  "טיפול / שירות ראשון במחיר מיוחד": r("First treatment / service at a special price", "Primer tratamiento / servicio a un precio especial", "Primeiro tratamento / serviço a um preço especial", "علاج / خدمة أولى بسعر خاص"),
  "כל שירות כולל מחיר, משך וזמינות": r("Every service includes price, duration, and availability", "Cada servicio incluye precio, duración y disponibilidad", "Cada serviço inclui preço, duração e disponibilidade", "كل خدمة تشمل سعراً ومدة وتوفّراً"),
  "ספרו לנו איך הייתה החוויה שלכם.": r("Tell us how your experience was.", "Contadnos cómo fue vuestra experiencia.", "Conte-nos como foi a sua experiência.", "أخبرونا كيف كانت تجربتكم."),
  "סרטון קצר שמסביר את חוויית הבוט": r("A short video that explains the bot experience", "Un vídeo corto que explica la experiencia del bot", "Um vídeo curto que explica a experiência do bot", "فيديو قصير يشرح تجربة البوت"),
  "עוד ועוד לקוחות מדרגים וממליצים": r("More and more customers rate and recommend", "Cada vez más clientes puntúan y recomiendan", "Cada vez mais clientes avaliam e recomendam", "المزيد من الزبائن يقيّمون ويوصون"),
  "עסקים ולקוחות שכבר סומכים עלינו": r("Businesses and customers who already trust us", "Negocios y clientes que ya confían en nosotros", "Negócios e clientes que já confiam em nós", "أعمال وزبائن يثقون بنا مسبقاً"),
  "רוצים לקבל עדכון כשיש משהו חדש?": r("Want an update when something new is out?", "¿Queréis un aviso cuando haya algo nuevo?", "Quer um aviso quando houver algo novo?", "تريدون تحديثاً عندما يكون هناك جديد؟"),
  "שירותים מקצועיים שמותאמים ללקוח": r("Professional services tailored to the customer", "Servicios profesionales adaptados al cliente", "Serviços profissionais adaptados ao cliente", "خدمات مهنية ملائمة للزبون"),
  "תיאום תורים שמתאים למותג יוקרתי": r("Booking that fits a luxury brand", "Coordinación de citas que encaja en una marca de lujo", "Agendamento que combina com uma marca de luxo", "تنسيق مواعيد يناسب علامة فاخرة"),
  "“השירות היה מקצועי, ברור ומדויק”": r("“The service was professional, clear, and precise”", "“El servicio fue profesional, claro y preciso”", "“O serviço foi profissional, claro e preciso”", "«كانت الخدمة مهنية وواضحة ودقيقة»"),
  "בונים פתרון שמתאים ללקוח ולמטרה.": r("We build a solution that fits the customer and the goal.", "Construimos una solución que encaja con el cliente y el objetivo.", "Construímos uma solução que combina com o cliente e o objetivo.", "نبني حلاً يناسب الزبون والهدف."),
  "ביקורות שמראות את החוויה האמיתית": r("Reviews that show the real experience", "Reseñas que muestran la experiencia real", "Avaliações que mostram a experiência real", "تقييمات تُظهر التجربة الحقيقية"),
  "דברו איתנו ונבנה לכם את הצעד הבא": r("Talk with us and we will build your next step", "Hablad con nosotros y os construiremos el siguiente paso", "Fale conosco e construiremos o próximo passo para você", "تحدثوا معنا وسنبني لكم الخطوة التالية"),
  "הסבירו את השירותים דרך סרטון קצר": r("Explain the services through a short video", "Explicad los servicios con un vídeo corto", "Explique os serviços com um vídeo curto", "اشرحوا الخدمات عبر فيديو قصير"),
  "הציגו גם את השירות וגם את התוצאה": r("Show both the service and the result", "Mostrad el servicio y también el resultado", "Mostre o serviço e também o resultado", "اعرضوا الخدمة والنتيجة معاً"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique77.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique77 rows`);
