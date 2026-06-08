// lib/standards/lookup.js
// =============================================================
// Generated placeholder standards. Realistic but NOT official.
// Replace with the club's verified times before launch:
//   replace `STANDARDS_LOOKUP` export with the real ~990 rows.
// =============================================================

import { DISTANCES, TIERS, ALL_CATEGORIES } from "./engine";

// Tungsten (easiest, tier 9) baseline times in seconds, MALE SENIOR.
// These reflect typical "competent club runner" finishing times.
const MALE_SENIOR_TUNGSTEN = {
  "5K":        25 * 60,                  // 25:00
  "5 miles":   42 * 60,                  // 42:00
  "6 miles":   52 * 60,                  // 52:00
  "10K":       55 * 60,                  // 55:00
  "7 miles":   63 * 60,                  // 1:03:00
  "8 miles":   73 * 60,                  // 1:13:00
  "10 miles":  92 * 60,                  // 1:32:00
  "HM":        125 * 60,                 // 2:05:00
  "20 miles":  205 * 60,                 // 3:25:00
  "Marathon":  280 * 60,                 // 4:40:00
};

// Multiplier for each tier from easiest (Tungsten) to hardest (Rhodium).
// Each step shaves ~6-7% from the time.
// TIERS is hardest-first, so reverse to apply.
const TIER_MULTIPLIERS = {
  Tungsten:  1.00,
  Pewter:    0.94,
  Copper:    0.88,
  Bronze:    0.83,
  Silver:    0.78,
  Gold:      0.73,
  Diamond:   0.68,
  Platinum:  0.64,
  Rhodium:   0.60,
};

// Age-bracket multiplier vs. SENIOR baseline.
// Females start ~10% slower than males (placeholder).
// Each decade past 35 adds ~5-8% slowdown.
const AGE_MULTIPLIER = {
  "SENIOR": 1.00,
  "35-39":  1.04,
  "40-44":  1.08,
  "45-49":  1.13,
  "50-54":  1.19,
  "55-59":  1.26,
  "60-64":  1.35,
  "65-69":  1.45,
  "70-74":  1.57,
  "75-79":  1.71,
  "80-84":  1.87,
  "85-89":  2.05,
};

const FEMALE_BASE_MULTIPLIER = 1.10;

function bandFromCategory(cat) {
  const parts = cat.split(" ");
  return parts.slice(1).join(" "); // "MALE 45-49" → "45-49"
}

function genderFromCategory(cat) {
  return cat.startsWith("MALE") ? "MALE" : "FEMALE";
}

/**
 * Build the full lookup table at module load.
 * 22 categories × 10 distances × 9 tiers = 1,980 rows.
 *
 * Note: PRD says ~990 rows because the user opted for same times for both
 * schemes. We store rows once; scheme-specific rules are applied at
 * evaluation time, not in this table.
 */
export const STANDARDS_LOOKUP = (function build() {
  const rows = [];
  for (const category of ALL_CATEGORIES) {
    const gender = genderFromCategory(category);
    const band = bandFromCategory(category);
    const ageMult = AGE_MULTIPLIER[band] ?? 1.0;
    const genderMult = gender === "FEMALE" ? FEMALE_BASE_MULTIPLIER : 1.0;

    for (const distance of DISTANCES) {
      const tungstenSec = MALE_SENIOR_TUNGSTEN[distance];
      for (const tier of TIERS) {
        const target = tungstenSec * TIER_MULTIPLIERS[tier] * ageMult * genderMult;
        rows.push({
          category,
          distance,
          tier,
          target_time_seconds: Math.round(target),
        });
      }
    }
  }
  return rows;
})();
