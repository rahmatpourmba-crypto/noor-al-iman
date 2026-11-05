import React, { useState, useMemo, useEffect } from 'react';
import { CITIES, calculatePrayerTimes } from '../utils/prayerTimes';
import { ClockIcon, PrayerIcon } from './Icons';

export function PrayerSection() {
  const [selectedCityName, setSelectedCityName] = useState(() => {
    return localStorage.getItem('noor_city') || 'زاهدان';
  });
  const [fiqh, setFiqh] = useState(() => {
    return localStorage.getItem('noor_fiqh') || 'hanafi';
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('noor_city', selectedCityName);
  }, [selectedCityName]);

  useEffect(() => {
    localStorage.setItem('noor_fiqh', fiqh);
  }, [fiqh]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const city = useMemo(() => {
    return CITIES.find((c) => c.name === selectedCityName) || CITIES[0];
  }, [selectedCityName]);

  const times = useMemo(() => {
    return calculatePrayerTimes(city.lat, city.lng, currentTime, fiqh);
  }, [city, currentTime, fiqh]);

  const prayerCards = [
    { name: 'فجر (صبح)', time: times.fajr, icon: '🌅', desc: 'پایان سحر و آغاز نماز صبح' },
    { name: 'طلوع آفتاب', time: times.sunrise, icon: '☀️', desc: 'پایان وقت نماز صبح' },
    { name: 'ظهر', time: times.dhuhr, icon: '🌞', desc: 'زوال خورشید از نصف‌النهار' },
    { name: 'عصر', time: times.asr, icon: '🌤️', desc: fiqh === 'hanafi' ? 'فقه حنفی (دو برابر سایه)' : 'فقه شافعی (یک برابر سایه)' },
    { name: 'مغرب', time: times.maghrib, icon: '🌇', desc: 'غروب کامل قرص خورشید' },
    { name: 'عشاء', time: times.isha, icon: '🌌', desc: 'پنهان شدن شفق سرخ در افق' },
  ];

  return (
    <div className="section-container">
      {/* کارت انتخاب شهر و مذهب */}
      <div className="prayer-header-card">
        <div className="prayer-city-select-row">
          <div className="city-box">
            <label className="field-label">انتخاب شهر:</label>
            <select
              value={selectedCityName}
              onChange={(e) => setSelectedCityName(e.target.value)}
              className="prayer-select"
            >
              {CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>

          <div className="fiqh-box">
            <label className="field-label">محاسبه وقت عصر:</label>
            <div className="fiqh-toggle-group">
              <button
                onClick={() => setFiqh('hanafi')}
                className={`fiqh-btn ${fiqh === 'hanafi' ? 'active' : ''}`}
              >
                فقه حنفی
              </button>
              <button
                onClick={() => setFiqh('shafii')}
                className={`fiqh-btn ${fiqh === 'shafii' ? 'active' : ''}`}
              >
                شافعی / جمهور
              </button>
            </div>
          </div>
        </div>

        <div className="prayer-current-clock">
          <ClockIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>ساعت فعلی: {currentTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* نمایش اوقات شرعی */}
      <div className="prayer-times-grid">
        {prayerCards.map((p, idx) => (
          <div key={idx} className="prayer-time-card">
            <div className="prayer-time-icon">{p.icon}</div>
            <div className="prayer-time-info">
              <div className="prayer-time-name">{p.name}</div>
              <div className="prayer-time-desc">{p.desc}</div>
            </div>
            <div className="prayer-time-val">{p.time}</div>
          </div>
        ))}
      </div>

      {/* توضیح فقهی */}
      <div className="prayer-note-box">
        <h4 className="note-title">💡 نکته فقهی درباره وقت نماز عصر اهل سنت:</h4>
        <p className="note-text">
          در مذهب امام ابوحنیفه رحمه‌الله، وقت نماز عصر زمانی آغاز می‌شود که سایه هر چیز به دو برابر طول شاخص (به اضافه سایه زوال) برسد. در مذهب امام شافعی، امام مالک و امام احمد رحمهم‌الله، با رسیدن سایه به یک برابر آغاز می‌شود. با دکمه‌های بالا می‌توانید بر اساس فقه شهر و مسجد خود زمان را دقیق مشاهده فرمایید.
        </p>
      </div>
    </div>
  );
}
