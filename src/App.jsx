import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ShubuhatSection } from './components/ShubuhatSection';
import { AzkarSection } from './components/AzkarSection';
import { TasbihSection } from './components/TasbihSection';
import { PrayerSection } from './components/PrayerSection';
import { WaqfSection } from './components/WaqfSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('shubuhat');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('noor_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('noor_font_size') || '16', 10);
  });

  useEffect(() => {
    localStorage.setItem('noor_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('noor_font_size', fontSize.toString());
  }, [fontSize]);

  const renderContent = () => {
    switch (activeTab) {
      case 'shubuhat':
        return <ShubuhatSection fontSize={fontSize} />;
      case 'azkar':
        return <AzkarSection fontSize={fontSize} />;
      case 'tasbih':
        return <TasbihSection fontSize={fontSize} />;
      case 'prayer':
        return <PrayerSection />;
      case 'waqf':
        return <WaqfSection />;
      default:
        return <ShubuhatSection fontSize={fontSize} />;
    }
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : 'light'}`}>
      <div className="mobile-shell">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
        />

        <main className="main-content-scroll">
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
