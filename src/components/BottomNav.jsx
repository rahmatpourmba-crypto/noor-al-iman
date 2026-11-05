import React from 'react';
import { HomeIcon, TasbihIcon, CompassIcon, BookOpenIcon, ShieldIcon } from './Icons';

export function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', label: 'خانه', icon: HomeIcon },
    { id: 'tasbih', label: 'تسبیح', icon: TasbihIcon },
    { id: 'qibla', label: 'قبله‌نما', icon: CompassIcon },
    { id: 'azkar', label: 'اذکار نبوی', icon: BookOpenIcon },
    { id: 'shubuhat', label: 'رد شبهات', icon: ShieldIcon },
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
              aria-label={tab.label}
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
