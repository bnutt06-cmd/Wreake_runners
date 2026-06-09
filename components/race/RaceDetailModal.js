"use client";

// components/race/RaceDetailModal.js
// =================================================================
// Modal that opens from the races list. Pulls together:
//   - Header: name, date, type, countdown
//   - Description and course notes
//   - Stats row: distance / elevation
//   - Leaflet map (lazy-loaded, no SSR)
//   - Elevation profile
//   - Weather forecast
//   - I'm Running toggle + roster (existing)
// =================================================================

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { COLORS, fmtDate } from "@/lib/data";
import { countdownLabel } from "@/lib/mockData";
import { RACE_DETAILS } from "@/lib/race/mockData";
import { fmtDistance, fmtElevation } from "@/lib/race/gpx";
import ElevationProfile from "./ElevationProfile";
import WeatherPanel from "./WeatherPanel";

// Leaflet touches `window`; only load on the client.
const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 280,
        background: "#f3f4f6",
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        color: "#6b7280",
        fontSize: 13,
      }}
    >
      Loading map…
    </div>
  ),
});

export default function RaceDetailModal({ race, onClose, rsvpControls }) {
  // Merge the lightweight list-view race with its detailed extras.
  const detail = useMemo(() => {
    if (!race) return null;
    return {
      ...race,
      ...(RACE_DETAILS[race.id] || {}),
    };
  }, [race]);

  if (!race || !detail) return null;

  // Build a profile array for the elevation chart from the route's elevations.
  const elevationProfile = useMemo(() => {
    if (!detail.route || detail.route.length < 2) return null;
    const totalKm = (detail.distance_m || 0) / 1000;
    return detail.route.map((p, i) => ({
      km: (i / (detail.route.length - 1)) * totalKm,
      ele: p.ele,
    }));
  }, [detail]);

  const bounds = useMemo(() => {
    if (!detail.route) return null;
    let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
    for (const p of detail.route) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lon < minLon) minLon = p.lon;
      if (p.lon > maxLon) maxLon = p.lon;
    }
    return { minLat, maxLat, minLon, maxLon };
  }, [detail]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,42,110,.55)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.paper,
          borderRadius: 18,
          padding: 0,
          maxWidth: 820,
          width: "100%",
          maxHeight: "92vh",
          overflow: "auto",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "rgba(245,248,251,0.95)",
            backdropFilter: "blur(6px)",
            zIndex: 2,
            padding: "20px 28px 16px",
            borderBottom: `1px solid ${COLORS.mist}`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: COLORS.mist,
              border: "none",
              width: 36,
              height: 36,
              borderRadius: "50%",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: COLORS.teal,
              textTransform: "uppercase",
            }}
          >
            {race.type}
          </p>
          <h2
            style={{
              margin: "4px 0 8px",
              fontFamily: "'Fraunces', serif",
              fontSize: 28,
              fontWeight: 700,
              paddingRight: 48,
            }}
          >
            {race.name}
          </h2>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, opacity: 0.8 }}>
            <span>📅 {fmtDate(race.race_date)}</span>
            <span>📍 {race.location}</span>
            <span
              style={{
                background: COLORS.teal,
                color: "#fff",
                padding: "2px 10px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {countdownLabel(race.race_date)}
            </span>
          </div>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <StatBox label="Distance" value={detail.distance_m ? fmtDistance(detail.distance_m) : race.distance || "—"} />
            <StatBox label="Elevation gain" value={detail.elevation_gain_m != null ? fmtElevation(detail.elevation_gain_m) : "—"} />
            <StatBox label="Elevation loss" value={detail.elevation_loss_m != null ? fmtElevation(detail.elevation_loss_m) : "—"} />
            {race.external_signup_url && (
              <a
                href={race.external_signup_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: COLORS.ink,
                  color: "#fff",
                  padding: "12px 14px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                }}
              >
                External signup ↗
              </a>
            )}
          </div>

          {/* Description */}
          {detail.description && (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>About the race</h3>
              <p style={{ margin: 0, lineHeight: 1.7, fontSize: 15 }}>{detail.description}</p>
              {detail.course_notes && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 12,
                    background: COLORS.mist,
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                >
                  <strong>Course notes:</strong> {detail.course_notes}
                </div>
              )}
            </section>
          )}

          {/* Map + elevation */}
          {detail.route && detail.route.length > 1 && (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>Route</h3>
              <RouteMap points={detail.route} bounds={bounds} />
              {elevationProfile && (
                <div style={{ marginTop: 12 }}>
                  <ElevationProfile profile={elevationProfile} />
                </div>
              )}
            </section>
          )}

          {/* Weather */}
          {detail.start_lat != null && (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>Weather</h3>
              <WeatherPanel
                lat={detail.start_lat}
                lon={detail.start_lon}
                raceDate={race.race_date}
              />
            </section>
          )}

          {/* RSVP / roster controls (passed in from parent) */}
          {rsvpControls && (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>Who's running</h3>
              {rsvpControls}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          opacity: 0.65,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif", marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}

const sectionStyle = { marginBottom: 24 };
const sectionHeadingStyle = {
  fontFamily: "'Fraunces', serif",
  fontSize: 17,
  fontWeight: 700,
  margin: "0 0 12px",
  color: COLORS.ink,
};
