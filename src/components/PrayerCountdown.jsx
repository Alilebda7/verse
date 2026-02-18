import { useState, useEffect } from "react";
import "../styles/PrayerCountdown.css";

export default function PrayerCountdown({ lang = "en" }) {
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [city, setCity] = useState("Mecca");

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        // Simple location detection for the countdown
        const geoRes = await fetch("https://ipapi.co/json/");
        const geoData = await geoRes.json();
        const c = geoData.city || "Mecca";
        const co = geoData.country_name || "Saudi Arabia";
        setCity(c);

        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(c)}&country=${encodeURIComponent(co)}&method=4`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.data && data.data.timings) {
          processNextPrayer(data.data.timings);
        }
      } catch (e) {
        console.error("Prayer countdown fetch failed", e);
      }
    };

    fetchTimes();
    const interval = setInterval(fetchTimes, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const processNextPrayer = (timings) => {
    const now = new Date();
    const prayers = [
      { name: "Fajr", time: timings.Fajr },
      { name: "Dhuhr", time: timings.Dhuhr },
      { name: "Asr", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isha", time: timings.Isha },
    ];

    let found = null;
    for (const p of prayers) {
      const [h, m] = p.time.split(":");
      const pDate = new Date();
      pDate.setHours(parseInt(h), parseInt(m), 0);

      if (pDate > now) {
        found = { ...p, date: pDate };
        break;
      }
    }

    // If all passed, next is Fajr tomorrow
    if (!found) {
      const [h, m] = prayers[0].time.split(":");
      const pDate = new Date();
      pDate.setDate(pDate.getDate() + 1);
      pDate.setHours(parseInt(h), parseInt(m), 0);
      found = { ...prayers[0], date: pDate };
    }

    setNextPrayer(found);
  };

  useEffect(() => {
    if (!nextPrayer) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextPrayer.date - now;

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer]);

  if (!nextPrayer) return null;

  return (
    <div className="prayer-countdown-bar glass-panel">
      <div className="countdown-content">
        <div className="next-tag">
          <span className="dot pulse"></span>
          {lang === "ar" ? "الصلاة القادمة" : "Next Prayer"}:{" "}
          <strong>{nextPrayer.name}</strong>
        </div>
        <div className="countdown-timer">{timeLeft}</div>
        <div className="location-tag">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {city}
        </div>
      </div>
    </div>
  );
}
