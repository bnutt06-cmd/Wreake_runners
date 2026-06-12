"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRace } from "@/lib/results";
import { COLORS } from "@/lib/data";

const WREAKE = "wreake runners";

export default function RaceResultsPage() {
  const params = useParams();
  const race = getRace(params.id);

  const [wreakeOnly, setWreakeOnly] = useState(true);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    if (!race) return [];
    let r = race.results;
    if (wreakeOnly) r = r.filter((x) => x.club.toLowerCase() === WREAKE);
    const q = query.trim().toLowerCase();
    if (q) r = r.filter((x) => x.name.toLowerCase().includes(q) || x.club.toLowerCase().includes(q));
    return r;
  }, [race, wreakeOnly, query]);

  if (!race) {
    return (
      <div>
        <Link href="/dashboard/results" style={{ color: COLORS.teal, fontWeight: 600, textDecoration: "none" }}>&larr; Back to results</Link>
        <p style={{ marginTop: 20 }}>Race not found.</p>
      </div>
    );
  }

  const wreakeCount = race.results.filter((x) => x.club.toLowerCase() === WREAKE).length;

  return (
    <div>
      <Link href="/dashboard/results" style={{ color: COLORS.teal, fontWeight: 600, textDecoration: "none", fontSize: 14 }}>
        &larr; Back to results
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, margin: "12px 0 4px" }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, margin: 0 }}>{race.name}</h2>
        <span style={{ background: COLORS.mist, color: COLORS.ink, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{race.status}</span>
      </div>
      <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 20px" }}>
        {race.dateLabel} &middot; {race.distance} &middot; {race.totalFinishers} finishers
      </p>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
        <div style={{ display: "inline-flex", background: COLORS.mist, borderRadius: 999, padding: 3 }}>
          <button
            onClick={() => setWreakeOnly(true)}
            style={pillBtn(wreakeOnly)}
          >
            Wreake only ({wreakeCount})
          </button>
          <button
            onClick={() => setWreakeOnly(false)}
            style={pillBtn(!wreakeOnly)}
          >
            Full field ({race.totalFinishers})
          </button>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or club..."
          style={{ flex: "1 1 200px", minWidth: 160, padding: "10px 13px", border: "1px solid " + COLORS.mist, borderRadius: 9, fontSize: 14, fontFamily: "Archivo, sans-serif" }}
        />
      </div>

      <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 10px" }}>
        Showing {rows.length} {rows.length === 1 ? "runner" : "runners"}
      </p>

      {/* Results table */}
      <div style={{ overflowX: "auto", border: "1px solid " + COLORS.mist, borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
          <thead>
            <tr style={{ background: COLORS.paper, textAlign: "left" }}>
              <th style={th}>Pos</th>
              <th style={th}>Name</th>
              <th style={th}>Club</th>
              <th style={th}>Cat</th>
              <th style={th}>Chip</th>
              <th style={th}>Std</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isWreake = r.club.toLowerCase() === WREAKE;
              return (
                <tr key={r.pos + "-" + i} style={{ borderTop: "1px solid " + COLORS.mist, background: isWreake && !wreakeOnly ? "#eef9fb" : "transparent" }}>
                  <td style={td}>{r.pos}</td>
                  <td style={{ ...td, fontWeight: isWreake ? 700 : 400 }}>{r.name}</td>
                  <td style={{ ...td, color: isWreake ? COLORS.teal : "#6b7280", fontWeight: isWreake ? 600 : 400 }}>{r.club}</td>
                  <td style={td}>{r.cat}</td>
                  <td style={{ ...td, fontVariantNumeric: "tabular-nums" }}>{r.chipTime}</td>
                  <td style={td}>{r.standard}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9ca3af", padding: "30px 0" }}>No runners match your search.</p>
      ) : null}
    </div>
  );
}

function pillBtn(active) {
  return {
    border: "none",
    background: active ? "#fff" : "transparent",
    color: active ? COLORS.ink : "#6b7280",
    fontWeight: 700,
    fontSize: 13,
    padding: "8px 14px",
    borderRadius: 999,
    cursor: "pointer",
    boxShadow: active ? "0 1px 4px rgba(0,0,0,.12)" : "none",
    whiteSpace: "nowrap",
  };
}

const th = { padding: "11px 12px", fontWeight: 700, color: COLORS.ink, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" };
const td = { padding: "10px 12px", whiteSpace: "nowrap" };
