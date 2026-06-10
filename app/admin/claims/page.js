"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import { styles } from "@/lib/styles";
import {
  assignCategory, evaluateScheme, TIER_COLORS,
} from "@/lib/standards/engine";

const CURRENT_SEASON = new Date().getFullYear();

export default function ClaimsPanel() {
  const router = useRouter();
  const {
    loggedIn, authReady, isAdmin,
    standardsLookup, listAllStandardsLogs, verifyStandardLog,
  } = useStore();

  const [allLogs, setAllLogs] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [schemeFilter, setSchemeFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (authReady && (!loggedIn || !isAdmin)) {
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
  }, [authReady, loggedIn, isAdmin, router]);

  useEffect(() => {
    (async () => {
      if (isAdmin) {
        const { data } = await listAllStandardsLogs();
        setAllLogs(data);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Build a claim per (member, scheme) that meets at least the Standard threshold (5).
  const claims = useMemo(() => {
    // Group logs by profile_id
    const byMember = {};
    for (const log of allLogs) {
      if (!byMember[log.profile_id]) {
        byMember[log.profile_id] = { profile: log.profiles, logs: [] };
      }
      byMember[log.profile_id].logs.push(log);
    }

    const out = [];
    for (const [profileId, { profile, logs }] of Object.entries(byMember)) {
      if (!profile?.gender || !profile?.date_of_birth) continue; // can't categorise
      const category = assignCategory(profile.gender, profile.date_of_birth, CURRENT_SEASON);
      if (!category) continue;

      for (const scheme of ["wreake", "lrrl"]) {
        const result = evaluateScheme({ logs, scheme, lookup: standardsLookup, category });
        const stdTier = result.standard.tier;
        const distTier = result.distinction.tier;
        if (stdTier) {
          out.push({
            id: profileId + "-" + scheme + "-standard",
            profile_id: profileId,
            first_name: profile.first_name,
            last_name: profile.last_name,
            category,
            scheme,
            award_type: distTier ? "Distinction" : "Standard",
            tier: distTier || stdTier,
            qualifying_count: result.distinctDistances,
            // verified means every contributing log is verified
            is_verified: contributingLogs(result).every((l) => l.is_verified_by_admin),
            contributing_log_ids: contributingLogs(result).map((l) => l.id),
          });
        }
      }
    }
    return out;
  }, [allLogs, standardsLookup]);

  if (!authReady) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!loggedIn || !isAdmin) return null;

  const filtered = claims
    .filter((c) => filter === "all" || (filter === "verified") === c.is_verified)
    .filter((c) => schemeFilter === "all" || c.scheme === schemeFilter);

  async function toggleClaim(claim) {
    // Mark every contributing log as the opposite verification state.
    setBusy(true);
    const newState = !claim.is_verified;
    for (const id of claim.contributing_log_ids) {
      await verifyStandardLog(id, newState);
    }
    // Reload
    const { data } = await listAllStandardsLogs();
    setAllLogs(data);
    setBusy(false);
  }

  function exportCsv() {
    const verified = claims.filter((c) => c.is_verified);
    const rows = [
      ["First Name", "Last Name", "Category", "Achieved Scheme", "Achieved Tier", "Award Type"],
      ...verified.map((c) => [
        c.first_name || "",
        c.last_name || "",
        c.category,
        c.scheme === "wreake" ? "Wreake Club" : "LRRL County",
        c.tier,
        c.award_type,
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => '"' + String(cell).replace(/"/g, '""') + '"').join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wreake-standards-claims-" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const verifiedCount = claims.filter((c) => c.is_verified).length;
  const pendingCount = claims.length - verifiedCount;

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 64px" }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/admin" style={{ color: COLORS.teal, fontWeight: 600 }}>Back to Admin</Link>
      </div>
      <p style={styles.kickerDark}>ADMIN - CLAIMS</p>
      <h2 style={styles.h2}>Standards Claims Review</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 24, maxWidth: 720 }}>
        Members who have cleared 5 distinct distances (Standard) or 9 (Distinction).
        Verify each entry after auditing the proof, then export the verified list
        for certificate printing.
      </p>

      {flash ? <div style={{ ...styles.flash, marginBottom: 16 }}>{flash}</div> : null}

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <FilterGroup
          label="Status"
          options={[
            { value: "pending", label: "Pending (" + pendingCount + ")" },
            { value: "verified", label: "Verified (" + verifiedCount + ")" },
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

      <div style={{ display: "grid", gap: 12 }}>
        {filtered.map((c) => (
          <ClaimRow key={c.id} claim={c} onToggle={() => toggleClaim(c)} disabled={busy} />
        ))}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", opacity: 0.6, background: "#fff", borderRadius: 14, border: "1px solid " + COLORS.mist }}>
            No claims match these filters.
          </div>
        ) : null}
      </div>
    </main>
  );
}

// Return the logs (one per cleared distance) that contributed to the claim.
function contributingLogs(result) {
  const logs = [];
  for (const distance of Object.keys(result.tierAtDistance)) {
    const best = result.bestPerDistance[distance];
    if (best?.log) logs.push(best.log);
  }
  return logs;
}

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
              border: "1.5px solid " + (value === o.value ? COLORS.ink : COLORS.mist),
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

function ClaimRow({ claim, onToggle, disabled }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "2px solid " + (claim.is_verified ? COLORS.green : COLORS.mist),
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
          {(claim.first_name || "") + " " + (claim.last_name || "")}
        </strong>
        <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.7 }}>{claim.category}</p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Badge color={claim.scheme === "wreake" ? COLORS.teal : COLORS.sky}>
          {claim.scheme === "wreake" ? "Wreake" : "LRRL"}
        </Badge>
        <Badge color={COLORS.ink}>{claim.award_type}</Badge>
        <Badge color={COLORS.mist} dark>{claim.qualifying_count} distances</Badge>
      </div>

      <button
        onClick={onToggle}
        disabled={disabled}
        style={{
          background: claim.is_verified ? COLORS.green : "transparent",
          color: claim.is_verified ? "#fff" : COLORS.ink,
          border: "1.5px solid " + (claim.is_verified ? COLORS.green : COLORS.ink),
          padding: "8px 14px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
          cursor: disabled ? "wait" : "pointer",
          whiteSpace: "nowrap",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {claim.is_verified ? "Verified" : "Mark verified"}
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
