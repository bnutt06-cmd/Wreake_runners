"use client";

import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import { PinnedPost, NewsList, NextRacesWidget, CalendarWidget } from "@/components/ClubAreaWidgets";
import YourResults from "@/components/YourResults";

export default function ClubAreaHub() {
  const { news, races, clubEvents, pinnedPost } = useStore();

  // Show published stories only; fall back to whatever's there if the
  // 'status' field isn't set (defensive against schema differences).
  const stories = (news || []).filter((n) => !n.status || n.status === "published");

  // Adapt the DB pinned post into the shape PinnedPost expects.
  const post = pinnedPost
    ? {
        id: pinnedPost.id,
        title: pinnedPost.title,
        body: pinnedPost.body,
        posted_at: pinnedPost.created_at,
        author: pinnedPost.author
          ? ((pinnedPost.author.first_name || "") + " " + (pinnedPost.author.last_name || "")).trim() || "Admin"
          : "Admin",
      }
    : null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.85fr) minmax(0, 1fr)",
        gap: 28,
      }}
      className="club-area-grid"
    >
      <section style={{ minWidth: 0 }}>
        {/* Wreake 45 anniversary callout */}
        <a
          href="/wreake45"
          style={{
            display: "block",
            textDecoration: "none",
            background: "linear-gradient(135deg, " + COLORS.sky + " 0%, " + COLORS.teal + " 55%, " + COLORS.cyan + " 130%)",
            borderRadius: 16,
            padding: "20px 22px",
            marginBottom: 24,
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", flexShrink: 0, boxShadow: "0 3px 12px rgba(0,0,0,.1)" }}>
              <img src="/wreake45-logo.png" alt="Wreake 45" style={{ height: 34, width: "auto", display: "block" }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff", opacity: 0.85 }}>Save the date</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 800, margin: "2px 0", color: COLORS.ink }}>The Wreake 45 Day Out</div>
              <div style={{ fontSize: 14, opacity: 0.95, fontWeight: 600 }}>Sun 30 Aug &middot; Watermead Park &middot; tap for details &rarr;</div>
            </div>
          </div>
        </a>

        {post ? <PinnedPost post={post} /> : null}

        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, margin: "0 0 16px" }}>
          Latest News
        </h3>
        <NewsList stories={stories} />
      </section>

      <aside style={{ minWidth: 0, display: "grid", gap: 20, alignContent: "start" }}>
        <YourResults mode="summary" />
        <NextRacesWidget races={races} />
        <CalendarWidget events={clubEvents} />
      </aside>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.club-area-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
