"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Markdown from "markdown-to-jsx";
import API from "@api";
import {
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Gauge,
  Lightbulb,
  Loader2,
  Megaphone,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wand2,
} from "lucide-react";

type ChatRole = "assistant" | "user";

type AdvisorMode =
  | "general"
  | "weekly_plan"
  | "monthly_plan"
  | "yearly_plan"
  | "marketing"
  | "actions"
  | "profitability"
  | "customer_retention";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type BusinessAdvisorTabProps = {
  businessId?: string | null;
  conversationId?: string | null;
  userId?: string | null;
  businessDetails?: unknown;
};

type BusinessResponse = {
  business?: {
    extraQuestionsAllowed?: number;
    monthlyQuestionCount?: number;
    extraQuestionsUsed?: number;
  };
};

type AdvisorActionPayload = Record<string, unknown>;

type AdvisorAction = {
  id?: string;
  type:
    | "CREATE_TASK"
    | "CREATE_MARKETING_MESSAGE"
    | "CREATE_POST"
    | "OPEN_LEADS"
    | "OPEN_CLIENTS"
    | "CREATE_WEEKLY_PLAN"
    | "CREATE_MONTHLY_PLAN"
    | "CUSTOM";
  label: string;
  description?: string;
  payload?: AdvisorActionPayload;
  requiresConfirmation?: boolean;
};

type AdvisorResponse = {
  answer?: string;
  actions?: AdvisorAction[];
};

type AdvisorQuickAction = {
  id: AdvisorMode;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
  icon: React.ElementType;
  prompt: string;
};

type PresetQuestion = {
  title: string;
  question: string;
  icon: React.ElementType;
};

type AdvisorFocusCard = {
  title: string;
  text: string;
  icon: React.ElementType;
};

type AdvisorMetricCard = {
  title: string;
  value: string;
  text: string;
  icon: React.ElementType;
};

