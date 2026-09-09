import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../../api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./GoalsPage.css";

const GoalsPage = () => {
  const { t } = useTranslation();
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
        if (!business?._id) throw new Error("Business ID was not returned");
        const response = await API.get(`/business/${business._id}/stats`);
        setData(response.data);
      } catch (error) {
        console.error("❌ Error loading statistics:", error.response?.data || error.message);
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
      0: "Every journey starts with a single step — go for it!",
      10: "You’re moving — keep it up!",
      20: "Nice! You’re 20% of the way there.",
      30: "Great progress — maintain the momentum!",
      40: "Almost halfway — you’ve got this!",
      50: "Halfway there — awesome!",
      60: "Strong pace! Don’t stop now.",
      70: "It’s getting close — final push!",
      80: "Almost there! Just a little more.",
      90: "Inches from the goal — finish strong.",
      100: "Goal achieved! Amazing consistency 🎉"
    };
    return messages[level] || "You’re on the right track — keep going!";
  };

  const getActionTip = (type) => {
    const tips = {
      clients: "✉️ Send last week’s leads a special offer or coupon.",
      revenue: "📊 Create a hot promo for a high-value service/product bundle.",
      orders: "🔔 Remind customers who didn’t complete checkout — don’t give up on them.",
      messages: "💬 Personally follow up with people who inquired but haven’t purchased yet.",
      returningClients: "👋 Send a thank-you with a discount code for returning clients.",
      reviews: "🌟 Send a short review request with a handy link."
    };
    return tips[type] || "🎯 Do one small action today that moves you closer to your goal.";
  };

  const getLastAchievement = () => {
    const completed = goals.filter(goal => calculateProgress(goal) === 100);
    if (completed.length === 0) return null;
    const last = completed[completed.length - 1];
    return `🏆 Achieved goal: "${last.title}" on ${new Date(last.deadline).toLocaleDateString("en-US")}`;
  };

  const completedGoalsList = goals.filter(goal => calculateProgress(goal) === 100);

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>🎯 My Goals</h1>
        <div>
          <button className="add-goal-btn" onClick={handleAddGoal}>➕ Add Goal</button>
          <button
            className="add-goal-btn"
            style={{ marginRight: '10px', backgroundColor: '#555' }}
            onClick={() => setShowHistory(!showHistory)}
          >
            🕘 Goal History
          </button>
        </div>
      </div>

      <div className="new-goal-form">
        <label>Goal Name</label>
        <input
          placeholder="e.g., Get 10 clients"
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
        />
        <label>Goal Type</label>
        <select
          value={newGoal.type}
          onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
        >
          <option value="clients">New Clients</option>
          <option value="revenue">Revenue</option>
          <option value="orders">Orders / Appointments</option>
          <option value="messages">Website Inquiries</option>
          <option value="returningClients">Returning Clients</option>
          <option value="reviews">Reviews / Ratings</option>
        </select>
        <label>Numeric Target</label>
        <input
          type="number"
          placeholder="How many / how much?"
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
        />
        <label>Deadline</label>
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
        />
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>✅ Completed Goals</h3>
          {completedGoalsList.map(goal => (
            <div key={goal.id} className="goal-card">
              <strong>{renderIcon(goal.type)} {goal.title}</strong>
              <p>Completed on: {new Date(goal.deadline).toLocaleDateString("en-US")}</p>
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
                <p className="goal-sub">Target: {goal.target} | Date: {goal.deadline}</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-label">{Math.round(progress)}%</span>
                <button className="summary-btn" onClick={() => setSelectedGoal(goal)}>📋 Summary & Inspiration</button>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>

      {selectedGoal && (
        <div className="summary-modal">
          <div className="summary-box">
            <h2>✨ Summary for Goal: {selectedGoal.title}</h2>
            <p><strong>Progress:</strong> {Math.round(calculateProgress(selectedGoal))}%</p>
            <p><strong>Motivation:</strong> {getMotivation(calculateProgress(selectedGoal))}</p>
            <p><strong>Tip:</strong> {getActionTip(selectedGoal.type)}</p>
            {getLastAchievement() && <p><strong>{getLastAchievement()}</strong></p>}
            <button onClick={() => setSelectedGoal(null)}>{t("leftover.goalsChrome.close")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
