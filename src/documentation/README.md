# Verse - Project Documentation

Welcome to the Verse codebase documentation. This folder contains detailed information about the application's structure, variables, features, and external dependencies.

## **Navigation**

1.  **[Variables & State](VARIABLES_AND_STATE.md)**
    - Detailed breakdown of global state (`App.jsx`), component states, and default values.
2.  **[Features](FEATURES.md)**
    - Explanation of core features like Audio, Mushaf Rendering, Tajweed, and Analytics.
3.  **[Components](COMPONENTS.md)**
    - Architecture overview of key React components (`SurahDetail`, `PrayerTimes`, etc.).
4.  **[API Reference](API_REFERENCE.md)**
    - List of all external APIs used (Quran, Translation, Location, etc.).

## **Quick Start**

To run the project locally:

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm start
    ```
3.  Open `http://localhost:3000` in your browser.

## **Project Structure**

- `src/components/`: Reusable UI components.
- `src/styles/`: CSS files (Vanilla CSS).
- `src/data/`: Static data files (Duas, Lessons).
- `src/utils/`: Helper functions.
- `src/documentation/`: This documentation folder.
