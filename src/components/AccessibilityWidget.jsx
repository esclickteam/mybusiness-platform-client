import React, { useState } from 'react';
import { FaTimes, FaAdjust, FaFont, FaSun, FaMoon, FaEye, FaVolumeUp, FaKeyboard } from 'react-icons/fa';
import '../styles/AccessibilityWidget.css';

const FEATURES = [
  { icon: <FaKeyboard />, label: 'ניווט חכם', action: () => {/* toggle smart navigation */} },
  { icon: <FaAdjust />,   label: 'ניווט מקלדת', action: () => {/* toggle keyboard navigation */} },
  { icon: <FaEye />,      label: 'הדגשת קישורים', action: () => {/* highlight links */} },
  { icon: <FaVolumeUp />, label: 'הקראת טקסט', action: () => {/* text-to-speech */} },
  { icon: <FaFont />,     label: 'גודל פונט', action: () => {/* increase/decrease font */} },
  { icon: <FaSun />,      label: 'ניגודיות בהירה', action: () => {/* light contrast */} },
  { icon: <FaMoon />,     label: 'ניגודיות כהה', action: () => {/* dark contrast */} },
  // אפשר להוסיף עוד...
];

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('עברית');

  return (
    <>
      <button
        className={`aw-toggle-button ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="פתח נגישות"
      >
        {open ? <FaTimes/> : <FaAdjust/>}
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
            {FEATURES.map((f, i) => (
              <button key={i} onClick={f.action} className="aw-feature-btn">
                <div className="aw-icon">{f.icon}</div>
                <div className="aw-label">{f.label}</div>
              </button>
            ))}
          </div>

          <footer className="aw-footer">
            <button className="aw-footer-btn">בטל נגישות</button>
            <button className="aw-footer-btn">הצהרת נגישות</button>
            <button className="aw-footer-btn">שלח משוב</button>
            <div className="aw-powered">Powered by EsClick</div>
          </footer>
        </div>
      )}
    </>
  );
}
