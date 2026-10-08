# Ghurubi — The Earth Clock
### الغروبي — ساعة الأرض الطبيعية

> A minimalist Swiss-style timepiece returning humanity to pure natural time, where sunset marks 00:00 and the day begins with the night.

[اقرأ بالعربية](README_ar.md) • [Live site: ghurubi.com](https://ghurubi.com)

---

## Philosophy

Modern civil clocks follow standardized timezones. **Ghurubi** reconnects timekeeping with the sun:

1. **Sunset is zero (12:00 / 00:00)** — every day begins the moment the sun sets.
2. **Night precedes day** — night belongs to the coming day (Thursday evening is the Eve of Friday).
3. **No civil time** — clock faces run purely on natural, astronomical time.
4. **Two time modes:**
   - **Equal hours** — standard 60-minute hours counted from sunset.
   - **Seasonal hours** — the night split into 12 hours and the day into 12 hours, breathing with the seasons.

## Historical Roots

Sunset-based time is not a new invention — it is one of humanity's oldest ways of reading the day.

- **Islamic civilization:** The legal (shar'i) day begins at Maghrib, and night precedes day. Known as *Arabic time* or *Adhani time*, sunset reckoning was the official time in Makkah, Madinah and many capitals of the Muslim world until the mid-20th century. Mosque clocks were reset to 12:00 at every sunset.
- **Jewish tradition:** The day begins in the evening, rooted in Genesis: *"And there was evening, and there was morning — one day."* Jewish law still uses **seasonal hours** (*Sha'ot Zmaniyot*), dividing daylight into 12 variable hours to set the times of prayer.
- **Ancient and medieval cultures:** Babylonian and Greek astronomers used seasonal hours, and Italy kept *Ora Italica* — hours counted from sunset — well into the 19th century.

## The Mechanical Problem — and the Digital Solution

Natural time did not fade because people rejected it. It faded because **gears could not follow the sun.**

A mechanical clock ticks at a fixed rate, but sunset shifts every day across the seasons. A sunset-based clock therefore had to be **reset by hand every evening**. As railways, factories and global trade demanded a single fixed standard, the convenient choice won: midnight-based civil time and artificial timezones.

Today the obstacle is gone. GPS and precise astronomical algorithms compute the sun's position for any place on Earth, every second, with no human adjustment. What was mechanically impossible for centuries now runs effortlessly in a browser or on your wrist. **Ghurubi is that solution.**

## Languages

- **Arabic** — the historical home of this timekeeping, and the language of its living vocabulary: seasonal hours, *zawal* (solar noon), the night and day of a date.
- **English** — the language of global reach, opening the idea to developers, researchers of circadian rhythms, horology enthusiasts and anyone curious about time.
- **Turkish** — the language of the Ottoman *Ezani* (Alaturka) time, the last great state to run officially on sunset hours until the 20th century.
- **Hebrew** — the language of a living tradition that still counts the day from evening and divides daylight into seasonal hours (*Sha'ot Zmaniyot*).

## Vision: From a Personal to a Societal Revolution

- **Personal:** Ghurubi invites each person to an individual revolution in their relationship with time — freeing attention from the rigid industrial clock and returning to the rhythm of the Earth itself. Sunset becomes a moment of stillness; daylight becomes natural time for effort.
- **Societal:** As more people adopt it, a personal practice can grow into a collective awareness — rethinking how life and work are organized around the real sun of each place, rather than the imaginary lines of timezones.

## Features

- Precise solar engine: sunrise, sunset and solar noon from your location.
- Prayer times (Umm Al-Qura method) shown in Ghurubi time — Maghrib is always 00:00.
- Swiss minimalist design with sky-inspired light and dark themes.
- Full-screen clock page (`/watch`) with analog and digital dials, ambient mode and screen wake lock.
- Wear OS watch face (Android smartwatches).
- Installable web app (PWA) for phone and desktop.
- City pages, time comparison and event countdowns.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Kotlin (Wear OS)

## Getting started

```bash
git clone https://github.com/hkyyeem/ghurubi.git
cd ghurubi
npm install
npm run dev
```

## License

Released under the [MIT License](LICENSE).
