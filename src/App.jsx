import { useState, useEffect, useRef, useCallback } from "react";
import SurahList from "./components/SurahList";
import NamesOfAllah from "./components/NamesOfAllah";
import SurahDetail from "./components/SurahDetail";
import JuzList from "./components/JuzList";
import LearnSection from "./components/LearnSection";
import LessonPage from "./components/LessonPage";
import ExamPage from "./components/ExamPage";
import PrayerTimes from "./components/PrayerTimes";
import PrayerCountdown from "./components/PrayerCountdown";
import Duas from "./components/Duas";
import SeerahTimeline from "./components/SeerahTimeline";
import MoodGuide from "./components/MoodGuide";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { translations } from "./translations";
import logoIcon from "./images/icon.png";
import { db, auth, googleProvider, twitterProvider } from "./firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Surah");
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [continueReadingData, setContinueReadingData] = useState(null);
  const [lastRead, setLastRead] = useState(() => {
    try {
      const saved = localStorage.getItem("lastRead");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse lastRead from localStorage", e);
      return null;
    }
  });
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quran_bookmarks") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [showContinuePopup, setShowContinuePopup] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [bookmarkToast, setBookmarkToast] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (lastRead && !selectedSurah) {
      const timer = setTimeout(() => setShowContinuePopup(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [lastRead, selectedSurah]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");
  const t = translations[lang] || translations["en"];

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
      // Increased threshold to ensure hero audio bar is fully out of view
      setIsScrolled(window.scrollY > 700);
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

  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup" | "reset"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Sync user to Firestore
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userRef,
          {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            lastLogin: Date.now(),
          },
          { merge: true },
        );

        // Fetch user preferences/stats
        const statsRef = doc(db, "user_stats", currentUser.uid);
        const statsSnap = await getDoc(statsRef);
        if (statsSnap.exists()) {
          const data = statsSnap.data();
          if (data.lastRead) {
            setLastRead(data.lastRead);
            localStorage.setItem("lastRead", JSON.stringify(data.lastRead));
          }
          if (data.bookmarks) {
            setBookmarks(data.bookmarks);
            localStorage.setItem(
              "quran_bookmarks",
              JSON.stringify(data.bookmarks),
            );
          }
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleTwitterSignIn = async () => {
    try {
      await signInWithPopup(auth, twitterProvider);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Twitter sign in failed:", error);
      setAuthError("Twitter sign-in failed. Please try again.");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
    } catch (err) {
      setAuthError(
        err.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : err.message,
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        authEmail,
        authPassword,
      );
      if (authName) await updateProfile(cred.user, { displayName: authName });
      setShowAuthModal(false);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
    } catch (err) {
      setAuthError(
        err.code === "auth/email-already-in-use"
          ? "Email already in use."
          : err.message,
      );
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, authEmail);
      setAuthError("✅ Reset email sent! Check your inbox.");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  const nextAudioRef = useRef(new Audio()); // Second buffer for dual-buffering
  const blobPoolRef = useRef({}); // Stores { remoteUrl: localBlobUrl }
  const activeBufferRef = useRef(1); // 1 or 2

  // Cleanup Blobs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(blobPoolRef.current).forEach((url) =>
        URL.revokeObjectURL(url),
      );
    };
  }, []);

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
  const [ramadanTimings, setRamadanTimings] = useState(null);
  const [iftarCountdown, setIftarCountdown] = useState("");

  useEffect(() => {
    // Fetch timings for Ramadan badge if it's Ramadan
    const fetchTimingsForRamadan = async () => {
      try {
        const city = "Mecca"; // Default for badge if no geolocation
        const country = "Saudi Arabia";
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.data && data.data.timings) {
          setRamadanTimings({
            suhoor: data.data.timings.Fajr,
            iftar: data.data.timings.Maghrib,
          });
        }
      } catch (e) {
        console.error("Failed to fetch Ramadan timings", e);
      }
    };

    if (
      ramadanInfo &&
      (ramadanInfo.type === "here" || ramadanInfo.type === "left")
    ) {
      fetchTimingsForRamadan();
    }
  }, [ramadanInfo]);

  useEffect(() => {
    // Update Iftar Countdown every second
    if (!ramadanTimings || !ramadanInfo || ramadanInfo.type === "until") return;

    const timer = setInterval(() => {
      const now = new Date();
      const [h, m] = ramadanTimings.iftar.split(":");
      const iftarTime = new Date();
      iftarTime.setHours(parseInt(h), parseInt(m), 0);

      const diff = iftarTime - now;
      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setIftarCountdown(`${hours}h ${mins}m ${secs}s`);
      } else {
        setIftarCountdown("");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [ramadanTimings, ramadanInfo]);

  useEffect(() => {
    try {
      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      // Use islamic-umalqura as it's more widely supported than islamic-uma
      const calendar =
        lang === "ar" ? "ar-u-ca-islamic-umalqura" : "en-u-ca-islamic-umalqura";
      const date = new Intl.DateTimeFormat(calendar, options).format(
        new Date(),
      );
      setHijriDate(date);
    } catch (e) {
      console.error("Hijri date formatting failed:", e);
      // Fallback to standard date if Hijri fails
      setHijriDate(new Date().toLocaleDateString(lang));
    }
  }, [lang]);

  useEffect(() => {
    const calculateRamadan = async () => {
      try {
        const today = new Date();
        // 2026 Ramadan Dates
        // Standard start is Thursday, Feb 19, 2026
        // Today is Wed, Feb 18, 2026
        let ramadanStart = new Date(2026, 1, 19);
        const ramadanEnd = new Date(2026, 2, 20); // Aprox End

        try {
          // Detect location to see if they start "today" (Wednesday)
          const geoRes = await fetch("https://ipapi.co/json/");
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const timezone = geoData.timezone || "";
            const country = geoData.country_name || "";

            // Certain regions might start a day earlier based on sighting/calendar
            const earlyStartRegions = [
              "Saudi Arabia",
              "United Arab Emirates",
              "Qatar",
              "Kuwait",
              "Egypt",
            ];
            if (
              earlyStartRegions.includes(country) ||
              timezone.includes("Riyadh") ||
              timezone.includes("Dubai")
            ) {
              ramadanStart = new Date(2026, 1, 18); // Start today
            }
          }
        } catch (geoError) {
          console.warn(
            "Location detection failed, using standard start date.",
            geoError,
          );
        }

        const diffStart = Math.ceil(
          (ramadanStart - today) / (1000 * 60 * 60 * 24),
        );
        const diffEnd = Math.ceil((ramadanEnd - today) / (1000 * 60 * 60 * 24));

        if (diffStart > 0) {
          setRamadanInfo({ type: "until", days: diffStart });
        } else if (diffStart === 0) {
          setRamadanInfo({ type: "here", days: 0 });
        } else if (diffEnd > 0) {
          setRamadanInfo({ type: "left", days: diffEnd });
        } else {
          setRamadanInfo(null);
        }
      } catch (e) {
        console.error("Ramadan calculation failed:", e);
        setRamadanInfo(null);
      }
    };

    calculateRamadan();
  }, []);

  // Community Pulse State
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const fetchIpAndLog = async () => {
      let visitorId = "anon-" + Math.random().toString(36).substring(2, 10);
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json").catch(
          () => fetch("https://api64.ipify.org?format=json"),
        );
        let ip = "unknown";
        if (ipRes && ipRes.ok) {
          const ipData = await ipRes.json();
          ip = ipData.ip || "unknown";
        }

        const hash = (str) => {
          let h = 0;
          for (let i = 0; i < str.length; i++) {
            h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
          }
          return Math.abs(h).toString(36);
        };

        // Use a stable visitor ID for the day (UTC based)
        const dayHash = new Date().toISOString().split("T")[0];
        visitorId = hash(ip + navigator.userAgent + dayHash);
      } catch (e) {
        console.warn("Visitor ID generation used fallback:", e);
      }

      try {
        // Use UTC date to ensure reset happens at 12 AM GMT (UTC+0)
        const now = new Date();
        const todayDate = now.toISOString().split("T")[0];

        // Mark visit in Firestore
        const visitDocRef = doc(db, "pulse", todayDate, "visitors", visitorId);
        await setDoc(visitDocRef, { t: Date.now() }, { merge: true });

        // Listen for total pulse count today
        const pulseCollRef = collection(db, "pulse", todayDate, "visitors");
        return onSnapshot(pulseCollRef, (snapshot) => {
          setPulseCount(snapshot.size);
        });
      } catch (e) {
        console.error("Pulse listener failed:", e);
      }
    };

    let unsubscribe;
    fetchIpAndLog().then((unsub) => {
      if (unsub) unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
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

    if (auth.currentUser) {
      setDoc(
        doc(db, "user_stats", auth.currentUser.uid),
        { lastRead: data },
        { merge: true },
      );
    }
  }, []);

  const toggleBookmark = useCallback((ayah, surahNumber) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some((b) => b.number === ayah.number);
      let newBookmarks;
      if (isBookmarked) {
        newBookmarks = prev.filter((b) => b.number !== ayah.number);
      } else {
        newBookmarks = [
          ...prev,
          {
            number: ayah.number,
            surah: surahNumber,
            ayahNum: ayah.numberInSurah,
          },
        ];
      }
      localStorage.setItem("quran_bookmarks", JSON.stringify(newBookmarks));

      // Show Toast
      const msg = isBookmarked
        ? lang === "ar"
          ? "تمت إزالة الإشارة"
          : "Bookmark Removed"
        : lang === "ar"
          ? "تم الحفظ في الإشارات"
          : "Saved to Bookmarks";

      setBookmarkToast({ show: true, message: msg });
      setTimeout(() => setBookmarkToast({ show: false, message: "" }), 2500);

      if (auth.currentUser) {
        setDoc(
          doc(db, "user_stats", auth.currentUser.uid),
          { bookmarks: newBookmarks },
          { merge: true },
        );
      }

      return newBookmarks;
    });
  }, []);

  // Predictive Audio Pre-rendering (Blob Edition - Parallel & Aggressive)
  const preloadNextAyahs = useCallback(
    async (currentNum, surahNum) => {
      const audioMap = surahAudioCache[surahNum];
      if (!audioMap) return;

      const LOOKAHEAD = 10; // Pre-load 10 verses ahead for safety
      const fetchQueue = [];

      for (let i = 1; i <= LOOKAHEAD; i++) {
        const targetNum = currentNum + i;
        const remoteUrl = audioMap[targetNum];

        if (remoteUrl && !blobPoolRef.current[remoteUrl]) {
          console.log(`Queueing Pre-fetch: ${targetNum}`);
          fetchQueue.push(
            (async () => {
              try {
                const response = await fetch(remoteUrl);
                const blob = await response.blob();
                const localUrl = URL.createObjectURL(blob);
                blobPoolRef.current[remoteUrl] = localUrl;
                console.log(`Successfully Pre-rendered Verse: ${targetNum}`);
              } catch (e) {
                console.error(`Pre-fetch failed for Verse ${targetNum}`, e);
              }
            })(),
          );
        }
      }

      // Run fetches in parallel for maximum speed
      await Promise.all(fetchQueue);
    },
    [surahAudioCache],
  );

  const playAyah = useCallback(
    (ayah, surahData) => {
      setPlayingAyah(ayah);
      setPlayingSurahData(surahData);

      const cachedSurah = surahAudioCache[surahData.number];
      const remoteUrl = cachedSurah ? cachedSurah[ayah.numberInSurah] : null;

      if (remoteUrl) {
        const localUrl = blobPoolRef.current[remoteUrl] || remoteUrl;

        // DUAL BUFFER LOGIC: Use current active buffer
        const currentPlayer =
          activeBufferRef.current === 1
            ? audioRef.current
            : nextAudioRef.current;
        currentPlayer.src = localUrl;
        currentPlayer.playbackRate = playbackSpeed;
        currentPlayer.play().catch((e) => console.error(e));

        // AGGRESSIVE PRE-LOAD: Warm up next 10 verses
        preloadNextAyahs(ayah.numberInSurah, surahData.number);

        // PRE-PREPARE NEXT BUFFER: Give the other player its source early
        const nextTargetNum = ayah.numberInSurah + 1;
        const nextRemoteUrl = cachedSurah[nextTargetNum];
        if (nextRemoteUrl) {
          const nextPlayer =
            activeBufferRef.current === 1
              ? nextAudioRef.current
              : audioRef.current;
          // If we already have the blob, set it now. If not, preloadNextAyahs will grab it.
          const nextLocalUrl =
            blobPoolRef.current[nextRemoteUrl] || nextRemoteUrl;
          nextPlayer.src = nextLocalUrl;
          nextPlayer.preload = "auto";
        }

        return;
      }

      // Fallback for initial load
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
            audioRef.current.play().catch((e) => console.error(e));
            preloadNextAyahs(ayah.numberInSurah, surahData.number);
          }
          if (!surahData.ayahs)
            setPlayingSurahData({ ...surahData, ayahs: data.data.ayahs });
          setIsAudioLoading(false);
        });
    },
    [selectedReciter, surahAudioCache, playbackSpeed, preloadNextAyahs],
  );

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch((e) => console.error(e));
  };

  const playNextAyah = useCallback(() => {
    if (!playingAyah || !playingSurahData || !playingSurahData.ayahs) return;
    const nextNum = playingAyah.numberInSurah + 1;

    // Toggle active buffer
    activeBufferRef.current = activeBufferRef.current === 1 ? 2 : 1;

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
    const p1 = audioRef.current;
    const p2 = nextAudioRef.current;

    const handleEnded = () => {
      if (repeatMode === "one") {
        const current = activeBufferRef.current === 1 ? p1 : p2;
        current.currentTime = 0;
        current.play().catch((e) => console.error(e));
      } else {
        playNextAyah();
      }
    };

    p1.addEventListener("ended", handleEnded);
    p2.addEventListener("ended", handleEnded);
    return () => {
      p1.removeEventListener("ended", handleEnded);
      p2.removeEventListener("ended", handleEnded);
    };
  }, [repeatMode, playNextAyah]);

  // Render the audio Player Bar
  const renderAudioBar = (location = "fixed") => {
    const isHero = location === "hero";

    if (isHero) {
      // Hide hero layout if a Surah is selected (we are in detail view)
      if (selectedSurah) return null;
    } else {
      // For fixed-bottom, hide if nothing is playing
      if (!playingAyah || !playingSurahData) return null;

      // NEW: Hide fixed bar if at the top of the home page (hero covers it)
      if (!selectedSurah && !isScrolled) return null;
    }

    const hasContent = playingAyah && playingSurahData;

    // Toggle repeat mode
    const toggleRepeat = () => {
      setRepeatMode((prev) => {
        if (prev === "none") return "all";
        if (prev === "all") return "one";
        return "none";
      });
    };

    return (
      <div
        className={`global-audio-bar ${isHero ? "in-hero" : "fixed-bottom"} glass-panel`}
      >
        {isHero && (
          <div
            className={`audio-arabic-name ${!hasContent ? "placeholder-ar" : ""}`}
            onClick={() =>
              hasContent && handleSurahClick(playingSurahData.number)
            }
            style={{ cursor: hasContent ? "pointer" : "default" }}
          >
            {hasContent ? playingSurahData.name : "القرآن الكريم"}
          </div>
        )}

        <div className="audio-info-box">
          {isHero && <div className="audio-hero-label">{t.now_playing}</div>}
          <span
            className="audio-main-text"
            onClick={() =>
              hasContent && handleSurahClick(playingSurahData.number)
            }
            style={{ cursor: hasContent ? "pointer" : "default" }}
          >
            {hasContent
              ? lang === "ar"
                ? playingSurahData.name
                : playingSurahData.englishName
              : "Select a Surah"}
          </span>
          <div className="audio-sub-text">
            {hasContent ? (
              <>
                {t.surah_ayah} {playingAyah.numberInSurah} •{" "}
                {reciters.find((r) => r.id === selectedReciter)?.name}
              </>
            ) : (
              "Start your spiritual journey"
            )}
          </div>
        </div>

        <div className="audio-controls-main">
          {!isHero && (
            <button
              className={`repeat-toggle ${repeatMode !== "none" ? "active" : ""}`}
              onClick={toggleRepeat}
              title="Repeat Mode"
            >
              <IconRepeat mode={repeatMode} />
            </button>
          )}

          <button
            className="audio-skip-btn"
            onClick={playPrevAyah}
            disabled={!hasContent}
            title="Previous Ayah"
          >
            <IconPrev />
          </button>

          <button
            className="master-play-btn"
            onClick={togglePlay}
            disabled={!hasContent && !isHero}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isAudioLoading ? (
              <div className="loading-spinner-sm" />
            ) : isPlaying ? (
              <IconPause />
            ) : (
              <IconPlay />
            )}
          </button>

          <button
            className="audio-skip-btn"
            onClick={playNextAyah}
            disabled={!hasContent}
            title="Next Ayah"
          >
            <IconNext />
          </button>
        </div>

        <div className="audio-extras">
          <div className="reciter-selector" ref={reciterDropdownRef}>
            <button
              className="reciter-icon-btn"
              onClick={() => setReciterDropdownOpen(!reciterDropdownOpen)}
              title="Select Reciter"
            >
              <IconSheikh />
              <span style={{ fontSize: 11, marginLeft: 8, fontWeight: 700 }}>
                {reciters
                  .find((r) => r.id === selectedReciter)
                  ?.name.split(" ")
                  .pop()}
              </span>
            </button>

            {reciterDropdownOpen && (
              <div className="reciter-dropdown-menu up">
                {reciters.map((r) => (
                  <button
                    key={r.id}
                    className={`reciter-menu-item ${selectedReciter === r.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedReciter(r.id);
                      setReciterDropdownOpen(false);
                      // Clear cache and replay if playing
                      setSurahAudioCache({});
                      if (hasContent) playAyah(playingAyah, playingSurahData);
                    }}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="speed-selector">
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

          <div className="volume-slider-box">
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
          <div className="container" style={{ overflowX: "hidden" }}>
            <AnimatePresence mode="wait">
              {!selectedSurah ? (
                <motion.div
                  key="home-view"
                  initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.5,
                  }}
                >
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
                            <a href="#names">{t.link_names}</a>
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
                          <li className="auth-nav-item">
                            {authLoading ? (
                              <div className="auth-spinner" />
                            ) : user ? (
                              <div className="user-profile-nav">
                                <div className="user-avatar-nav initial-avatar">
                                  {(user.displayName || user.email || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                                <div className="user-dropdown">
                                  <div className="user-info-brief">
                                    <p className="user-name-small">
                                      {user.displayName ||
                                        user.email?.split("@")[0] ||
                                        "User"}
                                    </p>
                                    <p className="user-email-small">
                                      {user.email ||
                                        "@" + (user.displayName || "user")}
                                    </p>
                                  </div>
                                  <button
                                    className="dropdown-item-btn"
                                    onClick={() => setShowBookmarksModal(true)}
                                  >
                                    {lang === "ar"
                                      ? "الإشارات المرجعية"
                                      : "Bookmarks"}
                                  </button>
                                  <button
                                    onClick={handleSignOut}
                                    className="sign-out-btn-nav"
                                  >
                                    {t.nav_signout}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setAuthMode("signin");
                                  setAuthError("");
                                  setShowAuthModal(true);
                                }}
                                className="google-sign-in-btn"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span>{t.nav_signin}</span>
                              </button>
                            )}
                          </li>
                        </ul>
                      </nav>
                    </header>

                    <div className="hero-title-box">
                      <PrayerCountdown lang={lang} />

                      <div className="hero-top-row">
                        <div className="hijri-badge">
                          <div className="hijri-text-group">
                            <span className="hijri-label">{t.hijri_date}</span>
                            <span className="hijri-value">{hijriDate}</span>
                          </div>
                        </div>

                        <div className="pulse-badge">
                          <div className="pulse-icon-box">
                            <div className="pulse-dot"></div>
                          </div>
                          <div className="pulse-text-group">
                            <span className="pulse-label">
                              {t.community_pulse}
                            </span>
                            <span className="pulse-value">
                              {pulseCount} {t.active_today}
                            </span>
                          </div>
                        </div>

                        {ramadanInfo && (
                          <div
                            className={`ramadan-badge ${ramadanInfo.type !== "until" ? "active-ramadan" : ""}`}
                          >
                            <div className="ramadan-icon"></div>
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

                            {ramadanTimings && ramadanInfo.type !== "until" && (
                              <div className="ramadan-extra-info">
                                <div className="timing-divider"></div>
                                <div className="timing-item">
                                  <span className="timing-label">
                                    {t.suhoor}
                                  </span>
                                  <span className="timing-value">
                                    {ramadanTimings.suhoor}
                                  </span>
                                </div>
                                <div className="timing-item">
                                  <span className="timing-label">
                                    {t.iftar}
                                  </span>
                                  <div className="timing-value-row">
                                    <span className="timing-value">
                                      {ramadanTimings.iftar}
                                    </span>
                                    <button
                                      className="dua-tiny-btn"
                                      onClick={() =>
                                        alert(
                                          `${t.iftar_dua_title}:\n${t.iftar_dua}`,
                                        )
                                      }
                                      title={t.iftar_dua_title}
                                    >
                                      Dua
                                    </button>
                                  </div>
                                </div>
                                {iftarCountdown && (
                                  <div className="iftar-countdown-box">
                                    <span className="countdown-label">
                                      {lang === "ar"
                                        ? "تبقي للإفطار"
                                        : "Until Iftar"}
                                    </span>
                                    <span className="countdown-value">
                                      {iftarCountdown}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
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

                    {/* Mood Guide section: interactive mood-based recommendations */}
                    <MoodGuide
                      lang={lang}
                      onJump={(s, a) =>
                        handleSurahClick(s, { surahNumber: s, ayahNumber: a })
                      }
                    />

                    <div
                      className="section-intro"
                      id="names"
                      style={{ marginTop: 80 }}
                    >
                      <h2>{t.link_names}</h2>
                      <p className="section-desc">
                        {lang === "ar"
                          ? "استكشف أسماء الله الحسنى ومعانيها العميقة من القرآن الكريم."
                          : "Explore the 99 Beautiful Names of Allah and their profound meanings from the Holy Quran."}
                      </p>
                    </div>
                    <NamesOfAllah lang={lang} />

                    <SeerahTimeline
                      lang={lang}
                      onJump={(s, a) =>
                        handleSurahClick(s, { surahNumber: s, ayahNumber: a })
                      }
                    />

                    <Duas lang={lang} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0, x: 50, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.98 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    duration: 0.5,
                  }}
                >
                  <SurahDetail
                    surahNumber={selectedSurah}
                    onBack={handleBackToSurahs}
                    playingAyah={playingAyah}
                    isPlaying={isPlaying}
                    playAyah={playAyah}
                    continueReadingData={continueReadingData}
                    onAyahView={saveLastRead}
                    lang={lang}
                    bookmarks={bookmarks}
                    toggleBookmark={toggleBookmark}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Footer lang={lang} t={t} />
            {renderAudioBar("global")}

            <AnimatePresence>
              {showContinuePopup && lastRead && !selectedSurah && (
                <motion.div
                  className="continue-popup-toast"
                  initial={{ opacity: 0, scale: 0.8, y: 100 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 100 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  <div className="popup-glow"></div>
                  <button
                    className="popup-close"
                    onClick={() => setShowContinuePopup(false)}
                  >
                    ×
                  </button>
                  <div className="popup-content">
                    <div className="popup-label">
                      <span className="live-dot"></span>
                      {lang === "ar" ? "جاهز للمتابعة؟" : "Ready to Continue?"}
                    </div>
                    <h3 className="popup-surah">{lastRead.surahName}</h3>
                    <p className="popup-ayah">
                      {lang === "ar" ? "آية" : "Verse"} {lastRead.ayahNumber}
                    </p>
                    <button
                      className="popup-jump-btn"
                      onClick={() => {
                        handleSurahClick(lastRead.surahNumber, lastRead);
                        setShowContinuePopup(false);
                      }}
                    >
                      {lang === "ar" ? "استئناف القراءة" : "Resume Reading"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bookmarks Modal Popup */}
            <AnimatePresence>
              {showBookmarksModal && (
                <div
                  className="bookmarks-modal-overlay"
                  onClick={() => setShowBookmarksModal(false)}
                >
                  <motion.div
                    className="bookmarks-modal-card"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  >
                    <div className="modal-header-premium">
                      <div className="title-group">
                        <h3>
                          {lang === "ar" ? "إشاراتي المرجعية" : "My Bookmarks"}
                        </h3>
                      </div>
                      <button
                        className="modal-close-btn"
                        onClick={() => setShowBookmarksModal(false)}
                      >
                        ×
                      </button>
                    </div>

                    <div className="modal-body-scroll">
                      {bookmarks.length === 0 ? (
                        <div className="empty-bookmarks">
                          <p>
                            {lang === "ar"
                              ? "لا توجد إشارات حتى الآن."
                              : "No bookmarks yet."}
                          </p>
                        </div>
                      ) : (
                        <div className="bookmarks-grid-popup">
                          {bookmarks.map((b, idx) => (
                            <div
                              key={idx}
                              className="bookmark-item-premium"
                              onClick={() => {
                                handleSurahClick(b.surah, {
                                  ayahNumber: b.ayahNum,
                                });
                                setShowBookmarksModal(false);
                              }}
                            >
                              <div className="bookmark-item-left">
                                <span className="b-surah-num">
                                  Surah {b.surah}
                                </span>
                                <span className="b-ayah-label">
                                  Verse {b.ayahNum}
                                </span>
                              </div>
                              <div className="bookmark-item-arrow">→</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Action Toast (Bookmarked!) */}
            <AnimatePresence>
              {bookmarkToast.show && (
                <motion.div
                  className="action-toast-notification"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <div className="toast-icon">✨</div>
                  <span>{bookmarkToast.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AnimatePresence>
              {showAuthModal && (
                <div
                  className="auth-modal-overlay"
                  onClick={() => setShowAuthModal(false)}
                >
                  <motion.div
                    className="auth-modal-card"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 30 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    {/* Glow */}
                    <div className="auth-modal-glow" />

                    {/* Close */}
                    <button
                      className="auth-modal-close"
                      onClick={() => setShowAuthModal(false)}
                    >
                      ×
                    </button>

                    {/* Logo */}
                    <div className="auth-modal-logo">
                      <img src={logoIcon} alt="Verse" />
                      <span>Verse</span>
                    </div>

                    {/* Title */}
                    <h2 className="auth-modal-title">
                      {authMode === "signup"
                        ? lang === "ar"
                          ? "إنشاء حساب"
                          : "Create Account"
                        : authMode === "reset"
                          ? lang === "ar"
                            ? "استعادة كلمة المرور"
                            : "Reset Password"
                          : lang === "ar"
                            ? "مرحباً بعودتك"
                            : "Welcome Back"}
                    </h2>
                    <p className="auth-modal-sub">
                      {authMode === "signup"
                        ? lang === "ar"
                          ? "انضم لرحلتك القرآنية"
                          : "Join your Quranic journey"
                        : authMode === "reset"
                          ? lang === "ar"
                            ? "أدخل بريدك لإعادة التعيين"
                            : "Enter your email to reset"
                          : lang === "ar"
                            ? "تابع رحلتك الروحية"
                            : "Continue your spiritual journey"}
                    </p>

                    {/* Social Buttons (not on reset screen) */}
                    {authMode !== "reset" && (
                      <div className="auth-social-row">
                        <button
                          className="auth-google-btn"
                          onClick={handleSignIn}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Google
                        </button>
                        <button
                          className="auth-twitter-btn"
                          onClick={handleTwitterSignIn}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          X / Twitter
                        </button>
                      </div>
                    )}

                    {authMode !== "reset" && (
                      <div className="auth-divider">
                        <span>{lang === "ar" ? "أو" : "or"}</span>
                      </div>
                    )}

                    {/* Email Form */}
                    <form
                      className="auth-form"
                      onSubmit={
                        authMode === "signup"
                          ? handleEmailSignUp
                          : authMode === "reset"
                            ? handlePasswordReset
                            : handleEmailSignIn
                      }
                    >
                      {authMode === "signup" && (
                        <div className="auth-input-group">
                          <label>{lang === "ar" ? "الاسم" : "Full Name"}</label>
                          <input
                            type="text"
                            placeholder={
                              lang === "ar" ? "اسمك الكريم" : "Your name"
                            }
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                          />
                        </div>
                      )}
                      <div className="auth-input-group">
                        <label>
                          {lang === "ar" ? "البريد الإلكتروني" : "Email"}
                        </label>
                        <input
                          type="email"
                          placeholder={
                            lang === "ar"
                              ? "بريدك الإلكتروني"
                              : "you@example.com"
                          }
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          required
                        />
                      </div>
                      {authMode !== "reset" && (
                        <div className="auth-input-group">
                          <label>
                            {lang === "ar" ? "كلمة المرور" : "Password"}
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                      )}

                      {authError && (
                        <p
                          className={`auth-error ${authError.startsWith("✅") ? "auth-success" : ""}`}
                        >
                          {authError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={authSubmitting}
                      >
                        {authSubmitting
                          ? "..."
                          : authMode === "signup"
                            ? lang === "ar"
                              ? "إنشاء الحساب"
                              : "Create Account"
                            : authMode === "reset"
                              ? lang === "ar"
                                ? "إرسال رابط الاستعادة"
                                : "Send Reset Link"
                              : lang === "ar"
                                ? "تسجيل الدخول"
                                : "Sign In"}
                      </button>
                    </form>

                    {/* Footer links */}
                    <div className="auth-modal-footer">
                      {authMode === "signin" && (
                        <>
                          <button
                            className="auth-link-btn"
                            onClick={() => {
                              setAuthMode("reset");
                              setAuthError("");
                            }}
                          >
                            {lang === "ar"
                              ? "نسيت كلمة المرور؟"
                              : "Forgot password?"}
                          </button>
                          <span className="auth-sep">·</span>
                          <button
                            className="auth-link-btn"
                            onClick={() => {
                              setAuthMode("signup");
                              setAuthError("");
                            }}
                          >
                            {lang === "ar"
                              ? "إنشاء حساب جديد"
                              : "Create account"}
                          </button>
                        </>
                      )}
                      {authMode === "signup" && (
                        <button
                          className="auth-link-btn"
                          onClick={() => {
                            setAuthMode("signin");
                            setAuthError("");
                          }}
                        >
                          {lang === "ar"
                            ? "لدي حساب بالفعل"
                            : "Already have an account? Sign in"}
                        </button>
                      )}
                      {authMode === "reset" && (
                        <button
                          className="auth-link-btn"
                          onClick={() => {
                            setAuthMode("signin");
                            setAuthError("");
                          }}
                        >
                          {lang === "ar"
                            ? "العودة لتسجيل الدخول"
                            : "Back to sign in"}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
