# Weather Dashboard

A real-time weather dashboard built with React, Tailwind CSS, and Chart.js.

## Features

- **City search** with live autocomplete (OpenWeatherMap Geocoding API)
- **Geolocation autodetect** — one-click current location
- **Current conditions** — temperature, feels-like, humidity, wind, pressure, visibility, cloud cover
- **5-day forecast** — daily high/low with weather icons
- **Hourly chart** — 36-hour temperature / humidity / wind visualization (Chart.js)
- **Air quality index** — with color-coded bar and plain-language label
- **Dynamic backgrounds** — theme shifts per weather condition (clear, rain, storm, snow…)
- **Skeleton loading** — smooth shimmer placeholders while fetching
- **Error toasts** — auto-dismissing, accessible error messages

## Project structure

```
src/
├── services/
│   └── weatherService.js   ← All API calls + pure helpers (theme, AQI, forecast collapsing)
├── hooks/
│   ├── useWeather.js        ← Fetching state machine (loading / error / data)
│   └── useGeolocation.js   ← Browser Geolocation wrapper
├── utils/
│   └── helpers.js          ← Pure utilities (round, debounce, unit conversions…)
├── components/
│   ├── SearchBar.jsx        ← Input + autocomplete dropdown
│   ├── CurrentWeather.jsx   ← Hero card with big temp + stat grid
│   ├── ForecastRow.jsx      ← 5-day strip
│   ├── HourlyChart.jsx      ← Tabbed Chart.js line/bar chart
│   ├── AirQualityCard.jsx   ← AQI score + animated bar
│   ├── SkeletonLoader.jsx   ← Shimmer placeholders
│   └── ErrorToast.jsx       ← Auto-dismissing error banner
├── App.jsx                  ← Root: layout + hook wiring + dynamic bg
├── index.js                 ← React entry point
└── index.css                ← Tailwind directives + glass/bg/animation styles
```

## Setup

### 1. Get an API key
Sign up free at https://openweathermap.org/api  
Enable: **Current Weather**, **5 Day Forecast**, **Air Pollution**, **Geocoding**

### 2. Install dependencies
```bash
npm install
# also install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and paste your key:
# REACT_APP_OPENWEATHER_API_KEY=your_key_here
```

### 4. Run
```bash
npm start
```

### 5. Build for production
```bash
npm run build
```

## API endpoints used (all free tier)
| Endpoint | Purpose |
|---|---|
| `/data/2.5/weather` | Current weather by city or coords |
| `/data/2.5/forecast` | 5-day / 3-hour forecast |
| `/data/2.5/air_pollution` | Air quality index |
| `/geo/1.0/direct` | City autocomplete |

## Tech stack
- **React 18** — UI framework
- **Tailwind CSS** — utility styling + custom glass effects
- **Chart.js + react-chartjs-2** — hourly charts
- **Axios** — HTTP client
- **OpenWeatherMap REST API** — weather data
"# Weather_Application" 
