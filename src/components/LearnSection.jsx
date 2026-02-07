import React from "react";
import { Link } from "react-router-dom";
import "../styles/LearnSection.css";
import topics from "../data/learnTopics";
export default function LearnSection({ lang = "en" }) {
  const txt = (en, ar) => (lang === "ar" ? ar : en);
  // Simple hero + card grid representation to match the requested design
  const preview = topics.slice(0, 3);

  return (
    <section id="learn" className="learn-section learn-hero">
      <div className="learn-hero-inner">
        <div className="learn-hero-left">
          <h1>
            {txt(
              "Learn Quran and Islam basics everyday.",
              "تعلم أساسيات القرآن والإسلام يومياً.",
            )}
          </h1>
          <p className="learn-hero-sub">
            {txt(
              "Short, friendly lessons and practical quizzes to get you started — one step at a time.",
              "دروس قصيرة وودودة واختبارات عملية لتبدأ بها — خطوة بخطوة.",
            )}
          </p>
        </div>
        <div className="learn-hero-cards">
          {preview.map((t) => (
            <article key={t.id} className="learn-hero-card">
              <div
                className="learn-card-image"
                style={{
                  backgroundImage: `url(${t.image || `https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=60`})`,
                }}
                aria-hidden
              />
              <div className="learn-card-body">
                <h3>{txt(t.title, t.title_ar || t.title)}</h3>
                <p className="learn-card-excerpt">
                  {txt(t.short, t.short_ar || t.short)}
                </p>
                <div className="learn-card-actions">
                  <Link to={`/learn/${t.id}`} className="btn">
                    {txt("Read more", "اقرأ المزيد")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
