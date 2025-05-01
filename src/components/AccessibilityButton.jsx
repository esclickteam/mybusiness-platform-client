import React, { useState } from 'react';

const AccessibilityButton = () => {
  const [userWayLoaded, setUserWayLoaded] = useState(false); // סטייט למעקב אם הווידג'ט נטען

  const handleClick = () => {
    if (!userWayLoaded && window.UserWay) {
      // טוען את הסקריפט רק פעם אחת בעת לחיצה
      window.UserWay.init({
        account: 'HnP2BQ1axC', // הכנס את ה-account שלך כאן
      });
      setUserWayLoaded(true); // מעדכן את הסטייט שהווידג'ט נטען
    }

    if (window.UserWay) {
      window.UserWay.toggle(); // מפעיל את פאנל הנגישות של UserWay
    }
  };

  return (
    <button
      onClick={handleClick}  // מקשר את הפונקציה handleClick לאירוע הלחיצה
      style={{
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        background: '#005b96', 
        color: 'white', 
        border: 'none', 
        padding: '.75rem', 
        borderRadius: '50%', 
        fontSize: '1.5rem', 
        cursor: 'pointer', 
        zIndex: '999999999'
      }}
    >
      נגישות
    </button>
  );
};

export default AccessibilityButton;
