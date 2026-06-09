"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import {
  StandardsBanner, TierGrid, TargetMatrix, SubmissionForm,
} from "@/components/standards/StandardsWidgets";
import { assignCategory, evaluateScheme, getTierTargets, highestTierFor, TIER_COLORS } from "@/lib/standards/engine";
import { STANDARDS_LOOKUP } from "@/lib/standards/lookup";

const CURRENT_SEASON = new Date().getFullYear();

export default function StandardsPage() {
  const { profile } = useStore();
  const [scheme, setScheme] = useState("wreake");
  const [logs, setLogs] = useState([]);

  // Pull real profile data. If gender + DOB are missing, the member
  // is prompted to set them on /dashboard/profile and the rest of
  // the page renders in a "preview" mode.
  const memberGender = profile?.gender || null;
  const memberDob = profile?.date_of_birth || null;
  const profileReady = !!memberGender && !!memberDob;

  const category = useMemo(
    () => assignCategory(memberGender, memberDob, CURRENT_SEASON),
    [memberGender, memberDob]
  );

  function handleSubmit(submission) {
    setLogs((prev) => [...prev, { ...submission, id: `log-${Date.now()}` }]);
  }

  const wreakeResult = useMemo(
    () => evaluateScheme({ logs, scheme: "wreake", lookup: STANDARDS_LOOKUP, category }),
    [logs, category]
  );
  const lrrlResult = useMemo(
    () => evaluateScheme({ logs, scheme: "lrrl", lookup: STANDARDS_LOOKUP, category }),
    [logs, category]
  );

  const active = scheme === "wreake" ? wreakeResult : lrrlResult;

  return (
    <div>
      <StandardsBanner seasonYear={CURRENT_SEASON} />

      {!profileReady ? (
        <div
          style={{
            background: COLORS.mist,
            borderLeft: "4px solid " + COLORS.teal,
            padding: 16,
            borderRadius: 10,
            marginBottom: 24,
            fontSize: 14,
          }}
        >
          <strong>Set your profile to unlock Standards.</strong> The portal needs
          your gender and date of birth to assign your age category.{" "}
          <Link href="/dashboard/profile" style={{ color: COLORS.teal, fontWeight: 700 }}>
            Edit your profile
          </Link>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          background: COLORS.mist,
          padding: "14px 18px",
          borderRadius: 12,
          marginBottom: 24,
          fontSize: 13,
        }}
      >
        <span><strong>Category:</strong> {category || "set DOB + gender in profile"}</span>
        <span><strong>Season:</strong> {CURRENT_SEASON}</span>
        <span><strong>Logged:</strong> {logs.length}</span>
        <span><strong>Distinct distances (this scheme):</strong> {active.distinctDistances}</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: `2px solid ${COLORS.mist}`,
          marginBottom: 24,
        }}
      >
        <SchemeTab label="Wreake Club Status" active={scheme === "wreake"} onClick={() => setScheme("wreake")} />
        <SchemeTab label="LRRL County Status" active={scheme === "lrrl"} onClick={() => setScheme("lrrl")} />
      </div>

      <SchemeStatus result={active} scheme={scheme} />

      <TierGrid
        achievedTier={active.standard.tier}
        distinctionTier={active.distinction.tier}
        label={scheme === "wreake" ? "Wreake Club Tier Tracker" : "LRRL County Tier Tracker"}
      />

      <TargetMatrix
        category={category}
        lookup={STANDARDS_LOOKUP}
        bestPerDistance={active.bestPerDistance}
        tierAtDistance={active.tierAtDistance}
      />

      <SubmissionForm onSubmit={handleSubmit} />

      {logs.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "0 0 12px" }}>
            Your logged performances ({logs.length})
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {logs.map((l) => (
              <div
                key={l.id}
                style={{
                  background: "#fff",
                  border: `1px solid ${COLORS.mist}`,
                  borderRadius: 10,
                  padding: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  fontSize: 13,
                }}
              >
                <div>
                  <strong>{l.distance}</strong> · {l.formatted_time} · {l.race_name}
                  <span style={{ opacity: 0.6, marginLeft: 8 }}>
                    {l.race_date} · {l.is_virtual ? "Virtual" : "Official"}
                    {l.is_leicestershire_region && " · Leics/Rutland"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <TierBadge seconds={l.achieved_time_seconds} distance={l.distance} category={category} />
                  <Pill on={!l.is_virtual} text="LRRL eligible" />
                  <Pill on={true} text="Wreake eligible" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 28, padding: 14, background: COLORS.mist,
          borderRadius: 10, fontSize: 12, opacity: 0.75,
        }}
      >
        <strong>Mock-data note:</strong> performances submitted here live only in your
        browser session. Once Supabase wiring is added, they'll persist and feed the
        admin claims panel.
      </div>
    </div>
  );
}

function SchemeTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 20px",
        background: "transparent",
        border: "none",
        borderBottom: `3px solid ${active ? COLORS.teal : "transparent"}`,
        marginBottom: -2,
        fontSize: 15,
        fontWeight: 700,
        color: active ? COLORS.ink : "#6b7280",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function SchemeStatus({ result, scheme }) {
  const { standard, distinction, distinctDistances, geoOkForStandard, geoOkForDistinction } = result;
  const STD = 5, DIST = 9;

  function Card({ heading, tier, count, threshold, geoOk, geoMin }) {
    return (
      <div
        style={{
          background: "#fff",
          border: `2px solid ${tier ? COLORS.teal : COLORS.mist}`,
          borderRadius: 14,
          padding: 18,
          flex: 1,
          minWidth: 220,
        }}
      >
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLORS.teal, textTransform: "uppercase" }}>
          {heading}
        </p>
        <h4 style={{ margin: "4px 0 8px", fontFamily: "'Fraunces', serif", fontSize: 22 }}>
          {tier || (count >= threshold ? "Geography pending" : `${count}/${threshold} distances`)}
        </h4>
        <div
          style={{
            height: 6, background: COLORS.mist, borderRadius: 3, overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, (count / threshold) * 100)}%`,
              background: tier ? COLORS.green : COLORS.teal,
              transition: "width .4s",
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>
          {count} of {threshold} distinct distances
        </p>
        {scheme === "lrrl" && (
          <p style={{ margin: "4px 0 0", fontSize: 12, color: geoOk ? COLORS.green : "#C0392B" }}>
            Leics/Rutland geo: {geoOk ? `✓ met (≥${geoMin})` : `needs ≥${geoMin}`}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
      <Card heading="Standard" tier={standard.tier} count={distinctDistances} threshold={STD} geoOk={geoOkForStandard} geoMin={3} />
      <Card heading="Distinction" tier={distinction.tier} count={distinctDistances} threshold={DIST} geoOk={geoOkForDistinction} geoMin={6} />
    </div>
  );
}

function Pill({ on, text }) {
  return (
    <span
      style={{
        padding: "3px 8px",
        borderRadius: 12,
        fontSize: 10,
        fontWeight: 700,
        background: on ? COLORS.green : COLORS.mist,
        color: on ? "#fff" : "#6b7280",
        whiteSpace: "nowrap",
      }}
    >
      {on ? "✓" : "—"} {text}
    </span>
  );
}

function TierBadge({ seconds, distance, category }) {
  if (!category) return null;
  const targets = getTierTargets(STANDARDS_LOOKUP, category, distance);
  const tier = highestTierFor(seconds, targets);
  if (!tier) {
    return (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 12,
          fontSize: 10,
          fontWeight: 700,
          background: COLORS.mist,
          color: "#6b7280",
          whiteSpace: "nowrap",
        }}
      >
        No tier
      </span>
    );
  }
  const dark = tier === "Tungsten" || tier === "Pewter";
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 12,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 0.5,
        background: TIER_COLORS[tier],
        color: dark ? "#fff" : COLORS.ink,
        whiteSpace: "nowrap",
        boxShadow: `0 0 0 1.5px ${TIER_COLORS[tier]}`,
      }}
    >
      🏅 {tier}
    </span>
  );
}
