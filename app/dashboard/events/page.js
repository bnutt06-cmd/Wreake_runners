"use client";

import { COLORS } from "@/lib/data";
import { MOCK_EVENTS, downloadIcs } from "@/lib/mockData";

const TYPE_COLORS = {
  Training: COLORS.teal,
  Social: COLORS.green,
  Meeting: COLORS.sky,
};

function fmtEvent(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function ClubEventsPage() {
  const sorted = [...MOCK_EVENTS].sort(
    (a, b) => new Date(a.event_timestamp) - new Date(b.event_timestamp)
  );

  function gcalLink(e) {
    const start = new Date(e.event_timestamp);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: e.description || "",
      location: e.location || "",
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3
          style={{
            fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px",
          }}
        >
          Club Events
        </h3>
        <p style={{ opacity: 0.7, margin: 0, fontSize: 15 }}>
          Socials, committee meetings, and coaching clinics. Add any event to your calendar.
        </p>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {sorted.map((e) => {
          const { date, time } = fmtEvent(e.event_timestamp);
          return (
            <div
              key={e.id}
              style={{
                background: "#fff",
                border: `1px solid ${COLORS.mist}`,
                borderRadius: 16,
                padding: 24,
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  background: TYPE_COLORS[e.event_type],
                  color: "#fff",
                  padding: 12,
                  borderRadius: 12,
                  textAlign: "center",
                  minWidth: 80,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1, fontFamily: "'Fraunces', serif" }}>
                  {new Date(e.event_timestamp).getDate()}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2, letterSpacing: 1 }}>
                  {new Date(e.event_timestamp)
                    .toLocaleDateString("en-GB", { month: "short" })
                    .toUpperCase()}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <div
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: TYPE_COLORS[e.event_type],
                    marginBottom: 4,
                  }}
                >
                  {e.event_type}
                </div>
                <h4
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 19,
                    fontWeight: 700,
                    margin: "0 0 4px",
                  }}
                >
                  {e.title}
                </h4>
                <p style={{ margin: "0 0 4px", fontSize: 13, opacity: 0.75 }}>
                  {date} · {time}
                  {e.location && ` · ${e.location}`}
                </p>
                {e.description && (
                  <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55 }}>
                    {e.description}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                <a
                  href={gcalLink(e)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: COLORS.ink,
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  + Google Calendar
                </a>
                <button
                  onClick={() => downloadIcs(e)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "transparent",
                    color: COLORS.ink,
                    border: `1.5px solid ${COLORS.ink}`,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Download .ics
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
