import { useState, useEffect, useRef } from "react";
import "../styles/PrayerTimes.css";

const DEFAULT = { city: "Mecca", country: "Saudi Arabia" };

export default function PrayerTimes({ lang = "en", t }) {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(DEFAULT.city);
  const [country, setCountry] = useState(DEFAULT.country);
  const [hijri, setHijri] = useState(null);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [now, setNow] = useState(new Date());
  const [use12Hour, setUse12Hour] = useState(true);

  // If no translations provided, use fallback
  const T = t || {
    prayer_title: "Prayer Times",
    prayer_loading: "Loading prayer times...",
    prayer_error: "Error:",
    btn_retry: "Retry Location",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    sunrise: "Sunrise",
  };
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    getLocationAndTimings();
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => {
      mounted.current = false;
      clearInterval(t);
    };
  }, []);

  async function getLocationAndTimings() {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      await fetchTimingsByCity(DEFAULT.city, DEFAULT.country);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
            { headers: { "User-Agent": "VerseApp/1.0 (contact@example.com)" } },
          );
          const json = await r.json();
          const addr = json.address || {};
          const detectedCity =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.county ||
            DEFAULT.city;
          const detectedCountry = addr.country || DEFAULT.country;
          if (mounted.current) {
            setCity(detectedCity);
            setCountry(detectedCountry);
            if (json && json.timezone) setTimezone(json.timezone);
          }

          await fetchTimingsByCoords(lat, lon);
        } catch (e) {
          try {
            await fetchTimingsByCoords(lat, lon);
          } catch (err) {
            if (mounted.current) {
              setError(err.message || "Failed fetching timings");
            }
          }
        }
      },
      async () => {
        await fetchTimingsByCity(DEFAULT.city, DEFAULT.country);
      },
      { maximumAge: 1000 * 60 * 60, timeout: 10000, enableHighAccuracy: false },
    );
  }

  async function fetchTimingsByCoords(lat, lon) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=4`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Failed to fetch prayer times");
    const data = await resp.json();
    if (mounted.current) {
      setPrayerTimes(data.data.timings || null);
      setHijri(
        data.data.date && data.data.date.hijri ? data.data.date.hijri : null,
      );
      if (data.data.meta && data.data.meta.timezone)
        setTimezone(data.data.meta.timezone);
      setLoading(false);
    }
  }

  async function fetchTimingsByCity(c, co) {
    try {
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(c)}&country=${encodeURIComponent(co)}&method=4`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to fetch prayer times");
      const data = await resp.json();
      if (mounted.current) {
        setPrayerTimes(data.data.timings || null);
        setHijri(
          data.data.date && data.data.date.hijri ? data.data.date.hijri : null,
        );
        if (data.data.meta && data.data.meta.timezone)
          setTimezone(data.data.meta.timezone);
        setLoading(false);
      }
    } catch (e) {
      if (mounted.current) {
        setError(e.message || "Failed to fetch prayer times");
        setLoading(false);
      }
    }
  }

  const handleRetryLocation = () => {
    getLocationAndTimings();
  };

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: use12Hour,
  };

  // Helper to format 12H with Arabic AM/PM support
  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    const cleanTime = timeStr.replace(/\s*\(.*?\)\s*/g, "");
    const [hours, minutes] = cleanTime.split(":");

    if (use12Hour) {
      let h = parseInt(hours, 10);
      const isPm = h >= 12;
      h = h % 12;
      h = h ? h : 12;

      const ampm = lang === "ar" ? (isPm ? "م" : "ص") : isPm ? "PM" : "AM";
      return `${h}:${minutes} ${ampm}`;
    }
    return `${hours}:${minutes}`;
  };

  if (loading)
    return (
      <div className="prayer-times-widget loading">
        <h3>{T.prayer_title}</h3>
        <div style={{ marginTop: 12, color: "var(--text-muted)" }}>
          {T.prayer_loading}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="prayer-times-widget error">
        <h3>{T.prayer_title || "Prayer Times"}</h3>
        <div style={{ color: "#e06a6a", margin: "10px 0" }}>
          {T.prayer_error} {error}
        </div>
        <button className="btn-retry" onClick={handleRetryLocation}>
          {T.btn_retry}
        </button>
      </div>
    );

  return (
    <div className="prayer-times-widget">
      <div className="prayer-header">
        <div className="prayer-location">
          <h3>{T.prayer_title || "Prayer Times"}</h3>
          <div className="prayer-location-sub">
            {city}, {country}
          </div>
        </div>
        <div
          className="prayer-current-time"
          style={{ alignItems: lang === "ar" ? "flex-start" : "flex-end" }}
        >
          <div
            className="time-row"
            style={{ flexDirection: lang === "ar" ? "row-reverse" : "row" }}
          >
            <div className="current-time-text">
              {now.toLocaleTimeString(lang, timeOptions)}
            </div>
            <button
              className="format-toggle"
              title={use12Hour ? "Switch to 24-hour" : "Switch to 12-hour"}
              onClick={() => setUse12Hour((s) => !s)}
            >
              {use12Hour ? "24H" : "12H"}
            </button>
          </div>
          <div className="hijri-date">
            {hijri ? `${hijri.day} ${hijri.month.en} ${hijri.year} AH` : "—"}
          </div>
        </div>
      </div>

      <div className="prayer-grid">
        {prayerTimes && (
          <>
            <div className="prayer-card">
              <div className="prayer-name">{T.fajr || "Fajr"}</div>
              <div className="prayer-time">{formatTime(prayerTimes.Fajr)}</div>
            </div>
            <div className="prayer-card">
              <div className="prayer-name">{T.dhuhr || "Dhuhr"}</div>
              <div className="prayer-time">{formatTime(prayerTimes.Dhuhr)}</div>
            </div>
            <div className="prayer-card">
              <div className="prayer-name">{T.asr || "Asr"}</div>
              <div className="prayer-time">{formatTime(prayerTimes.Asr)}</div>
            </div>
            <div className="prayer-card">
              <div className="prayer-name">{T.maghrib || "Maghrib"}</div>
              <div className="prayer-time">
                {formatTime(prayerTimes.Maghrib)}
              </div>
            </div>
            <div className="prayer-card">
              <div className="prayer-name">{T.isha || "Isha"}</div>
              <div className="prayer-time">{formatTime(prayerTimes.Isha)}</div>
            </div>
            <div className="prayer-card">
              <div className="prayer-name">{T.sunrise || "Sunrise"}</div>
              <div className="prayer-time">
                {formatTime(prayerTimes.Sunrise)}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="prayer-controls">
        <button className="btn-retry" onClick={handleRetryLocation}>
          Update/Retry
        </button>
        <button
          className="btn-calendar"
          onClick={() => {
            setCity(DEFAULT.city);
            setCountry(DEFAULT.country);
            fetchTimingsByCity(DEFAULT.city, DEFAULT.country);
          }}
        >
          Use Default ({DEFAULT.city})
        </button>
      </div>
    </div>
  );
}
