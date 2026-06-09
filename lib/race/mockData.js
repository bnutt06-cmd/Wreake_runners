// lib/race/mockData.js
// Extended race entries used by the Race Hub modal.
// Once the races table exists in Supabase, this is replaced by a query.

// Pre-computed GPX-derived fields for the mock races. In production, these
// are read off the races row (parsed once at upload time and stored).
// Coordinates are realistic for Leicestershire-area routes.

function genCirclePath(centerLat, centerLon, radiusKm, points = 80) {
  // A roughly circular loop of `points` lat/lon pairs for map preview.
  const out = [];
  const R = 6371;
  const latRad = (centerLat * Math.PI) / 180;
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * 2 * Math.PI;
    const dLat = (radiusKm / R) * (180 / Math.PI) * Math.cos(a);
    const dLon =
      (radiusKm / R) * (180 / Math.PI) * Math.sin(a) / Math.cos(latRad);
    out.push({
      lat: +(centerLat + dLat).toFixed(6),
      lon: +(centerLon + dLon).toFixed(6),
      ele: 80 + 30 * Math.sin(a * 3) + Math.random() * 5,
    });
  }
  return out;
}

export const RACE_DETAILS = {
  "race-1": {
    // Rotherby 8 — Leicestershire countryside
    start_lat: 52.7345,
    start_lon: -0.8932,
    route: genCirclePath(52.7345, -0.8932, 2.0, 100),
    distance_m: 12875, // 8 miles
    elevation_gain_m: 142,
    elevation_loss_m: 138,
    description:
      "Our flagship race, co-hosted with Team Anstey. The route rolls through " +
      "quintessential Leicestershire farmland — undulating but never brutal. " +
      "Strong field every year; PB potential if you pace it right.",
    course_notes:
      "Start/finish on the village green. One steep climb at mile 3 (Ashby Lane). " +
      "Long descent into mile 6, then a flat finish.",
  },
  "race-2": {
    // 3 Club Challenge — Syston area
    start_lat: 52.6852,
    start_lon: -1.0850,
    route: genCirclePath(52.6852, -1.0850, 1.2, 80),
    distance_m: 8050,
    elevation_gain_m: 65,
    elevation_loss_m: 65,
    description:
      "A friendly inter-club series with Birstall and Anstey, hosted by each " +
      "club in rotation across the summer. Casual atmosphere, fast course.",
    course_notes:
      "Mostly flat with one rolling section through Watermead. Suitable for all abilities.",
  },
  "race-3": {
    // Watermead parkrun
    start_lat: 52.6722,
    start_lon: -1.1102,
    route: genCirclePath(52.6722, -1.1102, 0.6, 60),
    distance_m: 5000,
    elevation_gain_m: 18,
    elevation_loss_m: 18,
    description:
      "Club takeover morning at Watermead Country Park. Marshalling spots " +
      "available; pacers for sub-25, sub-22, sub-20. Café stop after.",
    course_notes:
      "Lap of the lake — flat, fast, slightly twisty in places. Wear road shoes.",
  },
  "race-4": {
    // LXC Round 3 — Bradgate Park
    start_lat: 52.6905,
    start_lon: -1.2255,
    route: genCirclePath(52.6905, -1.2255, 1.5, 90),
    distance_m: 10200,
    elevation_gain_m: 215,
    elevation_loss_m: 215,
    description:
      "Third fixture of the Leicestershire cross-country season. Hilly, " +
      "off-road, often muddy by November. Strong team event — every finisher counts.",
    course_notes:
      "Two laps around Old John. Spikes strongly recommended. Bring trail shoes if it's been wet.",
  },
  "race-5": {
    // Equinox 24 — Belvoir Castle
    start_lat: 52.8920,
    start_lon: -0.7795,
    route: genCirclePath(52.8920, -0.7795, 1.8, 100),
    distance_m: 8400, // 1 lap
    elevation_gain_m: 105,
    elevation_loss_m: 105,
    description:
      "Annual 24-hour trail relay around the Belvoir Castle estate. Club enters " +
      "multiple teams of 4-8 runners. Camping on-site Friday-Sunday; epic atmosphere.",
    course_notes:
      "One lap = ~5.2 miles. Trail underfoot, some hills, beautiful scenery. " +
      "Head torches mandatory for laps starting after sunset.",
  },
};
