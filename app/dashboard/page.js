"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import {
  COLORS, KIT_SUPPLIER_URL, CLUB_NIGHTS, CLUB_STANDARDS, SEED_RACES, fmtDate,
} from "@/lib/data";

export default function DashboardPage() {
  const router = useRouter();
  const {
    loggedIn, loading, profile, role, canCreateNews, isAdmin,
    news, createStory, approveStory, deleteStory,
  } = useStore();

  const [showStoryForm, setShowStoryForm] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyBody, setStoryBody] = useState("");
  const [storyImage, setStoryImage] = useState("");
  const [flash, setFlash] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !loggedIn) router.replace("/login");
  }, [loading, loggedIn, router]);

  if (loading) return <main style={styles.section}><p>Loading…</p></main>;
  if (!loggedIn) return null;

  const published = news.filter((n) => n.status === "published");
  const pending = news.filter((n) => n.status === "pending");
  const upcomingRaces = SEED_RACES.slice(0, 4);

  async function submitStory() {
    if (!storyTitle.trim() || !storyBody.trim()) return;
    setBusy(true);
    const { ok, status } = await createStory({
      title: storyTitle.trim(),
      body: storyBody.trim(),
      image_url: storyImage.trim() || null,
    });
    setBusy(false);
    if (ok) {
      setStoryTitle("");
      setStoryBody("");
      setStoryImage("");
      setShowStoryForm(false);
      setFlash(status === "published"
        ? "Story published — it's live on the News page."
        : "Story submitted for Admin approval.");
      setTimeout(() => setFlash(""), 5000);
    }
  }

  const sectionCard = {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    border: `1px solid ${COLORS.mist}`,
    marginBottom: 24,
  };
  const sectionHeader = {
    fontFamily: "'Fraunces', serif",
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 16px",
    color: COLORS.ink,
  };

  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>WELCOME BACK</p>
      <h2 style={styles.h2}>
        {profile?.first_name ? `Hi, ${profile.first_name}` : "Member Dashboard"}
      </h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 32 }}>
        Signed in as <strong>{role}</strong>.
        {isAdmin && " You have admin privileges."}
        {role === "Content Admin" && " You can submit news stories for approval."}
      </p>

      {flash && <div style={{ ...styles.flash, marginBottom: 24 }}>{flash}</div>}

      {canCreateNews && (
        <div style={sectionCard}>
          <h3 style={sectionHeader}>News Stories</h3>
          {!showStoryForm ? (
            <button style={styles.cta} onClick={() => setShowStoryForm(true)}>
              + Create News Story
            </button>
          ) : (
            <div>
              <input
                style={{ ...styles.input, width: "100%", marginBottom: 12 }}
                placeholder="Title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
              />
              <textarea
                style={{ ...styles.input, width: "100%", minHeight: 120, marginBottom: 12, resize: "vertical" }}
                placeholder="Body content"
                value={storyBody}
                onChange={(e) => setStoryBody(e.target.value)}
              />
              <input
                style={{ ...styles.input, width: "100%", marginBottom: 12 }}
                placeholder="Image URL (optional)"
                value={storyImage}
                onChange={(e) => setStoryImage(e.target.value)}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={{ ...styles.cta, opacity: busy ? 0.6 : 1 }}
                  onClick={submitStory}
                  disabled={busy}
                >
                  {busy ? "Submitting…" : isAdmin ? "Publish" : "Submit for approval"}
                </button>
                <button style={styles.ghostBtn} onClick={() => setShowStoryForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isAdmin && pending.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${COLORS.mist}` }}>
              <strong style={{ display: "block", marginBottom: 12 }}>
                Awaiting approval ({pending.length})
              </strong>
              <div style={{ display: "grid", gap: 10 }}>
                {pending.map((n) => (
                  <div key={n.id} style={styles.miniPost}>
                    <strong>{n.title}</strong>
                    <p style={{ margin: "6px 0", fontSize: 14, opacity: 0.8 }}>
                      {n.body.slice(0, 120)}{n.body.length > 120 && "…"}
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        style={{ ...styles.cta, padding: "6px 14px", fontSize: 13 }}
                        onClick={() => approveStory(n.id)}
                      >
                        Approve
                      </button>
                      <button
                        style={{ ...styles.ghostBtn, padding: "6px 14px", fontSize: 13 }}
                        onClick={() => { if (confirm("Delete this story?")) deleteStory(n.id); }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={sectionCard}>
        <h3 style={sectionHeader}>Upcoming Races</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {upcomingRaces.map((r) => (
            <div key={r.id} style={{ ...styles.miniPost, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{r.name}</strong>
                <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.7 }}>
                  {r.distance} · {r.location}
                </p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal }}>
                {fmtDate(r.date)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionCard}>
        <h3 style={sectionHeader}>Latest News</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {published.slice(0, 4).map((n) => (
            <div key={n.id} style={styles.miniPost}>
              <strong>{n.title}</strong>
              <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.7 }}>
                {fmtDate(n.created_at)}
              </p>
            </div>
          ))}
          {published.length === 0 && <p style={{ opacity: 0.6, fontSize: 14 }}>No news yet.</p>}
        </div>
      </div>

      <div style={sectionCard}>
        <h3 style={sectionHeader}>Club Nights</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {CLUB_NIGHTS.map((n) => (
            <div key={n.day} style={{ ...styles.miniPost, display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{n.day}</strong>
                <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.7 }}>{n.desc}</p>
              </div>
              <span style={{ fontWeight: 700, color: COLORS.teal }}>{n.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionCard}>
        <h3 style={sectionHeader}>Club Standards</h3>
        <div style={{ display: "grid", gap: 10 }}>
          {CLUB_STANDARDS.map((s) => (
            <div key={s.tier} style={styles.miniPost}>
              <strong>{s.tier}</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

<div style={{ ...sectionCard, background: COLORS.ink, color: "#fff" }}>
        <h3 style={{ ...sectionHeader, color: "#fff" }}>Club Kit</h3>
        <p style={{ opacity: 0.85, marginBottom: 16 }}>
          Order club kit directly from our official supplier.
        </p>
        <button
          onClick={() => window.open(KIT_SUPPLIER_URL, "_blank", "noopener,noreferrer")}
          style={{ display: "inline-block", background: COLORS.cyan, color: COLORS.ink, padding: "11px 24px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}
        >
          Visit Kit Shop
        </button>
      </div>
    </main>
  );
}