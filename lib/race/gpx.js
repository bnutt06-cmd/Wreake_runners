// lib/race/gpx.js
// ============================================================
// GPX parsing — pure functions, browser-safe.
//
// Parses a GPX (XML) file into:
//   - points: [{ lat, lon, ele }]
//   - distance_m: total distance in metres (Haversine)
//   - elevation_gain_m / elevation_loss_m: cumulative climb/descent
//   - bounds: { minLat, maxLat, minLon, maxLon } for map fitting
//
// Designed to be:
//   - Tolerant: handles GPX from Strava, Garmin, plotaroute, etc.
//   - Lossy by design: returns a simplified ~200-point path for rendering.
//   - No dependencies — uses DOMParser, available in every modern browser.
// ============================================================

const TARGET_POINTS_FOR_RENDER = 200;
const ELEVATION_NOISE_THRESHOLD_M = 1.5; // Filter GPS jitter below this delta

/**
 * Parse a GPX XML string into structured data.
 * Returns null if parsing fails.
 */
export function parseGpx(xmlString) {
  if (typeof window === "undefined") return null; // SSR safety
  if (!xmlString || typeof xmlString !== "string") return null;

  let doc;
  try {
    doc = new DOMParser().parseFromString(xmlString, "application/xml");
  } catch {
    return null;
  }
  if (doc.querySelector("parsererror")) return null;

  // GPX has <trk><trkseg><trkpt lat="" lon=""><ele>…</ele></trkpt></trkseg></trk>
  // Some files use <rte><rtept> instead. Try both.
  let pts = Array.from(doc.querySelectorAll("trkpt"));
  if (pts.length === 0) pts = Array.from(doc.querySelectorAll("rtept"));
  if (pts.length === 0) return null;

  const rawPoints = pts
    .map((p) => {
      const lat = parseFloat(p.getAttribute("lat"));
      const lon = parseFloat(p.getAttribute("lon"));
      const eleEl = p.querySelector("ele");
      const ele = eleEl ? parseFloat(eleEl.textContent) : null;
      if (isNaN(lat) || isNaN(lon)) return null;
      return { lat, lon, ele: isNaN(ele) ? null : ele };
    })
    .filter(Boolean);

  if (rawPoints.length < 2) return null;

  const distance_m = calcDistance(rawPoints);
  const { gain_m, loss_m } = calcElevation(rawPoints);
  const bounds = calcBounds(rawPoints);
  const renderPoints = simplify(rawPoints, TARGET_POINTS_FOR_RENDER);
  const elevationProfile = elevationProfileFor(renderPoints, rawPoints, distance_m);

  return {
    points: renderPoints,
    point_count_raw: rawPoints.length,
    distance_m,
    elevation_gain_m: gain_m,
    elevation_loss_m: loss_m,
    bounds,
    start: rawPoints[0],
    elevation_profile: elevationProfile,
  };
}

// ============================================================
// Distance — Haversine formula along all raw points
// ============================================================
function calcDistance(points) {
  const R = 6371000; // Earth radius, metres
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    total += 2 * R * Math.asin(Math.sqrt(h));
  }
  return Math.round(total);
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// ============================================================
// Elevation — sum positive/negative deltas, filtering GPS noise
// ============================================================
function calcElevation(points) {
  let gain = 0;
  let loss = 0;
  let lastEle = null;
  for (const p of points) {
    if (p.ele == null) continue;
    if (lastEle == null) {
      lastEle = p.ele;
      continue;
    }
    const d = p.ele - lastEle;
    if (Math.abs(d) >= ELEVATION_NOISE_THRESHOLD_M) {
      if (d > 0) gain += d;
      else loss -= d;
      lastEle = p.ele;
    }
  }
  return { gain_m: Math.round(gain), loss_m: Math.round(loss) };
}

// ============================================================
// Bounds for map fit
// ============================================================
function calcBounds(points) {
  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }
  return { minLat, maxLat, minLon, maxLon };
}

// ============================================================
// Simplify — even sampling to ~target points
//   Cheaper than Ramer-Douglas-Peucker, plenty smooth for a 10K route.
// ============================================================
function simplify(points, target) {
  if (points.length <= target) return points;
  const step = points.length / target;
  const out = [];
  for (let i = 0; i < target; i++) {
    out.push(points[Math.floor(i * step)]);
  }
  // Always include the final point.
  if (out[out.length - 1] !== points[points.length - 1]) {
    out.push(points[points.length - 1]);
  }
  return out;
}

// ============================================================
// Elevation profile — one (km, ele) pair per render point
// ============================================================
function elevationProfileFor(renderPoints, rawPoints, totalDistance_m) {
  // Build cumulative distance along raw points, then map render points to it.
  // Approximation is fine for a profile chart.
  const profile = [];
  let cum = 0;
  const renderSet = new Set(renderPoints.map((p) => `${p.lat},${p.lon}`));
  for (let i = 0; i < rawPoints.length; i++) {
    if (i > 0) {
      const a = rawPoints[i - 1];
      const b = rawPoints[i];
      const R = 6371000;
      const dLat = toRad(b.lat - a.lat);
      const dLon = toRad(b.lon - a.lon);
      const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
      cum += 2 * R * Math.asin(Math.sqrt(h));
    }
    if (renderSet.has(`${rawPoints[i].lat},${rawPoints[i].lon}`)) {
      profile.push({
        km: cum / 1000,
        ele: rawPoints[i].ele,
      });
    }
  }
  return profile;
}

// ============================================================
// Formatting helpers
// ============================================================
export function fmtDistance(m) {
  if (m == null) return "—";
  if (m < 1000) return `${m} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

export function fmtElevation(m) {
  if (m == null) return "—";
  return `${Math.round(m)} m`;
}
