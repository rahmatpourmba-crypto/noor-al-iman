import React, { useState, useEffect } from 'react';
import {
  TasbihIcon,
  CompassIcon,
  BookOpenIcon,
  PrayerIcon,
  ShieldIcon,
  WaqfIcon,
  SparklesIcon,
  KaabaIcon,
  ClockIcon
} from './Icons';
import { calculatePrayerTimes, CITIES } from '../utils/prayerTimes';

export function HomeSection({ setActiveTab }) {
  const [quickTasbihCount, setQuickTasbihCount] = useState(() => {
    return parseInt(localStorage.getItem('noor_quick_tasbih') || '0', 10);
  });
  const [selectedCity] = useState(CITIES[0]); // زاهدان/پیش‌فرض
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    localStorage.setItem('noor_quick_tasbih', quickTasbihCount.toString());
  }, [quickTasbihCount]);

  useEffect(() => {
    const now = new Date();
    // تقویم شمسی
    try {
      const faDate = new Intl.DateTimeFormat('fa-IR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(now);
      setTodayStr(faDate);
    } catch {
      setTodayStr('امروز');
    }

    const times = calculatePrayerTimes(selectedCity.lat, selectedCity.lng, now, 'hanafi');
    setPrayerTimes(times);
  }, [selectedCity]);

  const handleQuickTap = (e) => {
    e.stopPropagation();
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    setQuickTasbihCount((c) => c + 1);
  };

  const resetQuickTap = (e) => {
    e.stopPropagation();
    setQuickTasbihCount(0);
  };

  return (
    <div className="section-container home-section">
      {/* بنر خوش‌آمدگویی و آیه شریفه */}
      <div className="home-hero-card">
        <div className="home-hero-bg-pattern" />
        <div className="home-badge-row">
          <span className="home-pill-badge">✨ صدقه جاریه و باقیات الصالحات</span>
          <span className="home-date-badge">{todayStr}</span>
        </div>

        <h1 className="home-main-title">نور الإیمان</h1>
        <p className="home-quran-verse">
          «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
        </p>
        <span className="home-quran-ref">(سوره رعد - آیه ۲۸)</span>
      </div>

      {/* ویجت تسبیح‌شمار سریع در صفحه اول */}
      <div className="quick-tasbih-card" onClick={() => setActiveTab('tasbih')}>
        <div className="quick-tasbih-header">
          <div className="quick-tasbih-info">
            <span className="quick-tasbih-badge">📿 ذکر سریع</span>
            <h3 className="quick-tasbih-title">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</h3>
          </div>
          <span className="quick-tasbih-enter-hint">ورود به تسبیح کامل ←</span>
        </div>

        <div className="quick-tasbih-action-row">
          <button
            onClick={handleQuickTap}
            className="quick-tasbih-tap-btn"
            title="برای شمارش کلیک کنید"
          >
            <span className="quick-count-num">{quickTasbihCount}</span>
            <span className="quick-tap-label">ضربه بزنید</span>
          </button>

          <div className="quick-tasbih-desc">
            <p>ذکر سبک بر زبان، سنگین در ترازوی اعمال و محبوب نزد خدای رحمان.</p>
            <div className="quick-tasbih-tools">
              <button
                onClick={resetQuickTap}
                className="quick-reset-btn"
                title="صفر کردن شمارنده سریع"
              >
                صفر کردن
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* شبکه کارت‌های اصلی امکانات برنامه */}
      <div className="feature-grid-title-row">
        <h3 className="section-title">امکانات و بخش‌های برنامه</h3>
        <span className="section-subtitle">همه ابزارهای معنوی در یک نگاه</span>
      </div>

      <div className="features-grid">
        {/* ۱. تسبیح‌شمار هوشمند */}
        <div className="feature-card tasbih-card" onClick={() => setActiveTab('tasbih')}>
          <div className="feature-icon-box bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TasbihIcon className="w-7 h-7" />
          </div>
          <div className="feature-card-content">
            <h4 className="feature-name">تسبیح‌شمار هوشمند</h4>
            <p className="feature-desc">شمارشگر صلوات، استغفار و اذکار با لرزش و صدای طبیعی</p>
          </div>
          <div className="feature-arrow">←</div>
        </div>

        {/* ۲. قبله‌نمای دقیق */}
        <div className="feature-card qibla-card" onClick={() => setActiveTab('qibla')}>
          <div className="feature-icon-box bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <CompassIcon className="w-7 h-7" />
          </div>
          <div className="feature-card-content">
            <div className="feature-title-with-badge">
              <h4 className="feature-name">قبله‌نمای آنلاین و زنده</h4>
              <span className="new-badge">جدید</span>
            </div>
            <p className="feature-desc">جهت‌یابی کعبه مشرفه با سنسور گوشی و فاصله تا مکه مکرمه</p>
          </div>
          <div className="feature-arrow">←</div>
        </div>

        {/* ۳. اذکار و ادعیه نبوی (حصن المسلم) */}
        <div className="feature-card azkar-card" onClick={() => setActiveTab('azkar')}>
          <div className="feature-icon-box bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <BookOpenIcon className="w-7 h-7" />
          </div>
          <div className="feature-card-content">
            <h4 className="feature-name">اذکار و سنن نبوی</h4>
            <p className="feature-desc">گنجینه اذکار صبح و شام، قبل خواب و ادعیه با اعراب و ترجمه</p>
          </div>
          <div className="feature-arrow">←</div>
        </div>

        {/* ۴. اوقات شرعی */}
        <div className="feature-card prayer-card" onClick={() => setActiveTab('prayer')}>
          <div className="feature-icon-box bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <PrayerIcon className="w-7 h-7" />
          </div>
          <div className="feature-card-content">
            <h4 className="feature-name">اوقات شرعی آفلاین</h4>
            <p className="feature-desc">
              محاسبه فقهی اذان شهرهای ایران (فقه حنفی و شافعی)
              {prayerTimes && ` | ظهر: ${prayerTimes.dhuhr}`}
            </p>
          </div>
          <div className="feature-arrow">←</div>
        </div>

        {/* ۵. رد شبهات ملحدین */}
        <div className="feature-card shubuhat-card" onClick={() => setActiveTab('shubuhat')}>
          <div className="feature-icon-box bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldIcon className="w-7 h-7" />
          </div>
          <div className="feature-card-content">
            <h4 className="feature-name">رد شبهات فکری و اعتقادی</h4>
            <p className="feature-desc">پاسخ‌های عقلانی برگرفته از آثار متفکر بزرگ اسلام استاد محمد قطب</p>
          </div>
          <div className="feature-arrow">←</div>
        </div>

        {/* ۶. لوح وقف عام و باقیات الصالحات */}
        <div className="feature-card waqf-card" onClick={() => setActiveTab('waqf')}>
          <div className="feature-icon-box bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <WaqfIcon className="w-7 h-7" />
          </div>
          <div className="feature-card-content">
            <h4 className="feature-name">وقف عام و اهدای ثواب</h4>
            <p className="feature-desc">لوح دعای خیر برای رسول اکرم ﷺ، پیامبران، والدین و اهل ایمان</p>
          </div>
          <div className="feature-arrow">←</div>
        </div>
      </div>

      {/* کادر حکمت و فضیلت باقیات الصالحات */}
      <div className="hadith-daily-card">
        <div className="hadith-icon">🌟</div>
        <div className="hadith-body">
          <h4 className="hadith-title">فضیلت الباقیات الصالحات</h4>
          <p className="hadith-text">
            رسول الله ﷺ فرمودند: «سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، هُنَّ الْبَاقِيَاتُ الصَّالِحَاتُ»
          </p>
          <span className="hadith-ref">(مسند امام احمد و سنن نسائی با سند صحیح)</span>
        </div>
      </div>
    </div>
  );
}
