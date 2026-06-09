"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import { downloadIcs } from "@/lib/mockData";

const TYPE_COLORS = {
  Training: COLORS.teal,
  Social: COLORS.green,
  Meeting: COLORS.sky,
  Other: COLORS.mist,
};

const FILTERS = ["All upcoming", "Training", "Social", "Meeting", "Other"];

function fmtEvent(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function ClubEventsPage() {
  const { clubEvents } = useStore();
  const [filter, setFilter] = useState("All upcoming");

  // Show only events from today onwards.
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const visible = useMemo(() => {
    const upcoming = (clubEvents || []).filter(
      (e) => new Date(e.event_timestamp) >= now
    );
    if (filter === "All upcoming") return upcoming;
    return upcoming.filter((e) => e.event_type === filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubEvents, filter]);

  function gcalLink(e) {
    const start = new Date(e.event_timestamp);
    const end = e.end_timestamp
      ? new Date(e.end_timestamp)
      : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: e.title,
      dates: fmt(start) + "/" + fmt(end),
      details: e.description || "",
      location: e.location || "",
    });
    return "https://www.google.com/calendar/render?" + params.toString();
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>
          Club Events
        </h3>
        <p style={{ opacity: 0.7, margin: 0, fontSize: 15 }}>
          Upcoming training sessions, socials and meetings. Add to your calendar in one click.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "1.5px solid " + (filter === f ? COLORS.ink : COLORS.mist),
              background: filter === f ? COLORS.ink : "#fff",
              color: filter === f ? "#fff" : COLORS.ink,
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", background: "#fff", borderRadius: 16, border: "1px solid " + COLORS.mist }}>
          <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>
            No upcoming events
          </p>
          <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>
            Admins can add events via Admin then Manage Events.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {visible.map((e) => {
            const { date, time } = fmtEvent(e.event_timestamp);
            const typeColor = TYPE_COLORS[e.event_type] || COLORS.mist;
            return (
              <div
                key={e.id}
                style={{
                  background: "#fff",
                  border: "1px solid " + COLORS.mist,
                  borderRadius: 16,
                  padding: 24,
                  display: "grid",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: typeColor, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                      {e.event_type || "Event"}
                    </div>
                    <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, margin: "0 0 6px" }}>
                      {e.title}
                    </h4>
                    {e.location ? (
                      <p style={{ margin: "0 0 8px", fontSize: 13, opacity: 0.75 }}>
                        {e.location}
                      </p>
                    ) : null}
                    {e.description ? (
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{e.description}</p>
                    ) : null}
                  </div>
                  <div style={{ background: COLORS.ink, color: "#fff", padding: "10px 14px", borderRadius: 12, textAlign: "center", minWidth: 140 }}>
                    <div style={{ fontSize: 13, opacity: 0.85 }}>{date}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{time}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid " + COLORS.mist, flexWrap: "wrap" }}>
                  <a
                    href={gcalLink(e)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: COLORS.teal,
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Add to Google Calendar
                  </a>
                  <button
                    onClick={() => downloadIcs({
                      id: e.id,
                      title: e.title,
                      description: e.description || "",
                      event_timestamp: e.event_timestamp,
                      location: e.location || "",
                    })}
                    style={{
                      background: "transparent",
                      color: COLORS.ink,
                      border: "1.5px solid " + COLORS.ink,
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Download .ics
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
