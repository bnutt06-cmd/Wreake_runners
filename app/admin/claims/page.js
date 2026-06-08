"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import { styles } from "@/lib/styles";
import { TIER_COLORS } from "@/lib/standards/engine";

// =============================================================
// Mock claims — replace with a query against member_standards_log
// once Supabase wiring is in place.
//
// In production this is derived: for every profile, run evaluateScheme
// for both schemes; if either has standard.tier or distinction.tier set,
// emit a claim row here.
// =============================================================
const MOCK_CLAIMS = [
  {
    id: "claim-1",
    profile_id: "u-101",
    first_name: "Sarah",
    last_name: "Mitchell",
    category: "FEMALE 40-44",
    scheme: "wreake",
    award_type: "Standard",
    tier: "Gold",
    is_verified: false,
    qualifying_count: 6,
    submitted_at: "2026-06-01T14:20:00Z",
  },
  {
    id: "claim-2",
    profile_id: "u-102",
    first_name: "Dave",
    last_name: "Palmer",
    category: "MALE 50-54",
    scheme: "lrrl",
    award_type: "Standard",
    tier: "Silver",
    is_verified: false,
    qualifying_count: 5,
    submitted_at: "2026-05-28T09:00:00Z",
  },
  {
    id: "claim-3",
    profile_id: "u-103",
    first_name: "Ben",
    last_name: "Nutt",
    category: "MALE 35-39",
    scheme: "wreake",
    award_type: "Distinction",
    tier: "Gold",
    is_verified: true,
    qualifying_count: 9,
    submitted_at: "2026-05-15T16:45:00Z",
  },
  {
    id: "claim-4",
    profile_id: "u-104",
    first_name: "Helen",
    last_name: "Reid",
    category: "FEMALE SENIOR",
    scheme: "wreake",
    award_type: "Standard",
    tier: "Bronze",
    is_verified: false,
    qualifying_count: 5,
    submitted_at: "2026-06-05T11:10:00Z",
  },
];