const buildAdvisorPrompt = (userPrompt: string, mode: AdvisorMode) => {
  const baseInstructions = `
אתה יועץ BizUply — יועץ עסקי, שיווקי ותפעולי חכם לעסקים קטנים ובינוניים.

חשוב מאוד:
- אל תענה תשובה כללית.
- תתייחס כאילו אתה מנתח עסק אמיתי מתוך מערכת ניהול עסק.
- תבנה תשובה מסודרת, מקצועית ופרקטית.
- כל המלצה חייבת להפוך לפעולה ברורה.
- תכתוב בעברית, בגובה העיניים, אבל בסגנון עסקי מקצועי.
- תשתמש בכותרות ברורות.
- אל תבטיח נתונים שאין לך. אם חסר נתון, תכתוב "לפי הנתונים הקיימים במערכת" או "כדאי להשלים נתון זה".
- בכל תשובה תכלול: אבחון, בעיה מרכזית, הזדמנות, תכנית פעולה, מדדי הצלחה ונוסחים מוכנים אם רלוונטי.
- אם יש פעולה שהמערכת יכולה לבצע, תציע אותה בצורה ברורה לבעל העסק.
- אל תכתוב רק רעיונות. תכתוב מה לבצע, מתי, למי, ואיך למדוד הצלחה.

מבנה תשובה רצוי:
1. סיכום מצב העסק
2. אבחון מקצועי
3. הבעיה המרכזית כרגע
4. ההזדמנות הכי גדולה
5. תכנית פעולה מסודרת
6. פעולות מיידיות לביצוע
7. מדדי הצלחה
8. טקסטים מוכנים לשליחה / פרסום כשזה מתאים
`;

  const modeInstructions: Record<AdvisorMode, string> = {
    general: `
מצב עבודה: ייעוץ כללי.
ענה לפי השאלה של בעל העסק, אבל תמיד תחבר את זה לפעולות עסקיות אמיתיות.
`,

    weekly_plan: `
מצב עבודה: בניית תכנית עסקית שבועית.

בנה תכנית לשבוע הקרוב.
התכנית חייבת לכלול:
- יעד שבועי ברור
- אבחון קצר של מצב העסק
- 3 עד 5 מטרות לשבוע
- חלוקה לפי ימים: ראשון עד שבת או לפי ימי פעילות
- פעולות לביצוע בכל יום
- משימות שיווק
- משימות מכירה / לידים
- משימות שימור לקוחות
- מדדי הצלחה לשבוע
- הודעות מוכנות לשליחה ללקוחות אם מתאים
`,

    monthly_plan: `
מצב עבודה: בניית תכנית חודשית לצמיחה.

בנה תכנית חודשית מלאה.
התכנית חייבת לכלול:
- יעד מרכזי לחודש
- ניתוח מצב העסק
- שבוע 1: סדר, אבחון וסגירת פערים
- שבוע 2: קידום שירות מרכזי
- שבוע 3: החזרת לקוחות ושימור
- שבוע 4: מדידה, שיפור והכנה לחודש הבא
- פעולות שיווק
- פעולות מכירה
- פעולות תפעול
- מדדי הצלחה
- רעיונות למבצע חודשי
- נוסחי הודעות / פוסטים אם מתאים
`,

    yearly_plan: `
מצב עבודה: בניית תכנית עסקית שנתית.

בנה תכנית שנתית מסודרת.
התכנית חייבת לכלול:
- חזון עסקי לשנה הקרובה
- מטרות שנתיות
- חלוקה לרבעונים
- רבעון 1: בניית תשתית וסדר
- רבעון 2: צמיחה והגדלת הכנסות
- רבעון 3: התרחבות, שיתופי פעולה ואוטומציות
- רבעון 4: מקסום רווח, שימור וניתוח שנתי
- מדדים שנתיים
- מה לבדוק כל חודש
- מה לבצע כבר עכשיו
`,

    marketing: `
מצב עבודה: שיווק ומבצעים.

בנה תכנית שיווקית מעשית.
התכנית חייבת לכלול:
- מה השירות שכדאי לקדם
- למי כדאי לפנות
- מה ההצעה השיווקית
- איזה פוסט לפרסם
- איזה הודעת וואטסאפ לשלוח
- איזה סטורי / תוכן קצר להעלות
- איך למדוד אם זה עבד
- איך לא לפגוע ברווחיות עם מבצע לא נכון
`,

    actions: `
מצב עבודה: פעולות דחופות לביצוע.

נתח מה צריך לעשות עכשיו.
התשובה חייבת לכלול:
- 5 עד 10 פעולות מיידיות
- סדר עדיפויות
- מה דחוף ומה יכול לחכות
- מי קהל היעד של כל פעולה
- איזה פעולה אפשר לבצע מתוך המערכת
- משימות מומלצות ליצירה
- נוסחים מוכנים כשמתאים
`,

    profitability: `
מצב עבודה: רווחיות ותמחור.

נתח תמחור ורווחיות.
התשובה חייבת לכלול:
- איפה העסק יכול להרוויח יותר
- האם יש שירותים שכדאי לקדם יותר
- האם יש שירותים שאולי גוזלים זמן ולא מספיק רווחיים
- איך להעלות ערך בלי רק להוריד מחיר
- רעיונות לחבילות
- המלצות לתמחור טוב יותר
- מה לבדוק לפני שינוי מחיר
`,

    customer_retention: `
מצב עבודה: שימור והחזרת לקוחות.

בנה תכנית החזרת לקוחות.
התכנית חייבת לכלול:
- איזה לקוחות כדאי להחזיר
- מתי לפנות אליהם
- איזה הודעה לשלוח
- איך ליצור תהליך קבוע לשימור לקוחות
- איך להפוך לקוח חד פעמי ללקוח חוזר
- איך להשתמש בביקורות והמלצות
- מדדי הצלחה לשימור
`,
  };

  return `${baseInstructions}

${modeInstructions[mode]}

השאלה / הבקשה של בעל העסק:
${userPrompt}
`;
};

