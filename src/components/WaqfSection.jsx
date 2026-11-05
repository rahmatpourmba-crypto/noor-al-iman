import React from 'react';
import { WaqfIcon, HeartIcon, ShieldIcon, CheckIcon } from './Icons';

export function WaqfSection() {
  return (
    <div className="section-container">
      {/* لوح باقیات و صالحات */}
      <div className="waqf-banner-card">
        <div className="waqf-icon-circle">
          <WaqfIcon className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="waqf-banner-title">وقف عام و باقیات الصالحات</h2>
        <p className="waqf-banner-subtitle">
          «إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ»
          <br />
          <span className="hadith-ref">(صحیح مسلم)</span>
        </p>
      </div>

      {/* لوح هدیه ثواب و دعای خیر */}
      <div className="dedication-card">
        <h3 className="dedication-title">🤲 هدیه ثواب و دعای خیر</h3>
        <p className="dedication-intro">
          این اثر دیجیتال به فضل الهی و بدون کوچک‌ترین چشم‌داشت مادی، صرفاً برای رضایت پروردگار و به عنوان باقیات و صالحات تهیه شده و ثواب آن با تواضع و اخلاص هدیه می‌گردد به:
        </p>

        <ul className="dedication-list">
          <li>
            <span className="bullet-star">✨</span>
            <span>
              <strong>پیامبر اعظم حضرت محمد مصطفی ﷺ</strong>، اهل‌بیت مطهر و یاران باوفای ایشان (رضوان‌الله علیهم اجمعین).
            </span>
          </li>
          <li>
            <span className="bullet-star">✨</span>
            <span>
              <strong>تمام پیامبران و فرستادگان الهی</strong>؛ به‌ویژه حضرت ابراهیم خلیل‌الله و دوست صمیمی پروردگار، حضرت موسی کلیم‌الله، حضرت عیسی مسیح کلمة‌الله و روح‌الله، و حضرت یوسف صدیق و صاحب جمال و حکمت (علیهم‌الصلاة والسلام).
            </span>
          </li>
          <li>
            <span className="bullet-star">✨</span>
            <span>
              <strong>پدران و مادران گرامی</strong> که عمری را در فداکاری و تعلیم کلمه توحید سپری کردند (رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا).
            </span>
          </li>
          <li>
            <span className="bullet-star">✨</span>
            <span>
              <strong>همسر و فرزندان عزیز</strong> برای سلامت، عافیت، ایمان راسخ، سعادت دنیا و آخرت، و محفوظ ماندن از فتنه‌ها و گزندهای زمانه.
            </span>
          </li>
          <li>
            <span className="bullet-star">✨</span>
            <span>
              <strong>تمام امت اسلام</strong>، مردان و زنان مومن در سراسر عالم؛ شفای بیماران، آمرزش درگذشتگان، و نصرت مظلومان.
            </span>
          </li>
        </ul>
      </div>

      {/* منابع و مراجع کتاب‌ها (الزامی برای کافه بازار) */}
      <div className="reference-doc-card">
        <h3 className="card-heading">📚 منابع علمی و متون معتبر برنامه</h3>
        <div className="ref-item">
          <strong>۱. بخش رد شبهات ملحدین:</strong>
          <p>
            برگرفته از مبانی فکری و کتاب‌های متفکر بزرگ جهان اسلام، <strong>استاد محمد قطب رحمه‌الله</strong> (به‌ویژه اثر گران‌سنگ <em>«شبهات حول الإسلام / شبهات پیرامون اسلام»</em> و <em>«مذاهب فکری معاصر»</em>) که به صورت گزیده و پرسش و پاسخ جهت سهولت مطالعه نسل جوان تنظیم گردیده است.
          </p>
        </div>
        <div className="ref-item">
          <strong>۲. بخش اذکار و سنن نبوی:</strong>
          <p>
            مبتنی بر کتاب مشهور جهان اسلام <strong>«حصن المسلم من أذکار الکتاب والسنة»</strong> تألیف شیخ دکتر سعید بن علی بن وهف القحطانی رحمه‌الله با احادیث صحیح بخاری و مسلم و سنن معتبر.
          </p>
        </div>
        <div className="ref-item">
          <strong>۳. اوقات شرعی:</strong>
          <p>
            محاسبه دقیق فرمول‌های نجومی خورشیدی مطابق استانداردهای فقه اهل سنت (تفکیک وقت عصر به فقه حنفی و شافعی).
          </p>
        </div>
      </div>

      {/* منشور شفافیت و سیاست حریم خصوصی کافه بازار */}
      <div className="bazaar-policy-card">
        <h3 className="card-heading">🛡️ خط‌مشی حریم خصوصی و عدم تبلیغات</h3>
        <ul className="policy-checklist">
          <li>
            <CheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span><strong>۱۰۰٪ رایگان و عام‌المنفعه:</strong> فاقد هرگونه پرداخت درون‌برنامه‌ای، هزینه اشتراک یا تبلیغات مزاحم.</span>
          </li>
          <li>
            <CheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span><strong>کاملاً آفلاین:</strong> کارکرد تمام بخش‌ها بدون نیاز به اینترنت برای حفظ حجم و باتری دستگاه.</span>
          </li>
          <li>
            <CheckIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span><strong>احترام کامل به حریم خصوصی:</strong> هیچ‌گونه اطلاعات شخصی یا ردیابی از دستگاه کاربر جمع‌آوری نمی‌شود.</span>
          </li>
        </ul>
      </div>

      <div className="closing-prayer">
        «رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ»
      </div>
    </div>
  );
}
