// src/components/SkeletonLoader.jsx
// Shown while weather data is in-flight.

const Block = ({ h = "h-6", w = "w-full", cls = "" }) => (
  <div className={`skeleton rounded-lg ${h} ${w} ${cls}`} />
);

const SkeletonLoader = () => (
  <div aria-busy="true" aria-label="Loading weather data" className="space-y-6">
    {/* Hero */}
    <div className="space-y-3">
      <Block h="h-8" w="w-48" />
      <Block h="h-20" w="w-40" />
      <Block h="h-4" w="w-64" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Block key={i} h="h-16" />
        ))}
      </div>
    </div>

    {/* Forecast */}
    <div>
      <Block h="h-3" w="w-24" cls="mb-3" />
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Block key={i} h="h-24" />
        ))}
      </div>
    </div>

    {/* Chart */}
    <div>
      <Block h="h-3" w="w-24" cls="mb-3" />
      <Block h="h-56" />
    </div>

    {/* AQI */}
    <Block h="h-32" />
  </div>
);

export default SkeletonLoader;