const advisorFocusCards: AdvisorFocusCard[] = [
  {
    title: "אבחון עסקי",
    text: "היועץ מנתח את מצב העסק, מזהה בעיות, הזדמנויות וסדרי עדיפויות.",
    icon: BrainCircuit,
  },
  {
    title: "תכניות עבודה",
    text: "בניית תכנית לשבוע, חודש או שנה עם פעולות, יעדים ומדדים.",
    icon: ClipboardCheck,
  },
  {
    title: "שיווק ומכירות",
    text: "רעיונות למבצעים, הודעות ללקוחות, פוסטים וקידום שירותים.",
    icon: Megaphone,
  },
];

const advisorMetricCards: AdvisorMetricCard[] = [
  {
    title: "תכנון עסקי",
    value: "360°",
    text: "עסקי, שיווקי ותפעולי במקום אחד",
    icon: Gauge,
  },
  {
    title: "פעולות חכמות",
    value: "AI",
    text: "המלצות שהופכות למשימות וביצוע",
    icon: Wand2,
  },
  {
    title: "צמיחה",
    value: "יעדים",
    text: "שבועי, חודשי ושנתי",
    icon: TrendingUp,
  },
  {
    title: "לקוחות",
    value: "שימור",
    text: "החזרת לקוחות ולידים שלא נסגרו",
    icon: Users,
  },
];

const advisorQuickActions: AdvisorQuickAction[] = [
  {
    id: "weekly_plan",
    title: "תכנית לשבוע הקרוב",
    subtitle: "מה לעשות השבוע",
    description:
      "אבחון קצר, יעדים, פעולות לפי ימים, משימות שיווק ומכירה, ומדדי הצלחה.",
    buttonLabel: "בנה תכנית שבועית",
    icon: CalendarDays,
    prompt:
      "בנה לי תכנית ייעוץ עסקי מלאה לשבוע הקרוב לפי נתוני העסק שלי. אני רוצה יעדים, פעולות לפי ימים, משימות, נוסחים מוכנים ומדדי הצלחה.",
  },
  {
    id: "monthly_plan",
    title: "תכנית חודשית לצמיחה",
    subtitle: "חודש עבודה מסודר",
    description:
      "תכנית של 4 שבועות: סידור העסק, קידום שירותים, החזרת לקוחות ומדידה.",
    buttonLabel: "בנה תכנית חודשית",
    icon: BarChart3,
    prompt:
      "בנה לי תכנית ייעוץ עסקי חודשית מלאה לצמיחה. תכלול חלוקה לשבועות, שיווק, מכירות, שימור לקוחות, תפעול, יעדים ומדדים.",
  },
  {
    id: "yearly_plan",
    title: "תכנית שנתית",
    subtitle: "אסטרטגיה לשנה",
    description:
      "חזון שנתי, מטרות, חלוקה לרבעונים, פעולות צמיחה, שימור ורווחיות.",
    buttonLabel: "בנה תכנית שנתית",
    icon: Rocket,
    prompt:
      "בנה לי תכנית עסקית שנתית מסודרת לעסק. תכלול מטרות, חלוקה לרבעונים, פעולות לכל רבעון, מדדי הצלחה ומה להתחיל לבצע כבר עכשיו.",
  },
  {
    id: "marketing",
    title: "שיווק ומבצעים",
    subtitle: "להביא יותר לקוחות",
    description:
      "בחירת שירות לקידום, מבצע נכון, הודעות וואטסאפ, פוסטים ותוכן לעסק.",
    buttonLabel: "בנה תכנית שיווק",
    icon: Megaphone,
    prompt:
      "בנה לי תכנית שיווקית לעסק לפי הנתונים שלי. תמליץ מה לקדם, למי לפנות, איזה מבצע לעשות, ותן לי הודעות וואטסאפ ופוסטים מוכנים.",
  },
  {
    id: "actions",
    title: "פעולות דחופות",
    subtitle: "מה לעשות עכשיו",
    description:
      "רשימת פעולות מיידיות לפי סדר עדיפויות: לידים, לקוחות, תורים ושיווק.",
    buttonLabel: "מצא פעולות עכשיו",
    icon: Clock3,
    prompt:
      "נתח את העסק שלי ותן לי רשימת פעולות דחופות לביצוע עכשיו לפי סדר עדיפויות. תכתוב מה לעשות, למה זה חשוב, ואיך לבצע.",
  },
  {
    id: "profitability",
    title: "רווחיות ותמחור",
    subtitle: "להרוויח יותר נכון",
    description:
      "ניתוח שירותים, תמחור, חבילות, ערך ללקוח והגדלת הכנסה בלי לפגוע במכירות.",
    buttonLabel: "נתח רווחיות",
    icon: TrendingUp,
    prompt:
      "נתח את הרווחיות והתמחור של העסק שלי. תמליץ אילו שירותים לקדם, איפה אפשר להעלות ערך, אילו חבילות ליצור ומה לבדוק לפני שינוי מחירים.",
  },
  {
    id: "customer_retention",
    title: "שימור והחזרת לקוחות",
    subtitle: "לקוחות חוזרים",
    description:
      "תהליך החזרת לקוחות, פנייה ללקוחות שלא חזרו, ביקורות ותזכורות חכמות.",
    buttonLabel: "בנה תכנית שימור",
    icon: Users,
    prompt:
      "בנה לי תכנית שימור והחזרת לקוחות. תכתוב למי כדאי לפנות, מתי, איזה הודעות לשלוח, ואיך להפוך לקוחות חד פעמיים ללקוחות חוזרים.",
  },
];

