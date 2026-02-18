import React, { useState, useEffect } from "react";
import "../styles/Footer.css";
import logo from "../images/icon.png";

const DAILY_WISDOMS = [
  {
    text: "So remember Me; I will remember you.",
    source: "Surah Al-Baqarah 2:152",
    source_ar: "سورة البقرة ٢:١٥٢",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
  },
  {
    text: "Indeed, with hardship [will be] ease.",
    source: "Surah Ash-Sharh 94:6",
    source_ar: "سورة الشرح ٩٤:٦",
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
  },
  {
    text: "And He is with you wherever you are.",
    source: "Surah Al-Hadid 57:4",
    source_ar: "سورة الحديد ٥٧:٤",
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
  },
  {
    text: "Call upon Me; I will respond to you.",
    source: "Surah Ghafir 40:60",
    source_ar: "سورة غافر ٤٠:٦٠",
    arabic: "ادْعُونِي أَسْتَجِبْ لَكُمْ",
  },
  {
    text: "And whoever relies upon Allah – then He is sufficient for him.",
    source: "Surah At-Talaq 65:3",
    source_ar: "سورة الطلاق ٦٥:٣",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
  },
  {
    text: "Allah is Gentle with His servants.",
    source: "Surah Ash-Shura 42:19",
    source_ar: "سورة الشورى ٤٢:١٩",
    arabic: "اللَّهُ لَطِيفٌ بِعِبَادِهِ",
  },
  {
    text: "And be patient. Indeed, Allah is with the patient.",
    source: "Surah Al-Anfal 8:46",
    source_ar: "سورة الأنفال ٨:٤٦",
    arabic: "وَاصْبِرُوا إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
  },
  {
    text: "My mercy encompasses all things.",
    source: "Surah Al-A'raf 7:156",
    source_ar: "سورة الأعراف ٧:١٥٦",
    arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
  },
  {
    text: "Indeed, Allah loves those who trust Him.",
    source: "Surah Aal-E-Imran 3:159",
    source_ar: "سورة آل عمران ٣:١٥٩",
    arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ",
  },
  {
    text: "And speak to people good words.",
    source: "Surah Al-Baqarah 2:83",
    source_ar: "سورة البقرة ٢:٨٣",
    arabic: "وَقُولُوا لِلنَّاسِ حُسْنًا",
  },
  {
    text: "So truly where there is hardship, there is also ease.",
    source: "Surah Ash-Sharh 94:5",
    source_ar: "سورة الشرح ٩٤:٥",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
  },
  {
    text: "Indeed, Allah is Forgiving and Merciful.",
    source: "Surah An-Nisa 4:96",
    source_ar: "سورة النساء ٤:٩٦",
    arabic: "إِنَّ اللَّهَ كَانَ غَفُورًا رَّحِيمًا",
  },
  {
    text: "And whoever fears Allah – He will make for him a way out.",
    source: "Surah At-Talaq 65:2",
    source_ar: "سورة الطلاق ٦٥:٢",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    source: "Surah Al-Baqarah 2:286",
    source_ar: "سورة البقرة ٢:٢٨٦",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
  },
  {
    text: "And Allah is the best of planners.",
    source: "Surah Aal-E-Imran 3:54",
    source_ar: "سورة آل عمران ٣:٥٤",
    arabic: "وَاللَّهُ خَيْرُ الْمَاكِرِينَ",
  },
  {
    text: "Indeed, the remembrance of Allah brings peace to hearts.",
    source: "Surah Ar-Ra'd 13:28",
    source_ar: "سورة الرعد ١٣:٢٨",
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
  },
  {
    text: "And your Lord is not forgetful.",
    source: "Surah Maryam 19:64",
    source_ar: "سورة مريم ١٩:٦٤",
    arabic: "وَمَا كَانَ رَبُّكَ نَسِيًّا",
  },
  {
    text: "Indeed, Allah is with those who do good.",
    source: "Surah Al-Ankabut 29:69",
    source_ar: "سورة العنكبوت ٢٩:٦٩",
    arabic: "إِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ",
  },
  {
    text: "And whoever is mindful of Allah, He will make his matter easy.",
    source: "Surah At-Talaq 65:4",
    source_ar: "سورة الطلاق ٦٥:٤",
    arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مِنْ أَمْرِهِ يُسْرًا",
  },
  {
    text: "Indeed, Allah is Subtle with whom He wills.",
    source: "Surah Yusuf 12:100",
    source_ar: "سورة يوسف ١٢:١٠٠",
    arabic: "إِنَّ رَبِّي لَطِيفٌ لِّمَا يَشَاءُ",
  },
  {
    text: "Say: Nothing will happen to us except what Allah has decreed for us.",
    source: "Surah At-Tawbah 9:51",
    source_ar: "سورة التوبة ٩:٥١",
    arabic: "قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
  },
  {
    text: "And whoever puts their trust in Allah – He is sufficient for them.",
    source: "Surah At-Talaq 65:3",
    source_ar: "سورة الطلاق ٦٥:٣",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
  },
  {
    text: "Indeed, Allah loves those who are constantly repentant.",
    source: "Surah Al-Baqarah 2:222",
    source_ar: "سورة البقرة ٢:٢٢٢",
    arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ",
  },
];

