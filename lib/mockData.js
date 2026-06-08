// lib/mockData.js
// Mock data for the Club Area. Replace with Supabase queries once the
// new tables (races, race_registrations, club_events) are in place.

// ---------- PINNED POST ----------
export const PINNED_POST = {
  id: "pin-1",
  title: "Track session moved indoors tonight",
  body: "Heavy rain forecast — we're moving tonight's interval session to the indoor facility. Same time, 6:45pm. Bring road trainers, no spikes.",
  posted_at: "2026-06-08T09:00:00Z",
  author: "Coach Team",
};

// ---------- MOCK RACES ----------
// id is a UUID-style string so it matches the v4 schema shape.
export const MOCK_RACES = [
  {
    id: "race-1",
    name: "Rotherby 8",
    race_date: "2026-08-09",
    location: "Rotherby, Leicestershire",
    distance: "8 miles",
    type: "LRRL League Race",
    blurb: "Our flagship race, co-hosted with Team Anstey. Rolling country roads.",
    external_signup_url: "https://example.com/rotherby-8",
  },
  {
    id: "race-2",
    name: "The 3 Club Challenge",
    race_date: "2026-07-12",
    location: "Syston & surrounding",
    distance: "Various",
    type: "Club Series",
    blurb: "A friendly inter-club series testing all abilities across the summer.",
    external_signup_url: null,
  },
  {
    id: "race-3",
    name: "Watermead parkrun Takeover",
    race_date: "2026-06-21",
    location: "Watermead Country Park",
    distance: "5k",
    type: "Social / parkrun",
    blurb: "Club takeover morning — marshalling, pacing and a café stop after.",
    external_signup_url: "https://www.parkrun.org.uk/watermeadcountrypark/",
  },
  {
    id: "race-4",
    name: "Leicestershire XC Round 3",
    race_date: "2026-11-08",
    location: "Bradgate Park",
    distance: "~10k cross-country",
    type: "Cross-country League",
    blurb: "Third fixture of the LXC season. Spikes recommended.",
    external_signup_url: null,
  },
  {
    id: "race-5",
    name: "Equinox 24",
    race_date: "2026-09-19",
    location: "Belvoir Castle",
    distance: "24h relay",
    type: "Endurance / Team",
    blurb: "Annual 24-hour trail relay. Club enters multiple teams.",
    external_signup_url: "https://example.com/equinox24",
  },
];

// ---------- MOCK ROSTERS ("Who's Running") ----------
// Maps race id → array of {name, initials, color}. Lightweight avatar data.
export const MOCK_ROSTERS = {
  "race-1": [
    { id: "u1", name: "Sarah M.", initials: "SM", color: "#2589BA" },
    { id: "u2", name: "Dave P.", initials: "DP", color: "#1597B8" },
    { id: "u3", name: "Ben N.", initials: "BN", color: "#2E9E8F" },
    { id: "u4", name: "Helen R.", initials: "HR", color: "#5FD0E6" },
    { id: "u5", name: "Tom K.", initials: "TK", color: "#1E2A6E" },
  ],
  "race-2": [
    { id: "u2", name: "Dave P.", initials: "DP", color: "#1597B8" },
    { id: "u6", name: "Anna L.", initials: "AL", color: "#2E9E8F" },
  ],
  "race-3": [
    { id: "u1", name: "Sarah M.", initials: "SM", color: "#2589BA" },
    { id: "u3", name: "Ben N.", initials: "BN", color: "#2E9E8F" },
    { id: "u6", name: "Anna L.", initials: "AL", color: "#2E9E8F" },
    { id: "u7", name: "Mike B.", initials: "MB", color: "#1597B8" },
    { id: "u8", name: "Jess W.", initials: "JW", color: "#5FD0E6" },
    { id: "u9", name: "Rob T.", initials: "RT", color: "#2589BA" },
    { id: "u10", name: "Lucy H.", initials: "LH", color: "#1E2A6E" },
  ],
  "race-4": [],
  "race-5": [
    { id: "u3", name: "Ben N.", initials: "BN", color: "#2E9E8F" },
    { id: "u4", name: "Helen R.", initials: "HR", color: "#5FD0E6" },
    { id: "u5", name: "Tom K.", initials: "TK", color: "#1E2A6E" },
  ],
};

