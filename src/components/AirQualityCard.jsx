// src/components/AirQualityCard.jsx
// Displays AQI with animated bar and plain-language label.

import { aqiInfo } from "../services/weatherService";
import { clamp } from "../utils/helpers";

const AirQualityCard = ({ aqi }) => {
  if (aqi === null || aqi === undefined) return null;

  const info = aqiInfo(aqi);
  const pct  = clamp((aqi / 300) * 100, 2, 100);

  return (
    <div className="glass-dark rounded-xl p-4 animate-fade-in">
      <h2 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">
        Air quality index
      </h2>

      {/* Score + label */}
      <div className="flex items-baseline gap-3 mb-3">
        <span
          className="text-4xl font-semibold tabular-nums"
          style={{ color: info.hex }}
        >
          {aqi}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: info.hex }}
        >
          {info.label}
        </span>
      </div>

      {/* Bar */}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: info.hex }}
          role="progressbar"
          aria-valuenow={aqi}
          aria-valuemin={0}
          aria-valuemax={300}
          aria-label={`AQI ${aqi}: ${info.label}`}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-white/30 text-[10px]">
        <span>Good</span>
        <span>Moderate</span>
        <span>Unhealthy</span>
        <span>Hazardous</span>
      </div>

      {/* Pollutant hint */}
      <p className="text-white/40 text-xs mt-3">
        Based on particulate matter (PM2.5, PM10), O₃, NO₂ and SO₂ readings.
      </p>
    </div>
  );
};

export default AirQualityCard;
