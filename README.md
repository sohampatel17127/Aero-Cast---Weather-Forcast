# 🌤️ AeroCast — Precision Weather & Atmospheric Telemetry Portal

A modern, responsive, and executive-grade Weather Intelligence web application built with **React**, **Vite**, and **Material UI**. AeroCast delivers real-time meteorological data, 24-hour hourly timelines, 5-day forecasts, and live US EPA Air Quality Index (AQI) monitoring with bilingual support (English & हिन्दी).

---

## ✨ Features

- 🌍 **Real-Time Global Weather**: Instant, accurate meteorological telemetry for any city or coordinates worldwide.
- 🕒 **Live City Local Time**: Real-time ticking seconds clock calibrated to the exact timezone offset of the searched city.
- ⚡ **One-Touch Quick Picks**: Mobile-optimized horizontal swipe carousel of popular global observatories.
- ⏱️ **24-Hour Hourly Timeline**: Touch-momentum slider detailing temperature and precipitation probability hour by hour.
- 📅 **5-Day Meteorological Outlook**: Clean single-line daily forecast rows with high/low temperature spectrum bars.
- 🛡️ **Air Quality Intelligence (AQI)**: US EPA color-graded air safety ratings with detailed PM2.5, PM10, and NO₂ metrics.
- 🌅 **Astronomical Sun Cycle**: Precise local sunrise and sunset timings.
- 🌡️ **Dual Temperature Units**: Instant switching between Celsius (°C) and Fahrenheit (°F).
- 🌐 **Bilingual Interface**: 1-click language switcher with full translations for English and हिन्दी.
- 📱 **Native Mobile Feel**: Designed for seamless mobile and desktop experiences with zero horizontal overflow.

---

## 🚀 Tech Stack

- **Frontend**: React 18
- **UI Framework**: Material UI (MUI v6) & Emotion
- **Bundler & Tooling**: Vite
- **Icons**: Material UI Icons
- **Weather Services**: OpenWeatherMap API & WeatherAPI

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sohampatel17127/Aero-Cast---Weather-Forcast.git
cd Aero-Cast---Weather-Forcast
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and insert your free Weather API key:
```env
VITE_WEATHER_API_KEY=your_api_key_here
VITE_DEFAULT_CITY=New Delhi
VITE_DEFAULT_UNIT=C
VITE_DEFAULT_LANG=en
```

### 4. Run the development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

### 5. Build for production
```bash
npm run build
```

---

## 🔒 Security Best Practice

The `.env` file contains private API keys and is permanently excluded via `.gitignore`. Never commit your `.env` file to version control. Always distribute the template `.env.example` file instead.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
