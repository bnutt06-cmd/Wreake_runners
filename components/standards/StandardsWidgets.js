"use client";

import { useState, useMemo } from "react";
import { COLORS } from "@/lib/data";
import {
  DISTANCES, TIERS, TIER_COLORS,
  STANDARD_COUNT, DISTINCTION_COUNT,
  LRRL_STANDARD_GEO_MIN, LRRL_DISTINCTION_GEO_MIN,
  getTierTargets, parseTimeToSeconds, secondsToHms, secondsToShort,
} from "@/lib/standards/engine";

// =============================================================
// Top banner + rules modal
// =============================================================
export function StandardsBanner({ seasonYear }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1d3a8c 100%)`,
          color: "#fff",
          borderRadius: 16,
          padding: 24,
          marginBottom: 28,
        }}
      >
        <h3
          style={{
            margin: "0 0 8px",
            fontFamily: "'Fraunces', serif",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Club Standards {seasonYear} Season
        </h3>
        <p style={{ margin: "0 0 14px", lineHeight: 1.55, opacity: 0.9, fontSize: 14 }}>
          Jan 1, {seasonYear} – Dec 31, {seasonYear}. Log {STANDARD_COUNT} unique distances for
          a <strong style={{ color: COLORS.cyan }}>Standard</strong>, or {DISTINCTION_COUNT} for
          a <strong style={{ color: COLORS.cyan }}>Distinction</strong>. Times are matched
          against your age on race day.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: COLORS.cyan,
            color: COLORS.ink,
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          View Comprehensive Rules Guide
        </button>
      </div>

      {open && <RulesModal onClose={() => setOpen(false)} />}
    </>
  );
}

function RulesModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(30,42,110,.55)",
        backdropFilter: "blur(4px)", display: "grid", placeItems: "center",
        padding: 20, zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.paper, borderRadius: 18, padding: 36, maxWidth: 720,
          width: "100%", position: "relative", maxHeight: "85vh", overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 18, right: 18, background: COLORS.mist,
            border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 16,
            fontWeight: 700, cursor: "pointer",
          }}
        >
          ✕
        </button>
        <h2 style={{ marginTop: 0, fontFamily: "'Fraunces', serif" }}>Standards Rules</h2>

        <h3 style={{ marginTop: 20, fontSize: 16 }}>Wreake Club Scheme</h3>
        <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
          <li>Official chip-timed races <strong>and</strong> virtual / solo runs are accepted.</li>
          <li>Any parkrun, official 5K, or club track time trial counts for 5K.</li>
          <li>No geographic restrictions.</li>
          <li><strong>Standard:</strong> {STANDARD_COUNT} unique distances at target tier or better.</li>
          <li><strong>Distinction:</strong> {DISTINCTION_COUNT} unique distances at target tier or better.</li>
        </ul>

        <h3 style={{ marginTop: 20, fontSize: 16 }}>LRRL County Scheme (strict)</h3>
        <ul style={{ lineHeight: 1.7, fontSize: 14 }}>
          <li>Official, accurately measured / chip-timed races only. Virtual / solo runs do <strong>not</strong> count.</li>
          <li>5K must be a Leicestershire or Rutland parkrun, or an official 5K race in the region.</li>
          <li><strong>Standard:</strong> {STANDARD_COUNT} unique distances, of which at least {LRRL_STANDARD_GEO_MIN} were inside Leics &amp; Rutland.</li>
          <li><strong>Distinction:</strong> {DISTINCTION_COUNT} unique distances, of which at least {LRRL_DISTINCTION_GEO_MIN} were inside Leics &amp; Rutland.</li>
        </ul>

        <h3 style={{ marginTop: 20, fontSize: 16 }}>How times match your category</h3>
        <p style={{ lineHeight: 1.7, fontSize: 14 }}>
          Your age category is calculated from your date of birth as of December 31 of the
          season year. Within that category, target times are checked at the time of each
          performance — so as you move up an age band, your benchmark may get easier mid-season.
        </p>
      </div>
    </div>
  );
}

// =============================================================
// Reward Tier grid (the 9-tier gamification dashboard)
// =============================================================
export function TierGrid({ achievedTier, distinctionTier, label }) {
  const idxAchieved = achievedTier ? TIERS.indexOf(achievedTier) : -1;
  const idxDistinction = distinctionTier ? TIERS.indexOf(distinctionTier) : -1;

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 18 }}>
          {label}
        </h3>
        <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
          {achievedTier ? `Standard: ${achievedTier}` : "No Standard yet"}
          {distinctionTier && ` · Distinction: ${distinctionTier}`}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(78px, 1fr))",
          gap: 8,
        }}
      >
        {TIERS.map((tier, i) => {
          const isStandard = idxAchieved >= 0 && i >= idxAchieved;
          const isDistinction = idxDistinction >= 0 && i >= idxDistinction;
          return (
            <div
              key={tier}
              style={{
                position: "relative",
                background: isStandard ? TIER_COLORS[tier] : "transparent",
                color: isStandard ? (tier === "Tungsten" || tier === "Pewter" ? "#fff" : COLORS.ink) : "#9ca3af",
                border: `1.5px solid ${isStandard ? TIER_COLORS[tier] : COLORS.mist}`,
                borderRadius: 10,
                padding: "12px 8px",
                textAlign: "center",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {isDistinction && (
                <span
                  style={{
                    position: "absolute", top: -7, right: -7,
                    background: COLORS.cyan, color: COLORS.ink,
                    fontSize: 9, fontWeight: 800,
                    padding: "2px 6px", borderRadius: 10,
                    border: "2px solid #fff",
                  }}
                >
                  ★
                </span>
              )}
              {tier}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================
// Target Matrix — 10×9 grid for the member's category
// =============================================================
export function TargetMatrix({ category, lookup, bestPerDistance, tierAtDistance }) {
  if (!category) {
    return (
      <div
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.mist}`,
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          textAlign: "center",
          opacity: 0.7,
        }}
      >
        <strong>Set your date of birth and gender</strong> in your profile to see your personalised target matrix.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        overflow: "auto",
      }}
    >
      <h3 style={{ margin: "0 0 4px", fontFamily: "'Fraunces', serif", fontSize: 18 }}>
        Your Targets — {category}
      </h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.7 }}>
        Cells light up where you've cleared a tier. Your best time appears below the target.
      </p>
      <table style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 900, width: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ padding: 8, textAlign: "left", fontWeight: 800, borderBottom: `2px solid ${COLORS.mist}`, position: "sticky", left: 0, background: "#fff" }}>
              Distance
            </th>
            {TIERS.map((t) => (
              <th
                key={t}
                style={{
                  padding: 8, textAlign: "center", fontWeight: 800, fontSize: 10, letterSpacing: 0.5,
                  borderBottom: `2px solid ${COLORS.mist}`, color: TIER_COLORS[t] === "#E5E4E2" ? COLORS.ink : TIER_COLORS[t],
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DISTANCES.map((d) => {
            const targets = getTierTargets(lookup, category, d);
            const best = bestPerDistance?.[d];
            const cleared = tierAtDistance?.[d];
            const clearedIdx = cleared ? TIERS.indexOf(cleared) : -1;
            return (
              <tr key={d}>
                <td
                  style={{
                    padding: "10px 8px",
                    fontWeight: 700,
                    borderBottom: `1px solid ${COLORS.mist}`,
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {d}
                </td>
                {TIERS.map((t, i) => {
                  const target = targets[t];
                  const isCleared = clearedIdx >= 0 && i >= clearedIdx;
                  return (
                    <td
                      key={t}
                      style={{
                        padding: "6px 4px",
                        textAlign: "center",
                        borderBottom: `1px solid ${COLORS.mist}`,
                        background: isCleared ? `${TIER_COLORS[t]}30` : "transparent",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <div style={{ fontWeight: isCleared ? 700 : 500, opacity: isCleared ? 1 : 0.65 }}>
                        {target ? secondsToShort(target) : "—"}
                      </div>
                      {isCleared && best && (
                        <div style={{ fontSize: 10, color: TIER_COLORS[t] === "#E5E4E2" ? COLORS.ink : TIER_COLORS[t], fontWeight: 700, marginTop: 2 }}>
                          ✓ {secondsToShort(best.seconds)}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================
// Submission form
// =============================================================
export function SubmissionForm({ onSubmit }) {
  const [distance, setDistance] = useState("5K");
  const [time, setTime] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [isLeics, setIsLeics] = useState(false);
  const [isValid5k, setIsValid5k] = useState(true);
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    setErr("");
    const seconds = parseTimeToSeconds(time);
    if (seconds == null) { setErr("Time must be HH:MM:SS (or MM:SS for short races)."); return; }
    if (!raceName.trim()) { setErr("Race name is required."); return; }
    if (!raceDate) { setErr("Race date is required."); return; }
    onSubmit({
      distance,
      achieved_time_seconds: seconds,
      formatted_time: secondsToHms(seconds),
      race_name: raceName.trim(),
      race_date: raceDate,
      is_virtual: isVirtual,
      is_leicestershire_region: isLeics,
      is_valid_lrrl_5k: distance === "5K" ? isValid5k : true,
      proof_url: proofUrl.trim() || null,
    });
    setTime(""); setRaceName(""); setRaceDate(""); setProofUrl("");
  }

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h3 style={{ margin: "0 0 4px", fontFamily: "'Fraunces', serif", fontSize: 18 }}>
        Log a Performance
      </h3>
      <p style={{ margin: "0 0 18px", fontSize: 13, opacity: 0.7 }}>
        Submissions count toward both schemes if eligible. Times are stored in seconds for fast lookups.
      </p>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Field label="Distance">
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            style={inputStyle}
          >
            {DISTANCES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Time (HH:MM:SS)">
          <input
            type="text"
            placeholder="e.g. 01:35:58"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ ...inputStyle, fontVariantNumeric: "tabular-nums" }}
          />
        </Field>

        <Field label="Race name">
          <input
            type="text"
            value={raceName}
            onChange={(e) => setRaceName(e.target.value)}
            style={inputStyle}
          />
        </Field>

        <Field label="Race date">
          <input
            type="date"
            value={raceDate}
            onChange={(e) => setRaceDate(e.target.value)}
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="Race format" style={{ marginTop: 14 }}>
        <Segmented
          options={[
            { value: false, label: "Official Chip / Measured Race" },
            { value: true, label: "Virtual / Solo Run" },
          ]}
          value={isVirtual}
          onChange={setIsVirtual}
        />
      </Field>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <Toggle
          checked={isLeics}
          onChange={setIsLeics}
          label="This race took place within Leicestershire & Rutland"
        />
        {distance === "5K" && (
          <Toggle
            checked={isValid5k}
            onChange={setIsValid5k}
            label="This 5K is a Leics/Rutland parkrun or official 5K (required for LRRL)"
          />
        )}
      </div>

      <Field label="Proof URL (optional)" style={{ marginTop: 14 }}>
        <input
          type="url"
          placeholder="e.g. Power of 10 link"
          value={proofUrl}
          onChange={(e) => setProofUrl(e.target.value)}
          style={inputStyle}
        />
      </Field>

      {err && <p style={{ color: "#C0392B", fontSize: 13, margin: "12px 0 0" }}>{err}</p>}

      <button
        onClick={submit}
        style={{
          marginTop: 18,
          background: COLORS.ink, color: "#fff", border: "none",
          padding: "11px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14,
          cursor: "pointer",
        }}
      >
        Log Performance
      </button>
    </div>
  );
}

// =============================================================
// Small UI primitives
// =============================================================
const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: `1.5px solid ${COLORS.mist}`,
  fontSize: 14,
  background: "#fff",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
};

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, opacity: 0.7, marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, background: COLORS.mist, borderRadius: 10, padding: 4 }}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          style={{
            flex: 1,
            background: value === o.value ? "#fff" : "transparent",
            color: value === o.value ? COLORS.ink : "#6b7280",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: value === o.value ? "0 2px 6px rgba(30,42,110,.08)" : "none",
            transition: "all .15s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontSize: 14 }}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        style={{
          width: 42, height: 24, borderRadius: 12,
          background: checked ? COLORS.green : COLORS.mist,
          border: "none", position: "relative", cursor: "pointer", padding: 0,
          transition: "background .2s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute", top: 2, left: checked ? 20 : 2,
            width: 20, height: 20, borderRadius: "50%", background: "#fff",
            transition: "left .2s",
          }}
        />
      </button>
      <span>{label}</span>
    </label>
  );
}
