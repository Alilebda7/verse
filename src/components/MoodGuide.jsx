import React, { useState } from "react";
import "../styles/MoodGuide.css";

const moods = [
  {
    id: "anxious",
    label: "Anxious",
    label_ar: "قلق",
    emoji: "🧘",
    color: "#6366f1",
    recommendation: {
      surah: 13,
      ayah: 28,
      text: "Verily, in the remembrance of Allah do hearts find rest.",
      text_ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    },
  },
  {
    id: "sad",
    label: "Sad",
    label_ar: "حزين",
    emoji: "🌙",
    color: "#3b82f6",
    recommendation: {
      surah: 93,
      ayah: 5,
      text: "And your Lord is going to give you, and you will be satisfied.",
      text_ar: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    },
  },
  {
    id: "grateful",
    label: "Grateful",
    label_ar: "ممتن",
    emoji: "✨",
    color: "#10b981",
    recommendation: {
      surah: 14,
      ayah: 7,
      text: "If you are grateful, I will surely increase you [in favor].",
      text_ar: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    },
  },
  {
    id: "hopeful",
    label: "Seeking Hope",
    label_ar: "باحث عن الأمل",
    emoji: "☀️",
    color: "#f59e0b",
    recommendation: {
      surah: 39,
      ayah: 53,
      text: "Do not lose hope in the mercy of Allah.",
      text_ar: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    },
  },
  {
    id: "patience",
    label: "Struggling",
    label_ar: "صابر",
    emoji: "⚓",
    color: "#8b5cf6",
    recommendation: {
      surah: 2,
      ayah: 153,
      text: "Indeed, Allah is with the patient.",
      text_ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    },
  },
];

export default function MoodGuide({ lang = "en", onJump }) {
  const [selectedMood, setSelectedMood] = useState(null);

  const txt = (en, ar) => (lang === "ar" ? ar : en);

  return (
    <section className="mood-guide-section container-width">
      <div className="mood-header">
        <span className="mood-badge">
          {txt("Spiritual Guidance", "الإرشاد الروحي")}
        </span>
        <h2>{txt("How are you feeling today?", "كيف تشعر اليوم؟")}</h2>
        <p>
          {txt(
            "Select an emotion to find comfort and guidance from the Holy Quran.",
            "اختر شعوراً لتجد الراحة والهداية من القرآن الكريم.",
          )}
        </p>
      </div>

      <div className="mood-selector">
        {moods.map((m) => (
          <button
            key={m.id}
            className={`mood-btn ${selectedMood?.id === m.id ? "active" : ""}`}
            onClick={() => setSelectedMood(m)}
            style={{ "--mood-color": m.color }}
          >
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-label">{txt(m.label, m.label_ar)}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div
          className="mood-result-card glass-panel"
          style={{ borderTop: `4px solid ${selectedMood.color}` }}
        >
          <div className="mood-result-content">
            <span className="quote-icon">“</span>
            <div className="arabic-text">
              {selectedMood.recommendation.text_ar}
            </div>
            <div className="translation-text">
              {selectedMood.recommendation.text}
            </div>
            <div className="mood-footer">
              <span className="ayah-ref">
                {txt("Surah", "سورة")} {selectedMood.recommendation.surah}:
                {selectedMood.recommendation.ayah}
              </span>
              <button
                className="btn jump-btn"
                onClick={() =>
                  onJump(
                    selectedMood.recommendation.surah,
                    selectedMood.recommendation.ayah,
                  )
                }
              >
                {txt("Read Full Ayah", "اقرأ الآية كاملة")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
