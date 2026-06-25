// src/hooks/useWeatherFetch.js
import { useCallback } from "react";
import { useWeather } from "../context/WeatherContext";
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
  fetchAirQuality,
} from "../utils/api";

export function useWeatherFetch() {
  const { dispatch } = useWeather();

  const loadByCity = useCallback(async (city) => {
    dispatch({ type: "FETCH_START" });
    try {
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);
      const airQuality = await fetchAirQuality(current.coord.lat, current.coord.lon);
      dispatch({ type: "FETCH_SUCCESS", current, forecast, airQuality });
    } catch (err) {
      const msg = err.response?.status === 404
        ? "City not found. Try a different name."
        : "Failed to fetch weather. Check your API key or connection.";
      dispatch({ type: "FETCH_ERROR", error: msg });
    }
  }, [dispatch]);

  const loadByCoords = useCallback(async (lat, lon) => {
    dispatch({ type: "FETCH_START" });
    try {
      const [current, forecast] = await Promise.all([
        fetchCurrentWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
      ]);
      const airQuality = await fetchAirQuality(lat, lon);
      dispatch({ type: "FETCH_SUCCESS", current, forecast, airQuality });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", error: "Failed to fetch weather for your location." });
    }
  }, [dispatch]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch({ type: "FETCH_ERROR", error: "Geolocation is not supported by your browser." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
      ()    => dispatch({ type: "FETCH_ERROR", error: "Could not get your location. Please allow location access." })
    );
  }, [loadByCoords, dispatch]);

  return { loadByCity, loadByCoords, detectLocation };
}
