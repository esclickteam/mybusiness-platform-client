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
    // ניווט פנימי
    if (btn.route) {
      navigate(btn.route);
      return;
    }

    // ניווט עם redirect אחרי login / register
    if (btn.routeWithRedirect) {
      navigate(btn.routeWithRedirect.path, {
        state: { redirect: btn.routeWithRedirect.redirect },
      });
      return;
    }

    // מעבר לעץ שיחה פנימי
    if (btn.next) {
      setNode(btn.next);
      return;
    }
  };

  return (
    <div className="plb">
      {!open && (
        <button
          className="plb-launch"
          onClick={() => setOpen(true)}
          aria-label="Open BizUply assistant"
        >
          💬
        </button>
      )}

      {open && (
        <div className="plb-window">
          <header className="plb-header">
            <strong>BizUply Assistant</strong>
            <button onClick={() => setOpen(false)}>×</button>
          </header>

          <div className="plb-body">
            <p>{current.text}</p>

            <div className="plb-actions">
              {current.buttons?.map((btn) => (
                <button
                  key={btn.label}
                  className={btn.variant === "secondary" ? "secondary" : ""}
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
