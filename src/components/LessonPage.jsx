import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import topics from "../data/learnTopics";
import "../styles/LearnSection.css";

export default function LessonPage() {
  const { id } = useParams();
  const topic = topics.find((t) => t.id === id);

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState(() => {
    try {
      const raw = localStorage.getItem(`lesson_attempts_${id}`);
      return raw ? JSON.parse(raw) : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    if (!topic) return;
    // support both single-question format and multi-question format
    if (topic.quiz && Array.isArray(topic.quiz.questions)) {
      setQuestions(topic.quiz.questions);
    } else if (topic.quiz) {
      setQuestions([
        { q: topic.quiz.q, options: topic.quiz.options, a: topic.quiz.a },
      ]);
    } else {
      setQuestions([]);
    }
  }, [topic]);

  if (!topic)
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson not found</h2>
        <p>The lesson you're looking for doesn't exist.</p>
        <Link to="/">Back Home</Link>
      </div>
    );

  const selectOption = (i) => {
    if (finished) return;
    setSelected(i);
  };

  const submit = () => {
    if (selected === null) return;
    setAnswers((s) => [...s, { selected, correct: questions[current].a }]);
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      try {
        localStorage.setItem(
          `lesson_attempts_${id}`,
          JSON.stringify(newAttempts),
        );
      } catch (e) {}
      setFinished(true);
    }
  };

  const redo = () => {
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  const score = finished
    ? answers.filter((a) => a.selected === a.correct).length
    : null;

  return (
    <div className="lesson-page enhanced-lesson" style={{ padding: 24 }}>
      <div className="lesson-grid">
        <aside className="lesson-sidebar">
          <div className="lesson-progress-card">
            <h4>Lesson</h4>
            <h2>{topic.title}</h2>
            <p className="muted">Attempts: {attempts}</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(answers.length / Math.max(1, questions.length)) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="brand-row">
            <div className="verse-logo">V</div>
            <div className="brand-meta">
              <div className="brand-name">Verse</div>
              <div className="brand-sub">Learning</div>
            </div>
          </div>
          <div className="lesson-steps-list">
            <h4>Steps</h4>
            <ol>
              {(topic.steps || [topic.content]).map((s, i) => (
                <li key={i} className={i === current ? "active" : ""}>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </aside>

        <main className="lesson-main">
          <div className="lesson-hero-card hero-branded">
            <div className="hero-top">
              <div className="verse-mark">Verse</div>
              <div className="hero-badges">
                <span className="badge">📘 Lesson</span>
                <span className="badge">⏱️ Quick</span>
              </div>
            </div>
            <h1>{topic.title}</h1>
            <p className="lead">{topic.short}</p>
            <div className="lesson-overview">{topic.content}</div>
          </div>

          <section className="quiz-section" id={`learn-quiz-${topic.id}`}>
            <div className="quiz-header">
              <h3>Quiz</h3>
              <div className="hero-top">
                <div className="verse-mark">Verse</div>
                <div className="hero-badges">
                  <span className="badge">🌟 Featured</span>
                  <span className="badge">⏱️ 5 min</span>
                  <span className="badge">🧠 Beginner</span>
                </div>
              </div>
              <div className="quiz-meta">
                Question {Math.min(current + 1, questions.length)} of{" "}
                {questions.length}
              </div>
            </div>

            {!finished && questions.length > 0 && (
              <>
              <div className="quiz-card">
                <p className="quiz-q">{questions[current].q}</p>
                <div className="quiz-options">
                  {questions[current].options.map((opt, i) => {
                    const answered = answers[current];
                    const isSelected = selected === i;
                    const willBeCorrect =
                      finished && i === questions[current].a;
                    const isWrong =
                      finished &&
                      answered &&
                      answered.selected === i &&
                      answered.selected !== answered.correct;
                    return (
                      <button
                        key={i}
                        className={`quiz-opt ${isSelected ? "selected" : ""} ${willBeCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                        onClick={() => selectOption(i)}
                      >
                        <div className="opt-left">
                          {isSelected ? "👉" : "✦"}
                        </div>
                        <div className="opt-text">{opt}</div>
                      </button>
                    );
                  })}
                </div>

                  <div className="quiz-actions">
                    <button
                      className="btn"
                      onClick={submit}
                      disabled={selected === null}
                    >
                      {current < questions.length - 1 ? "Next" : "Finish"}
                    </button>
                    <button className="btn-outline" onClick={redo}>
                      Redo Quiz
                    </button>
                  </div>
  
                  <div style={{ marginTop: 18 }}>
                    <button
                      className="btn"
                      onClick={() => {
                        // mark current step done
                        const key = `lesson_done_${id}`;
                        try {
                          const raw = localStorage.getItem(key);
                          const done = raw ? JSON.parse(raw) : [];
                          if (!done.includes(current)) done.push(current);
                          localStorage.setItem(key, JSON.stringify(done));
                          setAnswers((s) => {
                            // reflect completion visually via answers array
                            const next = [...s];
                            next[current] = { selected: null, correct: null };
                            return next;
                          });
                        } catch (e) {}
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
                </>
            )}

            {finished && (
              <div className="quiz-results">
                <h3>Results</h3>
                <div className="score-badge">
                  {score}/{questions.length}
                </div>
                <p>
                  You answered {score} out of {questions.length} correctly.
                </p>
                <div className="results-actions">
                  <button className="btn" onClick={redo}>
                    Try Again
                  </button>
                  <Link to="/" className="btn-outline">
                    Back Home
                  </Link>
                </div>

                <div className="review-answers">
                  <h4>Review</h4>
                  <ol>
                    {questions.map((q, i) => {
                      const ans = answers[i];
                      const correctIdx = q.a;
                      return (
                        <li key={i}>
                          <div className="review-q">{q.q}</div>
                          <div className="review-row">
                            <div
                              className={`review-opt ${ans && ans.selected === correctIdx ? "correct" : ""}`}
                            >
                              Correct: {q.options[correctIdx]}
                            </div>
                            <div
                              className={`review-opt ${ans && ans.selected !== correctIdx ? "wrong" : ""}`}
                            >
                              Your answer: {ans ? q.options[ans.selected] : "-"}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
