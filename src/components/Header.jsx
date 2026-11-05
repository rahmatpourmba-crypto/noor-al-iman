import React from 'react';
import { SunIcon, MoonIcon, WaqfIcon, SparklesIcon } from './Icons';

export function Header({ darkMode, setDarkMode, fontSize, setFontSize, setActiveTab }) {
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const increaseFont = () => {
    if (fontSize < 24) setFontSize(fontSize + 1);
  };

  const decreaseFont = () => {
    if (fontSize > 14) setFontSize(fontSize - 1);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-title-box" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="header-title-row">
            <span className="header-crescent">🌙</span>
            <h1 className="header-title">نور الإیمان</h1>
          </div>
          <p className="header-subtitle">اذکار، تسبیح، قبله‌نما و باقیات الصالحات</p>
        </div>

        <div className="header-actions">
          {/* دکمه لوح وقف و باقیات الصالحات */}
          <button
            onClick={() => setActiveTab('waqf')}
            className="header-waqf-pill"
            title="مشاهده لوح وقف و اهدای ثواب"
          >
            <WaqfIcon className="w-4 h-4 text-amber-300" />
            <span className="waqf-pill-text">وقف</span>
          </button>

          {/* تغییر اندازه قلم */}
          <div className="font-resizer" title="تغییر اندازه قلم">
            <button onClick={decreaseFont} className="icon-btn font-btn" aria-label="کوچک‌تر">
              <span>-</span>
            </button>
            <span className="font-size-label">{fontSize}</span>
            <button onClick={increaseFont} className="icon-btn font-btn" aria-label="بزرگ‌تر">
              <span>+</span>
            </button>
          </div>

          {/* تغییر حالت شب و روز */}
          <button
            onClick={toggleDarkMode}
            className="icon-btn theme-toggle"
            aria-label="تغییر حالت شب/روز"
            title={darkMode ? 'حالت روز' : 'حالت شب'}
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5 text-amber-300" />
            ) : (
              <MoonIcon className="w-5 h-5 text-amber-200" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
