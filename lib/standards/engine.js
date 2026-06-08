// lib/standards/engine.js
// =============================================================
// Club Standards calculation engine — PURE functions, no I/O.
//
// All logic here is deterministic given its inputs. Heavy use:
//   - assignCategory(gender, dob, asOfYear)
//   - parseTimeToSeconds("01:35:58")
//   - secondsToHms(5758)
//   - evaluateSubmissions(logs, scheme, lookup, category)
//
// Two evaluation schemes, defined by the PRD:
//   - "wreake": allows virtual/solo + any 5K; no geo rules
//   - "lrrl":   official races only; 5K must be Leics/Rutland;
//               Standard needs ≥3 Leics distances; Distinction ≥6
// =============================================================

export const DISTANCES = [
  "5K", "5 miles", "6 miles", "10K", "7 miles",
  "8 miles", "10 miles", "HM", "20 miles", "Marathon",
];

// Tiers from hardest (top) to easiest (bottom), per PRD.
export const TIERS = [
  "Rhodium", "Platinum", "Diamond", "Gold", "Silver",
  "Bronze", "Copper", "Pewter", "Tungsten",
];

export const TIER_COLORS = {
  Rhodium:   "#E5E4E2",
  Platinum:  "#5FD0E6",
  Diamond:   "#B9F2FF",
  Gold:      "#D4AF37",
  Silver:    "#9CA3AF",
  Bronze:    "#A87034",
  Copper:    "#B87333",
  Pewter:    "#8A9597",
  Tungsten:  "#4A4A4A",
};

// Standard / Distinction thresholds (PRD § 2B).
export const STANDARD_COUNT = 5;
export const DISTINCTION_COUNT = 9;

// LRRL geo requirements.
export const LRRL_STANDARD_GEO_MIN = 3;
export const LRRL_DISTINCTION_GEO_MIN = 6;

// =============================================================
// Category assignment (PRD § 2A)
// =============================================================
const MALE_BANDS = [
  ["MALE SENIOR", 0, 34],
  ["MALE 35-39", 35, 39], ["MALE 40-44", 40, 44],
  ["MALE 45-49", 45, 49], ["MALE 50-54", 50, 54],
  ["MALE 55-59", 55, 59], ["MALE 60-64", 60, 64],
  ["MALE 65-69", 65, 69], ["MALE 70-74", 70, 74],
  ["MALE 75-79", 75, 79], ["MALE 80-84", 80, 84],
  ["MALE 85-89", 85, 89],
];

const FEMALE_BANDS = [
  ["FEMALE SENIOR", 0, 34],
  ["FEMALE 35-39", 35, 39], ["FEMALE 40-44", 40, 44],
  ["FEMALE 45-49", 45, 49], ["FEMALE 50-54", 50, 54],
  ["FEMALE 55-59", 55, 59], ["FEMALE 60-64", 60, 64],
  ["FEMALE 65-69", 65, 69], ["FEMALE 70-74", 70, 74],
  ["FEMALE 75-79", 75, 79],
];

export const ALL_CATEGORIES = [
  ...MALE_BANDS.map((b) => b[0]),
  ...FEMALE_BANDS.map((b) => b[0]),
];

/**
 * Calculate age on a given reference date. By default, "age on race day"
 * uses the race date; for category assignment we use Dec 31 of the season
 * year (per the PRD's "calendar year" framing).
 */
export function ageOn(dobStr, refDate) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const ref = refDate instanceof Date ? refDate : new Date(refDate);
  if (isNaN(dob) || isNaN(ref)) return null;
  let age = ref.getFullYear() - dob.getFullYear();
  const m = ref.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) age--;
  return age;
}

/**
 * Assign category based on gender + DOB, evaluated against the season year.
 * Per the PRD, season year is the current calendar year (Jan 1 – Dec 31).
 * Returns null if input is incomplete or out-of-range.
 */
