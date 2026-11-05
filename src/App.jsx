import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeSection } from './components/HomeSection';
import { TasbihSection } from './components/TasbihSection';
import { QiblaSection } from './components/QiblaSection';
import { AzkarSection } from './components/AzkarSection';
import { PrayerSection } from './components/PrayerSection';
import { ShubuhatSection } from './components/ShubuhatSection';
import { WaqfSection } from './components/WaqfSection';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
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
      case 'home':
        return <HomeSection setActiveTab={setActiveTab} />;
      case 'tasbih':
        return <TasbihSection fontSize={fontSize} />;
      case 'qibla':
        return <QiblaSection />;
      case 'azkar':
        return <AzkarSection fontSize={fontSize} />;
      case 'prayer':
        return <PrayerSection />;
      case 'shubuhat':
        return <ShubuhatSection fontSize={fontSize} />;
      case 'waqf':
        return <WaqfSection />;
      default:
        return <HomeSection setActiveTab={setActiveTab} />;
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
          setActiveTab={setActiveTab}
        />

        <main className="main-content-scroll">
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
