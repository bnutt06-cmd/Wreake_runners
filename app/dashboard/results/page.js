"use client";

import Link from "next/link";
import { raceSummaries } from "@/lib/results";
import { COLORS } from "@/lib/data";
import YourResults from "@/components/YourResults";

export default function ResultsIndexPage() {
  const races = raceSummaries();

  return (
    <div>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>
        Race Results
      </h2>
      <p style={{ color: "#6b7280", fontSize: 15, margin: "0 0 24px" }}>
        Full field results from races we've competed in &mdash; filter to Wreake runners,
        search by name, and see how everyone got on.
      </p>

      {/* Personal history first */}
      <YourResults mode="full" />

      {races.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>No results published yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {races.map((r) => (
            <Link
              key={r.id}
              href={"/dashboard/results/" + r.id}
              style={{
                display: "block",
                background: "#fff",
                border: "1px solid " + COLORS.mist,
                borderRadius: 14,
                padding: 20,
                textDecoration: "none",
                color: "inherit",
                transition: "box-shadow .15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.ink }}>{r.name}</div>
                  <div style={{ fontSize: 14, color: "#6b7280", marginTop: 3 }}>
                    {r.dateLabel} &middot; {r.distance}
                  </div>
                </div>
                <span style={{ background: COLORS.mist, color: COLORS.ink, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>
                  {r.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 14, fontSize: 14 }}>
                <span><strong style={{ color: COLORS.teal }}>{r.wreakeCount}</strong> Wreake runners</span>
                <span style={{ color: "#9ca3af" }}>{r.totalFinishers} total finishers</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
