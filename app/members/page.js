"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { TAGS, fmtDate } from "@/lib/data";

export default function MembersPage() {
  const router = useRouter();
  const { loggedIn, loading, isCommittee, news, publishPost, approvePost } = useStore();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState(TAGS[0]);
  const [flash, setFlash] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !loggedIn) router.replace("/login");
  }, [loading, loggedIn, router]);

  if (loading) return <main style={styles.section}><p>Loading…</p></main>;
  if (!loggedIn) return null;

  const pending = news.filter((n) => n.status === "pending");
  const published = news.filter((n) => n.status === "published");

  async function publish() {
    if (!title.trim()) return;
    setBusy(true);
    const ok = await publishPost({
      title: title.trim(),
      excerpt: excerpt.trim() || body.trim().slice(0, 120) + "…",
      body: body.trim() || excerpt.trim(),
      tag,
    });
    setBusy(false);
    if (ok) {
      setTitle(""); setExcerpt(""); setBody(""); setTag(TAGS[0]);
      setFlash(isCommittee
        ? "Submitted — approve it below to make it live."
        : "Submitted for approval. A committee member will review it shortly.");
      setTimeout(() => setFlash(""), 5000);
    }
  }

  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>WELCOME BACK</p>
      <h2 style={styles.h2}>Members Dashboard</h2>
      <p style={{ opacity: 0.7, marginTop: 8 }}>
        You're signed in as a <strong>{isCommittee ? "committee member" : "club member"}</strong>.
        {isCommittee ? " You can publish and approve posts." : " Your posts go to the committee for approval."}
      </p>

      <div style={styles.dashStats}>
        {[
          [published.length, "Published posts"],
          [pending.length, isCommittee ? "Awaiting approval" : "Your pending posts"],
        ].map(([n, l]) => (
          <div key={l} style={styles.dashStat}>
            <div style={styles.statNum}>{n}</div>
            <div style={styles.statLabel}>{l}</div>
          </div>
        ))}
      </div>

      <div style={styles.publishWrap}>
        <div style={styles.publishCard}>
          <h3 style={{ marginTop: 0 }}>Write a news post</h3>
          {flash && <div style={styles.flash}>{flash}</div>}
          <input
            style={{ ...styles.input, width: "100%", marginBottom: 12 }}
            placeholder="Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {TAGS.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                style={{ ...styles.tagPick, ...(tag === t ? styles.tagPickActive : {}) }}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            style={{ ...styles.input, width: "100%", marginBottom: 12 }}
            placeholder="Short summary (optional)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <textarea
            style={{ ...styles.input, width: "100%", minHeight: 120, marginBottom: 16, resize: "vertical" }}
            placeholder="Write your post…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button style={{ ...styles.cta, width: "100%", opacity: busy ? 0.6 : 1 }} onClick={publish} disabled={busy}>
            {busy ? "Submitting…" : "Submit post"}
          </button>
        </div>

        <div style={styles.publishSide}>
          {isCommittee && pending.length > 0 && (
            <>
              <h3 style={{ marginTop: 0 }}>Awaiting approval</h3>
              <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                {pending.map((n) => (
                  <div key={n.id} style={styles.miniPost}>
                    <div style={styles.cardTag}>{n.tag}</div>
                    <strong style={{ display: "block", margin: "6px 0 2px" }}>{n.title}</strong>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{n.author} · {fmtDate(n.date)}</span>
                    <button
                      style={{ ...styles.cta, marginTop: 8, padding: "6px 14px", fontSize: 13, width: "100%" }}
                      onClick={() => approvePost(n.id)}
                    >
                      Approve &amp; publish
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          <h3 style={{ marginTop: 0 }}>Published posts</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {published.map((n) => (
              <div key={n.id} style={styles.miniPost}>
                <div style={styles.cardTag}>{n.tag}</div>
                <strong style={{ display: "block", margin: "6px 0 2px" }}>{n.title}</strong>
                <span style={{ fontSize: 12, opacity: 0.6 }}>{n.author} · {fmtDate(n.date)}</span>
              </div>
            ))}
            {published.length === 0 && <p style={{ opacity: 0.6, fontSize: 14 }}>No published posts yet.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}