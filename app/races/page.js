"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";

function RaceRow({ r }) {
  const { signups, addSignup } = useStore();
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const list = signups[r.id] || [];

  return (
    <div style={styles.raceRow}>
      <div style={styles.raceDate}>
        <div style={styles.raceDay}>{new Date(r.date).getDate()}</div>
        <div style={styles.raceMonth}>
          {new Date(r.date).toLocaleDateString("en-GB", { month: "short" }).toUpperCase()}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={styles.raceType}>{r.type}</div>
        <h3 style={{ margin: "4px 0 6px", fontSize: 22 }}>{r.name}</h3>
        <p style={{ margin: 0, opacity: 0.75, fontSize: 15 }}>
          {r.distance} · {r.location}
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 15, lineHeight: 1.5 }}>{r.blurb}</p>
        {list.length > 0 && (
          <p style={{ marginTop: 10, fontSize: 13, color: "#2E9E8F", fontWeight: 700 }}>
            {list.length} signed up: {list.join(", ")}
          </p>
        )}
      </div>
      <div style={styles.raceSignup}>
        {done ? (
          <div style={{ color: "#2E9E8F", fontWeight: 700, textAlign: "center" }}>You're in! ✓</div>
        ) : (
          <>
            <input
              style={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              style={styles.cta}
              onClick={() => {
                if (name.trim()) {
                  addSignup(r.id, name.trim());
                  setDone(true);
                }
              }}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function RacesPage() {
  const { races } = useStore();
  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>FIXTURES</p>
      <h2 style={styles.h2}>Races &amp; Events</h2>
      <div style={{ display: "grid", gap: 20, marginTop: 32 }}>
        {races.map((r) => (
          <RaceRow key={r.id} r={r} />
        ))}
      </div>
    </main>
  );
}
