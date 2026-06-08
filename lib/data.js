// ============================================================
// lib/data.js
// Club brand colours (sampled from the Wreake Runners logo)
// and seed content for the POC.
//
// PRODUCTION NOTE: replace SEED_NEWS / SEED_RACES with calls to
// Supabase. Keep COLORS as-is — it's the design system.
// ============================================================

export const COLORS = {
  ink: "#1E2A6E", // deep navy/indigo — the WREAKE wordmark
  paper: "#F5F8FB", // crisp cool off-white
  sky: "#2589BA", // logo swoosh blue
  teal: "#1597B8", // logo swoosh teal (accent)
  green: "#2E9E8F", // supporting teal-green for success states
  mist: "#DDE6F0", // cool light border/fill
  cyan: "#5FD0E6", // bright highlight
};

export const SEED_NEWS = [
  {
    id: 1,
    title: "Rotherby 8 returns for 2026 — entries now open",
    author: "Sarah M.",
    date: "2026-06-02",
    tag: "Race",
    excerpt:
      "Our flagship LRRL race, run jointly with Team Anstey, is back. Volunteers and runners both needed — sign up on the Races page.",
    body:
      "The Rotherby 8 is a club institution and one of the highlights of the Leicestershire Road Running League calendar. This year we're expecting our biggest field yet. Whether you're racing or marshalling, we'd love your support. Marshals get first pick of the post-race cake.",
  },
  {
    id: 2,
    title: "New 5–10k progression group launches this month",
    author: "Dave P.",
    date: "2026-05-28",
    tag: "Club",
    excerpt:
      "Bridging the gap between our beginners 5k and the main club sessions. Tuesdays at 6.45pm from the hall.",
    body:
      "Following the success of our beginners 5k groups, we're adding a structured 5–10k progression group. Perfect for anyone who's finished couch-to-5k and wants to build distance with friendly support and a proper plan.",
  },
  {
    id: 3,
    title: "Track sessions move to fortnightly through summer",
    author: "Coach Team",
    date: "2026-05-20",
    tag: "Training",
    excerpt:
      "Lighter evenings mean more track. Strength & conditioning continues at no extra cost to members.",
    body:
      "Our fortnightly track sessions are a brilliant way to sharpen up your speed in a supportive environment. All paces welcome — sessions are scaled so everyone gets a quality workout.",
  },
];

export const SEED_RACES = [
  {
    id: 1,
    name: "Rotherby 8",
    date: "2026-08-09",
    distance: "8 miles",
    location: "Rotherby, Leicestershire",
    type: "LRRL League Race",
    blurb: "Our own flagship race, co-hosted with Team Anstey. Rolling country roads.",
  },
  {
    id: 2,
    name: "The 3 Club Challenge",
    date: "2026-07-12",
    distance: "Various",
    location: "Syston & surrounding",
    type: "Club Series",
    blurb: "A friendly inter-club series testing all abilities across the summer.",
  },
  {
    id: 3,
    name: "Watermead parkrun Takeover",
    date: "2026-06-21",
    distance: "5k",
    location: "Watermead Country Park",
    type: "Social / parkrun",
    blurb: "Club takeover morning — marshalling, pacing and a café stop after.",
  },
];

// Demo credentials only. PRODUCTION: use Supabase Auth / Clerk, never hard-code.
export const DEMO_MEMBER = { username: "member", password: "wreake" };

export const TAGS = ["Race", "Club", "Training", "Social"];

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
