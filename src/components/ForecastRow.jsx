// src/components/ForecastRow.jsx
// 5-day daily forecast strip.

import { round, owmIconUrl, titleCase } from "../utils/helpers";

const ForecastCard = ({ day }) => (
  <div className="glass-dark rounded-xl px-3 py-4 flex flex-col items-center gap-2 animate-fade-in hover:bg-white/20 transition-colors cursor-default">
    <span className="text-white/60 text-xs font-medium uppercase tracking-wide">
      {day.dayName}
    </span>
    <img
      src={owmIconUrl(day.icon)}
      alt={day.desc}
      title={titleCase(day.desc)}
      className="w-10 h-10"
    />
    <div className="text-center">
      <p className="text-white font-semibold text-sm">{round(day.hi)}°</p>
      <p className="text-white/50 text-xs">{round(day.lo)}°</p>
    </div>
  </div>
);

const ForecastRow = ({ forecast }) => {
  if (!forecast?.length) return null;

  return (
    <section aria-label="5-day forecast">
      <h2 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">
        5-day forecast
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day, i) => (
          <ForecastCard key={i} day={day} />
        ))}
      </div>
    </section>
  );
};

export default ForecastRow;
