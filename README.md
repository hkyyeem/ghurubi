# Ghurubi — The Earth Clock
### الغروبي — ساعة الأرض الطبيعية

> A minimalist Swiss-style timepiece returning humanity to pure natural time, where sunset marks 00:00 and the day begins with the night.

[اقرأ بالعربية](README_ar.md) • [Live site: ghurubi.com](https://ghurubi.com)

---

## Philosophy

Modern civil clocks follow standardized timezones. **Ghurubi** reconnects timekeeping with the sun:

1. **Sunset is zero (12:00 / 00:00)** — every day begins the moment the sun sets.
2. **Night precedes day** — following ancient and Islamic tradition, night belongs to the coming day (Thursday evening is the Eve of Friday).
3. **No civil time** — clock faces run purely on natural, astronomical time.
4. **Two time modes:**
   - **Equal hours** — standard 60-minute hours counted from sunset.
   - **Seasonal hours** — the night split into 12 hours and the day into 12 hours, breathing with the seasons.

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
git clone https://github.com/YOUR_USERNAME/ghurubi.git
cd ghurubi
npm install
npm run dev
```

## License

Released under the [MIT License](LICENSE).
