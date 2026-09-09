import { describe, expect, it } from "vitest";
import {
  localizeBuiltInTemplateSeed,
  localizeBuiltInText,
  localizeLibraryInsertStyle,
} from "./localizeBuiltInTemplateSeed";

describe("localizeBuiltInTemplateSeed", () => {
  it("keeps Hebrew source when the dashboard language is Hebrew", () => {
    expect(localizeBuiltInText("צור קשר", "he")).toBe("צור קשר");
  });

  it("translates built-in demo phrases without touching unknown customer copy", () => {
    expect(localizeBuiltInText("צור קשר", "en")).toBe("Contact");
    expect(localizeBuiltInText("Custom headline from the client", "en")).toBe(
      "Custom headline from the client",
    );
  });

  it("replaces longer phrases before shorter ones", () => {
    expect(localizeBuiltInText("שאלות נפוצות", "en")).toBe("FAQ");
  });

  it("walks nested default seed objects", () => {
    expect(
      localizeBuiltInTemplateSeed(
        { nav: { contact: "צור קשר" }, title: "שירותים" },
        "es",
      ),
    ).toEqual({ nav: { contact: "Contacto" }, title: "Servicios" });
  });

  it("localizes a restaurant template seed for each dashboard language", () => {
    const seed = {
      heroEyebrow: "פיצה · תנור עצים",
      heroPrimary: "הזמינו פיצה",
      navContact: "צור קשר",
    };
    expect(localizeBuiltInTemplateSeed(seed, "en").heroPrimary).toBe("Order pizza");
    expect(localizeBuiltInTemplateSeed(seed, "es").navContact).toBe("Contacto");
    expect(localizeBuiltInTemplateSeed(seed, "pt-BR").heroEyebrow).toBe("Pizza · forno a lenha");
    expect(localizeBuiltInTemplateSeed(seed, "ar").heroPrimary).toBe("اطلبوا البيتزا");
    expect(localizeBuiltInTemplateSeed(seed, "he").heroPrimary).toBe("הזמינו פיצה");
  });

  it("uses quality lexicon copy instead of leftover-Hebrew phrasebook rows", () => {
    expect(localizeBuiltInText("הזמינו פיצה", "en")).toBe("Order pizza");
    expect(localizeBuiltInText("פיצה · תנור עצים", "en")).toBe("Pizza · wood oven");
    expect(localizeBuiltInText("הזמינו פיצה", "ar")).toBe("اطلبوا البيتزا");
  });

  it("does not smash leftover Hebrew into hybrid sentences", () => {
    const smashed = localizeBuiltInText(
      "אנחנו מאמינות שכל לקוחה צריכה יחס אישי, אבחון מדויק וטיפול שמותאם בדיוק לעור, לשיער ולסגנון שלה — כדי לצאת מהסלון רעננה, בטוחה וזוהרת.",
      "en",
    );
    expect(smashed).not.toMatch(/Client/);
    expect(smashed).toMatch(/personal attention|client/i);
  });

  it("translates booking CTAs without leftover Hebrew", () => {
    expect(localizeBuiltInText("לקביעת ייעוץ", "en")).toBe("Book a consultation");
    expect(localizeBuiltInText("לקביעת תור", "es")).toBe("Reservar cita");
    expect(localizeBuiltInText("לראות שירותים", "pt-BR")).toBe("Ver serviços");
    expect(localizeBuiltInText("לקביעת ייעוץ", "ar")).toBe("احجزوا استشارة");
    expect(localizeBuiltInText("לקביעת ייעוץ", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("uses the generated exact lexicon for gallery template descriptions", () => {
    expect(
      localizeBuiltInText(
        "תבנית פיצרייה: הירו באלכסון עם פיצה מסתובבת, תפריט כבלוקי משולשים, רצועת חום תנור וטופס כרטיס הזמנה — אבק קמח ואנימציית stretch.",
        "en",
      ),
    ).toMatch(/pizzeria template/i);
  });

  it("localizes store chrome and studio library defaults", () => {
    expect(localizeBuiltInText("הסל שלכם", "en")).toBe("Your cart");
    expect(localizeBuiltInText("משלוח מהיר", "es")).toBe("Envío rápido");
    expect(localizeBuiltInText("תשלום מאובטח", "pt-BR")).toBe("Pagamento seguro");
    expect(localizeBuiltInText("קורות חיים", "en")).toBe("Resume");
    expect(localizeBuiltInText("טבלת מחירים", "ar")).toBe("جدول أسعار");
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).toMatch(/Home page/i);
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).toMatch(/Split opening/i);
    expect(localizeBuiltInText("הסל שלכם", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("rewrites baked-in RTL markup for LTR dashboard languages", () => {
    const html =
      '<table style="direction:rtl;text-align:right"><th>פריט</th></table>';
    const en = localizeBuiltInText(html, "en");
    expect(en).toMatch(/direction:ltr/);
    expect(en).toMatch(/text-align:start/);
    expect(en).toMatch(/Item/);
    expect(en).not.toMatch(/direction:rtl/);
    const he = localizeBuiltInText(html, "he");
    expect(he).toMatch(/direction:rtl/);
    expect(he).toMatch(/פריט/);
  });

  it("localizes HTML text nodes without letting leftover names block the rest", () => {
    const html =
      '<html lang="he" dir="rtl"><p>הדר עשת ביוטי</p><a>צור קשר</a></html>';
    const en = localizeBuiltInText(html, "en");
    expect(en).toMatch(/lang="en"/);
    expect(en).toMatch(/dir="ltr"/);
    expect(en).toMatch(/Contact/);
    expect(en).toMatch(/הדר עשת ביוטי/);
    expect(en).not.toMatch(/צור קשר/);
  });

  it("does not smash short hero lines into broken word-by-word English", () => {
    expect(localizeBuiltInText("לילה קטן. טעמים גדולים.", "en")).toBe(
      "A small night. Big flavors.",
    );
    expect(localizeBuiltInText("הזמינו בר", "en")).toBe("Book the bar");
    expect(localizeBuiltInText("בוקר שנמשך עד הצהריים.", "en")).toBe(
      "A morning that lasts until noon.",
    );
  });

  it("translates shared restaurant and course defaultData sentences", () => {
    expect(
      localizeBuiltInText("ספרו לנו מתי אתם מגיעים, כמה סועדים ומה חשוב לכם — ואנחנו נכין את השולחן.", "en"),
    ).toMatch(/Tell us when you are coming/i);
    expect(localizeBuiltInText("איך נרשמים?", "es")).toBe("¿Cómo me inscribo?");
    expect(localizeBuiltInText("אפשר ללמוד מרחוק?", "pt-BR")).toBe("Dá para estudar à distância?");
    expect(
      localizeBuiltInText("מהתוסף חנות בניהול העסק — ברגע שמוסיפים מוצרים הם נמשכים אוטומטית.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("translates store hero copy without leftover Hebrew hybrids", () => {
    const hero = localizeBuiltInText(
      "מצעים ובדים שנבחרים לפי מגע, לא רק לפי צבע.",
      "en",
    );
    expect(hero).toMatch(/Bedding and fabrics chosen by touch/i);
    expect(hero).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("דרופ. קורט. תרבות.", "en")).toBe(
      "Drop. Court. Culture.",
    );
    expect(localizeBuiltInText("הסל שלכם", "he")).toBe("הסל שלכם");
  });

  it("rewrites library insert styles to follow the dashboard language", () => {
    expect(
      localizeLibraryInsertStyle(
        { direction: "rtl", textAlign: "right", color: "#111" },
        "en",
      ),
    ).toEqual({ direction: "ltr", textAlign: "start", color: "#111" });
    expect(
      localizeLibraryInsertStyle(
        { direction: "rtl", textAlign: "right" },
        "he",
      ),
    ).toEqual({ direction: "rtl", textAlign: "right" });
    expect(
      localizeLibraryInsertStyle(
        { direction: "rtl", textAlign: "right" },
        "ar",
      ),
    ).toEqual({ direction: "rtl", textAlign: "start" });
  });

  it("translates remaining unique hero and CTA defaultData", () => {
    expect(localizeBuiltInText("למנות", "en")).toBe("See the dishes");
    expect(localizeBuiltInText("קבעו ביקור", "es")).toBe("Reserven una visita");
    expect(localizeBuiltInText("בדקו זמינות", "en")).toMatch(/availability|available/i);
    expect(localizeBuiltInText("לתיאום פגישה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("הצעד הבא בלמידה מתחיל בשיחה קצרה — בלי התחייבות.", "en"),
    ).toMatch(/next step|short conversation/i);
    expect(localizeBuiltInText("אבחון לפני התחלה", "pt-BR")).toMatch(/Diagnóstico/i);
    expect(localizeBuiltInText("ביטול עד 24 שעות ללא חיוב", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שנות ניסיון", "en")).toBe("Years of experience");
    expect(localizeBuiltInText("שעות פעילות", "es")).toMatch(/Horario/i);
    expect(localizeBuiltInText("לצפייה בתפריט", "en")).toBe("See the menu");
    expect(localizeBuiltInText("משלוחים והחזרות", "en")).toBe("Shipping and returns");
    expect(localizeBuiltInText("צריכים עזרה בבחירה?", "es")).toMatch(/ayuda/i);
    expect(localizeBuiltInText("45-75 דק׳", "en")).toBe("45-75 min");
    expect(localizeBuiltInText("משך משוער", "es")).toMatch(/Duraci[oó]n/i);
    expect(localizeBuiltInText("קבלת פנים", "en")).toBe("Reception");
    expect(localizeBuiltInText("מומחית", "pt-BR")).toBe("Especialista");
    expect(localizeBuiltInText("שם המותג", "en")).toBe("Brand name");
    expect(localizeBuiltInText("רעבים?", "en")).toBe("Hungry?");
    expect(
      localizeBuiltInText(
        "לא מתחילות טיפול לפני התאמת ציפיות ותיעוד מלא.",
        "en",
      ),
    ).toMatch(/expectations|notes/i);
    expect(
      localizeBuiltInText("טוען מוצרים מתוסף החנות...", "ar"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שיחה", "en")).toBe("Consult");
    expect(
      localizeBuiltInText(
        "הקמנו מקום שמקשיב קודם כל לאדם שמולנו, לפני בחירת צבע, חומר או פרוטוקול.",
        "en",
      ),
    ).toMatch(/listens|person/i);
    expect(localizeBuiltInText("רגליים מלאות", "en")).toBe("Full legs");
    expect(
      localizeBuiltInText(
        "שעווה רכה ותוצאה אחידה. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מוצר אביזרים מתוך קטלוג Sportifya.", "en")).toBe(
      "Accessories product from the Sportifya catalog.",
    );
    expect(localizeBuiltInText("מוצר ירקות מתוך קטלוג Greenbite.", "es")).toMatch(
      /verduras|Greenbite/i,
    );
    expect(localizeBuiltInText("הסיפור של Burgerhaus.", "en")).toBe(
      "The story of Burgerhaus.",
    );
    expect(localizeBuiltInText("נולדנו מהקמח.", "en")).toBe(
      "We were born from flour.",
    );
    expect(localizeBuiltInText("רפואה רגועה,\nמדויקת ואנושית.", "es")).toMatch(
      /Medicina/i,
    );
    expect(localizeBuiltInText("דרופ חצות", "en")).toBe("Midnight drop");
    expect(localizeBuiltInText("חדש בקולקציה", "en")).toBe("New in the collection");
    expect(localizeBuiltInText("הוסף לסל", "es")).toMatch(/carrito/i);
    expect(localizeBuiltInText("נעל אימון מתוך קטלוג Soleora — נעליים.", "en")).toBe(
      "Training shoe from the Soleora catalog — shoes.",
    );
    expect(
      localizeBuiltInText("Playora · כיף ברמה גבוהה. · מוצרים מתוסף החנות", "es"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סגור", "en")).toBe("Close");
    expect(
      localizeBuiltInText("אתר מלא לסוכנות פרסום: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("בר צבע לשיער: בליאז׳, גוונים, תיקוני צבע וברק.", "pt-BR"),
    ).toMatch(/balayage/i);
  });

  it("localizes store experience, project codes, dates, and unique rows", () => {
    expect(
      localizeBuiltInText("Vinora — יקב ויינות עם חוויית חנות מלאה.", "en"),
    ).toBe("Vinora — winery and wines with a full store experience.");
    expect(
      localizeBuiltInText("Vinora — יקב ויינות עם חוויית חנות מלאה.", "es"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("Vinora · יקב ויינות · Powered by Bizuply", "en"),
    ).toBe("Vinora · winery and wines · Powered by Bizuply");
    expect(localizeBuiltInText("פרויקט Alpha", "en")).toBe("Project Alpha");
    expect(localizeBuiltInText("פרויקט Beta", "es")).toBe("Proyecto Beta");
    expect(localizeBuiltInText("פרויקט Gamma", "pt-BR")).toBe("Projeto Gamma");
    expect(localizeBuiltInText("28 במאי 2026", "en")).toBe("May 28, 2026");
    expect(localizeBuiltInText("27 פברואר, 2026", "es")).toMatch(/27 de febrero de 2026/i);
    expect(localizeBuiltInText("קפה ספיישלטי", "en")).toBe("specialty coffee");
    expect(localizeBuiltInText("תאריך", "en")).toBe("Date");
    expect(localizeBuiltInText("וילות", "es")).toBe("Villas");
    expect(localizeBuiltInText("נשמח לקבל אתכם.", "en")).toMatch(/welcome/i);
    expect(localizeBuiltInText("Vinora — יקב ויינות עם חוויית חנות מלאה.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("כותרת שירות 1", "en")).toBe("Service title 1");
    expect(localizeBuiltInText("שאלה 3", "es")).toMatch(/Pregunta 3/);
    expect(localizeBuiltInText("מאי 2026", "en")).toBe("May 2026");
    expect(localizeBuiltInText("שבת 19:00", "en")).toMatch(/Saturday 19:00/);
    expect(localizeBuiltInText("15 דק׳", "en")).toBe("15 min");
    expect(
      localizeBuiltInText("בייקון סמאש — לחמנייה, בשר, גבינה — בלי פילוסופיה.", "en"),
    ).toMatch(/Bacon smash/);
    expect(
      localizeBuiltInText("בייקון סמאש — לחמנייה, בשר, גבינה — בלי פילוסופיה.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("Adspire — סוכנות פרסום עם תהליך חד ותוצאות מדידות.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("מיפוי אור, רעש, תנועה, שכנים, מגבלות וחומר מקומי.", "en"),
    ).toMatch(/light|noise|neighbors/i);
    expect(localizeBuiltInText("אזל מהמלאי", "es")).toMatch(/Agotado/i);
    expect(
      localizeBuiltInText("Lumenware — אלקטרוניקה וגאדג׳טים עם חוויית קנייה מלאה.", "en"),
    ).toMatch(/full shopping experience/i);
    expect(
      localizeBuiltInText("Lumenware — אלקטרוניקה וגאדג׳טים עם חוויית קנייה מלאה.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("א׳–ה׳ 09:00–20:00 · ו׳ 09:00–14:00", "en")).toMatch(/Sun–Thu/);
    expect(localizeBuiltInText("א׳–ה׳ 09:00–20:00 · ו׳ 09:00–14:00", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(
      localizeBuiltInText("מוס שוקולד טבעוני — מהאדמה לצלחת — בלי פשרות על טעם.", "en"),
    ).toMatch(/Vegan chocolate mousse/);
    expect(
      localizeBuiltInText("יחס עדין וסבלני שהופך את הביקור לחוויה נעימה לילדים.", "en"),
    ).toMatch(/children|gentle/i);
    expect(
      localizeBuiltInText("Influencix — סוכנות משפיענים עם חתימת creator spotlight.", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("זרימות תפעול פשוטות שחוסכות זמן ומשפרות את חוויית הלקוח.", "en"),
    ).toMatch(/operations|client experience/i);
    expect(localizeBuiltInText("שפה 01", "en")).toBe("Language 01");
    expect(localizeBuiltInText("תיק 12", "en")).toBe("Case 12");
    expect(localizeBuiltInText("סגור תפריט", "es")).toMatch(/Cerrar menú/i);
    expect(
      localizeBuiltInText("ניהול שוטף לעוסק עם נפח מסמכים קבוע ודוחות חודשיים פשוטים.", "en"),
    ).toMatch(/bookkeeping|monthly reports/i);
    expect(localizeBuiltInText("> מתחילים בדיקת היקף", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "ירושלים, מבשרת, מעלה אדומים, גוש עציון ובית שמש בתיאום מוקדם.",
        "en",
      ),
    ).toMatch(/Jerusalem/);
    expect(
      localizeBuiltInText(
        "ירושלים, מבשרת, מעלה אדומים, גוש עציון ובית שמש בתיאום מוקדם.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "הסטודיו מרגיש כמו חדר נשימה בעיר. עדין, מדויק ומאוד לא מתאמץ.",
        "es",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "מכינים תוכניות, מפרטים וספקים כדי שכל פרט יהיה ברור לפני הביצוע.",
        "en",
      ),
    ).toMatch(/plans|specs|suppliers/i);
    expect(
      localizeBuiltInText(
        "מכינים תוכניות, מפרטים וספקים כדי שכל פרט יהיה ברור לפני הביצוע.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "כן, אפשר להתחיל בחינם לגמרי וללא כרטיס אשראי, ולשדרג רק כשמוכנים.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "בית טוב לא צועק. הוא מחזיק את השקט, את האור ואת האנשים שנכנסים אליו.",
        "en",
      ),
    ).toMatch(/quiet|light/i);
    expect(
      localizeBuiltInText(
        "בית טוב לא צועק. הוא מחזיק את השקט, את האור ואת האנשים שנכנסים אליו.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לא נמצא", "en")).toBe("Not found");
    expect(
      localizeBuiltInText(
        "לא. הפגישה נועדה להבין את המקרה, לבדוק התאמה ולהציג כיווני פעולה אפשריים.",
        "es",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "היי! ברוכים הבאים ל־Novastra. צריכים עזרה לבחור קפסולה, מידה או לוק? אנחנו כאן.",
        "en",
      ),
    ).toMatch(/Welcome to Novastra/);
    expect(
      localizeBuiltInText(
        "היי! ברוכים הבאים ל־Novastra. צריכים עזרה לבחור קפסולה, מידה או לוק? אנחנו כאן.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "חנות בית ועיצוב מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.",
        "en",
      ),
    ).toMatch(/home and design|store add-on/i);
    expect(
      localizeBuiltInText(
        "חנות בית ועיצוב מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "חנות קוסמטיקה ויופי מלאה עם עמודים, תתי־עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "סינדר היא בית קלייה ושולחן טעימות. פולים טריים, חליטות מדויקות, ואווירה בלי הצגות.",
        "en",
      ),
    ).toMatch(/roast|tasting/i);
    expect(
      localizeBuiltInText(
        "סינדר היא בית קלייה ושולחן טעימות. פולים טריים, חליטות מדויקות, ואווירה בלי הצגות.",
        "es",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "אנחנו בונים חנות בית ועיצוב שמכבדת גם עיצוב וגם תפעול: קטגוריות, סינונים, עמודי מוצר וסל — והכול מחובר לתוסף החנות.",
        "en",
      ),
    ).toMatch(/home and design/i);
    expect(
      localizeBuiltInText(
        "אנחנו בונים חנות בית ועיצוב שמכבדת גם עיצוב וגם תפעול: קטגוריות, סינונים, עמודי מוצר וסל — והכול מחובר לתוסף החנות.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "תקציב, יעד, קהל, דדליין. אנחנו נחזור עם כיוון ראשוני ומה צריך לקרות כדי לבדוק אותו מהר.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "גוון טבעי בלי הלם. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).toMatch(/Natural tone without shock/i);
    expect(
      localizeBuiltInText(
        "גוון טבעי בלי הלם. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "חידוש צבע אחרי החלמה או שנה. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "en",
      ),
    ).toMatch(/Color refresh after healing/i);
    expect(
      localizeBuiltInText(
        "חידוש צבע אחרי החלמה או שנה. כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "מנות קטנות, שיחות ארוכות ויין שנשפך בנדיבות — ככה אנחנו אוהבים לילות. מאחורי כל מנה עומד צוות שמכיר את חומרי הגלם בשמם, בונה הכנות מוקדמות בקצב יומי ושומר על אירוח חם מהרגע שנכנסים ועד הקינוח האחרון.",
        "en",
      ),
    ).toMatch(/Small plates|hospitality/i);
    expect(
      localizeBuiltInText(
        "מנות קטנות, שיחות ארוכות ויין שנשפך בנדיבות — ככה אנחנו אוהבים לילות. מאחורי כל מנה עומד צוות שמכיר את חומרי הגלם בשמם, בונה הכנות מוקדמות בקצב יומי ושומר על אירוח חם מהרגע שנכנסים ועד הקינוח האחרון.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "Playora נבנתה כחנות גדולה עם עשרות סקשנים, עמודי תוכן וחיבור מלא לתוסף החנות של Bizuply.",
        "es",
      ),
    ).toMatch(/tienda grande/i);
    expect(
      localizeBuiltInText(
        "Justora נבנתה למשרדי עורכי דין שרוצים לשדר אמינות, עוצמה ומקצועיות — בלי אתר כבד, מיושן או עמוס. המבנה מוביל את הלקוח מהבעיה, דרך תחומי ההתמחות, ועד קביעת ייעוץ.",
        "en",
      ),
    ).toMatch(/law firms/i);
    expect(
      localizeBuiltInText(
        "Justora נבנתה למשרדי עורכי דין שרוצים לשדר אמינות, עוצמה ומקצועיות — בלי אתר כבד, מיושן או עמוס. המבנה מוביל את הלקוח מהבעיה, דרך תחומי ההתמחות, ועד קביעת ייעוץ.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קיבלנו את פנייתך", "en")).toBe("We received your inquiry");
    expect(localizeBuiltInText('<p>מופעל באמצעות Bizuply</p>', "es")).toMatch(/Funciona con Bizuply/);
    expect(
      localizeBuiltInText(
        "Craftora מזמינה מבוגרים ויוצרים לעבוד עם קרמיקה, צבע, נייר והדפס. הסדנאות קטנות, החומרים איכותיים, והאווירה מאפשרת לטעות, לחזור ולגלות סגנון.",
        "en",
      ),
    ).toMatch(/ceramics|workshops/i);
    expect(
      localizeBuiltInText(
        "Craftora מזמינה מבוגרים ויוצרים לעבוד עם קרמיקה, צבע, נייר והדפס. הסדנאות קטנות, החומרים איכותיים, והאווירה מאפשרת לטעות, לחזור ולגלות סגנון.",
        "pt-BR",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique16 leftover demo titles and from-price labels", () => {
    expect(localizeBuiltInText("שקית בית", "en")).toBe("Home tote bag");
    expect(localizeBuiltInText("דברו איתי", "es")).toBe("Háblame");
    expect(localizeBuiltInText("חזר למלאי", "pt-BR")).toBe("De volta ao estoque");
    expect(localizeBuiltInText("ג׳קט רחוב", "ar")).toBe("جاكيت شارع");
    expect(localizeBuiltInText("שקית בית", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החל מ־₪180", "en")).toBe("From ₪180");
    expect(localizeBuiltInText("החל מ־₪240", "es")).toBe("Desde ₪240");
    expect(localizeBuiltInText("החל מ־₪160", "pt-BR")).toBe("A partir de ₪160");
    expect(localizeBuiltInText("החל מ־₪390", "ar")).toMatch(/₪390/);
    expect(localizeBuiltInText("החל מ־₪180", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("תאריך:", "en")).toBe("Date:");
    expect(localizeBuiltInText("משימה לנציג", "en")).toBe("Task for the agent");
    expect(localizeBuiltInText("תוצאה 1", "en")).toBe("Result 1");
  });

  it("localizes unique17 rich-store demo copy and AI inspector phrases", () => {
    expect(localizeBuiltInText("סטודיו מסחר עשיר", "en")).toBe("Rich commerce studio");
    expect(localizeBuiltInText("בחירות החנות", "es")).toBe("Selección de la tienda");
    expect(localizeBuiltInText("פתיחת החנות", "pt-BR")).toBe("Abrir a loja");
    expect(localizeBuiltInText("מה חשוב לך בדירוג?", "en")).toBe("What matters in the score?");
    expect(localizeBuiltInText("כשנכנס ליד חדש", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סטודיו מסחר עשיר", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("does not rewrite saved customer copy over localized defaults", () => {
    const defaults = localizeBuiltInTemplateSeed(
      { heroTitle: "צור קשר", heroPrimary: "הזמינו פיצה" },
      "en",
    );
    const saved = {
      heroTitle: "Custom headline from the client",
      __content: { "home.hero.h1": { text: "Our edited hero" } },
    };
    const merged = { ...defaults, ...saved };
    expect(merged.heroTitle).toBe("Custom headline from the client");
    expect(merged.__content["home.hero.h1"].text).toBe("Our edited hero");
    expect(merged.heroPrimary).toBe("Order pizza");
    expect(localizeBuiltInText("Custom headline from the client", "en")).toBe(
      "Custom headline from the client",
    );
  });

  it("localizes unique18 dish suffixes and leftover sentences", () => {
    expect(localizeBuiltInText("בורגר עדשים — מהאדמה לצלחת — בלי פשרות על טעם.", "en")).toMatch(/lentil/i);
    expect(localizeBuiltInText("טארטלט לימון — סוכר כחומר גלם — לא רק מתיקות.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שיאו לונג באו — הקיטור מרים — הסל יורד לשולחן.", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מטבח שנולד מאהבה לחומר הגלם ולאנשים סביב השולחן.", "en")).toMatch(/kitchen/i);
    expect(localizeBuiltInText("כתבו כתובת, גודל ומחיר מבוקש — נחזור עם הערכה.", "pt-BR")).toMatch(/endereço/i);
    expect(localizeBuiltInText("פגישה עם {{appointment.clientName}}", "en")).toBe(
      "Appointment with {{appointment.clientName}}",
    );
    expect(localizeBuiltInText("בורגר עדשים — מהאדמה לצלחת — בלי פשרות על טעם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique19 leftover sentences, juice/melt/perfect-dish, and ASCII total", () => {
    expect(localizeBuiltInText("גזר כורכום — סחוט עכשיו — נשתייה מיד.", "en")).toMatch(/carrot/i);
    expect(localizeBuiltInText("גזר כורכום — סחוט עכשיו — נשתייה מיד.", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("וניל מדגסקר — ההמסה היא חלק מהחוויה.", "es")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("המנה של לימון אמלפי הייתה מושלמת.", "pt-BR")).toMatch(/perfeito/i);
    expect(localizeBuiltInText("צלעות Baby — עשן נמוך, חום ארוך, טעם עמוק.", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText('סה"כ', "en")).toBe("Total");
    expect(localizeBuiltInText("איפה שתובנה אנושית פוגשת טכנולוגיה חכמה", "en")).toMatch(/insight/i);
    expect(localizeBuiltInText("מפגשים קצרים, AMA וסדנאות שמתאימות ליומן העמוס.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
  });

  it("localizes unique20 leftover sentences, strawberry melt, and store chrome", () => {
    expect(localizeBuiltInText("מיקום טוב הוא השקעה — לא רק כתובת.", "en")).toMatch(/investment/i);
    expect(localizeBuiltInText("מיקום טוב הוא השקעה — לא רק כתובת.", "pt-BR")).toMatch(/endereço/i);
    expect(localizeBuiltInText("תות שדה — ההמסה היא חלק מהחוויה.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סגור תפריט", "es")).toMatch(/Cerrar menú/i);
    expect(localizeBuiltInText("מציג את המוצרים מניהול החנות שלך", "en")).toMatch(/store/i);
    expect(localizeBuiltInText("להרגיע", "en")).toMatch(/soothe/i);
    expect(localizeBuiltInText("מפרט 01", "en")).toMatch(/spec/i);
  });

  it("localizes unique21 leftover sentences", () => {
    expect(localizeBuiltInText("ערב שמתחיל בצלחת ונגמר בזיכרון.", "en")).toMatch(/memory/i);
    expect(localizeBuiltInText("ערב שמתחיל בצלחת ונגמר בזיכרון.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("איך להפחית עומס רגשי ביום־יום?", "pt-BR")).toMatch(/emocional/i);
    expect(localizeBuiltInText("5 אוטומציות שכל עסק צריך לבנות", "es")).toMatch(/automatizaciones/i);
  });

  it("localizes unique22 leftover sentences", () => {
    expect(localizeBuiltInText("יותר מארוחה — ערב שנשאר איתך.", "en")).toMatch(/evening/i);
    expect(localizeBuiltInText("יותר מארוחה — ערב שנשאר איתך.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מותגים ומוצרים שעובדים איתנו", "pt-BR")).toMatch(/conosco/i);
    expect(localizeBuiltInText("סוכר הוא מבנה — לא רק מתיקות.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique23 leftover sentences", () => {
    expect(localizeBuiltInText("בית טוב מורגש — לא רק נראה.", "en")).toMatch(/felt/i);
    expect(localizeBuiltInText("בית טוב מורגש — לא רק נראה.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שלושה מנועים.", "es")).toMatch(/Tres motores/i);
    expect(localizeBuiltInText("הזמינו טאקוס — נצרוב עכשיו.", "pt-BR")).toMatch(/tacos/i);
  });

  it("localizes unique24 leftover sentences, know-all, and ingredient-fit", () => {
    expect(localizeBuiltInText("מיצים — כל מה שצריך לדעת.", "en")).toMatch(/juice/i);
    expect(localizeBuiltInText("מיצים — כל מה שצריך לדעת.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חומרי גלם שמתאימים לסושי", "es")).toMatch(/sushi/i);
    expect(localizeBuiltInText("כל הזכויות שמורות © 2026", "pt-BR")).toMatch(/direitos reservados/i);
  });

  it("localizes unique25 titles, behind-the-scenes, and ₪ unit prices", () => {
    expect(localizeBuiltInText("המעבדה — מאחורי הקלעים.", "en")).toMatch(/behind the scenes/i);
    expect(localizeBuiltInText("המעבדה — מאחורי הקלעים.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("₪42 · 3 יח׳", "en")).toBe("₪42 · 3 pcs");
    expect(localizeBuiltInText("₪28 · פרוסה", "es")).toMatch(/rebanada/i);
    expect(localizeBuiltInText("כמה זמן לוקח לקבל תור?", "pt-BR")).toMatch(/horário/i);
  });

  it("localizes unique26 leftover titles and hyphen opening hours", () => {
    expect(localizeBuiltInText("מאידאה למוצר ולשוק.", "en")).toMatch(/idea/i);
    expect(localizeBuiltInText("מאידאה למוצר ולשוק.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("א׳-ה׳ 08:30-19:00", "en")).toMatch(/Sun–Thu/i);
    expect(localizeBuiltInText("א׳-ה׳ 08:30-19:00", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique27 titles, read-time, shekel-from, and multiline chrome", () => {
    expect(localizeBuiltInText("נדל״ן ועסקאות מורכבות", "en")).toMatch(/real estate/i);
    expect(localizeBuiltInText("נדל״ן ועסקאות מורכבות", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("12 דק׳ קריאה · אתמול", "en")).toBe("12 min read · yesterday");
    expect(localizeBuiltInText("6 דק׳ קריאה · השבוע", "es")).toMatch(/lectura/i);
    expect(localizeBuiltInText("החל מ-220 ש״ח", "pt-BR")).toMatch(/220/);
    expect(localizeBuiltInText("החל מ-220 ש״ח", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החל מ-₪3,400 לשן", "en")).toMatch(/tooth/i);
    expect(localizeBuiltInText("₪54 · חריף עדין", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שלושה מנועים.\nאפס קוסמטיקה.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("4 חדרים · שתי חזיתות", "en")).toMatch(/2 facades|two facades/i);
    expect(localizeBuiltInText("טיפול · 90 דק׳", "es")).toMatch(/90 min/i);
    expect(localizeBuiltInText("שיקום מחסום העור", "en")).toMatch(/skin barrier/i);
    expect(localizeBuiltInText("שיקום מחסום העור", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מחירים שקופים", "en")).toMatch(/transparent/i);
    expect(localizeBuiltInText("3 חד׳ · קומה 4", "en")).toMatch(/floor 4/i);
    expect(localizeBuiltInText("4 חד׳ · נוף", "en")).toMatch(/view/i);
    expect(localizeBuiltInText("צבע וגוונים", "es")).toMatch(/color/i);
    expect(localizeBuiltInText("ליווי ציבורי שוטף.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יצירת קשר", "pt-BR")).toBe("Fale conosco");
    expect(localizeBuiltInText("השירותים שלנו", "pt-BR")).toBe("Nossos serviços");
    expect(localizeBuiltInText("הטיפולים שלנו", "pt-BR")).toBe("Nossos tratamentos");
    expect(localizeBuiltInText("כלכלה שקופה", "en")).toMatch(/transparent/i);
    expect(localizeBuiltInText("כלכלה שקופה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("נתחיל בשיחה", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עיסוי קטיפה", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ברסקט מעושן", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עיסוי פנים", "en")).toMatch(/facial/i);
    expect(localizeBuiltInText("עיסוי פנים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שלחו דרישה", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חומוס ביתי", "pt-BR")).toMatch(/homus|hummus/i);
    expect(localizeBuiltInText("שמפו בוטני", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique33 leftover FAQ, contact, and studio chrome", () => {
    expect(localizeBuiltInText("מידע נוסף", "en")).toMatch(/more info|learn more/i);
    expect(localizeBuiltInText("מידע נוסף", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("השארת פרטים", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("נרשמים ובוחרים תבנית.", "pt-BR")).toMatch(/modelo|cadastre/i);
    expect(localizeBuiltInText("בכל רגע.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("פס 1 - כותרת", "en")).toMatch(/band 1/i);
    expect(localizeBuiltInText("הצוות שלנו", "pt-BR")).toMatch(/equipe/i);
    expect(localizeBuiltInText("צ׳אט ומייל.", "es")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique34 leftover quote, reviews, and store chrome", () => {
    expect(localizeBuiltInText("בקשת הצעת מחיר", "en")).toMatch(/quote/i);
    expect(localizeBuiltInText("בקשת הצעת מחיר", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("המלצות לקוחות", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מוצרים נבחרים", "pt-BR")).toMatch(/produto/i);
    expect(localizeBuiltInText("אזל מהמלאי", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הבלוג שלנו", "en")).toMatch(/blog/i);
    expect(
      localizeBuiltInText("עיצוב טוב מרגישים עוד לפני שמסבירים אותו.", "pt-BR"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("פורטפוליו", "es")).toMatch(/portafolio/i);
    expect(localizeBuiltInText("בקבוקי וינטג'", "en")).toMatch(/vintage/i);
    expect(localizeBuiltInText("בקבוקי וינטג'", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique35 leftover insert-default section chrome", () => {
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם.", "en")).toMatch(/details|get back/i);
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ללא ספאם. אפשר להסיר הרשמה בכל רגע.", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("איך זה עובד?", "pt-BR")).toMatch(/funciona/i);
    expect(localizeBuiltInText("לחצי כדי להחליף, להוסיף או לערוך מדיה.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קבלת פרטים", "en")).toMatch(/detail/i);
    expect(localizeBuiltInText("אזור וידאו", "pt-BR")).toMatch(/v[ií]deo/i);
  });

  it("localizes unique36 leftover insert-default feature and CRM chrome", () => {
    expect(localizeBuiltInText("החל מ־", "en")).toMatch(/from/i);
    expect(localizeBuiltInText("החל מ־", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החל מ־₪350", "en")).toMatch(/350/);
    expect(localizeBuiltInText("החל מ־₪350", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("כל סקשן נראה מעולה גם במובייל.", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מעלים אתר מקצועי תוך זמן קצר.", "pt-BR")).toMatch(/site|profissional/i);
    expect(localizeBuiltInText("וידאו הסבר", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שם הלקוח מהאזור האישי / CRM", "en")).toMatch(/client name|CRM/i);
    expect(localizeBuiltInText("עבודות חשמל מסודרות ומקצועיות", "pt-BR")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique37 leftover insert-default section and editor chrome", () => {
    expect(localizeBuiltInText("חבילות ומחירים ברורים", "en")).toMatch(/package|price/i);
    expect(localizeBuiltInText("חבילות ומחירים ברורים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("האנשים מאחורי המותג", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שאלות שחשוב לשאול", "pt-BR")).toMatch(/pergunt/i);
    expect(localizeBuiltInText("נתונים וסטטיסטיקות", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יתרון בפרויקט 1", "en")).toMatch(/advantage|project/i);
    expect(localizeBuiltInText("יתרון בפרויקט 1", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יכולת 1 - כותרת", "en")).toMatch(/capability|title/i);
    expect(localizeBuiltInText("יכולת 1 - כותרת", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("טופס בקשת שירות", "pt-BR")).toMatch(/formul[aá]rio|servi[cç]o/i);
  });

  it("localizes unique39 leftover IDO preview body, FAQ, and form chrome", () => {
    expect(
      localizeBuiltInText(
        "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל\nמהיכרות ראשונה ועד פנייה אמיתית.",
        "en",
      ),
    ).toMatch(/clear language|inquiry/i);
    expect(
      localizeBuiltInText(
        "אנחנו בונים לעסק שפה ברורה, מסרים חדים ותוכן שמוביל את הקהל\nמהיכרות ראשונה ועד פנייה אמיתית.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לא רק תוכן — מערכת צמיחה", "es")).toMatch(/contenido|crecimiento/i);
    expect(localizeBuiltInText("תוכן שמייצר אמון", "pt-BR")).toMatch(/confiança/i);
    expect(localizeBuiltInText("דאטה שמוביל החלטות", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "מחברים בין קהל, תוכן, דאטה\nוקמפיינים\nלמערכת צמיחה אחת ברורה.",
        "en",
      ),
    ).toMatch(/growth system|campaign/i);
    expect(localizeBuiltInText("בואו נבנה\nתוכנית צמיחה\nלעסק שלך.", "pt-BR")).toMatch(/negócio|crescimento/i);
    expect(localizeBuiltInText("זה מותאם לנייד?", "en")).toMatch(/mobile/i);
    expect(localizeBuiltInText("שליחת בקשה לשיחה", "es")).toMatch(/llamada|solicitud/i);
    expect(localizeBuiltInText("חשיפות", "en")).toBe("Impressions");
    expect(localizeBuiltInText("ניהול סושיאל", "pt-BR")).toMatch(/social/i);
  });

  it("localizes unique40 leftover gallery preview body after unique39", () => {
    expect(
      localizeBuiltInText(
        "סטודיו דיגיטלי שמחבר בין עיצוב, אוטומציות, CRM ותהליכי מכירה כדי\nלעזור לעסקים לעבוד מהר יותר, מסודר יותר ורווחי יותר.",
        "en",
      ),
    ).toMatch(/digital studio|CRM/i);
    expect(
      localizeBuiltInText(
        "סטודיו דיגיטלי שמחבר בין עיצוב, אוטומציות, CRM ותהליכי מכירה כדי\nלעזור לעסקים לעבוד מהר יותר, מסודר יותר ורווחי יותר.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מערכת לידים ומכירות", "es")).toMatch(/lead|venta/i);
    expect(localizeBuiltInText("כל הזכויות שמורות.", "pt-BR")).toMatch(/direitos reservados/i);
    expect(localizeBuiltInText("נשלח — נחזור אליכם בקרוב", "en")).toMatch(/sent|back/i);
    expect(localizeBuiltInText("מעגל כוח", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique41 leftover gallery preview chrome after unique40", () => {
    expect(
      localizeBuiltInText(
        "שירותים שמוצגים בצורה אלגנטית, ברורה ולא עמוסה — עם חלוקה נכונה,\nCTA עדין והיררכיה שמרגישה פרימיום.",
        "en",
      ),
    ).toMatch(/elegance|premium|CTA/i);
    expect(
      localizeBuiltInText(
        "שירותים שמוצגים בצורה אלגנטית, ברורה ולא עמוסה — עם חלוקה נכונה,\nCTA עדין והיררכיה שמרגישה פרימיום.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מרחב רגוע", "es")).toMatch(/espacio|sereno/i);
    expect(localizeBuiltInText("תיקים", "en")).toBe("Cases");
    expect(localizeBuiltInText("תיקים", "en")).not.toMatch(/bag/i);
    expect(localizeBuiltInText("לפרטים נוספים ←", "pt-BR")).toMatch(/detalhes/i);
    expect(localizeBuiltInText("ייעוץ ברור. החלטות מדויקות.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("לאן תרצו לטוס?", "en")).toMatch(/fly|where/i);
    expect(localizeBuiltInText("מענה", "en")).toBe("Response");
  });

  it("localizes unique42 leftover Wantravel and Lexora built-in seed copy", () => {
    expect(localizeBuiltInText("חופשות בוטיק בהתאמה אישית", "en")).toMatch(
      /boutique/i,
    );
    expect(localizeBuiltInText("חופשות בוטיק בהתאמה אישית", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("בואו נבנה מסלול", "es")).toMatch(/itinerario/i);
    expect(localizeBuiltInText("תכנון מלא", "pt-BR")).toMatch(/planejamento completo/i);
    expect(localizeBuiltInText("ייעוץ משפטי אסטרטגי", "en")).toMatch(/legal/i);
    expect(localizeBuiltInText("סטנדרט גבוה יותר לליווי משפטי", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("קביעת ייעוץ", "en")).toMatch(/consult/i);
  });

  it("localizes unique43 leftover Spalcio, Elevora, and Servora built-in seed copy", () => {
    expect(localizeBuiltInText("אסטרטגיה, צמיחה ותוצאות", "en")).toMatch(
      /strategy|growth/i,
    );
    expect(localizeBuiltInText("אסטרטגיה, צמיחה ותוצאות", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("אתר עסקי שמרגיש יוקרתי, ברור ומוכן להביא לקוחות.", "es")).toMatch(
      /lujo|negocio/i,
    );
    expect(localizeBuiltInText("מתקנים, משדרגים ומשפצים מערכות חשמל", "pt-BR")).toMatch(
      /elétric/i,
    );
    expect(localizeBuiltInText("לקביעת ביקור", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קביעת שיחת ייעוץ", "en")).toMatch(/consult/i);
  });

  it("localizes unique44 leftover PulseCore and Servora built-in seed copy", () => {
    expect(
      localizeBuiltInText(
        "אימון קצר, חד ועוצמתי שמשלב דופק גבוה, כוח ותנועה מהירה.",
        "en",
      ),
    ).toMatch(/short|heart|strength/i);
    expect(
      localizeBuiltInText(
        "אימון קצר, חד ועוצמתי שמשלב דופק גבוה, כוח ותנועה מהירה.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עילית", "es")).toMatch(/élite|elite/i);
    expect(localizeBuiltInText("פנייה ואבחון", "pt-BR")).toMatch(
      /consulta|diagnóstico/i,
    );
    expect(localizeBuiltInText("צריך ניסיון קודם?", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("חבילת התחלה", "en")).toMatch(/starter|start/i);
  });

  it("localizes unique45 leftover Aeline, PulseCore, Servora, and Spalcio chrome", () => {
    expect(localizeBuiltInText("הופכים פניות", "en")).toMatch(/inquir|turn/i);
    expect(localizeBuiltInText("הופכים פניות", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("אימון חזק.", "es")).toMatch(/entreno|fuerte/i);
    expect(localizeBuiltInText("לתיאום ייעוץ", "pt-BR")).toMatch(/consult/i);
    expect(localizeBuiltInText("תהליך מדויק שמוביל לפנייה", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("ליד חדש", "en")).toMatch(/lead/i);
  });

  it("localizes unique46 leftover Aeline testimonial quotes", () => {
    expect(
      localizeBuiltInText(
        "הפסקנו לאבד פניות. כל ליד מקבל טיפול מסודר וברור.",
        "en",
      ),
    ).toMatch(/inquir|lead/i);
    expect(
      localizeBuiltInText(
        "הפסקנו לאבד פניות. כל ליד מקבל טיפול מסודר וברור.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עסק #1", "pt-BR")).toMatch(/negócio/i);
  });

  it("localizes unique47 leftover Adion, Serenova, Justora, and Novastra chrome", () => {
    expect(localizeBuiltInText("קבעו צילום", "en")).toMatch(/book|shoot/i);
    expect(localizeBuiltInText("קבעו צילום", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קביעת שיחת היכרות", "es")).toMatch(/llamada|present/i);
    expect(localizeBuiltInText("כל התיקים", "pt-BR")).toMatch(/casos/i);
    expect(localizeBuiltInText("קנה עכשיו", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חבילות ברורות.", "en")).toMatch(/package|clear/i);
  });

  it("localizes unique48 leftover Adion, Serenova, and Justora body chrome", () => {
    expect(localizeBuiltInText("הפקה", "en")).toMatch(/production/i);
    expect(localizeBuiltInText("סרט מותג", "en")).toMatch(/brand|film/i);
    expect(localizeBuiltInText("סרט מותג", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "משלב הרעיון ועד יום הצילום — אנחנו מנהלים את התהליך עם כיוון ויזואלי ברור ותקשורת מקצועית.",
        "en",
      ),
    ).toMatch(/shoot|visual/i);
    expect(localizeBuiltInText("היכרות", "es")).toMatch(/present|introduc/i);
    expect(localizeBuiltInText("מורידים חשש ומסבירים איך זה עובד.", "pt-BR")).toMatch(
      /preocup|explica/i,
    );
    expect(
      localizeBuiltInText(
        "משרד עורכי דין שמעניק ייעוץ, אסטרטגיה וייצוג מקצועי לכל צורך משפטי — בדיסקרטיות, בהירות וזמינות.",
        "ar",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("נזקי גוף", "en")).toMatch(/injury|personal/i);
    expect(localizeBuiltInText("תיקים שטופלו", "en")).toMatch(/case/i);
  });

  it("localizes unique49 leftover Adion pricing, Serenova services, and Justora body", () => {
    expect(localizeBuiltInText("₪8,900 לפרויקט", "en")).toMatch(/project/i);
    expect(localizeBuiltInText("₪8,900 לפרויקט", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עריכה קולנועית", "es")).toMatch(/cinemat/i);
    expect(localizeBuiltInText("מבנה שמוביל את הלקוח בלי עומס", "pt-BR")).toMatch(
      /estrutura|sobrecarga/i,
    );
    expect(localizeBuiltInText("הצוות המשפטי", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בדיקת סיכונים", "en")).toMatch(/risk/i);
  });

  it("localizes unique50 leftover contact labels and form chrome", () => {
    expect(localizeBuiltInText("כתובת המשרד", "en")).toMatch(/address|office/i);
    expect(localizeBuiltInText("כתובת המשרד", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מה תרצו לשאול?", "es")).toMatch(/pregunt/i);
    expect(localizeBuiltInText("בחרו אפשרות", "pt-BR")).toMatch(/opç/i);
    expect(localizeBuiltInText("סדנה / הרצאה", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique51 leftover Cyclora, Chanel, and Aurelia chrome", () => {
    expect(localizeBuiltInText("חוויית שיווק מבוססת נתונים", "en")).toMatch(/data|marketing/i);
    expect(localizeBuiltInText("חוויית שיווק מבוססת נתונים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לקולקציה החדשה", "es")).toMatch(/colecci/i);
    expect(localizeBuiltInText("תיקי עור", "pt-BR")).toMatch(/couro|bolsa/i);
    expect(localizeBuiltInText("מטבח פתוח", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מוכנים לערב?", "en")).toMatch(/evening|ready/i);
  });

  it("localizes unique52 leftover Cyclora and Chanel split headlines", () => {
    expect(localizeBuiltInText("גלו את", "en")).toMatch(/discover/i);
    expect(localizeBuiltInText("גלו את", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("אסטרטגיות", "es")).toMatch(/estrateg/i);
    expect(localizeBuiltInText("הקהילה שלנו", "pt-BR")).toMatch(/comunidade/i);
    expect(localizeBuiltInText("תוצאות מוכחות", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique53 leftover Cyclora pricing/FAQ and Chanel craft/journal", () => {
    expect(localizeBuiltInText("השקעה בצמיחה", "en")).toMatch(/invest|growth/i);
    expect(localizeBuiltInText("השקעה בצמיחה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("כולל:", "es")).toMatch(/incluye/i);
    expect(
      localizeBuiltInText(
        "כל פריט עובר תהליך ייצור מוקפד — מבחירת העור ועד הגימור הסופי. אנו עובדים עם אומנים מנוסים באיטליה וצרפת כדי להבטיח שכל מוצר יישאר יפה לאורך שנים.",
        "en",
      ),
    ).toMatch(/italy|france|leather/i);
    expect(
      localizeBuiltInText(
        "כל פריט עובר תהליך ייצור מוקפד — מבחירת העור ועד הגימור הסופי. אנו עובדים עם אומנים מנוסים באיטליה וצרפת כדי להבטיח שכל מוצר יישאר יפה לאורך שנים.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("היומן", "pt-BR")).toMatch(/diário/i);
    expect(localizeBuiltInText("הצטרפו לעולם שאנל", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique67 peer critique and week ranges", () => {
    expect(localizeBuiltInText("ביקורת עמיתים", "en")).toMatch(/peer|critique/i);
    expect(localizeBuiltInText("ביקורת עמיתים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ביקורת עמיתים", "es")).toMatch(/crítica|compañer/i);
    expect(localizeBuiltInText("שבוע 1-2", "en")).toMatch(/weeks 1/i);
    expect(localizeBuiltInText("שבוע 11-12", "pt-BR")).toMatch(/semanas/i);
    expect(localizeBuiltInText("שבוע 3-6", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חודש", "en")).toMatch(/month/i);
    expect(localizeBuiltInText("חודש", "pt-BR")).toMatch(/mês/i);
    expect(localizeBuiltInText("קוד", "en")).toBe("Code");
    expect(localizeBuiltInText("שפה 01", "en")).toMatch(/language 01/i);
  });

  it("localizes unique68 leftover Virello through Studiora chrome", () => {
    expect(localizeBuiltInText("פרינט", "en")).toBe("Print");
    expect(localizeBuiltInText("מפתח", "en")).toMatch(/developer/i);
    expect(localizeBuiltInText("מורות", "es")).toMatch(/profesor/i);
    expect(localizeBuiltInText("שמאים", "pt-BR")).toMatch(/avaliador/i);
    expect(localizeBuiltInText("נדיר", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מסאז׳ עם שמנים טרופיים.", "en")).toMatch(/massage|tropical/i);
    expect(localizeBuiltInText("UI/UX · מובייל", "en")).toMatch(/mobile/i);
    expect(localizeBuiltInText("מייסד, Pulse", "en")).toMatch(/founder/i);
  });

  it("localizes unique70 leftover cart, agency, and editor chrome", () => {
    expect(localizeBuiltInText("העגלה ריקה כרגע.", "en")).toMatch(/cart|empty/i);
    expect(localizeBuiltInText("העגלה ריקה כרגע.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מבט לסוכנות", "es")).toMatch(/agencia/i);
    expect(localizeBuiltInText("מבט לסוכנות", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לוגו ומותג", "pt-BR")).toMatch(/logo|marca/i);
    expect(localizeBuiltInText("כותרת ראשית", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("פירוט 2", "en")).toMatch(/detail/i);
    expect(localizeBuiltInText("פריט עגלה 3", "en")).toMatch(/cart item/i);
    expect(
      localizeBuiltInText(
        "חיזוק שכבות תעבורה, זהות ונתונים עם בקרות שמבוססות מדיניות.",
        "en",
      ),
    ).toMatch(/traffic|identity|policy/i);
    expect(localizeBuiltInText("פס קידום", "es")).toMatch(/promo/i);
    expect(localizeBuiltInText("ערכים", "pt-BR")).toMatch(/valor/i);
    expect(localizeBuiltInText("מדד 1", "en")).toMatch(/metric/i);
    expect(
      localizeBuiltInText("שכבות גישה מבוססות זהות לעובדים, ספקים והנהלה.", "en"),
    ).toMatch(/identity|access/i);
    expect(localizeBuiltInText("תבנית Studiora · Bizuply Studio", "es")).toMatch(/Studiora/i);
    expect(localizeBuiltInText("תבנית Studiora · Bizuply Studio", "es")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes branded beauty catalog and place paragraphs as real prose", () => {
    const catalog =
      "קטלוג הטיפולים של Gelora מפרט מה מקבלים בכל שירות, כמה זמן כדאי לפנות, למי הוא מתאים ואילו תוספות יכולות לשדרג את התוצאה. המטרה היא שתבחרו טיפול מתוך ידע מלא ולא מתוך ניחוש.";
    const place =
      "Gelora נבנה כמקום שמחבר בין טיפול מקצועי לחוויה רגועה: כל ביקור מתחיל בשיחה קצרה, ממשיך בבחירת פרוטוקול מדויק ומסתיים בהנחיות ברורות להמשך בבית. הצוות מתעד העדפות, רגישויות ותוצאות כדי שכל מפגש הבא יהיה אישי יותר, נעים יותר ומדויק יותר.";
    const enCatalog = localizeBuiltInText(catalog, "en");
    expect(enCatalog).toMatch(/Gelora treatment catalog/i);
    expect(enCatalog).toMatch(/guesswork/i);
    expect(enCatalog).not.toMatch(/catalog the treatments of/i);
    expect(enCatalog).not.toMatch(/[\u0590-\u05FF]/);
    const esCatalog = localizeBuiltInText(catalog, "es");
    expect(esCatalog).toMatch(/catálogo de tratamientos de Gelora/i);
    expect(esCatalog).toMatch(/elijáis|recibís/i);
    expect(esCatalog).not.toMatch(/[\u0590-\u05FF]/);
    const ptCatalog = localizeBuiltInText(catalog, "pt-BR");
    expect(ptCatalog).toMatch(/catálogo de tratamentos da Gelora/i);
    expect(ptCatalog).toMatch(/você/i);
    expect(ptCatalog).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText(catalog, "ar")).not.toMatch(/[\u0590-\u05FF]/);
    const enPlace = localizeBuiltInText(place, "en");
    expect(enPlace).toMatch(/Gelora was built/i);
    expect(enPlace).toMatch(/calm experience/i);
    expect(enPlace).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText(place, "es")).toMatch(/Gelora se construyó/i);
    expect(localizeBuiltInText(place, "pt-BR")).toMatch(/Gelora foi feito/i);
    expect(localizeBuiltInText(place, "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes branded agency, food, and template chrome as real prose", () => {
    expect(
      localizeBuiltInText(
        "ספרו לנו איפה UXForge יכולה לעזור ונחזור עם כיוון פעולה ברור.",
        "en",
      ),
    ).toMatch(/Tell us where UXForge can help/i);
    expect(
      localizeBuiltInText(
        "ספרו לנו איפה UXForge יכולה לעזור ונחזור עם כיוון פעולה ברור.",
        "es",
      ),
    ).toMatch(/Contadnos/i);
    expect(
      localizeBuiltInText(
        "Crustora מציגה חוויה מלאה: תפריט, סיפור המטבח, צוות, גלריה וכל מה שצריך כדי לתכנן ביקור בלתי נשכח.",
        "en",
      ),
    ).toMatch(/Crustora presents a full experience/i);
    expect(localizeBuiltInText("שלוש סיבות ש-Crustora מרגישה אחרת", "es")).toMatch(
      /Tres razones/i,
    );
    expect(localizeBuiltInText("הזמינו מ-Seafoodix — נדאג לשאר.", "pt-BR")).toMatch(
      /Peça da Seafoodix/i,
    );
    expect(
      localizeBuiltInText(
        "תבנית Citadel — אתר רב-עמודי מקצועי עם עיצוב מלבני ותנועה.",
        "en",
      ),
    ).toMatch(/Citadel template/i);
    expect(localizeBuiltInText("Burgerhaus הפך להרגל שלי בסופי שבוע.", "ar")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(
      localizeBuiltInText(
        "ספרו לנו איפה UXForge יכולה לעזור ונחזור עם כיוון פעולה ברור.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique71 insert-library dash titles and descriptions", () => {
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).toMatch(/home page/i);
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).toMatch(/split/i);
    expect(localizeBuiltInText("דף הבית – פתיחה מפוצלת", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שירותים – כרטיסים", "es")).toMatch(/tarjeta/i);
    expect(localizeBuiltInText("שירותים – כרטיסים", "es")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הירו מפוצל, כרטיסי ערך ומספרים", "en")).toMatch(/split hero/i);
    expect(localizeBuiltInText("הירו מפוצל, כרטיסי ערך ומספרים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("מכון יופי יוקרתי עם הירו מגזיני, גלריה, טיפולים ויומן.", "pt-BR"),
    ).toMatch(/salão de beleza/i);
    expect(localizeBuiltInText("פתיח מגזיני", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("החשבון שלי", "en")).toMatch(/my account/i);
  });

  it("localizes unique72 ready-template picker chips", () => {
    expect(localizeBuiltInText("פתיח מגזיני", "en")).toMatch(/magazine/i);
    expect(localizeBuiltInText("פתיח כהה", "en")).toMatch(/dark opening/i);
    expect(localizeBuiltInText("פתיח כהה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("אודות הסטודיו", "es")).toMatch(/estudio/i);
    expect(localizeBuiltInText("טופס ליד", "pt-BR")).toMatch(/formulário|lead/i);
    expect(localizeBuiltInText("גלריית אוכל", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("דף נחיתה חד לעסק, מבצע, הוכחות וטופס ליד.", "en"),
    ).toMatch(/landing/i);
    expect(localizeBuiltInText("שוברי מתנה", "es")).toMatch(/vale|regalo/i);
    expect(localizeBuiltInText("מדורים", "en")).toMatch(/section/i);
    expect(localizeBuiltInText("מדורים", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("© NOVASTRA. כל הזכויות שמורות.", "en")).toMatch(
      /all rights reserved/i,
    );
    expect(localizeBuiltInText("© NOVASTRA. כל הזכויות שמורות.", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
  });

  it("localizes copyright chrome for Latin brands, years, and HTML aria-labels", () => {
    expect(localizeBuiltInText("© 2026 כל הזכויות שמורות", "en")).toMatch(
      /all rights reserved/i,
    );
    expect(localizeBuiltInText("© 2026 כל הזכויות שמורות", "en")).not.toMatch(
      /[\u0590-\u05FF]/,
    );
    expect(localizeBuiltInText("© 2026 BizUply. כל הזכויות שמורות.", "es")).toMatch(
      /derechos reservados/i,
    );
    expect(
      localizeBuiltInText("© כל הזכויות שמורות · מדיניות פרטיות", "pt-BR"),
    ).toMatch(/direitos reservados/i);
    expect(
      localizeBuiltInText("© כל הזכויות שמורות · מדיניות פרטיות", "pt-BR"),
    ).toMatch(/privacidade/i);
    expect(
      localizeBuiltInText("© כל הזכויות שמורות · מדיניות פרטיות", "ar"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText('<button aria-label="פתיחת תפריט">☰</button>', "en"),
    ).toMatch(/aria-label="Open menu"/);
    expect(
      localizeBuiltInText('<button aria-label="פתיחת תפריט">☰</button>', "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("© 2026 ברקמן. כל הזכויות שמורות.", "en"),
    ).toMatch(/ברקמן/);
  });

  it("localizes unique73 leftover tx() chrome", () => {
    expect(localizeBuiltInText("המשך לתשלום", "en")).toMatch(/payment/i);
    expect(localizeBuiltInText("המשך לתשלום", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הסל ריק כרגע.", "es")).toMatch(/carrito/i);
    expect(localizeBuiltInText("ספרו לנו על הרעיון", "es")).toMatch(/Contadnos/i);
    expect(localizeBuiltInText("אולי תרצו להוסיף", "pt-BR")).toMatch(/você/i);
    expect(localizeBuiltInText("אין מוצרים להצגה.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מדיניות פרטיות", "en")).toMatch(/privacy/i);
  });

  it("localizes unique74 section-variant insert chrome", () => {
    expect(localizeBuiltInText("רוצים להצטרף?", "en")).toMatch(/join/i);
    expect(localizeBuiltInText("רוצים להצטרף?", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("השאירו אימייל וקבלו עדכונים והטבות.", "es")).toMatch(/Dejad/i);
    expect(localizeBuiltInText("פנייה בוואטסאפ", "pt-BR")).toMatch(/WhatsApp/i);
    expect(
      localizeBuiltInText("הכל היה ברור, מהיר ומקצועי.", "ar"),
    ).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique75 leftover section-variant HTML chrome", () => {
    expect(localizeBuiltInText("הסל שלך", "en")).toMatch(/cart/i);
    expect(localizeBuiltInText("הסל שלך", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בחרו שירות", "es")).toMatch(/Elegid/i);
    expect(localizeBuiltInText("עקבו אחרינו", "pt-BR")).toMatch(/Siga/i);
    expect(localizeBuiltInText("משלוח חינם מעל ₪300", "en")).toMatch(/₪300/);
    expect(localizeBuiltInText("רוצים לדעת עוד?", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique76 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("רוצים גם תוצאה כזאת?", "en")).toMatch(/result/i);
    expect(localizeBuiltInText("רוצים גם תוצאה כזאת?", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בחרו שעה שמתאימה לכם.", "es")).toMatch(/Elegid/i);
    expect(localizeBuiltInText("השאירו אימייל ונעדכן אתכם.", "pt-BR")).toMatch(/e-mail|você/i);
    expect(localizeBuiltInText("שאלה? בקשה? אנחנו כאן.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique77 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("מלאו פרטים ונחזור אליכם בהקדם.", "en")).toMatch(/details/i);
    expect(localizeBuiltInText("מלאו פרטים ונחזור אליכם בהקדם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ספרו לנו איך הייתה החוויה שלכם.", "es")).toMatch(/Contadnos/i);
    expect(localizeBuiltInText("קבלו מדריך חינמי ישירות למייל", "pt-BR")).toMatch(/e-mail|guia/i);
    expect(localizeBuiltInText("תהליך פשוט וברור בשלושה שלבים", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique78 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם בהקדם.", "en")).toMatch(/details/i);
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם בהקדם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בחרו זמן שנוח לכם ואנחנו נדאג לשאר", "es")).toMatch(/Elegid/i);
    expect(localizeBuiltInText("ללא ספאם. רק הטבות ועדכונים חשובים.", "pt-BR")).toMatch(/spam/i);
    expect(localizeBuiltInText("מעולה. יש זמינות ביום שני ב־10:30.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique79 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("מצאתם זמן שמתאים לכם? קבעו תור עכשיו", "en")).toMatch(/book/i);
    expect(localizeBuiltInText("מצאתם זמן שמתאים לכם? קבעו תור עכשיו", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קראו ביקורות והשאירו גם אתם חוות דעת", "es")).toMatch(/Leed|dejad/i);
    expect(localizeBuiltInText("10% הנחה ללקוחות חדשים או לחברי מועדון.", "pt-BR")).toMatch(/10%/);
    expect(localizeBuiltInText("יום חמישי · 24.06.2026 · 20:30 · שם האולם", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique80 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("מצאתם משהו שאהבתם? קנו עכשיו או שאלו אותנו", "en")).toMatch(/buy|ask/i);
    expect(localizeBuiltInText("מצאתם משהו שאהבתם? קנו עכשיו או שאלו אותנו", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("תנו ללקוחות לראות את המקום, התהליך והתוצאה", "es")).toMatch(/Dejad/i);
    expect(localizeBuiltInText("השאירו אימייל ונעדכן אתכם רק בדברים החשובים.", "pt-BR")).toMatch(/e-mail|email/i);
    expect(localizeBuiltInText("מתאים לדפי נחיתה, עמודים ארוכים או אזור אמון קצר.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique81 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("הבוט עונה, ממליץ, אוסף פרטים ומוביל את הלקוח לצעד הבא — 24/7.", "en")).toMatch(/24\/7/);
    expect(localizeBuiltInText("הבוט עונה, ממליץ, אוסף פרטים ומוביל את הלקוח לצעד הבא — 24/7.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הציגו אנשי צוות, תפקידים, מומחיות וניסיון בצורה נקייה וברורה.", "es")).toMatch(/Mostrad/i);
    expect(localizeBuiltInText("מלאו פרטים או שלחו הודעה ונחזור אליכם עם מענה מקצועי, מהיר וברור.", "pt-BR")).toMatch(/Preencha|mensagem/i);
    expect(localizeBuiltInText("כל הערוצים במקום אחד — אינסטגרם, פייסבוק, טיקטוק, יוטיוב ווואטסאפ.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique82 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("מענה מהיר, איסוף פניות, שאלות נפוצות והובלה לפעולה — הכל במקום אחד.", "en")).toMatch(/FAQ|inquir/i);
    expect(localizeBuiltInText("מענה מהיר, איסוף פניות, שאלות נפוצות והובלה לפעולה — הכל במקום אחד.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("עקבו אחרי העדכונים, התמונות, הסרטונים, המוצרים והסיפורים שמאחורי העסק.", "es")).toMatch(/Seguid/i);
    expect(localizeBuiltInText("רוב הלקוחות קובעים תור מהטלפון. המבנה הזה מדגיש חוויית מובייל ברורה ומהירה.", "pt-BR")).toMatch(/telefone|mobile/i);
    expect(localizeBuiltInText("ספרו למה המוצר מיוחד, ממה הוא עשוי, למי הוא מתאים ומה הערך שהוא נותן.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique83 leftover section-variant sentences", () => {
    expect(localizeBuiltInText("חברו את כל הערוצים שלכם: אינסטגרם, פייסבוק, טיקטוק, יוטיוב, לינקדאין ווואטסאפ.", "en")).toMatch(/LinkedIn|WhatsApp/i);
    expect(localizeBuiltInText("חברו את כל הערוצים שלכם: אינסטגרם, פייסבוק, טיקטוק, יוטיוב, לינקדאין ווואטסאפ.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הוסיפו כתובת, טלפון, שעות פעילות ומפה כדי שהלקוח יוכל להגיע או ליצור קשר בקלות.", "es")).toMatch(/Añadid/i);
    expect(localizeBuiltInText("השאירו פרטים ונחזור אליכם עם מענה מקצועי, ברור ומהיר. מתאים ללידים, ייעוץ, תיאום תור או בקשת הצעת מחיר.", "pt-BR")).toMatch(/Deixe|orçamento/i);
    expect(localizeBuiltInText("אנחנו מאמינים בשקיפות, מקצועיות, זמינות וחוויה נעימה — מהרגע הראשון ועד לסיום השירות.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique84 leftover section-picker titles", () => {
    expect(localizeBuiltInText("Hero וידאו", "en")).toMatch(/video hero/i);
    expect(localizeBuiltInText("Hero וידאו", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("אודות עם מדיה להוספה", "es")).toMatch(/Sobre|media/i);
    expect(localizeBuiltInText("בוט שירות לקוחות", "pt-BR")).toMatch(/atendimento|bot/i);
    expect(localizeBuiltInText("CTA וואו", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique85 leftover section-picker titles", () => {
    expect(localizeBuiltInText("השקת מוצר", "en")).toMatch(/launch|product/i);
    expect(localizeBuiltInText("השקת מוצר", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("טופס הצעת מחיר", "es")).toMatch(/presupuesto/i);
    expect(localizeBuiltInText("חזון ומשימה", "pt-BR")).toMatch(/visão|missão/i);
    expect(localizeBuiltInText("מדיה להוספה", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique86 leftover section-picker titles", () => {
    expect(localizeBuiltInText("פיד אינסטגרם", "en")).toMatch(/instagram/i);
    expect(localizeBuiltInText("פיד אינסטגרם", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קרוסלת מוצרים", "es")).toMatch(/Carrusel|productos/i);
    expect(localizeBuiltInText("תור בבית הלקוח", "pt-BR")).toMatch(/casa|cliente/i);
    expect(localizeBuiltInText("תמונת רקע מלאה", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique87 leftover section-picker descriptions", () => {
    expect(localizeBuiltInText("טקסט הסבר לצד וידאו.", "en")).toMatch(/video/i);
    expect(localizeBuiltInText("טקסט הסבר לצד וידאו.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קביעת תור או פתיחת שיחה בוואטסאפ.", "es")).toMatch(/Reservad|WhatsApp/i);
    expect(localizeBuiltInText("קבלת מדריך/קובץ/הטבה בתמורה להרשמה.", "pt-BR")).toMatch(/Receba|inscrição/i);
    expect(localizeBuiltInText("סקשן קריאה לפעולה קצר, צבעוני וממיר.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique88 leftover section-picker descriptions", () => {
    expect(localizeBuiltInText("גריד פוסטים ויזואלי בסגנון אינסטגרם.", "en")).toMatch(/instagram/i);
    expect(localizeBuiltInText("גריד פוסטים ויזואלי בסגנון אינסטגרם.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בחירת איש צוות / מומחה לפני בחירת שעה.", "es")).toMatch(/Elegid/i);
    expect(localizeBuiltInText("טופס קביעת תור עם בחירת שירות, יום ושעה.", "pt-BR")).toMatch(/agendamento|serviço/i);
    expect(localizeBuiltInText("סקשן שירותים שמוביל ישירות לשיחת וואטסאפ.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique89 leftover section-picker descriptions", () => {
    expect(localizeBuiltInText("שורת מוצרים נגללת לרוחב כמו חנות מודרנית.", "en")).toMatch(/store|product/i);
    expect(localizeBuiltInText("שורת מוצרים נגללת לרוחב כמו חנות מודרנית.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("באנר קצר, צבעוני וחזק שאפשר לשלב בכל עמוד.", "es")).toMatch(/podéis|banner/i);
    expect(localizeBuiltInText("מוקאפ מובייל שמראה איך הלקוח קובע תור בטלפון.", "pt-BR")).toMatch(/telefone|agenda/i);
    expect(localizeBuiltInText("סקשן קצר, צבעוני וממיר שמוביל לרשתות החברתיות.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique90 leftover section-picker descriptions", () => {
    expect(localizeBuiltInText("חנות שמתאימה לעסקים שרוצים לקבל הזמנות דרך וואטסאפ.", "en")).toMatch(/WhatsApp/i);
    expect(localizeBuiltInText("חנות שמתאימה לעסקים שרוצים לקבל הזמנות דרך וואטסאפ.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סקשן המלצות שמתאים לקליניקה, איפור, יופי וטיפולים.", "es")).toMatch(/maquillaje|clínica/i);
    expect(localizeBuiltInText("ביקורות שמתאימות לקליניקות, יופי, טיפולים ואיפור.", "pt-BR")).toMatch(/maquiagem|clínica/i);
    expect(localizeBuiltInText("גריד מוצרים מקצועי בסגנון Shopify עם כרטיסים נקיים, Hover וכפתור רכישה.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique91 leftover section-picker badges", () => {
    expect(localizeBuiltInText("קלאסי", "en")).toBe("Classic");
    expect(localizeBuiltInText("קלאסי", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הפוך", "es")).toMatch(/Invertido/i);
    expect(localizeBuiltInText("לוגואים", "pt-BR")).toBe("Logos");
    expect(localizeBuiltInText("מחלקות", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique92 leftover insert-library chrome", () => {
    expect(localizeBuiltInText("כותרת סקשן", "en")).toBe("Section title");
    expect(localizeBuiltInText("כותרת סקשן", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שם א-ת", "en")).toBe("Name A–Z");
    expect(localizeBuiltInText("תא 1", "en")).toBe("Cell 1");
    expect(localizeBuiltInText("עמודה א׳", "es")).toMatch(/Columna/i);
    expect(localizeBuiltInText("בקשת תור", "pt-BR")).toMatch(/agendamento|pedido/i);
    expect(localizeBuiltInText("מה תרצו למדוד או לאיזה אירוע?", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique93 leftover insert-library sentences", () => {
    expect(localizeBuiltInText("כל ליד ייכנס ל־CRM של העסק.", "en")).toMatch(/CRM/i);
    expect(localizeBuiltInText("כל ליד ייכנס ל־CRM של העסק.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הדביקו קוד Embed דרך סרגל העריכה", "es")).toMatch(/Pegad|Embed/i);
    expect(localizeBuiltInText("> מתחילים בדיקת היקף", "pt-BR")).toMatch(/escopo|Começamos/i);
    expect(localizeBuiltInText("זמינים לקריאות דחופות, תיקון תקלות, התקנות ושדרוג חשמל — עם אחריות מלאה.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique94 leftover email preview and thumbnail chrome", () => {
    expect(localizeBuiltInText("העסק שלי", "en")).toBe("My business");
    expect(localizeBuiltInText("העסק שלי", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חולצה", "es")).toMatch(/Camisa/i);
    expect(localizeBuiltInText("המייל נשלח מ-{{store.name}} באמצעות BizUply.", "pt-BR")).toMatch(/\{\{store\.name\}\}/);
    expect(localizeBuiltInText("עיצוב · מיתוג · דיגיטל", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique95 leftover thumbnail blurbs", () => {
    expect(
      localizeBuiltInText(
        "תבנית יוקרתית לסוכנות נסיעות עם הירו גדול, יעדים, חבילות וטופס לידים.",
        "en",
      ),
    ).toMatch(/travel|hero|lead/i);
    expect(
      localizeBuiltInText(
        "תבנית יוקרתית לסוכנות נסיעות עם הירו גדול, יעדים, חבילות וטופס לידים.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText("ארבורה מתכננת חצרות, גגות ומרחבים ציבוריים — עם …", "es"),
    ).toMatch(/Arbora|patios|espacios/i);
    expect(
      localizeBuiltInText(
        "איפור ושיער לכלות ולמלוות — ניסיון מקדים, לוק שנשאר בתמונות, וליווי רגוע…",
        "pt-BR",
      ),
    ).toMatch(/maquiagem|noivas/i);
    expect(localizeBuiltInText("תבנית כושר PulseCore", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique69 leftover gallery catalog chrome", () => {
    expect(localizeBuiltInText("פיטנס", "en")).toMatch(/fitness/i);
    expect(localizeBuiltInText("פיטנס", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("סיקלורה", "es")).toBe("Cyclora");
    expect(
      localizeBuiltInText(
        "תבנית פיטנס אנרגטית למאמנים, חדרי כושר וסטודיואים עם Hero חזק, תוכניות, מאמנים, מחירים, מערכת שעות וטופס הצטרפות.",
        "en",
      ),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "תבנית יוקרה לאקססוריז ואיקומרס, עם פס קידום, קטגוריות, מוצרים נבחרים, ערכים, קהילה, המלצות, אומנות ייצור, יומן, ניוזלטר ותחתית — בעיצוב קרם ושחור אלגנטי.",
        "pt-BR",
      ),
    ).toMatch(/e-commerce|acessório/i);
  });

  it("localizes unique66 leftover Emberplate through Tacoflare food chrome", () => {
    expect(localizeBuiltInText("ציר הבשר", "en")).toMatch(/meat|axis/i);
    expect(localizeBuiltInText("ציר הבשר", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("גלגל התבלינים", "es")).toMatch(/especia|rueda/i);
    expect(localizeBuiltInText("הקלידו הודעה...", "pt-BR")).toMatch(/mensagem/i);
    expect(localizeBuiltInText("ערימת לילה", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique65 leftover Lectora through Masterly education chrome", () => {
    expect(localizeBuiltInText("· קורס חי", "en")).toMatch(/live|course/i);
    expect(localizeBuiltInText("· קורס חי", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("הרשמה ←", "es")).toMatch(/inscrip/i);
    expect(localizeBuiltInText("שם ההורה", "pt-BR")).toMatch(/pai|mãe|nome/i);
    expect(localizeBuiltInText("בחרו מקצוע", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique64 leftover Lumenware through Jewelis product chrome", () => {
    expect(localizeBuiltInText("רמקול Orbit", "en")).toMatch(/orbit|speaker/i);
    expect(localizeBuiltInText("רמקול Orbit", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מברשת איפור", "es")).toMatch(/brocha|maquillaje/i);
    expect(localizeBuiltInText("עט נובע", "pt-BR")).toMatch(/caneta|tinteiro/i);
    expect(localizeBuiltInText("דבש בר", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique63 Dunewave seed lines without phrasebook smash", () => {
    expect(localizeBuiltInText("מרפסת פרטית עם נוף לים פתוח.", "en")).toMatch(/private balcony|sea view/i);
    expect(localizeBuiltInText("מרפסת פרטית עם נוף לים פתוח.", "en")).not.toMatch(/balcony private/i);
    expect(localizeBuiltInText("מרפסת פרטית עם נוף לים פתוח.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מתי אתם מגיעים?", "pt-BR")).toMatch(/chegam/i);
  });

  it("localizes unique62 leftover Growthly through Franchora chrome", () => {
    expect(localizeBuiltInText("קולנוע של עבודה שמתקדמת", "en")).toMatch(/cinema|work/i);
    expect(localizeBuiltInText("קולנוע של עבודה שמתקדמת", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("ארבעה רגעים לפני סגירה", "es")).toMatch(/cierre|momento/i);
    expect(localizeBuiltInText("דברו עם מגייס/ת", "pt-BR")).toMatch(/recrut/i);
    expect(localizeBuiltInText("מילות מפתח", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique61 leftover Horizon through Axispoint chrome", () => {
    expect(localizeBuiltInText("וילות על הדיונות", "en")).toMatch(/villa|dune/i);
    expect(localizeBuiltInText("וילות על הדיונות", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מחירים אמיתיים", "es")).toMatch(/precio/i);
    expect(localizeBuiltInText("מחשבון משכנתא (הדגמה)", "pt-BR")).toMatch(/hipoteca|calcul/i);
    expect(localizeBuiltInText("סגירת עסקה", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("תחום 1 - כותרת", "en")).toMatch(/practice|title/i);
    expect(localizeBuiltInText("תחום 1 - כותרת", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique60 leftover Gridline through Citadel chrome", () => {
    expect(localizeBuiltInText("תוכנית עבודה", "en")).toMatch(/work plan/i);
    expect(localizeBuiltInText("תוכנית עבודה", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מקומות עבודה", "es")).toMatch(/trabajo/i);
    expect(localizeBuiltInText("שם מלא / חברה", "pt-BR")).toMatch(/nome|empresa/i);
    expect(localizeBuiltInText("יעד הפרויקט", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique59 leftover Arbora through Vitalis chrome", () => {
    expect(localizeBuiltInText("אדריכלות נוף", "en")).toMatch(/landscape/i);
    expect(localizeBuiltInText("אדריכלות נוף", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שקט ביום הגדול", "es")).toMatch(/quietud|día/i);
    expect(localizeBuiltInText("פגישת אבחון", "pt-BR")).toMatch(/diagnóstico|reunião/i);
    expect(localizeBuiltInText("צפו בפרויקטים", "ar")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique58 leftover Lotera through Vespera chrome", () => {
    expect(localizeBuiltInText("שלחו בקשת סיור", "en")).toMatch(/tour|request/i);
    expect(localizeBuiltInText("שלחו בקשת סיור", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("טלפון פרטי", "es")).toMatch(/teléfono|privad/i);
    expect(localizeBuiltInText("כמה חדרים?", "pt-BR")).toMatch(/quarto/i);
    expect(localizeBuiltInText("בקשת כרטיסים", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קלייה קטנה. טעם גדול.", "en")).toMatch(/roast|taste/i);
  });

  it("localizes unique57 leftover Vowline through Florique chrome", () => {
    expect(localizeBuiltInText("חבילות תכנון", "en")).toMatch(/plan/i);
    expect(localizeBuiltInText("חבילות תכנון", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("מספרים עם הד.", "es")).toMatch(/eco|número/i);
    expect(localizeBuiltInText("שם החיה", "pt-BR")).toMatch(/pet|nome/i);
    expect(localizeBuiltInText("דגם הרכב", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("גיטרה / בס", "en")).toMatch(/guitar|bass/i);
    expect(localizeBuiltInText("זרים", "es")).toMatch(/ramo/i);
    expect(localizeBuiltInText("ברכה, כתובת ושעה רצויה", "pt-BR")).toMatch(/endereço/i);
  });

  it("localizes unique56 leftover Markora through Formara chrome", () => {
    expect(localizeBuiltInText("מה אתם רוצים לשווק?", "en")).toMatch(/market/i);
    expect(localizeBuiltInText("מה אתם רוצים לשווק?", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("השוואת לפני ואחרי", "es")).toMatch(/antes|después/i);
    expect(localizeBuiltInText("שמרו מקום", "pt-BR")).toMatch(/lugar|reserv/i);
    expect(localizeBuiltInText("תהליך הליווי", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("צילום מוצר", "en")).toMatch(/product|photo/i);
    expect(localizeBuiltInText("דוחות הנהלה", "es")).toMatch(/informe|dirección/i);
    expect(localizeBuiltInText("שירותי סטודיו", "pt-BR")).toMatch(/estúdio|serviço/i);
    expect(localizeBuiltInText("אירוח פרטי", "en")).toMatch(/private|host/i);
    expect(localizeBuiltInText("אירוח פרטי", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique55 leftover Fluxora through Advisora chrome", () => {
    expect(localizeBuiltInText("הפיד שלי", "en")).toMatch(/feed/i);
    expect(localizeBuiltInText("הפיד שלי", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קהילות בסיסיות", "es")).toMatch(/comunidad/i);
    expect(localizeBuiltInText("ליווי עד חתימה", "pt-BR")).toMatch(/assinatura|acompanh/i);
    expect(localizeBuiltInText("בקשת אירוע", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לקביעת תור אישי", "en")).toMatch(/book|appoint/i);
    expect(localizeBuiltInText("רפואת ילדים", "en")).toMatch(/pediatric/i);
    expect(localizeBuiltInText("מה התקלה?", "es")).toMatch(/avería|falla|problema/i);
    expect(localizeBuiltInText("שיחת אבחון", "pt-BR")).toMatch(/diagnóstico|chamada/i);
    expect(localizeBuiltInText("תבנית Fluxora · Bizuply Studio", "en")).toMatch(/fluxora|template/i);
    expect(localizeBuiltInText("תבנית Fluxora · Bizuply Studio", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique54 leftover Shinora and Nexora chrome", () => {
    expect(localizeBuiltInText("לקביעת ייעוץ", "en")).toMatch(/consult|book/i);
    expect(localizeBuiltInText("לקביעת ייעוץ", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("חנות מוצרי טיפוח", "es")).toMatch(/tienda|cuidado/i);
    expect(localizeBuiltInText("עד 3 משתמשים", "pt-BR")).toMatch(/usuários|3/i);
    expect(localizeBuiltInText("תיאום דמו", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בואו נראה לכם את Nexora בפעולה.", "en")).toMatch(/nexora|action/i);
    expect(localizeBuiltInText("השראה", "en")).toMatch(/inspir/i);
    expect(localizeBuiltInText("עוזר AI מובנה", "en")).toMatch(/assistant|AI/i);
    expect(localizeBuiltInText("עוזר AI מובנה", "en")).not.toMatch(/[\u0590-\u05FF]/);
  });

  it("localizes unique38 leftover built-in preview headlines", () => {
    expect(localizeBuiltInText("מומחה סושיאל\nשבונה נוכחות\nשמוכרת בשבילך", "en")).toMatch(/social expert/i);
    expect(localizeBuiltInText("מומחה סושיאל\nשבונה נוכחות\nשמוכרת בשבילך", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("שמוכרת בשבילך", "es")).toMatch(/vende/i);
    expect(localizeBuiltInText("לא מעלים פוסטים.", "pt-BR")).toMatch(/postamos|publicamos/i);
    expect(localizeBuiltInText("מייצרים פניות.", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("בונים ביקוש.", "en")).toMatch(/demand/i);
    expect(
      localizeBuiltInText("אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית", "en"),
    ).toMatch(/strategy|campaign/i);
    expect(
      localizeBuiltInText("אסטרטגיה · תוכן · קמפיינים · צמיחה דיגיטלית", "en"),
    ).not.toMatch(/[\u0590-\u05FF]/);
    expect(
      localizeBuiltInText(
        "בניית מותג דיגיטלי, תוכן שמייצר אמון וקמפיינים שמביאים לידים,\nלקוחות ותוצאות מדידות.",
        "pt-BR",
      ),
    ).toMatch(/marca digital|confiança|leads/i);
    expect(localizeBuiltInText("קביעת שיחת ייעוץ", "en")).toMatch(/consult/i);
    expect(localizeBuiltInText("צפייה בשירותים", "es")).toMatch(/servicio/i);
    expect(localizeBuiltInText("קביעת שיחה", "pt-BR")).toMatch(/chamada|agendar/i);
  });

  it("localizes unique97 leftover section-variant chrome", () => {
    expect(localizeBuiltInText("שם איש צוות", "en")).toBe("Team member name");
    expect(localizeBuiltInText("שם איש צוות", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לקוחה חדשה", "es")).toMatch(/clienta|cliente/i);
    expect(localizeBuiltInText("מעבר לחנות", "pt-BR")).toMatch(/loja|Ir/i);
    expect(localizeBuiltInText("שליחת וואטסאפ", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("קנייה עכשיו", "en")).toMatch(/Buy now/i);
  });

  it("localizes unique98 leftover section-variant chrome", () => {
    expect(localizeBuiltInText("מנויים ותשלומים.", "en")).toMatch(/subscription|payment/i);
    expect(localizeBuiltInText("מנויים ותשלומים.", "en")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("יצירת קשר – מפוצל", "es")).toMatch(/Contacto|dividido/i);
    expect(localizeBuiltInText("האם יש תמיכה בעברית?", "pt-BR")).toMatch(/hebraico|suporte/i);
    expect(localizeBuiltInText("עלינו", "ar")).not.toMatch(/[\u0590-\u05FF]/);
    expect(localizeBuiltInText("לחצו", "en")).toMatch(/Click/i);
    expect(localizeBuiltInText("שלחו", "es")).toMatch(/Envi/i);
  });

  it("keeps a saved rich-store headline over localized unique17 defaults", () => {
    const defaults = localizeBuiltInTemplateSeed(
      { brandName: "סטודיו מסחר עשיר", productsEyebrow: "בחירות החנות" },
      "en",
    );
    expect(defaults.brandName).toBe("Rich commerce studio");
    const merged = {
      ...defaults,
      brandName: "Our boutique name",
    };
    expect(merged.brandName).toBe("Our boutique name");
    expect(merged.productsEyebrow).toBe("Store picks");
  });
});
