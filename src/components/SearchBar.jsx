// src/components/SearchBar.jsx
// City search input with live autocomplete via OpenWeatherMap Geocoding API.

import { useState, useRef, useEffect, useCallback } from "react";
import { getCitySuggestions } from "../services/weatherService";
import { debounce } from "../utils/helpers";

const SearchBar = ({ onSearch, onGeolocate, locating }) => {
  const [query,       setQuery]       = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open,        setOpen]        = useState(false);
  const [highlight,   setHighlight]   = useState(-1);
  const inputRef = useRef(null);
  const listRef  = useRef(null);

  // Debounced autocomplete fetch
  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (q.trim().length < 2) { setSuggestions([]); setOpen(false); return; }
      try {
        const results = await getCitySuggestions(q);
        setSuggestions(results);
        setOpen(results.length > 0);
        setHighlight(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 350),
    []
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const selectCity = (city) => {
    const label = city.state
      ? `${city.name}, ${city.state}, ${city.country}`
      : `${city.name}, ${city.country}`;
    setQuery(label);
    setOpen(false);
    setSuggestions([]);
    onSearch(city.name);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter") onSearch(query.trim());
      return;
    }
    if (e.key === "ArrowDown")  setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    if (e.key === "ArrowUp")    setHighlight((h) => Math.max(h - 1, -1));
    if (e.key === "Enter")      { if (highlight >= 0) selectCity(suggestions[highlight]); else onSearch(query.trim()); }
    if (e.key === "Escape")     setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.contains(e.target) && !listRef.current?.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto mb-6">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search city..."
            aria-label="City search"
            aria-autocomplete="list"
            aria-expanded={open}
            className="search-input w-full pl-10 pr-4 py-3 glass text-white text-sm rounded-xl focus:ring-2 focus:ring-white/30 transition-all"
          />
        </div>

        {/* Geolocation button */}
        <button
          onClick={onGeolocate}
          disabled={locating}
          title="Use my location"
          aria-label="Use my current location"
          className="glass px-4 py-3 rounded-xl text-white hover:bg-white/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {locating ? (
            <span className="animate-spin inline-block">⟳</span>
          ) : (
            "📍"
          )}
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute top-full left-0 right-12 mt-1 glass-strong rounded-xl overflow-hidden z-50 divide-y divide-white/10"
        >
          {suggestions.map((city, i) => (
            <li
              key={`${city.lat}-${city.lon}`}
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={() => selectCity(city)}
              className={`px-4 py-3 cursor-pointer text-sm text-white transition-colors ${
                i === highlight ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <span className="font-medium">{city.name}</span>
              {city.state && <span className="text-white/60">, {city.state}</span>}
              <span className="text-white/60">, {city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
