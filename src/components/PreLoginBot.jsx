import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import botFlow from "../data/preLoginBot.flow.json";
import "./PreLoginBot.css";

export default function PreLoginBot() {
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState("entry");
  const navigate = useNavigate();

  const current = botFlow[node];
  if (!current) return null;

  const handleAction = (btn) => {
    if (btn.route) {
      navigate(btn.route);
      return;
    }

    if (btn.routeWithRedirect) {
      navigate(btn.routeWithRedirect.path, {
        state: { redirect: btn.routeWithRedirect.redirect },
      });
      return;
    }

    if (btn.next) {
      setNode(btn.next);
    }
  };

  return (
    <div className="plb">
      {/* 🔹 Launcher – Ask BizUply */}
      {!open && (
        <button
          className="plb-launch-pill"
          onClick={() => setOpen(true)}
          aria-label="Ask BizUply"
        >
          <span className="plb-launch-icon">💬</span>
          <span className="plb-launch-text">Ask BizUply</span>
        </button>
      )}

      {/* 🔹 Bot Window */}
      {open && (
        <div className="plb-window">
          <header className="plb-header">
            <strong>BizUply Assistant</strong>
            <button
              className="plb-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="plb-body">
            <p>{current.text}</p>

            <div className="plb-actions">
              {current.buttons?.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => handleAction(btn)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
