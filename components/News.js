"use client";

import { useState } from "react";
import { styles } from "@/lib/styles";
import { fmtDate } from "@/lib/data";

export function NewsCard({ n, onClick }) {
  return (
    <article style={styles.card} onClick={onClick} className="wr-card">
      <div style={styles.cardTag}>{n.tag}</div>
      <h3 style={styles.cardTitle}>{n.title}</h3>
      <p style={styles.cardExcerpt}>{n.excerpt}</p>
      <div style={styles.cardMeta}>
        <span>{n.author}</span>
        <span>{fmtDate(n.date)}</span>
      </div>
    </article>
  );
}

export function ArticleModal({ article, onClose }) {
  if (!article) return null;
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
        <div style={styles.cardTag}>{article.tag}</div>
        <h2 style={{ ...styles.h2, marginTop: 12 }}>{article.title}</h2>
        <div style={{ ...styles.cardMeta, margin: "8px 0 20px" }}>
          <span>{article.author}</span>
          <span>{fmtDate(article.date)}</span>
        </div>
        <p style={{ lineHeight: 1.7, color: styles.h2.color, fontSize: 17 }}>{article.body}</p>
      </div>
    </div>
  );
}

// Small helper so news pages can manage the open-article modal state.
export function useArticleModal() {
  const [open, setOpen] = useState(null);
  return { open, setOpen };
}
