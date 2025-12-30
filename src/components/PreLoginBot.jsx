import React, { useState } from "react";
import botFlow from "../data/preLoginBot.flow.json";
import "./PreLoginBot.css";

export default function PreLoginBot() {
  const [open, setOpen] = useState(false);
  const [node, setNode] = useState("entry");

  const current = botFlow[node];

  if (!current) return null;

  return (
    <div className={`plb ${open ? "open" : ""}`}>
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
                  onClick={() => {
                    if (btn.action) {
                      window.location.href = btn.action;
                    } else {
                      setNode(btn.next);
                    }
                  }}
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
