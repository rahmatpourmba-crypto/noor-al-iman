import React, { useState, useMemo, useEffect } from 'react';
import { shubuhatCategories, shubuhatList } from '../data/shubuhatData';
import {
  SearchIcon,
  BookmarkIcon,
  ShareIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  BrainIcon
} from './Icons';

export function ShubuhatSection({ fontSize }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(1); // باز بودن اولین کارت به صورت پیش‌فرض
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('noor_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('noor_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((bId) => bId !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const handleShare = (item, e) => {
    e.stopPropagation();
    const textToShare = `💡 پرسش: ${item.question}\n\n📖 پاسخ (برگرفته از کتاب «شبهات حول الإسلام» اثر متفکر اسلامی استاد محمد قطب رحمه‌الله):\n${item.answer}\n\n📌 منبع: ${item.reference}\n✨ نشر به عنوان صدقه جاریه - اپلیکیشن نور الایمان`;
    
    if (navigator.share) {
      navigator.share({
        title: item.question,
        text: textToShare,
      }).catch(() => {});
    } else {
      handleCopy(item, e);
    }
  };

  const handleCopy = (item, e) => {
    e.stopPropagation();
    const textToShare = `💡 پرسش: ${item.question}\n\n📖 پاسخ (برگرفته از کتاب «شبهات حول الإسلام» اثر متفکر اسلامی استاد محمد قطب رحمه‌الله):\n${item.answer}\n\n📌 منبع: ${item.reference}\n✨ نرم‌افزار نور الایمان`;
    navigator.clipboard.writeText(textToShare);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredList = useMemo(() => {
    return shubuhatList.filter((item) => {
      if (showOnlyBookmarks && !bookmarks.includes(item.id)) {
        return false;
      }
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchQ = item.question.toLowerCase().includes(q);
        const matchA = item.answer.toLowerCase().includes(q);
        const matchC = item.categoryName.toLowerCase().includes(q);
        return matchQ || matchA || matchC;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, bookmarks, showOnlyBookmarks]);

  return (
    <div className="section-container">
      {/* بنر معرفی کتاب محمد قطب */}
      <div className="author-intro-card">
        <div className="author-icon-box">
          <BrainIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="author-text">
          <h2 className="author-title">پاسخ به شبهات ملحدین و مادی‌گرایان</h2>
          <p className="author-desc">
            برگرفته و تلخیص‌شده از کتاب سترگ <strong>«شبهات حول الإسلام»</strong> اثر متفکر بزرگ جهان اسلام، <strong>استاد محمد قطب رحمه‌الله</strong> به‌صورت پرسش و پاسخ روان.
          </p>
        </div>
      </div>

      {/* نوار جستجو و فیلتر علاقه‌مندی‌ها */}
      <div className="search-bar-row">
        <div className="search-input-wrapper">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="جستجوی شبهه (مثلاً: ارث، زن، علم، شمشیر، دین)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
          className={`bookmark-filter-btn ${showOnlyBookmarks ? 'active' : ''}`}
          title="نمایش ذخیره‌شده‌ها"
        >
          <BookmarkIcon
            className="w-5 h-5"
            fill={showOnlyBookmarks ? 'currentColor' : 'none'}
          />
          <span className="bookmark-count">{bookmarks.length}</span>
        </button>
      </div>

      {/* نوار دسته‌بندی موضوعی */}
      <div className="category-scroll">
        {shubuhatCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setShowOnlyBookmarks(false);
            }}
            className={`category-pill ${selectedCategory === cat.id && !showOnlyBookmarks ? 'active' : ''}`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* تعداد نتایج */}
      <div className="results-count">
        نمایش {filteredList.length} پرسش و پاسخ
      </div>

      {/* لیست پرسش‌ها و پاسخ‌ها */}
      <div className="qna-list">
        {filteredList.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">موردی مطابق با جستجوی شما یافت نشد.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowOnlyBookmarks(false);
              }}
              className="reset-filter-btn"
            >
              نمایش همه پرسش‌ها
            </button>
          </div>
        ) : (
          filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            const isBookmarked = bookmarks.includes(item.id);
            const isCopied = copiedId === item.id;

            return (
              <article
                key={item.id}
                className={`qna-card ${isExpanded ? 'expanded' : ''}`}
                style={{ fontSize: `${fontSize}px` }}
              >
                <div
                  className="qna-header"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="qna-header-main">
                    <span className="qna-badge">{item.categoryName}</span>
                    <h3 className="qna-question">{item.question}</h3>
                    {!isExpanded && <p className="qna-summary">{item.summary}</p>}
                  </div>

                  <div className="qna-expand-icon">
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="qna-body">
                    <div className="qna-answer-text">
                      {item.answer.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="qna-paragraph">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    <div className="qna-reference-box">
                      <span className="ref-label">مستندات و ارجاع:</span>
                      <span className="ref-text">{item.reference}</span>
                    </div>

                    {/* دکمه‌های اقدام زیر کارت */}
                    <div className="qna-actions">
                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                        title={isBookmarked ? 'حذف از نشان‌شده‌ها' : 'نشان کردن'}
                      >
                        <BookmarkIcon
                          className="w-4 h-4"
                          fill={isBookmarked ? 'currentColor' : 'none'}
                        />
                        <span>{isBookmarked ? 'نشان شده' : 'نشان کردن'}</span>
                      </button>

                      <button
                        onClick={(e) => handleCopy(item, e)}
                        className="action-btn"
                        title="رونویسی متن"
                      >
                        {isCopied ? (
                          <>
                            <CheckIcon className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-500 font-bold">کپی شد</span>
                          </>
                        ) : (
                          <>
                            <CopyIcon className="w-4 h-4" />
                            <span>کپی متن</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="action-btn share-btn"
                        title="اشتراک‌گذاری به عنوان صدقه جاریه"
                      >
                        <ShareIcon className="w-4 h-4" />
                        <span>اشتراک‌گذاری</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