const presetQuestions: PresetQuestion[] = [
  {
    title: "סדר עדיפויות",
    question: "מה הדבר הכי חשוב לשפר בעסק השבוע?",
    icon: Target,
  },
  {
    title: "לידים ומכירות",
    question: "איך לסגור יותר לידים שכבר פנו לעסק?",
    icon: CheckCircle2,
  },
  {
    title: "שיווק",
    question: "איזה שירות הכי כדאי לי לקדם עכשיו ולמה?",
    icon: Megaphone,
  },
  {
    title: "רווחיות",
    question: "איך להגדיל רווחיות בלי להוריד מחירים?",
    icon: TrendingUp,
  },
];

export default function BusinessAdvisorTab({
  businessId,
  conversationId,
  userId,
  businessDetails,
}: BusinessAdvisorTabProps) {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [startedChat, setStartedChat] = useState(false);
  const [activeMode, setActiveMode] = useState<AdvisorMode>("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastActions, setLastActions] = useState<AdvisorAction[]>([]);
  const [executingActionId, setExecutingActionId] = useState<string | null>(
    null
  );
  const [remainingQuestions, setRemainingQuestions] = useState<number | null>(
    null
  );

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const isLimitReached =
    remainingQuestions !== null && remainingQuestions <= 0;

  const balanceLabel = useMemo(() => {
    if (remainingQuestions === null) return "טוען מאזן שאלות...";

    if (remainingQuestions === 0) {
      return "לא נשארו שאלות AI החודש";
    }

    if (remainingQuestions === 1) {
      return "נשארה שאלת AI אחת החודש";
    }

    return `נשארו ${remainingQuestions} שאלות AI החודש`;
  }, [remainingQuestions]);

  const activeModeLabel = useMemo(() => {
    const found = advisorQuickActions.find((item) => item.id === activeMode);

    if (found) return found.title;

    return "יועץ כללי";
  }, [activeMode]);

  const refreshRemainingQuestions = useCallback(async () => {
    if (!businessId) return;

    try {
      const res = await API.get<BusinessResponse>(
        `/business/${businessId}?t=${Date.now()}`
      );

      const business = res.data.business;

      if (!business) {
        setRemainingQuestions(null);
        return;
      }

      const maxQuestions = 60 + (business.extraQuestionsAllowed || 0);
      const usedQuestions =
        (business.monthlyQuestionCount || 0) +
        (business.extraQuestionsUsed || 0);

      setRemainingQuestions(Math.max(maxQuestions - usedQuestions, 0));
    } catch {
      setRemainingQuestions(null);
    }
  }, [businessId]);

  useEffect(() => {
    void refreshRemainingQuestions();
  }, [refreshRemainingQuestions]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 0) return prev;

      return [
        {
          role: "assistant",
          content:
            "היי 👋 אני **יועץ BizUply** שלך.\n\nאני יכול לנתח את העסק, לבנות תכנית שבועית / חודשית / שנתית, להציע פעולות דחופות, להכין הודעות שיווק, לעזור בשימור לקוחות, תמחור, רווחיות וסגירת לידים.\n\nבחר פעולה מהכרטיסים למעלה או כתוב לי מה תרצה לשפר בעסק.",
        },
      ];
    });
  }, []);

  const sendMessage = useCallback(
    async (
      promptText: string,
      conversationMessages: ChatMessage[],
      mode: AdvisorMode = "general"
    ) => {
      const cleanPrompt = promptText.trim();

      if (!businessId || !cleanPrompt || loading) return;

      if (isLimitReached) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❗ הגעת למגבלת שאלות ה-AI החודשית שלך.",
          },
        ]);
        return;
      }

      setLoading(true);
      setLastActions([]);
      setActiveMode(mode);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const finalPrompt = buildAdvisorPrompt(cleanPrompt, mode);

      try {
        const response = await API.post<AdvisorResponse>(
          "/chat/business-advisor",
          {
            businessId,
            prompt: finalPrompt,
            rawPrompt: cleanPrompt,
            advisorMode: mode,
            businessDetails,
            profile: {
              conversationId: conversationId || null,
              userId: userId || null,
            },
            messages: conversationMessages,
          },
          { signal: controller.signal }
        );

        const answer = response.data.answer || "❌ לא התקבלה תשובה מהשרת.";
        const actions = Array.isArray(response.data.actions)
          ? response.data.actions
          : [];

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
          },
        ]);

        setLastActions(actions);

        setRemainingQuestions((prev) =>
          prev !== null ? Math.max(prev - 1, 0) : null
        );

        await refreshRemainingQuestions();
      } catch (error) {
        const err = error as Error;

        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "⚠️ משהו השתבש בזמן ניתוח העסק. נסה שוב.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [
      businessId,
      businessDetails,
      conversationId,
      userId,
      loading,
      isLimitReached,
      refreshRemainingQuestions,
    ]
  );

  const handleSubmit = useCallback(() => {
    const cleanInput = userInput.trim();

    if (!cleanInput || loading || isLimitReached) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: cleanInput,
    };

    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setStartedChat(true);
    setUserInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "48px";
    }

    void sendMessage(cleanInput, newMessages, "general");
  }, [userInput, loading, isLimitReached, messages, sendMessage]);

  const handleQuickAction = useCallback(
    (action: AdvisorQuickAction) => {
      if (loading || isLimitReached) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: action.prompt,
      };

      const newMessages = [...messages, userMessage];

      setMessages(newMessages);
      setStartedChat(true);
      setUserInput("");

      void sendMessage(action.prompt, newMessages, action.id);
    },
    [loading, isLimitReached, messages, sendMessage]
  );

  const handlePresetQuestion = useCallback(
    (question: string) => {
      if (loading || isLimitReached) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: question,
      };

      const newMessages = [...messages, userMessage];

      setMessages(newMessages);
      setStartedChat(true);
      setUserInput("");

      void sendMessage(question, newMessages, "general");
    },
    [loading, isLimitReached, messages, sendMessage]
  );

  const executeAdvisorAction = useCallback(
    async (action: AdvisorAction, index: number) => {
      if (!businessId || executingActionId) return;

      const actionKey = action.id || `${action.type}-${index}`;

      setExecutingActionId(actionKey);

      try {
        await API.post("/chat/business-advisor/action", {
          businessId,
          action,
          advisorMode: activeMode,
          profile: {
            conversationId: conversationId || null,
            userId: userId || null,
          },
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `✅ הפעולה בוצעה: **${action.label}**`,
          },
        ]);

        setLastActions((prev) =>
          prev.filter((item, itemIndex) => {
            const currentKey = item.id || `${item.type}-${itemIndex}`;
            return currentKey !== actionKey;
          })
        );
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ לא הצלחתי לבצע את הפעולה כרגע. אפשר לנסות שוב או לבצע ידנית.",
          },
        ]);
      } finally {
        setExecutingActionId(null);
      }
    },
    [businessId, executingActionId, activeMode, conversationId, userId]
  );

  useEffect(() => {
    if (!chatContainerRef.current) return;

    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, lastActions]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <section
      dir="rtl"
      className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-sky-50/70 p-4 text-right text-slate-950 shadow-[0_30px_100px_rgba(109,40,217,0.12)] sm:p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-300/35 blur-3xl" />
        <div className="absolute right-0 top-16 h-96 w-96 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl" />
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/90 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
        <header className="relative overflow-hidden border-b border-slate-100 bg-white px-5 py-6 sm:px-7 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_30%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                יועץ BizUply פעיל
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                מרכז הצמיחה של העסק שלך
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                יועץ אחד שמבין את העסק שלך ומחבר בין ייעוץ עסקי, שיווק,
                תפעול, לקוחות, לידים, תמחור ותכניות עבודה — בלי טאבים ובלי
                בלגן.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white shadow-lg">
                  <ShieldCheck className="h-4 w-4" />
                  המלצות לפי נתוני העסק
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm">
                  <MessageCircle className="h-4 w-4 text-violet-600" />
                  צ׳אט שמכין גם פעולות
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 shadow-sm">
                  <Sparkles className="h-4 w-4 text-violet-600" />
                  מצב נוכחי: {activeModeLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[560px]">
              {advisorFocusCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-3xl border border-violet-100 bg-white/85 p-4 shadow-[0_16px_45px_rgba(15,23,42,0.07)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="mt-3 text-sm font-black text-slate-950">
                      {card.title}
                    </p>

                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                      {card.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {advisorMetricCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-[26px] border border-slate-100 bg-white/90 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black text-slate-400">
                        {card.title}
                      </p>

                      <p className="mt-1 text-2xl font-black text-slate-950">
                        {card.value}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative mt-6 flex flex-col gap-4 rounded-[28px] border border-slate-100 bg-gradient-to-l from-white via-violet-50/60 to-sky-50/70 p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                <Sparkles className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm font-black text-slate-950">
                  מה תרצה שהיועץ יבנה עבורך?
                </p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                  בחר פעולה מוכנה, והיועץ יבנה תכנית מלאה לפי נתוני העסק:
                  אבחון, יעדים, משימות, נוסחים ומדדי הצלחה.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                מאזן חודשי
              </p>

              <div className="mt-1 flex items-end justify-center gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {remainingQuestions ?? "—"}
                </span>
                <span className="pb-1 text-sm font-bold text-slate-500">
                  שאלות
                </span>
              </div>

              <p
                className={`mt-1 text-xs font-bold ${
                  isLimitReached ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {balanceLabel}
              </p>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-7 lg:px-8">
          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {advisorQuickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      disabled={loading || isLimitReached}
                      className="group min-h-[188px] rounded-[28px] border border-slate-200 bg-white p-5 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50 hover:shadow-[0_22px_60px_rgba(109,40,217,0.14)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black text-violet-700">
                            {action.subtitle}
                          </p>

                          <h3 className="mt-1 text-lg font-black text-slate-950">
                            {action.title}
                          </h3>
                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>

                      <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                        {action.description}
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-xs font-black text-white transition group-hover:bg-violet-700">
                        {action.buttonLabel}
                        <ArrowLeft className="h-4 w-4" />
                      </span>
                    </button>
                  );
                })}
              </div>

              {!startedChat && (
                <div className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-slate-950">
                        שאלות מהירות
                      </p>

                      <p className="mt-1 text-xs font-bold text-slate-500">
                        מתאים כשלא צריך תכנית מלאה, אלא תשובה ממוקדת.
                      </p>
                    </div>

                    <Lightbulb className="h-5 w-5 text-violet-600" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {presetQuestions.map((item) => {
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.question}
                          type="button"
                          onClick={() => handlePresetQuestion(item.question)}
                          disabled={loading || isLimitReached}
                          className="group flex min-h-[105px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 text-right shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:bg-violet-50 hover:shadow-[0_18px_50px_rgba(109,40,217,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="text-xs font-black text-violet-700">
                              {item.title}
                            </span>

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                              <Icon className="h-5 w-5" />
                            </span>
                          </span>

                          <span className="mt-4 block text-sm font-black leading-6 text-slate-800">
                            {item.question}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            <section className="flex min-h-[720px] flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
              <div className="border-b border-slate-100 bg-gradient-to-l from-white via-violet-50/70 to-sky-50/70 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      צ׳אט עם יועץ BizUply
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-500">
                      שאל שאלה או אשר פעולות שהיועץ מכין עבורך.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
              >
                <div className="flex flex-col gap-4">
                  {messages.map((msg, index) => {
                    const isAssistant = msg.role === "assistant";

                    return (
                      <div
                        key={`${msg.role}-${index}`}
                        className={`flex ${
                          isAssistant ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[92%] rounded-[26px] px-5 py-4 text-sm leading-7 shadow-xl ${
                            isAssistant
                              ? "border border-slate-200 bg-white text-slate-800"
                              : "bg-gradient-to-br from-violet-600 to-blue-600 text-white"
                          }`}
                        >
                          {isAssistant ? (
                            <div className="max-w-none text-sm leading-7 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-black [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-black [&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:font-black [&_li]:my-1 [&_ol]:my-2 [&_p]:my-2 [&_strong]:text-slate-950 [&_ul]:my-2">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[92%] rounded-[26px] border border-slate-200 bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-xl">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
                          היועץ מנתח את העסק ובונה תשובה מסודרת...
                        </div>
                      </div>
                    </div>
                  )}

                  {lastActions.length > 0 && (
                    <div className="rounded-[26px] border border-violet-100 bg-violet-50/70 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-700" />
                        <p className="text-sm font-black text-slate-950">
                          פעולות שהיועץ יכול לבצע
                        </p>
                      </div>

                      <div className="space-y-2">
                        {lastActions.map((action, index) => {
                          const actionKey =
                            action.id || `${action.type}-${index}`;
                          const isExecuting = executingActionId === actionKey;

                          return (
                            <div
                              key={actionKey}
                              className="rounded-2xl border border-white bg-white p-3 shadow-sm"
                            >
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className="text-sm font-black text-slate-950">
                                    {action.label}
                                  </p>

                                  {action.description && (
                                    <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                                      {action.description}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    executeAdvisorAction(action, index)
                                  }
                                  disabled={isExecuting || !!executingActionId}
                                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-xs font-black text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                                >
                                  {isExecuting ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      מבצע...
                                    </>
                                  ) : (
                                    <>
                                      אשר ובצע
                                      <CheckCircle2 className="h-4 w-4" />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <footer className="border-t border-slate-100 bg-white/90 px-4 py-4 backdrop-blur-xl">
                {isLimitReached && (
                  <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                    הגעת למגבלת שאלות ה-AI החודשית שלך.
                  </div>
                )}

                <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-end">
                  <textarea
                    ref={inputRef}
                    value={userInput}
                    disabled={loading || isLimitReached}
                    rows={1}
                    placeholder="לדוגמה: תבנה לי תכנית עסקית לשבוע הקרוב לפי נתוני העסק שלי"
                    onChange={(e) => {
                      setUserInput(e.target.value);
                      e.currentTarget.style.height = "48px";
                      e.currentTarget.style.height = `${Math.min(
                        e.currentTarget.scrollHeight,
                        140
                      )}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !userInput.trim() || isLimitReached}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 text-sm font-black text-white shadow-lg shadow-violet-200 transition duration-300 hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:hover:translate-y-0 sm:min-w-32"
                  >
                    {loading ? "חושב..." : "שלח"}
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </div>
              </footer>
            </section>
          </div>
        </main>
      </div>
    </section>
  );
}