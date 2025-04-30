// src/components/AccessibilityWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FaTimes, FaWheelchair, FaChevronUp, FaChevronDown,
  FaArrowsAlt, FaKeyboard, FaAssistiveListeningSystems,
  FaMicrophoneAlt, FaVolumeUp, FaSun, FaMoon, FaEye,
  FaTint, FaAdjust, FaFont
} from 'react-icons/fa';
import '../styles/AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState({
    nav: true,
    contrast: false,
    content: false
  });
  const [contrastTab, setContrastTab] = useState('backgrounds');
  const [contentTab, setContentTab] = useState('fontSize');
  const [state, setState] = useState({
    smartNav: false,
    keyNav: false,
    screenReader: false,
    voiceCommands: false,
    readAloud: false,
    brightContrast: false,
    darkContrast: false,
    monoContrast: false,
    highSat: false,
    lowSat: false,
    largeText: false,
    hue: 0,
    fontSize: 1,
    letterSpacing: 0,
    lineHeight: 1.5
  });

  const navRef = useRef(null);
  const contrastRef = useRef(null);
  const contentRef = useRef(null);

  const toggleFeature = feat => {
    console.log(`toggleFeature ${feat} →`, !state[feat]);
    setState(s => ({ ...s, [feat]: !s[feat] }));
  };

  const toggleSection = sec => {
    setSections(s => ({ ...s, [sec]: !s[sec] }));
  };

  const scrollRef = (ref, delta) => {
    ref.current?.scrollBy({ top: delta, behavior: 'smooth' });
  };

  const onSlider = (key, e) => {
    const v = Number(e.target.value);
    setState(s => ({ ...s, [key]: v }));
    const prop =
      key === 'hue' ? '--es-hue-rotate' :
      key === 'fontSize' ? '--es-font-scale' :
      key === 'letterSpacing' ? '--es-letter-spacing' :
      '--es-line-height';
    const val = key === 'hue' ? `${v}deg` : key === 'letterSpacing' ? `${v}px` : v;
    document.documentElement.style.setProperty(prop, val);
  };

  // 1) Smart Nav (arrow-grid)
  useEffect(() => {
    if (!state.smartNav) return;
    const items = () => Array.from(document.querySelectorAll('.aw-feature-btn'));
    const onKey = e => {
      const list = items();
      let idx = list.indexOf(document.activeElement);
      if (idx === -1 && /^Arrow/.test(e.key)) {
        list[0]?.focus();
        e.preventDefault();
        return;
      }
      const cols = 2, max = list.length - 1;
      switch (e.key) {
        case 'ArrowRight': idx = Math.min(max, idx + 1); break;
        case 'ArrowLeft':  idx = Math.max(0, idx - 1); break;
        case 'ArrowDown':  idx = Math.min(max, idx + cols); break;
        case 'ArrowUp':    idx = Math.max(0, idx - cols); break;
        default: return;
      }
      list[idx]?.focus();
      e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.smartNav]);

  // 2) Keyboard Nav outline
  useEffect(() => {
    document.documentElement.classList.toggle('es-keyboard-nav', state.keyNav);
  }, [state.keyNav]);

  // 3) Screen Reader mode
  useEffect(() => {
    const onFocus = e => {
      if (!state.screenReader) return;
      const txt = e.target.innerText || e.target.alt || '';
      if (txt && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(txt.trim());
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      }
    };
    document.documentElement.classList.toggle('es-screen-reader', state.screenReader);
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, [state.screenReader]);

  // 4) Voice Commands stub
  useEffect(() => {
    document.documentElement.classList.toggle('es-voice-commands', state.voiceCommands);
    // כאן אפשר לממש Web Speech Recognition
  }, [state.voiceCommands]);

  // 5) Read Aloud
  const readPageAloud = () => {
    if (state.readAloud) {
      speechSynthesis.cancel();
      setState(s => ({ ...s, readAloud: false }));
    } else {
      const u = new SpeechSynthesisUtterance(
        document.body.innerText.replace(/\s+/g, ' ')
      );
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      setState(s => ({ ...s, readAloud: true }));
    }
  };

  // 6–11) Contrast, Saturation, Large Text
  useEffect(() => {
    document.documentElement.classList.toggle('es-light-contrast', state.brightContrast);
  }, [state.brightContrast]);
  useEffect(() => {
    document.documentElement.classList.toggle('es-dark-contrast', state.darkContrast);
  }, [state.darkContrast]);
  useEffect(() => {
    document.documentElement.classList.toggle('es-mono-contrast', state.monoContrast);
  }, [state.monoContrast]);
  useEffect(() => {
    document.documentElement.classList.toggle('es-high-saturation', state.highSat);
  }, [state.highSat]);
  useEffect(() => {
    document.documentElement.classList.toggle('es-low-saturation', state.lowSat);
  }, [state.lowSat]);
  useEffect(() => {
    document.documentElement.classList.toggle('es-large-text', state.largeText);
  }, [state.largeText]);

  return (
    <>
      <button
        className="aw-toggle-button"
        onClick={() => setOpen(o => !o)}
        aria-label="פתח/סגור נגישות"
      >
        {open ? <FaTimes /> : <FaWheelchair />}
      </button>

      {open && (
        <div className="aw-panel" role="dialog" aria-modal="true">
          <button
            className="aw-close"
            onClick={() => setOpen(false)}
            aria-label="סגור"
          >
            <FaTimes />
          </button>

          <div className="aw-header"><h2>נגישות</h2></div>

          {/* התאמות ניווט */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('nav')}>
              <h3>התאמות ניווט</h3>
              {sections.nav ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.nav && (
              <div className="aw-features-wrapper">
                <button
                  className="aw-scroll-btn up"
                  onClick={() => scrollRef(navRef, -100)}
                >▲</button>
                <div ref={navRef} className="aw-features">
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
                  <button
                    className={`aw-feature-btn${state.screenReader ? ' active' : ''}`}
                    onClick={() => toggleFeature('screenReader')}
                  >
                    <FaAssistiveListeningSystems className="aw-icon" />
                    <span className="aw-label">התאמה לקורא-מסך</span>
                  </button>
                  <button
                    className={`aw-feature-btn${state.voiceCommands ? ' active' : ''}`}
                    onClick={() => toggleFeature('voiceCommands')}
                  >
                    <FaMicrophoneAlt className="aw-icon" />
                    <span className="aw-label">פקודות קוליות</span>
                  </button>
                  <button
                    className={`aw-feature-btn${state.readAloud ? ' active' : ''}`}
                    onClick={readPageAloud}
                  >
                    <FaVolumeUp className="aw-icon" />
                    <span className="aw-label">הקראת טקסט</span>
                  </button>
                </div>
                <button
                  className="aw-scroll-btn down"
                  onClick={() => scrollRef(navRef, 100)}
                >▼</button>
              </div>
            )}
          </div>

          {/* התאמות ניגודיות */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('contrast')}>
              <h3>התאמות ניגודיות</h3>
              {sections.contrast ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.contrast && (
              <>
                <div className="aw-features-wrapper">
                  <button
                    className="aw-scroll-btn up"
                    onClick={() => scrollRef(contrastRef, -100)}
                  >▲</button>
                  <div ref={contrastRef} className="aw-features">
                    {[
                      ['brightContrast', <FaSun />, 'ניגודיות בהירה'],
                      ['darkContrast', <FaMoon />, 'ניגודיות כהה'],
                      ['monoContrast', <FaEye />, 'מונוכרום'],
                      ['highSat', <FaTint />, 'רוויה גבוהה'],
                      ['lowSat', <FaAdjust />, 'רוויה נמוכה']
                    ].map(([key, icon, label]) => (
                      <button
                        key={key}
                        className={`aw-feature-btn${state[key] ? ' active' : ''}`}
                        onClick={() => toggleFeature(key)}
                      >
                        <span className="aw-icon">{icon}</span>
                        <span className="aw-label">{label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="aw-scroll-btn down"
                    onClick={() => scrollRef(contrastRef, 100)}
                  >▼</button>
                </div>

                <div className="contrast-tabs">
                  <button
                    className={contrastTab === 'backgrounds' ? 'active' : ''}
                    onClick={() => setContrastTab('backgrounds')}
                  >רקע</button>
                  <button
                    className={contrastTab === 'headings' ? 'active' : ''}
                    onClick={() => setContrastTab('headings')}
                  >כותרות</button>
                  <button
                    className={contrastTab === 'content' ? 'active' : ''}
                    onClick={() => setContrastTab('content')}
                  >תוכן</button>
                </div>

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
              </>
            )}
          </div>

          {/* התאמות תוכן */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('content')}>
              <h3>התאמות תוכן</h3>
              {sections.content ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.content && (
              <>
                <div className="aw-features-wrapper">
                  <button
                    className="aw-scroll-btn up"
                    onClick={() => scrollRef(contentRef, -100)}
                  >▲</button>
                  <div ref={contentRef} className="aw-features aw-grid-3">
                    <button
                      className={`aw-feature-btn${state.largeText ? ' active' : ''}`}
                      onClick={() => toggleFeature('largeText')}
                    >
                      <FaFont className="aw-icon" />
                      <span className="aw-label">גופן קריא</span>
                    </button>
                  </div>
                  <button
                    className="aw-scroll-btn down"
                    onClick={() => scrollRef(contentRef, 100)}
                  >▼</button>
                </div>

                <div className="content-tabs">
                  <button
                    className={contentTab === 'fontSize' ? 'active' : ''}
                    onClick={() => setContentTab('fontSize')}
                  >גודל גופן</button>
                  <button
                    className={contentTab === 'letterSpacing' ? 'active' : ''}
                    onClick={() => setContentTab('letterSpacing')}
                  >מרווח בין מילים</button>
                  <button
                    className={contentTab === 'lineHeight' ? 'active' : ''}
                    onClick={() => setContentTab('lineHeight')}
                  >מרווח בין שורות</button>
                </div>

                <div className="aw-slider">
                  <label>
                    {contentTab === 'fontSize'
                      ? 'גודל גופן:'
                      : contentTab === 'letterSpacing'
                      ? 'מרווח בין מילים (px):'
                      : 'גובה שורה:'}
                  </label>
                  <input
                    type="range"
                    min={contentTab === 'fontSize' ? 0.8 : contentTab === 'letterSpacing' ? 0 : 1}
                    max={contentTab === 'fontSize' ? 2 : contentTab === 'letterSpacing' ? 20 : 3}
                    step="0.1"
                    value={state[contentTab]}
                    onChange={e => onSlider(contentTab, e)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="aw-footer">
            <button className="aw-footer-btn" onClick={() => setOpen(false)}>
              בטל נגישות
            </button>
            <button className="aw-footer-btn">הצהרת נגישות</button>
            <button className="aw-footer-btn">שלח משוב</button>
            <div className="aw-powered">נגיש בקליק</div>
          </div>
        </div>
      )}
    </>
  );
}
