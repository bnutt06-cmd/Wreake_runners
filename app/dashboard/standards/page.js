"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import {
  StandardsBanner, TierGrid, TargetMatrix, SubmissionForm,
} from "@/components/standards/StandardsWidgets";
import {
  assignCategory, evaluateScheme, getTierTargets, highestTierFor, TIER_COLORS,
} from "@/lib/standards/engine";

const CURRENT_SEASON = new Date().getFullYear();

export default function StandardsPage() {
  const {
    profile, standardsLookup, myStandardsLogs,
    submitStandard, deleteStandardLog,
  } = useStore();
  const [scheme, setScheme] = useState("wreake");
  const [submitting, setSubmitting] = useState(false);
  const [flash, setFlash] = useState("");

  const memberGender = profile?.gender || null;
  const memberDob = profile?.date_of_birth || null;
  const profileReady = !!memberGender && !!memberDob;

  const category = useMemo(
    () => assignCategory(memberGender, memberDob, CURRENT_SEASON),
    [memberGender, memberDob]
  );

  async function handleSubmit(submission) {
    setSubmitting(true);
    setFlash("");
    const { ok, error } = await submitStandard(submission);
    setSubmitting(false);
    if (ok) {
      setFlash("Performance logged.");
      setTimeout(() => setFlash(""), 3000);
    } else {
      setFlash("Error: " + (error || "could not save"));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this performance? This cannot be undone.")) return;
    await deleteStandardLog(id);
  }

  const wreakeResult = useMemo(
    () => evaluateScheme({ logs: myStandardsLogs, scheme: "wreake", lookup: standardsLookup, category }),
    [myStandardsLogs, standardsLookup, category]
  );
  const lrrlResult = useMemo(
    () => evaluateScheme({ logs: myStandardsLogs, scheme: "lrrl", lookup: standardsLookup, category }),
    [myStandardsLogs, standardsLookup, category]
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
        <span><strong>Category:</strong> {category || "set DOB and gender in profile"}</span>
        <span><strong>Season:</strong> {CURRENT_SEASON}</span>
        <span><strong>Logged:</strong> {myStandardsLogs.length}</span>
        <span><strong>Distinct distances (this scheme):</strong> {active.distinctDistances}</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "2px solid " + COLORS.mist,
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
        lookup={standardsLookup}
        bestPerDistance={active.bestPerDistance}
        tierAtDistance={active.tierAtDistance}
      />

      <SubmissionForm onSubmit={handleSubmit} submitting={submitting} />

      {flash ? (
        <p style={{ marginTop: 12, color: COLORS.teal, fontWeight: 700, fontSize: 13 }}>{flash}</p>
      ) : null}

      {myStandardsLogs.length > 0 ? (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, margin: "0 0 12px" }}>
            Your logged performances ({myStandardsLogs.length})
          </h3>
          <div style={{ display: "grid", gap: 8 }}>
            {myStandardsLogs.map((l) => (
              <div
                key={l.id}
                style={{
                  background: "#fff",
                  border: "1px solid " + COLORS.mist,
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
                  <strong>{l.distance}</strong> - {l.formatted_time} - {l.race_name}
                  <span style={{ opacity: 0.6, marginLeft: 8 }}>
                    {l.race_date} - {l.is_virtual ? "Virtual" : "Official"}
                    {l.is_leicestershire_region ? " - Leics/Rutland" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <TierBadge seconds={l.achieved_time_seconds} distance={l.distance} category={category} lookup={standardsLookup} />
                  <Pill on={!l.is_virtual} text="LRRL eligible" />
                  <Pill on={true} text="Wreake eligible" />
                  {!l.is_verified_by_admin ? (
                    <button
                      onClick={() => handleDelete(l.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#C0392B",
                        fontSize: 12,
                        cursor: "pointer",
                        padding: "2px 6px",
                      }}
                      title="Delete (only allowed before admin verification)"
                    >
                      delete
                    </button>
                  ) : (
                    <span style={{ background: COLORS.green, color: "#fff", padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
        borderBottom: "3px solid " + (active ? COLORS.teal : "transparent"),
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
          border: "2px solid " + (tier ? COLORS.teal : COLORS.mist),
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
          {tier || (count >= threshold ? "Geography pending" : count + "/" + threshold + " distances")}
        </h4>
        <div style={{ height: 6, background: COLORS.mist, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
          <div
            style={{
              height: "100%",
              width: Math.min(100, (count / threshold) * 100) + "%",
              background: tier ? COLORS.green : COLORS.teal,
              transition: "width .4s",
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>
          {count} of {threshold} distinct distances
        </p>
        {scheme === "lrrl" ? (
          <p style={{ margin: "4px 0 0", fontSize: 12, color: geoOk ? COLORS.green : "#C0392B" }}>
            Leics/Rutland geo: {geoOk ? "met (>= " + geoMin + ")" : "needs >= " + geoMin}
          </p>
        ) : null}
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
      {on ? "yes" : "no"} {text}
    </span>
  );
}

function TierBadge({ seconds, distance, category, lookup }) {
  if (!category) return null;
  const targets = getTierTargets(lookup, category, distance);
  const tier = highestTierFor(seconds, targets);
  if (!tier) {
    return (
      <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: COLORS.mist, color: "#6b7280", whiteSpace: "nowrap" }}>
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
        boxShadow: "0 0 0 1.5px " + TIER_COLORS[tier],
      }}
    >
      {tier}
    </span>
  );
}
