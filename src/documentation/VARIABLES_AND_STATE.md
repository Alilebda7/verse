# Variables, State, and Functions Documentation

This document tracks all unique variables, state identifiers, functions, and methods across the codebase.

## 1. Global Files & Data

### `src/data/duas.js`

- **Variables**:
  - `duas`: Array of objects containing dua categories (id, title, duas list).

### `src/data/learnTopics.js`

- **Variables**:
  - `topics`: Array of objects containing learning modules (id, title, description, content, steps, quiz).

---

## 2. Components

### `src/App.jsx`

The main application shell managing global state, routing, and the audio player.

#### **Variables & State**

| Variable Name         | Type                | Description                                                 |
| --------------------- | ------------------- | ----------------------------------------------------------- |
| `activeTab`           | State (String)      | Stores current view in Quran section ("Surah", "Juz", etc.) |
| `selectedSurah`       | State (Number/Null) | ID of the currently active Surah (or null if in list view)  |
| `continueReadingData` | State (Object)      | info to resume reading (page, ayah number)                  |
| `theme`               | State (String)      | Current theme ("light" or "dark")                           |
| `reciterDropdownOpen` | State (Boolean)     | Toggles reciter selection dropdown                          |
| `repeatMenuOpen`      | State (Boolean)     | Toggles repeat mode menu                                    |
| `reciterOpenUp`       | State (Boolean)     | Determines dropdown direction based on screen space         |
| `isScrolled`          | State (Boolean)     | Tracks if window is scrolled past threshold                 |
| `playingAyah`         | State (Object)      | Currently playing ayah object                               |
| `playingSurahData`    | State (Object)      | Surah data for the currently playing audio                  |
| `isPlaying`           | State (Boolean)     | Audio playback status                                       |
| `isAudioLoading`      | State (Boolean)     | Loading indicator for audio fetch                           |
| `playbackSpeed`       | State (Number)      | Audio playback rate (0.5x - 2x)                             |
| `volume`              | State (Number)      | Audio volume level (0-1)                                    |
| `repeatMode`          | State (String)      | "none", "one", or "all"                                     |
| `selectedReciter`     | State (String)      | ID of the selected reciter                                  |
| `surahAudioCache`     | State (Object)      | Cache for fetched audio URLs                                |
| `dailyListeners`      | State (Number)      | Count of daily active listeners                             |
| `hasCountedToday`     | State (Boolean)     | Tracks if current user has been counted in analytics        |
| `todayKey`            | Constant            | Date string for analytics keys                              |
| `audioRef`            | Ref                 | Reference to the HTMLAudioElement                           |

#### **Functions**

- `incrementListeners()`: Updates analytics counter.
- `handleScroll()`: Updates `isScrolled` state.
- `handleClickOutside(event)`: Closes dropdowns when clicking outside.
- `handleSurahClick(surahNumber, jumpData)`: Navigates to Surah detail.
- `handleBackToSurahs()`: Return to list view.
- `saveLastRead(surah, ayahNum, page)`: Persists reading progress to localStorage.
- `playAyah(ayah, surahData)`: Handles audio playback logic.
- `toggleMasterPlay()`: Toggles play/pause for main control bar.
- `handlePrevSurah()`: Skips to previous Surah.
- `handleNextSurah()`: Skips to next Surah.
- `renderAudioBar(mode)`: Renders the audio player UI (hero or fixed).

---

### `src/components/SurahDetail.jsx`

Displays the Quran text (Mushaf or Verse mode) and handles deep interactions.

#### **Variables & State**

| Variable Name         | Type            | Description                                           |
| --------------------- | --------------- | ----------------------------------------------------- |
| `surahData`           | State (Object)  | Full Surah data from API                              |
| `translationData`     | State (Object)  | Translation text data                                 |
| `loading`             | State (Boolean) | Page loading state                                    |
| `currentMushafPage`   | State (Number)  | Current page number in Mushaf view                    |
| `pages`               | State (Array)   | List of pages in this Surah                           |
| `viewMode`            | State (String)  | "mushaf" or "verse"                                   |
| `pageData`            | State (Object)  | Data for the specific Mushaf page                     |
| `wordTranslations`    | State (Object)  | Cache of word-by-word translations                    |
| `hoveredWord`         | State (Object)  | Data for currently hovered word (translation tooltip) |
| `fontSize`            | State (Number)  | Text size in pixels                                   |
| `fontFamily`          | State (String)  | Font face name                                        |
| `showSettings`        | State (Boolean) | Toggles settings sidebar                              |
| `useTajweed`          | State (Boolean) | Toggles Tajweed color coding                          |
| `translationLanguage` | State (String)  | Selected translation language code                    |
| `selectedAyah`        | State (Object)  | Currently selected ayah for actions                   |
| `activeTranslation`   | State (Object)  | Data for translation modal                            |
| `activeTafsir`        | State (Object)  | Data for Tafsir modal                                 |
| `tafsirContent`       | State (String)  | Fetched Tafsir text                                   |
| `bookmarks`           | State (Array)   | List of bookmarked verses                             |

