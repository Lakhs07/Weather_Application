// src/hooks/useGeolocation.js
// Wraps the browser Geolocation API in a clean hook.

import { useState, useCallback } from "react";

export const useGeolocation = () => {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const locate = useCallback((onSuccess) => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        onSuccess(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLocating(false);
        setGeoError(
          err.code === 1
            ? "Location access denied — please allow location in browser settings."
            : "Unable to determine your location."
        );
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const clearGeoError = () => setGeoError(null);

  return { locating, geoError, locate, clearGeoError };
};
