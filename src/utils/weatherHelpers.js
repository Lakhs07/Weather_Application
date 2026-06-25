// src/utils/weatherHelpers.js

export const WEATHER_THEMES = {
  Clear:        { bg: "from-sky-300 to-yellow-100",       icon: "☀️",  label: "Clear" },
  Clouds:       { bg: "from-slate-300 to-gray-200",       icon: "☁️",  label: "Cloudy" },
  Rain:         { bg: "from-blue-400 to-slate-300",       icon: "🌧️", label: "Rain" },
  Drizzle:      { bg: "from-blue-200 to-slate-200",       icon: "🌦️", label: "Drizzle" },
  Thunderstorm: { bg: "from-gray-700 to-slate-500",       icon: "⛈️",  label: "Thunderstorm" },
  Snow:         { bg: "from-blue-100 to-white",           icon: "❄️",  label: "Snow" },
  Mist:         { bg: "from-gray-200 to-slate-300",       icon: "🌫️", label: "Mist" },
  Haze:         { bg: "from-orange-100 to-yellow-200",    icon: "🌫️", label: "Haze" },
  Fog:          { bg: "from-gray-100 to-gray-300",        icon: "🌁",  label: "Fog" },
  Dust:         { bg: "from-yellow-200 to-orange-200",    icon: "💨",  label: "Dust" },
  Smoke:        { bg: "from-gray-300 to-gray-500",        icon: "💨",  label: "Smoke" },
};

export function getTheme(main) {
  return WEATHER_THEMES[main] || WEATHER_THEMES.Clear;
}

// AQI: OWM returns 1-5, we map to descriptive
const AQI_LEVELS = [
  { max: 1, label: "Good",                  color: "#22c55e", pct: 15 },
  { max: 2, label: "Fair",                  color: "#84cc16", pct: 30 },
  { max: 3, label: "Moderate",              color: "#eab308", pct: 55 },
  { max: 4, label: "Poor",                  color: "#f97316", pct: 75 },
  { max: 5, label: "Very Poor",             color: "#ef4444", pct: 95 },
];

export function getAQIInfo(aqiIndex) {
  return AQI_LEVELS.find((l) => aqiIndex <= l.max) || AQI_LEVELS[4];
}

const DIR_LABELS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
export function degToCompass(deg) {
  return DIR_LABELS[Math.round(deg / 22.5) % 16];
}

export function formatTime(unixSecs, tzOffsetSecs) {
  const d = new Date((unixSecs + tzOffsetSecs) * 1000);
  return d.toISOString().slice(11, 16);
}

export function mpsToKph(mps) {
  return Math.round(mps * 3.6);
}

// Group forecast list by day, returning array of { day, hi, lo, icon, main }
export function groupForecastByDay(list) {
  const map = {};
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  list.forEach((item) => {
    const d  = new Date(item.dt * 1000);
    const key = d.toDateString();
    if (!map[key]) {
      map[key] = { day: dayNames[d.getDay()], hi: -Infinity, lo: Infinity, main: item.weather[0].main };
    }
    if (item.main.temp_max > map[key].hi) map[key].hi = item.main.temp_max;
    if (item.main.temp_min < map[key].lo) map[key].lo = item.main.temp_min;
  });
  return Object.values(map).slice(0, 5);
}

// Return 12 hourly entries for chart
export function buildHourlyChartData(list) {
  return list.slice(0, 12).map((item) => ({
    time:     new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temp:     Math.round(item.main.temp),
    humidity: item.main.humidity,
    wind:     mpsToKph(item.wind.speed),
  }));
}
