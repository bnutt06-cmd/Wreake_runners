"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { memberHistory } from "@/lib/results";
import { COLORS } from "@/lib/data";

// mode: "summary" (compact card for Club House landing) | "full" (table)
export default function YourResults({ mode = "full" }) {
  const { profile } = useStore();
  const first = profile?.first_name || "";
  const last = profile?.last_name || "";

  // Need at least a name to match on.
  if (!first && !last) return null;

  const history = memberHistory(first, last);

  if (history.length === 0) {
    if (mode === "summary") {
      return (
        <div style={card}>
          <div style={head}>Your Results</div>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            No results found yet. Your race times will appear here once results are loaded.
          </p>
        </div>
      );
    }
    return null;
  }

  if (mode === "summary") {
    const recent = history.slice(0, 3);
    return (
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div style={head}>Your Results</div>
          <span style={{ fontSize: 13, color: COLORS.teal, fontWeight: 700 }}>
            {history.length} {history.length === 1 ? "finish" : "finishes"}
          </span>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {recent.map((h, i) => (
            <div key={h.raceId + i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.raceName}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{h.dateLabel} &middot; {h.distance}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: COLORS.teal, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {h.row.chipTime || h.row.gunTime}
              </div>
            </div>
          ))}
        </div>
        <Link href="/dashboard/results" style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 700, color: COLORS.teal, textDecoration: "none" }}>
          View all results &rarr;
        </Link>
      </div>
    );
  }

  // Full table mode.
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>
        Your Results History
      </h3>
      <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 14px" }}>
        Your finishes across all loaded races, newest first.
      </p>
      <div style={{ overflowX: "auto", border: "1px solid " + COLORS.mist, borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 520 }}>
          <thead>
            <tr style={{ background: COLORS.paper, textAlign: "left" }}>
              <th style={th}>Race</th>
              <th style={th}>Date</th>
              <th style={th}>Chip</th>
              <th style={th}>Pos</th>
              <th style={th}>Cat</th>
              <th style={th}>Std</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={h.raceId + i} style={{ borderTop: "1px solid " + COLORS.mist }}>
                <td style={{ ...td, fontWeight: 700 }}>
                  <Link href={"/dashboard/results/" + h.raceId} style={{ color: COLORS.ink, textDecoration: "none" }}>
                    {h.raceName}
                  </Link>
                </td>
                <td style={{ ...td, color: "#6b7280" }}>{h.dateLabel}</td>
                <td style={{ ...td, fontWeight: 700, color: COLORS.teal, fontVariantNumeric: "tabular-nums" }}>{h.row.chipTime || h.row.gunTime}</td>
                <td style={td}>{h.row.pos}</td>
                <td style={td}>{h.row.cat}</td>
                <td style={td}>{h.row.standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  border: "1px solid " + COLORS.mist,
  borderRadius: 14,
  padding: 20,
};
const head = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: COLORS.ink,
};
const th = { padding: "11px 12px", fontWeight: 700, color: COLORS.ink, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" };
const td = { padding: "10px 12px", whiteSpace: "nowrap" };