#### **Functions**

- `handleAyahClick(event, ayah)`: Selects ayah or toggles options.
- `toggleBookmark(ayah)`: Adds/removes verse from bookmarks.
- `handleTafsirOpen(ayah)`: Fetches and displays Tafsir.
- `handleTranslationOpen(ayah)`: Opens translation modal.
- `getLangCode(lang)`: Maps language names to API codes.
- `handleCopy(ayah)`: Copies ayah text and translation to clipboard.
- `wrapWordsIn(node, ayahNumber)`: DOM manipulation to make words interactive.
- `translateAndShow(spanEl, word)`: Fetches word translation from Google API.
- `toArabicNumerals(n)`: Converts numbers to Arabic, Urdu, or Persian digits.
- `parseTajweedText(text)`: Parses Tajweed formatting codes into HTML.

---

### `src/components/PrayerTimes.jsx`

Fetches and displays prayer times based on location.

#### **Variables & State**

| Variable Name | Type            | Description                         |
| ------------- | --------------- | ----------------------------------- |
| `prayerTimes` | State (Object)  | Object with prayer time strings     |
| `city`        | State (String)  | Detected or selected city           |
| `country`     | State (String)  | Detected or selected country        |
| `hijri`       | State (Object)  | Hijri date information              |
| `timezone`    | State (String)  | Timezone string                     |
| `use12Hour`   | State (Boolean) | Toggle for time format              |
| `now`         | State (Date)    | Current time (updates every second) |

#### **Functions**

- `getLocationAndTimings()`: Orchestrates geolocation and fetching.
- `fetchTimingsByCoords(lat, lon)`: API call by coordinates.
- `fetchTimingsByCity(c, co)`: API call by city name.
- `handleRetryLocation()`: Retries geolocation.

---

### `src/components/LessonPage.jsx`

Educational component for lessons and quizzes.

#### **Variables & State**

| Variable Name | Type            | Description                       |
| ------------- | --------------- | --------------------------------- |
| `questions`   | State (Array)   | List of quiz questions            |
| `current`     | State (Number)  | Index of current question         |
| `selected`    | State (Number)  | User's selected answer index      |
| `answers`     | State (Array)   | History of user answers           |
| `finished`    | State (Boolean) | Quiz completion status            |
| `attempts`    | State (Number)  | Count of attempts for this lesson |

#### **Functions**

- `selectOption(i)`: Updates selected answer.
- `submit()`: Confirms answer and advances.
- `redo()`: Resets quiz state.

---

### `src/components/Duas.jsx`

Displays category-based Duas.

#### **Variables & State**

| Variable Name | Type           | Description                    |
| ------------- | -------------- | ------------------------------ |
| `selected`    | State (Number) | Index of selected Dua category |
| `lang`        | State (String) | Selected translation language  |

#### **Functions**

- `copyAll()`: Copies all Duas in category.
- `copySingle(d)`: Copies a single Dua.
- `copyField(text, label)`: Helper for copying specific fields.

---

### `src/components/JuzList.jsx`

Lists Quranic Juzs for navigation.

#### **Variables & State**

| Variable Name | Type           | Description              |
| ------------- | -------------- | ------------------------ |
| `juzData`     | State (Array)  | Calculated Juz meta data |
| `currentPage` | State (Number) | Pagination index         |

#### **Functions**

- `fetchMeta()`: Fetches surah/juz structure from API to build list.
- `paginate(pageNumber)`: Handles pagination.

---

### `src/components/SurahList.jsx`

Lists Surahs with filtering and pagination.

#### **Variables & State**

| Variable Name | Type           | Description              |
| ------------- | -------------- | ------------------------ |
| `surahs`      | State (Array)  | List of all Surahs       |
| `searchTerm`  | State (String) | User input for filtering |
| `currentPage` | State (Number) | Pagination index         |

#### **Functions**

- `paginate(pageNumber)`: Handles pagination.

---

### `src/components/ExamPage.jsx`

Standalone exam page logic.

#### **Variables & State**

| Variable Name | Type            | Description                              |
| ------------- | --------------- | ---------------------------------------- |
| `started`     | State (Boolean) | Has exam started                         |
| `answers`     | State (Object)  | Map of question index to selected answer |
| `finished`    | State (Boolean) | Has exam finished                        |
| `score`       | Variable        | Calculated score                         |

#### **Functions**

- `toggleAnswer(qi, idx)`: Selects answer for a question.
- `submitExam()`: Marks exam as finished.

---

### `src/components/LearnSection.jsx` & `Footer.jsx`

Static or simple display components with no complex internal state.
