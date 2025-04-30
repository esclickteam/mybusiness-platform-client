// src/components/AccessibilityWidget.jsx
import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaWheelchair,
  FaChevronUp,
  FaChevronDown,
  FaKeyboard,
  FaArrowsAlt,
  FaVolumeUp,
  FaEye,
  FaSun,
  FaMoon,
  FaFont
} from 'react-icons/fa';
import '../styles/AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState({
    nav: true,
    voice: false,
    contrast: false,
    font: false
  });
  const [state, setState] = useState({
    smartNav: false,
    keyNav: false,
    highlightLinks: false,
    readAloud: false,
    brightContrast: false,
    darkContrast: false,
    hue: 0,
    largeFont: 1,
    letterSpacing: 0,
    lineHeight: 1.5
  });

  // Smart navigation: מאזין לחיצות חיצים כשהאפשרות פעילה
  useEffect(() => {
    if (!state.smartNav) return;

    const getButtons = () =>
      Array.from(document.querySelectorAll('.aw-feature-btn'));

    const onKeyDown = e => {
      const buttons = getButtons();
      if (!buttons.length) return;

      let idx = buttons.indexOf(document.activeElement);
      // אם אין פוקוס על אף כפתור, תן פוקוס לכפתור הראשון
      if (idx === -1 && /^Arrow/.test(e.key)) {
        buttons[0].focus();
        e.preventDefault();
        return;
      }

      const cols = 2;
      let next = idx;
      switch (e.key) {
        case 'ArrowRight':
          next = idx + 1;
          break;
        case 'ArrowLeft':
          next = idx - 1;
          break;
        case 'ArrowDown':
          next = idx + cols;
          break;
        case 'ArrowUp':
          next = idx - cols;
          break;
        default:
          return;
      }

      if (next < 0) next = 0;
      if (next >= buttons.length) next = buttons.length - 1;

      buttons[next].focus();
      e.preventDefault();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [state.smartNav]);

  const toggleSection = sec => {
    setSections(s => ({ ...s, [sec]: !s[sec] }));
  };

  const toggleFeature = feat => {
    setState(s => ({ ...s, [feat]: !s[feat] }));
    // ניתן להוסיף כאן לוגיקת CSS/JS לכל פיצ'ר
  };

  const onSlider = (key, e) => {
    const v = Number(e.target.value);
    setState(s => ({ ...s, [key]: v }));
    document.documentElement.style.setProperty(
      key === 'hue'
        ? '--es-hue-rotate'
        : key === 'largeFont'
        ? '--es-font-scale'
        : key === 'letterSpacing'
        ? '--es-letter-spacing'
        : '--es-line-height',
      key === 'hue' ? `${v}deg` : key === 'letterSpacing' ? `${v}px` : v
    );
  };

  const readPageAloud = () => {
    const utter = new SpeechSynthesisUtterance(
      document.body.innerText.replace(/\s+/g, ' ')
    );
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`aw-toggle-button ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="נגישות"
      >
        {open ? <FaTimes /> : <FaWheelchair />}
      </button>

      {open && (
        <div className="aw-panel" role="dialog" aria-modal="true">
          {/* Close Button */}
          <button className="aw-close" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>

          {/* Header */}
          <div className="aw-header">
            <h2>פרופילי נגישות</h2>
          </div>

          {/* Navigation Section */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('nav')}>
              <h3>התאמות ניווט</h3>
              {sections.nav ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.nav && (
              <div className="aw-features">
                <button
                  className={`aw-feature-btn${state.smartNav ? ' active' : ''}`}
                  onClick={() => toggleFeature('smartNav')}
                >
                  <FaArrowsAlt className="aw-icon" />
                  <span className="aw-label">ניווט חכם</span>
                </button>
                <button
                  className={`aw-feature-btn${state.keyNav ? ' active' : ''}`}
                  onClick={() => toggleFeature('keyNav')}
                >
                  <FaKeyboard className="aw-icon" />
                  <span className="aw-label">ניווט מקלדת</span>
                </button>
              </div>
            )}
          </div>

          {/* Voice Section */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('voice')}>
              <h3>התאמות קוליות</h3>
              {sections.voice ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.voice && (
              <div className="aw-features">
                <button
                  className={`aw-feature-btn${state.readAloud ? ' active' : ''}`}
                  onClick={readPageAloud}
                >
                  <FaVolumeUp className="aw-icon" />
                  <span className="aw-label">הקראת טקסט</span>
                </button>
              </div>
            )}
          </div>

          {/* Contrast Section */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('contrast')}>
              <h3>התאמות ניגודיות</h3>
              {sections.contrast ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.contrast && (
              <div className="aw-features">
                <button
                  className={`aw-feature-btn${state.brightContrast ? ' active' : ''}`}
                  onClick={() => toggleFeature('brightContrast')}
                >
                  <FaSun className="aw-icon" />
                  <span className="aw-label">ניגודיות בהירה</span>
                </button>
                <button
                  className={`aw-feature-btn${state.darkContrast ? ' active' : ''}`}
                  onClick={() => toggleFeature('darkContrast')}
                >
                  <FaMoon className="aw-icon" />
                  <span className="aw-label">ניגודיות כהה</span>
                </button>
                <div className="aw-slider">
                  <label>התאם צבעים:</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={state.hue}
                    onChange={e => onSlider('hue', e)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Font Section */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('font')}>
              <h3>התאמות גופן</h3>
              {sections.font ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.font && (
              <div className="aw-features aw-grid-3">
                <div className="aw-slider">
                  <label>גודל פונט:</label>
                  <input
                    type="range"
                    min="0.8"
                    max="2"
                    step="0.1"
                    value={state.largeFont}
                    onChange={e => onSlider('largeFont', e)}
                  />
                </div>
                <div className="aw-slider">
                  <label>מרווח בין מילים (px):</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={state.letterSpacing}
                    onChange={e => onSlider('letterSpacing', e)}
                  />
                </div>
                <div className="aw-slider">
                  <label>גובה שורה:</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={state.lineHeight}
                    onChange={e => onSlider('lineHeight', e)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="aw-footer">
            <button onClick={() => setOpen(false)}>בטל נגישות</button>
            <button>הצהרת נגישות</button>
            <button>שלח משוב</button>
            <div className="aw-powered">נגיש בקליק</div>
          </div>
        </div>
      )}
    </>
  );
}
