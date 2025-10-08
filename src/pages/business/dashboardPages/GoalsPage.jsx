```javascript
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
        if (!business?._id) throw new Error("Business ID not returned");
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
      0: "Every beginning starts with one step – go ahead!",
      10: "You're in motion, keep progressing!",
      20: "Great! Already 20% on the way to the goal.",
      30: "Excellent progress – keep up the pace!",
      40: "Almost halfway – you've got this!",
      50: "You've made it halfway – well done!",
      60: "Strong pace! Don't stop now.",
      70: "It already feels close – give it one last push.",
      80: "Almost there! Just a bit more and it's yours.",
      90: "An inch from the goal – it's time to finish strong.",
      100: "The goal has been achieved! Congratulations on your perseverance 🎉"
    };
    return messages[level] || "You're on the right track – keep it up!";
  };

  const getActionTip = (type) => {
    const tips = {
      clients: "✉️ Send leads from the last week a special offer or coupon",
      revenue: "📊 Create a hot deal for a high-value service/product package",
      orders: "🔔 Remind customers who haven't completed their purchase – don't give up on them",
      messages: "💬 Personally reach out to customers who inquired but haven't purchased yet",
      returningClients: "👋 Send a thank you with a discount code to returnees",
      reviews: "🌟 Send a short request for a recommendation with a convenient link"
    };
    return tips[type] || "🎯 Take a small action today that will bring you closer to your goal.";
  };

  const getLastAchievement = () => {
    const completed = goals.filter(goal => calculateProgress(goal) === 100);
    if (completed.length === 0) return null;
    const last = completed[completed.length - 1];
    return `🏆 Achieved goal: "${last.title}" on ${new Date(last.deadline).toLocaleDateString("he-IL")}`;
  };

  const completedGoalsList = goals.filter(goal => calculateProgress(goal) === 100);

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>🎯 My Goals</h1>
        <div>
          <button className="add-goal-btn" onClick={handleAddGoal}>➕ Add Goal</button>
          <button className="add-goal-btn" style={{ marginRight: '10px', backgroundColor: '#555' }} onClick={() => setShowHistory(!showHistory)}>🕘 Goals History</button>
        </div>
      </div>

      <div className="new-goal-form">
        <label>Goal Name</label>
        <input placeholder="For example: Achieve 10 clients" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
        <label>Goal Type</label>
        <select value={newGoal.type} onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}>
          <option value="clients">New Clients</option>
          <option value="revenue">Revenue</option>
          <option value="orders">Orders / Meetings</option>
          <option value="messages">Inquiries from the website</option>
          <option value="returningClients">Returning Clients</option>
          <option value="reviews">Recommendations / Ratings</option>
        </select>
        <label>Numeric Goal</label>
        <input type="number" placeholder="How many?" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })} />
        <label>Deadline</label>
        <input type="date" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} />
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>✅ Completed Goals</h3>
          {completedGoalsList.map(goal => (
            <div key={goal.id} className="goal-card">
              <strong>{renderIcon(goal.type)} {goal.title}</strong>
              <p>Completed on: {new Date(goal.deadline).toLocaleDateString("he-IL")}</p>
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
                <p className="goal-sub">Goal: {goal.target} | Date: {goal.deadline}</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-label">{Math.round(progress)}%</span>
                <button className="summary-btn" onClick={() => setSelectedGoal(goal)}>📋 Summary and Inspiration</button>
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
            <p><strong>Inspiration:</strong> {getMotivation(calculateProgress(selectedGoal))}</p>
            <p><strong>Recommendation:</strong> {getActionTip(selectedGoal.type)}</p>
            {getLastAchievement() && <p><strong>{getLastAchievement()}</strong></p>}
            <button onClick={() => setSelectedGoal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
```