# Verse - External API Reference

This document lists the external APIs used by Verse.

## **1. Al Quran Cloud**

**Base URL**: `https://api.alquran.cloud/v1`
**Purpose**: Quranic text, audio, and metadata.

| Endpoint                           | Method | Description                                               |
| :--------------------------------- | :----- | :-------------------------------------------------------- |
| `/surah`                           | GET    | List of all 114 Surahs with metadata.                     |
| `/surah/{id}`                      | GET    | Get full text of a Surah (Arabic).                        |
| `/surah/{id}/{edition}`            | GET    | Get specific edition (e.g., `quran-uthmani`, `en.sahih`). |
| `/surah/{id}/{reciter_id}`         | GET    | Get audio URLs for all Ayahs in a Surah.                  |
| `/page/{page}/{edition}`           | GET    | Get Ayahs for a specific Mushaf page.                     |
| `/tafsir/{edition}/{surah}:{ayah}` | GET    | Get Tafsir (exegesis) for a specific Ayah.                |
| `/meta`                            | GET    | detailed metadata (Juz start/end, etc.).                  |

## **2. Google Translate**

**Base URL**: `https://translate.googleapis.com`
**Purpose**: Word-by-word interactive translation.
**Warning**: Unofficial client usage; subject to rate limits.

| Endpoint              | Method | Params                                             | Description                                 |
| :-------------------- | :----- | :------------------------------------------------- | :------------------------------------------ |
| `/translate_a/single` | GET    | `client=gtx`, `sl=ar`, `tl=en`, `dt=t`, `q={word}` | Translates a single Arabic word to English. |

## **3. Adhan API (AlAdhan)**

**Base URL**: `https://api.aladhan.com/v1`
**Purpose**: Prayer times calculation.

| Endpoint         | Method | Params                            | Description                                         |
| :--------------- | :----- | :-------------------------------- | :-------------------------------------------------- |
| `/timings`       | GET    | `latitude`, `longitude`, `method` | Get timings by coordinates (Method 4: Umm Al-Qura). |
| `/timingsByCity` | GET    | `city`, `country`, `method`       | Get timings by city name (fallback).                |

## **4. OpenStreetMap Nominatim**

**Base URL**: `https://nominatim.openstreetmap.org`
**Purpose**: Reverse Geocoding (Coords -> City Name).

| Endpoint   | Method | Params                        | Description                          |
| :--------- | :----- | :---------------------------- | :----------------------------------- |
| `/reverse` | GET    | `lat`, `lon`, `format=jsonv2` | Get address details for coordinates. |

## **5. Counter API**

**Base URL**: `https://api.counterapi.dev/v1`
**Purpose**: Daily active listener count.

| Endpoint                              | Method | Params | Description                           |
| :------------------------------------ | :----- | :----- | :------------------------------------ |
| `/verse-islam/daily-{date}`           | GET    | None   | Get current count for the day.        |
| `/verse-islam/daily-{date}/increment` | GET    | None   | Increment the count (called on play). |

## **6. Ipify**

**Base URL**: `https://api.ipify.org`
**Purpose**: IP Address retrieval.

| Endpoint | Method | Format | Description                                        |
| :------- | :----- | :----- | :------------------------------------------------- |
| `/`      | GET    | `json` | Get client public IP (for local uniqueness check). |
