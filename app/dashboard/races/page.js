"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { COLORS, fmtDate, fullName } from "@/lib/data";
import { MOCK_RACES, MOCK_ROSTERS, countdownLabel } from "@/lib/mockData";
import { useStore } from "@/lib/store";

const FILTERS = ["All", "LRRL League Race", "Cross-country League", "Club Series", "Social / parkrun", "Endurance / Team"];

export default function RacesDirectory() {
  const { profile } = useStore();
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");

  const [filter, setFilter] = useState("All");
  // Local RSVP state. In production, this is fetched from race_registrations.
  const [rsvps, setRsvps] = useState({}); // { raceId: boolean }
  // Local copy of rosters we can mutate.
  const [rosters, setRosters] = useState(MOCK_ROSTERS);

  const rowRefs = useRef({});

  useEffect(() => {
    if (focusId && rowRefs.current[focusId]) {
      rowRefs.current[focusId].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId]);

  const races = useMemo(() => {
    const sorted = [...MOCK_RACES].sort(
      (a, b) => new Date(a.race_date) - new Date(b.race_date)
    );
    if (filter === "All") return sorted;
    return sorted.filter((r) => r.type === filter);
  }, [filter]);

  function toggleRsvp(raceId) {
    const me = profile
      ? {
          id: profile.id || "me",
          name: fullName(profile) || "You",
          initials: ((profile.first_name?.[0] || "") + (profile.last_name?.[0] || "")).toUpperCase() || "ME",
          color: COLORS.ink,
        }
      : { id: "me", name: "You", initials: "ME", color: COLORS.ink };

    const wasIn = !!rsvps[raceId];
    setRsvps((r) => ({ ...r, [raceId]: !wasIn }));
    setRosters((rs) => {
      const current = rs[raceId] || [];
      if (wasIn) {
        return { ...rs, [raceId]: current.filter((u) => u.id !== me.id) };
      }
      if (current.some((u) => u.id === me.id)) return rs;
      return { ...rs, [raceId]: [me, ...current] };
    });
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px",
          }}
        >
          Upcoming Races
        </h3>
        <p style={{ opacity: 0.7, margin: 0, fontSize: 15 }}>
          Tap <strong>I'm Running</strong> on any race to let other club members know.
        </p>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: `1.5px solid ${filter === f ? COLORS.ink : COLORS.mist}`,
              background: filter === f ? COLORS.ink : "#fff",
              color: filter === f ? "#fff" : COLORS.ink,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {races.map((race) => (
          <div
            key={race.id}
            ref={(el) => (rowRefs.current[race.id] = el)}
            style={{
              background: "#fff",
              border: `2px solid ${focusId === race.id ? COLORS.teal : COLORS.mist}`,
              borderRadius: 16,
              padding: 24,
              transition: "border-color .3s",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: COLORS.teal,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {race.type}
                </div>
                <h4
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    margin: "0 0 6px",
                  }}
                >
                  {race.name}
                </h4>
                <p style={{ margin: "0 0 8px", fontSize: 14, opacity: 0.75 }}>
                  {race.distance} · {race.location}
                </p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{race.blurb}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                <div
                  style={{
                    background: COLORS.ink,
                    color: "#fff",
                    padding: "10px 14px",
                    borderRadius: 12,
                    textAlign: "center",
                    minWidth: 120,
                  }}
                >
                  <div style={{ fontSize: 13, opacity: 0.85 }}>{fmtDate(race.race_date)}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.cyan, marginTop: 2 }}>
                    {countdownLabel(race.race_date)}
                  </div>
                </div>
                {race.external_signup_url && (
                  <a
                    href={race.external_signup_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: COLORS.teal,
                      textDecoration: "none",
                    }}
                  >
                    External signup ↗
                  </a>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                paddingTop: 16,
                borderTop: `1px solid ${COLORS.mist}`,
                flexWrap: "wrap",
              }}
            >
              <RsvpToggle on={!!rsvps[race.id]} onClick={() => toggleRsvp(race.id)} />
              <RosterRow runners={rosters[race.id] || []} />
            </div>
          </div>
        ))}
        {races.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", opacity: 0.6 }}>
            No races match this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function RsvpToggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderRadius: 12,
        border: "none",
        background: on ? COLORS.green : "#fff",
        color: on ? "#fff" : COLORS.ink,
        boxShadow: on ? "none" : `inset 0 0 0 1.5px ${COLORS.mist}`,
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: on ? "#fff" : "transparent",
          border: on ? "none" : `2px solid ${COLORS.mist}`,
          display: "grid",
          placeItems: "center",
          color: COLORS.green,
          fontSize: 11,
          fontWeight: 900,
        }}
      >
        {on ? "✓" : ""}
      </span>
      {on ? "I'm Running" : "I'm Running?"}
    </button>
  );
}

function RosterRow({ runners }) {
  const visible = runners.slice(0, 6);
  const extra = runners.length - visible.length;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex" }}>
        {visible.map((r, i) => (
          <div
            key={r.id}
            title={r.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: r.color,
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 700,
              border: "2px solid #fff",
              marginLeft: i === 0 ? 0 : -8,
              zIndex: visible.length - i,
            }}
          >
            {r.initials}
          </div>
        ))}
        {extra > 0 && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: COLORS.mist,
              color: COLORS.ink,
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: 700,
              border: "2px solid #fff",
              marginLeft: -8,
            }}
          >
            +{extra}
          </div>
        )}
      </div>
      <span style={{ fontSize: 13, opacity: 0.7 }}>
        {runners.length === 0
          ? "Be the first to RSVP"
          : `${runners.length} running`}
      </span>
    </div>
  );
}
