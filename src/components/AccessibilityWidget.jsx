import React, { useState, useEffect } from 'react';
import { useButton } from 'react-aria'; // יבוא של useButton מ־react-aria
import { DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';
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
  // מיקום של כל useState מחוץ לתנאים
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

  // Function to toggle the sections
  const toggleSection = (sec) => setSections((s) => ({ ...s, [sec]: !s[sec] }));

  // Function to toggle feature on or off
  const toggleFeature = (feat) => {
    console.log(`לחץ על ${feat}`); // לדפוק את שם הפיצ'ר שנלחץ
    setState((s) => ({ ...s, [feat]: !s[feat] }));
  };

  // Function to update the state when a slider is changed
  const onSlider = (key, v) => {
    setState((s) => ({ ...s, [key]: v }));
    const prop =
      key === 'hue'
        ? '--es-hue-rotate'
        : key === 'fontSize'
        ? '--es-font-scale'
        : key === 'letterSpacing'
        ? '--es-letter-spacing'
        : '--es-line-height';
    const val = key === 'hue' ? `${v}deg` : key === 'letterSpacing' ? `${v}px` : v;
    document.documentElement.style.setProperty(prop, val);
  };

  // Track state changes for debugging
  useEffect(() => {
    console.log(state); // הדפסת ה-state לאחר כל עדכון
  }, [state]);

  // כל ה-Hooks נמצאים כאן, בסדר הקבוע שלהם
  const { buttonProps } = useButton({
    onPress: () => setOpen(true),
    'aria-label': 'פתח התאמות נגישות',
  });

  return (
    <>
      {/* Accessible Button for Opening Dialog */}
      <button {...buttonProps} className="aw-toggle-button">
        <FaWheelchair />
      </button>

      {open && (
        <DialogOverlay className="aw-panel-overlay" onDismiss={() => setOpen(false)}>
          <DialogContent className="aw-panel" aria-label="התאמות נגישות">
            <button
              {...useButton({
                onPress: () => setOpen(false),
                'aria-label': 'סגור',
              }).buttonProps}
              className="aw-close"
            >
              <FaTimes />
            </button>
            <h2 className="aw-header">התאמות נגישות</h2>

            {/* Navigation Section */}
            <section className="aw-section">
              <header
                {...useButton({
                  onPress: () => toggleSection('nav'),
                  'aria-expanded': sections.nav,
                }).buttonProps}
                className="aw-section-header"
              >
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
                    ['readAloud', FaVolumeUp, 'הקראת טקסט'],
                  ].map(([k, Icon, label]) => (
                    <button
                      {...useButton({
                        onPress: () => toggleFeature(k),
                        'aria-pressed': state[k],
                      }).buttonProps}
                      key={k}
                      className={`aw-feature-btn${state[k] ? ' active' : ''}`}
                    >
                      <Icon className="aw-icon" />
                      <span className="aw-label">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Contrast Section */}
            <section className="aw-section">
              <header
                {...useButton({
                  onPress: () => toggleSection('contrast'),
                  'aria-expanded': sections.contrast,
                }).buttonProps}
                className="aw-section-header"
              >
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
                      ['lowSat', FaAdjust, 'רוויה↓'],
                    ].map(([k, Icon, label]) => (
                      <button
                        {...useButton({
                          onPress: () => toggleFeature(k),
                          'aria-pressed': state[k],
                        }).buttonProps}
                        key={k}
                        className={`aw-feature-btn${state[k] ? ' active' : ''}`}
                      >
                        <Icon className="aw-icon" />
                        <span className="aw-label">{label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="contrast-tabs">
                    {['backgrounds', 'headings', 'content'].map((tab) => (
                      <button
                        {...useButton({
                          onPress: () => setContrastTab(tab),
                          'aria-selected': contrastTab === tab,
                        }).buttonProps}
                        key={tab}
                        className={contrastTab === tab ? 'active' : ''}
                      >
                        {tab === 'backgrounds'
                          ? 'רקע'
                          : tab === 'headings'
                          ? 'כותרות'
                          : 'תוכן'}
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
                      onChange={(e) => onSlider('hue', +e.target.value)}
                    />
                  </div>
                </>
              )}
            </section>

            {/* Content Section */}
            <section className="aw-section">
              <header
                {...useButton({
                  onPress: () => toggleSection('content'),
                  'aria-expanded': sections.content,
                }).buttonProps}
                className="aw-section-header"
              >
                <h3>תוכן</h3>
                {sections.content ? <FaChevronUp /> : <FaChevronDown />}
              </header>
              {sections.content && (
                <>
                  <div className="aw-features">
                    <button
                      {...useButton({
                        onPress: () => toggleFeature('largeText'),
                        'aria-pressed': state.largeText,
                      }).buttonProps}
                      className={`aw-feature-btn${state.largeText ? ' active' : ''}`}
                    >
                      <FaFont className="aw-icon" />
                      <span className="aw-label">טקסט גדול</span>
                    </button>
                  </div>
                  <div className="content-tabs">
                    {['fontSize', 'letterSpacing', 'lineHeight'].map((tab) => (
                      <button
                        {...useButton({
                          onPress: () => setContentTab(tab),
                          'aria-selected': contentTab === tab,
                        }).buttonProps}
                        key={tab}
                        className={contentTab === tab ? 'active' : ''}
                      >
                        {tab === 'fontSize'
                          ? 'גודל'
                          : tab === 'letterSpacing'
                          ? 'מרווח'
                          : 'גובה'}
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
                      onChange={(e) => onSlider(contentTab, +e.target.value)}
                    />
                  </div>
                </>
              )}
            </section>

            <footer className="aw-footer">
              <button
                {...useButton({
                  onPress: () => setOpen(false),
                  'aria-label': 'סגור',
                }).buttonProps}
              >
                סגור
              </button>
            </footer>
          </DialogContent>
        </DialogOverlay>
      )}
    </>
  );
}
