import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/SurahList.css";

const SurahList = ({ onSurahClick, order = "number", lang, t }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const surahsPerPage = 20;

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        setSurahs(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // support optional ordering (e.g., revelation order)
  const sortedSurahs = [...surahs];
  if (order === "revelation") {
    sortedSurahs.sort((a, b) => {
      const ao =
        typeof a.revelationOrder === "number" ? a.revelationOrder : a.number;
      const bo =
        typeof b.revelationOrder === "number" ? b.revelationOrder : b.number;
      return (ao || 0) - (bo || 0);
    });
  } else {
    sortedSurahs.sort((a, b) => (a.number || 0) - (b.number || 0));
  }

  const filteredSurahs = sortedSurahs.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.englishName.toLowerCase().includes(term) ||
      s.number.toString() === term ||
      s.name.includes(term)
    );
  });

  const indexOfLastSurah = currentPage * surahsPerPage;
  const indexOfFirstSurah = indexOfLastSurah - surahsPerPage;
  const currentSurahs = filteredSurahs.slice(
    indexOfFirstSurah,
    indexOfLastSurah,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSurahs.length / surahsPerPage),
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById("quran")?.scrollIntoView({ behavior: "smooth" });
  };

  const getRevelationType = (type) => {
    if (type.toLowerCase() === "meccan") return t.meccan;
    if (type.toLowerCase() === "medinan") return t.medinan;
    return type;
  };

  if (loading)
    return (
      <div className="loading">
        {lang === "ar" ? "جارٍ تحميل السور..." : "Loading Surahs..."}
      </div>
    );

  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="surah-list-container">
      <div className="list-search-bar">
        <div className="search-icon">🔍</div>
        <input
          type="text"
          placeholder={t.search_placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <motion.div
        className="surah-grid"
        variants={gridVariants}
        initial="hidden"
        animate="show"
      >
        {currentSurahs.map((surah) => (
          <motion.div
            key={surah.number}
            className="surah-card"
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            onClick={() => onSurahClick(surah.number)}
          >
            <div className="ghost-number">{surah.number}</div>
            <div className="surah-card-header">
              <div className="surah-num-badge">{surah.number}</div>
              <div className="surah-name-ar" style={{ fontFamily: "Amiri" }}>
                {lang === "ar" ? surah.englishName : surah.name}
              </div>
            </div>
            <div className="surah-card-content">
              <h3 className="surah-name-en">
                {lang === "ar" ? surah.name : surah.englishName}
              </h3>
              <p className="surah-sub-en">{surah.englishNameTranslation}</p>
              <div className="surah-footer">
                <span className="surah-verses-pill">
                  {surah.numberOfAyahs} {t.surah_ayahs}
                </span>
                <div className="surah-type-badge">
                  {getRevelationType(surah.revelationType)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
