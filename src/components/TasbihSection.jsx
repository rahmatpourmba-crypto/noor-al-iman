import React, { useState, useEffect } from 'react';
import { RotateCcwIcon, CheckIcon } from './Icons';

const PRESET_DHIKRS = [
  { id: 'salawat', text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ', label: 'صلوات ابراهیمی' },
  { id: 'istighfar', text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ', label: 'استغفار' },
  { id: 'subhanallah', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', label: 'تسبیح کلمتان خفیفتان' },
  { id: 'hawqala', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ', label: 'حوّقله (گنج بهشت)' },
  { id: 'tahlil', text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', label: 'تهلیل (توحید)' },
  { id: 'baqiyat', text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', label: 'الباقیات الصالحات' },
];

const TARGETS = [33, 100, 500, 1000, 0]; // 0 یعنی نامحدود

export function TasbihSection({ fontSize }) {
  const [selectedDhikr, setSelectedDhikr] = useState(PRESET_DHIKRS[0]);
  const [count, setCount] = useState(() => {
    return parseInt(localStorage.getItem('noor_tasbih_count') || '0', 10);
  });
  const [target, setTarget] = useState(100);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [totalToday, setTotalToday] = useState(() => {
    return parseInt(localStorage.getItem('noor_tasbih_total') || '0', 10);
  });

  useEffect(() => {
    localStorage.setItem('noor_tasbih_count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('noor_tasbih_total', totalToday.toString());
  }, [totalToday]);

  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {}
  };

  const handleTap = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(35);
    }
    if (soundEnabled) {
      playClickSound();
    }

    const nextCount = count + 1;
    setCount(nextCount);
    setTotalToday(totalToday + 1);

    // لرزش ویژه هنگام رسیدن به هدف
    if (target > 0 && nextCount === target) {
      if ('vibrate' in navigator) {
        navigator.vibrate([80, 50, 80]);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('آیا مایلید شمارنده صفر شود؟')) {
      setCount(0);
    }
  };

  const progressPercent = target > 0 ? Math.min((count / target) * 100, 100) : 100;

  return (
    <div className="section-container tasbih-container">
      {/* سربرگ انتخاب ذکر */}
      <div className="tasbih-dhikr-card">
        <label className="field-label">ذکر یا صلوات انتخابی:</label>
        <select
          value={selectedDhikr.id}
          onChange={(e) => {
            const found = PRESET_DHIKRS.find((d) => d.id === e.target.value);
            if (found) setSelectedDhikr(found);
          }}
          className="dhikr-select"
        >
          {PRESET_DHIKRS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>

        <div className="active-dhikr-arabic" style={{ fontSize: `${fontSize + 3}px` }}>
          «{selectedDhikr.text}»
        </div>
      </div>

      {/* دایره بزرگ لمسی و شمارنده */}
      <div className="tasbih-interactive-area">
        <button
          onClick={handleTap}
          className="tasbih-tap-button"
          aria-label="شمارش ذکر"
        >
          <svg className="tasbih-svg-ring" viewBox="0 0 120 120">
            <circle
              className="ring-bg"
              cx="60"
              cy="60"
              r="52"
            />
            {target > 0 && (
              <circle
                className="ring-progress"
                cx="60"
                cy="60"
                r="52"
                style={{
                  strokeDashoffset: 326.7 - (326.7 * progressPercent) / 100,
                }}
              />
            )}
          </svg>

          <div className="tasbih-center-text">
            <span className="tasbih-count-val">{count}</span>
            <span className="tasbih-target-sub">
              {target > 0 ? `هدف: ${target}` : 'شمارش آزاد'}
            </span>
            <span className="tasbih-tap-hint">لمس کنید</span>
          </div>
        </button>
      </div>

      {/* انتخاب هدف شمارش */}
      <div className="tasbih-controls-box">
        <div className="target-pills-row">
          <span className="control-label">هدف:</span>
          {TARGETS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                if (count >= t && t > 0) setCount(0);
              }}
              className={`target-pill ${target === t ? 'active' : ''}`}
            >
              {t === 0 ? 'آزاد' : t}
            </button>
          ))}
        </div>

        {/* تنظیمات ویبره، صدا و ریست */}
        <div className="tasbih-settings-row">
          <button
            onClick={() => setVibrationEnabled(!vibrationEnabled)}
            className={`toggle-setting-btn ${vibrationEnabled ? 'active' : ''}`}
          >
            📳 ویبره: {vibrationEnabled ? 'روشن' : 'خاموش'}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`toggle-setting-btn ${soundEnabled ? 'active' : ''}`}
          >
            🔔 صدا: {soundEnabled ? 'روشن' : 'خاموش'}
          </button>

          <button
            onClick={handleReset}
            className="reset-counter-btn"
            title="صفر کردن شمارنده"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span>صفر</span>
          </button>
        </div>

        {/* کل ذکرهای امروز */}
        <div className="tasbih-total-badge">
          مجموع ذکرهای ثبت‌شده در دستگاه: <strong>{totalToday}</strong>
        </div>
      </div>
    </div>
  );
}
