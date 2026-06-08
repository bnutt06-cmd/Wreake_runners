"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { TAGS, fmtDate } from "@/lib/data";

export default function MembersPage() {
  const router = useRouter();
  const { loggedIn, news, races, signups, publishPost } = useStore();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState(TAGS[0]);
  const [flash, setFlash] = useState("");

  // Guard the route — bounce to login if not authenticated.
  useEffect(() => {
    if (!loggedIn) router.replace("/login");
  }, [loggedIn, router]);

  if (!loggedIn) return null;

  const totalSignups = Object.values(signups).reduce((a, b) => a + b.length, 0);

  function publish() {
    if (!title.trim()) return;
    publishPost({
      id: Date.now(),
      title: title.trim(),
      excerpt: excerpt.trim() || body.trim().slice(0, 120) + "…",
      body: body.trim() || excerpt.trim(),
      author: "You (member)",
      date: new Date().toISOString().slice(0, 10),
      tag,
    });
    setTitle(""); setExcerpt(""); setBody(""); setTag(TAGS[0]);
    setFlash("Published — it's now live on the News page.");
    setTimeout(() => setFlash(""), 4000);
  }

  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>WELCOME BACK</p>
      <h2 style={styles.h2}>Members Dashboard</h2>

      <div style={styles.dashStats}>
        {[
          [news.length, "News posts"],
          [races.length, "Upcoming races"],
          [totalSignups, "Race sign-ups"],
        ].map(([n, l]) => (
          <div key={l} style={styles.dashStat}>
            <div style={styles.statNum}>{n}</div>
            <div style={styles.statLabel}>{l}</div>
          </div>
        ))}
      </div>

      <div style={styles.publishWrap}>
        <div style={styles.publishCard}>
          <h3 style={{ marginTop: 0 }}>Publish a news post</h3>
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
          <button style={{ ...styles.cta, width: "100%" }} onClick={publish}>
            Publish to website
          </button>
        </div>

        <div style={styles.publishSide}>
          <h3 style={{ marginTop: 0 }}>Published posts</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {news.map((n) => (
              <div key={n.id} style={styles.miniPost}>
                <div style={styles.cardTag}>{n.tag}</div>
                <strong style={{ display: "block", margin: "6px 0 2px" }}>{n.title}</strong>
                <span style={{ fontSize: 12, opacity: 0.6 }}>
                  {n.author} · {fmtDate(n.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
