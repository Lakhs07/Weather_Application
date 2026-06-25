// src/utils/helpers.js
// Pure utility functions with no side-effects.

/** Round a number to N decimal places */
export const round = (n, decimals = 0) =>
  Math.round(n * 10 ** decimals) / 10 ** decimals;

/** Clamp a value between min and max */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Convert m/s → km/h */
export const msToKmh = (ms) => round(ms * 3.6);

/** Convert metres → km */
export const mToKm = (m) => round(m / 1000, 1);

/** Capitalize first letter of each word */
export const titleCase = (str = "") =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

/** Debounce a function */
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Format a Date to short weekday name */
export const shortDay = (date) =>
  date.toLocaleDateString("en", { weekday: "short" });

/** Returns true if current hour is between 6 AM and 6 PM (local time) */
export const isDaytime = () => {
  const h = new Date().getHours();
  return h >= 6 && h < 18;
};

/** Build OpenWeatherMap icon URL */
export const owmIconUrl = (code, size = "2x") =>
  `https://openweathermap.org/img/wn/${code}@${size}.png`;
