import React, { useState, useEffect, useRef } from 'react';
import { CITIES, calculateQibla, calculateMeccaDistance } from '../utils/prayerTimes';
import { CompassIcon, KaabaIcon, SparklesIcon, CheckIcon } from './Icons';

export function QiblaSection() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // زاهدان یا پیرانشهر
  const [customCoords, setCustomCoords] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0); // زاویه چرخش گوشی نسبت به شمال
  const [hasSensor, setHasSensor] = useState(false);
  const [sensorActive, setSensorActive] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [manualAngle, setManualAngle] = useState(0);

  const prevAlignedRef = useRef(false);

  const activeLat = customCoords ? customCoords.lat : selectedCity.lat;
  const activeLng = customCoords ? customCoords.lng : selectedCity.lng;

  const qiblaAngle = calculateQibla(activeLat, activeLng);
  const meccaDistance = calculateMeccaDistance(activeLat, activeLng);

  // اگر سنسور فعال باشد از سنسور استفاده می‌شود وگرنه از زاویه دستی یا پیش‌فرض
  const currentHeading = sensorActive ? compassHeading : manualAngle;
  // زاویه سوزن قبله نسبت به بالای گوشی (در صورت چرخش گوشی)
  // سوزن باید به سمت زاویه (qiblaAngle - currentHeading) بچرخد
  const needleRotation = (qiblaAngle - currentHeading + 360) % 360;

  // بررسی تراز بودن با قبله (با تلرانس ۴ درجه)
  const diffFromQibla = Math.abs((needleRotation > 180 ? 360 - needleRotation : needleRotation));
  const alignedNow = diffFromQibla <= 5;

  useEffect(() => {
    setIsAligned(alignedNow);
    if (alignedNow && !prevAlignedRef.current) {
      if ('vibrate' in navigator) {
        navigator.vibrate([70, 40, 70]);
      }
    }
    prevAlignedRef.current = alignedNow;
  }, [alignedNow]);

  // راه‌اندازی سنسور جهت‌یاب گوشی
  const startCompassSensor = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response !== 'granted') {
          alert('برای چرخش خودکار قطب‌نما، اجازه دسترسی به سنسور را تایید کنید.');
          return;
        }
      } catch (e) {
        console.error('Permission error', e);
      }
    }

    const handleOrientation = (e) => {
      let heading = null;
      if (typeof e.webkitCompassHeading !== 'undefined') {
        // برای گوشی‌های آیفون و سافاری
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // برای اندروید و کروم (زاویه از شمال با قطب‌نمای مطلق)
        if (e.absolute || typeof e.webkitCompassHeading !== 'undefined') {
          heading = 360 - e.alpha;
        } else {
          heading = 360 - e.alpha;
        }
      }

      if (heading !== null) {
        setHasSensor(true);
        setSensorActive(true);
        setCompassHeading(Math.round(heading));
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
    setSensorActive(true);
  };

  const handleGpsDetect = () => {
    if (!navigator.geolocation) {
      setGpsError('مرورگر شما از GPS پشتیبانی نمی‌کند.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCustomCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: 'موقعیت زنده GPS شما'
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError('دسترسی به GPS داده نشد یا موقعیت یافت نشد.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="section-container qibla-section">
      {/* کارت سربرگ قبله‌نما */}
      <div className="qibla-hero-card">
        <div className="qibla-hero-glow" />
        <div className="qibla-badge">
          <KaabaIcon className="w-4 h-4 text-amber-300" />
          <span>جهت‌یاب مکه مکرمه</span>
        </div>
        <h2 className="qibla-title">قبله‌نمای آنلاین و هوشمند</h2>
        <p className="qibla-subtitle">
          محاسبه دقیق زاویه انحراف کعبه مشرفه با الگوریتم کروی زمین و سنسور قطب‌نمای گوشی
        </p>

        {/* دکمه‌های کنترل و موقعیت‌یابی */}
        <div className="qibla-controls-row">
          <select
            className="qibla-city-select"
            value={customCoords ? 'gps' : selectedCity.name}
            onChange={(e) => {
              if (e.target.value === 'gps') return;
              const found = CITIES.find((c) => c.name === e.target.value);
              if (found) {
                setSelectedCity(found);
                setCustomCoords(null);
              }
            }}
          >
            {customCoords && <option value="gps">📍 موقعیت زنده GPS شما</option>}
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} ({c.province})
              </option>
            ))}
          </select>

          <button
            onClick={handleGpsDetect}
            className={`qibla-gps-btn ${gpsLoading ? 'loading' : ''}`}
            title="یافتن دقیق موقعیت شما با GPS"
          >
            {gpsLoading ? 'در حال دریافت...' : '📍 موقعیت من'}
          </button>
        </div>

        {gpsError && <p className="qibla-error-msg">{gpsError}</p>}
      </div>

      {/* صفحه اصلی قطب‌نما (Compass Dial) */}
      <div className={`compass-outer-card ${isAligned ? 'aligned' : ''}`}>
        {/* نشانگر رو به قبله بودن */}
        <div className={`alignment-status-banner ${isAligned ? 'is-aligned' : ''}`}>
          {isAligned ? (
            <>
              <CheckIcon className="w-5 h-5 text-emerald-400" />
              <span>شما دقیقاً رو به قبله هستید (تقبل‌الله)</span>
            </>
          ) : (
            <>
              <CompassIcon className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>
                {sensorActive
                  ? `گوشی را بچرخانید تا نشانگر سبز شود (${Math.round(diffFromQibla)}° اختلاف)`
                  : `زاویه قبله: ${qiblaAngle} درجه نسبت به شمال`}
              </span>
            </>
          )}
        </div>

        {/* دایره بصری قطب‌نما */}
        <div className="compass-dial-wrapper">
          {/* صفحه مدور چرخان (در صورت وجود سنسور، صفحه به اندازه زاویه گوشی می‌چرخد) */}
          <div
            className="compass-dial"
            style={{
              transform: sensorActive ? `rotate(${-currentHeading}deg)` : 'rotate(0deg)',
              transition: sensorActive ? 'transform 0.15s cubic-bezier(0.1, 0.8, 0.3, 1)' : 'transform 0.3s ease',
            }}
          >
            {/* دایره محیطی و درجات */}
            <div className="dial-rim">
              <span className="cardinal n">شمال (N)</span>
              <span className="cardinal e">شرق (E)</span>
              <span className="cardinal s">جنوب (S)</span>
              <span className="cardinal w">غرب (W)</span>

              {/* خطوط درجه‌بندی */}
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`dial-tick ${i % 6 === 0 ? 'major' : ''}`}
                  style={{ transform: `rotate(${i * 15}deg)` }}
                />
              ))}
            </div>

            {/* نشانگر ثابت کعبه روی دایره */}
            <div
              className="compass-kaaba-marker"
              style={{ transform: `rotate(${qiblaAngle}deg)` }}
              title={`زاویه کعبه: ${qiblaAngle}°`}
            >
              <div className="kaaba-marker-icon">
                <KaabaIcon className="w-6 h-6 text-amber-400" />
                <span className="marker-label">قبله</span>
              </div>
            </div>
          </div>

          {/* سوزن قبله‌نما (Needle) */}
          <div
            className={`compass-needle-wrapper ${isAligned ? 'aligned-pulse' : ''}`}
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transition: 'transform 0.2s cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            <div className="needle-pointer-north">
              <div className="needle-head">
                <KaabaIcon className="w-4 h-4 text-emerald-100" />
              </div>
              <div className="needle-body north" />
            </div>
            <div className="needle-pivot" />
            <div className="needle-pointer-south">
              <div className="needle-body south" />
            </div>
          </div>
        </div>

        {/* اطلاعات زوایای نجومی */}
        <div className="compass-stats-grid">
          <div className="compass-stat-box">
            <span className="stat-label">زاویه قبله</span>
            <span className="stat-val text-amber-500 font-bold">{qiblaAngle}°</span>
            <span className="stat-desc">از شمال حقیقی</span>
          </div>

          <div className="compass-stat-box">
            <span className="stat-label">فاصله تا مکه</span>
            <span className="stat-val text-emerald-600 dark:text-emerald-400 font-bold">
              {meccaDistance.toLocaleString('fa-IR')}
            </span>
            <span className="stat-desc">کیلومتر مستقیم</span>
          </div>

          <div className="compass-stat-box">
            <span className="stat-label">موقعیت</span>
            <span className="stat-val font-semibold truncate text-xs" title={customCoords ? customCoords.name : selectedCity.name}>
              {customCoords ? 'موقعیت شما' : selectedCity.name}
            </span>
            <span className="stat-desc">
              {activeLat.toFixed(2)}°N , {activeLng.toFixed(2)}°E
            </span>
          </div>
        </div>

        {/* دکمه فعال‌سازی سنسور قطب‌نما یا حالت دستی */}
        <div className="sensor-toggle-box">
          {!sensorActive ? (
            <button onClick={startCompassSensor} className="sensor-activate-btn">
              <CompassIcon className="w-5 h-5" />
              <span>فعال‌سازی چرخش زنده با قطب‌نمای گوشی</span>
            </button>
          ) : (
            <div className="sensor-active-indicator">
              <span className="pulse-dot" />
              <span>سنسور قطب‌نما فعال است (گوشی را افقی نگه دارید)</span>
            </div>
          )}
        </div>
      </div>

      {/* راهنمای سریع و فقهی جهت‌یابی */}
      <div className="qibla-tips-card">
        <h3 className="tips-title">💡 نکات طلایی جهت‌یابی صحیح قبله:</h3>
        <ul className="tips-list">
          <li>
            <strong>گوشی را کاملاً افقی و صاف</strong> در کف دست بگیرید تا حسگر مغناطیسی دقیق‌ترین جهت را نشان دهد.
          </li>
          <li>
            از اجسام فلزی، آهن‌ربای کاور موبایل یا وسایل برقی قوی دوری کنید تا در سنسور قطب‌نما خطایی ایجاد نشود.
          </li>
          <li>
            در اکثر نقاط ایران، قبله تقریباً به سمت <strong>جنوب غربی (بین ۲۰۰ تا ۲۵۰ درجه)</strong> قرار دارد.
          </li>
        </ul>
      </div>
    </div>
  );
}
