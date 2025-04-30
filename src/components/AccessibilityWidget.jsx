// src/components/AccessibilityWidget.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
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

Modal.setAppElement('#root');

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

  const toggleSection = sec => setSections(s => ({ ...s, [sec]: !s[sec] }));
  const toggleFeature = feat => setState(s => ({ ...s, [feat]: !s[feat] }));
  const onSlider = (key, v) => {
    setState(s => ({ ...s, [key]: v }));
    const prop =
      key === 'hue' ? '--es-hue-rotate' :
      key === 'fontSize' ? '--es-font-scale' :
      key === 'letterSpacing' ? '--es-letter-spacing' :
      '--es-line-height';
    const val = key === 'hue' ? `${v}deg` : key === 'letterSpacing' ? `${v}px` : v;
    document.documentElement.style.setProperty(prop, val);
  };

  return (
    <>
      <button
        className="aw-toggle-button"
        onClick={() => setOpen(true)}
        aria-label="פתח התאמות נגישות"
      >
        <FaWheelchair />
      </button>

      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        overlayClassName="aw-panel-overlay"
        className="aw-panel"
        contentLabel="Accessible Settings"
      >
        <button className="aw-close" onClick={() => setOpen(false)} aria-label="סגור">
          <FaTimes />
        </button>
        <h2 className="aw-header">התאמות נגישות</h2>

        {/* --- Navigation Section --- */}
        <section className="aw-section">
          <header className="aw-section-header" onClick={() => toggleSection('nav')}>
            <h3>ניווט</h3>
            {sections.nav ? <FaChevronUp /> : <FaChevronDown />}
          </header>
          {sections.nav && (
            <div className="aw-features">
              {[
                ['smartNav', FaArrowsAlt, 'ניווט חכם'],
                ['keyNav', FaKeyboard, 'ניווט מקלדת'],
                ['screenReader', FaAssistiveListeningSystems, 'קורא מסך'],
                ['voiceCommands', FaMicrophoneAlt, 'פקודות קוליות'],
                ['readAloud', FaVolumeUp, 'הקראת טקסט']
              ].map(([k, Icon, label]) => (
                <button
                  key={k}
                  className={`aw-feature-btn${state[k] ? ' active' : ''}`}
                  onClick={() => toggleFeature(k)}
                  aria-pressed={state[k]}
                >
                  <Icon className="aw-icon" />
                  <span className="aw-label">{label}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* --- Contrast Section --- */}
        <section className="aw-section">
          <header className="aw-section-header" onClick={() => toggleSection('contrast')}>
            <h3>ניגודיות</h3>
            {sections.contrast ? <FaChevronUp /> : <FaChevronDown />}
          </header>
          {sections.contrast && (
            <>
              <div className="aw-features">
                {[
                  ['brightContrast', FaSun, 'בהירה'],
                  ['darkContrast', FaMoon, 'כהה'],
                  ['monoContrast', FaEye, 'מונוכרום'],
                  ['highSat', FaTint, 'רוויה↑'],
                  ['lowSat', FaAdjust, 'רוויה↓']
                ].map(([k, Icon, label]) => (
                  <button
                    key={k}
                    className={`aw-feature-btn${state[k] ? ' active' : ''}`}
                    onClick={() => toggleFeature(k)}
                  >
                    <Icon className="aw-icon" />
                    <span className="aw-label">{label}</span>
                  </button>
                ))}
              </div>
              <div className="contrast-tabs">
                {['backgrounds', 'headings', 'content'].map(tab => (
                  <button
                    key={tab}
                    className={contrastTab === tab ? 'active' : ''}
                    onClick={() => setContrastTab(tab)}
                  >
                    {tab === 'backgrounds' ? 'רקע' : tab === 'headings' ? 'כותרות' : 'תוכן'}
                  </button>
                ))}
              </div>
              <div className="aw-slider">
                <label>התאם גוון:</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={state.hue}
                  onChange={e => onSlider('hue', +e.target.value)}
                />
              </div>
            </>
          )}
        </section>

        {/* --- Content Section --- */}
        <section className="aw-section">
          <header className="aw-section-header" onClick={() => toggleSection('content')}>
            <h3>תוכן</h3>
            {sections.content ? <FaChevronUp /> : <FaChevronDown />}
          </header>
          {sections.content && (
            <>
              <div className="aw-features">
                <button
                  className={`aw-feature-btn${state.largeText ? ' active' : ''}`}
                  onClick={() => toggleFeature('largeText')}>
                  <FaFont className="aw-icon" />
                  <span className="aw-label">טקסט גדול</span>
                </button>
              </div>
              <div className="content-tabs">
                {['fontSize', 'letterSpacing', 'lineHeight'].map(tab => (
                  <button
                    key={tab}
                    className={contentTab === tab ? 'active' : ''}
                    onClick={() => setContentTab(tab)}
                  >
                    {tab === 'fontSize' ? 'גודל' : tab === 'letterSpacing' ? 'מרווח' : 'גובה'}
                  </button>
                ))}
              </div>
              <div className="aw-slider">
                <label>
                  {contentTab === 'fontSize'
                    ? 'גודל גופן:'
                    : contentTab === 'letterSpacing'
                    ? 'מרווח מילים:'
                    : 'גובה שורה:'}
                </label>
                <input
                  type="range"
                  min={contentTab === 'fontSize' ? 0.8 : contentTab === 'letterSpacing' ? 0 : 1}
                  max={contentTab === 'fontSize' ? 2 : contentTab === 'letterSpacing' ? 20 : 3}
                  step="0.1"
                  value={state[contentTab]}
                  onChange={e => onSlider(contentTab, +e.target.value)}
                />
              </div>
            </>
          )}
        </section>

        <footer className="aw-footer">
          <button onClick={() => setOpen(false)}>סגור</button>
        </footer>
      </Modal>
    </>
  );
}
