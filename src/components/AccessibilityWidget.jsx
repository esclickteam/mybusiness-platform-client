import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaWheelchair,
  FaFont,
  FaSun,
  FaMoon,
  FaEye,
  FaVolumeUp,
  FaKeyboard,
  FaArrowsAlt
} from 'react-icons/fa';
import '../styles/AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('עברית');

  // יקרה פעם ראשונה: נטען העדפות מ-localStorage
  useEffect(() => {
    if (localStorage.getItem('es_highlightLinks') === 'on') document.body.classList.add('es-highlight-links');
    if (localStorage.getItem('es_darkContrast') === 'on')   document.body.classList.add('es-dark-contrast');
    if (localStorage.getItem('es_lightContrast') === 'on')  document.body.classList.add('es-light-contrast');
    if (localStorage.getItem('es_largeText') === 'on')      document.body.classList.add('es-large-text');
    if (localStorage.getItem('es_keyboardNav') === 'on')    document.body.classList.add('es-keyboard-nav');
  }, []);

  // מימוש הפיצ’רים
  const toggleHighlightLinks = () => {
    const cls = 'es-highlight-links';
    const on = document.body.classList.toggle(cls);
    localStorage.setItem('es_highlightLinks', on ? 'on' : 'off');
  };

  const toggleDarkContrast = () => {
    // מבטל ניגודיות בהירה אם פעילה
    document.body.classList.remove('es-light-contrast');
    localStorage.setItem('es_lightContrast', 'off');
    const cls = 'es-dark-contrast';
    const on = document.body.classList.toggle(cls);
    localStorage.setItem('es_darkContrast', on ? 'on' : 'off');
  };

  const toggleLightContrast = () => {
    // מבטל ניגודיות כהה אם פעילה
    document.body.classList.remove('es-dark-contrast');
    localStorage.setItem('es_darkContrast', 'off');
    const cls = 'es-light-contrast';
    const on = document.body.classList.toggle(cls);
    localStorage.setItem('es_lightContrast', on ? 'on' : 'off');
  };

  const toggleLargeText = () => {
    const cls = 'es-large-text';
    const on = document.body.classList.toggle(cls);
    localStorage.setItem('es_largeText', on ? 'on' : 'off');
  };

  const toggleKeyboardNav = () => {
    const cls = 'es-keyboard-nav';
    const on = document.body.classList.toggle(cls);
    localStorage.setItem('es_keyboardNav', on ? 'on' : 'off');
  };

  const readPageAloud = () => {
    const utterance = new SpeechSynthesisUtterance(
      document.body.innerText.replace(/\s+/g, ' ')
    );
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const smartNav = () => {
    // כאן אפשר להוסיף לוגיקת ניווט חכם מתקדמת
    alert('ניווט חכם – עוד לא מומש באופן מלא');
  };

  return (
    <>
      <button
        className={`aw-toggle-button ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="פתח נגישות"
      >
        {open ? <FaTimes/> : <FaWheelchair/>}
      </button>

      {open && (
        <div className="aw-panel" role="dialog" aria-modal="true" aria-label="פאנל נגישות">
          <header className="aw-header">
            <h2>נגישות</h2>
            <select value={lang} onChange={e => setLang(e.target.value)}>
              <option>עברית</option>
              <option>English</option>
            </select>
          </header>

          <div className="aw-features">
            <button className="aw-feature-btn" onClick={smartNav}>
              <FaArrowsAlt className="aw-icon"/>
              <span className="aw-label">ניווט חכם</span>
            </button>
            <button className="aw-feature-btn" onClick={toggleKeyboardNav}>
              <FaKeyboard className="aw-icon"/>
              <span className="aw-label">ניווט מקלדת</span>
            </button>
            <button className="aw-feature-btn" onClick={toggleHighlightLinks}>
              <FaEye className="aw-icon"/>
              <span className="aw-label">הדגשת קישורים</span>
            </button>
            <button className="aw-feature-btn" onClick={readPageAloud}>
              <FaVolumeUp className="aw-icon"/>
              <span className="aw-label">הקראת טקסט</span>
            </button>
            <button className="aw-feature-btn" onClick={toggleLargeText}>
              <FaFont className="aw-icon"/>
              <span className="aw-label">גודל פונט</span>
            </button>
            <button className="aw-feature-btn" onClick={toggleLightContrast}>
              <FaSun className="aw-icon"/>
              <span className="aw-label">ניגודיות בהירה</span>
            </button>
            <button className="aw-feature-btn" onClick={toggleDarkContrast}>
              <FaMoon className="aw-icon"/>
              <span className="aw-label">ניגודיות כהה</span>
            </button>
          </div>

          <footer className="aw-footer">
            <button className="aw-footer-btn" onClick={() => setOpen(false)}>בטל נגישות</button>
            <button className="aw-footer-btn">הצהרת נגישות</button>
            <button className="aw-footer-btn">שלח משוב</button>
            <div className="aw-powered">נגיש בקליק</div>
          </footer>
        </div>
      )}
    </>
  );
}
