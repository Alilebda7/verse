const topics = [
  {
    id: "intro",
    title: "Introduction to Islam",
    title_ar: "مقدمة عن الإسلام",
    short: "Core beliefs: Tawhid, prophethood, day of judgement.",
    short_ar: "العقيدة الأساسية: التوحيد، النبوة، يوم القيامة.",
    content:
      "Islam is a monotheistic Abrahamic religion teaching belief in one God (Allah), the prophets, revealed books, angels, the Day of Judgment, and divine decree.",
    steps: [
      "Islam centers on belief in one God (Tawhid) and living a life in submission to His will.",
      "Prophets were sent to guide humanity — Muslims believe Muhammad is the final prophet.",
      "Belief in the Day of Judgment encourages moral responsibility and accountability.",
    ],
    quiz: {
      q: "What is the central concept of Islam?",
      options: ["Polytheism", "Tawhid (Oneness of God)", "Reincarnation"],
      a: 1,
    },
  },
  {
    id: "fivepillars",
    title: "Five Pillars",
    title_ar: "أركان الإسلام الخمسة",
    short: "Shahada, Salah, Zakat, Sawm, Hajj.",
    short_ar: "الشهادة، الصلاة، الزكاة، الصوم، الحج.",
    content:
      "The Five Pillars are core practices: declaration of faith, prayer, almsgiving, fasting in Ramadan, and pilgrimage to Mecca.",
    steps: [
      "Shahada: declaration of faith — there is no god but Allah and Muhammad is His messenger.",
      "Salah: the five daily prayers that structure a Muslim's day.",
      "Zakat, Sawm, and Hajj complete the pillars: charity, fasting, and pilgrimage.",
    ],
    quiz: {
      q: "Which pillar is the fasting during Ramadan?",
      options: ["Salah", "Sawm", "Zakat"],
      a: 1,
    },
  },
  {
    id: "quran",
    title: "The Quran",
    title_ar: "القرآن الكريم",
    short: "The revealed book of Islam in Arabic.",
    short_ar: "كتاب الإسلام المنزل باللغة العربية.",
    content:
      "The Quran is believed to be the word of God revealed to Prophet Muhammad. It contains guidance for life, law, and spirituality.",
    steps: [
      "The Quran was revealed over 23 years and is preserved in Arabic.",
      "It serves as guidance for all aspects of life — personal, legal, and spiritual.",
      "Recitation (tilawah) is a major devotional act; learning proper recitation is encouraged.",
    ],
    quiz: {
      q: "The Quran was revealed to which prophet?",
      options: ["Moses", "Jesus", "Muhammad"],
      a: 2,
    },
  },
  {
    id: "prophets",
    title: "Prophets in Islam",
    title_ar: "الأنبياء في الإسلام",
    short: "From Adam to Muhammad (peace be upon them).",
    short_ar: "من آدم إلى محمد (عليهم السلام).",
    content:
      "Islam recognizes many prophets, including Adam, Noah, Abraham, Moses, Jesus, and Muhammad — all preached submission to God.",
    steps: [
      "Prophets conveyed God's message and called people to worship the One God.",
      "Many prophets are shared with Judaism and Christianity, though their stories may differ.",
      "Muhammad is considered the Seal of the Prophets, completing the prophetic message.",
    ],
    quiz: {
      q: "Are Jesus and Moses considered prophets in Islam?",
      options: ["Yes", "No", "Only Moses"],
      a: 0,
    },
  },
  {
    id: "ihsan",
    title: "Ihsan (Excellence)",
    title_ar: "الإحسان",
    short: "The spiritual dimension: worship as if you see God.",
    short_ar: "البعد الروحي: أن تعبد الله كأنك تراه.",
    content:
      "Ihsan means excellence — worshiping God as if you see Him, and if you cannot see Him, knowing that He sees you.",
    steps: [
      "Ihsan is the inner dimension of faith — sincerity and excellence in actions.",
      "It transforms ritual acts into deep spiritual practices, encouraging mindfulness and compassion.",
      "Practical Ihsan: honest dealings, humility, and kindness to others.",
    ],
    quiz: {
      q: "Which best describes Ihsan?",
      options: [
        "Legal rulings",
        "Inner excellence and sincerity",
        "Historical facts",
      ],
      a: 1,
    },
  },
];

export default topics;
