// src/context/WeatherContext.js
import React, { createContext, useContext, useReducer } from "react";

const WeatherContext = createContext(null);

const initialState = {
  current:   null,
  forecast:  null,
  airQuality: null,
  loading:   false,
  error:     null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading:    false,
        current:    action.current,
        forecast:   action.forecast,
        airQuality: action.airQuality,
        error:      null,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WeatherContext.Provider value={{ state, dispatch }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