export default function ClaimsPanel() {
  const router = useRouter();
  const { loggedIn, loading, isAdmin } = useStore();
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [filter, setFilter] = useState("pending"); // pending | verified | all
  const [schemeFilter, setSchemeFilter] = useState("all");

  useEffect(() => {
    if (!loading && (!loggedIn || !isAdmin)) {
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
  }, [loading, loggedIn, isAdmin, router]);

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>;
  if (!loggedIn || !isAdmin) return null;

  const filtered = useMemo(() => {
    return claims
      .filter((c) => {
        if (filter === "pending") return !c.is_verified;
        if (filter === "verified") return c.is_verified;
        return true;
      })
      .filter((c) => schemeFilter === "all" || c.scheme === schemeFilter);
  }, [claims, filter, schemeFilter]);

  function toggleVerified(id) {
    setClaims((cs) =>
      cs.map((c) => (c.id === id ? { ...c, is_verified: !c.is_verified } : c))
    );
  }

  function exportCsv() {
    const rows = [
      ["First Name", "Last Name", "Category", "Achieved Scheme", "Achieved Tier", "Award Type"],
      ...claims
        .filter((c) => c.is_verified)
        .map((c) => [
          c.first_name,
          c.last_name,
          c.category,
          c.scheme === "wreake" ? "Wreake Club" : "LRRL County",
          c.tier,
          c.award_type,
        ]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wreake-standards-claims-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const verifiedCount = claims.filter((c) => c.is_verified).length;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 64px" }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/admin" style={{ color: COLORS.teal, fontWeight: 600 }}>← Back to Admin</Link>
      </div>
      <p style={styles.kickerDark}>ADMIN · CLAIMS</p>
      <h2 style={styles.h2}>Standards Claims Review</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 24, maxWidth: 720 }}>
        Members who've cleared 5 distinct distances (Standard) or 9 (Distinction). Verify
        each entry after auditing the proof, then export the verified list for certificate
        printing.
      </p>

      {/* Filter row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <FilterGroup
          label="Status"
          options={[
            { value: "pending", label: `Pending (${claims.filter((c) => !c.is_verified).length})` },
            { value: "verified", label: `Verified (${verifiedCount})` },
            { value: "all", label: "All" },
          ]}
          value={filter}
          onChange={setFilter}
        />
        <FilterGroup
          label="Scheme"
          options={[
            { value: "all", label: "Both" },
            { value: "wreake", label: "Wreake" },
            { value: "lrrl", label: "LRRL" },
          ]}
          value={schemeFilter}
          onChange={setSchemeFilter}
        />
        <button
          onClick={exportCsv}
          disabled={verifiedCount === 0}
          style={{
            marginLeft: "auto",
            background: COLORS.ink,
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: verifiedCount === 0 ? "not-allowed" : "pointer",
            opacity: verifiedCount === 0 ? 0.5 : 1,
          }}
        >
          Export verified to CSV ({verifiedCount})
        </button>
      </div>

      {/* Claims list */}
      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((c) => (
          <ClaimRow key={c.id} claim={c} onToggle={() => toggleVerified(c.id)} />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              padding: 40, textAlign: "center", opacity: 0.6,
              background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.mist}`,
            }}
          >
            No claims match these filters.
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 14,
          background: COLORS.mist,
          borderRadius: 10,
          fontSize: 12,
          opacity: 0.75,
        }}
      >
        <strong>Mock-data note:</strong> these claims are placeholder. Once
        member_standards_log is populated, this page will recompute claims live for every
        member who hits a milestone.
      </div>
    </main>
  );
}

// =============================================================
function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, letterSpacing: 1, opacity: 0.7, textTransform: "uppercase" }}>
        {label}
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 18,
              fontSize: 12,
              fontWeight: 600,
              border: `1.5px solid ${value === o.value ? COLORS.ink : COLORS.mist}`,
              background: value === o.value ? COLORS.ink : "#fff",
              color: value === o.value ? "#fff" : COLORS.ink,
              cursor: "pointer",
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ClaimRow({ claim, onToggle }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `2px solid ${claim.is_verified ? COLORS.green : COLORS.mist}`,
        borderRadius: 14,
        padding: 18,
        display: "flex",
        gap: 18,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          background: TIER_COLORS[claim.tier] || COLORS.mist,
          color: (claim.tier === "Tungsten" || claim.tier === "Pewter") ? "#fff" : COLORS.ink,
          display: "grid",
          placeItems: "center",
          fontWeight: 800,
          fontSize: 11,
          textAlign: "center",
          letterSpacing: 0.5,
          flexShrink: 0,
        }}
      >
        {claim.tier}
      </div>

      <div style={{ flex: 1, minWidth: 200 }}>
        <strong style={{ fontSize: 16 }}>
          {claim.first_name} {claim.last_name}
        </strong>
        <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.7 }}>
          {claim.category}
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge color={claim.scheme === "wreake" ? COLORS.teal : COLORS.sky}>
          {claim.scheme === "wreake" ? "Wreake" : "LRRL"}
        </Badge>
        <Badge color={COLORS.ink}>{claim.award_type}</Badge>
        <Badge color={COLORS.mist} dark>
          {claim.qualifying_count} distances
        </Badge>
      </div>

      <button
        onClick={onToggle}
        style={{
          background: claim.is_verified ? COLORS.green : "transparent",
          color: claim.is_verified ? "#fff" : COLORS.ink,
          border: `1.5px solid ${claim.is_verified ? COLORS.green : COLORS.ink}`,
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {claim.is_verified ? "✓ Verified" : "Mark verified"}
      </button>
    </div>
  );
}

function Badge({ children, color, dark }) {
  return (
    <span
      style={{
        background: color,
        color: dark ? COLORS.ink : "#fff",
        padding: "3px 10px",
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </span>
  );
}
