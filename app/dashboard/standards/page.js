"use client";

import { useState, useMemo } from "react";
import { COLORS } from "@/lib/data";
import {
  STANDARDS_TIMES, STANDARDS_DISTANCES, STANDARDS_TIERS,
  parseTimeToSeconds, secondsToTime,
} from "@/lib/mockData";

const TIER_COLORS = {
  Bronze: "#A87034",
  Silver: "#9CA3AF",
  Gold: "#D4AF37",
  Platinum: "#5FD0E6",
};

export default function StandardsPage() {
  const [prs, setPrs] = useState({}); // { "5k": "21:42", ... }

  function update(dist, value) {
    setPrs((p) => ({ ...p, [dist]: value }));
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h3
          style={{
            fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px",
          }}
        >
          Club Standards
        </h3>
        <p style={{ opacity: 0.7, margin: 0, fontSize: 15, maxWidth: 640 }}>
          Enter your current personal bests and we'll show you which tier you've reached
          and how close you are to the next one.
        </p>
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        {STANDARDS_DISTANCES.map((dist) => (
          <DistanceRow
            key={dist}
            distance={dist}
            value={prs[dist] || ""}
            onChange={(v) => update(dist, v)}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: COLORS.mist,
          borderRadius: 12,
          fontSize: 13,
          opacity: 0.8,
        }}
      >
        <strong>Time format:</strong> use mm:ss for 5k/10k (e.g. <code>21:42</code>) or
        hh:mm:ss for half/full marathons (e.g. <code>1:35:58</code>). Times will save to
        your profile once the database wiring is complete.
      </div>
    </div>
  );
}

function DistanceRow({ distance, value, onChange }) {
  const seconds = useMemo(() => parseTimeToSeconds(value), [value]);
  const thresholds = STANDARDS_TIMES[distance];

  // Determine current tier (highest one the user has met).
  const currentTier = useMemo(() => {
    if (seconds == null) return null;
    // Tiers are ordered easiest → hardest; iterate hardest-first.
    const ordered = [...STANDARDS_TIERS].reverse(); // Platinum, Gold, Silver, Bronze
    for (const tier of ordered) {
      if (seconds <= thresholds[tier]) return tier;
    }
    return null; // Slower than Bronze
  }, [seconds, thresholds]);

  // What's the next tier and how far away?
  const next = useMemo(() => {
    if (seconds == null) return null;
    let nextTier = null;
    let nextTime = null;
    if (currentTier == null) {
      nextTier = "Bronze";
      nextTime = thresholds.Bronze;
    } else {
      const idx = STANDARDS_TIERS.indexOf(currentTier);
      if (idx < STANDARDS_TIERS.length - 1) {
        nextTier = STANDARDS_TIERS[idx + 1];
        nextTime = thresholds[nextTier];
      }
    }
    if (nextTier == null) return null; // Already Platinum
    const diff = seconds - nextTime;
    // Progress: how close are we, scaled between the previous threshold and the next
    let progress = 0;
    if (currentTier == null) {
      // Working toward Bronze — show progress relative to "off the scale" (e.g. 1.5× Bronze)
      const ceiling = thresholds.Bronze * 1.5;
      progress = Math.max(0, Math.min(1, (ceiling - seconds) / (ceiling - thresholds.Bronze)));
    } else {
      const prev = thresholds[currentTier];
      progress = Math.max(0, Math.min(1, (prev - seconds) / (prev - nextTime)));
    }
    return { tier: nextTier, time: nextTime, diff, progress };
  }, [seconds, currentTier, thresholds]);

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 16,
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <h4
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {distance}
        </h4>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={distance === "5k" || distance === "10k" ? "mm:ss" : "hh:mm:ss"}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: `1.5px solid ${COLORS.mist}`,
            fontSize: 16,
            fontWeight: 600,
            width: 140,
            outline: "none",
            fontVariantNumeric: "tabular-nums",
          }}
        />
      </div>

      {/* Tier badges row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {STANDARDS_TIERS.map((tier) => {
          const achieved = currentTier && STANDARDS_TIERS.indexOf(currentTier) >= STANDARDS_TIERS.indexOf(tier);
          return (
            <div
              key={tier}
              style={{
                padding: "6px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                background: achieved ? TIER_COLORS[tier] : "transparent",
                color: achieved ? "#fff" : "#9ca3af",
                border: `1.5px solid ${achieved ? TIER_COLORS[tier] : COLORS.mist}`,
              }}
            >
              {achieved && "✓ "}{tier}: {secondsToTime(thresholds[tier])}
            </div>
          );
        })}
      </div>

      {/* Current tier callout */}
      {seconds != null && (
        <div
          style={{
            padding: 14,
            background: currentTier ? `${TIER_COLORS[currentTier]}15` : COLORS.mist,
            borderRadius: 10,
            marginBottom: next ? 16 : 0,
          }}
        >
          {currentTier ? (
            <>
              <strong style={{ color: TIER_COLORS[currentTier] }}>
                🏅 {currentTier} Tier Standard achieved
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75 }}>
                With a {secondsToTime(seconds)} you've cleared the {currentTier} threshold.
              </p>
            </>
          ) : (
            <>
              <strong>Keep going!</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75 }}>
                You're working toward the Bronze tier. Every session counts.
              </p>
            </>
          )}
        </div>
      )}

      {/* Next tier progress bar */}
      {next && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              marginBottom: 6,
            }}
          >
            <span>
              {next.diff > 0
                ? `${secondsToTime(Math.abs(next.diff))} from ${next.tier}`
                : `${next.tier} unlocked!`}
            </span>
            <span style={{ fontWeight: 700, color: TIER_COLORS[next.tier] }}>
              {Math.round(next.progress * 100)}%
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: COLORS.mist,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${next.progress * 100}%`,
                background: TIER_COLORS[next.tier],
                transition: "width .4s",
              }}
            />
          </div>
        </div>
      )}

      {seconds == null && value.trim() !== "" && (
        <p style={{ fontSize: 13, color: "#C0392B", margin: 0 }}>
          Couldn't read that time — try {distance === "5k" || distance === "10k" ? "mm:ss" : "hh:mm:ss"} format.
        </p>
      )}
    </div>
  );
}
