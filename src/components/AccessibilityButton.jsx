import React, { useState } from 'react';

const AccessibilityButton = () => {
  const [userWayLoaded, setUserWayLoaded] = useState(false); // סטייט למעקב אם הווידג'ט נטען

  const handleClick = () => {
    console.log("הכפתור נלחץ");

    if (!userWayLoaded) {
      console.log("נטען UserWay");

      // בודק אם הסקריפט כבר נטען
      if (!document.querySelector('script[src="https://cdn.userway.org/widget.js"]')) {
        // טוען את הסקריפט רק אם לא נטען עדיין
        const script = document.createElement('script');
        script.src = "https://cdn.userway.org/widget.js";
        script.async = true;

        script.onload = () => {
          console.log("הסקריפט נטען בהצלחה");
          window.UserWay.init({
            account: 'HnP2BQ1axC', // הכנס את ה-account שלך כאן
          });
          setUserWayLoaded(true); // עדכון הסטייט שהווידג'ט נטען
        };

        script.onerror = () => {
          console.error("שגיאה בטעינת הסקריפט של UserWay");
        };

        document.head.appendChild(script);
      } else {
        // אם הסקריפט כבר נטען
        console.log("הסקריפט כבר נטען");
        window.UserWay.toggle(); // מפעיל את פאנל הנגישות של UserWay
      }
    } else {
      // אם הסקריפט נטען
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
