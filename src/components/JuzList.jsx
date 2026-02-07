import { useState, useEffect } from "react";
import "../styles/JuzList.css";

const JuzList = ({ onSurahClick, lang, t }) => {
  const [juzData, setJuzData] = useState([]);
  const [surahMap, setSurahMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const juzsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metaRes, surahRes] = await Promise.all([
          fetch("https://api.alquran.cloud/v1/meta"),
          fetch("https://api.alquran.cloud/v1/surah"),
        ]);

        const metaData = await metaRes.json();
        const surahData = await surahRes.json();

        // Create map of number -> staruct (names)
        const sMap = {};
        if (surahData.data) {
          surahData.data.forEach((s) => {
            sMap[s.number] = s;
          });
          setSurahMap(sMap);
        }

        const surahsRefs = metaData.data.surahs.references;
        const juzRefs = metaData.data.juzs.references;

        const parsedJuzs = [];

        for (let i = 0; i < 30; i++) {
          const startRef = juzRefs[i];
          const endRef = i < 29 ? juzRefs[i + 1] : null;

          const juzSurahs = [];

          let currentSurahNum = startRef.surah;
          let endSurahNum = endRef ? endRef.surah : 114;

          for (let s = currentSurahNum; s <= endSurahNum; s++) {
            const surahRef = surahsRefs[s - 1];
            // fallback if surahMap not ready ?? should be ready

            let startAyah = s === currentSurahNum ? startRef.ayah : 1;
            let endAyah = surahRef.numberOfAyahs; // default to full

            if (s === endSurahNum) {
              if (endRef) {
                // Next juz starts at endRef.ayah
                // So this juz ends at endRef.ayah - 1
                // If endRef.ayah is 1, then this juz ended at the end of previous surah!
                // Wait, logic:
                if (endRef.ayah === 1) {
                  // This means the NEW juz starts at ayah 1 of THIS surah?
                  // No, endRef is the start of NEXT juz.
                  // If next juz starts at Surah X Ayah 1, then previous juz ended at Surah X-1.
                  // So we shouldn't even include Surah X in this juz.
                  // But loop goes up to endSurahNum.
                } else {
                  endAyah = endRef.ayah - 1;
                }
              }
            }

            // Correction logic similar to processed before
            if (s === endSurahNum && endRef && endRef.ayah === 1) {
              continue;
            }

            juzSurahs.push({
              number: s,
              start: startAyah,
              end: endAyah,
            });
          }

          parsedJuzs.push({
            number: i + 1,
            surahs: juzSurahs,
          });
        }

        setJuzData(parsedJuzs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Juz Data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLastJuz = currentPage * juzsPerPage;
  const indexOfFirstJuz = indexOfLastJuz - juzsPerPage;
  const currentJuzs = (juzData || []).slice(indexOfFirstJuz, indexOfLastJuz);
  const totalPages = Math.ceil((juzData || []).length / juzsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById("quran")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="loading">
        {lang === "ar" ? "جارٍ تحميل الأجزاء..." : "Loading Juz Data..."}
      </div>
    );

  return (
    <div className="juz-list-container">
      <div className="juz-grid">
        {currentJuzs.map((juz) => (
          <div key={juz.number} className="juz-card">
            <div className="juz-card-header">
              <span className="juz-title">
                {t.juz_part} {juz.number}
              </span>
              <div className="juz-num-badge">{juz.number}</div>
            </div>
            <div className="juz-content">
              {juz.surahs.map((item, idx) => {
                const sInfo = surahMap[item.number];
                const name = sInfo
                  ? lang === "ar"
                    ? sInfo.name
                    : sInfo.englishName
                  : `Surah ${item.number}`;

                return (
                  <div
                    key={`${juz.number}-${item.number}-${idx}`}
                    className="juz-surah-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSurahClick(item.number);
                    }}
                  >
                    <span
                      className="juz-surah-name"
                      style={{
                        fontFamily: lang === "ar" ? "Amiri" : "inherit",
                      }}
                    >
                      {name}
                    </span>
                    <span className="juz-ayah-range">
                      {item.start === item.end
                        ? `${item.start}`
                        : `${item.start} - ${item.end}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

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

export default JuzList;
