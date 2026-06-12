// Registry of race results. To add a new race:
//  1. Drop its JSON file in lib/results/ (same shape as the others)
//  2. Import it here and add it to the RESULTS array
//  3. Keep the array sorted newest-first
import swithland2026 from "./swithland-6-2026.json";

export const RESULTS = [
  swithland2026,
];

export function getRace(id) {
  return RESULTS.find((r) => r.id === id) || null;
}

// Light summary list for the index page (without the heavy results array).
export function raceSummaries() {
  return RESULTS.map((r) => ({
    id: r.id,
    name: r.name,
    date: r.date,
    dateLabel: r.dateLabel,
    distance: r.distance,
    status: r.status,
    totalFinishers: r.totalFinishers,
    wreakeCount: r.results.filter((x) => x.club.toLowerCase() === "wreake runners").length,
  }));
}
