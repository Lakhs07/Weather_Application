// src/App.jsx
// Root component — wires hooks, state, background theme, and layout.

import { useEffect, useCallback } from "react";
import { useWeather }     from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { weatherTheme }   from "./services/weatherService";

import SearchBar       from "./components/SearchBar";
import CurrentWeather  from "./components/CurrentWeather";
import ForecastRow     from "./components/ForecastRow";
import HourlyChart     from "./components/HourlyChart";
import AirQualityCard  from "./components/AirQualityCard";
import SkeletonLoader  from "./components/SkeletonLoader";
import ErrorToast      from "./components/ErrorToast";

const DEFAULT_CITY = "London";

const App = () => {
  const { current, forecast, hourly, aqi, loading, error, fetchByCity, fetchByCoords, clearError } = useWeather();
  const { locating, geoError, locate, clearGeoError } = useGeolocation();

  // Load default city on mount
  useEffect(() => { fetchByCity(DEFAULT_CITY); }, [fetchByCity]);

  const handleSearch = useCallback((city) => {
    if (city.trim()) fetchByCity(city.trim());
  }, [fetchByCity]);

  const handleGeolocate = () => locate(fetchByCoords);

  // Dynamic background based on current weather condition
  const theme  = weatherTheme(current?.weather?.[0]?.main);
  const bgClass = theme.bg;

  const combinedError = error || geoError;
  const dismissError  = () => { clearError(); clearGeoError(); };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${bgClass} p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-white/80 text-sm font-medium uppercase tracking-widest mb-4">
            Weather Dashboard
          </h1>
          <SearchBar
            onSearch={handleSearch}
            onGeolocate={handleGeolocate}
            locating={locating}
          />
        </header>

        {/* Error banner */}
        <ErrorToast message={combinedError} onDismiss={dismissError} />

        {/* Main content */}
        <main className="space-y-6">
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {/* Hero: current conditions */}
              {current && (
                <section className="glass rounded-2xl p-5 sm:p-6" aria-label="Current weather">
                  <CurrentWeather data={current} />
                </section>
              )}

              {/* 5-day forecast */}
              {forecast.length > 0 && <ForecastRow forecast={forecast} />}

              {/* Hourly chart */}
              {hourly.length > 0 && <HourlyChart hourly={hourly} />}

              {/* Air quality */}
              {aqi !== null && <AirQualityCard aqi={aqi} />}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center text-white/30 text-xs">
          Data from OpenWeatherMap · Refresh to update
        </footer>
      </div>
    </div>
  );
};

export default App;
