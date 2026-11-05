import React, { useState } from 'react';
import { azkarCategories, azkarList } from '../data/azkarData';
import { CheckIcon, RotateCcwIcon, ShareIcon, CopyIcon, SunIcon, MoonIcon, ClockIcon, BedIcon, HeartIcon } from './Icons';

export function AzkarSection({ fontSize }) {
  const [activeCategory, setActiveCategory] = useState('morning');
  const [counts, setCounts] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <SunIcon className="w-4 h-4" />;
      case 'Moon': return <MoonIcon className="w-4 h-4" />;
      case 'Clock': return <ClockIcon className="w-4 h-4" />;
      case 'Bed': return <BedIcon className="w-4 h-4" />;
      case 'Heart': return <HeartIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleIncrement = (id, targetCount) => {
    // بازخورد لرزشی ملایم در صورت پشتیبانی گوشی
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    setCounts((prev) => {
      const current = prev[id] || 0;
      if (current < targetCount) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const handleReset = (id) => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  };

  const handleShare = (item) => {
    const textToShare = `📖 ذکر مسنون از کتاب «حصن المسلم»:\n\n${item.arabic}\n\nترجمه: ${item.translation}\n\n✨ فضیلت: ${item.benefit}\nتعداد توصیه شده: ${item.count} مرتبه\n\nنشر به عنوان باقیات و صالحات - اپلیکیشن نور الایمان`;
    if (navigator.share) {
      navigator.share({ text: textToShare }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const currentList = azkarList.filter((item) => item.category === activeCategory);

  return (
    <div className="section-container">
      {/* سرفصل اذکار */}
      <div className="azkar-intro-card">
        <h2 className="azkar-header-title">اذکار و سنن نبوی (حصن المسلم)</h2>
        <p className="azkar-header-sub">
          اذکار صحیح و معتمد از سنت پاک رسول اکرم ﷺ برای حفاظت و صیانت روزانه روح و تن.
        </p>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div className="azkar-tabs-scroll">
        {azkarCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`azkar-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {getCategoryIcon(cat.icon)}
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* لیست اذکار */}
      <div className="azkar-cards-list">
        {currentList.map((item) => {
          const currentCount = counts[item.id] || 0;
          const isCompleted = currentCount >= item.count;
          const isCopied = copiedId === item.id;

          return (
            <div key={item.id} className="azkar-card">
              {/* نشانگر فضیلت و حدیث */}
              <div className="azkar-top-bar">
                <span className="benefit-badge">
                  {item.benefit}
                </span>
                <span className="target-badge">
                  تکرار: {item.count} مرتبه
                </span>
              </div>

              {/* متن عربی با اعراب و فونت زیبا */}
              <div
                className="azkar-arabic-text"
                style={{ fontSize: `${fontSize + 3}px` }}
              >
                {item.arabic}
              </div>

              {/* ترجمه روان فارسی */}
              <div
                className="azkar-persian-text"
                style={{ fontSize: `${fontSize - 1}px` }}
              >
                {item.translation}
              </div>

              {/* نوار پیشرفت و دکمه شمارش */}
              <div className="azkar-counter-row">
                <button
                  onClick={() => handleIncrement(item.id, item.count)}
                  disabled={isCompleted}
                  className={`azkar-count-btn ${isCompleted ? 'completed' : ''}`}
                >
                  {isCompleted ? (
                    <>
                      <CheckIcon className="w-5 h-5 text-emerald-100" />
                      <span>تکمیل شد ({item.count})</span>
                    </>
                  ) : (
                    <>
                      <span>ذکر شد:</span>
                      <strong className="count-number">
                        {currentCount} / {item.count}
                      </strong>
                    </>
                  )}
                </button>

                <div className="azkar-side-actions">
                  {currentCount > 0 && (
                    <button
                      onClick={() => handleReset(item.id)}
                      className="icon-action-btn"
                      title="شروع مجدد شمارش"
                    >
                      <RotateCcwIcon className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleShare(item)}
                    className="icon-action-btn"
                    title="اشتراک‌گذاری ذکر"
                  >
                    {isCopied ? (
                      <CheckIcon className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ShareIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* نوار کوچک پیشرفت گرافیکی */}
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(currentCount / item.count) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
