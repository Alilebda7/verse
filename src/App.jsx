import { useState, useEffect, useRef, useCallback } from "react";
import SurahList from "./components/SurahList";
import SurahDetail from "./components/SurahDetail";
import JuzList from "./components/JuzList";
import LearnSection from "./components/LearnSection";
import LessonPage from "./components/LessonPage";
import ExamPage from "./components/ExamPage";
import PrayerTimes from "./components/PrayerTimes";
import Duas from "./components/Duas";
import MoodGuide from "./components/MoodGuide";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { translations } from "./translations";
import logoIcon from "./images/icon.png";

const IconPrev = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconNext = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconPlay = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const IconPause = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const IconRepeat = ({ mode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0114.13-3.36L23 10"></path>
    <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14"></path>
  </svg>
);

const IconVolume = ({ level }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    {level > 0.66 ? (
      <path d="M19 5a8 8 0 010 14" />
    ) : level > 0.33 ? (
      <path d="M16 7a4 4 0 010 10" />
    ) : null}
  </svg>
);
const IconSheikh = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M12 12c-4 0-6 2-6 4v4h12v-4c0-2-2-4-6-4z"></path>
    <path d="M8 16v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4"></path>
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState("Surah");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [continueReadingData, setContinueReadingData] = useState(null);
  const [lastRead, setLastRead] = useState(() => {
    const saved = localStorage.getItem("lastRead");
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const [reciterDropdownOpen, setReciterDropdownOpen] = useState(false);
  const reciterDropdownRef = useRef(null);
  const [repeatMenuOpen, setRepeatMenuOpen] = useState(false);
  const repeatMenuRef = useRef(null);
  const [reciterOpenUp, setReciterOpenUp] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reciterDropdownRef.current &&
        !reciterDropdownRef.current.contains(event.target)
      ) {
        setReciterDropdownOpen(false);
      }
      if (
        repeatMenuRef.current &&
        !repeatMenuRef.current.contains(event.target)
      ) {
        setRepeatMenuOpen(false);
      }
    };

    if (reciterDropdownOpen || repeatMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [reciterDropdownOpen, repeatMenuOpen]);

  // Global Audio State - ENHANCED
  const [playingAyah, setPlayingAyah] = useState(null);
  const [playingSurahData, setPlayingSurahData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(
    () => parseFloat(localStorage.getItem("playbackSpeed")) || 1,
  );
  const [volume, setVolume] = useState(
    () => parseFloat(localStorage.getItem("volume")) || 1,
  );
  const [repeatMode, setRepeatMode] = useState(
    () => localStorage.getItem("repeatMode") || "none",
  ); // "none", "one", "all"
  const [selectedReciter, setSelectedReciter] = useState(
    () => localStorage.getItem("selectedReciter") || "ar.alafasy",
  );
  const [surahAudioCache, setSurahAudioCache] = useState({});
  const audioRef = useRef(new Audio());

  // Available Reciters
  const reciters = [
    { id: "ar.alafasy", name: "Mishary Alafasy", language: "Arabic" },
    {
      id: "ar.abdulbasitmurattal",
      name: "Abdul Basit (Murattal)",
      language: "Arabic",
    },
    {
      id: "ar.abdurrahmaansudais",
      name: "Abdurrahman As-Sudais",
      language: "Arabic",
    },
    { id: "ar.shaatree", name: "Abu Bakr Ash-Shaatree", language: "Arabic" },
    { id: "ar.husary", name: "Mahmoud Khalil Al-Hussary", language: "Arabic" },
    {
      id: "ar.minshawi",
      name: "Mohamed Siddiq Al-Minshawi",
      language: "Arabic",
    },
  ];

  // Hijri Date State
  const [hijriDate, setHijriDate] = useState("");
  const [ramadanInfo, setRamadanInfo] = useState(null);

  useEffect(() => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const date = new Intl.DateTimeFormat(
      lang === "ar" ? "ar-u-ca-islamic-uma" : "en-u-ca-islamic-uma",
      options,
    ).format(new Date());
    setHijriDate(date);
  }, [lang]);

  useEffect(() => {
    const today = new Date();
    // 2026 Approximate Dates
    const ramadanStart = new Date(2026, 1, 18); // Feb 18
    const ramadanEnd = new Date(2026, 2, 19); // Mar 19

    const diffStart = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));
    const diffEnd = Math.ceil((ramadanEnd - today) / (1000 * 60 * 60 * 24));

    if (diffStart > 1) {
      setRamadanInfo({ type: "until", days: diffStart });
    } else if (diffStart === 0 || diffStart === 1) {
      // Very close or first day
      setRamadanInfo({ type: "here", days: 0 });
    } else if (diffEnd > 0) {
      setRamadanInfo({ type: "left", days: diffEnd });
    } else {
      setRamadanInfo(null);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoadStart = () => setIsAudioLoading(true);
    const onCanPlay = () => setIsAudioLoading(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  // Save audio preferences to localStorage
  useEffect(() => {
    localStorage.setItem("playbackSpeed", playbackSpeed);
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    localStorage.setItem("volume", volume);
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("repeatMode", repeatMode);
  }, [repeatMode]);

  useEffect(() => {
    localStorage.setItem("selectedReciter", selectedReciter);
  }, [selectedReciter]);

  const handleSurahClick = (surahNumber, jumpData = null) => {
    setSelectedSurah(surahNumber);
    setContinueReadingData(jumpData);
  };

  const handleBackToSurahs = () => {
    setSelectedSurah(null);
    setContinueReadingData(null);
  };

  const saveLastRead = useCallback((surah, ayahNum, page) => {
    const data = {
      surahNumber: surah.number,
      surahName: surah.englishName,
      ayahNumber: ayahNum,
      page: page,
      timestamp: Date.now(),
    };
    setLastRead(data);
    localStorage.setItem("lastRead", JSON.stringify(data));
  }, []);

  const playAyah = useCallback(
    (ayah, surahData) => {
      setPlayingAyah(ayah);
      setPlayingSurahData(surahData);

      const cachedSurah = surahAudioCache[surahData.number];
      const ayahAudioUrl = cachedSurah ? cachedSurah[ayah.numberInSurah] : null;

      if (ayahAudioUrl) {
        audioRef.current.src = ayahAudioUrl;
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().catch((e) => console.error(e));
        return;
      }

      setIsAudioLoading(true);
      fetch(
        `https://api.alquran.cloud/v1/surah/${surahData.number}/${selectedReciter}`,
      )
        .then((res) => res.json())
        .then((data) => {
          const audioMap = {};
          data.data.ayahs.forEach((a) => {
            audioMap[a.numberInSurah] = a.audio;
          });
          setSurahAudioCache((prev) => ({
            ...prev,
            [surahData.number]: audioMap,
          }));
          const url = audioMap[ayah.numberInSurah];
          if (url) {
            audioRef.current.src = url;
            audioRef.current.playbackRate = playbackSpeed;
            audioRef.current.play().catch((e) => console.error(e));
          }
          // Ensure we have ayahs for next/prev
          if (!surahData.ayahs) {
            setPlayingSurahData({ ...surahData, ayahs: data.data.ayahs });
          }
          setIsAudioLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setIsAudioLoading(false);
        });
    },
    [selectedReciter, surahAudioCache, playbackSpeed],
  );

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch((e) => console.error(e));
  };

  const playNextAyah = useCallback(() => {
    if (!playingAyah || !playingSurahData || !playingSurahData.ayahs) return;
    const nextNum = playingAyah.numberInSurah + 1;
    const nextAyah = playingSurahData.ayahs.find(
      (a) => a.numberInSurah === nextNum,
    );
    if (nextAyah) {
      playAyah(nextAyah, playingSurahData);
    } else {
      if (repeatMode === "all") {
        playAyah(playingSurahData.ayahs[0], playingSurahData);
      } else {
        setIsPlaying(false);
        setPlayingAyah(null);
      }
    }
  }, [playingAyah, playingSurahData, playAyah, repeatMode]);

  const playPrevAyah = () => {
    if (!playingAyah || !playingSurahData || !playingSurahData.ayahs) return;
    const prevNum = playingAyah.numberInSurah - 1;
    const prevAyah = playingSurahData.ayahs.find(
      (a) => a.numberInSurah === prevNum,
    );
    if (prevAyah) {
      playAyah(prevAyah, playingSurahData);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch((e) => console.error(e));
      } else {
        playNextAyah();
      }
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [repeatMode, playNextAyah]);

  // Render the audio Player Bar
  const renderAudioBar = (location = "fixed") => {
    if (!playingAyah || !playingSurahData) return null;

    const barClass =
      location === "hero" ? "audio-player-hero" : "audio-player-fixed";
    if (location === "hero") {
      // Show hero layout only if we are on the main landing
      if (selectedSurah) return null;
    }

    // Toggle repeat mode
    const toggleRepeat = () => {
      setRepeatMode((prev) => {
        if (prev === "none") return "all";
        if (prev === "all") return "one";
        return "none";
      });
    };

    return (
      <div className={`${barClass} glass-panel`}>
        <div className="player-track-info">
          <div className="player-cover-art">
            <span style={{ fontSize: 20 }}>📖</span>
          </div>
          <div>
            <div className="player-track-title">
              {lang === "ar"
                ? playingSurahData.name
                : playingSurahData.englishName}
            </div>
            <div className="player-track-artist">
              {t.surah_ayah} {playingAyah.numberInSurah} •{" "}
              {reciters.find((r) => r.id === selectedReciter)?.name}
            </div>
          </div>
        </div>

        <div className="player-controls-center">
          <div className="player-buttons">
            <button className="ctrl-btn sm" onClick={toggleRepeat}>
              <IconRepeat mode={repeatMode} />
              {repeatMode !== "none" && (
                <span className="repeat-dot">
                  {repeatMode === "one" ? "1" : "∞"}
                </span>
              )}
            </button>
            <button className="ctrl-btn" onClick={playPrevAyah}>
              <IconPrev />
            </button>
            <button className="play-pause-btn" onClick={togglePlay}>
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button className="ctrl-btn" onClick={playNextAyah}>
              <IconNext />
            </button>
            <div className="speed-control">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="speed-select"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>
          </div>
        </div>

        <div className="player-controls-right">
          <div className="reciter-selector">
            <IconSheikh />
            <select
              value={selectedReciter}
              onChange={(e) => setSelectedReciter(e.target.value)}
              className="reciter-select"
            >
              {reciters.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="volume-control">
            <IconVolume level={volume} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    );
  };

  // MAIN RENDER
  return (
    <Routes>
      <Route path="/lesson/:id" element={<LessonPage />} />
      <Route path="/exam/:id" element={<ExamPage />} />
      <Route
        path="*"
        element={
          <div className="container">
            {!selectedSurah ? (
              <>
                <div className="header-container">
                  <header className="header">
                    <div className="logo-box">
                      <img
                        src={logoIcon}
                        alt="Verse Logo"
                        className="logo-img"
                      />
                      <span className="logo-text">Verse</span>
                    </div>
                    <nav>
                      <ul>
                        <li>
                          <a href="#" className="active">
                            {t.nav_home}
                          </a>
                        </li>
                        <li>
                          <button
                            className="nav-link-btn"
                            onClick={() => {
                              document
                                .getElementById("quran")
                                ?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            {t.nav_quran}
                          </button>
                        </li>
                        <li>
                          <a href="#features">{t.nav_features}</a>
                        </li>
                        <li>
                          <a href="#developers">{t.nav_developers}</a>
                        </li>
                        <li>
                          <button
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            aria-label="Toggle Theme"
                            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
                          >
                            {theme === "light" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line
                                  x1="4.22"
                                  y1="4.22"
                                  x2="5.64"
                                  y2="5.64"
                                ></line>
                                <line
                                  x1="18.36"
                                  y1="18.36"
                                  x2="19.78"
                                  y2="19.78"
                                ></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line
                                  x1="4.22"
                                  y1="19.78"
                                  x2="5.64"
                                  y2="18.36"
                                ></line>
                                <line
                                  x1="18.36"
                                  y1="5.64"
                                  x2="19.78"
                                  y2="4.22"
                                ></line>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                              </svg>
                            )}
                          </button>
                        </li>
                        <li>
                          <div className="language-selector">
                            <button
                              onClick={() => setLang("en")}
                              className={`lang-btn ${lang === "en" ? "active" : ""}`}
                            >
                              EN
                            </button>
                            <span className="lang-divider">|</span>
                            <button
                              onClick={() => setLang("ar")}
                              className={`lang-btn ${lang === "ar" ? "active" : ""}`}
                            >
                              العربية
                            </button>
                          </div>
                        </li>
                      </ul>
                    </nav>
                  </header>

                  <div className="hero-title-box">
                    <div className="hero-top-row">
                      <div className="hijri-badge">
                        <div className="hijri-text-group">
                          <span className="hijri-label">{t.hijri_date}</span>
                          <span className="hijri-value">{hijriDate}</span>
                        </div>
                      </div>

                      {ramadanInfo && (
                        <div className="ramadan-badge">
                          <div className="ramadan-icon">🌙</div>
                          <div className="ramadan-text-group">
                            <span className="ramadan-label">
                              {ramadanInfo.type === "until"
                                ? t.ramadan_days_until
                                : ramadanInfo.type === "left"
                                  ? t.ramadan_days_left
                                  : t.ramadan_is_here}
                            </span>
                            {ramadanInfo.type !== "here" && (
                              <span className="ramadan-value">
                                {ramadanInfo.days}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <span className="hero-badge">{t.hero_badge}</span>
                    </div>

                    <div className="hero-main-content">
                      <div className="hero-left-col">
                        <h1>{t.hero_title}</h1>
                        {renderAudioBar("hero")}
                      </div>
                      <div className="hero-right-col">
                        <p className="hero-desc">{t.hero_desc}</p>
                        <div className="hero-pills-row">
                          <button
                            className="hero-pill"
                            onClick={() => handleSurahClick(18)}
                            title={t.surah_al_kahf}
                          >
                            {t.surah_al_kahf}
                          </button>
                          <button
                            className="hero-pill"
                            onClick={() => handleSurahClick(36)}
                            title={t.surah_ya_sin}
                          >
                            {t.surah_ya_sin}
                          </button>
                          <button
                            className="hero-pill"
                            onClick={() => handleSurahClick(19)}
                            title={t.surah_maryam}
                          >
                            {t.surah_maryam}
                          </button>
                          <button
                            className="hero-pill"
                            onClick={() => handleSurahClick(114)}
                            title={t.surah_an_naas}
                          >
                            {t.surah_an_naas}
                          </button>
                        </div>
                        <div style={{ marginTop: 16 }} id="prayer-times">
                          <PrayerTimes lang={lang} t={t} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quran-section" id="quran">
                  <div className="section-intro">
                    <h2>{t.section_explore}</h2>
                    <div className="tab-row">
                      <div className="tab-container">
                        <button
                          className={`tab-btn ${activeTab === "Surah" ? "active" : ""}`}
                          onClick={() => setActiveTab("Surah")}
                        >
                          {t.tab_surah}
                        </button>
                        <button
                          className={`tab-btn ${activeTab === "Juz" ? "active" : ""}`}
                          onClick={() => setActiveTab("Juz")}
                        >
                          {t.tab_juz}
                        </button>
                        <button
                          className={`tab-btn ${activeTab === "Revelation" ? "active" : ""}`}
                          onClick={() => setActiveTab("Revelation")}
                        >
                          {t.tab_revelation}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid-header">
                    <span className="sort-text">{t.sort_asc}</span>
                  </div>

                  {activeTab === "Surah" ? (
                    <SurahList
                      onSurahClick={handleSurahClick}
                      lang={lang}
                      t={t}
                    />
                  ) : activeTab === "Juz" ? (
                    <JuzList
                      onSurahClick={handleSurahClick}
                      lang={lang}
                      t={t}
                    />
                  ) : (
                    <SurahList
                      onSurahClick={handleSurahClick}
                      order="revelation"
                      lang={lang}
                      t={t}
                    />
                  )}

                  {/* Learn section: interactive educational cards */}
                  <LearnSection lang={lang} />
                  {/* Mood Guide section: interactive mood-based recommendations */}
                  <MoodGuide
                    lang={lang}
                    onJump={(s, a) =>
                      handleSurahClick(s, { surahNumber: s, ayahNumber: a })
                    }
                  />
                  <Duas lang={lang} />
                </div>
              </>
            ) : (
              <SurahDetail
                surahNumber={selectedSurah}
                onBack={handleBackToSurahs}
                playingAyah={playingAyah}
                isPlaying={isPlaying}
                playAyah={playAyah}
                continueReadingData={continueReadingData}
                onAyahView={saveLastRead}
                lang={lang}
              />
            )}
            <Footer lang={lang} t={t} />
            {renderAudioBar("global")}
          </div>
        }
      />
    </Routes>
  );
}

export default App;
