import React, { useEffect, useState } from "react";
import axios from "../api";
import "../styles/Unsubscribe.css";

export default function Unsubscribe() {
  const [status, setStatus] = useState("loading");
  const [userEmail, setUserEmail] = useState("");

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    async function run() {
      try {
        if (!token) {
          setStatus("invalid");
          return;
        }

        const res = await axios.get(`/unsubscribe/${token}`);
        setUserEmail(res.data.email);

        await axios.post(`/unsubscribe/update`, {
          token,
          unsubscribe: true,
        });

        setStatus("done");
      } catch (err) {
        setStatus("invalid");
      }
    }

    run();
  }, [token]);

  return (
    <div className="unsub-container">
      {status === "loading" && (
        <div className="unsub-card fade">
          <div className="loader"></div>
          <h2>Updating your preferences...</h2>
          <p>Please wait a moment</p>
        </div>
      )}

      {status === "done" && (
        <div className="unsub-card fade">
          <div className="unsub-emoji">👋</div>
          <h1>You’ve been unsubscribed!</h1>
          <p>
            You won’t receive any marketing emails from us.<br />
            You may still receive messages regarding your account.
          </p>
        </div>
      )}

      {status === "invalid" && (
        <div className="unsub-card fade">
          <div className="unsub-emoji">⚠️</div>
          <h1>Invalid link</h1>
          <p>This unsubscribe link is not valid or has expired.</p>
        </div>
      )}
    </div>
  );
}
