// src/components/AccessibilityWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  FaTimes,
  FaWheelchair,
  FaChevronUp,
  FaChevronDown,
  FaArrowsAlt,
  FaKeyboard,
  FaAssistiveListeningSystems,
  FaMicrophoneAlt,
  FaVolumeUp,
  FaSun,
  FaMoon,
  FaEye,
  FaTint,
  FaAdjust,
  FaFont
} from 'react-icons/fa';
import '../styles/AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState({ nav: true, contrast: false, content: false });
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

  const recognitionRef = useRef(null);
  const navRef = useRef(null);
  const contrastRef = useRef(null);
  const contentRef = useRef(null);

  const toggleSection = sec => setSections(s => ({ ...s, [sec]: !s[sec] }));
  const toggleFeature = feat => setState(s => ({ ...s, [feat]: !s[feat] }));
  const scrollRef = (ref, delta) => ref.current?.scrollBy({ top: delta, behavior: 'smooth' });

  const onSlider = (key, e) => {
    const v = Number(e.target.value);
    setState(s => ({ ...s, [key]: v }));
    const prop = key === 'hue'
      ? '--es-hue-rotate'
      : key === 'fontSize'
      ? '--es-font-scale'
      : key === 'letterSpacing'
      ? '--es-letter-spacing'
      : '--es-line-height';
    const val = key === 'hue' ? `${v}deg` : key === 'letterSpacing' ? `${v}px` : v;
    document.documentElement.style.setProperty(prop, val);
  };

  // Smart Nav
  useEffect(() => {
    document.documentElement.classList.toggle('es-smart-nav', state.smartNav);
    if (!state.smartNav) return;
    const btns = () => Array.from(document.querySelectorAll('.aw-feature-btn'));
    const onKey = e => {
      if (!/^Arrow/.test(e.key)) return;
      let idx = btns().indexOf(document.activeElement);
      idx = idx === -1 ? 0 : idx;
      const cols = 2;
      const max = btns().length - 1;
      if (e.key === 'ArrowRight') idx = Math.min(max, idx + 1);
      if (e.key === 'ArrowLeft') idx = Math.max(0, idx - 1);
      if (e.key === 'ArrowDown') idx = Math.min(max, idx + cols);
      if (e.key === 'ArrowUp') idx = Math.max(0, idx - cols);
      btns()[idx]?.focus();
      e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state.smartNav]);

  // Keyboard Nav
  useEffect(() => {
    document.documentElement.classList.toggle('es-keyboard-nav', state.keyNav);
  }, [state.keyNav]);

  // Screen Reader
  useEffect(() => {
    document.documentElement.classList.toggle('es-screen-reader', state.screenReader);
    const others = Array.from(document.body.children).filter(el => el.id !== 'accessibility-widget');
    others.forEach(el => {
      if (state.screenReader) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  }, [state.screenReader]);

  // Voice Commands
  useEffect(() => {
    document.documentElement.classList.toggle('es-voice-commands', state.voiceCommands);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (state.voiceCommands && SR) {
      const recog = new SR();
      recog.lang = 'he-IL'; recog.continuous = true;
      recog.onresult = ev => {
        const cmd = ev.results[ev.resultIndex][0].transcript.trim().toLowerCase();
        if (cmd.includes('בית')) window.location.href = '/';
        if (cmd.includes('הקרא')) toggleFeature('readAloud');
      };
      recog.start();
      recognitionRef.current = recog;
    } else {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    }
    return () => recognitionRef.current?.stop();
  }, [state.voiceCommands]);

  // Read Aloud
  useEffect(() => {
    speechSynthesis.cancel();
    if (state.readAloud) {
      const utter = new SpeechSynthesisUtterance(document.body.innerText.replace(/\s+/g, ' '));
      utter.lang = 'he-IL';
      speechSynthesis.speak(utter);
    }
  }, [state.readAloud]);

  // Contrast & Saturation & Text
  useEffect(() => {
    const mapping = [
      ['brightContrast', 'es-light-contrast'],
      ['darkContrast', 'es-dark-contrast'],
      ['monoContrast', 'es-mono-contrast'],
      ['highSat', 'es-high-saturation'],
      ['lowSat', 'es-low-saturation'],
      ['largeText', 'es-large-text']
    ];
    mapping.forEach(([feat, cls]) => {
      document.documentElement.classList.toggle(cls, state[feat]);
    });
  }, [state.brightContrast, state.darkContrast, state.monoContrast, state.highSat, state.lowSat, state.largeText]);

  const panel = (
    <div id="accessibility-widget" className="aw-panel" role="dialog" aria-modal="true">
      <button className="aw-close" aria-label="סגור נגישות" onClick={() => setOpen(false)}>
        <FaTimes />
      </button>
      <h2 className="aw-header">התאמות נגישות</h2>

      {/* ניווט */}
      <div className="aw-section">
        <div className="aw-section-header" onClick={() => toggleSection('nav')}>
          <h3>התאמות ניווט</h3>
          {sections.nav ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {sections.nav && (
          <div className="aw-features-wrapper">
            <button className="aw-scroll-btn up" onClick={() => scrollRef(navRef, -100)}>▲</button>
            <div className="aw-features" ref={navRef}>
              <button type="button" className={`aw-feature-btn${state.smartNav ? ' active' : ''}`} onClick={() => toggleFeature('smartNav')} aria-pressed={state.smartNav}>
                <FaArrowsAlt className="aw-icon" /><span className="aw-label">ניווט חכם</span>
              </button>
              <button type="button" className={`aw-feature-btn${state.keyNav ? ' active' : ''}`} onClick={() => toggleFeature('keyNav')} aria-pressed={state.keyNav}>
                <FaKeyboard className="aw-icon" /><span className="aw-label">ניווט מקלדת</span>
              </button>
              <button type="button" className={`aw-feature-btn${state.screenReader ? ' active' : ''}`} onClick={() => toggleFeature('screenReader')} aria-pressed={state.screenReader}>
                <FaAssistiveListeningSystems className="aw-icon" /><span className="aw-label">קורא-מסך</span>
              </button>
              <button type="button" className={`aw-feature-btn${state.voiceCommands ? ' active' : ''}`} onClick={() => toggleFeature('voiceCommands')} aria-pressed={state.voiceCommands}>
                <FaMicrophoneAlt className="aw-icon" /><span className="aw-label">פקודות קוליות</span>
              </button>
              <button type="button" className={`aw-feature-btn${state.readAloud ? ' active' : ''}`} onClick={() => toggleFeature('readAloud')} aria-pressed={state.readAloud}>
                <FaVolumeUp className="aw-icon" /><span className="aw-label">הקראת טקסט</span>
              </button>
            </div>
            <button className="aw-scroll-btn down" onClick={() => scrollRef(navRef, 100)}>▼</button>
          </div>
        )}
      </div>

      {/* ניגודיות */}
      <div className="aw-section">
        <div className="aw-section-header" onClick={() => toggleSection('contrast')}>
          <h3>התאמות ניגודות</h3>
          {sections.contrast ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {sections.contrast && (
          <>
            <div className="aw-features-wrapper">
              <button className="aw-scroll-btn up" onClick={() => scrollRef(contrastRef, -100)}>▲</button>
              <div className="aw-features" ref={contrastRef}>
                <button type="button" className={`aw-feature-btn${state.brightContrast ? ' active' : ''}`} onClick={() => toggleFeature('brightContrast')}>
                  <FaSun className="aw-icon" /><span className="aw-label">ניגודיות בהירה</span>
                </button>
                <button type="button" className={`aw-feature-btn${state.darkContrast ? ' active' : ''}`} onClick={() => toggleFeature('darkContrast')}>
                  <FaMoon className="aw-icon" /><span className="aw-label">ניגודיות כהה</span>
                </button>
                <button type="button" className={`aw-feature-btn${state.monoContrast ? ' active' : ''}`} onClick={() => toggleFeature('monoContrast')}>
                  <FaEye className="aw-icon" /><span className="aw-label">מונוכרום</span>
                </button>
                <button type="button" className={`aw-feature-btn${state.highSat ? ' active' : ''}`} onClick={() => toggleFeature('highSat')}>
                  <FaTint className="aw-icon" /><span className="aw-label">רוויה גבוהה</span>
                </button>
                <button type="button" className={`aw-feature-btn${state.lowSat ? ' active' : ''}`} onClick={() => toggleFeature('lowSat')}>
                  <FaAdjust className="aw-icon" /><span className="aw-label">רוויה נמוכה</span>
                </button>
              </div>
              <button className="aw-scroll-btn down" onClick={() => scrollRef(contrastRef, 100)}>▼</button>
            </div>
            <div className="contrast-tabs">
              <button className={contrastTab === 'backgrounds' ? 'active' : ''} onClick={() => setContrastTab('backgrounds')}>רקע</button>
              <button className={contrastTab === 'headings' ? 'active' : ''} onClick={() => setContrastTab('headings')}>כותרות</button>
              <button className={contrastTab === 'content' ? 'active' : ''} onClick={() => setContrastTab('content')}>תוכן</button>
            </div>
            <div className="aw-slider">
              <label>התאם צבעים:</label>
              <input type="range" min="0" max="360" value={state.hue} onChange={e => onSlider('hue', e)} />
            </div>
          </>
        )}
      </div>

      {/* תוכן */}
      <div className="aw-section">
        <div className="aw-section-header" onClick={() => toggleSection('content')}>
          <h3>התאמות תוכן</h3>
          {sections.content ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {sections.content && (
          <>
            <div className="aw-features-wrapper">
              <button className="aw-scroll-btn up" onClick={() => scrollRef(contentRef, -100)}>▲</button>
              <div className="aw-features" ref={contentRef}>
                <button type="button" className={`aw-feature-btn${state.largeText ? ' active' : ''}`} onClick={() => toggleFeature('largeText')}>
                  <FaFont className="aw-icon" /><span className="aw-label">גופן קריא</span>
                </button>
              </div>
              <button className="aw-scroll-btn down" onClick={() => scrollRef(contentRef, 100)}>▼</button>
            </div>
            <div className="content-tabs">
              <button className={contentTab === 'fontSize' ? 'active' : ''} onClick={() => setContentTab('fontSize')}>גודל גופן</button>
              <button className={contentTab === 'letterSpacing' ? 'active' : ''} onClick={() => setContentTab('letterSpacing')}>מרווח מילים</button>
              <button className={contentTab === 'lineHeight' ? 'active' : ''} onClick={() => setContentTab('lineHeight')}>גובה שורה</button>
            </div>
            <div className="aw-slider">
              <label>{
                contentTab === 'fontSize' ? 'גודל גופן:' :
                contentTab === 'letterSpacing' ? 'מרווח מילים (px):' :
                'גובה שורה:'
              }</label>
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

      <div className="aw-footer">
        <button className="aw-footer-btn" onClick={() => setOpen(false)}>בטל נגישות</button>
      </div>
    </div>
  );

  return (
    open
      ? ReactDOM.createPortal(panel, document.body)
      : <button id="accessibility-toggle" className="aw-toggle-button" aria-label="פתח נגישות" onClick={() => setOpen(true)}><FaWheelchair /></button>
  );
}
