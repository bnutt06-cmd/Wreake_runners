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
        {/* Wreake 45 anniversary banner - slim strip */}
        <a
          href="/wreake45"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            textDecoration: "none",
            background: "linear-gradient(135deg, " + COLORS.sky + " 0%, " + COLORS.teal + " 60%, " + COLORS.cyan + " 130%)",
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 24,
            color: "#fff",
          }}
        >
          <img src="/wreake45-logo.png" alt="Wreake 45" style={{ height: 40, width: "auto", display: "block", flexShrink: 0 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 800, color: COLORS.ink, lineHeight: 1.2 }}>
              The Wreake 45 Day Out
            </div>
            <div style={{ fontSize: 13.5, opacity: 0.95, fontWeight: 600, marginTop: 2 }}>
              Sun 30 Aug &middot; Watermead Park &middot; save the date
            </div>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, flexShrink: 0, opacity: 0.9 }}>&rarr;</span>
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
