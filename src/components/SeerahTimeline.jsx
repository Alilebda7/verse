import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { seerahMilestones } from "../data/seerahData";
import "../styles/SeerahTimeline.css";

const SeerahTimeline = ({ onJump, lang }) => {
  const scrollRef = useRef(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const t = {
    en: {
      title: "Journey of the Seerah",
      subtitle: "Timeline of the Prophet's (PBUH) Life & Revelations",
      jump: "Read Verse",
      scrollHint: "Scroll to explore →",
      hadithTitle: "Authentic Hadith",
      readStory: "Read Full Story",
    },
    ar: {
      title: "رحلة السيرة النبوية",
      subtitle: "الخط الزمني لحياة النبي ﷺ والتنزيلات",
      jump: "اقرأ الآية",
      scrollHint: "اسحب للاستكشاف ←",
      hadithTitle: "حديث شريف",
      readStory: "اقرأ القصة كاملة",
    },
  };

  const content = lang === "ar" ? t.ar : t.en;

  // Utility to get translated content safely
  const getField = (field, currentLang) => {
    if (typeof field === "object" && field !== null) {
      return field[currentLang] || field["en"];
    }
    return field;
  };

  return (
    <div className="seerah-section" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="seerah-header">
        <h2>{content.title}</h2>
        <p>{content.subtitle}</p>
      </div>

      <div className="timeline-wrapper">
        <div className="scroll-hint">{content.scrollHint}</div>
        <div className="timeline-container" ref={scrollRef}>
          <div className="timeline-line"></div>

          <div className="timeline-items">
            {seerahMilestones.map((item, index) => (
              <motion.div
                key={item.id}
                className={`timeline-card-box ${item.type}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="timeline-dot-wrapper">
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">{item.year}</div>
                </div>

                <div
                  className="timeline-card"
                  onClick={() => setSelectedMilestone(item)}
                >
                  <span className="card-period">
                    {getField(item.period, lang)}
                  </span>
                  <h3>{getField(item.title, lang)}</h3>
                  <p className="card-desc">
                    {getField(item.description, lang)}
                  </p>

                  <button className="read-story-btn">
                    {content.readStory}
                  </button>

                  <div className="card-verses">
                    {item.verses.map((v, i) => (
                      <button
                        key={i}
                        className="verse-jump-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onJump(v.surah, v.ayah);
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        {getField(v.title, lang)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* COMPACT BOTTOM POPUP */}
        <AnimatePresence>
          {selectedMilestone && (
            <motion.div
              className="seerah-inline-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMilestone(null)}
            >
              <motion.div
                className="seerah-inline-content"
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                <button
                  className="inline-close-btn"
                  onClick={() => setSelectedMilestone(null)}
                >
                  ×
                </button>

                <div className="inline-header">
                  <span className="inline-period">
                    {getField(selectedMilestone.period, lang)}
                  </span>
                  <h2>{getField(selectedMilestone.title, lang)}</h2>
                  <span className="inline-year">{selectedMilestone.year}</span>
                </div>

                <div className="inline-body">
                  <div className="story-content-wrapper">
                    {getField(selectedMilestone.fullStory, lang)
                      .split("\n\n")
                      .map((paragraph, pIdx) => (
                        <div key={pIdx} className="story-paragraph-group">
                          {pIdx === 0 && (
                            <span className="drop-cap">
                              {paragraph.charAt(0)}
                            </span>
                          )}
                          <p className="story-text-p">
                            {pIdx === 0 ? paragraph.slice(1) : paragraph}
                          </p>
                          {pIdx <
                            getField(selectedMilestone.fullStory, lang).split(
                              "\n\n",
                            ).length -
                              1 && (
                            <div className="paragraph-divider">
                              <span></span>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              >
                                <path
                                  d="M12 3v18M3 12h18"
                                  strokeDasharray="4 4"
                                />
                              </svg>
                              <span></span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {selectedMilestone.ahadith &&
                    selectedMilestone.ahadith.length > 0 && (
                      <div className="hadith-prophetic-card">
                        <div className="hadith-chip">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {content.hadithTitle}
                        </div>
                        {selectedMilestone.ahadith.map((h, i) => (
                          <div key={i} className="h-inner">
                            <p className="h-text-main">
                              "{getField(h.text, lang)}"
                            </p>
                            <div className="h-meta">
                              <span className="h-line"></span>
                              <span className="h-source-label">
                                {getField(h.source, lang)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="inline-actions-grid">
                    {selectedMilestone.verses.map((v, i) => (
                      <button
                        key={i}
                        className="premium-jump-btn"
                        onClick={() => {
                          onJump(v.surah, v.ayah);
                          setSelectedMilestone(null);
                        }}
                      >
                        <div className="jump-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        </div>
                        <div className="jump-text">
                          <span className="jump-label">{content.jump}</span>
                          <span className="jump-title">
                            {getField(v.title, lang)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SeerahTimeline;
