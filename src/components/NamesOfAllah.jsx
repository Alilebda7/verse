import React, { useState, useEffect } from "react";
import namesData from "../data/namesData";
import "../styles/NamesOfAllah.css";

const NamesOfAllah = ({ lang }) => {
  const [names, setNames] = useState(namesData);
  const [selectedName, setSelectedName] = useState(null);
  const [viewMode, setViewMode] = useState("circle");
  const [currentPage, setCurrentPage] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const namesPerPage = 12;

  const allahData = {
    number: 0,
    arabic: "اللَّه",
    transliteration: "Allah",
    meaning: "The Proper Name of the Creator",
    description_en:
      "The greatest name of Allāh. It is the proper name of the Essence of the Creator, who is rightfully worshipped.",
    description_ar:
      "الاسم الأعلم، واللفظ الدال على الذات العلية، المستحق للعبادة بحق.",
    reference: "1:1",
    verse_ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    verse_en:
      "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  // Language helper
  const txt = (en, ar) => (lang === "ar" ? ar : en);

  const closeModal = () => setSelectedName(null);

  // Grid/Gallery Pagination
  const indexOfLastItem = currentPage * namesPerPage;
  const indexOfFirstItem = indexOfLastItem - namesPerPage;
  const currentGridNames = names.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(names.length / namesPerPage);

  // Refactored for CSS-based circular positioning
  const getRingStyles = (index, total, radiusVar) => {
    return {
      "--index": index,
      "--total": total,
      "--radius": radiusVar,
    };
  };

  return (
    <div className="names-section-wrapper">
      <div className="names-organic-header">
        <h2>{txt("The Divine Attributes", "الأسماء الحسنى")}</h2>
        <p className="organic-intro">
          {txt(
            "An exploration of the 99 Names of Allah — reflections of the Infinite that guide the heart and soul toward deeper understanding.",
            "تأمل في أسماء الله الحسنى، تجليات النور والجمال التي تهدي القلوب وتسمو بالأرواح في رحلة العرفان.",
          )}
        </p>
      </div>

      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === "circle" ? "active" : ""}`}
          onClick={() => setViewMode("circle")}
        >
          {txt("Celestial Wheel", "العرض الفلكي")}
        </button>
        <button
          className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          {txt("The Gallery", "معرض الصفات")}
        </button>
      </div>

      {viewMode === "circle" ? (
        <div
          className="names-wheel-container"
          onMouseMove={handleMouseMove}
          style={{
            "--mx": mousePos.x,
            "--my": mousePos.y,
          }}
        >
          {/* Optimized Cosmic Layers - Solar System Focus */}
          <div className="nebula-bg nebula-1"></div>
          <div className="nebula-bg nebula-2"></div>
          <div className="nebula-bg nebula-3"></div>

          <div className="star-field star-field-1"></div>
          <div className="star-field star-field-2"></div>
          <div className="star-field star-field-3"></div>

          <div className="galactic-core-glow"></div>
          <div className="sacred-geometry-overlay"></div>

          <div className="celestial-body planet-1"></div>
          <div className="celestial-body planet-2"></div>
          <div className="celestial-body planet-3"></div>
          <div className="celestial-body planet-4"></div>
          <div className="celestial-body moon-1"></div>
          <div className="celestial-body moon-2"></div>

          <div className="lens-flare"></div>
          <div className="cosmic-comet comet-1"></div>
          <div className="cosmic-comet comet-2"></div>
          <div className="cosmic-comet comet-3"></div>
          <div className="cosmic-comet comet-4"></div>
          <div className="cosmic-comet comet-5"></div>

          <div className="background-torch"></div>

          <div className="spirit-lights">
            {[...Array(24)].map((_, i) => (
              <div key={i} className={`spirit-orb orb-${i}`}></div>
            ))}
          </div>
          <div className="shooting-star-container">
            <div className="shooting-star s1"></div>
            <div className="shooting-star s2"></div>
            <div className="shooting-star s3"></div>
          </div>
          <div className="dust-field"></div>

          <div
            className="names-wheel"
            style={{
              zIndex: 50,
              transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${mousePos.y * -10}deg)`,
            }}
          >
            {/* Orbit Lines */}
            <div className="orbit-line orbit-1"></div>
            <div className="orbit-line orbit-2"></div>
            <div className="orbit-line orbit-3"></div>

            {/* Center: Always ALLAH with Layered Ornaments */}
            <div
              className="center-name-complex"
              onClick={() => setSelectedName(allahData)}
            >
              <div className="center-pulse-wrapper">
                <div className="halo-layer halo-0"></div>
                <div className="halo-layer halo-1"></div>
                <div className="halo-layer halo-2"></div>
                <div className="halo-layer halo-3"></div>
                <h2 className="center-arabic-final">اللَّه</h2>
              </div>
            </div>

            {/* Inscribed Rings - Pure CSS positioning */}
            {names.slice(0, 21).map((name, i) => (
              <div
                key={name.number}
                className="wheel-name-wrap"
                style={getRingStyles(i, 21, "var(--r1)")}
              >
                <div
                  className="wheel-name"
                  onClick={() => setSelectedName(name)}
                >
                  {name.arabic}
                </div>
              </div>
            ))}
            {names.slice(21, 51).map((name, i) => (
              <div
                key={name.number}
                className="wheel-name-wrap"
                style={getRingStyles(i, 30, "var(--r2)")}
              >
                <div
                  className="wheel-name"
                  onClick={() => setSelectedName(name)}
                >
                  {name.arabic}
                </div>
              </div>
            ))}
            {names.slice(51, 99).map((name, i) => (
              <div
                key={name.number}
                className="wheel-name-wrap"
                style={getRingStyles(i, 48, "var(--r3)")}
              >
                <div
                  className="wheel-name"
                  onClick={() => setSelectedName(name)}
                >
                  {name.arabic}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="names-gallery-focused">
          <div className="names-art-grid">
            {currentGridNames.map((name) => (
              <div
                key={name.number}
                className="name-token-circular"
                onClick={() => setSelectedName(name)}
              >
                <div className="circular-token-content">
                  <div className="token-metadata">
                    <span className="token-number">#{name.number}</span>
                  </div>
                  <h3 className="token-arabic">{name.arabic}</h3>
                  <div className="token-description-swap">
                    <p className="token-trans">{name.transliteration}</p>
                    <p className="token-meaning-hover">{name.meaning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="names-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="pagi-btn"
              >
                {txt("Back", "رجوع")}
              </button>
              <div className="pagi-pages">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`pagi-num ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="pagi-btn"
              >
                {txt("Onward", "المزيد")}
              </button>
            </div>
          )}
        </div>
      )}

      {selectedName && (
        <div className="name-modal-overlay" onClick={closeModal}>
          <div
            className="name-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>

            <div className="modal-header">
              <span className="modal-number">#{selectedName.number}</span>
              <h2 className="modal-arabic-title ink-typography-lg">
                {selectedName.arabic}
              </h2>
              <p className="modal-transliteration-title">
                {selectedName.transliteration}
              </p>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>{txt("Essence & Wisdom", "الحكمة والجلال")}</h3>
                <p className="modal-meaning-text">
                  {lang === "ar"
                    ? selectedName.description_ar
                    : selectedName.description_en}
                </p>
                <p className="modal-secondary-meaning">
                  {selectedName.meaning}
                </p>
              </div>

              {selectedName.verse_ar && (
                <div className="modal-section">
                  <h3>{txt("From the Revelation", "من الوحي")}</h3>
                  <div className="modal-verse-box">
                    <p className="modal-verse-arabic ink-typography">
                      {selectedName.verse_ar}
                    </p>
                    <p className="modal-verse-translation">
                      {selectedName.verse_en}
                    </p>
                    <span className="modal-verse-ref">
                      [{selectedName.reference}]
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NamesOfAllah;
