// Registry of race results. To add a new race:
//  1. Drop its JSON file in lib/results/ (same shape as the others)
//  2. Import it here and add it to the RESULTS array
//  3. Keep the array sorted newest-first
import swithland2026 from "./swithland-6-2026.json";
import westend2026 from "./west-end-8-2026.json";
import watermead2026 from "./watermead-10k-2026.json";
import bosworth2026 from "./bosworth-half-2026.json";
import kibworth2026 from "./kibworth-6-2026.json";
import desford2026 from "./desford-5-2026.json";

export const RESULTS = [
  swithland2026,   // 7 Jun
  westend2026,     // 31 May
  watermead2026,   // 20 May
  bosworth2026,    // 10 May
  kibworth2026,    // 1 Mar
  desford2026,     // 25 Jan
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

// ---- Personal results matching ----
function norm(s) {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

// Flexible match of a results-row name to a member's first + last name.
// Requires the last name present, plus the first name or its initial.
export function nameMatches(rowName, firstName, lastName) {
  const row = norm(rowName);
  const f = norm(firstName);
  const l = norm(lastName);
  if (!row || (!f && !l)) return false;
  const hasLast = l ? row.includes(l) : false;
  const hasFirst = f ? (row.includes(f) || row.startsWith(f[0] + " ")) : false;
  if (l && f) return hasLast && hasFirst;
  if (l) return hasLast;
  return hasFirst;
}

// A member's results across ALL loaded races, newest first.
// Returns [{ raceId, raceName, dateLabel, date, distance, status, row }].
export function memberHistory(firstName, lastName) {
  const out = [];
  for (const race of RESULTS) {
    for (const row of race.results) {
      if (
        row.club &&
        row.club.toLowerCase() === "wreake runners" &&
        nameMatches(row.name, firstName, lastName)
      ) {
        out.push({
          raceId: race.id,
          raceName: race.name,
          dateLabel: race.dateLabel,
          date: race.date,
          distance: race.distance,
          status: race.status,
          row,
        });
      }
    }
  }
  out.sort((a, b) => (a.date < b.date ? 1 : -1));
  return out;
}
