import React, { useEffect, useState } from "react";
import API from "../../../api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./GoalsPage.css";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "clients",
    target: 0,
    deadline: ""
  });
  const [data, setData] = useState({});
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: business } = await API.get("/business/my");
        if (!business?._id) throw new Error("לא הוחזר מזהה עסק");
        const response = await API.get(`/business/${business._id}/stats`);
        setData(response.data);
      } catch (error) {
        console.error("❌ שגיאה בטעינת סטטיסטיקות:", error.response?.data || error.message);
      }
    };
    fetchStats();
  }, []);

  const calculateProgress = (goal) => {
    if (!goal || !data || goal.target <= 0) return 0;
    const safeValue = (value) => typeof value === "number" && !isNaN(value) ? value : 0;
    switch (goal.type) {
      case "clients": return Math.min((safeValue(data.newClients) / goal.target) * 100, 100);
      case "revenue": return Math.min((safeValue(data.totalRevenue) / goal.target) * 100, 100);
      case "orders": return Math.min((safeValue(data.totalOrders) / goal.target) * 100, 100);
      case "messages": return Math.min((safeValue(data.totalMessages) / goal.target) * 100, 100);
      case "returningClients": return Math.min((safeValue(data.returningClients) / goal.target) * 100, 100);
      case "reviews": return Math.min((safeValue(data.reviews) / goal.target) * 100, 100);
      default: return 0;
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    setGoals([...goals, { ...newGoal, id: Date.now(), createdAt: new Date().toISOString() }]);
    setNewGoal({ title: "", type: "clients", target: 0, deadline: "" });
  };

  const renderIcon = (type) => {
    const icons = {
      clients: "👥",
      revenue: "💰",
      orders: "🛒",
      messages: "💬",
      returningClients: "🔁",
      reviews: "⭐"
    };
    return icons[type] || "🎯";
  };

  const getMotivation = (progress) => {
    const level = Math.floor(progress / 10) * 10;
    const messages = {
      0: "כל התחלה מתחילה בצעד אחד – קדימה!",
      10: "אתה בתנועה, תמשיך להתקדם!",
      20: "יפה! כבר 20% בדרך ליעד.",
      30: "התקדמות מעולה – תמשיך באותו קצב!",
      40: "כמעט בחצי – אתה על זה!",
      50: "חצי דרך עברת – שאפו!",
      60: "קצב חזק! אל תעצור עכשיו.",
      70: "זה כבר מרגיש קרוב – תן פוש אחרון.",
      80: "כמעט שם! עוד קצת וזה שלך.",
      90: "סנטימטר מהיעד – זה הזמן לסיים בגדול.",
      100: "היעד הושג! כל הכבוד על ההתמדה 🎉"
    };
    return messages[level] || "אתה בדרך הנכונה – תמשיך כך!";
  };

  const getActionTip = (type) => {
    const tips = {
      clients: "✉️ שלח לידים מהשבוע האחרון הצעה מיוחדת או קופון",
      revenue: "📊 צור מבצע חם לחבילת שירות/מוצר עם ערך גבוה",
      orders: "🔔 תזכיר ללקוחות שלא סיימו רכישה – אל תוותר עליהם",
      messages: "💬 פנה אישית ללקוחות שפנו ולא רכשו עדיין",
      returningClients: "👋 שלח תודה עם קוד הנחה לחוזרים",
      reviews: "🌟 שלח בקשה קצרה להמלצה עם לינק נוח"
    };
    return tips[type] || "🎯 בצע פעולה קטנה היום שתקרב אותך למטרה.";
  };

  const getLastAchievement = () => {
    const completed = goals.filter(goal => calculateProgress(goal) === 100);
    if (completed.length === 0) return null;
    const last = completed[completed.length - 1];
    return `🏆 השגת יעד: "${last.title}" בתאריך ${new Date(last.deadline).toLocaleDateString("he-IL")}`;
  };

  const completedGoalsList = goals.filter(goal => calculateProgress(goal) === 100);

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>🎯 היעדים שלי</h1>
        <div>
          <button className="add-goal-btn" onClick={handleAddGoal}>➕ הוסף יעד</button>
          <button className="add-goal-btn" style={{ marginRight: '10px', backgroundColor: '#555' }} onClick={() => setShowHistory(!showHistory)}>🕘 היסטוריית יעדים</button>
        </div>
      </div>

      <div className="new-goal-form">
        <label>שם היעד</label>
        <input placeholder="למשל: השגת 10 לקוחות" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
        <label>סוג יעד</label>
        <select value={newGoal.type} onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}>
          <option value="clients">לקוחות חדשים</option>
          <option value="revenue">הכנסות</option>
          <option value="orders">הזמנות / פגישות</option>
          <option value="messages">פניות מהאתר</option>
          <option value="returningClients">לקוחות חוזרים</option>
          <option value="reviews">המלצות / דירוגים</option>
        </select>
        <label>יעד מספרי</label>
        <input type="number" placeholder="כמה?" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })} />
        <label>תאריך יעד</label>
        <input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} />
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>✅ יעדים שהושלמו</h3>
          {completedGoalsList.map(goal => (
            <div key={goal.id} className="goal-card">
              <strong>{renderIcon(goal.type)} {goal.title}</strong>
              <p>הושלם בתאריך: {new Date(goal.deadline).toLocaleDateString("he-IL")}</p>
            </div>
          ))}
        </div>
      )}

      <TransitionGroup className="goals-list">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          return (
            <CSSTransition key={goal.id} timeout={400} classNames="fade" appear>
              <div className="goal-card">
                <h3>{renderIcon(goal.type)} {goal.title}</h3>
                <p className="goal-sub">יעד: {goal.target} | תאריך: {goal.deadline}</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-label">{Math.round(progress)}%</span>
                <button className="summary-btn" onClick={() => setSelectedGoal(goal)}>📋 סיכום והשראה</button>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>

      {selectedGoal && (
        <div className="summary-modal">
          <div className="summary-box">
            <h2>✨ סיכום ליעד: {selectedGoal.title}</h2>
            <p><strong>התקדמות:</strong> {Math.round(calculateProgress(selectedGoal))}%</p>
            <p><strong>השראה:</strong> {getMotivation(calculateProgress(selectedGoal))}</p>
            <p><strong>המלצה:</strong> {getActionTip(selectedGoal.type)}</p>
            {getLastAchievement() && <p><strong>{getLastAchievement()}</strong></p>}
            <button onClick={() => setSelectedGoal(null)}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
