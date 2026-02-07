# Features Documentation

This document provides an exhaustive list of every feature implemented in the Verse application, detailing the logic, user interactions, and underlying code behaviors.

---

## 1. Global Audio Player ("The Sound Bar")

The audio player is a persistent, global component that manages Quranic recitation across the entire application.

### **A. Core Playback Controls**

- **Play / Pause**:
  - **Logic**: Toggles the HTML5 Audio `play()` and `pause()` methods.
  - **State**: Controlled by `isPlaying` state.
  - **UI**: Toggles between Play (`IconPlay`) and Pause (`IconPause`) icons.
  - **Loading State**: Displays a spinner if `isAudioLoading` is true (waiting for API response or audio buffering).
- **Surah Navigation (Skip)**:
  - **Previous Surah**:
    - **Action**: Decrements the current Surah ID (e.g., from Surah 18 to 17).
    - **Constraint**: Disabled if current Surah is 1 (Al-Fatiha).
  - **Next Surah**:
    - **Action**: Increments the current Surah ID.
    - **Constraint**: Disabled if current Surah is 114 (An-Naas).
- **Auto-Advance (Ayah Flow)**:
  - **Logic**: The `ended` event listener on the audio element determines the next action.
  - **Default Behavior**: Automatically fetches and plays the _next_ ayah in the Surah logic sequence.
  - **End of Surah**: Stops playback when the last ayah of the current Surah finishes (unless Repeat All is active).

### **B. Advanced Audio Features**

- **Reciter Selection**:
  - **Feature**: Dropdown menu listing 6 distinct reciters (e.g., Mishary Alafasy, Abdul Basit).
  - **Logic**:
    - Updates `selectedReciter` state.
    - **Cache Clearing**: Instantly clears `surahAudioCache` to ensure the new reciter's audio is fetched.
    - **Persistence**: Saves selection to `localStorage` key `selectedReciter`.
  - **UI**: Custom dropdown that detects screen position (`reciterOpenUp`) to open upwards if near the bottom of the screen.
- **Repeat Modes**:
  - **Modes**:
    1.  **Repeat Off**: Plays through linearly.
    2.  **Repeat One**: Loops the _current Ayah_ indefinitely (`audio.currentTime = 0; audio.play()`).
    3.  **Repeat All**: Loops the _entire Surah_ (when last ayah ends, jumps back to first ayah).
  - **Persistence**: Saved to `localStorage` key `repeatMode`.
- **Playback Speed**:
  - **Values**: 0.5x, 0.75x, 1x (Normal), 1.25x, 1.5x, 2x.
  - **Implementation**: Directly updates `audioRef.current.playbackRate`.
  - **Persistence**: Saved to `localStorage`.
- **Volume Control**:
  - **Input**: Range slider (0 to 1).
  - **Logic**: Updates `audioRef.current.volume`.
  - **Visuals**: Dynamic volume icon changes based on level (High, Medium, Low/Mute).

### **C. Information Display**

- **Now Playing**:
  - Shows the **English Name** and **Ayah Number** of the active verse.
  - **Interactive**: Clicking the text navigates the user directly to that Surah's detail view (`SurahDetail` component).
- **Hero Mode vs. Fixed Mode**:
  - **Hero**: Displayed inline within the landing page header with an expanded design (includes Arabic name).
  - **Fixed**: Sticks to the bottom of the viewport when scrolling or navigating other pages.

---

## 2. Surah Reader (Reading Experience)

The core reading interface supports two distinct viewing modes.

### **A. View Modes**

- **Mushaf Mode (Page View)**:
  - **Concept**: Mimics a physical Quran page layout.
  - **Word Interaction**:
    - **Hover Effect**: Hovering over any Arabic word triggers a fetch to Google Translate API.
    - **Tooltip**: Displays a word-by-word translation in a floating tooltip.
  - **Pagination**: "Previous Page" and "Next Page" buttons load specific Mushaf pages from the API.
  - **Tajweed**: Toggleable support for Tajweed rules.
- **Verse-by-Verse Mode (List View)**:
  - **Concept**: Vertical list where each card represents one Ayah.
  - **Content**: Displays Arabic text, Full Translation, and Action Buttons side-by-side.

### **B. Reader Customization Settings**

- **Font Size**: Incremental controls (A-, A+) modifying pixel size (range: 24px - 64px).
- **Font Style**: Selection of fonts:
  - _Amiri_ (Naskh style, highly readable).
  - _Scheherazade New_ (Traditional).
  - _Lateef_ (Cursive-like).
