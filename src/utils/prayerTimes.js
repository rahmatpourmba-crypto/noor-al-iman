// موتور محاسبه آفلاین اوقات شرعی اهل سنت (فقه حنفی و شافعی)
// بر اساس فرمول‌های نجومی استاندارد بین‌المللی

export const CITIES = [
  { name: 'زاهدان', lat: 29.4963, lng: 60.8629, province: 'سیستان و بلوچستان' },
  { name: 'سنندج', lat: 35.3219, lng: 46.9862, province: 'کردستان' },
  { name: 'گرگان', lat: 36.8427, lng: 54.4439, province: 'گلستان' },
  { name: 'گنبد کاووس', lat: 37.2500, lng: 55.1672, province: 'گلستان' },
  { name: 'چابهار', lat: 25.2919, lng: 60.6430, province: 'سیستان و بلوچستان' },
  { name: 'بندرعباس', lat: 27.1832, lng: 56.2666, province: 'هرمزگان' },
  { name: 'سقز', lat: 36.2499, lng: 46.2734, province: 'کردستان' },
  { name: 'مهاباد', lat: 36.7631, lng: 45.7222, province: 'آذربایجان غربی' },
  { name: 'تایباد', lat: 34.7400, lng: 60.7756, province: 'خراسان رضوی' },
  { name: 'خواف', lat: 34.5778, lng: 60.1417, province: 'خراسان رضوی' },
  { name: 'ایرانشهر', lat: 27.2025, lng: 60.6848, province: 'سیستان و بلوچستان' },
  { name: 'بانه', lat: 35.9975, lng: 45.8853, province: 'کردستان' },
  { name: 'ارومیه', lat: 37.5527, lng: 45.0761, province: 'آذربایجان غربی' },
  { name: 'تهران', lat: 35.6892, lng: 51.3890, province: 'تهران' },
  { name: 'مشهد', lat: 36.2972, lng: 59.6067, province: 'خراسان رضوی' },
  { name: 'شیراز', lat: 29.5918, lng: 52.5837, province: 'فارس' },
  { name: 'اصفهان', lat: 32.6546, lng: 51.6680, province: 'اصفهان' },
  { name: 'تبریز', lat: 38.0800, lng: 46.2919, province: 'آذربایجان شرقی' },
];

function degToRad(deg) {
  return (deg * Math.PI) / 180.0;
}

function radToDeg(rad) {
  return (rad * 180.0) / Math.PI;
}

function fixHour(h) {
  let a = h - 24.0 * Math.floor(h / 24.0);
  return a < 0 ? a + 24.0 : a;
}

// محاسبه زمان‌های خورشیدی در یک روز خاص
export function calculatePrayerTimes(lat, lng, date = new Date(), fiqh = 'hanafi') {
  const timeZone = 3.5; // ایران (UTC+3.5)

  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // میل خورشید و معادله زمان
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const eqTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); // بر حسب دقیقه
  const declination = 23.45 * Math.sin(degToRad((360 / 365) * (dayOfYear - 81))); // درجه

  // ظهر شرعی (Dhuhr)
  const solarNoon = 12 + timeZone - lng / 15.0 - eqTime / 60.0;

  // محاسبه زاویه ساعت خورشیدی برای زاویه ارتفاع معین
  function hourAngle(alpha) {
    const latRad = degToRad(lat);
    const decRad = degToRad(declination);
    const alphaRad = degToRad(alpha);
    const cosHA =
      (Math.sin(alphaRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1 || cosHA < -1) return 0; // شرایط قطبی
    return radToDeg(Math.acos(cosHA)) / 15.0;
  }

  // فجر صادق (۱۸ درجه زیر افق مطابق استاندارد جهان اسلام)
  const fajrHA = hourAngle(-18.0);
  const fajrTime = solarNoon - fajrHA;

  // طلوع آفتاب (-۰.۸۳۳ درجه برای شکست نور)
  const sunriseHA = hourAngle(-0.833);
  const sunriseTime = solarNoon - sunriseHA;

  // غروب آفتاب
  const sunsetTime = solarNoon + sunriseHA;

  // نماز مغرب (دقایقی پس از ناپدید شدن قرص خورشید)
  const maghribTime = sunsetTime + 2 / 60.0;

  // نماز عشاء (۱۷ درجه زیر افق)
  const ishaHA = hourAngle(-17.0);
  const ishaTime = solarNoon + ishaHA;

  // نماز عصر (محاسبه بر اساس سایه شاخص)
  // شافعی: سایه = ۱ برابر طول شاخص + سایه ظهر
  // حنفی: سایه = ۲ برابر طول شاخص + سایه ظهر
  const shadowMultiplier = fiqh === 'hanafi' ? 2 : 1;
  const noonShadowAngle = Math.abs(lat - declination);
  const asrAltitude = radToDeg(
    Math.atan(1 / (shadowMultiplier + Math.tan(degToRad(noonShadowAngle))))
  );
  const asrHA = hourAngle(asrAltitude);
  const asrTime = solarNoon + asrHA;

  function formatTime(decimalHour) {
    const h = fixHour(decimalHour);
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  return {
    fajr: formatTime(fajrTime),
    sunrise: formatTime(sunriseTime),
    dhuhr: formatTime(solarNoon),
    asr: formatTime(asrTime),
    maghrib: formatTime(maghribTime),
    isha: formatTime(ishaTime),
    fiqhUsed: fiqh === 'hanafi' ? 'فقه حنفی (عصر با سایه ۲ برابر)' : 'فقه شافعی / جمهور (عصر با سایه ۱ برابر)'
  };
}
