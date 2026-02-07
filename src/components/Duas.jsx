import { useState, useMemo, useEffect } from "react";
import "../styles/Duas.css";
import duasData from "../data/duas";

export default function Duas({ lang: appLang = "en" }) {
  const [selected, setSelected] = useState(0);
  const [lang, setLang] = useState(appLang);

  const txt = (en, ar) => (appLang === "ar" ? ar : en);
  const item = duasData[selected] || { title: "-", duas: [] };

  // Sync internal translation choice if app lang changes
  useEffect(() => {
    setLang(appLang);
  }, [appLang]);

  const languages = useMemo(() => {
    const detected = new Set();
    duasData.forEach((o) =>
      o.duas.forEach((d) =>
        Object.keys(d.translations || {}).forEach((k) => detected.add(k)),
      ),
    );

    // Helpful default language codes to expose
    const defaults = ["en", "ar", "ur", "fr", "es", "id", "bn", "tr"];
    defaults.forEach((l) => detected.add(l));

    const langLabels = {
      en: "English",
      ar: "Arabic",
      ur: "Urdu",
      fr: "Français",
      es: "Español",
      id: "Bahasa Indonesia",
      bn: "বাংলা",
      tr: "Türkçe",
    };

    const arr = Array.from(detected);
    arr.sort((a, b) => (langLabels[a] || a).localeCompare(langLabels[b] || b));

    return arr.map((code) => ({
      code,
      label: langLabels[code] || code.toUpperCase(),
    }));
  }, []);

  const copyAll = async () => {
    const text = item.duas
      .map((d, i) => {
        const t = d.translations[lang] || d.translations["en"] || "";
        return `${i + 1}. ${d.arabic}\n${d.transliteration}\n${t}\n`;
      })
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Duas copied to clipboard");
    } catch (e) {
      alert("Could not copy");
    }
  };

  const copySingle = async (d) => {
    const t = d.translations[lang] || d.translations["en"] || "";
    const text = `${d.arabic}\n${d.transliteration}\n${t}\nSource: ${d.source || "Unknown — verify reference"}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Dua copied to clipboard");
    } catch (e) {
      alert("Could not copy");
    }
  };

  const copyField = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied`);
    } catch (e) {
      alert("Could not copy");
    }
  };

  return (
    <section id="duas" className="duas-main">
      <div className="duas-header section-intro">
        <h2>{txt("Read The Duas and Pray", "اقرأ الأدعية وصلي")}</h2>
        <div className="duas-ar-art" aria-hidden>
          الأدعية
        </div>
        <div className="duas-sub">
          {txt(
            "Authentic duas for common occasions",
            "أدعية صحيحة لمختلف المناسبات",
          )}
        </div>
      </div>

      <div className="duas-body">
        <aside className="duas-list">
          <ul>
            {duasData.map((o, i) => (
              <li
                key={o.id}
                className={i === selected ? "active" : ""}
                onClick={() => setSelected(i)}
              >
                {txt(o.title, o.title_ar || o.title)}
              </li>
            ))}
          </ul>
        </aside>

        <div className="duas-detail">
          <div className="duas-controls">
            <label>
              {txt("Language:", "اللغة:")}
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                {languages.length ? (
                  languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))
                ) : (
                  <option value="en">English</option>
                )}
              </select>
            </label>
            <button className="btn small" onClick={copyAll}>
              {txt("Copy All", "نسخ الكل")}
            </button>
          </div>

          <h4 className="duas-title">
            {txt(item.title, item.title_ar || item.title)}
            <span className="duas-count">{item.duas.length}</span>
          </h4>

          <div className="dua-items">
            {item.duas.map((d, idx) => (
              <div className="dua-card" key={idx}>
                <div className="dua-card-top">
                  <div className="dua-arabic" dir="rtl">
                    {d.arabic}
                  </div>
                  <button
                    className="dua-copy"
                    onClick={() => copySingle(d)}
                    aria-label={`Copy dua ${idx + 1}`}
                  >
                    {txt("Copy", "نسخ")}
                  </button>
                </div>

                <div className="dua-translit-row">
                  <div className="dua-translit">{d.transliteration}</div>
                  <button
                    className="field-copy"
                    onClick={() =>
                      copyField(d.transliteration, "Transliteration")
                    }
                    aria-label={`Copy transliteration ${idx + 1}`}
                  >
                    {txt("Copy", "نسخ")}
                  </button>
                </div>

                <div className="dua-translation-row">
                  <div className="dua-translation">
                    {d.translations[lang] ||
                      d.translations["en"] ||
                      "(Translation not available)"}
                  </div>
                  <button
                    className="field-copy"
                    onClick={() =>
                      copyField(d.translations[lang] || "", "Translation")
                    }
                    aria-label={`Copy translation ${idx + 1}`}
                  >
                    Copy
                  </button>
                </div>
                <div className="dua-source">
                  {d.source
                    ? `Source: ${d.source}`
                    : "Source: Unknown — verify reference"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
