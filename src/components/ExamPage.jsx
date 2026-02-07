import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import topics from "../data/learnTopics";
import logo from "../images/icon.png";
import "../styles/LearnSection.css";

export default function ExamPage() {
  const { id } = useParams();
  const topic = topics.find((t) => t.id === id);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  if (!topic)
    return (
      <div style={{ padding: 24 }}>
        <h2>Exam Not Found</h2>
        <Link to="/">Back Home</Link>
      </div>
    );

  const questions =
    topic.quiz && Array.isArray(topic.quiz.questions)
      ? topic.quiz.questions
      : [{ q: topic.quiz.q, options: topic.quiz.options, a: topic.quiz.a }];

  const toggleAnswer = (qi, idx) => {
    if (finished) return;
    setAnswers((s) => ({ ...s, [qi]: idx }));
  };

  const submitExam = () => {
    setFinished(true);
  };

  const score = finished
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.a ? 1 : 0), 0)
    : null;

  return (
    <div className="lesson-page" style={{ padding: 24 }}>
      <div className="lesson-grid">
        <aside className="lesson-sidebar">
          <div className="lesson-progress-card">
            <img src={logo} alt="Verse logo" style={{ width: 48 }} />
            <h4>Final Exam</h4>
            <h2>{topic.title}</h2>
            <p className="muted">Good luck!</p>
          </div>
        </aside>

        <main className="lesson-main">
          <div className="lesson-hero-card hero-branded">
            <h1>Final Exam — {topic.title}</h1>
            <p className="lead">
              This exam appears after you complete the lesson steps.
            </p>
            {!started ? (
              <div style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => setStarted(true)}>
                  Start Exam
                </button>
                <Link
                  to={`/learn/${id}`}
                  className="btn-outline"
                  style={{ marginLeft: 8 }}
                >
                  Back
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: 12 }}>
                {questions.map((q, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ fontWeight: 700 }}>
                      {i + 1}. {q.q}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      {q.options.map((opt, j) => (
                        <button
                          key={j}
                          className={`quiz-opt ${answers[i] === j ? "selected" : ""} ${finished && q.a === j ? "correct" : ""}`}
                          onClick={() => toggleAnswer(i, j)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {!finished ? (
                  <div style={{ marginTop: 8 }}>
                    <button className="btn" onClick={submitExam}>
                      Submit Exam
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: 12 }}>
                    <div className="score-badge">
                      Score: {score}/{questions.length}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Link to={`/learn/${id}`} className="btn-outline">
                        Back to Lesson
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
