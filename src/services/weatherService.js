// src/services/weatherService.js
// All OpenWeatherMap API calls isolated here.
// Set REACT_APP_OPENWEATHER_API_KEY in your .env file.

import axios from "axios";

const BASE    = "https://api.openweathermap.org/data/2.5";
const GEO     = "https://api.openweathermap.org/geo/1.0";
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "";

const api = axios.create({ baseURL: BASE, params: { appid: API_KEY, units: "metric" } });

// ── Current weather ──────────────────────────────────────
export const getCurrentWeather = async (city) => {
  const { data } = await api.get("/weather", { params: { q: city } });
  return data;
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  const { data } = await api.get("/weather", { params: { lat, lon } });
  return data;
};

// ── 5-day / 3-hour forecast ──────────────────────────────
export const getForecast = async (city) => {
  const { data } = await api.get("/forecast", { params: { q: city } });
  return data;
};

export const getForecastByCoords = async (lat, lon) => {
  const { data } = await api.get("/forecast", { params: { lat, lon } });
  return data;
};

// ── Air quality ──────────────────────────────────────────
export const getAirQuality = async (lat, lon) => {
  const { data } = await api.get("/air_pollution", { params: { lat, lon } });
  return data;
};

// ── Geocoding autocomplete ───────────────────────────────
export const getCitySuggestions = async (query) => {
  const { data } = await axios.get(`${GEO}/direct`, {
    params: { q: query, limit: 6, appid: API_KEY },
  });
  return data; // [{ name, country, state, lat, lon }]
};

// ── Helpers ──────────────────────────────────────────────

/** Convert Unix timestamp + timezone offset → "HH:MM" */
export const formatTime = (unix, tzOffsetSeconds) => {
  const ms = (unix + tzOffsetSeconds) * 1000;
  return new Date(ms).toISOString().slice(11, 16);
};

/** Wind degrees → compass label */
const DIRS = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
export const degToCompass = (deg) => DIRS[Math.round(deg / 22.5) % 16];

/** Collapse 3-hour slots into daily min/max */
export const collapseForecast = (list) => {
  const days = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key  = date.toDateString();
    if (!days[key]) {
      days[key] = {
        date,
        dayName : date.toLocaleDateString("en", { weekday: "short" }),
        hi      : -Infinity,
        lo      : Infinity,
        icon    : item.weather[0].icon,
        main    : item.weather[0].main,
        desc    : item.weather[0].description,
      };
    }
    if (item.main.temp_max > days[key].hi) days[key].hi = item.main.temp_max;
    if (item.main.temp_min < days[key].lo) days[key].lo = item.main.temp_min;
  });
  return Object.values(days).slice(0, 5);
};

/** AQI index 1-5 → ppm equivalent bucket for display */
export const aqiBucket = (index) => {
  const map = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
  return map[index] ?? 0;
};

/** AQI value → label + color */
export const aqiInfo = (value) => {
  if (value <= 50)  return { label: "Good",                   cls: "aqi-good",      hex: "#4caf50", pct: (value / 300) * 100 };
  if (value <= 100) return { label: "Moderate",               cls: "aqi-moderate",  hex: "#ffeb3b", pct: (value / 300) * 100 };
  if (value <= 150) return { label: "Unhealthy (sensitive)",  cls: "aqi-sensitive", hex: "#ff9800", pct: (value / 300) * 100 };
  if (value <= 200) return { label: "Unhealthy",              cls: "aqi-unhealthy", hex: "#f44336", pct: (value / 300) * 100 };
  if (value <= 300) return { label: "Very unhealthy",         cls: "aqi-very",      hex: "#9c27b0", pct: (value / 300) * 100 };
  return              { label: "Hazardous",                   cls: "aqi-hazardous", hex: "#7b1fa2", pct: 100 };
};

/** Weather main condition → Tailwind bg class + emoji */
export const weatherTheme = (main = "") => {
  const map = {
    Clear       : { bg: "bg-clear",   emoji: "☀️" },
    Clouds      : { bg: "bg-clouds",  emoji: "☁️" },
    Rain        : { bg: "bg-rain",    emoji: "🌧️" },
    Drizzle     : { bg: "bg-drizzle", emoji: "🌦️" },
    Thunderstorm: { bg: "bg-thunder", emoji: "⛈️" },
    Snow        : { bg: "bg-snow",    emoji: "❄️" },
    Mist        : { bg: "bg-mist",    emoji: "🌫️" },
    Fog         : { bg: "bg-mist",    emoji: "🌁" },
    Haze        : { bg: "bg-mist",    emoji: "🌫️" },
  };
  return map[main] ?? { bg: "bg-default", emoji: "🌡️" };
};
