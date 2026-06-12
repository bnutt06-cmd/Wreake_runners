// lib/data.js — brand colours, role constants, static content
export const COLORS = {
  ink: "#1E2A6E",
  paper: "#F5F8FB",
  sky: "#2589BA",
  teal: "#1597B8",
  green: "#2E9E8F",
  mist: "#DDE6F0",
  cyan: "#5FD0E6",
};

export const ROLES = {
  MEMBER: "Member",
  CONTENT_ADMIN: "Content Admin",
  ADMIN: "Admin",
};

export const ALL_ROLES = [ROLES.MEMBER, ROLES.CONTENT_ADMIN, ROLES.ADMIN];

export const KIT_SUPPLIER_URL = "https://example-kit-supplier.com"; // TODO: replace with real supplier URL

export const CLUB_NIGHTS = [
  { day: "Tuesday", time: "6:45 PM", desc: "Structured session from the hall" },
  { day: "Thursday", time: "6:45 PM", desc: "Structured session from the hall" },
  { day: "Fortnightly", time: "TBC", desc: "Track sessions (see news for dates)" },
];

export const CLUB_STANDARDS = [
  { tier: "Bronze", desc: "Foundation performance tier — see club documentation" },
  { tier: "Silver", desc: "Intermediate performance tier" },
  { tier: "Gold", desc: "Advanced performance tier" },
  { tier: "Platinum", desc: "Elite performance tier" },
];

export const SEED_RACES = [];

export function fmtDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fullName(p) {
  if (!p) return "";
  return [p.first_name, p.last_name].filter(Boolean).join(" ") || "(no name)";
}
