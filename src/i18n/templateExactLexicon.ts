export type LocaleCopy = {
  en: string;
  es: string;
  "pt-BR": string;
  ar: string;
};

function r(en: string, es: string, pt: string, ar: string): LocaleCopy {
  return { en, es, "pt-BR": pt, ar };
}

/** High-quality exact replacements for built-in template / editor demo copy. */
export const TEMPLATE_EXACT_LEXICON: Record<string, LocaleCopy> = {
  בית: r("Home", "Inicio", "Início", "الرئيسية"),
  תפריט: r("Menu", "Menú", "Cardápio", "القائمة"),
  פיצות: r("Pizzas", "Pizzas", "Pizzas", "بيتزا"),
  התנור: r("The oven", "El horno", "O forno", "الفرن"),
  גלריה: r("Gallery", "Galería", "Galeria", "معرض"),
  יומן: r("Journal", "Diario", "Diário", "يوميات"),
  אודות: r("About", "Nosotros", "Sobre", "من نحن"),
  הזמנה: r("Order", "Pedido", "Pedido", "طلب"),
  "צור קשר": r("Contact", "Contacto", "Contato", "تواصل"),
  "יצירת קשר": r("Get in touch", "Contactar", "Fale conosco", "تواصلوا معنا"),
  שירותים: r("Services", "Servicios", "Serviços", "خدمات"),
  "השירותים שלנו": r("Our services", "Nuestros servicios", "Nossos serviços", "خدماتنا"),
  המלצות: r("Testimonials", "Testimonios", "Depoimentos", "شهادات"),
  ביקורות: r("Reviews", "Reseñas", "Avaliações", "تقييمات"),
  "למידע נוסף": r("Learn more", "Más información", "Saiba mais", "اعرفوا المزيد"),
  "קבעו תור": r("Book now", "Reservar ahora", "Marcar agora", "احجزوا الآن"),
  "תאמו תור": r("Book now", "Reservar", "Agendar", "احجزوا"),
  שליחה: r("Send", "Enviar", "Enviar", "إرسال"),
  שלח: r("Send", "Enviar", "Enviar", "أرسل"),
  שם: r("Name", "Nombre", "Nome", "الاسم"),
  טלפון: r("Phone", "Teléfono", "Telefone", "الهاتف"),
  אימייל: r("Email", "Email", "E-mail", "البريد"),
  "כתובת אימייל": r("Email address", "Correo electrónico", "Endereço de e-mail", "البريد الإلكتروني"),
  הודעה: r("Message", "Mensaje", "Mensagem", "رسالة"),
  "קראו עוד": r("Read more", "Leer más", "Ler mais", "اقرأوا المزيد"),
  "התחילו עכשיו": r("Get started", "Empezar ahora", "Começar agora", "ابدأوا الآن"),
  "דברו איתנו": r("Talk to us", "Háblanos", "Falem conosco", "تحدثوا معنا"),
  "הכותרת שלך": r("Your heading", "Tu titular", "O seu título", "عنوانكم"),
  "כותרת ראשית": r("Main heading", "Titular principal", "Título principal", "العنوان الرئيسي"),
  "כותרת ענקית": r("Giant heading", "Titular gigante", "Título gigante", "عنوان ضخم"),
  "פסקה לדוגמה": r("Sample paragraph", "Párrafo de ejemplo", "Parágrafo de exemplo", "فقرة تجريبية"),
  "סקשן חדש": r("New section", "Nueva sección", "Nova seção", "قسم جديد"),
  "פתח תפריט": r("Open menu", "Abrir menú", "Abrir menu", "فتح القائمة"),
  "סגור תפריט": r("Close menu", "Cerrar menú", "Fechar menu", "إغلاق القائمة"),
  "משולשי תפריט": r("Menu triangles", "Triángulos del menú", "Triângulos do cardápio", "مثلثات القائمة"),
  "פיצה · תנור עצים": r("Pizza · wood oven", "Pizza · horno de leña", "Pizza · forno a lenha", "بيتزا · فرن حطب"),
  "בצק שנושם. אש שעובדת.": r(
    "Dough that breathes. Fire that works.",
    "Masa que respira. Fuego que trabaja.",
    "Massa que respira. Fogo que trabalha.",
    "عجينة تتنفس. نار تعمل."
  ),
  "הזמינו פיצה": r("Order pizza", "Pedir pizza", "Pedir pizza", "اطلبوا البيتزا"),
  לתפריט: r("See the menu", "Ver el menú", "Ver o cardápio", "إلى القائمة"),
  "התנור הוא הלב.": r("The oven is the heart.", "El horno es el corazón.", "O forno é o coração.", "الفرن هو القلب."),
  "פיצה חמה עד הדלת؟": r(
    "Hot pizza to your door?",
    "¿Pizza caliente a la puerta?",
    "Pizza quente até a porta?",
    "بيتزا ساخنة حتى الباب؟"
  ),
  "כתבו כתובת וכמות — נאפה ונצא לדרך.": r(
    "Write an address and quantity — we bake and go.",
    "Escribe dirección y cantidad — horneamos y salimos.",
    "Escreva morada e quantidade — assamos e saímos.",
    "اكتبوا عنواناً والكمية — نخبز وننطلق."
  ),
  "למה אצלנו": r("Why us", "Por qué nosotros", "Porque nós", "لماذا نحن"),
  "מנות חתימה": r("Signature dishes", "Platos firma", "Pratos assinatura", "أطباق التوقيع"),
  הצוות: r("The team", "El equipo", "A equipe", "الفريق"),
  "שאלות נפוצות": r("FAQ", "Preguntas frecuentes", "Perguntas frequentes", "أسئلة شائعة"),
  חנות: r("Store", "Tienda", "Loja", "متجر"),
  מוצרים: r("Products", "Productos", "Produtos", "منتجات"),
  "סל קניות": r("Shopping cart", "Carrito", "Carrinho", "سلة التسوق"),
  "דפי נחיתה": r("Landing pages", "Landing pages", "Landing pages", "صفحات هبوط"),
  עסקים: r("Business", "Negocios", "Negócios", "أعمال"),
  "עסקים ושירותים": r("Business and services", "Negocios y servicios", "Negócios e serviços", "أعمال وخدمات"),
  "אוכל ומסעדות": r("Food and restaurants", "Comida y restaurantes", "Comida e restaurantes", "طعام ومطاعم"),
  "יופי וטיפוח": r("Beauty and care", "Belleza y cuidado", "Beleza e cuidado", "جمال وعناية"),
  "נדל״ן": r("Real estate", "Inmobiliaria", "Imobiliário", "عقارات"),
  "חנויות ומסחר": r("Stores and commerce", "Tiendas y comercio", "Lojas e comércio", "متاجر وتجارة"),
  "פורטפוליו וסוכנות": r("Portfolio and agency", "Portafolio y agencia", "Portfólio e agência", "معرض أعمال ووكالة"),
  "חינוך וקורסים": r("Education and courses", "Educación y cursos", "Educação e cursos", "تعليم ودورات"),
  "תבנית אתר": r("Website template", "Plantilla de sitio", "Modelo de site", "قالب موقع"),
  "אתר עסקי מוכן": r("Ready business website", "Sitio de negocio listo", "Site de negócio pronto", "موقع أعمال جاهز"),
  "תבנית אתר מוכנה לעריכה מלאה.": r(
    "A ready website template you can fully edit.",
    "Plantilla de sitio lista para editar por completo.",
    "Modelo de site pronto para edição completa.",
    "قالب موقع جاهز للتحرير بالكامل."
  ),
  "Crustora — פיצה נפוליטנית בתנור עצים. מרגריטה קלאסית, תוספות עונתיות וקרוסט פריך.": r(
    "Crustora — Neapolitan pizza from a wood oven. Classic margherita, seasonal toppings, and a crisp crust.",
    "Crustora — pizza napolitana de horno de leña. Margarita clásica, extras de temporada y corteza crujiente.",
    "Crustora — pizza napolitana de forno a lenha. Margarita clássica, extras sazonais e crosta crocante.",
    "Crustora — بيتزا نابولية من فرن الحطب. مارغريتا كلاسيكية وإضافات موسمية وقشرة مقرمشة."
  ),
  "450 מעלות, 90 שניות, מוצרלה פרסקה — ככה נראית פיצה אמיתית. מאחורי כל מנה עומד צוות שמכיר את חומרי הגלם בשמם, בונה הכנות מוקדמות בקצב יומי ושומר על אירוח חם מהרגע שנכנסים ועד הקינוח האחרון.": r(
    "450 degrees, 90 seconds, fresh mozzarella — this is real pizza. Behind every dish is a team that knows the ingredients by name, preps daily, and keeps hospitality warm from the first step in to the last dessert.",
    "450 grados, 90 segundos, mozzarella fresca — así se ve una pizza de verdad. Detrás de cada plato hay un equipo que conoce la materia prima y mantiene una hospitalidad cálida.",
    "450 graus, 90 segundos, mozzarella fresca — assim é uma pizza de verdade. Por trás de cada prato há uma equipe que conhece os ingredientes e mantém uma hospitalidade quente.",
    "450 درجة، 90 ثانية، موتزاريلا طازجة — هكذا تبدو البيتزا الحقيقية. خلف كل طبق فريق يعرف المواد ويحافظ على ضيافة دافئة."
  ),
  "שלוש סיבות ש-Crustora מרגישה אחרת": r(
    "Three reasons Crustora feels different",
    "Tres razones por las que Crustora se siente distinta",
    "Três razões pelas quais a Crustora é diferente",
    "ثلاث أسباب تجعل Crustora مختلفة"
  ),
  "חומרי גלם שמתאימים לפיצה": r(
    "Ingredients made for pizza",
    "Ingredientes pensados para pizza",
    "Ingredientes pensados para pizza",
    "مكونات مناسبة للبيتزا"
  ),
  "קצב מטבח פתוח": r("Open-kitchen pace", "Ritmo de cocina abierta", "Ritmo de cozinha aberta", "إيقاع مطبخ مفتوح"),
  "אירוח עם קשב": r("Attentive hospitality", "Hospitalidad atenta", "Hospitalidade atenta", "ضيافة منتبهة"),
  "הטעמים שמובילים את Crustora": r(
    "The flavors that lead Crustora",
    "Los sabores que lideran Crustora",
    "Os sabores que lideram a Crustora",
    "النكهات التي تقود Crustora"
  ),
  "רגעים מהמטבח ומהשולחן": r(
    "Moments from the kitchen and the table",
    "Momentos de la cocina y la mesa",
    "Momentos da cozinha e da mesa",
    "لحظات من المطبخ والمائدة"
  ),
  "האנשים מאחורי Crustora": r(
    "The people behind Crustora",
    "Las personas detrás de Crustora",
    "As pessoas por trás da Crustora",
    "الأشخاص خلف Crustora"
  ),
  "שפית ראשית": r("Head chef", "Chef principal", "Chef principal", "الشيف الرئيسية"),
  "רעבים؟": r("Hungry?", "¿Con hambre?", "Com fome?", "جائعون؟"),
  "שמרו מקום ב-Crustora": r(
    "Reserve a table at Crustora",
    "Reservad mesa en Crustora",
    "Reservem mesa na Crustora",
    "احجزوا طاولة في Crustora"
  ),
  "₪62 · קלאסיקה": r("₪62 · classic", "₪62 · clásico", "₪62 · clássico", "₪62 · كلاسيكي"),
  "₪74 · חריף": r("₪74 · spicy", "₪74 · picante", "₪74 · picante", "₪74 · حار"),
  "₪78 · עונתי": r("₪78 · seasonal", "₪78 · de temporada", "₪78 · sazonal", "₪78 · موسمي"),
  "עגבנייה, בזיליקום, מוצרלה.": r(
    "Tomato, basil, mozzarella.",
    "Tomate, albahaca, mozzarella.",
    "Tomate, manjericão, mozzarella.",
    "طماطم، ريحان، موتزاريلا."
  ),
  מדריך: r("Guide", "Guía", "Guia", "دليل"),
  סיפור: r("Story", "Historia", "História", "قصة"),
  טיפים: r("Tips", "Consejos", "Dicas", "نصائح"),
  כתובת: r("Address", "Dirección", "Morada", "العنوان"),
  "תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם.": r(
    "Thanks! We received your inquiry and will get back to you shortly.",
    "¡Gracias! Recibimos tu consulta y te responderemos pronto.",
    "Obrigado! Recebemos o pedido e respondemos em breve.",
    "شكراً! استلمنا طلبكم وسنعود إليكم قريباً."
  ),
  "450° · 90 שניות · תנור עצים": r(
    "450° · 90 seconds · wood oven",
    "450° · 90 segundos · horno de leña",
    "450° · 90 segundos · forno a lenha",
    "450° · 90 ثانية · فرن حطب"
  ),
  "השתמשי בתבנית": r("Use this template", "Usar esta plantilla", "Usar este modelo", "استخدمن هذا القالب"),
  "חזרה לתבניות": r("Back to templates", "Volver a plantillas", "Voltar aos modelos", "العودة للقوالب"),
  "יומן פגישות מה-CRM": r("CRM appointment calendar", "Calendario de citas del CRM", "Calendário de reuniões do CRM", "تقويم مواعيد نظام الإدارة"),
  ניווט: r("Navigation", "Navegación", "Navegação", "تنقل"),
  פוטר: r("Footer", "Pie", "Rodapé", "تذييل"),
  כותרת: r("Header", "Encabezado", "Cabeçalho", "ترويسة"),
  קולקציות: r("Collections", "Colecciones", "Coleções", "مجموعات"),
  סל: r("Cart", "Carrito", "Carrinho", "سلة"),
  שאלות: r("FAQ", "Preguntas", "Perguntas", "أسئلة"),
  משלוחים: r("Shipping", "Envíos", "Envios", "شحن"),
  לוקבוק: r("Lookbook", "Lookbook", "Lookbook", "كتالوج"),
  מגזין: r("Magazine", "Revista", "Revista", "مجلة"),
  קשר: r("Contact", "Contacto", "Contato", "تواصل"),
  מוצר: r("Product", "Producto", "Produto", "منتج"),
  "בחירת וריאציה": r("Choose a variant", "Elige una variante", "Escolha uma variação", "اختيار النوع"),
  "לגלות מוצרים": r("Discover products", "Descubrir productos", "Descobrir produtos", "اكتشفوا المنتجات"),
  "קולקציה חדשה": r("New collection", "Nueva colección", "Nova coleção", "مجموعة جديدة"),
  "מציג את המוצרים מניהול החנות שלך": r(
    "Showing products from your store manager",
    "Mostrando productos de tu gestor de tienda",
    "A mostrar produtos do gestor da loja",
    "عرض المنتجات من مدير متجركم"
  ),
  "מצב דמו — הוסיפו מוצרים בפאנל חנות בעורך כדי להחליף את הדוגמאות": r(
    "Demo mode — add products in the store panel to replace these samples",
    "Modo demo — añade productos en el panel de tienda para reemplazar los ejemplos",
    "Modo demo — adicione produtos no painel da loja para substituir os exemplos",
    "وضع تجريبي — أضيفوا منتجات من لوحة المتجر لاستبدال هذه الأمثلة"
  ),
  "לקביעת ייעוץ": r("Book a consultation", "Reservar consulta", "Marcar consultoria", "احجزوا استشارة"),
  "לקביעת תור": r("Book an appointment", "Reservar cita", "Marcar horário", "احجزوا موعداً"),
  "לקביעת שיחת היכרות": r("Book an intro call", "Reservar llamada inicial", "Marcar chamada inicial", "احجزوا مكالمة تعارف"),
  "לקביעת תור אישי": r("Book a personal appointment", "Reservar cita personal", "Marcar horário pessoal", "احجزوا موعداً شخصياً"),
  "לראות שירותים": r("See services", "Ver servicios", "Ver serviços", "رؤية الخدمات"),
  ייעוץ: r("Consultation", "Consulta", "Consultoria", "استشارة"),
  מחירון: r("Price list", "Lista de precios", "Lista de preços", "قائمة أسعار"),
  בלוג: r("Blog", "Blog", "Blog", "مدونة"),
  סלון: r("Salon", "Salón", "Salão", "صالون"),
  "לפרטים נוספים": r("More details", "Más detalles", "Mais detalhes", "المزيد من التفاصيل"),
  "שם מלא": r("Full name", "Nombre completo", "Nome completo", "الاسم الكامل"),
  "ברוכים הבאים": r("Welcome", "Bienvenidos", "Bem-vindos", "أهلاً وسهلاً"),
  "בואו נדבר": r("Let's talk", "Hablemos", "Vamos conversar", "لنتحدث"),
  "פתרונות חכמים לעסק": r(
    "Smart solutions for your business",
    "Soluciones inteligentes para tu negocio",
    "Soluções inteligentes para o seu negócio",
    "حلول ذكية لأعمالكم"
  ),
  "שליחת פנייה": r("Send inquiry", "Enviar consulta", "Enviar pedido", "إرسال استفسار"),
  "נשמח לשמוע מכם": r("We'd love to hear from you", "Nos encantará saber de ti", "Adoraríamos ouvir vocês", "يسعدنا سماعكم"),
  חדש: r("New", "Nuevo", "Novo", "جديد"),
  כלול: r("Included", "Incluido", "Incluído", "مشمول"),
  "חבילות ברורות, בלי אותיות קטנות.": r(
    "Clear packages, no fine print.",
    "Paquetes claros, sin letra pequeña.",
    "Pacotes claros, sem letras miúdas.",
    "باقات واضحة بلا حروف صغيرة."
  ),
  "חבילות ברורות לטיפולים, אירועים ותחזוקה חודשית.": r(
    "Clear packages for treatments, events, and monthly care.",
    "Paquetes claros para tratamientos, eventos y cuidado mensual.",
    "Pacotes claros para tratamentos, eventos e cuidado mensal.",
    "باقات واضحة للعلاجات والمناسبات والعناية الشهرية."
  ),
  "תמונות אווירה, טיפולים ותוצאות מתוך הסלון.": r(
    "Atmosphere photos, treatments, and results from the salon.",
    "Fotos de ambiente, tratamientos y resultados del salón.",
    "Fotos de ambiente, tratamentos e resultados do salão.",
    "صور أجواء وعلاجات ونتائج من الصالون."
  ),
  "מוצרי טיפוח משלימים לחוויית סלון גם בבית.": r(
    "Care products that bring the salon experience home.",
    "Productos de cuidado que llevan el salón a casa.",
    "Produtos de cuidado que levam o salão para casa.",
    "منتجات عناية تنقل تجربة الصالون إلى البيت."
  ),
  "טיפים, מדריכים ורעיונות לטיפוח, שיער ואיפור.": r(
    "Tips, guides, and ideas for care, hair, and makeup.",
    "Consejos, guías e ideas de cuidado, cabello y maquillaje.",
    "Dicas, guias e ideias de cuidado, cabelo e maquilhagem.",
    "نصائح وأدلة وأفكار للعناية والشعر والمكياج."
  ),
  שינורה: r("Shinora", "Shinora", "Shinora", "شينورا"),
  "להבליט את היופי שלך ולתת לך לזהור": r(
    "Bring out your beauty and let it glow",
    "Resalta tu belleza y deja que brille",
    "Realce a sua beleza e deixe-a brilhar",
    "أبرزوا جمالك ودعوه يتألق"
  ),
  "אנחנו מאמינות שכל לקוחה צריכה יחס אישי, אבחון מדויק וטיפול שמותאם בדיוק לעור, לשיער ולסגנון שלה — כדי לצאת מהסלון רעננה, בטוחה וזוהרת.": r(
    "We believe every client deserves personal attention, a precise diagnosis, and a treatment matched to her skin, hair, and style — so she leaves the salon fresh, confident, and glowing.",
    "Creemos que cada clienta merece atención personal, un diagnóstico preciso y un tratamiento a su piel, cabello y estilo — para salir del salón fresca, segura y radiante.",
    "Acreditamos que cada cliente merece atenção pessoal, um diagnóstico preciso e um tratamento à pele, ao cabelo e ao estilo — para sair do salão fresca, confiante e radiante.",
    "نؤمن أن كل عميلة تستحق اهتماماً شخصياً وتشخيصاً دقيقاً وعلاجاً يناسب بشرتها وشعرها وأسلوبها — لتخرج من الصالون منتعشة وواثقة ومتألقة."
  ),
  "אבחון קצר לפני טיפול": r(
    "A short diagnosis before treatment",
    "Un diagnóstico breve antes del tratamiento",
    "Um diagnóstico breve antes do tratamento",
    "تشخيص قصير قبل العلاج"
  ),
};
