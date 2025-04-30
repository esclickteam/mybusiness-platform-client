import React, { useState, useEffect, useRef } from 'react';
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

  const navRef = useRef(null);
  const contrastRef = useRef(null);
  const contentRef = useRef(null);
  const recognitionRef = useRef(null);

  const toggleSection = sec => setSections(s => ({ ...s, [sec]: !s[sec] }));

  const toggle = feat => {
    console.log('▶ accessibility toggle:', feat);
    setState(s => ({ ...s, [feat]: !s[feat] }));
  };

  const scrollRef = (ref, delta) => ref.current?.scrollBy({ top: delta, behavior: 'smooth' });

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

  // 1) Smart Nav
  useEffect(() => {
    if (!state.smartNav) return;
    const btns = () => Array.from(document.querySelectorAll('.aw-feature-btn'));
    const onKey = e => {
      if (!/^Arrow/.test(e.key)) return;
      let idx = btns().indexOf(document.activeElement);
      if (idx === -1) idx = 0;
      const cols = 2, max = btns().length - 1;
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

  // 2) Keyboard Nav
  useEffect(() => {
    document.documentElement.classList.toggle('es-keyboard-nav', state.keyNav);
  }, [state.keyNav]);

  // 3) Screen Reader
  useEffect(() => {
    const others = Array.from(document.body.children).filter(el => el.id !== 'accessibility-widget');
    others.forEach(el => {
      if (state.screenReader) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });
  }, [state.screenReader]);

  // 4) Voice Commands
useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (state.voiceCommands) {
      if (!SR) {
        alert('דפדפן לא תומך פקודות קוליות');
      } else {
        const recog = new SR();
        recognitionRef.current = recog;
        recog.lang = 'he-IL';
        recog.continuous = true;
        recog.onresult = ev => {
          const cmd = ev.results[ev.resultIndex][0].transcript.trim().toLowerCase();
          console.log('▶ voice command:', cmd);
          if (cmd.includes('בית')) window.location.href = '/';
          if (cmd.includes('הקרא')) toggle('readAloud');
        };
        recog.start();
      }
    } else {
      recognitionRef.current?.stop();
    }
  
    // תמיד מחזירים פונקציית ניקוי
    return () => {
      recognitionRef.current?.stop();
    };
  }, [state.voiceCommands]);
  

  // 5) Read Aloud
  useEffect(() => {
    speechSynthesis.cancel();
    if (state.readAloud) {
      console.log('▶ readAloud start');
      const u = new SpeechSynthesisUtterance(document.body.innerText.replace(/\s+/g, ' '));
      u.lang = 'he-IL';
      speechSynthesis.speak(u);
    } else console.log('▶ readAloud stop');
  }, [state.readAloud]);

  // 6–10) Contrast & Saturation & Text
  useEffect(() => document.documentElement.classList.toggle('es-light-contrast', state.brightContrast), [state.brightContrast]);
  useEffect(() => document.documentElement.classList.toggle('es-dark-contrast', state.darkContrast), [state.darkContrast]);
  useEffect(() => document.documentElement.classList.toggle('es-mono-contrast', state.monoContrast), [state.monoContrast]);
  useEffect(() => document.documentElement.classList.toggle('es-high-saturation', state.highSat), [state.highSat]);
  useEffect(() => document.documentElement.classList.toggle('es-low-saturation', state.lowSat), [state.lowSat]);
  useEffect(() => document.documentElement.classList.toggle('es-large-text', state.largeText), [state.largeText]);

  return (
    <>
      <button
        id="accessibility-toggle"
        className="aw-toggle-button"
        aria-label="פתח/סגור נגישות"
        onClick={() => setOpen(o => !o)}
      >{open ? <FaTimes /> : <FaWheelchair />}</button>

      {open && (
        <div id="accessibility-widget" className="aw-panel" role="dialog" aria-modal="true">
          <button className="aw-close" onClick={() => setOpen(false)} aria-label="סגור"><FaTimes /></button>
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
                  {[
                    ['smartNav', <FaArrowsAlt />, 'ניווט חכם'],
                    ['keyNav', <FaKeyboard />, 'ניווט מקלדת'],
                    ['screenReader', <FaAssistiveListeningSystems />, 'התאמה לקורא-מסך'],
                    ['voiceCommands', <FaMicrophoneAlt />, 'פקודות קוליות'],
                    ['readAloud', <FaVolumeUp />, 'הקראת טקסט']
                  ].map(([k, Icon, label]) => (
                    <button key={k} className={`aw-feature-btn${state[k] ? ' active' : ''}`} onClick={() => toggle(k)} aria-pressed={state[k]}>
                      <span className="aw-icon">{Icon}</span>
                      <span className="aw-label">{label}</span>
                    </button>
                  ))}
                </div>
                <button className="aw-scroll-btn down" onClick={() => scrollRef(navRef, 100)}>▼</button>
              </div>
            )}
          </div>

          {/* ניגודיות */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={() => toggleSection('contrast')}>
              <h3>התאמות ניגודיות</h3>
              {sections.contrast ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {sections.contrast && (
              <>
                <div className="aw-features-wrapper">
                  <button className="aw-scroll-btn up" onClick={() => scrollRef(contrastRef, -100)}>▲</button>
                  <div className="aw-features" ref={contrastRef}>
                    {[
                      ['brightContrast', <FaSun />, 'ניגודיות בהירה'],
                      ['darkContrast', <FaMoon />, 'ניגודיות כהה'],
                      ['monoContrast', <FaEye />, 'מונוכרום'],
                      ['highSat', <FaTint />, 'רוויה גבוהה'],
                      ['lowSat', <FaAdjust />, 'רוויה נמוכה']
                    ].map(([k, Icon, label]) => (
                      <button key={k} className={`aw-feature-btn${state[k] ? ' active' : ''}`} onClick={() => toggle(k)}>
                        <span className="aw-icon">{Icon}</span>
                        <span className="aw-label">{label}</span>
                      </button>
                    ))}
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
                  <div className="aw-features aw-grid-3" ref={contentRef}>
                    <button key="largeText" className={`aw-feature-btn${state.largeText ? ' active' : ''}`} onClick={() => toggle('largeText')}>
                      <FaFont className="aw-icon" />
                      <span className="aw-label">גופן קריא</span>
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
                  <label>{contentTab === 'fontSize' ? 'גודל גופן:' : contentTab === 'letterSpacing' ? 'מרווח מילים (px):' : 'גובה שורה:'}</label>
                  <input type="range" min={contentTab === 'fontSize' ? 0.8 : contentTab === 'letterSpacing' ? 0 : 1} max={contentTab === 'fontSize' ? 2 : contentTab === 'letterSpacing' ? 20 : 3} step="0.1" value={state[contentTab]} onChange={e => onSlider(contentTab, e)} />
                </div>
              </>
            )}
          </div>

          <div className="aw-footer">
            <button className="aw-footer-btn" onClick={() => setOpen(false)}>בטל נגישות</button>
          </div>
        </div>
      )}
    </>
  );
}