export function assignCategory(gender, dob, seasonYear = new Date().getFullYear()) {
  if (!gender || !dob) return null;
  const ref = new Date(seasonYear, 11, 31); // Dec 31 of season year
  const age = ageOn(dob, ref);
  if (age == null || age < 0) return null;

  const bands = gender.toLowerCase() === "male" ? MALE_BANDS : FEMALE_BANDS;
  for (const [name, lo, hi] of bands) {
    if (age >= lo && age <= hi) return name;
  }
  // Older than the oldest band — fall to the last band rather than dropping.
  return bands[bands.length - 1][0];
}

// =============================================================
// Time parsing / formatting
// =============================================================

/**
 * Parse HH:MM:SS, MM:SS, or even raw seconds into total integer seconds.
 * Returns null for invalid input.
 */
export function parseTimeToSeconds(str) {
  if (str == null) return null;
  const s = String(str).trim();
  if (!s) return null;

  if (/^\d+$/.test(s)) return parseInt(s, 10);

  const parts = s.split(":").map((p) => p.trim());
  if (!parts.every((p) => /^\d{1,2}$/.test(p))) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => isNaN(n))) return null;

  if (nums.length === 2) {
    const [m, sec] = nums;
    if (sec >= 60) return null;
    return m * 60 + sec;
  }
  if (nums.length === 3) {
    const [h, m, sec] = nums;
    if (m >= 60 || sec >= 60) return null;
    return h * 3600 + m * 60 + sec;
  }
  return null;
}

