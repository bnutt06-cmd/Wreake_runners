"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { fmtDate } from "@/lib/data";

export default function NewsPage() {
  const { news } = useStore();
  const [open, setOpen] = useState(null);

  const published = news.filter((n) => n.status === "published");

  return (
    <main style={styles.section}>
      <p style={styles.kickerDark}>THE NOTICEBOARD</p>
      <h2 style={styles.h2}>Club News &amp; Race Reports</h2>
      <div style={{ ...styles.newsGrid, marginTop: 32 }}>
        {published.map((n) => (
          <article key={n.id} style={styles.card} className="wr-card" onClick={() => setOpen(n)}>
            <h3 style={styles.cardTitle}>{n.title}</h3>
            <p style={styles.cardExcerpt}>
              {n.body.slice(0, 140)}{n.body.length > 140 && "…"}
            </p>
            <div style={styles.cardMeta}>
              <span>{fmtDate(n.created_at)}</span>
            </div>
          </article>
        ))}
        {published.length === 0 && <p style={{ opacity: 0.6 }}>No news yet.</p>}
      </div>

      {open && (
        <div style={styles.overlay} onClick={() => setOpen(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setOpen(null)}>✕</button>
            <h2 style={{ ...styles.h2, marginTop: 12 }}>{open.title}</h2>
            <div style={{ ...styles.cardMeta, margin: "8px 0 20px" }}>
              <span>{fmtDate(open.created_at)}</span>
            </div>
            {open.image_url && (
              <img src={open.image_url} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: 20 }} />
            )}
            <p style={{ lineHeight: 1.7, fontSize: 17, whiteSpace: "pre-wrap" }}>{open.body}</p>
          </div>
        </div>
      )}
    </main>
  );
}
