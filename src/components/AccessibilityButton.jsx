import React, { useState } from 'react';

const AccessibilityButton = () => {
  const handleClick = () => {
    console.log("הכפתור נלחץ");

    // פשוט מפעיל את פאנל הנגישות של UserWay
    if (window.UserWay) {
      window.UserWay.toggle();
    } else {
      console.error("UserWay לא נטען");
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