// ---------- CLUB NIGHTS CALENDAR ----------
// One entry per upcoming club night/event. Used by the mini calendar widget.
// In production, derived from public.club_events.
export const MOCK_CLUB_NIGHTS = [
  // June 2026
  { date: "2026-06-09", time: "6:45 PM", title: "Interval Training", type: "Training" },
  { date: "2026-06-10", time: "7:30 PM", title: "Strength & Conditioning", type: "Training" },
  { date: "2026-06-11", time: "6:45 PM", title: "Easy Group Run", type: "Training" },
  { date: "2026-06-12", time: "8:00 PM", title: "Pub Social", type: "Social" },
  { date: "2026-06-16", time: "6:45 PM", title: "Track Session", type: "Training" },
  { date: "2026-06-18", time: "6:45 PM", title: "Hill Reps", type: "Training" },
  { date: "2026-06-21", time: "9:00 AM", title: "Parkrun Takeover", type: "Social" },
  { date: "2026-06-23", time: "6:45 PM", title: "Interval Training", type: "Training" },
  { date: "2026-06-25", time: "6:45 PM", title: "Threshold Run", type: "Training" },
  { date: "2026-06-26", time: "7:00 PM", title: "AGM", type: "Meeting" },
  { date: "2026-06-30", time: "6:45 PM", title: "Track Session", type: "Training" },
];

// ---------- CLUB EVENTS (full list, for the Events tab) ----------
export const MOCK_EVENTS = [
  {
    id: "evt-1",
    title: "Annual General Meeting",
    description: "Yearly committee meeting — all members welcome. Voting on next year's race calendar and committee elections.",
    event_timestamp: "2026-06-26T19:00:00Z",
    event_type: "Meeting",
    location: "Club Hall, Broad Street",
  },
  {
    id: "evt-2",
    title: "Sports Massage Workshop",
    description: "Guest sports therapist running a session on injury prevention and self-massage techniques. Free for members.",
    event_timestamp: "2026-07-03T19:30:00Z",
    event_type: "Training",
    location: "Club Hall, Broad Street",
  },
  {
    id: "evt-3",
    title: "Summer BBQ",
    description: "Annual club BBQ at the local park. Bring family and friends. £5 contribution per adult.",
    event_timestamp: "2026-07-19T13:00:00Z",
    event_type: "Social",
    location: "Watermead Park (north shelter)",
  },
  {
    id: "evt-4",
    title: "Marathon Training Clinic",
    description: "Half-day clinic for those building toward autumn marathons. Coached track work plus nutrition Q&A.",
    event_timestamp: "2026-07-26T09:00:00Z",
    event_type: "Training",
    location: "Saffron Lane Athletics Track",
  },
];

// ---------- CLUB STANDARDS THRESHOLDS ----------
// Times in seconds. Distance keys match what users input.
// Real tables would come from the club's official standards doc.
export const STANDARDS_TIMES = {
  "5k": {
    Platinum: 17 * 60 + 30,   // 17:30
    Gold: 19 * 60 + 30,        // 19:30
    Silver: 22 * 60,           // 22:00
    Bronze: 25 * 60,           // 25:00
  },
  "10k": {
    Platinum: 36 * 60,         // 36:00
    Gold: 40 * 60,             // 40:00
    Silver: 46 * 60,           // 46:00
    Bronze: 52 * 60,           // 52:00
  },
  "Half Marathon": {
    Platinum: 80 * 60,         // 1:20:00
    Gold: 90 * 60,             // 1:30:00
    Silver: 105 * 60,          // 1:45:00
    Bronze: 120 * 60,          // 2:00:00
  },
  Marathon: {
    Platinum: 165 * 60,        // 2:45:00
    Gold: 190 * 60,            // 3:10:00
    Silver: 225 * 60,          // 3:45:00
    Bronze: 270 * 60,          // 4:30:00
  },
};

export const STANDARDS_DISTANCES = ["5k", "10k", "Half Marathon", "Marathon"];
export const STANDARDS_TIERS = ["Bronze", "Silver", "Gold", "Platinum"];

// ---------- HELPERS ----------
export function parseTimeToSeconds(str) {
  // Accepts "mm:ss" or "hh:mm:ss"
  if (!str) return null;
  const parts = str.trim().split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

export function secondsToTime(sec) {
  if (sec == null || isNaN(sec)) return "—";
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const then = new Date(dateStr);
  then.setHours(0, 0, 0, 0);
  return Math.round((then - now) / (1000 * 60 * 60 * 24));
}

export function countdownLabel(dateStr) {
  const d = daysUntil(dateStr);
  if (d < 0) return `${Math.abs(d)}d ago`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return `In ${d} days`;
  if (d < 14) return "Next week";
  if (d < 31) return `In ${Math.ceil(d / 7)} weeks`;
  return `In ${Math.ceil(d / 30)} months`;
}

// ---------- iCAL EXPORT ----------
export function buildIcs(event) {
  const dt = new Date(event.event_timestamp);
  const end = new Date(dt.getTime() + 2 * 60 * 60 * 1000); // 2hr default duration
  const fmt = (d) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wreake Runners//Club Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@wreakerunners.co.uk`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(dt)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}`,
    event.location ? `LOCATION:${event.location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function downloadIcs(event) {
  const ics = buildIcs(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
