import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import API from "../../../api";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./GoalsPage.css";

const GoalsPage = () => {
  const { t, i18n } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    type: "clients",
    target: 0,
    deadline: "",
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
        console.error("Error loading statistics:", error.response?.data || error.message);
      }
    };
    fetchStats();
  }, []);

  const calculateProgress = (goal) => {
    if (!goal || !data || goal.target <= 0) return 0;
    const safeValue = (value) => (typeof value === "number" && !isNaN(value) ? value : 0);
    switch (goal.type) {
      case "clients":
        return Math.min((safeValue(data.newClients) / goal.target) * 100, 100);
      case "revenue":
        return Math.min((safeValue(data.totalRevenue) / goal.target) * 100, 100);
      case "orders":
        return Math.min((safeValue(data.totalOrders) / goal.target) * 100, 100);
      case "messages":
        return Math.min((safeValue(data.totalMessages) / goal.target) * 100, 100);
      case "returningClients":
        return Math.min((safeValue(data.returningClients) / goal.target) * 100, 100);
      case "reviews":
        return Math.min((safeValue(data.reviews) / goal.target) * 100, 100);
      default:
        return 0;
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
      reviews: "⭐",
    };
    return icons[type] || "🎯";
  };

  const getMotivation = (progress) => {
    const level = Math.floor(progress / 10) * 10;
    const key = {
      0: "mot0",
      10: "mot10",
      20: "mot20",
      30: "mot30",
      40: "mot40",
      50: "mot50",
      60: "mot60",
      70: "mot70",
      80: "mot80",
      90: "mot90",
      100: "mot100",
    }[level];
    return t(`leftover.goalsChrome.${key || "motDefault"}`);
  };

  const getActionTip = (type) => {
    const map = {
      clients: "tipClients",
      revenue: "tipRevenue",
      orders: "tipOrders",
      messages: "tipMessages",
      returningClients: "tipReturning",
      reviews: "tipReviews",
    };
    return t(`leftover.goalsChrome.${map[type] || "tipDefault"}`);
  };

  const formatDate = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleDateString(i18n.language || undefined);
    } catch {
      return String(value);
    }
  };

  const getLastAchievement = () => {
    const completed = goals.filter((goal) => calculateProgress(goal) === 100);
    if (completed.length === 0) return null;
    const last = completed[completed.length - 1];
    return t("leftover.goalsChrome.achieved", {
      title: last.title,
      date: formatDate(last.deadline),
    });
  };

  const completedGoalsList = goals.filter((goal) => calculateProgress(goal) === 100);

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>🎯 {t("leftover.goalsChrome.title")}</h1>
        <div>
          <button className="add-goal-btn" onClick={handleAddGoal}>
            ➕ {t("leftover.goalsChrome.addGoal")}
          </button>
          <button
            className="add-goal-btn"
            style={{ marginRight: "10px", backgroundColor: "#555" }}
            onClick={() => setShowHistory(!showHistory)}
          >
            🕘 {t("leftover.goalsChrome.history")}
          </button>
        </div>
      </div>

      <div className="new-goal-form">
        <label>{t("leftover.goalsChrome.nameLabel")}</label>
        <input
          placeholder={t("leftover.goalsChrome.namePh")}
          value={newGoal.title}
          onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
        />
        <label>{t("leftover.goalsChrome.typeLabel")}</label>
        <select
          value={newGoal.type}
          onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
        >
          <option value="clients">{t("leftover.goalsChrome.typeClients")}</option>
          <option value="revenue">{t("leftover.goalsChrome.typeRevenue")}</option>
          <option value="orders">{t("leftover.goalsChrome.typeOrders")}</option>
          <option value="messages">{t("leftover.goalsChrome.typeMessages")}</option>
          <option value="returningClients">{t("leftover.goalsChrome.typeReturning")}</option>
          <option value="reviews">{t("leftover.goalsChrome.typeReviews")}</option>
        </select>
        <label>{t("leftover.goalsChrome.targetLabel")}</label>
        <input
          type="number"
          placeholder={t("leftover.goalsChrome.targetPh")}
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value, 10) || 0 })}
        />
        <label>{t("leftover.goalsChrome.deadlineLabel")}</label>
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
        />
      </div>

      {showHistory && (
        <div className="history-list">
          <h3>✅ {t("leftover.goalsChrome.completedTitle")}</h3>
          {completedGoalsList.map((goal) => (
            <div key={goal.id} className="goal-card">
              <strong>
                {renderIcon(goal.type)} {goal.title}
              </strong>
              <p>{t("leftover.goalsChrome.completedOn", { date: formatDate(goal.deadline) })}</p>
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
                <h3>
                  {renderIcon(goal.type)} {goal.title}
                </h3>
                <p className="goal-sub">
                  {t("leftover.goalsChrome.targetLine", {
                    target: goal.target,
                    date: goal.deadline,
                  })}
                </p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${progress}%` }} />
                </div>
                <span className="progress-label">{Math.round(progress)}%</span>
                <button className="summary-btn" onClick={() => setSelectedGoal(goal)}>
                  📋 {t("leftover.goalsChrome.summaryBtn")}
                </button>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>

      {selectedGoal && (
        <div className="summary-modal">
          <div className="summary-box">
            <h2>✨ {t("leftover.goalsChrome.summaryTitle", { title: selectedGoal.title })}</h2>
            <p>
              <strong>{t("leftover.goalsChrome.progress")}</strong>{" "}
              {Math.round(calculateProgress(selectedGoal))}%
            </p>
            <p>
              <strong>{t("leftover.goalsChrome.motivation")}</strong>{" "}
              {getMotivation(calculateProgress(selectedGoal))}
            </p>
            <p>
              <strong>{t("leftover.goalsChrome.tip")}</strong> {getActionTip(selectedGoal.type)}
            </p>
            {getLastAchievement() && (
              <p>
                <strong>{getLastAchievement()}</strong>
              </p>
            )}
            <button onClick={() => setSelectedGoal(null)}>{t("leftover.goalsChrome.close")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
