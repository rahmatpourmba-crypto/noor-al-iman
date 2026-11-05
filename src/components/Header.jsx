import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

export function Header({ darkMode, setDarkMode, fontSize, setFontSize }) {
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
        <div className="header-title-box">
          <div className="app-badge">باقیات و صالحات</div>
          <h1 className="header-title">نور الإیمان</h1>
          <p className="header-subtitle">اذکار نبوی و رد شبهات ملحدین (استاد محمد قطب)</p>
        </div>

        <div className="header-actions">
          {/* تغییر اندازه فونت برای راحتی مطالعه */}
          <div className="font-resizer" title="تغییر اندازه قلم">
            <button onClick={decreaseFont} className="icon-btn" aria-label="کوچک‌تر">
              <span>الف-</span>
            </button>
            <span className="font-size-label">{fontSize}</span>
            <button onClick={increaseFont} className="icon-btn" aria-label="بزرگ‌تر">
              <span>الف+</span>
            </button>
          </div>

          {/* تغییر تم شب و روز */}
          <button
            onClick={toggleDarkMode}
            className="icon-btn theme-toggle"
            aria-label="تغییر حالت شب/روز"
            title={darkMode ? 'حالت روز' : 'حالت شب'}
          >
            {darkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-emerald-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}
