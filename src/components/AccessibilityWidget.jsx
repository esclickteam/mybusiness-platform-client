// src/components/AccessibilityWidget.jsx
import React, { useState, useEffect } from 'react';
import {
  FaTimes, FaWheelchair,
  FaChevronUp, FaChevronDown,
  FaArrowsAlt, FaKeyboard,
  FaSun, FaMoon, FaEye,
  FaTint, FaAdjust,
  FaFont
} from 'react-icons/fa';
import '../styles/AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);

  // איזה סקשן פתוח
  const [sections, setSections] = useState({
    nav: true,
    contrast: false,
    content: false
  });

  // מצב הטאבים בתוך כל סקשן
  const [contrastTab, setContrastTab] = useState('backgrounds');
  const [contentTab, setContentTab]    = useState('fontSize');

  // סתייט של הפיצ'רים
  const [state, setState] = useState({
    smartNav: false,
    keyNav: false,
    // contrast modes
    brightContrast: false,
    darkContrast:  false,
    monoContrast:  false,
    highSat:       false,
    lowSat:        false,
    // hue
    hue:           0,
    // content sliders
    fontSize:      1,
    letterSpacing: 0,
    lineHeight:    1.5
  });

  // Smart keyboard navigation (כפי שדיברנו לפני)
  useEffect(() => {
    if (!state.smartNav) return;
    const btns = () => Array.from(document.querySelectorAll('.aw-feature-btn'));
    const onKey = e => {
      const all = btns();
      if (!all.length) return;
      let idx = all.indexOf(document.activeElement);
      if (idx === -1 && /^Arrow/.test(e.key)) {
        all[0].focus(); e.preventDefault(); return;
      }
      const cols = 2, max = all.length -1;
      let next = idx;
      switch(e.key){
        case 'ArrowRight': next = idx+1; break;
        case 'ArrowLeft':  next = idx-1; break;
        case 'ArrowDown':  next = idx+cols; break;
        case 'ArrowUp':    next = idx-cols; break;
        default: return;
      }
      next = Math.max(0, Math.min(max, next));
      all[next].focus(); e.preventDefault();
    };
    document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [state.smartNav]);

  const toggleSection = sec =>
    setSections(s => ({ ...s, [sec]: !s[sec] }));

  const toggleFeature = feat =>
    setState(s => ({ ...s, [feat]: !s[feat] }));

  const onSlider = (key, e) => {
    const v = Number(e.target.value);
    setState(s => ({ ...s, [key]: v }));
    document.documentElement.style.setProperty(
      key === 'hue' ? '--es-hue-rotate'
    : key === 'fontSize' ? '--es-font-scale'
    : key === 'letterSpacing' ? '--es-letter-spacing'
    : '--es-line-height',
      key === 'hue' ? `${v}deg`
    : key === 'letterSpacing' ? `${v}px`
    : v
    );
  };

  return (
    <>
      <button
        className="aw-toggle-button"
        onClick={()=>setOpen(o=>!o)}
        aria-label="פתח/סגור נגישות"
      >
        {open ? <FaTimes/> : <FaWheelchair/>}
      </button>

      {open && (
        <div className="aw-panel" role="dialog" aria-modal="true">
          <button className="aw-close" onClick={()=>setOpen(false)}>
            <FaTimes/>
          </button>
          <div className="aw-header"><h2>נגישות</h2></div>

          {/* === סקשן 1: התאמות ניווט === */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={()=>toggleSection('nav')}>
              <h3>התאמות ניווט</h3>
              {sections.nav ? <FaChevronUp/> : <FaChevronDown/>}
            </div>
            {sections.nav && (
              <div className="aw-features">
                <button
                  className={`aw-feature-btn${state.smartNav?' active':''}`}
                  onClick={()=>toggleFeature('smartNav')}>
                  <FaArrowsAlt className="aw-icon"/>
                  <span className="aw-label">ניווט חכם</span>
                </button>
                <button
                  className={`aw-feature-btn${state.keyNav?' active':''}`}
                  onClick={()=>toggleFeature('keyNav')}>
                  <FaKeyboard className="aw-icon"/>
                  <span className="aw-label">ניווט מקלדת</span>
                </button>
              </div>
            )}
          </div>

          {/* === סקשן 2: התאמות ניגודיות === */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={()=>toggleSection('contrast')}>
              <h3>התאמות ניגודיות</h3>
              {sections.contrast ? <FaChevronUp/> : <FaChevronDown/>}
            </div>
            {sections.contrast && (
              <>
                <div className="aw-features">
                  {[
                    ['brightContrast', <FaSun/>, 'ניגודיות בהירה'],
                    ['darkContrast',   <FaMoon/>, 'ניגודיות כהה'],
                    ['monoContrast',   <FaEye/>,  'מונוכרום'],
                    ['highSat',        <FaTint/>, 'רוויה גבוהה'],
                    ['lowSat',         <FaAdjust/>, 'רוויה נמוכה'],
                  ].map(([key, icon, label]) => (
                    <button
                      key={key}
                      className={`aw-feature-btn${state[key]?' active':''}`}
                      onClick={()=>toggleFeature(key)}
                    >
                      <span className="aw-icon">{icon}</span>
                      <span className="aw-label">{label}</span>
                    </button>
                  ))}
                </div>
                <div className="contrast-tabs">
                  <button
                    className={contrastTab==='backgrounds'?'active':''}
                    onClick={()=>setContrastTab('backgrounds')}
                  >רקע</button>
                  <button
                    className={contrastTab==='headings'?'active':''}
                    onClick={()=>setContrastTab('headings')}
                  >כותרות</button>
                  <button
                    className={contrastTab==='content'?'active':''}
                    onClick={()=>setContrastTab('content')}
                  >תוכן</button>
                </div>
                <div className="aw-slider">
                  <label>התאם צבעים:</label>
                  <input
                    type="range" min="0" max="360" value={state.hue}
                    onChange={e=>onSlider('hue',e)}
                  />
                </div>
              </>
            )}
          </div>

          {/* === סקשן 3: התאמות תוכן === */}
          <div className="aw-section">
            <div className="aw-section-header" onClick={()=>toggleSection('content')}>
              <h3>התאמות תוכן</h3>
              {sections.content ? <FaChevronUp/> : <FaChevronDown/>}
            </div>
            {sections.content && (
              <>
                <div className="content-tabs">
                  <button
                    className={contentTab==='fontSize'?'active':''}
                    onClick={()=>setContentTab('fontSize')}
                  >גודל גופן</button>
                  <button
                    className={contentTab==='letterSpacing'?'active':''}
                    onClick={()=>setContentTab('letterSpacing')}
                  >מרווח בין מילים</button>
                  <button
                    className={contentTab==='lineHeight'?'active':''}
                    onClick={()=>setContentTab('lineHeight')}
                  >מרווח בין שורות</button>
                </div>
                <div className="aw-slider">
                  <label>
                    {contentTab==='fontSize' ? 'גודל גופן:' :
                     contentTab==='letterSpacing' ? 'מרווח בין מילים (px):' :
                     'גובה שורה:'}
                  </label>
                  <input
                    type="range"
                    min={contentTab==='fontSize' ? 0.8 : contentTab==='letterSpacing' ? 0 : 1}
                    max={contentTab==='fontSize' ? 2   : contentTab==='letterSpacing' ? 20 : 3}
                    step={contentTab==='fontSize'?0.1:0.1}
                    value={state[contentTab]}
                    onChange={e=>onSlider(contentTab,e)}
                  />
                </div>
              </>
            )}
          </div>

          {/* === Footer === */}
          <div className="aw-footer">
            <button onClick={()=>setOpen(false)}>בטל נגישות</button>
            <button>הצהרת נגישות</button>
            <button>שלח משוב</button>
            <div className="aw-powered">נגיש בקליק</div>
          </div>
        </div>
      )}
    </>
  );
}
