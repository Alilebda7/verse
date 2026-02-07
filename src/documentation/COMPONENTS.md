# Verse - Component Architecture

This document breaks down the React components used in the application.

---

## **1. `src/App.jsx`**

**Overview**: The root component.
**Responsibilities**:

- **Routing**: Handles URL routes (`/`, `/learn`, `/exam`).
- **Global State**: Stores user preferences (theme, reciter, etc.).
- **Audio Management**: Contains the `<audio>` element ref and controls.
- **Navigation**: Renders the persistent header and footer.
- **Composition**: Renders `SurahList`, `SurahDetail` (as needed), `PrayerTimes`.

---

## **2. `src/components/SurahList.jsx`**

**Overview**: Displays the library of 114 Surahs.
**Props**:

- `onSurahClick(id)`: Callback when a Surah is clicked.
  **Features**:
- **Search**: Filter by Arabic/English name or number.
- **Pagination**: Show subset of Surahs per page.
- **Sorting**: Sort by Standard or Revelation order.

---

## **3. `src/components/SurahDetail.jsx`**

**Overview**: The main Quran reader interface.
**Props**:

- `surahNumber`: ID of the Surah to fetch and display.
- `playingAyah`: Current playback state (for highlighting).
- `onBack`: Callback to return to the list.
  **Features**:
- **View Modes**: Toggle between Mushaf (Page) and Verse (List) modes.
- **Settings**: Adjust font size, family, and translation language.
- **Interactions**: Play Ayah, View Translation/Tafsir, Bookmark.

---

## **4. `src/components/JuzList.jsx`**

**Overview**: Displays the 30 Juzs (Parts) of the Quran.
**Features**:

- **Logic**: Calculates start/end Ayahs for each Juz based on metadata.

---

## **5. `src/components/PrayerTimes.jsx`**

**Overview**: A widget displaying daily prayer times.
**State**:

- `prayerTimes`: { Fajr, Dhuhr, Asr, Maghrib, Isha, Sunrise }.
- `location`: City, Country.
  **Effects**:
- Fetches location and timings on mount.
- Updates periodically.

---

## **6. `src/components/LessonPage.jsx`**

**Overview**: Interactive lesson viewer.
**Props**:

- `id`: Lesson ID (from URL params).
  **Features**:
- **Content**: Displays lesson steps defined in `data/learnTopics.js`.
- **Quiz**: Embedded quiz at the end of the lesson.
- **Progress**: Tracks completion in `localStorage`.

---

## **7. `src/components/ExamPage.jsx`**

**Overview**: Final exam interface.
**Props**:

- `id`: Exam ID (typically matches lesson ID).
  **Features**:
- **Assessment**: Multiple-choice questions.
- **Scoring**: Calculates final score upon submission.

---

## **8. `src/components/Duas.jsx`**

**Overview**: A collection of authentic Duas.
**Data**: `data/duas.js`.
**Features**:

- **Filtering**: By category.
- **Languages**: Switch translation (English, Arabic, etc.).
- **Copy**: Copy full Dua or individual fields (Arabic/Transliteration).
