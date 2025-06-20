import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot";
import "../styles/HelpCenter.css";

export default function HelpCenter() {
  const { user } = useAuth();
  const businessId = user?.businessId;

  const popularArticles = [
    {
      id: 1,
      title: "בניית עמוד עסקי",
      description: "צעד אחר צעד לבניית עמוד עסקי מושך שימשוך אליך לקוחות חדשים.",
      url: businessId ? `/business/${businessId}/dashboard/articles/build-business-page` : "/",
    },
    {
      id: 2,
      title: "שימוש נכון בצ'אט עם לקוחות",
      description: "טיפים לניהול שיחות צ'אט חכמות שיחזקו את הקשר עם הלקוחות שלך.",
      url: businessId ? `/business/${businessId}/dashboard/articles/chat-guide` : "/",
    },
    {
      id: 3,
      title: "דשבורד העסק",
      description: "לגלות איך הדשבורד נותן לך שליטה מלאה ונראות מלאה על העסק.",
      url: businessId ? `/business/${businessId}/dashboard/articles/dashboard-guide` : "/",
    },
    {
      id: 4,
      title: "יומן תיאום תורים / CRM",
      description: "ניהול תורים ולקוחות במקום אחד – פשוט ויעיל כמו שצריך.",
      url: businessId ? `/business/${businessId}/dashboard/articles/appointment-crm-guide` : "/",
    },
    {
      id: 5,
      title: "יועץ עסקליק ושותף AI",
      description: "הכירו את היועץ הדיגיטלי שישדרג את העסק עם בינה מלאכותית.",
      url: businessId ? `/business/${businessId}/dashboard/articles/ai-companion` : "/",
    },
    {
      id: 6,
      title: "שיתופי פעולה בין עסקים",
      description: "איך להרחיב את העסק דרך שיתופי פעולה מנצחים עם עסקים אחרים.",
      url: businessId ? `/business/${businessId}/dashboard/articles/business-collaboration` : "/",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    { question: "איך לערוך את פרופיל העסק שלי?", answer: 'עבור ללשונית "עריכת עמוד עסקי" בתפריט הצד.' },
    { question: "איך ליצור קשר עם לקוחות?", answer: 'השתמש בלשונית "הודעות מלקוחות" כדי לשלוח ולקבל הודעות.' },
    { question: "איך לנהל את ה-CRM?", answer: 'בקרו בלשונית "מערכת CRM" לניהול הלקוחות והפגישות שלכם.' },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.includes(searchTerm) || faq.answer.includes(searchTerm)
  );

  const [chatOpen, setChatOpen] = useState(true);

  return (
    <div className="help-center-container">
      <h1>👋 ברוכים הבאים למרכז העזרה של עסקליק</h1>
      <p>כאן תוכלו למצוא תשובות, מדריכים וכלים לניהול העסק הדיגיטלי שלכם.</p>

      {/* שאר התוכן: חיפוש, מאמרים, שאלות נפוצות, יצירת קשר */}

      <ChatBot chatOpen={chatOpen} setChatOpen={setChatOpen} />
    </div>
  );
}
