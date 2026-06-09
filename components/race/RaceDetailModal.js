"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { COLORS, fmtDate } from "@/lib/data";
import { useStore } from "@/lib/store";
import { countdownLabel } from "@/lib/mockData";
import { fmtDistance, fmtElevation } from "@/lib/race/gpx";
import ElevationProfile from "./ElevationProfile";
import WeatherPanel from "./WeatherPanel";

const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => <div style={mapLoadingStyle}>Loading map...</div>,
});

const mapLoadingStyle = {
  height: 280,
  background: "#f3f4f6",
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  color: "#6b7280",
  fontSize: 13,
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(30,42,110,.55)",
  backdropFilter: "blur(4px)",
  display: "grid",
  placeItems: "center",
  padding: 16,
  zIndex: 100,
};

const modalStyle = {
  background: COLORS.paper,
  borderRadius: 18,
  padding: 0,
  maxWidth: 820,
  width: "100%",
  maxHeight: "92vh",
  overflow: "auto",
  position: "relative",
};

const headerStyle = {
  position: "sticky",
  top: 0,
  background: "rgba(245,248,251,0.95)",
  backdropFilter: "blur(6px)",
  zIndex: 2,
  padding: "20px 28px 16px",
  borderBottom: "1px solid " + COLORS.mist,
};

const actionRowStyle = {
  position: "absolute",
  top: 18,
  right: 18,
  display: "flex",
  gap: 8,
};

const editBtnStyle = {
  background: COLORS.ink,
  color: "#fff",
  border: "none",
  padding: "0 14px",
  height: 36,
  borderRadius: 18,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const closeBtnStyle = {
  background: COLORS.mist,
  border: "none",
  width: 36,
  height: 36,
  borderRadius: "50%",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const externalLinkStyle = {
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
};

const sectionStyle = { marginBottom: 24 };
const sectionHeadingStyle = {
  fontFamily: "'Fraunces', serif",
  fontSize: 17,
  fontWeight: 700,
  margin: "0 0 12px",
  color: COLORS.ink,
};

export default function RaceDetailModal({ race, onClose, rsvpControls }) {
  const router = useRouter();
  const { isAdmin } = useStore();

  // Build elevation profile from the race's route array (if uploaded).
  const elevationProfile = useMemo(() => {
    if (!race || !race.route || race.route.length < 2) return null;
    const totalKm = (race.distance_m || 0) / 1000;
    return race.route.map((p, i) => ({
      km: (i / (race.route.length - 1)) * totalKm,
      ele: p.ele,
    }));
  }, [race]);

  const bounds = useMemo(() => {
    if (!race || !race.route) return null;
    let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
    for (const p of race.route) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lon < minLon) minLon = p.lon;
      if (p.lon > maxLon) maxLon = p.lon;
    }
    return { minLat, maxLat, minLon, maxLon };
  }, [race]);

  if (!race) return null;

  function handleEdit() {
    onClose();
    router.push("/admin/races?edit=" + race.id);
  }

  const distanceValue = race.distance_m ? fmtDistance(race.distance_m) : (race.distance_text || "");
  const gainValue = race.elevation_gain_m != null ? fmtElevation(race.elevation_gain_m) : "";
  const lossValue = race.elevation_loss_m != null ? fmtElevation(race.elevation_loss_m) : "";

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={actionRowStyle}>
            {isAdmin ? (
              <button onClick={handleEdit} style={editBtnStyle}>Edit</button>
            ) : null}
            <button onClick={onClose} style={closeBtnStyle}>X</button>
          </div>

          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLORS.teal, textTransform: "uppercase" }}>
            {race.type || "Race"}
          </p>
          <h2 style={{ margin: "4px 0 8px", fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, paddingRight: isAdmin ? 130 : 48 }}>
            {race.name}
          </h2>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, opacity: 0.8 }}>
            <span>{fmtDate(race.race_date)}</span>
            {race.location ? <span>{race.location}</span> : null}
            <span style={{ background: COLORS.teal, color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
              {countdownLabel(race.race_date)}
            </span>
          </div>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
            <StatBox label="Distance" value={distanceValue || "-"} />
            <StatBox label="Elevation gain" value={gainValue || "-"} />
            <StatBox label="Elevation loss" value={lossValue || "-"} />
            {race.external_signup_url ? (
              <a href={race.external_signup_url} target="_blank" rel="noopener noreferrer" style={externalLinkStyle}>
                External signup
              </a>
            ) : null}
          </div>

          {race.description ? (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>About the race</h3>
              <p style={{ margin: 0, lineHeight: 1.7, fontSize: 15 }}>{race.description}</p>
              {race.course_notes ? (
                <div style={{ marginTop: 12, padding: 12, background: COLORS.mist, borderRadius: 10, fontSize: 13 }}>
                  <strong>Course notes:</strong> {race.course_notes}
                </div>
              ) : null}
            </section>
          ) : null}

          {race.route && race.route.length > 1 ? (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>Route</h3>
              <RouteMap points={race.route} bounds={bounds} />
              {elevationProfile ? (
                <div style={{ marginTop: 12 }}>
                  <ElevationProfile profile={elevationProfile} />
                </div>
              ) : null}
            </section>
          ) : null}

          {race.start_lat != null ? (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>Weather</h3>
              <WeatherPanel lat={race.start_lat} lon={race.start_lon} raceDate={race.race_date} />
            </section>
          ) : null}

          {rsvpControls ? (
            <section style={sectionStyle}>
              <h3 style={sectionHeadingStyle}>Who is running</h3>
              {rsvpControls}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, opacity: 0.65, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif", marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}
