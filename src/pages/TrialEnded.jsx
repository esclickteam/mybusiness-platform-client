import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./TrialEnded.css";

export default function TrialEnded() {
  const navigate = useNavigate();

  return (
    <div className="trial-ended-wrapper">
      <motion.div
        className="trial-ended-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="emoji">⏰</div>
        <h1>Your 14-Day Trial Has Ended</h1>
        <p className="desc">
          Your free trial period is over, but don’t worry — your clients, chats,
          and business data are safely stored.  
          Upgrade now to continue managing your business with BizUply’s full suite
          of AI-powered tools.
        </p>

        <button
          className="upgrade-btn"
          onClick={() => navigate("/pricing")}
        >
          Upgrade Now
        </button>

        <button
          className="contact-btn"
          onClick={() => navigate("/contact")}
        >
          Contact Support
        </button>

        <p className="small-text">
          You can reactivate your account anytime.  
          Your data will remain secure for 30 days after the trial ends.
        </p>
      </motion.div>
    </div>
  );
}
