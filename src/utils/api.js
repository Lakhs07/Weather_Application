// src/utils/api.js
import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/4.0";
const GEO  = "https://api.openweathermap.org/geo/1.0";

export async function fetchCurrentWeather(city) {
  const { data } = await axios.get(`${BASE}/weather`, {
    params: { q: city, appid: API_KEY, units: "metric" },
  });
  return data;
}

export async function fetchCurrentWeatherByCoords(lat, lon) {
  const { data } = await axios.get(`${BASE}/weather`, {
    params: { lat, lon, appid: API_KEY, units: "metric" },
  });
  return data;
}

export async function fetchForecast(city) {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: { q: city, appid: API_KEY, units: "metric" },
  });
  return data;
}

export async function fetchForecastByCoords(lat, lon) {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: { lat, lon, appid: API_KEY, units: "metric" },
  });
  return data;
}

export async function fetchAirQuality(lat, lon) {
  const { data } = await axios.get(`${BASE}/air_pollution`, {
    params: { lat, lon, appid: API_KEY },
  });
  return data;
}

export async function fetchGeoAutocomplete(query) {
  const { data } = await axios.get(`${GEO}/direct`, {
    params: { q: query, limit: 6, appid: API_KEY },
  });
  return data; // array of { name, country, state, lat, lon }
}