- **Translation Language**:
  - Switch entire translation context between English, Arabic (Tafsir-like), French, German, etc.
- **Tajweed Toggle**:
  - **On**: Parsed text inserts color-coded spans (`<span class="tj-idgham">`) for pronunciation rules.
  - **Off**: Standard Uthmani script.

### **C. Ayah Actions (Popover Menu)**

Clicking any Ayah in Mushaf mode opens a contextual menu with:

1.  **Play**: Starts audio from that specific verse.
2.  **Translation**: Opens a modal with the full text translation.
3.  **Tafsir**:
    - Fetches **Tafsir Al-Jalalayn** from the API.
    - Displays in a dedicated modal window.
    - Handles loading and error states.
4.  **Bookmark**:
    - Toggles bookmark status.
    - **Storage**: Saves to `localStorage` (`quran_bookmarks`).
    - **Visual**: Icon changes to filled state.
5.  **Copy**:
    - Formats text as: `Surah Name (Ayah #) \n Arabic Text \n Translation`.
    - Copies to system clipboard.
6.  **Share**: (Placeholder for future social sharing).

---

## 3. Quran Navigation System

### **A. Surah List**

- **Grid Layout**: Responsive grid of Surah cards.
- **Card Details**:
  - Surah Number (Ghost overlay & Badge).
  - Arabic & English Names.
  - Meaning of the name.
  - Ayah count & Revelation Type (Meccan/Medinan).
- **Filtering & Search**:
  - Real-time filtering by **English Name** or **Surah Number**.
- **Sorting**:
  - **Default**: Ascending order (1-114).
  - **Revelation Order**: Sorts based on historical revelation sequence.
- **Pagination**: Client-side pagination (20 Surahs per page).

### **B. Juz List**

- **Logic**: Calculates Juz boundries dynamically using the Metadata API.
- **Display**: Shows which Surahs (and specific Verse ranges) are contained locally within each Juz.
- **Interaction**: Clicking a Juz/Surah segment jumps to that specific starting verse.

---

## 4. Prayer Times & Location

- **Geolocation Strategy**:
  1.  **Browser API**: Attempts `navigator.geolocation.getCurrentPosition`.
  2.  **Reverse Geocoding**: Converts Lat/Lon to City/Country using `nominatim.openstreetmap.org`.
  3.  **Fallback**: Defaults to "Mecca, Saudi Arabia" if permission denied.
  4.  **Manual Retry**: User can force a location refresh.
- **Timing Calculation**:
  - Uses `api.aladhan.com` (Method 4 - Umm Al-Qura).
  - Displays: Fajr, Dhuhr, Asr, Maghrib, Isha, Sunrise.
- **Time Format**: Toggle between 12-hour (AM/PM) and 24-hour formats.
- **Hijri Date**: Displays accurate Islamic date fetched alongside prayer times.

---

## 5. Learning & Educational Modules

- **Lesson Progress**:
  - Tracks "Attempts" and "Completion" per lesson ID.
  - Visual Progress Bar updates as questions are answered.
- **Quiz Engine**:
  - Supports Single or Multi-question quizzes.
  - **Interaction**: Select option -> Feedback (Correct/Wrong) -> Next.
  - **Review Mode**: Shows Correct vs Selected answers after completion.
- **Final Exam**:
  - Aggregated questions from the topic.
  - calculates final score.

---

## 6. Duas (Supplications) Library

- **Categorization**: Grouped by occasion (Travel, Sleep, Home, etc.).
- **Multi-Language Support**:
  - Maps internal translation keys to readable names (English, Urdu, French, etc.).
  - Filters available translations based on selection.
- **Copy Tools**:
  - **Copy All**: Copies every Dua in the current category.
  - **Copy Field**: Copies specific segments (Arabic / Transliteration / Translation).

---

## 7. Analytics & "Active Listeners"

- **Live Counter**:
  - Fetches from `counterapi.dev` using a daily key (`verse-islam/daily-YYYY-MM-DD`).
- **De-Duplication**:
  - **Logic**: Prevents inflating numbers by checking:
    1.  `localStorage` flag (`last_listener_count_date`).
    2.  IP-based redundancy check via `api.ipify.org` (client-side check only).
  - **Increment Trigger**: Only increments when a user actually **Plays** an audio track.
