"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { COLORS, fmtDate } from "@/lib/data";
import { countdownLabel, MOCK_CLUB_NIGHTS } from "@/lib/mockData";

// ============================================================
// Pinned post — critical club alert at top of feed
// ============================================================
export function PinnedPost({ post }) {
  if (!post) return null;
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1d3a8c 100%)`,
        color: "#fff",
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: COLORS.cyan,
          color: COLORS.ink,
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 1,
          padding: "4px 10px",
          borderRadius: 20,
        }}
      >
        📌 PINNED
      </div>
      <h3 style={{ margin: "0 0 10px", fontFamily: "'Fraunces', serif", fontSize: 22, paddingRight: 90 }}>
        {post.title}
      </h3>
      <p style={{ margin: 0, lineHeight: 1.55, opacity: 0.9, fontSize: 15 }}>
        {post.body}
      </p>
      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.65 }}>
        {post.author} · {fmtDate(post.posted_at)}
      </p>
    </div>
  );
}

// ============================================================
// News list — card layout with author badge
// ============================================================
export function NewsList({ stories }) {
  if (!stories.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", opacity: 0.6, background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.mist}` }}>
        No news stories yet. Check back soon.
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {stories.map((s) => (
        <NewsCard key={s.id} story={s} />
      ))}
    </div>
  );
}

function NewsCard({ story }) {
  const [open, setOpen] = useState(false);
  const snippet = (story.body || "").slice(0, 180);
  const truncated = (story.body || "").length > 180;
  return (
    <article
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 14,
        padding: 22,
        cursor: "pointer",
        transition: "transform .2s, box-shadow .2s",
      }}
      onClick={() => setOpen(true)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 10px 24px rgba(30,42,110,.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: 18, fontFamily: "'Fraunces', serif", fontWeight: 700 }}>
        {story.title}
      </h3>
      <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>
        {snippet}{truncated && "…"}
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
        <AuthorBadge name={story.author_name || story.author || "Member"} />
        <span style={{ opacity: 0.6 }}>{fmtDate(story.created_at || story.date)}</span>
      </div>
      {open && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(30,42,110,.55)",
            backdropFilter: "blur(4px)", display: "grid", placeItems: "center",
            padding: 20, zIndex: 100,
          }}
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
        >
          <div
            style={{
              background: COLORS.paper, borderRadius: 18, padding: 36, maxWidth: 640,
              width: "100%", position: "relative", maxHeight: "85vh", overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 18, right: 18, background: COLORS.mist,
                border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 16,
                fontWeight: 700, cursor: "pointer",
              }}
            >
              ✕
            </button>
            <h2 style={{ marginTop: 0, fontFamily: "'Fraunces', serif" }}>{story.title}</h2>
            <div style={{ marginBottom: 20, fontSize: 13, opacity: 0.65 }}>
              <AuthorBadge name={story.author_name || story.author || "Member"} /> · {fmtDate(story.created_at || story.date)}
            </div>
            <p style={{ lineHeight: 1.7, fontSize: 16, whiteSpace: "pre-wrap" }}>{story.body}</p>
          </div>
        </div>
      )}
    </article>
  );
}

function AuthorBadge({ name }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
      <span
        style={{
          width: 24, height: 24, borderRadius: "50%", background: COLORS.teal,
          color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700,
        }}
      >
        {initials}
      </span>
      {name}
    </span>
  );
}

// ============================================================
// Next races widget — sidebar, 3 chronological races, countdown
// Click a card → /dashboard/races?focus={id} (focuses that race)
// ============================================================
export function NextRacesWidget({ races }) {
  const router = useRouter();
  const next3 = [...races]
    .filter((r) => new Date(r.race_date) >= new Date(new Date().setHours(0, 0, 0, 0) - 86400000))
    .sort((a, b) => new Date(a.race_date) - new Date(b.race_date))
    .slice(0, 3);

  return (
    <SidebarCard title="Next Races">
      {next3.length === 0 ? (
        <p style={{ margin: 0, opacity: 0.6, fontSize: 14 }}>No upcoming races scheduled.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {next3.map((r) => (
            <button
              key={r.id}
              onClick={() => router.push(`/dashboard/races?focus=${r.id}`)}
              style={{
                textAlign: "left", background: COLORS.paper, border: `1px solid ${COLORS.mist}`,
                borderRadius: 12, padding: 14, cursor: "pointer", width: "100%",
                transition: "border-color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.teal)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.mist)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <strong style={{ fontSize: 14, lineHeight: 1.3 }}>{r.name}</strong>
                <span
                  style={{
                    background: COLORS.teal, color: "#fff", fontSize: 11, fontWeight: 700,
                    padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap",
                  }}
                >
                  {countdownLabel(r.race_date)}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 12, opacity: 0.65 }}>
                {fmtDate(r.race_date)} · {r.location}
              </p>
            </button>
          ))}
        </div>
      )}
    </SidebarCard>
  );
}

