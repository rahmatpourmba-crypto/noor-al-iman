import React from 'react';
import { ShieldIcon, BookOpenIcon, TasbihIcon, PrayerIcon, WaqfIcon } from './Icons';

export function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'shubuhat', label: 'رد شبهات', icon: ShieldIcon },
    { id: 'azkar', label: 'حصن المسلم', icon: BookOpenIcon },
    { id: 'tasbih', label: 'تسبیح‌شمار', icon: TasbihIcon },
    { id: 'prayer', label: 'اوقات شرعی', icon: PrayerIcon },
    { id: 'waqf', label: 'وقف و دعا', icon: WaqfIcon },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">
                <Icon className={`nav-icon ${isActive ? 'scale-110' : ''}`} />
              </div>
              <span className="nav-label">{tab.label}</span>
              {isActive && <div className="nav-active-pill" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
