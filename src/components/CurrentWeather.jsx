// src/components/CurrentWeather.jsx
// Hero section: large temperature, condition, and key stats.

import { weatherTheme, degToCompass, formatTime } from "../services/weatherService";
import { round, msToKmh, mToKm, titleCase, owmIconUrl } from "../utils/helpers";

const Stat = ({ icon, label, value, unit }) => (
  <div className="glass-dark px-4 py-3 flex flex-col gap-1 rounded-xl animate-fade-in">
    <span className="text-white/50 text-xs flex items-center gap-1">
      <span aria-hidden="true">{icon}</span> {label}
    </span>
    <span className="text-white font-semibold text-lg leading-none">
      {value}
      <span className="text-white/60 text-sm font-normal ml-1">{unit}</span>
    </span>
  </div>
);

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const { main, wind, visibility, sys, timezone, weather, name, clouds } = data;
  const { emoji }  = weatherTheme(weather[0].main);
  const sunrise    = formatTime(sys.sunrise, timezone);
  const sunset     = formatTime(sys.sunset, timezone);

  return (
    <div className="animate-fade-in">
      {/* City + condition */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-white text-3xl font-semibold leading-tight">
            {name}
            <span className="text-white/50 text-xl font-normal ml-2">{sys.country}</span>
          </h1>
          <p className="text-white/70 text-sm mt-1">{titleCase(weather[0].description)}</p>
        </div>
        {/* OWM icon */}
        <img
          src={owmIconUrl(weather[0].icon)}
          alt={weather[0].description}
          className="w-16 h-16 -mt-2 animate-float drop-shadow-lg"
        />
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-3 mb-1">
        <span className="text-white text-8xl font-light leading-none tabular-nums">
          {round(main.temp)}
        </span>
        <span className="text-white/60 text-4xl mb-4">°C</span>
        <span className="text-5xl mb-2" aria-hidden="true">{emoji}</span>
      </div>
      <p className="text-white/60 text-sm mb-6">
        Feels like {round(main.feels_like)}°C · High {round(main.temp_max)}° · Low {round(main.temp_min)}°
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger-children">
        <Stat icon="💧" label="Humidity"   value={main.humidity}          unit="%" />
        <Stat icon="💨" label="Wind"       value={msToKmh(wind.speed)}    unit="km/h" />
        <Stat icon="🌡️" label="Pressure"   value={main.pressure}          unit="hPa" />
        <Stat icon="👁️" label="Visibility" value={mToKm(visibility||10000)} unit="km" />
        <Stat icon="☁️" label="Cloud cover" value={clouds.all}             unit="%" />
        <Stat icon="🧭" label="Wind dir"   value={degToCompass(wind.deg)} unit="" />
        <Stat icon="🌅" label="Sunrise"    value={sunrise}                unit="" />
        <Stat icon="🌇" label="Sunset"     value={sunset}                 unit="" />
      </div>
    </div>
  );
};

export default CurrentWeather;
