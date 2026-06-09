// lib/race/weather.js
// ============================================================
// Open-Meteo weather forecasts. No API key required.
// Free for non-commercial use; we're well within their limits.
//
// Docs: https://open-meteo.com/en/docs
// ============================================================

const WMO_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  80: { label: "Light showers", icon: "🌦️" },
  81: { label: "Showers", icon: "🌦️" },
  82: { label: "Heavy showers", icon: "⛈️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm w/ hail", icon: "⛈️" },
  99: { label: "Heavy thunderstorm", icon: "⛈️" },
};

export function describeWmo(code) {
  return WMO_CODES[code] || { label: "—", icon: "🌡️" };
}

/**
 * Fetch up to 7 days of daily forecast for a lat/lon.
 * Forecast is only meaningful for dates within ~16 days; further out, returns null.
 *
 * Returns:
 *   { current: {...}, daily: [{date, code, temp_max, temp_min, precip_mm, wind_kph}, ...] }
 *   or null on error / when location missing.
 */
export async function fetchForecast(lat, lon) {
  if (lat == null || lon == null) return null;
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
    `&timezone=auto&forecast_days=7` +
    `&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      current: data.current && {
        temp: data.current.temperature_2m,
        code: data.current.weather_code,
        wind_kph: data.current.wind_speed_10m,
      },
      daily: (data.daily?.time || []).map((d, i) => ({
        date: d,
        code: data.daily.weather_code[i],
        temp_max: data.daily.temperature_2m_max[i],
        temp_min: data.daily.temperature_2m_min[i],
        precip_mm: data.daily.precipitation_sum[i],
        wind_kph: data.daily.wind_speed_10m_max[i],
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Find the forecast row for a given race date. Returns null if the date is
 * outside the forecast window (more than ~7 days away, or in the past).
 */
export function forecastForDate(forecast, raceDate) {
  if (!forecast?.daily || !raceDate) return null;
  return forecast.daily.find((d) => d.date === raceDate) || null;
}
