// src/hooks/useWeather.js
// Encapsulates all weather data-fetching logic and loading/error state.

import { useState, useCallback } from "react";
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getForecastByCoords,
  getAirQuality,
  collapseForecast,
  aqiBucket,
} from "../services/weatherService";

const initialState = {
  current : null,
  forecast: [],   // 5 daily objects
  hourly  : [],   // raw 3-hour slots (first 12 = 36 hrs)
  aqi     : null, // numeric value
  loading : false,
  error   : null,
};

export const useWeather = () => {
  const [state, setState] = useState(initialState);

  const setLoading = () => setState((s) => ({ ...s, loading: true, error: null }));
  const setError   = (msg) => setState((s) => ({ ...s, loading: false, error: msg }));

  const applyData = useCallback(async (weatherPromise, forecastPromise) => {
    setLoading();
    try {
      const [cur, fcast] = await Promise.all([weatherPromise, forecastPromise]);
      const aqiRaw = await getAirQuality(cur.coord.lat, cur.coord.lon).catch(() => null);
      const aqiValue = aqiRaw ? aqiBucket(aqiRaw.list[0].main.aqi) : null;

      setState({
        current : cur,
        forecast: collapseForecast(fcast.list),
        hourly  : fcast.list.slice(0, 12),
        aqi     : aqiValue,
        loading : false,
        error   : null,
      });
      return cur.name;
    } catch (err) {
      const msg =
        err?.response?.status === 404
          ? "City not found — try a different spelling."
          : "Could not fetch weather data. Check your connection.";
      setError(msg);
      return null;
    }
  }, []);

  const fetchByCity = useCallback(
    (city) => applyData(getCurrentWeather(city), getForecast(city)),
    [applyData]
  );

  const fetchByCoords = useCallback(
    (lat, lon) => applyData(getCurrentWeatherByCoords(lat, lon), getForecastByCoords(lat, lon)),
    [applyData]
  );

  const clearError = () => setState((s) => ({ ...s, error: null }));

  return { ...state, fetchByCity, fetchByCoords, clearError };
};
