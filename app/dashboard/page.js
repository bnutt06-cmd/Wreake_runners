"use client";

import { useStore } from "@/lib/store";
import { PinnedPost, NewsList, NextRacesWidget, CalendarWidget } from "@/components/ClubAreaWidgets";
import { PINNED_POST } from "@/lib/mockData";

export default function ClubAreaHub() {
  const { news, races } = useStore();

  // Show published stories only; fall back to whatever's there if the
  // 'status' field isn't set (defensive against schema differences).
  const stories = (news || []).filter((n) => !n.status || n.status === "published");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.85fr) minmax(0, 1fr)",
        gap: 28,
      }}
      className="club-area-grid"
    >
      {/* MAIN FEED — 65% */}
      <section style={{ minWidth: 0 }}>
        <PinnedPost post={PINNED_POST} />

        <h3
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 22,
            fontWeight: 700,
            margin: "0 0 16px",
          }}
        >
          Latest News
        </h3>
        <NewsList stories={stories} />
      </section>

      {/* SIDEBAR — 35% */}
      <aside style={{ minWidth: 0 }}>
        <NextRacesWidget races={races} />
        <CalendarWidget />
      </aside>

      {/* Responsive: stack on narrow screens */}
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
