"use client";

import { useStore } from "@/lib/store";
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
