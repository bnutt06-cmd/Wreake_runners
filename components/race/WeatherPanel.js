"use client";

// components/race/WeatherPanel.js
// =================================================================
// Fetches and displays weather for the race location.
// Shows the race-day forecast if within ~7 days; always shows a
// 7-day strip for context. Open-Meteo is free, no API key.
// =================================================================

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/data";
import { fetchForecast, forecastForDate, describeWmo } from "@/lib/race/weather";

export default function WeatherPanel({ lat, lon, raceDate }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat == null || lon == null) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const data = await fetchForecast(lat, lon);
      if (cancelled) return;
      setForecast(data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [lat, lon]);

  if (lat == null || lon == null) return null;
  if (loading) {
    return (
      <div style={panelStyle}>
        <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>Loading forecast…</p>
      </div>
    );
  }
  if (!forecast) {
    return (
      <div style={panelStyle}>
        <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>
          Weather forecast unavailable right now.
        </p>
      </div>
    );
  }

  const raceDay = forecastForDate(forecast, raceDate);

  return (
    <div style={panelStyle}>
      {raceDay ? (
        <RaceDayCard day={raceDay} raceDate={raceDate} />
      ) : (
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
          Race is outside the 7-day forecast window. Check back closer to the day.
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.6, letterSpacing: 0.5, textTransform: "uppercase", margin: "0 0 6px" }}>
        7-day outlook
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {forecast.daily.map((d) => {
          const wmo = describeWmo(d.code);
          const isRaceDay = d.date === raceDate;
          return (
            <div
              key={d.date}
              title={wmo.label}
              style={{
                background: isRaceDay ? COLORS.teal : "#fff",
                color: isRaceDay ? "#fff" : COLORS.ink,
                border: `1px solid ${isRaceDay ? COLORS.teal : COLORS.mist}`,
                borderRadius: 8,
                padding: "8px 4px",
                textAlign: "center",
                fontSize: 11,
              }}
            >
              <div style={{ fontSize: 10, opacity: 0.8 }}>
                {new Date(d.date).toLocaleDateString("en-GB", { weekday: "short" })}
              </div>
              <div style={{ fontSize: 18, margin: "2px 0" }}>{wmo.icon}</div>
              <div style={{ fontWeight: 700 }}>{Math.round(d.temp_max)}°</div>
              <div style={{ opacity: 0.65 }}>{Math.round(d.temp_min)}°</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RaceDayCard({ day, raceDate }) {
  const wmo = describeWmo(day.code);
  return (
    <div
      style={{
        background: COLORS.ink,
        color: "#fff",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 700 }}>
            Race-day forecast
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{wmo.label}</div>
        </div>
        <div style={{ fontSize: 32, lineHeight: 1 }}>{wmo.icon}</div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap", fontSize: 13 }}>
        <span>
          <strong>{Math.round(day.temp_max)}°</strong> / {Math.round(day.temp_min)}°
        </span>
        <span>💨 {Math.round(day.wind_kph)} km/h</span>
        <span>💧 {day.precip_mm.toFixed(1)} mm</span>
      </div>
    </div>
  );
}

const panelStyle = {
  background: "#fff",
  border: `1px solid ${COLORS.mist}`,
  borderRadius: 14,
  padding: 16,
};