export default function Footer({ lang = "en", t }) {
  const [wisdom, setWisdom] = useState(DAILY_WISDOMS[0]);

  useEffect(() => {
    const index = new Date().getDate() % DAILY_WISDOMS.length;
    setWisdom(DAILY_WISDOMS[index]);
  }, []);

  // Helpers for text not in global translations yet
  const txt = (en, ar) => (lang === "ar" ? ar : en);

  // Fallback T if undefined (dev safety)
  const T = t || {
    footer_mission: "Verse is dedicated...",
    footer_explore: "Explore",
    link_quran: "The Holy Quran",
    link_learn: "Learn Basics",
    link_adhkar: "Daily Adhkar",
    link_prayer: "Prayer Times",
    link_names: "99 Names",
    daily_wisdom: "Daily Wisdom",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookie: "Cookie Policy",
    copyright: "© 2024 Verse. All rights reserved.",
  };

  return (
    <footer className="site-footer" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="footer-content container-width">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src={logo} alt="Verse Logo" className="footer-logo-img" />
            <div className="logo-text">
              <h2>Verse</h2>
              <span>{txt("The Quranic Journey", "الرحلة القرآنية")}</span>
            </div>
          </div>
          <p className="brand-mission">{T.footer_mission}</p>
          <div className="social-links">
            <a href="https://github.com/Alilebda7/verse" aria-label="Github">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col links-col">
          <h3 className="col-header">{T.footer_explore}</h3>
          <ul className="footer-links">
            <li>
              <a href="#quran">{T.link_quran}</a>
            </li>
            <li>
              <a href="#duas">{T.link_adhkar}</a>
            </li>
            <li>
              <a href="#prayer-times">{T.link_prayer}</a>
            </li>
            <li>
              <a href="#names">{T.link_names}</a>
            </li>
          </ul>
        </div>

        {/* Support Column */}
        <div className="footer-col links-col">
          <h3 className="col-header">{txt("Support", "الدعم")}</h3>
          <ul className="footer-links">
            <li>
              <a
                href="mailto:alilebda6@gmail.com"
                className="footer-contact-link-premium"
              >
                <div className="contact-icon">✉</div>
                <div className="contact-text">
                  <span className="contact-label">
                    {txt("Contact Support", "اتصل بالدعم")}
                  </span>
                  <span className="contact-email">alilebda6@gmail.com</span>
                </div>
              </a>
            </li>
            <li className="donate-li">
              <div className="donate-card-mini">
                <span className="donate-badge">{txt("Donate", "تبرع")}</span>
                <p>{txt("Support the project", "ادعم المشروع")}</p>
                <button disabled className="donate-btn-disabled">
                  {txt("Coming Soon", "قريباً")}
                </button>
              </div>
            </li>
          </ul>
        </div>

        {/* Daily Wisdom Column */}
        <div className="footer-col subscribe-col">
          <div className="wisdom-card">
            <span className="wisdom-label">{T.daily_wisdom}</span>
            <p className="wisdom-arabic">{wisdom.arabic}</p>
            {/* Show English translation only in En mode, or maybe italicized in Ar mode? User said "Translate everything" */}
            {/* I will show English text only in En mode. For Ar mode, just Arabic verse is enough or maybe Tafsir (not available). */}
            {lang === "en" && <p className="wisdom-text">"{wisdom.text}"</p>}
            <span className="wisdom-source">
              — {txt(wisdom.source, wisdom.source_ar)}
            </span>
          </div>

          <div className="newsletter-mini">
            <label>
              {txt("Stay constant with updates", "ابق على تواصل مع التحديثات")}
            </label>
            <div className="input-group">
              <input
                type="email"
                placeholder={txt("Your email address", "البريد الإلكتروني")}
                disabled
              />
              <button disabled>{lang === "ar" ? "←" : "→"}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-pattern-overlay"></div>

      <div className="footer-bottom">
        <div className="container-width bottom-flex">
          <div className="copyright">
            {lang === "ar"
              ? `© ٢٠٢٤ فيرس. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} Verse. All rights reserved.`}
          </div>
          <div className="bottom-links">
            <a href="/privacy.html">{T.privacy}</a>
            <span className="separator">•</span>
            <a href="/terms.html">{T.terms}</a>
            <span className="separator">•</span>
            <a href="/cookies.html">{T.cookie}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