// ============================================================
// Club nights mini calendar — month view, highlights event days
// Hover for tooltip, click for modal
// ============================================================
export function CalendarWidget() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() }; // 0-indexed month
  });
  const [hovered, setHovered] = useState(null); // { dateStr, x, y }
  const [selected, setSelected] = useState(null);

  // Index events by YYYY-MM-DD for quick lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    MOCK_CLUB_NIGHTS.forEach((e) => {
      map[e.date] = map[e.date] || [];
      map[e.date].push(e);
    });
    return map;
  }, []);

  const monthName = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-GB", {
    month: "long", year: "numeric",
  });

  // Build calendar grid: 6 rows × 7 cols
  const firstDay = new Date(cursor.year, cursor.month, 1);
  const startDow = (firstDay.getDay() + 6) % 7; // Monday-first (0 = Mon)
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);

  function dateStr(day) {
    return `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function shiftMonth(delta) {
    const m = cursor.month + delta;
    const newYear = cursor.year + Math.floor(m / 12);
    const newMonth = ((m % 12) + 12) % 12;
    setCursor({ year: newYear, month: newMonth });
  }

  return (
    <SidebarCard title="Club Nights Calendar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => shiftMonth(-1)} style={miniBtnStyle}>‹</button>
        <strong style={{ fontSize: 14 }}>{monthName}</strong>
        <button onClick={() => shiftMonth(1)} style={miniBtnStyle}>›</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 11 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", opacity: 0.5, fontWeight: 700, padding: 4 }}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day == null) return <div key={i} />;
          const ds = dateStr(day);
          const events = eventsByDate[ds] || [];
          const hasEvents = events.length > 0;
          const isToday = ds === todayStr;
          return (
            <div
              key={i}
              onClick={() => hasEvents && setSelected({ date: ds, events })}
              onMouseEnter={(e) => hasEvents && setHovered({ ds, events })}
              onMouseLeave={() => setHovered(null)}
              style={{
                aspectRatio: "1",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
                fontWeight: isToday ? 800 : 500,
                borderRadius: 8,
                cursor: hasEvents ? "pointer" : "default",
                background: hasEvents ? COLORS.teal : "transparent",
                color: hasEvents ? "#fff" : isToday ? COLORS.teal : COLORS.ink,
                border: isToday && !hasEvents ? `2px solid ${COLORS.teal}` : "none",
                position: "relative",
                transition: "transform .15s",
              }}
              onMouseDown={(e) => hasEvents && (e.currentTarget.style.transform = "scale(.92)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "none")}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Tooltip on hover */}
      {hovered && hovered.events.length > 0 && (
        <div
          style={{
            marginTop: 12, padding: 10, background: COLORS.ink, color: "#fff",
            borderRadius: 8, fontSize: 12,
          }}
        >
          <strong style={{ display: "block", marginBottom: 4 }}>
            {fmtDate(hovered.ds)}
          </strong>
          {hovered.events.map((e, i) => (
            <div key={i} style={{ opacity: 0.9 }}>
              {e.time}: {e.title}
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: 12, fontSize: 11, opacity: 0.55, textAlign: "center" }}>
        Tap a highlighted day for details
      </p>

      {/* Detail modal */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(30,42,110,.55)",
            backdropFilter: "blur(4px)", display: "grid", placeItems: "center",
            padding: 20, zIndex: 100,
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: COLORS.paper, borderRadius: 18, padding: 32, maxWidth: 420,
              width: "100%", position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: 14, right: 14, background: COLORS.mist,
                border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 14,
                fontWeight: 700, cursor: "pointer",
              }}
            >
              ✕
            </button>
            <h3 style={{ marginTop: 0, fontFamily: "'Fraunces', serif" }}>{fmtDate(selected.date)}</h3>
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {selected.events.map((e, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12, background: "#fff", borderRadius: 10,
                    border: `1px solid ${COLORS.mist}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{e.title}</strong>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12,
                        background: typeBg(e.type), color: "#fff",
                      }}
                    >
                      {e.type}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.7 }}>{e.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SidebarCard>
  );
}

// ============================================================
// Shared sidebar card shell
// ============================================================
function SidebarCard({ title, children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.mist}`,
        borderRadius: 16,
        padding: 22,
        marginBottom: 20,
      }}
    >
      <h3
        style={{
          margin: "0 0 14px",
          fontFamily: "'Fraunces', serif",
          fontSize: 17,
          fontWeight: 700,
          color: COLORS.ink,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

const miniBtnStyle = {
  background: COLORS.mist,
  border: "none",
  width: 28,
  height: 28,
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 700,
  color: COLORS.ink,
};

function typeBg(type) {
  if (type === "Social") return COLORS.green;
  if (type === "Meeting") return COLORS.sky;
  return COLORS.teal;
}
