// src/components/HourlyChart.jsx
// Tabbed hourly visualization using Chart.js + react-chartjs-2.

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { round, msToKmh } from "../utils/helpers";

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Filler, Tooltip, Legend
);

const TABS = [
  { id: "temp",     label: "Temperature", unit: "°C",   color: "#64b5f6" },
  { id: "humidity", label: "Humidity",    unit: "%",    color: "#4db6ac" },
  { id: "wind",     label: "Wind",        unit: "km/h", color: "#ffd54f" },
];

const buildDataset = (tab, hourly) => {
  const map = {
    temp    : hourly.map((h) => round(h.main.temp)),
    humidity: hourly.map((h) => h.main.humidity),
    wind    : hourly.map((h) => msToKmh(h.wind.speed)),
  };
  return map[tab] ?? [];
};

const chartOptions = (unit, color) => ({
  responsive       : true,
  maintainAspectRatio: false,
  interaction      : { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(0,0,0,0.7)",
      titleColor      : "rgba(255,255,255,0.8)",
      bodyColor       : "#fff",
      borderColor     : "rgba(255,255,255,0.15)",
      borderWidth     : 1,
      callbacks: { label: (ctx) => `${ctx.parsed.y} ${unit}` },
    },
  },
  scales: {
    x: {
      ticks   : { color: "rgba(255,255,255,0.5)", font: { size: 10 }, maxTicksLimit: 8, maxRotation: 0 },
      grid    : { display: false },
      border  : { display: false },
    },
    y: {
      ticks   : { color: "rgba(255,255,255,0.5)", font: { size: 10 }, callback: (v) => `${v}${unit}` },
      grid    : { color: "rgba(255,255,255,0.07)", borderDash: [4, 4] },
      border  : { display: false },
    },
  },
});

const HourlyChart = ({ hourly }) => {
  const [activeTab, setActiveTab] = useState("temp");

  const labels = useMemo(
    () =>
      hourly.map((h) =>
        new Date(h.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      ),
    [hourly]
  );

  const tab = TABS.find((t) => t.id === activeTab);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label          : tab.label,
          data           : buildDataset(activeTab, hourly),
          borderColor    : tab.color,
          backgroundColor: `${tab.color}33`,
          fill           : activeTab !== "wind",
          tension        : 0.4,
          pointRadius    : 3,
          pointBackgroundColor: tab.color,
          borderWidth    : 2,
          // Secondary visual cue (not just color)
          borderDash     : activeTab === "humidity" ? [5, 3] : [],
        },
      ],
    }),
    [activeTab, hourly, labels, tab]
  );

  if (!hourly?.length) return null;

  return (
    <section aria-label="Hourly weather chart">
      <h2 className="text-white/50 text-xs font-medium uppercase tracking-widest mb-3">
        Next 36 hours
      </h2>
      <div className="glass-dark rounded-xl p-4">
        {/* Tab switcher */}
        <div className="flex gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              aria-pressed={t.id === activeTab}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                t.id === activeTab
                  ? "bg-white/20 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div style={{ position: "relative", height: "200px" }}>
          {activeTab === "wind" ? (
            <Bar
              data={data}
              options={chartOptions(tab.unit, tab.color)}
              aria-label={`Hourly ${tab.label} chart`}
            />
          ) : (
            <Line
              data={data}
              options={chartOptions(tab.unit, tab.color)}
              aria-label={`Hourly ${tab.label} chart`}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HourlyChart;
