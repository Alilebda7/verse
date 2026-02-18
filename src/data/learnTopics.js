const topics = [
  {
    id: "quran-basics",
    title: "Quran Basics",
    title_ar: "أساسيات القرآن",
    short: "Learn about the revelation and structure of the Holy Quran.",
    short_ar: "تعلم عن نزول وبنية القرآن الكريم.",
    content:
      "The Quran was revealed to Prophet Muhammad (PBUH) over 23 years...",
    steps: [
      "Understanding Revelation",
      "Structure of Surahs and Ayahs",
      "Importance of Tajweed",
    ],
    quiz: {
      questions: [
        {
          q: "How many years was the Quran revealed over?",
          options: ["10 years", "23 years", "40 years", "5 years"],
          a: 1,
        },
      ],
    },
  },
  {
    id: "five-pillars",
    title: "Five Pillars of Islam",
    title_ar: "أركان الإسلام الخمسة",
    short: "The foundation of a Muslim's life and faith.",
    short_ar: "أساس حياة وإيمان المسلم.",
    content:
      "Islam is built upon five pillars: Shahada, Salah, Zakat, Sawm, and Hajj.",
    steps: [
      "The Declaration of Faith",
      "Establishing Prayer",
      "Charity and Fasting",
      "The Pilgrimage",
    ],
    quiz: {
      questions: [
        {
          q: "Which pillar refers to the daily prayers?",
          options: ["Zakat", "Sawm", "Salah", "Hajj"],
          a: 2,
        },
      ],
    },
  },
];

export default topics;