/** Format an integer second count as HH:MM:SS (always 3 segments). */
export function secondsToHms(total) {
  if (total == null || isNaN(total)) return "—";
  const s = Math.max(0, Math.round(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Short format — mm:ss when under an hour, else hh:mm:ss. */
export function secondsToShort(total) {
  if (total == null || isNaN(total)) return "—";
  const s = Math.max(0, Math.round(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h === 0) return `${m}:${String(r).padStart(2, "0")}`;
  return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

// =============================================================
// Submission eligibility (PRD § 2B — Validation Matrix)
// =============================================================

/**
 * Decide whether a single submission is eligible to count toward each scheme.
 * Pure: returns { wreake: bool, lrrl: bool, reasons: { wreake: [], lrrl: [] } }
 *
 * log shape:
 *   {
 *     distance, achieved_time_seconds, race_date,
 *     is_virtual, is_leicestershire_region, is_valid_lrrl_5k,
 *   }
 */
export function evaluateEligibility(log) {
  const reasons = { wreake: [], lrrl: [] };

  // Wreake: allows virtual/solo; any 5K counts; no geo rules.
  const wreake = true; // No disqualifiers at submission time.

  // LRRL: official races only; 5K must be a valid LRRL 5K; geo checked later.
  let lrrl = true;
  if (log.is_virtual) {
    lrrl = false;
    reasons.lrrl.push("LRRL requires official chip/measured races only");
  }
  if (log.distance === "5K" && log.is_valid_lrrl_5k === false) {
    lrrl = false;
    reasons.lrrl.push("LRRL 5Ks must be a Leics/Rutland parkrun or official 5K");
  }

  return { wreake, lrrl, reasons };
}

// =============================================================
// Target lookup
// =============================================================

/**
 * Find the target time (seconds) for category+distance+tier.
 * Lookup is the in-memory standards table.
 */
export function getTarget(lookup, category, distance, tier) {
  if (!lookup || !category) return null;
  const row = lookup.find(
    (r) => r.category === category && r.distance === distance && r.tier === tier
  );
  return row ? row.target_time_seconds : null;
}

/**
 * For a category+distance, return an object mapping tier → target seconds.
 */
export function getTierTargets(lookup, category, distance) {
  const out = {};
  if (!lookup || !category) return out;
  TIERS.forEach((tier) => {
    out[tier] = getTarget(lookup, category, distance, tier);
  });
  return out;
}

// =============================================================
// Highest tier cleared by a single time
// =============================================================

/**
 * Given a time in seconds and the target map for a distance,
 * return the highest tier (hardest = first in TIERS) the time clears,
 * or null if it doesn't even clear Tungsten.
 */
export function highestTierFor(seconds, tierTargets) {
  if (seconds == null || isNaN(seconds)) return null;
  for (const tier of TIERS) {
    const t = tierTargets[tier];
    if (t != null && seconds <= t) return tier;
  }
  return null;
}

// =============================================================
// Scheme evaluation: given all of a member's submissions,
// compute progress toward Standard / Distinction in a scheme.
// =============================================================

/**
 * @param logs       array of submission objects
 * @param scheme     "wreake" | "lrrl"
 * @param lookup     standards lookup table
 * @param category   the member's assigned category
 * @returns {
 *   eligibleLogs:        logs that count for this scheme
 *   bestPerDistance:     { [distance]: { seconds, log } }   // fastest eligible time per distance
 *   tierAtDistance:      { [distance]: tier }               // highest tier each cleared distance hit
 *   distinctDistances:   number of unique distances with ANY tier cleared
 *   geoOkForStandard:    bool   (LRRL only; always true for wreake)
 *   geoOkForDistinction: bool
 *   achievedTier:        the *overall* tier reached
 *                          = the tier that has at least N distinct cleared distances
 *                            (N = 5 for Standard, 9 for Distinction)
 *   standard:            { tier|null, geoOk }
 *   distinction:         { tier|null, geoOk }
 * }
 *
 * "Overall tier" logic: a member is at tier T overall when they have N+
 * distinct distances where each cleared tier T or harder. We start at the
 * hardest tier and walk down until the count is satisfied.
 */
export function evaluateScheme({ logs, scheme, lookup, category }) {
  const eligibleLogs = (logs || []).filter((l) => {
    const e = evaluateEligibility(l);
    return scheme === "wreake" ? e.wreake : e.lrrl;
  });

  // For each distance, keep the best (lowest seconds) eligible time.
  const bestPerDistance = {};
  for (const log of eligibleLogs) {
    const cur = bestPerDistance[log.distance];
    if (!cur || log.achieved_time_seconds < cur.seconds) {
      bestPerDistance[log.distance] = { seconds: log.achieved_time_seconds, log };
    }
  }

  // Map each cleared distance to its highest tier.
  const tierAtDistance = {};
  for (const [distance, { seconds }] of Object.entries(bestPerDistance)) {
    const targets = getTierTargets(lookup, category, distance);
    const tier = highestTierFor(seconds, targets);
    if (tier) tierAtDistance[distance] = tier;
  }

  const distinctDistances = Object.keys(tierAtDistance).length;

  // Find the overall tier: hardest tier where N+ distances cleared *at or above* it.
  function overallTierFor(n) {
    for (const tier of TIERS) {
      // Count distances whose cleared tier is at least as hard as `tier`.
      const tierIdx = TIERS.indexOf(tier);
      const count = Object.values(tierAtDistance).filter(
        (t) => TIERS.indexOf(t) <= tierIdx
      ).length;
      if (count >= n) return tier;
    }
    return null;
  }

  // Geo check (LRRL only).
  let standardGeo = 0;
  let distinctionGeo = 0;
  if (scheme === "lrrl") {
    // Count eligible best-per-distance logs that are in Leics/Rutland.
    const geoLogs = Object.values(bestPerDistance).filter(
      (b) => b.log.is_leicestershire_region
    );
    standardGeo = geoLogs.length;
    distinctionGeo = geoLogs.length;
  }

  const geoOkForStandard = scheme === "wreake" || standardGeo >= LRRL_STANDARD_GEO_MIN;
  const geoOkForDistinction = scheme === "wreake" || distinctionGeo >= LRRL_DISTINCTION_GEO_MIN;

  const standardTier = overallTierFor(STANDARD_COUNT);
  const distinctionTier = overallTierFor(DISTINCTION_COUNT);

  return {
    eligibleLogs,
    bestPerDistance,
    tierAtDistance,
    distinctDistances,
    geoOkForStandard,
    geoOkForDistinction,
    standard: { tier: geoOkForStandard ? standardTier : null, geoOk: geoOkForStandard, tierRaw: standardTier },
    distinction: { tier: geoOkForDistinction ? distinctionTier : null, geoOk: geoOkForDistinction, tierRaw: distinctionTier },
  };
}
