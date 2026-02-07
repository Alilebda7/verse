import { useEffect, useState, useRef, useCallback } from "react";
import "../styles/SurahDetail.css";

// SVG Icons
const IconPlay = () => (
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
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);
const IconPause = () => (
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
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);
const IconBook = () => (
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
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
const IconNote = () => (
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
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const IconTafsir = () => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const IconBookmark = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconCopy = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);
const IconShare = () => (
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
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const SurahDetail = ({
  surahNumber,
  onBack,
  playingAyah,
  playAyah,
  continueReadingData,
  onAyahView,
  lang,
}) => {
  const [surahData, setSurahData] = useState(null);
  const [translationData, setTranslationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMushafPage, setCurrentMushafPage] = useState(null);
  const [pages, setPages] = useState([]);
  const [viewMode, setViewMode] = useState("mushaf");
  const [pageData, setPageData] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [wordTranslations, setWordTranslations] = useState({});
  const [hoveredWord, setHoveredWord] = useState(null); // { word, rect, translation, loading }
  const hoverTimerRef = useRef(null);
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Settings
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("Amiri");
  const [showSettings, setShowSettings] = useState(false);
  const [useTajweed, setUseTajweed] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState(
    lang === "ar" ? "ar.muyassar" : "en.sahih",
  );

  const languages = [
    { name: "Arabic", code: "ar.muyassar" },
    { name: "English", code: "en.sahih" },
    { name: "French", code: "fr.hamidullah" },
  ];

  // Interaction
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [activeTranslation, setActiveTranslation] = useState(null);
  const [activeTafsir, setActiveTafsir] = useState(null);
  const [tafsirContent, setTafsirContent] = useState(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirError, setTafsirError] = useState(null);
  const [bookmarks, setBookmarks] = useState(() =>
    JSON.parse(localStorage.getItem("quran_bookmarks") || "[]"),
  );
  const [notes, setNotes] = useState(() =>
    JSON.parse(localStorage.getItem("quran_notes") || "{}"),
  );

  useEffect(() => {
    if (playingAyah && viewMode === "mushaf") {
      const element = document.getElementById(
        `ayah-${playingAyah.numberInSurah}`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [playingAyah, viewMode]);

  useEffect(() => {
    setLoading(true);
    const edition = useTajweed ? "quran-tajweed" : "quran-uthmani";
    Promise.all([
      fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${edition}`,
      ).then((res) => res.json()),
      fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/${translationLanguage}`,
      ).then((res) => res.json()),
    ]).then(([arabicRes, transRes]) => {
      setSurahData(arabicRes.data);
      setTranslationData(transRes.data);
      const uniquePages = [...new Set(arabicRes.data.ayahs.map((a) => a.page))];
      setPages(uniquePages);

      let initialPage = uniquePages[0];

      if (continueReadingData?.page) {
        initialPage = continueReadingData.page;
      } else if (continueReadingData?.ayahNumber) {
        const targetAyah = arabicRes.data.ayahs.find(
          (a) => a.numberInSurah === continueReadingData.ayahNumber,
        );
        if (targetAyah) {
          initialPage = targetAyah.page;
          setSelectedAyah(targetAyah);
        }
      }

      setCurrentMushafPage(initialPage);
      setLoading(false);
    });
  }, [surahNumber, useTajweed, translationLanguage]);

  useEffect(() => {
    if (currentMushafPage && viewMode === "mushaf") {
      setPageLoading(true);
      const edition = useTajweed ? "quran-tajweed" : "quran-uthmani";
      fetch(`https://api.alquran.cloud/v1/page/${currentMushafPage}/${edition}`)
        .then((res) => res.json())
        .then((data) => {
          setPageData(data.data);
          setPageLoading(false);
        });
    }
  }, [currentMushafPage, viewMode, useTajweed]);

  const handleAyahClick = (event, ayah) => {
    event.stopPropagation();
    if (selectedAyah?.number === ayah.number) setSelectedAyah(null);
    else {
      setSelectedAyah(ayah);
      onAyahView(surahData, ayah.numberInSurah, ayah.page);
    }
  };

  const toggleBookmark = (ayah) => {
    const isBookmarked = bookmarks.some((b) => b.number === ayah.number);
    let newBookmarks;
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((b) => b.number !== ayah.number);
    } else {
      newBookmarks = [
        ...bookmarks,
        {
          number: ayah.number,
          surah: surahNumber,
          ayahNum: ayah.numberInSurah,
        },
      ];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem("quran_bookmarks", JSON.stringify(newBookmarks));
  };

  const handleTafsirOpen = (ayah) => {
    // open modal and fetch tafsir content
    setActiveTafsir(ayah);
    setTafsirContent(null);
    setTafsirError(null);
    setTafsirLoading(true);
    (async () => {
      const sur = surahNumber;
      const ay = ayah.numberInSurah;
      const candidates = [
        `https://api.alquran.cloud/v1/tafsir/ar.jalalayn/${sur}:${ay}`,
        `https://api.alquran.cloud/v1/tafsir/en.jalalayn/${sur}:${ay}`,
        `https://api.alquran.cloud/v1/tafsir/jalalayn/${sur}:${ay}`,
      ];
      let found = null;
      for (const url of candidates) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          // the API may return data.data.text or data.data.tafsir
          if (data && data.data) {
            if (data.data.text) {
              found = data.data.text;
              break;
            }
            if (data.data.tafsir) {
              found = data.data.tafsir;
              break;
            }
          }
        } catch (err) {
          // try next
        }
      }
      if (found) {
        setTafsirContent(found);
      } else {
        setTafsirError("Tafsir not available from API.");
      }
      setTafsirLoading(false);
    })();
  };

  const handleTranslationOpen = (ayah) => {
    const trans = translationData.ayahs.find((a) => a.number === ayah.number);
    setActiveTranslation({ ...ayah, translation: trans.text });
  };

  const getLangCode = (lang) => {
    switch (lang) {
      case "Arabic":
        return "ar.muyassar";
      case "French":
        return "fr.hamidullah";
      case "German":
        return "de.aburida";
      default:
        return "en.sahih";
    }
  };

  const handleCopy = (ayah) => {
    const trans = translationData.ayahs.find((a) => a.number === ayah.number);
    const copyText = `
📖 Verse (Official Website)
Surah: ${surahData.englishName} (Ayah ${ayah.numberInSurah})

Arabic: ${ayah.text}

Translation: ${trans?.text || "N/A"}

Read more at: Verse Website
    `.trim();

    navigator.clipboard.writeText(copyText);
    alert("Ayah & Translation copied to clipboard!");
  };

  // Word wrapping and interaction: wrap text nodes into spans.q-word after pageData updates
  useEffect(() => {
    if (!pageData) return;

    const wrapWordsIn = (node, ayahNumber) => {
      // Walk child nodes and replace text nodes with word spans
      const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        null,
      );
      const textNodes = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }

      textNodes.forEach((textNode) => {
        const text = textNode.nodeValue;
        if (!text || !text.trim()) return;
        const frag = document.createDocumentFragment();
        // Split on spaces but keep punctuation as part of tokens
        const parts = text.split(/(\s+)/);
        parts.forEach((part) => {
          if (part.match(/^\s+$/)) {
            frag.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "q-word";
            span.setAttribute("data-word", part);
            span.setAttribute("data-ayah", ayahNumber);
            span.textContent = part;
            // handlers
            span.addEventListener("mouseenter", (e) => {
              if (isTouchDevice) return;
              hoverTimerRef.current = setTimeout(() => {
                translateAndShow(span, part);
              }, 3000);
            });
            span.addEventListener("mouseleave", (e) => {
              if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
              }
              setHoveredWord(null);
            });
            span.addEventListener("click", (e) => {
              e.stopPropagation();
              // on touch devices or mobile treat click as translate
              translateAndShow(span, part);
            });
            frag.appendChild(span);
          }
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });
    };

    const mushafAyahEls = Array.from(
      document.querySelectorAll(".mushaf-text .ayah-span"),
    );
    mushafAyahEls.forEach((ayahEl) => {
      const inner =
        ayahEl.querySelector("span:not(.ayah-end-marker)") || ayahEl;
      const ayahNumAttr = ayahEl.getAttribute("id") || "";
      const ayahNum = ayahNumAttr.replace(/[^0-9]/g, "") || "";
      wrapWordsIn(inner, ayahNum);
    });

    // also wrap in verse-by-verse view
    const verseEls = Array.from(document.querySelectorAll(".verse-arabic"));
    verseEls.forEach((ve) => {
      wrapWordsIn(ve, ve.getAttribute("id") || "");
    });

    // cleanup on unmount or page change
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setHoveredWord(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData]);

  const translateAndShow = async (spanEl, word) => {
    if (!spanEl) return;
    const rect = spanEl.getBoundingClientRect();
    const cached = wordTranslations[word];
    if (cached) {
      setHoveredWord({ word, rect, translation: cached, loading: false });
      return;
    }

    setHoveredWord({ word, rect, translation: null, loading: true });
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(word)}`,
      );
      const data = await res.json();
      const translated =
        data && data[0] && data[0][0] && data[0][0][0] ? data[0][0][0] : null;
      const final = translated || word;
      setWordTranslations((s) => ({ ...s, [word]: final }));
      setHoveredWord({ word, rect, translation: final, loading: false });
    } catch (err) {
      // fallback: simple identity
      setWordTranslations((s) => ({ ...s, [word]: word }));
      setHoveredWord({ word, rect, translation: word, loading: false });
    }
  };

  const toArabicNumerals = (n) =>
    n.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

  const parseTajweedText = (text) => {
    if (!useTajweed) return text;
    return text
      .replace(
        /\[([a-z0-9:]+)\]/gi,
        (match, rule) =>
          `<span class="tj-${rule.split(":")[0].toLowerCase()}">`,
      )
      .replace(/\]/g, "</span>");
  };

  // Helper for inline translations
  const txt = (en, ar) => (lang === "ar" ? ar : en);

  if (loading)
    return (
      <div className="loading">
        {txt("Loading Surah Detail...", "جارٍ تحميل السورة...")}
      </div>
    );

  return (
    <div className="surah-detail-container">
      <div className="detail-top-bar">
        <button className="back-link" onClick={onBack}>
          {lang === "ar" ? "→" : "←"} {txt("Back List", "العودة للقائمة")}
        </button>
        <div className="right-controls">
          <button
            className={`btn-settings ${showSettings ? "active" : ""}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙ {txt("Settings", "الإعدادات")}
          </button>
          <span className="page-indicator">
            {txt("Page", "الصفحة")} {currentMushafPage}
          </span>
        </div>
      </div>

      <div className="surah-title-section">
        <div className="surah-title-box">
          <h2 className="surah-id-title">
            {surahData.number}.{" "}
            {lang === "ar" ? surahData.name : surahData.englishName}
          </h2>
          <span className="surah-sub-title">
            {lang === "ar"
              ? surahData.englishName
              : surahData.englishNameTranslation}
          </span>
        </div>
      </div>

      <div className="view-mode-selector">
        <div className="toggle-group">
          <button
            className={viewMode === "mushaf" ? "active" : ""}
            onClick={() => setViewMode("mushaf")}
          >
            {txt("Mushaf Mode", "المصحف")}
          </button>
          <button
            className={viewMode === "verse" ? "active" : ""}
            onClick={() => setViewMode("verse")}
          >
            {txt("Verse by Verse", "آية بآية")}
          </button>
        </div>
      </div>

      {/* MUSHAF MODE */}
      {viewMode === "mushaf" && (
        <>
          {showSettings && (
            <div className="reader-settings-sidebar">
              <h3>{txt("Reader Settings", "إعدادات القراءة")}</h3>

              <div className="setting-item">
                <label>{txt("TEXT MODE", "نمط النص")}</label>
                <div className="pill-group">
                  <button
                    className={!useTajweed ? "active" : ""}
                    onClick={() => setUseTajweed(false)}
                  >
                    {txt("Standard", "عادي")}
                  </button>
                  <button
                    className={useTajweed ? "active" : ""}
                    onClick={() => setUseTajweed(true)}
                  >
                    {txt("Tajweed", "تجويد")}
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label>{txt("TRANSLATION", "الترجمة")}</label>
                <div className="grid-pill-group">
                  {["Arabic", "English", "French", "German"].map((l) => {
                    const code = getLangCode(l);
                    // Mapping names to Arabic if needed
                    const lName =
                      lang === "ar"
                        ? l === "Arabic"
                          ? "عربي"
                          : l === "English"
                            ? "إنجليزي"
                            : l === "French"
                              ? "فرنسي"
                              : "ألماني"
                        : l;
                    return (
                      <button
                        key={l}
                        className={translationLanguage === code ? "active" : ""}
                        onClick={() => setTranslationLanguage(code)}
                      >
                        {lName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="setting-item">
                <label>{txt("FONT SIZE", "حجم الخط")}</label>
                <div className="font-size-controls">
                  <button
                    onClick={() => setFontSize(Math.max(24, fontSize - 2))}
                  >
                    A-
                  </button>
                  <span className="size-label">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(Math.min(64, fontSize + 2))}
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="setting-item">
                <label>{txt("FONT STYLE", "نوع الخط")}</label>
                <div className="pill-group">
                  <button
                    className={fontFamily === "Amiri" ? "active" : ""}
                    onClick={() => setFontFamily("Amiri")}
                  >
                    Amiri
                  </button>
                  <button
                    className={
                      fontFamily === "Scheherazade New" ? "active" : ""
                    }
                    onClick={() => setFontFamily("Scheherazade New")}
                  >
                    Uthmani
                  </button>
                  <button
                    className={fontFamily === "Lateef" ? "active" : ""}
                    onClick={() => setFontFamily("Lateef")}
                  >
                    Lateef
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className={`mushaf-container ${surahNumber === 1 ? "fatiha-frame" : ""}`}
            key={currentMushafPage}
          >
            <div
              className={`mushaf-text ${useTajweed ? "tajweed-mode" : ""}`}
              style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily }}
            >
              {pageLoading ? (
                <div className="page-loader">
                  {txt("Loading Page...", "جارٍ تحميل الصفحة...")}
                </div>
              ) : (
                pageData?.ayahs.map((ayah, index) => {
                  const isPlaying = playingAyah?.number === ayah.number;
                  const isSelected = selectedAyah?.number === ayah.number;

                  return (
                    <span
                      key={ayah.number}
                      id={`ayah-${ayah.numberInSurah}`}
                      className={`ayah-span ${isSelected ? "selected" : ""} ${isPlaying ? "playing" : ""}`}
                      onClick={(e) => handleAyahClick(e, ayah)}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: parseTajweedText(ayah.text),
                        }}
                      />
                      <span className="ayah-end-marker">
                        &#64831;{toArabicNumerals(ayah.numberInSurah)}&#64830;
                      </span>

                      {isSelected && (
                        <div className="ayah-actions-popover">
                          <button
                            className={`ayah-action-btn ${isPlaying ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              playAyah(ayah, surahData);
                            }}
                            title={txt("Play Recitation", "تشغيل التلاوة")}
                          >
                            {isPlaying ? <IconPause /> : <IconPlay />}
                          </button>
                          <button
                            className="ayah-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTranslationOpen(ayah);
                            }}
                            title={txt("View Translation", "عرض الترجمة")}
                          >
                            <IconBook />
                          </button>
                          <button
                            className="ayah-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTafsirOpen(ayah);
                            }}
                            title={txt("Read Tafsir", "قراءة التفسير")}
                          >
                            <IconTafsir />
                          </button>
                          <button
                            className={`ayah-action-btn ${bookmarks.some((b) => b.number === ayah.number) ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(ayah);
                            }}
                            title={txt(
                              "Toggle Bookmark",
                              "إضافة/إزالة إشارة مرجعية",
                            )}
                          >
                            <IconBookmark
                              filled={bookmarks.some(
                                (b) => b.number === ayah.number,
                              )}
                            />
                          </button>
                          <button
                            className="ayah-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(ayah);
                            }}
                            title={txt("Copy Ayah", "نسخ الآية")}
                          >
                            <IconCopy />
                          </button>
                          <button
                            className="ayah-action-btn"
                            onClick={(e) => e.stopPropagation()}
                            title={txt("Share Ayah", "مشاركة الآية")}
                          >
                            <IconShare />
                          </button>
                        </div>
                      )}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* VERSE BY VERSE MODE - COZY CARDS */}
      {viewMode === "verse" && (
        <div className="verse-by-verse-container">
          {surahData?.ayahs.map((ayah) => {
            const isPlaying = playingAyah?.number === ayah.number;
            const isBookmarked = bookmarks.some(
              (b) => b.number === ayah.number,
            );
            const translation = translationData?.ayahs.find(
              (a) => a.number === ayah.number,
            );

            return (
              <div
                key={ayah.number}
                id={`verse-${ayah.numberInSurah}`}
                className={`verse-card ${isPlaying ? "playing" : ""}`}
              >
                <div className="verse-card-header">
                  <div className="verse-number-badge">
                    <span className="verse-num">{ayah.numberInSurah}</span>
                    <span className="verse-label">{txt("Ayah", "آية")}</span>
                  </div>
                  <div className="verse-actions">
                    <button
                      className={`verse-action-icon ${isPlaying ? "active" : ""}`}
                      onClick={() => playAyah(ayah, surahData)}
                      title={txt("Play", "تشغيل")}
                    >
                      {isPlaying ? <IconPause /> : <IconPlay />}
                    </button>
                    <button
                      className={`verse-action-icon ${isBookmarked ? "active" : ""}`}
                      onClick={() => toggleBookmark(ayah)}
                      title={txt("Bookmark", "إشارة")}
                    >
                      <IconBookmark filled={isBookmarked} />
                    </button>
                    <button
                      className="verse-action-icon"
                      onClick={() => handleCopy(ayah)}
                      title={txt("Copy", "نسخ")}
                    >
                      <IconCopy />
                    </button>
                  </div>
                </div>

                <div className="verse-card-body">
                  <div
                    className="verse-arabic"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontFamily: fontFamily,
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: parseTajweedText(ayah.text),
                      }}
                    />
                  </div>

                  {translation && (
                    <div className="verse-translation">
                      <div className="translation-label">
                        {txt("Translation", "الترجمة")}
                      </div>
                      <p>{translation.text}</p>
                    </div>
                  )}
                </div>

                <div className="verse-card-footer">
                  <button
                    className="verse-footer-btn"
                    onClick={() => handleTafsirOpen(ayah)}
                  >
                    <IconTafsir />
                    <span>{txt("Read Tafsir", "قراءة التفسير")}</span>
                  </button>
                  <button className="verse-footer-btn">
                    <IconNote />
                    <span>{txt("Add Note", "ملاحظة")}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Translation Modal */}
      {activeTranslation && (
        <div
          className="translation-modal-overlay"
          onClick={() => setActiveTranslation(null)}
        >
          <div
            className="translation-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setActiveTranslation(null)}
            >
              ×
            </button>
            <div className="modal-header">
              <h3>{txt("Translation", "الترجمة")}</h3>
              <span className="ayah-meta">
                {lang === "ar" ? surahData.name : surahData.englishName} •{" "}
                {txt("Ayah", "آية")} {activeTranslation.numberInSurah}
              </span>
            </div>
            <div className="modal-body">
              <div className="modal-arabic">{activeTranslation.text}</div>
              <div className="modal-translation">
                {activeTranslation.translation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Word translation tooltip */}
      {hoveredWord &&
        (() => {
          const r = hoveredWord.rect;
          if (!r) return null;
          const padding = 8;
          const tooltipWidth = 260;
          let top = r.bottom + 8;
          let left = r.left;
          if (left + tooltipWidth > window.innerWidth - 12) {
            left = window.innerWidth - tooltipWidth - 12;
          }
          if (r.bottom + 8 + 80 > window.innerHeight) {
            top = r.top - 8 - 70;
          }

          return (
            <div
              className={`word-translate-tooltip ${hoveredWord.loading ? "loading" : ""}`}
              style={{ top: top + "px", left: left + "px" }}
            >
              <div className="word">{hoveredWord.word}</div>
              <div className="trans">
                {hoveredWord.loading
                  ? txt("Translating...", "يترجم...")
                  : hoveredWord.translation}
              </div>
            </div>
          );
        })()}

      {/* Tafsir Modal */}
      {activeTafsir && (
        <div
          className="tafsir-modal-overlay"
          onClick={() => setActiveTafsir(null)}
        >
          <div
            className="tafsir-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setActiveTafsir(null)}
            >
              ×
            </button>
            <div className="modal-header">
              <h3>
                {txt("Al-Jalalayn Tafsir", "تفسير الجلالين")} -{" "}
                {txt("Ayah", "آية")} {activeTafsir.numberInSurah}
              </h3>
            </div>
            <div className="modal-body">
              <div className="modal-arabic">{activeTafsir.text}</div>
              {tafsirLoading ? (
                <p>
                  <i>{txt("Loading Tafsir content...", "تحميل التفسير...")}</i>
                </p>
              ) : tafsirError ? (
                <p>
                  <i>{tafsirError}</i>
                </p>
              ) : tafsirContent ? (
                <div className="modal-tafsir-content">{tafsirContent}</div>
              ) : (
                <p>
                  <i>
                    {txt(
                      "No Tafsir available for this Ayah.",
                      "لا يوجد تفسير متاح.",
                    )}
                  </i>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {viewMode === "mushaf" && (
        <div className="mushaf-pagination-controls">
          <button
            disabled={currentMushafPage === pages[0]}
            onClick={() => setCurrentMushafPage(currentMushafPage - 1)}
            className="pagination-btn"
          >
            {txt("Previous Page", "السابق")}
          </button>
          <button
            disabled={currentMushafPage === pages[pages.length - 1]}
            onClick={() => setCurrentMushafPage(currentMushafPage + 1)}
            className="pagination-btn"
          >
            {txt("Next Page", "التالي")}
          </button>
        </div>
      )}
    </div>
  );
};

export default SurahDetail;
